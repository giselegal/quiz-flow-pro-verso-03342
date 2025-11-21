/**
 * 🎯 FUNNEL DATA PROVIDER - Gerenciamento de Dados de Funil
 * 
 * Provider independente para gerenciamento de funis.
 * Extraído do SuperUnifiedProvider para isolamento de responsabilidades.
 * 
 * RESPONSABILIDADES:
 * - CRUD de funis
 * - Funil atual
 * - Templates
 * - Cache de dados
 * 
 * BENEFÍCIOS:
 * - Re-render apenas quando funnel data muda
 * - Isolamento de lógica de negócio
 * - Fácil de testar
 */

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

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
            // Implementação será conectada ao service real
            appLogger.info('📂 Carregando funis...');
            // const data = await funnelService.list();
            // setFunnels(data);
        } catch (err: any) {
            setError(err.message);
            appLogger.error('❌ Erro ao carregar funis:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadFunnel = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            appLogger.info(`📂 Carregando funil: ${id}`);
            // const data = await funnelService.get(id);
            // setCurrentFunnel(data);
        } catch (err: any) {
            setError(err.message);
            appLogger.error('❌ Erro ao carregar funil:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createFunnel = useCallback(async (data: Partial<FunnelData>): Promise<FunnelData> => {
        setIsLoading(true);
        setError(null);
        try {
            appLogger.info('✨ Criando funil...');
            // const newFunnel = await funnelService.create(data);
            // setFunnels(prev => [newFunnel, ...prev]);
            // setCurrentFunnel(newFunnel);
            // return newFunnel;
            return {} as FunnelData; // Placeholder
        } catch (err: any) {
            setError(err.message);
            appLogger.error('❌ Erro ao criar funil:', err);
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
            // await funnelService.update(id, updates);
            setFunnels(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
            if (currentFunnel?.id === id) {
                setCurrentFunnel(prev => prev ? { ...prev, ...updates } : null);
            }
        } catch (err: any) {
            setError(err.message);
            appLogger.error('❌ Erro ao atualizar funil:', err);
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
            // await funnelService.delete(id);
            setFunnels(prev => prev.filter(f => f.id !== id));
            if (currentFunnel?.id === id) {
                setCurrentFunnel(null);
            }
        } catch (err: any) {
            setError(err.message);
            appLogger.error('❌ Erro ao deletar funil:', err);
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
