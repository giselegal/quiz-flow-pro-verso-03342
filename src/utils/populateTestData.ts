/**
 * 📊 INSERÇÃO DE DADOS REAIS DE TESTE
 * 
 * Script para popular o banco de dados com dados realistas
 */

import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// DADOS DE TESTE REALISTAS
// ============================================================================

const SAMPLE_USERS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'admin@quizquest.com',
    full_name: 'Admin QuizQuest',
    created_at: new Date('2024-01-15').toISOString(),
    subscription_status: 'premium',
    total_funnels: 5,
    total_responses: 1250
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'maria.silva@exemplo.com', 
    full_name: 'Maria Silva',
    created_at: new Date('2024-02-20').toISOString(),
    subscription_status: 'free',
    total_funnels: 2,
    total_responses: 180
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'joao.santos@empresa.com',
    full_name: 'João Santos',
    created_at: new Date('2024-03-10').toISOString(),
    subscription_status: 'premium',
    total_funnels: 8,
    total_responses: 2450
  }
];

const SAMPLE_FUNNELS = [
  {
    id: 'funnel-quiz-personalidade-001',
    title: 'Quiz: Qual seu tipo de personalidade?',
    description: 'Descubra seu perfil comportamental em 5 minutos',
    status: 'published',
    created_at: new Date('2024-01-20').toISOString(),
    updated_at: new Date('2024-03-15').toISOString(),
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    total_views: 3250,
    total_responses: 892,
    conversion_rate: 27.4,
    category: 'personality',
    tags: ['personalidade', 'autoconhecimento', 'comportamento']
  },
  {
    id: 'funnel-quiz-marketing-digital-002',
    title: 'Avaliação: Sua estratégia de marketing digital',
    description: 'Identifique gaps na sua estratégia de marketing',
    status: 'published',
    created_at: new Date('2024-02-05').toISOString(),
    updated_at: new Date('2024-03-20').toISOString(),
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    total_views: 1890,
    total_responses: 445,
    conversion_rate: 23.5,
    category: 'business',
    tags: ['marketing', 'digital', 'estratégia', 'negócios']
  },
  {
    id: 'funnel-quiz-saude-wellness-003',
    title: 'Quiz: Seu nível de bem-estar',
    description: 'Avalie sua qualidade de vida e receba dicas personalizadas',
    status: 'published',
    created_at: new Date('2024-02-25').toISOString(),
    updated_at: new Date('2024-03-18').toISOString(),
    user_id: '550e8400-e29b-41d4-a716-446655440002',
    total_views: 950,
    total_responses: 178,
    conversion_rate: 18.7,
    category: 'health',
    tags: ['saúde', 'bem-estar', 'lifestyle', 'qualidade de vida']
  },
  {
    id: 'funnel-quiz-investimentos-004',
    title: 'Avaliação: Seu perfil de investidor',
    description: 'Descubra qual estratégia de investimento combina com você',
    status: 'published',
    created_at: new Date('2024-03-01').toISOString(),
    updated_at: new Date('2024-03-25').toISOString(),
    user_id: '550e8400-e29b-41d4-a716-446655440003',
    total_views: 2100,
    total_responses: 623,
    conversion_rate: 29.7,
    category: 'finance',
    tags: ['investimentos', 'finanças', 'perfil', 'renda']
  },
  {
    id: 'funnel-quiz-carreira-005',
    title: 'Quiz: Sua próxima oportunidade de carreira',
    description: 'Identifique caminhos de crescimento profissional',
    status: 'draft',
    created_at: new Date('2024-03-20').toISOString(),
    updated_at: new Date('2024-03-25').toISOString(),
    user_id: '550e8400-e29b-41d4-a716-446655440003',
    total_views: 45,
    total_responses: 12,
    conversion_rate: 26.7,
    category: 'career',
    tags: ['carreira', 'profissional', 'crescimento', 'oportunidades']
  }
];

const SAMPLE_RESPONSES = [
  // Respostas para o quiz de personalidade
  {
    id: 'response-001',
    funnel_id: 'funnel-quiz-personalidade-001',
    user_email: 'cliente1@email.com',
    user_name: 'Ana Costa',
    responses: JSON.stringify({
      'pergunta-1': 'Extrovertido',
      'pergunta-2': 'Analítico',
      'pergunta-3': 'Criativo',
      'resultado': 'Perfil Inovador'
    }),
    score: 85,
    created_at: new Date('2024-03-10T14:30:00').toISOString(),
    completion_time: 240,
    conversion_value: 97.50
  },
  {
    id: 'response-002', 
    funnel_id: 'funnel-quiz-personalidade-001',
    user_email: 'cliente2@email.com',
    user_name: 'Carlos Mendes',
    responses: JSON.stringify({
      'pergunta-1': 'Introvertido',
      'pergunta-2': 'Prático',
      'pergunta-3': 'Organizado',
      'resultado': 'Perfil Estruturado'
    }),
    score: 92,
    created_at: new Date('2024-03-12T09:15:00').toISOString(),
    completion_time: 180,
    conversion_value: 125.00
  },
  // Respostas para marketing digital
  {
    id: 'response-003',
    funnel_id: 'funnel-quiz-marketing-digital-002', 
    user_email: 'empreendedor@startup.com',
    user_name: 'Ricardo Oliveira',
    responses: JSON.stringify({
      'estrategia-atual': 'Básica',
      'orçamento': '1000-5000',
      'objetivo': 'Leads',
      'resultado': 'Necessita Estratégia Avançada'
    }),
    score: 68,
    created_at: new Date('2024-03-14T16:45:00').toISOString(),
    completion_time: 320,
    conversion_value: 299.90
  }
];

const SAMPLE_ANALYTICS = [
  {
    id: 'analytics-001',
    date: new Date('2024-03-25').toISOString().split('T')[0],
    funnel_id: 'funnel-quiz-personalidade-001',
    views: 125,
    responses: 34,
    conversion_rate: 27.2,
    bounce_rate: 15.8,
    avg_completion_time: 215,
    revenue: 850.60
  },
  {
    id: 'analytics-002',
    date: new Date('2024-03-24').toISOString().split('T')[0],
    funnel_id: 'funnel-quiz-personalidade-001',
    views: 98,
    responses: 28,
    conversion_rate: 28.6,
    bounce_rate: 12.3,
    avg_completion_time: 198,
    revenue: 742.80
  },
  {
    id: 'analytics-003',
    date: new Date('2024-03-25').toISOString().split('T')[0],
    funnel_id: 'funnel-quiz-marketing-digital-002',
    views: 67,
    responses: 18,
    conversion_rate: 26.9,
    bounce_rate: 18.2,
    avg_completion_time: 285,
    revenue: 1199.60
  }
];

// ============================================================================
// FUNÇÕES DE INSERÇÃO
// ============================================================================

export const insertSampleUsers = async () => {
  console.log('👥 Inserindo usuários de exemplo...');
  
  try {
    const { data, error } = await supabase
      .from('users')
      .insert(SAMPLE_USERS)
      .select();
    
    if (error) {
      console.error('❌ Erro ao inserir usuários:', error.message);
      return false;
    }
    
    console.log(`✅ ${data?.length || 0} usuários inseridos com sucesso`);
    return true;
  } catch (error) {
    console.error('❌ Erro inesperado ao inserir usuários:', error);
    return false;
  }
};

export const insertSampleFunnels = async () => {
  console.log('🎯 Inserindo funis de exemplo...');
  
  try {
    const { data, error } = await supabase
      .from('funnels') 
      .insert(SAMPLE_FUNNELS)
      .select();
    
    if (error) {
      console.error('❌ Erro ao inserir funis:', error.message);
      return false;
    }
    
    console.log(`✅ ${data?.length || 0} funis inseridos com sucesso`);
    return true;
  } catch (error) {
    console.error('❌ Erro inesperado ao inserir funis:', error);
    return false;
  }
};

export const insertSampleResponses = async () => {
  console.log('💬 Inserindo respostas de exemplo...');
  
  try {
    const { data, error } = await supabase
      .from('quiz_responses')
      .insert(SAMPLE_RESPONSES)
      .select();
    
    if (error) {
      console.error('❌ Erro ao inserir respostas:', error.message);
      return false;
    }
    
    console.log(`✅ ${data?.length || 0} respostas inseridas com sucesso`);
    return true;
  } catch (error) {
    console.error('❌ Erro inesperado ao inserir respostas:', error);
    return false;
  }
};

export const insertSampleAnalytics = async () => {
  console.log('📈 Inserindo dados de analytics...');
  
  try {
    const { data, error } = await supabase
      .from('analytics')
      .insert(SAMPLE_ANALYTICS)
      .select();
    
    if (error) {
      console.error('❌ Erro ao inserir analytics:', error.message);
      return false;
    }
    
    console.log(`✅ ${data?.length || 0} registros de analytics inseridos`);
    return true;
  } catch (error) {
    console.error('❌ Erro inesperado ao inserir analytics:', error);
    return false;
  }
};

// ============================================================================
// FUNÇÃO PRINCIPAL PARA POPULAR O BANCO
// ============================================================================

export const populateDatabase = async () => {
  console.log('🚀 INICIANDO POPULAÇÃO DO BANCO DE DADOS...\n');
  
  const results = {
    users: false,
    funnels: false,
    responses: false,
    analytics: false
  };
  
  // Inserir dados em ordem
  results.users = await insertSampleUsers();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
  
  results.funnels = await insertSampleFunnels(); 
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  results.responses = await insertSampleResponses();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  results.analytics = await insertSampleAnalytics();
  
  console.log('\n📊 RELATÓRIO DE INSERÇÃO:');
  console.log(`👥 Usuários: ${results.users ? '✅ Sucesso' : '❌ Falhou'}`);
  console.log(`🎯 Funis: ${results.funnels ? '✅ Sucesso' : '❌ Falhou'}`);
  console.log(`💬 Respostas: ${results.responses ? '✅ Sucesso' : '❌ Falhou'}`);
  console.log(`📈 Analytics: ${results.analytics ? '✅ Sucesso' : '❌ Falhou'}`);
  
  const successCount = Object.values(results).filter(Boolean).length;
  console.log(`\n🏁 POPULAÇÃO COMPLETA: ${successCount}/4 tabelas populadas com sucesso`);
  
  return results;
};

// ============================================================================
// FUNÇÕES DE VERIFICAÇÃO
// ============================================================================

export const verifyDataInsertion = async () => {
  console.log('🔍 VERIFICANDO DADOS INSERIDOS...\n');
  
  const checks = [];
  
  // Verificar usuários
  try {
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    checks.push({ table: 'users', count: userCount || 0 });
  } catch (error) {
    checks.push({ table: 'users', count: 0, error: error.message });
  }
  
  // Verificar funis
  try {
    const { count: funnelCount } = await supabase
      .from('funnels')
      .select('*', { count: 'exact', head: true });
    checks.push({ table: 'funnels', count: funnelCount || 0 });
  } catch (error) {
    checks.push({ table: 'funnels', count: 0, error: error.message });
  }
  
  // Verificar respostas
  try {
    const { count: responseCount } = await supabase
      .from('quiz_responses')
      .select('*', { count: 'exact', head: true });
    checks.push({ table: 'quiz_responses', count: responseCount || 0 });
  } catch (error) {
    checks.push({ table: 'quiz_responses', count: 0, error: error.message });
  }
  
  // Verificar analytics
  try {
    const { count: analyticsCount } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true });
    checks.push({ table: 'analytics', count: analyticsCount || 0 });
  } catch (error) {
    checks.push({ table: 'analytics', count: 0, error: error.message });
  }
  
  console.log('📊 CONTAGEM DE REGISTROS:');
  checks.forEach(check => {
    if (check.error) {
      console.log(`❌ ${check.table}: Erro - ${check.error}`);
    } else {
      console.log(`${check.count > 0 ? '✅' : '⚠️'} ${check.table}: ${check.count} registros`);
    }
  });
  
  return checks;
};

export const testDashboardUpdates = async () => {
  console.log('🧪 TESTANDO ATUALIZAÇÕES DO DASHBOARD...\n');
  
  // Importar e testar UnifiedDataService com dados reais
  try {
    const { UnifiedDataService } = await import('@/services/core/UnifiedDataService');
    
    console.log('📊 Testando getDashboardMetrics...');
    const metrics = await UnifiedDataService.getDashboardMetrics();
    console.log('✅ Métricas obtidas:', {
      totalUsers: metrics.totalUsers,
      totalFunnels: metrics.totalFunnels,
      totalResponses: metrics.totalResponses,
      avgConversionRate: metrics.avgConversionRate
    });
    
    console.log('🎯 Testando getFunnels...');
    const funnels = await UnifiedDataService.getFunnels();
    console.log(`✅ Funis obtidos: ${funnels.length} funis`);
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao testar dashboard:', error.message);
    return false;
  }
};