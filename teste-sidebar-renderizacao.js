// DIAGNÓSTICO: Por que a sidebar está vazia?
// Execute no console do browser em http://localhost:8083

console.log('🔍 DIAGNÓSTICO RENDERIZAÇÃO SIDEBAR:');
console.log('=====================================');

// 1. Verificar se EnhancedComponentsSidebar foi renderizado
const sidebarElements = [
  // Possíveis seletores para a sidebar
  '[class*="sidebar"]',
  '[class*="components"]', 
  'div[role="complementary"]',
  '.w-80', // Classe da coluna 2
  'div:contains("Quiz Builder")', // CardTitle
  'input[placeholder*="Buscar"]', // Input de busca
  '[data-testid*="sidebar"]',
  '[data-testid*="component"]'
];

let sidebarFound = false;
sidebarElements.forEach(selector => {
  try {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      console.log(`✅ Encontrado: ${selector} (${elements.length} elementos)`);
      elements.forEach((el, i) => {
        console.log(`   [${i}]:`, el.textContent?.substring(0, 100) + '...');
      });
      sidebarFound = true;
    }
  } catch (e) {
    // Ignorar erros de seletor inválido
  }
});

if (!sidebarFound) {
  console.log('❌ SIDEBAR NÃO ENCONTRADA - Componente não renderizou');
}

// 2. Verificar se AVAILABLE_COMPONENTS carregou
console.log('\n🧩 VERIFICANDO COMPONENTES:');
try {
  // Procurar por qualquer texto que indique componentes
  const componentTexts = [
    'Cabeçalho Quiz',
    'Barra Decorativa', 
    'Texto',
    'Imagem',
    'Botão',
    'Quiz Builder'
  ];
  
  let componentFound = false;
  componentTexts.forEach(text => {
    const xpath = `//*[contains(text(), "${text}")]`;
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    if (result.singleNodeValue) {
      console.log(`✅ Texto encontrado: "${text}"`);
      componentFound = true;
    }
  });
  
  if (!componentFound) {
    console.log('❌ NENHUM TEXTO DE COMPONENTE ENCONTRADO');
  }
} catch (e) {
  console.log('❌ Erro ao verificar textos:', e);
}

// 3. Verificar React DevTools ou erros no console
console.log('\n🛠️ VERIFICANDO ERROS:');
const errors = document.querySelectorAll('[class*="error"], [class*="Error"]');
console.log(`Elementos com erro encontrados: ${errors.length}`);

// 4. Verificar se está na URL correta
console.log('\n🌐 URL ATUAL:', window.location.href);
console.log('Path:', window.location.pathname);

// 5. Verificar viewport e CSS
console.log('\n📱 VIEWPORT E CSS:');
const body = document.body;
console.log('Body classes:', body.className);
console.log('Body visibility:', getComputedStyle(body).visibility);
console.log('Body display:', getComputedStyle(body).display);

// 6. Verificar se há elementos React na página
console.log('\n⚛️ VERIFICANDO REACT:');
const reactElements = document.querySelectorAll('[data-reactroot], [data-react*=""], #root, [id*="react"]');
console.log(`Elementos React encontrados: ${reactElements.length}`);

// 7. Tentar encontrar qualquer input de busca (seria da sidebar)
console.log('\n🔍 VERIFICANDO INPUT DE BUSCA:');
const searchInputs = document.querySelectorAll('input[placeholder*="Buscar"], input[placeholder*="buscar"], input[placeholder*="Search"], input[placeholder*="search"]');
console.log(`Inputs de busca encontrados: ${searchInputs.length}`);
searchInputs.forEach((input, i) => {
  console.log(`   Input ${i}:`, input.placeholder, input.closest('div')?.textContent?.substring(0, 50));
});

// 8. DIAGNÓSTICO FINAL
console.log('\n🎯 DIAGNÓSTICO FINAL:');
if (!sidebarFound && searchInputs.length === 0) {
  console.log('❌ SIDEBAR NÃO RENDERIZADA - Possíveis causas:');
  console.log('   1. Erro na importação do EnhancedComponentsSidebar');
  console.log('   2. Erro no AVAILABLE_COMPONENTS');
  console.log('   3. Erro de compilação TypeScript');
  console.log('   4. CSS escondendo a sidebar');
  console.log('   5. Rota/página incorreta');
} else {
  console.log('✅ SIDEBAR PARCIALMENTE DETECTADA - Investigar conteúdo');
}

console.log('\n💡 PRÓXIMOS PASSOS:');
console.log('1. Verifique o console para erros de JavaScript');
console.log('2. Verifique se está em http://localhost:8083');
console.log('3. Abra React DevTools para ver componentes');
console.log('4. Execute: window.location.reload() se necessário');
