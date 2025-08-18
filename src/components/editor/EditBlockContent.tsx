// @ts-nocheck
import { Block } from '@/types/editor';
import { StyleResult } from '@/types/quiz';

// Import specific block editors (commented out missing components)
// import TextInlineBlock from "./blocks/inline/TextInlineBlock";
// import ImageDisplayInlineBlock from "./blocks/inline/ImageDisplayInlineBlock";
// import BadgeInlineBlock from "./blocks/inline/BadgeInlineBlock";
// import ProgressInlineBlock from "./blocks/inline/ProgressInlineBlock";
// import StatInlineBlock from "./blocks/inline/StatInlineBlock";
// import { CountdownInlineBlock } from "./blocks/inline";
// import SpacerInlineBlock from "./blocks/inline/SpacerInlineBlock";

interface EditBlockContentProps {
  block: Block;
  selectedStyle?: StyleResult;
  onUpdateBlock: (blockId: string, properties: any) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const EditBlockContent: React.FC<EditBlockContentProps> = ({
  block,
  selectedStyle,
  onUpdateBlock,
  isSelected = false,
  onSelect,
}) => {
  const handlePropertyChange = (key: string, value: any) => {
    onUpdateBlock(block.id, {
      ...(block.properties || {}),
      [key]: value,
    });
  };

  // Ensure block has properties field for compatibility
  const blockWithProperties = {
    ...block,
    properties: block.properties || block.content || {},
  };

  const blockProps = {
    block: blockWithProperties,
    isSelected,
    onClick: onSelect,
    onPropertyChange: handlePropertyChange,
    disabled: false,
  };

  // Map block types to their respective editors - simplified version
  const renderBlock = () => {
    // For now, just render a simple preview for all block types
    return (
      <div style={{ borderColor: '#E5DDD5' }}>
        <p style={{ color: '#6B4F43' }}>
          Bloco tipo: <strong>{block.type}</strong>
        </p>
        <pre style={{ backgroundColor: '#E5DDD5' }}>
          {JSON.stringify(block.properties || {}, null, 2)}
        </pre>
      </div>
    );
  };

  return <div className="w-full">{renderBlock()}</div>;
};

export default EditBlockContent;
