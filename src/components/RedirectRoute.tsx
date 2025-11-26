import { useEffect } from 'react';
import { useEditorContext } from '@/core/hooks/useEditorContext';
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
 * por navegação adequada via hook useEditorContext.
 */
export const RedirectRoute = ({ to, preserveQuery = true, children }: RedirectRouteProps) => {
    const { navigation } = useEditorContext();
    const { redirect } = navigation;

    useEffect(() => {
        redirect(to, preserveQuery);
    }, [to, preserveQuery, redirect]);

    // Renderiza children enquanto redireciona, ou fallback de loading
    return children || <LoadingFallback />;
};