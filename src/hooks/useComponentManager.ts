
import { useState, useCallback } from 'react';
import { SimpleComponent } from '@/types/quiz';

export const useComponentManager = () => {
  const [components, setComponents] = useState<SimpleComponent[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  const addComponent = useCallback((type: SimpleComponent['type']) => {
    const newComponent: SimpleComponent = {
      id: `component-${Date.now()}`,
      type,
      data: {},
      style: {}
    };
    
    setComponents(prev => [...prev, newComponent]);
    setSelectedComponentId(newComponent.id);
    return newComponent.id;
  }, []);

  const updateComponent = useCallback((id: string, updates: Partial<SimpleComponent>) => {
    setComponents(prev => 
      prev.map(component => 
        component.id === id ? { ...component, ...updates } : component
      )
    );
  }, []);

  const deleteComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(component => component.id !== id));
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  }, [selectedComponentId]);

  const getComponentById = useCallback((id: string) => {
    return components.find(component => component.id === id);
  }, [components]);

  return {
    components,
    selectedComponentId,
    setSelectedComponentId,
    addComponent,
    updateComponent,
    deleteComponent,
    getComponentById
  };
};
