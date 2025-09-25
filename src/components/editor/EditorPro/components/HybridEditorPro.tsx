/**
 * 🚀 HYBRID EDITOR PRO - WRAPPER COM PROVIDERS
 * 
 * Componente wrapper que configura todos os providers necessários
 * para o HybridModularEditorPro funcionar perfeitamente
 */

import React from 'react';
import { EditorProvider } from '@/context/EditorContext';
import { UnifiedDndProvider } from '@/components/editor/dnd/UnifiedDndProvider';
import UnifiedCRUDProvider from '@/context/UnifiedCRUDProvider';
import HybridModularEditorPro from './HybridModularEditorPro';

interface HybridEditorProProps {
    funnelId?: string;
    showProFeatures?: boolean;
    enableAI?: boolean;
    enableCRUD?: boolean;
    className?: string;
}

/**
 * 🎯 HYBRID EDITOR PRO - O MELHOR DOS DOIS MUNDOS
 * 
 * Combina:
 * ✅ ModularEditorPro: Base arquitetural + APIPropertiesPanel + Performance
 * ✅ ModernUnifiedEditor: IA Assistant + CRUD + Toolbar Moderna + Status Bar
 * 
 * Providers Stack:
 * - UnifiedCRUDProvider (se enableCRUD = true)
 * - EditorProvider (base do ModularEditorPro)  
 * - UnifiedDndProvider (drag & drop)
 * - HybridModularEditorPro (editor híbrido)
 */
const HybridEditorPro: React.FC<HybridEditorProProps> = ({
    funnelId,
    showProFeatures = true,
    enableAI = true,
    enableCRUD = true,
    className = ''
}) => {
    console.log('🚀 HybridEditorPro: Inicializando editor híbrido:', {
        funnelId,
        showProFeatures,
        enableAI,
        enableCRUD
    });

    const editorFunnelId = funnelId || 'hybrid-editor-default';

    // Se CRUD estiver desabilitado, usar só os providers básicos
    if (!enableCRUD) {
        return (
            <EditorProvider funnelId={editorFunnelId}>
                <UnifiedDndProvider>
                    <HybridModularEditorPro
                        funnelId={funnelId}
                        showProFeatures={showProFeatures}
                        enableAI={enableAI}
                        enableCRUD={false}
                        className={className}
                    />
                </UnifiedDndProvider>
            </EditorProvider>
        );
    }

    // Stack completo com CRUD
    return (
        <UnifiedCRUDProvider
            funnelId={editorFunnelId}
            autoLoad={true}
            debug={false}
        >
            <EditorProvider funnelId={editorFunnelId}>
                <UnifiedDndProvider>
                    <HybridModularEditorPro
                        funnelId={funnelId}
                        showProFeatures={showProFeatures}
                        enableAI={enableAI}
                        enableCRUD={true}
                        className={className}
                    />
                </UnifiedDndProvider>
            </EditorProvider>
        </UnifiedCRUDProvider>
    );
};

export default HybridEditorPro;