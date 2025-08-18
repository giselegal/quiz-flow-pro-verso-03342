/* @ts-nocheck */
// @ts-nocheck
import { getOptimizedContainerClasses } from '@/config/containerConfig';
import { Card } from '@/components/ui/card';
import { Gift, Star } from 'lucide-react';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import { DeviceView, StyleProps } from './types';

interface BonusItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  value?: string;
  badge?: string;
  isHighlighted?: boolean;
}

interface BonusSectionProps extends StyleProps {
  /** Título da seção */
  title?: string;
  /** Subtítulo/descrição da seção */
  subtitle?: string;
  /** Lista de bônus */
  bonuses: BonusItem[];
  /** Configuração de layout */
  layout?: 'grid' | 'list' | 'carousel';
  /** Número de colunas no grid (apenas layout grid) */
  columns?: 1 | 2 | 3 | 4;
  /** Configuração de animações */
  animationConfig?: {
    disabled?: boolean;
    duration?: number;
    staggerDelay?: number;
  };
  /** Configuração de viewport */
  deviceView?: DeviceView;
  /** Callback para clique no bônus */
  onBonusClick?: (bonus: BonusItem) => void;
}

/**
 * BonusSection - Seção de bônus e benefícios extras
 * Exibe lista de bônus com imagens, títulos e descrições
 */
export const BonusSection: React.FC<BonusSectionProps> = ({
  title = 'Bônus Exclusivos para Você',
  subtitle = 'Além do produto principal, você receberá estas ferramentas complementares:',
  bonuses,
  layout = 'grid',
  columns = 2,
  animationConfig = {},
  deviceView = 'desktop',
  onBonusClick,
  className,
  style,
  customStyles,
}) => {
  const { disabled: animationsDisabled, duration = 400, staggerDelay = 200 } = animationConfig;
  const isLowPerformance = deviceView === 'mobile';

  const getGridColumns = () => {
    if (deviceView === 'mobile') return 'grid-cols-1';
    if (deviceView === 'tablet') return columns > 2 ? 'grid-cols-2' : `grid-cols-${columns}`;
    return `grid-cols-${Math.min(columns, bonuses.length)}`;
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'list':
        return 'space-y-2';
      case 'carousel':
        return 'flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory';
      default:
        return `grid ${getGridColumns()} gap-6`;
    }
  };

  return (
    <div className={`py-10 ${className || ''}`} style={style}>
      {customStyles && <style dangerouslySetInnerHTML={{ __html: customStyles }} />}

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-playfair text-[#aa6b5d] mb-2">{title}</h2>
        {subtitle && <p className="text-center text-[#3a3a3a] mb-6 max-w-md mx-auto">{subtitle}</p>}
        <div className="elegant-divider w-32 mx-auto"></div>
      </div>

      {/* Bonuses */}
      <div className="max-w-full mx-auto">
        <div className={getLayoutClasses()}>
          {bonuses.map((bonus, index) => (
            <AnimatedWrapper
              key={bonus.id}
              animation={animationsDisabled || isLowPerformance ? 'none' : 'fade'}
              show={true}
              duration={duration}
              delay={staggerDelay * index}
            >
              <Card
                className={`p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300 border-0 cursor-pointer transform-3d hover:scale-[1.02] ${
                  bonus.isHighlighted ? 'ring-2 ring-[#B89B7A] ring-opacity-50' : ''
                } ${layout === 'carousel' ? 'min-w-[280px] snap-start' : ''}`}
                onClick={() => onBonusClick?.(bonus)}
              >
                {/* Badge */}
                {bonus.badge && (
                  <div className="flex justify-center mb-2">
                    <span className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      {bonus.badge}
                    </span>
                  </div>
                )}

                {/* Image */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-full max-w-[200px]">
                    <img
                      src={bonus.imageUrl}
                      alt={bonus.title}
                      className="w-full h-auto rounded-lg shadow-sm"
                      loading="lazy"
                    />
                    {bonus.isHighlighted && (
                      <div className="absolute -top-2 -right-2">
                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-[#432818] mb-2">{bonus.title}</h3>
                  <p className="text-sm text-[#6B4F43] leading-relaxed mb-3">{bonus.description}</p>

                  {/* Value */}
                  {bonus.value && (
                    <div className="text-center">
                      <span className="text-sm text-[#aa6b5d] font-medium bg-[#aa6b5d]/10 px-3 py-1 rounded-full">
                        Valor: {bonus.value}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </AnimatedWrapper>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BonusSection;
