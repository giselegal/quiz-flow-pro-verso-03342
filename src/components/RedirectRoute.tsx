import { useEffect } from 'react';
import { useUX } from '@/contexts/consolidated/UXProvider';
import { LoadingFallback } from './ui/loading-fallback';

interface RedirectRouteProps {
    to: string;
    preserveQuery?: boolean;
    children?: React.ReactNode;
}

/**
 * 🔄 Componente de redirecionamento usando UX Provider
 * 
 * Substitui chamadas diretas a window.history.replaceState()
 * por navegação adequada via UX context.
 */
export const RedirectRoute = ({ to, preserveQuery = true, children }: RedirectRouteProps) => {
    const { navigate } = useUX();

    useEffect(() => {
        const url = preserveQuery ? `${to}${window.location.search}` : to;
        navigate(url);
    }, [to, preserveQuery, navigate]);

    // Renderiza children enquanto redireciona, ou fallback de loading
    return children || <LoadingFallback />;
};