-- ============================================================================
-- 🧠 AI OPTIMIZATION & ANALYTICS TABLES - FASE 4
-- ============================================================================

-- Tabela para armazenar recomendações de otimização geradas por IA
CREATE TABLE IF NOT EXISTS ai_optimization_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  
  -- Dados da recomendação
  type TEXT NOT NULL CHECK (type IN ('performance', 'ux', 'engagement', 'technical')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  implementation TEXT,
  expected_improvement INTEGER DEFAULT 0,
  effort TEXT CHECK (effort IN ('low', 'medium', 'high')),
  auto_applicable BOOLEAN DEFAULT false,
  code_example TEXT,
  
  -- Métricas que geraram a recomendação
  metrics JSONB,
  behavior_patterns JSONB,
  
  -- Status da aplicação
  applied BOOLEAN DEFAULT false,
  applied_at TIMESTAMPTZ,
  success BOOLEAN,
  actual_improvement INTEGER,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela para métricas de performance em tempo real
CREATE TABLE IF NOT EXISTS real_time_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  
  -- Métricas de performance
  render_time NUMERIC DEFAULT 0,
  memory_usage NUMERIC DEFAULT 0,
  bundle_size NUMERIC DEFAULT 0,
  cache_hit_rate NUMERIC DEFAULT 0,
  network_latency NUMERIC DEFAULT 0,
  user_interaction_latency NUMERIC DEFAULT 0,
  error_rate NUMERIC DEFAULT 0,
  user_engagement NUMERIC DEFAULT 0,
  
  -- Score calculado
  performance_score NUMERIC DEFAULT 0,
  
  -- Contexto
  editor_mode TEXT CHECK (editor_mode IN ('visual', 'headless', 'production', 'funnel')),
  user_agent TEXT,
  device_info JSONB,
  
  -- Timestamp
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela para padrões comportamentais
CREATE TABLE IF NOT EXISTS user_behavior_patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  funnel_id TEXT,
  session_id TEXT,
  
  -- Dados do padrão
  action TEXT NOT NULL,
  frequency INTEGER DEFAULT 0,
  avg_duration NUMERIC DEFAULT 0,
  success_rate NUMERIC DEFAULT 0,
  drop_off_points JSONB DEFAULT '[]'::jsonb,
  optimization_potential NUMERIC DEFAULT 0,
  
  -- Período de análise
  analyzed_period_start TIMESTAMPTZ,
  analyzed_period_end TIMESTAMPTZ,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela para resultados de otimizações aplicadas
CREATE TABLE IF NOT EXISTS optimization_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recommendation_id UUID REFERENCES ai_optimization_recommendations(id),
  funnel_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  
  -- Dados da aplicação
  applied_by TEXT, -- 'user' | 'auto'
  applied_at TIMESTAMPTZ DEFAULT now(),
  
  -- Métricas antes e depois
  before_metrics JSONB,
  after_metrics JSONB,
  improvement_percentage NUMERIC DEFAULT 0,
  
  -- Status
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  rollback_available BOOLEAN DEFAULT false,
  rolled_back BOOLEAN DEFAULT false,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_funnel_id ON ai_optimization_recommendations (funnel_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id ON ai_optimization_recommendations (user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_type_priority ON ai_optimization_recommendations (type, priority);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_applied ON ai_optimization_recommendations (applied, applied_at);

CREATE INDEX IF NOT EXISTS idx_real_time_metrics_funnel_id ON real_time_metrics (funnel_id);
CREATE INDEX IF NOT EXISTS idx_real_time_metrics_session_id ON real_time_metrics (session_id);
CREATE INDEX IF NOT EXISTS idx_real_time_metrics_recorded_at ON real_time_metrics (recorded_at);
CREATE INDEX IF NOT EXISTS idx_real_time_metrics_performance_score ON real_time_metrics (performance_score);

CREATE INDEX IF NOT EXISTS idx_behavior_patterns_user_id ON user_behavior_patterns (user_id);
CREATE INDEX IF NOT EXISTS idx_behavior_patterns_funnel_id ON user_behavior_patterns (funnel_id);
CREATE INDEX IF NOT EXISTS idx_behavior_patterns_action ON user_behavior_patterns (action);

CREATE INDEX IF NOT EXISTS idx_optimization_results_recommendation_id ON optimization_results (recommendation_id);
CREATE INDEX IF NOT EXISTS idx_optimization_results_funnel_id ON optimization_results (funnel_id);
CREATE INDEX IF NOT EXISTS idx_optimization_results_success ON optimization_results (success, applied_at);

-- Políticas de segurança (RLS)
ALTER TABLE ai_optimization_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_time_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_behavior_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimization_results ENABLE ROW LEVEL SECURITY;

-- Políticas para ai_optimization_recommendations
CREATE POLICY IF NOT EXISTS "Users can view their own AI recommendations" ON ai_optimization_recommendations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own AI recommendations" ON ai_optimization_recommendations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own AI recommendations" ON ai_optimization_recommendations
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para real_time_metrics
CREATE POLICY IF NOT EXISTS "Users can view their own metrics" ON real_time_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own metrics" ON real_time_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para user_behavior_patterns
CREATE POLICY IF NOT EXISTS "Users can view their own behavior patterns" ON user_behavior_patterns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own behavior patterns" ON user_behavior_patterns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own behavior patterns" ON user_behavior_patterns
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para optimization_results
CREATE POLICY IF NOT EXISTS "Users can view their own optimization results" ON optimization_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own optimization results" ON optimization_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Triggers para updated_at
CREATE TRIGGER update_ai_recommendations_updated_at
  BEFORE UPDATE ON ai_optimization_recommendations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_behavior_patterns_updated_at
  BEFORE UPDATE ON user_behavior_patterns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para limpeza automática de métricas antigas (manter apenas 30 dias)
CREATE OR REPLACE FUNCTION cleanup_old_metrics()
RETURNS void AS $$
BEGIN
  -- Manter métricas dos últimos 30 dias
  DELETE FROM real_time_metrics 
  WHERE recorded_at < now() - INTERVAL '30 days';
  
  -- Manter resultados de otimização dos últimos 90 dias
  DELETE FROM optimization_results 
  WHERE created_at < now() - INTERVAL '90 days';
  
  -- Manter padrões comportamentais dos últimos 60 dias
  DELETE FROM user_behavior_patterns 
  WHERE created_at < now() - INTERVAL '60 days';
END;
$$ LANGUAGE plpgsql;

-- Comentários para documentação
COMMENT ON TABLE ai_optimization_recommendations IS 'Recomendações de otimização geradas por IA para melhorar performance e UX';
COMMENT ON TABLE real_time_metrics IS 'Métricas de performance coletadas em tempo real durante uso do editor';
COMMENT ON TABLE user_behavior_patterns IS 'Padrões comportamentais dos usuários identificados através de analytics';
COMMENT ON TABLE optimization_results IS 'Resultados das otimizações aplicadas, incluindo métricas antes/depois';

COMMENT ON COLUMN ai_optimization_recommendations.type IS 'Tipo da recomendação: performance, ux, engagement, technical';
COMMENT ON COLUMN ai_optimization_recommendations.priority IS 'Prioridade: low, medium, high, critical';
COMMENT ON COLUMN ai_optimization_recommendations.expected_improvement IS 'Melhoria esperada em percentual (0-100)';
COMMENT ON COLUMN ai_optimization_recommendations.auto_applicable IS 'Se a otimização pode ser aplicada automaticamente';

COMMENT ON COLUMN real_time_metrics.performance_score IS 'Score de performance calculado (0-100)';
COMMENT ON COLUMN real_time_metrics.render_time IS 'Tempo de renderização em milissegundos';
COMMENT ON COLUMN real_time_metrics.memory_usage IS 'Uso de memória em percentual';
COMMENT ON COLUMN real_time_metrics.cache_hit_rate IS 'Taxa de acerto do cache em percentual';