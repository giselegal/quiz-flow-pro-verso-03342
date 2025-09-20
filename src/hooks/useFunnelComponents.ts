// @ts-nocheck
/**
 * STUB: Hook para componentes de funil
 */
import { useState, useCallback } from 'react';

export const useFunnelComponents = () => {
  const [components, setComponents] = useState([]);

  const addComponent = useCallback((component: any) => {
    setComponents(prev => [...prev, component]);
  }, []);

  const removeComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(c => c.id !== id));
  }, []);

  return {
    components,
    addComponent,
    removeComponent
  };
};

export default useFunnelComponents;