-- =============================================
-- USABILITY TEST - GROUP ROUND 2: MỞ DỰ ĐOÁN
-- Chạy SQL này để mở 6 trận vòng bảng lượt 2
-- User có 10 phút để dự đoán
-- =============================================

UPDATE matches SET
  status = 'open',
  match_date = (NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh' + INTERVAL '10 minutes')
WHERE match_number BETWEEN 7 AND 12;

-- Verify
SELECT match_number, home_team, away_team, status,
       match_date AT TIME ZONE 'Asia/Ho_Chi_Minh' AS deadline_gmt7,
       EXTRACT(EPOCH FROM (match_date - NOW())) / 60 AS minutes_remaining
FROM matches
WHERE match_number BETWEEN 7 AND 12
ORDER BY match_number;
