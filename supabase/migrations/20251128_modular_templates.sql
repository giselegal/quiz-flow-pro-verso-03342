-- Migration: Modular Template System v4.0
-- Created: 2025-11-28
-- Description: Suporte para templates modulares e operações por step

-- ==================================================================================
-- 1. Adicionar coluna is_system_template à tabela templates
-- ==================================================================================

ALTER TABLE templates 
ADD COLUMN IF NOT EXISTS is_system_template BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS template_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS source TEXT CHECK (source IN ('system', 'user', 'import')) DEFAULT 'user';

-- Comentários
COMMENT ON COLUMN templates.is_system_template IS 'Indica se é template do sistema (não pode ser deletado)';
COMMENT ON COLUMN templates.template_id IS 'ID único do template (ex: quiz21StepsComplete)';
COMMENT ON COLUMN templates.source IS 'Origem do template: system, user ou import';

-- ==================================================================================
-- 2. Criar função RPC para atualizar step individual
-- ==================================================================================

CREATE OR REPLACE FUNCTION update_funnel_step(
  p_funnel_id UUID,
  p_step_id TEXT,
  p_step_data JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_settings JSONB;
  v_updated_settings JSONB;
BEGIN
  -- Buscar settings atual
  SELECT settings INTO v_current_settings
  FROM funnels
  WHERE id = p_funnel_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Funil não encontrado: %', p_funnel_id;
  END IF;
  
  -- Atualizar step usando jsonb_set
  v_updated_settings := jsonb_set(
    v_current_settings,
    array['steps', p_step_id],
    p_step_data,
    true
  );
  
  -- Atualizar funil
  UPDATE funnels
  SET 
    settings = v_updated_settings,
    updated_at = now()
  WHERE id = p_funnel_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'funnel_id', p_funnel_id,
    'step_id', p_step_id
  );
END;
$$;

COMMENT ON FUNCTION update_funnel_step IS 'Atualiza step individual usando jsonb_set para otimização';

-- ==================================================================================
-- 3. Criar função RPC para buscar step individual
-- ==================================================================================

CREATE OR REPLACE FUNCTION get_funnel_step(
  p_funnel_id UUID,
  p_step_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_step_data JSONB;
BEGIN
  SELECT settings->'steps'->p_step_id INTO v_step_data
  FROM funnels
  WHERE id = p_funnel_id;
  
  IF v_step_data IS NULL THEN
    RAISE EXCEPTION 'Step não encontrado: % no funil %', p_step_id, p_funnel_id;
  END IF;
  
  RETURN v_step_data;
END;
$$;

COMMENT ON FUNCTION get_funnel_step IS 'Busca step individual de um funil usando jsonb path query';

-- ==================================================================================
-- 4. Criar índices para otimizar queries em steps JSONB
-- ==================================================================================

-- Índice GIN para buscar steps dentro de settings
CREATE INDEX IF NOT EXISTS idx_funnels_settings_steps 
ON funnels USING GIN ((settings->'steps'));

-- Índice para totalSteps
CREATE INDEX IF NOT EXISTS idx_funnels_total_steps 
ON funnels ((CAST(settings->>'totalSteps' AS INTEGER)));

-- ==================================================================================
-- 5. Seed template quiz21Steps modular
-- ==================================================================================

-- Inserir template quiz21Steps como system template
INSERT INTO templates (
  name,
  slug,
  template_id,
  description,
  category,
  is_system_template,
  source,
  settings,
  status
)
VALUES (
  'Quiz de Estilo Pessoal - 21 Etapas Modular',
  'quiz-21-steps-modular',
  'quiz21StepsComplete',
  'Template modular v4.0 com 21 steps editáveis individualmente',
  'quiz',
  true,
  'system',
  jsonb_build_object(
    'version', '4.0.0',
    'structure', 'modular',
    'totalSteps', 21,
    'buildPath', 'public/templates/quiz21Steps/',
    'theme', jsonb_build_object(
      'primaryColor', '#B89B7A',
      'secondaryColor', '#432818'
    ),
    'navigation', jsonb_build_object(
      'allowBack', true,
      'showProgress', true
    ),
    'scoring', jsonb_build_object(
      'enabled', true,
      'speedBonusPoints', 5,
      'completionBonus', 50
    )
  ),
  'published'
)
ON CONFLICT (template_id) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  settings = EXCLUDED.settings,
  updated_at = now();

-- ==================================================================================
-- 6. RLS Policies para system templates
-- ==================================================================================

-- Policy: System templates podem ser lidos por todos
CREATE POLICY templates_select_system
  ON templates
  FOR SELECT
  USING (is_system_template = true);

-- Policy: System templates não podem ser modificados
CREATE POLICY templates_protect_system
  ON templates
  FOR UPDATE
  USING (is_system_template = false);

CREATE POLICY templates_protect_system_delete
  ON templates
  FOR DELETE
  USING (is_system_template = false);

-- ==================================================================================
-- 7. Funções auxiliares para templates modulares
-- ==================================================================================

-- Função para contar steps de um funil
CREATE OR REPLACE FUNCTION count_funnel_steps(p_funnel_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
AS $$
  SELECT jsonb_object_keys(settings->'steps')::INTEGER
  FROM funnels
  WHERE id = p_funnel_id
  LIMIT 1;
$$;

-- Função para listar IDs de todos os steps
CREATE OR REPLACE FUNCTION list_funnel_step_ids(p_funnel_id UUID)
RETURNS TEXT[]
LANGUAGE sql
STABLE
AS $$
  SELECT ARRAY(
    SELECT jsonb_object_keys(settings->'steps')
    FROM funnels
    WHERE id = p_funnel_id
  );
$$;

-- ==================================================================================
-- 8. View para facilitar consultas de templates
-- ==================================================================================

CREATE OR REPLACE VIEW v_templates_summary AS
SELECT
  id,
  name,
  slug,
  template_id,
  description,
  category,
  is_system_template,
  source,
  status,
  COALESCE((settings->>'totalSteps')::INTEGER, 0) AS total_steps,
  settings->'theme' AS theme,
  created_at,
  updated_at
FROM templates;

COMMENT ON VIEW v_templates_summary IS 'View resumida de templates com campos calculados';

-- ==================================================================================
-- 9. Trigger para validar settings em templates
-- ==================================================================================

CREATE OR REPLACE FUNCTION validate_template_settings()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Validar que settings tenha estrutura mínima
  IF NEW.settings IS NULL THEN
    NEW.settings := '{}'::jsonb;
  END IF;
  
  -- Adicionar version se não existir
  IF NOT (NEW.settings ? 'version') THEN
    NEW.settings := jsonb_set(NEW.settings, '{version}', '"4.0.0"');
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER templates_validate_settings
  BEFORE INSERT OR UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION validate_template_settings();

-- ==================================================================================
-- 10. Grants de permissões
-- ==================================================================================

-- Permitir execução das funções RPC
GRANT EXECUTE ON FUNCTION update_funnel_step TO authenticated;
GRANT EXECUTE ON FUNCTION get_funnel_step TO authenticated;
GRANT EXECUTE ON FUNCTION count_funnel_steps TO authenticated;
GRANT EXECUTE ON FUNCTION list_funnel_step_ids TO authenticated;

-- Permitir acesso à view
GRANT SELECT ON v_templates_summary TO authenticated;

-- ==================================================================================
-- Verificação final
-- ==================================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 20251128_modular_templates aplicada com sucesso';
  RAISE NOTICE '📊 System templates: %', (SELECT COUNT(*) FROM templates WHERE is_system_template = true);
  RAISE NOTICE '🔧 Funções RPC criadas: update_funnel_step, get_funnel_step';
  RAISE NOTICE '📈 Índices otimizados para queries JSONB em steps';
END $$;
