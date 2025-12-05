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
  const logoUrl = block.content?.logoUrl || block.properties?.logoUrl || block.properties?.title || '';
  const logoAlt = block.content?.logoAlt || block.properties?.logoAlt || block.properties?.title || 'Logo';
  const title = block.properties?.title || block.content?.title || '';
  const subtitle = block.properties?.subtitle || block.content?.subtitle || '';
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
          <div className="relative text-center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={logoAlt}
                className="h-auto mx-auto"
                width={logoWidth}
                height={logoHeight}
                style={{ objectFit: 'contain', maxWidth: `${logoWidth}px`, aspectRatio: `${logoWidth} / ${logoHeight}` }}
              />
            ) : title ? (
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            ) : (
              <div className="w-32 h-12 bg-muted rounded flex items-center justify-center text-muted-foreground text-sm">
                Logo
              </div>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
            )}
            <div 
              className="h-[3px] rounded-full mt-3 mx-auto" 
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
