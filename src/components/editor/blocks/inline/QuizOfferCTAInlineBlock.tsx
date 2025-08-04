import React from 'react';
import { cn } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';
import { safeGetBlockProperties, logBlockDebug } from '@/utils/blockUtils';

/**
 * QuizOfferCTAInlineBlock - CTA da oferta do quiz
 */
const QuizOfferCTAInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  logBlockDebug('QuizOfferCTAInlineBlock', block);
  const properties = safeGetBlockProperties(block);

  const { buttonText = 'Quero Meu Guia de Estilo', subText = 'Acesso imediato + garantia de 7 dias' } = properties;

  return (
    <div
      className={cn(
        'w-full p-4 transition-all duration-200',
        isSelected && 'ring-2 ring-[#B89B7A]',
        'cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      <button className="w-full bg-[#432818] hover:bg-[#5a3520] text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 mb-2">
        <ShoppingCart className="w-5 h-5" />
        <span>{buttonText}</span>
      </button>
      <p className="text-center text-sm text-gray-600">{subText}</p>
    </div>
  );
};

export default QuizOfferCTAInlineBlock;
