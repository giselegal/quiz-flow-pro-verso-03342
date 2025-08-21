// COMPARAÇÃO FINAL: Ambiente Local vs Produção Lovable
// Execute este script em AMBOS ambientes para comparar

console.log('🔍 DIAGNÓSTICO COMPARATIVO - LOCAL vs PRODUÇÃO');
console.log('============================================');

// 1. Identificar ambiente
const isLovable = window.location.host.includes('lovable.app');
const isLocal = window.location.host.includes('localhost');
const isCodespaces = window.location.host.includes('github.dev') || window.location.host.includes('githubpreview.dev');

console.log('🌐 AMBIENTE DETECTADO:');
console.log('URL:', window.location.href);
console.log('Host:', window.location.host);
console.log('Tipo:', isLovable ? '🌍 PRODUÇÃO LOVABLE' : isLocal ? '🏠 LOCAL' : isCodespaces ? '📦 CODESPACES' : '❓ DESCONHECIDO');

// 2. Verificar React e componentes básicos
console.log('\n⚛️ REACT STATUS:');
console.log('React:', typeof React !== 'undefined' ? '✅' : '❌');
console.log('ReactDOM:', typeof ReactDOM !== 'undefined' ? '✅' : '❌');

// 3. Verificar se sidebar existe
console.log('\n🧩 SIDEBAR STATUS:');
const searchInput = document.querySelector('input[placeholder*="Buscar"]');
const sidebarCard = document.querySelector('[class*="Card"]:has(input[placeholder*="Buscar"])');
const quizBuilderTitle = Array.from(document.querySelectorAll('*')).find(el => 
  el.textContent && el.textContent.includes('Quiz Builder')
);

console.log('Input busca:', searchInput ? '✅' : '❌');
console.log('Card container:', sidebarCard ? '✅' : '❌'); 
console.log('Título "Quiz Builder":', quizBuilderTitle ? '✅' : '❌');

// 4. Verificar componentes draggable
console.log('\n🎯 COMPONENTES DRAGGABLE:');
const draggableElements = document.querySelectorAll('[draggable="true"]');
const dndKitElements = document.querySelectorAll('[data-dnd-kit]');
const sortableElements = document.querySelectorAll('[class*="sortable"]');

console.log(`Elementos draggable="true": ${draggableElements.length}`);
console.log(`Elementos data-dnd-kit: ${dndKitElements.length}`);
console.log(`Elementos sortable: ${sortableElements.length}`);

// 5. Verificar categorias e badges
console.log('\n📂 CATEGORIAS:');
const badges = document.querySelectorAll('[class*="badge"], [class*="Badge"]');
const chevrons = document.querySelectorAll('[class*="chevron"], [class*="Chevron"]');
const categoryTexts = ['step01', 'content', 'quiz', 'action', 'conversion'];

console.log(`Badges encontrados: ${badges.length}`);
console.log(`Chevrons encontrados: ${chevrons.length}`);

const bodyText = document.body.textContent || '';
categoryTexts.forEach(cat => {
  const found = bodyText.includes(cat);
  console.log(`Categoria "${cat}": ${found ? '✅' : '❌'}`);
});

// 6. Verificar logs específicos do componente
console.log('\n📋 LOGS DE DEBUG:');
console.log('Procure nos logs acima por:');
console.log('- "🎯 EnhancedComponentsSidebar renderizando"');
console.log('- "🧩 AVAILABLE_COMPONENTS carregados: X"');
console.log('- "📊 Categorias processadas: [...]"');

// 7. Verificar erros no console
console.log('\n🚨 VERIFICAÇÃO DE ERROS:');
const hasErrors = document.querySelectorAll('.error, [class*="error"]').length > 0;
console.log('Elementos de erro visíveis:', hasErrors ? '⚠️ SIM' : '✅ NÃO');

// 8. DIAGNÓSTICO ESPECÍFICO POR AMBIENTE
console.log('\n🎯 DIAGNÓSTICO ESPECÍFICO:');
console.log('========================');

if (isLovable) {
  // Ambiente Lovable (Produção)
  if (searchInput && draggableElements.length === 0) {
    console.log('❌ PROBLEMA LOVABLE: Sidebar existe mas sem draggables');
    console.log('🔧 CAUSA PROVÁVEL: Build/tree-shaking removendo componentes');
    console.log('💡 SOLUÇÕES:');
    console.log('   1. Verificar network tab para imports falhados');
    console.log('   2. Verificar se AVAILABLE_COMPONENTS foi removido no build');
    console.log('   3. Comparar com localhost');
  } else if (!searchInput) {
    console.log('❌ PROBLEMA LOVABLE: Sidebar não renderizou');
    console.log('💡 CAUSA: Erro de importação/compilação');
  } else {
    console.log('✅ LOVABLE OK: Componentes renderizados corretamente');
  }
  
} else if (isLocal) {
  // Ambiente Local
  if (searchInput && draggableElements.length > 0) {
    console.log('✅ LOCAL OK: Funcionando corretamente');
    console.log('📊 COMPARAÇÃO: Problema específico do ambiente produção');
  } else if (searchInput && draggableElements.length === 0) {
    console.log('⚠️ LOCAL PARCIAL: Sidebar existe mas sem draggables');
    console.log('💡 Verificar logs de debug do componente');
  } else {
    console.log('❌ LOCAL PROBLEMA: Mesmo erro do Lovable');
  }
}

// 9. SUMÁRIO FINAL
console.log('\n📈 SUMÁRIO COMPARATIVO:');
console.log('======================');
console.log(`Ambiente: ${isLovable ? 'LOVABLE' : 'LOCAL'}`);
console.log(`Sidebar: ${searchInput ? 'EXISTE' : 'AUSENTE'}`);
console.log(`Draggables: ${draggableElements.length}`);
console.log(`Badges: ${badges.length}`);
console.log(`Status: ${searchInput && draggableElements.length > 0 ? '✅ FUNCIONANDO' : '❌ COM PROBLEMA'}`);

console.log('\n💡 PRÓXIMA AÇÃO:');
if (isLovable && draggableElements.length === 0) {
  console.log('Execute este mesmo script no localhost para comparar');
} else if (isLocal && draggableElements.length > 0) {
  console.log('Local funciona! Problema é específico do build/deploy Lovable');
} else {
  console.log('Investigar logs de erro específicos no console');
}
