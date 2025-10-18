import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function IntroLogoBlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  const logoUrl = block.properties?.logoUrl || block.content?.logoUrl || '';
  const logoAlt = block.properties?.logoAlt || block.content?.logoAlt || 'Logo';
  const height = block.properties?.height || '60px';

  if (!logoUrl) return null;

  return (
    <div
      className={`flex justify-center mb-6 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <img
        src={logoUrl}
        alt={logoAlt}
        style={{ height }}
        className="object-contain"
      />
    </div>
  );
}
