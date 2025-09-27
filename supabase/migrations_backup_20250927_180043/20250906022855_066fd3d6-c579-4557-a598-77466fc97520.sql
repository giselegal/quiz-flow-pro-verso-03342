-- Correção das políticas RLS com base no schema correto
-- 1. Atualizar política da tabela quiz_sessions usando quiz_user_id
DROP POLICY IF EXISTS "Users can view own quiz sessions" ON public.quiz_sessions;
CREATE POLICY "Users can view own quiz sessions" 
ON public.quiz_sessions FOR SELECT 
USING (auth.uid() = quiz_user_id);

-- 2. Política mais restritiva para profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- 3. Política para funnels - apenas o proprietário pode ver
DROP POLICY IF EXISTS "Users can view their own funnels" ON public.funnels;
CREATE POLICY "Users can view their own funnels" 
ON public.funnels FOR SELECT 
USING (auth.uid()::text = user_id);

-- 4. Políticas para operações de INSERT/UPDATE/DELETE nas tabelas principais
-- Quiz Sessions
CREATE POLICY "Users can create quiz sessions" 
ON public.quiz_sessions FOR INSERT 
WITH CHECK (auth.uid() = quiz_user_id);

CREATE POLICY "Users can update their own quiz sessions" 
ON public.quiz_sessions FOR UPDATE 
USING (auth.uid() = quiz_user_id);

-- Funnels
CREATE POLICY "Users can create funnels" 
ON public.funnels FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own funnels" 
ON public.funnels FOR UPDATE 
USING (auth.uid()::text = user_id);

-- Profiles
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 5. Adicionar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_quiz_user_id ON public.quiz_sessions(quiz_user_id);
CREATE INDEX IF NOT EXISTS idx_funnels_user_id ON public.funnels(user_id);