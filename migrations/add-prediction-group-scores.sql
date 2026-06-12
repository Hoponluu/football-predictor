-- =============================================
-- MIGRATION: Per-group scoring for predictions
-- Stores rank + minute bonus per group context
-- =============================================

CREATE TABLE IF NOT EXISTS prediction_group_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  points_rank INTEGER DEFAULT 0,
  points_minute INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  UNIQUE(prediction_id, group_id)
);

CREATE INDEX IF NOT EXISTS idx_pgs_prediction ON prediction_group_scores(prediction_id);
CREATE INDEX IF NOT EXISTS idx_pgs_group ON prediction_group_scores(group_id);
CREATE INDEX IF NOT EXISTS idx_pgs_group_prediction ON prediction_group_scores(group_id, prediction_id);

ALTER TABLE prediction_group_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_prediction_group_scores" ON prediction_group_scores
  FOR SELECT TO anon USING (true);
