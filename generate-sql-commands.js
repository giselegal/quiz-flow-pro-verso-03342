/**
 * Script para inserção através do Dashboard do Supabase
 * Gera comandos SQL que podem ser executados diretamente no painel
 */

console.log(`
============================================================================
🎯 COMANDOS SQL PARA INSERÇÃO DE DADOS
============================================================================

Execute os comandos abaixo no painel do Supabase (SQL Editor):
https://pwtjuuhchtbzttrzoutw.supabase.co

============================================================================
1. INSERIR PROFILES
============================================================================
`);

const PROFILES_SQL = `
INSERT INTO profiles (id, email, name, created_at, updated_at) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'admin@quizquest.com', 'Admin QuizQuest', '2024-01-15T00:00:00Z', '2024-03-25T00:00:00Z'),
('550e8400-e29b-41d4-a716-446655440002', 'maria.silva@exemplo.com', 'Maria Silva', '2024-02-20T00:00:00Z', '2024-03-22T00:00:00Z'),
('550e8400-e29b-41d4-a716-446655440003', 'joao.santos@empresa.com', 'João Santos', '2024-03-10T00:00:00Z', '2024-03-25T00:00:00Z');
`;

console.log(PROFILES_SQL);

console.log(`
============================================================================
2. INSERIR FUNNELS
============================================================================
`);

const FUNNELS_SQL = `
INSERT INTO funnels (id, name, description, user_id, is_published, version, settings, created_at, updated_at) VALUES 
('funnel-quiz-personalidade-001', 'Quiz: Qual seu tipo de personalidade?', 'Descubra seu perfil comportamental em 5 minutos', '550e8400-e29b-41d4-a716-446655440001', true, 1, '{"theme": "modern", "colors": {"primary": "#687ef7", "secondary": "#d85dfb"}, "totalSteps": 21, "category": "personality"}', '2024-01-20T00:00:00Z', '2024-03-15T00:00:00Z'),
('funnel-quiz-marketing-digital-002', 'Avaliação: Sua estratégia de marketing digital', 'Identifique gaps na sua estratégia de marketing', '550e8400-e29b-41d4-a716-446655440001', true, 1, '{"theme": "professional", "colors": {"primary": "#0066cc", "secondary": "#ff6600"}, "totalSteps": 15, "category": "business"}', '2024-02-05T00:00:00Z', '2024-03-20T00:00:00Z'),
('funnel-quiz-saude-wellness-003', 'Quiz: Seu nível de bem-estar', 'Avalie sua qualidade de vida e receba dicas personalizadas', '550e8400-e29b-41d4-a716-446655440002', true, 1, '{"theme": "wellness", "colors": {"primary": "#4CAF50", "secondary": "#8BC34A"}, "totalSteps": 12, "category": "health"}', '2024-02-25T00:00:00Z', '2024-03-18T00:00:00Z');
`;

console.log(FUNNELS_SQL);

console.log(`
============================================================================
3. INSERIR QUIZ_USERS
============================================================================
`);

const QUIZ_USERS_SQL = `
INSERT INTO quiz_users (id, session_id, email, name, ip_address, user_agent, utm_source, utm_medium, utm_campaign, created_at) VALUES 
('650e8400-e29b-41d4-a716-446655440001', 'session-001-personality', 'cliente1@email.com', 'Ana Costa', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'google', 'organic', 'personality-quiz', '2024-03-10T14:30:00Z'),
('650e8400-e29b-41d4-a716-446655440002', 'session-002-marketing', 'cliente2@email.com', 'Carlos Mendes', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'facebook', 'cpc', 'marketing-assessment', '2024-03-12T09:15:00Z');
`;

console.log(QUIZ_USERS_SQL);

console.log(`
============================================================================
4. INSERIR QUIZ_SESSIONS
============================================================================
`);

const QUIZ_SESSIONS_SQL = `
INSERT INTO quiz_sessions (id, funnel_id, quiz_user_id, status, current_step, total_steps, score, max_score, started_at, completed_at, last_activity, metadata) VALUES 
('750e8400-e29b-41d4-a716-446655440001', 'funnel-quiz-personalidade-001', '650e8400-e29b-41d4-a716-446655440001', 'completed', 21, 21, 85, 105, '2024-03-10T14:30:00Z', '2024-03-10T14:54:00Z', '2024-03-10T14:54:00Z', '{"completionTime": 1440, "averageTimePerStep": 68.5, "resultType": "Perfil Inovador"}'),
('750e8400-e29b-41d4-a716-446655440002', 'funnel-quiz-marketing-digital-002', '650e8400-e29b-41d4-a716-446655440002', 'completed', 15, 15, 68, 90, '2024-03-12T09:15:00Z', '2024-03-12T09:40:00Z', '2024-03-12T09:40:00Z', '{"completionTime": 1500, "averageTimePerStep": 100, "resultType": "Estratégia Intermediária"}');
`;

console.log(QUIZ_SESSIONS_SQL);

console.log(`
============================================================================
5. INSERIR QUIZ_CONVERSIONS
============================================================================
`);

const QUIZ_CONVERSIONS_SQL = `
INSERT INTO quiz_conversions (id, session_id, conversion_type, conversion_value, currency, product_id, product_name, commission_rate, conversion_data, converted_at) VALUES 
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'lead_capture', 97.50, 'BRL', 'consultation-personality', 'Consultoria de Autoconhecimento', 0.15, '{"leadQuality": "high", "interests": ["autoconhecimento", "desenvolvimento-pessoal"]}', '2024-03-10T14:54:30Z');
`;

console.log(QUIZ_CONVERSIONS_SQL);

console.log(`
============================================================================
6. VERIFICAR DADOS INSERIDOS
============================================================================

-- Contar registros:
SELECT 
  'profiles' as tabela, COUNT(*) as total FROM profiles
UNION ALL
SELECT 
  'funnels' as tabela, COUNT(*) as total FROM funnels  
UNION ALL
SELECT 
  'quiz_users' as tabela, COUNT(*) as total FROM quiz_users
UNION ALL
SELECT 
  'quiz_sessions' as tabela, COUNT(*) as total FROM quiz_sessions
UNION ALL
SELECT 
  'quiz_conversions' as tabela, COUNT(*) as total FROM quiz_conversions;

============================================================================
🎯 DEPOIS DE EXECUTAR OS COMANDOS ACIMA:
============================================================================

1. Acesse: /admin - Dashboard deve mostrar dados reais
2. Acesse: /dashboard - Dashboard deve mostrar métricas
3. Verifique se os funis aparecem na listagem
4. Confirme se as métricas são exibidas corretamente

============================================================================
`);