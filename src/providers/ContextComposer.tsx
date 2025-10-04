/**
 * 🎭 CONTEXT COMPOSER
 * 
 * Sistema avançado para composição dinâmica de provedores de contexto React.
 * Permite criação, gerenciamento e injeção de múltiplos contextos de forma otimizada.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode, ComponentType } from 'react';

// 🎯 Tipos e interfaces
interface ContextSlice {
    name: string;
    value: any;
    subscribers: Set<(value: any) => void>;
}

interface ContextStore {
    slices: Map<string, ContextSlice>;
    getSlice: (sliceName: string) => any;
    updateSlice: (sliceName: string, value: any) => void;
    subscribe: (sliceName: string, callback: (value: any) => void) => () => void;
}

interface PerformanceMetrics {
    renderCount: number;
    lastRenderTime: number;
    subscriptionCount: number;
    sliceCount: number;
}

interface ComposedContextValue {
    store: ContextStore;
    performance: PerformanceMetrics;
    getSlice: (sliceName: string) => any;
    dispatch: (sliceName: string, action: any) => void;
    subscribe: (sliceName: string, callback: (value: any) => void) => () => void;
}

// 🏪 Context Store Implementation
class ContextStoreImpl implements ContextStore {
    slices = new Map<string, ContextSlice>();

    getSlice(sliceName: string): any {
        const slice = this.slices.get(sliceName);
        return slice ? slice.value : undefined;
    }

    updateSlice(sliceName: string, value: any): void {
        let slice = this.slices.get(sliceName);

        if (!slice) {
            slice = {
                name: sliceName,
                value,
                subscribers: new Set()
            };
            this.slices.set(sliceName, slice);
        } else {
            slice.value = value;
        }

        // Notify subscribers
        slice.subscribers.forEach(callback => {
            try {
                callback(value);
            } catch (error) {
                console.error(`Error in subscriber for slice ${sliceName}:`, error);
            }
        });
    }

    subscribe(sliceName: string, callback: (value: any) => void): () => void {
        let slice = this.slices.get(sliceName);

        if (!slice) {
            slice = {
                name: sliceName,
                value: undefined,
                subscribers: new Set()
            };
            this.slices.set(sliceName, slice);
        }

        slice.subscribers.add(callback);

        // Return unsubscribe function
        return () => {
            slice?.subscribers.delete(callback);
        };
    }
}

// 🌍 Main Context
const ComposedContext = createContext<ComposedContextValue | null>(null);

// 🎭 Props do ContextComposer
interface ContextComposerProps {
    children: ReactNode;
    initialSlices?: Record<string, any>;
    debugMode?: boolean;
    performanceTracking?: boolean;
}

// 🚀 ContextComposer Component
export const ContextComposer: React.FC<ContextComposerProps> = ({
    children,
    initialSlices = {},
    debugMode = false,
    performanceTracking = false
}) => {
    // 🏪 Store instance
    const [store] = useState(() => {
        const storeInstance = new ContextStoreImpl();

        // Initialize with provided slices
        Object.entries(initialSlices).forEach(([name, value]) => {
            storeInstance.updateSlice(name, value);
        });

        return storeInstance;
    });

    // 📊 Performance metrics
    const [performance, setPerformance] = useState<PerformanceMetrics>(() => ({
        renderCount: 0,
        lastRenderTime: Date.now(),
        subscriptionCount: 0,
        sliceCount: Object.keys(initialSlices).length
    }));

    // 🎯 Context value
    const contextValue = useMemo<ComposedContextValue>(() => ({
        store,
        performance,

        getSlice: (sliceName: string) => {
            return store.getSlice(sliceName);
        },

        dispatch: (sliceName: string, action: any) => {
            store.updateSlice(sliceName, action);
        },

        subscribe: (sliceName: string, callback: (value: any) => void) => {
            return store.subscribe(sliceName, callback);
        }
    }), [store, performance]);

    // 📊 Performance tracking
    useEffect(() => {
        if (performanceTracking) {
            setPerformance(prev => ({
                ...prev,
                renderCount: prev.renderCount + 1,
                lastRenderTime: Date.now(),
                subscriptionCount: Array.from(store.slices.values())
                    .reduce((total, slice) => total + slice.subscribers.size, 0),
                sliceCount: store.slices.size
            }));
        }
    }, [store, performanceTracking]);

    // 🐛 Debug logging
    useEffect(() => {
        if (debugMode) {
            console.log('🧩 ContextComposer stats:', contextValue.performance);
        }
    }, [debugMode, contextValue.performance]);

    return (
        <ComposedContext.Provider value={contextValue}>
            {children}
        </ComposedContext.Provider>
    );
};

// 🎣 Custom hooks
export function useContextSlice<T = any>(sliceName: string): T {
    const context = useContext(ComposedContext);


    if (!context) {
        throw new Error('useContextSlice must be used within ContextComposer');
    }

    const [sliceValue, setSliceValue] = useState<T>(context.getSlice(sliceName));

    useEffect(() => {
        const unsubscribe = context.subscribe(sliceName, (newValue: T) => {
            setSliceValue(newValue);
        });

        return unsubscribe;
    }, [context, sliceName]);

    return sliceValue;
}

export const useContextDispatch = () => {
    const context = useContext(ComposedContext);

    if (!context) {
        throw new Error('useContextDispatch must be used within ContextComposer');
    }

    return useCallback((sliceName: string, action: any) => {
        context.dispatch(sliceName, action);
    }, [context]);
};

export const useContextPerformance = () => {
    const context = useContext(ComposedContext);

    if (!context) {
        throw new Error('useContextPerformance must be used within ContextComposer');
    }

    return context.performance;
};

// 🔧 Utility functions
export const composeProviders = (providers: ComponentType<any>[]) => {
    return providers.reduce(
        (AccumulatedProviders, CurrentProvider) =>
            ({ children }: { children: ReactNode }) => (
                <AccumulatedProviders>
                    <CurrentProvider>
                        {children}
                    </CurrentProvider>
                </AccumulatedProviders>
            ),
        ({ children }: { children: ReactNode }) => <>{children}</>
    );
};

export default ContextComposer;
