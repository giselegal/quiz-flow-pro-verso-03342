/**
 * 📦 Modern Quiz Editor - Export Público
 * 
 * Exporta componente principal e types necessários
 */

export { ModernQuizEditor } from './ModernQuizEditor';
export type { ModernQuizEditorProps } from './ModernQuizEditor';

// Re-exportar stores para uso externo (se necessário)
export { useQuizStore } from './store/quizStore';
export { useEditorStore } from './store/editorStore';
