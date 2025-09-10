/**
 * 🎯 CONTEXTO UNIFICADO DE FUNIL
 * 
 * Contexto centralizado para gerenciar estado do funil:
 * - Estado único e consistente
 * - Validação automática
 * - Permissões integradas
 * - Loading states centralizados
 */

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
