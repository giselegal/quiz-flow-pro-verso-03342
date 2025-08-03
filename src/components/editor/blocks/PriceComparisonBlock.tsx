import React from 'react';
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

const PriceComparisonBlock: React.FC<PriceComparisonBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  className = ''
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
    cardStyle = 'modern'
  } = block.properties;

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
          ${isSelected 
            ? 'border-2 border-blue-500 bg-blue-50' 
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
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
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
                <tr key={plan.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{plan.name}</span>
                      {plan.isPopular && highlightPopular && (
                        <Badge className="bg-blue-500 text-white">Mais Popular</Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div>
                      <span className="text-2xl font-bold" style={{ color: accentColor }}>
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-gray-500 ml-1">/{plan.period}</span>
                      )}
                    </div>
                    {plan.originalPrice && showDiscount && (
                      <div className="text-sm text-gray-500 line-through">
                        {plan.originalPrice}
                      </div>
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
                        border: 'none'
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
        ${isSelected 
          ? 'border-2 border-blue-500 bg-blue-50' 
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
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Cards Grid */}
      <div className={`
        grid gap-6 
        ${plans.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 
          plans.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }
      `}>
        {plans.map((plan, index) => (
          <Card 
            key={plan.id}
            className={`
              relative h-full ${getCardStyleClasses()}
              ${plan.isPopular && highlightPopular ? 'ring-2 ring-blue-500 scale-105' : ''}
              ${animateOnHover ? 'hover:scale-105 transition-transform' : ''}
            `}
            style={{ borderRadius }}
          >
            {plan.isPopular && highlightPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-4 py-1">
                  Mais Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold mb-2">
                {plan.name}
              </CardTitle>
              
              <div className="mb-4">
                <span 
                  className="text-4xl font-bold"
                  style={{ color: accentColor }}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-gray-500 text-lg">/{plan.period}</span>
                )}
              </div>

              {plan.originalPrice && showDiscount && (
                <div className="text-lg text-gray-500 line-through mb-2">
                  {plan.originalPrice}
                </div>
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
                  ${plan.isPopular && highlightPopular 
                    ? 'text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                    : 'border-2 hover:text-white'
                  }
                `}
                style={{
                  backgroundColor: plan.isPopular && highlightPopular ? accentColor : 'transparent',
                  borderColor: accentColor,
                  color: plan.isPopular && highlightPopular ? 'white' : accentColor
                }}
                onMouseEnter={(e) => {
                  if (!plan.isPopular || !highlightPopular) {
                    e.currentTarget.style.backgroundColor = accentColor;
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!plan.isPopular || !highlightPopular) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = accentColor;
                  }
                }}
              >
                {plan.buttonText || 'Escolher Plano'}
              </button>

              {plan.footerText && (
                <p className="text-xs text-gray-500 text-center mt-3">
                  {plan.footerText}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {plans.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Nenhum plano configurado. Adicione planos nas propriedades do bloco.</p>
        </div>
      )}
    </div>
  );
};

export default PriceComparisonBlock;