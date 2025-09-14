import React from 'react';
import { useEditor } from '@craftjs/core';
import { cn } from '@/lib/utils';
import { BaseModuleProps, themeColors, withCraftjsComponent } from './types';

export interface HeaderSectionProps extends BaseModuleProps {
  // Configurações do logo
  logoUrl?: string;
  logoAlt?: string;
  logoSize?: 'sm' | 'md' | 'lg';
  showLogo?: boolean;
  
  // Configurações de texto
  title?: string;
  subtitle?: string;
  showTitle?: boolean;
  showSubtitle?: boolean;
  
  // Configurações de layout
  alignment?: 'left' | 'center' | 'right';
  layout?: 'horizontal' | 'vertical' | 'logo-only' | 'text-only';
  
  // Configurações visuais
  backgroundColor?: string;
  textColor?: string;
  titleSize?: 'sm' | 'md' | 'lg' | 'xl';
  subtitleSize?: 'sm' | 'md' | 'lg';
  
  // Espaçamento
  padding?: 'sm' | 'md' | 'lg';
  marginBottom?: 'sm' | 'md' | 'lg';
}

const HeaderSectionComponent: React.FC<HeaderSectionProps> = ({
  // Props do logo
  logoUrl = '',
  logoAlt = 'Logo',
  logoSize = 'md',
  showLogo = true,
  
  // Props de texto
  title = 'Parabéns! Descobrimos o seu Estilo Pessoal',
  subtitle = 'Seu resultado personalizado está pronto',
  showTitle = true,
  showSubtitle = true,
  
  // Props de layout
  alignment = 'center',
  layout = 'vertical',
  
  // Props visuais
  backgroundColor = 'transparent',
  textColor = themeColors.brown,
  titleSize = 'xl',
  subtitleSize = 'md',
  
  // Props de espaçamento
  padding = 'md',
  marginBottom = 'lg',
  
  // Props do sistema
  className = '',
  isSelected = false,
}) => {
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));

  // Classes para tamanhos
  const logoSizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto', 
    lg: 'h-16 w-auto'
  };

  const titleSizeClasses = {
    sm: 'text-lg font-bold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-bold',
    xl: 'text-3xl font-bold'
  };

  const subtitleSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  // Classes para alinhamento
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  };

  // Classes para padding
  const paddingClasses = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  };

  // Classes para margin bottom
  const marginBottomClasses = {
    sm: 'mb-4',
    md: 'mb-6',
    lg: 'mb-8'
  };

  // Layout específico baseado na prop layout
  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-row gap-4 items-center';
      case 'vertical':
        return 'flex flex-col gap-3';
      case 'logo-only':
        return 'flex justify-center';
      case 'text-only':
        return 'flex flex-col gap-2';
      default:
        return 'flex flex-col gap-3';
    }
  };

  return (
    <div
      className={cn(
        'w-full transition-all duration-200',
        paddingClasses[padding],
        marginBottomClasses[marginBottom],
        alignmentClasses[alignment],
        getLayoutClasses(),
        // Estados do editor
        enabled && isSelected && 'ring-2 ring-[#B89B7A] ring-offset-2 bg-[#B89B7A]/5',
        enabled && !isSelected && 'hover:ring-1 hover:ring-[#B89B7A]/50 hover:bg-[#B89B7A]/5',
        className
      )}
      style={{ 
        backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : undefined,
        color: textColor 
      }}
    >
      {/* Logo Section */}
      {showLogo && logoUrl && layout !== 'text-only' && (
        <div className="flex-shrink-0">
          <img
            src={logoUrl}
            alt={logoAlt}
            className={cn(logoSizeClasses[logoSize], 'object-contain')}
            onError={(e) => {
              // Fallback em caso de erro na imagem
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Text Section */}
      {(showTitle || showSubtitle) && layout !== 'logo-only' && (
        <div className="flex flex-col gap-2">
          {/* Emoji decorativo */}
          <div className="text-2xl">🎉</div>
          
          {showTitle && title && (
            <h1 
              className={cn(titleSizeClasses[titleSize])}
              style={{ color: textColor }}
            >
              {title}
            </h1>
          )}
          
          {showSubtitle && subtitle && (
            <p 
              className={cn(
                subtitleSizeClasses[subtitleSize],
                'text-opacity-80'
              )}
              style={{ color: `${textColor}CC` }} // 80% opacity
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Editor overlay quando selecionado */}
      {enabled && isSelected && (
        <div className="absolute -top-1 -right-1 bg-[#B89B7A] text-white text-xs px-2 py-1 rounded shadow-lg">
          Header
        </div>
      )}
    </div>
  );
};

// Configurações do Craft.js para o HeaderSection
export const HeaderSection = withCraftjsComponent(HeaderSectionComponent, {
  props: {
    // Logo props
    logoUrl: { type: 'text', label: 'URL do Logo' },
    logoAlt: { type: 'text', label: 'Alt do Logo' },
    logoSize: { 
      type: 'select', 
      label: 'Tamanho do Logo',
      options: [
        { value: 'sm', label: 'Pequeno' },
        { value: 'md', label: 'Médio' },
        { value: 'lg', label: 'Grande' }
      ]
    },
    showLogo: { type: 'checkbox', label: 'Mostrar Logo' },
    
    // Text props
    title: { type: 'text', label: 'Título' },
    subtitle: { type: 'text', label: 'Subtítulo' },
    showTitle: { type: 'checkbox', label: 'Mostrar Título' },
    showSubtitle: { type: 'checkbox', label: 'Mostrar Subtítulo' },
    
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
    layout: {
      type: 'select',
      label: 'Layout',
      options: [
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'vertical', label: 'Vertical' },
        { value: 'logo-only', label: 'Apenas Logo' },
        { value: 'text-only', label: 'Apenas Texto' }
      ]
    },
    
    // Visual props
    backgroundColor: { type: 'color', label: 'Cor de Fundo' },
    textColor: { type: 'color', label: 'Cor do Texto' },
    titleSize: {
      type: 'select',
      label: 'Tamanho do Título',
      options: [
        { value: 'sm', label: 'Pequeno' },
        { value: 'md', label: 'Médio' },
        { value: 'lg', label: 'Grande' },
        { value: 'xl', label: 'Extra Grande' }
      ]
    },
    subtitleSize: {
      type: 'select',
      label: 'Tamanho do Subtítulo',
      options: [
        { value: 'sm', label: 'Pequeno' },
        { value: 'md', label: 'Médio' },
        { value: 'lg', label: 'Grande' }
      ]
    },
    
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