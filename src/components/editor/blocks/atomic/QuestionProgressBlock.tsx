import React from 'react';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import type { Block } from '@/types/editor';

interface QuestionProgressBlockProps {
  block: Block;
  isSelected?: boolean;
  isEditable?: boolean;
  onSelect?: (blockId: string) => void;
  onOpenProperties?: (blockId: string) => void;
}

export default function QuestionProgressBlock({
  block,
  isSelected = false,
  isEditable = false,
  onSelect,
  onOpenProperties
}: QuestionProgressBlockProps) {
  const stepNumber = block.properties?.stepNumber || 1;
  const totalSteps = block.properties?.totalSteps || 21;
  const progress = Math.round((stepNumber / totalSteps) * 100);
  
  const barColor = block.properties?.barColor || '#deac6d';
  const backgroundColor = block.properties?.backgroundColor || '#e5e7eb';
  const showPercentage = block.properties?.showPercentage !== false;

  return (
    <SelectableBlock
      blockId={block.id}
      isSelected={isSelected}
      isEditable={isEditable}
      onSelect={() => onSelect?.(block.id)}
      blockType="Barra de Progresso"
      blockIndex={block.order || 0}
      onOpenProperties={() => onOpenProperties?.(block.id)}
      isDraggable={false}
    >
      <div className="mb-6 max-w-6xl mx-auto px-4 py-4">
        <div className="w-full rounded-full h-2.5 mb-4" style={{ backgroundColor }}>
          <div
            className="h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: barColor }}
          />
        </div>
        {showPercentage && (
          <p className="text-sm text-center mb-4 text-gray-600">
            Progresso: {progress}%
          </p>
        )}
      </div>
    </SelectableBlock>
  );
}
