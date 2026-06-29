-- =============================================
-- Fix 3 group stage matches with wrong dates (GMT+7)
-- These were Pacific timezone late-night games where
-- the date rollover was calculated incorrectly.
-- =============================================

-- Australia vs Turkey (MD1): was Jun 13, correct is Jun 14
UPDATE matches
SET match_date = '2026-06-14 11:00:00+07'
WHERE home_team = 'Australia' AND away_team = 'Turkey';

-- Turkey vs Paraguay (MD2): was Jun 19 11:00, correct is Jun 20 10:00
UPDATE matches
SET match_date = '2026-06-20 10:00:00+07'
WHERE home_team = 'Turkey' AND away_team = 'Paraguay';

-- Tunisia vs Japan (MD2): was Jun 20, correct is Jun 21
UPDATE matches
SET match_date = '2026-06-21 11:00:00+07'
WHERE home_team = 'Tunisia' AND away_team = 'Japan';

-- Verify
SELECT
  home_team, away_team,
  TO_CHAR(match_date AT TIME ZONE 'Asia/Bangkok', 'DD/MM HH24:MI') AS "Giờ VN (GMT+7)"
FROM matches
WHERE (home_team = 'Australia' AND away_team = 'Turkey')
   OR (home_team = 'Turkey' AND away_team = 'Paraguay')
   OR (home_team = 'Tunisia' AND away_team = 'Japan');
