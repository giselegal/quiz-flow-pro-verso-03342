import React from 'react';
import { EditorBlock } from '@/types/editor';

// Importações existentes
import HeaderBlock from './HeaderBlock';
import TextBlock from './TextBlock';
import { ImageBlock } from './ImageBlock';
import ButtonBlock from './ButtonBlock';
import { SpacerBlock } from './SpacerBlock';

// Blocos inline
import { TextInlineBlock } from './inline/TextInlineBlock';
import { ImageDisplayInlineBlock } from './inline/ImageDisplayInlineBlock';
import { ButtonInlineBlock } from './inline/ButtonInlineBlock';
import { CountdownInlineBlock } from './inline/CountdownInlineBlock';
import { ResultCardInlineBlock } from './inline/ResultCardInlineBlock';
import { PricingCardInlineBlock } from './inline/PricingCardInlineBlock';
import HeadingInlineBlock from './inline/HeadingInlineBlock';

export interface BlockRendererProps {
  block: EditorBlock;
  isSelected?: boolean;
  onSelect?: () => void;
  onUpdate?: (content: any) => void;
  onDelete?: () => void;
  isPreviewing?: boolean;
  viewportSize?: 'sm' | 'md' | 'lg' | 'xl';
  primaryStyle?: any;
}

export const UniversalBlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isSelected = false,
  onSelect,
  onUpdate,
  onDelete,
  isPreviewing = false,
  viewportSize = 'lg',
  primaryStyle
}) => {
  const commonProps = {
    block,
    isSelected,
    onSelect,
    onUpdate,
    onDelete,
    isPreviewing,
    viewportSize,
    primaryStyle
  };

  // Mapeamento de componentes - incluindo o heading-inline
  const componentMap: Record<string, () => JSX.Element> = {
    // Componentes básicos
    'header': () => <HeaderBlock {...commonProps} />,
    'text': () => <TextBlock {...commonProps} />,
    'image': () => <ImageBlock {...commonProps} />,
    'button': () => <ButtonBlock {...commonProps} />,
    'spacer': () => <SpacerBlock {...commonProps} />,

    // Componentes inline - adicionando o heading-inline
    'text-inline': () => <TextInlineBlock {...commonProps} />,
    'heading-inline': () => <HeadingInlineBlock {...commonProps} />,
    'image-display-inline': () => <ImageDisplayInlineBlock {...commonProps} />,
    'button-inline': () => <ButtonInlineBlock {...commonProps} />,
    'countdown-inline': () => <CountdownInlineBlock {...commonProps} />,
    'result-card-inline': () => <ResultCardInlineBlock {...commonProps} />,
    'pricing-card-inline': () => <PricingCardInlineBlock {...commonProps} />,
  };

  const ComponentToRender = componentMap[block.type];

  if (!ComponentToRender) {
    console.error(`Componente não encontrado para o tipo de bloco: ${block.type}`);
    return (
      <div className="p-4 border-2 border-dashed border-red-300 bg-red-50 rounded-lg text-center">
        <p className="text-red-600 font-medium">Componente não encontrado</p>
        <p className="text-sm text-red-500">Tipo: {block.type}</p>
      </div>
    );
  }

  return (
    <div 
      className={`block-renderer ${isSelected ? 'selected' : ''}`}
      data-block-type={block.type}
      data-block-id={block.id}
    >
      <ComponentToRender />
    </div>
  );
};

export default UniversalBlockRenderer;
