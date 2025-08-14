// Teste do Enhanced Block Registry
import { ENHANCED_BLOCK_REGISTRY, getBlockComponent } from '../src/config/enhancedBlockRegistry.ts';

console.log('🔍 TESTE DO ENHANCED BLOCK REGISTRY');
console.log('='.repeat(50));

// Testar componentes disponíveis
console.log('\n📋 Componentes disponíveis:');
Object.keys(ENHANCED_BLOCK_REGISTRY).forEach(type => {
  console.log(`  ✅ ${type}`);
});

console.log('\n🧪 Testando getBlockComponent:');

// Testar tipos básicos
const testTypes = ['text', 'heading', 'button', 'image', 'form-input', 'decorative-bar'];

testTypes.forEach(type => {
  try {
    const component = getBlockComponent(type);
    console.log(`  ✅ ${type}: ${component ? 'ENCONTRADO' : 'NÃO ENCONTRADO'}`);
  } catch (e) {
    console.log(`  ❌ ${type}: ERRO - ${e.message}`);
  }
});

console.log('\n🧪 Testando aliases:');
const testAliases = ['text-inline', 'heading-inline', 'cabeçalho-introdução-do-questionário'];

testAliases.forEach(type => {
  try {
    const component = getBlockComponent(type);
    console.log(`  ✅ ${type}: ${component ? 'MAPEADO' : 'NÃO MAPEADO'}`);
  } catch (e) {
    console.log(`  ❌ ${type}: ERRO - ${e.message}`);
  }
});

console.log('\n🎯 TESTE CONCLUÍDO');
