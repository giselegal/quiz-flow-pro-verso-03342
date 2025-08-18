// @ts-nocheck - Example file with legacy block definitions, not used in production
import { Block } from '@/types/editor';

/**
 * 🎯 EXEMPLO COMPLETO DE QUIZ INTERATIVO
 *
 * Quiz de estilo pessoal com 21 etapas:
 * - Introdução
 * - 18 questões de estilo
 * - Resultado e oferta
 */
export const QUIZ_EXEMPLO_COMPLETO: Block[] = [
  // ===== ETAPA 1: INTRODUÇÃO =====
  {
    id: 'intro-header',
    type: 'headline',
    content: {
      text: '🎯 Descubra Seu Estilo Pessoal',
      level: 1,
      className: 'text-center text-4xl font-bold text-gray-800 mb-4',
    },
  },
  {
    id: 'intro-text',
    type: 'text',
    content: {
      text: 'Em apenas 3 minutos, descubra qual é o seu estilo pessoal dominante e receba recomendações personalizadas para destacar sua personalidade única.',
      className: 'text-center text-lg text-gray-600 mb-6 max-w-2xl mx-auto',
    },
  },
  {
    id: 'intro-image',
    type: 'image',
    content: {
      src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
      alt: 'Diversidade de estilos pessoais',
      className: 'w-full max-w-2xl mx-auto rounded-lg shadow-lg mb-8',
    },
  },
  {
    id: 'name-input',
    type: 'input-field',
    content: {
      label: 'Como você gostaria de ser chamado?',
      placeholder: 'Digite seu primeiro nome',
      type: 'text',
      required: true,
      className: 'max-w-md mx-auto',
    },
  },

  // ===== ETAPA 2: PRIMEIRA QUESTÃO =====
  {
    id: 'q1-header',
    type: 'headline',
    content: {
      text: 'Em uma festa, você prefere:',
      level: 2,
      className: 'text-center text-2xl font-semibold text-gray-800 mb-6',
    },
  },
  {
    id: 'q1-question',
    type: 'quiz-question-inline',
    content: {
      question: 'Qual situação combina mais com você?',
      options: [
        {
          id: 'q1-opt1',
          text: '🎭 Ser o centro das atenções, contando histórias engraçadas',
          value: 'extrovertido',
          category: 'extrovertido',
          points: 3,
        },
        {
          id: 'q1-opt2',
          text: '👥 Conversar em grupos pequenos sobre assuntos interessantes',
          value: 'social',
          category: 'social',
          points: 2,
        },
        {
          id: 'q1-opt3',
          text: '🧘 Ficar em um cantinho observando e ouvindo música',
          value: 'introvertido',
          category: 'introvertido',
          points: 3,
        },
        {
          id: 'q1-opt4',
          text: '🏠 Prefiro festas mais íntimas em casa com amigos próximos',
          value: 'intimista',
          category: 'intimista',
          points: 2,
        },
      ],
    },
  },

  // ===== ETAPA 3: SEGUNDA QUESTÃO =====
  {
    id: 'q2-header',
    type: 'headline',
    content: {
      text: 'Seu guarda-roupa ideal seria:',
      level: 2,
      className: 'text-center text-2xl font-semibold text-gray-800 mb-6',
    },
  },
  {
    id: 'q2-question',
    type: 'quiz-question-inline',
    content: {
      question: 'Como você se veste no dia a dia?',
      options: [
        {
          id: 'q2-opt1',
          text: '✨ Peças marcantes, cores vibrantes e acessórios chamativos',
          value: 'ousado',
          category: 'ousado',
          points: 3,
        },
        {
          id: 'q2-opt2',
          text: '👔 Clássico e elegante, com peças atemporais',
          value: 'classico',
          category: 'classico',
          points: 3,
        },
        {
          id: 'q2-opt3',
          text: '🌱 Confortável e funcional, priorizo praticidade',
          value: 'casual',
          category: 'casual',
          points: 2,
        },
        {
          id: 'q2-opt4',
          text: '🎨 Peças únicas e criativas que expressam minha personalidade',
          value: 'criativo',
          category: 'criativo',
          points: 3,
        },
      ],
    },
  },

  // ===== ETAPA 4: TERCEIRA QUESTÃO =====
  {
    id: 'q3-header',
    type: 'headline',
    content: {
      text: 'Nas redes sociais, você:',
      level: 2,
      className: 'text-center text-2xl font-semibold text-gray-800 mb-6',
    },
  },
  {
    id: 'q3-question',
    type: 'quiz-question-inline',
    content: {
      question: 'Como você se comporta online?',
      options: [
        {
          id: 'q3-opt1',
          text: '📸 Posta frequentemente sobre sua vida e opiniões',
          value: 'digital_extrovertido',
          category: 'extrovertido',
          points: 2,
        },
        {
          id: 'q3-opt2',
          text: '👀 Prefere observar e curtir o conteúdo dos outros',
          value: 'digital_observador',
          category: 'introvertido',
          points: 2,
        },
        {
          id: 'q3-opt3',
          text: '💬 Interage bastante nos comentários e stories',
          value: 'digital_social',
          category: 'social',
          points: 3,
        },
        {
          id: 'q3-opt4',
          text: '🎯 Usa estrategicamente para projetos pessoais/profissionais',
          value: 'digital_estrategico',
          category: 'profissional',
          points: 3,
        },
      ],
    },
  },

  // ===== ETAPA 5: QUARTA QUESTÃO =====
  {
    id: 'q4-header',
    type: 'headline',
    content: {
      text: 'Seu ambiente de trabalho ideal:',
      level: 2,
      className: 'text-center text-2xl font-semibold text-gray-800 mb-6',
    },
  },
  {
    id: 'q4-question',
    type: 'quiz-question-inline',
    content: {
      question: 'Onde você rende melhor?',
      options: [
        {
          id: 'q4-opt1',
          text: '🏢 Escritório movimentado com muita interação',
          value: 'colaborativo',
          category: 'extrovertido',
          points: 2,
        },
        {
          id: 'q4-opt2',
          text: '🏠 Home office com ambiente personalizado',
          value: 'autonomo',
          category: 'introvertido',
          points: 3,
        },
        {
          id: 'q4-opt3',
          text: '☕ Espaços de coworking ou cafeterias',
          value: 'flexivel',
          category: 'social',
          points: 2,
        },
        {
          id: 'q4-opt4',
          text: '🌳 Ao ar livre ou ambientes não convencionais',
          value: 'alternativo',
          category: 'criativo',
          points: 3,
        },
      ],
    },
  },

  // ===== ETAPA 6: QUINTA QUESTÃO =====
  {
    id: 'q5-header',
    type: 'headline',
    content: {
      text: 'Para relaxar, você prefere:',
      level: 2,
      className: 'text-center text-2xl font-semibold text-gray-800 mb-6',
    },
  },
  {
    id: 'q5-question',
    type: 'quiz-question-inline',
    content: {
      question: 'Como você gosta de descansar?',
      options: [
        {
          id: 'q5-opt1',
          text: '🎉 Sair com amigos, bares, shows, eventos',
          value: 'social_ativo',
          category: 'extrovertido',
          points: 3,
        },
        {
          id: 'q5-opt2',
          text: '📚 Ler, assistir filmes, meditar em casa',
          value: 'contemplativo',
          category: 'introvertido',
          points: 3,
        },
        {
          id: 'q5-opt3',
          text: '🎨 Atividades criativas como pintar, escrever, tocar',
          value: 'criativo_relaxamento',
          category: 'criativo',
          points: 3,
        },
        {
          id: 'q5-opt4',
          text: '🏃 Esportes, academia, atividades físicas',
          value: 'ativo',
          category: 'ativo',
          points: 2,
        },
      ],
    },
  },

  // ===== ETAPA 7: SEXTA QUESTÃO =====
  {
    id: 'q6-header',
    type: 'headline',
    content: {
      text: 'Seu tipo de filme favorito:',
      level: 2,
      className: 'text-center text-2xl font-semibold text-gray-800 mb-6',
    },
  },
  {
    id: 'q6-question',
    type: 'quiz-question-inline',
    content: {
      question: 'Que gênero combina com você?',
      options: [
        {
          id: 'q6-opt1',
          text: '🎬 Dramas profundos e filmes de arte',
          value: 'intelectual',
          category: 'contemplativo',
          points: 3,
        },
        {
          id: 'q6-opt2',
          text: '😂 Comédias e filmes leves',
          value: 'descontraido',
          category: 'extrovertido',
          points: 2,
        },
        {
          id: 'q6-opt3',
          text: '🚀 Ficção científica e documentários',
          value: 'curioso',
          category: 'intelectual',
          points: 3,
        },
        {
          id: 'q6-opt4',
          text: '💕 Romances e filmes familiares',
          value: 'emotivo',
          category: 'sensivel',
          points: 2,
        },
      ],
    },
  },

  // ===== ETAPA 8: SÉTIMA QUESTÃO =====
  {
    id: 'q7-header',
    type: 'headline',
    content: {
      text: 'Ao tomar decisões importantes:',
      level: 2,
      className: 'text-center text-2xl font-semibold text-gray-800 mb-6',
    },
  },
  {
    id: 'q7-question',
    type: 'quiz-question-inline',
    content: {
      question: 'Como você decide?',
      options: [
        {
          id: 'q7-opt1',
          text: '💭 Analiso todos os prós e contras detalhadamente',
          value: 'analitico',
          category: 'contemplativo',
          points: 3,
        },
        {
          id: 'q7-opt2',
          text: '❤️ Sigo minha intuição e sentimentos',
          value: 'intuitivo',
          category: 'sensivel',
          points: 3,
        },
        {
          id: 'q7-opt3',
          text: '👥 Consulto amigos e família antes de decidir',
          value: 'colaborativo_decisao',
          category: 'social',
          points: 2,
        },
        {
          id: 'q7-opt4',
          text: '⚡ Decido rapidamente e parto para ação',
          value: 'impulsivo',
          category: 'ativo',
          points: 2,
        },
      ],
    },
  },

  // ===== ETAPA 9: OITAVA QUESTÃO =====
  {
    id: 'q8-header',
    type: 'headline',
    content: {
      text: 'Seu hobby preferido seria:',
      level: 2,
      className: 'text-center text-2xl font-semibold text-gray-800 mb-6',
    },
  },
  {
    id: 'q8-question',
    type: 'quiz-question-inline',
    content: {
      question: 'Como você gasta seu tempo livre?',
      options: [
        {
          id: 'q8-opt1',
          text: '🎭 Teatro, dança, performance',
          value: 'artistico_performativo',
          category: 'criativo',
          points: 3,
        },
        {
          id: 'q8-opt2',
          text: '🌱 Jardinagem, culinária, artesanato',
          value: 'manual_criativo',
          category: 'contemplativo',
          points: 2,
        },
        {
          id: 'q8-opt3',
          text: '🎮 Gaming, tecnologia, programação',
          value: 'digital',
          category: 'intelectual',
          points: 3,
        },
        {
          id: 'q8-opt4',
          text: '🏔️ Aventuras ao ar livre, viagens',
          value: 'aventureiro',
          category: 'ativo',
          points: 3,
        },
      ],
    },
  },

  // ===== ETAPA 10: NONA QUESTÃO =====
  {
    id: 'q9-header',
    type: 'headline',
    content: {
      text: 'Sua cor favorita revela:',
      level: 2,
      className: 'text-center text-2xl font-semibold text-gray-800 mb-6',
    },
  },
  {
    id: 'q9-question',
    type: 'quiz-question-inline',
    content: {
      question: 'Qual paleta de cores mais te atrai?',
      options: [
        {
          id: 'q9-opt1',
          text: '🔴 Vermelhos, laranjas - cores quentes e energéticas',
          value: 'cores_quentes',
          category: 'ativo',
          points: 2,
        },
        {
          id: 'q9-opt2',
          text: '💙 Azuis, verdes - cores frias e tranquilas',
          value: 'cores_frias',
          category: 'contemplativo',
          points: 3,
        },
        {
          id: 'q9-opt3',
          text: '🖤 Preto, branco, cinza - cores neutras e elegantes',
          value: 'cores_neutras',
          category: 'classico',
          points: 3,
        },
        {
          id: 'q9-opt4',
          text: '🌈 Misturo todas - adoro variedade e contraste',
          value: 'cores_variedade',
          category: 'criativo',
          points: 2,
        },
      ],
    },
  },

  // ===== ETAPA 11: DÉCIMA QUESTÃO =====
  {
    id: 'q10-header',
    type: 'headline',
    content: {
      text: 'Em reuniões ou grupos:',
      level: 2,
      className: 'text-center text-2xl font-semibold text-gray-800 mb-6',
    },
  },
  {
    id: 'q10-question',
    type: 'quiz-question-inline',
    content: {
      question: 'Qual é seu papel natural?',
      options: [
        {
          id: 'q10-opt1',
          text: '🎤 Lidero as discussões e apresento ideias',
          value: 'lider_nato',
          category: 'extrovertido',
          points: 3,
        },
        {
          id: 'q10-opt2',
          text: '🧠 Contribuo com insights e soluções criativas',
          value: 'estrategista',
          category: 'intelectual',
          points: 3,
        },
        {
          id: 'q10-opt3',
          text: '👂 Escuto atentamente e faço perguntas relevantes',
          value: 'observador_ativo',
          category: 'contemplativo',
          points: 2,
        },
        {
          id: 'q10-opt4',
          text: '🤝 Facilito o consenso e mediei conflitos',
          value: 'harmonizador',
          category: 'social',
          points: 3,
        },
      ],
    },
  },

  // ===== ETAPA 12: DÉCIMA PRIMEIRA QUESTÃO =====
  {
    id: 'q11-header',
    type: 'headline',
    content: {
      text: 'Sua casa ideal seria:',
      level: 2,
      className: 'text-center text-2xl font-semibold text-gray-800 mb-6',
    },
  },
  {
    id: 'q11-question',
    type: 'quiz-question-inline',
    content: {
      question: 'Como você decora seu espaço?',
      options: [
        {
          id: 'q11-opt1',
          text: '🏛️ Clássica e elegante, móveis de qualidade',
          value: 'decoracao_classica',
          category: 'classico',
          points: 3,
        },
        {
          id: 'q11-opt2',
          text: '🎨 Cheia de arte, cores e objetos únicos',
          value: 'decoracao_artistica',
          category: 'criativo',
          points: 3,
        },
        {
          id: 'q11-opt3',
          text: '🧘 Minimalista e zen, com plantas',
          value: 'decoracao_minimalista',
          category: 'contemplativo',
          points: 2,
        },
        {
          id: 'q11-opt4',
          text: '🛋️ Confortável e aconchegante para receber amigos',
          value: 'decoracao_acolhedora',
          category: 'social',
          points: 2,
        },
      ],
    },
  },

  // ===== ETAPAS 13-19: QUESTÕES ESTRATÉGICAS =====
  {
    id: 'strategic-section',
    type: 'headline',
    content: {
      text: '🎯 Agora vamos mais fundo...',
      level: 2,
      className: 'text-center text-3xl font-bold text-blue-600 mb-4',
    },
  },
  {
    id: 'strategic-intro',
    type: 'text',
    content: {
      text: 'Estas próximas questões vão revelar aspectos mais profundos da sua personalidade.',
      className: 'text-center text-lg text-gray-600 mb-8',
    },
  },

  // Questão 12 (Etapa 13)
  {
    id: 'q12-question',
    type: 'quiz-question-inline',
    content: {
      question: 'Qual frase mais define sua filosofia de vida?',
      options: [
        {
          id: 'q12-opt1',
          text: '"A vida é uma aventura ousada ou não é nada"',
          value: 'filosofia_aventura',
          category: 'ativo',
          points: 3,
        },
        {
          id: 'q12-opt2',
          text: '"O silêncio é a fonte de todo conhecimento"',
          value: 'filosofia_contemplacao',
          category: 'contemplativo',
          points: 3,
        },
        {
          id: 'q12-opt3',
          text: '"Criatividade é a inteligência se divertindo"',
          value: 'filosofia_criatividade',
          category: 'criativo',
          points: 3,
        },
        {
          id: 'q12-opt4',
          text: '"Somos a média das 5 pessoas com quem mais convivemos"',
          value: 'filosofia_social',
          category: 'social',
          points: 3,
        },
      ],
    },
  },

  // ===== ETAPA 20: RESULTADO =====
  {
    id: 'resultado-header',
    type: 'headline',
    content: {
      text: '🎉 Seu Estilo Pessoal Foi Revelado!',
      level: 1,
      className: 'text-center text-4xl font-bold text-green-600 mb-6',
    },
  },
  {
    id: 'resultado-text',
    type: 'text',
    content: {
      text: 'Baseado em suas respostas, identificamos seu estilo dominante. Veja abaixo sua análise completa e recomendações personalizadas.',
      className: 'text-center text-lg text-gray-600 mb-8',
    },
  },

  // ===== ETAPA 21: OFERTA =====
  {
    id: 'oferta-header',
    type: 'headline',
    content: {
      text: '✨ Oferta Especial Para Você!',
      level: 2,
      className: 'text-center text-3xl font-bold text-purple-600 mb-6',
    },
  },
  {
    id: 'oferta-text',
    type: 'text',
    content: {
      text: 'Agora que conhece seu estilo, que tal receber um guia completo personalizado com dicas de moda, decoração e lifestyle especialmente para seu perfil?',
      className: 'text-center text-lg text-gray-700 mb-6',
    },
  },
  {
    id: 'email-input',
    type: 'input-field',
    content: {
      label: 'Seu melhor e-mail:',
      placeholder: 'exemplo@email.com',
      type: 'email',
      required: true,
      className: 'max-w-md mx-auto mb-4',
    },
  },
  {
    id: 'whatsapp-input',
    type: 'input-field',
    content: {
      label: 'WhatsApp (opcional):',
      placeholder: '(11) 99999-9999',
      type: 'tel',
      required: false,
      className: 'max-w-md mx-auto mb-6',
    },
  },
  {
    id: 'cta-button',
    type: 'button',
    content: {
      text: '🎁 Quero Meu Guia Personalizado Grátis!',
      href: '#submit-quiz',
      className:
        'bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold py-4 px-8 rounded-full hover:shadow-xl transition-all duration-300 mx-auto block w-fit',
    },
  },
];

/**
 * 🎯 CONFIGURAÇÃO DO RESULTADO DO QUIZ
 */
export const QUIZ_RESULTADO_MAPPING = {
  extrovertido: {
    title: 'O Comunicador',
    subtitle: 'Você é naturalmente sociável e expressivo',
    description:
      'Pessoas com seu estilo têm facilidade para se conectar com outros, liderar conversas e criar energia positiva ao redor. Você se destaca em ambientes sociais e tem um talento natural para influenciar e inspirar.',
    characteristics: [
      'Comunicação natural e carismática',
      'Energia contagiante em grupos',
      'Facilidade para fazer networking',
      'Gosta de ser o centro das atenções',
      'Inspira confiança nos outros',
    ],
    recommendations: [
      'Use cores vibrantes que reflitam sua personalidade',
      'Invista em peças statement que chamem atenção',
      'Crie um espaço social em casa para receber amigos',
      'Desenvolva suas habilidades de apresentação',
      'Considere carreiras em vendas, marketing ou comunicação',
    ],
    color: 'from-orange-400 to-red-500',
    icon: 'zap',
  },
  contemplativo: {
    title: 'O Pensador',
    subtitle: 'Você valoriza profundidade e reflexão',
    description:
      'Seu estilo é marcado pela busca do conhecimento, auto-reflexão e uma abordagem ponderada da vida. Você prefere qualidade à quantidade, tanto em relacionamentos quanto em experiências.',
    characteristics: [
      'Pensamento analítico e profundo',
      'Prefere conversas significativas',
      'Valoriza momentos de solitude',
      'Busca constante por aprendizado',
      'Sabedoria além da idade',
    ],
    recommendations: [
      'Crie um espaço de estudo/leitura personalizado',
      'Invista em peças clássicas e atemporais',
      'Use tons terrosos e neutros que transmitam serenidade',
      'Desenvolva hobbies contemplativos como meditação',
      'Considere carreiras em pesquisa, consultoria ou escrita',
    ],
    color: 'from-blue-400 to-indigo-500',
    icon: 'compass',
  },
  criativo: {
    title: 'O Inovador',
    subtitle: 'Você vê o mundo através de lentes únicas',
    description:
      'Sua criatividade e originalidade são suas maiores forças. Você tem uma visão única do mundo e não tem medo de experimentar e inovar em todas as áreas da vida.',
    characteristics: [
      'Imaginação fértil e original',
      'Não segue padrões convencionais',
      'Expressão artística natural',
      'Visão inovadora de problemas',
      'Inspira outros com suas ideias',
    ],
    recommendations: [
      'Misture texturas, padrões e cores inesperadas',
      'Crie um ateliê ou espaço criativo em casa',
      'Invista em peças únicas e artesanais',
      'Desenvolva múltiplas formas de expressão artística',
      'Considere carreiras em design, arte ou inovação',
    ],
    color: 'from-purple-400 to-pink-500',
    icon: 'star',
  },
  classico: {
    title: 'O Elegante',
    subtitle: 'Você aprecia sofisticação e atemporalidade',
    description:
      'Seu estilo é refinado e elegante. Você valoriza qualidade, tradição e tem um gosto apurado para o que é verdadeiramente belo e duradouro.',
    characteristics: [
      'Gosto refinado e sofisticado',
      'Valoriza qualidade sobre quantidade',
      'Aprecia tradições e história',
      'Elegância natural em suas escolhas',
      'Influência positiva através do exemplo',
    ],
    recommendations: [
      'Invista em peças clássicas de alta qualidade',
      'Use paleta de cores neutras e elegantes',
      'Crie ambientes sofisticados e organizados',
      'Desenvolva conhecimento em arte e cultura',
      'Considere carreiras em consultoria, advocacia ou gestão',
    ],
    color: 'from-gray-400 to-gray-600',
    icon: 'crown',
  },
  social: {
    title: 'O Harmonizador',
    subtitle: 'Você conecta pessoas e cria comunidades',
    description:
      'Você tem um talento especial para entender as pessoas e criar harmonia em grupos. Sua empatia e habilidades sociais fazem de você um verdadeiro conectador.',
    characteristics: [
      'Empatia natural e genuína',
      'Facilita conexões entre pessoas',
      'Cria ambientes acolhedores',
      'Resolve conflitos com diplomacia',
      'Valoriza relacionamentos profundos',
    ],
    recommendations: [
      'Crie espaços de convivência aconchegantes',
      'Use cores que transmitam calor e acolhimento',
      'Invista em peças confortáveis e versáteis',
      'Desenvolva suas habilidades de mediação',
      'Considere carreiras em RH, terapia ou educação',
    ],
    color: 'from-green-400 to-teal-500',
    icon: 'heart',
  },
};

/**
 * 🎯 FUNÇÃO PARA CALCULAR RESULTADO
 */
export function calcularResultadoQuiz(respostas: Record<string, any>): {
  resultado: any;
  pontuacoes: Record<string, number>;
} {
  const pontuacoes: Record<string, number> = {};

  // Contar pontos por categoria
  Object.values(respostas).forEach((resposta: any) => {
    if (resposta.category && resposta.points) {
      pontuacoes[resposta.category] = (pontuacoes[resposta.category] || 0) + resposta.points;
    }
  });

  // Encontrar categoria dominante
  const categoriaDominante = Object.entries(pontuacoes).sort(([, a], [, b]) => b - a)[0]?.[0];

  const resultado =
    QUIZ_RESULTADO_MAPPING[categoriaDominante as keyof typeof QUIZ_RESULTADO_MAPPING] ||
    QUIZ_RESULTADO_MAPPING.social;

  return {
    resultado,
    pontuacoes,
  };
}
