// DIAGNÓSTICO ESPECÍFICO: Ambiente Desenvolvimento vs Produção
// Execute no console do Lovable Preview: https://...lovable.app/editor-unified

console.log('🔍 DIAGNÓSTICO AMBIENTE PRODUÇÃO vs DESENVOLVIMENTO');
console.log('=================================================');

// 1. Identificar ambiente
console.log('🌐 AMBIENTE:');
console.log('URL:', window.location.href);
console.log('Host:', window.location.host);
console.log('É Lovable:', window.location.host.includes('lovable.app') ? '✅ PRODUÇÃO' : '❌ LOCAL');

// 2. Verificar se módulos estão carregados
console.log('\n📦 VERIFICANDO MÓDULOS:');
console.log('Process env:', typeof process !== 'undefined' ? process.env.NODE_ENV : 'undefined');

// 3. Verificar AVAILABLE_COMPONENTS especificamente
console.log('\n🧩 TESTANDO AVAILABLE_COMPONENTS:');

// Simular o que o componente faz
try {
  // Verificar se o componente consegue mapear os dados
  console.log('Tentando simular allBlocks mapping...');
  
  // Simular AVAILABLE_COMPONENTS (mesmo se estiver vazio)
  const testComponents = [
    { type: 'test-1', label: 'Teste 1', category: 'test' },
    { type: 'test-2', label: 'Teste 2', category: 'test' }
  ];
  
  console.log('Teste com dados mock:', testComponents.length);
  
  const testBlocks = testComponents.map(comp => ({
    type: comp.type,
    name: comp.label,
    category: comp.category,
    description: `Componente ${comp.label}`,
  }));
  
  console.log('Mapping funcionou:', testBlocks.length);
  
  // Testar grouping
  const testGrouped = testBlocks.reduce(
    (groups, block) => {
      const category = block.category || 'Outros';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(block);
      return groups;
    },
    {}
  );
  
  console.log('Grouping funcionou:', Object.keys(testGrouped));
  
} catch (error) {
  console.log('❌ ERRO no processamento:', error);
}

// 4. Verificar se DraggableComponentItem existe
console.log('\n🏗️ VERIFICANDO COMPONENTES REACT:');

// Procurar por elementos que deveriam existir
const elementsToFind = [
  'input[placeholder*="Buscar"]',
  '[class*="Card"]',
  '[class*="badge"]',
  '.space-y-1',
  '.cursor-pointer'
];

elementsToFind.forEach(selector => {
  const found = document.querySelectorAll(selector);
  console.log(`${selector}: ${found.length} encontrados`);
});

// 5. Verificar categorias expandidas
console.log('\n📂 VERIFICANDO CATEGORIAS:');

// Procurar por chevrons (indicadores de expansão)
const chevrons = document.querySelectorAll('[class*="chevron"], [class*="Chevron"]');
console.log(`Chevrons encontrados: ${chevrons.length}`);

// Procurar por badges (contadores de categoria)
const badges = document.querySelectorAll('[class*="badge"], [class*="Badge"]');
console.log(`Badges encontrados: ${badges.length}`);

// 6. Verificar se há conteúdo na sidebar mas oculto
console.log('\n👁️ VERIFICANDO CONTEÚDO OCULTO:');

const sidebarInput = document.querySelector('input[placeholder*="Buscar"]');
if (sidebarInput) {
  const sidebarContainer = sidebarInput.closest('[class*="Card"], .card, .sidebar');
  if (sidebarContainer) {
    console.log('Container da sidebar encontrado');
    
    // Contar elementos filhos
    const allChildren = sidebarContainer.querySelectorAll('*');
    console.log(`Total de elementos na sidebar: ${allChildren.length}`);
    
    // Verificar se há elementos com texto específico
    const textContent = sidebarContainer.textContent || '';
    console.log('Primeiro texto da sidebar:', textContent.substring(0, 200));
    
    // Verificar categorias específicas
    const categoryTexts = ['step01', 'content', 'quiz', 'action', 'conversion'];
    categoryTexts.forEach(cat => {
      if (textContent.includes(cat)) {
        console.log(`✅ Categoria encontrada: ${cat}`);
      } else {
        console.log(`❌ Categoria ausente: ${cat}`);
      }
    });
  }
}

// 7. DIAGNÓSTICO FINAL AMBIENTE
console.log('\n🎯 DIAGNÓSTICO AMBIENTE:');
console.log('========================');

const isProduction = window.location.host.includes('lovable.app');
const hasInput = !!document.querySelector('input[placeholder*="Buscar"]');
const hasCategories = badges.length > 0;

if (isProduction && hasInput && !hasCategories) {
  console.log('❌ PROBLEMA IDENTIFICADO: Ambiente Produção');
  console.log('   - Sidebar renderiza ✅');
  console.log('   - Input de busca existe ✅'); 
  console.log('   - Categorias/badges ausentes ❌');
  console.log('   - CAUSA PROVÁVEL: Build/lazy loading');
} else if (!isProduction) {
  console.log('ℹ️ AMBIENTE: Desenvolvimento local');
  console.log('   - Execute também em localhost:8083 para comparar');
} else {
  console.log('⚠️ PROBLEMA MISTO: Investigar mais');
}

console.log('\n💡 SOLUÇÕES SUGERIDAS:');
console.log('1. Comparar com ambiente local (localhost:8083)');
console.log('2. Verificar build/deploy logs');
console.log('3. Testar com dados mock (próximo script)');
console.log('4. Verificar network tab para imports falhados');
