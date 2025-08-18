// Teste específico para salvamento manual
console.log('🧪 Teste de salvamento manual iniciado...');

// Função para testar o salvamento
function testManualSave() {
  console.log('📋 CHECKLIST DO SALVAMENTO MANUAL:');

  // 1. Verificar se está no editor
  const isOnEditor = window.location.pathname.includes('/editor');
  console.log(`✅ 1. No editor: ${isOnEditor}`);

  // 2. Verificar se há botão Salvar visível
  const saveButton = document.querySelector('button[class*="bg-\\[\\#B89B7A\\]"]');
  console.log(`✅ 2. Botão Salvar encontrado: ${!!saveButton}`);

  // 3. Verificar se o estado do funil existe
  const hasReactState =
    window.React && window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  console.log(`✅ 3. React carregado: ${!!hasReactState}`);

  // 4. Verificar localStorage
  const localFunnels = localStorage.getItem('schema-driven-funnels');
  console.log(`✅ 4. Funnels no localStorage: ${!!localFunnels}`);
  if (localFunnels) {
    const parsed = JSON.parse(localFunnels);
    console.log(`   📊 Quantidade de funnels locais: ${Object.keys(parsed).length}`);
  }

  // 5. Verificar se há mudanças pendentes
  const hasPendingChanges = localStorage.getItem('schema-driven-pending-changes');
  console.log(`✅ 5. Mudanças pendentes: ${hasPendingChanges}`);

  // 6. Testar clique no botão
  if (saveButton && !saveButton.disabled) {
    console.log('🎯 Simulando clique no botão Salvar...');
    saveButton.click();

    // Aguardar um pouco e verificar resultado
    setTimeout(() => {
      console.log('🔍 Verificando resultado do salvamento...');
      // Verificar logs do console que devem aparecer
      // Verificar se o estado de isSaving mudou
      // Verificar se houve chamada para Supabase
    }, 1000);
  } else {
    console.log('❌ Botão Salvar não está disponível ou está desabilitado');
  }

  return {
    isOnEditor,
    hasSaveButton: !!saveButton,
    hasReactState: !!hasReactState,
    localFunnels: !!localFunnels,
    hasPendingChanges: !!hasPendingChanges,
  };
}

// Executar o teste
const testResult = testManualSave();
console.log('📊 Resultado do teste:', testResult);

// Adicionar listener para monitorar cliques no botão
document.addEventListener('click', event => {
  if (
    event.target &&
    event.target.closest &&
    event.target.closest('button[class*="bg-\\[\\#B89B7A\\]"]')
  ) {
    console.log('🎯 CLIQUE NO BOTÃO SALVAR DETECTADO!');
    console.log('📝 Timestamp:', new Date().toISOString());
  }
});

console.log('✅ Teste configurado! Agora tente clicar no botão Salvar.');
