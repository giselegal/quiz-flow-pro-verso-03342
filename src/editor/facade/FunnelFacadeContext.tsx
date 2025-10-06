import { createContext, useContext } from 'react';
import type { IFunnelEditingFacade } from './FunnelEditingFacade';

export const FunnelFacadeContext = createContext<IFunnelEditingFacade | null>(null);

export const useFunnelFacade = (): IFunnelEditingFacade => {
    const ctx = useContext(FunnelFacadeContext);
    if (!ctx) {
        throw new Error('useFunnelFacade deve ser usado dentro de um FunnelFacadeContext.Provider');
    }
    return ctx;
};

export const useOptionalFunnelFacade = (): IFunnelEditingFacade | null => {
    return useContext(FunnelFacadeContext);
};
