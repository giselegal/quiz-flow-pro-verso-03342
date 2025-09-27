-- Tabela para resultados finais do quiz
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  result_type TEXT NOT NULL,
  result_title TEXT,
  result_description TEXT,
  result_data JSONB DEFAULT '{}',
  recommendation TEXT,
  next_steps JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_quiz_results_session_id ON public.quiz_results(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_result_type ON public.quiz_results(result_type);
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON public.quiz_results(created_at);

-- Habilitar RLS
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Política RLS básica (permitir acesso público para quiz anônimo)
CREATE POLICY "Allow public access to quiz_results" ON public.quiz_results
  FOR ALL USING (true);