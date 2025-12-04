import { useCallback, useEffect, useState } from 'react';
import { hierarchicalTemplateSource } from '@/services/core/HierarchicalTemplateSourceMigration';
import { appLogger } from '@/lib/utils/appLogger';

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
      const stepId = `step-${String(stepNumber).padStart(2, '0')}`;

      // 1. Carregar blocos via HierarchicalTemplateSource (respeita JSON_ONLY / flags)
      const primary = await hierarchicalTemplateSource.getPrimary(stepId);
      const blocks = primary.data || [];

      // ✅ FASE 2 FIX: Usar quiz21-v4.json (path correto em .obsolete)
      let master: any = null;
      try {
        const masterResp = await fetch('/templates/.obsolete/quiz21-v4.json', { cache: 'no-cache' });
        if (masterResp.ok) {
          master = await masterResp.json();
        }
      } catch {/* noop */}

      const templateConfig: TemplateConfig = {
        templateVersion: master?.version || '3.0',
        metadata: {
          id: master?.funnelId ? `${master.funnelId}:${stepId}` : stepId,
          name: master?.name || stepId,
          description: master?.description || `Blocos do ${stepId}`,
          category: master?.category || 'quiz',
          type: stepNumber <= 14 ? 'question' : stepNumber === 20 ? 'result' : stepNumber === 21 ? 'offer' : 'transition',
          tags: master?.tags || [],
          createdAt: master?.createdAt || new Date().toISOString(),
          updatedAt: master?.updatedAt || new Date().toISOString(),
          author: master?.author || 'system',
        },
        design: {
          primaryColor: master?.design?.primaryColor || '#B89B7A',
          secondaryColor: master?.design?.secondaryColor || '#432818',
          accentColor: master?.design?.accentColor || '#aa6b5d',
          backgroundColor: master?.design?.backgroundColor || '#FAF9F7',
          fontFamily: master?.design?.fontFamily || 'Inter, sans-serif',
          button: master?.design?.button || { background: '#B89B7A', textColor: '#fff', borderRadius: '8px', shadow: 'none' },
          card: master?.design?.card || { background: '#fff', borderRadius: '12px', shadow: 'none' },
          progressBar: master?.design?.progressBar || { color: '#B89B7A', background: '#EEE', height: '6px' },
          animations: master?.design?.animations || { questionTransition: 'fade', optionSelect: 'pulse', button: 'scale' },
        },
        layout: {
          containerWidth: 'full',
          spacing: 'responsive',
          backgroundColor: master?.design?.backgroundColor || '#FAF9F7',
          responsive: true,
          animations: master?.design?.animations || {},
        },
        blocks: blocks as any,
      };

      setConfig(templateConfig);
      setError(null);
      appLogger.info(`✅ useTemplateConfig: Carregado ${stepId} via HierarchicalTemplateSource (${blocks.length} blocos)`);
    } catch (err) {
      appLogger.warn(`⚠️ useTemplateConfig: Erro ao carregar step-${stepNumber}:`, { data: [err] });
      setError(`Falha ao carregar configuração do ${stepNumber}`);
      setConfig(null); // Sem fallback gerado para evitar drift
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
    [config],
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
