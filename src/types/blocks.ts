
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

// User response interface
export interface UserResponse {
  questionId: string;
  optionId: string;
  timestamp?: Date;
}

export const createBlockData = (type: string): BlockData => ({
  id: `block-${Date.now()}`,
  type,
  properties: {},
  content: {},
  order: 0
});

// Extended interfaces for specific block types
export interface CountdownTimerBlock extends BlockData {
  type: "countdown-timer";
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
    theme?: 'default' | 'urgent' | 'elegant';
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    borderRadius?: string;
    padding?: string;
    showProgress?: boolean;
  };
  content: Record<string, any>;
  order: number;
}

export interface FAQBlock extends BlockData {
  type: "faq";
  properties: {
    title?: string;
    subtitle?: string;
    faqs?: Array<{ id: string; question: string; answer: string }>;
    layout?: 'minimal' | 'cards' | 'accordion';
    showSearch?: boolean;
    allowMultipleOpen?: boolean;
    expandFirstItem?: boolean;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    searchPlaceholder?: string;
  };
  content: Record<string, any>;
  order: number;
}

export interface PriceComparisonBlock extends BlockData {
  type: "price-comparison";
  properties: {
    title?: string;
    subtitle?: string;
    plans?: Array<{
      id: string;
      name: string;
      price: string;
      originalPrice?: string;
      features: string[];
      isPopular?: boolean;
      buttonText?: string;
      buttonUrl?: string;
    }>;
    layout?: 'table' | 'cards' | 'minimal';
    showPopularBadge?: boolean;
    showOriginalPrice?: boolean;
    currency?: string;
    billingPeriod?: string;
    cardStyle?: 'modern' | 'classic' | 'minimal' | 'gradient';
  };
  content: Record<string, any>;
  order: number;
}
