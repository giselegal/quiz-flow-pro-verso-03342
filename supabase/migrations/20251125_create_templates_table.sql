-- Migration: Create templates table
-- Created: 2025-11-25
-- Description: Tabela para armazenar templates de quiz/funil

-- Drop table if exists (apenas em dev/test)
-- DROP TABLE IF EXISTS templates CASCADE;

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'quiz',
  
  -- Template structure
  blocks JSONB DEFAULT '[]'::jsonb,
  steps JSONB DEFAULT '[]'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  
  -- Metadata
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  
  -- User tracking
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  funnel_id UUID REFERENCES funnels(id) ON DELETE CASCADE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_validated_at TIMESTAMPTZ,
  
  -- Constraints
  UNIQUE(slug, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_funnel_id ON templates(funnel_id);
CREATE INDEX IF NOT EXISTS idx_templates_status ON templates(status);
CREATE INDEX IF NOT EXISTS idx_templates_slug ON templates(slug);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_templates_updated_at();

-- RLS Policies
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own templates
CREATE POLICY templates_select_own
  ON templates
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own templates
CREATE POLICY templates_insert_own
  ON templates
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own templates
CREATE POLICY templates_update_own
  ON templates
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own templates
CREATE POLICY templates_delete_own
  ON templates
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Public templates can be viewed by everyone
CREATE POLICY templates_select_public
  ON templates
  FOR SELECT
  USING (status = 'published');

-- Seed with example templates
INSERT INTO templates (name, slug, description, category, blocks, status)
VALUES
  (
    'Quiz 21 Steps Complete',
    'quiz-21-steps',
    'Template completo de quiz com 21 passos',
    'quiz',
    '[]'::jsonb,
    'published'
  ),
  (
    'Lead Magnet Simple',
    'lead-magnet-simple',
    'Template simples para captura de leads',
    'lead-magnet',
    '[]'::jsonb,
    'published'
  ),
  (
    'Sales Funnel Basic',
    'sales-funnel-basic',
    'Funil de vendas básico',
    'sales-funnel',
    '[]'::jsonb,
    'published'
  )
ON CONFLICT (slug, user_id) DO NOTHING;

COMMENT ON TABLE templates IS 'Armazena templates de quiz/funil para reutilização';
COMMENT ON COLUMN templates.blocks IS 'Array JSON de blocos do template';
COMMENT ON COLUMN templates.steps IS 'Array JSON de steps do template';
COMMENT ON COLUMN templates.settings IS 'Configurações globais do template';
