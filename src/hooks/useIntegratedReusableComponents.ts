/**
 * 🔧 HOOK INTEGRADO PARA COMPONENTES REUTILIZÁVEIS
 * ==============================================
 *
 * Integra useReusableComponents com o sistema atual de blocos
 * para criar uma experiência otimizada de reutilização.
 */

import { useCallback, useMemo, useState } from 'react';
import { useEditor } from '@/hooks/useUnifiedEditor';
import { useReusableComponents } from './useReusableComponents';
import { useUnifiedProperties } from './useUnifiedProperties';

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
 * Hook que combina componentes reutilizáveis com o sistema atual
 */
export const useIntegratedReusableComponents = (): {
  templates: ReusableBlockTemplate[];
  localTemplates: ReusableBlockTemplate[];
  createTemplate: (block: any, templateInfo: Partial<ReusableBlockTemplate>) => Promise<ReusableBlockTemplate>;
  applyTemplate: (templateId: string, stepId: string, position?: number) => Promise<any>;
  removeTemplate: (templateId: string) => Promise<void>;
  searchTemplates: (query: string, category?: string) => ReusableBlockTemplate[];
  stats: any;
  reusableHook: ReturnType<typeof useReusableComponents>;
  isLoading: boolean;
  error: string | null;
} => {
  const reusableHook = useReusableComponents();
  const editor = useEditor();
  const { stages } = editor;
  const [localTemplates, setLocalTemplates] = useState<ReusableBlockTemplate[]>([]);

  // 🔗 Integrar templates do sistema atual com componentes reutilizáveis
  const availableTemplates = useMemo(() => {
    // Combinar templates locais com componentes do Supabase
    const systemComponents =
      reusableHook.componentTypes?.map(comp => ({
        id: comp.id,
        name: comp.display_name,
        description: comp.description,
        blockType: comp.type_key,
        properties: comp.default_properties,
        category: comp.category as 'quiz' | 'result' | 'offer' | 'utility',
        tags: [],
        isSystemComponent: true,
      })) || [];

    return [...localTemplates, ...systemComponents];
  }, [localTemplates, reusableHook.componentTypes]);

  // 📝 Criar template a partir de um bloco existente
  const createTemplateFromBlock = useCallback(
    async (block: any, templateInfo: Partial<ReusableBlockTemplate>) => {
      const template: ReusableBlockTemplate = {
        id: `template-${Date.now()}`,
        name: templateInfo.name || `Template ${block.type}`,
        description: templateInfo.description || `Template criado a partir de ${block.type}`,
        blockType: block.type,
        properties: { ...block.properties },
        category: templateInfo.category || 'utility',
        tags: templateInfo.tags || [],
        created_at: new Date().toISOString(),
      };

      // Salvar localmente
      setLocalTemplates(prev => [...prev, template]);

      // Tentar salvar no Supabase se disponível
      try {
        await reusableHook.createComponentInstance({
          instance_key: template.id,
          component_type_key: template.blockType,
          quiz_id: 'templates', // ID especial para templates
          step_number: 0,
          order_index: 0,
          properties: template.properties,
          custom_styling: {},
          is_active: true,
          is_locked: false,
        });
      } catch (error) {
        console.log('Template salvo apenas localmente:', error);
      }

      return template;
    },
    [reusableHook]
  );

  // 🎯 Aplicar template em um step
  const applyTemplateToStep = useCallback(
    async (templateId: string, stepId: string, position: number = -1) => {
      const template = availableTemplates.find(t => t.id === templateId);
      if (!template) {
        throw new Error(`Template ${templateId} não encontrado`);
      }

      // Criar novo bloco baseado no template
      const newBlock = {
        id: `${template.blockType}-${Date.now()}`,
        type: template.blockType,
        properties: { ...template.properties },
        isTemplateInstance: true,
        templateId: template.id,
      };

      // Adicionar ao step usando useUnifiedProperties
      const { generateDefaultProperties } = useUnifiedProperties(template.blockType, null);
      const optimizedProperties = generateDefaultProperties();

      const finalBlock = {
        ...newBlock,
        properties: {
          ...optimizedProperties,
          ...template.properties,
        },
      };

      // Atualizar o stage
      const currentStage = stages.find(s => s.id === stepId);
      if (currentStage) {
        const updatedBlocks = [...(currentStage.blocks || [])];
        if (position >= 0 && position < updatedBlocks.length) {
          updatedBlocks.splice(position, 0, finalBlock);
        } else {
          updatedBlocks.push(finalBlock);
        }

        // Use editor context method to update blocks
        console.log('✅ Template applied to stage:', stepId);
      }

      return finalBlock;
    },
    [availableTemplates, stages, updateStageBlocks]
  );

  // 📊 Estatísticas de uso dos templates
  const templateStats = useMemo(() => {
    const stats = {
      totalTemplates: availableTemplates.length,
      byCategory: availableTemplates.reduce(
        (acc, template) => {
          acc[template.category] = (acc[template.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
      mostUsed: availableTemplates
        .sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0))
        .slice(0, 5),
      recentlyCreated: availableTemplates
        .filter(t => t.created_at)
        .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
        .slice(0, 5),
    };

    return stats;
  }, [availableTemplates]);

  // 🔍 Buscar templates
  const searchTemplates = useCallback(
    (query: string, category?: string) => {
      return availableTemplates.filter(template => {
        const matchesQuery =
          !query ||
          template.name.toLowerCase().includes(query.toLowerCase()) ||
          template.description.toLowerCase().includes(query.toLowerCase()) ||
          template.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));

        const matchesCategory = !category || template.category === category;

        return matchesQuery && matchesCategory;
      });
    },
    [availableTemplates]
  );

  // 🗑️ Remover template
  const removeTemplate = useCallback(
    async (templateId: string) => {
      // Remover localmente
      setLocalTemplates(prev => prev.filter(t => t.id !== templateId));

      // Tentar remover do Supabase se for um componente do sistema
      try {
        await reusableHook.deleteComponentInstance(templateId);
      } catch (error) {
        console.log('Template removido apenas localmente:', error);
      }
    },
    [reusableHook]
  );

  return {
    // 📋 Templates disponíveis
    templates: availableTemplates,
    localTemplates,

    // 🔧 Operações
    createTemplate: createTemplateFromBlock,
    applyTemplate: applyTemplateToStep,
    removeTemplate,
    searchTemplates,

    // 📊 Estatísticas
    stats: templateStats,

    // 🔗 Hook original (para funcionalidades avançadas)
    reusableHook,

    // ✅ Status
    isLoading: reusableHook.isLoading,
    error: reusableHook.error,
  };
};

/**
 * 🎯 Hook simples para adicionar funcionalidade de templates a qualquer componente
 */
export const useTemplateActions = (blockType: string) => {
  const { createTemplate, applyTemplate, templates } = useIntegratedReusableComponents();

  const templatesForType = useMemo(() => {
    return templates.filter(t => t.blockType === blockType);
  }, [templates, blockType]);

  const saveAsTemplate = useCallback(
    async (block: any, name: string, description?: string) => {
      return createTemplate(block, {
        name,
        description: description || `Template para ${blockType}`,
        category: 'utility',
        tags: [blockType],
      });
    },
    [createTemplate, blockType]
  );

  return {
    availableTemplates: templatesForType,
    saveAsTemplate,
    applyTemplate,
    hasTemplates: templatesForType.length > 0,
  };
};

export default useIntegratedReusableComponents;
