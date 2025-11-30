import { useQuizFlow } from '@/hooks/core/useQuizFlow';

// Re-exporta apenas o hook unificado
export { useQuizFlow };

// Compatibilidade mínima para imports antigos
export const QuizFlowController = { useQuizFlow };

export default QuizFlowController;
