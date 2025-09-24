import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * 📱 USE RESPONSIVE - HOOK RESPONSIVO INTELIGENTE
 * 
 * Detecção avançada de dispositivos, breakpoints e orientação
 */

// 📊 Breakpoints padrão
const DEFAULT_BREAKPOINTS = {
    xs: 0,     // Extra small devices
    sm: 576,   // Small devices
    md: 768,   // Medium devices  
    lg: 992,   // Large devices
    xl: 1200,  // Extra large devices
    xxl: 1400  // Extra extra large devices
} as const;

type BreakpointKey = keyof typeof DEFAULT_BREAKPOINTS;

interface DeviceInfo {
    type: 'mobile' | 'tablet' | 'desktop';
    orientation: 'portrait' | 'landscape';
    hasTouch: boolean;
    pixelRatio: number;
    isRetina: boolean;
    userAgent: string;
    platform: string;
}

interface ViewportInfo {
    width: number;
    height: number;
    aspectRatio: number;
    availableWidth: number;
    availableHeight: number;
}

interface ResponsiveState {
    // Viewport
    viewport: ViewportInfo;

    // Breakpoints
    breakpoint: BreakpointKey;
    breakpoints: Record<BreakpointKey, boolean>;

    // Device
    device: DeviceInfo;

    // Convenience flags
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isSmall: boolean;  // xs, sm
    isMedium: boolean; // md
    isLarge: boolean;  // lg, xl, xxl

    // Advanced features
    prefersReducedMotion: boolean;
    prefersColorScheme: 'light' | 'dark' | 'no-preference';
    isOnline: boolean;
    connectionType?: string;
}

interface UseResponsiveOptions {
    /** Breakpoints customizados */
    breakpoints?: Partial<Record<BreakpointKey, number>>;

    /** Debounce delay para resize events */
    debounceDelay?: number;

    /** Se deve incluir detection de connection */
    includeConnection?: boolean;

    /** Callback chamado quando breakpoint muda */
    onBreakpointChange?: (breakpoint: BreakpointKey, previous: BreakpointKey) => void;

    /** Callback chamado quando orientação muda */
    onOrientationChange?: (orientation: 'portrait' | 'landscape') => void;
}

function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

export function useResponsive(options: UseResponsiveOptions = {}): ResponsiveState {
    const {
        breakpoints: customBreakpoints = {},
        debounceDelay = 100,
        includeConnection = true,
        onBreakpointChange,
        onOrientationChange
    } = options;

    // Merge breakpoints
    const breakpoints = useMemo(() => ({
        ...DEFAULT_BREAKPOINTS,
        ...customBreakpoints
    }), [customBreakpoints]);

    // 🎯 Detectar device info inicial
    const getInitialDeviceInfo = useCallback((): DeviceInfo => {
        const userAgent = navigator.userAgent.toLowerCase();
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // Detectar tipo de device
        let type: DeviceInfo['type'] = 'desktop';
        if (/android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
            type = 'mobile';
        } else if (/tablet|ipad/i.test(userAgent) || (hasTouch && window.innerWidth >= 768)) {
            type = 'tablet';
        }

        // Orientação inicial
        const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

        return {
            type,
            orientation,
            hasTouch,
            pixelRatio: window.devicePixelRatio || 1,
            isRetina: window.devicePixelRatio > 1,
            userAgent: navigator.userAgent,
            platform: navigator.platform
        };
    }, []);

    // 📏 Calcular viewport info
    const getViewportInfo = useCallback((): ViewportInfo => ({
        width: window.innerWidth,
        height: window.innerHeight,
        aspectRatio: window.innerWidth / window.innerHeight,
        availableWidth: screen.availWidth,
        availableHeight: screen.availHeight
    }), []);

    // 🎯 Determinar breakpoint atual
    const getCurrentBreakpoint = useCallback((width: number): BreakpointKey => {
        const sortedBreakpoints = Object.entries(breakpoints)
            .sort(([, a], [, b]) => b - a); // Ordem decrescente

        for (const [key, value] of sortedBreakpoints) {
            if (width >= value) {
                return key as BreakpointKey;
            }
        }

        return 'xs';
    }, [breakpoints]);

    // 🎨 Detectar preferências do sistema
    const getSystemPreferences = useCallback(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let prefersColorScheme: 'light' | 'dark' | 'no-preference' = 'no-preference';
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            prefersColorScheme = 'dark';
        } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            prefersColorScheme = 'light';
        }

        return {
            prefersReducedMotion,
            prefersColorScheme
        };
    }, []);

    // 🌐 Detectar informações de conexão
    const getConnectionInfo = useCallback(() => {
        const isOnline = navigator.onLine;
        let connectionType: string | undefined;

        // @ts-ignore - Experimental API
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            connectionType = connection.effectiveType || connection.type;
        }

        return { isOnline, connectionType };
    }, []);

    // Estado inicial
    const [state, setState] = useState<ResponsiveState>(() => {
        const viewport = getViewportInfo();
        const device = getInitialDeviceInfo();
        const currentBreakpoint = getCurrentBreakpoint(viewport.width);
        const systemPrefs = getSystemPreferences();
        const connectionInfo = includeConnection ? getConnectionInfo() : { isOnline: true };

        // Calcular breakpoint flags
        const breakpointFlags = Object.keys(breakpoints).reduce((acc, key) => {
            acc[key as BreakpointKey] = viewport.width >= breakpoints[key as BreakpointKey];
            return acc;
        }, {} as Record<BreakpointKey, boolean>);

        // Convenience flags
        const isMobile = device.type === 'mobile' || viewport.width < breakpoints.md;
        const isTablet = device.type === 'tablet' || (viewport.width >= breakpoints.md && viewport.width < breakpoints.lg);
        const isDesktop = device.type === 'desktop' && viewport.width >= breakpoints.lg;
        const isSmall = viewport.width < breakpoints.md;
        const isMedium = viewport.width >= breakpoints.md && viewport.width < breakpoints.lg;
        const isLarge = viewport.width >= breakpoints.lg;

        return {
            viewport,
            breakpoint: currentBreakpoint,
            breakpoints: breakpointFlags,
            device,
            isMobile,
            isTablet,
            isDesktop,
            isSmall,
            isMedium,
            isLarge,
            ...systemPrefs,
            ...connectionInfo
        };
    });

    // 🔄 Atualizar estado
    const updateState = useCallback(() => {
        const viewport = getViewportInfo();
        const device = getInitialDeviceInfo();
        const currentBreakpoint = getCurrentBreakpoint(viewport.width);
        const systemPrefs = getSystemPreferences();
        const connectionInfo = includeConnection ? getConnectionInfo() : { isOnline: state.isOnline };

        // Verificar mudanças
        const previousBreakpoint = state.breakpoint;
        const previousOrientation = state.device.orientation;

        // Callbacks
        if (currentBreakpoint !== previousBreakpoint && onBreakpointChange) {
            onBreakpointChange(currentBreakpoint, previousBreakpoint);
        }

        if (device.orientation !== previousOrientation && onOrientationChange) {
            onOrientationChange(device.orientation);
        }

        // Calcular breakpoint flags
        const breakpointFlags = Object.keys(breakpoints).reduce((acc, key) => {
            acc[key as BreakpointKey] = viewport.width >= breakpoints[key as BreakpointKey];
            return acc;
        }, {} as Record<BreakpointKey, boolean>);

        // Convenience flags
        const isMobile = device.type === 'mobile' || viewport.width < breakpoints.md;
        const isTablet = device.type === 'tablet' || (viewport.width >= breakpoints.md && viewport.width < breakpoints.lg);
        const isDesktop = device.type === 'desktop' && viewport.width >= breakpoints.lg;
        const isSmall = viewport.width < breakpoints.md;
        const isMedium = viewport.width >= breakpoints.md && viewport.width < breakpoints.lg;
        const isLarge = viewport.width >= breakpoints.lg;

        setState({
            viewport,
            breakpoint: currentBreakpoint,
            breakpoints: breakpointFlags,
            device,
            isMobile,
            isTablet,
            isDesktop,
            isSmall,
            isMedium,
            isLarge,
            ...systemPrefs,
            ...connectionInfo
        });
    }, [
        getViewportInfo,
        getInitialDeviceInfo,
        getCurrentBreakpoint,
        getSystemPreferences,
        getConnectionInfo,
        breakpoints,
        includeConnection,
        onBreakpointChange,
        onOrientationChange,
        state.breakpoint,
        state.device.orientation,
        state.isOnline
    ]);

    // Debounced update function
    const debouncedUpdate = useMemo(
        () => debounce(updateState, debounceDelay),
        [updateState, debounceDelay]
    );

    // 👂 Event listeners
    useEffect(() => {
        // Resize listener
        window.addEventListener('resize', debouncedUpdate);

        // Orientation change listener
        window.addEventListener('orientationchange', debouncedUpdate);

        // Online/offline listeners
        if (includeConnection) {
            window.addEventListener('online', updateState);
            window.addEventListener('offline', updateState);
        }

        // Media query listeners para system preferences
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const lightModeQuery = window.matchMedia('(prefers-color-scheme: light)');

        const handleMediaQueryChange = () => updateState();

        reducedMotionQuery.addListener(handleMediaQueryChange);
        darkModeQuery.addListener(handleMediaQueryChange);
        lightModeQuery.addListener(handleMediaQueryChange);

        // Connection change listener (experimental)
        // @ts-ignore
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection && includeConnection) {
            connection.addEventListener('change', updateState);
        }

        return () => {
            window.removeEventListener('resize', debouncedUpdate);
            window.removeEventListener('orientationchange', debouncedUpdate);

            if (includeConnection) {
                window.removeEventListener('online', updateState);
                window.removeEventListener('offline', updateState);
            }

            reducedMotionQuery.removeListener(handleMediaQueryChange);
            darkModeQuery.removeListener(handleMediaQueryChange);
            lightModeQuery.removeListener(handleMediaQueryChange);

            if (connection && includeConnection) {
                connection.removeEventListener('change', updateState);
            }
        };
    }, [debouncedUpdate, updateState, includeConnection]);

    return state;
}

// 🎯 Hooks utilitários especializados

/**
 * Hook simples para detectar apenas mobile
 */
export function useIsMobile(breakpoint: number = 768): boolean {
    const { viewport } = useResponsive();
    return viewport.width < breakpoint;
}

/**
 * Hook para detectar orientação
 */
export function useOrientation(): 'portrait' | 'landscape' {
    const { device } = useResponsive();
    return device.orientation;
}

/**
 * Hook para detectar se é touch device
 */
export function useIsTouch(): boolean {
    const { device } = useResponsive();
    return device.hasTouch;
}

/**
 * Hook para detectar tema do sistema
 */
export function useSystemTheme(): 'light' | 'dark' | 'no-preference' {
    const { prefersColorScheme } = useResponsive();
    return prefersColorScheme;
}

/**
 * Hook para detectar se prefere movimento reduzido
 */
export function usePrefersReducedMotion(): boolean {
    const { prefersReducedMotion } = useResponsive();
    return prefersReducedMotion;
}

/**
 * Hook para status de conexão
 */
export function useNetworkStatus(): { isOnline: boolean; connectionType?: string } {
    const { isOnline, connectionType } = useResponsive({ includeConnection: true });
    return { isOnline, connectionType };
}

export type {
    ResponsiveState,
    DeviceInfo,
    ViewportInfo,
    UseResponsiveOptions,
    BreakpointKey
};