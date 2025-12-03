-- ============================================
-- CREATE quiz_analytics table
-- Tracking de métricas e eventos do quiz
-- ============================================

CREATE TABLE IF NOT EXISTS public.quiz_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  user_id TEXT,
  funnel_id TEXT,
  
  -- Métricas
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  metric_data JSONB,
  
  -- Timestamps
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  
  -- Índices
  CONSTRAINT quiz_analytics_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.quiz_sessions(id) ON DELETE CASCADE
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_quiz_analytics_session_id ON public.quiz_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_analytics_funnel_id ON public.quiz_analytics(funnel_id);
CREATE INDEX IF NOT EXISTS idx_quiz_analytics_metric_name ON public.quiz_analytics(metric_name);
CREATE INDEX IF NOT EXISTS idx_quiz_analytics_recorded_at ON public.quiz_analytics(recorded_at DESC);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE public.quiz_analytics ENABLE ROW LEVEL SECURITY;

-- Admins podem ver todas as analytics
CREATE POLICY "quiz_analytics_admin_select" 
  ON quiz_analytics 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = users.id
        AND users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Owners do funnel podem ver analytics dos seus funis
CREATE POLICY "quiz_analytics_owner_select" 
  ON quiz_analytics 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM funnels f
      WHERE f.id = quiz_analytics.funnel_id
        AND (
          f.user_id::uuid = auth.uid()
          OR f.user_id IS NULL  -- Templates públicos
        )
    )
  );

-- Service role pode inserir analytics (sistema)
CREATE POLICY "quiz_analytics_system_write" 
  ON quiz_analytics 
  FOR INSERT 
  WITH CHECK (
    coalesce((current_setting('request.jwt.claims', true)::jsonb->>'role'), '') = 'service_role'
  );

-- Comentário
COMMENT ON TABLE public.quiz_analytics IS 'Tabela de analytics e métricas dos quizzes - alinhada com src/integrations/supabase/types.ts';

SELECT 'quiz_analytics table created successfully' AS status;
