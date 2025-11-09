/**
 * 🎯 DEPRECATION UTILITIES - QUICK WIN #2
 * 
 * Helpers centralizados para gerenciar depreciação de código.
 * Fornece warnings consistentes e tracking de uso.
 * 
 * @version 1.0.0
 * @date 2025-10-22
 */

import React from 'react';

interface DeprecationOptions {
  /** Nome do item deprecated */
  name: string;
  /** Nome do substituto recomendado */
  replacement: string;
  /** Data de remoção planejada (YYYY-MM-DD) */
  removalDate?: string;
  /** Versão em que será removido */
  removalVersion?: string;
  /** Link para guia de migração */
  migrationGuide?: string;
  /** Se true, loga warning apenas uma vez */
  once?: boolean;
}

// Cache de warnings já exibidos (para once: true)
const warnedItems = new Set<string>();

/**
 * Loga warning de depreciação com formatação consistente
 */
export const deprecationWarning = (options: DeprecationOptions): void => {
  const {
    name,
    replacement,
    removalDate,
    removalVersion,
    migrationGuide,
    once = true,
  } = options;

  // Skip se já alertado e once=true
  if (once && warnedItems.has(name)) {
    return;
  }

  if (process.env.NODE_ENV === 'development') {
    const parts = [
      `⚠️ DEPRECATED: "${name}" está deprecated.`,
      `✅ Use: "${replacement}"`,
    ];

    if (removalDate) {
      parts.push(`📅 Será removido em: ${removalDate}`);
    }

    if (removalVersion) {
      parts.push(`🔢 Versão de remoção: ${removalVersion}`);
    }

    if (migrationGuide) {
      parts.push(`📖 Guia: ${migrationGuide}`);
    }

    console.warn(parts.join('\n   '));

    if (once) {
      warnedItems.add(name);
    }
  }
};

/**
 * Hook wrapper que adiciona deprecation warning
 */
export const withDeprecationWarning = <T extends (...args: any[]) => any>(
  fn: T,
  options: DeprecationOptions,
): T => {
  return ((...args: any[]) => {
    deprecationWarning(options);
    return fn(...args);
  }) as T;
};

/**
 * Component wrapper que adiciona deprecation warning
 */
export const withDeprecatedComponent = <P extends object>(
  Component: React.ComponentType<P>,
  options: DeprecationOptions,
): React.ComponentType<P> => {
  return (props: P) => {
    deprecationWarning(options);
    return React.createElement(Component, props);
  };
};

/**
 * Registra uso de item deprecated para métricas
 */
export const trackDeprecatedUsage = (itemName: string): void => {
  if (typeof window !== 'undefined' && (window as any).__DEPRECATION_TRACKER__) {
    const tracker = (window as any).__DEPRECATION_TRACKER__;
    tracker[itemName] = (tracker[itemName] || 0) + 1;
  }
};

/**
 * Obtém estatísticas de uso de items deprecated
 */
export const getDeprecationStats = (): Record<string, number> => {
  if (typeof window !== 'undefined' && (window as any).__DEPRECATION_TRACKER__) {
    return { ...(window as any).__DEPRECATION_TRACKER__ };
  }
  return {};
};

/**
 * Inicializa tracking de depreciação (chamar no App.tsx)
 */
export const initDeprecationTracking = (): void => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as any).__DEPRECATION_TRACKER__ = {};
    
    // Expor stats no console para debug
    (window as any).getDeprecationStats = getDeprecationStats;
    
    console.log(
      '📊 Deprecation tracking ativo. Use window.getDeprecationStats() para ver uso.',
    );
  }
};

/**
 * Helper para criar message de depreciação padronizada
 */
export const createDeprecationMessage = (options: DeprecationOptions): string => {
  const parts = [
    `⚠️ DEPRECATED: "${options.name}"`,
    `Use "${options.replacement}" instead.`,
  ];

  if (options.removalDate) {
    parts.push(`Removal: ${options.removalDate}`);
  }

  if (options.migrationGuide) {
    parts.push(`Guide: ${options.migrationGuide}`);
  }

  return parts.join(' ');
};

// ============================================================================
// TYPE HELPERS
// ============================================================================

/**
 * Type helper para marcar parâmetros como deprecated
 */
export type Deprecated<T> = T & {
  __deprecated__?: string;
};

/**
 * Exemplo de uso:
 * 
 * interface MyProps {
 *   newProp: string;
 *   oldProp?: Deprecated<string>;
 * }
 */
