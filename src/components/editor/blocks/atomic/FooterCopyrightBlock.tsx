import React from 'react';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import type { Block } from '@/types/editor';

interface FooterCopyrightBlockProps {
  block: Block;
  isSelected?: boolean;
  isEditable?: boolean;
  onSelect?: (blockId: string) => void;
  onOpenProperties?: (blockId: string) => void;
}

export default function FooterCopyrightBlock({
  block,
  isSelected = false,
  isEditable = false,
  onSelect,
  onOpenProperties
}: FooterCopyrightBlockProps) {
  // Suporta {currentYear} como token dinâmico
  const textRaw = block.content?.text || block.properties?.text || '© {currentYear} Gisele Galvão - Todos os direitos reservados';
  const text = textRaw.replace(/\{currentYear\}/g, String(new Date().getFullYear()));
  
  const textAlign = block.properties?.textAlign || 'center';
  const fontSize = block.properties?.fontSize || 'text-xs';
  const className = block.properties?.className || 'text-gray-500 pt-6';

  return (
    <SelectableBlock
      blockId={block.id}
      isSelected={isSelected}
      isEditable={isEditable}
      onSelect={() => onSelect?.(block.id)}
      blockType="Footer Copyright"
      blockIndex={block.order || 999}
      onOpenProperties={() => onOpenProperties?.(block.id)}
      isDraggable={false}
    >
      <footer className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mt-auto pt-6 mx-auto">
        <p className={`${fontSize} ${textAlign === 'center' ? 'text-center' : textAlign} ${className}`}>
          {text}
        </p>
      </footer>
    </SelectableBlock>
  );
}
