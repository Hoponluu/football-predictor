-- =============================================
-- SECURITY FIX: Row Level Security (RLS) Policies
-- FIFA World Cup 2026 Prediction App
-- =============================================
--
-- CÁCH DÙNG:
-- 1. Vào Supabase Dashboard > SQL Editor
-- 2. Copy toàn bộ file này và chạy
-- 3. Kiểm tra kết quả ở cuối
--
-- LƯU Ý QUAN TRỌNG:
-- - App hiện tại dùng anon key trực tiếp từ frontend
-- - RLS sẽ giới hạn những gì anon role có thể làm
-- - Admin operations (nhập kết quả, quản lý trận đấu)
--   cần chuyển sang dùng service_role key hoặc Edge Functions
-- =============================================

-- =============================================
-- BƯỚC 1: BẬT RLS TRÊN TẤT CẢ CÁC BẢNG
-- =============================================

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_rules ENABLE ROW LEVEL SECURITY;

-- =============================================
-- BƯỚC 2: XÓA POLICIES CŨ (NẾU CÓ)
-- =============================================

-- Drop ALL existing policies on each table (old names + new names)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename IN ('matches', 'predictions', 'players', 'groups', 'scoring_rules')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- =============================================
-- BƯỚC 3: POLICIES CHO BẢNG "matches"
-- Ai cũng đọc được, KHÔNG AI sửa/xóa được từ frontend
-- (Admin dùng service_role key hoặc SQL Editor)
-- =============================================

-- Tất cả user đều đọc được lịch thi đấu
CREATE POLICY "matches_select_all" ON matches
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- KHÔNG cho phép INSERT/UPDATE/DELETE từ anon role
-- Admin sẽ dùng service_role key hoặc Supabase Dashboard

-- =============================================
-- BƯỚC 4: POLICIES CHO BẢNG "predictions"
-- Đây là bảng QUAN TRỌNG NHẤT cần bảo vệ
-- =============================================

-- 4a. User chỉ đọc được dự đoán của CHÍNH MÌNH
-- (trừ khi trận đã kết thúc thì ai cũng xem được)
CREATE POLICY "predictions_select_own_or_finished" ON predictions
  FOR SELECT
  TO anon, authenticated
  USING (
    -- Luôn cho xem nếu trận đã kết thúc (công khai kết quả)
    EXISTS (
      SELECT 1 FROM matches m
      WHERE m.id = predictions.match_id
      AND m.status = 'finished'
    )
    -- Hoặc cho xem dự đoán của chính mình (via RPC - xem bên dưới)
    OR true  -- Tạm thời cho đọc tất cả vì chưa có Supabase Auth
  );

-- 4b. Chỉ cho phép tạo dự đoán khi trận đang OPEN
CREATE POLICY "predictions_insert_open_only" ON predictions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches m
      WHERE m.id = match_id
      AND m.status = 'open'
    )
  );

-- 4c. Chỉ cho phép SỬA dự đoán khi trận đang OPEN
CREATE POLICY "predictions_update_open_only" ON predictions
  FOR UPDATE
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches m
      WHERE m.id = predictions.match_id
      AND m.status = 'open'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches m
      WHERE m.id = match_id
      AND m.status = 'open'
    )
  );

-- 4d. KHÔNG cho xóa dự đoán
CREATE POLICY "predictions_no_delete" ON predictions
  FOR DELETE
  TO anon, authenticated
  USING (false);

-- =============================================
-- BƯỚC 5: POLICIES CHO BẢNG "players"
-- =============================================

-- Đọc thông tin player trong cùng group (cho leaderboard)
CREATE POLICY "players_select_all" ON players
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Cho phép đăng ký player mới
CREATE POLICY "players_insert_register" ON players
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Cho phép update player (favorite team, etc.)
-- TODO: Khi có Supabase Auth, giới hạn chỉ update chính mình
CREATE POLICY "players_update_self" ON players
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- KHÔNG cho xóa player
CREATE POLICY "players_no_delete" ON players
  FOR DELETE
  TO anon, authenticated
  USING (false);

-- =============================================
-- BƯỚC 6: POLICIES CHO BẢNG "groups"
-- =============================================

-- Đọc group info
CREATE POLICY "groups_select_all" ON groups
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Cho phép tạo group mới
CREATE POLICY "groups_insert_create" ON groups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- KHÔNG cho update/delete group từ frontend
-- Admin dùng Dashboard hoặc service_role key

-- =============================================
-- BƯỚC 7: POLICIES CHO BẢNG "scoring_rules"
-- Chỉ đọc, không ai sửa được từ frontend
-- =============================================

CREATE POLICY "scoring_rules_select_all" ON scoring_rules
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- KHÔNG cho phép INSERT/UPDATE/DELETE từ anon role

-- =============================================
-- BƯỚC 8: DATABASE TRIGGER - CHỐNG GIAN LẬN DỰ ĐOÁN
-- Backup protection ở tầng database
-- =============================================

-- Trigger: Ngăn sửa dự đoán sau khi trận đấu không còn open
CREATE OR REPLACE FUNCTION check_prediction_match_open()
RETURNS TRIGGER AS $$
DECLARE
  v_match_status TEXT;
BEGIN
  SELECT status INTO v_match_status
  FROM matches
  WHERE id = NEW.match_id;

  IF v_match_status IS NULL THEN
    RAISE EXCEPTION 'Match not found: %', NEW.match_id;
  END IF;

  IF v_match_status != 'open' THEN
    RAISE EXCEPTION 'Cannot modify prediction: match status is "%" (must be "open")', v_match_status;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Áp dụng trigger cho INSERT và UPDATE
DROP TRIGGER IF EXISTS trg_prediction_check_open ON predictions;
CREATE TRIGGER trg_prediction_check_open
  BEFORE INSERT OR UPDATE ON predictions
  FOR EACH ROW
  EXECUTE FUNCTION check_prediction_match_open();

-- =============================================
-- BƯỚC 9: TRIGGER - NGĂN THAY ĐỔI ĐIỂM TỪ CLIENT
-- Chỉ cho phép thay đổi home_score, away_score, minute
-- Không cho sửa total_points, points_rank, etc.
-- =============================================

CREATE OR REPLACE FUNCTION protect_prediction_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Nếu là UPDATE, giữ nguyên các cột điểm (không cho client sửa)
  IF TG_OP = 'UPDATE' THEN
    NEW.total_points := OLD.total_points;
    NEW.points_rank := OLD.points_rank;
    NEW.points_exact_score := OLD.points_exact_score;
    NEW.points_minute := OLD.points_minute;
  END IF;

  -- Nếu là INSERT, force điểm = 0
  IF TG_OP = 'INSERT' THEN
    NEW.total_points := 0;
    NEW.points_rank := 0;
    NEW.points_exact_score := 0;
    NEW.points_minute := 0;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_prediction_points ON predictions;
CREATE TRIGGER trg_protect_prediction_points
  BEFORE INSERT OR UPDATE ON predictions
  FOR EACH ROW
  EXECUTE FUNCTION protect_prediction_points();

-- =============================================
-- BƯỚC 10: TRIGGER - NGĂN SỬA KẾT QUẢ TRẬN ĐẤU TỪ CLIENT
-- Không cần vì RLS đã block rồi, nhưng thêm cho chắc
-- =============================================

CREATE OR REPLACE FUNCTION protect_match_results()
RETURNS TRIGGER AS $$
BEGIN
  -- Nếu trận đã finished, không cho sửa lại kết quả
  IF OLD.status = 'finished' AND NEW.status = 'finished' THEN
    -- Giữ nguyên kết quả cũ
    NEW.home_score := OLD.home_score;
    NEW.away_score := OLD.away_score;
    NEW.minute := OLD.minute;
    NEW.home_penalty := OLD.home_penalty;
    NEW.away_penalty := OLD.away_penalty;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_match_results ON matches;
CREATE TRIGGER trg_protect_match_results
  BEFORE UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION protect_match_results();

-- =============================================
-- VERIFY: Kiểm tra RLS đã bật
-- =============================================

SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('matches', 'predictions', 'players', 'groups', 'scoring_rules')
ORDER BY tablename;

-- Kiểm tra policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Kiểm tra triggers
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
