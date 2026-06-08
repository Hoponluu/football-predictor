-- =============================================
-- USABILITY TEST - SEMI-FINALS: MỞ DỰ ĐOÁN
-- 2 trận — Bracket connections:
--   (M97,M99)→M101, (M98,M100)→M102
-- =============================================

-- M101: W97(Argentina) vs W99(Spain)
UPDATE matches SET
  home_team = 'Argentina', away_team = 'Spain', status = 'open'
WHERE match_number = 101;

-- M102: W98(Japan) vs W100(USA)
UPDATE matches SET
  home_team = 'Japan', away_team = 'USA', status = 'open'
WHERE match_number = 102;

-- Verify
SELECT match_number, home_team, away_team, status
FROM matches
WHERE match_group = 'SF'
ORDER BY match_number;
