
import { useState, useCallback } from 'react';
import { QuizComponentData } from '@/types/quizBuilder';

export const useQuizComponents = () => {
  const [components, setComponents] = useState<QuizComponentData[]>([]);

  const initializeComponents = useCallback((initialComponents: QuizComponentData[]) => {
    setComponents(initialComponents);
  }, []);

  const addComponent = useCallback((type: string, stageId?: string): string => {
    const newComponent: QuizComponentData = {
      id: `component-${Date.now()}`,
      type: type as any,
      order: components.length,
      stageId,
      data: {}
    };
    
    setComponents(prev => [...prev, newComponent]);
    return newComponent.id;
  }, [components.length]);

  const updateComponent = useCallback((id: string, updates: Partial<QuizComponentData>) => {
    setComponents(prev => 
      prev.map(component => 
        component.id === id ? { ...component, ...updates } : component
      )
    );
  }, []);

  const deleteComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(component => component.id !== id));
  }, []);

  const moveComponent = useCallback((draggedId: string, targetId: string) => {
    // Implementation for moving components
    console.log('Move component', draggedId, 'to', targetId);
  }, []);

  return {
    components,
    addComponent,
    updateComponent,
    deleteComponent,
    moveComponent,
    initializeComponents
  };
};
