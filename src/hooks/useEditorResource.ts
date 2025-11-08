/**
 * 🎯 USE EDITOR RESOURCE - Hook Unificado
 * 
 * Gerencia carregamento de templates, funnels e drafts de forma unificada
 * Elimina a necessidade de lógica condicional baseada em query params
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  EditorResource, 
  detectResourceType, 
  detectResourceSource,
  EditorResourceType 
} from '@/types/editor-resource';
import { templateService } from '@/services/canonical/TemplateService';
import { templateToFunnelAdapter } from '@/editor/adapters/TemplateToFunnelAdapter';
import { appLogger } from '@/utils/logger';
import { generateDraftId, generateCloneId } from '@/utils/idGenerator';

export interface UseEditorResourceOptions {
  /** ID do recurso a carregar (opcional - se não informado, modo "novo") */
  resourceId?: string;

  /** Se deve carregar automaticamente ao montar */
  autoLoad?: boolean;

  /** Se tem acesso ao Supabase */
  hasSupabaseAccess?: boolean;
}

export interface UseEditorResourceReturn {
  /** Recurso carregado (null se ainda carregando ou não encontrado) */
  resource: EditorResource | null;

  /** Se está carregando */
  isLoading: boolean;

  /** Erro durante carregamento */
  error: Error | null;

  /** Tipo detectado do recurso */
  resourceType: EditorResourceType | null;

  /** Se é modo "novo" (sem resourceId) */
  isNewMode: boolean;

  /** Se o recurso é read-only */
  isReadOnly: boolean;

  /** Se pode clonar o recurso */
  canClone: boolean;

  /** Recarregar o recurso */
  reload: () => Promise<void>;

  /** Clonar o recurso atual */
  clone: (newName?: string) => Promise<EditorResource>;
}

export function useEditorResource(options: UseEditorResourceOptions): UseEditorResourceReturn {
  const { resourceId, autoLoad = true, hasSupabaseAccess = false } = options;

  const [resource, setResource] = useState<EditorResource | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Detectar tipo e modo
  const isNewMode = !resourceId;
  const resourceType = resourceId ? detectResourceType(resourceId) : null;
  const resourceSource = resourceId ? detectResourceSource(resourceId, hasSupabaseAccess) : null;

  // Características do recurso
  const isReadOnly = resource?.isReadOnly ?? (resourceType === 'template');
  const canClone = resource?.canClone ?? (resourceType === 'template' || resourceType === 'funnel');

  /**
   * Carrega o recurso baseado no ID
   */
  const loadResource = useCallback(async () => {
    if (!resourceId) {
      // Modo novo - criar recurso vazio
      setResource({
        id: generateDraftId(),
        type: 'draft',
        name: 'Novo Funnel',
        source: 'local',
        isReadOnly: false,
        canClone: false,
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const type = detectResourceType(resourceId);
      const source = detectResourceSource(resourceId, hasSupabaseAccess);

      appLogger.info(`🔍 [useEditorResource] Carregando ${type}:`, resourceId);

      // Templates: CONVERTER para funnel editável (GARGALO #1 FIX)
      if (type === 'template') {
        appLogger.info(`🔄 [useEditorResource] Convertendo template → funnel:`, resourceId);

        // Verificar se é template completo (quiz21StepsComplete) ou step individual
        const isCompleteTemplate = resourceId.toLowerCase().includes('complete') || 
                                   resourceId.toLowerCase().includes('quiz21');

        // Converter template → funnel
        const conversionResult = await templateToFunnelAdapter.convertTemplateToFunnel({
          templateId: resourceId,
          customName: `Funnel - ${resourceId}`,
          loadAllSteps: isCompleteTemplate,
          specificSteps: isCompleteTemplate ? undefined : [resourceId],
        });

        if (!conversionResult.success || !conversionResult.funnel) {
          throw new Error(conversionResult.error || 'Falha na conversão do template');
        }

        // Criar EditorResource com dados do funnel
        const loadedResource: EditorResource = {
          id: conversionResult.funnel.id,
          type: 'funnel', // ✅ Agora é funnel editável!
          name: conversionResult.funnel.name,
          source: 'local', // Temporário até salvar no Supabase
          isReadOnly: false, // ✅ Editável!
          canClone: true,
          metadata: {
            clonedFrom: resourceId,
            originalTemplate: resourceId,
            description: `Convertido de ${resourceId}`,
            stepsLoaded: conversionResult.metadata.stepsLoaded,
            totalBlocks: conversionResult.metadata.totalBlocks,
            conversionDuration: conversionResult.metadata.duration,
          },
          data: conversionResult.funnel, // 🆕 Dados completos do funnel
        };

        setResource(loadedResource);
        appLogger.info(`✅ [useEditorResource] Template convertido para funnel:`, {
          originalTemplate: resourceId,
          newFunnelId: loadedResource.id,
          stages: conversionResult.funnel.stages.length,
          blocks: conversionResult.metadata.totalBlocks,
        });
        return;
      }

      // Funnels do Supabase: carregar via SuperUnifiedProvider
      if (type === 'funnel' && source === 'supabase') {
        // O SuperUnifiedProvider já gerencia isso - apenas criar metadata
        const loadedResource: EditorResource = {
          id: resourceId,
          type: 'funnel',
          name: 'Funnel do Supabase',
          source: 'supabase',
          isReadOnly: false,
          canClone: true,
        };

        setResource(loadedResource);
        appLogger.info(`✅ [useEditorResource] Funnel carregado:`, loadedResource);
        return;
      }

      // Drafts locais
      if (type === 'draft') {
        const loadedResource: EditorResource = {
          id: resourceId,
          type: 'draft',
          name: 'Rascunho Local',
          source: 'local',
          isReadOnly: false,
          canClone: false,
        };

        setResource(loadedResource);
        appLogger.info(`✅ [useEditorResource] Draft carregado:`, loadedResource);
        return;
      }

      throw new Error(`Tipo de recurso não suportado: ${type}`);

    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      appLogger.error('[useEditorResource] Erro ao carregar recurso:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [resourceId, hasSupabaseAccess]);

  /**
   * Clona o recurso atual
   */
  const clone = useCallback(async (newName?: string): Promise<EditorResource> => {
    if (!resource) {
      throw new Error('Nenhum recurso carregado para clonar');
    }

    if (!canClone) {
      throw new Error('Este recurso não pode ser clonado');
    }

    appLogger.info(`🔄 [useEditorResource] Clonando recurso:`, resource.id);

    // Gerar ID único para o clone
    const cloneId = generateCloneId();

    const clonedResource: EditorResource = {
      ...resource,
      id: cloneId,
      type: 'funnel', // Clones sempre viram funnels editáveis
      name: newName || `${resource.name} (Cópia)`,
      source: hasSupabaseAccess ? 'supabase' : 'local',
      isReadOnly: false,
      canClone: true,
      metadata: {
        ...resource.metadata,
        createdAt: new Date().toISOString(),
        clonedFrom: resource.id,
      },
    };

    appLogger.info(`✅ [useEditorResource] Clone criado:`, clonedResource);
    return clonedResource;
  }, [resource, canClone, hasSupabaseAccess]);

  // Auto-load ao montar
  useEffect(() => {
    if (autoLoad) {
      loadResource();
    }
  }, [autoLoad, loadResource]);

  return {
    resource,
    isLoading,
    error,
    resourceType,
    isNewMode,
    isReadOnly,
    canClone,
    reload: loadResource,
    clone,
  };
}
