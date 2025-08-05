// Script para limpar localStorage e aplicar configurações padrão
console.log("🔧 Limpando configurações corrompidas...");

// Limpar configurações antigas da página de resultado
const keysToRemove = [
  "page-config-result-page",
  "page-config-etapa-20-resultado-a",
  "pageConfig-result-page",
  "resultPageConfig",
];

keysToRemove.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`✅ Removido: ${key}`);
  }
});

// Limpar cache do navegador relacionado
if ("caches" in window) {
  caches.keys().then(names => {
    names.forEach(name => {
      if (name.includes("page-config") || name.includes("result-page")) {
        caches.delete(name);
        console.log(`✅ Cache removido: ${name}`);
      }
    });
  });
}

console.log("✨ Limpeza concluída! Recarregue a página para aplicar as configurações padrão.");
console.log("🔄 Execute: window.location.reload()");
