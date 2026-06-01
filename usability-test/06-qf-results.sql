-- =============================================
-- USABILITY TEST - QUARTER-FINALS: KẾT QUẢ
-- Sau đó vào Admin → bấm "Tính điểm" + "Tính favorite team"
-- =============================================

-- M97: France 1-2 Argentina (phút 78) — Messi magic!
UPDATE matches SET
  status = 'finished', home_score = 1, away_score = 2, minute = 78,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 97;

-- M98: Japan 1-1 Germany → Japan PEN 4-2 (phút 120) — Japan lại thắng pen!
UPDATE matches SET
  status = 'finished', home_score = 1, away_score = 1, minute = 120,
  home_penalty = 4, away_penalty = 2
WHERE match_number = 98;

-- M99: England 0-1 Spain (phút 52)
UPDATE matches SET
  status = 'finished', home_score = 0, away_score = 1, minute = 52,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 99;

-- M100: Denmark 0-0 United States → USA PEN 5-3 (0-0 tie!)
UPDATE matches SET
  status = 'finished', home_score = 0, away_score = 0, minute = 90,
  home_penalty = 3, away_penalty = 5
WHERE match_number = 100;

-- =============================================
-- KẾT QUẢ QF:
-- Bán kết: Argentina, Japan, Spain, United States
-- Bị loại: France, Germany, England, Denmark
-- =============================================

-- Verify
SELECT match_number, home_team, away_team,
       home_score || '-' || away_score AS score,
       CASE WHEN home_penalty IS NOT NULL
            THEN '(PEN ' || home_penalty || '-' || away_penalty || ')'
            ELSE '' END AS penalties,
       minute, status
FROM matches
WHERE match_group = 'QF'
ORDER BY match_number;
