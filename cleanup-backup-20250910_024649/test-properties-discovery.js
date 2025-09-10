// Teste rápido para verificar descoberta de propriedades
import { getPropertiesForComponentType } from './src/components/editor/properties/core/PropertyDiscovery.ts';

// Simular um bloco options-grid
const mockBlock = {
    type: 'options-grid',
    properties: {
        title: 'Teste de questão',
        columns: 2,
        multipleSelection: false
    }
};

// Descobrir todas as propriedades
const discoveredProperties = getPropertiesForComponentType('options-grid', mockBlock);

console.log('🔍 Propriedades descobertas para options-grid:');
console.log(`📊 Total: ${discoveredProperties.length} propriedades`);
console.log('\n📋 Lista completa:');

discoveredProperties.forEach((prop, index) => {
    console.log(`${index + 1}. ${prop.key} (${prop.type}) - ${prop.label} [${prop.category}]`);
});

console.log('\n🎯 Verificação por categoria:');
const byCategory = discoveredProperties.reduce((acc, prop) => {
    acc[prop.category] = (acc[prop.category] || 0) + 1;
    return acc;
}, {});

Object.entries(byCategory).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} propriedades`);
});

// Verificar se propriedades específicas estão presentes
const expectedProps = [
    'title', 'subtitle', 'description', 'options', 'columns', 'multipleSelection',
    'backgroundColor', 'textColor', 'borderRadius', 'spacing', 'imageHeight',
    'showImages', 'allowCustomOptions', 'required', 'validationMessage'
];

console.log('\n✅ Propriedades esperadas encontradas:');
expectedProps.forEach(prop => {
    const found = discoveredProperties.find(p => p.key === prop);
    console.log(`  ${prop}: ${found ? '✅' : '❌'} ${found ? `(${found.type})` : ''}`);
});
