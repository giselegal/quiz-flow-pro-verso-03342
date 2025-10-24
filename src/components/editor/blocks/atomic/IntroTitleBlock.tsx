import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function IntroTitleBlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  // Suporta JSON v3: content.titleHtml | content.title, além de formas legadas
  const titleHtml: string | undefined = (block as any)?.content?.titleHtml;
  const titleText: string = (block as any)?.content?.title
    || (block as any)?.content?.text
    || (block as any)?.properties?.content
    || 'Título do Quiz';
  const fontSize = block.properties?.fontSize || 'text-2xl';
  const fontWeight = block.properties?.fontWeight || 'font-bold';
  const textAlign = block.properties?.textAlign || 'text-center';
  const color = block.properties?.color;

  // Sanitização simples: remover scripts/eventos perigosos antes do dangerouslySetInnerHTML
  const sanitizeHtml = (html: string) => {
    try {
      // Remove tags script/style e on* handlers básicos
      return html
        .replace(/<\/(script|style)>/gi, '')
        .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
        .replace(/ on[a-z]+="[^"]*"/gi, '')
        .replace(/ on[a-z]+='[^']*'/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/data:text\/html/gi, '');
    } catch {
      return '';
    }
  };

  // Parse custom color tags [#color]**text**[/#color]
  const renderContent = () => {
    // Se vier HTML explícito no JSON v3
    if (typeof titleHtml === 'string' && titleHtml.trim().length > 0) {
      const safe = sanitizeHtml(titleHtml);
      return <span dangerouslySetInnerHTML={{ __html: safe }} />;
    }

    if (!titleText.includes('[#')) {
      return titleText;
    }

    const parts = [];
    const regex = /\[#([A-F0-9]{6})\]\*\*(.*?)\*\*\[\/#\1\]/gi;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(titleText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(titleText.substring(lastIndex, match.index));
      }
      parts.push(
        <span key={match.index} style={{ color: `#${match[1]}` }} className="font-bold">
          {match[2]}
        </span>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < titleText.length) {
      parts.push(titleText.substring(lastIndex));
    }

    return parts;
  };

  return (
    <h1
      className={`${fontSize} ${fontWeight} ${textAlign} mb-4 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={color ? { color } : undefined}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {renderContent()}
    </h1>
  );
}
