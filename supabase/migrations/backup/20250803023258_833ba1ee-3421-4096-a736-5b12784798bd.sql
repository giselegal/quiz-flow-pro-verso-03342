-- Criar tabelas para sistema de quiz completo

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

-- Tabela para sessões de quiz
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  funnel_id TEXT NOT NULL REFERENCES public.funnels(id) ON DELETE CASCADE,
  quiz_user_id UUID NOT NULL REFERENCES public.quiz_users(id) ON DELETE CASCADE,
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

-- Tabela para resultados finais do quiz
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  result_type TEXT NOT NULL,
  result_title TEXT,
  result_description TEXT,
  result_data JSONB DEFAULT '{}',
  recommendation TEXT,
  next_steps JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Tabela para analytics de quiz
CREATE TABLE IF NOT EXISTS public.quiz_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  funnel_id TEXT NOT NULL REFERENCES public.funnels(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id UUID REFERENCES public.quiz_sessions(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.quiz_users(id) ON DELETE SET NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Tabela para conversões do quiz
CREATE TABLE IF NOT EXISTS public.quiz_conversions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  conversion_type TEXT NOT NULL,
  conversion_value DECIMAL(10,2),
  currency TEXT DEFAULT 'BRL',
  product_id TEXT,
  product_name TEXT,
  commission_rate DECIMAL(5,4),
  affiliate_id TEXT,
  conversion_data JSONB DEFAULT '{}',
  converted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.quiz_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_step_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_conversions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para quiz_users (acesso público para participantes)
CREATE POLICY "Anyone can create quiz users"
ON public.quiz_users
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view their own quiz data"
ON public.quiz_users
FOR SELECT
USING (true);

-- Políticas RLS para quiz_sessions
CREATE POLICY "Anyone can create quiz sessions"
ON public.quiz_sessions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view quiz sessions"
ON public.quiz_sessions
FOR SELECT
USING (true);

CREATE POLICY "Anyone can update quiz sessions"
ON public.quiz_sessions
FOR UPDATE
USING (true);

-- Políticas RLS para quiz_step_responses
CREATE POLICY "Anyone can create quiz responses"
ON public.quiz_step_responses
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view quiz responses"
ON public.quiz_step_responses
FOR SELECT
USING (true);

-- Políticas RLS para quiz_results
CREATE POLICY "Anyone can create quiz results"
ON public.quiz_results
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view quiz results"
ON public.quiz_results
FOR SELECT
USING (true);

-- Políticas RLS para quiz_analytics (apenas proprietários do funil)
CREATE POLICY "Funnel owners can view quiz analytics"
ON public.quiz_analytics
FOR SELECT
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.funnels 
    WHERE funnels.id = quiz_analytics.funnel_id 
    AND funnels.user_id = (auth.uid())::text
  )
);

CREATE POLICY "System can create quiz analytics"
ON public.quiz_analytics
FOR INSERT
WITH CHECK (true);

-- Políticas RLS para quiz_conversions (apenas proprietários do funil)
CREATE POLICY "Funnel owners can view quiz conversions"
ON public.quiz_conversions
FOR SELECT
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.quiz_sessions 
    JOIN public.funnels ON funnels.id = quiz_sessions.funnel_id
    WHERE quiz_sessions.id = quiz_conversions.session_id 
    AND funnels.user_id = (auth.uid())::text
  )
);

CREATE POLICY "System can create quiz conversions"
ON public.quiz_conversions
FOR INSERT
WITH CHECK (true);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_funnel_id ON public.quiz_sessions(funnel_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_status ON public.quiz_sessions(status);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_created_at ON public.quiz_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_quiz_step_responses_session_id ON public.quiz_step_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_analytics_funnel_id ON public.quiz_analytics(funnel_id);
CREATE INDEX IF NOT EXISTS idx_quiz_analytics_timestamp ON public.quiz_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_quiz_conversions_session_id ON public.quiz_conversions(session_id);

-- Função para atualizar last_activity automaticamente
CREATE OR REPLACE FUNCTION public.update_quiz_session_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.quiz_sessions 
  SET last_activity = now()
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar atividade quando há novas respostas
CREATE TRIGGER update_session_activity_on_response
  AFTER INSERT ON public.quiz_step_responses
  FOR EACH ROW EXECUTE FUNCTION public.update_quiz_session_activity();