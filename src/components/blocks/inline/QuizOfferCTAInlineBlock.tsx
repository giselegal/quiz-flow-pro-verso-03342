import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { logBlockDebug, safeGetBlockProperties } from '@/utils/blockUtils';
import { ShoppingCart } from 'lucide-react';

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

  const {
    buttonText = 'Quero Meu Guia de Estilo',
    subText = 'Acesso imediato + garantia de 7 dias',
  } = properties;

  return (
    <div
      className={cn(
        'w-full p-4 transition-all duration-200',
        isSelected && 'ring-2 ring-[#432818]',
        'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <button className="w-full bg-[#432818] hover:bg-[#432818] text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 mb-2">
        <ShoppingCart className="w-5 h-5" />
        <span>{buttonText}</span>
      </button>
      <p style={{ color: '#6B4F43' }}>{subText}</p>
    </div>
  );
};

export default QuizOfferCTAInlineBlock;
