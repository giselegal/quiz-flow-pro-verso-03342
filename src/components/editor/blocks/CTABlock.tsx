
import React from 'react';
import { Block } from '@/types/editor';
import { Button } from '@/components/ui/button';

interface CTABlockProps {
  block: Block;
  isSelected?: boolean;
  onSelect?: () => void;
  isPreview?: boolean;
}

const CTABlock: React.FC<CTABlockProps> = ({
  block,
  isSelected,
  onSelect,
  isPreview = false
}) => {
  const title = block.content?.title || 'Não perca esta oportunidade!';
  const buttonText = block.content?.buttonText || 'Quero garantir minha vaga!';
  const url = block.content?.url || '#';

  return (
    <div 
      className={`p-6 ${
        isSelected && !isPreview ? 'ring-2 ring-[#B89B7A] bg-[#FAF9F7]' : ''
      }`}
      onClick={onSelect}
    >
      <div className="bg-white rounded-lg border border-[#B89B7A]/20 p-8 text-center">
        <h3 className="text-2xl font-bold text-[#432818] mb-6">{title}</h3>
        <Button
          className="bg-[#B89B7A] hover:bg-[#A38A69] text-white px-8 py-4 text-lg"
          onClick={isPreview ? () => window.open(url, '_blank') : undefined}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default CTABlock;
