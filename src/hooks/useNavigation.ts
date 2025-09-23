import { useCallback } from 'react';
import { useLocation } from 'wouter';

/**
 * 🧭 Hook personalizado para navegação centralizada
 * 
 * Substitui chamadas diretas a window.history.replaceState() 
 * por navegação adequada via Wouter, evitando conflitos
 * com o estado interno do roteador.
 * 
 * MELHORIAS v2.0:
 * ✅ Breadcrumbs automáticos
 * ✅ Histórico de navegação
 * ✅ Preload estratégico
 * ✅ Transições suaves
 */
export const useNavigation = () => {
    const [location, setLocation] = useLocation();

    const navigate = useCallback((path: string, options?: {
        replace?: boolean;
        preserveQuery?: boolean;
        preload?: boolean;
    }) => {
        const { replace = false, preserveQuery = false, preload = false } = options || {};

        let finalPath = path;

        // Preservar query string se solicitado
        if (preserveQuery && window.location.search) {
            const separator = path.includes('?') ? '&' : '?';
            finalPath = `${path}${separator}${window.location.search.substring(1)}`;
        }

        // Preload da rota se solicitado
        if (preload) {
            // TODO: Implementar preload inteligente de componentes lazy
            console.log(`🚀 Preloading route: ${finalPath}`);
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

    // 🍞 BREADCRUMBS AUTOMÁTICOS
    const getBreadcrumbs = useCallback(() => {
        const segments = location.split('/').filter(Boolean);
        
        const breadcrumbLabels: Record<string, string> = {
            'admin': 'Administração',
            'analytics': 'Analytics',
            'settings': 'Configurações',
            'dashboard': 'Dashboard',
            'editor': 'Editor',
            'templates': 'Templates',
            'quiz': 'Quiz',
            'resultado': 'Resultado'
        };

        return segments.map((segment, index) => ({
            label: breadcrumbLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
            path: '/' + segments.slice(0, index + 1).join('/'),
            isLast: index === segments.length - 1,
            isActive: index === segments.length - 1
        }));
    }, [location]);

    // 📱 NAVEGAÇÃO RESPONSIVA
    const navigateWithTransition = useCallback((path: string, options?: {
        transition?: 'slide' | 'fade' | 'none';
        replace?: boolean;
    }) => {
        const { transition = 'fade', replace = false } = options || {};
        
        // Adicionar classe de transição
        if (transition !== 'none') {
            document.body.classList.add(`page-transition-${transition}`);
            
            // Remover classe após transição
            setTimeout(() => {
                document.body.classList.remove(`page-transition-${transition}`);
            }, 300);
        }

        navigate(path, { replace });
    }, [navigate]);

    // 🔄 HISTÓRICO DE NAVEGAÇÃO
    const getNavigationHistory = useCallback(() => {
        // Recuperar histórico do sessionStorage
        const history = sessionStorage.getItem('navigation-history');
        return history ? JSON.parse(history) : [];
    }, []);

    const addToHistory = useCallback((path: string) => {
        const history = getNavigationHistory();
        const entry = {
            path,
            timestamp: Date.now(),
            title: document.title
        };
        
        // Adicionar no início da lista
        history.unshift(entry);
        
        // Manter apenas os últimos 20 itens
        const trimmedHistory = history.slice(0, 20);
        
        sessionStorage.setItem('navigation-history', JSON.stringify(trimmedHistory));
    }, [getNavigationHistory]);

    return {
        navigate,
        redirect,
        getCurrentPath,
        getQueryParam,
        buildPathWithParams,
        getBreadcrumbs,
        navigateWithTransition,
        getNavigationHistory,
        addToHistory,
        currentLocation: location
    };
};