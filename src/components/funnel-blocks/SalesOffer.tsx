// @ts-nocheck
import { getOptimizedContainerClasses } from '@/config/containerConfig';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BlockComponentProps,
  PriceConfig,
  Alignment,
  InteractionCallbacks,
  Feature,
} from './types';

/**
 * SalesOffer - Componente de oferta de vendas configurável
 *
 * Renderiza uma oferta atrativa com preços, descontos, urgência, recursos
 * inclusos e botão de ação. Ideal para conversão em funis de vendas.
 *
 * @example
 * <SalesOffer
 *   title="Transforme Seu Guarda-Roupa Hoje!"
 *   subtitle="Consultoria Personalizada de Estilo"
 *   priceConfig={{
 *     originalPrice: 'R$ 297,00',
 *     currentPrice: 'R$ 97,00',
 *     discount: '67% OFF'
 *   }}
 *   urgencyText="Oferta válida apenas hoje!"
 *   features={[
 *     { title: 'Análise completa do seu estilo', isIncluded: true },
 *     { title: 'Guia de compras personalizado', isIncluded: true }
 *   ]}
 *   onPurchase={() => console.log('Comprar agora')}
 * />
 */

export interface SalesOfferProps extends BlockComponentProps, InteractionCallbacks {
  // Conteúdo da oferta
  title: string;
  subtitle?: string;
  description?: string;

  // Configuração de preços
  priceConfig: PriceConfig;

  // Urgência e escassez
  urgencyText?: string;
  scarcityText?: string;

  // Recursos inclusos
  features?: Feature[];
  showFeatures?: boolean;

  // Garantia
  guaranteeText?: string;
  showGuarantee?: boolean;

  // Botão de ação
  buttonText: string;
  buttonSubtext?: string;

  // Layout e estilos
  cardStyle?: 'elegant' | 'bold' | 'minimal';
  highlightDiscount?: boolean;

  // Callbacks
  onPurchase?: () => void;
}

export const SalesOffer: React.FC<SalesOfferProps> = props => {
  const {
    // Conteúdo
    title,
    subtitle,
    description,

    // Preços
    priceConfig,

    // Urgência
    urgencyText,
    scarcityText,
    showCountdown = false,
    countdownHours = 24,

    // Recursos
    features = [],
    showFeatures = true,

    // Garantia
    guaranteeText = 'Garantia de 30 dias',
    guaranteePeriod = '30 dias',
    showGuarantee = true,

    // Botão
    buttonText,
    buttonSubtext = 'Pagamento 100% seguro',

    // Layout
    alignment = 'center',
    cardStyle = 'elegant',
    highlightDiscount = true,

    // Callbacks
    onPurchase,

    // Props base
    deviceView = 'desktop',
    className = '',
    style = {},
    testId = 'sales-offer',
  } = props;

  // Classes de alinhamento
  const alignmentClasses: Record<Alignment, string> = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  // Classes de estilo do card
  const cardStyleClasses = {
    elegant: 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-xl',
    bold: 'bg-gradient-to-br from-[#432818] to-[#5D3A26] text-white shadow-2xl',
    minimal: 'bg-white border border-gray-100 shadow-lg',
  };

  const containerClasses = getOptimizedContainerClasses(
    deviceView || 'desktop',
    'tight',
    'full',
    className
  );

  // Calcular desconto em porcentagem
  const calculateDiscountPercent = () => {
    if (!priceConfig.originalPrice || !priceConfig.currentPrice) return 0;

    const original = parseFloat(priceConfig.originalPrice.replace(/[^\d,]/g, '').replace(',', '.'));
    const current = parseFloat(priceConfig.currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));

    return Math.round(((original - current) / original) * 100);
  };

  const discountPercent = calculateDiscountPercent();

  return (
    <div className={containerClasses} style={style} data-testid={testId}>
      <div className="max-w-full mx-auto w-full">
        {/* Header da Oferta */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-[#432818] mb-4">{title}</h1>

          {subtitle && <h2 style={{ color: '#6B4F43' }}>{subtitle}</h2>}

          {description && <p style={{ color: '#6B4F43' }}>{description}</p>}
        </div>

        {/* Card Principal da Oferta */}
        <Card className={`overflow-hidden ${cardStyleClasses[cardStyle]} max-w-2xl mx-auto`}>
          <CardContent className="p-8 md:p-12">
            {/* Badge de Desconto */}
            {highlightDiscount && priceConfig.discount && (
              <div className="text-center mb-6">
                <Badge style={{ backgroundColor: '#FAF9F7' }}>{priceConfig.discount}</Badge>
              </div>
            )}

            {/* Preços */}
            <div className="text-center mb-8">
              {/* Preço Original */}
              {priceConfig.originalPrice && (
                <div className="mb-2">
                  <span style={{ color: '#8B7355' }}>De: {priceConfig.originalPrice}</span>
                </div>
              )}

              {/* Preço Atual */}
              <div className="mb-4">
                <span className="text-5xl md:text-6xl font-bold text-[#B89B7A]">
                  {priceConfig.currentPrice}
                </span>

                {/* Parcelamento */}
                {priceConfig.installments && (
                  <div className="mt-2">
                    <span style={{ color: '#6B4F43' }}>
                      ou {priceConfig.installments.quantity}x de {priceConfig.installments.value}
                    </span>
                  </div>
                )}
              </div>

              {/* Economia */}
              {priceConfig.originalPrice && discountPercent > 0 && (
                <p className="text-lg font-semibold text-green-600">
                  Economia de {discountPercent}%
                </p>
              )}
            </div>

            {/* Recursos Inclusos */}
            {showFeatures && features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-center">O que está incluído:</h3>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {feature.isIncluded ? (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div style={{ backgroundColor: '#FAF9F7' }}>
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className="text-lg">{feature.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botão de Compra */}
            <div className="text-center">
              <Button
                onClick={onPurchase}
                className={`
                  w-full py-6 text-xl font-bold rounded-xl
                  bg-gradient-to-r from-[#B89B7A] to-[#D4B896]
                  hover:from-[#A08766] hover:to-[#C4A886]
                  text-white shadow-lg hover:shadow-xl
                  transform hover:scale-105 transition-all duration-200
                  ${deviceView === 'mobile' ? 'text-lg py-4' : ''}
                `}
                data-testid="purchase-button"
              >
                {buttonText}
              </Button>

              {buttonSubtext && <p style={{ color: '#8B7355' }}>{buttonSubtext}</p>}
            </div>

            {/* Garantia */}
            {showGuarantee && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-green-800 font-medium">{guaranteeText}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Urgência */}
        {urgencyText && (
          <div className="mt-8 text-center">
            <div style={{ backgroundColor: '#FAF9F7' }}>
              <p className="font-semibold text-lg">⏰ {urgencyText}</p>
            </div>
          </div>
        )}

        {/* Escassez */}
        {scarcityText && (
          <div className="mt-4 text-center">
            <p style={{ color: '#6B4F43' }}>{scarcityText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesOffer;
