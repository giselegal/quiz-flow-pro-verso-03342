-- Correção das políticas RLS para maior segurança (SIMPLIFICADA)
-- 1. Atualizar política da tabela quiz_sessions para restringir acesso
DROP POLICY IF EXISTS "Users can view own quiz sessions" ON public.quiz_sessions;
-- Manter acesso público para funcionalidade de quiz anônimo por enquanto

-- Comentado: outras políticas dependem de tabelas que não existem ainda
-- -- 3. Corrigir política de componentes do funil
-- DROP POLICY IF EXISTS "Users can view their own funnel components" ON public.funnel_components;
-- CREATE POLICY "Users can view their own funnel components" 
-- ON public.funnel_components FOR SELECT 
-- USING (EXISTS (
--     SELECT 1 FROM public.funnels 
--     WHERE funnels.id = funnel_components.funnel_id 
--     AND funnels.user_id = auth.uid()
-- ));

-- -- 4. Corrigir política de configurações do funil
-- DROP POLICY IF EXISTS "Users can view their own funnel settings" ON public.funnel_settings;
-- CREATE POLICY "Users can view their own funnel settings" 
-- ON public.funnel_settings FOR SELECT 
-- USING (EXISTS (
--     SELECT 1 FROM public.funnels 
--     WHERE funnels.id = funnel_settings.funnel_id 
--     AND funnels.user_id = auth.uid()
-- ));

-- 5. Adicionar política mais restritiva para profiles (se a tabela existir)
DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
    CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);
  END IF;
END $$;

-- 6. Adicionar índices para melhorar performance das novas políticas
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_quiz_user_id ON public.quiz_sessions(quiz_user_id);
-- CREATE INDEX IF NOT EXISTS idx_funnel_components_funnel_id ON public.funnel_components(funnel_id);
-- CREATE INDEX IF NOT EXISTS idx_funnel_settings_funnel_id ON public.funnel_settings(funnel_id);
-- CREATE INDEX IF NOT EXISTS idx_funnels_user_id ON public.funnels(user_id);