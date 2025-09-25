// Converted from funnel-21-steps.json to avoid Vite JSON parse issues during build
// Keep JSON file for reference/export tooling, but use this TS module in app code.
export default {
  id: 'default-quiz-funnel-21-steps',
  name: 'Funil Quiz 21 Etapas',
  version: 1,
  metadata: {
    collectUserName: true,
    seo: {
      title: 'Quiz de Estilo Pessoal',
      description: 'Descubra seu estilo',
    },
    pixel: {},
    utm: {},
    webhooks: {},
  },
  steps: {
    'step-1': [
      {
        type: 'quiz-intro-header',
        properties: {
          title: 'Bem-vinda ao Quiz de Estilo!',
          subtitle: 'Descubra seu estilo pessoal em 21 perguntas'
        },
      },
      {
        type: 'form-input',
        properties: {
          placeholder: 'Digite seu nome',
          required: true
        },
      },
      {
        type: 'button',
        properties: {
          text: 'Começar Quiz',
          variant: 'primary'
        },
      },
    ],
    'step-2': [
      {
        type: 'quiz-question',
        properties: {
          question: 'Qual dessas peças você mais usa no dia a dia?',
        },
      },
      {
        type: 'quiz-options',
        properties: {
          options: [
            { id: 'jeans', text: 'Jeans e camiseta', value: 'casual' },
            { id: 'vestido', text: 'Vestidos', value: 'feminino' },
            { id: 'blazer', text: 'Blazer e calça social', value: 'executivo' },
            { id: 'boho', text: 'Peças fluidas e estampadas', value: 'boho' }
          ]
        },
      },
    ],
    'step-3': [
      {
        type: 'quiz-question',
        properties: {
          question: 'Que cores você prefere no seu guarda-roupa?',
        },
      },
      {
        type: 'quiz-options',
        properties: {
          options: [
            { id: 'neutras', text: 'Tons neutros (bege, cinza, branco)', value: 'neutro' },
            { id: 'vibrantes', text: 'Cores vibrantes', value: 'vibrante' },
            { id: 'escuras', text: 'Preto e tons escuros', value: 'escuro' },
            { id: 'pasteis', text: 'Tons pastéis', value: 'pastel' }
          ]
        },
      },
    ],
    'step-4': [
      {
        type: 'quiz-question',
        properties: {
          question: 'Como você gosta de se sentir nas suas roupas?',
        },
      },
      {
        type: 'quiz-options',
        properties: {
          options: [
            { id: 'confortavel', text: 'Confortável e prática', value: 'comfort' },
            { id: 'elegante', text: 'Elegante e sofisticada', value: 'elegante' },
            { id: 'moderna', text: 'Moderna e na tendência', value: 'trendy' },
            { id: 'unica', text: 'Única e diferente', value: 'unique' }
          ]
        },
      },
    ],
    'step-5': [
      {
        type: 'quiz-question',
        properties: {
          question: 'Qual é seu acessório favorito?',
        },
      },
      {
        type: 'quiz-options',
        properties: {
          options: [
            { id: 'joias', text: 'Joias delicadas', value: 'delicate' },
            { id: 'bolsa', text: 'Bolsa statement', value: 'statement' },
            { id: 'sapato', text: 'Sapatos especiais', value: 'shoes' },
            { id: 'oculos', text: 'Óculos de sol', value: 'glasses' }
          ]
        },
      },
    ],
    'step-6': [
      {
        type: 'quiz-question',
        properties: {
          question: 'Que tipo de estampa você mais gosta?',
        },
      },
      {
        type: 'quiz-options',
        properties: {
          options: [
            { id: 'lisa', text: 'Prefiro peças lisas', value: 'solid' },
            { id: 'floral', text: 'Estampas florais', value: 'floral' },
            { id: 'geometrica', text: 'Estampas geométricas', value: 'geometric' },
            { id: 'animal', text: 'Animal print', value: 'animal' }
          ]
        },
      },
    ],
    'step-7': [
      {
        type: 'quiz-question',
        properties: {
          question: 'Como você prefere suas roupas?',
        },
      },
      {
        type: 'quiz-options',
        properties: {
          options: [
            { id: 'justa', text: 'Mais justas ao corpo', value: 'fitted' },
            { id: 'solta', text: 'Mais soltas e fluidas', value: 'loose' },
            { id: 'equilibrio', text: 'Equilibrio entre justo e solto', value: 'balanced' },
            { id: 'varia', text: 'Varia conforme a peça', value: 'mixed' }
          ]
        },
      },
    ],
    'step-8': [
      {
        type: 'quiz-question',
        properties: {
          question: 'Qual seu tipo de calçado preferido?',
        },
      },
      {
        type: 'quiz-options',
        properties: {
          options: [
            { id: 'tenis', text: 'Tênis e sapatos baixos', value: 'flats' },
            { id: 'salto', text: 'Salto alto', value: 'heels' },
            { id: 'medio', text: 'Salto médio', value: 'mid_heel' },
            { id: 'bota', text: 'Botas', value: 'boots' }
          ]
        },
      },
    ],
    'step-9': [
      {
        type: 'quiz-question',
        properties: {
          question: 'Em que ocasião você mais usa suas roupas favoritas?',
        },
      },
      {
        type: 'quiz-options',
        properties: {
          options: [
            { id: 'trabalho', text: 'No trabalho', value: 'work' },
            { id: 'social', text: 'Em eventos sociais', value: 'social' },
            { id: 'casual', text: 'No dia a dia', value: 'daily' },
            { id: 'especial', text: 'Em ocasiões especiais', value: 'special' }
          ]
        },
      },
    ],
    'step-10': [
      {
        type: 'quiz-question',
        properties: {
          question: 'Como você define seu estilo atual?',
        },
      },
      {
        type: 'quiz-options',
        properties: {
          options: [
            { id: 'classico', text: 'Clássico e atemporal', value: 'classic' },
            { id: 'moderno', text: 'Moderno e atual', value: 'modern' },
            { id: 'romantico', text: 'Romântico e feminino', value: 'romantic' },
            { id: 'alternativo', text: 'Alternativo e criativo', value: 'alternative' }
          ]
        },
      },
    ],
    'step-11': [
      {
        type: 'quiz-question',
        properties: {
          question: 'Qual peça você considera essencial no guarda-roupa?',
        },
      },
      {
        type: 'quiz-options',
        properties: {
          options: [
            { id: 'jeans', text: 'Uma calça jeans perfeita', value: 'jeans' },
            { id: 'vestido_preto', text: 'Vestido preto básico', value: 'lbd' },
            { id: 'blazer', text: 'Blazer bem cortado', value: 'blazer' },
            { id: 'camisa_branca', text: 'Camisa branca', value: 'white_shirt' }
          ]
        },
      },
    ],
    'step-12': [
      {
        type: 'quiz-transition',
        properties: {
          title: 'Analisando suas preferências...',
          subtitle: 'Estamos descobrindo seu estilo único!'
        },
      },
      {
        type: 'loading-animation',
        properties: {
          duration: 3000
        },
      },
    ],
    'step-13': [
      {
        type: 'quiz-question',
        properties: {
          question: 'Como você gosta de comprar roupas?',
        },
      },
      {
        type: 'quiz-options',
        properties: {
          options: [
            { id: 'planejado', text: 'Planejo e pesquiso antes', value: 'planned' },
            { id: 'impulso', text: 'Compro por impulso', value: 'impulse' },
            { id: 'necessidade', text: 'Só quando preciso', value: 'need' },
            { id: 'tendencia', text: 'Sigo as tendências', value: 'trend' }
          ]
        },
      },
    ],
    'step-14': [
      {
        type: 'quiz-question',
        properties: {
          question: 'Qual sua maior dificuldade com moda?',
        },
      },
      {
        type: 'quiz-options',
        properties: {
          options: [
            { id: 'combinar', text: 'Combinar as peças', value: 'matching' },
            { id: 'tendencias', text: 'Acompanhar tendências', value: 'trends' },
            { id: 'corpo', text: 'Encontrar o que fica bem no meu corpo', value: 'fit' },
            { id: 'orcamento', text: 'Encontrar peças no meu orçamento', value: 'budget' }
          ]
        },
      },
    ],
    'step-15': [
      {
        type: 'quiz-question',
        properties: {
          question: 'O que mais influencia suas escolhas de look?',
        },
      },
      {
        type: 'quiz-options',
        properties: {
          options: [
            { id: 'humor', text: 'Meu humor do dia', value: 'mood' },
            { id: 'ocasiao', text: 'A ocasião', value: 'occasion' },
            { id: 'clima', text: 'O clima', value: 'weather' },
            { id: 'conforto', text: 'O conforto', value: 'comfort' }
          ]
        },
      },
    ],
    'step-16': [
      {
        type: 'quiz-question',
        properties: {
          question: 'Como você se sente quando está bem vestida?',
        },
      },
      {
        type: 'quiz-options',
        properties: {
          options: [
            { id: 'confiante', text: 'Mais confiante', value: 'confident' },
            { id: 'feliz', text: 'Mais feliz', value: 'happy' },
            { id: 'poderosa', text: 'Mais poderosa', value: 'powerful' },
            { id: 'eu_mesma', text: 'Mais eu mesma', value: 'authentic' }
          ]
        },
      },
    ],
    'step-17': [
      {
        type: 'quiz-question',
        properties: {
          question: 'Qual sua inspiração de estilo?',
        },
      },
      {
        type: 'quiz-options',
        properties: {
          options: [
            { id: 'celebridades', text: 'Celebridades e influencers', value: 'celeb' },
            { id: 'passarela', text: 'Desfiles e revistas', value: 'fashion' },
            { id: 'rua', text: 'Street style', value: 'street' },
            { id: 'proprio', text: 'Meu próprio gosto', value: 'personal' }
          ]
        },
      },
    ],
    'step-18': [
      {
        type: 'quiz-question',
        properties: {
          question: 'Em que você mais investe no guarda-roupa?',
        },
      },
      {
        type: 'quiz-options',
        properties: {
          options: [
            { id: 'basicos', text: 'Peças básicas de qualidade', value: 'basics' },
            { id: 'statement', text: 'Peças statement', value: 'statement' },
            { id: 'acessorios', text: 'Acessórios', value: 'accessories' },
            { id: 'sapatos', text: 'Sapatos', value: 'shoes' }
          ]
        },
      },
    ],
    'step-19': [
      {
        type: 'quiz-question',
        properties: {
          question: 'Como você quer que as pessoas vejam seu estilo?',
        },
      },
      {
        type: 'quiz-options',
        properties: {
          options: [
            { id: 'elegante', text: 'Elegante e sofisticada', value: 'sophisticated' },
            { id: 'criativa', text: 'Criativa e única', value: 'creative' },
            { id: 'moderna', text: 'Moderna e atual', value: 'trendy' },
            { id: 'autentica', text: 'Autêntica e verdadeira', value: 'authentic' }
          ]
        },
      },
    ],
    'step-20': [
      {
        type: 'step20-result-header',
        properties: {
          title: 'Descobrimos seu estilo!',
          subtitle: 'Veja seu perfil personalizado'
        },
      },
      {
        type: 'step20-style-reveal',
        properties: {
          showAnimation: true
        },
      },
      {
        type: 'step20-personalized-offer',
        properties: {
          ctaText: 'Quero meu guia personalizado'
        },
      },
    ],
    'step-21': [
      {
        type: 'sales-hero',
        properties: {
          title: 'Transforme Seu Estilo Hoje!',
          subtitle: 'Guia personalizado baseado no seu perfil'
        },
      },
      {
        type: 'urgency-timer-inline',
        properties: {
          deadline: '2024-12-31T23:59:59',
          urgencyText: 'Oferta especial termina em:'
        },
      },
      {
        type: 'button',
        properties: {
          text: 'Garantir Meu Guia Agora',
          variant: 'primary',
          size: 'large'
        },
      },
    ],
  },
  variables: [
    {
      key: 'romantico',
      label: 'Romântico',
      description: '',
      scoringWeight: 1,
    },
    {
      key: 'classico',
      label: 'Clássico',
      description: '',
      scoringWeight: 1,
    },
  ],
} as const;
