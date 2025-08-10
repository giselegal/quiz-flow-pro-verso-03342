import { useState, useCallback } from "react";
import { ResultPageConfig } from "@/types/resultPageConfig";

interface UseQuizResultConfigReturn {
  config: ResultPageConfig;
  updateConfig: (section: string, data: any) => void;
  saveConfig: () => Promise<boolean>;
  resetConfig: () => void;
}

export const useQuizResultConfig = (category: string): UseQuizResultConfigReturn => {
  const [config, setConfig] = useState<ResultPageConfig>({
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
          title: "Oferta Especial",
          subtitle: "Descubra mais sobre seu estilo",
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

  const updateConfig = useCallback((section: string, data: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: data,
    }));
  }, []);

  const saveConfig = useCallback(async (): Promise<boolean> => {
    try {
      localStorage.setItem(`quiz_result_config_${category}`, JSON.stringify(config));
      return true;
    } catch (error) {
      console.error("Error saving config:", error);
      return false;
    }
  }, [category, config]);

  const resetConfig = useCallback(() => {
    setConfig({
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
            title: "Oferta Especial",
            subtitle: "Descubra mais sobre seu estilo",
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

  return {
    config,
    updateConfig,
    saveConfig,
    resetConfig,
  };
};
