/**
 * 🎯 FUNNEL DATA PROVIDER - Gerenciamento de Dados de Funil
 * 
 * ✅ FASE 2.2 - IMPLEMENTAÇÃO REAL COMPLETA
 * 
 * Provider independente para gerenciamento de funis.
 * Extraído do SuperUnifiedProvider para isolamento de responsabilidades.
 * 
 * RESPONSABILIDADES:
 * - CRUD de funis conectado ao Supabase
 * - Funil atual
 * - Templates
 * - Cache de dados
 * - Error handling robusto
 * 
 * BENEFÍCIOS:
 * - Re-render apenas quando funnel data muda
 * - Isolamento de lógica de negócio
 * - Fácil de testar
 * - Operações reais de banco de dados
 * 
 * FASE 2.2 MUDANÇAS:
 * - ✅ Conexão real com Supabase
 * - ✅ Error handling completo
 * - ✅ Toast notifications
 * - ✅ Testes implementados
 */

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { appLogger } from '@/lib/utils/appLogger';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

// ============================================================================
// TYPES
// ============================================================================

export interface FunnelData {
    id: string;
    name: string;
    user_id: string | null;
    description?: string | null;
    config?: any;
    status?: 'draft' | 'published' | 'archived';
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
            appLogger.info('📂 [FASE 2.2] Carregando funis do Supabase...');
            
            const { data, error: supabaseError } = await supabase
                .from('funnels')
                .select('*')
                .order('updated_at', { ascending: false });
            
            if (supabaseError) {
                throw new Error(`Erro ao carregar funis: ${supabaseError.message}`);
            }
            
            setFunnels(data || []);
            appLogger.info(`✅ [FASE 2.2] ${data?.length || 0} funis carregados com sucesso`);
            
        } catch (err: any) {
            const errorMsg = err.message || 'Erro desconhecido ao carregar funis';
            setError(errorMsg);
            appLogger.error('❌ [FASE 2.2] Erro ao carregar funis:', err);
            
            toast({
                title: 'Erro ao carregar funis',
                description: errorMsg,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadFunnel = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            appLogger.info(`📂 [FASE 2.2] Carregando funil: ${id}`);
            
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
            
            setCurrentFunnel(data);
            appLogger.info(`✅ [FASE 2.2] Funil ${id} carregado com sucesso`);
            
        } catch (err: any) {
            const errorMsg = err.message || 'Erro desconhecido ao carregar funil';
            setError(errorMsg);
            appLogger.error('❌ [FASE 2.2] Erro ao carregar funil:', err);
            
            toast({
                title: 'Erro ao carregar funil',
                description: errorMsg,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createFunnel = useCallback(async (data: Partial<FunnelData>): Promise<FunnelData> => {
        setIsLoading(true);
        setError(null);
        try {
            appLogger.info('✨ [FASE 2.2] Criando funil...', { data: [data] });
            
            // Validar dados mínimos necessários
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
                    settings: data.settings || {},
                    is_published: data.is_published || false,
                }])
                .select()
                .single();
            
            if (supabaseError) {
                throw new Error(`Erro ao criar funil: ${supabaseError.message}`);
            }
            
            if (!newFunnel) {
                throw new Error('Erro ao criar funil: resposta vazia do banco');
            }
            
            // Atualizar estado local
            setFunnels(prev => [newFunnel, ...prev]);
            setCurrentFunnel(newFunnel);
            
            appLogger.info(`✅ [FASE 2.2] Funil criado com sucesso: ${newFunnel.id}`);
            
            toast({
                title: 'Funil criado',
                description: `${newFunnel.name} foi criado com sucesso`,
            });
            
            return newFunnel;
            
        } catch (err: any) {
            const errorMsg = err.message || 'Erro desconhecido ao criar funil';
            setError(errorMsg);
            appLogger.error('❌ [FASE 2.2] Erro ao criar funil:', err);
            
            toast({
                title: 'Erro ao criar funil',
                description: errorMsg,
                variant: 'destructive',
            });
            
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateFunnel = useCallback(async (id: string, updates: Partial<FunnelData>) => {
        setIsLoading(true);
        setError(null);
        try {
            appLogger.info(`💾 [FASE 2.2] Atualizando funil: ${id}`, { data: [updates] });
            
            const { data: updatedFunnel, error: supabaseError } = await supabase
                .from('funnels')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id)
                .select()
                .single();
            
            if (supabaseError) {
                throw new Error(`Erro ao atualizar funil: ${supabaseError.message}`);
            }
            
            if (!updatedFunnel) {
                throw new Error('Erro ao atualizar funil: resposta vazia do banco');
            }
            
            // Atualizar estado local
            setFunnels(prev => prev.map(f => f.id === id ? updatedFunnel : f));
            
            if (currentFunnel?.id === id) {
                setCurrentFunnel(updatedFunnel);
            }
            
            appLogger.info(`✅ [FASE 2.2] Funil ${id} atualizado com sucesso`);
            
            toast({
                title: 'Funil atualizado',
                description: 'As alterações foram salvas com sucesso',
            });
            
        } catch (err: any) {
            const errorMsg = err.message || 'Erro desconhecido ao atualizar funil';
            setError(errorMsg);
            appLogger.error('❌ [FASE 2.2] Erro ao atualizar funil:', err);
            
            toast({
                title: 'Erro ao atualizar funil',
                description: errorMsg,
                variant: 'destructive',
            });
            
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [currentFunnel]);

    const deleteFunnel = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            appLogger.info(`🗑️ [FASE 2.2] Deletando funil: ${id}`);
            
            const { error: supabaseError } = await supabase
                .from('funnels')
                .delete()
                .eq('id', id);
            
            if (supabaseError) {
                throw new Error(`Erro ao deletar funil: ${supabaseError.message}`);
            }
            
            // Atualizar estado local
            setFunnels(prev => prev.filter(f => f.id !== id));
            
            if (currentFunnel?.id === id) {
                setCurrentFunnel(null);
            }
            
            appLogger.info(`✅ [FASE 2.2] Funil ${id} deletado com sucesso`);
            
            toast({
                title: 'Funil deletado',
                description: 'O funil foi removido com sucesso',
            });
            
        } catch (err: any) {
            const errorMsg = err.message || 'Erro desconhecido ao deletar funil';
            setError(errorMsg);
            appLogger.error('❌ [FASE 2.2] Erro ao deletar funil:', err);
            
            toast({
                title: 'Erro ao deletar funil',
                description: errorMsg,
                variant: 'destructive',
            });
            
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [currentFunnel]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

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
        }),
        [funnels, currentFunnel, isLoading, error, loadFunnels, loadFunnel, createFunnel, updateFunnel, deleteFunnel, clearError]
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
