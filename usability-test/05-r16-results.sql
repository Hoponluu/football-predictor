-- =============================================
-- USABILITY TEST - ROUND OF 16: KẾT QUẢ
-- Sau đó vào Admin → bấm "Tính điểm" + "Tính favorite team"
-- =============================================

-- M89: France 2-1 Belgium (phút 82)
UPDATE matches SET
  status = 'finished', home_score = 2, away_score = 1, minute = 82,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 89;

-- M90: Argentina 1-0 Brasil (phút 64) — Siêu kinh điển!
UPDATE matches SET
  status = 'finished', home_score = 1, away_score = 0, minute = 64,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 90;

-- M91: England 1-1 Netherlands → England PEN 4-3 (phút 120)
UPDATE matches SET
  status = 'finished', home_score = 1, away_score = 1, minute = 120,
  home_penalty = 4, away_penalty = 3
WHERE match_number = 91;

-- M92: Portugal 0-1 Spain (phút 71)
UPDATE matches SET
  status = 'finished', home_score = 0, away_score = 1, minute = 71,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 92;

-- M93: Uruguay 0-2 Japan (phút 77) — Japan tiếp tục gây sốc!
UPDATE matches SET
  status = 'finished', home_score = 0, away_score = 2, minute = 77,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 93;

-- M94: Germany 2-2 Colombia → Germany PEN 5-4 (phút 113)
UPDATE matches SET
  status = 'finished', home_score = 2, away_score = 2, minute = 113,
  home_penalty = 5, away_penalty = 4
WHERE match_number = 94;

-- M95: Denmark 1-0 South Korea (phút 35)
UPDATE matches SET
  status = 'finished', home_score = 1, away_score = 0, minute = 35,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 95;

-- M96: USA 2-1 Morocco (phút 88)
UPDATE matches SET
  status = 'finished', home_score = 2, away_score = 1, minute = 88,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 96;

-- =============================================
-- KẾT QUẢ R16:
-- Đi tiếp (vào QF): France, Argentina, England, Spain,
--                    Japan, Germany, Denmark, USA
-- Bị loại: Belgium, Brasil, Netherlands, Portugal,
--          Uruguay, Colombia, South Korea, Morocco
-- =============================================

-- Verify
SELECT match_number, home_team, away_team,
       home_score || '-' || away_score AS score,
       CASE WHEN home_penalty IS NOT NULL
            THEN '(PEN ' || home_penalty || '-' || away_penalty || ')'
            ELSE '' END AS penalties,
       minute, status
FROM matches
WHERE match_group = 'R16'
ORDER BY match_number;
