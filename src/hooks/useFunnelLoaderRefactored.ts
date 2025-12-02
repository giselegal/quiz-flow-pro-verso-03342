
/**
 * 🔄 HOOK DE CARREGAMENTO E VALIDAÇÃO DE FUNIL - REFATORADO
 * 
 * Hook que usa FunnelService Canonical para:
 * - Gerenciar estado de carregamento do funil
 * - Cache automático integrado
 * - Validação e permissões
 * - Event system para sincronização
 * - Deep clone automático
 * - Error handling robusto
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { funnelService } from '@/services/funnel/FunnelServiceLegacyAdapter';
import type { UnifiedFunnelData } from '@/services/canonical/types';
import { adaptMetadataToUnified } from '@/services/canonical/FunnelAdapter';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { appLogger } from '@/lib/utils/appLogger';

export interface FunnelLoadingState {
    // Estados de carregamento
    isLoading: boolean;
    isValidating: boolean;
    isError: boolean;
    isReady: boolean;

    // Dados do funil
    funnelId: string | null;
    funnel: UnifiedFunnelData | null;

    // Permissões
    canRead: boolean;
    canEdit: boolean;
    canDelete: boolean;
    isOwner: boolean;

    // Controle de erro
    error: string | null;
    errorType: string | null;
    suggestions: string[];

    // Ações CRUD integradas
    createFunnel: (name: string, options?: any) => Promise<UnifiedFunnelData>;
    updateFunnel: (updates: any) => Promise<UnifiedFunnelData>;
    duplicateFunnel: (newName?: string) => Promise<UnifiedFunnelData>;
    deleteFunnel: () => Promise<boolean>;

    // Ações de controle
    retry: () => void;
    reload: () => void;
    clearError: () => void;
    validateFunnel: (id: string, userId?: string) => Promise<void>;
}

export interface UseFunnelLoaderOptions {
    context?: FunnelContext;
    autoLoad?: boolean;
    enableEvents?: boolean;
    userId?: string;
}

export function useFunnelLoader(
    initialFunnelId?: string,
    options: UseFunnelLoaderOptions = {},
): FunnelLoadingState {

    const {
        context = FunnelContext.EDITOR,
        autoLoad = true,
        enableEvents = true,
        userId,
    } = options;

    // Estados locais
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [isError, setIsError] = useState(false);
    const [funnelId, setFunnelId] = useState<string | null>(initialFunnelId || null);
    const [funnel, setFunnel] = useState<UnifiedFunnelData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [errorType, setErrorType] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [permissions, setPermissions] = useState({
        canRead: false,
        canEdit: false,
        canDelete: false,
        isOwner: false,
    });

    // Refs para evitar re-renders desnecessários
    const currentFunnelIdRef = useRef<string | null>(null);
    const eventListenersRef = useRef<(() => void)[]>([]);

    // ========================================================================
    // FUNÇÕES AUXILIARES
    // ========================================================================

    const clearError = useCallback(() => {
        setIsError(false);
        setError(null);
        setErrorType(null);
        setSuggestions([]);
    }, []);

    const setErrorState = useCallback((errorMessage: string, type: string = 'UNKNOWN', suggestions: string[] = []) => {
        setIsError(true);
        setError(errorMessage);
        setErrorType(type);
        setSuggestions(suggestions);
        setIsLoading(false);
        setIsValidating(false);
    }, []);

    // ========================================================================
    // CARREGAMENTO DE FUNIL
    // ========================================================================

    const loadFunnel = useCallback(async (id: string) => {
        if (currentFunnelIdRef.current === id && funnel) {
            appLogger.info('📄 Funil já carregado, usando cache');
            return;
        }

        setIsLoading(true);
        clearError();

        try {
            appLogger.info('📖 useFunnelLoader: Carregando funil', { data: [id] });

            // Usar serviço unificado (com cache automático)
            const loadedFunnelMeta = await funnelService.getFunnel(id);
            const loadedFunnel = loadedFunnelMeta ? adaptMetadataToUnified(loadedFunnelMeta) : null;

            if (loadedFunnel) {
                setFunnel(loadedFunnel);
                setFunnelId(id);
                currentFunnelIdRef.current = id;

                // Verificar permissões
                const perms = await funnelService.checkPermissions(id);
                setPermissions(perms);

                appLogger.info('✅ Funil carregado:', { data: [loadedFunnel] });
            } else {
                setErrorState(
                    'Funil não encontrado',
                    'NOT_FOUND',
                    ['Verifique se o ID está correto', 'Tente recarregar a página', 'Selecione outro funil'],
                );
                setFunnel(null);
                setFunnelId(null);
                currentFunnelIdRef.current = null;
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            appLogger.error('❌ Erro ao carregar funil:', { data: [errorMessage] });

            setErrorState(
                errorMessage,
                'LOAD_ERROR',
                ['Verifique sua conexão', 'Tente novamente', 'Contate o suporte'],
            );
            setFunnel(null);
            setFunnelId(null);
            currentFunnelIdRef.current = null;
        } finally {
            setIsLoading(false);
        }
    }, [userId, clearError, funnel]);

    // ========================================================================
    // VALIDAÇÃO
    // ========================================================================

    const validateFunnel = useCallback(async (id: string, userIdParam?: string) => {
        setIsValidating(true);
        clearError();

        try {
            appLogger.info('🔍 useFunnelLoader: Validando funil', { data: [id] });

            const perms = await funnelService.checkPermissions(id);
            setPermissions(perms);

            if (!perms.canRead) {
                setErrorState(
                    'Sem permissão para acessar este funil',
                    'NO_PERMISSION',
                    ['Verifique se você está logado', 'Contate o proprietário', 'Selecione outro funil'],
                );
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro na validação';
            appLogger.error('❌ Erro na validação:', { data: [errorMessage] });
            setErrorState(errorMessage, 'VALIDATION_ERROR');
        } finally {
            setIsValidating(false);
        }
    }, [userId, clearError]);

    // ========================================================================
    // AÇÕES CRUD
    // ========================================================================

    const createFunnel = useCallback(async (name: string, createOptions: any = {}): Promise<UnifiedFunnelData> => {
        setIsLoading(true);
        clearError();

        try {
            appLogger.info('🎯 useFunnelLoader: Criando funil', { data: [name] });

            const newFunnelMeta = await funnelService.createFunnel({
                name,
                context,
                userId,
                ...createOptions,
            } as any);

            if (!newFunnelMeta) {
                throw new Error('Failed to create funnel');
            }

            const newFunnel = adaptMetadataToUnified(newFunnelMeta);

            // Atualizar estado local
            setFunnel(newFunnel);
            setFunnelId(newFunnel.id);
            currentFunnelIdRef.current = newFunnel.id;

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
            setErrorState(errorMessage, 'CREATE_ERROR');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [context, userId, clearError]);

    const updateFunnel = useCallback(async (updates: any): Promise<UnifiedFunnelData> => {
        if (!funnelId || !funnel) {
            throw new Error('Nenhum funil carregado para atualizar');
        }

        setIsLoading(true);
        clearError();

        try {
            appLogger.info('✏️ useFunnelLoader: Atualizando funil', { data: [funnelId] });

            const updatedFunnelMeta = await funnelService.updateFunnel(funnelId, updates);
            const updatedFunnel = updatedFunnelMeta ? adaptMetadataToUnified(updatedFunnelMeta) : funnel!;
            setFunnel(updatedFunnel);

            appLogger.info('✅ Funil atualizado:', { data: [updatedFunnel] });
            return updatedFunnel;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar funil';
            appLogger.error('❌ Erro ao atualizar funil:', { data: [errorMessage] });
            setErrorState(errorMessage, 'UPDATE_ERROR');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [funnelId, funnel, userId, clearError]);

    const duplicateFunnel = useCallback(async (newName?: string): Promise<UnifiedFunnelData> => {
        if (!funnelId) {
            throw new Error('Nenhum funil carregado para duplicar');
        }

        const sourceFunnelId = funnelId; // Captura não-null value
        const targetName = newName || `copy-of-${sourceFunnelId}`;
        setIsLoading(true);
        clearError();

        try {
            appLogger.info('🔄 useFunnelLoader: Duplicando funil', { data: [sourceFunnelId] });

            const duplicatedFunnelMeta = await funnelService.duplicateFunnel(sourceFunnelId, targetName);
            const duplicatedFunnelMeta2 = (duplicatedFunnelMeta as unknown as import('@/services/canonical/FunnelService').FunnelMetadata);
            const duplicatedFunnel = adaptMetadataToUnified(duplicatedFunnelMeta2);

            appLogger.info('✅ Funil duplicado:', { data: [duplicatedFunnel] });
            return duplicatedFunnel;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao duplicar funil';
            appLogger.error('❌ Erro ao duplicar funil:', { data: [errorMessage] });
            setErrorState(errorMessage, 'DUPLICATE_ERROR');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [funnelId, userId, clearError]);

    const deleteFunnel = useCallback(async (): Promise<boolean> => {
        if (!funnelId) {
            throw new Error('Nenhum funil carregado para deletar');
        }

        setIsLoading(true);
        clearError();

        try {
            appLogger.info('🗑️ useFunnelLoader: Deletando funil', { data: [funnelId] });

            const success = await funnelService.deleteFunnel(funnelId);

            if (success) {
                setFunnel(null);
                setFunnelId(null);
                currentFunnelIdRef.current = null;
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
            setErrorState(errorMessage, 'DELETE_ERROR');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [funnelId, userId, clearError]);

    // ========================================================================
    // AÇÕES DE CONTROLE
    // ========================================================================

    const retry = useCallback(() => {
        if (funnelId) {
            loadFunnel(funnelId);
        }
    }, [funnelId, loadFunnel]);

    const reload = useCallback(() => {
        if (funnelId) {
            // Limpar cache antes de recarregar
            funnelService.clearCache();
            loadFunnel(funnelId);
        }
    }, [funnelId, loadFunnel]);

    // ========================================================================
    // EFFECTS
    // ========================================================================

    // Auto-load quando funnelId mudar
    useEffect(() => {
        if (autoLoad && initialFunnelId && initialFunnelId !== currentFunnelIdRef.current) {
            loadFunnel(initialFunnelId);
        }
    }, [initialFunnelId, autoLoad, loadFunnel]);

    // Setup de event listeners para sincronização
    useEffect(() => {
        if (!enableEvents) return;

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
                setFunnelId(null);
                currentFunnelIdRef.current = null;
                setErrorState('Funil foi deletado', 'DELETED_EXTERNALLY');
            }
        };

        // Registrar listeners
        funnelService.on('updated', handleFunnelUpdated);
        funnelService.on('deleted', handleFunnelDeleted);

        // Armazenar cleanup functions
        const cleanupFunctions = [
            () => funnelService.off('updated', handleFunnelUpdated),
            () => funnelService.off('deleted', handleFunnelDeleted),
        ];
        eventListenersRef.current = cleanupFunctions;

        // Cleanup
        return () => {
            cleanupFunctions.forEach(cleanup => cleanup());
        };
    }, [funnelId, enableEvents, loadFunnel]);

    // Cleanup ao desmontar
    useEffect(() => {
        return () => {
            eventListenersRef.current.forEach(cleanup => cleanup());
        };
    }, []);

    // ========================================================================
    // RETURN STATE
    // ========================================================================

    return {
        // Estados de carregamento
        isLoading,
        isValidating,
        isError,
        isReady: !isLoading && !isError && !!funnel,

        // Dados do funil
        funnelId,
        funnel,

        // Permissões
        canRead: permissions.canRead,
        canEdit: permissions.canEdit,
        canDelete: permissions.canDelete,
        isOwner: permissions.isOwner,

        // Controle de erro
        error,
        errorType,
        suggestions,

        // Ações CRUD integradas
        createFunnel,
        updateFunnel,
        duplicateFunnel,
        deleteFunnel,

        // Ações de controle
        retry,
        reload,
        clearError,
        validateFunnel,
    };
}

// ============================================================================
// HOOK CONTEXT WRAPPER (LEGACY SUPPORT)
// ============================================================================

/**
 * Hook que mantém compatibilidade com useFunnelContext mas usa a nova arquitetura
 */
export function useFunnelContext(funnelId?: string, userId?: string) {
    return useFunnelLoader(funnelId, {
        userId,
        autoLoad: true,
        enableEvents: true,
        context: FunnelContext.EDITOR,
    });
}

export default useFunnelLoader;
