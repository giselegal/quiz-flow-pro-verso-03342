import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { logBlockDebug, safeGetBlockProperties } from '@/utils/blockUtils';
import { Gift } from 'lucide-react';

/**
 * BonusListInlineBlock - Lista de bônus
 */

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value: number | string | undefined, type: string): string => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (!numValue || isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const BonusListInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  logBlockDebug('BonusListInlineBlock', block);
  const properties = safeGetBlockProperties(block);

  const {
    title = 'Bônus Inclusos',
    bonuses = [{ title: 'Bônus 1', value: 'R$ 97', description: 'Descrição do bônus' }],
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0,
  } = properties;

  return (
    <div
      className={cn(
        'w-full p-4 rounded-lg transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500',
        'cursor-pointer',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      onClick={onClick}
    >
      <h3 className="font-semibold mb-4 text-center flex items-center justify-center">
        <Gift className="w-5 h-5 mr-2 text-[#432818]" />
        {title}
      </h3>
      <div className="space-y-3">
        {bonuses.map((bonus: any, index: number) => (
          <div
            key={index}
            className="bg-gradient-to-r from-[#432818]/10 to-transparent p-3 rounded-lg border-l-4 border-[#432818]"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium">{bonus.title}</h4>
                <p style={{ color: '#6B4F43' }}>{bonus.description}</p>
              </div>
              <span className="font-bold text-[#432818]">{bonus.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BonusListInlineBlock;
