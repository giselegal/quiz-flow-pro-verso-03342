/**
 * 🔄 FORCE REFRESH EDITOR - Limpar todos os caches e recarregar
 * 
 * Execute no console do browser para forçar recarregamento
 */

console.log('🔄 FORCE REFRESH EDITOR');
console.log('======================');

// 1. Limpar todos os storages
console.log('🗑️ Limpando storages...');
localStorage.clear();
sessionStorage.clear();
console.log('✅ Storages limpos');

// 2. Limpar cache de Service Workers se existir
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
    });
    console.log('✅ Service Workers limpos');
  });
}

// 3. Verificar templates
console.log('\n📋 Testando templates...');
fetch('/templates/step-20-v3.json')
  .then(r => r.json())
  .then(data => {
    console.log('✅ Step 20 v3:', {
      version: data.templateVersion,
      sections: data.sections?.length,
      metadata: data.metadata?.name
    });
  })
  .catch(err => console.log('❌ Step 20 v3 erro:', err));

// 4. Testar se há templates antigos (não deveria existir)
fetch('/templates/step-20-template.json')
  .then(r => r.json())
  .then(data => {
    console.log('⚠️ Template antigo ainda existe:', data.metadata?.name);
  })
  .catch(err => console.log('✅ Template antigo não existe (correto!)'));

// 5. Verificar se o stepTemplateService está funcionando
setTimeout(() => {
  if (window.location.pathname.includes('/editor')) {
    console.log('\n🔍 Testando editor atual...');
    
    // Verificar se há elementos do Step 20
    const step20Elements = document.querySelectorAll('[data-step="20"], [class*="step-20"], [id*="step-20"]');
    console.log(`📊 Elementos Step 20 no DOM: ${step20Elements.length}`);
    
    // Verificar requests de rede
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      const url = args[0];
      if (typeof url === 'string' && url.includes('template')) {
        console.log('📥 Template request:', url);
      }
      return originalFetch.apply(this, args);
    };
    
    console.log('🎯 Monitoramento ativo. Navegue pelo editor...');
  }
}, 1000);

// 6. Recarregar página após 3 segundos
setTimeout(() => {
  console.log('🔄 Recarregando página...');
  window.location.reload();
}, 3000);