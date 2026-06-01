-- =============================================
-- USABILITY TEST - SEMI-FINALS: KẾT QUẢ
-- Sau đó vào Admin → bấm "Tính điểm" + "Tính favorite team"
-- =============================================

-- M101: Argentina 2-1 Spain — Extra time! (phút 105)
UPDATE matches SET
  status = 'finished', home_score = 2, away_score = 1, minute = 105,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 101;

-- M102: Japan 1-2 United States (phút 83) — USA vào chung kết!
UPDATE matches SET
  status = 'finished', home_score = 1, away_score = 2, minute = 83,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 102;

-- =============================================
-- KẾT QUẢ SF:
-- Chung kết: Argentina vs United States
-- Tranh hạng 3: Spain vs Japan
-- =============================================

-- Verify
SELECT match_number, home_team, away_team,
       home_score || '-' || away_score AS score, minute, status
FROM matches
WHERE match_group = 'SF'
ORDER BY match_number;
