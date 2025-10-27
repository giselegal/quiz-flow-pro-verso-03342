/**
 * ⚠️ DEPRECATED - NÃO USAR
 * 
 * Este hook foi criado para o UnifiedAppProvider antigo (contexts/)
 * que foi consolidado.
 * 
 * Use em vez disso:
 * - useEditor() de @/components/editor/EditorProviderUnified para navegação de steps
 * - useQuizState() para estado de quiz em produção
 * 
 * Motivo: API incompatível com provider consolidado
 * Data deprecação: 2025-01-16
 * Remoção planejada: 2025-11-01
 * 
 * Status: ✅ SAFE TO DELETE após verificação de imports
 * Ver: docs/SAFE_TO_DELETE.md
 */

import { deprecationWarning } from '@/utils/deprecation';

export const useOptimizedQuizFlow = () => {
  deprecationWarning({
    name: 'useOptimizedQuizFlow',
    replacement: 'useEditor from @/components/editor/EditorProviderUnified',
    removalDate: '2025-11-01',
    migrationGuide: 'docs/QUICK_WIN_SERVICE_CONSOLIDATION.md',
  });

  throw new Error(
    'useOptimizedQuizFlow is deprecated. Use useEditor() from @/components/editor/EditorProviderUnified instead.',
  );
};
