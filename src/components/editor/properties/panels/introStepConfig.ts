import { PropertyCategory, PropertyType } from '@/hooks/useUnifiedProperties';
import type { BaseProperty } from '../core/types';

const BRAND_COLORS = {
  primary: '#B89B7A',
  text: '#432818',
  background: '#FAF9F7',
};

export const DEFAULT_INTRO_PROPERTIES: BaseProperty[] = [
  // Propriedades do cabeçalho
  {
    key: 'logoUrl',
    type: PropertyType.URL,
    label: 'URL da Logo',
    category: PropertyCategory.CONTENT,
    value:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
  },
  {
    key: 'logoAlt',
    type: PropertyType.TEXT,
    label: 'Texto Alternativo da Logo',
    category: PropertyCategory.ACCESSIBILITY,
    value: 'Logo',
  },
  {
    key: 'logoWidth',
    type: PropertyType.NUMBER,
    label: 'Largura da Logo',
    category: PropertyCategory.STYLE,
    value: 96,
  },
  {
    key: 'logoHeight',
    type: PropertyType.NUMBER,
    label: 'Altura da Logo',
    category: PropertyCategory.STYLE,
    value: 96,
  },

  // Propriedades de conteúdo
  {
    key: 'title',
    type: PropertyType.TEXT,
    label: 'Título Principal',
    category: PropertyCategory.CONTENT,
    value: 'Descubra Seu Estilo Predominante',
  },
  {
    key: 'subtitle',
    type: PropertyType.TEXT,
    label: 'Subtítulo',
    category: PropertyCategory.CONTENT,
    value: 'Quiz personalizado para descobrir seu estilo único',
  },
  {
    key: 'imageUrl',
    type: PropertyType.URL,
    label: 'URL da Imagem',
    category: PropertyCategory.CONTENT,
    value: '',
  },

  // Propriedades do campo de input
  {
    key: 'inputLabel',
    type: PropertyType.TEXT,
    label: 'Label do Campo',
    category: PropertyCategory.CONTENT,
    value: 'NOME *',
  },
  {
    key: 'inputPlaceholder',
    type: PropertyType.TEXT,
    label: 'Placeholder',
    category: PropertyCategory.CONTENT,
    value: 'Digite seu nome',
  },
  {
    key: 'required',
    type: PropertyType.SWITCH,
    label: 'Campo Obrigatório',
    category: PropertyCategory.BEHAVIOR,
    value: true,
  },

  // Propriedades do botão
  {
    key: 'buttonText',
    type: PropertyType.TEXT,
    label: 'Texto do Botão',
    category: PropertyCategory.CONTENT,
    value: 'Iniciar Quiz',
  },
  {
    key: 'buttonColor',
    type: PropertyType.COLOR,
    label: 'Cor do Botão',
    category: PropertyCategory.STYLE,
    value: BRAND_COLORS.primary,
  },

  // Propriedades de estilo
  {
    key: 'backgroundColor',
    type: PropertyType.COLOR,
    label: 'Cor de Fundo',
    category: PropertyCategory.STYLE,
    value: BRAND_COLORS.background,
  },
  {
    key: 'textColor',
    type: PropertyType.COLOR,
    label: 'Cor do Texto',
    category: PropertyCategory.STYLE,
    value: BRAND_COLORS.text,
  },
];

// Configuração dos middlewares
export const introStepMiddlewares = {
  beforeUpdate: [
    (value: any) => {
      if (typeof value === 'string') {
        return value.trim();
      }
      return value;
    },
  ],
  validation: [
    (property: BaseProperty) => {
      // Validações específicas por tipo de propriedade
      switch (property.key) {
        case 'logoWidth':
        case 'logoHeight':
          return property.value >= 24 && property.value <= 240;
        case 'title':
          return property.value.length <= 100;
        case 'subtitle':
          return property.value.length <= 200;
        case 'inputLabel':
          return property.value.trim().length > 0;
        default:
          return true;
      }
    },
  ],
  afterUpdate: [
    (property: BaseProperty) => {
      // Transformações específicas por tipo de propriedade
      switch (property.key) {
        case 'buttonText':
          return property.value.trim();
        case 'inputLabel':
          return property.value.toUpperCase();
        default:
          return property.value;
      }
    },
  ],
};

// Configuração completa do painel
export const introStepConfig = {
  properties: DEFAULT_INTRO_PROPERTIES,
  middlewares: introStepMiddlewares,
};
