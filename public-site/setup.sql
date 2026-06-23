-- Run this in Supabase SQL Editor to create the public_snapshots table

CREATE TABLE IF NOT EXISTS public_snapshots (
    id TEXT PRIMARY KEY DEFAULT 'latest',
    data JSONB NOT NULL DEFAULT '{}',
    published_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public_snapshots ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (anon role)
CREATE POLICY "Allow public read" ON public_snapshots
    FOR SELECT USING (true);

-- Only service role can write (admin API uses service role)
-- No INSERT/UPDATE/DELETE policy for anon = anon cannot write
