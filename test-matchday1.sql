-- =============================================
-- TEST MATCHDAY 1 — RÀ SOÁT LOGIC TÍNH ĐIỂM
-- =============================================
-- 24 trận | 5 người chơi (WC2026-DEMO) | 120 dự đoán
--
-- NGƯỜI CHƠI:
--   Admin (admin@test.com)   → vai "An" trong test
--   Lan   (lan@test.com)     → vai "Bình" trong test
--   Na Bito (nabito@test.com) → vai "Cường" trong test
--   Tuệ   (tue@test.com)    → vai "Dũng" trong test
--   Vy    (vy@test.com)     → vai "Em" trong test
--
-- CÁCH DÙNG:
--   Bước 1: Chạy PHẦN 1 + PHẦN 2 (reset + dự đoán)
--   Bước 2: Chạy PHẦN 3 (nhập kết quả)
--   Bước 3: Vào Admin → bấm "Tính lại toàn bộ điểm"
--   Bước 4: Chạy PHẦN 4B (query kiểm tra) → check ✅/❌
--   Bước 5: Chạy PHẦN 5 khi test xong (dọn dẹp)
--
-- QUY TẮC TÍNH ĐIỂM (default):
--   Rank 1: 5đ | Rank 2: 4đ | Rank 3: 3đ | Rank khác: 2đ
--   Exact score: +5đ | Closest minute: +3đ
--
-- XẾP HẠNG (multi-level sort):
--   1. Exact score (đúng tỉ số > sai)
--   2. Goal difference accuracy (|pred_diff - actual_diff|, thấp hơn = tốt)
--   3. Total score difference (|pred_home - actual_home| + |pred_away - actual_away|)
--   4. Minute closeness (|pred_minute - actual_minute|)
--
-- EDGE CASES ĐƯỢC TEST:
--   ✓ Exact score + exact minute (M1)
--   ✓ Nhiều người đúng tỉ số, tiebreak bằng minute (M2, M5)
--   ✓ Không ai đúng tỉ số, 3-way tie broken by minute (M3)
--   ✓ Minute bonus cho người không phải rank 1 (M4, M7, M11)
--   ✓ Rank 5 có nhiều điểm hơn rank 3-4 nhờ minute (M5)
--   ✓ Trận hòa 0-0 (M2)
--   ✓ Trận upset (M4, M12)
--   ✓ Blowout score 5-0 (M9)
--   ✓ Bàn thắng phút cuối 90+ (M10)
--   ✓ Tied hoàn toàn (M5: Lan & Na Bito cùng goalDiff, totalDiff, minuteDiff)
-- =============================================


-- =============================================
-- PHẦN 1: RESET & THIẾT LẬP
-- =============================================

-- Xóa toàn bộ predictions hiện có (của 5 players trong group WC2026-DEMO)
DELETE FROM predictions WHERE player_id IN (
    SELECT id FROM players WHERE group_id = (
        SELECT id FROM groups WHERE code = 'WC2026-DEMO'
    )
);

-- Reset điểm của tất cả players về 0
UPDATE players SET total_points = 0, exact_score_count = 0, top1_count = 0
WHERE group_id = (SELECT id FROM groups WHERE code = 'WC2026-DEMO');

-- Reset 2 trận đã finished về trạng thái open
UPDATE matches SET
    home_score = NULL, away_score = NULL, minute = NULL,
    status = 'open', points_calculated = false
WHERE home_team = 'Mexico' AND away_team = 'South Africa';

UPDATE matches SET
    home_score = NULL, away_score = NULL, minute = NULL,
    status = 'open', points_calculated = false
WHERE home_team = 'South Korea' AND away_team = 'Czech Republic';

-- Mở dự đoán cho toàn bộ Matchday 1 còn lại (22 trận not-open)
UPDATE matches SET status = 'open'
WHERE match_date >= '2026-06-12 00:00:00+07'
  AND match_date <= '2026-06-18 10:00:00+07'
  AND status = 'not-open';


-- =============================================
-- PHẦN 2: DỰ ĐOÁN (120 predictions)
-- =============================================

DO $$
DECLARE
    pid_admin UUID;  -- vai "An"
    pid_lan UUID;    -- vai "Bình"
    pid_nabito UUID; -- vai "Cường"
    pid_tue UUID;    -- vai "Dũng"
    pid_vy UUID;     -- vai "Em"
    mid UUID;
BEGIN
    SELECT id INTO pid_admin FROM players WHERE email = 'admin@test.com';
    SELECT id INTO pid_lan FROM players WHERE email = 'lan@test.com';
    SELECT id INTO pid_nabito FROM players WHERE email = 'nabito@test.com';
    SELECT id INTO pid_tue FROM players WHERE email = 'tue@test.com';
    SELECT id INTO pid_vy FROM players WHERE email = 'vy@test.com';

    -- -----------------------------------------------
    -- M1: Mexico vs South Africa | KQ: 2-1 (78')
    -- Test: 2 exact scores, tiebreak by minute
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='Mexico' AND away_team='South Africa';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 2, 1, 78),   -- exact + exact minute
        (pid_lan,    mid, 2, 1, 60),   -- exact, farther minute
        (pid_nabito, mid, 1, 0, 85),   -- same goal diff, wrong score
        (pid_tue,    mid, 3, 2, 90),   -- same goal diff, wrong score
        (pid_vy,     mid, 0, 0, 45);   -- wrong result type (draw)

    -- -----------------------------------------------
    -- M2: South Korea vs Czech Republic | KQ: 0-0 (90')
    -- Test: draw, 2 exact scores, goalless match
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='South Korea' AND away_team='Czech Republic';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 1, 1, 55),   -- draw but wrong score
        (pid_lan,    mid, 0, 0, 90),   -- exact + exact minute
        (pid_nabito, mid, 2, 2, 70),   -- draw but wrong score
        (pid_tue,    mid, 0, 0, 85),   -- exact, close minute
        (pid_vy,     mid, 1, 0, 60);   -- wrong result type

    -- -----------------------------------------------
    -- M3: Canada vs Bosnia & Herzegovina | KQ: 3-0 (88')
    -- Test: no exact score, 3-way tie broken by minute
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='Canada' AND away_team='Bosnia & Herzegovina';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 2, 0, 90),   -- goalDiff=1, totalDiff=1, minDiff=2
        (pid_lan,    mid, 1, 0, 75),   -- goalDiff=2, totalDiff=3
        (pid_nabito, mid, 2, 1, 85),   -- goalDiff=2, totalDiff=2
        (pid_tue,    mid, 3, 1, 60),   -- goalDiff=1, totalDiff=1, minDiff=28
        (pid_vy,     mid, 4, 0, 80);   -- goalDiff=1, totalDiff=1, minDiff=8

    -- -----------------------------------------------
    -- M4: United States vs Paraguay | KQ: 1-2 (65')
    -- Test: upset, minute bonus goes to non-rank-1 (Na Bito)
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='United States' AND away_team='Paraguay';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 2, 1, 70),   -- predicted wrong winner!
        (pid_lan,    mid, 1, 2, 30),   -- exact score, far minute
        (pid_nabito, mid, 0, 1, 65),   -- goalDiff=0, EXACT minute!
        (pid_tue,    mid, 1, 3, 55),   -- goalDiff=1
        (pid_vy,     mid, 0, 2, 80);   -- goalDiff=1

    -- -----------------------------------------------
    -- M5: Australia vs Turkey | KQ: 1-1 (45')
    -- Test: multiple draws, rank 5 scores more than rank 3-4
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='Australia' AND away_team='Turkey';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 1, 1, 45),   -- exact + exact minute
        (pid_lan,    mid, 2, 2, 50),   -- draw, totalDiff=2, minDiff=5
        (pid_nabito, mid, 0, 0, 40),   -- draw, totalDiff=2, minDiff=5
        (pid_tue,    mid, 1, 1, 30),   -- exact, far minute
        (pid_vy,     mid, 3, 3, 45);   -- draw, totalDiff=4, EXACT minute!

    -- -----------------------------------------------
    -- M6: Qatar vs Switzerland | KQ: 0-3 (72')
    -- Test: big loss, nobody close
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='Qatar' AND away_team='Switzerland';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 1, 0, 30),   -- wrong direction!
        (pid_lan,    mid, 0, 1, 50),   -- goalDiff=2
        (pid_nabito, mid, 1, 2, 60),   -- goalDiff=2
        (pid_tue,    mid, 0, 2, 70),   -- goalDiff=1, closest minute
        (pid_vy,     mid, 2, 2, 45);   -- goalDiff=3

    -- -----------------------------------------------
    -- M7: Brasil vs Morocco | KQ: 2-2 (90')
    -- Test: draw, minute bonus to rank 5
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='Brasil' AND away_team='Morocco';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 3, 1, 85),   -- goalDiff=2, minDiff=5
        (pid_lan,    mid, 1, 2, 70),   -- goalDiff=1, totalDiff=1, minDiff=20
        (pid_nabito, mid, 1, 1, 65),   -- goalDiff=0 (best!)
        (pid_tue,    mid, 3, 2, 80),   -- goalDiff=1, totalDiff=1, minDiff=10
        (pid_vy,     mid, 2, 1, 75);   -- goalDiff=1, totalDiff=1, minDiff=15

    -- -----------------------------------------------
    -- M8: Haiti vs Scotland | KQ: 0-1 (33')
    -- Test: early goal, minute bonus far from typical
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='Haiti' AND away_team='Scotland';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 0, 2, 60),   -- goalDiff=1, totalDiff=1
        (pid_lan,    mid, 1, 0, 45),   -- goalDiff=2
        (pid_nabito, mid, 0, 0, 35),   -- goalDiff=1, totalDiff=1, minDiff=2
        (pid_tue,    mid, 1, 3, 70),   -- goalDiff=1, totalDiff=3
        (pid_vy,     mid, 0, 1, 40);   -- EXACT score

    -- -----------------------------------------------
    -- M9: Germany vs Curaçao | KQ: 5-0 (82')
    -- Test: blowout, exact score for Tuệ
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='Germany' AND away_team='Curaçao';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 4, 0, 75),   -- goalDiff=1, totalDiff=1
        (pid_lan,    mid, 2, 1, 60),   -- goalDiff=4
        (pid_nabito, mid, 1, 1, 55),   -- goalDiff=5
        (pid_tue,    mid, 5, 0, 82),   -- EXACT + EXACT minute!
        (pid_vy,     mid, 3, 0, 70);   -- goalDiff=2

    -- -----------------------------------------------
    -- M10: Netherlands vs Japan | KQ: 2-1 (91')
    -- Test: last-minute goal, exact for Vy
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='Netherlands' AND away_team='Japan';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 2, 0, 65),   -- goalDiff=1, totalDiff=1
        (pid_lan,    mid, 1, 2, 80),   -- goalDiff=2
        (pid_nabito, mid, 1, 1, 50),   -- goalDiff=1, totalDiff=1
        (pid_tue,    mid, 3, 1, 75),   -- goalDiff=1, totalDiff=1
        (pid_vy,     mid, 2, 1, 88);   -- EXACT, minDiff=3

    -- -----------------------------------------------
    -- M11: Ivory Coast vs Ecuador | KQ: 1-0 (56')
    -- Test: minute bonus to rank 5 (Lan)
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='Ivory Coast' AND away_team='Ecuador';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 1, 1, 45),   -- goalDiff=1
        (pid_lan,    mid, 0, 1, 55),   -- goalDiff=2, minDiff=1 (closest!)
        (pid_nabito, mid, 0, 0, 40),   -- goalDiff=1
        (pid_tue,    mid, 2, 1, 65),   -- goalDiff=0
        (pid_vy,     mid, 1, 0, 50);   -- EXACT

    -- -----------------------------------------------
    -- M12: Sweden vs Tunisia | KQ: 1-2 (77')
    -- Test: upset, exact for Lan
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='Sweden' AND away_team='Tunisia';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 2, 0, 60),   -- goalDiff=3
        (pid_lan,    mid, 1, 2, 77),   -- EXACT + EXACT minute!
        (pid_nabito, mid, 1, 1, 55),   -- goalDiff=1
        (pid_tue,    mid, 2, 3, 85),   -- goalDiff=0, totalDiff=2
        (pid_vy,     mid, 0, 1, 70);   -- goalDiff=0, totalDiff=2

    -- -----------------------------------------------
    -- M13: Spain vs Cape Verde | KQ: 4-0 (80')
    -- Test: dominant win, tiebreak at top by minute
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='Spain' AND away_team='Cape Verde';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 3, 0, 70),   -- goalDiff=1, totalDiff=1, minDiff=10
        (pid_lan,    mid, 1, 0, 55),   -- goalDiff=3
        (pid_nabito, mid, 2, 2, 60),   -- goalDiff=4
        (pid_tue,    mid, 4, 1, 75),   -- goalDiff=1, totalDiff=1, minDiff=5
        (pid_vy,     mid, 2, 0, 65);   -- goalDiff=2

    -- -----------------------------------------------
    -- M14: Belgium vs Egypt | KQ: 3-1 (69')
    -- Test: exact for Tuệ with exact minute
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='Belgium' AND away_team='Egypt';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 2, 0, 55),   -- goalDiff=0
        (pid_lan,    mid, 1, 1, 50),   -- goalDiff=2
        (pid_nabito, mid, 0, 0, 45),   -- goalDiff=2
        (pid_tue,    mid, 3, 1, 69),   -- EXACT + EXACT minute!
        (pid_vy,     mid, 2, 1, 60);   -- goalDiff=1

    -- -----------------------------------------------
    -- M15: Saudi Arabia vs Uruguay | KQ: 0-2 (51')
    -- Test: exact for Vy with closest minute
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='Saudi Arabia' AND away_team='Uruguay';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 0, 3, 65),   -- goalDiff=1
        (pid_lan,    mid, 1, 1, 45),   -- goalDiff=2
        (pid_nabito, mid, 0, 0, 40),   -- goalDiff=2
        (pid_tue,    mid, 1, 2, 55),   -- goalDiff=1
        (pid_vy,     mid, 0, 2, 50);   -- EXACT, minDiff=1

    -- -----------------------------------------------
    -- M16: Iran vs New Zealand | KQ: 2-0 (63')
    -- Test: exact for Admin
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='Iran' AND away_team='New Zealand';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 2, 0, 60),   -- EXACT, minDiff=3
        (pid_lan,    mid, 0, 1, 50),   -- goalDiff=3
        (pid_nabito, mid, 1, 1, 45),   -- goalDiff=2
        (pid_tue,    mid, 3, 0, 70),   -- goalDiff=1
        (pid_vy,     mid, 1, 0, 55);   -- goalDiff=1

    -- -----------------------------------------------
    -- M17: France vs Senegal | KQ: 3-0 (75')
    -- Test: exact for Tuệ with exact minute
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='France' AND away_team='Senegal';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 2, 0, 65),   -- goalDiff=1
        (pid_lan,    mid, 1, 1, 50),   -- goalDiff=3
        (pid_nabito, mid, 0, 0, 40),   -- goalDiff=3
        (pid_tue,    mid, 3, 0, 75),   -- EXACT + EXACT minute!
        (pid_vy,     mid, 2, 1, 60);   -- goalDiff=2

    -- -----------------------------------------------
    -- M18: Iraq vs Norway | KQ: 1-1 (38')
    -- Test: early draw, exact for Na Bito
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='Iraq' AND away_team='Norway';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 0, 2, 55),   -- goalDiff=2
        (pid_lan,    mid, 1, 0, 45),   -- goalDiff=1
        (pid_nabito, mid, 1, 1, 40),   -- EXACT, minDiff=2
        (pid_tue,    mid, 2, 2, 60),   -- goalDiff=0
        (pid_vy,     mid, 0, 1, 50);   -- goalDiff=1

    -- -----------------------------------------------
    -- M19: Argentina vs Algeria | KQ: 2-0 (55')
    -- Test: exact for Tuệ with exact minute
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='Argentina' AND away_team='Algeria';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 3, 0, 65),   -- goalDiff=1
        (pid_lan,    mid, 1, 1, 45),   -- goalDiff=2
        (pid_nabito, mid, 2, 2, 50),   -- goalDiff=2
        (pid_tue,    mid, 2, 0, 55),   -- EXACT + EXACT minute!
        (pid_vy,     mid, 2, 1, 60);   -- goalDiff=1

    -- -----------------------------------------------
    -- M20: Austria vs Jordan | KQ: 1-0 (89')
    -- Test: 2 exact scores (Admin & Vy), Vy wins on minute
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='Austria' AND away_team='Jordan';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 1, 0, 75),   -- EXACT, minDiff=14
        (pid_lan,    mid, 0, 1, 60),   -- goalDiff=2
        (pid_nabito, mid, 0, 0, 50),   -- goalDiff=1
        (pid_tue,    mid, 2, 0, 80),   -- goalDiff=1
        (pid_vy,     mid, 1, 0, 85);   -- EXACT, minDiff=4 (wins!)

    -- -----------------------------------------------
    -- M21: Portugal vs DR Congo | KQ: 3-1 (67')
    -- Test: no exact, tiebreak chain
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='Portugal' AND away_team='DR Congo';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 3, 0, 70),   -- goalDiff=1, totalDiff=1, minDiff=3
        (pid_lan,    mid, 1, 0, 55),   -- goalDiff=1, totalDiff=3
        (pid_nabito, mid, 2, 2, 50),   -- goalDiff=2
        (pid_tue,    mid, 4, 1, 75),   -- goalDiff=1, totalDiff=1, minDiff=8
        (pid_vy,     mid, 2, 1, 60);   -- goalDiff=1, totalDiff=1, minDiff=7

    -- -----------------------------------------------
    -- M22: England vs Croatia | KQ: 2-0 (73')
    -- Test: exact for Admin
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='England' AND away_team='Croatia';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 2, 0, 70),   -- EXACT, minDiff=3
        (pid_lan,    mid, 1, 1, 55),   -- goalDiff=2
        (pid_nabito, mid, 0, 0, 45),   -- goalDiff=2
        (pid_tue,    mid, 3, 1, 80),   -- goalDiff=0
        (pid_vy,     mid, 1, 0, 60);   -- goalDiff=1

    -- -----------------------------------------------
    -- M23: Ghana vs Panama | KQ: 1-1 (44')
    -- Test: exact for Na Bito with exact minute
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='Ghana' AND away_team='Panama';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 2, 0, 55),   -- goalDiff=2
        (pid_lan,    mid, 0, 1, 45),   -- goalDiff=1
        (pid_nabito, mid, 1, 1, 44),   -- EXACT + EXACT minute!
        (pid_tue,    mid, 2, 2, 60),   -- goalDiff=0
        (pid_vy,     mid, 1, 0, 50);   -- goalDiff=1

    -- -----------------------------------------------
    -- M24: Uzbekistan vs Colombia | KQ: 0-1 (61')
    -- Test: exact for Vy
    -- -----------------------------------------------
    SELECT id INTO mid FROM matches WHERE home_team='Uzbekistan' AND away_team='Colombia';
    INSERT INTO predictions (player_id, match_id, home_score, away_score, minute) VALUES
        (pid_admin,  mid, 0, 2, 55),   -- goalDiff=1
        (pid_lan,    mid, 1, 0, 45),   -- goalDiff=2
        (pid_nabito, mid, 0, 0, 40),   -- goalDiff=1
        (pid_tue,    mid, 1, 3, 70),   -- goalDiff=1, totalDiff=3
        (pid_vy,     mid, 0, 1, 60);   -- EXACT, minDiff=1

    RAISE NOTICE '✅ Đã tạo 120 predictions cho 5 players × 24 matches';
END $$;

-- Kiểm tra nhanh
SELECT p.name, COUNT(pr.id) AS predictions
FROM players p
LEFT JOIN predictions pr ON pr.player_id = p.id
WHERE p.email IN ('admin@test.com','lan@test.com','nabito@test.com','tue@test.com','vy@test.com')
GROUP BY p.name
ORDER BY p.name;


-- =============================================
-- PHẦN 3: KẾT QUẢ TRẬN ĐẤU
-- (Chạy SAU khi đã kiểm tra predictions ở trên)
-- =============================================

-- Group A
UPDATE matches SET home_score=2, away_score=1, minute=78, status='finished', points_calculated=false
WHERE home_team='Mexico' AND away_team='South Africa';

UPDATE matches SET home_score=0, away_score=0, minute=90, status='finished', points_calculated=false
WHERE home_team='South Korea' AND away_team='Czech Republic';

-- Group B
UPDATE matches SET home_score=3, away_score=0, minute=88, status='finished', points_calculated=false
WHERE home_team='Canada' AND away_team='Bosnia & Herzegovina';

UPDATE matches SET home_score=0, away_score=3, minute=72, status='finished', points_calculated=false
WHERE home_team='Qatar' AND away_team='Switzerland';

-- Group C
UPDATE matches SET home_score=2, away_score=2, minute=90, status='finished', points_calculated=false
WHERE home_team='Brasil' AND away_team='Morocco';

UPDATE matches SET home_score=0, away_score=1, minute=33, status='finished', points_calculated=false
WHERE home_team='Haiti' AND away_team='Scotland';

-- Group D
UPDATE matches SET home_score=1, away_score=2, minute=65, status='finished', points_calculated=false
WHERE home_team='United States' AND away_team='Paraguay';

UPDATE matches SET home_score=1, away_score=1, minute=45, status='finished', points_calculated=false
WHERE home_team='Australia' AND away_team='Turkey';

-- Group E
UPDATE matches SET home_score=5, away_score=0, minute=82, status='finished', points_calculated=false
WHERE home_team='Germany' AND away_team='Curaçao';

UPDATE matches SET home_score=1, away_score=0, minute=56, status='finished', points_calculated=false
WHERE home_team='Ivory Coast' AND away_team='Ecuador';

-- Group F
UPDATE matches SET home_score=2, away_score=1, minute=91, status='finished', points_calculated=false
WHERE home_team='Netherlands' AND away_team='Japan';

UPDATE matches SET home_score=1, away_score=2, minute=77, status='finished', points_calculated=false
WHERE home_team='Sweden' AND away_team='Tunisia';

-- Group G
UPDATE matches SET home_score=3, away_score=1, minute=69, status='finished', points_calculated=false
WHERE home_team='Belgium' AND away_team='Egypt';

UPDATE matches SET home_score=2, away_score=0, minute=63, status='finished', points_calculated=false
WHERE home_team='Iran' AND away_team='New Zealand';

-- Group H
UPDATE matches SET home_score=4, away_score=0, minute=80, status='finished', points_calculated=false
WHERE home_team='Spain' AND away_team='Cape Verde';

UPDATE matches SET home_score=0, away_score=2, minute=51, status='finished', points_calculated=false
WHERE home_team='Saudi Arabia' AND away_team='Uruguay';

-- Group I
UPDATE matches SET home_score=3, away_score=0, minute=75, status='finished', points_calculated=false
WHERE home_team='France' AND away_team='Senegal';

UPDATE matches SET home_score=1, away_score=1, minute=38, status='finished', points_calculated=false
WHERE home_team='Iraq' AND away_team='Norway';

-- Group J
UPDATE matches SET home_score=2, away_score=0, minute=55, status='finished', points_calculated=false
WHERE home_team='Argentina' AND away_team='Algeria';

UPDATE matches SET home_score=1, away_score=0, minute=89, status='finished', points_calculated=false
WHERE home_team='Austria' AND away_team='Jordan';

-- Group K
UPDATE matches SET home_score=3, away_score=1, minute=67, status='finished', points_calculated=false
WHERE home_team='Portugal' AND away_team='DR Congo';

UPDATE matches SET home_score=0, away_score=1, minute=61, status='finished', points_calculated=false
WHERE home_team='Uzbekistan' AND away_team='Colombia';

-- Group L
UPDATE matches SET home_score=2, away_score=0, minute=73, status='finished', points_calculated=false
WHERE home_team='England' AND away_team='Croatia';

UPDATE matches SET home_score=1, away_score=1, minute=44, status='finished', points_calculated=false
WHERE home_team='Ghana' AND away_team='Panama';


-- =============================================
-- PHẦN 4: ĐÁP ÁN KỲ VỌNG
-- (Đối chiếu sau khi bấm "Tính lại toàn bộ điểm")
-- =============================================

-- ┌─────────────────────────────────────────────────┐
-- │           BẢNG XẾP HẠNG KỲ VỌNG                │
-- ├──────┬──────────┬───────┬───────┬───────────────┤
-- │ Rank │ Player   │ Total │ Exact │ Top 1 │
-- ├──────┼──────────┼───────┼───────┼───────────────┤
-- │  1   │ Tuệ      │  139  │   6   │   6           │
-- │  2   │ Admin    │  130  │   5   │   6           │
-- │  3   │ Vy       │  126  │   6   │   6           │
-- │  4   │ Lan      │   92  │   3   │   3           │
-- │  5   │ Na Bito  │   85  │   2   │   3           │
-- └──────┴──────────┴───────┴───────┴───────────────┘
--
-- ═══════════════════════════════════════════════════
-- ĐIỂM CHI TIẾT TỪNG TRẬN
-- Format: #rank Player: total (rank:X + exact:X + min:X) | pred
-- ═══════════════════════════════════════════════════
--
-- M1: Mexico 2-1 South Africa (78') — closestMin=0(Admin)
--   #1 Admin:    13 (5+5+3) | 2-1 (78') exact+minute
--   #2 Lan:       9 (4+5+0) | 2-1 (60') exact
--   #3 Na Bito:   3 (3+0+0) | 1-0 (85') goalDiff=0,tD=2,mD=7
--   #4 Tuệ:       2 (2+0+0) | 3-2 (90') goalDiff=0,tD=2,mD=12
--   #5 Vy:        2 (2+0+0) | 0-0 (45') goalDiff=1,tD=3,mD=33
--
-- M2: S.Korea 0-0 Czech Rep (90') — closestMin=0(Lan)
--   #1 Lan:      13 (5+5+3) | 0-0 (90') exact+minute
--   #2 Tuệ:       9 (4+5+0) | 0-0 (85') exact
--   #3 Admin:     3 (3+0+0) | 1-1 (55') goalDiff=0,tD=2
--   #4 Na Bito:   2 (2+0+0) | 2-2 (70') goalDiff=0,tD=4
--   #5 Vy:        2 (2+0+0) | 1-0 (60') goalDiff=1,tD=1
--
-- M3: Canada 3-0 Bosnia (88') — closestMin=2(Admin)
--   #1 Admin:     8 (5+0+3) | 2-0 (90') goalDiff=1,tD=1,mD=2
--   #2 Vy:        4 (4+0+0) | 4-0 (80') goalDiff=1,tD=1,mD=8
--   #3 Tuệ:       3 (3+0+0) | 3-1 (60') goalDiff=1,tD=1,mD=28
--   #4 Na Bito:   2 (2+0+0) | 2-1 (85') goalDiff=2,tD=2,mD=3
--   #5 Lan:       2 (2+0+0) | 1-0 (75') goalDiff=2,tD=3,mD=13
--
-- M4: USA 1-2 Paraguay (65') — closestMin=0(Na Bito)
--   #1 Lan:      10 (5+5+0) | 1-2 (30') exact,mD=35
--   #2 Na Bito:   7 (4+0+3) | 0-1 (65') goalDiff=0,minute bonus!
--   #3 Tuệ:       3 (3+0+0) | 1-3 (55') goalDiff=1,tD=1,mD=10
--   #4 Vy:        2 (2+0+0) | 0-2 (80') goalDiff=1,tD=1,mD=15
--   #5 Admin:     2 (2+0+0) | 2-1 (70') goalDiff=2,tD=2,mD=5
--
-- M5: Australia 1-1 Turkey (45') — closestMin=0(Admin,Vy)
--   #1 Admin:    13 (5+5+3) | 1-1 (45') exact+minute
--   #2 Tuệ:       9 (4+5+0) | 1-1 (30') exact,mD=15
--   #3 Lan:       3 (3+0+0) | 2-2 (50') goalDiff=0,tD=2,mD=5
--   #4 Na Bito:   2 (2+0+0) | 0-0 (40') goalDiff=0,tD=2,mD=5
--   #5 Vy:        5 (2+0+3) | 3-3 (45') goalDiff=0,tD=4,minute bonus!
--   ⚠️ Rank 5 (5đ) > Rank 3 (3đ) nhờ minute bonus!
--   ⚠️ Lan & Na Bito tied on ALL criteria
--
-- M6: Qatar 0-3 Switzerland (72') — closestMin=2(Tuệ)
--   #1 Tuệ:       8 (5+0+3) | 0-2 (70') goalDiff=1,tD=1,mD=2
--   #2 Na Bito:   4 (4+0+0) | 1-2 (60') goalDiff=2,tD=2,mD=12
--   #3 Lan:       3 (3+0+0) | 0-1 (50') goalDiff=2,tD=2,mD=22
--   #4 Vy:        2 (2+0+0) | 2-2 (45') goalDiff=3,tD=3,mD=27
--   #5 Admin:     2 (2+0+0) | 1-0 (30') goalDiff=4,tD=4,mD=42
--
-- M7: Brasil 2-2 Morocco (90') — closestMin=5(Admin)
--   #1 Na Bito:   5 (5+0+0) | 1-1 (65') goalDiff=0
--   #2 Tuệ:       4 (4+0+0) | 3-2 (80') goalDiff=1,tD=1,mD=10
--   #3 Vy:        3 (3+0+0) | 2-1 (75') goalDiff=1,tD=1,mD=15
--   #4 Lan:       2 (2+0+0) | 1-2 (70') goalDiff=1,tD=1,mD=20
--   #5 Admin:     5 (2+0+3) | 3-1 (85') goalDiff=2,tD=2,minute bonus!
--
-- M8: Haiti 0-1 Scotland (33') — closestMin=2(Na Bito)
--   #1 Vy:       10 (5+5+0) | 0-1 (40') exact,mD=7
--   #2 Na Bito:   7 (4+0+3) | 0-0 (35') goalDiff=1,tD=1,minute bonus!
--   #3 Admin:     3 (3+0+0) | 0-2 (60') goalDiff=1,tD=1,mD=27
--   #4 Tuệ:       2 (2+0+0) | 1-3 (70') goalDiff=1,tD=3,mD=37
--   #5 Lan:       2 (2+0+0) | 1-0 (45') goalDiff=2,tD=2,mD=12
--
-- M9: Germany 5-0 Curaçao (82') — closestMin=0(Tuệ)
--   #1 Tuệ:      13 (5+5+3) | 5-0 (82') exact+minute!
--   #2 Admin:     4 (4+0+0) | 4-0 (75') goalDiff=1,tD=1,mD=7
--   #3 Vy:        3 (3+0+0) | 3-0 (70') goalDiff=2,tD=2,mD=12
--   #4 Lan:       2 (2+0+0) | 2-1 (60') goalDiff=4,tD=4,mD=22
--   #5 Na Bito:   2 (2+0+0) | 1-1 (55') goalDiff=5,tD=5,mD=27
--
-- M10: Netherlands 2-1 Japan (91') — closestMin=3(Vy)
--   #1 Vy:       13 (5+5+3) | 2-1 (88') exact,mD=3+minute!
--   #2 Tuệ:       4 (4+0+0) | 3-1 (75') goalDiff=1,tD=1,mD=16
--   #3 Admin:     3 (3+0+0) | 2-0 (65') goalDiff=1,tD=1,mD=26
--   #4 Na Bito:   2 (2+0+0) | 1-1 (50') goalDiff=1,tD=1,mD=41
--   #5 Lan:       2 (2+0+0) | 1-2 (80') goalDiff=2,tD=2,mD=11
--
-- M11: Ivory Coast 1-0 Ecuador (56') — closestMin=1(Lan)
--   #1 Vy:       10 (5+5+0) | 1-0 (50') exact,mD=6
--   #2 Tuệ:       4 (4+0+0) | 2-1 (65') goalDiff=0
--   #3 Admin:     3 (3+0+0) | 1-1 (45') goalDiff=1,tD=1,mD=11
--   #4 Na Bito:   2 (2+0+0) | 0-0 (40') goalDiff=1,tD=1,mD=16
--   #5 Lan:       5 (2+0+3) | 0-1 (55') goalDiff=2,minute bonus!
--
-- M12: Sweden 1-2 Tunisia (77') — closestMin=0(Lan)
--   #1 Lan:      13 (5+5+3) | 1-2 (77') exact+minute!
--   #2 Vy:        4 (4+0+0) | 0-1 (70') goalDiff=0,tD=2,mD=7
--   #3 Tuệ:       3 (3+0+0) | 2-3 (85') goalDiff=0,tD=2,mD=8
--   #4 Na Bito:   2 (2+0+0) | 1-1 (55') goalDiff=1,tD=1,mD=22
--   #5 Admin:     2 (2+0+0) | 2-0 (60') goalDiff=3,tD=3,mD=17
--
-- M13: Spain 4-0 Cape Verde (80') — closestMin=5(Tuệ)
--   #1 Tuệ:       8 (5+0+3) | 4-1 (75') goalDiff=1,tD=1,mD=5
--   #2 Admin:     4 (4+0+0) | 3-0 (70') goalDiff=1,tD=1,mD=10
--   #3 Vy:        3 (3+0+0) | 2-0 (65') goalDiff=2,tD=2,mD=15
--   #4 Lan:       2 (2+0+0) | 1-0 (55') goalDiff=3,tD=3,mD=25
--   #5 Na Bito:   2 (2+0+0) | 2-2 (60') goalDiff=4,tD=4,mD=20
--
-- M14: Belgium 3-1 Egypt (69') — closestMin=0(Tuệ)
--   #1 Tuệ:      13 (5+5+3) | 3-1 (69') exact+minute!
--   #2 Admin:     4 (4+0+0) | 2-0 (55') goalDiff=0,tD=2,mD=14
--   #3 Vy:        3 (3+0+0) | 2-1 (60') goalDiff=1,tD=1,mD=9
--   #4 Lan:       2 (2+0+0) | 1-1 (50') goalDiff=2,tD=2,mD=19
--   #5 Na Bito:   2 (2+0+0) | 0-0 (45') goalDiff=2,tD=4,mD=24
--
-- M15: S.Arabia 0-2 Uruguay (51') — closestMin=1(Vy)
--   #1 Vy:       13 (5+5+3) | 0-2 (50') exact,mD=1+minute!
--   #2 Tuệ:       4 (4+0+0) | 1-2 (55') goalDiff=1,tD=1,mD=4
--   #3 Admin:     3 (3+0+0) | 0-3 (65') goalDiff=1,tD=1,mD=14
--   #4 Lan:       2 (2+0+0) | 1-1 (45') goalDiff=2,tD=2,mD=6
--   #5 Na Bito:   2 (2+0+0) | 0-0 (40') goalDiff=2,tD=2,mD=11
--
-- M16: Iran 2-0 New Zealand (63') — closestMin=3(Admin)
--   #1 Admin:    13 (5+5+3) | 2-0 (60') exact,mD=3+minute!
--   #2 Tuệ:       4 (4+0+0) | 3-0 (70') goalDiff=1,tD=1,mD=7
--   #3 Vy:        3 (3+0+0) | 1-0 (55') goalDiff=1,tD=1,mD=8
--   #4 Na Bito:   2 (2+0+0) | 1-1 (45') goalDiff=2,tD=2,mD=18
--   #5 Lan:       2 (2+0+0) | 0-1 (50') goalDiff=3,tD=3,mD=13
--
-- M17: France 3-0 Senegal (75') — closestMin=0(Tuệ)
--   #1 Tuệ:      13 (5+5+3) | 3-0 (75') exact+minute!
--   #2 Admin:     4 (4+0+0) | 2-0 (65') goalDiff=1,tD=1,mD=10
--   #3 Vy:        3 (3+0+0) | 2-1 (60') goalDiff=2,tD=2,mD=15
--   #4 Lan:       2 (2+0+0) | 1-1 (50') goalDiff=3,tD=3,mD=25
--   #5 Na Bito:   2 (2+0+0) | 0-0 (40') goalDiff=3,tD=3,mD=35
--
-- M18: Iraq 1-1 Norway (38') — closestMin=2(Na Bito)
--   #1 Na Bito:  13 (5+5+3) | 1-1 (40') exact,mD=2+minute!
--   #2 Tuệ:       4 (4+0+0) | 2-2 (60') goalDiff=0,tD=2,mD=22
--   #3 Lan:       3 (3+0+0) | 1-0 (45') goalDiff=1,tD=1,mD=7
--   #4 Vy:        2 (2+0+0) | 0-1 (50') goalDiff=1,tD=1,mD=12
--   #5 Admin:     2 (2+0+0) | 0-2 (55') goalDiff=2,tD=2,mD=17
--
-- M19: Argentina 2-0 Algeria (55') — closestMin=0(Tuệ)
--   #1 Tuệ:      13 (5+5+3) | 2-0 (55') exact+minute!
--   #2 Vy:        4 (4+0+0) | 2-1 (60') goalDiff=1,tD=1,mD=5
--   #3 Admin:     3 (3+0+0) | 3-0 (65') goalDiff=1,tD=1,mD=10
--   #4 Na Bito:   2 (2+0+0) | 2-2 (50') goalDiff=2,tD=2,mD=5
--   #5 Lan:       2 (2+0+0) | 1-1 (45') goalDiff=2,tD=2,mD=10
--
-- M20: Austria 1-0 Jordan (89') — closestMin=4(Vy)
--   #1 Vy:       13 (5+5+3) | 1-0 (85') exact,mD=4+minute!
--   #2 Admin:     9 (4+5+0) | 1-0 (75') exact,mD=14
--   #3 Tuệ:       3 (3+0+0) | 2-0 (80') goalDiff=1,tD=1,mD=9
--   #4 Na Bito:   2 (2+0+0) | 0-0 (50') goalDiff=1,tD=1,mD=39
--   #5 Lan:       2 (2+0+0) | 0-1 (60') goalDiff=2,tD=2,mD=29
--
-- M21: Portugal 3-1 DR Congo (67') — closestMin=3(Admin)
--   #1 Admin:     8 (5+0+3) | 3-0 (70') goalDiff=1,tD=1,mD=3+minute!
--   #2 Vy:        4 (4+0+0) | 2-1 (60') goalDiff=1,tD=1,mD=7
--   #3 Tuệ:       3 (3+0+0) | 4-1 (75') goalDiff=1,tD=1,mD=8
--   #4 Lan:       2 (2+0+0) | 1-0 (55') goalDiff=1,tD=3,mD=12
--   #5 Na Bito:   2 (2+0+0) | 2-2 (50') goalDiff=2,tD=2,mD=17
--
-- M22: England 2-0 Croatia (73') — closestMin=3(Admin)
--   #1 Admin:    13 (5+5+3) | 2-0 (70') exact,mD=3+minute!
--   #2 Tuệ:       4 (4+0+0) | 3-1 (80') goalDiff=0,tD=2,mD=7
--   #3 Vy:        3 (3+0+0) | 1-0 (60') goalDiff=1,tD=1,mD=13
--   #4 Lan:       2 (2+0+0) | 1-1 (55') goalDiff=2,tD=2,mD=18
--   #5 Na Bito:   2 (2+0+0) | 0-0 (45') goalDiff=2,tD=2,mD=28
--
-- M23: Ghana 1-1 Panama (44') — closestMin=0(Na Bito)
--   #1 Na Bito:  13 (5+5+3) | 1-1 (44') exact+minute!
--   #2 Tuệ:       4 (4+0+0) | 2-2 (60') goalDiff=0,tD=2,mD=16
--   #3 Lan:       3 (3+0+0) | 0-1 (45') goalDiff=1,tD=1,mD=1
--   #4 Vy:        2 (2+0+0) | 1-0 (50') goalDiff=1,tD=1,mD=6
--   #5 Admin:     2 (2+0+0) | 2-0 (55') goalDiff=2,tD=2,mD=11
--
-- M24: Uzbekistan 0-1 Colombia (61') — closestMin=1(Vy)
--   #1 Vy:       13 (5+5+3) | 0-1 (60') exact,mD=1+minute!
--   #2 Admin:     4 (4+0+0) | 0-2 (55') goalDiff=1,tD=1,mD=6
--   #3 Na Bito:   3 (3+0+0) | 0-0 (40') goalDiff=1,tD=1,mD=21
--   #4 Tuệ:       2 (2+0+0) | 1-3 (70') goalDiff=1,tD=3,mD=9
--   #5 Lan:       2 (2+0+0) | 1-0 (45') goalDiff=2,tD=2,mD=16
--
-- ═══════════════════════════════════════════════════
-- TỔNG ĐIỂM TỪNG PLAYER (24 trận)
-- ═══════════════════════════════════════════════════
--
-- Admin:
--   M1:13 M2:3 M3:8 M4:2 M5:13 M6:2 M7:5 M8:3
--   M9:4 M10:3 M11:3 M12:2 M13:4 M14:4 M15:3 M16:13
--   M17:4 M18:2 M19:3 M20:9 M21:8 M22:13 M23:2 M24:4
--   = 130 | exact: 5 (M1,M5,M16,M20,M22) | top1: 6 (M1,M3,M5,M16,M21,M22)
--
-- Lan:
--   M1:9 M2:13 M3:2 M4:10 M5:3 M6:3 M7:2 M8:2
--   M9:2 M10:2 M11:5 M12:13 M13:2 M14:2 M15:2 M16:2
--   M17:2 M18:3 M19:2 M20:2 M21:2 M22:2 M23:3 M24:2
--   = 92 | exact: 3 (M2,M4,M12) | top1: 3 (M2,M4,M12)
--
-- Na Bito:
--   M1:3 M2:2 M3:2 M4:7 M5:2 M6:4 M7:5 M8:7
--   M9:2 M10:2 M11:2 M12:2 M13:2 M14:2 M15:2 M16:2
--   M17:2 M18:13 M19:2 M20:2 M21:2 M22:2 M23:13 M24:3
--   = 85 | exact: 2 (M18,M23) | top1: 3 (M7,M18,M23)
--
-- Tuệ:
--   M1:2 M2:9 M3:3 M4:3 M5:9 M6:8 M7:4 M8:2
--   M9:13 M10:4 M11:4 M12:3 M13:8 M14:13 M15:4 M16:4
--   M17:13 M18:4 M19:13 M20:3 M21:3 M22:4 M23:4 M24:2
--   = 139 | exact: 6 (M2,M5,M9,M14,M17,M19) | top1: 6 (M6,M9,M13,M14,M17,M19)
--
-- Vy:
--   M1:2 M2:2 M3:4 M4:2 M5:5 M6:2 M7:3 M8:10
--   M9:3 M10:13 M11:10 M12:4 M13:3 M14:3 M15:13 M16:3
--   M17:3 M18:2 M19:4 M20:13 M21:4 M22:3 M23:2 M24:13
--   = 126 | exact: 6 (M8,M10,M11,M15,M20,M24) | top1: 6 (M8,M10,M11,M15,M20,M24)


-- =============================================
-- PHẦN 4B: QUERY KIỂM TRA TỰ ĐỘNG
-- (Chạy sau khi tính điểm xong)
-- =============================================

-- So sánh tổng điểm thực tế vs kỳ vọng
SELECT
    p.name,
    p.total_points AS actual_total,
    CASE p.email
        WHEN 'admin@test.com' THEN 130
        WHEN 'lan@test.com' THEN 92
        WHEN 'nabito@test.com' THEN 85
        WHEN 'tue@test.com' THEN 139
        WHEN 'vy@test.com' THEN 126
    END AS expected_total,
    CASE WHEN p.total_points = CASE p.email
        WHEN 'admin@test.com' THEN 130
        WHEN 'lan@test.com' THEN 92
        WHEN 'nabito@test.com' THEN 85
        WHEN 'tue@test.com' THEN 139
        WHEN 'vy@test.com' THEN 126
    END THEN '✅ PASS' ELSE '❌ FAIL' END AS status,
    p.exact_score_count AS actual_exact,
    CASE p.email
        WHEN 'admin@test.com' THEN 5
        WHEN 'lan@test.com' THEN 3
        WHEN 'nabito@test.com' THEN 2
        WHEN 'tue@test.com' THEN 6
        WHEN 'vy@test.com' THEN 6
    END AS expected_exact,
    p.top1_count AS actual_top1,
    CASE p.email
        WHEN 'admin@test.com' THEN 6
        WHEN 'lan@test.com' THEN 3
        WHEN 'nabito@test.com' THEN 3
        WHEN 'tue@test.com' THEN 6
        WHEN 'vy@test.com' THEN 6
    END AS expected_top1
FROM players p
WHERE p.email IN ('admin@test.com','lan@test.com','nabito@test.com','tue@test.com','vy@test.com')
ORDER BY expected_total DESC;

-- Kiểm tra chi tiết điểm từng prediction
SELECT
    m.home_team || ' vs ' || m.away_team AS match,
    m.home_score || '-' || m.away_score || ' (' || m.minute || ''')' AS result,
    p.name,
    pr.home_score || '-' || pr.away_score || ' (' || pr.minute || ''')' AS prediction,
    pr.points_rank,
    pr.points_exact_score,
    pr.points_minute,
    pr.total_points
FROM predictions pr
JOIN players p ON p.id = pr.player_id
JOIN matches m ON m.id = pr.match_id
WHERE p.email IN ('admin@test.com','lan@test.com','nabito@test.com','tue@test.com','vy@test.com')
ORDER BY m.match_date, pr.total_points DESC, pr.points_rank DESC;


-- =============================================
-- PHẦN 5: DỌN DẸP (chạy khi test xong)
-- =============================================

-- ⚠️ CHỈ CHẠY KHI ĐÃ TEST XONG!

-- Xóa predictions
-- DELETE FROM predictions WHERE player_id IN (
--     SELECT id FROM players WHERE email IN
--     ('admin@test.com','lan@test.com','nabito@test.com','tue@test.com','vy@test.com')
-- );

-- Reset player stats
-- UPDATE players SET total_points = 0, exact_score_count = 0, top1_count = 0
-- WHERE email IN ('admin@test.com','lan@test.com','nabito@test.com','tue@test.com','vy@test.com');

-- Reset Matchday 1 matches về trạng thái ban đầu
-- UPDATE matches SET
--     home_score = NULL,
--     away_score = NULL,
--     minute = NULL,
--     status = 'not-open',
--     points_calculated = false
-- WHERE match_date >= '2026-06-12 00:00:00+07'
--   AND match_date <= '2026-06-18 10:00:00+07';
