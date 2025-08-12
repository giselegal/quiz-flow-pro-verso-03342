import React, { useState } from 'react';
import { StyleResult } from '@/types/quiz';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import BenefitList from './BenefitList';
import Testimonials from './Testimonials';
import Guarantee from './Guarantee';
import { OfferContent } from '@/types/resultPageConfig';
import { useUtmParameters } from '@/hooks/useUtmParameters';
import BuildInfo from '@/components/BuildInfo';
import SecurePurchaseElement from '@/components/result/SecurePurchaseElement';

interface OfferCardProps {
  primaryStyle: StyleResult;
  config?: OfferContent;
}

const OfferCard: React.FC<OfferCardProps> = ({ primaryStyle: _primaryStyle, config = {} }) => {
  const defaultConfig = {
    title: 'VOCÊ DESCOBRIU SEU ESTILO',
    subtitle: 'Agora é hora de aplicar com clareza — e se vestir de você',
    price: '39,00',
    regularPrice: '175,00',
    ctaText: 'Quero meu Guia + Bônus por R$39,00',
    ctaUrl: 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912',
    heroImage:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911666/C%C3%B3pia_de_Template_Dossi%C3%AA_Completo_2024_15_-_Copia_ssrhu3.webp',
    heroImage2:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911667/WhatsApp_Image_2025-04-02_at_09.40.53_cv8p5y.jpg',
  };

  const finalConfig = {
    ...defaultConfig,
    ...config,
  };

  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // Use UTM parameters hook
  const { addUtmToUrl } = useUtmParameters();

  // Update the CTA URL handler to include UTM parameters
  const handleCTAClick = () => {
    // Add UTM parameters to the CTA URL
    const urlWithUtm = addUtmToUrl(finalConfig.ctaUrl);
    window.location.href = urlWithUtm;
  };

  const globalStyles = {
    backgroundColor: '#fffaf7',
    textColor: '#432818',
    fontFamily: 'inherit',
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundColor: globalStyles.backgroundColor || '#fffaf7',
        color: globalStyles.textColor || '#432818',
        fontFamily: globalStyles.fontFamily || 'inherit',
      }}
    >
      <div className="text-center p-4 bg-[#f9f4ef] rounded-lg">
        <p className="text-sm text-[#aa6b5d] uppercase font-medium">Hoje por apenas</p>
        <p className="text-4xl font-bold gold-text">R$ 39,00</p>
        <p className="text-xs text-[#3a3a3a]/60 mt-1">Pagamento único</p>
        <p className="text-sm text-[#432818] mt-2">
          ou <strong>4x de R$ 10,86</strong> no cartão
        </p>
      </div>

      <div className="text-center mt-6">
        <Button
          onClick={handleCTAClick}
          className="text-white py-4 px-6 rounded-md btn-cta-green"
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          style={{
            background: 'linear-gradient(to right, #4CAF50, #45a049)',
            boxShadow: '0 4px 14px rgba(76, 175, 80, 0.4)',
          }}
        >
          <span className="flex items-center justify-center gap-2">
            <ShoppingCart
              className={`w-5 h-5 transition-transform duration-300 ${isButtonHovered ? 'scale-110' : ''}`}
            />
            Garantir Meu Guia + Bônus Especiais
          </span>
        </Button>
      </div>

      <div className="mt-4">
        <SecurePurchaseElement />
      </div>

      <Card>
        <div className="p-4">
          <Button
            className="w-full bg-[#aa6b5d] hover:bg-[#8f574a] text-white py-6 rounded-md text-lg transition-colors duration-300"
            onClick={handleCTAClick}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {finalConfig.ctaText}
          </Button>
        </div>
      </Card>

      <BenefitList />

      <div className="grid md:grid-cols-2 gap-6">
        <img
          src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911677/C%C3%B3pia_de_MOCKUPS_15_-_Copia_grstwl.webp"
          alt="Mockup celular peças-chave por dentro"
          className="w-full rounded-lg"
        />
        <img src={finalConfig.heroImage2} alt="Foto Gisele Galvão" className="w-full rounded-lg" />
      </div>

      <img
        src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp"
        alt="Imagem adicional bônus"
        className="w-full rounded-lg"
        onError={e => (e.currentTarget.style.display = 'none')}
      />

      <Testimonials />
      <Guarantee />
      <BuildInfo />
    </div>
  );
};

export default OfferCard;
