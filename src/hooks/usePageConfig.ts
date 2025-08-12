import { useState, useEffect } from 'react';

interface PageConfig {
  title?: string;
  description?: string;
  theme?: string;
  components?: any[];
}

export const usePageConfig = (pageType: string) => {
  const [config, setConfig] = useState<PageConfig>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load page configuration from localStorage or API
    const savedConfig = localStorage.getItem(`page_config_${pageType}`);
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Error loading page config:', error);
      }
    }
    setLoading(false);
  }, [pageType]);

  const updateConfig = (updates: Partial<PageConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    localStorage.setItem(`page_config_${pageType}`, JSON.stringify({ ...config, ...updates }));
  };

  return {
    config,
    updateConfig,
    loading,
  };
};
