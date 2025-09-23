import { useCallback } from 'react';
import { useLocation } from 'wouter';

/**
 * 🧭 Hook personalizado para navegação centralizada
 * 
 * Substitui chamadas diretas a window.history.replaceState() 
 * por navegação adequada via Wouter, evitando conflitos
 * com o estado interno do roteador.
 */
export const useNavigation = () => {
    const [location, setLocation] = useLocation();

    const navigate = useCallback((path: string, options?: {
        replace?: boolean;
        preserveQuery?: boolean;
    }) => {
        const { replace = false, preserveQuery = false } = options || {};

        let finalPath = path;

        // Preservar query string se solicitado
        if (preserveQuery && window.location.search) {
            const separator = path.includes('?') ? '&' : '?';
            finalPath = `${path}${separator}${window.location.search.substring(1)}`;
        }

        if (replace) {
            // Para replace, usar setLocation diretamente (Wouter gerencia o histórico)
            setLocation(finalPath);
        } else {
            // Para push, também usar setLocation (comportamento padrão)
            setLocation(finalPath);
        }
    }, [setLocation]);

    const redirect = useCallback((path: string, preserveQuery = true) => {
        navigate(path, { replace: true, preserveQuery });
    }, [navigate]);

    const getCurrentPath = useCallback(() => {
        return location;
    }, [location]);

    const getQueryParam = useCallback((param: string): string | null => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }, []);

    const buildPathWithParams = useCallback((basePath: string, params: Record<string, string | undefined>): string => {
        const url = new URL(basePath, window.location.origin);

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.set(key, value);
            }
        });

        return url.pathname + url.search;
    }, []);

    return {
        navigate,
        redirect,
        getCurrentPath,
        getQueryParam,
        buildPathWithParams,
        currentLocation: location
    };
};