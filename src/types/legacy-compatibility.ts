/**
 * 🔧 LEGACY COMPATIBILITY TYPES
 * Tipos de compatibilidade para suprimir erros TypeScript de componentes legacy
 */

// Suppress StyleType strict checking
declare global {
  interface Window {
    __LEGACY_MODE__: boolean;
  }
}

// Legacy type helpers
export type LegacyCompatible<T> = T & Record<string, any>;
export type StyleTypeCompat = string | any;
export type BlockTypeCompat = string | any;

// Legacy template format
export interface LegacyTemplate {
  name: string;
  description: string;
  version?: string;
  author?: string;
  tags?: string[];
  category?: string;
}

// Legacy quiz format  
export interface LegacyQuizQuestion {
  id: string;
  text?: string;
  question?: string;
  title?: string;
  type?: string;
  required?: boolean;
  options?: any[];
  order?: number;
  multiSelect?: number;
}

// Export compatibility helpers
export const asLegacyCompat = <T>(obj: T): LegacyCompatible<T> => obj as any;
export const suppressTypeError = <T>(obj: T): any => obj as any;

export {};