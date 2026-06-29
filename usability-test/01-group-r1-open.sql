-- =============================================
-- USABILITY TEST - GROUP ROUND 1: MỞ DỰ ĐOÁN
-- Chạy SQL này để mở 6 trận vòng bảng lượt 1
-- User có 10 phút để dự đoán (match_date = NOW + 10')
-- =============================================

UPDATE matches SET
  status = 'open',
  match_date = (NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh' + INTERVAL '10 minutes')
WHERE match_number BETWEEN 1 AND 6;

-- Verify
SELECT match_number, home_team, away_team, status,
       match_date AT TIME ZONE 'Asia/Ho_Chi_Minh' AS deadline_gmt7,
       EXTRACT(EPOCH FROM (match_date - NOW())) / 60 AS minutes_remaining
FROM matches
WHERE match_number BETWEEN 1 AND 6
ORDER BY match_number;
