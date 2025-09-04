/**
 * 🧪 Debug: Teste de Descoberta de Propriedades Options-Grid
 */
import { getPropertiesForComponentType } from '../src/components/editor/properties/core/PropertyDiscovery';

// Simular um bloco options-grid
const mockOptionsGridBlock = {
  id: 'test-options-grid',
  type: 'options-grid',
  properties: {
    title: 'Teste de questão',
    options: [
      { text: 'Opção 1', score: 1, category: 'A' },
      { text: 'Opção 2', score: 2, category: 'B' }
    ]
  },
  content: {}
};

console.log('🧪 Testando descoberta de propriedades para options-grid...');
console.log('📦 Mock block:', mockOptionsGridBlock);

const discoveredProperties = getPropertiesForComponentType('options-grid', mockOptionsGridBlock);

console.log('🔍 Propriedades descobertas:', discoveredProperties.length);
console.log('📊 Lista de propriedades:');

discoveredProperties.forEach((prop, index) => {
  console.log(`${index + 1}. ${prop.key} (${prop.type}) - ${prop.label}`);
  if (prop.key === 'options') {
    console.log('   🎯 FOUND OPTIONS PROPERTY!', prop);
  }
});

// Verificar especificamente a propriedade 'options'
const optionsProperty = discoveredProperties.find(p => p.key === 'options');
if (optionsProperty) {
  console.log('✅ Propriedade "options" encontrada:');
  console.log('   - Tipo:', optionsProperty.type);
  console.log('   - Categoria:', optionsProperty.category);
  console.log('   - Valor padrão:', optionsProperty.defaultValue);
} else {
  console.log('❌ Propriedade "options" NÃO encontrada!');
}

export {};
