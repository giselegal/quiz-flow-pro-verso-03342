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
 * Data: 2025-01-16
 */

export const useOptimizedQuizFlow = () => {
  throw new Error(
    'useOptimizedQuizFlow is deprecated. Use useEditor() from @/components/editor/EditorProviderUnified instead.'
  );
};
