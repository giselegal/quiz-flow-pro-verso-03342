
export interface BlockDefinition {
  id: string;
  type: string;
  name: string;
  category: string;
  icon?: string;
  description?: string;
  isNew?: boolean;
  defaultProps?: Record<string, any>;
}

export interface BlockData {
  id: string;
  type: string;
  properties?: Record<string, any>;
}

export interface Block {
  id: string;
  type: string;
  content: Record<string, any>;
  order?: number;
}

export interface BlockComponentProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
  onUpdate?: (updates: any) => void;
  onDelete?: () => void;
  className?: string;
}

export interface CountdownTimerProps {
  duration: number;
  onComplete: () => void;
  showIcon?: boolean;
  size?: string;
  color?: string;
}

export interface ResultCardProps {
  data: any;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  size?: string;
}

export interface OfferCardProps {
  data: any;
  showDiscount?: boolean;
  onPurchase?: () => void;
}
