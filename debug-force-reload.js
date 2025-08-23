// 🔧 TESTE DE RECARREGAMENTO FORÇADO
// Cole este script no console para recarregar e testar

console.log('🔄 Forçando limpeza e recarregamento...');

// 1. Limpar cache se possível
if ('caches' in window) {
  caches.keys().then(names => {
    names.forEach(name => {
      caches.delete(name);
      console.log('🗑️ Cache limpo:', name);
    });
  });
}

// 2. Limpar localStorage e sessionStorage
localStorage.clear();
sessionStorage.clear();
console.log('🗑️ Storage limpo');

// 3. Recarregar sem cache
setTimeout(() => {
  console.log('🔄 Recarregando em 2 segundos...');
  window.location.reload(true);
}, 2000);

console.log('⏳ Aguarde o recarregamento...');
