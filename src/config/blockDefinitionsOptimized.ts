// =====================================================================
// BLOCOS OTIMIZADOS E BEM ESTRUTURADOS
// Configuração das 21 etapas do funil com componentes mais organizados
// =====================================================================

// Import the unified PropertySchema for future migration
import { PropertySchema as UnifiedPropertySchema, optimizedToUnified } from '@/types/propertySchema';

// Keep original types for this file to maintain compatibility
export type PropertyInputType =
  | 'text-input'
  | 'textarea'
  | 'number-input'
  | 'boolean-switch'
  | 'color-picker'
  | 'select'
  | 'image-url'
  | 'video-url'
  | 'array-editor'
  | 'json-editor';

export interface PropertyOption {
  label: string;
  value: string;
}

// Use legacy PropertySchema interface for now (to maintain compatibility)
export interface PropertySchema {
  key: string;
  label: string;
  type: PropertyInputType;
  placeholder?: string;
  options?: PropertyOption[];
  defaultValue?: any;
  rows?: number;
  min?: number;
  max?: number;
  description?: string;
  nestedPath?: string;
  itemSchema?: PropertySchema[];
}

// Migration utility to convert to unified schema when needed
export function convertToUnifiedSchema(schema: PropertySchema): UnifiedPropertySchema {
  return optimizedToUnified(schema);
}

export interface BlockDefinition {
  type: string;
  name: string;
  description?: string;
  icon?: string;
  category?: string;
  isNew?: boolean;
  propertiesSchema?: PropertySchema[];
}

export const blockDefinitions: BlockDefinition[] = [
  // =====================================================================
  // ETAPA 20 - COMPONENTES ELEGANTES DA MARCA GISELE GALVÃO
  // Paleta: #B89B7A (Dourado), #432818 (Marrom), #aa6b5d (Rosé)
  // =====================================================================

  {
    type: 'header-boxflex-inline',
    name: 'Header do Resultado',
    description: 'Cabeçalho elegante com logo da Gisele Galvão e resultado personalizado',
    icon: 'Crown',
    category: 'Resultado Elegante',
    isNew: true,
    propertiesSchema: [
      {
        key: 'logo',
        label: 'Logo da Marca',
        type: 'image-url',
        defaultValue:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      },
      {
        key: 'title',
        label: 'Título do Resultado',
        type: 'text-input',
        defaultValue: 'Seu Estilo Único Foi Descoberto!',
      },
      {
        key: 'subtitle',
        label: 'Subtítulo',
        type: 'text-input',
        defaultValue: 'Baseado nas suas respostas, criamos seu perfil personalizado',
      },
    ],
  },

  {
    type: 'result-main-boxflex-inline',
    name: 'Estilo Principal',
    description: 'Resultado principal com estilo detectado e porcentagem real da marca',
    icon: 'Sparkles',
    category: 'Resultado Elegante',
    isNew: true,
    propertiesSchema: [
      {
        key: 'styleName',
        label: 'Nome do Estilo',
        type: 'select',
        options: [
          { label: 'Natural', value: 'Natural' },
          { label: 'Clássico', value: 'Clássico' },
          { label: 'Romântico', value: 'Romântico' },
          { label: 'Moderno', value: 'Moderno' },
          { label: 'Dramático', value: 'Dramático' },
        ],
        defaultValue: 'Natural',
      },
      {
        key: 'percentage',
        label: 'Porcentagem do Estilo',
        type: 'number-input',
        min: 40,
        max: 100,
        defaultValue: 78,
      },
      {
        key: 'description',
        label: 'Descrição Personalizada',
        type: 'textarea',
        defaultValue:
          'Você tem um estilo autêntico e descomplicado. Suas escolhas refletem naturalidade e praticidade, valorizando o conforto sem abrir mão da elegância.',
        rows: 3,
      },
      {
        key: 'styleImage',
        label: 'Imagem do Estilo',
        type: 'image-url',
        defaultValue: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp',
      },
    ],
  },

  {
    type: 'secondary-styles-boxflex-inline',
    name: 'Estilos Secundários',
    description: 'Outros estilos presentes na personalidade com cores elegantes da marca',
    icon: 'BarChart3',
    category: 'Resultado Elegante',
    isNew: true,
    propertiesSchema: [
      {
        key: 'secondaryStyles',
        label: 'Lista de Estilos Secundários',
        type: 'json-editor',
        defaultValue: [
          { name: 'Clássico', percentage: 15, color: '#B89B7A' },
          { name: 'Moderno', percentage: 7, color: '#aa6b5d' },
        ],
      },
    ],
  },

  {
    type: 'before-after-boxflex-inline',
    name: 'Transformação Elegante',
    description: 'Seção antes/depois com design sofisticado da marca Gisele Galvão',
    icon: 'RefreshCw',
    category: 'Resultado Elegante',
    isNew: true,
    propertiesSchema: [
      {
        key: 'beforeTitle',
        label: 'Título "Antes"',
        type: 'text-input',
        defaultValue: 'Antes do Quiz',
      },
      {
        key: 'beforeText',
        label: 'Texto "Antes"',
        type: 'text-input',
        defaultValue: 'Dúvidas sobre qual estilo combina comigo',
      },
      {
        key: 'afterTitle',
        label: 'Título "Depois"',
        type: 'text-input',
        defaultValue: 'Agora Você Sabe',
      },
      {
        key: 'afterText',
        label: 'Texto "Depois"',
        type: 'text-input',
        defaultValue: 'Clareza total sobre seu estilo único',
      },
      {
        key: 'beforeImage',
        label: 'Imagem "Antes"',
        type: 'image-url',
        defaultValue:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1746334756/ChatGPT_Image_4_de_mai._de_2025_01_42_42_jlugsc.webp',
      },
      {
        key: 'afterImage',
        label: 'Imagem "Depois"',
        type: 'image-url',
        defaultValue:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1746334754/ChatGPT_Image_4_de_mai._de_2025_00_30_44_naqom0.webp',
      },
    ],
  },

  {
    type: 'motivation-boxflex-inline',
    name: 'Motivação Elegante',
    description: 'Frase motivacional sofisticada baseada no estilo detectado',
    icon: 'Heart',
    category: 'Resultado Elegante',
    isNew: true,
    propertiesSchema: [
      {
        key: 'motivationText',
        label: 'Frase Motivacional',
        type: 'textarea',
        defaultValue: 'Vista-se de você — na prática, com o seu Guia de Estilo Personalizado',
        rows: 2,
      },
    ],
  },

  {
    type: 'bonus-boxflex-inline',
    name: 'Bônus Elegantes',
    description: 'Lista refinada de bônus inclusos no guia personalizado da marca',
    icon: 'Gift',
    category: 'Resultado Elegante',
    isNew: true,
    propertiesSchema: [
      {
        key: 'bonusList',
        label: 'Lista de Bônus Premium',
        type: 'array-editor',
        defaultValue: [
          'Guia de Peças Essenciais para seu Estilo Natural - R$ 79,00',
          'Visagismo Facial Personalizado - R$ 29,00',
          'Checklist de Compras por Estilo',
        ],
      },
    ],
  },

  {
    type: 'testimonials-boxflex-inline',
    name: 'Depoimentos Elegantes',
    description: 'Depoimentos sofisticados de clientes que fizeram o quiz',
    icon: 'MessageCircle',
    category: 'Resultado Elegante',
    isNew: true,
    propertiesSchema: [
      {
        key: 'testimonials',
        label: 'Depoimentos Verificados',
        type: 'array-editor',
        defaultValue: [
          'Finalmente entendi meu estilo! O quiz foi preciso e o guia é incrível. Recomendo!',
          'Mudou completamente minha forma de me vestir. Agora sei o que funciona para mim!',
        ],
      },
    ],
  },

  {
    type: 'cta-green-boxflex-inline',
    name: 'CTA Premium',
    description: 'Call-to-action elegante otimizado para conversão com design da marca',
    icon: 'ShoppingBag',
    category: 'Resultado Elegante',
    isNew: true,
    propertiesSchema: [
      {
        key: 'ctaText',
        label: 'Texto do CTA',
        type: 'text-input',
        defaultValue: 'Garantir Meu Guia + Bônus Especiais',
      },
    ],
  },

  {
    type: 'guarantee-boxflex-inline',
    name: 'Garantia Elegante',
    description: 'Garantia sofisticada com política de devolução clara da marca',
    icon: 'Shield',
    category: 'Resultado Elegante',
    isNew: true,
    propertiesSchema: [
      {
        key: 'guaranteeText',
        label: 'Texto da Garantia',
        type: 'textarea',
        defaultValue:
          '7 dias de garantia total. Se não ficar satisfeita, devolvemos 100% do seu dinheiro',
        rows: 2,
      },
    ],
  },

  {
    type: 'mentor-boxflex-inline',
    name: 'Sobre a Gisele',
    description: 'Informações elegantes sobre a mentora e especialista',
    icon: 'User',
    category: 'Resultado Elegante',
    isNew: true,
    propertiesSchema: [
      {
        key: 'mentorImage',
        label: 'Foto da Mentora',
        type: 'image-url',
        defaultValue:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911667/WhatsApp_Image_2025-04-02_at_09.40.53_cv8p5y.webp',
      },
      {
        key: 'mentorText',
        label: 'Texto da Mentora',
        type: 'text-input',
        defaultValue: 'Gisele Galvão - Especialista em Imagem e Estilo Pessoal',
      },
    ],
  },

  {
    type: 'value-stack-boxflex-inline',
    name: 'Valor Premium',
    description: 'Cálculo elegante do valor total vs. oferta especial da marca',
    icon: 'TrendingUp',
    category: 'Resultado Elegante',
    isNew: true,
    propertiesSchema: [
      {
        key: 'stackList',
        label: 'Itens do Pacote',
        type: 'array-editor',
        defaultValue: [
          'Guia principal - R$ 67,00',
          'Bônus Peças-chave - R$ 79,00',
          'Bônus Visagismo - R$ 29,00',
        ],
      },
      {
        key: 'totalValue',
        label: 'Valor Total Real',
        type: 'text-input',
        defaultValue: 'R$ 175,00',
      },
      {
        key: 'offerValue',
        label: 'Preço Especial',
        type: 'text-input',
        defaultValue: 'R$ 39,00',
      },
    ],
  },

  {
    type: 'build-info-boxflex-inline',
    name: 'Informações do Sistema',
    description: 'Dados técnicos elegantes e versão do quiz para suporte',
    icon: 'Settings',
    category: 'Resultado Elegante',
    isNew: true,
    propertiesSchema: [
      {
        key: 'buildInfo',
        label: 'Informações do Build',
        type: 'text-input',
        defaultValue: 'v1.0.0 - 2025-01-15',
      },
    ],
  },
];

export default blockDefinitions;
