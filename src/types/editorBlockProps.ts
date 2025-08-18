// Comprehensive prop types for editor blocks to resolve TypeScript errors

export interface EditorBlockBaseProps {
  block?: any;
  id?: string;
  properties?: Record<string, any>;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  className?: string;
  children?: React.ReactNode;
}

export interface EditorCanvasBlockProps extends EditorBlockBaseProps {
  containerWidth?: 'full' | 'large' | 'medium' | 'small';
  containerPosition?: 'center' | 'left' | 'right';
  spacing?: 'normal' | 'none' | 'small' | 'compact' | 'horizontal-only' | string;
  marginTop?: number;
  marginBottom?: number;
  paddingTop?: number;
  paddingBottom?: number;
  backgroundColor?: string;
  borderRadius?: number;
  shadow?: string;
  scale?: number;
}

export interface SortableBlockProps extends EditorCanvasBlockProps {
  isPreviewMode?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  canProceed?: boolean;
  sessionId?: string;
}

// Universal component that accepts all possible props
export interface UniversalComponentProps extends SortableBlockProps {
  [key: string]: any; // Allow any additional props
}

export default EditorBlockBaseProps;
