/**
 * Legacy Compatibility Wrapper (SIMPLIFIED)
 * 
 * Permite migração gradual mantendo compatibilidade básica.
 * Versão simplificada que funciona com a estrutura atual do UnifiedContextProvider.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { UnifiedContextProvider, useUnifiedContext, UnifiedContextValue } from './UnifiedContextProvider';

// ====================
// LEGACY CONTEXT BRIDGE
// ====================

interface SimplifiedLegacyEditorContext {
    // Estado básico
    state: {
        currentStep: number;
        stepBlocks: Record<string, any[]>;
        isDirty: boolean;
    };

    // Ações do editor
    blockActions: {
        addBlock: (type: string, properties?: any) => Promise<string>;
        updateBlock: (blockId: string, updates: any) => Promise<void>;
        deleteBlock: (blockId: string) => Promise<void>;
    };

    // Ações de persistência
    persistenceActions: {
        save: () => Promise<{ success: boolean; error?: string }>;
    };

    // Estado da UI básico
    uiState: {
        activePanel: string;
        sidebarOpen: boolean;
    };
}

// Context para bridge
const LegacyBridgeContext = createContext<{
    unifiedContext: UnifiedContextValue | null;
    enableWarnings: boolean;
}>({
    unifiedContext: null,
    enableWarnings: true,
});

// ====================
// COMPATIBILITY PROVIDER
// ====================

interface LegacyCompatibilityWrapperProps {
    children: ReactNode;
    enableWarnings?: boolean;
    initialContext?: any;
}

export const LegacyCompatibilityWrapper: React.FC<LegacyCompatibilityWrapperProps> = ({
    children,
    enableWarnings = true,
    initialContext,
}) => {
    return (
        <UnifiedContextProvider
            initialContext={initialContext}
            debugMode={enableWarnings}
        >
            <LegacyBridgeProvider enableWarnings={enableWarnings}>
                {children}
            </LegacyBridgeProvider>
        </UnifiedContextProvider>
    );
};

const LegacyBridgeProvider: React.FC<{ children: ReactNode; enableWarnings: boolean }> = ({
    children,
    enableWarnings,
}) => {
    const unifiedContext = useUnifiedContext();

    return (
        <LegacyBridgeContext.Provider value={{ unifiedContext, enableWarnings }}>
            {children}
        </LegacyBridgeContext.Provider>
    );
};

// ====================
// LEGACY HOOKS BRIDGE - REMOVED FOR CONSOLIDATION  
// ====================
// Note: Legacy hooks now use EditorProvider.useEditor directly
// Note: Legacy hooks now use EditorProvider.useEditor directly

// ====================
// MIGRATION UTILITIES
// ====================

/**
 * HOC para wrapping automático de componentes legacy
 */
export function withLegacyCompatibility<P extends object>(
    Component: React.ComponentType<P>,
    enableWarnings = true
) {
    const WrappedComponent: React.FC<P> = (props) => {
        return (
            <LegacyCompatibilityWrapper enableWarnings={enableWarnings}>
                <Component {...props} />
            </LegacyCompatibilityWrapper>
        );
    };

    WrappedComponent.displayName = `withLegacyCompatibility(${Component.displayName || Component.name})`;
    return WrappedComponent;
}

/**
 * Hook para verificar se está em contexto unificado
 */
export const useIsUnified = () => {
    const { unifiedContext } = useContext(LegacyBridgeContext);
    return !!unifiedContext;
};
