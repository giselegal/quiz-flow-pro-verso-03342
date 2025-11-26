/**
 * 🎯 USE SUPER UNIFIED HOOK
 * 
 * @deprecated ⚠️ FASE 2 - Este hook está deprecado!
 * Use useEditorContext() em vez disso para API consolidada.
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ANTES
 * import { useSuperUnified } from '@/hooks/useSuperUnified';
 * const context = useSuperUnified();
 * 
 * // DEPOIS
 * import { useEditorContext } from '@/core/hooks/useEditorContext';
 * const context = useEditorContext();
 * ```
 * 
 * Este hook será removido na Fase 3 da consolidação.
 * 
 * @version 1.0.0 (DEPRECATED)
 */

import { useLegacySuperUnified } from '@/hooks/useLegacySuperUnified';
import { useEffect } from 'react';

/**
 * @deprecated Use useEditorContext() da Fase 2
 */
export const useSuperUnified = () => {
  // Warn in DEV mode
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.warn(
        '⚠️ [DEPRECATED] useSuperUnified() está deprecado!\n' +
        'Migre para useEditorContext() da Fase 2:\n' +
        'import { useEditorContext } from "@/core/hooks/useEditorContext";\n' +
        'Docs: docs/FASE_2_CONSOLIDACAO.md'
      );
    }
  }, []);

  return useLegacySuperUnified();
};

// Compat alias mantido para chamadas antigas (ex: useUnifiedAuth())
export const useUnifiedAuth = useSuperUnified;

export default useSuperUnified;
