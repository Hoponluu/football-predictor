-- =============================================
-- FIX: Drop protect_match_results trigger
--
-- This trigger was blocking ALL edits to match results once status = 'finished',
-- including admin edits via service_role and even Supabase's table editor.
-- RLS policies already prevent non-admin users from modifying matches.
-- =============================================

-- Drop the trigger
DROP TRIGGER IF EXISTS trg_protect_match_results ON matches;

-- Drop the function
DROP FUNCTION IF EXISTS protect_match_results();
