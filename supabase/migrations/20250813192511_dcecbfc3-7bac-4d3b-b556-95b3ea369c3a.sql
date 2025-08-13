-- Finalizar correção da política restante de quiz_step_responses
DROP POLICY IF EXISTS "Anyone can create quiz responses" ON quiz_step_responses;

-- Criar política mais restritiva para criação de respostas
CREATE POLICY "Users can create quiz responses for their funnels" 
ON quiz_step_responses 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM quiz_sessions qs
    JOIN funnels f ON f.id = qs.funnel_id
    WHERE qs.id = quiz_step_responses.session_id 
    AND f.user_id = auth.uid()::text
  )
);

-- Corrigir política restante de quiz_step_responses que ainda permite acesso anônimo
DROP POLICY IF EXISTS "Users can view quiz responses for their funnels" ON quiz_step_responses;

CREATE POLICY "Authenticated users can view quiz responses for their funnels" 
ON quiz_step_responses 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM quiz_sessions qs
    JOIN funnels f ON f.id = qs.funnel_id
    WHERE qs.id = quiz_step_responses.session_id 
    AND f.user_id = auth.uid()::text
  )
);