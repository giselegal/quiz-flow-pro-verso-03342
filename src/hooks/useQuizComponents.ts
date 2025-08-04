import { QuizComponentData } from "@/types/quizBuilder";
import { useCallback, useState } from "react";

// Função auxiliar para conteúdo padrão
function getDefaultComponentContent(type: string): any {
  const defaults: Record<string, any> = {
    question: { text: "Qual é a sua pergunta?" },
    "single-choice": {
      question: "Selecione uma opção:",
      options: ["Opção 1", "Opção 2", "Opção 3"],
    },
    "multiple-choice": {
      question: "Selecione uma ou mais opções:",
      options: ["Opção A", "Opção B", "Opção C"],
    },
    "text-input": { placeholder: "Digite sua resposta..." },
    "email-input": { placeholder: "seu@email.com" },
    progress: { current: 1, total: 10 },
    navigation: { showPrevious: true, showNext: true },
  };

  return defaults[type] || { text: "Conteúdo padrão" };
}

export const useQuizComponents = () => {
  const [components, setComponents] = useState<QuizComponentData[]>([]);

  const initializeComponents = useCallback((initialComponents: QuizComponentData[]) => {
    setComponents(initialComponents);
  }, []);

  const addComponent = useCallback(
    (type: string) => {
      // 🎯 SISTEMA 1: ID Semântico para componentes de quiz
      const componentNumber = components.length + 1;
      const newComponent: QuizComponentData = {
        id: `quiz-component-${type}-${componentNumber}`,
        type: type as any, // casting temporário
        content: getDefaultComponentContent(type),
        order: components.length,
      };
      setComponents(prev => [...prev, newComponent]);
      return newComponent.id;
    },
    [components.length]
  );

  const updateComponent = useCallback((id: string, updates: Partial<QuizComponentData>) => {
    setComponents(prev =>
      prev.map(component => (component.id === id ? { ...component, ...updates } : component))
    );
  }, []);

  const deleteComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(component => component.id !== id));
  }, []);

  const moveComponent = useCallback((draggedId: string, targetId: string) => {
    // Implementation for moving components
    console.log("Move component", draggedId, "to", targetId);
  }, []);

  return {
    components,
    addComponent,
    updateComponent,
    deleteComponent,
    moveComponent,
    initializeComponents,
  };
};
