/**
 * Types para o Sistema de Componentes Inline das 21 Etapas
 * 
 * Interface padrão e tipos base para todos os componentes inline
 * do sistema de funil de 21 etapas.
 */

import type { BlockComponentProps } from './blocks';

// Interface base para propriedades inline padrão
export interface InlineBlockBaseProperties {
  // Layout e responsividade
  gridColumns?: 1 | 2;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  // Cores da marca
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  borderColor?: string;
  
  // Tipografia
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  
  // Espaçamento interno
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  // Estados visuais
  hidden?: boolean;
  disabled?: boolean;
  
  // Animações
  animationDelay?: number;
  animationType?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'none';
}

// Interface padrão para componentes inline
export interface InlineBlockProps extends BlockComponentProps {
  block: {
    id: string;
    type: string;
    properties: InlineBlockBaseProperties & Record<string, any>;
    order?: number;
    visible?: boolean;
  };
}

// Classes de utilitários para responsividade
export const SPACING_CLASSES = {
  none: 'p-0',
  sm: 'p-2 sm:p-3',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
  xl: 'p-8 sm:p-12'
} as const;

export const MARGIN_CLASSES = {
  none: 'm-0',
  sm: 'm-2 sm:m-3',
  md: 'm-4 sm:m-6',
  lg: 'm-6 sm:m-8',
  xl: 'm-8 sm:m-12'
} as const;

export const GRID_CLASSES = {
  1: 'w-full',
  2: 'w-full md:w-1/2 lg:w-1/2'
} as const;

export const FONT_SIZE_CLASSES = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl'
} as const;

export const FONT_WEIGHT_CLASSES = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
} as const;

export const TEXT_ALIGN_CLASSES = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
} as const;

// Cores padrão da marca
export const BRAND_COLORS = {
  primary: '#B89B7A',
  primaryDark: '#aa6b5d',
  textDark: '#432818',
  textMedium: '#8F7A6A',
  background: '#ffffff',
  backgroundLight: '#fffaf7',
  border: '#B89B7A20'
} as const;

// Tipos específicos para cada etapa do funil
export type FunnelStepType = 
  | 'intro'
  | 'question' 
  | 'strategic-question'
  | 'transition'
  | 'result'
  | 'offer';

// Helper para validar propriedades inline
export const validateInlineProperties = (properties: Record<string, any>): InlineBlockBaseProperties => {
  return {
    gridColumns: properties.gridColumns && [1, 2].includes(properties.gridColumns) ? properties.gridColumns : 1,
    spacing: properties.spacing && ['none', 'sm', 'md', 'lg', 'xl'].includes(properties.spacing) ? properties.spacing : 'md',
    backgroundColor: properties.backgroundColor || BRAND_COLORS.background,
    textColor: properties.textColor || BRAND_COLORS.textDark,
    accentColor: properties.accentColor || BRAND_COLORS.primary,
    fontSize: properties.fontSize || 'base',
    fontWeight: properties.fontWeight || 'normal',
    textAlign: properties.textAlign || 'left',
    padding: properties.padding || 'md',
    margin: properties.margin || 'none',
    hidden: Boolean(properties.hidden),
    disabled: Boolean(properties.disabled),
    animationDelay: typeof properties.animationDelay === 'number' ? properties.animationDelay : 0,
    animationType: properties.animationType || 'fadeIn',
    ...properties
  };
};
