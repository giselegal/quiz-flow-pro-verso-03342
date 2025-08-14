import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { logBlockDebug, safeGetBlockProperties } from '@/utils/blockUtils';
import { ShoppingCart } from 'lucide-react';

/**
 * OfferProductShowcaseInlineBlock - Showcase de produtos com pricing
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */

const OfferProductShowcaseInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  logBlockDebug('OfferProductShowcaseInlineBlock', block);
  const properties = safeGetBlockProperties(block);

  const {
    title = "Transformação Completa",
    subtitle = "Tudo que você precisa para descobrir e aplicar seu estilo",
    products = [
      {
        id: "main-guide",
        title: "Guia Personalizado",
        description: "Para seu estilo específico",
        imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071347/MOCKUP_TABLETE_-_GUIA_DE_IMAGEM_E_ESTILO_ncctzi.webp",
        imageAlt: "Guia Personalizado",
        imageWidth: 250,
        imageHeight: 312
      }
    ],
    pricing = {
      installments: {
        quantity: 5,
        amount: "8,83"
      },
      fullPrice: "39,90",
      discount: "77% OFF",
      savings: "R$ 135,10",
      limitedOffer: true
    },
    finalCtaText = "Garantir Minha Transformação",
    finalCtaUrl = "https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912",
    spacing = "large"
  } = properties;

  const spacingClasses = {
    small: "py-8",
    medium: "py-12",
    large: "py-16"
  };

  const handleCtaClick = () => {
    if (finalCtaUrl) {
      window.open(finalCtaUrl, "_blank");
    }
  };

  return (
    <section
      className={cn(
        'w-full bg-[#FFFBF7]',
        spacingClasses[spacing as keyof typeof spacingClasses] || spacingClasses.large,
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E5DDD5]/30">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#432818] mb-4 font-playfair">
              {title}
            </h2>
            <p className="text-lg text-[#6B4F43]">
              {subtitle}
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {products.map((product: any, index: number) => (
              <div key={product.id || index} className="text-center">
                <div className="aspect-[4/5] bg-white rounded-lg mb-3 flex items-center justify-center overflow-hidden shadow-sm border border-gray-100">
                  <img
                    src={product.imageUrl}
                    alt={product.imageAlt}
                    width={product.imageWidth}
                    height={product.imageHeight}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#432818] mb-2">{product.title}</h3>
                <p className="text-sm text-[#6B4F43]">{product.description}</p>
              </div>
            ))}
          </div>

          {/* Pricing Section */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white text-center mb-8">
            {pricing.limitedOffer && (
              <p className="text-sm opacity-90 mb-2">Oferta por tempo limitado</p>
            )}
            <div className="mb-4">
              <span className="text-sm">
                {pricing.installments.quantity}x de
              </span>
              <span className="text-4xl font-bold mx-2">
                R$ {pricing.installments.amount}
              </span>
            </div>
            <p className="text-lg">
              ou à vista <strong>R$ {pricing.fullPrice}</strong>
            </p>
            {pricing.discount && pricing.savings && (
              <p className="text-sm mt-2 opacity-75">
                {pricing.discount} - Economia de {pricing.savings}
              </p>
            )}
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <button
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-lg"
            >
              <ShoppingCart size={20} />
              {finalCtaText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferProductShowcaseInlineBlock;