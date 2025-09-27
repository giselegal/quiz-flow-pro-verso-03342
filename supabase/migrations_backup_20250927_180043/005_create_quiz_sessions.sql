-- Criar tabelas necessárias para integração backend do quiz
-- Baseado na análise dos hooks useQuizBackendIntegration e useQuizRealTimeAnalytics

-- Tabela para usuários de quiz (participantes anônimos)
CREATE TABLE IF NOT EXISTS public.quiz_users (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  email TEXT,
  name TEXT,
  ip_address INET,
  user_agent TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Tabela for sessões de quiz
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
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
  PRIMARY KEY (id)
);

-- Tabela para respostas de cada etapa do quiz
CREATE TABLE IF NOT EXISTS public.quiz_step_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  question_id TEXT NOT NULL,
  question_text TEXT,
  answer_value TEXT,
  answer_text TEXT,
  score_earned INTEGER DEFAULT 0,
  response_time_ms INTEGER,
  responded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  PRIMARY KEY (id)
);

-- Tabela para métricas de analytics em tempo real
CREATE TABLE IF NOT EXISTS public.quiz_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  metric_data JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_funnel_id ON public.quiz_sessions(funnel_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_status ON public.quiz_sessions(status);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_created_at ON public.quiz_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_quiz_step_responses_session_id ON public.quiz_step_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_step_responses_step_number ON public.quiz_step_responses(step_number);
CREATE INDEX IF NOT EXISTS idx_quiz_analytics_session_id ON public.quiz_analytics(session_id);

-- Habilitar RLS
ALTER TABLE public.quiz_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_step_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_analytics ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (permitir acesso público para quiz anônimo)
CREATE POLICY "Allow public access to quiz_users" ON public.quiz_users
  FOR ALL USING (true);

CREATE POLICY "Allow public access to quiz_sessions" ON public.quiz_sessions
  FOR ALL USING (true);

CREATE POLICY "Allow public access to quiz_step_responses" ON public.quiz_step_responses
  FOR ALL USING (true);

CREATE POLICY "Allow public access to quiz_analytics" ON public.quiz_analytics
  FOR ALL USING (true);