/* 
🔧 Script de Debug para Exclusão de Componentes no Editor
Execute este script no console do navegador em http://localhost:8080/editor
*/

console.log('🔧 Iniciando debug da exclusão de componentes...');

// 1. Verificar se o funnel foi carregado
const funnelId = localStorage.getItem('currentFunnelId');
console.log('📁 Funnel ID no localStorage:', funnelId);

// 2. Verificar se há componentes na tela
const components = document.querySelectorAll('[data-block-id]');
console.log('📦 Componentes encontrados na tela:', components.length);

components.forEach((comp, i) => {
  console.log(`   Componente ${i}:`, comp.getAttribute('data-block-id'));
});

// 3. Procurar botões de exclusão
const allButtons = document.querySelectorAll('button');
let deleteButtons = [];

allButtons.forEach((btn, i) => {
  // Verificar se é botão de lixeira
  const hasTrashIcon =
    btn.innerHTML.includes('lucide-trash') ||
    btn.querySelector('svg[class*="trash"]') ||
    btn.innerHTML.includes('Trash2');

  if (hasTrashIcon) {
    deleteButtons.push(btn);
    console.log(`🗑️  Botão de exclusão ${deleteButtons.length}:`, btn);

    // Destacar visualmente
    btn.style.border = '3px solid red';
    btn.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
    btn.style.opacity = '1';
    btn.style.zIndex = '9999';
  }
});

console.log(`🗑️  Total de botões de exclusão encontrados: ${deleteButtons.length}`);

// 4. Forçar visibilidade de todos os controles hover
const style = document.createElement('style');
style.id = 'debug-delete-buttons';
style.textContent = `
  .group .opacity-0 { opacity: 1 !important; }
  .group-hover\\:opacity-90 { opacity: 1 !important; }
  
  /* Destacar grupos/componentes */
  .group {
    border: 2px dashed blue !important;
    position: relative !important;
  }
  
  /* Tornar botões sempre visíveis */
  button[class*="hover:bg-red"] {
    background-color: rgba(255, 0, 0, 0.2) !important;
    opacity: 1 !important;
  }
`;
document.head.appendChild(style);

console.log('🎨 CSS de debug aplicado');

// 5. Verificar se existem funções React disponíveis
if (window.React) {
  console.log('⚛️  React disponível:', window.React.version);
} else {
  console.log('❌ React não encontrado');
}

// 6. Tentar carregar o funnel manualmente se necessário
if (!funnelId || funnelId !== 'funnel_1753399767385_kgc4wwjsc') {
  console.log('📥 Carregando funnel de teste...');
  localStorage.setItem('currentFunnelId', 'funnel_1753399767385_kgc4wwjsc');
  console.log('🔄 Recarregue a página para carregar o funnel de teste');
}

// 7. Função para testar exclusão manual
window.testDelete = function (blockId = 'test-block-1') {
  console.log('🧪 Testando exclusão manual do bloco:', blockId);

  // Tentar encontrar e clicar no botão de exclusão
  if (deleteButtons.length > 0) {
    console.log('🔄 Clicando no primeiro botão de exclusão...');
    deleteButtons[0].click();
  } else {
    console.log('❌ Nenhum botão de exclusão encontrado');
  }
};

// 8. Função para simular hover em todos os componentes
window.showAllControls = function () {
  console.log('👁️  Simulando hover em todos os componentes...');

  const groups = document.querySelectorAll('.group');
  groups.forEach(group => {
    // Simular evento de mouse enter
    const event = new MouseEvent('mouseenter', { bubbles: true });
    group.dispatchEvent(event);

    // Adicionar classe hover manualmente
    group.classList.add('hover');
  });
};

console.log('✅ Debug concluído! Comandos disponíveis:');
console.log('   - testDelete() - Tenta excluir usando o primeiro botão encontrado');
console.log('   - showAllControls() - Força visibilidade de todos os controles');
console.log('   - deleteButtons - Array com botões de exclusão encontrados');

// Executar automaticamente
showAllControls();
