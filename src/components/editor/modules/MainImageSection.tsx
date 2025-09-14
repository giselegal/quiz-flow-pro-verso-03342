import React, { useState, useRef, useEffect } from 'react';
import { useEditor } from '@craftjs/core';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BaseModuleProps, themeColors, withCraftjsComponent } from './types';
import { safePlaceholder } from '@/utils/placeholder';

export interface MainImageSectionProps extends BaseModuleProps {
  // Configurações da imagem
  imageUrl?: string;
  alt?: string;
  title?: string;
  showTitle?: boolean;
  
  // Dimensões e aspect ratio
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:2' | 'auto';
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  maxHeight?: number;
  
  // Estilo visual
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  borderColor?: string;
  borderWidth?: 'thin' | 'medium' | 'thick';
  
  // Efeitos visuais e hover
  hoverEffect?: 'none' | 'scale' | 'rotate' | 'brightness' | 'zoom' | 'lift';
  overlayOnHover?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  
  // Layout e posicionamento
  alignment?: 'left' | 'center' | 'right';
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  
  // Interatividade
  clickable?: boolean;
  onClick?: () => void;
  showEditButton?: boolean;
  
  // Loading e fallback
  placeholder?: string;
  placeholderColor?: string;
  showLoadingAnimation?: boolean;
  
  // Decorações
  showCornerDecorations?: boolean;
  decorationColor?: string;
  
  // Espaçamento
  padding?: 'sm' | 'md' | 'lg';
  marginBottom?: 'sm' | 'md' | 'lg';
}

const MainImageSectionComponent: React.FC<MainImageSectionProps> = ({
  // Image props
  imageUrl = '',
  alt = 'Imagem',
  title = '',
  showTitle = false,
  
  // Dimensions props
  aspectRatio = 'auto',
  width = 'lg',
  maxHeight = 400,
  
  // Style props
  borderRadius = 'xl',
  shadow = 'lg',
  border = false,
  borderColor = themeColors.primary,
  borderWidth = 'medium',
  
  // Effect props
  hoverEffect = 'scale',
  overlayOnHover = false,
  overlayColor = 'rgba(0, 0, 0, 0.3)',
  overlayOpacity = 30,
  
  // Layout props
  alignment = 'center',
  objectFit = 'cover',
  
  // Interactive props
  clickable = true,
  showEditButton = false,
  
  // Loading props
  placeholder = 'Carregando imagem...',
  placeholderColor = '#f0f0f0',
  showLoadingAnimation = true,
  
  // Decoration props
  showCornerDecorations = true,
  decorationColor = themeColors.primary,
  
  // Spacing props
  padding = 'md',
  marginBottom = 'md',
  
  // System props
  className = '',
  isSelected = false,
  onPropertyChange,
}) => {
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy loading com Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Classes para largura
  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'w-full'
  };

  // Classes para aspect ratio
  const aspectRatioClasses = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-video',
    '3:2': 'aspect-[3/2]',
    'auto': ''
  };

  // Classes para border radius
  const borderRadiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  // Classes para shadow
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  // Classes para hover effects
  const hoverEffectClasses = {
    none: '',
    scale: 'hover:scale-105',
    rotate: 'hover:rotate-1',
    brightness: 'hover:brightness-110',
    zoom: 'hover:scale-110',
    lift: 'hover:-translate-y-2'
  };

  // Classes para alinhamento
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto'
  };

  // Classes para border
  const borderWidthClasses = {
    thin: 'border',
    medium: 'border-2',
    thick: 'border-4'
  };

  // Classes de espaçamento
  const paddingClasses = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  };

  const marginBottomClasses = {
    sm: 'mb-4',
    md: 'mb-6',
    lg: 'mb-8'
  };

  // URL efetiva da imagem (com lazy loading)
  const effectiveImageUrl = isIntersecting || enabled ? 
    (imageUrl || safePlaceholder(400, 300, alt)) : 
    '';

  // Handlers
  const handleImageClick = () => {
    if (!enabled && clickable && onPropertyChange) {
      const newUrl = prompt('Nova URL da imagem:', imageUrl);
      if (newUrl !== null) {
        onPropertyChange('imageUrl', newUrl);
      }
    }
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'w-full',
        paddingClasses[padding],
        marginBottomClasses[marginBottom],
        alignmentClasses[alignment],
        // Estados do editor
        enabled && isSelected && 'ring-2 ring-[#B89B7A] ring-offset-2 bg-[#B89B7A]/5',
        enabled && !isSelected && 'hover:ring-1 hover:ring-[#B89B7A]/50 hover:bg-[#B89B7A]/5',
        className
      )}
    >
      {/* Título (opcional) */}
      {showTitle && title && (
        <h3 className={cn('font-semibold mb-4 text-lg', alignmentClasses[alignment])}>
          {title}
        </h3>
      )}

      {/* Container da imagem */}
      <div
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          widthClasses[width],
          aspectRatioClasses[aspectRatio],
          borderRadiusClasses[borderRadius],
          shadowClasses[shadow],
          hoverEffectClasses[hoverEffect],
          border && borderWidthClasses[borderWidth],
          clickable && !enabled && 'cursor-pointer',
          alignment === 'center' && 'mx-auto',
          alignment === 'right' && 'ml-auto'
        )}
        style={{
          borderColor: border ? borderColor : undefined,
          maxHeight: maxHeight ? `${maxHeight}px` : undefined
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleImageClick}
      >
        {/* Loading placeholder */}
        {!isLoaded && effectiveImageUrl && (
          <div 
            className={cn(
              'absolute inset-0 flex items-center justify-center',
              showLoadingAnimation && 'animate-pulse'
            )}
            style={{ backgroundColor: placeholderColor }}
          >
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">{placeholder}</p>
            </div>
          </div>
        )}

        {/* Imagem principal */}
        <AnimatePresence>
          {effectiveImageUrl && (
            <motion.img
              ref={imgRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              src={hasError ? safePlaceholder(400, 300, 'Erro ao carregar imagem') : effectiveImageUrl}
              alt={alt}
              className={cn(
                'w-full h-full transition-all duration-300',
                objectFit === 'cover' && 'object-cover',
                objectFit === 'contain' && 'object-contain',
                objectFit === 'fill' && 'object-fill',
                objectFit === 'scale-down' && 'object-scale-down'
              )}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
        </AnimatePresence>

        {/* Overlay no hover */}
        {overlayOnHover && isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: overlayOpacity / 100 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: overlayColor }}
          >
            {showEditButton && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-white text-gray-800 px-3 py-2 rounded-lg font-medium shadow-lg hover:bg-gray-50 transition-colors"
              >
                ✏️ Editar Imagem
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Decorações nos cantos */}
        {showCornerDecorations && (
          <>
            <div 
              className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2"
              style={{ borderColor: decorationColor }}
            />
            <div 
              className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2"
              style={{ borderColor: decorationColor }}
            />
          </>
        )}

        {/* Editor overlay quando selecionado */}
        {enabled && isSelected && (
          <div className="absolute -top-1 -right-1 bg-[#B89B7A] text-white text-xs px-2 py-1 rounded shadow-lg">
            Image
          </div>
        )}
      </div>
    </div>
  );
};

// Configurações do Craft.js para o MainImageSection
export const MainImageSection = withCraftjsComponent(MainImageSectionComponent, {
  props: {
    // Image props
    imageUrl: { type: 'text', label: 'URL da Imagem' },
    alt: { type: 'text', label: 'Texto Alternativo' },
    title: { type: 'text', label: 'Título' },
    showTitle: { type: 'checkbox', label: 'Mostrar Título' },
    
    // Dimensions props
    aspectRatio: {
      type: 'select',
      label: 'Proporção',
      options: [
        { value: '1:1', label: 'Quadrado (1:1)' },
        { value: '4:3', label: 'Clássico (4:3)' },
        { value: '16:9', label: 'Widescreen (16:9)' },
        { value: '3:2', label: 'Fotografia (3:2)' },
        { value: 'auto', label: 'Automático' }
      ]
    },
    width: {
      type: 'select',
      label: 'Largura',
      options: [
        { value: 'sm', label: 'Pequena' },
        { value: 'md', label: 'Média' },
        { value: 'lg', label: 'Grande' },
        { value: 'xl', label: 'Extra Grande' },
        { value: 'full', label: 'Total' }
      ]
    },
    maxHeight: { type: 'number', label: 'Altura Máxima (px)' },
    
    // Style props
    borderRadius: {
      type: 'select',
      label: 'Arredondamento',
      options: [
        { value: 'none', label: 'Nenhum' },
        { value: 'sm', label: 'Pequeno' },
        { value: 'md', label: 'Médio' },
        { value: 'lg', label: 'Grande' },
        { value: 'xl', label: 'Extra Grande' },
        { value: 'full', label: 'Circular' }
      ]
    },
    shadow: {
      type: 'select',
      label: 'Sombra',
      options: [
        { value: 'none', label: 'Nenhuma' },
        { value: 'sm', label: 'Pequena' },
        { value: 'md', label: 'Média' },
        { value: 'lg', label: 'Grande' },
        { value: 'xl', label: 'Extra Grande' }
      ]
    },
    border: { type: 'checkbox', label: 'Mostrar Borda' },
    borderColor: { type: 'color', label: 'Cor da Borda' },
    borderWidth: {
      type: 'select',
      label: 'Largura da Borda',
      options: [
        { value: 'thin', label: 'Fina' },
        { value: 'medium', label: 'Média' },
        { value: 'thick', label: 'Grossa' }
      ]
    },
    
    // Effect props
    hoverEffect: {
      type: 'select',
      label: 'Efeito no Hover',
      options: [
        { value: 'none', label: 'Nenhum' },
        { value: 'scale', label: 'Escalar' },
        { value: 'rotate', label: 'Rotacionar' },
        { value: 'brightness', label: 'Brilho' },
        { value: 'zoom', label: 'Zoom' },
        { value: 'lift', label: 'Elevar' }
      ]
    },
    overlayOnHover: { type: 'checkbox', label: 'Overlay no Hover' },
    overlayColor: { type: 'color', label: 'Cor do Overlay' },
    overlayOpacity: { 
      type: 'number', 
      label: 'Opacidade do Overlay (%)',
      min: 0,
      max: 100
    },
    
    // Layout props
    alignment: {
      type: 'select',
      label: 'Alinhamento',
      options: [
        { value: 'left', label: 'Esquerda' },
        { value: 'center', label: 'Centro' },
        { value: 'right', label: 'Direita' }
      ]
    },
    objectFit: {
      type: 'select',
      label: 'Ajuste da Imagem',
      options: [
        { value: 'cover', label: 'Cobrir' },
        { value: 'contain', label: 'Conter' },
        { value: 'fill', label: 'Preencher' },
        { value: 'scale-down', label: 'Reduzir' }
      ]
    },
    
    // Interactive props
    clickable: { type: 'checkbox', label: 'Clicável' },
    showEditButton: { type: 'checkbox', label: 'Botão de Edição' },
    
    // Loading props
    placeholder: { type: 'text', label: 'Texto de Carregamento' },
    placeholderColor: { type: 'color', label: 'Cor do Placeholder' },
    showLoadingAnimation: { type: 'checkbox', label: 'Animação de Loading' },
    
    // Decoration props
    showCornerDecorations: { type: 'checkbox', label: 'Decorações nos Cantos' },
    decorationColor: { type: 'color', label: 'Cor das Decorações' },
    
    // Spacing props
    padding: {
      type: 'select',
      label: 'Espaçamento Interno',
      options: [
        { value: 'sm', label: 'Pequeno' },
        { value: 'md', label: 'Médio' },
        { value: 'lg', label: 'Grande' }
      ]
    },
    marginBottom: {
      type: 'select',
      label: 'Margem Inferior',
      options: [
        { value: 'sm', label: 'Pequena' },
        { value: 'md', label: 'Média' },
        { value: 'lg', label: 'Grande' }
      ]
    }
  },
  related: {
    // Toolbar será implementada posteriormente
  }
});