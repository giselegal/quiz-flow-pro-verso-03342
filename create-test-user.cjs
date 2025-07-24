const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://ixqjqhqjqhqjqhqjqhqj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cWpxaHFqcWhxanFocWpxaHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI2NzEsImV4cCI6MjA1MDU0ODY3MX0.example';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUser() {
  try {
    console.log('🔍 Verificando se já existe um usuário de teste...');
    
    // Verificar se já existe um usuário
    const { data: existingUsers, error: selectError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (selectError) {
      console.error('❌ Erro ao verificar usuários existentes:', selectError);
      return;
    }

    if (existingUsers && existingUsers.length > 0) {
      console.log('✅ Já existe pelo menos um usuário:', existingUsers[0]);
      return existingUsers[0];
    }

    console.log('👤 Criando usuário de teste...');
    
    // Criar um usuário de teste
    const testUserId = '00000000-0000-0000-0000-000000000000';
    const { data, error } = await supabase
      .from('users')
      .insert([{
        id: testUserId,
        email: 'admin@test.com',
        name: 'Admin Teste',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao criar usuário de teste:', error);
      return;
    }

    console.log('✅ Usuário de teste criado com sucesso:', data);
    return data;
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createTestUser()
    .then(() => {
      console.log('🎉 Script concluído!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erro fatal:', error);
      process.exit(1);
    });
}

module.exports = { createTestUser };