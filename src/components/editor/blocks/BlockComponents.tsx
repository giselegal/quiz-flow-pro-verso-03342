import React from 'react';
import { 
  Type, 
  Heading1, 
  Image as ImageIcon, 
  RectangleHorizontal, 
  StretchHorizontal, 
  HelpCircle, 
  Play, 
  Timer, 
  Award, 
  Gift, 
  Users, 
  LayoutGrid,
  Target,
  Palette,
  Settings
} from 'lucide-react';

// ========================================
// TIPOS DE BLOCOS DISPONÍVEIS
// ========================================

export interface BlockComponent {
  type: string;
  label: string;
  icon: React.ComponentType<any>;
  category: 'basic' | 'quiz' | 'result' | 'offer' | 'social-proof' | 'urgency' | 'support';
  description: string;
  isPro?: boolean;
  isPopular?: boolean;
  tags?: string[];
  preview?: string;
}

// ========================================
// COMPONENTES DISPONÍVEIS PARA O EDITOR
// ========================================

export const AVAILABLE_BLOCKS: BlockComponent[] = [
  // ===== CATEGORIA: BÁSICOS =====
  {
    type: 'heading',
    label: 'Título',
    icon: Heading1,
    category: 'basic',
    description: 'Títulos e subtítulos com diferentes níveis (H1-H4)',
    isPopular: true,
    tags: ['texto', 'titulo', 'h1', 'h2'],
    preview: 'Seu Título Aqui'
  },
  {
    type: 'text',
    label: 'Texto',
    icon: Type,
    category: 'basic',
    description: 'Bloco de texto simples com formatação básica',
    isPopular: true,
    tags: ['texto', 'paragrafo', 'conteudo'],
    preview: 'Parágrafo de texto editável.'
  },
  {
    type: 'rich-text',
    label: 'Texto Rico',
    icon: Palette,
    category: 'basic',
    description: 'Editor de texto com formatação avançada (negrito, itálico, links)',
    isPro: true,
    tags: ['texto', 'formatacao', 'rico', 'html'],
    preview: 'Texto com formatação rica'
  },
  {
    type: 'button',
    label: 'Botão',
    icon: RectangleHorizontal,
    category: 'basic',
    description: 'Botão interativo com link ou ação personalizada',
    isPopular: true,
    tags: ['botao', 'cta', 'acao', 'link'],
    preview: 'Clique Aqui'
  },
  {
    type: 'image',
    label: 'Imagem',
    icon: ImageIcon,
    category: 'basic',
    description: 'Bloco de imagem com configurações de layout e estilo',
    isPopular: true,
    tags: ['imagem', 'foto', 'visual'],
    preview: '🖼️ Imagem'
  },
  {
    type: 'spacer',
    label: 'Espaçador',
    icon: StretchHorizontal,
    category: 'basic',
    description: 'Espaço vazio para separar e organizar conteúdo',
    tags: ['espaco', 'separador', 'layout'],
    preview: '⭐ Espaço'
  },

  // ===== CATEGORIA: QUIZ =====
  {
    type: 'quiz-intro',
    label: 'Introdução do Quiz',
    icon: Play,
    category: 'quiz',
    description: 'Página inicial do quiz com título, descrição e botão de início',
    isPopular: true,
    tags: ['quiz', 'introducao', 'inicio', 'apresentacao'],
    preview: 'Descubra Seu Estilo Pessoal'
  },
  {
    type: 'quiz-question',
    label: 'Pergunta do Quiz',
    icon: HelpCircle,
    category: 'quiz',
    description: 'Pergunta completa com opções configuráveis e múltiplos layouts',
    isPopular: true,
    isPro: true,
    tags: ['quiz', 'pergunta', 'opcoes', 'questao'],
    preview: 'Qual é o seu tipo favorito?'
  },
  {
    type: 'quiz-step',
    label: 'Etapa de Quiz Avançada',
    icon: LayoutGrid,
    category: 'quiz',
    description: 'Etapa completa com header, progresso, pergunta e validações',
    isPro: true,
    tags: ['quiz', 'etapa', 'avancado', 'completo'],
    preview: 'Etapa Completa do Quiz'
  },
  {
    type: 'quiz-progress',
    label: 'Barra de Progresso',
    icon: Timer,
    category: 'quiz',
    description: 'Indicador visual do progresso do usuário no quiz',
    tags: ['progresso', 'barra', 'indicador'],
    preview: '▓▓▓░░ 60%'
  },

  // ===== CATEGORIA: RESULTADO =====
  {
    type: 'quiz-result',
    label: 'Resultado do Quiz',
    icon: Award,
    category: 'result',
    description: 'Exibição personalizada do resultado com compartilhamento',
    isPopular: true,
    isPro: true,
    tags: ['resultado', 'final', 'compartilhar'],
    preview: 'Seu Resultado Personalizado'
  },

  // ===== CATEGORIA: OFERTA =====
  {
    type: 'product-offer',
    label: 'Oferta de Produto',
    icon: Gift,
    category: 'offer',
    description: 'Apresentação profissional de produto/serviço com preços',
    isPro: true,
    tags: ['produto', 'oferta', 'preco', 'vendas'],
    preview: 'Produto Exclusivo - R$ 97'
  },

  // ===== CATEGORIA: PROVA SOCIAL =====
  {
    type: 'testimonials',
    label: 'Depoimentos',
    icon: Users,
    category: 'social-proof',
    description: 'Seção de depoimentos de clientes com fotos e avaliações',
    isPopular: true,
    tags: ['depoimentos', 'clientes', 'avaliacoes', 'social'],
    preview: '"Excelente produto!" - Cliente'
  },

  // ===== CATEGORIA: URGÊNCIA =====
  {
    type: 'urgency-timer',
    label: 'Contador de Urgência',
    icon: Timer,
    category: 'urgency',
    description: 'Timer de contagem regressiva para criar senso de urgência',
    isPro: true,
    tags: ['urgencia', 'tempo', 'contador', 'oferta'],
    preview: '⏰ 23:59:47'
  },

  // ===== CATEGORIA: SUPORTE =====
  {
    type: 'faq-section',
    label: 'Perguntas Frequentes',
    icon: HelpCircle,
    category: 'support',
    description: 'Seção de perguntas e respostas com accordion expansível',
    tags: ['faq', 'perguntas', 'suporte', 'ajuda'],
    preview: 'Perguntas Frequentes'
  }
];

// ========================================
// CATEGORIAS DE BLOCOS
// ========================================

export const BLOCK_CATEGORIES = {
  basic: {
    label: 'Básicos',
    description: 'Componentes fundamentais para qualquer página',
    icon: Type,
    color: '#6B7280'
  },
  quiz: {
    label: 'Quiz',
    description: 'Componentes específicos para quizzes interativos',
    icon: HelpCircle,
    color: '#3B82F6'
  },
  result: {
    label: 'Resultado',
    description: 'Exibição e apresentação de resultados',
    icon: Award,
    color: '#10B981'
  },
  offer: {
    label: 'Oferta',
    description: 'Produtos, serviços e vendas',
    icon: Gift,
    color: '#F59E0B'
  },
  'social-proof': {
    label: 'Prova Social',
    description: 'Depoimentos e validação social',
    icon: Users,
    color: '#8B5CF6'
  },
  urgency: {
    label: 'Urgência',
    description: 'Elementos de escassez e tempo limitado',
    icon: Timer,
    color: '#EF4444'
  },
  support: {
    label: 'Suporte',
    description: 'Ajuda e frequentes',
    icon: Settings,
    color: '#6B7280'
  }
};

// ========================================
// HELPERS E UTILITÁRIOS
// ========================================

export const getBlocksByCategory = (category: string): BlockComponent[] => {
  return AVAILABLE_BLOCKS.filter(block => block.category === category);
};

export const getPopularBlocks = (): BlockComponent[] => {
  return AVAILABLE_BLOCKS.filter(block => block.isPopular);
};

export const getProBlocks = (): BlockComponent[] => {
  return AVAILABLE_BLOCKS.filter(block => block.isPro);
};

export const searchBlocks = (query: string): BlockComponent[] => {
  const lowercaseQuery = query.toLowerCase();
  return AVAILABLE_BLOCKS.filter(
    block =>
      block.label.toLowerCase().includes(lowercaseQuery) ||
      block.description.toLowerCase().includes(lowercaseQuery) ||
      block.tags?.some(tag => tag.includes(lowercaseQuery))
  );
};

export const getBlockComponent = (type: string): BlockComponent | undefined => {
  return AVAILABLE_BLOCKS.find(block => block.type === type);
};

// ========================================
// COMPONENT RENDERER MAPPING
// ========================================

export const BLOCK_RENDERERS = {
  // Básicos
  'heading': 'HeadingBlock',
  'text': 'TextBlock', 
  'rich-text': 'RichTextBlock',
  'button': 'ButtonBlock',
  'image': 'ImageBlock',
  'spacer': 'SpacerBlock',
  
  // Quiz
  'quiz-intro': 'QuizIntroBlock',
  'quiz-question': 'QuizQuestionBlock',
  'quiz-step': 'QuizStepBlock',
  'quiz-progress': 'QuizProgressBlock',
  
  // Resultado
  'quiz-result': 'QuizResultBlock',
  
  // Oferta
  'product-offer': 'ProductOfferBlock',
  
  // Prova Social
  'testimonials': 'TestimonialsBlock',
  
  // Urgência
  'urgency-timer': 'UrgencyTimerBlock',
  
  // Suporte
  'faq-section': 'FaqSectionBlock'
};

// ========================================
// DEFAULT PROPS PARA CADA BLOCO
// ========================================

export const getDefaultBlockProps = (type: string): Record<string, any> => {
  const defaults: Record<string, Record<string, any>> = {
    'heading': {
      level: 'h1',
      content: 'Seu Título Aqui',
      fontSize: 32,
      textColor: '#1a202c',
      textAlign: 'center'
    },
    'text': {
      content: 'Parágrafo de texto editável.',
      fontSize: 16,
      textColor: '#333333',
      textAlign: 'left'
    },
    'rich-text': {
      content: '&lt;p&gt;Texto com &lt;strong&gt;formatação&lt;/strong&gt; rica&lt;/p&gt;',
      minHeight: 100
    },
    'button': {
      text: 'Clique Aqui',
      link: '#',
      backgroundColor: '#B89B7A',
      textColor: '#ffffff',
      paddingX: 24,
      paddingY: 12,
      borderRadius: 8,
      fullWidth: false
    },
    'image': {
      src: '',
      alt: 'Imagem',
      width: 300,
      height: 200,
      objectFit: 'cover',
      borderRadius: 8
    },
    'spacer': {
      height: 20,
      backgroundColor: 'transparent',
      borderStyle: 'none',
      borderColor: '#facc15'
    },
    'quiz-intro': {
      headerEnabled: true,
      logoUrl: '',
      title: 'Descubra Seu Estilo Pessoal',
      subtitle: 'Responda algumas perguntas e descubra qual estilo combina mais com você!',
      description: '&lt;p&gt;Este quiz foi desenvolvido para ajudar você a descobrir seu estilo único...&lt;/p&gt;',
      buttonText: 'Começar Quiz',
      primaryColor: '#B89B7A',
      textColor: '#333333',
      backgroundColor: '#ffffff'
    },
    'quiz-question': {
      headerEnabled: true,
      logoUrl: '',
      showProgressBar: true,
      showBackButton: true,
      progressValue: 25,
      questionText: 'Qual é o seu tipo de roupa favorita?',
      questionTextSize: 28,
      questionTextColor: '#000000',
      questionTextAlign: 'center',
      layout: '2-columns',
      direction: 'vertical',
      disposition: 'image-text',
      options: [],
      isMultipleChoice: false,
      isRequired: true,
      autoProceed: false,
      minSelections: 1,
      maxSelections: 3,
      borderRadius: 'small',
      boxShadow: 'medium',
      spacing: 'medium',
      optionStyle: 'card',
      primaryColor: '#B89B7A',
      secondaryColor: '#ffffff',
      borderColor: '#e5e7eb',
      hoverColor: '#a08965',
      componentId: '',
      maxWidth: 90
    },
    'quiz-result': {
      resultTitle: 'Seu Resultado',
      resultSubtitle: 'Parabéns! Aqui está seu resultado personalizado',
      resultDescription: '&lt;p&gt;Baseado em suas respostas...&lt;/p&gt;',
      resultImage: '',
      showShareButton: true,
      showRetakeButton: true,
      ctaButtonText: 'Ver Oferta Personalizada',
      ctaButtonLink: '#',
      primaryColor: '#B89B7A',
      backgroundColor: '#ffffff'
    },
    'testimonials': {
      title: 'O que nossos clientes dizem',
      testimonials: [],
      layout: '2-columns'
    },
    'urgency-timer': {
      title: 'Oferta termina em:',
      endTime: '2024-12-31 23:59:59',
      showDays: true,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      primaryColor: '#dc2626'
    }
  };

  return defaults[type] || {};
};

export default AVAILABLE_BLOCKS;
