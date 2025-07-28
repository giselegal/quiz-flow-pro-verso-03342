
import React from 'react';
import { Block } from '@/types/editor';
import { CheckCircle } from 'lucide-react';

interface BenefitsBlockProps {
  block: Block;
  isSelected?: boolean;
  onSelect?: () => void;
  isPreview?: boolean;
}

const BenefitsBlock: React.FC<BenefitsBlockProps> = ({
  block,
  isSelected,
  onSelect,
  isPreview = false
}) => {
  const title = block.content?.title || 'Benefícios';
  const items = block.content?.items || [
    'Benefício 1',
    'Benefício 2',
    'Benefício 3'
  ];

  return (
    <div 
      className={`p-6 ${
        isSelected && !isPreview ? 'ring-2 ring-[#B89B7A] bg-[#FAF9F7]' : ''
      }`}
      onClick={onSelect}
    >
      <h3 className="text-2xl font-bold text-[#432818] mb-6 text-center">{title}</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-[#432818]">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsBlock;
