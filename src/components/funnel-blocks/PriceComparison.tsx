/* @ts-nocheck */
// @ts-nocheck
import { getOptimizedContainerClasses } from '@/config/containerConfig';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, X, Star, Crown, Zap, ArrowRight } from 'lucide-react';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import { DeviceView, StyleProps } from './types';

interface PriceOption {
  id: string;
  name: string;
  originalPrice?: number;
  currentPrice: number;
  savings?: number;
  savingsPercentage?: number;
  isRecommended?: boolean;
  isPremium?: boolean;
  features: string[];
  excludedFeatures?: string[];
  badge?: string;
  description?: string;
}

interface PriceComparisonProps extends StyleProps {
  /** Título da seção */
  title?: string;
  /** Subtítulo/descrição da seção */
  subtitle?: string;
  /** Opções de preço */
  priceOptions: PriceOption[];
  /** Moeda */
  currency?: string;
  /** Layout da comparação */
  layout?: 'side-by-side' | 'stacked' | 'table';
  /** Destacar preço recomendado */
  highlightRecommended?: boolean;
  /** Configuração de animações */
  animationConfig?: {
    disabled?: boolean;
    duration?: number;
    staggerDelay?: number;
  };
  /** Configuração de viewport */
  deviceView?: DeviceView;
  /** Callback para seleção de preço */
  onPriceSelect?: (option: PriceOption) => void;
  /** Texto do botão */
  buttonText?: string;
}

/**
 * PriceComparison - Componente de comparação de preços
 * Exibe opções de preço lado a lado para facilitar a escolha
 */
export const PriceComparison: React.FC<PriceComparisonProps> = ({
  title = 'Escolha Seu Plano',
  subtitle = 'Compare as opções e escolha a que melhor atende suas necessidades:',
  priceOptions,
  currency = 'R$',
  layout = 'side-by-side',
  highlightRecommended = true,
  animationConfig = {},
  deviceView = 'desktop',
  onPriceSelect,
  buttonText = 'Escolher Este Plano',
  className,
  style,
  customStyles,
}) => {
  const { disabled: animationsDisabled, duration = 400, staggerDelay = 200 } = animationConfig;
  const isLowPerformance = deviceView === 'mobile';

  const formatPrice = (price: number) => {
    return `${currency} ${price.toFixed(2).replace('.', ',')}`;
  };

  const getLayoutClasses = () => {
    if (layout === 'stacked' || deviceView === 'mobile') {
      return 'space-y-2';
    }
    if (layout === 'table') {
      return 'overflow-x-auto';
    }
    return `grid ${deviceView === 'tablet' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`;
  };

  const renderPriceCard = (option: PriceOption, index: number) => (
    <AnimatedWrapper
      key={option.id}
      animation={animationsDisabled || isLowPerformance ? 'none' : 'fade'}
      show={true}
      duration={duration}
      delay={staggerDelay * index}
    >
      <Card
        className={`relative p-6 transition-all duration-300 cursor-pointer hover:scale-105 h-full ${
          option.isRecommended && highlightRecommended
            ? 'ring-2 ring-[#B89B7A] shadow-lg border-[#B89B7A] bg-gradient-to-br from-white to-[#f9f4ef]'
            : 'border border-gray-200 hover:shadow-md'
        } ${layout === 'stacked' ? 'max-w-md mx-auto' : ''}`}
        onClick={() => onPriceSelect?.(option)}
      >
        {/* Recommended badge */}
        {option.isRecommended && highlightRecommended && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Recomendado
            </div>
          </div>
        )}

        {/* Premium badge */}
        {option.isPremium && (
          <div className="absolute top-4 right-4">
            <Crown className="w-5 h-5 text-yellow-500" />
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-[#432818] mb-2">{option.name}</h3>
          {option.description && (
            <p className="text-sm text-[#6B4F43] mb-4">{option.description}</p>
          )}

          {/* Badge */}
          {option.badge && (
            <div className="mb-4">
              <span className="bg-[#B89B7A]/10 text-[#432818] px-3 py-1 rounded-full text-xs font-medium">
                {option.badge}
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mb-4">
            {option.originalPrice && option.originalPrice > option.currentPrice && (
              <div className="relative mb-2">
                <span style={{ color: '#8B7355' }}>{formatPrice(option.originalPrice)}</span>
                <div style={{ backgroundColor: '#FAF9F7' }}></div>
              </div>
            )}
            <div className="text-3xl font-bold text-[#aa6b5d]">
              {formatPrice(option.currentPrice)}
            </div>

            {/* Savings */}
            {option.savings && (
              <div className="mt-2 text-sm">
                <span className="text-green-600 font-semibold">
                  Economize {formatPrice(option.savings)}
                  {option.savingsPercentage && ` (${option.savingsPercentage}%)`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mb-6 space-y-3">
          {option.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#432818]">{feature}</span>
            </div>
          ))}

          {/* Excluded features */}
          {option.excludedFeatures &&
            option.excludedFeatures.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 opacity-50">
                <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span style={{ color: '#8B7355' }}>{feature}</span>
              </div>
            ))}
        </div>

        {/* Action button */}
        <Button
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
            option.isRecommended && highlightRecommended
              ? 'bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white hover:scale-105'
              : 'bg-white border-2 border-[#B89B7A] text-[#432818] hover:bg-[#f9f4ef]'
          }`}
          onClick={e => {
            e.stopPropagation();
            onPriceSelect?.(option);
          }}
        >
          <span className="flex items-center justify-center gap-2">
            {option.isPremium && <Zap className="w-4 h-4" />}
            {buttonText}
            <ArrowRight className="w-4 h-4" />
          </span>
        </Button>
      </Card>
    </AnimatedWrapper>
  );

  if (layout === 'table') {
    return (
      <div className={`py-12 ${className || ''}`} style={style}>
        {customStyles && <style dangerouslySetInnerHTML={{ __html: customStyles }} />}

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-playfair text-[#aa6b5d] mb-2">{title}</h2>
          {subtitle && (
            <p className="text-center text-[#3a3a3a] mb-6 max-w-lg mx-auto">{subtitle}</p>
          )}
          <div className="elegant-divider w-32 mx-auto"></div>
        </div>

        {/* Table comparison - implementação simplificada */}
        <div className="max-w-full mx-auto">
          <div className="overflow-x-auto">
            <div style={{ borderColor: '#E5DDD5' }}>
              {/* Headers */}
              <div style={{ backgroundColor: '#FAF9F7' }}>
                <div className="font-semibold text-[#432818]">Recursos</div>
                {priceOptions.slice(0, 3).map(option => (
                  <div key={option.id} className="text-center">
                    <h3 className="font-semibold text-[#432818]">{option.name}</h3>
                    <p className="text-lg font-bold text-[#aa6b5d] mt-1">
                      {formatPrice(option.currentPrice)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Features rows */}
              {priceOptions[0]?.features.map((feature, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-100">
                  <div className="text-sm text-[#432818]">{feature}</div>
                  {priceOptions.slice(0, 3).map(option => (
                    <div key={option.id} className="text-center">
                      {option.features.includes(feature) ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-400 mx-auto" />
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {/* Action buttons */}
              <div className="grid grid-cols-4 gap-4 p-4">
                <div></div>
                {priceOptions.slice(0, 3).map(option => (
                  <div key={option.id}>
                    <Button
                      className="w-full py-2 text-sm bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white rounded-lg"
                      onClick={() => onPriceSelect?.(option)}
                    >
                      Escolher
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-12 ${className || ''}`} style={style}>
      {customStyles && <style dangerouslySetInnerHTML={{ __html: customStyles }} />}

      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-playfair text-[#aa6b5d] mb-2">{title}</h2>
        {subtitle && <p className="text-center text-[#3a3a3a] mb-6 max-w-lg mx-auto">{subtitle}</p>}
        <div className="elegant-divider w-32 mx-auto"></div>
      </div>

      {/* Price options */}
      <div className="max-w-full mx-auto">
        <div className={getLayoutClasses()}>
          {priceOptions.map((option, index) => renderPriceCard(option, index))}
        </div>
      </div>
    </div>
  );
};

export default PriceComparison;
