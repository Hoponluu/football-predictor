-- =============================================
-- USABILITY TEST - GROUP ROUND 3: KẾT QUẢ
-- Lượt cuối vòng bảng
-- Sau đó vào Admin → bấm "Tính điểm" cho từng trận
-- =============================================

-- M13: Brasil 1-0 Germany (phút 56)
UPDATE matches SET
  status = 'finished', home_score = 1, away_score = 0, minute = 56
WHERE match_number = 13;

-- M14: Japan 2-1 Morocco (phút 90) — Bàn phút cuối!
UPDATE matches SET
  status = 'finished', home_score = 2, away_score = 1, minute = 90
WHERE match_number = 14;

-- M15: Argentina 1-0 England (phút 45)
UPDATE matches SET
  status = 'finished', home_score = 1, away_score = 0, minute = 45
WHERE match_number = 15;

-- M16: United States 3-2 Australia (phút 92) — Dramatic injury time!
UPDATE matches SET
  status = 'finished', home_score = 3, away_score = 2, minute = 92
WHERE match_number = 16;

-- M17: France 0-1 Spain (phút 33) — Spain bất ngờ thắng!
UPDATE matches SET
  status = 'finished', home_score = 0, away_score = 1, minute = 33
WHERE match_number = 17;

-- M18: Netherlands 2-0 South Korea (phút 68)
UPDATE matches SET
  status = 'finished', home_score = 2, away_score = 0, minute = 68
WHERE match_number = 18;

-- =============================================
-- BẢNG XẾP HẠNG SAU VÒNG BẢNG:
-- Group A: Brasil 7pts (1st), Japan 7pts (2nd), Germany 3pts, Morocco 0pts
-- Group B: Argentina 9pts (1st), England 4pts (2nd), United States 4pts, Australia 0pts
-- Group C: Spain 7pts (1st), France 6pts (2nd), Netherlands 4pts, South Korea 0pts
-- =============================================

-- Verify
SELECT match_number, home_team, away_team,
       home_score || '-' || away_score AS score, minute, status
FROM matches
WHERE match_number BETWEEN 13 AND 18
ORDER BY match_number;
