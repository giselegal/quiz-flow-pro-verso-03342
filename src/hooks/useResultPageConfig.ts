
import { useState, useCallback } from 'react';

interface ResultPageConfig {
  globalStyles?: Record<string, any>;
  blocks?: any[];
  sections?: Record<string, any>;
}

export const useResultPageConfig = (category: string) => {
  const [resultPageConfig, setResultPageConfig] = useState<ResultPageConfig>({
    globalStyles: {},
    blocks: [],
    sections: {}
  });

  const updateSection = useCallback((section: string, content: any) => {
    setResultPageConfig(prev => ({
      ...prev,
      [section]: content
    }));
  }, []);

  return {
    resultPageConfig,
    updateSection
  };
};
