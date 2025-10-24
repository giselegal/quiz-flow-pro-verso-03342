import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { sanitizeHtml } from '@/utils/sanitizeHtml';

export default function IntroDescriptionBlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  const content = (block as any)?.content?.text || block.properties?.content || '';
  const fontSize = block.properties?.fontSize || 'text-base';
  const textAlign = block.properties?.textAlign || 'text-center';
  const opacity = block.properties?.opacity || 1;

  // Parse markdown bold
  const parseMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Se vier HTML (por exemplo com strong customizado), usar dangerouslySetInnerHTML (com sanitização)
  const hasHtml = typeof content === 'string' && /<\/?\w+/.test(content);

  return (
    <p
      className={`${fontSize} ${textAlign} mb-4 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={{ opacity }}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    >
      {hasHtml ? (
        <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
      ) : (
        parseMarkdown(content)
      )}
    </p>
  );
}
