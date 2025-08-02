
import React from 'react';
import { Block } from '@/types/editor';

// Import available inline components
import TextInlineBlock from './inline/TextInlineBlock';
import BadgeInlineBlock from './inline/BadgeInlineBlock';
import ProgressInlineBlock from './inline/ProgressInlineBlock';
import StatInlineBlock from './inline/StatInlineBlock';
import CountdownInlineBlock from './inline/CountdownInlineBlock';
import SpacerInlineBlock from './inline/SpacerInlineBlock';
import PricingCardInlineBlock from './inline/PricingCardInlineBlock';
import TestimonialCardInlineBlock from './inline/TestimonialCardInlineBlock';
import StyleCardInlineBlock from './inline/StyleCardInlineBlock';
import ResultCardInlineBlock from './inline/ResultCardInlineBlock';
import ResultHeaderInlineBlock from './inline/ResultHeaderInlineBlock';
import StepHeaderInlineBlock from './inline/StepHeaderInlineBlock';
import SecondaryStylesInlineBlock from './inline/SecondaryStylesInlineBlock';
import StyleCharacteristicsInlineBlock from './inline/StyleCharacteristicsInlineBlock';
import LoadingAnimationBlock from './inline/LoadingAnimationBlock';
import CharacteristicsListInlineBlock from './inline/CharacteristicsListInlineBlock';
import BeforeAfterInlineBlock from './inline/BeforeAfterInlineBlock';
import BonusListInlineBlock from './inline/BonusListInlineBlock';

export interface BlockRendererProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
}

interface UniversalBlockRendererProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
}

const UniversalBlockRenderer: React.FC<UniversalBlockRendererProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  disabled = false
}) => {
  const blockProps = {
    block,
    isSelected,
    onClick,
    onPropertyChange,
    disabled
  };

  // Map block types to components
  const componentMap: Record<string, React.ComponentType<any>> = {
    'text-inline': TextInlineBlock,
    'text': TextInlineBlock,
    'badge-inline': BadgeInlineBlock,
    'progress-inline': ProgressInlineBlock,
    'stat-inline': StatInlineBlock,
    'countdown-inline': CountdownInlineBlock,
    'spacer-inline': SpacerInlineBlock,
    'spacer': SpacerInlineBlock,
    'pricing-card-inline': PricingCardInlineBlock,
    'testimonial-card-inline': TestimonialCardInlineBlock,
    'style-card-inline': StyleCardInlineBlock,
    'result-card-inline': ResultCardInlineBlock,
    'result-header-inline': ResultHeaderInlineBlock,
    'step-header-inline': StepHeaderInlineBlock,
    'secondary-styles-inline': SecondaryStylesInlineBlock,
    'style-characteristics-inline': StyleCharacteristicsInlineBlock,
    'loading-animation': LoadingAnimationBlock,
    'characteristics-list-inline': CharacteristicsListInlineBlock,
    'before-after-inline': BeforeAfterInlineBlock,
    'bonus-list-inline': BonusListInlineBlock
  };

  const Component = componentMap[block.type];

  if (!Component) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-lg text-red-600">
        Componente não encontrado: {block.type}
      </div>
    );
  }

  return <Component {...blockProps} />;
};

export default UniversalBlockRenderer;
export { UniversalBlockRenderer };
