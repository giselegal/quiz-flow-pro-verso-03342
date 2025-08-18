import { useCallback, useEffect, useState } from 'react';
import { useQuiz21Steps } from '../components/quiz/Quiz21StepsProvider';

interface UseQuizQuestionProps {
  questionId: string;
  requiredSelections?: number;
  maxSelections?: number;
}

interface UseQuizQuestionReturn {
  selections: Record<string, any>;
  selectionsCount: number;
  isComplete: boolean;
  canAdvance: boolean;
  addSelection: (optionId: string, value?: any) => void;
  removeSelection: (optionId: string) => void;
  clearSelections: () => void;
  progress: string;
}

/**
 * 🎯 HOOK PARA INTEGRAÇÃO DE QUESTÕES COM SISTEMA DE 21 ETAPAS
 *
 * Características:
 * - Gerencia seleções da questão atual
 * - Integra com o sistema de navegação
 * - Auto-advance baseado em requisitos
 * - Feedback visual de progresso
 *
 * @param questionId - ID único da questão
 * @param requiredSelections - Número mínimo de seleções (opcional, usa do step requirements)
 * @param maxSelections - Número máximo de seleções (opcional, usa do step requirements)
 * @param autoAdvance - Se deve avançar automaticamente (opcional, usa do step requirements)
 */
export const useQuizQuestion = ({
  questionId,
  requiredSelections,
  maxSelections,
}: UseQuizQuestionProps): UseQuizQuestionReturn => {
  const {
    currentStepSelections,
    updateStepSelections,
    saveAnswer,
    getStepRequirements,
    currentStep,
  } = useQuiz21Steps();

  // Obter requisitos da etapa atual ou usar os fornecidos
  const stepReqs = getStepRequirements();
  const effectiveRequiredSelections = requiredSelections ?? stepReqs.requiredSelections;
  const effectiveMaxSelections = maxSelections ?? stepReqs.maxSelections;

  // Estado local das seleções desta questão
  const [localSelections, setLocalSelections] = useState<Record<string, any>>({});

  // Sincronizar com as seleções globais da etapa
  useEffect(() => {
    setLocalSelections(currentStepSelections);
  }, [currentStepSelections]);

  // Contar seleções
  const selectionsCount = Object.keys(localSelections).length;

  // Verificar se está completa
  const isComplete = selectionsCount >= effectiveRequiredSelections;

  // Verificar se pode avançar
  const canAdvance = isComplete;

  // Adicionar seleção
  const addSelection = useCallback(
    (optionId: string, value?: any) => {
      setLocalSelections(prev => {
        const newSelections = { ...prev };

        // Se atingiu o máximo, remover a primeira seleção (FIFO)
        if (
          effectiveMaxSelections > 0 &&
          Object.keys(newSelections).length >= effectiveMaxSelections
        ) {
          const firstKey = Object.keys(newSelections)[0];
          delete newSelections[firstKey];
        }

        // Adicionar nova seleção
        newSelections[optionId] = {
          optionId,
          value: value || optionId,
          timestamp: Date.now(),
          questionId,
          step: currentStep,
        };

        return newSelections;
      });

      // Salvar no sistema global
      saveAnswer(questionId, optionId, value);

      console.log('🎯 useQuizQuestion: Seleção adicionada:', { questionId, optionId, value });
    },
    [questionId, currentStep, effectiveMaxSelections, saveAnswer]
  );

  // Remover seleção
  const removeSelection = useCallback(
    (optionId: string) => {
      setLocalSelections(prev => {
        const newSelections = { ...prev };
        delete newSelections[optionId];
        return newSelections;
      });

      // Atualizar seleções globais
      const updatedGlobalSelections = { ...currentStepSelections };
      delete updatedGlobalSelections[optionId];
      updateStepSelections(updatedGlobalSelections);

      console.log('🎯 useQuizQuestion: Seleção removida:', { questionId, optionId });
    },
    [questionId, currentStepSelections, updateStepSelections]
  );

  // Limpar todas as seleções
  const clearSelections = useCallback(() => {
    setLocalSelections({});
    updateStepSelections({});

    console.log('🎯 useQuizQuestion: Seleções limpas:', { questionId });
  }, [questionId, updateStepSelections]);

  // Gerar string de progresso
  const progress = `${selectionsCount}/${effectiveRequiredSelections}`;

  // Sincronizar mudanças locais com o sistema global
  useEffect(() => {
    updateStepSelections(localSelections);
  }, [localSelections, updateStepSelections]);

  return {
    selections: localSelections,
    selectionsCount,
    isComplete,
    canAdvance,
    addSelection,
    removeSelection,
    clearSelections,
    progress,
  };
};

export default useQuizQuestion;
