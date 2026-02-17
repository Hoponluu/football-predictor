-- =============================================
-- SIMULATE MATCH RESULTS for first 48 matches
-- Random scores 0-4, minute 45-90, status = 'finished'
-- Run AFTER reset-and-seed.sql
-- =============================================

DO $$
DECLARE
    v_match RECORD;
    v_counter INT := 0;
    v_home_score INT;
    v_away_score INT;
    v_minute INT;
BEGIN
    FOR v_match IN
        SELECT id, home_team, away_team
        FROM matches
        ORDER BY match_date ASC, id ASC
        LIMIT 48
    LOOP
        v_counter := v_counter + 1;

        -- Random score 0-4
        v_home_score := floor(random() * 5)::INT;
        v_away_score := floor(random() * 5)::INT;
        -- Random minute 45-90
        v_minute := 45 + floor(random() * 46)::INT;

        UPDATE matches
        SET home_score = v_home_score,
            away_score = v_away_score,
            minute = v_minute,
            status = 'finished',
            points_calculated = false
        WHERE id = v_match.id;

        RAISE NOTICE '% vs % → %-%  (%'')', v_match.home_team, v_match.away_team, v_home_score, v_away_score, v_minute;
    END LOOP;

    RAISE NOTICE 'Done: % matches finished', v_counter;
END $$;

-- =============================================
-- VERIFY
-- =============================================
SELECT home_team, away_team, home_score, away_score, minute, status
FROM matches
WHERE status = 'finished'
ORDER BY match_date ASC
LIMIT 48;
