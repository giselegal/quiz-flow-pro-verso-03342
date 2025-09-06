-- Correção CRÍTICA das políticas RLS mais permissivas
-- Removendo acesso anônimo de tabelas sensíveis

-- 1. Corrigir quiz_step_responses - remover acesso público total
DROP POLICY IF EXISTS "Anyone can view quiz responses" ON public.quiz_step_responses;

-- Manter apenas a política restritiva para proprietários do funil
-- (a política "Authenticated users can view quiz responses for their funnels" já existe)

-- 2. Corrigir quiz_sessions - remover políticas duplicadas e garantir autenticação
DROP POLICY IF EXISTS "Users can view own quiz sessions" ON public.quiz_sessions;
DROP POLICY IF EXISTS "Users can create quiz sessions" ON public.quiz_sessions;
DROP POLICY IF EXISTS "Users can update their own quiz sessions" ON public.quiz_sessions;

-- Recriar políticas mais restritivas para quiz_sessions
CREATE POLICY "Authenticated users can view their own quiz sessions" 
ON public.quiz_sessions FOR SELECT 
USING (auth.uid() = quiz_user_id AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create quiz sessions" 
ON public.quiz_sessions FOR INSERT 
WITH CHECK (auth.uid() = quiz_user_id AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated funnel owners can update quiz sessions" 
ON public.quiz_sessions FOR UPDATE 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM funnels f 
    WHERE f.id = quiz_sessions.funnel_id 
    AND f.user_id = auth.uid()::text
  )
);

-- 3. Remover duplicação de políticas nos funnels
DROP POLICY IF EXISTS "Users can create funnels" ON public.funnels;
DROP POLICY IF EXISTS "Users can view their own funnels" ON public.funnels;
DROP POLICY IF EXISTS "Users can update their own funnels" ON public.funnels;

-- As políticas "Authenticated users can..." já existem e são mais seguras

-- 4. Remover duplicação de políticas nos profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- As políticas "Authenticated users can..." já existem e são mais seguras

-- 5. Adicionar política mais restritiva para quiz_step_responses INSERT
DROP POLICY IF EXISTS "Users can create quiz responses for their funnels" ON public.quiz_step_responses;
CREATE POLICY "Authenticated users can create quiz responses for their sessions" 
ON public.quiz_step_responses FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM quiz_sessions qs 
    WHERE qs.id = quiz_step_responses.session_id 
    AND qs.quiz_user_id = auth.uid()
  )
);

-- 6. Garantir que apenas proprietários do funil possam ver analytics
DROP POLICY IF EXISTS "Authenticated funnel owners can view analytics" ON public.quiz_analytics;
CREATE POLICY "Authenticated funnel owners can view analytics" 
ON public.quiz_analytics FOR SELECT 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM funnels f 
    WHERE f.id = quiz_analytics.funnel_id 
    AND f.user_id = auth.uid()::text
  )
);

-- 7. Remover política de inserção muito permissiva do quiz_analytics
DROP POLICY IF EXISTS "System can create quiz analytics" ON public.quiz_analytics;
CREATE POLICY "Authenticated users can create quiz analytics for their sessions" 
ON public.quiz_analytics FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' AND 
  (user_id = auth.uid() OR 
   EXISTS (
     SELECT 1 FROM quiz_sessions qs 
     JOIN funnels f ON f.id = qs.funnel_id 
     WHERE qs.id = quiz_analytics.session_id 
     AND f.user_id = auth.uid()::text
   ))
);