// Script para ativar debug da normalização de blocos
// Execute no console do navegador para ver logs detalhados

// Ativar todos os debugs relacionados à normalização
localStorage.setItem('DEBUG_NORMALIZER', 'true');
localStorage.setItem('DEBUG_BLOCKS', 'true');
localStorage.setItem('DEBUG_SCHEMA', 'true');
localStorage.setItem('DEBUG_PROPERTIES', 'true');

console.log('🔍 DEBUG ATIVADO! Recarregue a página para ver os logs:');
console.log('🔄 [BlockNormalizer] - Sincronização properties ↔ content');
console.log('🧱 [Block] - Renderização de blocos');
console.log('📐 [Schema] - Carregamento de schemas');
console.log('⚙️ [Properties] - Painel de propriedades');

console.log('\n💡 Para acessar o editor, navegue para:');
console.log('http://localhost:8081/?template=quiz21StepsComplete');

// Recarregar automaticamente a página
setTimeout(() => {
    location.reload();
}, 1000);