// DIAGNÓSTICO COMPLETO: Problema de renderização
// Execute no console do browser: http://localhost:8083/editor-unified

console.log('🔧 DIAGNÓSTICO COMPLETO - RENDERIZAÇÃO DE COMPONENTES');
console.log('===================================================');

// 1. Verificar se sidebar existe
const sidebar = document.querySelector('.components-sidebar');
console.log('🧩 Components Sidebar encontrada:', !!sidebar);

if (sidebar) {
  console.log('📋 HTML da sidebar:', sidebar.innerHTML.substring(0, 200) + '...');
}

// 2. Verificar se EnhancedComponentsSidebar renderizou
const cardTitle = document.querySelector('.components-sidebar h2, .components-sidebar .card-title');
console.log('🃏 Card Title encontrado:', !!cardTitle);
if (cardTitle) {
  console.log('📝 Texto do título:', cardTitle.textContent);
}

// 3. Verificar se há input de busca
const searchInput = document.querySelector('.components-sidebar input');
console.log('🔍 Input de busca:', !!searchInput);

// 4. Verificar se há erro de JavaScript no console
console.log('⚠️ Verificar se há erros de JavaScript acima...');

// 5. Verificar se AVAILABLE_COMPONENTS está disponível
console.log('\n📦 VERIFICAÇÃO DE DADOS:');
console.log('Tentando importar AVAILABLE_COMPONENTS...');

// 6. Testar se há componentes renderizados
const draggableItems = document.querySelectorAll('[data-dnd-kit-draggable-id]');
console.log('🎯 Items arrastáveis encontrados:', draggableItems.length);

// 7. Verificar categorias
const categories = document.querySelectorAll(
  '.components-sidebar [class*="category"], .components-sidebar [class*="group"]'
);
console.log('📂 Categorias encontradas:', categories.length);

// 8. Verificar se há loader ou estado de carregamento
const loading = document.querySelector('.loading, .spinner, [class*="loading"]');
console.log('⏳ Estado de carregamento:', !!loading);

// 9. Verificar estrutura de componentes
const components = document.querySelectorAll('.components-sidebar [class*="component"]');
console.log('🧩 Elementos com "component" na classe:', components.length);

console.log('\n✅ Diagnóstico concluído - revise os logs acima');
