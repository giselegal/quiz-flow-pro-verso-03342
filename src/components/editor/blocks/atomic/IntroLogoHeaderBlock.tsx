import React from 'react';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import type { Block } from '@/types/editor';

interface IntroLogoHeaderBlockProps {
  block: Block;
  isSelected?: boolean;
  isEditable?: boolean;
  onSelect?: (blockId: string) => void;
  onOpenProperties?: (blockId: string) => void;
}

export default function IntroLogoHeaderBlock({
  block,
  isSelected = false,
  isEditable = false,
  onSelect,
  onOpenProperties,
}: IntroLogoHeaderBlockProps) {
  const logoUrl = block.content?.logoUrl || block.properties?.logoUrl || 
    'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_120,h_50,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png';
  const logoAlt = block.content?.logoAlt || block.properties?.logoAlt || 'Logo Gisele Galvão';
  const logoWidth = block.properties?.logoWidth || 120;
  const logoHeight = block.properties?.logoHeight || 50;
  const lineColor = block.properties?.lineColor || '#B89B7A';
  const lineWidth = block.properties?.lineWidth || 300;

  return (
    <SelectableBlock
      blockId={block.id}
      isSelected={isSelected}
      isEditable={isEditable}
      onSelect={() => onSelect?.(block.id)}
      blockType="Logo + Linha Decorativa"
      blockIndex={0}
      onOpenProperties={() => onOpenProperties?.(block.id)}
      isDraggable={false}
    >
      <header className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 py-8 mx-auto space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <img
              src={logoUrl}
              alt={logoAlt}
              className="h-auto mx-auto"
              width={logoWidth}
              height={logoHeight}
              style={{ objectFit: 'contain', maxWidth: `${logoWidth}px`, aspectRatio: `${logoWidth} / ${logoHeight}` }}
            />
            <div 
              className="h-[3px] rounded-full mt-1.5 mx-auto" 
              style={{ 
                backgroundColor: lineColor,
                width: `${lineWidth}px`, 
                maxWidth: '90%', 
              }} 
            />
          </div>
        </div>
      </header>
    </SelectableBlock>
  );
}
