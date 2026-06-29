-- =============================================
-- USABILITY TEST - SETUP
-- Xóa toàn bộ data cũ và tạo trận đấu cho test
-- Chạy 1 lần trước khi bắt đầu session test
-- =============================================

-- 1. Xóa predictions và matches cũ
DELETE FROM predictions;
DELETE FROM matches;

-- 2. Reset player stats (using player_groups join table)
UPDATE players SET
  total_points = 0,
  exact_score_count = 0,
  top1_count = 0,
  favorite_points = 0
WHERE id IN (
  SELECT pg.player_id FROM player_groups pg
  JOIN groups g ON g.id = pg.group_id
  WHERE g.code = 'WC2026-DEMO'
);

-- 3. Mở lại favorite team cho user chọn (global setting in scoring_rules)
UPDATE scoring_rules SET
  favorite_team_enabled = true,
  favorite_team_locked = false;

-- 4. Reset favorite team của tất cả player (để họ chọn lại)
UPDATE players SET
  favorite_team = NULL,
  favorite_team_status = NULL
WHERE id IN (
  SELECT pg.player_id FROM player_groups pg
  JOIN groups g ON g.id = pg.group_id
  WHERE g.code = 'WC2026-DEMO'
);

-- =============================================
-- 5. INSERT GROUP STAGE MATCHES (18 trận, 3 bảng)
-- Bảng A: Brasil, Germany, Japan, Morocco
-- Bảng B: Argentina, England, USA, Australia
-- Bảng C: France, Spain, Netherlands, South Korea
-- Status: 'not-open' (sẽ mở bằng SQL riêng)
-- match_date sẽ được set khi mở dự đoán
-- =============================================

-- Group Round 1 (M1-M6)
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('A', 'Brasil',    'Morocco',       '2026-06-15 00:00:00+07', 'not-open', 1),
('A', 'Germany',   'Japan',         '2026-06-15 00:00:00+07', 'not-open', 2),
('B', 'Argentina', 'Australia',     '2026-06-15 00:00:00+07', 'not-open', 3),
('B', 'England',   'USA', '2026-06-15 00:00:00+07', 'not-open', 4),
('C', 'France',    'South Korea',   '2026-06-15 00:00:00+07', 'not-open', 5),
('C', 'Spain',     'Netherlands',   '2026-06-15 00:00:00+07', 'not-open', 6);

-- Group Round 2 (M7-M12)
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('A', 'Brasil',    'Japan',         '2026-06-16 00:00:00+07', 'not-open', 7),
('A', 'Germany',   'Morocco',       '2026-06-16 00:00:00+07', 'not-open', 8),
('B', 'Argentina', 'USA', '2026-06-16 00:00:00+07', 'not-open', 9),
('B', 'England',   'Australia',     '2026-06-16 00:00:00+07', 'not-open', 10),
('C', 'France',    'Netherlands',   '2026-06-16 00:00:00+07', 'not-open', 11),
('C', 'Spain',     'South Korea',   '2026-06-16 00:00:00+07', 'not-open', 12);

-- Group Round 3 (M13-M18)
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('A', 'Brasil',    'Germany',       '2026-06-17 00:00:00+07', 'not-open', 13),
('A', 'Japan',     'Morocco',       '2026-06-17 00:00:00+07', 'not-open', 14),
('B', 'Argentina', 'England',       '2026-06-17 00:00:00+07', 'not-open', 15),
('B', 'USA', 'Australia', '2026-06-17 00:00:00+07', 'not-open', 16),
('C', 'France',    'Spain',         '2026-06-17 00:00:00+07', 'not-open', 17),
('C', 'Netherlands', 'South Korea', '2026-06-17 00:00:00+07', 'not-open', 18);

-- =============================================
-- 6. INSERT KNOCKOUT MATCHES (31 trận: R32 + R16 + QF + SF + 3RD + FINAL)
-- Teams sẽ được fill khi mở từng vòng
-- Match numbers giữ nguyên M73-M104 để bracket render đúng
-- =============================================

-- Round of 32 (M73-M88) - 16 trận
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('R32', 'TBD', 'TBD', '2026-06-18 00:00:00+07', 'not-open', 73),
('R32', 'TBD', 'TBD', '2026-06-18 00:00:00+07', 'not-open', 74),
('R32', 'TBD', 'TBD', '2026-06-18 00:00:00+07', 'not-open', 75),
('R32', 'TBD', 'TBD', '2026-06-18 00:00:00+07', 'not-open', 76),
('R32', 'TBD', 'TBD', '2026-06-18 00:00:00+07', 'not-open', 77),
('R32', 'TBD', 'TBD', '2026-06-18 00:00:00+07', 'not-open', 78),
('R32', 'TBD', 'TBD', '2026-06-18 00:00:00+07', 'not-open', 79),
('R32', 'TBD', 'TBD', '2026-06-18 00:00:00+07', 'not-open', 80),
('R32', 'TBD', 'TBD', '2026-06-18 00:00:00+07', 'not-open', 81),
('R32', 'TBD', 'TBD', '2026-06-18 00:00:00+07', 'not-open', 82),
('R32', 'TBD', 'TBD', '2026-06-18 00:00:00+07', 'not-open', 83),
('R32', 'TBD', 'TBD', '2026-06-18 00:00:00+07', 'not-open', 84),
('R32', 'TBD', 'TBD', '2026-06-18 00:00:00+07', 'not-open', 85),
('R32', 'TBD', 'TBD', '2026-06-18 00:00:00+07', 'not-open', 86),
('R32', 'TBD', 'TBD', '2026-06-18 00:00:00+07', 'not-open', 87),
('R32', 'TBD', 'TBD', '2026-06-18 00:00:00+07', 'not-open', 88);

-- Round of 16 (M89-M96)
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('R16', 'TBD', 'TBD', '2026-06-19 00:00:00+07', 'not-open', 89),
('R16', 'TBD', 'TBD', '2026-06-19 00:00:00+07', 'not-open', 90),
('R16', 'TBD', 'TBD', '2026-06-19 00:00:00+07', 'not-open', 91),
('R16', 'TBD', 'TBD', '2026-06-19 00:00:00+07', 'not-open', 92),
('R16', 'TBD', 'TBD', '2026-06-19 00:00:00+07', 'not-open', 93),
('R16', 'TBD', 'TBD', '2026-06-19 00:00:00+07', 'not-open', 94),
('R16', 'TBD', 'TBD', '2026-06-19 00:00:00+07', 'not-open', 95),
('R16', 'TBD', 'TBD', '2026-06-19 00:00:00+07', 'not-open', 96);

-- Quarter-finals (M97-M100)
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('QF', 'TBD', 'TBD', '2026-06-20 00:00:00+07', 'not-open', 97),
('QF', 'TBD', 'TBD', '2026-06-20 00:00:00+07', 'not-open', 98),
('QF', 'TBD', 'TBD', '2026-06-20 00:00:00+07', 'not-open', 99),
('QF', 'TBD', 'TBD', '2026-06-20 00:00:00+07', 'not-open', 100);

-- Semi-finals (M101-M102)
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('SF', 'TBD', 'TBD', '2026-06-21 00:00:00+07', 'not-open', 101),
('SF', 'TBD', 'TBD', '2026-06-21 00:00:00+07', 'not-open', 102);

-- 3rd place & Final (M103-M104)
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('3RD',   'TBD', 'TBD', '2026-06-22 00:00:00+07', 'not-open', 103),
('FINAL', 'TBD', 'TBD', '2026-06-22 00:00:00+07', 'not-open', 104);

-- =============================================
-- VERIFY
-- =============================================
SELECT match_number, match_group, home_team, away_team, status
FROM matches ORDER BY match_number;
