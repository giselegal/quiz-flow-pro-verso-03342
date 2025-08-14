import React from 'react';

// Universal interface for all block components to fix TypeScript errors
export interface BlockComponentProps {
  block?: any;
  properties?: Record<string, any>;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  className?: string;
  
  // Quiz-specific props
  isPreviewMode?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  canProceed?: boolean;
  sessionId?: string;
  
  // Layout props
  containerWidth?: "full" | "large" | "medium" | "small";
  containerPosition?: "center" | "left" | "right";
  spacing?: string;
  marginTop?: number;
  marginBottom?: number;
  paddingTop?: number;
  paddingBottom?: number;
  backgroundColor?: string;
  borderRadius?: number;
  shadow?: string;
  scale?: number;
  
  // Allow any additional props for flexibility
  [key: string]: any;
}

// Type definition for components that accept these props
export type BlockComponent = React.ComponentType<BlockComponentProps>;

// Type assertion helper for lazy components
export const asBlockComponent = (component: any): BlockComponent => component as BlockComponent;