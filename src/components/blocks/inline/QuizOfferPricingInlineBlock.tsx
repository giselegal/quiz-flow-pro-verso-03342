import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { logBlockDebug, safeGetBlockProperties } from '@/utils/blockUtils';

/**
 * QuizOfferPricingInlineBlock - Preço da oferta do quiz
 */

const QuizOfferPricingInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  logBlockDebug('QuizOfferPricingInlineBlock', block);
  const properties = safeGetBlockProperties(block);

  const {
    originalPrice = 'R$ 197,00',
    offerPrice = 'R$ 97,00',
    discount = '50% OFF',
    urgencyText = 'Oferta por tempo limitado',
  } = properties;

  return (
    <div
      className={cn(
        'w-full p-6 rounded-lg transition-all duration-200 text-center',
        'bg-gradient-to-br from-[#432818]/10 to-[#432818]/5',
        'border-2 border-[#432818]/30',
        isSelected && 'ring-2 ring-[#B89B7A]',
        'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <p style={{ color: '#432818' }}>{urgencyText}</p>
      <p style={{ color: '#8B7355' }}>De {originalPrice}</p>
      <p className="text-3xl font-bold text-[#432818] mb-2">{offerPrice}</p>
      <span style={{ backgroundColor: '#E5DDD5' }}>{discount}</span>
    </div>
  );
};

export default QuizOfferPricingInlineBlock;
