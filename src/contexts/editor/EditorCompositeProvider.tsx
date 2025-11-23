import React, { ReactNode, useMemo } from 'react';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { UnifiedCRUDProvider } from '@/contexts/data/UnifiedCRUDProvider';
import { EditorProvider } from './EditorContext';
import { EditorQuizProvider } from './EditorQuizContext';
import { FunnelDataProvider } from '@/contexts/funnel/FunnelDataProvider';
import { appLogger } from '@/lib/utils/appLogger';

export interface EditorCompositeProviderProps {
    children: ReactNode;
    funnelId?: string;
    enableSupabase?: boolean;
    storageKey?: string;
    debugMode?: boolean;
}

interface EditorCompositeConfig {
    funnelId: string;
    enableSupabase: boolean;
    storageKey: string;
    debugMode: boolean;
}

export const EditorSupabaseConfigContext = React.createContext<EditorCompositeConfig | null>(null);

export const EditorCompositeProvider: React.FC<EditorCompositeProviderProps> = ({
    children,
    funnelId = 'default-funnel',
    enableSupabase = true,
    storageKey,
    debugMode = false,
}) => {
    const config = useMemo<EditorCompositeConfig>(() => ({
        funnelId,
        enableSupabase,
        storageKey: storageKey || `editor_supabase_${funnelId}`,
        debugMode,
    }), [funnelId, enableSupabase, storageKey, debugMode]);

    if (debugMode) {
        appLogger.info('[EditorCompositeProvider] debug config', { data: [config] });
    }

    return (
        <EditorSupabaseConfigContext.Provider value={config}>
            <FunnelDataProvider>
                <UnifiedCRUDProvider
                    funnelId={config.funnelId}
                    autoLoad={config.enableSupabase}
                    debug={config.debugMode}
                    context={FunnelContext.EDITOR}
                >
                    <EditorQuizProvider>
                        <EditorProvider funnelId={config.funnelId}>
                            {children}
                        </EditorProvider>
                    </EditorQuizProvider>
                </UnifiedCRUDProvider>
            </FunnelDataProvider>
        </EditorSupabaseConfigContext.Provider>
    );
};

export const useEditorSupabaseConfig = () => {
    const ctx = React.useContext(EditorSupabaseConfigContext);
    if (!ctx) {
        throw new Error('useEditorSupabaseConfig must be used within EditorCompositeProvider');
    }
    return ctx;
};

export default EditorCompositeProvider;
