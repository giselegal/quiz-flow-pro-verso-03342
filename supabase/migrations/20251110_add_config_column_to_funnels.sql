-- Migration: Add config column to funnels table
-- Purpose: Support step-level block storage for USER_EDIT priority in HierarchicalTemplateSource
-- Date: 2025-11-10

-- Add config column to store funnel configuration including step blocks
ALTER TABLE public.funnels
ADD COLUMN IF NOT EXISTS config jsonb DEFAULT '{}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.funnels.config IS 'Stores funnel configuration including step blocks for editor persistence. Structure: { steps: { "step-01": [...blocks], "step-02": [...blocks] } }';

-- Create index for better query performance when accessing config
CREATE INDEX IF NOT EXISTS idx_funnels_config ON public.funnels USING gin (config);

-- Update updated_at trigger to include config changes
-- (Assuming trigger already exists from 001_complete_schema.sql)
