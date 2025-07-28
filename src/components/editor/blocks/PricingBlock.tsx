
import React from 'react';
import { Block } from '@/types/editor';

interface PricingBlockProps {
  block: Block;
  isSelected?: boolean;
  onSelect?: () => void;
  isPreview?: boolean;
}

const PricingBlock: React.FC<PricingBlockProps> = ({
  block,
  isSelected,
  onSelect,
  isPreview = false
}) => {
  const title = block.content?.title || 'Investimento';
  const price = block.content?.price || 'R$ 297,00';
  const originalPrice = block.content?.originalPrice || 'R$ 497,00';
  const installments = block.content?.installments || '12x de R$ 29,70';

  return (
    <div 
      className={`p-6 ${
        isSelected && !isPreview ? 'ring-2 ring-[#B89B7A] bg-[#FAF9F7]' : ''
      }`}
      onClick={onSelect}
    >
      <div className="bg-white rounded-lg border border-[#B89B7A]/20 p-8 text-center">
        <h3 className="text-2xl font-bold text-[#432818] mb-4">{title}</h3>
        
        <div className="mb-4">
          <span className="text-sm text-[#8F7A6A] line-through">{originalPrice}</span>
        </div>
        
        <div className="mb-4">
          <span className="text-4xl font-bold text-[#B89B7A]">{price}</span>
        </div>
        
        <div className="text-[#8F7A6A]">
          <p>ou {installments}</p>
        </div>
      </div>
    </div>
  );
};

export default PricingBlock;
