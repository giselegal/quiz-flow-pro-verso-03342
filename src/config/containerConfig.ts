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
    mobile: 'px-2 py-2',
    tablet: 'px-4 py-3', 
    desktop: 'px-6 py-4'
  },
  spacing: {
    tight: 'space-y-2',
    normal: 'space-y-4',
    loose: 'space-y-6'
  },
  maxWidth: {
    full: 'max-w-full',
    content: 'max-w-6xl',
    narrow: 'max-w-4xl'
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
    ${deviceView === 'mobile' ? 'px-2 py-1' : 
      deviceView === 'tablet' ? 'px-3 py-2' : 
      'px-4 py-2'}
  `.trim();
};
