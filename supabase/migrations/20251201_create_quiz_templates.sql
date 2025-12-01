-- Migration: Create quiz_templates table
-- Created: 2025-12-01
-- Description: Tabela para armazenar templates completos de quiz com versionamento

-- Create quiz_templates table
CREATE TABLE IF NOT EXISTS quiz_templates (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificador do funil
  funnel_id TEXT NOT NULL,
  
  -- Dados completos do quiz (conforme QuizSchema Zod)
  quiz_data JSONB NOT NULL,
  
  -- Versionamento para controle de mudanças
  version INTEGER NOT NULL DEFAULT 1,
  
  -- Tracking
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  source TEXT DEFAULT 'editor' CHECK (source IN ('editor', 'api', 'migration')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT quiz_templates_funnel_version_unique UNIQUE(funnel_id, version)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_quiz_templates_funnel_id ON quiz_templates(funnel_id);
CREATE INDEX IF NOT EXISTS idx_quiz_templates_user_id ON quiz_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_templates_version ON quiz_templates(version);
CREATE INDEX IF NOT EXISTS idx_quiz_templates_created_at ON quiz_templates(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_quiz_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_quiz_templates_updated_at
  BEFORE UPDATE ON quiz_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_quiz_templates_updated_at();

-- RLS (Row Level Security) Policies
ALTER TABLE quiz_templates ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários autenticados podem ler todos os templates
CREATE POLICY "Authenticated users can read quiz_templates"
  ON quiz_templates
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Usuários podem inserir seus próprios templates
CREATE POLICY "Users can insert their own quiz_templates"
  ON quiz_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Usuários podem atualizar seus próprios templates
CREATE POLICY "Users can update their own quiz_templates"
  ON quiz_templates
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Usuários podem deletar seus próprios templates
CREATE POLICY "Users can delete their own quiz_templates"
  ON quiz_templates
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Function: Get latest quiz template for a funnel
CREATE OR REPLACE FUNCTION get_latest_quiz_template(p_funnel_id TEXT)
RETURNS SETOF quiz_templates AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM quiz_templates
  WHERE funnel_id = p_funnel_id
  ORDER BY version DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function: Get quiz template history for a funnel
CREATE OR REPLACE FUNCTION get_quiz_template_history(p_funnel_id TEXT)
RETURNS SETOF quiz_templates AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM quiz_templates
  WHERE funnel_id = p_funnel_id
  ORDER BY version DESC;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE quiz_templates IS 'Armazena templates completos de quiz com versionamento (v4.0)';
COMMENT ON COLUMN quiz_templates.funnel_id IS 'Identificador único do funil (ex: quiz21)';
COMMENT ON COLUMN quiz_templates.quiz_data IS 'Dados completos do quiz conforme QuizSchema Zod';
COMMENT ON COLUMN quiz_templates.version IS 'Versão incremental do template (1, 2, 3...)';
COMMENT ON COLUMN quiz_templates.source IS 'Origem da criação: editor, api ou migration';
