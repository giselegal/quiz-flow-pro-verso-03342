// @ts-nocheck
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BlockComponentProps } from '@/types/blocks';

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

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

const DynamicPricingBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    title = 'Preço Especial',
    price = '197',
    originalPrice = '497',
    currency = 'R$',
    features = [],
    buttonText = 'Comprar Agora',
    buttonUrl = '#',
  } = block.properties || {};

  return (
    <div
      className={`
        p-6 bg-white rounded-lg border cursor-pointer transition-all duration-200
  ${isSelected ? 'border-[#B89B7A] ring-2 ring-[#B89B7A]/40' : 'border-gray-200 hover:border-gray-300'}
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div className="text-center">
        <h3 style={{ color: '#432818' }}>{title}</h3>

        <div className="mb-6">
          {originalPrice && (
            <span style={{ color: '#8B7355' }}>
              {currency} {originalPrice}
            </span>
          )}
          <div className="text-4xl font-bold text-green-600 flex items-center justify-center gap-2">
            <DollarSign className="w-8 h-8" />
            {currency} {price}
          </div>
        </div>

        {features.length > 0 && (
          <ul className="text-left mb-6 space-y-2">
            {features.map((feature: string, featureIndex: number) => (
              <li key={featureIndex} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span style={{ color: '#6B4F43' }}>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <Button className="w-full bg-green-600 hover:bg-green-700">{buttonText}</Button>
      </div>
    </div>
  );
};

export default DynamicPricingBlock;
