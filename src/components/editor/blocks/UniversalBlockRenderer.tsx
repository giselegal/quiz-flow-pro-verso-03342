import React, { useMemo } from 'react';
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
import QuizIntroHeaderBlock from './QuizIntroHeaderBlock';

// === COMPONENTES BÁSICOS ESSENCIAIS ===
import HeadingInlineBlock from './HeadingInlineBlock';
import ImageInlineBlock from './ImageInlineBlock';
import ButtonInlineBlock from './ButtonInlineBlock';
import CTAInlineBlock from './CTAInlineBlock';
import { SpacerBlock } from './SpacerBlock';
import FormInputBlock from './FormInputBlock';
import ListBlock from './ListBlock';
import ScriptBlock from './ScriptBlock';

// === COMPONENTES REAIS QUE ESTAVAM COMO FALLBACK ===
import SectionDividerBlock from './SectionDividerBlock';
import StatsMetricsBlock from './StatsMetricsBlock';
import TwoColumnsBlock from './TwoColumnsBlock';
import TestimonialInlineBlock from './TestimonialInlineBlock';
import ProgressInlineBlock from './ProgressInlineBlock';
import StyleCardInlineBlock from './StyleCardInlineBlock';
import CTASectionInlineBlock from './CTASectionInlineBlock';
import BadgeInlineBlock from './BadgeInlineBlock';

// === COMPONENTES INLINE MODULARES (com verificação de existência) ===
// Desabilitado para evitar problemas de dynamic imports
let StatInlineBlock: any;
let PricingCardInlineBlock: any;
let TestimonialCardInlineBlock: any;
let CountdownInlineBlock: any;
let LoadingAnimationBlock: any;

// === IMPORTANDO COMPONENTES INLINE ESSENCIAIS ===
import ImageDisplayInlineBlock from './inline/ImageDisplayInlineBlock';
import TextInlineBlock from './inline/TextInlineBlock';
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
import LegalNoticeInlineBlock from './LegalNoticeInlineBlock';
import DecorativeBarInlineBlock from './DecorativeBarInlineBlock';

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
 * Universal Block Renderer for Schema-Driven Editor - VERSÃO OTIMIZADA ES7+
 * 
 * 🚀 RECURSOS MODERNOS IMPLEMENTADOS:
 * - ✅ useMemo para otimização de performance
 * - ✅ Componentes reais substituindo fallbacks feios
 * - ✅ TypeScript com type safety 
 * - ✅ Flexbox responsivo mobile-first
 * - ✅ Spreading operators ES7+ (...props)
 * - ✅ Template literals e arrow functions
 * 
 * 📦 COMPONENTES MAPEADOS (Real vs Fallback):
 * - stats-counter → StatsMetricsBlock ✅
 * - testimonial-card → TestimonialInlineBlock ✅  
 * - section-divider → SectionDividerBlock ✅
 * - progress-inline → ProgressInlineBlock ✅
 * - style-card-inline → StyleCardInlineBlock ✅
 * - badge-inline → BadgeInlineBlock ✅
 * - feature-highlight → CTASectionInlineBlock ✅
 * - flex-containers → TwoColumnsBlock ✅
 * 
 * 🎯 ARQUITETURA:
 * blockDefinitions.ts (schemas) → UniversalBlockRenderer.tsx (mapping) → ComponenteReal.tsx (visual)
 */
export const UniversalBlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isSelected = false,
  onClick,
  onSaveInline,
  disabled = false,
  className
}) => {
  // ES7+ Props otimizados com useMemo para melhor performance
  const commonProps = useMemo(() => ({
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
  }), [block, isSelected, onClick, onSaveInline, disabled, className]);

  // TODOS os componentes são agora inline - removido conceito de não-inline
  const isInlineBlock = (blockType: string): boolean => {
    return true; // Todos são inline agora
  };

  // ES7+ Sistema de renderização otimizado com useMemo
  const renderedComponent = useMemo(() => {
    const componentMap: Record<string, () => React.ReactNode> = {
      // === COMPONENTES BÁSICOS ESSENCIAIS ===
      'heading': () => <HeadingInlineBlock {...commonProps} />,
      'text': () => <TextInlineBlock {...commonProps} />,
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
      'quiz-intro-header': () => <QuizIntroHeaderBlock {...commonProps} />,
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
      
      // === COMPONENTES ADICIONAIS (agora com componentes reais) ===
      'quiz-question-configurable': () => <QuizQuestionBlock {...commonProps} />,
      'quiz-question-modern': () => <QuizQuestionBlock {...commonProps} />,
      'progress-bar-modern': () => <ProgressInlineBlock {...commonProps} />,
      'image-text-card': () => <TwoColumnsBlock {...commonProps} block={{...commonProps.block, type: 'two-columns'} as any} />,
      'stats-counter': () => <StatsMetricsBlock {...commonProps} block={{...commonProps.block, type: 'stats-metrics'} as any} />,
      'testimonial-card': () => <TestimonialInlineBlock {...commonProps} />,
      'feature-highlight': () => <CTASectionInlineBlock {...commonProps} />,
      'section-divider': () => <SectionDividerBlock {...commonProps} />,
      'flex-container-horizontal': () => <TwoColumnsBlock {...commonProps} block={{...commonProps.block, type: 'two-columns'} as any} />,
      'flex-container-vertical': () => <TwoColumnsBlock {...commonProps} block={{...commonProps.block, type: 'two-columns'} as any} />,
      
      // === COMPONENTES INLINE BÁSICOS (com fallback) ===
      'text-inline': () => <TextInlineBlock {...commonProps} />,
      'heading-inline': () => <HeadingInlineBlock {...commonProps} />,
      'badge-inline': () => <BadgeInlineBlock {...commonProps} />,
      'progress-inline': () => <ProgressInlineBlock {...commonProps} />,
      'image-display-inline': () => <ImageDisplayInlineBlock {...commonProps} />,
      'style-card-inline': () => <StyleCardInlineBlock {...commonProps} />,
      'legal-notice-inline': () => <LegalNoticeInlineBlock {...commonProps} />,
      'decorative-bar-inline': () => <DecorativeBarInlineBlock {...commonProps} />,
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

      // === COMPONENTES INDIVIDUALIZADOS E MODULARES ===
      'title-standalone': () => <HeadingInlineBlock {...commonProps} />,
      'subtitle-standalone': () => <HeadingInlineBlock {...commonProps} />,
      'single-button': () => <ButtonInlineBlock {...commonProps} />,
      'single-image': () => <ImageInlineBlock {...commonProps} />,
      'text-paragraph': () => <TextInlineBlock {...commonProps} />,
      'icon-standalone': () => <BadgeInlineBlock {...commonProps} />,
      'divider-line': () => <SectionDividerBlock {...commonProps} />,
      'spacing-block': () => <SpacerBlock {...commonProps} />,
      
      // === COMPONENTES DE RESULTADO ===
      'result-header-inline': () => <ResultHeaderInlineBlock {...commonProps} />,
      'result-card-inline': () => <ResultCardInlineBlock {...commonProps} />,
      'before-after-inline': () => <BeforeAfterInlineBlock {...commonProps} />,
      'bonus-list-inline': () => <BonusListInlineBlock {...commonProps} />,
      'step-header-inline': () => <StepHeaderInlineBlock {...commonProps} />,
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
  }, [block.type, commonProps]); // ES7+ Dependency array otimizado

  return (
    <div className={cn(
      // Container principal responsivo
      'universal-block-renderer w-full',
      'transition-all duration-300 ease-out',
      className
    )}>
      {renderedComponent}
    </div>
  );
};

export default UniversalBlockRenderer;