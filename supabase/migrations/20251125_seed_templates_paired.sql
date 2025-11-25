-- ================================================================
-- SEED: Templates com IDs Pareados (JSON <-> Supabase)
-- ================================================================
-- Data: 2025-11-25
-- Propósito: Garantir que templates JSON tenham correspondência no Supabase
-- 
-- PROBLEMA IDENTIFICADO:
-- - Template JSON usa ID: "quiz21StepsComplete"
-- - Supabase gera UUID aleatório
-- - Não há pareamento entre os dois
--
-- SOLUÇÃO:
-- - Inserir template no Supabase com slug = ID do JSON
-- - Usar UUID fixo e conhecido para referência cruzada
-- ================================================================

-- Limpar templates existentes (apenas em dev/test)
-- DELETE FROM templates WHERE slug LIKE 'quiz21%';

-- ================================================================
-- TEMPLATE 1: quiz21StepsComplete
-- ================================================================
-- UUID fixo: 00000000-0000-0000-0000-000000000001
-- JSON ID: quiz21StepsComplete
-- Slug: quiz21StepsComplete

INSERT INTO templates (
    id,
    name,
    slug,
    description,
    category,
    blocks,
    steps,
    settings,
    version,
    status,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid, -- UUID FIXO
    'Quiz 21 Steps Complete',
    'quiz21StepsComplete', -- SLUG = JSON ID
    'Template completo de quiz com 21 etapas - Gisele Galvão',
    'quiz',
    '[]'::jsonb, -- Blocos serão carregados do JSON
    jsonb_build_array(
        jsonb_build_object('id', 'step-01', 'order', 1, 'name', 'Introdução'),
        jsonb_build_object('id', 'step-02', 'order', 2, 'name', 'Questão 1'),
        jsonb_build_object('id', 'step-03', 'order', 3, 'name', 'Questão 2'),
        jsonb_build_object('id', 'step-04', 'order', 4, 'name', 'Questão 3'),
        jsonb_build_object('id', 'step-05', 'order', 5, 'name', 'Questão 4'),
        jsonb_build_object('id', 'step-06', 'order', 6, 'name', 'Questão 5'),
        jsonb_build_object('id', 'step-07', 'order', 7, 'name', 'Questão 6'),
        jsonb_build_object('id', 'step-08', 'order', 8, 'name', 'Questão 7'),
        jsonb_build_object('id', 'step-09', 'order', 9, 'name', 'Questão 8'),
        jsonb_build_object('id', 'step-10', 'order', 10, 'name', 'Questão 9'),
        jsonb_build_object('id', 'step-11', 'order', 11, 'name', 'Questão 10'),
        jsonb_build_object('id', 'step-12', 'order', 12, 'name', 'Lead Capture'),
        jsonb_build_object('id', 'step-13', 'order', 13, 'name', 'Transição'),
        jsonb_build_object('id', 'step-14', 'order', 14, 'name', 'Questão 11'),
        jsonb_build_object('id', 'step-15', 'order', 15, 'name', 'Questão 12'),
        jsonb_build_object('id', 'step-16', 'order', 16, 'name', 'Questão 13'),
        jsonb_build_object('id', 'step-17', 'order', 17, 'name', 'Questão 14'),
        jsonb_build_object('id', 'step-18', 'order', 18, 'name', 'Questão 15'),
        jsonb_build_object('id', 'step-19', 'order', 19, 'name', 'Questão 16'),
        jsonb_build_object('id', 'step-20', 'order', 20, 'name', 'Resultado'),
        jsonb_build_object('id', 'step-21', 'order', 21, 'name', 'Oferta')
    ),
    jsonb_build_object(
        'version', '3.1.0',
        'type', 'quiz',
        'totalSteps', 21,
        'author', 'Quiz Quest Team',
        'tags', jsonb_build_array('quiz', 'estilo-pessoal', 'gisele-galvao')
    ),
    1,
    'published',
    now(),
    now()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    steps = EXCLUDED.steps,
    settings = EXCLUDED.settings,
    updated_at = now();

-- ================================================================
-- CRIAR FUNNEL PAREADO com o template
-- ================================================================
-- UUID fixo: 00000000-0000-0000-0000-000000000101
-- Template ID: 00000000-0000-0000-0000-000000000001

INSERT INTO funnels (
    id,
    name,
    description,
    settings,
    is_published,
    version,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000101', -- UUID FIXO para funnel
    'Funnel: Quiz 21 Steps Complete',
    'Funnel baseado no template quiz21StepsComplete',
    jsonb_build_object(
        'template_id', '00000000-0000-0000-0000-000000000001',
        'template_slug', 'quiz21StepsComplete',
        'total_steps', 21,
        'version', '3.1.0'
    ),
    true,
    1,
    now(),
    now()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    settings = EXCLUDED.settings,
    updated_at = now();

-- ================================================================
-- CRIAR COMPONENT_INSTANCES para os blocos do Step 1
-- ================================================================
-- Estes são os blocos que aparecerão no editor

INSERT INTO component_instances (
    id,
    funnel_id,
    step_number,
    component_type_key,
    properties,
    config,
    order_index,
    created_at,
    updated_at
) VALUES 
    -- Bloco 1: Header
    (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000101',
        0, -- step-01 = step_number 0
        'quiz-intro-header',
        jsonb_build_object(
            'showLogo', true,
            'logoPosition', 'center',
            'showProgress', true,
            'progressValue', 5,
            'progressMax', 100
        ),
        jsonb_build_object(
            'logoUrl', 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_132,h_55,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png',
            'logoAlt', 'Logo Gisele Galvão'
        ),
        0,
        now(),
        now()
    ),
    -- Bloco 2: Title
    (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000101',
        0,
        'quiz-intro-title',
        jsonb_build_object(
            'text', 'Descubra Seu Estilo Pessoal Único',
            'level', 'h1',
            'align', 'center'
        ),
        jsonb_build_object(),
        1,
        now(),
        now()
    ),
    -- Bloco 3: Description
    (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000101',
        0,
        'quiz-intro-description',
        jsonb_build_object(
            'text', 'Responda 16 perguntas rápidas e descubra qual estilo combina mais com você.',
            'align', 'center'
        ),
        jsonb_build_object(),
        2,
        now(),
        now()
    ),
    -- Bloco 4: Form (Nome e Email)
    (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000101',
        0,
        'quiz-intro-form',
        jsonb_build_object(
            'fields', jsonb_build_array(
                jsonb_build_object('name', 'name', 'type', 'text', 'placeholder', 'Seu nome', 'required', true),
                jsonb_build_object('name', 'email', 'type', 'email', 'placeholder', 'Seu melhor e-mail', 'required', true)
            ),
            'buttonText', 'Iniciar Quiz',
            'buttonStyle', 'primary'
        ),
        jsonb_build_object(),
        3,
        now(),
        now()
    )
ON CONFLICT DO NOTHING;

-- ================================================================
-- VIEW: Relacionamento Template <-> Funnel <-> Blocks
-- ================================================================
CREATE OR REPLACE VIEW v_template_funnel_mapping AS
SELECT 
    t.id as template_id,
    t.slug as template_slug,
    t.name as template_name,
    f.id as funnel_id,
    f.name as funnel_name,
    COUNT(DISTINCT ci.id) as total_blocks,
    COUNT(DISTINCT ci.step_number) as total_steps
FROM templates t
LEFT JOIN funnels f ON (f.settings->>'template_id')::uuid = t.id
LEFT JOIN component_instances ci ON ci.funnel_id = f.id
WHERE t.slug = 'quiz21StepsComplete'
GROUP BY t.id, t.slug, t.name, f.id, f.name;

-- ================================================================
-- QUERY DE VERIFICAÇÃO
-- ================================================================
-- Use esta query para verificar o pareamento:

SELECT 
    'Template UUID' as tipo,
    '00000000-0000-0000-0000-000000000001' as id,
    'quiz21StepsComplete' as identificador,
    'Supabase templates.id' as tabela
UNION ALL
SELECT 
    'Template Slug',
    slug::text,
    'quiz21StepsComplete',
    'Supabase templates.slug'
FROM templates 
WHERE slug = 'quiz21StepsComplete'
UNION ALL
SELECT 
    'Funnel UUID',
    '00000000-0000-0000-0000-000000000101',
    'Funnel pareado',
    'Supabase funnels.id'
UNION ALL
SELECT 
    'JSON ID',
    'quiz21StepsComplete',
    'Arquivo JSON',
    'src/templates/quiz21StepsComplete.json'
UNION ALL
SELECT 
    'Editor URL',
    '/editor?template=quiz21StepsComplete',
    'Carrega JSON',
    'QuizModularEditor'
UNION ALL
SELECT 
    'Editor URL',
    '/editor?funnelId=00000000-0000-0000-0000-000000000101',
    'Carrega Supabase',
    'UnifiedEditorLayout';

-- ================================================================
-- COMENTÁRIOS PARA O CÓDIGO
-- ================================================================

-- No código TypeScript, usar:
--
-- const TEMPLATE_UUID_MAP = {
--   'quiz21StepsComplete': '00000000-0000-0000-0000-000000000001',
-- } as const;
--
-- const FUNNEL_UUID_MAP = {
--   'quiz21StepsComplete': '00000000-0000-0000-0000-000000000101',
-- } as const;
--
-- function getTemplateUUID(jsonId: string): string {
--   return TEMPLATE_UUID_MAP[jsonId] || null;
-- }
--
-- function getFunnelUUID(jsonId: string): string {
--   return FUNNEL_UUID_MAP[jsonId] || null;
-- }
