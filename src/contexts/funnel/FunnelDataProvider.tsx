/**
 * 🎯 FUNNEL DATA PROVIDER - Gerenciamento de Dados de Funil
 * 
 * Provider independente para gerenciamento de funis.
 */

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { appLogger } from '@/lib/utils/appLogger';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

// ============================================================================
// TYPES
// ============================================================================

type FunnelStatus = 'draft' | 'published' | 'archived';

export interface FunnelData {
    id: string;
    name: string;
    user_id: string | null;
    description?: string | null;
    config?: any;
    status?: FunnelStatus;
    settings?: any;
    version?: number;
    is_published?: boolean;
    pages?: any[];
    created_at?: string;
    updated_at?: string;
    quizSteps?: any[];
}

export interface FunnelContextValue {
    funnels: FunnelData[];
    currentFunnel: FunnelData | null;
    isLoading: boolean;
    error: string | null;
    loadFunnels: () => Promise<void>;
    loadFunnel: (id: string) => Promise<void>;
    createFunnel: (data: Partial<FunnelData>) => Promise<FunnelData>;
    updateFunnel: (id: string, updates: Partial<FunnelData>) => Promise<void>;
    deleteFunnel: (id: string) => Promise<void>;
    setCurrentFunnel: (funnel: FunnelData | null) => void;
    clearError: () => void;
    saveFunnel: () => Promise<void>;
    publishFunnel: (options?: any) => Promise<void>;
    updateFunnelStepBlocks: (stepIndex: number, blocks: any[]) => Promise<void>;
}

// Helper to map Supabase data to FunnelData
function mapToFunnelData(data: any): FunnelData {
    return {
        id: data.id,
        name: data.name,
        user_id: data.user_id,
        description: data.description,
        config: data.config,
        status: (data.status as FunnelStatus) || 'draft',
        created_at: data.created_at,
        updated_at: data.updated_at,
    };
}

// ============================================================================
// CONTEXT
// ============================================================================

const FunnelContext = createContext<FunnelContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

interface FunnelProviderProps {
    children: ReactNode;
}

export const FunnelDataProvider: React.FC<FunnelProviderProps> = ({ children }) => {
    const [funnels, setFunnels] = useState<FunnelData[]>([]);
    const [currentFunnel, setCurrentFunnel] = useState<FunnelData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadFunnels = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            appLogger.info('📂 Carregando funis do Supabase...');

            const { data, error: supabaseError } = await supabase
                .from('funnels')
                .select('*')
                .order('updated_at', { ascending: false });

            if (supabaseError) {
                throw new Error(`Erro ao carregar funis: ${supabaseError.message}`);
            }

            setFunnels((data || []).map(mapToFunnelData));
            appLogger.info(`✅ ${data?.length || 0} funis carregados`);

        } catch (err: any) {
            const errorMsg = err.message || 'Erro ao carregar funis';
            setError(errorMsg);
            appLogger.error('❌ Erro ao carregar funis:', err);
            toast({ title: 'Erro', description: errorMsg, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadFunnel = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            appLogger.info(`📂 Carregando funil: ${id}`);

            const { data, error: supabaseError } = await supabase
                .from('funnels')
                .select('*')
                .eq('id', id)
                .single();

            if (supabaseError) {
                throw new Error(`Erro ao carregar funil: ${supabaseError.message}`);
            }

            if (!data) {
                throw new Error(`Funil ${id} não encontrado`);
            }

            setCurrentFunnel(mapToFunnelData(data));
            appLogger.info(`✅ Funil ${id} carregado`);

        } catch (err: any) {
            const errorMsg = err.message || 'Erro ao carregar funil';
            setError(errorMsg);
            appLogger.error('❌ Erro ao carregar funil:', err);
            toast({ title: 'Erro', description: errorMsg, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createFunnel = useCallback(async (data: Partial<FunnelData>): Promise<FunnelData> => {
        setIsLoading(true);
        setError(null);
        try {
            appLogger.info('✨ Criando funil...', { data: [data] });

            if (!data.name) {
                throw new Error('Nome do funil é obrigatório');
            }

            const { data: newFunnel, error: supabaseError } = await supabase
                .from('funnels')
                .insert([{
                    name: data.name,
                    description: data.description || null,
                    status: data.status || 'draft',
                    config: data.config || {},
                    user_id: data.user_id || '',
                }])
                .select()
                .single();

            if (supabaseError) {
                throw new Error(`Erro ao criar funil: ${supabaseError.message}`);
            }

            if (!newFunnel) {
                throw new Error('Erro ao criar funil: resposta vazia');
            }

            const mappedFunnel = mapToFunnelData(newFunnel);
            setFunnels(prev => [mappedFunnel, ...prev]);
            setCurrentFunnel(mappedFunnel);

            appLogger.info(`✅ Funil criado: ${mappedFunnel.id}`);
            toast({ title: 'Funil criado', description: `${mappedFunnel.name} criado com sucesso` });

            return mappedFunnel;

        } catch (err: any) {
            const errorMsg = err.message || 'Erro ao criar funil';
            setError(errorMsg);
            appLogger.error('❌ Erro ao criar funil:', err);
            toast({ title: 'Erro', description: errorMsg, variant: 'destructive' });
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateFunnel = useCallback(async (id: string, updates: Partial<FunnelData>) => {
        setIsLoading(true);
        setError(null);
        try {
            appLogger.info(`💾 Atualizando funil: ${id}`);

            // Remove fields that don't exist in the database
            const { settings, version, is_published, pages, quizSteps, user_id, ...dbUpdates } = updates;

            const { data: updatedFunnel, error: supabaseError } = await supabase
                .from('funnels')
                .update({
                    ...dbUpdates,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id)
                .select()
                .single();

            if (supabaseError) {
                throw new Error(`Erro ao atualizar funil: ${supabaseError.message}`);
            }

            if (!updatedFunnel) {
                throw new Error('Erro ao atualizar funil: resposta vazia');
            }

            const mappedFunnel = mapToFunnelData(updatedFunnel);
            setFunnels(prev => prev.map(f => f.id === id ? mappedFunnel : f));

            if (currentFunnel?.id === id) {
                setCurrentFunnel(mappedFunnel);
            }

            appLogger.info(`✅ Funil ${id} atualizado`);
            toast({ title: 'Funil atualizado', description: 'Alterações salvas' });

        } catch (err: any) {
            const errorMsg = err.message || 'Erro ao atualizar funil';
            setError(errorMsg);
            appLogger.error('❌ Erro ao atualizar funil:', err);
            toast({ title: 'Erro', description: errorMsg, variant: 'destructive' });
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [currentFunnel]);

    const deleteFunnel = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            appLogger.info(`🗑️ Deletando funil: ${id}`);

            const { error: supabaseError } = await supabase
                .from('funnels')
                .delete()
                .eq('id', id);

            if (supabaseError) {
                throw new Error(`Erro ao deletar funil: ${supabaseError.message}`);
            }

            setFunnels(prev => prev.filter(f => f.id !== id));

            if (currentFunnel?.id === id) {
                setCurrentFunnel(null);
            }

            appLogger.info(`✅ Funil ${id} deletado`);
            toast({ title: 'Funil deletado', description: 'Funil removido com sucesso' });

        } catch (err: any) {
            const errorMsg = err.message || 'Erro ao deletar funil';
            setError(errorMsg);
            appLogger.error('❌ Erro ao deletar funil:', err);
            toast({ title: 'Erro', description: errorMsg, variant: 'destructive' });
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [currentFunnel]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const saveFunnel = useCallback(async () => {
        if (!currentFunnel) {
            throw new Error('Nenhum funil atual para salvar');
        }
        await updateFunnel(currentFunnel.id, currentFunnel);
    }, [currentFunnel, updateFunnel]);

    const publishFunnel = useCallback(async (options?: any) => {
        if (!currentFunnel) {
            throw new Error('Nenhum funil atual para publicar');
        }
        await updateFunnel(currentFunnel.id, {
            status: 'published',
            ...options,
        });
    }, [currentFunnel, updateFunnel]);

    const updateFunnelStepBlocks = useCallback(async (stepIndex: number, blocks: any[]) => {
        if (!currentFunnel) {
            throw new Error('Nenhum funil atual para atualizar');
        }
        const config = currentFunnel.config || {};
        const steps = config.steps || {};
        steps[stepIndex] = blocks;

        await updateFunnel(currentFunnel.id, {
            config: { ...config, steps },
        });
    }, [currentFunnel, updateFunnel]);

    const contextValue = useMemo<FunnelContextValue>(
        () => ({
            funnels,
            currentFunnel,
            isLoading,
            error,
            loadFunnels,
            loadFunnel,
            createFunnel,
            updateFunnel,
            deleteFunnel,
            setCurrentFunnel,
            clearError,
            saveFunnel,
            publishFunnel,
            updateFunnelStepBlocks,
        }),
        [funnels, currentFunnel, isLoading, error, loadFunnels, loadFunnel, createFunnel, updateFunnel, deleteFunnel, clearError, saveFunnel, publishFunnel, updateFunnelStepBlocks]
    );

    return (
        <FunnelContext.Provider value={contextValue}>
            {children}
        </FunnelContext.Provider>
    );
};

export const useFunnelData = (): FunnelContextValue => {
    const context = useContext(FunnelContext);

    if (!context) {
        throw new Error('useFunnelData deve ser usado dentro de um FunnelDataProvider');
    }

    return context;
};
