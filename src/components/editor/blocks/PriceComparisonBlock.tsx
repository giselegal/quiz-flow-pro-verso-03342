// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, X } from 'lucide-react';
import type { BlockComponentProps, BlockData } from '@/types/blocks';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  period?: string;
  features: string[];
  isPopular?: boolean;
  buttonText?: string;
  buttonUrl?: string;
  badge?: string;
  footerText?: string;
}

interface PriceComparisonBlockProps extends BlockComponentProps {
  block: BlockData & {
    type: 'price-comparison';
    properties: {
      title?: string;
      subtitle?: string;
      plans?: PricingPlan[];
      layout?: 'cards' | 'table' | 'minimal';
      showDiscount?: boolean;
      showFeatures?: boolean;
      highlightPopular?: boolean;
      animateOnHover?: boolean;
      backgroundColor?: string;
      textColor?: string;
      accentColor?: string;
      borderRadius?: string;
      cardStyle?: 'modern' | 'classic' | 'flat' | 'rounded';
    };
  };
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

const PriceComparisonBlock: React.FC<PriceComparisonBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  const {
    title = 'Escolha seu Plano',
    subtitle = 'Planos flexíveis para todas as necessidades',
    plans = [],
    layout = 'cards',
    showDiscount = true,
    showFeatures = true,
    highlightPopular = true,
    animateOnHover = true,
    backgroundColor = '#ffffff',
    textColor = '#1f2937',
    accentColor = '#3b82f6',
    borderRadius = '12px',
    cardStyle = 'modern',
  } = block?.properties || {};

  const getCardStyleClasses = () => {
    switch (cardStyle) {
      case 'classic':
        return 'border-2 border-gray-300 shadow-md';
      case 'flat':
        return 'border border-gray-200 shadow-none';
      case 'rounded':
        return 'border border-gray-200 shadow-lg rounded-2xl';
      case 'modern':
      default:
        return 'border border-gray-100 shadow-lg hover:shadow-xl transition-shadow';
    }
  };

  if (layout === 'table') {
    return (
      <div
        className={`
          w-full p-6 rounded-lg cursor-pointer transition-all duration-200
          ${
            isSelected
              ? 'border-2 border-[#B89B7A] bg-[#B89B7A]/10'
              : 'border-2 border-dashed border-[#B89B7A]/40 hover:bg-[#FAF9F7]'
          }
          ${className}
        `}
        style={{ backgroundColor, color: textColor }}
        onClick={onClick}
        data-block-id={block.id}
        data-block-type={block.type}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ color: textColor }}>
            {title}
          </h2>
          <p style={{ color: '#6B4F43' }}>{subtitle}</p>
        </div>

        {/* Table Layout */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="text-left p-4 font-semibold">Plano</th>
                <th className="text-center p-4 font-semibold">Preço</th>
                <th className="text-center p-4 font-semibold">Recursos</th>
                <th className="text-center p-4 font-semibold">Ação</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan, index) => (
                <tr key={plan.id} style={{ backgroundColor: '#FAF9F7' }}>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{plan.name}</span>
                      {plan.isPopular && highlightPopular && (
                        <Badge className="bg-[#B89B7A]/100 text-white">Mais Popular</Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div>
                      <span className="text-2xl font-bold" style={{ color: accentColor }}>
                        {plan.price}
                      </span>
                      {plan.period && <span style={{ color: '#8B7355' }}>/{plan.period}</span>}
                    </div>
                    {plan.originalPrice && showDiscount && (
                      <div style={{ color: '#8B7355' }}>{plan.originalPrice}</div>
                    )}
                  </td>
                  <td className="p-4">
                    {showFeatures && (
                      <ul className="text-sm space-y-1">
                        {plan.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-1">
                            <Check className="w-4 h-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      className="px-4 py-2 rounded-lg font-medium transition-colors"
                      style={{
                        backgroundColor: accentColor,
                        color: 'white',
                        border: 'none',
                      }}
                    >
                      {plan.buttonText || 'Escolher'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Cards Layout (default)
  return (
    <div
      className={`
        w-full p-6 rounded-lg cursor-pointer transition-all duration-200
        ${
          isSelected
            ? 'border-2 border-[#B89B7A] bg-[#B89B7A]/10'
            : 'border-2 border-dashed border-[#B89B7A]/40 hover:bg-[#FAF9F7]'
        }
        ${className}
      `}
      style={{ backgroundColor, color: textColor }}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: textColor }}>
          {title}
        </h2>
        <p style={{ color: '#6B4F43' }}>{subtitle}</p>
      </div>

      {/* Cards Grid */}
      <div
        className={`
        grid gap-6 
        ${
          plans.length === 1
            ? 'grid-cols-1 max-w-md mx-auto'
            : plans.length === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }
      `}
      >
        {plans.map((plan, index) => (
          <Card
            key={plan.id}
            className={`
              relative h-full ${getCardStyleClasses()}
              ${plan.isPopular && highlightPopular ? 'ring-2 ring-[#B89B7A] scale-105' : ''}
              ${animateOnHover ? 'hover:scale-105 transition-transform' : ''}
            `}
            style={{ borderRadius }}
          >
            {plan.isPopular && highlightPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-[#B89B7A]/100 text-white px-4 py-1">Mais Popular</Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold mb-2">{plan.name}</CardTitle>

              <div className="mb-4">
                <span className="text-4xl font-bold" style={{ color: accentColor }}>
                  {plan.price}
                </span>
                {plan.period && <span style={{ color: '#8B7355' }}>/{plan.period}</span>}
              </div>

              {plan.originalPrice && showDiscount && (
                <div style={{ color: '#8B7355' }}>{plan.originalPrice}</div>
              )}

              {plan.badge && (
                <Badge variant="secondary" className="mb-4">
                  {plan.badge}
                </Badge>
              )}
            </CardHeader>

            <CardContent className="pt-0">
              {showFeatures && plan.features.length > 0 && (
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              <button
                className={`
                  w-full py-3 px-4 rounded-lg font-semibold transition-all
                  ${
                    plan.isPopular && highlightPopular
                      ? 'text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'border-2 hover:text-white'
                  }
                `}
                style={{
                  backgroundColor: plan.isPopular && highlightPopular ? accentColor : 'transparent',
                  borderColor: accentColor,
                  color: plan.isPopular && highlightPopular ? 'white' : accentColor,
                }}
                onMouseEnter={e => {
                  if (!plan.isPopular || !highlightPopular) {
                    e.currentTarget.style.backgroundColor = accentColor;
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={e => {
                  if (!plan.isPopular || !highlightPopular) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = accentColor;
                  }
                }}
              >
                {plan.buttonText || 'Escolher Plano'}
              </button>

              {plan.footerText && <p style={{ color: '#8B7355' }}>{plan.footerText}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {plans.length === 0 && (
        <div style={{ color: '#8B7355' }}>
          <p>Nenhum plano configurado. Adicione planos nas propriedades do bloco.</p>
        </div>
      )}
    </div>
  );
};

export default PriceComparisonBlock;
