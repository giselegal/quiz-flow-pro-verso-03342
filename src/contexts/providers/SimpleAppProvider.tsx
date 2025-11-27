/**
 * 🟦 SimpleAppProvider
 * Provider minimalista para rotas que não exigem todo o ecossistema complexo.
 * Objetivo: reduzir profundidade de árvore e re-renders em páginas gerais (ex: dashboard, landing, auth).
 *
 * Inclui apenas preocupações essenciais:
 * - AuthProvider (estado de autenticação / sessão)
 * - ThemeProvider (tema global)
 * - EditorStateProvider (quando necessário em rotas de editor)
 * - FunnelDataProvider (dados de funil básicos para listas / seleção)
 * - NavigationProvider (navegação de steps se editor estiver ativo)
 *
 * Lazy mount condicional de Editor/Funnel/Navigation via prop `enableEditor`.
 * Assim páginas sem editor não montam estado complexo.
 */
import React, { ReactNode, useMemo } from 'react';
import { AuthProvider } from '@/core/contexts/auth';
import { ThemeProvider } from '@/core/contexts/theme';
import { EditorStateProvider, useEditorState } from '@/contexts/editor/EditorStateProvider';
import { FunnelDataProvider, useFunnelData } from '@/contexts/funnel/FunnelDataProvider';
import { NavigationProvider, useNavigation } from '@/contexts/navigation/NavigationProvider';

interface SimpleAppProviderProps {
    children: ReactNode;
    enableEditor?: boolean; // ativa camada de editor
    enableFunnel?: boolean; // força dados de funil mesmo sem editor
}

export const SimpleAppProvider: React.FC<SimpleAppProviderProps> = ({
    children,
    enableEditor = false,
    enableFunnel = false,
}) => {
    // Composição condicional: reduz montagem desnecessária
    const composed = useMemo(() => {
        let content = children;
        if (enableEditor) {
            content = (
                <NavigationProvider>
                    <FunnelDataProvider>
                        <EditorStateProvider>
                            {content}
                        </EditorStateProvider>
                    </FunnelDataProvider>
                </NavigationProvider>
            );
        } else if (enableFunnel) {
            content = (
                <FunnelDataProvider>
                    {content}
                </FunnelDataProvider>
            );
        }
        return content;
    }, [children, enableEditor, enableFunnel]);

    return (
        <AuthProvider>
            <ThemeProvider>
                {composed}
            </ThemeProvider>
        </AuthProvider>
    );
};

// Hook unificado mínimo para casos que precisam acessar somente camada essencial
export function useSimpleApp() {
    const editor = (() => {
        try { return useEditorState(); } catch { return null; }
    })();
    const funnel = (() => {
        try { return useFunnelData(); } catch { return null; }
    })();
    const navigation = (() => {
        try { return useNavigation(); } catch { return null; }
    })();

    return { editor, funnel, navigation };
}

export default SimpleAppProvider;