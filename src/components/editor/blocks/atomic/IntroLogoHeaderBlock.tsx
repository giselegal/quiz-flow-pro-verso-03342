import React from 'react';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import type { Block } from '@/types/editor';
import { useBlockData, useBlockImage } from '@/hooks/useBlockData';

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
  // 🔄 Usar adapter unificado para acessar dados do bloco
  const blockData = useBlockData(block);
  const logoUrl = useBlockImage(block, ['logoUrl', 'src', 'image'], '');
  
  const logoAlt = blockData.get('logoAlt', blockData.get('title', 'Logo'));
  const title = blockData.get('title', '');
  const subtitle = blockData.get('subtitle', '');
  const logoWidth = blockData.get('logoWidth', 120);
  const logoHeight = blockData.get('logoHeight', 50);
  const lineColor = blockData.get('lineColor', '#B89B7A');
  const lineWidth = blockData.get('lineWidth', 300);

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
