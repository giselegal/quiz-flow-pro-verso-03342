import { useCallback, useEffect, useState } from 'react';

// Interface para configuração de template
export interface TemplateConfig {
  templateVersion: string;
  metadata: {
    id: string;
    name: string;
    description: string;
    category: string;
    type: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    author: string;
  };
  design: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    fontFamily: string;
    button: {
      background: string;
      textColor: string;
      borderRadius: string;
      shadow: string;
    };
    card: {
      background: string;
      borderRadius: string;
      shadow: string;
    };
    progressBar: {
      color: string;
      background: string;
      height: string;
    };
    animations: {
      questionTransition: string;
      optionSelect: string;
      button: string;
    };
  };
  layout: {
    containerWidth: string;
    spacing: string;
    backgroundColor: string;
    responsive: boolean;
    animations: Record<string, string>;
  };
  blocks: Array<{
    id: string;
    type: string;
    properties: Record<string, any>;
  }>;
  validation?: {
    required: boolean;
    minAnswers: number;
    maxAnswers: number;
    validationMessage: string;
  };
  analytics?: {
    trackingId: string;
    events: string[];
    utmParams: boolean;
    customEvents: string[];
  };
  logic?: {
    navigation: {
      nextStep: string;
      prevStep: string;
      allowBack: boolean;
      autoAdvance: boolean;
    };
    scoring?: {
      enabled: boolean;
      method: string;
      categories: string[];
    };
    conditions?: any;
  };
}

/**
 * Hook para carregar configurações JSON dos templates
 * Integra com o sistema híbrido JSON + TSX
 */
export const useTemplateConfig = (stepNumber: number) => {
  const [config, setConfig] = useState<TemplateConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = useCallback(async () => {
    if (stepNumber < 1 || stepNumber > 21) {
      setError('Número de step inválido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const stepId = String(stepNumber).padStart(2, '0');
      const configPath = `/src/config/templates/step-${stepId}.json`;

      // Tentar carregar a configuração JSON
      const response = await fetch(configPath);

      if (!response.ok) {
        throw new Error(`Não foi possível carregar configuração para step ${stepNumber}`);
      }

      const jsonConfig = (await response.json()) as TemplateConfig;
      setConfig(jsonConfig);

      console.log(`✅ useTemplateConfig: Carregado step-${stepId}.json`, jsonConfig.metadata);
    } catch (err) {
      console.warn(`⚠️ useTemplateConfig: Erro ao carregar step-${stepNumber}:`, err);

      // Fallback: criar configuração básica
      const fallbackConfig: TemplateConfig = {
        templateVersion: '2.0',
        metadata: {
          id: `quiz-step-${stepNumber}`,
          name: `Step ${stepNumber}`,
          description: `Template para step ${stepNumber}`,
          category: 'quiz',
          type: stepNumber <= 14 ? 'question' : stepNumber === 20 ? 'result' : 'transition',
          tags: ['quiz', 'style'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: 'system',
        },
        design: {
          primaryColor: '#B89B7A',
          secondaryColor: '#432818',
          accentColor: '#aa6b5d',
          backgroundColor: '#FAF9F7',
          fontFamily: "'Playfair Display', 'Inter', serif",
          button: {
            background: 'linear-gradient(90deg, #B89B7A, #aa6b5d)',
            textColor: '#fff',
            borderRadius: '10px',
            shadow: '0 4px 14px rgba(184, 155, 122, 0.15)',
          },
          card: {
            background: '#fff',
            borderRadius: '16px',
            shadow: '0 4px 20px rgba(184, 155, 122, 0.10)',
          },
          progressBar: {
            color: '#B89B7A',
            background: '#F3E8E6',
            height: '6px',
          },
          animations: {
            questionTransition: 'fade, scale',
            optionSelect: 'glow, scale',
            button: 'hover:scale-105, active:scale-95',
          },
        },
        layout: {
          containerWidth: 'full',
          spacing: 'responsive',
          backgroundColor: '#FAF9F7',
          responsive: true,
          animations: {
            questionTransition: 'fade, scale',
            optionSelect: 'glow, scale',
            button: 'hover:scale-105, active:scale-95',
          },
        },
        blocks: [],
      };

      setConfig(fallbackConfig);
      setError(`Usando configuração padrão para step ${stepNumber}`);
    } finally {
      setLoading(false);
    }
  }, [stepNumber]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // Função para obter propriedades de um bloco específico
  const getBlockConfig = useCallback(
    (blockId: string) => {
      if (!config) return null;
      return config.blocks.find(block => block.id === blockId);
    },
    [config]
  );

  // Função para obter propriedades de design
  const getDesignTokens = useCallback(() => {
    if (!config) return null;
    return config.design;
  }, [config]);

  return {
    config,
    loading,
    error,
    getBlockConfig,
    getDesignTokens,
    reload: loadConfig,
  };
};
