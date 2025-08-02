
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { safeGetBlockProperties } from '@/utils/blockUtils';

interface PricingCardInlineBlockProps {
  block: {
    id: string;
    type: string;
    content?: any;
  };
  isSelected?: boolean;
  onSelect?: () => void;
  onUpdate?: (content: any) => void;
}

export const PricingCardInlineBlock: React.FC<PricingCardInlineBlockProps> = ({
  block,
  isSelected = false,
  onSelect,
  onUpdate
}) => {
  const properties = safeGetBlockProperties(block);
  
  // Valores padrão para evitar undefined
  const title = properties.title || 'Oferta Especial';
  const subtitle = properties.subtitle || 'Aproveite esta oportunidade única';
  const originalPrice = properties.originalPrice || 'R$ 497,00';
  const currentPrice = properties.currentPrice || 'R$ 97,00';
  const discount = properties.discount || '80% OFF';
  const buttonText = properties.buttonText || 'QUERO APROVEITAR';
  const buttonUrl = properties.buttonUrl || '#';

  console.log('🛒 PricingCardInlineBlock render:', {
    blockId: block.id,
    hasProperties: !!properties,
    title,
    currentPrice
  });

  return (
    <Card 
      className={`p-6 max-w-md mx-auto border-2 transition-all duration-200 ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-[#B89B7A]'
      }`}
      onClick={onSelect}
    >
      <div className="text-center space-y-4">
        {/* Título */}
        <h2 
          className="text-2xl font-bold text-[#432818] cursor-text"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onUpdate?.({ title: e.target.textContent })}
        >
          {title}
        </h2>

        {/* Subtítulo */}
        <p 
          className="text-[#8F7A6A] cursor-text"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onUpdate?.({ subtitle: e.target.textContent })}
        >
          {subtitle}
        </p>

        {/* Preços */}
        <div className="space-y-2">
          <div className="text-lg text-gray-500 line-through">
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onUpdate?.({ originalPrice: e.target.textContent })}
            >
              {originalPrice}
            </span>
          </div>
          
          <div className="text-4xl font-bold text-[#432818]">
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onUpdate?.({ currentPrice: e.target.textContent })}
            >
              {currentPrice}
            </span>
          </div>
          
          <div className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onUpdate?.({ discount: e.target.textContent })}
            >
              {discount}
            </span>
          </div>
        </div>

        {/* Botão CTA */}
        <Button 
          className="w-full bg-[#B89B7A] hover:bg-[#A38A69] text-white font-bold py-3 px-6 text-lg"
          onClick={(e) => {
            e.stopPropagation();
            if (buttonUrl && buttonUrl !== '#') {
              window.open(buttonUrl, '_blank');
            }
          }}
        >
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate?.({ buttonText: e.target.textContent })}
          >
            {buttonText}
          </span>
        </Button>
      </div>
    </Card>
  );
};

export default PricingCardInlineBlock;
