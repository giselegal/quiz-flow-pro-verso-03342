/**
 * 🎨 STYLES DATABASE - Complete Style Definitions
 */

import { StyleType } from '../types/quiz';

export interface Style {
  id: string;
  name: string;
  description: string;
  type: StyleType;
  score: number;
  characteristics: string[];
  recommendations: string[];
  colors?: string[];
  images: string[];
  imageUrl?: string;
  guideImageUrl?: string;
  keywords?: string[];
  // Legacy compatibility
  category?: string;
  percentage?: number;
  style?: string;
  points?: number;
  rank?: number;
  // Additional properties for components
  image?: string;
  guideImage?: string;
  specialTips?: string[];
}

export const STYLE_DEFINITIONS: Record<string, Style> = {
  classico: {
    id: 'classico',
    name: 'Clássico',
    type: 'classico' as StyleType,
    score: 0,
    characteristics: ['atemporal', 'elegante', 'sofisticado', 'equilibrado', 'refinado'],
    recommendations: ['blazer', 'camisa branca', 'saia lápis', 'sapato oxford'],
    images: ['/estilos/classico-1.jpg', '/estilos/classico-2.jpg'],
    description: 'Descubra quais peças atemporais fazem parte do seu DNA estilístico, as cores que mais valorizam você e os segredos para criar looks impecáveis que nunca saem de moda.',
    imageUrl: '/estilos/classico-personal.webp',
    guideImageUrl: '/estilos/classico-guide.webp',
    keywords: ['atemporal', 'elegante', 'sofisticado', 'equilibrado', 'refinado'],
    image: '/estilos/classico-personal.webp',
    guideImage: '/estilos/classico-guide.webp',
    specialTips: ['Invista em peças de qualidade', 'Mantenha um guarda-roupa atemporal']
  },

  natural: {
    id: 'natural',
    name: 'Natural',
    type: 'natural' as StyleType,
    score: 0,
    characteristics: ['descomplicado', 'confortável', 'natural', 'terroso', 'autêntico'],
    recommendations: ['jeans', 'camiseta básica', 'tênis', 'cardigan'],
    images: ['/estilos/natural-1.jpg', '/estilos/natural-2.jpg'],
    description: 'Descubra as texturas e tons que conectam você com sua essência mais autêntica, além dos truques para criar looks descomplicados que irradiam naturalidade e charme.',
    imageUrl: '/estilos/natural-personal.webp',
    guideImageUrl: '/estilos/natural-guide.webp',
    keywords: ['descomplicado', 'confortável', 'natural', 'terroso', 'autêntico'],
    image: '/estilos/natural-personal.webp',
    guideImage: '/estilos/natural-guide.webp',
    specialTips: ['Priorize o conforto', 'Use tecidos naturais']
  },

  'contemporâneo': {
    id: 'contemporâneo',
    name: 'Contemporâneo',
    type: 'contemporâneo' as StyleType,
    score: 0,
    characteristics: ['moderno', 'atual', 'tendência', 'inovador', 'experimental'],
    recommendations: ['peças de design', 'estampas geométricas', 'cortes assimétricos'],
    images: ['/estilos/contemporaneo-1.jpg', '/estilos/contemporaneo-2.jpg'],
    description: 'Descubra quais tendências combinam perfeitamente com você, as estampas que destacam sua personalidade moderna e os segredos para estar sempre um passo à frente no mundo da moda.',
    imageUrl: '/estilos/contemporaneo-personal.webp',
    guideImageUrl: '/estilos/contemporaneo-guide.webp',
    keywords: ['moderno', 'atual', 'tendência', 'inovador', 'experimental'],
    image: '/estilos/contemporaneo-personal.webp',
    guideImage: '/estilos/contemporaneo-guide.webp',
    specialTips: ['Experimente tendências novas', 'Misture peças modernas com clássicas']
  },

  elegante: {
    id: 'elegante',
    name: 'Elegante',
    type: 'elegante' as StyleType,
    score: 0,
    characteristics: ['refinado', 'polido', 'qualidade', 'sofisticação', 'bom gosto'],
    recommendations: ['vestidos midi', 'salto alto', 'bolsa estruturada', 'joias delicadas'],
    images: ['/estilos/elegante-1.jpg', '/estilos/elegante-2.jpg'],
    description: 'Descubra as cores e texturas que exalam sofisticação no seu estilo, quais peças estratégicas elevam qualquer look e os detalhes que fazem toda a diferença na sua elegância.',
    imageUrl: '/estilos/elegante-personal.webp',
    guideImageUrl: '/estilos/elegante-guide.webp',
    keywords: ['refinado', 'polido', 'qualidade', 'sofisticação', 'bom gosto'],
    image: '/estilos/elegante-personal.webp',
    guideImage: '/estilos/elegante-guide.webp',
    specialTips: ['Foque na qualidade dos tecidos', 'Atenção aos detalhes']
  },

  'romântico': {
    id: 'romântico',
    name: 'Romântico',
    type: 'romântico' as StyleType,
    score: 0,
    characteristics: ['delicado', 'feminino', 'floral', 'suave', 'doce'],
    recommendations: ['vestidos florais', 'rendas', 'babados', 'cores pastéis'],
    images: ['/estilos/romantico-1.jpg', '/estilos/romantico-2.jpg'],
    description: 'Descubra quais estampas florais e tons suaves realçam sua feminilidade natural, os tecidos que abraçam sua delicadeza e os segredos para criar looks encantadores que expressam sua essência romântica.',
    imageUrl: '/estilos/romantico-personal.webp',
    guideImageUrl: '/estilos/romantico-guide.webp',
    keywords: ['delicado', 'feminino', 'floral', 'suave', 'doce'],
    image: '/estilos/romantico-personal.webp',
    guideImage: '/estilos/romantico-guide.webp',
    specialTips: ['Use estampas florais', 'Aposte em cores suaves']
  },

  sexy: {
    id: 'sexy',
    name: 'Sexy',
    type: 'sexy' as StyleType,
    score: 0,
    characteristics: ['sedutor', 'confiante', 'feminino', 'marcante', 'poderosa'],
    recommendations: ['decotes', 'vestidos justos', 'salto alto', 'cores vibrantes'],
    images: ['/estilos/sexy-1.jpg', '/estilos/sexy-2.jpg'],
    description: 'Descubra as cores vibrantes que potencializam sua sensualidade, os cortes estratégicos que valorizam sua silhueta e os segredos para expressar sua feminilidade com confiança e elegância.',
    imageUrl: '/estilos/sexy-personal.webp',
    guideImageUrl: '/estilos/sexy-guide.webp',
    keywords: ['sedutor', 'confiante', 'feminino', 'marcante', 'poderosa'],
    image: '/estilos/sexy-personal.webp',
    guideImage: '/estilos/sexy-guide.webp',
    specialTips: ['Realce suas curvas', 'Confie na sua feminilidade']
  },

  'dramático': {
    id: 'dramático',
    name: 'Dramático',
    type: 'dramático' as StyleType,
    score: 0,
    characteristics: ['marcante', 'impactante', 'contraste', 'geométrico', 'confiante'],
    recommendations: ['ombros marcados', 'preto e branco', 'acessórios statement'],
    images: ['/estilos/dramatico-1.jpg', '/estilos/dramatico-2.jpg'],
    description: 'Descubra os contrastes ousados que fazem sua personalidade brilhar, as estampas geométricas que combinam com sua energia marcante e os acessórios que transformam qualquer look em statement.',
    imageUrl: '/estilos/dramatico-personal.webp',
    guideImageUrl: '/estilos/dramatico-guide.webp',
    keywords: ['marcante', 'impactante', 'contraste', 'geométrico', 'confiante'],
    image: '/estilos/dramatico-personal.webp',
    guideImage: '/estilos/dramatico-guide.webp',
    specialTips: ['Use contrastes marcantes', 'Invista em acessórios statement']
  },

  criativo: {
    id: 'criativo',
    name: 'Criativo',
    type: 'criativo' as StyleType,
    score: 0,
    characteristics: ['único', 'expressivo', 'experimental', 'colorido', 'criativo'],
    recommendations: ['estampas mixadas', 'cores vibrantes', 'acessórios únicos'],
    images: ['/estilos/criativo-1.jpg', '/estilos/criativo-2.jpg'],
    description: 'Descubra quais combinações de estampas expressam sua criatividade única, as cores vibrantes que conectam com sua energia artística e os truques para mixar peças de forma harmoniosa e autêntica.',
    imageUrl: '/estilos/criativo-personal.webp',
    guideImageUrl: '/estilos/criativo-guide.webp',
    keywords: ['único', 'expressivo', 'experimental', 'colorido', 'criativo'],
    image: '/estilos/criativo-personal.webp',
    guideImage: '/estilos/criativo-guide.webp',
    specialTips: ['Misture estampas', 'Seja ousada com as cores']
  }
};

// Legacy compatibility exports
export const styleConfigGisele = STYLE_DEFINITIONS;

// ✅ COMPATIBILITY: Add aliases without accents for quiz options
// Quiz options use IDs without accents (romantico, dramatico, contemporaneo)
// but STYLE_DEFINITIONS uses accents (romântico, dramático, contemporâneo)
export const styleMapping = {
  ...STYLE_DEFINITIONS,
  // Aliases without accents (used in quizSteps.ts options)
  'romantico': STYLE_DEFINITIONS['romântico'],
  'dramatico': STYLE_DEFINITIONS['dramático'],
  'contemporaneo': STYLE_DEFINITIONS['contemporâneo'],
} as const;

export type StyleId = keyof typeof STYLE_DEFINITIONS | 'romantico' | 'dramatico' | 'contemporaneo';

// Export compatibility
export default STYLE_DEFINITIONS;