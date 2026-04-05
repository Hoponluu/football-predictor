-- =============================================
-- FIFA World Cup 2026 - Group Stage Matches (CONFIRMED)
-- All 72 matches - 12 groups x 6 matches each
-- Times in GMT+7 (Vietnam time)
-- =============================================
-- Sources: FIFA Final Draw (Dec 5, 2025) + Confirmed Playoffs
--
-- Playoff Results:
--   UEFA Playoff A: Bosnia & Herzegovina
--   UEFA Playoff B: Sweden
--   UEFA Playoff C: Türkiye
--   UEFA Playoff D: Czech Republic
--   Intercontinental Playoff 1: DR Congo
--   Intercontinental Playoff 2: Iraq
-- =============================================
--
-- CÁCH DÙNG:
-- 1. Chạy clear-everything.sql trước (nếu cần xóa data cũ)
-- 2. Chạy file này trên Supabase SQL Editor
-- 3. Kiểm tra kết quả ở cuối
-- =============================================

-- Xóa matches cũ (nếu có)
DELETE FROM predictions;
DELETE FROM matches WHERE match_group IN ('A','B','C','D','E','F','G','H','I','J','K','L');

INSERT INTO matches (match_group, home_team, away_team, match_date, status) VALUES

-- =============================================
-- MATCHDAY 1
-- =============================================

-- 11/06 (Thu) - Opening Day
('A', 'Mexico',         'South Africa',            '2026-06-12 02:00:00+07', 'not-open'),  -- M1  | Jun 11 3PM ET  | Estadio Azteca, Mexico City
('A', 'South Korea',    'Czech Republic',           '2026-06-12 09:00:00+07', 'not-open'),  -- M2  | Jun 11 10PM ET | Estadio Akron, Guadalajara

-- 12/06 (Fri)
('B', 'Canada',         'Bosnia & Herzegovina',     '2026-06-13 02:00:00+07', 'not-open'),  -- M7  | Jun 12 3PM ET  | BMO Field, Toronto
('D', 'United States',  'Paraguay',                 '2026-06-13 08:00:00+07', 'not-open'),  -- M19 | Jun 12 9PM ET  | SoFi Stadium, Inglewood
('D', 'Australia',      'Turkey',                  '2026-06-13 11:00:00+07', 'not-open'),  -- M20 | Jun 13 12AM ET | BC Place, Vancouver

-- 13/06 (Sat)
('B', 'Qatar',          'Switzerland',              '2026-06-14 02:00:00+07', 'not-open'),  -- M8  | Jun 13 3PM ET  | Levi's Stadium, Santa Clara
('C', 'Brasil',         'Morocco',                  '2026-06-14 05:00:00+07', 'not-open'),  -- M13 | Jun 13 6PM ET  | MetLife Stadium, East Rutherford
('C', 'Haiti',          'Scotland',                 '2026-06-14 08:00:00+07', 'not-open'),  -- M14 | Jun 13 9PM ET  | Gillette Stadium, Foxboro

-- 14/06 (Sun)
('E', 'Germany',        'Curaçao',                  '2026-06-15 00:00:00+07', 'not-open'),  -- M25 | Jun 14 1PM ET  | NRG Stadium, Houston
('F', 'Netherlands',    'Japan',                    '2026-06-15 03:00:00+07', 'not-open'),  -- M31 | Jun 14 4PM ET  | AT&T Stadium, Arlington
('E', 'Ivory Coast',    'Ecuador',                  '2026-06-15 06:00:00+07', 'not-open'),  -- M26 | Jun 14 7PM ET  | Lincoln Financial Field, Philadelphia
('F', 'Sweden',         'Tunisia',                  '2026-06-15 09:00:00+07', 'not-open'),  -- M32 | Jun 14 10PM ET | Estadio BBVA, Monterrey

-- 15/06 (Mon)
('H', 'Spain',          'Cape Verde',               '2026-06-15 23:00:00+07', 'not-open'),  -- M43 | Jun 15 12PM ET | Mercedes-Benz Stadium, Atlanta
('G', 'Belgium',        'Egypt',                    '2026-06-16 02:00:00+07', 'not-open'),  -- M37 | Jun 15 3PM ET  | Lumen Field, Seattle
('H', 'Saudi Arabia',   'Uruguay',                  '2026-06-16 05:00:00+07', 'not-open'),  -- M44 | Jun 15 6PM ET  | Hard Rock Stadium, Miami
('G', 'Iran',           'New Zealand',              '2026-06-16 08:00:00+07', 'not-open'),  -- M38 | Jun 15 9PM ET  | SoFi Stadium, Inglewood

-- 16/06 (Tue)
('I', 'France',         'Senegal',                  '2026-06-17 02:00:00+07', 'not-open'),  -- M49 | Jun 16 3PM ET  | MetLife Stadium, East Rutherford
('I', 'Iraq',           'Norway',                   '2026-06-17 05:00:00+07', 'not-open'),  -- M50 | Jun 16 6PM ET  | Gillette Stadium, Foxboro
('J', 'Argentina',      'Algeria',                  '2026-06-17 08:00:00+07', 'not-open'),  -- M55 | Jun 16 9PM ET  | Arrowhead Stadium, Kansas City
('J', 'Austria',        'Jordan',                   '2026-06-17 11:00:00+07', 'not-open'),  -- M56 | Jun 17 12AM ET | Levi's Stadium, Santa Clara

-- 17/06 (Wed)
('K', 'Portugal',       'DR Congo',                 '2026-06-18 00:00:00+07', 'not-open'),  -- M61 | Jun 17 1PM ET  | NRG Stadium, Houston
('L', 'England',        'Croatia',                  '2026-06-18 03:00:00+07', 'not-open'),  -- M67 | Jun 17 4PM ET  | AT&T Stadium, Arlington
('L', 'Ghana',          'Panama',                   '2026-06-18 06:00:00+07', 'not-open'),  -- M68 | Jun 17 7PM ET  | BMO Field, Toronto
('K', 'Uzbekistan',     'Colombia',                 '2026-06-18 09:00:00+07', 'not-open'),  -- M62 | Jun 17 10PM ET | Estadio Azteca, Mexico City

-- =============================================
-- MATCHDAY 2
-- =============================================

-- 18/06 (Thu)
('A', 'Czech Republic',          'South Africa',    '2026-06-18 23:00:00+07', 'not-open'),  -- M3  | Jun 18 12PM ET | Mercedes-Benz Stadium, Atlanta
('B', 'Switzerland',             'Bosnia & Herzegovina', '2026-06-19 02:00:00+07', 'not-open'),  -- M9  | Jun 18 3PM ET  | SoFi Stadium, Inglewood
('B', 'Canada',                  'Qatar',           '2026-06-19 05:00:00+07', 'not-open'),  -- M10 | Jun 18 6PM ET  | BC Place, Vancouver
('A', 'Mexico',                  'South Korea',     '2026-06-19 08:00:00+07', 'not-open'),  -- M4  | Jun 18 9PM ET  | Estadio Akron, Guadalajara

-- 19/06 (Fri)
('D', 'Turkey',                 'Paraguay',        '2026-06-19 11:00:00+07', 'not-open'),  -- M21 | Jun 19 12AM ET | Levi's Stadium, Santa Clara
('D', 'United States',           'Australia',       '2026-06-20 02:00:00+07', 'not-open'),  -- M22 | Jun 19 3PM ET  | Lumen Field, Seattle
('C', 'Scotland',                'Morocco',         '2026-06-20 05:00:00+07', 'not-open'),  -- M15 | Jun 19 6PM ET  | Gillette Stadium, Foxboro
('C', 'Brasil',                  'Haiti',           '2026-06-20 08:00:00+07', 'not-open'),  -- M16 | Jun 19 9PM ET  | Lincoln Financial Field, Philadelphia

-- 20/06 (Sat)
('F', 'Tunisia',                 'Japan',           '2026-06-20 11:00:00+07', 'not-open'),  -- M34 | Jun 20 12AM ET | Estadio BBVA, Monterrey
('F', 'Netherlands',             'Sweden',          '2026-06-21 00:00:00+07', 'not-open'),  -- M33 | Jun 20 1PM ET  | NRG Stadium, Houston
('E', 'Germany',                 'Ivory Coast',     '2026-06-21 03:00:00+07', 'not-open'),  -- M27 | Jun 20 4PM ET  | BMO Field, Toronto
('E', 'Ecuador',                 'Curaçao',         '2026-06-21 07:00:00+07', 'not-open'),  -- M28 | Jun 20 8PM ET  | Arrowhead Stadium, Kansas City

-- 21/06 (Sun)
('H', 'Spain',                   'Saudi Arabia',    '2026-06-21 23:00:00+07', 'not-open'),  -- M45 | Jun 21 12PM ET | Mercedes-Benz Stadium, Atlanta
('G', 'Belgium',                 'Iran',            '2026-06-22 02:00:00+07', 'not-open'),  -- M39 | Jun 21 3PM ET  | SoFi Stadium, Inglewood
('H', 'Uruguay',                 'Cape Verde',      '2026-06-22 05:00:00+07', 'not-open'),  -- M46 | Jun 21 6PM ET  | Hard Rock Stadium, Miami
('G', 'New Zealand',             'Egypt',           '2026-06-22 08:00:00+07', 'not-open'),  -- M40 | Jun 21 9PM ET  | BC Place, Vancouver

-- 22/06 (Mon)
('J', 'Argentina',               'Austria',         '2026-06-23 00:00:00+07', 'not-open'),  -- M57 | Jun 22 1PM ET  | AT&T Stadium, Arlington
('I', 'France',                  'Iraq',            '2026-06-23 04:00:00+07', 'not-open'),  -- M51 | Jun 22 5PM ET  | Lincoln Financial Field, Philadelphia
('I', 'Norway',                  'Senegal',         '2026-06-23 07:00:00+07', 'not-open'),  -- M52 | Jun 22 8PM ET  | MetLife Stadium, East Rutherford
('J', 'Jordan',                  'Algeria',         '2026-06-23 10:00:00+07', 'not-open'),  -- M58 | Jun 22 11PM ET | Levi's Stadium, Santa Clara

-- 23/06 (Tue)
('K', 'Portugal',                'Uzbekistan',      '2026-06-24 00:00:00+07', 'not-open'),  -- M63 | Jun 23 1PM ET  | NRG Stadium, Houston
('L', 'England',                 'Ghana',           '2026-06-24 03:00:00+07', 'not-open'),  -- M69 | Jun 23 4PM ET  | Gillette Stadium, Foxboro
('L', 'Panama',                  'Croatia',         '2026-06-24 06:00:00+07', 'not-open'),  -- M70 | Jun 23 7PM ET  | BMO Field, Toronto
('K', 'Colombia',                'DR Congo',        '2026-06-24 09:00:00+07', 'not-open'),  -- M64 | Jun 23 10PM ET | Estadio Akron, Guadalajara

-- =============================================
-- MATCHDAY 3 (Simultaneous kick-offs per group)
-- =============================================

-- 24/06 (Wed)
('B', 'Switzerland',    'Canada',                   '2026-06-25 02:00:00+07', 'not-open'),  -- M11 | Jun 24 3PM ET  | BC Place, Vancouver
('B', 'Bosnia & Herzegovina', 'Qatar',              '2026-06-25 02:00:00+07', 'not-open'),  -- M12 | Jun 24 3PM ET  | Lumen Field, Seattle
('C', 'Scotland',       'Brasil',                   '2026-06-25 05:00:00+07', 'not-open'),  -- M17 | Jun 24 6PM ET  | Hard Rock Stadium, Miami
('C', 'Morocco',        'Haiti',                    '2026-06-25 05:00:00+07', 'not-open'),  -- M18 | Jun 24 6PM ET  | Mercedes-Benz Stadium, Atlanta
('A', 'Czech Republic', 'Mexico',                   '2026-06-25 08:00:00+07', 'not-open'),  -- M5  | Jun 24 9PM ET  | Estadio Azteca, Mexico City
('A', 'South Africa',   'South Korea',              '2026-06-25 08:00:00+07', 'not-open'),  -- M6  | Jun 24 9PM ET  | Estadio BBVA, Monterrey

-- 25/06 (Thu)
('E', 'Curaçao',        'Ivory Coast',              '2026-06-26 03:00:00+07', 'not-open'),  -- M29 | Jun 25 4PM ET  | Lincoln Financial Field, Philadelphia
('E', 'Ecuador',        'Germany',                  '2026-06-26 03:00:00+07', 'not-open'),  -- M30 | Jun 25 4PM ET  | MetLife Stadium, East Rutherford
('F', 'Tunisia',        'Netherlands',              '2026-06-26 06:00:00+07', 'not-open'),  -- M36 | Jun 25 7PM ET  | Arrowhead Stadium, Kansas City
('F', 'Japan',          'Sweden',                   '2026-06-26 06:00:00+07', 'not-open'),  -- M35 | Jun 25 7PM ET  | AT&T Stadium, Arlington
('D', 'Turkey',        'United States',            '2026-06-26 09:00:00+07', 'not-open'),  -- M23 | Jun 25 10PM ET | SoFi Stadium, Inglewood
('D', 'Paraguay',       'Australia',                '2026-06-26 09:00:00+07', 'not-open'),  -- M24 | Jun 25 10PM ET | Levi's Stadium, Santa Clara

-- 26/06 (Fri)
('I', 'Norway',         'France',                   '2026-06-27 02:00:00+07', 'not-open'),  -- M53 | Jun 26 3PM ET  | Gillette Stadium, Foxboro
('I', 'Senegal',        'Iraq',                     '2026-06-27 02:00:00+07', 'not-open'),  -- M54 | Jun 26 3PM ET  | BMO Field, Toronto
('H', 'Uruguay',        'Spain',                    '2026-06-27 07:00:00+07', 'not-open'),  -- M48 | Jun 26 8PM ET  | Estadio Akron, Guadalajara
('H', 'Cape Verde',     'Saudi Arabia',             '2026-06-27 07:00:00+07', 'not-open'),  -- M47 | Jun 26 8PM ET  | NRG Stadium, Houston
('G', 'Egypt',          'Iran',                     '2026-06-27 10:00:00+07', 'not-open'),  -- M41 | Jun 26 11PM ET | Lumen Field, Seattle
('G', 'New Zealand',    'Belgium',                  '2026-06-27 10:00:00+07', 'not-open'),  -- M42 | Jun 26 11PM ET | BC Place, Vancouver

-- 27/06 (Sat) - Final Group Stage Day
('L', 'Panama',         'England',                  '2026-06-28 04:00:00+07', 'not-open'),  -- M71 | Jun 27 5PM ET  | MetLife Stadium, East Rutherford
('L', 'Croatia',        'Ghana',                    '2026-06-28 04:00:00+07', 'not-open'),  -- M72 | Jun 27 5PM ET  | Lincoln Financial Field, Philadelphia
('K', 'Colombia',       'Portugal',                 '2026-06-28 06:30:00+07', 'not-open'),  -- M65 | Jun 27 7:30PM ET | Hard Rock Stadium, Miami
('K', 'DR Congo',       'Uzbekistan',               '2026-06-28 06:30:00+07', 'not-open'),  -- M66 | Jun 27 7:30PM ET | Mercedes-Benz Stadium, Atlanta
('J', 'Jordan',         'Argentina',                '2026-06-28 09:00:00+07', 'not-open'),  -- M59 | Jun 27 10PM ET | AT&T Stadium, Arlington
('J', 'Algeria',        'Austria',                  '2026-06-28 09:00:00+07', 'not-open');  -- M60 | Jun 27 10PM ET | Arrowhead Stadium, Kansas City

-- =============================================
-- VERIFY
-- =============================================
SELECT
  match_group AS "Bảng",
  home_team AS "Đội nhà",
  away_team AS "Đội khách",
  TO_CHAR(match_date AT TIME ZONE 'Asia/Bangkok', 'DD/MM HH24:MI') AS "Giờ VN (GMT+7)",
  status AS "Trạng thái"
FROM matches
WHERE match_group IN ('A','B','C','D','E','F','G','H','I','J','K','L')
ORDER BY match_date ASC, match_group ASC;

-- Count
SELECT
  'Tổng trận' AS info,
  COUNT(*) AS total
FROM matches
WHERE match_group IN ('A','B','C','D','E','F','G','H','I','J','K','L');
