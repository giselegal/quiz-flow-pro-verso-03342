import { useState, useCallback } from 'react';
import { ResultPageConfig } from '@/types/resultPageConfig';

interface ResultPageConfigHook {
  resultPageConfig: ResultPageConfig;
  updateSection: (section: string, content: any) => void;
  saveConfig: () => Promise<boolean>;
  resetConfig: () => void;
  importConfig: (config: ResultPageConfig) => void;
  loading: boolean;
}

export const useResultPageConfig = (category: string): ResultPageConfigHook => {
  const [loading, setLoading] = useState(false);
  const [resultPageConfig, setResultPageConfig] = useState<ResultPageConfig>({
    styleType: category,
    header: {
      visible: true,
      content: {
        title: `Seu estilo é ${category}`,
      },
      style: {},
    },
    mainContent: {
      visible: true,
      content: {
        description: `Descrição do estilo ${category}`,
      },
      style: {},
    },
    offer: {
      hero: {
        visible: true,
        content: {
          title: 'Oferta Especial',
          subtitle: 'Descubra mais sobre seu estilo',
        },
        style: {},
      },
      benefits: {
        visible: true,
        content: {},
        style: {},
      },
      products: {
        visible: true,
        content: {},
        style: {},
      },
      pricing: {
        visible: true,
        content: {},
        style: {},
      },
      testimonials: {
        visible: true,
        content: {},
        style: {},
      },
      guarantee: {
        visible: true,
        content: {},
        style: {},
      },
    },
    blocks: [],
  });

  const updateSection = useCallback((section: string, content: any) => {
    setResultPageConfig(prev => ({
      ...prev,
      [section]: content,
    }));
  }, []);

  const saveConfig = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      // Save to localStorage or API
      localStorage.setItem(`result_config_${category}`, JSON.stringify(resultPageConfig));
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [category, resultPageConfig]);

  const resetConfig = useCallback(() => {
    setResultPageConfig({
      styleType: category,
      header: {
        visible: true,
        content: {
          title: `Seu estilo é ${category}`,
        },
        style: {},
      },
      mainContent: {
        visible: true,
        content: {
          description: `Descrição do estilo ${category}`,
        },
        style: {},
      },
      offer: {
        hero: {
          visible: true,
          content: {
            title: 'Oferta Especial',
            subtitle: 'Descubra mais sobre seu estilo',
          },
          style: {},
        },
        benefits: {
          visible: true,
          content: {},
          style: {},
        },
        products: {
          visible: true,
          content: {},
          style: {},
        },
        pricing: {
          visible: true,
          content: {},
          style: {},
        },
        testimonials: {
          visible: true,
          content: {},
          style: {},
        },
        guarantee: {
          visible: true,
          content: {},
          style: {},
        },
      },
      blocks: [],
    });
  }, [category]);

  const importConfig = useCallback((config: ResultPageConfig) => {
    setResultPageConfig(config);
  }, []);

  return {
    resultPageConfig,
    updateSection,
    saveConfig,
    resetConfig,
    importConfig,
    loading,
  };
};
