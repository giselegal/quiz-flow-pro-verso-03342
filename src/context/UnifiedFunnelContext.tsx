/**
 * 🎯 CONTEXTO UNIFICADO DE FUNIL - REFATORADO
 * 
 * Contexto centralizado que usa FunnelUnifiedService:
 * - Estado único e consistente
 * - Cache inteligente automático
 * - Deep clone para isolamento
 * - Validação automática
 * - Permissões integradas
 * - Event system para sincronização
 */

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { funnelUnifiedService, type UnifiedFunnelData } from '@/services/FunnelUnifiedService';
import { FunnelContext } from '@/core/contexts/FunnelContext';

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
    debugMode = false
}) => {
    // Estados locais
    const [funnel, setFunnel] = useState<UnifiedFunnelData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [permissions, setPermissions] = useState({
        canRead: false,
        canEdit: false,
        canDelete: false,
        isOwner: false
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
                isOwner: false
            });
        }
    }, [funnelId, userId]);

    // Setup de event listeners para sincronização
    useEffect(() => {
        const handleFunnelUpdated = (event: any) => {
            if (event.funnelId === funnelId) {
                console.log('🔄 Funil atualizado externamente, recarregando...');
                loadFunnel(funnelId);
            }
        };

        const handleFunnelDeleted = (event: any) => {
            if (event.funnelId === funnelId) {
                console.log('🗑️ Funil deletado externamente');
                setFunnel(null);
                setError('Funil foi deletado');
            }
        };

        // Registrar listeners
        funnelUnifiedService.on('updated', handleFunnelUpdated);
        funnelUnifiedService.on('deleted', handleFunnelDeleted);

        // Cleanup
        return () => {
            funnelUnifiedService.off('updated', handleFunnelUpdated);
            funnelUnifiedService.off('deleted', handleFunnelDeleted);
        };
    }, [funnelId]);

    // ========================================================================
    // FUNÇÕES AUXILIARES
    // ========================================================================

    const loadFunnel = async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('📖 UnifiedFunnelContext: Carregando funil', id);

            // Usar serviço unificado (com cache automático)
            const loadedFunnel = await funnelUnifiedService.getFunnel(id, userId);
            
            if (loadedFunnel) {
                setFunnel(loadedFunnel);

                // Verificar permissões
                const perms = await funnelUnifiedService.checkPermissions(id, userId);
                setPermissions(perms);

                console.log('✅ Funil carregado:', loadedFunnel);
            } else {
                setError('Funil não encontrado');
                setFunnel(null);
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            console.error('❌ Erro ao carregar funil:', errorMessage);
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
            console.log('🎯 UnifiedFunnelContext: Criando funil', name);

            const newFunnel = await funnelUnifiedService.createFunnel({
                name,
                context,
                userId,
                ...options
            });

            setFunnel(newFunnel);

            // Atualizar permissões (será owner)
            setPermissions({
                canRead: true,
                canEdit: true,
                canDelete: true,
                isOwner: true
            });

            console.log('✅ Funil criado:', newFunnel);
            return newFunnel;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao criar funil';
            console.error('❌ Erro ao criar funil:', errorMessage);
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
            console.log('✏️ UnifiedFunnelContext: Atualizando funil', funnelId);

            const updatedFunnel = await funnelUnifiedService.updateFunnel(funnelId, updates, userId);
            setFunnel(updatedFunnel);

            console.log('✅ Funil atualizado:', updatedFunnel);
            return updatedFunnel;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar funil';
            console.error('❌ Erro ao atualizar funil:', errorMessage);
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
            console.log('🔄 UnifiedFunnelContext: Duplicando funil', funnelId);

            const duplicatedFunnel = await funnelUnifiedService.duplicateFunnel(funnelId, newName, userId);

            console.log('✅ Funil duplicado:', duplicatedFunnel);
            return duplicatedFunnel;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao duplicar funil';
            console.error('❌ Erro ao duplicar funil:', errorMessage);
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
            console.log('🗑️ UnifiedFunnelContext: Deletando funil', funnelId);

            const success = await funnelUnifiedService.deleteFunnel(funnelId, userId);
            
            if (success) {
                setFunnel(null);
                setPermissions({
                    canRead: false,
                    canEdit: false,
                    canDelete: false,
                    isOwner: false
                });
                console.log('✅ Funil deletado');
            }

            return success;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar funil';
            console.error('❌ Erro ao deletar funil:', errorMessage);
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
            funnelUnifiedService.clearCache();
            loadFunnel(funnelId);
        }
    };

    const validateFunnel = async (id: string) => {
        try {
            const permissions = await funnelUnifiedService.checkPermissions(id, userId);
            setPermissions(permissions);
        } catch (err) {
            console.error('❌ Erro na validação:', err);
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
            serviceCache: 'FunnelUnifiedService'
        } : null
    };

    if (debugMode) {
        console.log('🎯 UnifiedFunnelProvider state:', contextValue);
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

import React, { createContext, useContext, ReactNode } from 'react';
import { useFunnelContext } from '@/hooks/useFunnelLoader';

interface UnifiedFunnelContextType {
    // Estado do funil
    funnelId: string | null;
    funnel: any | null;
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

    // Ações
    retry: () => void;
    reload: () => void;
    validateFunnel: (id: string) => Promise<void>;

    // Debug
    debugInfo: any;
}

const UnifiedFunnelContext = createContext<UnifiedFunnelContextType | null>(null);

interface UnifiedFunnelProviderProps {
    children: ReactNode;
    funnelId?: string;
    userId?: string;
    debugMode?: boolean;
}

export const UnifiedFunnelProvider: React.FC<UnifiedFunnelProviderProps> = ({
    children,
    funnelId,
    userId,
    debugMode = false
}) => {
    const funnelContext = useFunnelContext(funnelId, userId);

    // Mapear permissões baseadas na validação
    const permissions = React.useMemo(() => {
        if (!funnelContext.isReady || !funnelContext.canEdit) {
            return {
                canRead: false,
                canEdit: false,
                canDelete: false,
                isOwner: false
            };
        }

        // Por enquanto, se pode editar, assume permissões completas
        // Em produção, isso viria da validação do serviço
        return {
            canRead: true,
            canEdit: true,
            canDelete: true,
            isOwner: true
        };
    }, [funnelContext.isReady, funnelContext.canEdit]);

    const contextValue: UnifiedFunnelContextType = {
        // Estado do funil
        funnelId: funnelContext.funnelId,
        funnel: funnelContext.currentFunnel,
        isReady: funnelContext.isReady || false,
        isLoading: funnelContext.isLoading || false,
        hasError: funnelContext.hasError || false,

        // Permissões
        canRead: permissions.canRead,
        canEdit: permissions.canEdit,
        canDelete: permissions.canDelete,
        isOwner: permissions.isOwner,

        // Error handling
        errorMessage: funnelContext.errorMessage,
        errorType: funnelContext.errorType,
        suggestions: funnelContext.suggestions,

        // Ações
        retry: funnelContext.retry,
        reload: funnelContext.reload,
        validateFunnel: async (_id: string) => {
            await funnelContext.reload();
        },

        // Debug
        debugInfo: debugMode ? {
            funnelId,
            userId,
            contextState: funnelContext
        } : null
    };

    if (debugMode) {
        console.log('🎯 UnifiedFunnelProvider state:', contextValue);
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
 * Hook para verificar se o funil está pronto
 */
export const useFunnelReady = (): boolean => {
    const { isReady } = useUnifiedFunnel();
    return isReady;
};

/**
 * Hook para obter permissões do funil
 */
export const useFunnelPermissions = () => {
    const { canRead, canEdit, canDelete, isOwner } = useUnifiedFunnel();
    return { canRead, canEdit, canDelete, isOwner };
};

/**
 * Hook para ações do funil
 */
export const useFunnelActions = () => {
    const { retry, reload, validateFunnel } = useUnifiedFunnel();
    return { retry, reload, validateFunnel };
};

export default UnifiedFunnelContext;
