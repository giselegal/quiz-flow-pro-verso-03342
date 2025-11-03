-- 1. Permitir user_id NULL para templates públicos
ALTER TABLE public.quiz_production 
ALTER COLUMN user_id DROP NOT NULL;

-- 2. Atualizar política RLS para incluir templates públicos com user_id NULL
DROP POLICY IF EXISTS "Templates are publicly readable" ON public.quiz_production;

CREATE POLICY "Templates and owned quizzes are readable"
ON public.quiz_production
FOR SELECT
USING (
  (is_template = true AND user_id IS NULL) OR  -- Templates públicos
  (is_template = true AND user_id IS NOT NULL) OR  -- Templates de usuários
  (auth.uid() = user_id)  -- Funis do próprio usuário
);

-- 3. Atualizar política de INSERT para permitir templates de sistema
DROP POLICY IF EXISTS "Users can publish their own quizzes" ON public.quiz_production;

CREATE POLICY "Users can publish quizzes"
ON public.quiz_production
FOR INSERT
WITH CHECK (
  (auth.uid() = user_id) OR  -- Usuário publicando seu próprio quiz
  (is_template = true AND user_id IS NULL)  -- Sistema criando template público
);

-- 4. Inserir template base quiz21StepsComplete
INSERT INTO public.quiz_production (
  user_id,
  funnel_id,
  slug,
  name,
  version,
  is_template,
  content,
  metadata,
  status
) VALUES (
  NULL,  -- Template público (sem dono)
  'quiz21StepsComplete',
  'quiz21StepsComplete',
  'Quiz de Estilo Pessoal - 21 Etapas',
  1,
  true,
  '{
    "templateVersion": "3.0",
    "templateId": "quiz21StepsComplete",
    "name": "Quiz de Estilo Pessoal - 21 Etapas",
    "totalSteps": 21
  }'::jsonb,
  '{
    "author": "Sistema",
    "type": "quiz-template",
    "editable": false,
    "public": true
  }'::jsonb,
  'published'
)
ON CONFLICT (funnel_id, version) DO UPDATE
SET
  content = EXCLUDED.content,
  metadata = EXCLUDED.metadata,
  updated_at = now();