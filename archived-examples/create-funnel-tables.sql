
-- Criar tabelas para o Funnel Service

-- Tabela de funnels
CREATE TABLE funnels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_id TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  version INTEGER DEFAULT 1,
  settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de páginas do funnel
CREATE TABLE funnel_pages (
  id TEXT PRIMARY KEY,
  funnel_id TEXT NOT NULL REFERENCES funnels(id) ON DELETE CASCADE,
  page_type TEXT NOT NULL,
  page_order INTEGER NOT NULL,
  title TEXT,
  blocks JSONB NOT NULL DEFAULT '[]',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_funnel_pages_funnel_id ON funnel_pages(funnel_id);
CREATE INDEX idx_funnel_pages_order ON funnel_pages(funnel_id, page_order);

-- Triggers para atualização automática do campo updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_funnels
  BEFORE UPDATE ON funnels
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_funnel_pages
  BEFORE UPDATE ON funnel_pages
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- Políticas de segurança (RLS)
ALTER TABLE funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_pages ENABLE ROW LEVEL SECURITY;

-- Políticas para funnels
CREATE POLICY "Usuários podem ler seus próprios funnels"
  ON funnels FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Usuários podem criar seus próprios funnels"
  ON funnels FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios funnels"
  ON funnels FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Usuários podem deletar seus próprios funnels"
  ON funnels FOR DELETE
  USING (auth.uid()::text = user_id);

-- Políticas para funnel_pages
CREATE POLICY "Usuários podem ler páginas de seus funnels"
  ON funnel_pages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM funnels 
    WHERE funnels.id = funnel_pages.funnel_id 
    AND funnels.user_id = auth.uid()::text
  ));

CREATE POLICY "Usuários podem criar páginas em seus funnels"
  ON funnel_pages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM funnels 
    WHERE funnels.id = funnel_pages.funnel_id 
    AND funnels.user_id = auth.uid()::text
  ));

CREATE POLICY "Usuários podem atualizar páginas em seus funnels"
  ON funnel_pages FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM funnels 
    WHERE funnels.id = funnel_pages.funnel_id 
    AND funnels.user_id = auth.uid()::text
  ));

CREATE POLICY "Usuários podem deletar páginas em seus funnels"
  ON funnel_pages FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM funnels 
    WHERE funnels.id = funnel_pages.funnel_id 
    AND funnels.user_id = auth.uid()::text
  ));