// DIAGNÓSTICO DETALHADO: Por que 0 draggables na sidebar?
// Execute no console do browser em http://localhost:8083

console.log('🔍 DIAGNÓSTICO DETALHADO SIDEBAR:');
console.log('================================');

// 1. Verificar se a página é a correta
console.log('🌐 URL atual:', window.location.href);
console.log('Deveria ser: http://localhost:8083 ou http://localhost:8083/editor-unified');

// 2. Verificar se o React está carregado
console.log('\n⚛️ VERIFICANDO REACT:');
console.log('React disponível:', typeof React !== 'undefined' ? '✅' : '❌');
console.log('ReactDOM disponível:', typeof ReactDOM !== 'undefined' ? '✅' : '❌');

// 3. Verificar elementos React na página
const reactRoot = document.querySelector('#root, [data-reactroot]');
console.log('React root encontrado:', reactRoot ? '✅' : '❌');
if (reactRoot) {
  console.log('Children do root:', reactRoot.children.length);
}

// 4. Buscar especificamente pela sidebar
console.log('\n🧩 BUSCANDO SIDEBAR:');
const possibleSidebars = [
  'EnhancedComponentsSidebar',
  'Quiz Builder',
  'Buscar componentes',
  'components-sidebar',
  'w-80',
];

let sidebarContent = null;
possibleSidebars.forEach(term => {
  const xpath = `//*[contains(text(), "${term}") or contains(@class, "${term}")]`;
  const result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  if (result.singleNodeValue) {
    console.log(`✅ Encontrado: "${term}"`);
    sidebarContent = result.singleNodeValue;
  } else {
    console.log(`❌ Não encontrado: "${term}"`);
  }
});

// 5. Se sidebar encontrada, analisar conteúdo
if (sidebarContent) {
  console.log('\n📋 ANALISANDO CONTEÚDO DA SIDEBAR:');
  const sidebarText = sidebarContent.textContent || '';
  console.log('Texto da sidebar (primeiros 200 chars):', sidebarText.substring(0, 200));

  // Verificar se há botões ou items draggable
  const draggableItems = sidebarContent.querySelectorAll(
    '[draggable="true"], [data-draggable="true"], [class*="draggable"]'
  );
  console.log(`Items draggable encontrados: ${draggableItems.length}`);

  // Verificar se há elementos com classes específicas do dnd-kit
  const dndElements = sidebarContent.querySelectorAll(
    '[data-dnd-kit*=""], [class*="dnd-kit"], [class*="sortable"]'
  );
  console.log(`Elementos DND-Kit encontrados: ${dndElements.length}`);
} else {
  console.log('\n❌ SIDEBAR NÃO ENCONTRADA!');
}

// 6. Verificar se há erros no console
console.log('\n🚨 VERIFICANDO ERROS NO CONSOLE:');
// Interceptar console.error temporariamente
const originalError = console.error;
const errors = [];
console.error = (...args) => {
  errors.push(args);
  originalError.apply(console, args);
};

// Aguardar um momento para capturar erros
setTimeout(() => {
  console.error = originalError;
  console.log(`Erros capturados: ${errors.length}`);
  if (errors.length > 0) {
    console.log('Últimos erros:', errors.slice(-3));
  }
}, 1000);

// 7. Verificar se há elementos com display:none ou visibility:hidden
console.log('\n👁️ VERIFICANDO ELEMENTOS OCULTOS:');
const allElements = document.querySelectorAll('*');
let hiddenCount = 0;
Array.from(allElements).forEach(el => {
  const style = getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden') {
    hiddenCount++;
    if (
      (el.textContent && el.textContent.includes('Quiz')) ||
      (el.textContent && el.textContent.includes('Componente'))
    ) {
      console.log(
        'Elemento oculto relevante:',
        el.tagName,
        el.className,
        el.textContent.substring(0, 50)
      );
    }
  }
});
console.log(`Total de elementos ocultos: ${hiddenCount}`);

// 8. Verificar a estrutura HTML geral
console.log('\n🏗️ ESTRUTURA HTML:');
const mainContainer = document.querySelector('main, [role="main"], .main, #main');
console.log('Container principal encontrado:', mainContainer ? '✅' : '❌');

if (mainContainer) {
  const children = Array.from(mainContainer.children);
  console.log(`Children do main: ${children.length}`);
  children.forEach((child, i) => {
    console.log(
      `  [${i}]: ${child.tagName} - ${child.className} - ${child.textContent ? child.textContent.substring(0, 30) + '...' : 'sem texto'}`
    );
  });
}

// 9. DIAGNÓSTICO FINAL
console.log('\n🎯 DIAGNÓSTICO FINAL:');
console.log('===================');

if (!reactRoot) {
  console.log('❌ PROBLEMA: React não inicializou corretamente');
} else if (!sidebarContent) {
  console.log('❌ PROBLEMA: EnhancedComponentsSidebar não renderizou');
  console.log('   Possíveis causas:');
  console.log('   1. Erro na importação/renderização do componente');
  console.log('   2. Erro no AVAILABLE_COMPONENTS');
  console.log('   3. Rota incorreta (deveria estar em /editor-unified)');
} else {
  console.log('⚠️ PROBLEMA: Sidebar existe mas sem elementos draggable');
  console.log('   Possíveis causas:');
  console.log('   1. DraggableComponentItem não está sendo renderizado');
  console.log('   2. useDraggable não está funcionando');
  console.log('   3. CSS está escondendo os elementos');
}

console.log('\n💡 PRÓXIMOS PASSOS:');
console.log('1. Se React não carregou: recarregar página');
console.log('2. Se sidebar não existe: verificar rota /editor-unified');
console.log('3. Se sidebar existe sem draggables: verificar DraggableComponentItem');
console.log('4. Executar teste-sidebar-renderizacao.js para mais detalhes');
