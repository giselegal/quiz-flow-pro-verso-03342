import { BlockDefinition, PropertySchema } from '../types/editor';

// Helper function to create property schema
const createPropertySchema = (
  type: PropertySchema['type'],
  options: Partial<PropertySchema> = {}
): PropertySchema => ({
  type,
  ...options
});

const blockDefinitions: { [key: string]: BlockDefinition } = {
  header: {
    type: 'header',
    name: 'Cabeçalho',
    description: 'Título e subtítulo',
    category: 'content',
    properties: {
      title: createPropertySchema('string', {
        label: 'Título',
        default: 'Seu Título Aqui'
      }),
      subtitle: createPropertySchema('string', {
        label: 'Subtítulo',
        default: 'Subtítulo opcional'
      }),
      alignment: createPropertySchema('select', {
        label: 'Alinhamento',
        default: 'center',
        options: ['left', 'center', 'right']
      })
    },
    label: 'Cabeçalho',
    defaultProps: {
      title: 'Seu Título Aqui',
      subtitle: 'Subtítulo opcional',
      alignment: 'center'
    }
  },
  
  text: {
    type: 'text',
    name: 'Texto',
    description: 'Parágrafo de texto',
    category: 'content',
    properties: {
      text: createPropertySchema('textarea', {
        label: 'Texto',
        default: 'Digite seu texto aqui...'
      }),
      fontSize: createPropertySchema('select', {
        label: 'Tamanho da Fonte',
        default: 'base',
        options: ['sm', 'base', 'lg', 'xl', '2xl']
      }),
      alignment: createPropertySchema('select', {
        label: 'Alinhamento',
        default: 'left',
        options: ['left', 'center', 'right', 'justify']
      })
    },
    label: 'Texto',
    defaultProps: {
      text: 'Digite seu texto aqui...',
      fontSize: 'base',
      alignment: 'left'
    }
  },

  image: {
    type: 'image',
    name: 'Imagem',
    description: 'Imagem com legenda',
    category: 'content',
    properties: {
      url: createPropertySchema('string', {
        label: 'URL da Imagem',
        default: ''
      }),
      alt: createPropertySchema('string', {
        label: 'Texto Alternativo',
        default: ''
      }),
      width: createPropertySchema('string', {
        label: 'Largura',
        default: '100%'
      }),
      height: createPropertySchema('string', {
        label: 'Altura',
        default: 'auto'
      }),
      borderRadius: createPropertySchema('string', {
        label: 'Raio da Borda',
        default: '0px'
      }),
      objectFit: createPropertySchema('select', {
        label: 'Ajuste da Imagem',
        default: 'cover',
        options: ['cover', 'contain', 'fill', 'none', 'scale-down']
      })
    },
    label: 'Imagem',
    defaultProps: {
      url: '',
      alt: '',
      width: '100%',
      height: 'auto',
      borderRadius: '0px',
      objectFit: 'cover'
    }
  },

  button: {
    type: 'button',
    name: 'Botão',
    description: 'Botão de ação',
    category: 'content',
    properties: {
      text: createPropertySchema('string', {
        label: 'Texto do Botão',
        default: 'Clique Aqui'
      }),
      url: createPropertySchema('string', {
        label: 'URL de Destino',
        default: ''
      }),
      style: createPropertySchema('object', {
        label: 'Estilo',
        default: {
          backgroundColor: '#B89B7A',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '4px',
          fontWeight: 'bold',
          textAlign: 'center'
        }
      })
    },
    label: 'Botão',
    defaultProps: {
      text: 'Clique Aqui',
      url: '',
      style: {
        backgroundColor: '#B89B7A',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '4px',
        fontWeight: 'bold',
        textAlign: 'center'
      }
    }
  },

  spacer: {
    type: 'spacer',
    name: 'Espaçador',
    description: 'Espaço em branco',
    category: 'layout',
    properties: {
      height: createPropertySchema('number', {
        label: 'Altura (px)',
        default: 40
      })
    },
    label: 'Espaçador',
    defaultProps: {
      height: 40
    }
  },

  'style-result': {
    type: 'style-result',
    name: 'Estilo Principal',
    description: 'Resultado do estilo principal',
    category: 'result',
    properties: {
      category: createPropertySchema('string', {
        label: 'Categoria',
        default: ''
      }),
      score: createPropertySchema('number', {
        label: 'Pontuação',
        default: 0
      }),
      percentage: createPropertySchema('number', {
        label: 'Porcentagem',
        default: 0
      }),
      style: createPropertySchema('string', {
        label: 'Estilo',
        default: ''
      }),
      points: createPropertySchema('number', {
        label: 'Pontos',
        default: 0
      }),
      rank: createPropertySchema('number', {
        label: 'Ranking',
        default: 1
      })
    },
    label: 'Estilo Principal',
    defaultProps: {
      category: '',
      score: 0,
      percentage: 0,
      style: '',
      points: 0,
      rank: 1
    }
  },

  'secondary-styles': {
    type: 'secondary-styles',
    name: 'Estilos Secundários',
    description: 'Outros estilos compatíveis',
    category: 'result',
    properties: {
      styles: createPropertySchema('array', {
        label: 'Estilos Secundários',
        default: []
      })
    },
    label: 'Estilos Secundários',
    defaultProps: {
      styles: []
    }
  },

  pricing: {
    type: 'pricing',
    name: 'Preço',
    description: 'Seção de preços',
    category: 'sales',
    properties: {
      salePrice: createPropertySchema('string', {
        label: 'Preço Promocional',
        default: ''
      }),
      regularPrice: createPropertySchema('string', {
        label: 'Preço Regular',
        default: ''
      }),
      style: createPropertySchema('object', {
        label: 'Estilo',
        default: {
          color: '#000',
          fontSize: '16px',
          fontWeight: 'bold'
        }
      })
    },
    label: 'Preço',
    defaultProps: {
      salePrice: '',
      regularPrice: '',
      style: {
        color: '#000',
        fontSize: '16px',
        fontWeight: 'bold'
      }
    }
  },

  guarantee: {
    type: 'guarantee',
    name: 'Garantia',
    description: 'Garantia do produto',
    category: 'sales',
    properties: {
      text: createPropertySchema('string', {
        label: 'Texto da Garantia',
        default: 'Garantia de satisfação de 30 dias'
      }),
      style: createPropertySchema('object', {
        label: 'Estilo',
        default: {
          color: '#555',
          fontSize: '14px'
        }
      })
    },
    label: 'Garantia',
    defaultProps: {
      text: 'Garantia de satisfação de 30 dias',
      style: {
        color: '#555',
        fontSize: '14px'
      }
    }
  },

  testimonials: {
    type: 'testimonials',
    name: 'Depoimentos',
    description: 'Depoimentos de clientes',
    category: 'sales',
    properties: {
      testimonials: createPropertySchema('array', {
        label: 'Depoimentos',
        default: []
      }),
      style: createPropertySchema('object', {
        label: 'Estilo',
        default: {
          color: '#333',
          fontSize: '14px'
        }
      })
    },
    label: 'Depoimentos',
    defaultProps: {
      testimonials: [],
      style: {
        color: '#333',
        fontSize: '14px'
      }
    }
  },

  cta: {
    type: 'cta',
    name: 'Chamada para Ação',
    description: 'Botão principal de conversão',
    category: 'sales',
    properties: {
      text: createPropertySchema('string', {
        label: 'Texto do Botão',
        default: 'Comprar Agora'
      }),
      url: createPropertySchema('string', {
        label: 'URL de Destino',
        default: ''
      }),
      style: createPropertySchema('object', {
        label: 'Estilo',
        default: {
          backgroundColor: '#B89B7A',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '6px',
          fontWeight: 'bold',
          textAlign: 'center'
        }
      })
    },
    label: 'Chamada para Ação',
    defaultProps: {
      text: 'Comprar Agora',
      url: '',
      style: {
        backgroundColor: '#B89B7A',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '6px',
        fontWeight: 'bold',
        textAlign: 'center'
      }
    }
  },

  video: {
    type: 'video',
    name: 'Vídeo',
    description: 'Player de vídeo',
    category: 'advanced',
    properties: {
      url: createPropertySchema('string', {
        label: 'URL do Vídeo',
        default: ''
      }),
      autoplay: createPropertySchema('boolean', {
        label: 'Autoplay',
        default: false
      }),
      controls: createPropertySchema('boolean', {
        label: 'Mostrar Controles',
        default: true
      }),
      loop: createPropertySchema('boolean', {
        label: 'Loop',
        default: false
      })
    },
    label: 'Vídeo',
    defaultProps: {
      url: '',
      autoplay: false,
      controls: true,
      loop: false
    }
  },

  'two-column': {
    type: 'two-column',
    name: 'Duas Colunas',
    description: 'Layout de duas colunas',
    category: 'advanced',
    properties: {
      leftContent: createPropertySchema('object', {
        label: 'Conteúdo Esquerdo',
        default: {}
      }),
      rightContent: createPropertySchema('object', {
        label: 'Conteúdo Direito',
        default: {}
      }),
      gap: createPropertySchema('string', {
        label: 'Espaçamento',
        default: '20px'
      })
    },
    label: 'Duas Colunas',
    defaultProps: {
      leftContent: {},
      rightContent: {},
      gap: '20px'
    }
  },

  carousel: {
    type: 'carousel',
    name: 'Carrossel',
    description: 'Carrossel de conteúdo',
    category: 'advanced',
    properties: {
      items: createPropertySchema('array', {
        label: 'Itens',
        default: []
      }),
      autoplay: createPropertySchema('boolean', {
        label: 'Autoplay',
        default: true
      }),
      interval: createPropertySchema('number', {
        label: 'Intervalo (ms)',
        default: 3000
      })
    },
    label: 'Carrossel',
    defaultProps: {
      items: [],
      autoplay: true,
      interval: 3000
    }
  },

  'custom-code': {
    type: 'custom-code',
    name: 'Código Customizado',
    description: 'HTML/CSS personalizado',
    category: 'advanced',
    properties: {
      html: createPropertySchema('text', {
        label: 'HTML',
        default: ''
      }),
      css: createPropertySchema('text', {
        label: 'CSS',
        default: ''
      })
    },
    label: 'Código Customizado',
    defaultProps: {
      html: '',
      css: ''
    }
  }
};

export { blockDefinitions };
export default blockDefinitions;
