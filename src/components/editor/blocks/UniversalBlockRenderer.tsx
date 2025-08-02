
/**
 * UniversalBlockRenderer - Renderizador universal de blocos
 * Versão corrigida com importações adequadas e tratamento de erro robusto
 */

import React, { Suspense } from 'react';
import type { BlockComponentProps } from '@/types/blocks';
import { initializeSafeBlock, logBlockDebug, createSafeFallback } from '@/utils/blockUtils';

// Importações corretas dos componentes inline
import {
  TextInlineBlock,
  ImageDisplayInlineBlock,
  BadgeInlineBlock,
  ProgressInlineBlock,
  StatInlineBlock,
  CountdownInlineBlock,
  SpacerInlineBlock,
  PricingCardInlineBlock,
  TestimonialCardInlineBlock,
  StyleCardInlineBlock,
  ResultCardInlineBlock,
  ResultHeaderInlineBlock,
  StepHeaderInlineBlock,
  SecondaryStylesInlineBlock,
  StyleCharacteristicsInlineBlock,
  QuizIntroHeaderBlock,
  LoadingAnimationBlock,
  QuizPersonalInfoInlineBlock,
  QuizResultInlineBlock,
  CharacteristicsListInlineBlock,
  TestimonialsInlineBlock,
  BeforeAfterInlineBlock,
  BonusListInlineBlock,
  QuizOfferPricingInlineBlock,
  QuizOfferCTAInlineBlock,
  QuizStartPageInlineBlock,
  QuizQuestionInlineBlock
} from './inline';

// Componentes não-inline existentes
import { HeaderBlock } from './HeaderBlock';
import { HeadingInlineBlock } from './HeadingInlineBlock';
import { ButtonInlineBlock } from './ButtonInlineBlock';

export interface BlockRendererProps extends BlockComponentProps {
  block: any;
  type?: string;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  className?: string;
}

// Componente de fallback para erros
const ErrorFallback: React.FC<{ blockType: string; error?: string }> = ({ blockType, error }) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
    <p className="font-medium">Erro no componente: {blockType}</p>
    {error && <p className="text-sm mt-1">{error}</p>}
  </div>
);

// Componente de loading
const LoadingFallback: React.FC = () => (
  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
    <p className="text-gray-500">Carregando componente...</p>
  </div>
);

export const UniversalBlockRenderer: React.FC<BlockRendererProps> = ({
  block: rawBlock,
  type,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = '',
  ...props
}) => {
  // Inicializar bloco com segurança
  const block = initializeSafeBlock(rawBlock);
  const blockType = type || block.type;
  
  // Debug logging
  logBlockDebug('UniversalBlockRenderer', block);
  
  // Props comuns para todos os componentes
  const commonProps: BlockComponentProps = {
    block,
    isSelected,
    onClick,
    onPropertyChange,
    className,
    ...props
  };

  try {
    // Mapeamento de tipos para componentes
    const componentMap: Record<string, () => JSX.Element> = {
      // Componentes básicos
      'text-inline': () => <TextInlineBlock {...commonProps} />,
      'text': () => <TextInlineBlock {...commonProps} />,
      'image-display-inline': () => <ImageDisplayInlineBlock {...commonProps} />,
      'badge-inline': () => <BadgeInlineBlock {...commonProps} />,
      'progress-inline': () => <ProgressInlineBlock {...commonProps} />,
      'stat-inline': () => <StatInlineBlock {...commonProps} />,
      'countdown-inline': () => <CountdownInlineBlock {...commonProps} />,
      'spacer-inline': () => <SpacerInlineBlock {...commonProps} />,
      'spacer': () => <SpacerInlineBlock {...commonProps} />,

      // Componentes de cards
      'pricing-card-inline': () => <PricingCardInlineBlock {...commonProps} />,
      'testimonial-card-inline': () => <TestimonialCardInlineBlock {...commonProps} />,
      'style-card-inline': () => <StyleCardInlineBlock {...commonProps} />,
      'result-card-inline': () => <ResultCardInlineBlock {...commonProps} />,

      // Componentes de resultado
      'result-header-inline': () => <ResultHeaderInlineBlock {...commonProps} />,
      'step-header-inline': () => <StepHeaderInlineBlock {...commonProps} />,
      'secondary-styles-inline': () => <SecondaryStylesInlineBlock {...commonProps} />,
      'style-characteristics-inline': () => <StyleCharacteristicsInlineBlock {...commonProps} />,

      // Componentes de quiz
      'quiz-intro-header': () => <QuizIntroHeaderBlock {...commonProps} />,
      'loading-animation': () => <LoadingAnimationBlock {...commonProps} />,
      'quiz-personal-info-inline': () => <QuizPersonalInfoInlineBlock {...commonProps} />,
      'quiz-result-inline': () => <QuizResultInlineBlock {...commonProps} />,
      'quiz-start-page-inline': () => <QuizStartPageInlineBlock {...commonProps} />,
      'quiz-question-inline': () => <QuizQuestionInlineBlock {...commonProps} />,

      // Componentes adicionais
      'characteristics-list-inline': () => <CharacteristicsListInlineBlock {...commonProps} />,
      'testimonials-inline': () => <TestimonialsInlineBlock {...commonProps} />,
      'before-after-inline': () => <BeforeAfterInlineBlock {...commonProps} />,
      'bonus-list-inline': () => <BonusListInlineBlock {...commonProps} />,
      'quiz-offer-pricing-inline': () => <QuizOfferPricingInlineBlock {...commonProps} />,
      'quiz-offer-cta-inline': () => <QuizOfferCTAInlineBlock {...commonProps} />,

      // Componentes não-inline existentes
      'header': () => <HeaderBlock {...commonProps} />,
      'heading-inline': () => <HeadingInlineBlock {...commonProps} />,
      'button-inline': () => <ButtonInlineBlock {...commonProps} />
    };

    // Renderizar componente baseado no tipo
    const renderComponent = componentMap[blockType];
    
    if (renderComponent) {
      return (
        <Suspense fallback={<LoadingFallback />}>
          {renderComponent()}
        </Suspense>
      );
    }

    // Fallback para tipos não reconhecidos
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
        <p className="font-medium">Componente não encontrado</p>
        <p className="text-sm">Tipo: {blockType}</p>
      </div>
    );

  } catch (error) {
    console.error(`Erro ao renderizar bloco ${blockType}:`, error);
    return <ErrorFallback blockType={blockType} error={error instanceof Error ? error.message : 'Erro desconhecido'} />;
  }
};

// Função para verificar se um tipo de bloco está registrado
export const isBlockTypeRegistered = (blockType: string): boolean => {
  const registeredTypes = [
    'text-inline', 'text', 'image-display-inline', 'badge-inline',
    'progress-inline', 'stat-inline', 'countdown-inline', 'spacer-inline', 'spacer',
    'pricing-card-inline', 'testimonial-card-inline', 'style-card-inline', 'result-card-inline',
    'result-header-inline', 'step-header-inline', 'secondary-styles-inline', 'style-characteristics-inline',
    'quiz-intro-header', 'loading-animation', 'quiz-personal-info-inline', 'quiz-result-inline',
    'quiz-start-page-inline', 'quiz-question-inline', 'characteristics-list-inline',
    'testimonials-inline', 'before-after-inline', 'bonus-list-inline',
    'quiz-offer-pricing-inline', 'quiz-offer-cta-inline', 'header', 'heading-inline', 'button-inline'
  ];
  
  return registeredTypes.includes(blockType);
};

export default UniversalBlockRenderer;
