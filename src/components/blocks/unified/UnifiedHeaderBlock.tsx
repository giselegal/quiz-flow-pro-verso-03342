import React, { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { BlockComponentProps } from '@/types/blocks';
import { useGarbageCollector } from '@/hooks/useGarbageCollector';
import { useUserName } from '@/hooks/useUserName';

/**
 * 🎯 UNIFIED HEADER BLOCK - Consolidação Otimizada de Headers
 * 
 * VARIANTES SUPORTADAS:
 * - quiz-intro: Header com logo, progresso e botão voltar
 * - quiz-result: Header de resultado com logo e título personalizado
 * - generic: Header simples com título e subtítulo
 * - vertical-canvas: Header para canvas vertical
 * - offer-hero: Header de oferta com imagem hero
 * 
 * PERFORMANCE:
 * - React.memo com comparação customizada
 * - useMemo para cálculos complexos
 * - useGarbageCollector para limpeza automática
 * - Zero re-renders desnecessários
 */

interface UnifiedHeaderProps extends BlockComponentProps {
  variant?: 'quiz-intro' | 'quiz-result' | 'generic' | 'vertical-canvas' | 'offer-hero';
  disabled?: boolean;
}

const UnifiedHeaderBlock: React.FC<UnifiedHeaderProps> = memo(({
  block,
  variant = 'generic',
  isSelected = false,
  onClick,
  className = '',
}) => {
  // 🧹 Garbage collection para performance otimizada
  useGarbageCollector();
  
  // 🎯 Hook para buscar nome do usuário dinamicamente
  const dynamicUserName = useUserName();

  // Propriedades unificadas com fallbacks seguros
  const props = useMemo(() => {
    const properties = block?.properties || {};
    
    return {
      // Logo e Branding
      logoUrl: properties.logoUrl || properties.logo || 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: properties.logoAlt || 'Logo',
      logoWidth: properties.logoWidth || 200,
      logoHeight: properties.logoHeight || 60,
      showLogo: properties.showLogo ?? true,
      
      // Controles de exibição
      showTitle: properties.showTitle ?? true,
      showUserName: properties.showUserName ?? true,
      
      // Conteúdo
      title: properties.title || properties.customTitle || 'Parabéns, {userName}!',
      subtitle: properties.subtitle || 'Seu resultado personalizado está pronto',
      userName: properties.userName || 'Usuário',
      
      // Nome dinâmico (prioridade sobre userName estático)
      displayName: dynamicUserName || properties.userName || 'Usuário',
      
      // Layout
      backgroundColor: properties.backgroundColor || '#ffffff',
      textColor: properties.textColor || '#432818',
      textAlign: properties.textAlign || 'center',
      isSticky: properties.isSticky ?? false,
      
      // Progresso
      enableProgressBar: (properties.enableProgressBar || properties.showProgress) ?? false,
      showProgress: properties.showProgress ?? false,
      progressValue: properties.progressValue || 0,
      progressMax: properties.progressMax || 100,
      
      // Navegação
      showBackButton: properties.showBackButton ?? false,
      
      // Margens
      marginTop: properties.marginTop || 0,
      marginBottom: properties.marginBottom || 0,
      
      // Imagem Hero (para variant offer-hero)
      heroImage: properties.heroImage || '',
      showImage: properties.showImage ?? false,
    };
  }, [block?.properties]);

  // Memoizar estilos do container
  const containerStyle = useMemo(() => ({
    backgroundColor: props.backgroundColor,
    marginTop: props.marginTop,
    marginBottom: props.marginBottom,
  }), [props.backgroundColor, props.marginTop, props.marginBottom]);

  // Memoizar classes CSS
  const containerClasses = useMemo(() => cn(
    'relative w-full transition-all duration-200',
    props.isSticky && 'sticky top-0 z-50',
    isSelected && 'ring-2 ring-blue-500 ring-offset-2',
    'cursor-pointer hover:bg-gray-50/50',
    className
  ), [props.isSticky, isSelected, className]);

  // Renderização por variante
  const renderContent = useMemo(() => {
    switch (variant) {
      case 'quiz-intro':
        return renderQuizIntroContent();
      case 'quiz-result':
        return renderQuizResultContent();
      case 'vertical-canvas':
        return renderVerticalCanvasContent();
      case 'offer-hero':
        return renderOfferHeroContent();
      default:
        return renderGenericContent();
    }
  }, [variant, props]);

  function renderQuizIntroContent() {
    return (
      <div className="p-4">
        <div className="relative w-full min-h-[120px] flex items-center justify-center">
          {props.showBackButton && (
            <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100/50 transition-colors">
              <ArrowLeft className="w-6 h-6" style={{ color: '#6B4F43' }} />
            </button>
          )}
          
          {props.showLogo && (
            <div className="flex items-center justify-center">
              <img
                src={props.logoUrl}
                alt={props.logoAlt}
                style={{ width: `${props.logoWidth}px`, height: `${props.logoHeight}px` }}
                className="object-contain"
                loading="eager"
              />
            </div>
          )}
        </div>

        {(props.enableProgressBar || props.showProgress) && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-[#6B4F43] mb-1">
              <span>Progresso</span>
              <span>{Math.round((props.progressValue / props.progressMax) * 100)}%</span>
            </div>
            <Progress
              value={Math.min(props.progressValue, props.progressMax)}
              className="h-2"
              indicatorClassName="bg-[#B89B7A]"
            />
          </div>
        )}
      </div>
    );
  }

  function renderQuizResultContent() {
    return (
      <motion.div
        className="text-center space-y-4 py-8 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {props.showLogo && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src={props.logoUrl}
              alt={props.logoAlt}
              style={{ height: `${props.logoHeight}px` }}
              className="mx-auto object-contain"
              loading="eager"
            />
          </motion.div>
        )}

        {props.showTitle && (
          <motion.h1
            className="font-playfair text-xl md:text-3xl font-semibold px-2"
            style={{ color: props.textColor, textAlign: props.textAlign }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {props.showUserName 
              ? props.title.replace('{userName}', props.displayName)
              : props.title.replace('{userName}', '').replace(/,\s*$/, '').replace(/^\s*,/, '').trim()
            }
          </motion.h1>
        )}

        <motion.div
          className="w-24 h-1 mx-auto bg-gradient-to-r from-amber-300 to-amber-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        />
      </motion.div>
    );
  }

  function renderVerticalCanvasContent() {
    return (
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {props.showBackButton && (
              <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}

            {props.showLogo && (
              <img
                src={props.logoUrl}
                alt={props.logoAlt}
                style={{ width: `${props.logoWidth}px`, height: `${props.logoHeight}px` }}
                className="object-contain"
              />
            )}
          </div>

          {(props.enableProgressBar || props.showProgress) && (
            <div className="flex-1 max-w-md mx-4">
              <div className="flex justify-between text-sm" style={{ color: '#6B4F43' }}>
                <span>Progresso</span>
                <span>{Math.round((props.progressValue / props.progressMax) * 100)}%</span>
              </div>
              <Progress value={(props.progressValue / props.progressMax) * 100} className="h-2 mt-1" />
            </div>
          )}
        </div>
      </header>
    );
  }

  function renderOfferHeroContent() {
    return (
      <div className="w-full py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {props.showLogo && (
            <div className="mb-6">
              <img 
                src={props.logoUrl} 
                alt={props.logoAlt}
                style={{ height: `${props.logoHeight}px` }}
                className="mx-auto object-contain"
              />
            </div>
          )}

          <h1 
            className="text-3xl md:text-5xl font-bold mb-4" 
            style={{ color: props.textColor }}
          >
            {props.title}
          </h1>

          {props.subtitle && (
            <p style={{ color: '#6B4F43' }}>{props.subtitle}</p>
          )}

          {props.showImage && props.heroImage && (
            <div className="mt-8 max-w-md mx-auto">
              <img 
                src={props.heroImage} 
                alt="Hero Image" 
                className="w-full rounded-lg shadow-xl object-cover"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderGenericContent() {
    return (
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto" style={{ textAlign: props.textAlign }}>
          {props.showLogo && (
            <div className="mb-6">
              <img
                src={props.logoUrl}
                alt={props.logoAlt}
                style={{ width: `${props.logoWidth}px`, height: `${props.logoHeight}px` }}
                className="mx-auto object-contain"
              />
            </div>
          )}

          {props.showTitle && (
            <h1
              className="text-2xl md:text-4xl font-bold mb-4"
              style={{ color: props.textColor }}
            >
              {props.showUserName 
                ? props.title.replace('{userName}', props.displayName)
                : props.title.replace('{userName}', '').replace(/,\s*$/, '').replace(/^\s*,/, '').trim()
              }
            </h1>
          )}

          {props.subtitle && (
            <p
              className="text-lg"
              style={{ color: '#6b7280' }}
            >
              {props.subtitle}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={containerClasses}
      style={containerStyle}
      onClick={onClick}
      data-block-id={block?.id}
      data-block-type={block?.type}
      data-variant={variant}
    >
      {renderContent}
    </div>
  );
}, (prevProps, nextProps) => {
  // Comparação customizada para React.memo - evita re-renders desnecessários
  if (prevProps.variant !== nextProps.variant) return false;
  if (prevProps.isSelected !== nextProps.isSelected) return false;
  if (prevProps.className !== nextProps.className) return false;
  
  // Comparação profunda apenas das propriedades que afetam renderização
  const prevProps_ = prevProps.block?.properties || {};
  const nextProps_ = nextProps.block?.properties || {};
  
  const relevantKeys = [
    'logoUrl', 'logoAlt', 'logoWidth', 'logoHeight', 'showLogo',
    'title', 'subtitle', 'userName', 'backgroundColor', 'textColor',
    'showTitle', 'showUserName', 'enableProgressBar', 'showProgress', 
    'progressValue', 'progressMax', 'showBackButton', 'heroImage', 'showImage'
  ];
  
  return relevantKeys.every(key => prevProps_[key] === nextProps_[key]);
});

UnifiedHeaderBlock.displayName = 'UnifiedHeaderBlock';

export default UnifiedHeaderBlock;