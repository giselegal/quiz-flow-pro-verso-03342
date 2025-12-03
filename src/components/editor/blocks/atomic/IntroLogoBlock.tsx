import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function IntroLogoBlock({
  block,
  isSelected,
  onClick,
}: AtomicBlockProps) {
  // Compatibilidade JSON v3 e variações: aceitar logoUrl, src, imageUrl
  const logoUrl =
    block.properties?.logoUrl ||
    (block as any)?.content?.logoUrl ||
    (block as any)?.content?.src ||
    (block as any)?.content?.imageUrl ||
    '';
  const logoAlt = block.properties?.logoAlt || (block as any)?.content?.logoAlt || (block as any)?.content?.alt || 'Logo';
  const height = block.properties?.height || '60px';

  if (!logoUrl) return null;

  return (
    <div
      className={`flex justify-center mb-6 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={(e) => { onClick?.(); }}
    >
      <img
        src={logoUrl}
        alt={logoAlt}
        style={{
          height,
          maxWidth: '100%',
          width: 'auto',
        }}
        className="object-contain"
        loading="eager"
        decoding="sync"
      />
    </div>
  );
}
