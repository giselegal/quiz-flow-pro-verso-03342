-- Fase 1: Correção de Dados Órfãos
-- Atribuir funis existentes sem user_id para um usuário válido
UPDATE funnels 
SET user_id = '35640ca8-24a2-4547-bdf1-12a8795d955b'
WHERE user_id IS NULL;

-- Fase 2: Popular Component Instances de Teste
-- Criar instâncias de componentes de teste para os funis existentes
INSERT INTO component_instances (
  funnel_id,
  stage_id, 
  step_number,
  component_type_key,
  instance_key,
  properties,
  custom_styling,
  order_index,
  created_by
) VALUES 
-- Componente de teste para funnel-1753409877331 (Quiz CaktoQuiz)
(
  'funnel-1753409877331',
  'step-1',
  1,
  'quiz-question-estilo-preferido',
  'quiz-question-estilo-preferido-1',
  '{"question": "Qual seu estilo preferido?", "options": ["Minimalista", "Colorido", "Elegante"], "required": true}',
  '{"background": "hsl(var(--background))", "textColor": "hsl(var(--foreground))"}',
  1,
  '35640ca8-24a2-4547-bdf1-12a8795d955b'
),
-- Componente header para o mesmo funnel
(
  'funnel-1753409877331',
  'step-1', 
  1,
  'header-principal',
  'header-principal-1',
  '{"title": "Descubra Seu Estilo", "subtitle": "Quiz personalizado para você"}',
  '{"background": "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-foreground)))"}',
  0,
  '35640ca8-24a2-4547-bdf1-12a8795d955b'
),
-- Componente para outro funnel teste
(
  'funnel_1753398563214_ue1fn5gvl',
  'step-2',
  2,
  'cta-button',
  'cta-button-2',
  '{"text": "Continuar", "action": "next-step", "variant": "primary"}',
  '{"borderRadius": "8px", "padding": "12px 24px"}',
  1,
  '35640ca8-24a2-4547-bdf1-12a8795d955b'
);

-- Fase 3: Correção de Políticas RLS Críticas
-- Remover política muito permissiva de quiz_results
DROP POLICY IF EXISTS "Anyone can view quiz results" ON quiz_results;

-- Criar política mais restritiva para quiz_results
CREATE POLICY "Authenticated users can view quiz results for their funnels" 
ON quiz_results 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM quiz_sessions qs
    JOIN funnels f ON f.id = qs.funnel_id
    WHERE qs.id = quiz_results.session_id 
    AND f.user_id = auth.uid()::text
  )
);

-- Remover política muito permissiva de quiz_sessions
DROP POLICY IF EXISTS "Anyone can view quiz sessions" ON quiz_sessions;
DROP POLICY IF EXISTS "Anyone can update quiz sessions" ON quiz_sessions;

-- Criar políticas mais restritivas para quiz_sessions
CREATE POLICY "Users can view quiz sessions for their funnels" 
ON quiz_sessions 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM funnels f 
    WHERE f.id = quiz_sessions.funnel_id 
    AND f.user_id = auth.uid()::text
  )
);

CREATE POLICY "Users can update quiz sessions for their funnels" 
ON quiz_sessions 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM funnels f 
    WHERE f.id = quiz_sessions.funnel_id 
    AND f.user_id = auth.uid()::text
  )
);

-- Remover política muito permissiva de quiz_step_responses  
DROP POLICY IF EXISTS "Anyone can view quiz responses" ON quiz_step_responses;

-- Criar política mais restritiva para quiz_step_responses
CREATE POLICY "Users can view quiz responses for their funnels" 
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