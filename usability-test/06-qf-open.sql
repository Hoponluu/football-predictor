-- =============================================
-- USABILITY TEST - QUARTER-FINALS: MỞ DỰ ĐOÁN
-- 4 trận — Bracket connections:
--   (M89,M90)→M97, (M93,M94)→M98, (M91,M92)→M99, (M95,M96)→M100
-- =============================================

-- M97: W89(France) vs W90(Argentina)
UPDATE matches SET
  home_team = 'France', away_team = 'Argentina', status = 'open'
WHERE match_number = 97;

-- M98: W93(Japan) vs W94(Germany)
UPDATE matches SET
  home_team = 'Japan', away_team = 'Germany', status = 'open'
WHERE match_number = 98;

-- M99: W91(England) vs W92(Spain)
UPDATE matches SET
  home_team = 'England', away_team = 'Spain', status = 'open'
WHERE match_number = 99;

-- M100: W95(Denmark) vs W96(United States)
UPDATE matches SET
  home_team = 'Denmark', away_team = 'United States', status = 'open'
WHERE match_number = 100;

-- Verify
SELECT match_number, home_team, away_team, status
FROM matches
WHERE match_group = 'QF'
ORDER BY match_number;
