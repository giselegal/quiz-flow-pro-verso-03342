/**
 * ⚠️ DEPRECATED - NÃO USAR
 * 
 * Este hook foi criado para o UnifiedAppProvider antigo (contexts/)
 * que foi consolidado.
 * 
 * Use em vez disso:
 * - useEditor() de @/components/editor/EditorProviderUnified para operações de editor
 * - useUnifiedCRUD() de @/contexts/data/UnifiedCRUDProvider para CRUD de funnels
 * 
 * Motivo: API incompatível com provider consolidado
 * Data deprecação: 2025-01-16
 * Remoção planejada: 2025-11-01
 * 
 * Status: ✅ SAFE TO DELETE após verificação de imports
 * Ver: docs/SAFE_TO_DELETE.md
 */

import { deprecationWarning } from '@/utils/deprecation';

export const useOptimizedBlockOperations = () => {
  deprecationWarning({
    name: 'useOptimizedBlockOperations',
    replacement: 'useEditor from @/components/editor/EditorProviderUnified or useUnifiedCRUD',
    removalDate: '2025-11-01',
    migrationGuide: 'docs/QUICK_WIN_SERVICE_CONSOLIDATION.md'
  });

  throw new Error(
    'useOptimizedBlockOperations is deprecated. Use useEditor() from @/components/editor/EditorProviderUnified instead.'
  );
};
