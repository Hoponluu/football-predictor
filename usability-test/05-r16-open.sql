-- =============================================
-- USABILITY TEST - ROUND OF 16: MỞ DỰ ĐOÁN
-- 8 trận — Winners từ R32
-- Bracket connections theo FIFA_BRACKET trong bracket-render.js:
--   (M74,M77)→M89, (M73,M75)→M90, (M83,M84)→M93, (M81,M82)→M94
--   (M76,M78)→M91, (M79,M80)→M92, (M86,M88)→M95, (M85,M87)→M96
-- =============================================

-- M89: W74(France) vs W77(Belgium)
UPDATE matches SET
  home_team = 'France', away_team = 'Belgium', status = 'open'
WHERE match_number = 89;

-- M90: W73(Argentina) vs W75(Brasil)
UPDATE matches SET
  home_team = 'Argentina', away_team = 'Brasil', status = 'open'
WHERE match_number = 90;

-- M91: W76(England) vs W78(Netherlands)
UPDATE matches SET
  home_team = 'England', away_team = 'Netherlands', status = 'open'
WHERE match_number = 91;

-- M92: W79(Portugal) vs W80(Spain)
UPDATE matches SET
  home_team = 'Portugal', away_team = 'Spain', status = 'open'
WHERE match_number = 92;

-- M93: W83(Uruguay) vs W84(Japan)
UPDATE matches SET
  home_team = 'Uruguay', away_team = 'Japan', status = 'open'
WHERE match_number = 93;

-- M94: W81(Germany) vs W82(Colombia)
UPDATE matches SET
  home_team = 'Germany', away_team = 'Colombia', status = 'open'
WHERE match_number = 94;

-- M95: W86(Denmark) vs W88(South Korea)
UPDATE matches SET
  home_team = 'Denmark', away_team = 'South Korea', status = 'open'
WHERE match_number = 95;

-- M96: W85(USA) vs W87(Morocco)
UPDATE matches SET
  home_team = 'USA', away_team = 'Morocco', status = 'open'
WHERE match_number = 96;

-- Verify
SELECT match_number, home_team, away_team, status
FROM matches
WHERE match_group = 'R16'
ORDER BY match_number;
