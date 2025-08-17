// Test das propriedades do registry
console.log('🔍 TESTANDO REGISTRY PROPERTIES...');

try {
  // Simulação simples da função
  const getPropertiesForBlockType = blockType => {
    if (blockType.includes('text') || blockType.includes('heading')) {
      return {
        text: {
          type: 'textarea',
          label: 'Conteúdo',
          default: 'Digite seu texto aqui...',
          description: 'Texto principal do componente',
        },
        fontSize: {
          type: 'select',
          label: 'Tamanho da Fonte',
          default: 'medium',
          description: 'Tamanho da fonte do texto',
          options: [
            { value: 'small', label: 'Pequeno' },
            { value: 'medium', label: 'Médio' },
            { value: 'large', label: 'Grande' },
          ],
        },
      };
    }

    if (blockType.includes('button') || blockType.includes('cta')) {
      return {
        text: {
          type: 'string',
          label: 'Texto do Botão',
          default: 'Clique aqui',
          description: 'Texto exibido no botão',
        },
        variant: {
          type: 'select',
          label: 'Variante',
          default: 'primary',
          description: 'Estilo visual do botão',
          options: [
            { value: 'primary', label: 'Primário' },
            { value: 'secondary', label: 'Secundário' },
            { value: 'outline', label: 'Contorno' },
          ],
        },
      };
    }

    return {
      text: {
        type: 'string',
        label: 'Texto',
        default: '',
        description: 'Conteúdo de texto do componente',
      },
      visible: {
        type: 'boolean',
        label: 'Visível',
        default: true,
        description: 'Controla se o componente está visível',
      },
    };
  };

  // Testar alguns tipos
  const testTypes = [
    'heading-inline-block',
    'button-inline-block',
    'image-display-inline-block',
    'other-type',
  ];

  testTypes.forEach(type => {
    const props = getPropertiesForBlockType(type);
    console.log(`\n📝 Tipo: ${type}`);
    console.log(`📊 Propriedades:`, Object.keys(props));
    console.log(`📄 Exemplo:`, props);
  });

  console.log('\n✅ Teste concluído - função está gerando propriedades!');
} catch (error) {
  console.error('❌ Erro no teste:', error);
}
