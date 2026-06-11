-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
    action TEXT,
    seen BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_player ON notifications(player_id, seen, created_at DESC);

-- RLS: anon can read own notifications (via API)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_notifications" ON notifications
    FOR SELECT TO anon USING (true);
