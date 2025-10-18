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

  // Parse custom color tags [#color]text[/#color]
  const parseColoredText = (text: string) => {
    const regex = /\[#([^\]]+)\]\*\*(.*?)\*\*\[\/#\1\]/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // Add colored text
      parts.push(
        <span key={match.index} style={{ color: `#${match[1]}` }} className="font-bold">
          {match[2]}
        </span>
      );
      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <h1
      className={`${fontSize} ${fontWeight} ${textAlign} mb-4 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={color ? { color } : undefined}
      onClick={onClick}
    >
      {parseColoredText(content)}
    </h1>
  );
}
