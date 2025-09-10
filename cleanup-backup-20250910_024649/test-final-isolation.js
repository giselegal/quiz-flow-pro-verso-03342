import { getFunnelSessionKey, getFunnelStepKey, getFunnelResponseKey } from './utils/funnelStorageKeys';

/**
 * 🧪 TESTE FINAL DE ISOLAMENTO ENTRE FUNNELS
 * 
 * Este script verifica se cada funnel mantém seus dados completamente isolados
 */

console.log('🔒 INICIANDO TESTE FINAL DE ISOLAMENTO');

// Simular dois funnels diferentes
const funnelA = 'quiz-teste-001';
const funnelB = 'lead-magnet-002';

// Dados de teste
const testData = {
    session: { userId: 'user123', startTime: Date.now() },
    step1: { name: 'João Silva', age: 30 },
    step2: { email: 'joao@email.com', phone: '123456789' },
    response1: 'Resposta para pergunta 1',
    response2: 'Resposta para pergunta 2'
};

console.log('📝 Salvando dados para Funnel A...');
// Salvar dados do Funnel A
localStorage.setItem(getFunnelSessionKey(funnelA), JSON.stringify(testData.session));
localStorage.setItem(getFunnelStepKey(funnelA, 'step-1'), JSON.stringify(testData.step1));
localStorage.setItem(getFunnelStepKey(funnelA, 'step-2'), JSON.stringify(testData.step2));
localStorage.setItem(getFunnelResponseKey(funnelA, 'question-1'), testData.response1);
localStorage.setItem(getFunnelResponseKey(funnelA, 'question-2'), testData.response2);

console.log('📝 Salvando dados DIFERENTES para Funnel B...');
// Salvar dados DIFERENTES do Funnel B
const differentData = {
    session: { userId: 'user456', startTime: Date.now() + 1000 },
    step1: { name: 'Maria Santos', age: 25 },
    step2: { email: 'maria@email.com', phone: '987654321' },
    response1: 'Resposta DIFERENTE para pergunta 1',
    response2: 'Resposta DIFERENTE para pergunta 2'
};

localStorage.setItem(getFunnelSessionKey(funnelB), JSON.stringify(differentData.session));
localStorage.setItem(getFunnelStepKey(funnelB, 'step-1'), JSON.stringify(differentData.step1));
localStorage.setItem(getFunnelStepKey(funnelB, 'step-2'), JSON.stringify(differentData.step2));
localStorage.setItem(getFunnelResponseKey(funnelB, 'question-1'), differentData.response1);
localStorage.setItem(getFunnelResponseKey(funnelB, 'question-2'), differentData.response2);

console.log('🔍 VERIFICANDO ISOLAMENTO...');

// Verificar se os dados estão isolados
const funnelASession = JSON.parse(localStorage.getItem(getFunnelSessionKey(funnelA)) || '{}');
const funnelBSession = JSON.parse(localStorage.getItem(getFunnelSessionKey(funnelB)) || '{}');

const funnelAStep1 = JSON.parse(localStorage.getItem(getFunnelStepKey(funnelA, 'step-1')) || '{}');
const funnelBStep1 = JSON.parse(localStorage.getItem(getFunnelStepKey(funnelB, 'step-1')) || '{}');

const funnelAResponse1 = localStorage.getItem(getFunnelResponseKey(funnelA, 'question-1'));
const funnelBResponse1 = localStorage.getItem(getFunnelResponseKey(funnelB, 'question-1'));

console.log('📊 RESULTADOS:');

// Teste 1: Verificar se as sessões são diferentes
const test1 = funnelASession.userId !== funnelBSession.userId;
console.log(`✅ Teste 1 - Sessões isoladas: ${test1 ? 'PASSOU' : 'FALHOU'}`);
console.log(`   Funnel A User: ${funnelASession.userId}, Funnel B User: ${funnelBSession.userId}`);

// Teste 2: Verificar se os dados das etapas são diferentes
const test2 = funnelAStep1.name !== funnelBStep1.name;
console.log(`✅ Teste 2 - Etapas isoladas: ${test2 ? 'PASSOU' : 'FALHOU'}`);
console.log(`   Funnel A Nome: ${funnelAStep1.name}, Funnel B Nome: ${funnelBStep1.name}`);

// Teste 3: Verificar se as respostas são diferentes
const test3 = funnelAResponse1 !== funnelBResponse1;
console.log(`✅ Teste 3 - Respostas isoladas: ${test3 ? 'PASSOU' : 'FALHOU'}`);
console.log(`   Funnel A Resposta: "${funnelAResponse1}"`);
console.log(`   Funnel B Resposta: "${funnelBResponse1}"`);

// Teste 4: Verificar se as chaves são únicas
const keyA = getFunnelSessionKey(funnelA);
const keyB = getFunnelSessionKey(funnelB);
const test4 = keyA !== keyB;
console.log(`✅ Teste 4 - Chaves únicas: ${test4 ? 'PASSOU' : 'FALHOU'}`);
console.log(`   Chave A: ${keyA}, Chave B: ${keyB}`);

// Teste 5: Verificar se não há vazamento de dados
const test5 = !localStorage.getItem(getFunnelSessionKey(funnelA))?.includes(funnelB) &&
    !localStorage.getItem(getFunnelSessionKey(funnelB))?.includes(funnelA);
console.log(`✅ Teste 5 - Sem vazamento: ${test5 ? 'PASSOU' : 'FALHOU'}`);

const allTestsPassed = test1 && test2 && test3 && test4 && test5;

console.log('🎯 RESULTADO FINAL:');
console.log(`${allTestsPassed ? '🎉 TODOS OS TESTES PASSARAM!' : '❌ ALGUNS TESTES FALHARAM!'}`);
console.log(`Isolamento entre funnels: ${allTestsPassed ? 'FUNCIONAL' : 'PROBLEMÁTICO'}`);

// Lista todas as chaves no localStorage para debug
console.log('🔍 CHAVES NO LOCALSTORAGE:');
const allKeys = [];
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('funnel_')) {
        allKeys.push(key);
    }
}
console.log(allKeys);

if (allTestsPassed) {
    console.log('✨ Sistema de isolamento validado com sucesso!');
    console.log('📋 Cada funnel agora mantém seus dados completamente separados.');
    console.log('🛡️ Não há mais compartilhamento de dados entre funnels.');
} else {
    console.log('⚠️ Ainda há problemas no sistema de isolamento.');
    console.log('🔧 Verificar implementação das funções de storage.');
}
