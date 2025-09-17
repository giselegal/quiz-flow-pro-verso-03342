/**
 * 🔄 LEGACY COMPATIBILITY - DEPRECATED
 * 
 * Este arquivo foi consolidado em src/types/core/
 * 
 * ⚠️ MIGRATION NOTICE:
 * - Use: import { BlockComponentProps } from '@/types/core';
 * - Este arquivo será removido na Fase 2 da consolidação
 * - Tipos movidos para src/types/core/BlockInterfaces.ts
 */

// Re-export from unified core types for backward compatibility
export type {
  UnifiedBlockComponentProps as BlockComponentProps,
  BlockComponent
} from './core';

export {
  asBlockComponent,
  createBlockComponent
} from './core';

// Legacy warning for developers
if (process.env.NODE_ENV === 'development') {
  console.warn(
    '⚠️ DEPRECATION WARNING: src/types/blockComponentProps.ts is deprecated. ' +
    'Please import from "@/types/core" instead.'
  );
}
