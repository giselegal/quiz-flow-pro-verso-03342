
import React from 'react';
import { Block } from '@/types/editor';
import { Shield } from 'lucide-react';

interface GuaranteeBlockProps {
  block: Block;
  isSelected?: boolean;
  onSelect?: () => void;
  isPreview?: boolean;
}

const GuaranteeBlock: React.FC<GuaranteeBlockProps> = ({
  block,
  isSelected,
  onSelect,
  isPreview = false
}) => {
  const title = block.content?.title || 'Garantia de 30 dias';
  const text = block.content?.text || 'Se você não ficar satisfeito, devolvemos 100% do seu dinheiro.';

  return (
    <div 
      className={`p-6 ${
        isSelected && !isPreview ? 'ring-2 ring-[#B89B7A] bg-[#FAF9F7]' : ''
      }`}
      onClick={onSelect}
    >
      <div className="bg-white rounded-lg border border-[#B89B7A]/20 p-8 text-center">
        <Shield className="w-16 h-16 mx-auto text-[#B89B7A] mb-4" />
        <h3 className="text-2xl font-bold text-[#432818] mb-4">{title}</h3>
        <p className="text-[#8F7A6A]">{text}</p>
      </div>
    </div>
  );
};

export default GuaranteeBlock;
