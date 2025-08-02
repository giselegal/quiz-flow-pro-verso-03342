
import { useState, useCallback } from 'react';

interface CanvasConfiguration {
  width: number;
  height: number;
  backgroundColor: string;
  padding: number;
  components: any[];
}

export const useCanvasConfiguration = () => {
  const [configuration, setConfiguration] = useState<CanvasConfiguration>({
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    padding: 20,
    components: []
  });

  const updateConfiguration = useCallback((updates: Partial<CanvasConfiguration>) => {
    setConfiguration(prev => ({ ...prev, ...updates }));
  }, []);

  const addComponent = useCallback((component: any) => {
    setConfiguration(prev => ({
      ...prev,
      components: [...prev.components, component]
    }));
  }, []);

  const removeComponent = useCallback((index: number) => {
    setConfiguration(prev => ({
      ...prev,
      components: prev.components.filter((_, i) => i !== index)
    }));
  }, []);

  return {
    configuration,
    updateConfiguration,
    addComponent,
    removeComponent
  };
};
