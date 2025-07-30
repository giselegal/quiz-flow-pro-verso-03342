
import React from 'react';
import { EditorBlock } from '@/types/editor';
import { StyleResult } from '@/types/quiz';
import { QuizIntroHeaderBlock } from './QuizIntroHeaderBlock';
import { QuizQuestionBlock } from './QuizQuestionBlock';
import { QuizResultBlock } from './QuizResultBlock';
import { HeadlineBlock } from './HeadlineBlock';
import { TextBlock } from './TextBlock';
import { ImageBlock } from './ImageBlock';
import { CTABlock } from './CTABlock';
import { SpacerBlock } from './SpacerBlock';
import { BenefitsBlock } from './BenefitsBlock';
import { TestimonialBlock } from './TestimonialBlock';
import { PricingBlock } from './PricingBlock';

interface BlockRendererProps {
  block: EditorBlock;
  isSelected?: boolean;
  isPreviewing?: boolean;
  onSelect?: (id: string) => void;
  primaryStyle?: StyleResult;
  index?: number;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isSelected = false,
  isPreviewing = false,
  onSelect,
  primaryStyle,
  index = 0
}) => {
  console.log('🔍 [BlockRenderer] Renderizando bloco:', {
    id: block.id,
    type: block.type,
    index,
    isSelected
  });

  const handleClick = () => {
    if (!isPreviewing && onSelect) {
      onSelect(block.id);
    }
  };

  const renderBlockContent = () => {
    // Ensure unique key by combining block.id with index
    const uniqueKey = `${block.type}-${block.id}-${index}`;
    
    switch (block.type) {
      case 'quiz-intro-header':
        return (
          <QuizIntroHeaderBlock 
            key={uniqueKey}
            {...block.content} 
          />
        );
      
      case 'quiz-question':
        return (
          <QuizQuestionBlock 
            key={uniqueKey}
            block={block}
            isPreviewing={isPreviewing}
          />
        );
      
      case 'quiz-result':
        return (
          <QuizResultBlock 
            key={uniqueKey}
            primaryStyle={primaryStyle}
            {...block.content}
          />
        );
      
      case 'headline':
        return (
          <HeadlineBlock 
            key={uniqueKey}
            {...block.content}
          />
        );
      
      case 'text':
        return (
          <TextBlock 
            key={uniqueKey}
            {...block.content}
          />
        );
      
      case 'image':
        return (
          <ImageBlock 
            key={uniqueKey}
            {...block.content}
          />
        );
      
      case 'cta':
      case 'button':
        return (
          <CTABlock 
            key={uniqueKey}
            {...block.content}
          />
        );
      
      case 'spacer':
        return (
          <SpacerBlock 
            key={uniqueKey}
            {...block.content}
          />
        );
      
      case 'benefits':
        return (
          <BenefitsBlock 
            key={uniqueKey}
            {...block.content}
          />
        );
      
      case 'testimonials':
        return (
          <TestimonialBlock 
            key={uniqueKey}
            {...block.content}
          />
        );
      
      case 'pricing':
        return (
          <PricingBlock 
            key={uniqueKey}
            {...block.content}
          />
        );
      
      default:
        return (
          <div 
            key={uniqueKey}
            className="p-4 border border-dashed border-gray-300 rounded-md bg-gray-50 text-center"
          >
            <p className="text-gray-500">
              Componente: <strong>{block.type}</strong>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Editor não implementado
            </p>
          </div>
        );
    }
  };

  return (
    <div
      className={`
        relative group transition-all duration-200 cursor-pointer
        ${isSelected && !isPreviewing ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
        ${!isPreviewing ? 'hover:ring-1 hover:ring-blue-300 hover:ring-opacity-30' : ''}
      `}
      onClick={handleClick}
    >
      {renderBlockContent()}
      
      {/* Selection indicator */}
      {isSelected && !isPreviewing && (
        <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          Selecionado
        </div>
      )}
    </div>
  );
};
