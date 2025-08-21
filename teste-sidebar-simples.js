// TESTE SIMPLES: Verificar se EnhancedComponentsSidebar carrega
// Execute no console do browser

console.log('🔍 VERIFICAÇÃO ENHANCED COMPONENTS SIDEBAR');

// 1. Verificar se a sidebar existe
const sidebar = document.querySelector('.components-sidebar');
console.log('🧩 Sidebar encontrada:', !!sidebar);

// 2. Verificar se há algum componente dentro
const componentItems = document.querySelectorAll(
  '.components-sidebar [class*="draggable"], .components-sidebar [class*="component"]'
);
console.log('📦 Itens na sidebar:', componentItems.length);

// 3. Verificar se há card
const card = document.querySelector(
  '.components-sidebar .card, .components-sidebar [class*="card"]'
);
console.log('🃏 Card encontrado:', !!card);

// 4. Verificar se há title
const title = document.querySelector(
  '.components-sidebar h2, .components-sidebar [class*="title"]'
);
console.log('📝 Título encontrado:', !!title, title?.textContent);

// 5. Verificar se há input de busca
const searchInput = document.querySelector('.components-sidebar input');
console.log('🔍 Input de busca:', !!searchInput);

// 6. Verificar se há erro de console relacionado a AVAILABLE_COMPONENTS
console.log('📋 Verifique se há logs de AVAILABLE_COMPONENTS nos logs anteriores');

// 7. Verificar estrutura HTML
if (sidebar) {
  console.log('🏗️ HTML da sidebar (primeiros 500 chars):', sidebar.innerHTML.substring(0, 500));
}
