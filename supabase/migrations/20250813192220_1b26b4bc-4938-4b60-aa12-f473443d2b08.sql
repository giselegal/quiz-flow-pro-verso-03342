-- Fase 1: Correção de Dados Órfãos
-- Atribuir funis existentes sem user_id para um usuário válido
UPDATE funnels 
SET user_id = '35640ca8-24a2-4547-bdf1-12a8795d955b'
WHERE user_id IS NULL;

-- Fase 2: Popular Component Instances de Teste usando tipos existentes
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
-- Título para funnel-1753409877331 (Quiz CaktoQuiz)
(
  'funnel-1753409877331',
  'step-1',
  1,
  'headline',
  'headline-quiz-title-1',
  '{"text": "Descubra Seu Estilo", "level": "h1", "alignment": "center"}',
  '{"background": "hsl(var(--background))", "textColor": "hsl(var(--foreground))"}',
  1,
  '35640ca8-24a2-4547-bdf1-12a8795d955b'
),
-- Grid de opções para o mesmo funnel
(
  'funnel-1753409877331',
  'step-1', 
  1,
  'options-grid',
  'options-grid-estilo-1',
  '{"question": "Qual seu estilo preferido?", "options": ["Minimalista", "Colorido", "Elegante"], "layout": "grid"}',
  '{"gridCols": 3, "gap": "16px"}',
  2,
  '35640ca8-24a2-4547-bdf1-12a8795d955b'
),
-- Botão para funnel de teste
(
  'funnel_1753398563214_ue1fn5gvl',
  'step-2',
  2,
  'button',
  'button-continue-2',
  '{"text": "Continuar", "variant": "primary", "action": "next-step"}',
  '{"borderRadius": "8px", "padding": "12px 24px"}',
  1,
  '35640ca8-24a2-4547-bdf1-12a8795d955b'
),
-- Texto inline para explicação
(
  'funnel_1753398563214_ue1fn5gvl',
  'step-2',
  2,
  'text-inline',
  'text-explanation-2',
  '{"content": "Complete o questionário para descobrir o resultado personalizado para você."}',
  '{"fontSize": "16px", "textAlign": "center"}',
  0,
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