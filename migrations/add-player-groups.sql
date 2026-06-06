-- =============================================
-- MIGRATION: Add player_groups join table
-- Allows players to belong to multiple groups
-- =============================================

-- 1. Create the join table
CREATE TABLE IF NOT EXISTS player_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, group_id)
);

-- 2. Migrate existing data from players.group_id
INSERT INTO player_groups (player_id, group_id)
SELECT id, group_id FROM players
WHERE group_id IS NOT NULL
ON CONFLICT (player_id, group_id) DO NOTHING;

-- 3. Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_player_groups_player ON player_groups(player_id);
CREATE INDEX IF NOT EXISTS idx_player_groups_group ON player_groups(group_id);

-- 4. Verify migration
SELECT
  p.name AS player_name,
  p.email,
  g.name AS group_name,
  g.code AS group_code
FROM player_groups pg
JOIN players p ON p.id = pg.player_id
JOIN groups g ON g.id = pg.group_id
ORDER BY p.name, g.name;
