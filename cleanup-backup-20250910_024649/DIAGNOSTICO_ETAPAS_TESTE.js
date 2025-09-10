// 🔍 TESTE DE DIAGNÓSTICO - QuizEditorPro
// Para verificar se as correções de "etapas não carregam" estão funcionando

// Execute este código no console do DevTools quando o QuizEditorPro estiver aberto:

console.log('=== DIAGNÓSTICO RÁPIDO - ETAPAS ===');

// 1. Verificar estado global do editor
const editorState = window.__QUIZ_EDITOR_STATE__ || 'Não encontrado';
console.log('1. Estado do editor:', editorState);

// 2. Verificar se há elementos DOM dos componentes
const stepsList = document.querySelectorAll('[data-testid*="step"]');
const canvasBlocks = document.querySelectorAll('[data-testid*="block"]');
const componentsSidebar = document.querySelectorAll('[data-testid*="component"]');

console.log('2. DOM Elements:');
console.log('   - Etapas encontradas:', stepsList.length);
console.log('   - Blocos no canvas:', canvasBlocks.length);
console.log('   - Componentes na sidebar:', componentsSidebar.length);

// 3. Simular função resiliente no console
function testResilientGet(stepBlocks, step) {
  const tryKeys = [`step-${step}`, `step${step}`, String(step), Number(step)];

  for (const key of tryKeys) {
    if (key in stepBlocks && Array.isArray(stepBlocks[key])) {
      console.log(`✅ Blocos encontrados para etapa ${step} usando chave:`, key, stepBlocks[key]);
      return stepBlocks[key];
    }
  }

  console.log(
    `❌ Nenhum bloco encontrado para etapa ${step}. Chaves disponíveis:`,
    Object.keys(stepBlocks)
  );
  return [];
}

// 4. Teste com dados mockados
const mockStepBlocks = {
  'step-1': [{ id: 'block1', type: 'text' }],
  2: [{ id: 'block2', type: 'button' }],
  step3: [{ id: 'block3', type: 'image' }],
};

console.log('3. Teste da função resiliente:');
testResilientGet(mockStepBlocks, 1);
testResilientGet(mockStepBlocks, 2);
testResilientGet(mockStepBlocks, 3);
testResilientGet(mockStepBlocks, 4); // Deve falhar

console.log('=== FIM DO DIAGNÓSTICO ===');
console.log(
  '💡 Dica: Se vir dados vazios, verifique se EditorProvider está inicializando corretamente'
);

export {};
