import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CheckCircle, Lock } from 'lucide-react';

/**
 * FinalValuePropositionInlineBlock - Final CTA with value proposition
 * Complete final section with pricing, benefits, and strong CTA
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const FinalValuePropositionInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,

  className = '',
}) => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // Destructure properties with defaults
  const {
    title = 'Vista-se de Você — na Prática',
    subtitle = 'Agora que você conhece seu estilo, é hora de aplicá-lo com clareza e intenção.',
    description = 'O Guia da Gisele Galvão foi criado para mulheres como você — que querem se vestir com autenticidade e transformar sua imagem em ferramenta de poder.',

    // Pricing
    originalPrice = 175,
    currentPrice = 39,
    discount = 78,
    installments = '5x de R$ 8,83',

    // Benefits
    benefits = [
      'Looks com intenção e identidade',
      'Cores, modelagens e tecidos a seu favor',
      'Imagem alinhada aos seus objetivos',
      'Guarda-roupa funcional, sem compras por impulso',
    ],

    // Value Stack
    valueStack = [
      { item: 'Guia Principal', value: 79 },
      { item: 'Bônus - Peças-chave', value: 67 },
      { item: 'Bônus - Visagismo Facial', value: 29 },
    ],

    // CTA
    ctaText = 'GARANTIR MEU GUIA AGORA',
    ctaUrl = 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912',
    urgencyMessage = '⚡ Esta oferta expira ao sair desta página',

    // Styling
    backgroundColor = '#ffffff',
    accentColor = '#458B74',
    primaryColor = '#B89B7A',
    textColor = '#432818',
    containerWidth = 'xlarge',
    spacing = 'large',
    marginTop = 0,
    marginBottom = 0,
    textAlign = 'center',
  } = block?.properties ?? {};

  // Container classes
  const containerClasses = cn(
    'w-full',
    {
      'max-w-sm mx-auto': containerWidth === 'small',
      'max-w-md mx-auto': containerWidth === 'medium',
      'max-w-lg mx-auto': containerWidth === 'large',
      'max-w-2xl mx-auto': containerWidth === 'xlarge',
      'max-w-4xl mx-auto': containerWidth === 'xxlarge',
      'max-w-full': containerWidth === 'full',
    },
    {
      'p-4': spacing === 'small',
      'p-6': spacing === 'normal',
      'p-8': spacing === 'large',
    },
    {
      'mt-0': marginTop === 0,
      'mt-4': marginTop <= 16,
      'mt-6': marginTop <= 24,
      'mt-8': marginTop <= 32,
    },
    {
      'mb-0': marginBottom === 0,
      'mb-4': marginBottom <= 16,
      'mb-6': marginBottom <= 24,
      'mb-8': marginBottom <= 32,
    },
    {
      'text-left': textAlign === 'left',
      'text-center': textAlign === 'center',
      'text-right': textAlign === 'right',
    },
    isSelected && 'ring-2 ring-[#B89B7A] ring-opacity-50 rounded-lg',
    className
  );

  const handleCTAClick = () => {
    // Analytics tracking if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'final_cta_click', {
        event_category: 'conversion',
        event_label: 'Final_Value_Proposition',
        value: currentPrice,
      });
    }

    if (ctaUrl) {
      window.open(ctaUrl, '_blank');
    }
  };

  const containerStyle = {
    backgroundColor,
    color: textColor,
  };

  return (
    <div className={containerClasses} onClick={onClick} style={containerStyle}>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h2
            className="text-2xl md:text-3xl font-playfair font-bold"
            style={{ color: primaryColor }}
          >
            {title}
          </h2>
          <div
            className="w-24 h-1 mx-auto rounded-full"
            style={{ backgroundColor: primaryColor }}
          />
          {subtitle && (
            <p className="text-base md:text-lg max-w-xl mx-auto opacity-90">{subtitle}</p>
          )}
          {description && <p className="max-w-xl mx-auto opacity-80">{description}</p>}
        </div>

        {/* Benefits List */}
        <div className="bg-gray-50 p-6 rounded-lg max-w-2xl mx-auto">
          <h3 className="text-xl font-medium mb-4" style={{ color: primaryColor }}>
            O Guia de Estilo e Imagem + Bônus Exclusivos
          </h3>
          <ul className="space-y-3 text-left">
            {benefits.map((benefit: string, index: number) => (
              <li key={index} className="flex items-start">
                <div
                  className="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-white mr-2 mt-0.5"
                  style={{ background: `linear-gradient(to right, ${primaryColor}, #aa6b5d)` }}
                >
                  <CheckCircle className="h-3 w-3" />
                </div>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Anchoring */}
        <div
          className="bg-white p-6 rounded-lg shadow-md border max-w-md mx-auto"
          style={{ borderColor: primaryColor + '20' }}
        >
          <h3 className="text-xl font-medium text-center mb-4" style={{ color: primaryColor }}>
            O Que Você Recebe Hoje
          </h3>

          <div className="space-y-3 mb-6">
            {valueStack.map((item: { item: string; value: number }, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 border-b"
                style={{ borderColor: primaryColor + '10' }}
              >
                <span>{item.item}</span>
                <span className="font-medium">R$ {item.value},00</span>
              </div>
            ))}
            <div className="flex justify-between items-center p-2 pt-3 font-bold">
              <span>Valor Total</span>
              <div className="relative">
                <span>R$ {originalPrice},00</span>
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-red-500 transform -translate-y-1/2 -rotate-3"></div>
              </div>
            </div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 uppercase font-medium">
              Especial: -{discount}% HOJE
            </p>
            <p className="text-4xl font-bold text-green-600">R$ {currentPrice},00</p>
            <p className="text-xs text-gray-600 mt-1">ou {installments}</p>
            <div className="mt-2 bg-red-50 rounded-full px-3 py-1 inline-block">
              <p className="text-xs text-red-600 font-medium">
                💥 Preço volta para R$ {originalPrice} em breve
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="space-y-4">
          <Button
            onClick={handleCTAClick}
            className="text-white py-6 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg font-semibold"
            style={{
              background: `linear-gradient(to right, ${accentColor}, #3D7A65)`,
              boxShadow: `0 4px 14px ${accentColor}40`,
            }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            <span className="flex items-center justify-center gap-3">
              <ShoppingCart
                className={`w-5 h-5 transition-transform duration-300 ${isButtonHovered ? 'scale-110' : ''}`}
              />
              <span>{ctaText}</span>
            </span>
          </Button>

          {/* Urgency Message */}
          {urgencyMessage && (
            <div className="bg-yellow-50 rounded-full px-4 py-2 inline-block border border-yellow-200">
              <p className="text-sm text-yellow-700 font-medium animate-pulse">{urgencyMessage}</p>
            </div>
          )}

          {/* Security */}
          <p className="text-sm opacity-75 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Compra 100% Segura • Garantia de 7 dias</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinalValuePropositionInlineBlock;
