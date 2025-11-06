-- Supabase: Suporte ao SSOT de Templates (USER_EDIT e ADMIN_OVERRIDE)
-- Execute no SQL Editor do seu projeto

-- 1) Adicionar coluna 'config' ao funnels (JSONB) para guardar steps editados pelo usuário
ALTER TABLE IF EXISTS funnels
ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}'::jsonb;

-- Índice GIN para consultas rápidas em config
CREATE INDEX IF NOT EXISTS idx_funnels_config_gin ON funnels USING GIN (config);

-- 2) Tabela de overrides administrativos por step
CREATE TABLE IF NOT EXISTS template_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id TEXT NOT NULL,                 -- ex: 'step-12'
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices úteis
CREATE INDEX IF NOT EXISTS idx_template_overrides_step ON template_overrides(step_id);
CREATE INDEX IF NOT EXISTS idx_template_overrides_active ON template_overrides(active) WHERE active = TRUE;

-- 3) RLS básico (opcional, ajuste conforme sua política)
ALTER TABLE template_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage template_overrides" ON template_overrides
  FOR ALL USING (true) WITH CHECK (true);

-- 4) Exemplo de payload em funnels.config
-- Salve os blocos de um step específico em config.steps[stepId]
-- {
--   "steps": {
--     "step-01": [ { "id": "headline", "type": "intro", "content": { "title": "..." } } ],
--     "step-12": [ { "id": "cta", "type": "transition", "content": { "label": "Continuar" } } ]
--   }
-- }

-- 5) Upsert de exemplo (persistir user edits)
-- UPDATE funnels SET config = jsonb_set(COALESCE(config, '{}'::jsonb), '{steps,step-01}', '[{"id":"h1","type":"intro","content":{"title":"Bem-vinda"}}]'::jsonb, true), updated_at = NOW()
-- WHERE id = '00000000-0000-0000-0000-000000000000';
