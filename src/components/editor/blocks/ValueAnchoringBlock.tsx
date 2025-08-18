// @ts-nocheck
import { cn } from '@/lib/utils';
import { Check, ShoppingCart } from 'lucide-react';

interface ValueAnchoringBlockProps {
  title?: string;
  showPricing?: boolean;
  className?: string;
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

const ValueAnchoringBlock: React.FC<ValueAnchoringBlockProps> = ({
  title = 'O Que Você Recebe Hoje',
  showPricing = true,
  className,
}) => {
  // Dados reais da página de resultado do funil
  const valueItems = [
    { item: 'Guia Principal', value: 67 },
    { item: 'Bônus - Peças-chave', value: 79 },
    { item: 'Bônus - Visagismo Facial', value: 29 },
  ];

  const totalValue = valueItems.reduce((sum, item) => sum + item.value, 0);
  const currentPrice = 39;
  const savings = totalValue - currentPrice;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div
      className={cn(
        'py-8',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
    >
      <div className="max-w-md mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md border border-[#B89B7A]/20 card-elegant">
          <h3 className="text-xl font-medium text-center text-[#aa6b5d] mb-4">{title}</h3>

          <div className="space-y-3 mb-6">
            {valueItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 border-b border-[#B89B7A]/10"
              >
                <span className="text-[#432818]">{item.item}</span>
                <span className="font-medium text-[#432818]">{formatPrice(item.value)}</span>
              </div>
            ))}
            <div className="flex justify-between items-center p-2 pt-3 font-bold">
              <span className="text-[#432818]">Valor Total</span>
              <div className="relative">
                <span className="text-[#432818]">{formatPrice(totalValue)}</span>
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#ff5a5a] transform -translate-y-1/2 -rotate-3"></div>
              </div>
            </div>
          </div>

          {showPricing && (
            <div className="text-center p-4 bg-[#f9f4ef] rounded-lg">
              <p className="text-sm text-[#aa6b5d] uppercase font-medium">Hoje por apenas</p>
              <p className="text-4xl font-bold text-[#B89B7A]">{formatPrice(currentPrice)}</p>
              <p className="text-xs text-[#432818]/60 mt-1">Pagamento único</p>
              <p className="text-sm text-[#aa6b5d] mt-2">Economize {formatPrice(savings)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValueAnchoringBlock;
