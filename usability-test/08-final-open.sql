-- =============================================
-- USABILITY TEST - 3RD PLACE & FINAL: MỞ DỰ ĐOÁN
-- 2 trận cuối cùng của giải
-- Bracket connections: L101,L102 → M103; W101,W102 → M104
-- =============================================

-- M103: 3rd Place — L101(Spain) vs L102(Japan)
UPDATE matches SET
  home_team = 'Spain', away_team = 'Japan', status = 'open'
WHERE match_number = 103;

-- M104: FINAL — W101(Argentina) vs W102(USA)
UPDATE matches SET
  home_team = 'Argentina', away_team = 'USA', status = 'open'
WHERE match_number = 104;

-- Verify
SELECT match_number, match_group, home_team, away_team, status
FROM matches
WHERE match_number IN (103, 104)
ORDER BY match_number;
