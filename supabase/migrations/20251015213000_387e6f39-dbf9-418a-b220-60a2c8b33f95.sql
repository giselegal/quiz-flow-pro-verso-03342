-- ============================================================================
-- CRIAÇÃO SCHEMA - Apenas o que falta
-- ============================================================================

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabelas que ainda não existem
CREATE TABLE IF NOT EXISTS public.quiz_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  quiz_type TEXT NOT NULL DEFAULT 'personality' CHECK (quiz_type IN ('personality', 'knowledge', 'assessment')),
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.component_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type_key TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  category TEXT NOT NULL,
  config_schema JSONB DEFAULT '{}',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.component_instances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_id TEXT,
  component_type_id UUID REFERENCES public.component_types(id) ON DELETE SET NULL,
  config JSONB DEFAULT '{}',
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.component_presets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  component_type_id UUID REFERENCES public.component_types(id) ON DELETE CASCADE,
  preset_name TEXT NOT NULL,
  preset_config JSONB DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_definition_id UUID REFERENCES public.quiz_definitions(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT NOT NULL,
  result_data JSONB DEFAULT '{}',
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.outcomes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_definition_id UUID REFERENCES public.quiz_definitions(id) ON DELETE CASCADE,
  outcome_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  min_score INTEGER,
  max_score INTEGER,
  result_content JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.calculation_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  calculation_type TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_component_instances_funnel_id ON public.component_instances(funnel_id);
CREATE INDEX IF NOT EXISTS idx_component_instances_created_by ON public.component_instances(created_by);
CREATE INDEX IF NOT EXISTS idx_component_instances_component_type_id ON public.component_instances(component_type_id);

-- Triggers
DROP TRIGGER IF EXISTS update_quiz_definitions_updated_at ON public.quiz_definitions;
DROP TRIGGER IF EXISTS update_component_types_updated_at ON public.component_types;
DROP TRIGGER IF EXISTS update_component_instances_updated_at ON public.component_instances;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_quiz_definitions_updated_at
  BEFORE UPDATE ON public.quiz_definitions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_component_types_updated_at
  BEFORE UPDATE ON public.component_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_component_instances_updated_at
  BEFORE UPDATE ON public.component_instances
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.quiz_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.component_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.component_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.component_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculation_audit ENABLE ROW LEVEL SECURITY;

-- Políticas (drop se existirem)
DROP POLICY IF EXISTS "Public read quiz_definitions" ON public.quiz_definitions;
DROP POLICY IF EXISTS "Public read component_types" ON public.component_types;
DROP POLICY IF EXISTS "Public read outcomes" ON public.outcomes;
DROP POLICY IF EXISTS "Public read component_instances" ON public.component_instances;
DROP POLICY IF EXISTS "Public read component_presets" ON public.component_presets;
DROP POLICY IF EXISTS "Public read user_results" ON public.user_results;
DROP POLICY IF EXISTS "Public read calculation_audit" ON public.calculation_audit;

CREATE POLICY "Public read quiz_definitions" ON public.quiz_definitions FOR SELECT USING (is_active = true);
CREATE POLICY "Public read component_types" ON public.component_types FOR SELECT USING (true);
CREATE POLICY "Public read outcomes" ON public.outcomes FOR SELECT USING (true);
CREATE POLICY "Public read component_instances" ON public.component_instances FOR SELECT USING (true);
CREATE POLICY "Public read component_presets" ON public.component_presets FOR SELECT USING (true);
CREATE POLICY "Public read user_results" ON public.user_results FOR SELECT USING (true);
CREATE POLICY "Public read calculation_audit" ON public.calculation_audit FOR SELECT USING (true);

-- Seed data
INSERT INTO public.component_types (type_key, display_name, category, config_schema) VALUES
  ('quiz-header', 'Cabeçalho do Quiz', 'layout', '{"title": "string", "subtitle": "string"}'),
  ('question-multiple', 'Questão Múltipla Escolha', 'question', '{"question": "string", "options": "array"}'),
  ('question-single', 'Questão Escolha Única', 'question', '{"question": "string", "options": "array"}'),
  ('result-card', 'Card de Resultado', 'result', '{"title": "string", "description": "string", "image": "string"}'),
  ('progress-bar', 'Barra de Progresso', 'ui', '{"current": "number", "total": "number"}'),
  ('text-block', 'Bloco de Texto', 'content', '{"content": "string", "alignment": "string"}')
ON CONFLICT (type_key) DO NOTHING;