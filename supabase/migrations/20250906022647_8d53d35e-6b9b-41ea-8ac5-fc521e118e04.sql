-- Correção das políticas RLS para maior segurança
-- 1. Atualizar política da tabela quiz_sessions para restringir acesso
DROP POLICY IF EXISTS "Users can view own quiz sessions" ON public.quiz_sessions;
CREATE POLICY "Users can view own quiz sessions" 
ON public.quiz_sessions FOR SELECT 
USING (auth.uid() = user_id OR (user_id IS NULL AND session_token IS NOT NULL));

-- 2. Corrigir política da tabela quiz_session_steps
DROP POLICY IF EXISTS "Users can view their own quiz session steps" ON public.quiz_session_steps;
CREATE POLICY "Users can view their own quiz session steps" 
ON public.quiz_session_steps FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.quiz_sessions 
    WHERE quiz_sessions.id = quiz_session_steps.session_id 
    AND (quiz_sessions.user_id = auth.uid() OR quiz_sessions.user_id IS NULL)
));

-- 3. Corrigir política de componentes do funil
DROP POLICY IF EXISTS "Users can view their own funnel components" ON public.funnel_components;
CREATE POLICY "Users can view their own funnel components" 
ON public.funnel_components FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.funnels 
    WHERE funnels.id = funnel_components.funnel_id 
    AND funnels.user_id = auth.uid()
));

-- 4. Corrigir política de configurações do funil
DROP POLICY IF EXISTS "Users can view their own funnel settings" ON public.funnel_settings;
CREATE POLICY "Users can view their own funnel settings" 
ON public.funnel_settings FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.funnels 
    WHERE funnels.id = funnel_settings.funnel_id 
    AND funnels.user_id = auth.uid()
));

-- 5. Adicionar política mais restritiva para profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- 6. Adicionar índices para melhorar performance das novas políticas
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_id ON public.quiz_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_funnel_components_funnel_id ON public.funnel_components(funnel_id);
CREATE INDEX IF NOT EXISTS idx_funnel_settings_funnel_id ON public.funnel_settings(funnel_id);
CREATE INDEX IF NOT EXISTS idx_funnels_user_id ON public.funnels(user_id);