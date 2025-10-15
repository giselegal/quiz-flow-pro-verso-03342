-- ============================================================================
-- CRIAÇÃO COMPLETA DO SCHEMA - QUIZ & EDITOR SYSTEM
-- ============================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- FASE 1: TABELAS BASE - QUIZ DEFINITIONS & COMPONENT TYPES
-- ============================================================================

-- Tabela de definições de quiz
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

-- Tabela de tipos de componentes
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

-- ============================================================================
-- FASE 2: SISTEMA DE QUIZ (CORE)
-- ============================================================================

-- Tabela de usuários do quiz (participantes anônimos)
CREATE TABLE IF NOT EXISTS public.quiz_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  email TEXT,
  name TEXT,
  ip_address INET,
  user_agent TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de sessões de quiz
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_id TEXT,
  user_id UUID REFERENCES public.quiz_users(id) ON DELETE CASCADE,
  quiz_user_id UUID REFERENCES public.quiz_users(id) ON DELETE CASCADE,
  session_token TEXT,
  status TEXT NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'in_progress', 'completed', 'abandoned')),
  current_step INTEGER DEFAULT 0,
  total_steps INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  device_info JSONB,
  time_spent_total INTEGER DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0,
  user_name TEXT,
  final_result JSONB
);

-- Tabela de respostas por etapa
CREATE TABLE IF NOT EXISTS public.quiz_step_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  question_id TEXT NOT NULL,
  question_text TEXT,
  answer_value TEXT,
  answer_text TEXT,
  score_earned INTEGER DEFAULT 0,
  response_time_ms INTEGER,
  responded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Tabela de analytics em tempo real
CREATE TABLE IF NOT EXISTS public.quiz_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  funnel_id TEXT,
  user_id UUID,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  metric_data JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de resultados finais
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  result_type TEXT NOT NULL,
  result_title TEXT,
  result_description TEXT,
  result_data JSONB DEFAULT '{}',
  recommendation TEXT,
  next_steps JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de eventos detalhados
CREATE TABLE IF NOT EXISTS public.quiz_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('quiz_started', 'step_completed', 'quiz_completed', 'step_viewed', 'option_selected')),
  user_session_id TEXT NOT NULL,
  step_number INTEGER,
  option_selected TEXT,
  time_spent INTEGER,
  user_data JSONB,
  quiz_data JSONB,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- FASE 3: SISTEMA DE EDITOR
-- ============================================================================

-- Tabela de instâncias de componentes
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

-- Tabela de presets de componentes
CREATE TABLE IF NOT EXISTS public.component_presets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  component_type_id UUID REFERENCES public.component_types(id) ON DELETE CASCADE,
  preset_name TEXT NOT NULL,
  preset_config JSONB DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- FASE 4: RESULTADOS E AUDITORIA
-- ============================================================================

-- Tabela de resultados de usuários
CREATE TABLE IF NOT EXISTS public.user_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_definition_id UUID REFERENCES public.quiz_definitions(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT NOT NULL,
  result_data JSONB DEFAULT '{}',
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de possíveis resultados (outcomes)
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

-- Tabela de auditoria de cálculos
CREATE TABLE IF NOT EXISTS public.calculation_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  calculation_type TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- FASE 5: ÍNDICES DE PERFORMANCE
-- ============================================================================

-- Quiz System Indexes
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_funnel_id ON public.quiz_sessions(funnel_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_status ON public.quiz_sessions(status);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_started_at ON public.quiz_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_completed_at ON public.quiz_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_quiz_user_id ON public.quiz_sessions(quiz_user_id);

CREATE INDEX IF NOT EXISTS idx_quiz_step_responses_session_id ON public.quiz_step_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_step_responses_step_number ON public.quiz_step_responses(step_number);

CREATE INDEX IF NOT EXISTS idx_quiz_analytics_session_id ON public.quiz_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_analytics_funnel_id ON public.quiz_analytics(funnel_id);

CREATE INDEX IF NOT EXISTS idx_quiz_results_session_id ON public.quiz_results(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_result_type ON public.quiz_results(result_type);
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON public.quiz_results(created_at);

CREATE INDEX IF NOT EXISTS idx_quiz_events_session_id ON public.quiz_events(user_session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_events_event_type ON public.quiz_events(event_type);
CREATE INDEX IF NOT EXISTS idx_quiz_events_timestamp ON public.quiz_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_quiz_events_step_number ON public.quiz_events(step_number);

-- Editor System Indexes
CREATE INDEX IF NOT EXISTS idx_component_instances_funnel_id ON public.component_instances(funnel_id);
CREATE INDEX IF NOT EXISTS idx_component_instances_created_by ON public.component_instances(created_by);
CREATE INDEX IF NOT EXISTS idx_component_instances_component_type_id ON public.component_instances(component_type_id);

-- ============================================================================
-- FASE 6: TRIGGERS PARA UPDATED_AT AUTOMÁTICO
-- ============================================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Aplicar triggers
CREATE TRIGGER update_quiz_definitions_updated_at
  BEFORE UPDATE ON public.quiz_definitions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_component_types_updated_at
  BEFORE UPDATE ON public.component_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_component_instances_updated_at
  BEFORE UPDATE ON public.component_instances
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- FASE 7: ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.quiz_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.component_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_step_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.component_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.component_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculation_audit ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público para quiz anônimo
CREATE POLICY "Public access to quiz_users" ON public.quiz_users FOR ALL USING (true);
CREATE POLICY "Public access to quiz_sessions" ON public.quiz_sessions FOR ALL USING (true);
CREATE POLICY "Public access to quiz_step_responses" ON public.quiz_step_responses FOR ALL USING (true);
CREATE POLICY "Public access to quiz_analytics" ON public.quiz_analytics FOR ALL USING (true);
CREATE POLICY "Public access to quiz_results" ON public.quiz_results FOR ALL USING (true);
CREATE POLICY "Public access to quiz_events" ON public.quiz_events FOR ALL USING (true);

-- Políticas de leitura pública para definições e componentes
CREATE POLICY "Public read quiz_definitions" ON public.quiz_definitions FOR SELECT USING (is_active = true);
CREATE POLICY "Public read component_types" ON public.component_types FOR SELECT USING (true);
CREATE POLICY "Public read outcomes" ON public.outcomes FOR SELECT USING (true);

-- Políticas básicas para outras tabelas (ajustar conforme necessário)
CREATE POLICY "Public read component_instances" ON public.component_instances FOR SELECT USING (true);
CREATE POLICY "Public read component_presets" ON public.component_presets FOR SELECT USING (true);
CREATE POLICY "Public read user_results" ON public.user_results FOR SELECT USING (true);
CREATE POLICY "Public read calculation_audit" ON public.calculation_audit FOR SELECT USING (true);

-- ============================================================================
-- FASE 8: SEED DATA INICIAL
-- ============================================================================

-- Popular component_types com componentes padrão
INSERT INTO public.component_types (type_key, display_name, category, config_schema) VALUES
  ('quiz-header', 'Cabeçalho do Quiz', 'layout', '{"title": "string", "subtitle": "string"}'),
  ('question-multiple', 'Questão Múltipla Escolha', 'question', '{"question": "string", "options": "array"}'),
  ('question-single', 'Questão Escolha Única', 'question', '{"question": "string", "options": "array"}'),
  ('result-card', 'Card de Resultado', 'result', '{"title": "string", "description": "string", "image": "string"}'),
  ('progress-bar', 'Barra de Progresso', 'ui', '{"current": "number", "total": "number"}'),
  ('text-block', 'Bloco de Texto', 'content', '{"content": "string", "alignment": "string"}')
ON CONFLICT (type_key) DO NOTHING;