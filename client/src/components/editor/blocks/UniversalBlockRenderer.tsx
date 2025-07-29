
import React from 'react';
import { cn } from '../../../lib/utils';
import type { BlockData } from '../../../types/blocks';

// === COMPONENTES BÁSICOS FUNCIONAIS ===
import QuizQuestionBlock from './QuizQuestionBlock';
import QuizProgressBlock from './QuizProgressBlock';
import QuestionMultipleBlock from './QuestionMultipleBlock';
import StrategicQuestionBlock from './StrategicQuestionBlock';
import QuizTransitionBlock from './QuizTransitionBlock';
import OptionsGridBlock from './OptionsGridBlock';
import VerticalCanvasHeaderBlock from './VerticalCanvasHeaderBlock';
import { SpacerBlock } from './SpacerBlock';
import { VideoPlayerBlock } from './VideoPlayerBlock';
import FormInputBlock from './FormInputBlock';
import ListBlock from './ListBlock';
import HeadingInlineBlock from './HeadingInlineBlock';
import ImageInlineBlock from './ImageInlineBlock';
import ButtonInlineBlock from './ButtonInlineBlock';
import CTAInlineBlock from './CTAInlineBlock';

// === COMPONENTES INLINE EXISTENTES ===
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
import QuizIntroHeaderBlock from './inline/QuizIntroHeaderBlock';
import CountdownInlineBlock from './inline/CountdownInlineBlock';
import StyleCardInlineBlock from './inline/StyleCardInlineBlock';
import ResultCardInlineBlock from './inline/ResultCardInlineBlock';
import BeforeAfterInlineBlock from './inline/BeforeAfterInlineBlock';

// === COMPONENTES MODERNOS ===
import TestimonialsGridBlock from './TestimonialsGridBlock';
import FAQSectionBlock from './FAQSectionBlock';
import GuaranteeBlock from './GuaranteeBlock';

export interface BlockRendererProps {
  block: BlockData;
  isSelected?: boolean;
  onClick?: () => void;
  onSaveInline?: (blockId: string, updates: Partial<BlockData>) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Universal Block Renderer - Versão Corrigida
 * Remove importações inexistentes e foca nos componentes realmente disponíveis
 */
export const UniversalBlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isSelected = false,
  onClick,
  onSaveInline,
  disabled = false,
  className
}) => {
  // Props comuns para todos os componentes
  const createCommonProps = () => ({
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
      className
    )
  });

  // Fallback component para tipos não encontrados
  const FallbackComponent: React.FC<{ blockType: string }> = ({ blockType }) => (
    <div className={cn(
      'p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50',
      'text-center text-gray-600'
    )}>
      <p className="font-medium">Componente: {blockType}</p>
      <p className="text-sm text-gray-500 mt-1">
        Clique para editar este bloco
      </p>
    </div>
  );

  // Renderizar componente baseado no tipo
  const renderComponent = () => {
    const commonProps = createCommonProps();

    // Mapeamento direto de tipos para componentes
    const componentMap: Record<string, React.ComponentType<any>> = {
      // === COMPONENTES BÁSICOS ===
      'text': TextInlineBlock,
      'header': HeadingInlineBlock,
      'heading': HeadingInlineBlock,
      'image': ImageDisplayInlineBlock,
      'button': ButtonInlineBlock,
      'spacer': SpacerBlock,
      'form-input': FormInputBlock,
      'list': ListBlock,
      
      // === COMPONENTES INLINE ===
      'text-inline': TextInlineBlock,
      'heading-inline': HeadingInlineBlock,
      'button-inline': ButtonInlineBlock,
      'badge-inline': BadgeInlineBlock,
      'progress-inline': ProgressInlineBlock,
      'image-display-inline': ImageDisplayInlineBlock,
      'style-card-inline': StyleCardInlineBlock,
      'result-card-inline': ResultCardInlineBlock,
      'result-header-inline': ResultHeaderInlineBlock,
      'before-after-inline': BeforeAfterInlineBlock,
      'step-header-inline': StepHeaderInlineBlock,
      'testimonial-card-inline': TestimonialCardInlineBlock,
      'countdown-inline': CountdownInlineBlock,
      'stat-inline': StatInlineBlock,
      'pricing-card-inline': PricingCardInlineBlock,
      
      // === COMPONENTES QUIZ ===
      'quiz-intro-header': QuizIntroHeaderBlock,
      'loading-animation': LoadingAnimationBlock,
      'options-grid': OptionsGridBlock,
      'quiz-question': QuizQuestionBlock,
      'quiz-progress': QuizProgressBlock,
      'question-multiple': QuestionMultipleBlock,
      'strategic-question': StrategicQuestionBlock,
      'quiz-transition': QuizTransitionBlock,
      'vertical-canvas-header': VerticalCanvasHeaderBlock,
      
      // === COMPONENTES MODERNOS ===
      'testimonials': TestimonialsGridBlock,
      'faq-section': FAQSectionBlock,
      'guarantee': GuaranteeBlock,
      'video-player': VideoPlayerBlock,
      'cta': CTAInlineBlock,
      
      // === ALIASES COMUNS ===
      'quiz-title': HeadingInlineBlock,
      'quiz-name-input': FormInputBlock,
      'quiz-result-header': ResultHeaderInlineBlock,
      'quiz-result-card': ResultCardInlineBlock,
      'quiz-offer-title': HeadingInlineBlock,
      'quiz-offer-countdown': CountdownInlineBlock,
      'product-offer': PricingCardInlineBlock,
      'urgency-timer': CountdownInlineBlock,
    };

    const ComponentToRender = componentMap[block.type];

    if (ComponentToRender) {
      return <ComponentToRender {...commonProps} />;
    }

    // Fallback para tipos não mapeados
    return (
      <div {...commonProps}>
        <FallbackComponent blockType={block.type} />
      </div>
    );
  };

  return (
    <div className={cn(
      'universal-block-renderer',
      'flex flex-col w-full',
      'transition-all duration-300 ease-out'
    )}>
      {renderComponent()}
    </div>
  );
};

export default UniversalBlockRenderer;
