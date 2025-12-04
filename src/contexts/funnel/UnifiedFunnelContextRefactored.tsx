/**
 * 🎯 CONTEXTO UNIFICADO DE FUNIL - REFATORADO
 * 
 * Contexto centralizado que usa FunnelService (canonical):
 * - Estado único e consistente
 * - Cache inteligente automático
 * - Deep clone para isolamento
 * - Validação automática
 * - Permissões integradas
 * - Event system para sincronização
 */

import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import { funnelService as canonicalFunnelService } from '@/services';
import type { FunnelMetadata } from '@/types/funnel';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// INTERFACES
// ============================================================================

// Definição local para evitar dependência de tipos não exportados
interface UnifiedFunnelData {
    id: string;
    name: string;
    description: string;
    stages: any[];
    settings: any;
    status: string;
    version: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}

interface UnifiedFunnelContextType {
    // Estado do funil
    funnelId: string | null;
    funnel: UnifiedFunnelData | null;
    isReady: boolean;
    isLoading: boolean;
    hasError: boolean;

    // Permissões
    canRead: boolean;
    canEdit: boolean;
    canDelete: boolean;
    isOwner: boolean;

    // Error handling
    errorMessage: string | null;
    errorType: string | null;
    suggestions: string[];

    // Ações CRUD
    createFunnel: (name: string, options?: any) => Promise<UnifiedFunnelData>;
    updateFunnel: (updates: any) => Promise<UnifiedFunnelData>;
    duplicateFunnel: (newName?: string) => Promise<UnifiedFunnelData>;
    deleteFunnel: () => Promise<boolean>;

    // Ações de controle
    retry: () => void;
    reload: () => void;
    validateFunnel: (id: string) => Promise<void>;

    // Debug
    debugInfo: any;
}

const UnifiedFunnelContext = createContext<UnifiedFunnelContextType | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

interface UnifiedFunnelProviderProps {
    children: ReactNode;
    funnelId?: string;
    userId?: string;
    context?: FunnelContext;
    debugMode?: boolean;
}

export const UnifiedFunnelProvider: React.FC<UnifiedFunnelProviderProps> = ({
    children,
    funnelId,
    userId,
    context = FunnelContext.EDITOR,
    debugMode = false,
}) => {
    const service = canonicalFunnelService;
    // Estados locais
    const [funnel, setFunnel] = useState<UnifiedFunnelData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [permissions, setPermissions] = useState({
        canRead: false,
        canEdit: false,
        canDelete: false,
        isOwner: false,
    });

    // ========================================================================
    // EFEITOS
    // ========================================================================

    // Carregar funil quando ID mudar
    useEffect(() => {
        if (funnelId) {
            loadFunnel(funnelId);
        } else {
            setFunnel(null);
            setError(null);
            setPermissions({
                canRead: false,
                canEdit: false,
                canDelete: false,
                isOwner: false,
            });
        }
    }, [funnelId, userId]);

    // Setup de event listeners para sincronização
    useEffect(() => {
        const handleFunnelUpdated = (event: any) => {
            if (event.funnelId === funnelId) {
                appLogger.info('🔄 Funil atualizado externamente, recarregando...');
                if (funnelId) loadFunnel(funnelId);
            }
        };

        const handleFunnelDeleted = (event: any) => {
            if (event.funnelId === funnelId) {
                appLogger.info('🗑️ Funil deletado externamente');
                setFunnel(null);
                setError('Funil foi deletado');
            }
        };

        // Registrar listeners do serviço canônico
        service.on('funnel:updated', handleFunnelUpdated);
        service.on('funnel:deleted', handleFunnelDeleted);

        // Cleanup
        return () => {
            service.off('funnel:updated', handleFunnelUpdated);
            service.off('funnel:deleted', handleFunnelDeleted);
        };
    }, [funnelId, service]);

    // ========================================================================
    // FUNÇÕES AUXILIARES
    // ========================================================================

    const loadFunnel = async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            appLogger.info('📖 UnifiedFunnelContext: Carregando funil (canônico)', { data: [id] });

            // Usar serviço canônico (mapeado para tipo unificado)
            const canonical = await service.getFunnel(id);
            const loadedFunnel = canonical ? mapCanonicalToUnified(canonical) : null;

            if (loadedFunnel) {
                setFunnel(loadedFunnel);

                // Verificar permissões (se disponível)
                const perms = await service.checkPermissions(id);
                setPermissions(perms);

                appLogger.info('✅ Funil carregado:', { data: [loadedFunnel] });
            } else {
                setError('Funil não encontrado');
                setFunnel(null);
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            appLogger.error('❌ Erro ao carregar funil:', { data: [errorMessage] });
            setError(errorMessage);
            setFunnel(null);
        } finally {
            setIsLoading(false);
        }
    };

    // ========================================================================
    // AÇÕES CRUD
    // ========================================================================

    const createFunnel = async (name: string, options: any = {}): Promise<UnifiedFunnelData> => {
        setIsLoading(true);
        setError(null);

        try {
            appLogger.info('🎯 UnifiedFunnelContext: Criando funil (canônico)', { data: [name] });

            const created = await service.createFunnel({
                name,
                type: options?.type ?? 'quiz',
                category: options?.category ?? 'quiz',
                context,
                status: options?.status ?? 'draft',
                config: options?.settings ?? options?.config ?? {},
                metadata: { ...(options?.metadata || {}), createdBy: 'UnifiedFunnelContext' },
            });

            if (!created) {
                throw new Error('Failed to create funnel');
            }

            const newFunnel = mapCanonicalToUnified(created);

            setFunnel(newFunnel);

            // Atualizar permissões (será owner)
            setPermissions({
                canRead: true,
                canEdit: true,
                canDelete: true,
                isOwner: true,
            });

            appLogger.info('✅ Funil criado:', { data: [newFunnel] });
            return newFunnel;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao criar funil';
            appLogger.error('❌ Erro ao criar funil:', { data: [errorMessage] });
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const updateFunnel = async (updates: any): Promise<UnifiedFunnelData> => {
        if (!funnelId || !funnel) {
            throw new Error('Nenhum funil carregado para atualizar');
        }

        setIsLoading(true);
        setError(null);

        try {
            appLogger.info('✏️ UnifiedFunnelContext: Atualizando funil (canônico)', { data: [funnelId] });

            const updated = await service.updateFunnel(funnelId, {
                name: updates?.name ?? funnel.name,
                type: updates?.type ?? (funnel.settings as any)?.type,
                category: updates?.category ?? (funnel as any).category,
                status: updates?.status ?? (updates?.isPublished ? 'published' : undefined),
                config: updates?.settings ?? updates?.config ?? funnel.settings,
                metadata: { ...(updates?.metadata || {}), updatedBy: 'UnifiedFunnelContext' },
            }); const updatedFunnel = updated ? mapCanonicalToUnified(updated) : funnel;
            setFunnel(updatedFunnel);

            appLogger.info('✅ Funil atualizado:', { data: [updatedFunnel] });
            return updatedFunnel;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar funil';
            appLogger.error('❌ Erro ao atualizar funil:', { data: [errorMessage] });
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const duplicateFunnel = async (newName?: string): Promise<UnifiedFunnelData> => {
        if (!funnelId) {
            throw new Error('Nenhum funil carregado para duplicar');
        }

        setIsLoading(true);
        setError(null);

        try {
            appLogger.info('🔄 UnifiedFunnelContext: Duplicando funil', { data: [funnelId] });

            // funnelService pode não ter método duplicateFunnel, vamos criar manualmente
            const original = await service.getFunnel(funnelId);
            if (!original) {
                throw new Error('Funil original não encontrado');
            }

            const duplicated = await service.createFunnel({
                name: newName || `${original.name} (Cópia)`,
                type: original.type,
                category: original.category,
                context: original.context,
                status: 'draft',
                config: original.config,
                metadata: { ...original.metadata, clonedFrom: funnelId } as any,
            });

            if (!duplicated) {
                throw new Error('Failed to duplicate funnel');
            }

            const duplicatedFunnel = mapCanonicalToUnified(duplicated);

            appLogger.info('✅ Funil duplicado:', { data: [duplicatedFunnel] });
            return duplicatedFunnel;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao duplicar funil';
            appLogger.error('❌ Erro ao duplicar funil:', { data: [errorMessage] });
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteFunnel = async (): Promise<boolean> => {
        if (!funnelId) {
            throw new Error('Nenhum funil carregado para deletar');
        }

        setIsLoading(true);
        setError(null);

        try {
            appLogger.info('🗑️ UnifiedFunnelContext: Deletando funil (canônico)', { data: [funnelId] });

            const success = await service.deleteFunnel(funnelId);

            if (success) {
                setFunnel(null);
                setPermissions({
                    canRead: false,
                    canEdit: false,
                    canDelete: false,
                    isOwner: false,
                });
                appLogger.info('✅ Funil deletado');
            }

            return success;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar funil';
            appLogger.error('❌ Erro ao deletar funil:', { data: [errorMessage] });
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // ========================================================================
    // AÇÕES DE CONTROLE
    // ========================================================================

    const retry = () => {
        if (funnelId) {
            loadFunnel(funnelId);
        }
    };

    const reload = () => {
        if (funnelId) {
            // Limpar cache antes de recarregar (se disponível)
            service.clearCache();
            loadFunnel(funnelId);
        }
    };

    const validateFunnel = async (id: string) => {
        try {
            const permissions = await service.checkPermissions(id);
            setPermissions(permissions);
        } catch (err) {
            appLogger.error('❌ Erro na validação:', { data: [err] });
        }
    };

    // ========================================================================
    // VALOR DO CONTEXTO
    // ========================================================================

    const contextValue: UnifiedFunnelContextType = {
        // Estado
        funnelId: funnelId || null,
        funnel,
        isReady: !isLoading && !error && !!funnel,
        isLoading,
        hasError: !!error,

        // Permissões
        canRead: permissions.canRead,
        canEdit: permissions.canEdit,
        canDelete: permissions.canDelete,
        isOwner: permissions.isOwner,

        // Error handling
        errorMessage: error,
        errorType: error ? 'UNKNOWN' : null,
        suggestions: error ? ['Tente recarregar', 'Verifique sua conexão'] : [],

        // Ações CRUD
        createFunnel,
        updateFunnel,
        duplicateFunnel,
        deleteFunnel,

        // Ações de controle
        retry,
        reload,
        validateFunnel,

        // Debug
        debugInfo: debugMode ? {
            funnelId,
            userId,
            context,
            serviceCache: 'CanonicalFunnelService',
        } : null,
    };

    if (debugMode) {
        appLogger.info('🎯 UnifiedFunnelProvider state:', { data: [contextValue] });
    }

    return (
        <UnifiedFunnelContext.Provider value={contextValue}>
            {children}
        </UnifiedFunnelContext.Provider>
    );
};

/**
 * Hook para acessar o contexto unificado do funil
 */
export const useUnifiedFunnel = (): UnifiedFunnelContextType => {
    const context = useContext(UnifiedFunnelContext);

    if (!context) {
        throw new Error('useUnifiedFunnel deve ser usado dentro de um UnifiedFunnelProvider');
    }

    return context;
};

/**
 * Hook com fallback seguro
 */
export const useUnifiedFunnelSafe = (): UnifiedFunnelContextType | null => {
    return useContext(UnifiedFunnelContext);
};

// =============================================================================
// Helpers de mapeamento (canônico → unificado)
// =============================================================================
function mapCanonicalToUnified(meta: FunnelMetadata): UnifiedFunnelData {
    return {
        id: meta.id,
        name: meta.name,
        description: (meta.metadata && (meta.metadata as any).description) || '',
        stages: [],
        settings: meta.config || {},
        status: meta.status,
        version: '1',
        createdAt: new Date(meta.createdAt),
        updatedAt: new Date(meta.updatedAt),
        userId: 'system',
    };
}
