import React from 'react';
import { cn } from '../../../lib/utils';
import type { BlockData } from '../../../types/blocks';

// === COMPONENTE DE FALLBACK ===
import FallbackBlock from './FallbackBlock';
import EnhancedFallbackBlock from './EnhancedFallbackBlock';
import BasicTextBlock from './BasicTextBlock';

// === COMPONENTES PRINCIPAIS DO SISTEMA ===
// Componentes de quiz (funcionais)
import QuizQuestionBlock from './QuizQuestionBlock';
import QuizProgressBlock from './QuizProgressBlock';
import QuestionMultipleBlock from './QuestionMultipleBlock';
import StrategicQuestionBlock from './StrategicQuestionBlock';
import QuizTransitionBlock from './QuizTransitionBlock';
import OptionsGridBlock from './OptionsGridBlock';
import VerticalCanvasHeaderBlock from './VerticalCanvasHeaderBlock';

// === COMPONENTES BÁSICOS ESSENCIAIS ===
import HeadingInlineBlock from './HeadingInlineBlock';
import ImageInlineBlock from './ImageInlineBlock';
import ButtonInlineBlock from './ButtonInlineBlock';
import CTAInlineBlock from './CTAInlineBlock';
import { SpacerBlock } from './SpacerBlock';
import FormInputBlock from './FormInputBlock';
import ListBlock from './ListBlock';
import ScriptBlock from './ScriptBlock';

// === COMPONENTES INLINE MODULARES (com verificação de existência) ===
// Desabilitado para evitar problemas de dynamic imports
let TextInlineBlock: any;
let StyleCardInlineBlock: any;
let StatInlineBlock: any;
let BadgeInlineBlock: any;
let ProgressInlineBlock: any;
let ImageDisplayInlineBlock: any;
let PricingCardInlineBlock: any;
let TestimonialCardInlineBlock: any;
let CountdownInlineBlock: any;
let LoadingAnimationBlock: any;

// === IMPORTANDO COMPONENTES INLINE ESSENCIAIS ===
try {
  CountdownInlineBlock = require('./inline/CountdownInlineBlock').default;
} catch (e) {
  console.warn('CountdownInlineBlock não disponível');
}

try {
  PricingCardInlineBlock = require('./inline/PricingCardInlineBlock').default;
} catch (e) {
  console.warn('PricingCardInlineBlock não disponível');
}

try {
  TextInlineBlock = require('./inline/TextInlineBlock').default;
} catch (e) {
  console.warn('TextInlineBlock não disponível');
}

try {
  BadgeInlineBlock = require('./inline/BadgeInlineBlock').default;
} catch (e) {
  console.warn('BadgeInlineBlock não disponível');
}

try {
  StatInlineBlock = require('./inline/StatInlineBlock').default;
} catch (e) {
  console.warn('StatInlineBlock não disponível');
}

// Novos componentes inline criados
import ResultHeaderInlineBlock from './inline/ResultHeaderInlineBlock';
import ResultCardInlineBlock from './inline/ResultCardInlineBlock';
import BeforeAfterInlineBlock from './inline/BeforeAfterInlineBlock';
import BonusListInlineBlock from './inline/BonusListInlineBlock';
import StepHeaderInlineBlock from './inline/StepHeaderInlineBlock';

// Novos componentes modulares para etapas 20 e 21 (temporariamente desabilitados)
import ResultPageHeaderBlock from './ResultPageHeaderBlock';

// Componentes modernos (funcionais)
import TestimonialsGridBlock from './TestimonialsGridBlock';
import FAQSectionBlock from './FAQSectionBlock';
import GuaranteeBlock from './GuaranteeBlock';
import TestimonialsBlock from './TestimonialsBlock';
import QuizStartPageBlock from './QuizStartPageBlock';

export interface BlockRendererProps {
  block: BlockData;
  isSelected?: boolean;
  onClick?: () => void;
  onSaveInline?: (blockId: string, updates: Partial<BlockData>) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Universal Block Renderer for Schema-Driven Editor (ALL INLINE HORIZONTAL)
 * Renders any block type based on its type property
 * All components are now inline-editable with horizontal flexbox layout
 * Implements responsive, mobile-first design with max 2 columns
 */
export const UniversalBlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isSelected = false,
  onClick,
  onSaveInline,
  disabled = false,
  className
}) => {
  // ES7+ Props comuns padronizados para flexbox inline responsivo
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
      // ES7+ Flexbox container responsivo padronizado
      'flex flex-wrap items-start gap-2 sm:gap-4',
      'w-full min-h-[60px] transition-all duration-300 ease-out',
      // Background e padding responsivos
      'bg-white p-2 sm:p-3 md:p-4 rounded-lg',
      // Estados visuais modernos
      isSelected && 'ring-2 ring-blue-500/50 bg-blue-50/30 shadow-md',
      !disabled && 'hover:bg-gray-50/80 hover:shadow-sm cursor-pointer',
      // Responsividade avançada
      'max-w-full overflow-hidden',
      className
    )
  };

  // TODOS os componentes são agora inline - removido conceito de não-inline
  const isInlineBlock = (blockType: string): boolean => {
    return true; // Todos são inline agora
  };

  // ES7+ Sistema responsivo simplificado - SEM wrapper duplo
  const renderComponent = () => {
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
      className: cn(
        // Responsividade nativa mobile-first
        'w-full transition-all duration-200',
        'border border-gray-200 rounded-lg shadow-sm bg-white',
        'hover:shadow-md hover:border-blue-300',
        isSelected && 'ring-2 ring-blue-500 border-blue-400 bg-blue-50'
      )
    };

    const componentMap: Record<string, () => React.ReactNode> = {
      // === COMPONENTES BÁSICOS ESSENCIAIS ===
      'heading': () => <HeadingInlineBlock {...commonProps} />,
      'text': () => TextInlineBlock ? <TextInlineBlock {...commonProps} /> : <BasicTextBlock {...commonProps} />,
      'image': () => <ImageInlineBlock {...commonProps} />,
      'button': () => <ButtonInlineBlock {...commonProps} />,
      'cta': () => <CTAInlineBlock {...commonProps} />,
      'spacer': () => <SpacerBlock {...commonProps} />,
      'form-input': () => <FormInputBlock {...commonProps} />,
      'list': () => <ListBlock {...commonProps} />,
      'script': () => <ScriptBlock {...commonProps} />,
      
      // === COMPONENTES QUIZ PRINCIPAIS ===
      'options-grid': () => <OptionsGridBlock {...commonProps} />,
      'vertical-canvas-header': () => <VerticalCanvasHeaderBlock {...commonProps} />,
      'quiz-question': () => <QuizQuestionBlock {...commonProps} />,
      'quiz-progress': () => <QuizProgressBlock {...commonProps} />,
      'quiz-transition': () => <QuizTransitionBlock {...commonProps} />,
      'quiz-start-page': () => <QuizStartPageBlock {...commonProps} />,
      'quiz-result-calculated': () => <FallbackBlock {...commonProps} blockType="quiz-result-calculated" />,
      
      // === COMPONENTES DAS 21 ETAPAS DO FUNIL ===
      'quiz-start-page-inline': () => <QuizStartPageBlock {...commonProps} />,
      'strategic-question-main': () => <QuizQuestionBlock {...commonProps} />,
      'quiz-final-results-inline': () => <FallbackBlock {...commonProps} blockType="quiz-final-results-inline" />,
      'quiz-offer-pricing-inline': () => <FallbackBlock {...commonProps} blockType="quiz-offer-pricing-inline" />,
      
      // === COMPONENTES MODERNOS CRIADOS 28/07 ===
      'guarantee': () => <GuaranteeBlock {...commonProps} />,
      'testimonials': () => <TestimonialsBlock {...commonProps} />,
      'testimonials-grid': () => <TestimonialsGridBlock {...commonProps} />,
      'faq-section': () => <FAQSectionBlock {...commonProps} />,
      
      // === COMPONENTES ADICIONAIS (com fallback) ===
      'quiz-question-configurable': () => <QuizQuestionBlock {...commonProps} />,
      'quiz-question-modern': () => <QuizQuestionBlock {...commonProps} />,
      'progress-bar-modern': () => <EnhancedFallbackBlock {...commonProps} blockType="progress-bar-modern" />,
      'image-text-card': () => <EnhancedFallbackBlock {...commonProps} blockType="image-text-card" />,
      'stats-counter': () => <EnhancedFallbackBlock {...commonProps} blockType="stats-counter" />,
      'testimonial-card': () => <EnhancedFallbackBlock {...commonProps} blockType="testimonial-card" />,
      'feature-highlight': () => <EnhancedFallbackBlock {...commonProps} blockType="feature-highlight" />,
      'section-divider': () => <EnhancedFallbackBlock {...commonProps} blockType="section-divider" />,
      'flex-container-horizontal': () => <EnhancedFallbackBlock {...commonProps} blockType="flex-container-horizontal" />,
      'flex-container-vertical': () => <EnhancedFallbackBlock {...commonProps} blockType="flex-container-vertical" />,
      
      // === COMPONENTES INLINE BÁSICOS (com fallback) ===
      'text-inline': () => TextInlineBlock ? <TextInlineBlock {...commonProps} /> : <BasicTextBlock {...commonProps} />,
      'heading-inline': () => <HeadingInlineBlock {...commonProps} />,
      'button-inline': () => <ButtonInlineBlock {...commonProps} />,
      'badge-inline': () => BadgeInlineBlock ? <BadgeInlineBlock {...commonProps} /> : <BasicTextBlock {...commonProps} />,
      'progress-inline': () => ProgressInlineBlock ? <ProgressInlineBlock {...commonProps} /> : <FallbackBlock {...commonProps} blockType="progress-inline" />,
      'image-display-inline': () => ImageDisplayInlineBlock ? <ImageDisplayInlineBlock {...commonProps} /> : <ImageInlineBlock {...commonProps} />,
      'style-card-inline': () => StyleCardInlineBlock ? <StyleCardInlineBlock {...commonProps} /> : <FallbackBlock {...commonProps} blockType="style-card-inline" />,
      'countdown-inline': () => CountdownInlineBlock ? <CountdownInlineBlock {...commonProps} /> : <BasicTextBlock {...commonProps} />,
      'countdown-timer-inline': () => CountdownInlineBlock ? <CountdownInlineBlock {...commonProps} /> : <BasicTextBlock {...commonProps} />,
      'countdown-timer-real': () => CountdownInlineBlock ? <CountdownInlineBlock {...commonProps} /> : <BasicTextBlock {...commonProps} />,
      'stat-inline': () => StatInlineBlock ? <StatInlineBlock {...commonProps} /> : <BasicTextBlock {...commonProps} />,
      'pricing-card-inline': () => PricingCardInlineBlock ? <PricingCardInlineBlock {...commonProps} /> : <FallbackBlock {...commonProps} blockType="pricing-card-inline" />,
      'price-highlight-inline': () => PricingCardInlineBlock ? <PricingCardInlineBlock {...commonProps} /> : <FallbackBlock {...commonProps} blockType="price-highlight-inline" />,
      
      // === COMPONENTES CTA MODERNOS ===
      'cta-button-modern': () => <ButtonInlineBlock {...commonProps} />,
      'cta-modern': () => <CTAInlineBlock {...commonProps} />,
      
      // === COMPONENTES DE LOADING ===
      'loading-animation': () => LoadingAnimationBlock ? <LoadingAnimationBlock {...commonProps} /> : <FallbackBlock {...commonProps} blockType="loading-animation" />,
    };

    // Renderizar com fallback
    const ComponentToRender = componentMap[block.type];
    if (ComponentToRender) {
      try {
        return ComponentToRender();
      } catch (error) {
        console.warn(`Erro ao renderizar componente ${block.type}:`, error);
        return <FallbackBlock {...commonProps} blockType={block.type} />;
      }
    }

    // Fallback padrão
    return <FallbackBlock {...commonProps} blockType={block.type} />;
  };

  return (
    <div className={cn(
      // Container principal responsivo
      'universal-block-renderer w-full',
      'transition-all duration-300 ease-out',
      className
    )}>
      {renderComponent()}
    </div>
  );
};

export default UniversalBlockRenderer;