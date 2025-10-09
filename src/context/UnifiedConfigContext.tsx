import React, { createContext, useContext, useMemo, useState } from 'react';
import type { QuizFunnelSchema } from '@/types/quiz-schema';

export interface UnifiedConfigState {
    runtime?: QuizFunnelSchema['runtime'];
    results?: QuizFunnelSchema['results'];
    ui?: QuizFunnelSchema['ui'];
}

interface UnifiedConfigContextValue extends UnifiedConfigState {
    setUnifiedConfig: (patch: UnifiedConfigState) => void;
    resetUnifiedConfig: () => void;
}

const UnifiedConfigContext = createContext<UnifiedConfigContextValue | undefined>(undefined);

export const UnifiedConfigProvider: React.FC<{ initial?: UnifiedConfigState; children: React.ReactNode }> = ({ initial, children }) => {
    const [state, setState] = useState<UnifiedConfigState>(initial || {});
    const value = useMemo<UnifiedConfigContextValue>(() => ({
        ...state,
        setUnifiedConfig: (patch) => setState(prev => ({ ...prev, ...patch })),
        resetUnifiedConfig: () => setState({})
    }), [state]);
    return (
        <UnifiedConfigContext.Provider value={value}>{children}</UnifiedConfigContext.Provider>
    );
};

export function useUnifiedConfig(): UnifiedConfigContextValue {
    const ctx = useContext(UnifiedConfigContext);
    if (!ctx) throw new Error('useUnifiedConfig must be used within UnifiedConfigProvider');
    return ctx;
}
