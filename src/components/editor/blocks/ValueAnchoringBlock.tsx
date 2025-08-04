import React from "react";
import { cn } from "@/lib/utils";
import { Check, ShoppingCart } from "lucide-react";

interface ValueAnchoringBlockProps {
  title?: string;
  showPricing?: boolean;
  className?: string;
}

const ValueAnchoringBlock: React.FC<ValueAnchoringBlockProps> = ({
  title = "O Que Você Recebe Hoje",
  showPricing = true,
  className,
}) => {
  // Dados reais da página de resultado do funil
  const valueItems = [
    { item: "Guia Principal", value: 67 },
    { item: "Bônus - Peças-chave", value: 79 },
    { item: "Bônus - Visagismo Facial", value: 29 },
  ];

  const totalValue = valueItems.reduce((sum, item) => sum + item.value, 0);
  const currentPrice = 39;
  const savings = totalValue - currentPrice;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <div className={cn("py-8", className)}>
      <div className="max-w-md mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md border border-[#B89B7A]/20 card-elegant">
          <h3 className="text-xl font-medium text-center text-[#aa6b5d] mb-4">
            {title}
          </h3>

          <div className="space-y-3 mb-6">
            {valueItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 border-b border-[#B89B7A]/10"
              >
                <span className="text-[#432818]">{item.item}</span>
                <span className="font-medium text-[#432818]">
                  {formatPrice(item.value)}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center p-2 pt-3 font-bold">
              <span className="text-[#432818]">Valor Total</span>
              <div className="relative">
                <span className="text-[#432818]">
                  {formatPrice(totalValue)}
                </span>
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#ff5a5a] transform -translate-y-1/2 -rotate-3"></div>
              </div>
            </div>
          </div>

          {showPricing && (
            <div className="text-center p-4 bg-[#f9f4ef] rounded-lg">
              <p className="text-sm text-[#aa6b5d] uppercase font-medium">
                Hoje por apenas
              </p>
              <p className="text-4xl font-bold text-[#B89B7A]">
                {formatPrice(currentPrice)}
              </p>
              <p className="text-xs text-[#432818]/60 mt-1">Pagamento único</p>
              <p className="text-sm text-[#aa6b5d] mt-2">
                Economize {formatPrice(savings)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValueAnchoringBlock;
