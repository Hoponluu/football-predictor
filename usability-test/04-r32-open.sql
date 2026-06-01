-- =============================================
-- USABILITY TEST - ROUND OF 32: MỞ DỰ ĐOÁN
-- 16 trận loại trực tiếp — 32 đội mạnh nhất
-- QUAN TRỌNG: Lock favorite team khi chạy SQL này!
-- Không có giới hạn thời gian — admin tự đóng bằng results SQL
-- =============================================

-- Lock favorite team selection
UPDATE groups SET
  favorite_team_locked = true
WHERE code = 'WC2026-DEMO';

-- Update teams và mở dự đoán cho 16 trận R32
-- Seeding: Top 16 FIFA vs Bottom 16 (1 vs 32, 2 vs 31...)

-- M73: Argentina vs Ivory Coast
UPDATE matches SET
  home_team = 'Argentina', away_team = 'Ivory Coast', status = 'open'
WHERE match_number = 73;

-- M74: France vs Chile
UPDATE matches SET
  home_team = 'France', away_team = 'Chile', status = 'open'
WHERE match_number = 74;

-- M75: Brasil vs Egypt
UPDATE matches SET
  home_team = 'Brasil', away_team = 'Egypt', status = 'open'
WHERE match_number = 75;

-- M76: England vs Poland
UPDATE matches SET
  home_team = 'England', away_team = 'Poland', status = 'open'
WHERE match_number = 76;

-- M77: Belgium vs Senegal
UPDATE matches SET
  home_team = 'Belgium', away_team = 'Senegal', status = 'open'
WHERE match_number = 77;

-- M78: Netherlands vs Canada
UPDATE matches SET
  home_team = 'Netherlands', away_team = 'Canada', status = 'open'
WHERE match_number = 78;

-- M79: Portugal vs Cameroon
UPDATE matches SET
  home_team = 'Portugal', away_team = 'Cameroon', status = 'open'
WHERE match_number = 79;

-- M80: Spain vs Nigeria
UPDATE matches SET
  home_team = 'Spain', away_team = 'Nigeria', status = 'open'
WHERE match_number = 80;

-- M81: Germany vs Saudi Arabia
UPDATE matches SET
  home_team = 'Germany', away_team = 'Saudi Arabia', status = 'open'
WHERE match_number = 81;

-- M82: Colombia vs Ecuador
UPDATE matches SET
  home_team = 'Colombia', away_team = 'Ecuador', status = 'open'
WHERE match_number = 82;

-- M83: Uruguay vs Switzerland
UPDATE matches SET
  home_team = 'Uruguay', away_team = 'Switzerland', status = 'open'
WHERE match_number = 83;

-- M84: Japan vs Turkey
UPDATE matches SET
  home_team = 'Japan', away_team = 'Turkey', status = 'open'
WHERE match_number = 84;

-- M85: United States vs Australia
UPDATE matches SET
  home_team = 'United States', away_team = 'Australia', status = 'open'
WHERE match_number = 85;

-- M86: Mexico vs Denmark
UPDATE matches SET
  home_team = 'Mexico', away_team = 'Denmark', status = 'open'
WHERE match_number = 86;

-- M87: Morocco vs Serbia
UPDATE matches SET
  home_team = 'Morocco', away_team = 'Serbia', status = 'open'
WHERE match_number = 87;

-- M88: Croatia vs South Korea
UPDATE matches SET
  home_team = 'Croatia', away_team = 'South Korea', status = 'open'
WHERE match_number = 88;

-- Verify
SELECT match_number, home_team, away_team, status
FROM matches
WHERE match_group = 'R32'
ORDER BY match_number;
