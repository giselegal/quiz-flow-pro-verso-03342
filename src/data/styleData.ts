
import { StyleResult, StyleData } from '@/types/quiz';

export const ALL_STYLES = {
  elegante: 'elegante',
  romantico: 'romantico',
  criativo: 'criativo',
  dramatico: 'dramatico',
  natural: 'natural',
  sexy: 'sexy',
  classico: 'classico',
  moderno: 'moderno'
} as const;

export const styleResults: Record<StyleResult, StyleData> = {
  elegante: {
    name: 'Elegante',
    description: 'Você valoriza sofisticação e refinamento',
    image: '/placeholder-elegante.jpg',
    recommendations: ['Peças clássicas', 'Cores neutras', 'Cortes limpos'],
    additionalStyles: ['classico', 'moderno']
  },
  romantico: {
    name: 'Romântico',
    description: 'Você adora feminilidade e delicadeza',
    image: '/placeholder-romantico.jpg',
    recommendations: ['Estampas florais', 'Cores suaves', 'Texturas delicadas'],
    additionalStyles: ['elegante', 'natural']
  },
  criativo: {
    name: 'Criativo',
    description: 'Você expressa personalidade através da moda',
    image: '/placeholder-criativo.jpg',
    recommendations: ['Peças únicas', 'Combinações ousadas', 'Acessórios marcantes'],
    additionalStyles: ['dramatico', 'moderno']
  },
  dramatico: {
    name: 'Dramático',
    description: 'Você gosta de causar impacto visual',
    image: '/placeholder-dramatico.jpg',
    recommendations: ['Silhuetas marcantes', 'Cores vibrantes', 'Contrastes fortes'],
    additionalStyles: ['criativo', 'sexy']
  },
  natural: {
    name: 'Natural',
    description: 'Você prioriza conforto e autenticidade',
    image: '/placeholder-natural.jpg',
    recommendations: ['Tecidos naturais', 'Cores terrosas', 'Cortes confortáveis'],
    additionalStyles: ['romantico', 'classico']
  },
  sexy: {
    name: 'Sexy',
    description: 'Você valoriza sensualidade e confiança',
    image: '/placeholder-sexy.jpg',
    recommendations: ['Cortes ajustados', 'Decotes estratégicos', 'Cores intensas'],
    additionalStyles: ['dramatico', 'elegante']
  },
  classico: {
    name: 'Clássico',
    description: 'Você aprecia peças atemporais e versáteis',
    image: '/placeholder-classico.jpg',
    recommendations: ['Básicos de qualidade', 'Cores neutras', 'Cortes tradicionais'],
    additionalStyles: ['elegante', 'natural']
  },
  moderno: {
    name: 'Moderno',
    description: 'Você acompanha tendências contemporâneas',
    image: '/placeholder-moderno.jpg',
    recommendations: ['Peças atuais', 'Tecnologia têxtil', 'Designs inovadores'],
    additionalStyles: ['criativo', 'elegante']
  }
};
