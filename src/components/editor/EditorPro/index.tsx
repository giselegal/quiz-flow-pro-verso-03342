/**
 * 🚀 EDITOR PRO OTIMIZADO - PONTO DE ENTRADA
 * 
 * Substitui o EditorPro.tsx monolítico por arquitetura modular:
 * ✅ EditorPro.tsx (1312 linhas) → ModularEditorPro (188 linhas) + componentes especializados
 * ✅ Contexto DnD isolado por etapa via StepDndProvider
 * ✅ IDs únicos padronizados via generateUniqueId
 * ✅ Sistema de seleção otimizado via useStepSelection
 * ✅ Performance monitorada via useOptimizedScheduler
 */

export { default as ModularEditorPro } from './components/ModularEditorPro';
export { default as EditorCanvas } from './components/EditorCanvas';
export { default as EditorToolbar } from './components/EditorToolbar';

// Export como default para compatibilidade
export { default } from './components/ModularEditorPro';