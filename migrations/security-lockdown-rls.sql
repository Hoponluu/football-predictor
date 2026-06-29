-- ============================================
-- SECURITY LOCKDOWN: Tighten RLS policies
-- After applying, anon users can only READ, not write.
-- All writes go through /api/player.js or /api/admin.js (service_role).
-- ============================================

-- Enable RLS on all tables (idempotent)
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_rules ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (ignore errors if they don't exist)
DO $$ BEGIN
  -- matches
  DROP POLICY IF EXISTS "matches_select_all" ON matches;
  DROP POLICY IF EXISTS "matches_insert_all" ON matches;
  DROP POLICY IF EXISTS "matches_update_all" ON matches;
  DROP POLICY IF EXISTS "matches_delete_all" ON matches;
  DROP POLICY IF EXISTS "Allow all access to matches" ON matches;
  DROP POLICY IF EXISTS "Enable read access for all users" ON matches;
  DROP POLICY IF EXISTS "Enable insert for all users" ON matches;
  DROP POLICY IF EXISTS "Enable update for all users" ON matches;
  DROP POLICY IF EXISTS "Enable delete for all users" ON matches;

  -- players
  DROP POLICY IF EXISTS "players_select_all" ON players;
  DROP POLICY IF EXISTS "players_insert_all" ON players;
  DROP POLICY IF EXISTS "players_update_all" ON players;
  DROP POLICY IF EXISTS "players_delete_all" ON players;
  DROP POLICY IF EXISTS "Allow all access to players" ON players;
  DROP POLICY IF EXISTS "Enable read access for all users" ON players;
  DROP POLICY IF EXISTS "Enable insert for all users" ON players;
  DROP POLICY IF EXISTS "Enable update for all users" ON players;
  DROP POLICY IF EXISTS "Enable delete for all users" ON players;

  -- predictions
  DROP POLICY IF EXISTS "predictions_select_all" ON predictions;
  DROP POLICY IF EXISTS "predictions_insert_all" ON predictions;
  DROP POLICY IF EXISTS "predictions_update_all" ON predictions;
  DROP POLICY IF EXISTS "predictions_delete_all" ON predictions;
  DROP POLICY IF EXISTS "Allow all access to predictions" ON predictions;
  DROP POLICY IF EXISTS "Enable read access for all users" ON predictions;
  DROP POLICY IF EXISTS "Enable insert for all users" ON predictions;
  DROP POLICY IF EXISTS "Enable update for all users" ON predictions;
  DROP POLICY IF EXISTS "Enable delete for all users" ON predictions;

  -- groups
  DROP POLICY IF EXISTS "groups_select_all" ON groups;
  DROP POLICY IF EXISTS "groups_insert_all" ON groups;
  DROP POLICY IF EXISTS "groups_update_all" ON groups;
  DROP POLICY IF EXISTS "groups_delete_all" ON groups;
  DROP POLICY IF EXISTS "Allow all access to groups" ON groups;
  DROP POLICY IF EXISTS "Enable read access for all users" ON groups;
  DROP POLICY IF EXISTS "Enable insert for all users" ON groups;
  DROP POLICY IF EXISTS "Enable update for all users" ON groups;
  DROP POLICY IF EXISTS "Enable delete for all users" ON groups;

  -- player_groups
  DROP POLICY IF EXISTS "player_groups_select_all" ON player_groups;
  DROP POLICY IF EXISTS "player_groups_insert_all" ON player_groups;
  DROP POLICY IF EXISTS "player_groups_update_all" ON player_groups;
  DROP POLICY IF EXISTS "player_groups_delete_all" ON player_groups;
  DROP POLICY IF EXISTS "Allow all access to player_groups" ON player_groups;
  DROP POLICY IF EXISTS "Enable read access for all users" ON player_groups;
  DROP POLICY IF EXISTS "Enable insert for all users" ON player_groups;
  DROP POLICY IF EXISTS "Enable update for all users" ON player_groups;
  DROP POLICY IF EXISTS "Enable delete for all users" ON player_groups;

  -- scoring_rules
  DROP POLICY IF EXISTS "scoring_rules_select_all" ON scoring_rules;
  DROP POLICY IF EXISTS "scoring_rules_insert_all" ON scoring_rules;
  DROP POLICY IF EXISTS "scoring_rules_update_all" ON scoring_rules;
  DROP POLICY IF EXISTS "scoring_rules_delete_all" ON scoring_rules;
  DROP POLICY IF EXISTS "Allow all access to scoring_rules" ON scoring_rules;
  DROP POLICY IF EXISTS "Enable read access for all users" ON scoring_rules;
  DROP POLICY IF EXISTS "Enable insert for all users" ON scoring_rules;
  DROP POLICY IF EXISTS "Enable update for all users" ON scoring_rules;
  DROP POLICY IF EXISTS "Enable delete for all users" ON scoring_rules;
END $$;

-- ============================================
-- NEW POLICIES: anon = SELECT only
-- service_role bypasses RLS automatically
-- ============================================

-- matches: anon can read
CREATE POLICY "anon_read_matches" ON matches
  FOR SELECT TO anon USING (true);

-- players: anon can read (passwords are plain text but needed for login via API)
CREATE POLICY "anon_read_players" ON players
  FOR SELECT TO anon USING (true);

-- predictions: anon can read
CREATE POLICY "anon_read_predictions" ON predictions
  FOR SELECT TO anon USING (true);

-- groups: anon can read
CREATE POLICY "anon_read_groups" ON groups
  FOR SELECT TO anon USING (true);

-- player_groups: anon can read
CREATE POLICY "anon_read_player_groups" ON player_groups
  FOR SELECT TO anon USING (true);

-- scoring_rules: anon can read
CREATE POLICY "anon_read_scoring_rules" ON scoring_rules
  FOR SELECT TO anon USING (true);
