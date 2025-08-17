import { Block } from './editor';

export interface InlineBlockBaseProperties {
  [key: string]: any;
}

export interface InlineBlockProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
  className?: string;
}

export interface UseInlineBlockReturn {
  block: Block;
  isSelected: boolean;
  onClick: () => void;
  onPropertyChange: (key: string, value: any) => void;
  disabled: boolean;
  className?: string;
  // Additional properties for compatibility
  properties: Record<string, any>;
  commonProps: {
    block: Block;
    isSelected: boolean;
    onClick?: () => void;
    onPropertyChange?: (key: string, value: any) => void;
    className?: string;
  };
}
