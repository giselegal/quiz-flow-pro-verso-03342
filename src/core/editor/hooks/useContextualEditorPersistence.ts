/**
 * 🎯 HOOK CONTEXTUAL PARA PERSISTÊNCIA DE FUNIS
 * 
 * Hook que trabalha com contextos isolados para evitar vazamento de dados
 * Substitui o useEditorPersistence com isolamento completo
 */

import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { ContextualFunnelService } from '@/services/core/ContextualFunnelService';
import type { ContextualFunnelData } from '@/types/funnel';
import { appLogger } from '@/lib/utils/appLogger';

export interface FunnelData {
    id: string;
    name: string;
    description: string;
    isPublished: boolean;
    version: number;
    settings: Record<string, any>;
    pages: Array<{
        id: string;
        pageType: string;
        pageOrder: number;
        title: string;
        blocks: any[];
        metadata: Record<string, any>;
    }>;
    createdAt?: string;
    updatedAt?: string;
}

export interface UseContextualEditorPersistenceReturn {
    saveFunnel: (data: FunnelData) => Promise<{ success: boolean; error?: string }>;
    loadFunnel: (id: string) => Promise<FunnelData | null>;
    listFunnels: () => Promise<any[]>;
    deleteFunnel: (id: string) => Promise<{ success: boolean; error?: string }>;
    publishFunnel: (id: string) => Promise<{ success: boolean; error?: string }>;
    isSaving: boolean;
    isLoading: boolean;
    context: FunnelContext;
    service: ContextualFunnelService;
}

/**
 * Hook de persistência contextual para funis
 */
export const useContextualEditorPersistence = (
    context: FunnelContext,
): UseContextualEditorPersistenceReturn => {
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [service] = useState(() => new ContextualFunnelService(context));

    const convertToContextualData = (data: FunnelData): any => {
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            pages: data.pages,
            theme: data.settings.theme,
            isPublished: data.isPublished,
            version: data.version,
            settings: data.settings,
            config: data.settings,
            createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
            lastModified: data.updatedAt ? new Date(data.updatedAt) : new Date(),
            context,
        };
    };

    const convertFromContextualData = (data: any): FunnelData => {
        return {
            id: data.id,
            name: data.name,
            description: data.description || '',
            isPublished: data.isPublished || false,
            version: data.version || 1,
            settings: data.settings || data.config || {},
            pages: (data.pages || []).map((page: any) => ({
                id: page.id,
                pageType: page.page_type || page.type || 'step',
                pageOrder: page.page_order || page.order || 1,
                title: page.title || 'Untitled',
                blocks: Array.isArray(page.blocks) ? page.blocks : [],
                metadata: typeof page.metadata === 'object' && page.metadata !== null ? page.metadata : {},
            })),
            createdAt: typeof data.createdAt === 'string' ? data.createdAt : data.createdAt?.toISOString(),
            updatedAt: (data.updatedAt || data.lastModified)?.toISOString?.() || new Date().toISOString(),
        };
    };

    const saveFunnel = useCallback(
        async (data: FunnelData): Promise<{ success: boolean; error?: string }> => {
            setIsSaving(true);
            try {
                appLogger.info(`💾 Salvando funil no contexto ${context}:`, { data: [data.id] });

                const contextualData = convertToContextualData(data);
                await service.saveFunnel(contextualData); // Now compatible with UnifiedFunnelData

                toast({
                    title: 'Sucesso',
                    description: `Funil salvo com sucesso no contexto ${context}!`,
                });

                return { success: true };
            } catch (error) {
                appLogger.error(`❌ Erro ao salvar funil no contexto ${context}:`, { data: [error] });
                toast({
                    title: 'Erro',
                    description: 'Erro inesperado ao salvar',
                    variant: 'destructive',
                });
                return { success: false, error: 'Unexpected error' };
            } finally {
                setIsSaving(false);
            }
        },
        [toast, context, service],
    );

    const loadFunnel = useCallback(
        async (id: string): Promise<FunnelData | null> => {
            setIsLoading(true);
            try {
                appLogger.info(`📂 Carregando funil do contexto ${context}:`, { data: [id] });

                const contextualData = await service.loadFunnel(id);

                if (!contextualData) {
                    appLogger.info(`⚠️ Funil ${id} não encontrado no contexto ${context}`);
                    return null;
                }

                const funnelData: any = convertFromContextualData(contextualData);
                appLogger.info(`✅ Funil carregado do contexto ${context}:`, { data: [funnelData.id] });

                return funnelData;
            } catch (error) {
                appLogger.error(`❌ Erro ao carregar funil do contexto ${context}:`, { data: [error] });
                toast({
                    title: 'Erro',
                    description: 'Erro ao carregar funil',
                    variant: 'destructive',
                });
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        [toast, context, service],
    );

    const listFunnels = useCallback(async (): Promise<any[]> => {
        setIsLoading(true);
        try {
            appLogger.info(`📋 Listando funis do contexto ${context}`);

            const contextualFunnels = await service.listFunnels();
            const funnelsList = contextualFunnels.map(convertFromContextualData);

            appLogger.info(`✅ ${funnelsList.length} funis encontrados no contexto ${context}`);
            return funnelsList;
        } catch (error) {
            appLogger.error(`❌ Erro ao listar funis do contexto ${context}:`, { data: [error] });
            toast({
                title: 'Erro',
                description: 'Erro ao listar funis',
                variant: 'destructive',
            });
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [toast, context, service]);

    const deleteFunnel = useCallback(
        async (id: string): Promise<{ success: boolean; error?: string }> => {
            try {
                appLogger.info(`🗑️ Deletando funil do contexto ${context}:`, { data: [id] });

                const success = await service.deleteFunnel(id);

                if (success) {
                    toast({
                        title: 'Sucesso',
                        description: `Funil deletado com sucesso do contexto ${context}!`,
                    });
                    return { success: true };
                } else {
                    throw new Error('Falha ao deletar funil');
                }
            } catch (error) {
                appLogger.error(`❌ Erro ao deletar funil do contexto ${context}:`, { data: [error] });
                toast({
                    title: 'Erro',
                    description: 'Erro inesperado ao deletar',
                    variant: 'destructive',
                });
                return { success: false, error: 'Unexpected error' };
            }
        },
        [toast, context, service],
    );

    const publishFunnel = useCallback(
        async (id: string): Promise<{ success: boolean; error?: string }> => {
            try {
                appLogger.info(`🚀 Publicando funil do contexto ${context}:`, { data: [id] });

                // Carregar funil
                const funnel = await service.loadFunnel(id);
                if (!funnel) {
                    throw new Error('Funil não encontrado');
                }

                // Marcar como publicado
                const updatedFunnel: any = {
                    ...funnel,
                    isPublished: true,
                    lastModified: new Date(),
                };

                await service.saveFunnel(updatedFunnel);

                toast({
                    title: 'Sucesso',
                    description: `Funil publicado com sucesso no contexto ${context}!`,
                });
                return { success: true };
            } catch (error) {
                appLogger.error(`❌ Erro ao publicar funil do contexto ${context}:`, { data: [error] });
                toast({
                    title: 'Erro',
                    description: 'Erro inesperado ao publicar',
                    variant: 'destructive',
                });
                return { success: false, error: 'Unexpected error' };
            }
        },
        [toast, context, service],
    );

    return {
        saveFunnel,
        loadFunnel,
        listFunnels,
        deleteFunnel,
        publishFunnel,
        isSaving,
        isLoading,
        context,
        service,
    };
};

// ============================================================================
// HOOKS PRÉ-CONFIGURADOS PARA CADA CONTEXTO
// ============================================================================

/**
 * Hook específico para o contexto do Editor
 */
export const useEditorPersistence = () => {
    return useContextualEditorPersistence(FunnelContext.EDITOR);
};

/**
 * Hook específico para o contexto de Templates
 */
export const useTemplatesPersistence = () => {
    return useContextualEditorPersistence(FunnelContext.TEMPLATES);
};

/**
 * Hook específico para o contexto de Meus Funis
 */
export const useMyFunnelsPersistence = () => {
    return useContextualEditorPersistence(FunnelContext.MY_FUNNELS);
};

/**
 * Hook específico para o contexto de Preview
 */
export const usePreviewPersistence = () => {
    return useContextualEditorPersistence(FunnelContext.PREVIEW);
};

/**
 * Hook específico para o contexto de Desenvolvimento
 */
export const useDevPersistence = () => {
    return useContextualEditorPersistence(FunnelContext.DEV);
};
