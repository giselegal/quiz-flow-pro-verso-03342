
import React from 'react';
import { InlineBlockProps } from '@/types/inlineBlocks';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const PricingCardInlineBlock: React.FC<InlineBlockProps> = ({ block, onUpdate, isSelected, onSelect }) => {
  const {
    title = 'Plano Premium',
    price = '39,00',
    originalPrice = '97,00',
    currency = 'R$',
    period = '',
    highlight = true,
    features = ['Recurso 1', 'Recurso 2', 'Recurso 3'],
    ctaText = 'Comprar Agora',
    ctaUrl = '#'
  } = block.properties;

  return (
    <div
      onClick={onSelect}
      className={cn(
        'relative bg-white border rounded-lg p-6 cursor-pointer transition-all duration-200',
        highlight ? 'border-[#B89B7A] shadow-lg scale-105' : 'border-gray-200',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2'
      )}
    >
      {highlight && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-[#B89B7A] text-white px-4 py-1 rounded-full text-sm font-medium">
            Mais Popular
          </span>
        </div>
      )}
      
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold text-[#432818]">{title}</h3>
        
        <div className="space-y-2">
          <div className="flex items-baseline justify-center space-x-2">
            <span className="text-3xl font-bold text-[#432818]">
              {currency}{price}
            </span>
            {period && <span className="text-[#8F7A6A]">/{period}</span>}
          </div>
          
          {originalPrice && originalPrice !== price && (
            <div className="text-center">
              <span className="text-lg text-gray-400 line-through">
                {currency}{originalPrice}
              </span>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-[#432818]">{typeof feature === 'string' ? feature : feature.text}</span>
            </div>
          ))}
        </div>
        
        <Button 
          className={cn(
            'w-full',
            highlight ? 'bg-[#B89B7A] hover:bg-[#aa6b5d]' : 'bg-gray-600 hover:bg-gray-700'
          )}
          onClick={(e) => {
            e.stopPropagation();
            if (ctaUrl && ctaUrl !== '#') {
              window.open(ctaUrl, '_blank');
            }
          }}
        >
          {ctaText}
        </Button>
      </div>
    </div>
  );
};

export default PricingCardInlineBlock;
