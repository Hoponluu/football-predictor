-- =============================================
-- FIFA World Cup 2026 - Group Stage Matches
-- All 72 matches (12 groups x 6 matches each)
-- Times in GMT+7 (Vietnam time)
-- Draw: December 5, 2025, Washington D.C.
-- =============================================
-- NOTE: Teams marked 'TBU' are pending UEFA/Intercontinental playoffs (March 2026)
--   UEFA Playoff A: Italy / Northern Ireland / Wales / Bosnia & Herzegovina
--   UEFA Playoff B: Ukraine / Poland / Albania / Sweden
--   UEFA Playoff C: Slovakia / Kosovo / Turkiye / Romania
--   UEFA Playoff D: Denmark / North Macedonia / Czechia / Republic of Ireland
--   Intercontinental Playoff 1: DR Congo / Jamaica / New Caledonia
--   Intercontinental Playoff 2: Bolivia / Suriname / Iraq
-- =============================================

INSERT INTO matches (match_group, home_team, away_team, match_date, status) VALUES

-- =============================================
-- MATCHDAY 1
-- =============================================

-- 12/06 (Thu) - Opening Day
('A', 'Mexico', 'South Africa',        '2026-06-12 02:00:00+07', 'not-open'),       -- 2h00
('A', 'South Korea', 'TBU',            '2026-06-12 09:00:00+07', 'not-open'),       -- 9h00

-- 13/06 (Fri)
('B', 'Canada', 'TBU',                 '2026-06-13 02:00:00+07', 'not-open'),       -- 2h00
('D', 'United States', 'Paraguay',     '2026-06-13 08:00:00+07', 'not-open'),       -- 8h00

-- 13-14/06 (Sat)
('D', 'Australia', 'TBU',              '2026-06-13 11:00:00+07', 'not-open'),       -- 11h00
('B', 'Qatar', 'Switzerland',          '2026-06-14 02:00:00+07', 'not-open'),       -- 2h00
('C', 'Brasil', 'Morocco',             '2026-06-14 05:00:00+07', 'not-open'),       -- 5h00
('C', 'Haiti', 'Scotland',             '2026-06-14 08:00:00+07', 'not-open'),       -- 8h00

-- 15/06 (Sun)
('E', 'Germany', 'Curaçao',            '2026-06-15 00:00:00+07', 'not-open'),       -- 0h00
('F', 'Netherlands', 'Japan',          '2026-06-15 03:00:00+07', 'not-open'),       -- 3h00
('E', 'Ivory Coast', 'Ecuador',        '2026-06-15 06:00:00+07', 'not-open'),       -- 6h00
('F', 'Tunisia', 'TBU',                '2026-06-15 09:00:00+07', 'not-open'),       -- 9h00

-- 15-16/06 (Mon)
('H', 'Spain', 'Cape Verde',           '2026-06-15 23:00:00+07', 'not-open'),       -- 23h00
('G', 'Belgium', 'Egypt',              '2026-06-16 02:00:00+07', 'not-open'),       -- 2h00
('H', 'Saudi Arabia', 'Uruguay',       '2026-06-16 05:00:00+07', 'not-open'),       -- 5h00
('G', 'Iran', 'New Zealand',           '2026-06-16 08:00:00+07', 'not-open'),       -- 8h00

-- 17/06 (Tue)
('I', 'France', 'Senegal',             '2026-06-17 02:00:00+07', 'not-open'),       -- 2h00
('I', 'TBU', 'Norway',                 '2026-06-17 05:00:00+07', 'not-open'),       -- 5h00
('J', 'Argentina', 'Algeria',          '2026-06-17 08:00:00+07', 'not-open'),       -- 8h00
('J', 'Austria', 'Jordan',             '2026-06-17 11:00:00+07', 'not-open'),       -- 11h00

-- 18/06 (Wed)
('K', 'Portugal', 'TBU',               '2026-06-18 00:00:00+07', 'not-open'),       -- 0h00
('L', 'England', 'Croatia',            '2026-06-18 03:00:00+07', 'not-open'),       -- 3h00
('L', 'Ghana', 'Panama',               '2026-06-18 06:00:00+07', 'not-open'),       -- 6h00
('K', 'Uzbekistan', 'Colombia',        '2026-06-18 09:00:00+07', 'not-open'),       -- 9h00

-- =============================================
-- MATCHDAY 2
-- =============================================

-- 18-19/06 (Thu)
('A', 'South Africa', 'TBU',           '2026-06-18 23:00:00+07', 'not-open'),       -- 23h00
('B', 'Switzerland', 'TBU',            '2026-06-19 02:00:00+07', 'not-open'),       -- 2h00
('B', 'Canada', 'Qatar',               '2026-06-19 05:00:00+07', 'not-open'),       -- 5h00
('A', 'Mexico', 'South Korea',         '2026-06-19 08:00:00+07', 'not-open'),       -- 8h00

-- 20/06 (Fri)
('C', 'Scotland', 'Morocco',           '2026-06-20 02:00:00+07', 'not-open'),       -- 2h00
('D', 'United States', 'Australia',    '2026-06-20 02:00:00+07', 'not-open'),       -- 2h00
('C', 'Brasil', 'Haiti',               '2026-06-20 08:00:00+07', 'not-open'),       -- 8h00
('D', 'Paraguay', 'TBU',               '2026-06-20 11:00:00+07', 'not-open'),       -- 11h00

-- 21/06 (Sat)
('F', 'Netherlands', 'TBU',            '2026-06-21 00:00:00+07', 'not-open'),       -- 0h00
('E', 'Germany', 'Ivory Coast',        '2026-06-21 03:00:00+07', 'not-open'),       -- 3h00
('E', 'Ecuador', 'Curaçao',            '2026-06-21 07:00:00+07', 'not-open'),       -- 7h00
('F', 'Tunisia', 'Japan',              '2026-06-21 11:00:00+07', 'not-open'),       -- 11h00

-- 21-22/06 (Sun)
('H', 'Spain', 'Saudi Arabia',         '2026-06-21 23:00:00+07', 'not-open'),       -- 23h00
('G', 'Belgium', 'Iran',               '2026-06-22 02:00:00+07', 'not-open'),       -- 2h00
('H', 'Uruguay', 'Cape Verde',         '2026-06-22 05:00:00+07', 'not-open'),       -- 5h00
('G', 'New Zealand', 'Egypt',          '2026-06-22 08:00:00+07', 'not-open'),       -- 8h00

-- 23/06 (Mon)
('J', 'Argentina', 'Austria',          '2026-06-23 00:00:00+07', 'not-open'),       -- 0h00
('I', 'France', 'TBU',                 '2026-06-23 04:00:00+07', 'not-open'),       -- 4h00
('I', 'Norway', 'Senegal',             '2026-06-23 07:00:00+07', 'not-open'),       -- 7h00
('J', 'Jordan', 'Algeria',             '2026-06-23 10:00:00+07', 'not-open'),       -- 10h00

-- 24/06 (Tue)
('K', 'Portugal', 'Uzbekistan',        '2026-06-24 00:00:00+07', 'not-open'),       -- 0h00
('L', 'England', 'Ghana',              '2026-06-24 03:00:00+07', 'not-open'),       -- 3h00
('L', 'Panama', 'Croatia',             '2026-06-24 06:00:00+07', 'not-open'),       -- 6h00
('K', 'Colombia', 'TBU',               '2026-06-24 09:00:00+07', 'not-open'),       -- 9h00

-- =============================================
-- MATCHDAY 3 (Simultaneous kick-offs per group)
-- =============================================

-- 25/06 (Wed)
('B', 'Switzerland', 'Canada',         '2026-06-25 02:00:00+07', 'not-open'),       -- 2h00
('B', 'TBU', 'Qatar',                  '2026-06-25 02:00:00+07', 'not-open'),       -- 2h00
('C', 'Scotland', 'Brasil',            '2026-06-25 05:00:00+07', 'not-open'),       -- 5h00
('C', 'Morocco', 'Haiti',              '2026-06-25 05:00:00+07', 'not-open'),       -- 5h00
('A', 'TBU', 'Mexico',                 '2026-06-25 08:00:00+07', 'not-open'),       -- 8h00
('A', 'South Africa', 'South Korea',   '2026-06-25 08:00:00+07', 'not-open'),       -- 8h00

-- 26/06 (Thu)
('E', 'Ecuador', 'Germany',            '2026-06-26 03:00:00+07', 'not-open'),       -- 3h00
('E', 'Curaçao', 'Ivory Coast',        '2026-06-26 03:00:00+07', 'not-open'),       -- 3h00
('F', 'Tunisia', 'Netherlands',        '2026-06-26 06:00:00+07', 'not-open'),       -- 6h00
('F', 'Japan', 'TBU',                  '2026-06-26 06:00:00+07', 'not-open'),       -- 6h00
('D', 'TBU', 'United States',          '2026-06-26 09:00:00+07', 'not-open'),       -- 9h00
('D', 'Paraguay', 'Australia',         '2026-06-26 09:00:00+07', 'not-open'),       -- 9h00

-- 27/06 (Fri)
('I', 'Norway', 'France',              '2026-06-27 02:00:00+07', 'not-open'),       -- 2h00
('I', 'Senegal', 'TBU',                '2026-06-27 02:00:00+07', 'not-open'),       -- 2h00
('H', 'Uruguay', 'Spain',              '2026-06-27 07:00:00+07', 'not-open'),       -- 7h00
('H', 'Cape Verde', 'Saudi Arabia',    '2026-06-27 07:00:00+07', 'not-open'),       -- 7h00
('G', 'New Zealand', 'Belgium',        '2026-06-27 10:00:00+07', 'not-open'),       -- 10h00
('G', 'Egypt', 'Iran',                 '2026-06-27 10:00:00+07', 'not-open'),       -- 10h00

-- 28/06 (Sat) - Final Group Stage Day
('L', 'Panama', 'England',             '2026-06-28 04:00:00+07', 'not-open'),       -- 4h00
('L', 'Croatia', 'Ghana',              '2026-06-28 04:00:00+07', 'not-open'),       -- 4h00
('K', 'Colombia', 'Portugal',          '2026-06-28 06:30:00+07', 'not-open'),       -- 6h30
('K', 'TBU', 'Uzbekistan',             '2026-06-28 06:30:00+07', 'not-open'),       -- 6h30
('J', 'Jordan', 'Argentina',           '2026-06-28 09:00:00+07', 'not-open'),       -- 9h00
('J', 'Algeria', 'Austria',            '2026-06-28 09:00:00+07', 'not-open');       -- 9h00
