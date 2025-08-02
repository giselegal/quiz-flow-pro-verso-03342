import React from 'react';
import { TextBlock } from './TextBlock';
import { HeaderBlock } from './HeaderBlock';
import { ImageBlock } from './ImageBlock';
import { ButtonBlock } from './ButtonBlock';
import { SpacerBlock } from './SpacerBlock';
import { ResultHeaderBlock } from './ResultHeaderBlock';
import { ResultDescriptionBlock } from './ResultDescriptionBlock';
import { ProductOfferBlock } from './ProductOfferBlock';
import { UrgencyTimerBlock } from './UrgencyTimerBlock';
import { FAQSectionBlock } from './FAQSectionBlock';
import { TestimonialsBlock } from './TestimonialsBlock';
import { GuaranteeBlock } from './GuaranteeBlock';
import { VideoPlayerBlock } from './VideoPlayerBlock';
import { ProductCarouselBlock } from './ProductCarouselBlock';
import { BeforeAfterBlock } from './BeforeAfterBlock';
import { TwoColumnsBlock } from './TwoColumnsBlock';
import { ProsConsBlock } from './ProsConsBlock';
import { DynamicPricingBlock } from './DynamicPricingBlock';
import { ValueAnchoringBlock } from './ValueAnchoringBlock';
import { ProgressBarStepBlock } from './ProgressBarStepBlock';
import { AnimatedStatCounterBlock } from './AnimatedStatCounterBlock';
import { QuizOfferCountdownBlock } from './QuizOfferCountdownBlock';
import { ModernResultPageBlock } from './ModernResultPageBlock';
import { QuizStepBlock } from './QuizStepBlock';
import { QuizStartPageBlock } from './QuizStartPageBlock';
import { QuizQuestionBlock } from './QuizQuestionBlock';
import { QuizOfferPageBlock } from './QuizOfferPageBlock';
import { QuestionMultipleBlock } from './QuestionMultipleBlock';
import { StrategicQuestionBlock } from './StrategicQuestionBlock';
import { QuizTransitionBlock } from './QuizTransitionBlock';
import { InlineEditableText } from './InlineEditableText';
import { BlockData } from '.';

// Importações dos componentes inline
import {
  TextInlineBlock,
  ImageDisplayInlineBlock,
  BadgeInlineBlock,
  ProgressInlineBlock,
  StatInlineBlock,
  CountdownInlineBlock,
  SpacerInlineBlock,
  ButtonInlineBlock,
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

export interface BlockRendererProps {
  block: BlockData;
  className?: string;
  onClick?: () => void;
  onUpdate?: (id: string, content: any) => void;
  onDelete?: (id: string) => void;
}

const blockComponentMap: { [key: string]: React.ComponentType<any> } = {
  'text': TextBlock,
  'header': HeaderBlock,
  'image': ImageBlock,
  'button': ButtonBlock,
  'spacer': SpacerBlock,
  'result-header': ResultHeaderBlock,
  'result-description': ResultDescriptionBlock,
  'product-offer': ProductOfferBlock,
  'urgency-timer': UrgencyTimerBlock,
  'faq-section': FAQSectionBlock,
  'testimonials': TestimonialsBlock,
  'guarantee': GuaranteeBlock,
  'video-player': VideoPlayerBlock,
  'product-carousel': ProductCarouselBlock,
  'before-after': BeforeAfterBlock,
  'two-columns': TwoColumnsBlock,
  'pros-cons': ProsConsBlock,
  'dynamic-pricing': DynamicPricingBlock,
  'value-anchoring': ValueAnchoringBlock,
  'progress-bar-step': ProgressBarStepBlock,
  'animated-stat-counter': AnimatedStatCounterBlock,
  'quiz-offer-countdown': QuizOfferCountdownBlock,
  'modern-result-page': ModernResultPageBlock,
  'quiz-step': QuizStepBlock,
  'quiz-start-page': QuizStartPageBlock,
  'quiz-question': QuizQuestionBlock,
  'quiz-offer-page': QuizOfferPageBlock,
  'question-multiple': QuestionMultipleBlock,
  'strategic-question': StrategicQuestionBlock,
  'quiz-transition': QuizTransitionBlock,
  'inline-editable-text': InlineEditableText,

  // Inline Blocks
  'text-inline': TextInlineBlock,
  'image-display-inline': ImageDisplayInlineBlock,
  'badge-inline': BadgeInlineBlock,
  'progress-inline': ProgressInlineBlock,
  'stat-inline': StatInlineBlock,
  'countdown-inline': CountdownInlineBlock,
  'spacer-inline': SpacerInlineBlock,
  'button-inline': ButtonInlineBlock,
  'pricing-card-inline': PricingCardInlineBlock,
  'testimonial-card-inline': TestimonialCardInlineBlock,
  'style-card-inline': StyleCardInlineBlock,
  'result-card-inline': ResultCardInlineBlock,
  'result-header-inline': ResultHeaderInlineBlock,
  'step-header-inline': StepHeaderInlineBlock,
  'secondary-styles-inline': SecondaryStylesInlineBlock,
  'style-characteristics-inline': StyleCharacteristicsInlineBlock,
  'quiz-intro-header': QuizIntroHeaderBlock,
  'loading-animation': LoadingAnimationBlock,
  'quiz-personal-info-inline': QuizPersonalInfoInlineBlock,
  'quiz-result-inline': QuizResultInlineBlock,
  'characteristics-list-inline': CharacteristicsListInlineBlock,
  'testimonials-inline': TestimonialsInlineBlock,
  'before-after-inline': BeforeAfterInlineBlock,
  'bonus-list-inline': BonusListInlineBlock,
  'quiz-offer-pricing-inline': QuizOfferPricingInlineBlock,
  'quiz-offer-cta-inline': QuizOfferCTAInlineBlock,
  'quiz-start-page-inline': QuizStartPageInlineBlock,
  'quiz-question-inline': QuizQuestionInlineBlock,
};

export const UniversalBlockRenderer: React.FC<BlockRendererProps> = ({ block, className, onClick }) => {
  if (!block || !block.type) {
    return <div className="text-red-500">Block type is undefined</div>;
  }

  const BlockComponent = blockComponentMap[block.type];

  if (!BlockComponent) {
    console.error(`Componente não encontrado para o tipo de bloco: ${block.type}`);
    return <div className="text-red-500">Componente não encontrado: {block.type}</div>;
  }

  return (
    <BlockComponent
      {...block.properties}
      block={block}
      className={className}
      onClick={onClick}
    />
  );
};
