/**
 * Script de teste para debug da Etapa 2
 * Executa no browser para verificar se os templates estão carregando
 */

// Para executar no DevTools do browser:
// 1. Abrir /editor-fixed
// 2. Colar este código no console

console.log("🔍 TESTE DE DEBUG - ETAPA 2");

// Função para testar carregamento de template
function testStep2Template() {
  // Verificar se existe EditorContext
  const editorDiv =
    document.querySelector('[data-step="2"]') || document.querySelector(".editor-canvas");
  console.log("Editor div encontrado:", !!editorDiv);

  // Verificar se há blocos options-grid
  const optionsGrids = document.querySelectorAll('[data-block-id*="step02-clothing-options"]');
  console.log("Blocos options-grid encontrados:", optionsGrids.length);

  // Verificar se há mensagens de debug
  const debugMessages = document.querySelectorAll(".bg-yellow-50");
  console.log("Mensagens de debug encontradas:", debugMessages.length);

  if (debugMessages.length > 0) {
    debugMessages.forEach((msg, i) => {
      console.log(`Debug message ${i + 1}:`, msg.textContent);
    });
  }

  // Verificar se há logs no console
  console.log("Verifique os logs de 'EditorOptionsGridBlock' e 'QuizOptionsGridBlock' acima");
}

// Executar teste após 2 segundos para dar tempo do React carregar
setTimeout(testStep2Template, 2000);

// Exibir instruções
console.log(`
📋 INSTRUÇÕES:
1. Clique na Etapa 2 no painel lateral
2. Aguarde 2 segundos
3. Verifique os logs que aparecerão
4. Se aparecer "Nenhuma opção encontrada", há problema no carregamento
`);
