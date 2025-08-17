// 🧪 TESTE SIMPLES - VALIDAÇÃO STEP01
// Script para testar eventos no console

console.log('🧪 Iniciando teste de validação Step01...');

// Simular evento de input de nome
const testInputEvent = () => {
  console.log('📝 Simulando input de nome...');

  window.dispatchEvent(
    new CustomEvent('quiz-input-change', {
      detail: {
        blockId: 'name-input-modular',
        value: 'João',
        valid: true,
      },
    })
  );
};

// Simular evento de input vazio
const testEmptyEvent = () => {
  console.log('🗑️ Simulando input vazio...');

  window.dispatchEvent(
    new CustomEvent('quiz-input-change', {
      detail: {
        blockId: 'name-input-modular',
        value: '',
        valid: false,
      },
    })
  );
};

// Adicionar listeners para debug
window.addEventListener('quiz-input-change', e => {
  console.log('📥 Evento recebido - quiz-input-change:', e.detail);
});

window.addEventListener('step01-button-state-change', e => {
  console.log('🎯 Evento recebido - step01-button-state-change:', e.detail);
});

// Exportar funções para teste manual no console
window.testInputEvent = testInputEvent;
window.testEmptyEvent = testEmptyEvent;

console.log('✅ Teste configurado! Use no console:');
console.log('- testInputEvent() - simular nome válido');
console.log('- testEmptyEvent() - simular input vazio');

export { testEmptyEvent, testInputEvent };
