// Teste rápido do hook useUnifiedProperties
console.log('🧪 Testando o hook useUnifiedProperties...');

// Simulando um bloco para teste
const testBlock = {
  id: 'test-block-1',
  type: 'text',
  properties: {
    content: 'Texto de teste',
    fontSize: 18,
    textColor: '#333333',
  },
};

console.log('📦 Bloco de teste:', testBlock);

// Simular a geração de propriedades padrão
const generateDefaultProperties = (blockType, block) => {
  const baseProperties = [
    {
      key: 'id',
      value: block?.id || '',
      type: 'text',
      label: 'ID do Componente',
      category: 'advanced',
      required: true,
    },
    {
      key: 'visible',
      value: true,
      type: 'boolean',
      label: 'Visível',
      category: 'layout',
    },
  ];

  switch (blockType) {
    case 'text':
    case 'text-inline':
      return [
        ...baseProperties,
        {
          key: 'content',
          value: block?.properties?.content || 'Texto exemplo',
          type: 'textarea',
          label: 'Conteúdo',
          category: 'content',
          required: true,
        },
        {
          key: 'fontSize',
          value: block?.properties?.fontSize || 16,
          type: 'range',
          label: 'Tamanho da Fonte',
          category: 'style',
          min: 12,
          max: 48,
          step: 1,
        },
        {
          key: 'textColor',
          value: block?.properties?.textColor || '#000000',
          type: 'color',
          label: 'Cor do Texto',
          category: 'style',
        },
      ];

    default:
      return baseProperties;
  }
};

const testProperties = generateDefaultProperties(testBlock.type, testBlock);
console.log('🎛️ Propriedades geradas:', testProperties);

// Categorizar propriedades (simular o que o painel faz)
const categorized = {
  content: testProperties.filter(prop => prop.category === 'content'),
  style: testProperties.filter(prop => prop.category === 'style'),
  layout: testProperties.filter(prop => prop.category === 'layout'),
  advanced: testProperties.filter(prop => prop.category === 'advanced'),
};

console.log('📊 Propriedades categorizadas:', categorized);

// Verificar se cada categoria tem propriedades
Object.entries(categorized).forEach(([category, props]) => {
  console.log(`📋 ${category}: ${props.length} propriedades`);
  props.forEach(prop => {
    console.log(`   - ${prop.label} (${prop.type}): ${prop.value}`);
  });
});
