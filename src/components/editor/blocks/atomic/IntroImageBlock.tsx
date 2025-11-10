import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { appLogger } from '@/lib/utils/appLogger';

export default function IntroImageBlock({
  block,
  isSelected,
  onClick,
}: AtomicBlockProps) {
  // Compatibilidade JSON v3: content.imageUrl, imageAlt, width/height
  const src = (block as any)?.content?.imageUrl || (block as any)?.content?.src || block.properties?.src || '';
  const alt = (block as any)?.content?.imageAlt || (block as any)?.content?.alt || block.properties?.alt || 'Imagem';

  // maxWidth: priorizar content.width, depois properties.maxWidth, senão default
  const contentWidth = (block as any)?.content?.width;
  const maxWidth = contentWidth
    ? (typeof contentWidth === 'number' ? `${contentWidth}px` : contentWidth)
    : (block.properties?.maxWidth || '300px');

  const rounded = block.properties?.rounded !== false;

  // Debug
  if (import.meta.env.DEV) {
    appLogger.info('🖼️ [IntroImageBlock] Debug:', { data: [{
            blockId: block.id,
            type: (block as any).type,
            src,
            hasSrc: !!src,
            content: (block as any)?.content,
            properties: block.properties,
          }] });
  }

  if (!src) {
    appLogger.warn('⚠️ [IntroImageBlock] Sem src:', { data: [{ blockId: block.id, content: (block as any)?.content }] });
    return null;
  }

  return (
    <div
      className={`flex justify-center my-6 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full object-contain ${rounded ? 'rounded-lg' : ''}`}
        style={{ maxWidth }}
      />
    </div>
  );
}
