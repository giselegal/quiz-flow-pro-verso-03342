/**
 * SuperUnifiedProvider Stub - Legacy compatibility
 */
import React, { ReactNode, createContext, useContext } from 'react';

interface SuperUnifiedContextType {
    data: any;
    loading: boolean;
    state: any;
    setTheme: (theme: string) => void;
    setCurrentStep: (step: number) => void;
    setSelectedBlock: (block: any) => void;
    saveFunnel: () => Promise<void>;
}

const SuperUnifiedContext = createContext<SuperUnifiedContextType | null>(null);

export function SuperUnifiedProvider({ children }: { children: ReactNode }) {
    const value: SuperUnifiedContextType = {
        data: null,
        loading: false,
        state: {},
        setTheme: () => {},
        setCurrentStep: () => {},
        setSelectedBlock: () => {},
        saveFunnel: async () => {}
    };

    return (
        <SuperUnifiedContext.Provider value={value}>
            {children}
        </SuperUnifiedContext.Provider>
    );
}

export function useSuperUnified() {
    const context = useContext(SuperUnifiedContext);
    if (!context) {
        return { 
            data: null, 
            loading: false,
            state: {},
            setTheme: () => {},
            setCurrentStep: () => {},
            setSelectedBlock: () => {},
            saveFunnel: async () => {}
        };
    }
    return context;
}

export function useUnifiedAuth() {
    return { 
        user: null, 
        loading: false, 
        isLoading: false,
        signIn: async () => {}, 
        signOut: async () => {},
        login: async () => {},
        signup: async () => {},
        logout: async () => {}
    };
}

export function useAuth() {
    return useUnifiedAuth();
}

export default SuperUnifiedProvider;
