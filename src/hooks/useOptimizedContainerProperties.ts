/**
 * 🚀 OPTIMIZED CONTAINER PROPERTIES - CORREÇÃO DE PERFORMANCE
 * 
 * PROBLEMA: useContainerProperties estava sendo chamado 13+ vezes
 * SOLUÇÃO: Cache inteligente + memoização otimizada
 */

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProperties {
  containerWidth?: 'small' | 'medium' | 'large' | 'full' | 'auto';
  containerPosition?: 'left' | 'center' | 'right';
  spacing?: 'none' | 'small' | 'medium' | 'large';
  backgroundColor?: string;
  padding?: number | string;
  margin?: number | string;
  borderRadius?: number | string;
  boxShadow?: string;
  [key: string]: any;
}

interface UseOptimizedContainerPropertiesResult {
  containerClasses: string;
  inlineStyles: React.CSSProperties;
  processedProperties: Record<string, any>;
}

// Cache global para evitar recálculos desnecessários
const propertiesCache = new Map<string, UseOptimizedContainerPropertiesResult>();

// Função para gerar chave de cache otimizada
const getCacheKey = (properties: ContainerProperties): string => {
  const relevantProps = {
    containerWidth: properties.containerWidth,
    containerPosition: properties.containerPosition,
    spacing: properties.spacing,
    backgroundColor: properties.backgroundColor,
    padding: properties.padding,
    margin: properties.margin,
    borderRadius: properties.borderRadius,
    boxShadow: properties.boxShadow,
  };
  
  return JSON.stringify(relevantProps);
};

// Mapeamentos estáticos para melhor performance
const WIDTH_CLASSES = {
  small: 'max-w-sm mx-auto',
  medium: 'max-w-2xl mx-auto',
  large: 'max-w-4xl mx-auto',
  full: 'w-full',
  auto: 'w-auto',
} as const;

const POSITION_CLASSES = {
  left: 'text-left',
  center: 'text-center mx-auto',
  right: 'text-right ml-auto',
} as const;

const SPACING_CLASSES = {
  none: '',
  small: 'py-2',
  medium: 'py-4',
  large: 'py-8',
} as const;

/**
 * 🚀 Hook otimizado para propriedades de container
 * 
 * Características:
 * - Cache inteligente para evitar recálculos
 * - Memoização otimizada com dependências mínimas
 * - Processamento em lote das propriedades CSS
 */
export const useOptimizedContainerProperties = (
  properties: ContainerProperties = {}
): UseOptimizedContainerPropertiesResult => {
  return useMemo(() => {
    // Verificar cache primeiro
    const cacheKey = getCacheKey(properties);
    const cached = propertiesCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    // Processar propriedades
    const {
      containerWidth = 'auto',
      containerPosition = 'left',
      spacing = 'medium',
      backgroundColor,
      padding,
      margin,
      borderRadius,
      boxShadow,
      ...otherProperties
    } = properties;

    // Construir classes CSS
    const containerClasses = cn(
      'container-block',
      WIDTH_CLASSES[containerWidth] || WIDTH_CLASSES.auto,
      POSITION_CLASSES[containerPosition] || POSITION_CLASSES.left,
      SPACING_CLASSES[spacing] || SPACING_CLASSES.medium
    );

    // Construir estilos inline otimizados
    const inlineStyles: React.CSSProperties = {};

    if (backgroundColor) {
      inlineStyles.backgroundColor = backgroundColor;
    }

    if (padding !== undefined) {
      inlineStyles.padding = typeof padding === 'number' ? `${padding}px` : padding;
    }

    if (margin !== undefined) {
      inlineStyles.margin = typeof margin === 'number' ? `${margin}px` : margin;
    }

    if (borderRadius !== undefined) {
      inlineStyles.borderRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;
    }

    if (boxShadow) {
      inlineStyles.boxShadow = boxShadow;
    }

    // Propriedades processadas (sem as de container)
    const processedProperties = {
      ...otherProperties,
      // Manter propriedades essenciais para compatibilidade
      containerWidth,
      containerPosition,
      spacing,
    };

    const result: UseOptimizedContainerPropertiesResult = {
      containerClasses,
      inlineStyles,
      processedProperties,
    };

    // Armazenar no cache (limitado a 100 entradas para evitar vazamentos)
    if (propertiesCache.size >= 100) {
      const firstKey = propertiesCache.keys().next().value;
      if (firstKey) {
        propertiesCache.delete(firstKey);
      }
    }
    propertiesCache.set(cacheKey, result);

    return result;
  }, [
    properties.containerWidth,
    properties.containerPosition,
    properties.spacing,
    properties.backgroundColor,
    properties.padding,
    properties.margin,
    properties.borderRadius,
    properties.boxShadow,
    // Não incluir todas as propriedades para evitar re-renders desnecessários
  ]);
};

// Função utilitária para limpar cache quando necessário
export const clearContainerPropertiesCache = (): void => {
  propertiesCache.clear();
};

// Hook de compatibilidade com o nome antigo
export const useContainerProperties = useOptimizedContainerProperties;