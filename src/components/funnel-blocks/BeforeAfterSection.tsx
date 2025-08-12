// @ts-nocheck
import { getOptimizedContainerClasses } from '@/config/containerConfig';
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Users, Quote } from 'lucide-react';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import { DeviceView, StyleProps } from './types';

interface TransformationItem {
  id: string;
  name: string;
  beforeImage?: string;
  afterImage?: string;
  combinedImage?: string;
  testimonial?: string;
  results?: string[];
  age?: string;
  location?: string;
}

interface BeforeAfterSectionProps extends StyleProps {
  /** Título da seção */
  title?: string;
  /** Subtítulo/descrição da seção */
  subtitle?: string;
  /** Lista de transformações */
  transformations: TransformationItem[];
  /** Modo de exibição */
  displayMode?: 'carousel' | 'grid' | 'single';
  /** Mostrar depoimentos junto com as imagens */
  showTestimonials?: boolean;
  /** Mostrar resultados/benefícios */
  showResults?: boolean;
  /** Configuração de animações */
  animationConfig?: {
    disabled?: boolean;
    duration?: number;
    autoPlay?: boolean;
    autoPlayInterval?: number;
  };
  /** Configuração de viewport */
  deviceView?: DeviceView;
  /** Callback para clique na transformação */
  onTransformationClick?: (transformation: TransformationItem) => void;
  /** Callback para continuar/CTA */
  onContinue?: () => void;
}

/**
 * BeforeAfterSection - Seção de transformações antes e depois
 * Exibe galeria de transformações de clientes reais
 */
export const BeforeAfterSection: React.FC<BeforeAfterSectionProps> = ({
  title = 'Transformações Reais de Nossas Clientes',
  subtitle = 'Veja como outras mulheres transformaram seu estilo e autoestima:',
  transformations,
  displayMode = 'carousel',
  showTestimonials = true,
  showResults = true,
  animationConfig = {},
  deviceView = 'desktop',
  onTransformationClick,
  onContinue,
  className,
  style,
  customStyles,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const {
    disabled: animationsDisabled,
    duration = 400,
    autoPlay = false,
    autoPlayInterval = 5000,
  } = animationConfig;
  const isLowPerformance = deviceView === 'mobile';

  // Auto-play carousel
  React.useEffect(() => {
    if (!autoPlay || displayMode !== 'carousel') return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % transformations.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, transformations.length, displayMode]);

  const nextTransformation = () => {
    setCurrentIndex(prev => (prev + 1) % transformations.length);
  };

  const prevTransformation = () => {
    setCurrentIndex(prev => (prev - 1 + transformations.length) % transformations.length);
  };

  const renderTransformation = (transformation: TransformationItem, index: number) => (
    <div
      key={transformation.id}
      className="w-full"
      onClick={() => onTransformationClick?.(transformation)}
    >
      <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
        {/* Header with name and info */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-[#432818] mb-1">{transformation.name}</h3>
          {(transformation.age || transformation.location) && (
            <p className="text-sm text-[#6B4F43]">
              {[transformation.age, transformation.location].filter(Boolean).join(' • ')}
            </p>
          )}
        </div>

        {/* Images */}
        <div className="mb-6">
          {transformation.combinedImage ? (
            // Combined before/after image
            <div className="relative max-w-md mx-auto">
              <img
                src={transformation.combinedImage}
                alt={`Transformação de ${transformation.name}`}
                className="w-full h-auto rounded-lg shadow-md"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                Antes & Depois
              </div>
            </div>
          ) : (
            // Separate before/after images
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {transformation.beforeImage && (
                <div className="relative">
                  <img
                    src={transformation.beforeImage}
                    alt={`${transformation.name} - Antes`}
                    className="w-full h-auto rounded-lg shadow-md"
                    loading="lazy"
                  />
                  <div style={{ backgroundColor: '#FAF9F7' }}>Antes</div>
                </div>
              )}
              {transformation.afterImage && (
                <div className="relative">
                  <img
                    src={transformation.afterImage}
                    alt={`${transformation.name} - Depois`}
                    className="w-full h-auto rounded-lg shadow-md"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                    Depois
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Testimonial */}
        {showTestimonials && transformation.testimonial && (
          <div className="mb-4">
            <div className="bg-[#f9f4ef] p-4 rounded-lg border-l-4 border-[#B89B7A]">
              <Quote className="w-5 h-5 text-[#B89B7A] mb-2" />
              <p className="text-sm text-[#432818] italic leading-relaxed">
                "{transformation.testimonial}"
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && transformation.results && transformation.results.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-[#aa6b5d] mb-2">Resultados alcançados:</h4>
            <ul className="space-y-1">
              {transformation.results.map((result, idx) => (
                <li key={idx} className="text-sm text-[#432818] flex items-start">
                  <span className="text-[#B89B7A] mr-2">•</span>
                  {result}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );

  return (
    <div className={`py-10 ${className || ''}`} style={style}>
      {customStyles && <style dangerouslySetInnerHTML={{ __html: customStyles }} />}

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-playfair text-[#aa6b5d] mb-2">{title}</h2>
        {subtitle && <p className="text-center text-[#3a3a3a] mb-6 max-w-lg mx-auto">{subtitle}</p>}
        <div className="elegant-divider w-32 mx-auto"></div>
      </div>

      {/* Content */}
      <div className="max-w-full mx-auto">
        {displayMode === 'carousel' ? (
          <div className="relative">
            {/* Carousel content */}
            <AnimatedWrapper
              animation={animationsDisabled || isLowPerformance ? 'none' : 'fade'}
              show={true}
              duration={duration}
            >
              {renderTransformation(transformations[currentIndex], currentIndex)}
            </AnimatedWrapper>

            {/* Navigation */}
            {transformations.length > 1 && (
              <div className="flex justify-between items-center mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevTransformation}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#B89B7A]" />
                  <span className="text-sm text-[#6B4F43]">
                    {currentIndex + 1} de {transformations.length}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextTransformation}
                  className="flex items-center gap-2"
                >
                  Próxima
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        ) : displayMode === 'grid' ? (
          <div
            className={`grid ${deviceView === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`}
          >
            {transformations.map((transformation, index) => (
              <AnimatedWrapper
                key={transformation.id}
                animation={animationsDisabled || isLowPerformance ? 'none' : 'fade'}
                show={true}
                duration={duration}
                delay={200 * index}
              >
                {renderTransformation(transformation, index)}
              </AnimatedWrapper>
            ))}
          </div>
        ) : (
          // Single mode
          transformations.length > 0 && (
            <AnimatedWrapper
              animation={animationsDisabled || isLowPerformance ? 'none' : 'fade'}
              show={true}
              duration={duration}
            >
              {renderTransformation(transformations[0], 0)}
            </AnimatedWrapper>
          )
        )}
      </div>

      {/* CTA */}
      {onContinue && (
        <div className="text-center mt-8">
          <Button
            onClick={onContinue}
            className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-8 py-3 rounded-lg hover:scale-105 transition-transform duration-300"
          >
            Ver Minha Transformação
          </Button>
        </div>
      )}
    </div>
  );
};

export default BeforeAfterSection;
