-- =============================================
-- FIFA World Cup 2026 - Knockout Bracket Setup
-- 1. Add match_number column
-- 2. Assign M1-M72 to group stage (by date order)
-- 3. Insert M73-M104 knockout matches
-- Run on Supabase SQL Editor AFTER seed-matches.sql
-- =============================================

-- =============================================
-- 1. ADD match_number COLUMN (if not exists)
-- =============================================
ALTER TABLE matches ADD COLUMN IF NOT EXISTS match_number INT;

-- =============================================
-- 2. ASSIGN MATCH NUMBERS M1-M72 to group stage
--    Based on chronological order (match_date ASC)
-- =============================================
DO $$
DECLARE
    v_match RECORD;
    v_counter INT := 0;
BEGIN
    FOR v_match IN
        SELECT id
        FROM matches
        WHERE match_group IN ('A','B','C','D','E','F','G','H','I','J','K','L')
        ORDER BY match_date ASC, id ASC
    LOOP
        v_counter := v_counter + 1;
        UPDATE matches SET match_number = v_counter WHERE id = v_match.id;
    END LOOP;

    RAISE NOTICE 'Assigned match numbers M1-M% to group stage', v_counter;
END $$;

-- =============================================
-- 3. INSERT KNOCKOUT MATCHES M73-M104
--    FIFA Official Schedule (Times in GMT+7)
--    Teams shown as positional placeholders (e.g. "1A vs 2B")
-- =============================================

-- ----- ROUND OF 32 (M73-M88) -----
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
-- June 28-29 (GMT+7)
('R32', '1A',  '2B',  '2026-06-29 01:00:00+07', 'not-open', 73),  -- M73: Los Angeles
('R32', '1E',  '3rd', '2026-06-29 04:00:00+07', 'not-open', 74),  -- M74: Boston
('R32', '1F',  '2C',  '2026-06-30 01:00:00+07', 'not-open', 75),  -- M75: Monterrey
('R32', '1C',  '2F',  '2026-06-30 04:00:00+07', 'not-open', 76),  -- M76: Houston
('R32', '1I',  '3rd', '2026-06-30 07:00:00+07', 'not-open', 77),  -- M77: New York/NJ
('R32', '2E',  '2I',  '2026-07-01 01:00:00+07', 'not-open', 78),  -- M78: Dallas
('R32', '1A',  '3rd', '2026-07-01 04:00:00+07', 'not-open', 79),  -- M79: Mexico City  (NOTE: 1A placeholder, actual TBD by group results)
('R32', '1L',  '3rd', '2026-07-01 07:00:00+07', 'not-open', 80),  -- M80: Atlanta

-- July 1-3 (GMT+7)
('R32', '1D',  '3rd', '2026-07-02 01:00:00+07', 'not-open', 81),  -- M81: San Francisco
('R32', '1G',  '3rd', '2026-07-02 04:00:00+07', 'not-open', 82),  -- M82: Seattle
('R32', '2K',  '2L',  '2026-07-02 07:00:00+07', 'not-open', 83),  -- M83: Toronto
('R32', '1H',  '2J',  '2026-07-03 01:00:00+07', 'not-open', 84),  -- M84: Los Angeles
('R32', '1B',  '3rd', '2026-07-03 04:00:00+07', 'not-open', 85),  -- M85: Vancouver
('R32', '1J',  '2H',  '2026-07-03 07:00:00+07', 'not-open', 86),  -- M86: Miami
('R32', '1K',  '3rd', '2026-07-04 01:00:00+07', 'not-open', 87),  -- M87: Kansas City
('R32', '2D',  '2G',  '2026-07-04 04:00:00+07', 'not-open', 88);  -- M88: Dallas

-- ----- ROUND OF 16 (M89-M96) -----
-- Bracket connections: (M74,M77)→M89, (M73,M75)→M90, (M76,M78)→M91, (M79,M80)→M92
--                      (M83,M84)→M93, (M81,M82)→M94, (M86,M88)→M95, (M85,M87)→M96
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('R16', 'W74', 'W77', '2026-07-05 01:00:00+07', 'not-open', 89),  -- M89
('R16', 'W73', 'W75', '2026-07-05 04:00:00+07', 'not-open', 90),  -- M90
('R16', 'W76', 'W78', '2026-07-06 01:00:00+07', 'not-open', 91),  -- M91
('R16', 'W79', 'W80', '2026-07-06 04:00:00+07', 'not-open', 92),  -- M92
('R16', 'W83', 'W84', '2026-07-06 07:00:00+07', 'not-open', 93),  -- M93
('R16', 'W81', 'W82', '2026-07-07 01:00:00+07', 'not-open', 94),  -- M94
('R16', 'W86', 'W88', '2026-07-07 04:00:00+07', 'not-open', 95),  -- M95
('R16', 'W85', 'W87', '2026-07-07 07:00:00+07', 'not-open', 96);  -- M96

-- ----- QUARTER-FINALS (M97-M100) -----
-- Bracket connections: (M89,M90)→M97, (M91,M92)→M99, (M93,M94)→M98, (M95,M96)→M100
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('QF', 'W89', 'W90', '2026-07-10 01:00:00+07', 'not-open', 97),  -- M97
('QF', 'W93', 'W94', '2026-07-10 04:00:00+07', 'not-open', 98),  -- M98
('QF', 'W91', 'W92', '2026-07-11 01:00:00+07', 'not-open', 99),  -- M99
('QF', 'W95', 'W96', '2026-07-11 04:00:00+07', 'not-open', 100); -- M100

-- ----- SEMI-FINALS (M101-M102) -----
-- Bracket connections: (M97,M99)→M101, (M98,M100)→M102
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('SF', 'W97', 'W99',  '2026-07-15 04:00:00+07', 'not-open', 101), -- M101
('SF', 'W98', 'W100', '2026-07-16 04:00:00+07', 'not-open', 102); -- M102

-- ----- 3RD PLACE & FINAL (M103-M104) -----
-- Bracket connections: Losers of M101,M102 → M103, Winners → M104
INSERT INTO matches (match_group, home_team, away_team, match_date, status, match_number) VALUES
('3RD',   'L101', 'L102', '2026-07-19 04:00:00+07', 'not-open', 103), -- M103: 3rd place
('FINAL', 'W101', 'W102', '2026-07-20 04:00:00+07', 'not-open', 104); -- M104: Final

-- =============================================
-- VERIFY
-- =============================================
SELECT match_number, match_group, home_team, away_team,
       match_date AT TIME ZONE 'Asia/Bangkok' AS match_date_gmt7,
       status
FROM matches
WHERE match_number IS NOT NULL
ORDER BY match_number;
