/**
 * 🎯 UNIFIED CRUD PROVIDER
 * 
 * Provider único que consolida TODOS os providers CRUD:
 * - FunnelsProvider
 * - PureBuilderProvider  
 * - UnifiedFunnelProvider
 * - Integração com FunnelUnifiedService
 * - Cache inteligente e sincronização
 */

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { funnelUnifiedService, UnifiedFunnelData } from '@/services/FunnelUnifiedService';
import { enhancedFunnelService } from '@/services/EnhancedFunnelService';
import { normalizeFunnelId } from '@/utils/funnelNormalizer';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface UnifiedCRUDContextType {
    // Estado principal
    currentFunnel: UnifiedFunnelData | null;
    funnels: UnifiedFunnelData[];
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Operações CRUD
    createFunnel: (name: string, options?: any) => Promise<UnifiedFunnelData>;
    loadFunnel: (id: string) => Promise<void>;
    saveFunnel: (funnel?: UnifiedFunnelData) => Promise<void>;
    duplicateFunnel: (id: string, newName?: string) => Promise<UnifiedFunnelData>;
    deleteFunnel: (id: string) => Promise<boolean>;
    refreshFunnels: () => Promise<void>;

    // Estado UI
    clearError: () => void;
    setCurrentFunnel: (funnel: UnifiedFunnelData | null) => void;

    // Compatibilidade com providers existentes
    legacy: {
        funnelsProvider: any;
        pureBuilderProvider: any;
        unifiedFunnelProvider: any;
    };
}

// ============================================================================
// CONTEXT
// ============================================================================

const UnifiedCRUDContext = createContext<UnifiedCRUDContextType | null>(null);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface UnifiedCRUDProviderProps {
    children: React.ReactNode;
    funnelId?: string;
    autoLoad?: boolean;
    debug?: boolean;
}

export const UnifiedCRUDProvider: React.FC<UnifiedCRUDProviderProps> = ({
    children,
    funnelId,
    autoLoad = true,
    debug = false
}) => {
    // ========================================================================
    // STATE
    // ========================================================================

    const [currentFunnel, setCurrentFunnel] = useState<UnifiedFunnelData | null>(null);
    const [funnels, setFunnels] = useState<UnifiedFunnelData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ========================================================================
    // CRUD OPERATIONS
    // ========================================================================

    const createFunnel = useCallback(async (name: string, options: any = {}): Promise<UnifiedFunnelData> => {
        setIsLoading(true);
        setError(null);

        try {
            if (debug) console.log('🎯 UnifiedCRUDProvider: Creating funnel', name);

            const newFunnel = await funnelUnifiedService.createFunnel({
                name,
                description: options.description || '',
                category: options.category || 'outros',
                context: options.context,
                templateId: options.templateId,
                ...options
            });

            // Atualizar listas e estado
            setCurrentFunnel(newFunnel);
            setFunnels(prev => [newFunnel, ...prev]);

            if (debug) console.log('✅ Funnel created:', newFunnel.id);
            return newFunnel;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao criar funil';
            setError(errorMessage);
            if (debug) console.error('❌ Error creating funnel:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [debug]);

    const loadFunnel = useCallback(async (id: string): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            if (debug) console.log('📂 UnifiedCRUDProvider: Loading funnel', id);

            // ✅ NORMALIZAR ID ANTES DE BUSCAR
            const normalized = normalizeFunnelId(id);
            const searchId = normalized.baseId;
            
            console.log('🔍 Normalizando funnelId:', { original: id, normalized: searchId });

            const funnel = await enhancedFunnelService.getFunnelWithFallback(searchId);

            if (!funnel) {
                console.warn(`⚠️ Funil não encontrado com ID normalizado: ${searchId} (original: ${id})`);
            const fallbackFunnel = await enhancedFunnelService.createFallbackFunnel(id);
            if (!fallbackFunnel) {
                throw new Error(`Funil não encontrado: ${id}`);
            }
            setCurrentFunnel(fallbackFunnel);
            
            // Atualizar lista se não estiver presente
            setFunnels(prev => {
                const exists = prev.find(f => f.id === fallbackFunnel.id);
                if (!exists) {
                    return [fallbackFunnel, ...prev];
                }
                return prev;
            });
            }

            if (funnel) {
                setCurrentFunnel(funnel);

                // Atualizar lista se não estiver presente
                setFunnels(prev => {
                    const exists = prev.find(f => f.id === funnel.id);
                    if (!exists) {
                        return [funnel, ...prev];
                    }
                    return prev.map(f => f.id === funnel.id ? funnel : f);
                });

                if (debug) console.log('✅ Funnel loaded:', funnel.id);
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar funil';
            setError(errorMessage);
            if (debug) console.error('❌ Error loading funnel:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [debug]);

    const saveFunnel = useCallback(async (funnel?: UnifiedFunnelData): Promise<void> => {
        const targetFunnel = funnel || currentFunnel;

        if (!targetFunnel) {
            throw new Error('Nenhum funil para salvar');
        }

        setIsSaving(true);
        setError(null);

        try {
            if (debug) console.log('💾 UnifiedCRUDProvider: Saving funnel', targetFunnel.id);

            const updatedFunnel = await funnelUnifiedService.updateFunnel(
                targetFunnel.id,
                {
                    name: targetFunnel.name,
                    description: targetFunnel.description,
                    settings: targetFunnel.settings,
                    pages: targetFunnel.pages
                }
            );

            // Atualizar estado
            setCurrentFunnel(updatedFunnel);
            setFunnels(prev => prev.map(f => f.id === updatedFunnel.id ? updatedFunnel : f));

            if (debug) console.log('✅ Funnel saved:', updatedFunnel.id);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar funil';
            setError(errorMessage);
            if (debug) console.error('❌ Error saving funnel:', err);
            throw err;
        } finally {
            setIsSaving(false);
        }
    }, [currentFunnel, debug]);

    const duplicateFunnel = useCallback(async (id: string, newName?: string): Promise<UnifiedFunnelData> => {
        setIsLoading(true);
        setError(null);

        try {
            if (debug) console.log('📋 UnifiedCRUDProvider: Duplicating funnel', id);

            const duplicatedFunnel = await funnelUnifiedService.duplicateFunnel(id, newName);

            // Atualizar listas
            setFunnels(prev => [duplicatedFunnel, ...prev]);
            setCurrentFunnel(duplicatedFunnel);

            if (debug) console.log('✅ Funnel duplicated:', duplicatedFunnel.id);
            return duplicatedFunnel;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao duplicar funil';
            setError(errorMessage);
            if (debug) console.error('❌ Error duplicating funnel:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [debug]);

    const deleteFunnel = useCallback(async (id: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            if (debug) console.log('🗑️ UnifiedCRUDProvider: Deleting funnel', id);

            const success = await funnelUnifiedService.deleteFunnel(id);

            if (success) {
                // Remover da lista e limpar current se necessário
                setFunnels(prev => prev.filter(f => f.id !== id));
                if (currentFunnel?.id === id) {
                    setCurrentFunnel(null);
                }
            }

            if (debug) console.log(success ? '✅ Funnel deleted' : '❌ Failed to delete funnel');
            return success;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar funil';
            setError(errorMessage);
            if (debug) console.error('❌ Error deleting funnel:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [currentFunnel, debug]);

    const refreshFunnels = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            if (debug) console.log('🔄 UnifiedCRUDProvider: Refreshing funnels');

            const funnelList = await funnelUnifiedService.listFunnels({
                includeUnpublished: true,
                limit: 50
            });

            setFunnels(funnelList);

            if (debug) console.log(`✅ ${funnelList.length} funnels loaded`);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar lista de funis';
            setError(errorMessage);
            if (debug) console.error('❌ Error refreshing funnels:', err);
        } finally {
            setIsLoading(false);
        }
    }, [debug]);

    // ========================================================================
    // UTILITY FUNCTIONS
    // ========================================================================

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // ========================================================================
    // INITIALIZATION
    // ========================================================================

    // Auto-load funnel se funnelId fornecido
    useEffect(() => {
        if (autoLoad && funnelId && !currentFunnel) {
            loadFunnel(funnelId).catch(console.error);
        }
    }, [autoLoad, funnelId, currentFunnel, loadFunnel]);

    // Carregar lista inicial
    useEffect(() => {
        if (autoLoad && funnels.length === 0) {
            refreshFunnels().catch(console.error);
        }
    }, [autoLoad, funnels.length, refreshFunnels]);

    // ========================================================================
    // CONTEXT VALUE
    // ========================================================================

    const contextValue: UnifiedCRUDContextType = {
        // Estado
        currentFunnel,
        funnels,
        isLoading,
        isSaving,
        error,

        // Operações CRUD
        createFunnel,
        loadFunnel,
        saveFunnel,
        duplicateFunnel,
        deleteFunnel,
        refreshFunnels,

        // Utilities
        clearError,
        setCurrentFunnel,

        // Compatibilidade com providers legados (implementar se necessário)
        legacy: {
            funnelsProvider: null,
            pureBuilderProvider: null,
            unifiedFunnelProvider: null
        }
    };

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <UnifiedCRUDContext.Provider value={contextValue}>
            {children}
        </UnifiedCRUDContext.Provider>
    );
};

// ============================================================================
// HOOK
// ============================================================================

export const useUnifiedCRUD = (): UnifiedCRUDContextType => {
    const context = useContext(UnifiedCRUDContext);

    if (!context) {
        throw new Error('useUnifiedCRUD deve ser usado dentro de um UnifiedCRUDProvider');
    }

    return context;
};

// ============================================================================
// UTILITIES
// ============================================================================

// Hook para compatibilidade com códigos legados
export const useLegacyFunnelsProvider = () => {
    const crudContext = useUnifiedCRUD();

    return {
        funnels: crudContext.funnels,
        currentFunnel: crudContext.currentFunnel,
        isLoading: crudContext.isLoading,
        error: crudContext.error,

        // Métodos mapeados para interface legacy
        createFunnel: crudContext.createFunnel,
        updateFunnel: crudContext.saveFunnel,
        deleteFunnel: crudContext.deleteFunnel,
        loadFunnel: crudContext.loadFunnel
    };
};

export default UnifiedCRUDProvider;