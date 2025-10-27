import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { useResultOptional } from '@/contexts/ResultContext';

export default function TransitionMessageBlock({
  block,
  isSelected,
  onClick,
}: AtomicBlockProps) {
  const emoji = block.content?.emoji || '✨';
  const messageRaw = block.content?.text || '';
  const backgroundColor = block.content?.backgroundColor || '#F5EDE4';
  const textColor = block.content?.textColor || '#5b4135';
  const borderRadius = block.content?.borderRadius || '12px';
  const result = useResultOptional();
  const message = result ? result.interpolateText(messageRaw) : messageRaw;

  return (
    <div
      className={`p-6 mt-6 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={{
        backgroundColor,
        borderRadius,
      }}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{emoji}</span>
        <p className="text-lg" style={{ color: textColor }}>
          {message}
        </p>
      </div>
    </div>
  );
}
