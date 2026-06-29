-- =============================================
-- MIGRATION: Move favorite team settings to scoring_rules
-- Chuyển cấu hình đội yêu thích từ groups sang scoring_rules (global)
-- =============================================

-- Add favorite team columns to scoring_rules
ALTER TABLE scoring_rules
ADD COLUMN IF NOT EXISTS favorite_team_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS favorite_team_locked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS favorite_team_deadline TIMESTAMPTZ DEFAULT NULL;

-- Update existing row with defaults
UPDATE scoring_rules
SET favorite_team_enabled = true,
    favorite_team_locked = false
WHERE favorite_team_enabled IS NULL;

-- Verify
SELECT id, favorite_team_enabled, favorite_team_locked, favorite_team_deadline
FROM scoring_rules
LIMIT 1;
