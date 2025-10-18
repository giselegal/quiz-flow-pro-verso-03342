import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function IntroTitleBlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  const content = block.content?.text || block.properties?.content || 'Título do Quiz';
  const fontSize = block.properties?.fontSize || 'text-2xl';
  const fontWeight = block.properties?.fontWeight || 'font-bold';
  const textAlign = block.properties?.textAlign || 'text-center';
  const color = block.properties?.color;

  // Parse custom color tags [#color]**text**[/#color]
  const renderContent = () => {
    if (!content.includes('[#')) {
      return content;
    }

    const parts = [];
    const regex = /\[#([A-F0-9]{6})\]\*\*(.*?)\*\*\[\/#\1\]/gi;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      parts.push(
        <span key={match.index} style={{ color: `#${match[1]}` }} className="font-bold">
          {match[2]}
        </span>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts;
  };

  return (
    <h1
      className={`${fontSize} ${fontWeight} ${textAlign} mb-4 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={color ? { color } : undefined}
      onClick={onClick}
    >
      {renderContent()}
    </h1>
  );
}
