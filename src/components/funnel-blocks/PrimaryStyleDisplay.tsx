import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import { DeviceView, StyleProps } from './types';

interface PrimaryStyleDisplayProps extends StyleProps {
  /** Estilo primário detectado */
  primaryStyle: {
    category: string;
    percentage: number;
    description?: string;
  };
  /** Estilos secundários */
  secondaryStyles?: Array<{
    category: string;
    percentage: number;
  }>;
  /** URL da imagem do estilo */
  styleImage: string;
  /** URL da imagem do guia */
  guideImage: string;
  /** Configuração de animações */
  animationConfig?: {
    disabled?: boolean;
    duration?: number;
    delay?: number;
  };
  /** Configuração de viewport */
  deviceView?: DeviceView;
  /** Callback para clique na imagem */
  onImageClick?: () => void;
}

/**
 * PrimaryStyleDisplay - Exibe o resultado do estilo predominante com imagens e estilos secundários
 * Usado na página de resultados do quiz
 */
export const PrimaryStyleDisplay: React.FC<PrimaryStyleDisplayProps> = ({
  primaryStyle,
  secondaryStyles = [],
  styleImage,
  guideImage,
  animationConfig = {},
  deviceView = 'desktop',
  onImageClick,
  className,
  style,
  customStyles
}) => {
  const { disabled: animationsDisabled, duration = 600, delay = 300 } = animationConfig;
  const isLowPerformance = deviceView === 'mobile';

  return (
    <Card className={`p-6 mb-10 bg-white shadow-md border border-[#B89B7A]/20 card-elegant ${className || ''}`} style={style}>
      {customStyles && (
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      )}
      
      <AnimatedWrapper 
        animation={animationsDisabled || isLowPerformance ? 'none' : 'fade'} 
        show={true} 
        duration={duration} 
        delay={delay}
      >
        <div className="text-center mb-8">
          <div className="max-w-md mx-auto mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[#8F7A6A]">
                Seu estilo predominante
              </span>
              <span className="text-[#aa6b5d] font-medium">{primaryStyle.percentage}%</span>
            </div>
            <Progress 
              value={primaryStyle.percentage} 
              className="h-2 bg-[#F3E8E6]" 
              indicatorClassName="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d]" 
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <AnimatedWrapper 
              animation={isLowPerformance ? 'none' : 'fade'} 
              show={true} 
              duration={400} 
              delay={delay + 100}
            >
              {primaryStyle.description && (
                <p className="text-[#432818] leading-relaxed">{primaryStyle.description}</p>
              )}
            </AnimatedWrapper>
            
            {secondaryStyles.length > 0 && (
              <AnimatedWrapper 
                animation={isLowPerformance ? 'none' : 'fade'} 
                show={true} 
                duration={400} 
                delay={delay + 300}
              >
                <div className="bg-white rounded-lg p-4 shadow-sm border border-[#B89B7A]/10 glass-panel">
                  <h3 className="text-lg font-medium text-[#432818] mb-2">
                    Estilos que Também Influenciam Você
                  </h3>
                  <div className="space-y-2">
                    {secondaryStyles.map((style, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-[#432818] capitalize">{style.category}</span>
                        <span className="text-sm text-[#aa6b5d] font-medium">{style.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedWrapper>
            )}
          </div>
          
          <AnimatedWrapper 
            animation={isLowPerformance ? 'none' : 'scale'} 
            show={true} 
            duration={500} 
            delay={delay + 200}
          >
            <div className="max-w-[238px] mx-auto relative">
              <img 
                src={`${styleImage}?q=auto:best&f=auto&w=238`} 
                alt={`Estilo ${primaryStyle.category}`} 
                className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer" 
                loading="eager" 
                fetchpriority="high" 
                width="238" 
                height="auto"
                onClick={onImageClick}
              />
              {/* Decorative corners */}
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#B89B7A]"></div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#B89B7A]"></div>
            </div>
          </AnimatedWrapper>
        </div>
        
        <AnimatedWrapper 
          animation={isLowPerformance ? 'none' : 'fade'} 
          show={true} 
          duration={400} 
          delay={delay + 500}
        >
          <div className="mt-8 max-w-[540px] mx-auto relative">
            <img 
              src={`${guideImage}?q=auto:best&f=auto&w=540`} 
              alt={`Guia de Estilo ${primaryStyle.category}`} 
              loading="lazy" 
              className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer" 
              width="540" 
              height="auto"
              onClick={onImageClick}
            />
            {/* Elegant badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium transform rotate-12">
              Exclusivo
            </div>
          </div>
        </AnimatedWrapper>
      </AnimatedWrapper>
    </Card>
  );
};

export default PrimaryStyleDisplay;
