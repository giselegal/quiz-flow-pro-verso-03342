// @ts-nocheck
import { Check, X } from 'lucide-react';
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

const ComparisonTableInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onPropertyChange,
  className = '',
}) => {
  const {
    title = 'Comparação de Opções',
    items = [
      {
        name: 'Opção Básica',
        price: 'R$ 97',
        features: ['Recurso 1', 'Recurso 2'],
        highlight: false,
      },
      {
        name: 'Opção Premium',
        price: 'R$ 197',
        features: ['Recurso 1', 'Recurso 2', 'Recurso 3'],
        highlight: true,
      },
    ],
  } = block?.properties || {};

  return (
    <div
      className={`
        w-full flex flex-col items-center
        p-4 rounded-lg transition-all duration-200
        ${
          isSelected
            ? 'border-2 border-brand bg-brand/10'
            : 'border-2 border-dashed border-transparent hover:border-brand/40 hover:bg-brand/5'
        }
        ${className}
      `}
    >
      <h3 className="text-xl font-bold text-center mb-4 text-brand-dark">{title}</h3>

      <div className="w-full overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item: any, index: number) => (
            <div
              key={index}
              className={`
                p-6 rounded-lg border-2 transition-all duration-200
                ${
                  item.highlight
                    ? 'border-[#B89B7A] bg-gradient-to-br from-[#B89B7A]/10 to-[#B89B7A]/5 shadow-lg'
                    : 'border-gray-200 bg-white'
                }
              `}
            >
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-brand-dark mb-2">{item.name}</h4>
                <div className="text-2xl font-bold text-[#B89B7A]">{item.price}</div>
              </div>

              <ul className="space-y-2">
                {item.features.map((feature: string, featureIndex: number) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-stone-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {item.highlight && (
                <div className="mt-4 text-center">
                  <span className="inline-block bg-[#B89B7A] text-white px-3 py-1 rounded-full text-xs font-medium">
                    Mais Popular
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonTableInlineBlock;
