-- =============================================
-- USABILITY TEST - GROUP ROUND 2: KẾT QUẢ
-- Chạy sau khi hết 10 phút dự đoán
-- Sau đó vào Admin → bấm "Tính điểm" cho từng trận
-- =============================================

-- M7: Brasil 0-0 Japan — Hòa không bàn thắng! (minute = 0)
UPDATE matches SET
  status = 'finished', home_score = 0, away_score = 0, minute = 0
WHERE match_number = 7;

-- M8: Germany 3-1 Morocco (phút 88)
UPDATE matches SET
  status = 'finished', home_score = 3, away_score = 1, minute = 88
WHERE match_number = 8;

-- M9: Argentina 2-1 United States (phút 62)
UPDATE matches SET
  status = 'finished', home_score = 2, away_score = 1, minute = 62
WHERE match_number = 9;

-- M10: England 4-0 Australia (phút 80)
UPDATE matches SET
  status = 'finished', home_score = 4, away_score = 0, minute = 80
WHERE match_number = 10;

-- M11: France 1-0 Netherlands (phút 39)
UPDATE matches SET
  status = 'finished', home_score = 1, away_score = 0, minute = 39
WHERE match_number = 11;

-- M12: Spain 2-1 South Korea (phút 73)
UPDATE matches SET
  status = 'finished', home_score = 2, away_score = 1, minute = 73
WHERE match_number = 12;

-- Verify
SELECT match_number, home_team, away_team,
       home_score || '-' || away_score AS score, minute, status
FROM matches
WHERE match_number BETWEEN 7 AND 12
ORDER BY match_number;
