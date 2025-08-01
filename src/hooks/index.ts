// 🎯 HOOKS CENTRALIZADOS - Consolidação Final

// ✅ HOOKS ESSENCIAIS (validados)
export { useEditor } from './useEditor';
export { useToast } from './use-toast';
export { useIsMobile } from './use-mobile';
export { useDebounce } from './useDebounce';

// ✅ QUIZ HOOKS (validados)
export { useQuiz } from './useQuiz';
export { useQuizBuilder } from './useQuizBuilder';
export { useQuizConfig } from './useQuizConfig';
export { useQuizLogic } from './useQuizLogic';
export { useQuizResult } from './useQuizResult';
export { useQuizStages } from './useQuizStages';
export { useQuizTracking } from './useQuizTracking';
export { useQuizResultConfig } from './useQuizResultConfig';

// ✅ EDITOR HOOKS (validados)
export { useAutoSaveDebounce } from './useAutoSaveDebounce';
export { usePropertyHistory } from './usePropertyHistory';
export { useKeyboardShortcuts } from './useKeyboardShortcuts';
export { useBlockForm } from './useBlockForm';

// ✅ UTILITY HOOKS (validados)
export { useAuth } from './useAuth';
export { useImageBank } from './useImageBank';
export { useUtmParameters } from './useUtmParameters';
export { useDynamicData } from './useDynamicData';

// ✅ A/B TESTING
export { useABTest } from './useABTest';

// ✅ EDITOR SUB-HOOKS (quando necessário)
export { useEditorActions } from './editor/useEditorActions';
export { useEditorBlocks } from './editor/useEditorBlocks';
export { useEditorHistory } from './editor/useEditorHistory';
export { useEditorPersistence } from './editor/useEditorPersistence';
export { useEditorTemplates } from './editor/useEditorTemplates';
export { useEditorTheme } from './editor/useEditorTheme';
export { useBlockOperations } from './editor/useBlockOperations';
export { useAutoSaveWithDebounce } from './editor/useAutoSaveWithDebounce';
