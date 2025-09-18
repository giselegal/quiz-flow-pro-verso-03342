// @ts-nocheck
import { cn } from '@/lib/utils';
import { getMarginClass } from '@/utils/margins';

interface ValueAnchoringBlockProps {
  title?: string;
  showPricing?: boolean;
  className?: string;
}

// Margens agora centralizadas em utils/margins

const ValueAnchoringBlock: React.FC<ValueAnchoringBlockProps> = ({
  title: _title = 'O Que Você Recebe Hoje',
  showPricing: _showPricing = true,
  className,
  // @ts-ignore permitir props soltas
  block,
}) => {
  const properties = (block?.properties as any) || {};
  const title = properties.title ?? _title;
  const showPricing = properties.showPricing ?? _showPricing;
  const marginTop = properties.marginTop ?? 0;
  const marginBottom = properties.marginBottom ?? 0;
  const marginLeft = properties.marginLeft ?? 0;
  const marginRight = properties.marginRight ?? 0;
  const currency = properties.currency ?? 'BRL';
  // Lista editável via properties.valueItems
  const valueItems = properties.valueItems ?? [
    { item: 'Guia Principal', value: 67 },
    { item: 'Bônus - Peças-chave', value: 79 },
    { item: 'Bônus - Visagismo Facial', value: 29 },
  ];

  const totalValue = valueItems.reduce((sum, item) => sum + item.value, 0);
  const currentPrice = properties.currentPrice ?? 39;
  const savings = totalValue - currentPrice;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
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
