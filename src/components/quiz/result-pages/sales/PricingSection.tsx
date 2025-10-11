import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SecurePurchaseElement from '@/components/result/SecurePurchaseElement';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useOptimizedScheduler } from '@/hooks/useOptimizedScheduler';
import { Sparkles, ShoppingCart, Clock } from 'lucide-react';

interface PricingSectionProps {
  price?: string;
  regularPrice?: string;
  ctaText?: string;
  ctaUrl?: string;
}

const PricingSection: React.FC<PricingSectionProps> = ({
  price = '39,00',
  regularPrice = '175,00',
  ctaText = 'Transformar Meu Estilo Agora',
  ctaUrl = 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { schedule } = useOptimizedScheduler();

  const handlePurchase = () => {
    setIsLoading(true);
    // UX: pequeno delay com scheduler para feedback visual
    schedule('pricing:cta', () => {
      window.location.href = ctaUrl;
      setIsLoading(false);
    }, 500);
  };

  return (
    <div>
      <Card className="p-8 border-[#aa6b5d] border-2 bg-white relative overflow-hidden card-elegant">
        {/* Shimmer effect animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 pointer-events-none" />

        <div className="space-y-6">
          {/* Value Stack */}
          <div className="bg-[#fff7f3] p-5 rounded-lg border border-[#B89B7A]/10 shadow-sm">
            <h4 className="text-[#432818] text-sm mb-3 text-center relative inline-block">
              <div className="absolute -left-5 top-0 text-amber-400">
                <Sparkles size={14} />
              </div>
              Valor de cada componente:
            </h4>

            <div className="space-y-2.5">
              {[
                { label: 'Guia Principal', value: '67,00' },
                { label: 'Bônus 1 - Peças-chave', value: '79,00' },
                { label: 'Bônus 2 - Visagismo Facial', value: '29,00' },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-[#432818]">{item.label}</span>
                  <span className="font-medium text-[#aa6b5d]">R$ {item.value}</span>
                </div>
              ))}

              <div className="border-t border-[#B89B7A]/20 pt-3 mt-3 flex justify-between items-center">
                <span className="font-medium text-[#432818]">Valor Total</span>
                <span className="font-medium relative">
                  R$ {regularPrice}
                  <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#ff5a5a] transform -translate-y-1/2 -rotate-3" />
                </span>
              </div>
            </div>
          </div>

          {/* Price Display */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="transform rotate-[-5deg] relative transition-transform duration-200 hover:-rotate-8 hover:scale-105">
              <p className="text-sm text-[#3a3a3a]/60 mb-1">De</p>
              <p className="text-2xl line-through text-[#3a3a3a]/60">R$ {regularPrice}</p>
              <div className="absolute -top-1 -left-1 -right-1 -bottom-1 border-2 border-[#ff5a5a] transform rotate-[-8deg] rounded-sm" />
            </div>

            <div className="text-center transform rotate-[2deg] transition-transform duration-200 hover:rotate-4 hover:scale-105">
              <p className="text-sm text-[#aa6b5d] mb-1">Por apenas</p>
              <div className="flex items-baseline gap-1 justify-center relative">
                <span className="text-sm">R$</span>
                <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-amber-500 to-amber-700">
                  {price.split(',')[0]}
                </span>
                <span className="text-lg">,{price.split(',')[1] || '00'}</span>
                <div className="absolute -top-2 -right-4 rotate-12 text-xs bg-[#aa6b5d] text-white px-2 py-0.5 rounded-full">
                  HOJE
                </div>
              </div>
              <p className="text-xs text-[#3a3a3a]/60 mt-1">Pagamento único ou em 4x de R$ 10,86</p>
            </div>
          </div>

          {/* Payment method images */}
          <div className="mt-3 mb-4 text-center">
            <img
              src="https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_auto:good,w_320/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp"
              alt="Métodos de pagamento"
              className="w-full max-w-xs mx-auto"
              width={320}
              height={48}
              loading="lazy"
            />
          </div>

          {/* Security Badge */}
          <div>
            <SecurePurchaseElement />
          </div>

          {/* CTA Button */}
          <div className="relative">
            <Button
              className="w-full bg-[#aa6b5d] hover:bg-[#8f574a] text-white py-6 px-8 rounded-md text-lg leading-none md:leading-normal transition-colors duration-300 shadow-lg"
              onClick={handlePurchase}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                    <div className="inline-block">
                      <LoadingSpinner size="xs" color="#FFFFFF" />
                    </div>
                    <span>Processando...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {ctaText}
                </span>
              )}
            </Button>

            {/* Elegant shadow beneath button */}
            <div className="h-2 bg-gradient-to-r from-transparent via-[#B89B7A]/30 to-transparent rounded-full mt-2 mx-auto w-4/5" />
          </div>

          {/* Limited Time Offer */}
          <p className="text-center text-sm flex items-center justify-center gap-1 text-[#aa6b5d]">
            <Clock className="w-3 h-3 text-[#aa6b5d]" />
            <span>Oferta por tempo limitado</span>
          </p>

          {/* Payment Methods */}
          <p className="text-center text-sm text-[#432818]/70">
            Aceitamos PIX, cartão de crédito e boleto
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PricingSection;
