-- 🎯 TABELAS PARA QUIZ EDITOR BRIDGE
-- Gerenciamento de drafts e produção do quiz-estilo

-- Tabela de rascunhos (drafts)
CREATE TABLE IF NOT EXISTS quiz_drafts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  steps JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  is_published BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de produção (versão publicada)
CREATE TABLE IF NOT EXISTS quiz_production (
  slug TEXT PRIMARY KEY,
  steps JSONB NOT NULL,
  version INTEGER NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  source_draft_id TEXT REFERENCES quiz_drafts(id),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_quiz_drafts_slug ON quiz_drafts(slug);
CREATE INDEX IF NOT EXISTS idx_quiz_drafts_user ON quiz_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_drafts_updated ON quiz_drafts(updated_at DESC);

-- RLS (Row Level Security)
ALTER TABLE quiz_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_production ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
-- Drafts: usuário pode ver/editar seus próprios
CREATE POLICY "Users can view own drafts" 
  ON quiz_drafts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create drafts" 
  ON quiz_drafts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drafts" 
  ON quiz_drafts FOR UPDATE 
  USING (auth.uid() = user_id);

-- Produção: todos podem ler, apenas admins podem publicar
CREATE POLICY "Anyone can view production" 
  ON quiz_production FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Only admins can publish" 
  ON quiz_production FOR ALL 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_quiz_drafts_updated_at ON quiz_drafts;
CREATE TRIGGER update_quiz_drafts_updated_at
  BEFORE UPDATE ON quiz_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE quiz_drafts IS 'Rascunhos de edição do quiz antes da publicação';
COMMENT ON TABLE quiz_production IS 'Versões publicadas do quiz em produção';
COMMENT ON COLUMN quiz_drafts.steps IS 'Array de steps do quiz em formato JSON';
COMMENT ON COLUMN quiz_production.steps IS 'Steps do quiz publicado (formato QUIZ_STEPS)';
