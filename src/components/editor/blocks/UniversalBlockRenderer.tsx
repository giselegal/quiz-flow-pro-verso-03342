import React from 'react';
import { cn } from '../../../lib/utils';
import type { BlockData } from '../../../types/blocks';

// === COMPONENTES PRINCIPAIS DO SISTEMA ===
// Componentes de página completa (funcionais)


// Componentes de quiz (funcionais)
import QuizQuestionBlock from './QuizQuestionBlock';
import QuizProgressBlock from './QuizProgressBlock';
import QuestionMultipleBlock from './QuestionMultipleBlock';
import StrategicQuestionBlock from './StrategicQuestionBlock';
import QuizTransitionBlock from './QuizTransitionBlock';
import OptionsGridBlock from './OptionsGridBlock';
import VerticalCanvasHeaderBlock from './VerticalCanvasHeaderBlock';

// === COMPONENTES INLINE MODULARES (ES7+) ===
// Importação corrigida e otimizada dos componentes inline
import {
  TextInlineBlock,
  StyleCardInlineBlock,
  StatInlineBlock,
  BadgeInlineBlock,
  ProgressInlineBlock,
  ImageDisplayInlineBlock,
  PricingCardInlineBlock,
  TestimonialCardInlineBlock,
  // Etapa 20 (Resultado)
  TestimonialsInlineBlock,
  // Etapa 21 (Oferta)
  QuizOfferPricingInlineBlock,
  CountdownInlineBlock,
  // Componentes especializados para Quiz
  LoadingAnimationBlock,
    // NOVA IMPLEMENTAÇÃO: Componentes das 21 Etapas Inline (existentes)
  QuizStartPageInlineBlock,
  QuizQuestionInlineBlock,
  QuizProgressInlineBlock,
  QuizTransitionInlineBlock,
  QuizLoadingInlineBlock,
  QuizResultInlineBlock,
  QuizAnalysisInlineBlock,
  QuizCategoryInlineBlock,
  QuizRecommendationInlineBlock,
  QuizActionPlanInlineBlock,
  QuizMetricsInlineBlock,
  QuizComparisonInlineBlock,
  QuizCertificateInlineBlock,
  QuizLeaderboardInlineBlock,
  QuizBadgesInlineBlock,
  QuizEvolutionInlineBlock,
  QuizNetworkingInlineBlock,
  QuizDevelopmentPlanInlineBlock,
  QuizGoalsDashboardInlineBlock,
  QuizFinalResultsInlineBlock,
  QuizOfferCTAInlineBlock
} from './inline';

// Componentes básicos (funcionais)
import { SpacerBlock } from './SpacerBlock';
import { VideoPlayerBlock } from './VideoPlayerBlock';
import FormInputBlock from './FormInputBlock';
import ListBlock from './ListBlock';

// Componentes inline básicos e funcionais
import HeadingInlineBlock from './HeadingInlineBlock';
import ImageInlineBlock from './ImageInlineBlock';
import ButtonInlineBlock from './ButtonInlineBlock';
import CTAInlineBlock from './CTAInlineBlock';

// Novos componentes inline criados
import ResultHeaderInlineBlock from './inline/ResultHeaderInlineBlock';
import ResultCardInlineBlock from './inline/ResultCardInlineBlock';
import BeforeAfterInlineBlock from './inline/BeforeAfterInlineBlock';
import BonusListInlineBlock from './inline/BonusListInlineBlock';
import StepHeaderInlineBlock from './inline/StepHeaderInlineBlock';

// 🚀 INTEGRAÇÃO SUPABASE: Serviços de dados
import { quizSupabaseService } from '../../../services/quizSupabaseService';

// Novos componentes modulares para etapas 20 e 21 (temporariamente desabilitados)
import ResultPageHeaderBlock from './ResultPageHeaderBlock';

// Componentes modernos (funcionais)
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
  // 🚀 SUPABASE: Props para integração de dados
  stepNumber?: number;
  quizSessionId?: string;
  userName?: string;
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
  className,
  // 🚀 SUPABASE: Parâmetros de integração
  stepNumber,
  quizSessionId,
  userName
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
      ),
      // 🚀 SUPABASE: Props passados para componentes filhos
      stepNumber,
      quizSessionId,
      userName,
      // 🚀 SUPABASE: Função helper para salvar dados
      saveToSupabase: async (data: any) => {
        try {
          if (stepNumber && quizSessionId) {
            await quizSupabaseService.saveStepResponse({
              step_number: stepNumber,
              step_id: `etapa-${stepNumber}`,
              response_data: data
            });
          }
        } catch (error) {
          console.error('❌ Erro ao salvar no Supabase:', error);
        }
      }
    };

    const componentMap: Record<string, () => React.ReactNode> = {
      // === COMPONENTES BÁSICOS ===
      header: () => <HeadingInlineBlock {...commonProps} />,
      text: () => <TextInlineBlock {...commonProps} />,
      image: () => <ImageInlineBlock {...commonProps} />,
      button: () => <ButtonInlineBlock {...commonProps} />,
      spacer: () => <SpacerBlock {...commonProps} />,
      'form-input': () => <FormInputBlock {...commonProps} />,
      list: () => <ListBlock {...commonProps} />,
      
      // === COMPONENTES DE RESULTADO ===
      'result-header': () => <HeadingInlineBlock {...commonProps} />,
      'result-description': () => <TextInlineBlock {...commonProps} />,
      
      // === COMPONENTES DE OFERTA ===
      'product-offer': () => <PricingCardInlineBlock {...commonProps} />,
      'urgency-timer': () => <CountdownInlineBlock {...commonProps} />,
      
      // === COMPONENTES ESPECIAIS ===
      'faq-section': () => <FAQSectionBlock {...commonProps} />,
      testimonials: () => <TestimonialsGridBlock {...commonProps} />,
      guarantee: () => <GuaranteeBlock {...commonProps} />,
      'video-player': () => <VideoPlayerBlock {...commonProps} />,
      
      // === COMPONENTES INLINE ESSENCIAIS ===
      'text-inline': () => <TextInlineBlock {...commonProps} />,
      'heading-inline': () => <HeadingInlineBlock {...commonProps} />,
      'button-inline': () => <ButtonInlineBlock {...commonProps} />,
      'badge-inline': () => <BadgeInlineBlock {...commonProps} />,
      'progress-inline': () => <ProgressInlineBlock {...commonProps} />,
      'image-display-inline': () => <ImageDisplayInlineBlock {...commonProps} />,
      'style-card-inline': () => <StyleCardInlineBlock {...commonProps} />,
      'result-card-inline': () => <ResultCardInlineBlock {...commonProps} />,
      'result-header-inline': () => <ResultHeaderInlineBlock {...commonProps} />,
      'before-after-inline': () => <BeforeAfterInlineBlock {...commonProps} />,
      'bonus-list-inline': () => <BonusListInlineBlock {...commonProps} />,
      'step-header-inline': () => <StepHeaderInlineBlock {...commonProps} />,
      'testimonial-card-inline': () => <TestimonialCardInlineBlock {...commonProps} />,
      'countdown-inline': () => <CountdownInlineBlock {...commonProps} />,
      'stat-inline': () => <StatInlineBlock {...commonProps} />,
      'pricing-card-inline': () => <PricingCardInlineBlock {...commonProps} />,
      
      // === COMPONENTES QUIZ ===
      'quiz-intro-header': () => <VerticalCanvasHeaderBlock {...commonProps} />,
      'vertical-canvas-header': () => <VerticalCanvasHeaderBlock {...commonProps} />,
      'loading-animation': () => <LoadingAnimationBlock {...commonProps} />,
      'options-grid': () => <OptionsGridBlock {...commonProps} />,
      'quiz-question': () => <QuizQuestionBlock {...commonProps} />,
      'quiz-progress': () => <QuizProgressBlock {...commonProps} />,
      
      // === COMPONENTES DAS 21 ETAPAS (usando fallbacks inteligentes) ===
      'quiz-start-page-inline': () => <QuizStartPageInlineBlock {...commonProps} />,
      'quiz-personal-info-inline': () => <TextInlineBlock {...commonProps} />, // Fallback para coleta de informações
      'quiz-experience-inline': () => <TextInlineBlock {...commonProps} />, // Fallback para experiência
      'quiz-skills-assessment-inline': () => <TextInlineBlock {...commonProps} />, // Fallback para skills
      'quiz-leadership-style-inline': () => <TextInlineBlock {...commonProps} />, // Fallback para liderança
      'quiz-communication-inline': () => <TextInlineBlock {...commonProps} />, // Fallback para comunicação
      'quiz-problem-solving-inline': () => <TextInlineBlock {...commonProps} />, // Fallback para solução de problemas
      'quiz-goals-inline': () => <TextInlineBlock {...commonProps} />, // Fallback para objetivos
      'quiz-motivation-inline': () => <TextInlineBlock {...commonProps} />, // Fallback para motivação
      'quiz-work-style-inline': () => <TextInlineBlock {...commonProps} />, // Fallback para estilo de trabalho
      'quiz-feedback-inline': () => <TextInlineBlock {...commonProps} />, // Fallback para feedback
      'quiz-results-inline': () => <ResultCardInlineBlock {...commonProps} />, // Componente de resultado
      'quiz-certificate-inline': () => <BadgeInlineBlock {...commonProps} />, // Badge para certificado
      'quiz-leaderboard-inline': () => <TestimonialsGridBlock {...commonProps} />, // Grid para ranking
      'quiz-badges-inline': () => <BadgeInlineBlock {...commonProps} />, // Badge para conquistas
      'quiz-evolution-inline': () => <ProgressInlineBlock {...commonProps} />, // Progresso para evolução
      'quiz-networking-inline': () => <TestimonialsGridBlock {...commonProps} />, // Grid para networking
      'quiz-development-plan-inline': () => <ListBlock {...commonProps} />, // Lista para plano de desenvolvimento
      'quiz-goals-dashboard-inline': () => <StatInlineBlock {...commonProps} />, // Stats para dashboard
      'quiz-final-results-inline': () => <ResultCardInlineBlock {...commonProps} />, // Card de resultado final
      'quiz-offer-cta-inline': () => <CTAInlineBlock {...commonProps} />, // CTA para oferta
      
      // === COMPONENTES ESSENCIAIS PARA AS 21 ETAPAS ===
      'decorative-bar-inline': () => <SpacerBlock {...commonProps} />, // Barra decorativa
      'legal-notice-inline': () => <TextInlineBlock {...commonProps} />, // Aviso legal como texto
      
      // === COMPONENTES ETAPA 20/21 ===
      'quiz-offer-pricing-inline': () => <PricingCardInlineBlock {...commonProps} />, // Card de preços
      'divider-inline': () => <SpacerBlock {...commonProps} />, // Divisor
      
      // === COMPONENTES ETAPA 21 ESPECÍFICOS ===
      'hero-badge-inline': () => <BadgeInlineBlock {...commonProps} />,
      'hero-title-inline': () => <HeadingInlineBlock {...commonProps} />,
      'problem-list-inline': () => <ListBlock {...commonProps} />,
      'highlight-box-inline': () => <BadgeInlineBlock {...commonProps} />,
      'product-card-inline': () => <PricingCardInlineBlock {...commonProps} />,
      'price-highlight-inline': () => <PricingCardInlineBlock {...commonProps} />,
      'cta-button-inline': () => <ButtonInlineBlock {...commonProps} />,
      'trust-elements-inline': () => <TestimonialsGridBlock {...commonProps} />,
      'countdown-timer-inline': () => <CountdownInlineBlock {...commonProps} />,
      'guarantee-seal-inline': () => <BadgeInlineBlock {...commonProps} />,
      'faq-item-inline': () => <FAQSectionBlock {...commonProps} />,
      'section-header-inline': () => <HeadingInlineBlock {...commonProps} />,
      'sticky-header-inline': () => <VerticalCanvasHeaderBlock {...commonProps} />,
      
      // === COMPONENTES ESTRATÉGICOS ===
      'strategic-question-image': () => <StrategicQuestionBlock {...commonProps} />,
      'strategic-question-main': () => <StrategicQuestionBlock {...commonProps} />,
      'strategic-question-inline': () => <StrategicQuestionBlock {...commonProps} />,
      
      // === BLOCOS QUIZ ESPECÍFICOS ===
      QuizQuestionBlock: () => <QuizQuestionBlock {...commonProps} />,
      QuestionMultipleBlock: () => <QuestionMultipleBlock {...commonProps} />,
      StrategicQuestionBlock: () => <StrategicQuestionBlock {...commonProps} />,
      QuizTransitionBlock: () => <QuizTransitionBlock {...commonProps} />,
      
      // === MAPEAMENTOS ADICIONAIS ===
      'quiz-title': () => <HeadingInlineBlock {...commonProps} />,
      'quiz-name-input': () => <FormInputBlock {...commonProps} />,
      'quiz-result-header': () => <HeadingInlineBlock {...commonProps} />,
      'quiz-result-card': () => <PricingCardInlineBlock {...commonProps} />,
      'quiz-offer-title': () => <HeadingInlineBlock {...commonProps} />,
      'quiz-offer-countdown': () => <CountdownInlineBlock {...commonProps} />,
      'quiz-offer-faq': () => <FAQSectionBlock {...commonProps} />,
      
      // === NOVOS COMPONENTES MODULARES ===
      'result-page-header': () => <HeadingInlineBlock {...commonProps} />,
      'style-result-card': () => <StyleCardInlineBlock {...commonProps} />,
      'result-cta': () => <CTAInlineBlock {...commonProps} />,
      'offer-header': () => <HeadingInlineBlock {...commonProps} />,
      'product-showcase': () => <PricingCardInlineBlock {...commonProps} />,
      'offer-cta': () => <CTAInlineBlock {...commonProps} />
    };

    // ES7+ Return com fallback usando optional chaining
    return componentMap[block.type as keyof typeof componentMap]?.() ?? 
           <TextInlineBlock {...commonProps} />;
  };

  return (
    <div className={cn(
      // ES7+ Container principal flexbox responsivo
      'universal-block-renderer',
      'flex flex-col w-full',
      'transition-all duration-300 ease-out'
    )}>
      {renderComponent()}
    </div>
  );
};

export default UniversalBlockRenderer;