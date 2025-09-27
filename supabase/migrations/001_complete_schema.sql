-- COMPLETE SCHEMA MIGRATION
-- Criação completa e limpa de todas as tabelas baseado em src/integrations/supabase/types.ts

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =======================
-- CORE TABLES
-- =======================

-- Tabela funnels (Funis de Quiz)
CREATE TABLE IF NOT EXISTS public.funnels (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text,
    settings jsonb,
    is_published boolean DEFAULT false,
    user_id text,
    version integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Tabela quiz_users (Usuários que fazem Quiz)
CREATE TABLE IF NOT EXISTS public.quiz_users (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id text NOT NULL,
    name text,
    email text,
    ip_address inet,
    user_agent text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Tabela quiz_sessions (Sessões de Quiz)
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    funnel_id text NOT NULL REFERENCES public.funnels(id) ON DELETE CASCADE,
    quiz_user_id text NOT NULL REFERENCES public.quiz_users(id) ON DELETE CASCADE,
    status text DEFAULT 'active',
    current_step integer DEFAULT 0,
    total_steps integer,
    score integer DEFAULT 0,
    max_score integer,
    metadata jsonb,
    started_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    completed_at timestamp with time zone,
    last_activity timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Tabela quiz_results (Resultados do Quiz)
CREATE TABLE IF NOT EXISTS public.quiz_results (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id text NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
    result_type text NOT NULL,
    result_title text,
    result_description text,
    recommendation text,
    result_data jsonb,
    next_steps jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Tabela quiz_step_responses (Respostas das Etapas)
CREATE TABLE IF NOT EXISTS public.quiz_step_responses (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id text NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
    step_number integer NOT NULL,
    question_id text NOT NULL,
    question_text text,
    answer_value text,
    answer_text text,
    metadata jsonb,
    responded_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Tabela quiz_conversions (Conversões)
CREATE TABLE IF NOT EXISTS public.quiz_conversions (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id text NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
    conversion_type text NOT NULL,
    conversion_value numeric,
    currency text DEFAULT 'USD',
    product_id text,
    product_name text,
    affiliate_id text,
    commission_rate numeric,
    conversion_data jsonb,
    converted_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- =======================
-- ADMIN TABLES
-- =======================

-- Tabela active_sessions (Sessões Ativas do Sistema)
CREATE TABLE IF NOT EXISTS public.active_sessions (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id text NOT NULL,
    session_token text NOT NULL UNIQUE,
    expires_at timestamp with time zone NOT NULL,
    is_active boolean DEFAULT true,
    ip_address inet,
    user_agent text,
    location_data jsonb,
    last_activity timestamp with time zone DEFAULT timezone('utc'::text, now()),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Tabela admin_goals (Metas do Admin)
CREATE TABLE IF NOT EXISTS public.admin_goals (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id text NOT NULL,
    goal_type text NOT NULL,
    target_value numeric NOT NULL,
    current_value numeric DEFAULT 0,
    achieved boolean DEFAULT false,
    period_start timestamp with time zone DEFAULT timezone('utc'::text, now()),
    period_end timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- =======================
-- AI & OPTIMIZATION
-- =======================

-- Tabela ai_optimization_recommendations (Recomendações de IA)
CREATE TABLE IF NOT EXISTS public.ai_optimization_recommendations (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id text,
    funnel_id text REFERENCES public.funnels(id) ON DELETE CASCADE,
    session_id text,
    type text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    priority text NOT NULL,
    expected_improvement numeric,
    actual_improvement numeric,
    effort text,
    auto_applicable boolean DEFAULT false,
    applied boolean DEFAULT false,
    applied_at timestamp with time zone,
    success boolean,
    implementation text,
    code_example text,
    metrics jsonb,
    behavior_patterns jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Tabela optimization_results (Resultados de Otimização)
CREATE TABLE IF NOT EXISTS public.optimization_results (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    recommendation_id text REFERENCES public.ai_optimization_recommendations(id) ON DELETE CASCADE,
    user_id text,
    funnel_id text REFERENCES public.funnels(id) ON DELETE CASCADE,
    applied_by text,
    before_metrics jsonb,
    after_metrics jsonb,
    improvement_percentage numeric,
    success boolean,
    error_message text,
    rollback_available boolean DEFAULT false,
    rolled_back boolean DEFAULT false,
    applied_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- =======================
-- SYSTEM TABLES
-- =======================

-- Tabela backup_jobs (Jobs de Backup)
CREATE TABLE IF NOT EXISTS public.backup_jobs (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id text,
    type text NOT NULL,
    description text,
    tables text[] NOT NULL,
    status text DEFAULT 'pending',
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    error_message text,
    size_bytes bigint,
    backup_data jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Tabela rate_limits (Limites de Taxa)
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id text,
    identifier text NOT NULL,
    endpoint text NOT NULL,
    current integer DEFAULT 0,
    limit_value integer NOT NULL,
    window_seconds integer NOT NULL,
    last_request bigint NOT NULL,
    reset_time bigint NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- =======================
-- TRIGGERS PARA UPDATED_AT
-- =======================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_funnels_updated_at 
    BEFORE UPDATE ON public.funnels 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_goals_updated_at 
    BEFORE UPDATE ON public.admin_goals 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_optimization_recommendations_updated_at 
    BEFORE UPDATE ON public.ai_optimization_recommendations 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rate_limits_updated_at 
    BEFORE UPDATE ON public.rate_limits 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =======================
-- ÍNDICES PARA PERFORMANCE
-- =======================

-- Índices para quiz_sessions
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_funnel_id ON public.quiz_sessions(funnel_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_quiz_user_id ON public.quiz_sessions(quiz_user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_status ON public.quiz_sessions(status);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_started_at ON public.quiz_sessions(started_at);

-- Índices para quiz_results
CREATE INDEX IF NOT EXISTS idx_quiz_results_session_id ON public.quiz_results(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON public.quiz_results(created_at);

-- Índices para quiz_step_responses
CREATE INDEX IF NOT EXISTS idx_quiz_step_responses_session_id ON public.quiz_step_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_step_responses_step_number ON public.quiz_step_responses(step_number);

-- Índices para quiz_conversions
CREATE INDEX IF NOT EXISTS idx_quiz_conversions_session_id ON public.quiz_conversions(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_conversions_converted_at ON public.quiz_conversions(converted_at);

-- Índices para quiz_users
CREATE INDEX IF NOT EXISTS idx_quiz_users_session_id ON public.quiz_users(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_users_email ON public.quiz_users(email);
CREATE INDEX IF NOT EXISTS idx_quiz_users_created_at ON public.quiz_users(created_at);

-- =======================
-- RLS (ROW LEVEL SECURITY)
-- =======================

-- Habilitar RLS nas tabelas principais
ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_step_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_conversions ENABLE ROW LEVEL SECURITY;

-- Políticas básicas para permitir leitura/escrita
-- NOTA: Para desenvolvimento, vamos permitir tudo. Em produção, ajuste conforme necessário.

-- Políticas para funnels
CREATE POLICY "Enable read access for all users" ON public.funnels FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.funnels FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.funnels FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.funnels FOR DELETE USING (true);

-- Políticas para quiz_users
CREATE POLICY "Enable read access for all users" ON public.quiz_users FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.quiz_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.quiz_users FOR UPDATE USING (true);

-- Políticas para quiz_sessions
CREATE POLICY "Enable read access for all users" ON public.quiz_sessions FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.quiz_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.quiz_sessions FOR UPDATE USING (true);

-- Políticas para quiz_results
CREATE POLICY "Enable read access for all users" ON public.quiz_results FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.quiz_results FOR INSERT WITH CHECK (true);

-- Políticas para quiz_step_responses
CREATE POLICY "Enable read access for all users" ON public.quiz_step_responses FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.quiz_step_responses FOR INSERT WITH CHECK (true);

-- Políticas para quiz_conversions
CREATE POLICY "Enable read access for all users" ON public.quiz_conversions FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.quiz_conversions FOR INSERT WITH CHECK (true);

-- Comentário final
COMMENT ON SCHEMA public IS 'Quiz Quest Challenge Verse - Schema completo baseado nos tipos TypeScript';

SELECT 'Schema migration completed successfully. All tables created.' AS status;