/* @ts-nocheck */
// @ts-nocheck
import { getOptimizedContainerClasses } from '@/config/containerConfig';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, TrendingUp, Award, Target, Clock } from 'lucide-react';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import { DeviceView, StyleProps } from './types';

interface MotivationItem {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  isHighlighted?: boolean;
}

interface MotivationSectionProps extends StyleProps {
  /** Título da seção */
  title?: string;
  /** Subtítulo/descrição da seção */
  subtitle?: string;
  /** Lista de motivações/benefícios */
  motivations: MotivationItem[];
  /** Layout da seção */
  layout?: 'grid' | 'list' | 'horizontal';
  /** Mostrar ícones */
  showIcons?: boolean;
  /** Configuração de animações */
  animationConfig?: {
    disabled?: boolean;
    duration?: number;
    staggerDelay?: number;
  };
  /** Configuração de viewport */
  deviceView?: DeviceView;
  /** Callback para ação */
  onAction?: () => void;
  /** Texto do botão de ação */
  actionText?: string;
  /** Mostrar botão de ação */
  showAction?: boolean;
}

/**
 * MotivationSection - Seção de motivação e benefícios
 * Destaca os principais benefícios e motivos para agir
 */
export const MotivationSection: React.FC<MotivationSectionProps> = ({
  title = 'Por Que Isso Funciona?',
  subtitle = 'Descubra os motivos pelos quais nossa abordagem transforma vidas:',
  motivations,
  layout = 'grid',
  showIcons = true,
  animationConfig = {},
  deviceView = 'desktop',
  onAction,
  actionText = 'Começar Agora',
  showAction = true,
  className,
  style,
  customStyles,
}) => {
  const { disabled: animationsDisabled, duration = 400, staggerDelay = 200 } = animationConfig;
  const isLowPerformance = deviceView === 'mobile';

  const getLayoutClasses = () => {
    switch (layout) {
      case 'list':
        return 'space-y-2';
      case 'horizontal':
        return 'grid grid-cols-1 md:grid-cols-3 gap-6';
      default:
        return `grid ${deviceView === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`;
    }
  };

  const getDefaultIcon = (index: number) => {
    const icons = [
      <Target className="w-6 h-6" />,
      <TrendingUp className="w-6 h-6" />,
      <Award className="w-6 h-6" />,
      <CheckCircle className="w-6 h-6" />,
      <Clock className="w-6 h-6" />,
    ];
    return icons[index % icons.length];
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

      {/* Content */}
      <div className="max-w-full mx-auto">
        <div className={getLayoutClasses()}>
          {motivations.map((motivation, index) => (
            <AnimatedWrapper
              key={motivation.id}
              animation={animationsDisabled || isLowPerformance ? 'none' : 'fade'}
              show={true}
              duration={duration}
              delay={staggerDelay * index}
            >
              <Card
                className={`p-6 bg-white shadow-sm hover:shadow-md transition-all duration-300 border-0 h-full ${
                  motivation.isHighlighted
                    ? 'ring-2 ring-[#B89B7A] ring-opacity-50 bg-gradient-to-br from-white to-[#f9f4ef]'
                    : ''
                }`}
              >
                <div className={`${layout === 'list' ? 'flex items-start gap-4' : 'text-center'}`}>
                  {/* Icon */}
                  {showIcons && (
                    <div
                      className={`flex-shrink-0 ${layout === 'list' ? '' : 'flex justify-center mb-4'}`}
                    >
                      <div
                        className={`w-12 h-12 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center text-white ${
                          motivation.isHighlighted ? 'ring-2 ring-[#B89B7A] ring-opacity-30' : ''
                        }`}
                      >
                        {motivation.icon || getDefaultIcon(index)}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className={layout === 'list' ? 'flex-1' : ''}>
                    <h3
                      className={`text-lg font-semibold text-[#432818] mb-3 ${layout === 'list' ? 'text-left' : 'text-center'}`}
                    >
                      {motivation.title}
                    </h3>
                    <p
                      className={`text-[#6B4F43] leading-relaxed ${layout === 'list' ? 'text-left' : 'text-center'}`}
                    >
                      {motivation.description}
                    </p>
                  </div>
                </div>
              </Card>
            </AnimatedWrapper>
          ))}
        </div>

        {/* Action */}
        {showAction && onAction && (
          <AnimatedWrapper
            animation={animationsDisabled || isLowPerformance ? 'none' : 'fade'}
            show={true}
            duration={duration}
            delay={staggerDelay * motivations.length}
          >
            <div className="text-center mt-10">
              <Button
                onClick={onAction}
                className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-8 py-4 rounded-lg hover:scale-105 transition-transform duration-300 text-lg font-semibold"
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

export default MotivationSection;
