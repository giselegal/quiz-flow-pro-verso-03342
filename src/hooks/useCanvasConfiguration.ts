import { useState, useCallback } from "react";

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
    backgroundColor: "#ffffff",
    padding: 20,
    components: [],
  });

  const [isStep20Loaded, setIsStep20Loaded] = useState(false);
  const [isStep21Loaded, setIsStep21Loaded] = useState(false);

  const updateConfiguration = useCallback((updates: Partial<CanvasConfiguration>) => {
    setConfiguration(prev => ({ ...prev, ...updates }));
  }, []);

  const addComponent = useCallback((component: any) => {
    setConfiguration(prev => ({
      ...prev,
      components: [...prev.components, component],
    }));
  }, []);

  const removeComponent = useCallback((index: number) => {
    setConfiguration(prev => ({
      ...prev,
      components: prev.components.filter((_, i) => i !== index),
    }));
  }, []);

  const loadAndApplyStep20 = useCallback(() => {
    setIsStep20Loaded(true);
    console.log("Step 20 loaded and applied");
  }, []);

  const loadAndApplyStep21 = useCallback(() => {
    setIsStep21Loaded(true);
    console.log("Step 21 loaded and applied");
  }, []);

  const getResultComponents = useCallback(() => {
    return configuration.components.filter((c: any) => c.type === "result");
  }, [configuration.components]);

  const getOfferComponents = useCallback(() => {
    return configuration.components.filter((c: any) => c.type === "offer");
  }, [configuration.components]);

  const validateAllSteps = useCallback(() => {
    return {
      isValid: true,
      errors: [],
    };
  }, []);

  return {
    configuration,
    updateConfiguration,
    addComponent,
    removeComponent,
    validateAllSteps,
    isStep20Loaded,
    isStep21Loaded,
    loadAndApplyStep20,
    loadAndApplyStep21,
    getResultComponents,
    getOfferComponents,
    config: configuration,
  };
};

// Mock exports for missing hooks
export const useStep20Canvas = () => useCanvasConfiguration();
export const useStep21Canvas = () => useCanvasConfiguration();
