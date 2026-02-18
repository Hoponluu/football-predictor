-- =============================================
-- CLEAR EVERYTHING WHEN NEEDED
-- Xoá toàn bộ predictions, matches, reset điểm players
-- Chạy trước khi seed lại từ đầu
-- =============================================

-- 1. Xoá toàn bộ predictions
DELETE FROM predictions;

-- 2. Xoá toàn bộ matches
DELETE FROM matches;

-- 3. Reset điểm players về 0
UPDATE players SET total_points = 0;

-- Verify
SELECT 'predictions' AS table_name, COUNT(*) AS remaining FROM predictions
UNION ALL
SELECT 'matches', COUNT(*) FROM matches;
