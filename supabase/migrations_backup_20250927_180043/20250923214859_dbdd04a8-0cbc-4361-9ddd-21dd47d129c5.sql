-- CORREÇÃO: Remover política duplicada e aplicar correções seguras

-- Remover a política duplicada primeiro
DROP POLICY IF EXISTS "Anyone can create quiz sessions" ON public.quiz_sessions;

-- Recriar a política de criação limpa
CREATE POLICY "Public can create quiz sessions" 
ON public.quiz_sessions 
FOR INSERT 
WITH CHECK (true);