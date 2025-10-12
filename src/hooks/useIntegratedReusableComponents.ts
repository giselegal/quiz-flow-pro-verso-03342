/**
 * 🔧 HOOK INTEGRADO PARA COMPONENTES REUTILIZÁVEIS
 * ==============================================
 *
 * Integra useReusableComponents com o sistema atual de blocos
 * para criar uma experiência otimizada de reutilização.
 */

import { useCallback, useMemo, useState } from 'react';
import { useReusableComponents } from './useReusableComponents';

export interface ReusableBlockTemplate {
  id: string;
  name: string;
  description: string;
  blockType: string;
  properties: Record<string, any>;
  category: 'quiz' | 'result' | 'offer' | 'utility';
  tags: string[];
  usage_count?: number;
  created_at?: string;
}

/**
 * Hook simplificado que retorna templates disponíveis
 */
export const useIntegratedReusableComponents = (): {
  templates: ReusableBlockTemplate[];
  localTemplates: ReusableBlockTemplate[];
  isLoading: boolean;
  error: string | null;
} => {
  const reusableHook = useReusableComponents();
  const [localTemplates] = useState<ReusableBlockTemplate[]>([]);

  // Integrar templates do sistema atual com componentes reutilizáveis
  const availableTemplates = useMemo(() => {
    const systemComponents =
      reusableHook.componentTypes?.map((comp) => ({
        id: comp.id,
        name: comp.display_name,
        description: comp.description || '',
        blockType: comp.type_key,
        properties: comp.default_properties,
        category: (comp.category as 'quiz' | 'result' | 'offer' | 'utility') || 'utility',
        tags: [],
        usage_count: comp.usage_count || 0,
        created_at: comp.created_at || undefined,
      })) || [];

    return [...localTemplates, ...systemComponents];
  }, [localTemplates, reusableHook.componentTypes]);

  return {
    templates: availableTemplates,
    localTemplates,
    isLoading: reusableHook.loading,
    error: reusableHook.error,
  };
};

export default useIntegratedReusableComponents;
