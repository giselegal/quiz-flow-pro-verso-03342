-- =============================================================================
-- SISTEMA COMPLETO DE QUIZ DE ESTILOS - SUPABASE SCHEMA
-- Quiz Quest Challenge Verse - Sistema de Estilo de Vida
-- =============================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. TABELA DE USUÁRIOS DO QUIZ (anônimos ou identificados)
-- =============================================================================

CREATE TABLE quiz_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  
  -- Dados de marketing
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  
  -- Dados técnicos
  user_agent TEXT,
  ip_address INET,
  session_id TEXT UNIQUE NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 2. TABELA DE SESSÕES DE QUIZ
-- =============================================================================

CREATE TABLE quiz_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES quiz_users(id) ON DELETE CASCADE,
  
  -- Status da sessão
  status TEXT DEFAULT 'started' CHECK (status IN ('started', 'in_progress', 'completed', 'abandoned')),
  current_step INTEGER DEFAULT 1,
  
  -- Configurações do quiz
  quiz_type TEXT DEFAULT 'style_quiz',
  version TEXT DEFAULT 'v1.0',
  
  -- Timestamps de progresso
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Metadados
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 3. TABELA DE RESPOSTAS POR ETAPA
-- =============================================================================

CREATE TABLE quiz_step_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES quiz_sessions(session_id) ON DELETE CASCADE,
  
  -- Identificação da etapa
  step_number INTEGER NOT NULL,
  step_id TEXT NOT NULL, -- ex: 'etapa-2', 'etapa-3', etc.
  question_id TEXT, -- ex: 'q1', 'q2', etc.
  
  -- Resposta
  selected_options TEXT[] DEFAULT '{}', -- Array de opções selecionadas
  response_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Categorização para cálculo
  style_category TEXT, -- ex: 'minimalista', 'boho', 'classico', etc.
  strategic_category TEXT, -- Para perguntas estratégicas
  
  -- Timing
  time_taken_seconds INTEGER,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Metadados
  metadata JSONB DEFAULT '{}'::jsonb
);

-- =============================================================================
-- 4. TABELA DE RESULTADOS CALCULADOS
-- =============================================================================

CREATE TABLE quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES quiz_sessions(session_id) ON DELETE CASCADE,
  
  -- Resultado principal
  predominant_style TEXT NOT NULL,
  predominant_percentage NUMERIC(5,2) NOT NULL,
  
  -- Estilos complementares
  complementary_styles JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Dados detalhados do cálculo
  style_scores JSONB NOT NULL DEFAULT '{}'::jsonb, -- {minimalista: 45, boho: 30, classico: 25}
  calculation_details JSONB DEFAULT '{}'::jsonb,
  
  -- Dados estratégicos (lead qualification)
  strategic_data JSONB DEFAULT '{}'::jsonb,
  lead_score INTEGER DEFAULT 0,
  
  -- Recomendações
  recommended_products JSONB DEFAULT '[]'::jsonb,
  personalized_message TEXT,
  
  -- Timestamps
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 5. TABELA DE ANALYTICS E TRACKING
-- =============================================================================

CREATE TABLE quiz_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES quiz_sessions(session_id) ON DELETE CASCADE,
  
  -- Tipo de evento
  event_type TEXT NOT NULL CHECK (event_type IN (
    'quiz_start', 'step_view', 'step_complete', 'quiz_complete', 'quiz_abandon',
    'button_click', 'option_select', 'checkout_click', 'result_view'
  )),
  
  -- Dados do evento
  step_number INTEGER,
  step_id TEXT,
  event_data JSONB DEFAULT '{}'::jsonb,
  
  -- Dados de tracking externos
  ga4_tracked BOOLEAN DEFAULT false,
  facebook_tracked BOOLEAN DEFAULT false,
  
  -- Timestamps
  event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 6. TABELA DE CONVERSÕES
-- =============================================================================

CREATE TABLE quiz_conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES quiz_sessions(session_id) ON DELETE CASCADE,
  
  -- Dados da conversão
  conversion_type TEXT NOT NULL CHECK (conversion_type IN (
    'checkout_click', 'email_capture', 'whatsapp_click', 'product_view', 'purchase'
  )),
  
  -- Valor da conversão
  conversion_value NUMERIC(10,2),
  currency TEXT DEFAULT 'BRL',
  
  -- Produto/Serviço
  product_id TEXT,
  product_name TEXT,
  product_category TEXT,
  
  -- Dados de acompanhamento
  conversion_data JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  converted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 7. ÍNDICES PARA PERFORMANCE
-- =============================================================================

-- Índices principais
CREATE INDEX idx_quiz_sessions_session_id ON quiz_sessions(session_id);
CREATE INDEX idx_quiz_sessions_status ON quiz_sessions(status);
CREATE INDEX idx_quiz_sessions_started_at ON quiz_sessions(started_at);

CREATE INDEX idx_quiz_step_responses_session_id ON quiz_step_responses(session_id);
CREATE INDEX idx_quiz_step_responses_step_number ON quiz_step_responses(step_number);
CREATE INDEX idx_quiz_step_responses_question_id ON quiz_step_responses(question_id);

CREATE INDEX idx_quiz_results_session_id ON quiz_results(session_id);
CREATE INDEX idx_quiz_results_predominant_style ON quiz_results(predominant_style);

CREATE INDEX idx_quiz_analytics_session_id ON quiz_analytics(session_id);
CREATE INDEX idx_quiz_analytics_event_type ON quiz_analytics(event_type);
CREATE INDEX idx_quiz_analytics_event_timestamp ON quiz_analytics(event_timestamp);

CREATE INDEX idx_quiz_conversions_session_id ON quiz_conversions(session_id);
CREATE INDEX idx_quiz_conversions_conversion_type ON quiz_conversions(conversion_type);

-- =============================================================================
-- 8. TRIGGERS PARA UPDATED_AT
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quiz_users_updated_at BEFORE UPDATE ON quiz_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_sessions_updated_at BEFORE UPDATE ON quiz_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 9. RLS (Row Level Security) - Opcional para futuro
-- =============================================================================

-- Habilitar RLS nas tabelas (comentado por enquanto)
-- ALTER TABLE quiz_users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE quiz_step_responses ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE quiz_analytics ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE quiz_conversions ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 10. FUNÇÕES UTILITÁRIAS
-- =============================================================================

-- Função para calcular score de um estilo baseado nas respostas
CREATE OR REPLACE FUNCTION calculate_style_score(
    p_session_id TEXT,
    p_style_name TEXT
) RETURNS INTEGER AS $$
DECLARE
    style_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO style_count
    FROM quiz_step_responses
    WHERE session_id = p_session_id 
    AND style_category = p_style_name;
    
    RETURN COALESCE(style_count, 0);
END;
$$ LANGUAGE plpgsql;

-- Função para obter o estilo predominante
CREATE OR REPLACE FUNCTION get_predominant_style(p_session_id TEXT)
RETURNS TABLE(style_name TEXT, count INTEGER, percentage NUMERIC) AS $$
DECLARE
    total_responses INTEGER;
BEGIN
    -- Contar total de respostas com categoria de estilo
    SELECT COUNT(*)
    INTO total_responses
    FROM quiz_step_responses
    WHERE session_id = p_session_id 
    AND style_category IS NOT NULL;
    
    RETURN QUERY
    SELECT 
        style_category as style_name,
        COUNT(*)::INTEGER as count,
        ROUND((COUNT(*)::NUMERIC / total_responses::NUMERIC) * 100, 2) as percentage
    FROM quiz_step_responses
    WHERE session_id = p_session_id 
    AND style_category IS NOT NULL
    GROUP BY style_category
    ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =============================================================================

COMMENT ON TABLE quiz_users IS 'Usuários que participaram do quiz (anônimos ou identificados)';
COMMENT ON TABLE quiz_sessions IS 'Sessões de quiz com status e progresso';
COMMENT ON TABLE quiz_step_responses IS 'Respostas individuais por etapa do quiz';
COMMENT ON TABLE quiz_results IS 'Resultados calculados do quiz com estilos predominantes';
COMMENT ON TABLE quiz_analytics IS 'Eventos de analytics e tracking detalhado';
COMMENT ON TABLE quiz_conversions IS 'Conversões e ações de valor do usuário';

COMMENT ON COLUMN quiz_step_responses.style_category IS 'Categoria de estilo para cálculo (minimalista, boho, classico, etc.)';
COMMENT ON COLUMN quiz_step_responses.strategic_category IS 'Categoria estratégica para qualificação de leads';
COMMENT ON COLUMN quiz_results.predominant_style IS 'Estilo com maior pontuação';
COMMENT ON COLUMN quiz_results.complementary_styles IS 'Array de estilos complementares com percentuais';
COMMENT ON COLUMN quiz_results.style_scores IS 'JSON com pontuação detalhada de todos os estilos';
