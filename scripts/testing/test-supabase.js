// Teste da integração Supabase
import { userResponseService } from './src/services/userResponseService.js';

export async function testSupabaseIntegration() {
  console.log('🧪 Iniciando teste de integração Supabase...');

  try {
    // Teste 1: Inicializar sessão
    const sessionId = await userResponseService.initializeSession('test-funnel-id');
    console.log('✅ Sessão inicializada:', sessionId);

    // Teste 2: Salvar nome do usuário
    await userResponseService.saveUserName('João Teste', 'test-funnel-id');
    console.log('✅ Nome salvo');

    // Teste 3: Salvar resposta de etapa
    await userResponseService.saveStepResponse(
      1,
      'test-input-1',
      'form-input',
      'Resposta de teste',
      'test-funnel-id'
    );
    console.log('✅ Resposta de etapa salva');

    // Teste 4: Recuperar dados
    const responses = userResponseService.getAllResponses();
    console.log('✅ Dados recuperados:', responses);

    // Teste 5: Testar conexão Supabase
    const testConnection = await userResponseService.testSupabaseConnection();
    console.log('✅ Teste de conexão Supabase:', testConnection);

    console.log('🎉 Todos os testes passaram!');
    return true;
  } catch (error) {
    console.error('❌ Erro nos testes:', error);
    return false;
  }
}

// Para testar manualmente no console:
// window.testSupabaseIntegration = testSupabaseIntegration;

console.log('📦 Script de teste carregado. Use testSupabaseIntegration() para testar.');
