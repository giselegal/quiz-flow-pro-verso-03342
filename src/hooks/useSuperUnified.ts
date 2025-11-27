/**
 * @deprecated OBSOLETO - NÃO USAR
 * 
 * Este hook foi completamente substituído pelo sistema moderno de contextos.
 * 
 * MIGRAÇÃO RECOMENDADA:
 * ```typescript
 * // ❌ Antigo (obsoleto)
 * import { useSuperUnified } from '@/hooks/useSuperUnified';
 * 
 * // ✅ Novo (use um dos seguintes)
 * import { useEditor } from '@/core/contexts/EditorContext';
 * import { useUX } from '@/contexts/consolidated/UXProvider';
 * import { useLegacySuperUnified } from '@/hooks/useLegacySuperUnified'; // Compatibilidade temporária
 * ```
 * 
 * SERÁ REMOVIDO: Versão 2.0
 * 
 * @see {@link useLegacySuperUnified} Para compatibilidade temporária
 * @see {@link useEditor} Hook canônico do editor
 */

import { appLogger } from '@/lib/utils/appLogger';
import type { Block } from '@/types/editor';

/**
 * @deprecated Use useEditor() ou useLegacySuperUnified() para compatibilidade
 */
export function useSuperUnified() {
  // Log warning em desenvolvimento e produção
  appLogger.warn('⚠️ DEPRECATED: useSuperUnified está obsoleto e será removido na v2.0', {
    data: [{
      alternativas: [
        'useEditor() from @/core/contexts/EditorContext',
        'useUX() from @/contexts/consolidated/UXProvider',
        'useLegacySuperUnified() for legacy compat',
      ],
    }],
  });

  // Console warning visível para desenvolvedores
  if (import.meta.env.DEV) {
    console.warn(
      '%c⚠️ DEPRECATED: useSuperUnified()',
      'color: orange; font-weight: bold; font-size: 14px;',
      '\n\n🔄 Migre para:\n' +
      '  • useEditor() - Hook canônico do editor\n' +
      '  • useUX() - Hook de UX/Theme/Navigation\n' +
      '  • useLegacySuperUnified() - Compatibilidade temporária\n\n' +
      '📖 Veja: src/hooks/useLegacySuperUnified.ts\n'
    );
  }
  
  // Retorna stub vazio (não funcional)
  return {
    getStepBlocks: (_step: number): Block[] => {
      appLogger.error('useSuperUnified.getStepBlocks() não implementado - use useEditor()');
      return [];
    },
    setStepBlocks: (_step: number, _blocks: Block[]): void => {
      appLogger.error('useSuperUnified.setStepBlocks() não implementado - use useEditor()');
    },
    updateBlock: (_step: number, _blockId: string, _updates: Partial<Block>): void => {
      appLogger.error('useSuperUnified.updateBlock() não implementado - use useEditor()');
    },
  };
}

export default useSuperUnified;
