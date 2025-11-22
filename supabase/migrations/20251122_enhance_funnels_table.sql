-- Migration: Enhance funnels table for full persistence
-- Date: 2025-11-22
-- Purpose: Add missing fields and improve schema for production use

-- Add missing columns if they don't exist
ALTER TABLE public.funnels
  ADD COLUMN IF NOT EXISTS slug text UNIQUE,
  ADD COLUMN IF NOT EXISTS steps jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS published boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS public_url text;

-- Rename is_published to published if it exists (for consistency)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'funnels' AND column_name = 'is_published'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'funnels' AND column_name = 'published'
  ) THEN
    ALTER TABLE public.funnels RENAME COLUMN is_published TO published;
  END IF;
END $$;

-- Ensure version column exists and has default
ALTER TABLE public.funnels
  ALTER COLUMN version SET DEFAULT 1,
  ALTER COLUMN version SET NOT NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_funnels_user_id ON public.funnels(user_id);
CREATE INDEX IF NOT EXISTS idx_funnels_slug ON public.funnels(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_funnels_published ON public.funnels(published);
CREATE INDEX IF NOT EXISTS idx_funnels_created_at ON public.funnels(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_funnels_updated_at ON public.funnels(updated_at DESC);

-- Add GIN index for JSONB columns for better query performance
CREATE INDEX IF NOT EXISTS idx_funnels_steps_gin ON public.funnels USING gin(steps);
CREATE INDEX IF NOT EXISTS idx_funnels_settings_gin ON public.funnels USING gin(settings);

-- Update trigger for updated_at (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_funnels_updated_at ON public.funnels;
CREATE TRIGGER update_funnels_updated_at
  BEFORE UPDATE ON public.funnels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own funnels" ON public.funnels;
DROP POLICY IF EXISTS "Users can insert own funnels" ON public.funnels;
DROP POLICY IF EXISTS "Users can update own funnels" ON public.funnels;
DROP POLICY IF EXISTS "Users can delete own funnels" ON public.funnels;
DROP POLICY IF EXISTS "Public can view published funnels" ON public.funnels;

-- Create new policies
-- Users can view their own funnels
CREATE POLICY "Users can view own funnels"
  ON public.funnels FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub'
         OR user_id IS NULL); -- Allow viewing funnels without user_id (for migration)

-- Anyone can view published funnels
CREATE POLICY "Public can view published funnels"
  ON public.funnels FOR SELECT
  USING (published = true);

-- Users can insert their own funnels
CREATE POLICY "Users can insert own funnels"
  ON public.funnels FOR INSERT
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub'
              OR user_id IS NULL); -- Allow creating funnels without user_id (for dev)

-- Users can update their own funnels
CREATE POLICY "Users can update own funnels"
  ON public.funnels FOR UPDATE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub'
         OR user_id IS NULL);

-- Users can delete their own funnels
CREATE POLICY "Users can delete own funnels"
  ON public.funnels FOR DELETE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub'
         OR user_id IS NULL);

-- Add comment for documentation
COMMENT ON TABLE public.funnels IS 'Stores funnel definitions with steps, settings, and publication status';
COMMENT ON COLUMN public.funnels.id IS 'Unique identifier for the funnel';
COMMENT ON COLUMN public.funnels.name IS 'Display name of the funnel';
COMMENT ON COLUMN public.funnels.slug IS 'URL-friendly identifier (unique)';
COMMENT ON COLUMN public.funnels.steps IS 'Array of step definitions in JSONB format';
COMMENT ON COLUMN public.funnels.settings IS 'Funnel settings (theme, analytics, etc.) in JSONB format';
COMMENT ON COLUMN public.funnels.published IS 'Whether the funnel is published and publicly accessible';
COMMENT ON COLUMN public.funnels.public_url IS 'Public URL when published';
COMMENT ON COLUMN public.funnels.version IS 'Version number for optimistic locking';
COMMENT ON COLUMN public.funnels.user_id IS 'Owner user ID (nullable for backwards compatibility)';
