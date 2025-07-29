
import React from 'react';
import { cn } from '../../../lib/utils';
import type { BlockData } from '../../../types/blocks';

// Import only existing components
import OptionsGridBlock from './OptionsGridBlock';
import VerticalCanvasHeaderBlock from './VerticalCanvasHeaderBlock';
import HeadingInlineBlock from './HeadingInlineBlock';
import ImageInlineBlock from './ImageInlineBlock';
import ButtonInlineBlock from './ButtonInlineBlock';
import CTAInlineBlock from './CTAInlineBlock';

export interface BlockRendererProps {
  block: BlockData;
  isSelected?: boolean;
  onClick?: () => void;
  onSaveInline?: (blockId: string, updates: Partial<BlockData>) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Universal Block Renderer - Renders blocks based on their type
 */
export const UniversalBlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isSelected = false,
  onClick,
  onSaveInline,
  disabled = false,
  className
}) => {
  // Common props for all components
  const commonProps = {
    block,
    isSelected,
    onClick,
    onPropertyChange: (key: string, value: any) => {
      if (onSaveInline) {
        const updatedBlock = {
          ...block,
          properties: { ...block.properties, [key]: value }
        };
        onSaveInline(block.id, updatedBlock);
      }
    },
    disabled,
    className: cn(
      'w-full transition-all duration-200',
      'border border-gray-200 rounded-lg shadow-sm bg-white',
      'hover:shadow-md hover:border-blue-300',
      isSelected && 'ring-2 ring-blue-500 border-blue-400 bg-blue-50',
      !disabled && 'cursor-pointer',
      className
    )
  };

  // Simple component mapping with only existing components
  const renderComponent = () => {
    switch (block.type) {
      case 'heading':
      case 'header':
      case 'title':
        return <HeadingInlineBlock {...commonProps} />;
      
      case 'image':
      case 'image-inline':
        return <ImageInlineBlock {...commonProps} />;
      
      case 'button':
      case 'button-inline':
        return <ButtonInlineBlock {...commonProps} />;
      
      case 'cta':
      case 'cta-inline':
        return <CTAInlineBlock {...commonProps} />;
      
      case 'options-grid':
      case 'quiz-options':
        return <OptionsGridBlock {...commonProps} />;
      
      case 'vertical-canvas-header':
      case 'quiz-header':
        return <VerticalCanvasHeaderBlock {...commonProps} />;
      
      case 'text':
      default:
        // Fallback component for text and unknown types
        return (
          <div 
            className={cn(
              'p-4 min-h-[60px] flex items-center',
              'border-2 border-dashed border-gray-300 rounded-lg',
              'bg-gray-50 text-center text-gray-500',
              isSelected && 'border-blue-500 bg-blue-50',
              !disabled && 'hover:bg-gray-100'
            )}
            onClick={onClick}
          >
            <div className="w-full">
              <p className="text-sm font-medium">
                {block.type === 'text' ? 'Bloco de Texto' : `Componente: ${block.type}`}
              </p>
              <p className="text-xs mt-1">
                {block.properties?.text || 'Clique para editar'}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="universal-block-renderer w-full">
      {renderComponent()}
    </div>
  );
};

export default UniversalBlockRenderer;
