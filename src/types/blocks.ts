import { generateSemanticId } from '../utils/semanticIdGenerator';
import { Block, BlockType } from './editor';

export interface BlockData {
  id: string;
  type: string;
  properties: Record<string, any>;
  content: Record<string, any>;
  order: number;
}

export interface BlockDefinition {
  type: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  defaultProps: Record<string, any>;
  properties: Record<string, any>;
  subBlocks?: string[]; // Lista de tipos de blocos que podem ser usados como subcomponentes
}

export interface BlockComponentProps {
  id?: string;
  block: BlockData;
  type?: string;
  properties?: Record<string, any>;
  isSelected?: boolean;
  isEditing?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  className?: string;
}

// Extended FAQ Item interface with all properties
export interface ExtendedFAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  isHighlight?: boolean;
  tags?: string[];
}

// User response interface
export interface UserResponse {
  questionId: string;
  optionId: string;
  selectedOptions?: string[];
  timestamp?: Date;
}

export const createDefaultBlock = (type: BlockType, stageId: string): Block => {
  // Gerar ID semântico baseado no contexto
  const semanticId = generateSemanticId({
    context: stageId,
    type: 'block',
    identifier: type,
    index: 1, // Será atualizado pelo EditorContext com a ordem correta
  });

  return {
    id: semanticId,
    type,
    properties: {}, // Propriedades serão definidas pelo componente
    content: {}, // Conteúdo será definido pelo componente
    order: 1, // Ordem será atualizada pelo EditorContext
    stageId,
  } as Block;
};

// Extended interfaces for specific block types - all properly extending BlockData
export interface CountdownTimerBlock extends BlockData {
  type: 'countdown-timer';
  content: {
    title?: string;
    subtitle?: string;
    endDate?: string;
    durationMinutes?: number;
    urgencyText?: string;
    showDays?: boolean;
    showHours?: boolean;
    showMinutes?: boolean;
    showSeconds?: boolean;
    size?: 'sm' | 'md' | 'lg';
    theme?: 'default' | 'urgent' | 'elegant' | 'minimal' | 'neon';
    layout?: 'compact' | 'cards' | 'digital' | 'circular';
    autoStart?: boolean;
    showUrgencyMessages?: boolean;
    urgencyThreshold?: number;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    borderRadius?: string;
    padding?: string;
    pulseAnimation?: boolean;
    showProgress?: boolean;
  };
  properties: {
    title?: string;
    subtitle?: string;
    endDate?: string;
    durationMinutes?: number;
    urgencyText?: string;
    showDays?: boolean;
    showHours?: boolean;
    showMinutes?: boolean;
    showSeconds?: boolean;
    size?: 'sm' | 'md' | 'lg';
    theme?: 'default' | 'urgent' | 'elegant' | 'minimal' | 'neon';
    layout?: 'compact' | 'cards' | 'digital' | 'circular';
    autoStart?: boolean;
    showUrgencyMessages?: boolean;
    urgencyThreshold?: number;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    borderRadius?: string;
    padding?: string;
    pulseAnimation?: boolean;
    showProgress?: boolean;
  };
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  isHighlight?: boolean;
  tags?: string[];
}

export interface FAQBlock extends BlockData {
  type: 'faq';
  content: {
    title?: string;
    subtitle?: string;
    faqs?: FAQItem[];
    layout?: 'minimal' | 'cards' | 'accordion';
    showSearch?: boolean;
    showCategories?: boolean;
    allowMultipleOpen?: boolean;
    animateEntrance?: boolean;
    expandFirstItem?: boolean;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    cardStyle?: 'modern' | 'classic' | 'rounded' | 'flat';
    searchPlaceholder?: string;
  };
  properties: {
    title?: string;
    subtitle?: string;
    faqs?: FAQItem[];
    layout?: 'minimal' | 'cards' | 'accordion';
    showSearch?: boolean;
    showCategories?: boolean;
    allowMultipleOpen?: boolean;
    animateEntrance?: boolean;
    expandFirstItem?: boolean;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    cardStyle?: 'modern' | 'classic' | 'rounded' | 'flat';
    searchPlaceholder?: string;
  };
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  features: string[];
  isPopular?: boolean;
  buttonText?: string;
  buttonUrl?: string;
}

export interface PriceComparisonBlock extends BlockData {
  type: 'price-comparison';
  content: {
    title?: string;
    subtitle?: string;
    plans?: PricingPlan[];
    layout?: 'table' | 'cards' | 'minimal';
    showPopularBadge?: boolean;
    showOriginalPrice?: boolean;
    currency?: string;
    billingPeriod?: string;
    cardStyle?: 'modern' | 'classic' | 'minimal' | 'gradient';
  };
  properties: {
    title?: string;
    subtitle?: string;
    plans?: PricingPlan[];
    layout?: 'table' | 'cards' | 'minimal';
    showPopularBadge?: boolean;
    showOriginalPrice?: boolean;
    currency?: string;
    billingPeriod?: string;
    cardStyle?: 'modern' | 'classic' | 'minimal' | 'gradient';
  };
}

export interface ProsConsItem {
  id: string;
  text: string;
  icon?: string;
  highlight?: boolean;
}

export interface ProsConsBlock extends BlockData {
  type: 'pros-cons';
  content: {
    title?: string;
    subtitle?: string;
    prosTitle?: string;
    consTitle?: string;
    pros: ProsConsItem[];
    cons: ProsConsItem[];
    layout?: 'side-by-side' | 'stacked';
    prosColor?: string;
    consColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  properties: {
    title?: string;
    subtitle?: string;
    prosTitle?: string;
    consTitle?: string;
    pros: ProsConsItem[];
    cons: ProsConsItem[];
    layout?: 'side-by-side' | 'stacked';
    prosColor?: string;
    consColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

export interface Stat {
  id: string;
  value: string;
  label: string;
  icon?: string;
  color?: string;
}

export interface StatsMetricsBlock extends BlockData {
  type: 'stats-metrics';
  content: {
    title?: string;
    subtitle?: string;
    stats?: Stat[];
    layout?: 'grid' | 'horizontal' | 'vertical' | 'cards';
    columns?: number;
    showIcons?: boolean;
    animateCountUp?: boolean;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
  };
  properties: {
    title?: string;
    subtitle?: string;
    stats?: Stat[];
    layout?: 'grid' | 'horizontal' | 'vertical' | 'cards';
    columns?: number;
    showIcons?: boolean;
    animateCountUp?: boolean;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
  };
}
