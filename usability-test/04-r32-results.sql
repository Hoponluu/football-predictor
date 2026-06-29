-- =============================================
-- USABILITY TEST - ROUND OF 32: KẾT QUẢ
-- Có penalty, extra time, 0-0 để test edge cases
-- Sau đó vào Admin → bấm "Tính điểm" + "Tính favorite team"
-- =============================================

-- M73: Argentina 2-0 Ivory Coast (phút 72) — Bình thường
UPDATE matches SET
  status = 'finished', home_score = 2, away_score = 0, minute = 72,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 73;

-- M74: France 1-1 Chile → France thắng penalty 4-2 (phút cuối ET = 120)
UPDATE matches SET
  status = 'finished', home_score = 1, away_score = 1, minute = 120,
  home_penalty = 4, away_penalty = 2
WHERE match_number = 74;

-- M75: Brasil 3-1 Egypt (phút 81)
UPDATE matches SET
  status = 'finished', home_score = 3, away_score = 1, minute = 81,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 75;

-- M76: England 2-1 Poland (phút 88)
UPDATE matches SET
  status = 'finished', home_score = 2, away_score = 1, minute = 88,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 76;

-- M77: Belgium 0-0 Senegal → Belgium thắng penalty 5-4 (0-0 + PEN!)
UPDATE matches SET
  status = 'finished', home_score = 0, away_score = 0, minute = 0,
  home_penalty = 5, away_penalty = 4
WHERE match_number = 77;

-- M78: Netherlands 2-0 Canada (phút 65)
UPDATE matches SET
  status = 'finished', home_score = 2, away_score = 0, minute = 65,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 78;

-- M79: Portugal 1-0 Cameroon (phút 54)
UPDATE matches SET
  status = 'finished', home_score = 1, away_score = 0, minute = 54,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 79;

-- M80: Spain 3-2 Nigeria (phút 87) — Trận hay!
UPDATE matches SET
  status = 'finished', home_score = 3, away_score = 2, minute = 87,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 80;

-- M81: Germany 2-1 Saudi Arabia — Extra time! (phút 103)
UPDATE matches SET
  status = 'finished', home_score = 2, away_score = 1, minute = 103,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 81;

-- M82: Colombia 1-0 Ecuador (phút 44)
UPDATE matches SET
  status = 'finished', home_score = 1, away_score = 0, minute = 44,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 82;

-- M83: Uruguay 2-2 Switzerland → Uruguay thắng penalty 3-1 (phút ET = 118)
UPDATE matches SET
  status = 'finished', home_score = 2, away_score = 2, minute = 118,
  home_penalty = 3, away_penalty = 1
WHERE match_number = 83;

-- M84: Japan 1-0 Turkey (phút 76)
UPDATE matches SET
  status = 'finished', home_score = 1, away_score = 0, minute = 76,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 84;

-- M85: USA 1-1 Australia → USA thắng AET 2-1 (phút 107)
UPDATE matches SET
  status = 'finished', home_score = 2, away_score = 1, minute = 107,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 85;

-- M86: Mexico 0-1 Denmark — Upset! (phút 58)
UPDATE matches SET
  status = 'finished', home_score = 0, away_score = 1, minute = 58,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 86;

-- M87: Morocco 2-1 Serbia (phút 79)
UPDATE matches SET
  status = 'finished', home_score = 2, away_score = 1, minute = 79,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 87;

-- M88: Croatia 0-0 South Korea → South Korea thắng PEN 4-3 (Upset!)
UPDATE matches SET
  status = 'finished', home_score = 0, away_score = 0, minute = 0,
  home_penalty = 3, away_penalty = 4
WHERE match_number = 88;

-- =============================================
-- KẾT QUẢ R32:
-- Đi tiếp: Argentina, France, Brasil, England, Belgium, Netherlands,
--          Portugal, Spain, Germany, Colombia, Uruguay, Japan,
--          USA, Denmark, Morocco, South Korea
-- Bị loại: Ivory Coast, Chile, Egypt, Poland, Senegal, Canada,
--          Cameroon, Nigeria, Saudi Arabia, Ecuador, Switzerland,
--          Turkey, Australia, Mexico, Serbia, Croatia
-- =============================================

-- Verify
SELECT match_number, home_team, away_team,
       home_score || '-' || away_score AS score,
       CASE WHEN home_penalty IS NOT NULL
            THEN '(PEN ' || home_penalty || '-' || away_penalty || ')'
            ELSE '' END AS penalties,
       minute, status
FROM matches
WHERE match_group = 'R32'
ORDER BY match_number;
