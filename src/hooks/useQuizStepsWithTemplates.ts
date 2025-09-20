// @ts-nocheck
/**
 * STUB: Hook para steps do quiz com templates
 */
import { useState, useEffect } from 'react';

export const useQuizStepsWithTemplates = () => {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Carregar steps do template quiz21StepsComplete
    setTimeout(() => {
      setSteps([]);
      setLoading(false);
    }, 100);
  }, []);

  return {
    steps,
    loading,
    refetch: () => {}
  };
};

export default useQuizStepsWithTemplates;