/**
 * 🎯 CONTEXTO UNIFICADO DE FUNIL - REFATORADO
 * 
 * Contexto centralizado que usa FunnelService Canonical:
 * - Estado único e consistente
 * - Cache inteligente automático
 * - Deep clone para isolamento
 * - Validação automática
 * - Permissões integradas
 * - Event system para sincronização
 */

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { funnelService } from '@/services/funnel/FunnelService';
import type { UnifiedFunnelData } from '@/services/canonical/types';
import { adaptMetadataToUnified } from '@/services/canonical/FunnelAdapter';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// INTERFACES
// ============================================================================

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

        // Registrar listeners
        funnelService.on('updated', handleFunnelUpdated);
        funnelService.on('deleted', handleFunnelDeleted);

        // Cleanup
        return () => {
            funnelService.off('updated', handleFunnelUpdated);
            funnelService.off('deleted', handleFunnelDeleted);
        };
    }, [funnelId]);

    // ========================================================================
    // FUNÇÕES AUXILIARES
    // ========================================================================

    const loadFunnel = async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            appLogger.info('📖 UnifiedFunnelContext: Carregando funil', { data: [id] });

            // Usar serviço unificado (com cache automático)
            const loadedFunnelMeta = await funnelService.getFunnel(id);
            const loadedFunnel = loadedFunnelMeta ? adaptMetadataToUnified(loadedFunnelMeta) : null;

            if (loadedFunnel) {
                setFunnel(loadedFunnel);

                // Verificar permissões
                const perms = await funnelService.checkPermissions(id);
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
            appLogger.info('🎯 UnifiedFunnelContext: Criando funil', { data: [name] });

            const newFunnelMeta = await funnelService.createFunnel({
                name,
                context,
                userId,
                ...options,
            });

            const newFunnel = adaptMetadataToUnified(newFunnelMeta);
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
            appLogger.info('✏️ UnifiedFunnelContext: Atualizando funil', { data: [funnelId] });

            const updatedFunnelMeta = await funnelService.updateFunnel(funnelId, updates);
            const updatedFunnel = updatedFunnelMeta ? adaptMetadataToUnified(updatedFunnelMeta) : funnel;
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

            const duplicatedFunnelMeta = await funnelService.duplicateFunnel(funnelId, newName);
            const duplicatedFunnel = adaptMetadataToUnified(duplicatedFunnelMeta);

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
            appLogger.info('🗑️ UnifiedFunnelContext: Deletando funil', { data: [funnelId] });

            const success = await funnelService.deleteFunnel(funnelId);

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
            // Limpar cache antes de recarregar
            funnelService.clearCache();
            loadFunnel(funnelId);
        }
    };

    const validateFunnel = async (id: string) => {
        try {
            const permissions = await funnelService.checkPermissions(id);
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
            serviceCache: 'FunnelUnifiedService',
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
