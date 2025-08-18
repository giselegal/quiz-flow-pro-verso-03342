/* @ts-nocheck */
// @ts-nocheck
import { getOptimizedContainerClasses } from '@/config/containerConfig';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Zap, CheckCircle, Award, TrendingUp, Heart } from 'lucide-react';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import { DeviceView, StyleProps } from './types';

interface FeatureItem {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  imageUrl?: string;
  isHighlighted?: boolean;
  badge?: string;
}

interface FeatureHighlightProps extends StyleProps {
  /** Título da seção */
  title?: string;
  /** Subtítulo/descrição da seção */
  subtitle?: string;
  /** Lista de recursos/benefícios */
  features: FeatureItem[];
  /** Layout da seção */
  layout?: 'grid' | 'list' | 'cards' | 'alternating';
  /** Número de colunas no grid */
  columns?: 1 | 2 | 3 | 4;
  /** Mostrar ícones */
  showIcons?: boolean;
  /** Mostrar imagens */
  showImages?: boolean;
  /** Configuração de animações */
  animationConfig?: {
    disabled?: boolean;
    duration?: number;
    staggerDelay?: number;
  };
  /** Configuração de viewport */
  deviceView?: DeviceView;
  /** Callback para clique no recurso */
  onFeatureClick?: (feature: FeatureItem) => void;
  /** Callback para ação */
  onAction?: () => void;
  /** Texto do botão de ação */
  actionText?: string;
  /** Mostrar botão de ação */
  showAction?: boolean;
}

/**
 * FeatureHighlight - Seção de destaque de recursos e benefícios
 * Exibe os principais benefícios de forma visual e atrativa
 */
export const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  title = 'Por Que Escolher Nossa Solução?',
  subtitle = 'Descubra os benefícios únicos que oferecemos:',
  features,
  layout = 'grid',
  columns = 3,
  showIcons = true,
  showImages = true,
  animationConfig = {},
  deviceView = 'desktop',
  onFeatureClick,
  onAction,
  actionText = 'Começar Agora',
  showAction = true,
  className,
  style,
  customStyles,
}) => {
  const { disabled: animationsDisabled, duration = 400, staggerDelay = 200 } = animationConfig;
  const isLowPerformance = deviceView === 'mobile';

  const getGridColumns = () => {
    if (deviceView === 'mobile') return 'grid-cols-1';
    if (deviceView === 'tablet') return columns > 2 ? 'grid-cols-2' : `grid-cols-${columns}`;
    return `grid-cols-${Math.min(columns, features.length)}`;
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'list':
        return 'space-y-2';
      case 'cards':
        return 'space-y-2';
      case 'alternating':
        return 'space-y-12';
      default:
        return `grid ${getGridColumns()} gap-6`;
    }
  };

  const getDefaultIcon = (index: number) => {
    const icons = [
      <Star className="w-6 h-6" />,
      <Zap className="w-6 h-6" />,
      <Award className="w-6 h-6" />,
      <TrendingUp className="w-6 h-6" />,
      <Heart className="w-6 h-6" />,
      <CheckCircle className="w-6 h-6" />,
    ];
    return icons[index % icons.length];
  };

  const renderFeature = (feature: FeatureItem, index: number) => {
    const isEven = index % 2 === 0;

    if (layout === 'alternating') {
      return (
        <div
          key={feature.id}
          className={`flex flex-col md:flex-row items-center gap-8 ${!isEven ? 'md:flex-row-reverse' : ''}`}
        >
          {/* Image/Icon */}
          {(showImages && feature.imageUrl) ||
            (showIcons && !feature.imageUrl && (
              <div className="flex-shrink-0 w-full md:w-1/2">
                {feature.imageUrl && showImages ? (
                  <div className="relative">
                    <img
                      src={feature.imageUrl}
                      alt={feature.title}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                      loading="lazy"
                    />
                    {feature.badge && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-3 py-1 rounded-full text-sm font-medium">
                        {feature.badge}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div
                      className={`w-32 h-32 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center text-white ${
                        feature.isHighlighted ? 'ring-4 ring-[#B89B7A] ring-opacity-30' : ''
                      }`}
                    >
                      {feature.icon || getDefaultIcon(index)}
                    </div>
                  </div>
                )}
              </div>
            ))}

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            {feature.badge && !feature.imageUrl && (
              <div className="mb-4">
                <span className="bg-[#B89B7A]/10 text-[#432818] px-3 py-1 rounded-full text-sm font-medium">
                  {feature.badge}
                </span>
              </div>
            )}
            <h3 className="text-2xl font-semibold text-[#432818] mb-4">{feature.title}</h3>
            <p className="text-[#6B4F43] leading-relaxed text-lg">{feature.description}</p>
          </div>
        </div>
      );
    }

    if (layout === 'list') {
      return (
        <div
          key={feature.id}
          className="flex items-start gap-6 cursor-pointer hover:bg-[#f9f4ef] p-4 rounded-lg transition-colors duration-300"
          onClick={() => onFeatureClick?.(feature)}
        >
          {/* Icon */}
          {showIcons && (
            <div className="flex-shrink-0">
              <div
                className={`w-12 h-12 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center text-white ${
                  feature.isHighlighted ? 'ring-2 ring-[#B89B7A] ring-opacity-30' : ''
                }`}
              >
                {feature.icon || getDefaultIcon(index)}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1">
            {feature.badge && (
              <div className="mb-2">
                <span className="bg-[#B89B7A]/10 text-[#432818] px-2 py-1 rounded-full text-xs font-medium">
                  {feature.badge}
                </span>
              </div>
            )}
            <h3 className="text-lg font-semibold text-[#432818] mb-2">{feature.title}</h3>
            <p className="text-[#6B4F43] leading-relaxed">{feature.description}</p>
          </div>
        </div>
      );
    }

    if (layout === 'cards') {
      return (
        <Card
          key={feature.id}
          className={`p-8 text-center cursor-pointer hover:shadow-lg transition-all duration-300 border-0 ${
            feature.isHighlighted
              ? 'ring-2 ring-[#B89B7A] ring-opacity-50 bg-gradient-to-br from-white to-[#f9f4ef]'
              : ''
          }`}
          onClick={() => onFeatureClick?.(feature)}
        >
          {/* Badge */}
          {feature.badge && (
            <div className="mb-4">
              <span className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-3 py-1 rounded-full text-sm font-medium">
                {feature.badge}
              </span>
            </div>
          )}

          {/* Image or Icon */}
          {feature.imageUrl && showImages ? (
            <div className="mb-6">
              <img
                src={feature.imageUrl}
                alt={feature.title}
                className="w-full h-48 object-cover rounded-lg shadow-md mx-auto"
                loading="lazy"
              />
            </div>
          ) : (
            showIcons && (
              <div className="mb-6">
                <div
                  className={`w-16 h-16 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center text-white mx-auto ${
                    feature.isHighlighted ? 'ring-4 ring-[#B89B7A] ring-opacity-30' : ''
                  }`}
                >
                  {feature.icon || getDefaultIcon(index)}
                </div>
              </div>
            )
          )}

          {/* Content */}
          <h3 className="text-xl font-semibold text-[#432818] mb-4">{feature.title}</h3>
          <p className="text-[#6B4F43] leading-relaxed">{feature.description}</p>
        </Card>
      );
    }

    // Default grid layout
    return (
      <Card
        key={feature.id}
        className={`p-6 text-center cursor-pointer hover:shadow-md transition-all duration-300 border-0 ${
          feature.isHighlighted
            ? 'ring-2 ring-[#B89B7A] ring-opacity-50 bg-gradient-to-br from-white to-[#f9f4ef]'
            : ''
        }`}
        onClick={() => onFeatureClick?.(feature)}
      >
        {/* Badge */}
        {feature.badge && (
          <div className="mb-3">
            <span className="bg-[#B89B7A]/10 text-[#432818] px-2 py-1 rounded-full text-xs font-medium">
              {feature.badge}
            </span>
          </div>
        )}

        {/* Icon */}
        {showIcons && (
          <div className="mb-4">
            <div
              className={`w-12 h-12 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center text-white mx-auto ${
                feature.isHighlighted ? 'ring-2 ring-[#B89B7A] ring-opacity-30' : ''
              }`}
            >
              {feature.icon || getDefaultIcon(index)}
            </div>
          </div>
        )}

        {/* Content */}
        <h3 className="text-lg font-semibold text-[#432818] mb-3">{feature.title}</h3>
        <p className="text-[#6B4F43] leading-relaxed text-sm">{feature.description}</p>
      </Card>
    );
  };

  return (
    <div className={`py-12 ${className || ''}`} style={style}>
      {customStyles && <style dangerouslySetInnerHTML={{ __html: customStyles }} />}

      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-playfair text-[#aa6b5d] mb-2">{title}</h2>
        {subtitle && <p className="text-center text-[#3a3a3a] mb-6 max-w-lg mx-auto">{subtitle}</p>}
        <div className="elegant-divider w-32 mx-auto"></div>
      </div>

      {/* Features */}
      <div className="max-w-full mx-auto">
        <div className={getLayoutClasses()}>
          {features.map((feature, index) => (
            <AnimatedWrapper
              key={feature.id}
              animation={animationsDisabled || isLowPerformance ? 'none' : 'fade'}
              show={true}
              duration={duration}
              delay={staggerDelay * index}
            >
              {renderFeature(feature, index)}
            </AnimatedWrapper>
          ))}
        </div>

        {/* Action */}
        {showAction && onAction && (
          <AnimatedWrapper
            animation={animationsDisabled || isLowPerformance ? 'none' : 'fade'}
            show={true}
            duration={duration}
            delay={staggerDelay * features.length}
          >
            <div className="text-center mt-12">
              <Button
                onClick={onAction}
                className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-10 py-4 rounded-lg hover:scale-105 transition-transform duration-300 text-lg font-semibold"
              >
                {actionText}
              </Button>
            </div>
          </AnimatedWrapper>
        )}
      </div>
    </div>
  );
};

export default FeatureHighlight;
