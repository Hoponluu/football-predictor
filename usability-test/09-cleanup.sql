-- =============================================
-- USABILITY TEST - CLEANUP
-- Chạy sau khi kết thúc test session
-- Xóa toàn bộ data test, khôi phục trạng thái ban đầu
-- =============================================

-- Xóa predictions
DELETE FROM predictions;

-- Xóa matches
DELETE FROM matches;

-- Reset player stats
UPDATE players SET
  total_points = 0,
  exact_score_count = 0,
  top1_count = 0,
  favorite_team = NULL,
  favorite_team_status = NULL,
  favorite_points = 0
WHERE id IN (
  SELECT pg.player_id FROM player_groups pg
  JOIN groups g ON g.id = pg.group_id
  WHERE g.code = 'WC2026-DEMO'
);

-- Reset favorite team settings (global setting in scoring_rules)
UPDATE scoring_rules SET
  favorite_team_enabled = true,
  favorite_team_locked = false;

SELECT 'Cleanup complete! Ready for next test session.' AS status;
