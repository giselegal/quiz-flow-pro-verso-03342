/**
 * 🧩 CONTEXT COMPOSITION SYSTEM - FASE 1
 * 
 * Sistema avançado de composição de contextos que elimina o "Provider Hell"
 * e otimiza performance através de técnicas modernas de React
 * 
 * ✅ Context splitting inteligente
 * ✅ Selective subscriptions 
 * ✅ Automatic memoization
 * ✅ Provider composition
 * ✅ Performance monitoring
 */

import React, { 
    createContext, 
    useContext, 
    useMemo, 
    useState, 
    useCallback, 
    ReactNode,
    useRef,
    useEffect
} from 'react';

// 🎯 CONTEXT COMPOSITION TYPES
interface ContextSlice<T> {
    name: string;
    initialValue: T;
    reducer?: (state: T, action: any) => T;
    actions?: Record<string, (...args: any[]) => any>;
    dependencies?: string[];
}

interface ComposedContextValue {
    slices: Record<string, any>;
    subscribe: (sliceName: string, callback: (value: any) => void) => () => void;
    dispatch: (sliceName: string, action: any) => void;
    getSlice: <T>(sliceName: string) => T;
    performance: {
        subscriptions: number;
        renders: number;
        lastUpdate: number;
    };
}

// 🎯 PERFORMANCE TRACKER
class ContextPerformanceTracker {
    private subscriptions = new Map<string, Set<Function>>();
    private renderCounts = new Map<string, number>();
    private lastUpdate = Date.now();

    subscribe(sliceName: string, callback: Function) {
        if (!this.subscriptions.has(sliceName)) {
            this.subscriptions.set(sliceName, new Set());
        }
        this.subscriptions.get(sliceName)!.add(callback);

        return () => {
            this.subscriptions.get(sliceName)?.delete(callback);
        };
    }

    notify(sliceName: string, value: any) {
        const callbacks = this.subscriptions.get(sliceName);
        if (callbacks) {
            callbacks.forEach(callback => callback(value));
        }
        this.lastUpdate = Date.now();
    }

    incrementRender(sliceName: string) {
        const current = this.renderCounts.get(sliceName) || 0;
        this.renderCounts.set(sliceName, current + 1);
    }

    getStats() {
        const totalSubscriptions = Array.from(this.subscriptions.values())
            .reduce((total, set) => total + set.size, 0);
        
        const totalRenders = Array.from(this.renderCounts.values())
            .reduce((total, count) => total + count, 0);

        return {
            subscriptions: totalSubscriptions,
            renders: totalRenders,
            lastUpdate: this.lastUpdate,
            sliceStats: Object.fromEntries(
                Array.from(this.renderCounts.entries()).map(([slice, renders]) => [
                    slice,
                    {
                        renders,
                        subscriptions: this.subscriptions.get(slice)?.size || 0
                    }
                ])
            )
        };
    }
}

// 🎯 CONTEXT STORE
class ContextStore {
    private slices = new Map<string, any>();
    private reducers = new Map<string, Function>();
    private tracker: ContextPerformanceTracker;
    private listeners = new Set<Function>();

    constructor() {
        this.tracker = new ContextPerformanceTracker();
    }

    registerSlice<T>(slice: ContextSlice<T>) {
        this.slices.set(slice.name, slice.initialValue);
        
        if (slice.reducer) {
            this.reducers.set(slice.name, slice.reducer);
        }
    }

    getSlice<T>(sliceName: string): T {
        return this.slices.get(sliceName);
    }

    updateSlice(sliceName: string, action: any) {
        const reducer = this.reducers.get(sliceName);
        
        if (reducer) {
            const currentState = this.slices.get(sliceName);
            const newState = reducer(currentState, action);
            this.slices.set(sliceName, newState);
        } else {
            // Direct state update
            this.slices.set(sliceName, action);
        }

        // Notify subscribers
        this.tracker.notify(sliceName, this.slices.get(sliceName));
        this.notifyListeners();
    }

    subscribe(sliceName: string, callback: (value: any) => void) {
        return this.tracker.subscribe(sliceName, callback);
    }

    onStoreChange(callback: Function) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener());
    }

    getPerformanceStats() {
        return this.tracker.getStats();
    }
}

// 🎯 COMPOSED CONTEXT
const ComposedContext = createContext<ComposedContextValue | null>(null);

// 🎯 CONTEXT COMPOSER
interface ContextComposerProps {
    children: ReactNode;
    slices: ContextSlice<any>[];
    debugMode?: boolean;
}

export const ContextComposer: React.FC<ContextComposerProps> = ({
    children,
    slices,
    debugMode = false
}) => {
    const storeRef = useRef<ContextStore>();
    const [, forceUpdate] = useState({});

    // Initialize store once
    if (!storeRef.current) {
        storeRef.current = new ContextStore();
        slices.forEach(slice => storeRef.current!.registerSlice(slice));
    }

    const store = storeRef.current;

    // Subscribe to store changes
    useEffect(() => {
        const unsubscribe = store.onStoreChange(() => {
            forceUpdate({});
        });
        return unsubscribe;
    }, [store]);

    const contextValue = useMemo<ComposedContextValue>(() => ({
        slices: Object.fromEntries(
            slices.map(slice => [slice.name, store.getSlice(slice.name)])
        ),
        
        subscribe: (sliceName: string, callback: (value: any) => void) => {
            return store.subscribe(sliceName, callback);
        },
        
        dispatch: (sliceName: string, action: any) => {
            store.updateSlice(sliceName, action);
        },
        
        getSlice: <T>(sliceName: string): T => {
            return store.getSlice<T>(sliceName);
        },
        
        performance: store.getPerformanceStats()
    }), [store, slices]);

    // Debug logging
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

// 🎯 SELECTIVE CONTEXT HOOK
export const useContextSlice = <T>(sliceName: string): T => {
    const context = useContext(ComposedContext);
    if (!context) {
        throw new Error('useContextSlice must be used within ContextComposer');
    }

    const [sliceValue, setSliceValue] = useState<T>(context.getSlice<T>(sliceName));

    useEffect(() => {
        const unsubscribe = context.subscribe(sliceName, (newValue: T) => {
            setSliceValue(newValue);
        });
        return unsubscribe;
    }, [context, sliceName]);

    return sliceValue;
};

// 🎯 DISPATCH HOOK
export const useContextDispatch = () => {
    const context = useContext(ComposedContext);
    if (!context) {
        throw new Error('useContextDispatch must be used within ContextComposer');
    }

    return useCallback((sliceName: string, action: any) => {
        context.dispatch(sliceName, action);
    }, [context]);
};

// 🎯 PERFORMANCE HOOK
export const useContextPerformance = () => {
    const context = useContext(ComposedContext);
    if (!context) {
        throw new Error('useContextPerformance must be used within ContextComposer');
    }

    return context.performance;
};

// 🎯 PROVIDER COMPOSITION UTILITIES
export const composeProviders = (providers: React.ComponentType<any>[]) => {
    return providers.reduce(
        (AccumulatedProviders, CurrentProvider) => {
            return ({ children }: { children: ReactNode }) => (
                <AccumulatedProviders>
                    <CurrentProvider>
                        {children}
                    </CurrentProvider>
                </AccumulatedProviders>
            );
        },
        ({ children }: { children: ReactNode }) => <>{children}</>
    );
};

// 🎯 MEMOIZED PROVIDER HOC
export const withMemoizedProvider = <P extends object>(
    Provider: React.ComponentType<P>,
    shouldUpdate?: (prevProps: P, nextProps: P) => boolean
) => {
    const MemoizedProvider = React.memo(Provider, shouldUpdate);
    MemoizedProvider.displayName = `Memoized(${Provider.displayName || Provider.name})`;
    return MemoizedProvider;
};

// 🎯 PROVIDER PERFORMANCE MONITOR
export const withProviderPerformanceMonitor = <P extends object>(
    Provider: React.ComponentType<P>,
    providerName: string
) => {
    return (props: P) => {
        const renderStart = useRef(performance.now());
        const renderCount = useRef(0);

        useEffect(() => {
            renderCount.current++;
            const renderTime = performance.now() - renderStart.current;
            
            if (renderTime > 16) { // More than 1 frame
                console.warn(`⚠️ ${providerName} slow render: ${renderTime.toFixed(2)}ms (render #${renderCount.current})`);
            } else {
                console.log(`✅ ${providerName} render: ${renderTime.toFixed(2)}ms (render #${renderCount.current})`);
            }
        });

        return <Provider {...props} />;
    };
};

// 🎯 SMART PROVIDER LOADER
interface SmartProviderLoaderProps {
    children: ReactNode;
    providers: Array<{
        component: React.ComponentType<any>;
        props?: any;
        loadCondition?: () => boolean;
        priority?: number;
    }>;
    loadingFallback?: ReactNode;
}

export const SmartProviderLoader: React.FC<SmartProviderLoaderProps> = ({
    children,
    providers,
    loadingFallback = null
}) => {
    const [loadedProviders, setLoadedProviders] = useState<Set<number>>(new Set());

    useEffect(() => {
        // Sort providers by priority
        const sortedProviders = providers
            .map((provider, index) => ({ ...provider, index }))
            .sort((a, b) => (b.priority || 0) - (a.priority || 0));

        // Load providers progressively
        sortedProviders.forEach((provider, order) => {
            const shouldLoad = !provider.loadCondition || provider.loadCondition();
            
            if (shouldLoad) {
                // Use requestIdleCallback for non-critical providers
                const callback = () => {
                    setLoadedProviders(prev => new Set([...prev, provider.index]));
                };

                if (provider.priority && provider.priority > 5) {
                    // High priority - load immediately
                    callback();
                } else if ('requestIdleCallback' in window) {
                    // Low priority - load when idle
                    (window as any).requestIdleCallback(callback, { timeout: 1000 });
                } else {
                    // Fallback
                    setTimeout(callback, order * 100);
                }
            }
        });
    }, [providers]);

    const ProviderStack = useMemo(() => {
        const loadedProviderComponents = providers
            .filter((_, index) => loadedProviders.has(index))
            .map(provider => ({ 
                Component: provider.component, 
                props: provider.props || {} 
            }));

        return loadedProviderComponents.reduceRight(
            (children, { Component, props }) => (
                <Component {...props}>{children}</Component>
            ),
            children as React.ReactElement
        );
    }, [providers, loadedProviders, children]);

    if (loadedProviders.size === 0) {
        return <>{loadingFallback}</>;
    }

    return ProviderStack;
};

// 🎯 CONTEXT DEBUGGING UTILITIES
export const ContextDebugger: React.FC<{ sliceName?: string }> = ({ sliceName }) => {
    const performance = useContextPerformance();
    const context = useContext(ComposedContext);

    if (!context) return null;

    const debugInfo = sliceName 
        ? { [sliceName]: performance.sliceStats[sliceName] }
        : performance;

    return (
        <div style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 9999,
            maxWidth: '300px'
        }}>
            <h4>Context Debug Info</h4>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
    );
};

// 🎯 PREDEFINED SLICES FOR COMMON USE CASES
export const createDataSlice = <T>(name: string, initialValue: T): ContextSlice<T> => ({
    name,
    initialValue,
    reducer: (state: T, action: any) => {
        switch (action.type) {
            case 'SET':
                return action.payload;
            case 'UPDATE':
                return { ...state as any, ...action.payload };
            case 'RESET':
                return initialValue;
            default:
                return state;
        }
    }
});

export const createAsyncSlice = <T>(name: string, initialValue: T) => ({
    name,
    initialValue: {
        data: initialValue,
        loading: false,
        error: null
    },
    reducer: (state: any, action: any) => {
        switch (action.type) {
            case 'LOADING':
                return { ...state, loading: true, error: null };
            case 'SUCCESS':
                return { data: action.payload, loading: false, error: null };
            case 'ERROR':
                return { ...state, loading: false, error: action.payload };
            default:
                return state;
        }
    }
});

export const createUISlice = (name: string) => ({
    name,
    initialValue: {
        isOpen: false,
        activeTab: 0,
        selectedItems: [],
        filters: {},
        searchQuery: ''
    },
    reducer: (state: any, action: any) => {
        switch (action.type) {
            case 'TOGGLE':
                return { ...state, isOpen: !state.isOpen };
            case 'SET_ACTIVE_TAB':
                return { ...state, activeTab: action.payload };
            case 'SELECT_ITEM':
                return { 
                    ...state, 
                    selectedItems: [...state.selectedItems, action.payload] 
                };
            case 'DESELECT_ITEM':
                return { 
                    ...state, 
                    selectedItems: state.selectedItems.filter((item: any) => item !== action.payload) 
                };
            case 'SET_FILTER':
                return { 
                    ...state, 
                    filters: { ...state.filters, [action.key]: action.value } 
                };
            case 'SET_SEARCH':
                return { ...state, searchQuery: action.payload };
            default:
                return state;
        }
    }
});

export default ContextComposer;