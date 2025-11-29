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
// Importes dentro do hook para evitar erros em ambientes sem providers
// e permitir fallback transparente.

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
  // Tentar delegar para o editor moderno (core)
  try {
    // Import dinâmico para evitar dependências duras em ambientes sem core
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const coreEditor = require('@/core/contexts/EditorContext');
    const useEditor = coreEditor?.useEditor as () => any;
    if (typeof useEditor === 'function') {
      const editor = useEditor();
      return {
        getStepBlocks: (step: number): Block[] => {
          try { return editor.getStepBlocks(step) as Block[]; } catch { return []; }
        },
        setStepBlocks: (step: number, blocks: Block[]): void => {
          try { editor.setStepBlocks(step, blocks); } catch (e) { appLogger.error('useSuperUnified.setStepBlocks falhou', { data: [e] }); }
        },
        updateBlock: (step: number, blockId: string, updates: Partial<Block>): void => {
          try { editor.updateBlock(step, blockId, updates); } catch (e) { appLogger.error('useSuperUnified.updateBlock falhou', { data: [e] }); }
        },
      };
    }
  } catch { /* ignore */ }

  // Fallback: tentar via useEditorContext (core hook unificado)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const core = require('@/core/hooks/useEditorContext');
    const useEditorContext = core?.useEditorContext as () => any;
    if (typeof useEditorContext === 'function') {
      const unified = useEditorContext();
      return {
        getStepBlocks: (step: number): Block[] => {
          try { return unified.getStepBlocks(step) as Block[]; } catch { return []; }
        },
        setStepBlocks: (step: number, blocks: Block[]): void => {
          try { unified.setStepBlocks(step, blocks); } catch (e) { appLogger.error('useSuperUnified.setStepBlocks (unified) falhou', { data: [e] }); }
        },
        updateBlock: (step: number, blockId: string, updates: Partial<Block>): void => {
          try { unified.updateBlock(step, blockId, updates); } catch (e) { appLogger.error('useSuperUnified.updateBlock (unified) falhou', { data: [e] }); }
        },
      };
    }
  } catch { /* ignore */ }

  // Último recurso: stub com logs (não funcional)
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
