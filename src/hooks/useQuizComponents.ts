import { QuizComponentData } from "@/types/quizBuilder";
import { useCallback, useState } from "react";

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
        type: type as any, // Cast to avoid type error
        content: {},
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
