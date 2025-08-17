// Debug específico para verificar selectedBlock
console.log('🔍 DEBUG: Painel de Propriedades');

// Simular dados típicos do editor
const mockData = {
  selectedBlockId: 'step-1-block-text-1',
  currentBlocks: [
    { id: 'step-1-block-text-1', type: 'text', content: { text: 'Test' }, order: 1 },
    { id: 'step-1-block-heading-2', type: 'heading', content: { text: 'Title' }, order: 2 },
  ],
};

console.log('📦 Mock selectedBlockId:', mockData.selectedBlockId);
console.log('📦 Mock currentBlocks:', mockData.currentBlocks);

// Simular a busca que acontece no EditorContext
const foundBlock = mockData.selectedBlockId
  ? mockData.currentBlocks.find(block => block.id === mockData.selectedBlockId)
  : undefined;

console.log('🎯 Bloco encontrado:', foundBlock);

// Verificar se o processo de busca funciona
if (foundBlock) {
  console.log('✅ SUCCESS: Bloco foi encontrado corretamente');
  console.log('   - ID:', foundBlock.id);
  console.log('   - Type:', foundBlock.type);
  console.log('   - Content:', foundBlock.content);
} else {
  console.log('❌ PROBLEM: Bloco não foi encontrado');
  console.log('   Possíveis causas:');
  console.log('   1. selectedBlockId não existe nos currentBlocks');
  console.log('   2. IDs não coincidem exatamente');
  console.log('   3. currentBlocks está vazio');
}

// Testes de correspondência de ID
console.log('\n🔍 Teste de correspondência de IDs:');
mockData.currentBlocks.forEach((block, index) => {
  const matches = block.id === mockData.selectedBlockId;
  console.log(`   Bloco ${index}: ${block.id} ${matches ? '✅ MATCH' : '❌ NO MATCH'}`);
});

export default {};
