import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { trackButtonClick, trackSaleConversion } from '@/utils/analytics';
import { getCtaUrl } from '@/services/pixelManager';
import SecurePurchaseElement from '@/components/result/SecurePurchaseElement';

interface QuizOfferCTAProps {
  price?: string;
  regularPrice?: string;
}

export const QuizOfferCTA: React.FC<QuizOfferCTAProps> = ({
  price = '39,00',
  regularPrice = '175,00',
}) => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleCTAClick = () => {
    trackButtonClick('main-cta', 'Comprar Quiz Completo', 'cta-section');
    // Registrar início de checkout
    trackSaleConversion(39.0, 'BRL', 'Quiz de Estilo Completo');
    // Redirecionar para checkout
    window.location.href = getCtaUrl();
  };

  return (
    <Card className="border-[#aa6b5d] border-2 shadow-lg overflow-hidden bg-[#F9F7F4]">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-playfair text-[#432818] mb-2">
            Desbloqueie Seu Estilo Autêntico Hoje
          </h2>
          <p className="text-[#432818]/80">
            Dê o próximo passo e descubra como vestir-se para expressar sua verdadeira personalidade
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-[#EAE4DA]">
            <p className="text-sm text-[#aa6b5d] uppercase font-medium">Hoje por apenas</p>
            <div className="flex items-baseline justify-center">
              <span className="text-sm mr-1">R$</span>
              <p className="text-4xl font-bold gold-text">{price.split(',')[0]}</p>
              <span className="text-lg">,{price.split(',')[1]}</span>
            </div>
            <p className="text-xs text-[#3a3a3a]/60 mt-1">Pagamento único</p>
            <p className="text-sm text-[#432818] mt-2">
              ou <strong>4x de R$ 10,86</strong> no cartão
            </p>

            <div className="mt-3 flex items-center justify-center">
              <div className="text-sm text-[#3a3a3a]/80 line-through mr-2">R$ {regularPrice}</div>
              <div className="bg-[#aa6b5d] text-white text-xs px-2 py-0.5 rounded-full">
                -78% OFF
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={handleCTAClick}
          className="w-full text-white py-6 rounded-md btn-cta-green text-lg"
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          <span className="flex items-center justify-center gap-2">
            <ShoppingCart
              className={`w-5 h-5 transition-transform duration-300 ${isButtonHovered ? 'scale-110' : ''}`}
            />
            Quero o Quiz Completo + Bônus
          </span>
        </Button>

        <div className="mt-4">
          <SecurePurchaseElement />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
          <div className="bg-white p-3 rounded-lg shadow-sm border border-[#EAE4DA]">
            <h4 className="font-medium text-[#432818] text-sm">Guia Detalhado</h4>
            <p className="text-xs text-[#432818]/70">
              Descubra seu estilo pessoal com análises profundas
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border border-[#EAE4DA]">
            <h4 className="font-medium text-[#432818] text-sm">Peças-Chave</h4>
            <p className="text-xs text-[#432818]/70">
              Identifique as roupas essenciais para seu estilo
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border border-[#EAE4DA]">
            <h4 className="font-medium text-[#432818] text-sm">Visagismo Facial</h4>
            <p className="text-xs text-[#432818]/70">
              Adapte seu visual às suas características faciais
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizOfferCTA;
