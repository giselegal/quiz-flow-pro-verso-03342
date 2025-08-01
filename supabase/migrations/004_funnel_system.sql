-- =============================================================================
-- TABELAS PARA SISTEMA DE FUNIS
-- =============================================================================

-- Tabela principal de funis
CREATE TABLE funnels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  is_published BOOLEAN DEFAULT false,
  theme TEXT,
  template_id TEXT,
  tags TEXT[] DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para funis
CREATE INDEX idx_funnels_author_id ON funnels(author_id);
CREATE INDEX idx_funnels_is_published ON funnels(is_published);
CREATE INDEX idx_funnels_created_at ON funnels(created_at);

-- RLS para funis
ALTER TABLE funnels ENABLE ROW LEVEL SECURITY;

-- Políticas para funis
CREATE POLICY "Autores podem ver seus próprios funis"
  ON funnels FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Autores podem criar funis"
  ON funnels FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Autores podem atualizar seus funis"
  ON funnels FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Autores podem excluir seus funis"
  ON funnels FOR DELETE
  USING (auth.uid() = author_id);

-- Tabela de etapas do funil
CREATE TABLE funnel_steps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  funnel_id UUID REFERENCES funnels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  blocks_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT false,
  multi_select INTEGER,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para etapas do funil
CREATE INDEX idx_funnel_steps_funnel_id ON funnel_steps(funnel_id);
CREATE INDEX idx_funnel_steps_order_index ON funnel_steps(order_index);

-- RLS para etapas do funil
ALTER TABLE funnel_steps ENABLE ROW LEVEL SECURITY;

-- Políticas para etapas do funil
CREATE POLICY "Etapas acessíveis pelo autor do funil"
  ON funnel_steps FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM funnels
    WHERE funnels.id = funnel_steps.funnel_id
    AND funnels.author_id = auth.uid()
  ));

CREATE POLICY "Etapas podem ser criadas pelo autor do funil"
  ON funnel_steps FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM funnels
    WHERE funnels.id = funnel_steps.funnel_id
    AND funnels.author_id = auth.uid()
  ));

CREATE POLICY "Etapas podem ser atualizadas pelo autor do funil"
  ON funnel_steps FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM funnels
    WHERE funnels.id = funnel_steps.funnel_id
    AND funnels.author_id = auth.uid()
  ));

CREATE POLICY "Etapas podem ser excluídas pelo autor do funil"
  ON funnel_steps FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM funnels
    WHERE funnels.id = funnel_steps.funnel_id
    AND funnels.author_id = auth.uid()
  ));

-- Tabela de blocos das etapas do funil
CREATE TABLE funnel_blocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  step_id UUID REFERENCES funnel_steps(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para blocos do funil
CREATE INDEX idx_funnel_blocks_step_id ON funnel_blocks(step_id);
CREATE INDEX idx_funnel_blocks_order_index ON funnel_blocks(order_index);

-- RLS para blocos do funil
ALTER TABLE funnel_blocks ENABLE ROW LEVEL SECURITY;

-- Políticas para blocos do funil
CREATE POLICY "Blocos acessíveis pelo autor do funil"
  ON funnel_blocks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM funnel_steps
    JOIN funnels ON funnel_steps.funnel_id = funnels.id
    WHERE funnel_steps.id = funnel_blocks.step_id
    AND funnels.author_id = auth.uid()
  ));

CREATE POLICY "Blocos podem ser criados pelo autor do funil"
  ON funnel_blocks FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM funnel_steps
    JOIN funnels ON funnel_steps.funnel_id = funnels.id
    WHERE funnel_steps.id = funnel_blocks.step_id
    AND funnels.author_id = auth.uid()
  ));

CREATE POLICY "Blocos podem ser atualizados pelo autor do funil"
  ON funnel_blocks FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM funnel_steps
    JOIN funnels ON funnel_steps.funnel_id = funnels.id
    WHERE funnel_steps.id = funnel_blocks.step_id
    AND funnels.author_id = auth.uid()
  ));

CREATE POLICY "Blocos podem ser excluídos pelo autor do funil"
  ON funnel_blocks FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM funnel_steps
    JOIN funnels ON funnel_steps.funnel_id = funnels.id
    WHERE funnel_steps.id = funnel_blocks.step_id
    AND funnels.author_id = auth.uid()
  ));

-- Função para atualizar o contador de blocos ao adicionar/remover blocos
CREATE OR REPLACE FUNCTION update_blocks_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE funnel_steps 
    SET blocks_count = blocks_count + 1,
        updated_at = NOW()
    WHERE id = NEW.step_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE funnel_steps 
    SET blocks_count = blocks_count - 1,
        updated_at = NOW()
    WHERE id = OLD.step_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o contador de blocos
CREATE TRIGGER trigger_update_blocks_count
AFTER INSERT OR DELETE ON funnel_blocks
FOR EACH ROW
EXECUTE FUNCTION update_blocks_count();

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar timestamps
CREATE TRIGGER trigger_update_funnels_timestamp
BEFORE UPDATE ON funnels
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_funnel_steps_timestamp
BEFORE UPDATE ON funnel_steps
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_funnel_blocks_timestamp
BEFORE UPDATE ON funnel_blocks
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
