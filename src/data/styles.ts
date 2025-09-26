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
  colors: string[];
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
  clássico: {
    id: 'clássico',
    name: 'Clássico',
    type: 'classico' as StyleType,
    score: 0,
    characteristics: ['atemporal', 'elegante', 'sofisticado', 'equilibrado', 'refinado'],
    recommendations: ['blazer', 'camisa branca', 'saia lápis', 'sapato oxford'],
    colors: ['#2C3E50', '#34495E', '#ECF0F1'],
    images: ['/estilos/classico-1.jpg', '/estilos/classico-2.jpg'],
    description: 'Seu estilo é atemporal e elegante. Você aprecia peças bem estruturadas, cortes clássicos e uma paleta de cores neutras.',
    imageUrl: '/estilos/classico-personal.jpg',
    guideImageUrl: '/estilos/classico-guide.jpg',
    keywords: ['atemporal', 'elegante', 'sofisticado', 'equilibrado', 'refinado'],
    image: '/estilos/classico-personal.jpg',
    guideImage: '/estilos/classico-guide.jpg',
    specialTips: ['Invista em peças de qualidade', 'Mantenha um guarda-roupa atemporal']
  },

  natural: {
    id: 'natural',
    name: 'Natural',
    type: 'natural' as StyleType,
    score: 0,
    characteristics: ['descomplicado', 'confortável', 'natural', 'terroso', 'autêntico'],
    recommendations: ['jeans', 'camiseta básica', 'tênis', 'cardigan'],
    colors: ['#8D6E63', '#D7CCC8', '#4CAF50'],
    images: ['/estilos/natural-1.jpg', '/estilos/natural-2.jpg'],
    description: 'Seu estilo é descomplicado e confortável. Você prioriza o conforto sem abrir mão da beleza.',
    imageUrl: '/estilos/natural-personal.jpg',
    guideImageUrl: '/estilos/natural-guide.jpg',
    keywords: ['descomplicado', 'confortável', 'natural', 'terroso', 'autêntico'],
    image: '/estilos/natural-personal.jpg',
    guideImage: '/estilos/natural-guide.jpg',
    specialTips: ['Priorize o conforto', 'Use tecidos naturais']
  },

  contemporâneo: {
    id: 'contemporâneo',
    name: 'Contemporâneo',
    type: 'contemporâneo' as StyleType,
    score: 0,
    characteristics: ['moderno', 'atual', 'tendência', 'inovador', 'experimental'],
    recommendations: ['peças de design', 'estampas geométricas', 'cortes assimétricos'],
    colors: ['#607D8B', '#ECEFF1', '#FF5722'],
    images: ['/estilos/contemporaneo-1.jpg', '/estilos/contemporaneo-2.jpg'],
    description: 'Seu estilo é moderno e atual. Você está sempre antenada nas últimas tendências.',
    imageUrl: '/estilos/contemporaneo-personal.jpg',
    guideImageUrl: '/estilos/contemporaneo-guide.jpg',
    keywords: ['moderno', 'atual', 'tendência', 'inovador', 'experimental'],
    image: '/estilos/contemporaneo-personal.jpg',
    guideImage: '/estilos/contemporaneo-guide.jpg',
    specialTips: ['Experimente tendências novas', 'Misture peças modernas com clássicas']
  },

  elegante: {
    id: 'elegante',
    name: 'Elegante',
    type: 'elegante' as StyleType,
    score: 0,
    characteristics: ['refinado', 'polido', 'qualidade', 'sofisticação', 'bom gosto'],
    recommendations: ['vestidos midi', 'salto alto', 'bolsa estruturada', 'joias delicadas'],
    colors: ['#1A237E', '#C5CAE9', '#3F51B5'],
    images: ['/estilos/elegante-1.jpg', '/estilos/elegante-2.jpg'],
    description: 'Seu estilo é refinado e polido. Você aprecia a alta qualidade e o caimento perfeito.',
    imageUrl: '/estilos/elegante-personal.jpg',
    guideImageUrl: '/estilos/elegante-guide.jpg',
    keywords: ['refinado', 'polido', 'qualidade', 'sofisticação', 'bom gosto'],
    image: '/estilos/elegante-personal.jpg',
    guideImage: '/estilos/elegante-guide.jpg',
    specialTips: ['Foque na qualidade dos tecidos', 'Atenção aos detalhes']
  },

  romântico: {
    id: 'romântico',
    name: 'Romântico',
    type: 'romântico' as StyleType,
    score: 0,
    characteristics: ['delicado', 'feminino', 'floral', 'suave', 'doce'],
    recommendations: ['vestidos florais', 'rendas', 'babados', 'cores pastéis'],
    colors: ['#F8BBD9', '#FCE4EC', '#E91E63'],
    images: ['/estilos/romantico-1.jpg', '/estilos/romantico-2.jpg'],
    description: 'Seu estilo é delicado e feminino. Você adora peças com detalhes florais e cores suaves.',
    imageUrl: '/estilos/romantico-personal.jpg',
    guideImageUrl: '/estilos/romantico-guide.jpg',
    keywords: ['delicado', 'feminino', 'floral', 'suave', 'doce'],
    image: '/estilos/romantico-personal.jpg',
    guideImage: '/estilos/romantico-guide.jpg',
    specialTips: ['Use estampas florais', 'Aposte em cores suaves']
  },

  sexy: {
    id: 'sexy',
    name: 'Sexy',
    type: 'sexy' as StyleType,
    score: 0,
    characteristics: ['sedutor', 'confiante', 'feminino', 'marcante', 'poderosa'],
    recommendations: ['decotes', 'vestidos justos', 'salto alto', 'cores vibrantes'],
    colors: ['#B71C1C', '#FFCDD2', '#000000'],
    images: ['/estilos/sexy-1.jpg', '/estilos/sexy-2.jpg'],
    description: 'Seu estilo é sedutor e confiante. Você não tem medo de mostrar sua feminilidade.',
    imageUrl: '/estilos/sexy-personal.jpg',
    guideImageUrl: '/estilos/sexy-guide.jpg',
    keywords: ['sedutor', 'confiante', 'feminino', 'marcante', 'poderosa'],
    image: '/estilos/sexy-personal.jpg',
    guideImage: '/estilos/sexy-guide.jpg',
    specialTips: ['Realce suas curvas', 'Confie na sua feminilidade']
  },

  dramático: {
    id: 'dramático',
    name: 'Dramático',
    type: 'dramático' as StyleType,
    score: 0,
    characteristics: ['marcante', 'impactante', 'contraste', 'geométrico', 'confiante'],
    recommendations: ['ombros marcados', 'preto e branco', 'acessórios statement'],
    colors: ['#000000', '#FFFFFF', '#E74C3C'],
    images: ['/estilos/dramatico-1.jpg', '/estilos/dramatico-2.jpg'],
    description: 'Seu estilo é marcante e impactante. Você não tem medo de se destacar.',
    imageUrl: '/estilos/dramatico-personal.jpg',
    guideImageUrl: '/estilos/dramatico-guide.jpg',
    keywords: ['marcante', 'impactante', 'contraste', 'geométrico', 'confiante'],
    image: '/estilos/dramatico-personal.jpg',
    guideImage: '/estilos/dramatico-guide.jpg',
    specialTips: ['Use contrastes marcantes', 'Invista em acessórios statement']
  },

  criativo: {
    id: 'criativo',
    name: 'Criativo',
    type: 'criativo' as StyleType,
    score: 0,
    characteristics: ['único', 'expressivo', 'experimental', 'colorido', 'criativo'],
    recommendations: ['estampas mixadas', 'cores vibrantes', 'acessórios únicos'],
    colors: ['#9C27B0', '#FF9800', '#2196F3'],
    images: ['/estilos/criativo-1.jpg', '/estilos/criativo-2.jpg'],
    description: 'Seu estilo é único e expressivo. Você adora experimentar e misturar estampas.',
    imageUrl: '/estilos/criativo-personal.jpg',
    guideImageUrl: '/estilos/criativo-guide.jpg',
    keywords: ['único', 'expressivo', 'experimental', 'colorido', 'criativo'],
    image: '/estilos/criativo-personal.jpg',
    guideImage: '/estilos/criativo-guide.jpg',
    specialTips: ['Misture estampas', 'Seja ousada com as cores']
  }
};

// Legacy compatibility exports
export const styleConfigGisele = STYLE_DEFINITIONS;
export const styleMapping = STYLE_DEFINITIONS;
export type StyleId = keyof typeof STYLE_DEFINITIONS;

// Export compatibility
export default STYLE_DEFINITIONS;