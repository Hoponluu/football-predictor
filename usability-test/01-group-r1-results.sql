-- =============================================
-- USABILITY TEST - GROUP ROUND 1: KẾT QUẢ
-- Chạy sau khi hết 10 phút dự đoán
-- Sau đó vào Admin → bấm "Tính điểm" cho từng trận
-- =============================================

-- M1: Brasil 2-1 Morocco (phút 78)
UPDATE matches SET
  status = 'finished', home_score = 2, away_score = 1, minute = 78
WHERE match_number = 1;

-- M2: Germany 1-2 Japan (phút 85) — Japan thắng ngược!
UPDATE matches SET
  status = 'finished', home_score = 1, away_score = 2, minute = 85
WHERE match_number = 2;

-- M3: Argentina 3-0 Australia (phút 67)
UPDATE matches SET
  status = 'finished', home_score = 3, away_score = 0, minute = 67
WHERE match_number = 3;

-- M4: England 1-1 United States (phút 55) — Hòa!
UPDATE matches SET
  status = 'finished', home_score = 1, away_score = 1, minute = 55
WHERE match_number = 4;

-- M5: France 2-0 South Korea (phút 71)
UPDATE matches SET
  status = 'finished', home_score = 2, away_score = 0, minute = 71
WHERE match_number = 5;

-- M6: Spain 1-1 Netherlands (phút 44) — Hòa!
UPDATE matches SET
  status = 'finished', home_score = 1, away_score = 1, minute = 44
WHERE match_number = 6;

-- Verify
SELECT match_number, home_team, away_team,
       home_score || '-' || away_score AS score, minute, status
FROM matches
WHERE match_number BETWEEN 1 AND 6
ORDER BY match_number;
