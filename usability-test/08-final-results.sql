-- =============================================
-- USABILITY TEST - 3RD PLACE & FINAL: KẾT QUẢ
-- Trận cuối cùng! Sau đó vào Admin → "Tính điểm" + "Tính favorite team"
-- =============================================

-- M103: 3rd Place — Spain 2-1 Japan (phút 69)
UPDATE matches SET
  status = 'finished', home_score = 2, away_score = 1, minute = 69,
  home_penalty = NULL, away_penalty = NULL
WHERE match_number = 103;

-- M104: FINAL — Argentina 1-1 United States → Argentina PEN 4-2
-- Argentina vô địch World Cup 2026!
UPDATE matches SET
  status = 'finished', home_score = 1, away_score = 1, minute = 120,
  home_penalty = 4, away_penalty = 2
WHERE match_number = 104;

-- =============================================
-- KẾT QUẢ CHUNG CUỘC:
-- 🥇 Champion: Argentina
-- 🥈 Runner-up: United States
-- 🥉 3rd Place: Spain
-- 4th Place: Japan
--
-- FAVORITE TEAM POINTS (tổng cộng):
-- Argentina: R32 + R16 + QF + SF + FINAL + Champion = MAX POINTS
-- United States: R32 + R16 + QF + SF + FINAL
-- Spain: R32 + R16 + QF + SF + FINAL (thua SF nhưng có mặt ở 3rd place match)
-- Japan: R32 + R16 + QF + SF + FINAL (thua SF nhưng có mặt ở 3rd place match)
-- France: R32 + R16 + QF
-- Brasil: R32 + R16
-- Germany: R32 + R16 + QF
-- England: R32 + R16 + QF
-- Belgium: R32 + R16
-- Netherlands: R32 + R16
-- ... các đội khác: R32 only
-- =============================================

-- Verify
SELECT match_number, match_group, home_team, away_team,
       home_score || '-' || away_score AS score,
       CASE WHEN home_penalty IS NOT NULL
            THEN '(PEN ' || home_penalty || '-' || away_penalty || ')'
            ELSE '' END AS penalties,
       minute, status
FROM matches
WHERE match_number IN (103, 104)
ORDER BY match_number;
