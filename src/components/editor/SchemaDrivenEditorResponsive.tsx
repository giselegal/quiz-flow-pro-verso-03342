
import React from 'react';
import { EditorBlock } from '@/types/editor';

// Import existing inline components
import TextInlineBlock from './inline/TextInlineBlock';
import BadgeInlineBlock from './inline/BadgeInlineBlock';
import ProgressInlineBlock from './inline/ProgressInlineBlock';
import ImageDisplayInlineBlock from './inline/ImageDisplayInlineBlock';
import PricingCardInlineBlock from './inline/PricingCardInlineBlock';
import TestimonialCardInlineBlock from './inline/TestimonialCardInlineBlock';
import ResultHeaderInlineBlock from './inline/ResultHeaderInlineBlock';
import StepHeaderInlineBlock from './inline/StepHeaderInlineBlock';
import StatInlineBlock from './inline/StatInlineBlock';
import LoadingAnimationBlock from './inline/LoadingAnimationBlock';
import CountdownInlineBlock from './inline/CountdownInlineBlock';
import StyleCardInlineBlock from './inline/StyleCardInlineBlock';
import ResultCardInlineBlock from './inline/ResultCardInlineBlock';

// Import other block components
import HeadingInlineBlock from './inline/HeadingInlineBlock';
import ButtonInlineBlock from './ButtonInlineBlock';
import SpacerBlock from './SpacerBlock';
import FormInputBlock from './FormInputBlock';
import OptionsGridBlock from './OptionsGridBlock';
import QuizQuestionBlock from './QuizQuestionBlock';
import QuizProgressBlock from './QuizProgressBlock';
import VerticalCanvasHeaderBlock from './VerticalCanvasHeaderBlock';

// Import quiz header component
import QuizIntroHeaderBlock from '../quiz/QuizIntroHeaderBlock';

export interface BlockRendererProps {
  block: EditorBlock;
  isSelected?: boolean;
  onClick?: () => void;
  onUpdate?: (content: any) => void;
  className?: string;
}

// Fallback component for unknown block types
const FallbackBlock: React.FC<BlockRendererProps> = ({ block, onClick, className }) => (
  <div 
    className={`p-4 border-2 border-dashed border-yellow-400 bg-yellow-50 rounded-lg cursor-pointer ${className || ''}`}
    onClick={onClick}
  >
    <div className="text-sm text-yellow-800">
      <strong>Componente não encontrado</strong>
      <br />
      Tipo: {block.type}
    </div>
  </div>
);

// Basic text block for simple fallbacks
const BasicTextBlock: React.FC<BlockRendererProps> = ({ block, onClick, className }) => (
  <div 
    className={`p-4 cursor-pointer ${className || ''}`}
    onClick={onClick}
  >
    <p className="text-gray-800">
      {block.content?.text || block.content?.title || 'Texto do bloco'}
    </p>
  </div>
);

export const UniversalBlockRenderer: React.FC<{
  type: string;
  block: EditorBlock;
  onClick?: () => void;
  className?: string;
}> = ({ type, block, onClick, className }) => {
  const commonProps = {
    block,
    onClick,
    className,
    isSelected: false,
    onUpdate: () => {}
  };

  // Component mapping with fallbacks
  const componentMap: Record<string, () => React.ReactElement> = {
    // Basic components
    'heading': () => <HeadingInlineBlock {...commonProps} />,
    'text': () => <BasicTextBlock {...commonProps} />,
    'button': () => <ButtonInlineBlock {...commonProps} />,
    'spacer': () => <SpacerBlock {...commonProps} />,
    'form-input': () => <FormInputBlock {...commonProps} />,
    
    // Quiz components
    'quiz-intro-header': () => <QuizIntroHeaderBlock {...commonProps} />,
    'quiz-question': () => <QuizQuestionBlock {...commonProps} />,
    'quiz-progress': () => <QuizProgressBlock {...commonProps} />,
    'options-grid': () => <OptionsGridBlock {...commonProps} />,
    'vertical-canvas-header': () => <VerticalCanvasHeaderBlock {...commonProps} />,
    
    // Inline components with safe checks
    'text-inline': () => <BasicTextBlock {...commonProps} />,
    'heading-inline': () => <HeadingInlineBlock {...commonProps} />,
    'button-inline': () => <ButtonInlineBlock {...commonProps} />,
    'badge-inline': () => <BasicTextBlock {...commonProps} />,
    'progress-inline': () => <FallbackBlock {...commonProps} />,
    'image-display-inline': () => <FallbackBlock {...commonProps} />,
    'style-card-inline': () => <FallbackBlock {...commonProps} />,
    'countdown-inline': () => <BasicTextBlock {...commonProps} />,
    'stat-inline': () => <BasicTextBlock {...commonProps} />,
    'pricing-card-inline': () => <FallbackBlock {...commonProps} />,
    'testimonial-card-inline': () => <FallbackBlock {...commonProps} />,
    'result-header-inline': () => <FallbackBlock {...commonProps} />,
    'step-header-inline': () => <BasicTextBlock {...commonProps} />,
    'result-card-inline': () => <FallbackBlock {...commonProps} />,
    'loading-animation': () => <FallbackBlock {...commonProps} />,
  };

  try {
    const ComponentRenderer = componentMap[type];
    
    if (ComponentRenderer) {
      return ComponentRenderer();
    }
    
    // Fallback for unknown types
    return <FallbackBlock {...commonProps} />;
    
  } catch (error) {
    console.error(`Error rendering block type "${type}":`, error);
    return <FallbackBlock {...commonProps} />;
  }
};

// Export function to check if a block type is registered
export const isBlockTypeRegistered = (type: string): boolean => {
  const registeredTypes = [
    'heading', 'text', 'button', 'spacer', 'form-input',
    'quiz-intro-header', 'quiz-question', 'quiz-progress', 'options-grid', 'vertical-canvas-header',
    'text-inline', 'heading-inline', 'button-inline', 'badge-inline', 'progress-inline',
    'image-display-inline', 'style-card-inline', 'countdown-inline', 'stat-inline',
    'pricing-card-inline', 'testimonial-card-inline', 'result-header-inline', 'step-header-inline',
    'result-card-inline', 'loading-animation'
  ];
  
  return registeredTypes.includes(type);
};

export default UniversalBlockRenderer;
