
import React from 'react';
import { cn } from '../../../lib/utils';
import type { BlockData } from '../../../types/blocks';

// Import existing components
import OptionsGridBlock from './OptionsGridBlock';
import VerticalCanvasHeaderBlock from './VerticalCanvasHeaderBlock';
import HeadingInlineBlock from './HeadingInlineBlock';
import ImageInlineBlock from './ImageInlineBlock';
import ButtonInlineBlock from './ButtonInlineBlock';
import CTAInlineBlock from './CTAInlineBlock';
import TextInlineBlock from './TextInlineBlock';

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

  // Enhanced component mapping with better coverage
  const renderComponent = () => {
    switch (block.type) {
      case 'heading':
      case 'header':
      case 'title':
      case 'heading-inline':
      case 'quiz-title':
        return <HeadingInlineBlock {...commonProps} />;
      
      case 'text':
      case 'text-inline':
      case 'paragraph':
      case 'description':
        return <TextInlineBlock {...commonProps} />;
      
      case 'image':
      case 'image-inline':
        return <ImageInlineBlock {...commonProps} />;
      
      case 'button':
      case 'button-inline':
        return <ButtonInlineBlock {...commonProps} />;
      
      case 'cta':
      case 'cta-inline':
      case 'call-to-action':
        return <CTAInlineBlock {...commonProps} />;
      
      case 'options-grid':
      case 'quiz-options':
      case 'options':
        return <OptionsGridBlock {...commonProps} />;
      
      case 'vertical-canvas-header':
      case 'quiz-header':
      case 'canvas-header':
        return <VerticalCanvasHeaderBlock {...commonProps} />;
      
      default:
        // Enhanced fallback component with better UX
        return (
          <div 
            className={cn(
              'p-4 min-h-[80px] flex items-center justify-center',
              'border-2 border-dashed border-gray-300 rounded-lg',
              'bg-gray-50 text-center text-gray-500 transition-all duration-200',
              isSelected && 'border-blue-500 bg-blue-50 text-blue-600',
              !disabled && 'hover:bg-gray-100 hover:border-gray-400'
            )}
            onClick={onClick}
          >
            <div className="w-full">
              <div className="text-sm font-medium mb-1">
                📦 {block.type || 'Componente Desconhecido'}
              </div>
              <div className="text-xs text-gray-400">
                {block.properties?.text || 
                 block.properties?.content || 
                 block.properties?.title || 
                 'Clique para editar este bloco'}
              </div>
              {isSelected && (
                <div className="text-xs text-blue-500 mt-2">
                  ✏️ Selecionado - Use o painel de propriedades
                </div>
              )}
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
