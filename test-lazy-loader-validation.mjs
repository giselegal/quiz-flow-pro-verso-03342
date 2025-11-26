#!/usr/bin/env node
/**
 * 🧪 Teste de Validação do Lazy Loader
 * 
 * Verifica se o funnel carrega e valida corretamente
 */

console.log('🧪 Testando validação do lazy loader...\n');

try {
  // Importar loader
  const { loadFunnel, getCacheStats } = await import('./src/templates/loaders/dynamic.ts');
  
  console.log('✅ Loader importado com sucesso');
  
  // Tentar carregar funnel com validação
  console.log('\n📦 Carregando funnel com validação...');
  const funnel = await loadFunnel('quiz21StepsComplete', { validate: true, useCache: false });
  
  console.log('✅ Funnel carregado e validado com sucesso!');
  console.log('\n📊 Estrutura do funnel:');
  console.log('  - ID:', funnel.metadata.id);
  console.log('  - Nome:', funnel.metadata.name);
  console.log('  - Versão:', funnel.metadata.version);
  console.log('  - Steps carregados:', Object.keys(funnel.steps).length);
  console.log('  - Tema:', funnel.theme ? '✅' : '❌');
  console.log('  - Settings:', funnel.settings ? '✅' : '❌');
  
  // Cache stats
  const stats = getCacheStats();
  console.log('\n💾 Cache stats:', stats);
  
  console.log('\n✅ TODOS OS TESTES PASSARAM!');
  process.exit(0);
  
} catch (error) {
  console.error('❌ ERRO:', error.message);
  if (error.stack) {
    console.error('\nStack trace:');
    console.error(error.stack);
  }
  process.exit(1);
}
