-- Templates table (if missing)
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  blocks JSONB DEFAULT '[]'::jsonb,
  config JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID
);

-- Optional: add missing columns to component_instances to align with Block interface
ALTER TABLE component_instances 
  ADD COLUMN IF NOT EXISTS type TEXT GENERATED ALWAYS AS (component_type_key) STORED;

ALTER TABLE component_instances 
  ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '{}'::jsonb;

-- Backfill content from config where applicable
UPDATE component_instances 
SET content = COALESCE(NULLIF(content, '{}'::jsonb), config)
WHERE config IS NOT NULL;

-- Optional view that maps component_instances to a unified block shape
CREATE OR REPLACE VIEW blocks_unified AS
SELECT 
  id,
  component_type_key AS type,
  COALESCE(config, '{}'::jsonb) AS content,
  properties,
  custom_styling,
  funnel_id,
  step_number,
  order_index,
  created_at,
  updated_at
FROM component_instances;
