
import React from 'react';
import { Block } from '@/types/editor';
import { StyleResult } from '@/types/quiz';

// Import specific block editors
import TextInlineBlock from './blocks/inline/TextInlineBlock';
import ImageDisplayInlineBlock from './blocks/inline/ImageDisplayInlineBlock';
import BadgeInlineBlock from './blocks/inline/BadgeInlineBlock';
import ProgressInlineBlock from './blocks/inline/ProgressInlineBlock';
import StatInlineBlock from './blocks/inline/StatInlineBlock';
import CountdownInlineBlock from './blocks/inline/CountdownInlineBlock';
import SpacerInlineBlock from './blocks/inline/SpacerInlineBlock';

interface EditBlockContentProps {
  block: Block;
  selectedStyle?: StyleResult;
  onUpdateBlock: (blockId: string, properties: any) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

const EditBlockContent: React.FC<EditBlockContentProps> = ({
  block,
  selectedStyle,
  onUpdateBlock,
  isSelected = false,
  onSelect
}) => {
  const handlePropertyChange = (key: string, value: any) => {
    onUpdateBlock(block.id, {
      ...(block.properties || {}),
      [key]: value
    });
  };

  // Ensure block has properties field for compatibility
  const blockWithProperties = {
    ...block,
    properties: block.properties || block.content || {}
  };

  const blockProps = {
    block: blockWithProperties,
    isSelected,
    onClick: onSelect,
    onPropertyChange: handlePropertyChange,
    disabled: false
  };

  // Map block types to their respective editors
  const renderBlock = () => {
    switch (block.type) {
      case 'text-inline':
        return <TextInlineBlock {...blockProps} />;
      case 'image-display-inline':
        return <ImageDisplayInlineBlock {...blockProps} />;
      case 'badge-inline':
        return <BadgeInlineBlock {...blockProps} />;
      case 'progress-inline':
        return <ProgressInlineBlock {...blockProps} />;
      case 'stat-inline':
        return <StatInlineBlock {...blockProps} />;
      case 'countdown-inline':
        return <CountdownInlineBlock {...blockProps} />;
      case 'spacer-inline':
        return <SpacerInlineBlock {...blockProps} />;
      case 'text':
      case 'headline':
      case 'image':
      case 'button':
      case 'spacer':
        // Handle legacy block types
        return (
          <div className="p-4 border border-gray-300 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              Bloco tipo: <strong>{block.type}</strong>
            </p>
          </div>
        );
      default:
        return (
          <div className="p-4 border border-gray-300 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              Editor não implementado para o tipo: <strong>{block.type}</strong>
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderBlock()}
    </div>
  );
};

export default EditBlockContent;
