// 🚨 DEBUG CRÍTICO - React não está renderizando
// Cole este script no console do navegador em http://localhost:8081/editor

console.clear();
console.log('🚨 DIAGNÓSTICO CRÍTICO DO REACT\n');

// 1. Verificar se React está carregado
console.log('⚛️ React global:', typeof window.React);
console.log('🔧 ReactDOM global:', typeof window.ReactDOM);

// 2. Verificar conteúdo do div root
const root = document.getElementById('root');
console.log('📦 Root element:', !!root);
if (root) {
  console.log('📄 Root innerHTML length:', root.innerHTML.length);
  console.log('🔍 Root content preview:', root.innerHTML.substring(0, 200) + '...');
  console.log('👶 Root children count:', root.children.length);

  // Se há filhos, mostrar os primeiros
  if (root.children.length > 0) {
    console.log('👶 First child:', root.children[0]);
    console.log('🏷️ First child tagName:', root.children[0].tagName);
    console.log('📝 First child className:', root.children[0].className);
  }
}

// 3. Verificar se há erros JavaScript
const errors = [];
window.addEventListener('error', e => {
  errors.push(e);
  console.log('❌ JavaScript Error:', e.message, 'at', e.filename + ':' + e.lineno);
});

// 4. Verificar network requests (se há 404s ou falhas)
if (window.performance && window.performance.getEntries) {
  const failedRequests = window.performance
    .getEntries()
    .filter(entry => entry.name.includes('.js') || entry.name.includes('.css'))
    .filter(entry => entry.transferSize === 0 || entry.duration > 5000);

  console.log('🌐 Failed/slow requests:', failedRequests.length);
  failedRequests.forEach(req => {
    console.log('  ❌', req.name, 'Size:', req.transferSize, 'Duration:', req.duration + 'ms');
  });
}

// 5. Verificar console errors
const originalConsoleError = console.error;
const consoleErrors = [];
console.error = function (...args) {
  consoleErrors.push(args);
  originalConsoleError.apply(console, args);
};

// 6. Verificar se há componentes React renderizados
setTimeout(() => {
  console.log('\n📊 DEPOIS DE 2 SEGUNDOS:');
  console.log('📄 Root innerHTML length:', root ? root.innerHTML.length : 0);
  console.log('❌ Console errors captured:', consoleErrors.length);

  if (consoleErrors.length > 0) {
    console.log('🚨 Erros do console:');
    consoleErrors.forEach((error, i) => {
      console.log(`  ${i + 1}.`, error);
    });
  }

  // Verificar especificamente por elementos do EditorPro
  const editorElements = document.querySelectorAll(
    '.editor-pro, [class*="editor"], [class*="drag"], [class*="drop"]'
  );
  console.log('🎯 Elementos do editor encontrados:', editorElements.length);

  if (editorElements.length === 0) {
    console.log('🚨 PROBLEMA: Nenhum elemento do editor encontrado!');
    console.log('💡 Possíveis causas:');
    console.log('   1. Erro de build/compilação');
    console.log('   2. Rota incorreta');
    console.log('   3. Error boundary ativo');
    console.log('   4. JavaScript não carregou');
  }
}, 2000);

console.log('\n⏳ Aguardando 2 segundos para análise completa...');
