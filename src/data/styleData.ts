
import { StyleResult } from '@/types/quiz';

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

export const styleResults: Record<StyleResult, any> = {
  elegante: {
    image: '/placeholder-elegante.jpg',
    description: 'Você valoriza sofisticação e refinamento',
    recommendations: ['Peças clássicas', 'Cores neutras', 'Cortes limpos'],
    additionalStyles: ['classico', 'moderno']
  },
  romantico: {
    image: '/placeholder-romantico.jpg',
    description: 'Você adora feminilidade e delicadeza',
    recommendations: ['Estampas florais', 'Cores suaves', 'Texturas delicadas'],
    additionalStyles: ['elegante', 'natural']
  },
  criativo: {
    image: '/placeholder-criativo.jpg',
    description: 'Você expressa personalidade através da moda',
    recommendations: ['Peças únicas', 'Combinações ousadas', 'Acessórios marcantes'],
    additionalStyles: ['dramatico', 'moderno']
  },
  dramatico: {
    image: '/placeholder-dramatico.jpg',
    description: 'Você gosta de causar impacto visual',
    recommendations: ['Silhuetas marcantes', 'Cores vibrantes', 'Contrastes fortes'],
    additionalStyles: ['criativo', 'sexy']
  },
  natural: {
    image: '/placeholder-natural.jpg',
    description: 'Você prioriza conforto e autenticidade',
    recommendations: ['Tecidos naturais', 'Cores terrosas', 'Cortes confortáveis'],
    additionalStyles: ['romantico', 'classico']
  },
  sexy: {
    image: '/placeholder-sexy.jpg',
    description: 'Você valoriza sensualidade e confiança',
    recommendations: ['Cortes ajustados', 'Decotes estratégicos', 'Cores intensas'],
    additionalStyles: ['dramatico', 'elegante']
  },
  classico: {
    image: '/placeholder-classico.jpg',
    description: 'Você aprecia peças atemporais e versáteis',
    recommendations: ['Básicos de qualidade', 'Cores neutras', 'Cortes tradicionais'],
    additionalStyles: ['elegante', 'natural']
  },
  moderno: {
    image: '/placeholder-moderno.jpg',
    description: 'Você acompanha tendências contemporâneas',
    recommendations: ['Peças atuais', 'Tecnologia têxtil', 'Designs inovadores'],
    additionalStyles: ['criativo', 'elegante']
  }
};
