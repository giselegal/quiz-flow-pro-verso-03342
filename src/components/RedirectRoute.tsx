import { useEffect } from 'react';
import { useNavigation } from '../hooks/useNavigation';
import { LoadingFallback } from './ui/loading-fallback';

interface RedirectRouteProps {
    to: string;
    preserveQuery?: boolean;
    children?: React.ReactNode;
}

/**
 * 🔄 Componente de redirecionamento usando Wouter
 * 
 * Substitui chamadas diretas a window.history.replaceState()
 * por navegação adequada via hook useNavigation.
 */
export const RedirectRoute = ({ to, preserveQuery = true, children }: RedirectRouteProps) => {
    const { redirect } = useNavigation();

    useEffect(() => {
        redirect(to, preserveQuery);
    }, [to, preserveQuery, redirect]);

    // Renderiza children enquanto redireciona, ou fallback de loading
    return children || <LoadingFallback />;
};