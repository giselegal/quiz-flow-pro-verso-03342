import { useState, useEffect } from 'react';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { useUnifiedCRUDOptional } from '@/contexts';
import { safeGetItem, safeSetItem } from '@/utils/contextualStorage';

interface PageConfig {
  title?: string;
  description?: string;
  theme?: string;
  components?: any[];
}

export const usePageConfig = (pageType: string) => {
  const [config, setConfig] = useState<PageConfig>({});
  const [loading, setLoading] = useState(true);

  // Determinar contexto ativo (fallback para EDITOR)
  let activeContext: FunnelContext = FunnelContext.EDITOR;
  try {
    const crudCtx = useUnifiedCRUDOptional();
    if (crudCtx?.funnelContext) activeContext = crudCtx.funnelContext;
  } catch { }

  useEffect(() => {
    // Load page configuration from localStorage or API
    const savedConfig = safeGetItem(`page_config_${pageType}`, activeContext);
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
    safeSetItem(`page_config_${pageType}`, JSON.stringify({ ...config, ...updates }), activeContext);
  };

  return {
    config,
    updateConfig,
    loading,
  };
};
