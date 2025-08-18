// @ts-nocheck
import { InlineEditableText } from './InlineEditableText';
import { CheckCircle } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

interface ValueItem {
  name: string;
  value: string;
}

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

const ValueStackInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onPropertyChange,
  className = '',
}) => {
  const {
    title = 'O Que Você Recebe Hoje',
    items = [
      { name: 'Guia Principal', value: 'R$ 67,00' },
      { name: 'Bônus - Peças-chave', value: 'R$ 79,00' },
      { name: 'Bônus - Visagismo Facial', value: 'R$ 29,00' },
    ] as ValueItem[],
    totalValue = 'R$ 175,00',
    finalPrice = 'R$ 39,00',
    finalPriceLabel = 'Hoje por apenas',
    paymentInfo = 'Pagamento único',
    benefits = [
      'Looks com intenção e identidade',
      'Cores, modelagens e tecidos a seu favor',
      'Imagem alinhada aos seus objetivos',
      'Guarda-roupa funcional, sem compras por impulso',
    ] as string[],
  } = block?.properties || {};

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  const handleItemChange = (index: number, field: 'name' | 'value', newValue: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: newValue };
    handlePropertyChange('items', newItems);
  };

  const handleBenefitChange = (index: number, newValue: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = newValue;
    handlePropertyChange('benefits', newBenefits);
  };

  return (
    <div
      className={`
        w-full
        p-3 rounded-lg transition-all duration-200
        ${
          isSelected
            ? 'border-2 border-[#B89B7A] bg-[#B89B7A]/10'
            : 'border-2 border-dashed border-transparent hover:border-[#B89B7A]/40 hover:bg-[#B89B7A]/10/30'
        }
        ${className}
      `}
    >
      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-[#fff7f3] to-[#f9f4ef] p-6 rounded-lg mb-6 border border-[#B89B7A]/10">
        <h3 className="text-xl font-medium text-[#aa6b5d] mb-4">
          <InlineEditableText
            value="O Guia de Estilo e Imagem + Bônus Exclusivos"
            onChange={value => handlePropertyChange('benefitsTitle', value)}
            placeholder="Título dos benefícios"
            className="text-xl font-medium text-[#aa6b5d]"
          />
        </h3>

        <ul className="space-y-3 text-left max-w-xl mx-auto text-[#432818]">
          {benefits.map((benefit: string, index: number) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center text-white mr-2 mt-0.5">
                <CheckCircle className="h-3 w-3" />
              </div>
              <span
                className="cursor-pointer hover:bg-[#B89B7A]/10/50 rounded px-1"
                onClick={() => {
                  const newBenefit = prompt('Editar benefício:', benefit);
                  if (newBenefit !== null) handleBenefitChange(index, newBenefit);
                }}
              >
                {benefit}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Value Stack Card */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-[#B89B7A]/20 max-w-md mx-auto">
        <h3 className="text-xl font-medium text-center text-[#aa6b5d] mb-4">
          <InlineEditableText
            value={title}
            onChange={value => handlePropertyChange('title', value)}
            placeholder="Título do valor"
            className="text-xl font-medium text-center text-[#aa6b5d]"
          />
        </h3>

        <div className="space-y-3 mb-6">
          {items.map((item: ValueItem, index: number) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 border-b border-[#B89B7A]/10"
            >
              <span
                className="cursor-pointer hover:bg-[#B89B7A]/10/50 rounded px-1"
                onClick={() => {
                  const newName = prompt('Editar nome do item:', item.name);
                  if (newName !== null) handleItemChange(index, 'name', newName);
                }}
              >
                {item.name}
              </span>
              <span
                className="font-medium cursor-pointer hover:bg-[#B89B7A]/10/50 rounded px-1"
                onClick={() => {
                  const newValue = prompt('Editar valor do item:', item.value);
                  if (newValue !== null) handleItemChange(index, 'value', newValue);
                }}
              >
                {item.value}
              </span>
            </div>
          ))}

          <div className="flex justify-between items-center p-2 pt-3 font-bold">
            <span>Valor Total</span>
            <div className="relative">
              <span
                className="cursor-pointer hover:bg-[#B89B7A]/10/50 rounded px-1"
                onClick={() => {
                  const newTotal = prompt('Editar valor total:', totalValue);
                  if (newTotal !== null) handlePropertyChange('totalValue', newTotal);
                }}
              >
                {totalValue}
              </span>
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#ff5a5a] transform -translate-y-1/2 -rotate-3"></div>
            </div>
          </div>
        </div>

        <div className="text-center p-4 bg-[#f9f4ef] rounded-lg">
          <p className="text-sm text-[#aa6b5d] uppercase font-medium">
            <InlineEditableText
              value={finalPriceLabel}
              onChange={value => handlePropertyChange('finalPriceLabel', value)}
              placeholder="Label do preço final"
              className="text-sm text-[#aa6b5d] uppercase font-medium"
            />
          </p>
          <p
            className="text-4xl font-bold text-[#B89B7A] cursor-pointer hover:bg-[#B89B7A]/10/50 rounded px-1"
            onClick={() => {
              const newPrice = prompt('Editar preço final:', finalPrice);
              if (newPrice !== null) handlePropertyChange('finalPrice', newPrice);
            }}
          >
            {finalPrice}
          </p>
          <p className="text-xs text-[#3a3a3a]/60 mt-1">
            <InlineEditableText
              value={paymentInfo}
              onChange={value => handlePropertyChange('paymentInfo', value)}
              placeholder="Informação de pagamento"
              className="text-xs text-[#3a3a3a]/60"
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default ValueStackInlineBlock;
