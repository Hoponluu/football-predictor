-- =============================================
-- WC2022 SEED DATA - 64 trận World Cup 2022
-- Dùng để test sync với openfootball/worldcup.json (2022)
-- Không có vòng R32, vào thẳng R16
-- =============================================

-- 1. Xóa data cũ
DELETE FROM predictions;
DELETE FROM matches;

-- 2. Reset player stats
UPDATE players SET
  total_points = 0,
  exact_score_count = 0,
  top1_count = 0,
  favorite_points = 0
WHERE id IN (
  SELECT pg.player_id FROM player_groups pg
  JOIN groups g ON g.id = pg.group_id
);

-- 3. Reset favorite team
UPDATE scoring_rules SET
  favorite_team_enabled = true,
  favorite_team_locked = false;

UPDATE players SET
  favorite_team = NULL,
  favorite_team_status = NULL,
  favorite_points = 0
WHERE id IN (
  SELECT pg.player_id FROM player_groups pg
);

-- =============================================
-- GROUP STAGE - 48 trận (8 bảng, 6 trận/bảng)
-- Tên đội khớp với openfootball/worldcup.json 2022
-- Status: 'open' để có thể sync kết quả ngay
-- =============================================

-- Group A (M1-M6)
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('A', 'Qatar',       'Ecuador',       '2022-11-20 19:00:00+03', 'open', 1),
('A', 'Senegal',     'Netherlands',   '2022-11-21 19:00:00+03', 'open', 2),
('A', 'Qatar',       'Senegal',       '2022-11-25 16:00:00+03', 'open', 3),
('A', 'Netherlands', 'Ecuador',       '2022-11-25 19:00:00+03', 'open', 4),
('A', 'Ecuador',     'Senegal',       '2022-11-29 18:00:00+03', 'open', 5),
('A', 'Netherlands', 'Qatar',         '2022-11-29 18:00:00+03', 'open', 6);

-- Group B (M7-M12)
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('B', 'England',     'Iran',          '2022-11-21 16:00:00+03', 'open', 7),
('B', 'USA',         'Wales',         '2022-11-21 22:00:00+03', 'open', 8),
('B', 'Wales',       'Iran',          '2022-11-25 13:00:00+03', 'open', 9),
('B', 'England',     'USA',           '2022-11-25 22:00:00+03', 'open', 10),
('B', 'Wales',       'England',       '2022-11-29 22:00:00+03', 'open', 11),
('B', 'Iran',        'USA',           '2022-11-29 22:00:00+03', 'open', 12);

-- Group C (M13-M18)
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('C', 'Argentina',   'Saudi Arabia',  '2022-11-22 13:00:00+03', 'open', 13),
('C', 'Mexico',      'Poland',        '2022-11-22 19:00:00+03', 'open', 14),
('C', 'Poland',      'Saudi Arabia',  '2022-11-26 16:00:00+03', 'open', 15),
('C', 'Argentina',   'Mexico',        '2022-11-26 22:00:00+03', 'open', 16),
('C', 'Poland',      'Argentina',     '2022-11-30 22:00:00+03', 'open', 17),
('C', 'Saudi Arabia','Mexico',        '2022-11-30 22:00:00+03', 'open', 18);

-- Group D (M19-M24)
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('D', 'Denmark',     'Tunisia',       '2022-11-22 16:00:00+03', 'open', 19),
('D', 'France',      'Australia',     '2022-11-22 22:00:00+03', 'open', 20),
('D', 'Tunisia',     'Australia',     '2022-11-26 13:00:00+03', 'open', 21),
('D', 'France',      'Denmark',       '2022-11-26 19:00:00+03', 'open', 22),
('D', 'Australia',   'Denmark',       '2022-11-30 18:00:00+03', 'open', 23),
('D', 'Tunisia',     'France',        '2022-11-30 18:00:00+03', 'open', 24);

-- Group E (M25-M30)
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('E', 'Germany',     'Japan',         '2022-11-23 16:00:00+03', 'open', 25),
('E', 'Spain',       'Costa Rica',    '2022-11-23 19:00:00+03', 'open', 26),
('E', 'Japan',       'Costa Rica',    '2022-11-27 13:00:00+03', 'open', 27),
('E', 'Spain',       'Germany',       '2022-11-27 22:00:00+03', 'open', 28),
('E', 'Japan',       'Spain',         '2022-12-01 22:00:00+03', 'open', 29),
('E', 'Costa Rica',  'Germany',       '2022-12-01 22:00:00+03', 'open', 30);

-- Group F (M31-M36)
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('F', 'Morocco',     'Croatia',       '2022-11-23 13:00:00+03', 'open', 31),
('F', 'Belgium',     'Canada',        '2022-11-23 22:00:00+03', 'open', 32),
('F', 'Belgium',     'Morocco',       '2022-11-27 16:00:00+03', 'open', 33),
('F', 'Croatia',     'Canada',        '2022-11-27 19:00:00+03', 'open', 34),
('F', 'Croatia',     'Belgium',       '2022-12-01 18:00:00+03', 'open', 35),
('F', 'Canada',      'Morocco',       '2022-12-01 18:00:00+03', 'open', 36);

-- Group G (M37-M42)
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('G', 'Switzerland', 'Cameroon',      '2022-11-24 13:00:00+03', 'open', 37),
('G', 'Brasil',      'Serbia',        '2022-11-24 22:00:00+03', 'open', 38),
('G', 'Cameroon',    'Serbia',        '2022-11-28 13:00:00+03', 'open', 39),
('G', 'Brasil',      'Switzerland',   '2022-11-28 19:00:00+03', 'open', 40),
('G', 'Serbia',      'Switzerland',   '2022-12-02 22:00:00+03', 'open', 41),
('G', 'Cameroon',    'Brasil',        '2022-12-02 22:00:00+03', 'open', 42);

-- Group H (M43-M48)
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('H', 'Uruguay',     'South Korea',   '2022-11-24 16:00:00+03', 'open', 43),
('H', 'Portugal',    'Ghana',         '2022-11-24 19:00:00+03', 'open', 44),
('H', 'South Korea', 'Ghana',         '2022-11-28 16:00:00+03', 'open', 45),
('H', 'Portugal',    'Uruguay',       '2022-11-28 22:00:00+03', 'open', 46),
('H', 'Ghana',       'Uruguay',       '2022-12-02 18:00:00+03', 'open', 47),
('H', 'South Korea', 'Portugal',      '2022-12-02 18:00:00+03', 'open', 48);

-- =============================================
-- KNOCKOUT STAGE - 16 trận (R16 + QF + SF + 3RD + FINAL)
-- Không có R32 (WC2022 chỉ có 32 đội)
-- =============================================

-- Round of 16 (M49-M56)
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('R16', 'Netherlands',  'USA',          '2022-12-03 18:00:00+03', 'open', 49),
('R16', 'Argentina',    'Australia',    '2022-12-03 22:00:00+03', 'open', 50),
('R16', 'France',       'Poland',       '2022-12-04 18:00:00+03', 'open', 51),
('R16', 'England',      'Senegal',      '2022-12-04 22:00:00+03', 'open', 52),
('R16', 'Japan',        'Croatia',      '2022-12-05 18:00:00+03', 'open', 53),
('R16', 'Brasil',       'South Korea',  '2022-12-05 22:00:00+03', 'open', 54),
('R16', 'Morocco',      'Spain',        '2022-12-06 18:00:00+03', 'open', 55),
('R16', 'Portugal',     'Switzerland',  '2022-12-06 22:00:00+03', 'open', 56);

-- Quarter-finals (M57-M60)
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('QF', 'Croatia',    'Brasil',       '2022-12-09 18:00:00+03', 'open', 57),
('QF', 'Netherlands','Argentina',    '2022-12-09 22:00:00+03', 'open', 58),
('QF', 'Morocco',    'Portugal',     '2022-12-10 18:00:00+03', 'open', 59),
('QF', 'England',    'France',       '2022-12-10 22:00:00+03', 'open', 60);

-- Semi-finals (M61-M62)
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('SF', 'Argentina',  'Croatia',      '2022-12-13 22:00:00+03', 'open', 61),
('SF', 'France',     'Morocco',      '2022-12-14 22:00:00+03', 'open', 62);

-- 3rd place & Final (M63-M64)
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('3RD',   'Croatia',   'Morocco',    '2022-12-17 18:00:00+03', 'open', 63),
('FINAL', 'Argentina', 'France',     '2022-12-18 18:00:00+03', 'open', 64);

-- =============================================
-- VERIFY
-- =============================================
SELECT COUNT(*) AS total_matches FROM matches;
SELECT match_group, COUNT(*) AS count
FROM matches
GROUP BY match_group
ORDER BY MIN(match_number);
