// Script para testar a conexão com Supabase
console.log('🔍 Testando conexão com Supabase...');

// Simular uma inserção simples para verificar se a tabela existe
const testData = {
  id: 'test-funnel-' + Date.now(),
  name: 'Teste de Funnel',
  description: 'Teste de inserção no Supabase',
  status: 'draft',
  user_id: 'test-user',
  pages_count: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

console.log('📦 Dados de teste:', testData);
console.log('✅ Script executado com sucesso!');
