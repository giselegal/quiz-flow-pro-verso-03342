-- POPULATE QUIZ TEMPLATES
-- Dados de exemplo para teste do sistema

-- Inserir funis de exemplo
INSERT INTO public.funnels (id, name, description, settings, is_published, user_id, version) VALUES
(
    'quiz21StepsComplete',
    'Quiz de Personalidade - 21 Passos',
    'Quiz interativo de personalidade com 21 perguntas para identificar perfil comportamental',
    '{"theme": "modern", "showProgressBar": true, "allowBack": true, "resultTypes": ["extrovertido", "introvertido", "analitico", "criativo"]}',
    true,
    'system',
    1
),
(
    'leadMagnetFashion',
    'Quiz de Estilo - Moda',
    'Descubra seu estilo pessoal de moda e receba recomendações personalizadas',
    '{"theme": "fashion", "showProgressBar": true, "resultTypes": ["classico", "trendy", "boho", "minimal"]}',
    true,
    'system',
    1
),
(
    'webinarSignup',
    'Quiz de Interesse - Webinar',
    'Identifique temas de interesse para webinars personalizados',
    '{"theme": "business", "leadCapture": true, "emailRequired": true}',
    true,
    'system',
    1
),
(
    'npseSurvey',
    'Pesquisa NPS',
    'Net Promoter Score survey for customer satisfaction',
    '{"theme": "survey", "anonymous": false, "followUpQuestions": true}',
    true,
    'system',
    1
),
(
    'roiCalculator',
    'Calculadora de ROI',
    'Calculate return on investment based on user inputs',
    '{"theme": "calculator", "showResults": true, "exportResults": true}',
    true,
    'system',
    1
);

-- Inserir usuários de exemplo (simulando usuários que já fizeram quiz)
INSERT INTO public.quiz_users (id, session_id, name, email, utm_source, utm_medium, utm_campaign) VALUES
(
    'user_001',
    'session_001',
    'Ana Silva',
    'ana.silva@email.com',
    'google',
    'cpc',
    'quiz_personalidade'
),
(
    'user_002', 
    'session_002',
    'João Santos',
    'joao.santos@email.com',
    'facebook',
    'social',
    'moda_quiz'
),
(
    'user_003',
    'session_003',
    'Maria Oliveira',
    'maria.oliveira@email.com',
    'instagram',
    'social',
    'webinar_tech'
),
(
    'user_004',
    'session_004',
    'Pedro Costa',
    'pedro.costa@email.com',
    'direct',
    NULL,
    NULL
),
(
    'user_005',
    'session_005',
    'Lucia Ferreira',
    'lucia.ferreira@email.com',
    'google',
    'organic',
    NULL
);

-- Inserir sessões de quiz de exemplo
INSERT INTO public.quiz_sessions (id, funnel_id, quiz_user_id, status, current_step, total_steps, score, max_score, completed_at) VALUES
(
    'session_001',
    'quiz21StepsComplete',
    'user_001',
    'completed',
    21,
    21,
    85,
    100,
    timezone('utc'::text, now()) - interval '2 hours'
),
(
    'session_002',
    'leadMagnetFashion',
    'user_002',
    'completed',
    12,
    12,
    78,
    100,
    timezone('utc'::text, now()) - interval '1 day'
),
(
    'session_003',
    'webinarSignup',
    'user_003',
    'completed',
    8,
    8,
    95,
    100,
    timezone('utc'::text, now()) - interval '3 hours'
),
(
    'session_004',
    'npseSurvey',
    'user_004',
    'active',
    3,
    5,
    NULL,
    NULL,
    NULL
),
(
    'session_005',
    'roiCalculator',
    'user_005',
    'completed',
    10,
    10,
    88,
    100,
    timezone('utc'::text, now()) - interval '6 hours'
);

-- Inserir resultados de exemplo
INSERT INTO public.quiz_results (session_id, result_type, result_title, result_description, recommendation, result_data) VALUES
(
    'session_001',
    'personality',
    'Perfil Analítico-Extrovertido',
    'Você demonstra características de uma pessoa analítica que gosta de interação social',
    'Recomendamos atividades que combinam análise de dados com trabalho em equipe',
    '{"score": 85, "traits": ["analytical", "social", "organized"], "strengths": ["problem-solving", "communication", "leadership"]}'
),
(
    'session_002',
    'fashion',
    'Estilo Clássico Moderno',
    'Seu estilo combina elegância clássica com toques modernos',
    'Invista em peças atemporais com detalhes contemporâneos',
    '{"style": "classic-modern", "colors": ["navy", "white", "beige"], "brands": ["COS", "Everlane", "Zara"]}'
),
(
    'session_003',
    'interest',
    'Tecnologia e Inovação',
    'Você tem grande interesse em temas relacionados à tecnologia',
    'Participe de nossos webinars sobre IA, desenvolvimento e tendências tech',
    '{"interests": ["AI", "development", "trends"], "level": "advanced", "preferred_time": "evening"}'
),
(
    'session_005',
    'roi',
    'ROI Calculado: 250%',
    'Baseado nos seus dados, o retorno estimado é de 250%',
    'Considere investir em automação de marketing para maximizar retornos',
    '{"roi_percentage": 250, "investment": 10000, "expected_return": 25000, "payback_months": 8}'
);

-- Inserir respostas de exemplo para a session_001
INSERT INTO public.quiz_step_responses (session_id, step_number, question_id, question_text, answer_value, answer_text) VALUES
('session_001', 1, 'q1', 'Como você prefere trabalhar?', 'team', 'Em equipe'),
('session_001', 2, 'q2', 'Qual sua abordagem para resolver problemas?', 'analytical', 'Analiso todos os dados primeiro'),
('session_001', 3, 'q3', 'Como você lida com prazos?', 'organized', 'Sempre me organizo com antecedência'),
('session_001', 4, 'q4', 'Seu estilo de comunicação', 'direct', 'Direto e objetivo'),
('session_001', 5, 'q5', 'Como você aprende melhor?', 'practice', 'Praticando e testando');

-- Inserir conversões de exemplo
INSERT INTO public.quiz_conversions (session_id, conversion_type, conversion_value, product_name) VALUES
('session_002', 'lead', 0, 'Newsletter Moda'),
('session_003', 'registration', 0, 'Webinar Tech Trends'),
('session_005', 'consultation', 500, 'Consultoria ROI'),
('session_001', 'download', 0, 'Guia Personalidade no Trabalho');

-- Comentário final
SELECT 'Sample data populated successfully. Quiz participants should now appear in dashboard.' AS status;