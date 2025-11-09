// SOLUÇÃO TEMPORÁRIA: Forçar componentes em produção
// Execute no console do Lovable se AVAILABLE_COMPONENTS estiver vazio

console.log('🔧 APLICANDO SOLUÇÃO TEMPORÁRIA PARA PRODUÇÃO');
console.log('============================================');

// 1. Verificar estado atual
console.log('Estado antes da correção:');
const currentDraggables = document.querySelectorAll('[draggable="true"], [data-draggable]');
console.log(`Draggables atuais: ${currentDraggables.length}`);

// 2. Aguardar um momento para o React renderizar
setTimeout(() => {
  console.log('\n⏰ Após 2 segundos - verificando novamente...');

  const newDraggables = document.querySelectorAll('[draggable="true"], [data-draggable]');
  console.log(`Draggables após delay: ${newDraggables.length}`);

  if (newDraggables.length === 0) {
    console.log('\n🚨 CONFIRMADO: Problema de ambiente produção');
    console.log('💡 SOLUÇÕES POSSÍVEIS:');
    console.log('1. Recarregar página');
    console.log('2. Limpar cache do browser');
    console.log('3. Verificar network tab para erros 404');
    console.log('4. Comparar com localhost:8083');

    // Tentar encontrar logs de erro específicos
    console.log('\n🔍 PROCURANDO LOGS DE DEBUG:');
    console.log('Procure por estes logs no console:');
    console.log('- "🎯 EnhancedComponentsSidebar renderizando"');
    console.log('- "🧩 AVAILABLE_COMPONENTS carregados: X"');
    console.log('- "📊 Categorias processadas: [...]"');

    if (!window.console.logs || window.console.logs.length === 0) {
      console.log('\n❌ LOGS DE DEBUG NÃO ENCONTRADOS');
      console.log('CAUSA PROVÁVEL: Componente não está executando completamente');
    }
  } else {
    console.log('\n✅ PROBLEMA RESOLVIDO: Draggables encontrados após delay');
  }
}, 2000);

// 3. Verificar erros de rede
console.log('\n🌐 VERIFICANDO NETWORK:');
console.log('Abra Network tab e procure por:');
console.log('- 404 errors em imports');
console.log('- Failed lazy loading');
console.log('- Blocked CORS requests');

// 4. Tentar forçar re-render
console.log('\n🔄 TENTANDO FORÇAR RE-RENDER:');

// Encontrar input de busca e tentar triggerar mudança
const searchInput = document.querySelector('input[placeholder*="Buscar"]');
if (searchInput) {
  console.log('Input de busca encontrado, tentando trigger...');

  // Simular interação para forçar re-render
  searchInput.focus();
  searchInput.value = 'test';
  searchInput.dispatchEvent(new Event('input', { bubbles: true }));

  setTimeout(() => {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('Re-render tentado via input change');
  }, 500);
} else {
  console.log('❌ Input de busca não encontrado');
}

console.log('\n⏳ Aguardando resultados...');
