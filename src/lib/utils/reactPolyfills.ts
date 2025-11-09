/**
 * 🚀 REACT POLYFILLS GLOBAIS - Inicialização precoce
 * 
 * Este arquivo deve ser importado ANTES de qualquer componente React
 * para garantir que todas as APIs estejam disponíveis
 */

import React from 'react';

// Aplicar polyfills imediatamente na importação
(function applyReactPolyfills() {
    if (typeof window === 'undefined') return;

    console.log('🔧 [ReactPolyfills] Aplicando correções React...');

    // Garantir que React está disponível globalmente
    (window as any).React = React;

    // Polyfills robustos para todas as APIs React que podem estar ausentes
    const createSafeForwardRef = () => {
        return (render: any) => {
            const Component = (props: any, ref: any) => {
                return render(props, ref);
            };
            Component.displayName = render.displayName || render.name;
            return Component;
        };
    };

    const reactPolyfills = {
        // Hook polyfills
        useLayoutEffect: React.useLayoutEffect || React.useEffect,
        useMemo: React.useMemo || ((factory: any, deps?: any[]) => factory()),
        useCallback: React.useCallback || ((callback: any, deps?: any[]) => callback),
        useImperativeHandle: React.useImperativeHandle || (() => {}),
        
        // Component polyfills
        forwardRef: React.forwardRef || createSafeForwardRef(),
        memo: React.memo || ((component: any) => component),
        Fragment: React.Fragment || (({ children }: any) => children),
        
        // Ref polyfills
        createRef: React.createRef || (() => ({ current: null })),
        
        // Context polyfills
        createContext: React.createContext || ((defaultValue: any) => ({
            Provider: ({ children }: any) => children,
            Consumer: ({ children }: any) => children(defaultValue)
        }))
    };

    // Aplicar todos os polyfills ao React
    Object.keys(reactPolyfills).forEach(key => {
        if (!(React as any)[key]) {
            (React as any)[key] = (reactPolyfills as any)[key];
        }
    });

    // Atualizar React global
    (window as any).React = React;

    // Marcar como aplicado
    (window as any).__REACT_POLYFILLS_READY__ = true;
    
    console.log('✅ [ReactPolyfills] Todas as APIs React foram normalizadas');
})();

export default React;