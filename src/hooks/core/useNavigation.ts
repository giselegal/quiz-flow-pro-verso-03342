/**
 * 🎯 NAVIGATION HOOK - CONSOLIDATED NAVIGATION SYSTEM
 * 
 * Consolidates fragmented navigation hooks and utilities:
 * - useNavigationSafe.ts (safe navigation with unsaved changes)
 * - Route management utilities
 * - Browser history management
 * - Navigation guards and middleware
 * - Deep linking support
 * 
 * Benefits:
 * ✅ Unified navigation interface
 * ✅ Safe navigation with unsaved changes protection
 * ✅ Type-safe route parameters
 * ✅ Navigation history management
 * ✅ Deep linking support
 * ✅ Navigation middleware support
 * ✅ Performance optimized
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { StorageService } from '@/services/core/StorageService';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

export interface NavigationGuard {
    id: string;
    condition: () => boolean | Promise<boolean>;
    message: string;
    onBlock?: (targetPath: string) => void;
    onAllow?: (targetPath: string) => void;
    check?: (context: NavigationContext) => Promise<GuardResult>; // Para compatibilidade com NavigationService
}

export interface NavigationMiddleware {
    id: string;
    condition: (path: string, params: Record<string, any>) => boolean;
    handler: (path: string, params: Record<string, any>) => string | null; // Return null to block, modified path to redirect
    handle?: (context: NavigationContext) => Promise<MiddlewareResult>; // Para compatibilidade com NavigationService
}

// Interfaces adicionais para compatibilidade com NavigationService
export interface NavigationContext {
    from: string;
    to: string;
    path: string;
    params: Record<string, any>;
    query: Record<string, any>;
    state?: any;
    metadata?: Record<string, any>;
    user?: any;
}

export interface GuardResult {
    allow: boolean;
    allowed?: boolean; // Para compatibilidade
    message?: string;
    reason?: string;
    redirectTo?: string;
    metadata?: Record<string, any>;
}

export interface MiddlewareResult {
    continue: boolean;
    redirectTo?: string;
    redirect?: string; // Para compatibilidade
    modifyContext?: Partial<NavigationContext>;
    metadata?: Record<string, any>;
}

export interface RouteDefinition {
    path: string;
    name: string;
    component?: React.ComponentType<any>;
    guards?: string[];
    middleware?: string[];
    meta?: Record<string, any>;
}

export interface NavigationHistory {
    path: string;
    timestamp: number;
    title?: string;
    params?: Record<string, any>;
}

export interface NavigationState {
    currentPath: string;
    previousPath: string | null;
    history: NavigationHistory[];
    isNavigating: boolean;
    blockedNavigation: string | null;
    guards: Map<string, NavigationGuard>;
    middleware: Map<string, NavigationMiddleware>;
    routes: Map<string, RouteDefinition>;
}

export interface NavigationActions {
    // Basic navigation
    navigate: (path: string, options?: NavigationOptions) => Promise<boolean>;
    goBack: () => void;
    goForward: () => void;
    replace: (path: string) => void;
    reload: () => void;

    // Route management
    registerRoute: (route: RouteDefinition) => void;
    unregisterRoute: (name: string) => void;
    getRoute: (name: string) => RouteDefinition | undefined;

    // Guards and middleware
    addGuard: (guard: NavigationGuard) => void;
    removeGuard: (guardId: string) => void;
    addMiddleware: (middleware: NavigationMiddleware) => void;
    removeMiddleware: (middlewareId: string) => void;

    // Navigation utilities
    buildPath: (routeName: string, params?: Record<string, any>) => string;
    parseParams: (path: string) => Record<string, any>;
    isCurrentPath: (path: string) => boolean;
    canNavigate: (path: string) => Promise<boolean>;

    // History management
    getHistory: () => NavigationHistory[];
    clearHistory: () => void;
    getHistoryEntry: (index: number) => NavigationHistory | undefined;
}

export interface NavigationOptions {
    replace?: boolean;
    force?: boolean; // Skip guards and middleware
    title?: string;
    state?: any;
}

// =============================================================================
// ROUTE DEFINITIONS
// =============================================================================

export const DEFAULT_ROUTES: RouteDefinition[] = [
    {
        path: '/',
        name: 'home',
        meta: { title: 'Quiz Quest - Home' }
    },
    {
        path: '/quiz',
        name: 'quiz',
        meta: { title: 'Quiz Quest - Quiz' }
    },
    {
        path: '/quiz/:step',
        name: 'quiz-step',
        meta: { title: 'Quiz Quest - Step' }
    },
    {
        path: '/editor',
        name: 'editor',
        guards: ['unsaved-changes'],
        meta: { title: 'Quiz Quest - Editor' }
    },
    {
        path: '/editor/:funnelId',
        name: 'editor-funnel',
        guards: ['unsaved-changes'],
        meta: { title: 'Quiz Quest - Editor' }
    },
    {
        path: '/editor-main',
        name: 'editor-main',
        middleware: ['redirect-to-editor'], // Redirect to /editor
        meta: { title: 'Quiz Quest - Editor (Redirected)' }
    },
    {
        path: '/headless-editor/:funnelId?',
        name: 'headless-editor',
        meta: { title: 'Quiz Quest - Headless Editor' }
    },
    {
        path: '/admin',
        name: 'admin',
        guards: ['auth-required'],
        meta: { title: 'Quiz Quest - Admin Dashboard' }
    },
    {
        path: '/admin/:section',
        name: 'admin-section',
        guards: ['auth-required'],
        meta: { title: 'Quiz Quest - Admin' }
    }
];

// =============================================================================
// DEFAULT GUARDS
// =============================================================================

export const DEFAULT_GUARDS: NavigationGuard[] = [
    {
        id: 'unsaved-changes',
        condition: () => {
            // Check if there are unsaved changes in editor
            const hasUnsavedChanges = StorageService.safeGetString('editor-unsaved-changes') === 'true';
            return !hasUnsavedChanges;
        },
        message: 'You have unsaved changes. Are you sure you want to leave?',
        onBlock: (targetPath) => {
            console.log('Navigation blocked due to unsaved changes:', targetPath);
        },
        onAllow: (_targetPath) => {
            StorageService.safeRemove('editor-unsaved-changes');
        }
    },
    {
        id: 'auth-required',
        condition: () => {
            // Check if user is authenticated
            const isAuthenticated = StorageService.safeGetString('auth-token') !== null;
            return isAuthenticated;
        },
        message: 'Authentication required to access this page.',
        onBlock: (targetPath) => {
            // Redirect to auth page
            window.location.href = '/auth?redirect=' + encodeURIComponent(targetPath);
        }
    }
];

// =============================================================================
// DEFAULT MIDDLEWARE
// =============================================================================

export const DEFAULT_MIDDLEWARE: NavigationMiddleware[] = [
    {
        id: 'redirect-to-editor',
        condition: (path) => path === '/editor-main',
        handler: (_path) => {
            console.log('Redirecting /editor-main to /editor');
            return '/editor'; // Redirect to /editor
        }
    },
    {
        id: 'normalize-paths',
        condition: (path) => path.endsWith('/') && path !== '/',
        handler: (path) => {
            // Remove trailing slash
            return path.slice(0, -1);
        }
    }
];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const parsePathParams = (pattern: string, path: string): Record<string, any> => {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');
    const params: Record<string, any> = {};

    for (let i = 0; i < patternParts.length; i++) {
        const patternPart = patternParts[i];
        const pathPart = pathParts[i];

        if (patternPart?.startsWith(':')) {
            const paramName = patternPart.slice(1).replace('?', ''); // Remove optional marker
            if (pathPart) {
                params[paramName] = decodeURIComponent(pathPart);
            }
        }
    }

    return params;
};

const matchRoute = (pattern: string, path: string): boolean => {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');

    if (patternParts.length !== pathParts.length) {
        // Check for optional parameters
        const hasOptional = patternParts.some(part => part.includes('?'));
        if (!hasOptional) return false;
    }

    for (let i = 0; i < patternParts.length; i++) {
        const patternPart = patternParts[i];
        const pathPart = pathParts[i];

        if (!patternPart) continue;

        if (patternPart.startsWith(':')) {
            // Parameter - always matches if not optional and value exists
            if (patternPart.includes('?')) {
                // Optional parameter
                continue;
            } else if (!pathPart) {
                // Required parameter missing
                return false;
            }
        } else if (patternPart !== pathPart) {
            // Literal part doesn't match
            return false;
        }
    }

    return true;
};

// =============================================================================
// MAIN HOOK IMPLEMENTATION
// =============================================================================

export const useNavigation = () => {
    const [location, setLocation] = useLocation();
    const [, _params] = useRoute('/:path*');

    const [state, setState] = useState<NavigationState>({
        currentPath: location,
        previousPath: null,
        history: [],
        isNavigating: false,
        blockedNavigation: null,
        guards: new Map(DEFAULT_GUARDS.map(guard => [guard.id, guard])),
        middleware: new Map(DEFAULT_MIDDLEWARE.map(mw => [mw.id, mw])),
        routes: new Map(DEFAULT_ROUTES.map(route => [route.name, route]))
    });

    const navigationTimeoutRef = useRef<NodeJS.Timeout>();

    // Update current path when location changes
    useEffect(() => {
        setState(prev => {
            // Add to history if path actually changed
            const newHistory = prev.currentPath !== location
                ? [...prev.history, {
                    path: prev.currentPath,
                    timestamp: Date.now()
                }].slice(-50) // Keep last 50 entries
                : prev.history;

            return {
                ...prev,
                previousPath: prev.currentPath !== location ? prev.currentPath : prev.previousPath,
                currentPath: location,
                history: newHistory
            };
        });
    }, [location]);

    // Apply middleware to a path
    const applyMiddleware = useCallback(async (path: string): Promise<string> => {
        let processedPath = path;

        for (const middleware of state.middleware.values()) {
            if (middleware.condition(processedPath, parsePathParams('/:path*', processedPath))) {
                const result = middleware.handler(processedPath, parsePathParams('/:path*', processedPath));
                if (result === null) {
                    throw new Error(`Navigation blocked by middleware: ${middleware.id}`);
                }
                processedPath = result;
            }
        }

        return processedPath;
    }, [state.middleware]);

    // Check navigation guards
    const checkGuards = useCallback(async (path: string): Promise<boolean> => {
        // Find route for path
        const route = Array.from(state.routes.values())
            .find(route => matchRoute(route.path, path));

        if (!route || !route.guards) return true;

        // Check all guards for this route
        for (const guardId of route.guards) {
            const guard = state.guards.get(guardId);
            if (!guard) continue;

            const canProceed = await Promise.resolve(guard.condition());
            if (!canProceed) {
                // Handle blocked navigation
                if (guard.onBlock) {
                    guard.onBlock(path);
                } else {
                    // Default behavior - show confirmation
                    const userConfirmed = window.confirm(guard.message);
                    if (!userConfirmed) {
                        return false;
                    }
                }

                if (guard.onAllow) {
                    guard.onAllow(path);
                }
            }
        }

        return true;
    }, [state.guards, state.routes]);

    // Navigate to a path
    const navigate = useCallback(async (
        path: string,
        options: NavigationOptions = {}
    ): Promise<boolean> => {
        if (state.isNavigating) {
            console.warn('Navigation already in progress');
            return false;
        }

        setState(prev => ({ ...prev, isNavigating: true }));

        try {
            // Apply middleware unless forced
            const processedPath = options.force ? path : await applyMiddleware(path);

            // Check guards unless forced
            if (!options.force) {
                const canNavigate = await checkGuards(processedPath);
                if (!canNavigate) {
                    return false;
                }
            }

            // Update document title if provided or found in route meta
            if (options.title) {
                document.title = options.title;
            } else {
                const route = Array.from(state.routes.values())
                    .find(route => matchRoute(route.path, processedPath));
                if (route?.meta?.title) {
                    document.title = route.meta.title;
                }
            }

            // Perform navigation
            if (options.replace) {
                setLocation(processedPath, { replace: true });
            } else {
                setLocation(processedPath);
            }

            return true;

        } catch (error) {
            console.error('Navigation error:', error);
            return false;
        } finally {
            // Clear navigation state after a short delay
            if (navigationTimeoutRef.current) {
                clearTimeout(navigationTimeoutRef.current);
            }

            navigationTimeoutRef.current = setTimeout(() => {
                setState(prev => ({ ...prev, isNavigating: false }));
            }, 100);
        }
    }, [state.isNavigating, state.guards, state.middleware, state.routes, setLocation, applyMiddleware, checkGuards]);

    // Go back in history
    const goBack = useCallback(() => {
        window.history.back();
    }, []);

    // Go forward in history
    const goForward = useCallback(() => {
        window.history.forward();
    }, []);

    // Replace current path
    const replace = useCallback((path: string) => {
        navigate(path, { replace: true, force: true });
    }, [navigate]);

    // Reload current page
    const reload = useCallback(() => {
        window.location.reload();
    }, []);

    // Register a route
    const registerRoute = useCallback((route: RouteDefinition) => {
        setState(prev => {
            const newRoutes = new Map(prev.routes);
            newRoutes.set(route.name, route);
            return { ...prev, routes: newRoutes };
        });
    }, []);

    // Unregister a route
    const unregisterRoute = useCallback((name: string) => {
        setState(prev => {
            const newRoutes = new Map(prev.routes);
            newRoutes.delete(name);
            return { ...prev, routes: newRoutes };
        });
    }, []);

    // Get route by name
    const getRoute = useCallback((name: string): RouteDefinition | undefined => {
        return state.routes.get(name);
    }, [state.routes]);

    // Add navigation guard
    const addGuard = useCallback((guard: NavigationGuard) => {
        setState(prev => {
            const newGuards = new Map(prev.guards);
            newGuards.set(guard.id, guard);
            return { ...prev, guards: newGuards };
        });
    }, []);

    // Remove navigation guard
    const removeGuard = useCallback((guardId: string) => {
        setState(prev => {
            const newGuards = new Map(prev.guards);
            newGuards.delete(guardId);
            return { ...prev, guards: newGuards };
        });
    }, []);

    // Add middleware
    const addMiddleware = useCallback((middleware: NavigationMiddleware) => {
        setState(prev => {
            const newMiddleware = new Map(prev.middleware);
            newMiddleware.set(middleware.id, middleware);
            return { ...prev, middleware: newMiddleware };
        });
    }, []);

    // Remove middleware
    const removeMiddleware = useCallback((middlewareId: string) => {
        setState(prev => {
            const newMiddleware = new Map(prev.middleware);
            newMiddleware.delete(middlewareId);
            return { ...prev, middleware: newMiddleware };
        });
    }, []);

    // Build path from route name and parameters
    const buildPath = useCallback((routeName: string, params?: Record<string, any>): string => {
        const route = state.routes.get(routeName);
        if (!route) {
            throw new Error(`Route not found: ${routeName}`);
        }

        let path = route.path;
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                path = path.replace(`:${key}`, encodeURIComponent(String(value)));
                path = path.replace(`:${key}?`, encodeURIComponent(String(value)));
            }
        }

        // Remove optional parameters that weren't filled
        path = path.replace(/\/:[^\/]*\?/g, '');

        return path;
    }, [state.routes]);

    // Parse parameters from current path
    const parseParams = useCallback((path: string): Record<string, any> => {
        const route = Array.from(state.routes.values())
            .find(route => matchRoute(route.path, path));

        if (route) {
            return parsePathParams(route.path, path);
        }

        return {};
    }, [state.routes]);

    // Check if path is current
    const isCurrentPath = useCallback((path: string): boolean => {
        return state.currentPath === path;
    }, [state.currentPath]);

    // Check if navigation is possible
    const canNavigate = useCallback(async (path: string): Promise<boolean> => {
        try {
            await applyMiddleware(path);
            return await checkGuards(path);
        } catch {
            return false;
        }
    }, [applyMiddleware, checkGuards]);

    // Get navigation history
    const getHistory = useCallback((): NavigationHistory[] => {
        return [...state.history];
    }, [state.history]);

    // Clear navigation history
    const clearHistory = useCallback(() => {
        setState(prev => ({ ...prev, history: [] }));
    }, []);

    // Get history entry by index
    const getHistoryEntry = useCallback((index: number): NavigationHistory | undefined => {
        return state.history[index];
    }, [state.history]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (navigationTimeoutRef.current) {
                clearTimeout(navigationTimeoutRef.current);
            }
        };
    }, []);

    // Memoized actions
    const actions: NavigationActions = useMemo(() => ({
        navigate,
        goBack,
        goForward,
        replace,
        reload,
        registerRoute,
        unregisterRoute,
        getRoute,
        addGuard,
        removeGuard,
        addMiddleware,
        removeMiddleware,
        buildPath,
        parseParams,
        isCurrentPath,
        canNavigate,
        getHistory,
        clearHistory,
        getHistoryEntry
    }), [
        navigate, goBack, goForward, replace, reload,
        registerRoute, unregisterRoute, getRoute,
        addGuard, removeGuard, addMiddleware, removeMiddleware,
        buildPath, parseParams, isCurrentPath, canNavigate,
        getHistory, clearHistory, getHistoryEntry
    ]);

    return {
        // State
        currentPath: state.currentPath,
        previousPath: state.previousPath,
        isNavigating: state.isNavigating,
        history: state.history,

        // Current route info
        currentParams: parseParams(state.currentPath),

        // Actions
        ...actions
    };
};

export default useNavigation;