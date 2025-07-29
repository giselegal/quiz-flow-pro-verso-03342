
import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockData } from '@/types/blocks';

// === COMPONENTES BÁSICOS FUNCIONAIS ===
import QuizQuestionBlock from '../../../components/editor/blocks/QuizQuestionBlock';
import QuizProgressBlock from '../../../components/editor/blocks/QuizProgressBlock';
import QuestionMultipleBlock from '../../../components/editor/blocks/QuestionMultipleBlock';
import StrategicQuestionBlock from '../../../components/editor/blocks/StrategicQuestionBlock';
import QuizTransitionBlock from '../../../components/editor/blocks/QuizTransitionBlock';
import OptionsGridBlock from '../../../components/editor/blocks/OptionsGridBlock';
import VerticalCanvasHeaderBlock from '../../../components/editor/blocks/VerticalCanvasHeaderBlock';
import { SpacerBlock } from '../../../components/editor/blocks/SpacerBlock';
import { VideoPlayerBlock } from '../../../components/editor/blocks/VideoPlayerBlock';
import FormInputBlock from '../../../components/editor/blocks/FormInputBlock';
import ListBlock from '../../../components/editor/blocks/ListBlock';
import HeadingInlineBlock from '../../../components/editor/blocks/HeadingInlineBlock';
import ImageInlineBlock from '../../../components/editor/blocks/ImageInlineBlock';
import ButtonInlineBlock from '../../../components/editor/blocks/ButtonInlineBlock';
import CTAInlineBlock from '../../../components/editor/blocks/CTAInlineBlock';

// === COMPONENTES INLINE EXISTENTES ===
import TextInlineBlock from '../../../components/editor/blocks/inline/TextInlineBlock';
import BadgeInlineBlock from '../../../components/editor/blocks/inline/BadgeInlineBlock';
import ProgressInlineBlock from '../../../components/editor/blocks/inline/ProgressInlineBlock';
import ImageDisplayInlineBlock from '../../../components/editor/blocks/inline/ImageDisplayInlineBlock';
import PricingCardInlineBlock from '../../../components/editor/blocks/inline/PricingCardInlineBlock';
import TestimonialCardInlineBlock from '../../../components/editor/blocks/inline/TestimonialCardInlineBlock';
import ResultHeaderInlineBlock from '../../../components/editor/blocks/inline/ResultHeaderInlineBlock';
import StepHeaderInlineBlock from '../../../components/editor/blocks/inline/StepHeaderInlineBlock';
import StatInlineBlock from '../../../components/editor/blocks/inline/StatInlineBlock';
import LoadingAnimationBlock from '../../../components/editor/blocks/inline/LoadingAnimationBlock';
import QuizIntroHeaderBlock from '../../../components/editor/blocks/inline/QuizIntroHeaderBlock';
import CountdownInlineBlock from '../../../components/editor/blocks/inline/CountdownInlineBlock';
import StyleCardInlineBlock from '../../../components/editor/blocks/inline/StyleCardInlineBlock';
import ResultCardInlineBlock from '../../../components/editor/blocks/inline/ResultCardInlineBlock';
import BeforeAfterInlineBlock from '../../../components/editor/blocks/inline/BeforeAfterInlineBlock';

// === COMPONENTES MODERNOS ===
import TestimonialsGridBlock from '../../../components/editor/blocks/TestimonialsGridBlock';
import FAQSectionBlock from '../../../components/editor/blocks/FAQSectionBlock';
import GuaranteeBlock from '../../../components/editor/blocks/GuaranteeBlock';

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
