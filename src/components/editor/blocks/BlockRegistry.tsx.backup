import React from 'react';

// Import all block components
import ProductCarouselBlock from './ProductCarouselBlock';
import BeforeAfterBlock from './BeforeAfterBlock';
import BenefitsListBlock from './BenefitsListBlock';
import PriceComparisonBlock from './PriceComparisonBlock';
import CountdownTimerBlock from './CountdownTimerBlock';
import FAQBlock from './FAQBlock';
import TestimonialsBlock from './TestimonialsBlock';
import ComparisonTableBlock from './ComparisonTableBlock';
import SocialProofBlock from './SocialProofBlock';
import AdvancedCTABlock from './AdvancedCTABlock';
import StatsMetricsBlock from './StatsMetricsBlock';
import QuizQuestionBlock from './QuizQuestionBlock';

// Novos componentes independentes
import ProgressBarStepBlock from './ProgressBarStepBlock';
import AnimatedStatCounterBlock from './AnimatedStatCounterBlock';
import QuizOfferCountdownBlock from './QuizOfferCountdownBlock';

// Legacy blocks - can be imported if they exist
// import OptionsGridBlock from './OptionsGridBlock';

// Define the component registry type with looser typing for flexibility
export type BlockComponent = React.FC<any>;

// Registry of all available block components
export const BLOCK_COMPONENTS: Record<string, BlockComponent> = {
  // Modern blocks
  'product-carousel': ProductCarouselBlock as BlockComponent,
  'before-after': BeforeAfterBlock as BlockComponent,
  'benefits-list': BenefitsListBlock as BlockComponent,
  'price-comparison': PriceComparisonBlock as BlockComponent,
  'countdown-timer': CountdownTimerBlock as BlockComponent,
  'faq-section': FAQBlock as BlockComponent,
  'testimonials-grid': TestimonialsBlock as BlockComponent,
  'comparison-table': ComparisonTableBlock as BlockComponent,
  'social-proof': SocialProofBlock as BlockComponent,
  'advanced-cta': AdvancedCTABlock as BlockComponent,
  'stats-metrics': StatsMetricsBlock as BlockComponent,

  // Quiz blocks
  'quiz-question': QuizQuestionBlock as BlockComponent,

  // Novos componentes independentes
  'progress-bar-step': ProgressBarStepBlock as BlockComponent,
  'animated-stat-counter': AnimatedStatCounterBlock as BlockComponent,
  'quiz-offer-countdown': QuizOfferCountdownBlock as BlockComponent,

  // Legacy blocks (if they exist)
  // 'options-grid': OptionsGridBlock,
} as const;

// Type for valid block types
export type BlockType = keyof typeof BLOCK_COMPONENTS;

// Function to get a component by type
export function getBlockComponent(type: string): BlockComponent | null {
  return BLOCK_COMPONENTS[type as BlockType] || null;
}

// Function to check if a block type is registered
export function isBlockTypeRegistered(type: string): type is BlockType {
  return type in BLOCK_COMPONENTS;
}

// Function to get all registered block types
export function getRegisteredBlockTypes(): string[] {
  return Object.keys(BLOCK_COMPONENTS);
}

// Universal block renderer component
interface UniversalBlockRendererProps {
  type: string;
  block: any;
  isSelected?: boolean;
  isEditing?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  className?: string;
}

export const UniversalBlockRenderer: React.FC<UniversalBlockRendererProps> = ({ type, ...props }) => {
  const Component = getBlockComponent(type);

  if (!Component) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full" />
          <h3 className="font-medium text-stone-700">Componente não encontrado</h3>
        </div>
        <p className="text-sm text-stone-700">O tipo de bloco "{type}" não está registrado no sistema.</p>
        <p className="text-xs text-yellow-600 mt-2">
          Verifique se o componente foi importado e adicionado ao registro.
        </p>
      </div>
    );
  }

  return <Component {...props} />;
};

// Hook to use block components with validation
export function useBlockComponent(type: string) {
  const component = getBlockComponent(type);
  const isRegistered = isBlockTypeRegistered(type);

  return {
    component,
    isRegistered,
    render: (props: any) => <UniversalBlockRenderer type={type} {...props} />,
  };
}

// Categories for organizing blocks in the UI
export const BLOCK_CATEGORIES = {
  Vendas: ['product-carousel', 'price-comparison', 'comparison-table', 'advanced-cta'] as string[],
  Credibilidade: ['testimonials-grid', 'social-proof', 'before-after', 'stats-metrics'] as string[],
  Conteúdo: ['benefits-list', 'faq-section'] as string[],
  Urgência: ['countdown-timer'] as string[],
} as const;

// Function to get blocks by category
export function getBlocksByCategory(category: keyof typeof BLOCK_CATEGORIES): string[] {
  return [...(BLOCK_CATEGORIES[category] || [])];
}

// Function to get category for a block type
export function getBlockCategory(type: string): keyof typeof BLOCK_CATEGORIES | null {
  for (const [category, blocks] of Object.entries(BLOCK_CATEGORIES)) {
    if (blocks.includes(type)) {
      return category as keyof typeof BLOCK_CATEGORIES;
    }
  }
  return null;
}

// Metadata for blocks (can be extended)
export interface BlockMetadata {
  name: string;
  description: string;
  icon: string;
  isNew?: boolean;
  isPremium?: boolean;
  version?: string;
  tags?: string[];
}

export const BLOCK_METADATA: Record<string, BlockMetadata> = {
  'product-carousel': {
    name: 'Carrossel de Produtos',
    description: 'Showcase interativo de produtos com animações e filtros',
    icon: 'ShoppingCart',
    isNew: true,
    tags: ['vendas', 'produtos', 'carrossel'],
  },
  'before-after': {
    name: 'Antes e Depois',
    description: 'Demonstre transformações com comparações visuais',
    icon: 'ArrowRightLeft',
    tags: ['transformação', 'comparação', 'visual'],
  },
  'benefits-list': {
    name: 'Lista de Benefícios',
    description: 'Liste vantagens e benefícios de forma atrativa',
    icon: 'CheckCircle',
    tags: ['benefícios', 'lista', 'vantagens'],
  },
  'price-comparison': {
    name: 'Comparação de Preços',
    description: 'Compare diferentes opções de preços e planos',
    icon: 'Scale',
    tags: ['preços', 'comparação', 'planos'],
  },
  'countdown-timer': {
    name: 'Timer de Urgência',
    description: 'Crie senso de urgência com countdown personalizado',
    icon: 'Clock',
    tags: ['urgência', 'timer', 'limitado'],
  },
  'faq-section': {
    name: 'Perguntas Frequentes',
    description: 'Seção de FAQ com acordeão expansível',
    icon: 'HelpCircle',
    tags: ['faq', 'perguntas', 'ajuda'],
  },
  'testimonials-grid': {
    name: 'Grade de Depoimentos',
    description: 'Exiba depoimentos de clientes de forma profissional',
    icon: 'Quote',
    tags: ['depoimentos', 'clientes', 'social'],
  },
  'comparison-table': {
    name: 'Tabela de Comparação',
    description: 'Compare recursos entre diferentes planos ou produtos',
    icon: 'Scale',
    isNew: true,
    tags: ['comparação', 'tabela', 'recursos'],
  },
  'social-proof': {
    name: 'Prova Social',
    description: 'Mostre estatísticas e atividades em tempo real',
    icon: 'Users',
    isNew: true,
    tags: ['social', 'prova', 'estatísticas'],
  },
  'advanced-cta': {
    name: 'CTA Avançado',
    description: 'Call-to-action com countdown, garantias e animações',
    icon: 'Zap',
    isNew: true,
    isPremium: true,
    tags: ['cta', 'conversão', 'avançado'],
  },
  'stats-metrics': {
    name: 'Estatísticas e Métricas',
    description: 'Exiba números e conquistas de forma impactante',
    icon: 'TrendingUp',
    isNew: true,
    tags: ['estatísticas', 'métricas', 'números'],
  },
};

// Function to get metadata for a block
export function getBlockMetadata(type: string): BlockMetadata | null {
  return BLOCK_METADATA[type] || null;
}

// Function to search blocks by name or tags
export function searchBlocks(query: string): string[] {
  const lowercaseQuery = query.toLowerCase();
  return getRegisteredBlockTypes().filter(type => {
    const metadata = getBlockMetadata(type);
    if (!metadata) return false;

    return (
      metadata.name.toLowerCase().includes(lowercaseQuery) ||
      metadata.description.toLowerCase().includes(lowercaseQuery) ||
      (metadata.tags && metadata.tags.some(tag => tag.includes(lowercaseQuery)))
    );
  });
}

export default BLOCK_COMPONENTS;
