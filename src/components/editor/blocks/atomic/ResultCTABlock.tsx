import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { Button } from '@/components/ui/button';
import { useResultOptional } from '@/contexts/ResultContext';

export default function ResultCTABlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  // Ler de content primeiro, fallback para properties
  const buttonTextRaw = block.content?.text || block.properties?.text || 'Ver Recomendações';
  const backgroundColor = block.properties?.backgroundColor || '#B89B7A';
  const textColor = block.properties?.textColor || '#FFFFFF';
  const size = block.properties?.size || 'lg';
  const url = block.content?.url || block.properties?.url || '#';
  const result = useResultOptional();
  const buttonText = result ? result.interpolateText(buttonTextRaw) : buttonTextRaw;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // 🔥 TRACKING: CTA clicked
    window.dispatchEvent(new CustomEvent('quiz-cta-clicked', {
      detail: {
        blockId: block.id,
        blockType: 'result-cta',
        ctaType: 'secondary',
        ctaText: buttonText,
        url: url,
        timestamp: Date.now()
      }
    }));

    onClick?.();

    // Navegar se tiver URL e não estiver em modo de edição
    if (url && url !== '#' && !isSelected) {
      window.open(url, '_blank');
    }
  };

  return (
    <div
      className={`mt-8 ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={handleClick}
    >
      <Button
        size={size as any}
        className="w-full"
        style={{
          backgroundColor,
          color: textColor
        }}
      >
        {buttonText}
      </Button>
    </div>
  );
}
