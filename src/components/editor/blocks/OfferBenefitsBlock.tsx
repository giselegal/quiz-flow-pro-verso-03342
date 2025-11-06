/**
 * 🎁 OFFER BENEFITS BLOCK
 * 
 * Componente React para exibir lista de benefícios da oferta
 */

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Block } from '@/types/editor';

interface OfferBenefitsBlockProps {
  block: Block;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

const OfferBenefitsBlock: React.FC<OfferBenefitsBlockProps> = ({
  block,
  isSelected,
  onSelect,
}) => {
  const properties = block.properties || {};
  const content = block.content || {};
  
  const benefits = content.benefits || properties.benefits || [
    'Benefício 1',
    'Benefício 2',
    'Benefício 3',
  ];
  
  const title = content.title || properties.title || 'O que você vai receber:';
  const iconColor = properties.iconColor || '#22c55e';
  const textAlign = properties.textAlign || 'left';

  return (
    <div
      className={cn(
        'offer-benefits-block p-6 space-y-4',
        isSelected && 'ring-2 ring-primary',
      )}
      onClick={() => onSelect?.(block.id)}
    >
      {title && (
        <h3 
          className="text-xl font-semibold mb-4"
          style={{ textAlign: textAlign as any }}
        >
          {title}
        </h3>
      )}
      
      <ul className="space-y-3">
        {benefits.map((benefit: string, index: number) => (
          <li key={index} className="flex items-start gap-3">
            <Check 
              className="w-5 h-5 flex-shrink-0 mt-0.5" 
              style={{ color: iconColor }}
            />
            <span className="text-foreground/90">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OfferBenefitsBlock;
