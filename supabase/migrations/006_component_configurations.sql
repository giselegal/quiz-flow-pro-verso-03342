-- MIGRATION 006: Component Configurations Real Storage
-- Substituindo o sistema de mocks em memória por persistência real

-- =============================================================================
-- COMPONENT_CONFIGURATIONS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.component_configurations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Identificação única da configuração
  component_id TEXT NOT NULL,
  funnel_id TEXT,
  
  -- Dados da configuração
  properties JSONB NOT NULL DEFAULT '{}',
  
  -- Controle de versão e auditoria
  version INTEGER DEFAULT 1,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_modified TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadados
  metadata JSONB DEFAULT '{}',
  source TEXT DEFAULT 'editor' CHECK (source IN ('api', 'editor', 'import')),
  
  -- Performance e cache
  is_active BOOLEAN DEFAULT true,
  cache_ttl INTEGER DEFAULT 300, -- 5 minutos
  
  -- Constraints
  CONSTRAINT valid_properties CHECK (jsonb_typeof(properties) = 'object'),
  CONSTRAINT valid_metadata CHECK (jsonb_typeof(metadata) = 'object'),
  
  -- Índice único por configuração
  UNIQUE(component_id, funnel_id)
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Busca principal: por component_id + funnel_id
CREATE INDEX IF NOT EXISTS idx_component_configurations_lookup 
ON public.component_configurations(component_id, funnel_id);

-- Busca por funnel (listar todas configurações de um funil)
CREATE INDEX IF NOT EXISTS idx_component_configurations_funnel 
ON public.component_configurations(funnel_id) 
WHERE funnel_id IS NOT NULL;

-- Busca por componente global (quando funnel_id é NULL)
CREATE INDEX IF NOT EXISTS idx_component_configurations_global 
ON public.component_configurations(component_id) 
WHERE funnel_id IS NULL;

-- Performance de modificação
CREATE INDEX IF NOT EXISTS idx_component_configurations_modified 
ON public.component_configurations(last_modified DESC);

-- =============================================================================
-- TRIGGERS FOR AUTO-UPDATE
-- =============================================================================

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_component_configuration_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_modified = NOW();
  NEW.version = OLD.version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar automaticamente
CREATE TRIGGER trigger_component_configurations_timestamp
  BEFORE UPDATE ON public.component_configurations
  FOR EACH ROW EXECUTE FUNCTION update_component_configuration_timestamp();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

ALTER TABLE public.component_configurations ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários autenticados podem ler todas as configurações
CREATE POLICY "Authenticated users can read component configurations"
  ON public.component_configurations
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Usuários podem criar configurações
CREATE POLICY "Authenticated users can create component configurations"
  ON public.component_configurations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Usuários podem atualizar configurações que criaram ou configurações globais
CREATE POLICY "Users can update their component configurations"
  ON public.component_configurations
  FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR 
    created_by IS NULL OR 
    funnel_id IS NULL
  );

-- Policy: Apenas criadores podem deletar configurações
CREATE POLICY "Users can delete their component configurations"
  ON public.component_configurations
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- =============================================================================
-- UTILITY FUNCTIONS
-- =============================================================================

-- Função para limpar cache expirado
CREATE OR REPLACE FUNCTION cleanup_expired_component_configurations()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.component_configurations 
  WHERE 
    cache_ttl > 0 AND 
    EXTRACT(EPOCH FROM (NOW() - last_modified)) > cache_ttl;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Função para fazer backup de configurações por funnel
CREATE OR REPLACE FUNCTION backup_funnel_configurations(funnel_id_param TEXT)
RETURNS JSONB AS $$
BEGIN
  RETURN (
    SELECT jsonb_agg(
      jsonb_build_object(
        'component_id', component_id,
        'funnel_id', funnel_id,
        'properties', properties,
        'version', version,
        'metadata', metadata,
        'created_at', created_at,
        'last_modified', last_modified
      )
    )
    FROM public.component_configurations
    WHERE funnel_id = funnel_id_param OR (funnel_id_param IS NULL AND funnel_id IS NULL)
  );
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- SAMPLE DATA (DEVELOPMENT)
-- =============================================================================

-- Inserir algumas configurações de exemplo para desenvolvimento
INSERT INTO public.component_configurations (component_id, funnel_id, properties, metadata, source)
VALUES 
  (
    'quiz-global-config',
    'quiz-estilo-21-steps',
    '{"primaryColor": "#B89B7A", "secondaryColor": "#432818", "fontFamily": "Inter, sans-serif"}',
    '{"source": "migration", "version": "1.0"}',
    'import'
  ),
  (
    'quiz-theme-config',
    'quiz-estilo-21-steps',
    '{"backgroundColor": "#fefefe", "textColor": "#5b4135", "borderRadius": 8}',
    '{"source": "migration", "version": "1.0"}',
    'import'
  ),
  (
    'quiz-options-grid',
    NULL,
    '{"columns": 2, "gridGap": 16, "showShadows": true}',
    '{"source": "migration", "global": true}',
    'import'
  )
ON CONFLICT (component_id, funnel_id) DO NOTHING;

-- Comentários para documentação
COMMENT ON TABLE public.component_configurations IS 'Armazena configurações de componentes para o sistema de editor visual';
COMMENT ON COLUMN public.component_configurations.component_id IS 'Identificador único do componente (ex: quiz-header, quiz-options-grid)';
COMMENT ON COLUMN public.component_configurations.funnel_id IS 'ID do funil específico (NULL para configurações globais)';
COMMENT ON COLUMN public.component_configurations.properties IS 'Objeto JSON com todas as propriedades configuráveis do componente';
COMMENT ON COLUMN public.component_configurations.metadata IS 'Metadados adicionais sobre a configuração';
COMMENT ON COLUMN public.component_configurations.cache_ttl IS 'Tempo de vida do cache em segundos (0 = sem expiração)';
