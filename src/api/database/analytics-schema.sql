-- ============================================================================
-- 📊 SCHEMA PARA ANALYTICS EM TEMPO REAL
-- ============================================================================

-- Tabela para eventos de analytics
CREATE TABLE IF NOT EXISTS quiz_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL CHECK (event_type IN ('quiz_started', 'step_completed', 'quiz_completed', 'step_viewed', 'option_selected')),
  user_session_id text NOT NULL,
  step_number integer,
  option_selected text,
  time_spent integer, -- em segundos
  user_data jsonb,
  quiz_data jsonb,
  timestamp timestamptz NOT NULL DEFAULT now(),
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Adicionar colunas à tabela quiz_sessions existente
DO $$
BEGIN
  -- Adicionar coluna device_info se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_sessions' AND column_name = 'device_info') THEN
    ALTER TABLE quiz_sessions ADD COLUMN device_info jsonb;
  END IF;

  -- Adicionar coluna time_spent_total se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_sessions' AND column_name = 'time_spent_total') THEN
    ALTER TABLE quiz_sessions ADD COLUMN time_spent_total integer DEFAULT 0;
  END IF;

  -- Adicionar coluna completion_percentage se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_sessions' AND column_name = 'completion_percentage') THEN
    ALTER TABLE quiz_sessions ADD COLUMN completion_percentage integer DEFAULT 0;
  END IF;

  -- Adicionar coluna user_name se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_sessions' AND column_name = 'user_name') THEN
    ALTER TABLE quiz_sessions ADD COLUMN user_name text;
  END IF;

  -- Adicionar coluna final_result se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_sessions' AND column_name = 'final_result') THEN
    ALTER TABLE quiz_sessions ADD COLUMN final_result jsonb;
  END IF;
END $$;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_quiz_events_session_id ON quiz_events (user_session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_events_event_type ON quiz_events (event_type);
CREATE INDEX IF NOT EXISTS idx_quiz_events_timestamp ON quiz_events (timestamp);
CREATE INDEX IF NOT EXISTS idx_quiz_events_step_number ON quiz_events (step_number);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_started_at ON quiz_sessions (started_at);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_completed_at ON quiz_sessions (completed_at);

-- Políticas de segurança (RLS)
ALTER TABLE quiz_events ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de eventos
CREATE POLICY IF NOT EXISTS "Allow insert quiz events" ON quiz_events
  FOR INSERT WITH CHECK (true);

-- Política para permitir leitura de eventos
CREATE POLICY IF NOT EXISTS "Allow read quiz events" ON quiz_events
  FOR SELECT USING (true);

-- Função para limpeza automática de dados antigos (opcional)
CREATE OR REPLACE FUNCTION cleanup_old_analytics_data()
RETURNS void AS $$
BEGIN
  -- Manter apenas dados dos últimos 90 dias
  DELETE FROM quiz_events 
  WHERE timestamp < now() - INTERVAL '90 days';
  
  DELETE FROM quiz_sessions 
  WHERE started_at < now() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Comentários para documentação
COMMENT ON TABLE quiz_events IS 'Eventos de analytics em tempo real do quiz';
COMMENT ON COLUMN quiz_events.event_type IS 'Tipo do evento: quiz_started, step_completed, quiz_completed, step_viewed, option_selected';
COMMENT ON COLUMN quiz_events.user_session_id IS 'ID único da sessão do usuário';
COMMENT ON COLUMN quiz_events.step_number IS 'Número da etapa (1-21)';
COMMENT ON COLUMN quiz_events.time_spent IS 'Tempo gasto em segundos';
COMMENT ON COLUMN quiz_events.user_data IS 'Dados do usuário (nome, device, etc.)';
COMMENT ON COLUMN quiz_events.quiz_data IS 'Dados do resultado do quiz';

COMMENT ON COLUMN quiz_sessions.device_info IS 'Informações do dispositivo (tipo, resolução, user agent)';
COMMENT ON COLUMN quiz_sessions.time_spent_total IS 'Tempo total gasto no quiz em segundos';
COMMENT ON COLUMN quiz_sessions.completion_percentage IS 'Percentual de conclusão (0-100)';
COMMENT ON COLUMN quiz_sessions.user_name IS 'Nome do usuário que fez o quiz';
COMMENT ON COLUMN quiz_sessions.final_result IS 'Resultado final do quiz (estilo, pontuação, etc.)';
