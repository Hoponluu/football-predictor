-- =============================================
-- FIFA World Cup 2026 - Group Stage Matches
-- All 72 matches (12 groups x 6 matches each)
-- Times in UTC (converted from ET + 4 hours)
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

-- June 11 (Thursday) - Opening Day
('A', 'Mexico', 'South Africa',        '2026-06-11T19:00:00Z', 'not-open'),
('A', 'South Korea', 'TBU',            '2026-06-12T02:00:00Z', 'not-open'),

-- June 12 (Friday)
('B', 'Canada', 'TBU',                 '2026-06-12T19:00:00Z', 'not-open'),
('D', 'United States', 'Paraguay',     '2026-06-13T01:00:00Z', 'not-open'),

-- June 13 (Saturday)
('D', 'Australia', 'TBU',              '2026-06-13T04:00:00Z', 'not-open'),
('B', 'Qatar', 'Switzerland',          '2026-06-13T19:00:00Z', 'not-open'),
('C', 'Brasil', 'Morocco',             '2026-06-13T22:00:00Z', 'not-open'),
('C', 'Haiti', 'Scotland',             '2026-06-14T01:00:00Z', 'not-open'),

-- June 14 (Sunday)
('E', 'Germany', 'Curaçao',            '2026-06-14T17:00:00Z', 'not-open'),
('F', 'Netherlands', 'Japan',          '2026-06-14T20:00:00Z', 'not-open'),
('E', 'Ivory Coast', 'Ecuador',        '2026-06-14T23:00:00Z', 'not-open'),
('F', 'Tunisia', 'TBU',                '2026-06-15T02:00:00Z', 'not-open'),

-- June 15 (Monday)
('H', 'Spain', 'Cape Verde',           '2026-06-15T16:00:00Z', 'not-open'),
('G', 'Belgium', 'Egypt',              '2026-06-15T19:00:00Z', 'not-open'),
('H', 'Saudi Arabia', 'Uruguay',       '2026-06-15T22:00:00Z', 'not-open'),
('G', 'Iran', 'New Zealand',           '2026-06-16T01:00:00Z', 'not-open'),

-- June 16 (Tuesday)
('I', 'France', 'Senegal',             '2026-06-16T19:00:00Z', 'not-open'),
('I', 'TBU', 'Norway',                 '2026-06-16T22:00:00Z', 'not-open'),
('J', 'Argentina', 'Algeria',          '2026-06-17T01:00:00Z', 'not-open'),
('J', 'Austria', 'Jordan',             '2026-06-17T04:00:00Z', 'not-open'),

-- June 17 (Wednesday)
('K', 'Portugal', 'TBU',               '2026-06-17T17:00:00Z', 'not-open'),
('L', 'England', 'Croatia',            '2026-06-17T20:00:00Z', 'not-open'),
('L', 'Ghana', 'Panama',               '2026-06-17T23:00:00Z', 'not-open'),
('K', 'Uzbekistan', 'Colombia',        '2026-06-18T02:00:00Z', 'not-open'),

-- =============================================
-- MATCHDAY 2
-- =============================================

-- June 18 (Thursday)
('A', 'South Africa', 'TBU',           '2026-06-18T16:00:00Z', 'not-open'),
('B', 'Switzerland', 'TBU',            '2026-06-18T19:00:00Z', 'not-open'),
('B', 'Canada', 'Qatar',               '2026-06-18T22:00:00Z', 'not-open'),
('A', 'Mexico', 'South Korea',         '2026-06-19T01:00:00Z', 'not-open'),

-- June 19 (Friday)
('C', 'Scotland', 'Morocco',           '2026-06-19T19:00:00Z', 'not-open'),
('D', 'United States', 'Australia',    '2026-06-19T19:00:00Z', 'not-open'),
('C', 'Brasil', 'Haiti',               '2026-06-20T01:00:00Z', 'not-open'),
('D', 'Paraguay', 'TBU',               '2026-06-20T04:00:00Z', 'not-open'),

-- June 20 (Saturday)
('F', 'Netherlands', 'TBU',            '2026-06-20T17:00:00Z', 'not-open'),
('E', 'Germany', 'Ivory Coast',        '2026-06-20T20:00:00Z', 'not-open'),
('E', 'Ecuador', 'Curaçao',            '2026-06-21T00:00:00Z', 'not-open'),
('F', 'Tunisia', 'Japan',              '2026-06-21T04:00:00Z', 'not-open'),

-- June 21 (Sunday)
('H', 'Spain', 'Saudi Arabia',         '2026-06-21T16:00:00Z', 'not-open'),
('G', 'Belgium', 'Iran',               '2026-06-21T19:00:00Z', 'not-open'),
('H', 'Uruguay', 'Cape Verde',         '2026-06-21T22:00:00Z', 'not-open'),
('G', 'New Zealand', 'Egypt',          '2026-06-22T01:00:00Z', 'not-open'),

-- June 22 (Monday)
('J', 'Argentina', 'Austria',          '2026-06-22T17:00:00Z', 'not-open'),
('I', 'France', 'TBU',                 '2026-06-22T21:00:00Z', 'not-open'),
('I', 'Norway', 'Senegal',             '2026-06-23T00:00:00Z', 'not-open'),
('J', 'Jordan', 'Algeria',             '2026-06-23T03:00:00Z', 'not-open'),

-- June 23 (Tuesday)
('K', 'Portugal', 'Uzbekistan',        '2026-06-23T17:00:00Z', 'not-open'),
('L', 'England', 'Ghana',              '2026-06-23T20:00:00Z', 'not-open'),
('L', 'Panama', 'Croatia',             '2026-06-23T23:00:00Z', 'not-open'),
('K', 'Colombia', 'TBU',               '2026-06-24T02:00:00Z', 'not-open'),

-- =============================================
-- MATCHDAY 3 (Simultaneous kick-offs per group)
-- =============================================

-- June 24 (Wednesday)
('B', 'Switzerland', 'Canada',         '2026-06-24T19:00:00Z', 'not-open'),
('B', 'TBU', 'Qatar',                  '2026-06-24T19:00:00Z', 'not-open'),
('C', 'Scotland', 'Brasil',            '2026-06-24T22:00:00Z', 'not-open'),
('C', 'Morocco', 'Haiti',              '2026-06-24T22:00:00Z', 'not-open'),
('A', 'TBU', 'Mexico',                 '2026-06-25T01:00:00Z', 'not-open'),
('A', 'South Africa', 'South Korea',   '2026-06-25T01:00:00Z', 'not-open'),

-- June 25 (Thursday)
('E', 'Ecuador', 'Germany',            '2026-06-25T20:00:00Z', 'not-open'),
('E', 'Curaçao', 'Ivory Coast',        '2026-06-25T20:00:00Z', 'not-open'),
('F', 'Tunisia', 'Netherlands',        '2026-06-25T23:00:00Z', 'not-open'),
('F', 'Japan', 'TBU',                  '2026-06-25T23:00:00Z', 'not-open'),
('D', 'TBU', 'United States',          '2026-06-26T02:00:00Z', 'not-open'),
('D', 'Paraguay', 'Australia',         '2026-06-26T02:00:00Z', 'not-open'),

-- June 26 (Friday)
('I', 'Norway', 'France',              '2026-06-26T19:00:00Z', 'not-open'),
('I', 'Senegal', 'TBU',               '2026-06-26T19:00:00Z', 'not-open'),
('H', 'Uruguay', 'Spain',              '2026-06-27T00:00:00Z', 'not-open'),
('H', 'Cape Verde', 'Saudi Arabia',    '2026-06-27T00:00:00Z', 'not-open'),
('G', 'New Zealand', 'Belgium',        '2026-06-27T03:00:00Z', 'not-open'),
('G', 'Egypt', 'Iran',                 '2026-06-27T03:00:00Z', 'not-open'),

-- June 27 (Saturday) - Final Group Stage Day
('L', 'Panama', 'England',             '2026-06-27T21:00:00Z', 'not-open'),
('L', 'Croatia', 'Ghana',              '2026-06-27T21:00:00Z', 'not-open'),
('K', 'Colombia', 'Portugal',          '2026-06-27T23:30:00Z', 'not-open'),
('K', 'TBU', 'Uzbekistan',             '2026-06-27T23:30:00Z', 'not-open'),
('J', 'Jordan', 'Argentina',           '2026-06-28T02:00:00Z', 'not-open'),
('J', 'Algeria', 'Austria',            '2026-06-28T02:00:00Z', 'not-open');
