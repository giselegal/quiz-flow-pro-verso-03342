import { BlockDefinition } from "@/types/blocks";

// Definições de blocos reutilizáveis
const headerBlockDefinition: BlockDefinition = {
  type: 'header',
  name: 'Cabeçalho',
  description: 'Título principal da seção',
  category: 'Texto',
  icon: 'Heading',
  defaultProps: {},
  properties: [
    { key: 'text', label: 'Texto', type: 'string', default: 'Título Principal' },
    { key: 'level', label: 'Nível', type: 'select', options: ['1', '2', '3', '4', '5', '6'], default: '1' },
    { key: 'alignment', label: 'Alinhamento', type: 'select', options: ['left', 'center', 'right'], default: 'center' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', default: '#000000' },
    { key: 'fontSize', label: 'Tamanho da Fonte', type: 'number', default: 32 }
  ]
};

const textBlockDefinition: BlockDefinition = {
  type: 'text',
  name: 'Texto',
  description: 'Parágrafo de texto formatado',
  category: 'Texto',
  icon: 'Text',
  defaultProps: {},
  properties: [
    { key: 'text', label: 'Texto', type: 'richtext', default: 'Texto do parágrafo...' },
    { key: 'alignment', label: 'Alinhamento', type: 'select', options: ['left', 'center', 'right', 'justify'], default: 'left' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', default: '#000000' },
    { key: 'fontSize', label: 'Tamanho da Fonte', type: 'number', default: 16 },
    { key: 'lineHeight', label: 'Altura da Linha', type: 'number', default: 1.5 }
  ]
};

const imageBlockDefinition: BlockDefinition = {
  type: 'image',
  name: 'Imagem',
  description: 'Imagem com opções de alinhamento e link',
  category: 'Mídia',
  icon: 'Image',
  properties: [
    { key: 'src', label: 'URL da Imagem', type: 'string', default: '' },
    { key: 'alt', label: 'Texto Alternativo', type: 'string', default: 'Imagem' },
    { key: 'alignment', label: 'Alinhamento', type: 'select', options: ['left', 'center', 'right'], default: 'center' },
    { key: 'width', label: 'Largura', type: 'number', default: 100 },
    { key: 'maxWidth', label: 'Largura Máxima (%)', type: 'number', default: 100 },
    { key: 'link', label: 'Link', type: 'string', default: '' },
    { key: 'openInNewTab', label: 'Abrir em Nova Aba', type: 'boolean', default: false }
  ],
  defaultContent: {
    src: '',
    alt: 'Imagem',
    alignment: 'center',
    width: 100,
    maxWidth: 100,
    link: '',
    openInNewTab: false
  }
};

const buttonBlockDefinition: BlockDefinition = {
  type: 'button',
  name: 'Botão',
  description: 'Botão com link e opções de estilo',
  category: 'Ação',
  icon: 'Button',
  properties: [
    { key: 'text', label: 'Texto do Botão', type: 'string', default: 'Clique Aqui' },
    { key: 'link', label: 'Link', type: 'string', default: '#' },
    { key: 'openInNewTab', label: 'Abrir em Nova Aba', type: 'boolean', default: false },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', default: '#007BFF' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', default: '#FFFFFF' },
    { key: 'fontSize', label: 'Tamanho da Fonte', type: 'number', default: 16 },
    { key: 'borderRadius', label: 'Raio da Borda', type: 'number', default: 5 },
    { key: 'padding', label: 'Espaçamento Interno', type: 'string', default: '10px 20px' }
  ],
  defaultContent: {
    text: 'Clique Aqui',
    link: '#',
    openInNewTab: false,
    backgroundColor: '#007BFF',
    textColor: '#FFFFFF',
    fontSize: 16,
    borderRadius: 5,
    padding: '10px 20px'
  }
};

const spacerBlockDefinition: BlockDefinition = {
  type: 'spacer',
  name: 'Espaçador',
  description: 'Espaço vertical entre blocos',
  category: 'Layout',
  icon: 'Spacer',
  properties: [
    { key: 'height', label: 'Altura (px)', type: 'number', default: 20 },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', default: 'transparent' }
  ],
  defaultContent: {
    height: 20,
    backgroundColor: 'transparent'
  }
};

const richTextBlockDefinition: BlockDefinition = {
  type: 'rich-text',
  name: 'Texto Rico',
  description: 'Editor de texto com formatação avançada',
  category: 'Texto',
  icon: 'RichText',
  properties: [
    { key: 'content', label: 'Conteúdo', type: 'html', default: '<p>Digite seu texto aqui...</p>' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', default: '#000000' },
    { key: 'fontSize', label: 'Tamanho da Fonte', type: 'number', default: 16 },
    { key: 'alignment', label: 'Alinhamento', type: 'select', options: ['left', 'center', 'right', 'justify'], default: 'left' }
  ],
  defaultContent: {
    content: '<p>Digite seu texto aqui...</p>',
    textColor: '#000000',
    fontSize: 16,
    alignment: 'left'
  }
};

const quizStartPageBlockDefinition: BlockDefinition = {
  type: 'quiz-start-page',
  name: 'Página Inicial do Quiz',
  description: 'Página de introdução do quiz com título e descrição',
  category: 'Quiz',
  icon: 'QuizStart',
  properties: [
    { key: 'title', label: 'Título', type: 'string', default: 'Comece o Quiz!' },
    { key: 'description', label: 'Descrição', type: 'richtext', default: 'Prepare-se para testar seus conhecimentos!' },
    { key: 'buttonText', label: 'Texto do Botão', type: 'string', default: 'Iniciar' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', default: '#f0f0f0' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', default: '#333333' }
  ],
  defaultContent: {
    title: 'Comece o Quiz!',
    description: 'Prepare-se para testar seus conhecimentos!',
    buttonText: 'Iniciar',
    backgroundColor: '#f0f0f0',
    textColor: '#333333'
  }
};

const quizQuestionBlockDefinition: BlockDefinition = {
  type: 'quiz-question',
  name: 'Questão do Quiz',
  description: 'Questão com opções de resposta',
  category: 'Quiz',
  icon: 'QuizQuestion',
  properties: [
    { key: 'question', label: 'Pergunta', type: 'string', default: 'Qual é a sua cor favorita?' },
    { key: 'options', label: 'Opções', type: 'array', default: ['Vermelho', 'Azul', 'Verde', 'Amarelo'] },
    { key: 'correctAnswer', label: 'Resposta Correta', type: 'number', default: 0 },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', default: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', default: '#000000' }
  ],
  defaultContent: {
    question: 'Qual é a sua cor favorita?',
    options: ['Vermelho', 'Azul', 'Verde', 'Amarelo'],
    correctAnswer: 0,
    backgroundColor: '#ffffff',
    textColor: '#000000'
  }
};

const quizQuestionConfigurableBlockDefinition: BlockDefinition = {
  type: 'quiz-question-configurable',
  name: 'Questão Configurável',
  description: 'Questão com opções de resposta configuráveis',
  category: 'Quiz',
  icon: 'QuizConfigurable',
  properties: [
    { key: 'question', label: 'Pergunta', type: 'string', default: 'Escolha uma opção:' },
    { key: 'options', label: 'Opções', type: 'array', default: [{ text: 'Opção 1', isCorrect: false }, { text: 'Opção 2', isCorrect: true }] },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', default: '#f9f9f9' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', default: '#333' }
  ],
  defaultContent: {
    question: 'Escolha uma opção:',
    options: [{ text: 'Opção 1', isCorrect: false }, { text: 'Opção 2', isCorrect: true }],
    backgroundColor: '#f9f9f9',
    textColor: '#333'
  }
};

const questionMultipleBlockDefinition: BlockDefinition = {
  type: 'question-multiple',
  name: 'Questão Múltipla Escolha',
  description: 'Questão com múltiplas opções de escolha',
  category: 'Quiz',
  icon: 'MultipleChoice',
  properties: [
    { key: 'question', label: 'Pergunta', type: 'string', default: 'Selecione as opções corretas:' },
    { key: 'options', label: 'Opções', type: 'array', default: [{ text: 'Opção A', isCorrect: true }, { text: 'Opção B', isCorrect: false }] },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', default: '#e6e6e6' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', default: '#333' }
  ],
  defaultContent: {
    question: 'Selecione as opções corretas:',
    options: [{ text: 'Opção A', isCorrect: true }, { text: 'Opção B', isCorrect: false }],
    backgroundColor: '#e6e6e6',
    textColor: '#333'
  }
};

const strategicQuestionBlockDefinition: BlockDefinition = {
  type: 'strategic-question',
  name: 'Questão Estratégica',
  description: 'Questão com impacto estratégico no resultado',
  category: 'Quiz',
  icon: 'StrategicQuestion',
  properties: [
    { key: 'question', label: 'Pergunta', type: 'string', default: 'Como você prioriza?' },
    { key: 'options', label: 'Opções', type: 'array', default: [{ text: 'Opção 1', value: 'valor1' }, { text: 'Opção 2', value: 'valor2' }] },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', default: '#d4d4d4' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', default: '#333' }
  ],
  defaultContent: {
    question: 'Como você prioriza?',
    options: [{ text: 'Opção 1', value: 'valor1' }, { text: 'Opção 2', value: 'valor2' }],
    backgroundColor: '#d4d4d4',
    textColor: '#333'
  }
};

const quizTransitionBlockDefinition: BlockDefinition = {
  type: 'quiz-transition',
  name: 'Transição do Quiz',
  description: 'Tela de transição entre as etapas do quiz',
  category: 'Quiz',
  icon: 'QuizTransition',
  properties: [
    { key: 'text', label: 'Texto', type: 'string', default: 'Calculando...' },
    { key: 'loadingText', label: 'Texto de Carregamento', type: 'string', default: 'Por favor, aguarde' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', default: '#cccccc' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', default: '#333' }
  ],
  defaultContent: {
    text: 'Calculando...',
    loadingText: 'Por favor, aguarde',
    backgroundColor: '#cccccc',
    textColor: '#333'
  }
};

const quizResultCalculatedBlockDefinition: BlockDefinition = {
  type: 'quiz-result-calculated',
  name: 'Resultado do Quiz',
  description: 'Apresenta o resultado calculado do quiz',
  category: 'Quiz',
  icon: 'QuizResult',
  properties: [
    { key: 'title', label: 'Título', type: 'string', default: 'Seu Resultado' },
    { key: 'description', label: 'Descrição', type: 'richtext', default: 'Aqui está o resultado do seu quiz!' },
    { key: 'resultCategory', label: 'Categoria do Resultado', type: 'string', default: 'Estilo' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', default: '#bbbbbb' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', default: '#333' }
  ],
  defaultContent: {
    title: 'Seu Resultado',
    description: 'Aqui está o resultado do seu quiz!',
    resultCategory: 'Estilo',
    backgroundColor: '#bbbbbb',
    textColor: '#333'
  }
};

const modernResultPageBlockDefinition: BlockDefinition = {
  type: 'modern-result-page',
  name: 'Página de Resultado Moderna',
  description: 'Página de resultado com design moderno',
  category: 'Resultado',
  icon: 'ModernResult',
  properties: [
    { key: 'title', label: 'Título', type: 'string', default: 'Resultado do Teste' },
    { key: 'mainText', label: 'Texto Principal', type: 'richtext', default: 'Parabéns!' },
    { key: 'resultImage', label: 'Imagem do Resultado', type: 'string', default: '' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', default: '#aaaaaa' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', default: '#333' }
  ],
  defaultContent: {
    title: 'Resultado do Teste',
    mainText: 'Parabéns!',
    resultImage: '',
    backgroundColor: '#aaaaaa',
    textColor: '#333'
  }
};

const quizOfferPageBlockDefinition: BlockDefinition = {
  type: 'quiz-offer-page',
  name: 'Página de Oferta do Quiz',
  description: 'Página de oferta após o resultado do quiz',
  category: 'Oferta',
  icon: 'QuizOffer',
  properties: [
    { key: 'title', label: 'Título', type: 'string', default: 'Oferta Exclusiva' },
    { key: 'offerText', label: 'Texto da Oferta', type: 'richtext', default: 'Aproveite nossa oferta especial!' },
    { key: 'buttonText', label: 'Texto do Botão', type: 'string', default: 'Comprar Agora' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', default: '#999999' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', default: '#333' }
  ],
  defaultContent: {
    title: 'Oferta Exclusiva',
    offerText: 'Aproveite nossa oferta especial!',
    buttonText: 'Comprar Agora',
    backgroundColor: '#999999',
    textColor: '#333'
  }
};

const faqSectionBlockDefinition: BlockDefinition = {
  type: 'faq-section',
  name: 'Seção de FAQ',
  description: 'Seção de perguntas frequentes',
  category: 'Informação',
  icon: 'FAQ',
  properties: [
    { key: 'title', label: 'Título', type: 'string', default: 'Perguntas Frequentes' },
    { key: 'questions', label: 'Perguntas', type: 'array', default: [{ question: 'Pergunta 1', answer: 'Resposta 1' }] },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', default: '#888888' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', default: '#333' }
  ],
  defaultContent: {
    title: 'Perguntas Frequentes',
    questions: [{ question: 'Pergunta 1', answer: 'Resposta 1' }],
    backgroundColor: '#888888',
    textColor: '#333'
  }
};

export const BLOCK_DEFINITIONS_CLEAN: BlockDefinition[] = [
  headerBlockDefinition,
  textBlockDefinition,
  imageBlockDefinition,
  buttonBlockDefinition,
  spacerBlockDefinition,
  richTextBlockDefinition,
  quizStartPageBlockDefinition,
  quizQuestionBlockDefinition,
  quizQuestionConfigurableBlockDefinition,
  questionMultipleBlockDefinition,
  strategicQuestionBlockDefinition,
  quizTransitionBlockDefinition,
  quizResultCalculatedBlockDefinition,
  modernResultPageBlockDefinition,
  quizOfferPageBlockDefinition,
  faqSectionBlockDefinition
];

// Função auxiliar para validação
export const validateBlockDefinitions = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  BLOCK_DEFINITIONS_CLEAN.forEach((definition, index) => {
    if (!definition.type) errors.push(`Block ${index}: missing type`);
    if (!definition.name) errors.push(`Block ${index}: missing name`);
    if (!definition.properties) errors.push(`Block ${index}: missing properties`);
    
    // Validar propriedades
    definition.properties.forEach((prop: any, propIndex: number) => {
      if (!prop.key) errors.push(`Block ${index}, Property ${propIndex}: missing key`);
      if (!prop.label) errors.push(`Block ${index}, Property ${propIndex}: missing label`);
      if (!prop.type) errors.push(`Block ${index}, Property ${propIndex}: missing type`);
    });
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default BLOCK_DEFINITIONS_CLEAN;
