import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { logBlockDebug, safeGetBlockProperties } from '@/utils/blockUtils';
import { ShoppingCart } from 'lucide-react';
import { getMarginClass } from '@/utils/margins';

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
    href = '#',
    target = '_self',
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0,
  } = properties;

  return (
    <div
      className={cn(
        'w-full p-4 transition-all duration-200',
        isSelected && 'ring-2 ring-[#432818]',
        'cursor-pointer',
        className,
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      onClick={onClick}
    >
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className="w-full bg-[#432818] hover:bg-[#432818] text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 mb-2"
      >
        <ShoppingCart className="w-5 h-5" />
        <span>{buttonText}</span>
      </a>
      <p style={{ color: '#6B4F43' }}>{subText}</p>
    </div>
  );
};

export default QuizOfferCTAInlineBlock;
