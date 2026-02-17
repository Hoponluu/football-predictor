-- =============================================
-- RESET & SEED DATA for Testing
-- Run on Supabase SQL Editor
-- =============================================

-- =============================================
-- 1. UPDATE MATCH DATES
-- Group stage → 18/02/2026 16:00 GMT+7
-- Knockout → 18/02/2026 17:00 GMT+7
-- =============================================

-- Group stage matches (A-L)
UPDATE matches
SET match_date = '2026-02-18 16:00:00+07'
WHERE match_group IN ('A','B','C','D','E','F','G','H','I','J','K','L');

-- Knockout matches
UPDATE matches
SET match_date = '2026-02-18 17:00:00+07'
WHERE match_group IN ('R32','R16','QF','SF','3RD','FINAL');

-- =============================================
-- 2. SET ALL MATCHES TO OPEN
-- =============================================

UPDATE matches
SET status = 'open',
    home_score = NULL,
    away_score = NULL,
    minute = NULL,
    home_penalty = NULL,
    away_penalty = NULL,
    points_calculated = false;

-- =============================================
-- 3. CLEAR ALL PREDICTIONS & RESET PLAYER POINTS
-- =============================================

-- Delete all predictions
DELETE FROM predictions;

-- Reset all player points
UPDATE players
SET total_points = 0,
    exact_score_count = 0,
    top1_count = 0,
    favorite_points = 0;

-- =============================================
-- 4. CREATE RANDOM PREDICTIONS FOR 4 USERS
--    48 first matches, scores 0-4, minute 45-90
-- =============================================

-- Create predictions using generate_series + random
-- Scores from 0 to 4 (random), minute from 45 to 90 (random)

DO $$
DECLARE
    v_player_id UUID;
    v_match_id UUID;
    v_player_name TEXT;
    v_match_row RECORD;
    v_counter INT := 0;
    v_home_score INT;
    v_away_score INT;
    v_minute INT;
BEGIN
    -- Loop through 4 players
    FOR v_player_name IN
        SELECT unnest(ARRAY['Tuệ', 'Vy', 'Lan', 'Na Bito'])
    LOOP
        -- Get player ID
        SELECT id INTO v_player_id
        FROM players
        WHERE name = v_player_name
        LIMIT 1;

        IF v_player_id IS NULL THEN
            RAISE NOTICE 'Player not found: %', v_player_name;
            CONTINUE;
        END IF;

        -- Get first 48 matches sorted by match_date
        v_counter := 0;
        FOR v_match_row IN
            SELECT id FROM matches
            ORDER BY match_date ASC, id ASC
            LIMIT 48
        LOOP
            v_counter := v_counter + 1;

            -- Random score 0-4 for each team
            v_home_score := floor(random() * 5)::INT;
            v_away_score := floor(random() * 5)::INT;
            -- Random minute 45-90
            v_minute := 45 + floor(random() * 46)::INT;

            INSERT INTO predictions (
                match_id, player_id,
                home_score, away_score, minute,
                total_points, points_rank, points_exact_score, points_minute
            ) VALUES (
                v_match_row.id, v_player_id,
                v_home_score, v_away_score, v_minute,
                0, 0, 0, 0
            )
            ON CONFLICT DO NOTHING;

        END LOOP;

        RAISE NOTICE 'Created % predictions for %', v_counter, v_player_name;
    END LOOP;
END $$;

-- =============================================
-- VERIFY
-- =============================================
SELECT 'Matches' AS item, COUNT(*) AS total,
       COUNT(*) FILTER (WHERE status = 'open') AS open_count
FROM matches
UNION ALL
SELECT 'Predictions', COUNT(*), COUNT(DISTINCT player_id)
FROM predictions
UNION ALL
SELECT 'Players (0 pts)', COUNT(*), COUNT(*) FILTER (WHERE total_points = 0)
FROM players;
