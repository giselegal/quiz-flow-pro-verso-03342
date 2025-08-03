/**
 * Configuração global de containers para maximizar aproveitamento de espaço
 * e manter componentes centralizados com padding mínimo
 */

export interface ContainerConfig {
  /** Classes base do container */
  base: string;
  /** Padding responsivo por dispositivo */
  padding: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  /** Espaçamento entre elementos */
  spacing: {
    tight: string;
    normal: string;
    loose: string;
  };
  /** Largura máxima por contexto */
  maxWidth: {
    full: string;
    content: string;
    narrow: string;
  };
}

export const containerConfig: ContainerConfig = {
  base: 'w-full mx-auto flex flex-col',
  padding: {
    mobile: 'px-1 py-1',
    tablet: 'px-2 py-1', 
    desktop: 'px-2 py-1'
  },
  spacing: {
    tight: 'space-y-1',
    normal: 'space-y-2',
    loose: 'space-y-3'
  },
  maxWidth: {
    full: 'max-w-full',
    content: 'max-w-7xl',
    narrow: 'max-w-5xl'
  }
};

/**
 * Gera classes de container otimizadas para máximo aproveitamento
 */
export const getOptimizedContainerClasses = (
  deviceView: 'mobile' | 'tablet' | 'desktop' = 'desktop',
  spacing: 'tight' | 'normal' | 'loose' = 'tight',
  maxWidth: 'full' | 'content' | 'narrow' = 'full',
  customClasses?: string
): string => {
  const config = containerConfig;
  
  const classes = [
    config.base,
    config.maxWidth[maxWidth],
    config.padding[deviceView],
    config.spacing[spacing],
    customClasses || ''
  ].filter(Boolean).join(' ');
  
  return classes.trim();
};

/**
 * Container padrão para componentes do editor - máximo aproveitamento
 */
export const getEditorContainerClasses = (customClasses?: string): string => {
  return getOptimizedContainerClasses('desktop', 'tight', 'full', customClasses);
};

/**
 * Container responsivo com padding mínimo
 */
export const getResponsiveContainerClasses = (
  deviceView: 'mobile' | 'tablet' | 'desktop' = 'desktop'
): string => {
  return `
    w-full mx-auto
    ${deviceView === 'mobile' ? 'px-1 py-0' : 
      deviceView === 'tablet' ? 'px-1 py-0' : 
      'px-2 py-1'}
  `.trim();
};
