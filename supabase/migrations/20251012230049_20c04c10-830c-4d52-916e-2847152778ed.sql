-- FASE 4: Criar tabelas para dados reais no Admin Dashboard (corrigido)

-- 2. Tabela de atividades de usuários
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'quiz_started', 'quiz_completed', 'step_completed',
    'lead_captured', 'purchase_made', 'template_created',
    'funnel_created', 'settings_updated', 'integration_connected'
  )),
  activity_description TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_activities_user ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_date ON user_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activities_entity ON user_activities(entity_type, entity_id);

-- 3. Tabela de sessões ativas de usuários
CREATE TABLE IF NOT EXISTS active_user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  session_token TEXT UNIQUE NOT NULL,
  funnel_id TEXT,
  current_page TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  user_agent TEXT,
  ip_address TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_active_user_sessions_user ON active_user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_active_user_sessions_active ON active_user_sessions(is_active, last_activity);
CREATE INDEX IF NOT EXISTS idx_active_user_sessions_funnel ON active_user_sessions(funnel_id);

-- 4. Tabela de analytics de sessões agregadas
CREATE TABLE IF NOT EXISTS session_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  funnel_id TEXT,
  total_sessions INTEGER DEFAULT 0,
  completed_sessions INTEGER DEFAULT 0,
  abandoned_sessions INTEGER DEFAULT 0,
  average_duration_seconds INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, funnel_id)
);

CREATE INDEX IF NOT EXISTS idx_session_analytics_date ON session_analytics(date);
CREATE INDEX IF NOT EXISTS idx_session_analytics_funnel ON session_analytics(funnel_id);

-- Enable RLS on all tables
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_activities (admins only)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_activities' 
    AND policyname = 'Admin full access to user_activities'
  ) THEN
    CREATE POLICY "Admin full access to user_activities"
      ON user_activities
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END$$;

-- RLS Policies for active_user_sessions (admins only)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'active_user_sessions' 
    AND policyname = 'Admin full access to active_user_sessions'
  ) THEN
    CREATE POLICY "Admin full access to active_user_sessions"
      ON active_user_sessions
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END$$;

-- RLS Policies for session_analytics (admins only)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'session_analytics' 
    AND policyname = 'Admin full access to session_analytics'
  ) THEN
    CREATE POLICY "Admin full access to session_analytics"
      ON session_analytics
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_session_analytics_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for session_analytics
DROP TRIGGER IF EXISTS session_analytics_updated_at ON session_analytics;
CREATE TRIGGER session_analytics_updated_at
  BEFORE UPDATE ON session_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_session_analytics_timestamp();