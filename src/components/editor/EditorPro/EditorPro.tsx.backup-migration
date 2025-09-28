import React from 'react';
// ✅ CONSOLIDADO: Sistema unificado com EditorProvider
import { EditorProvider } from '@/context/EditorContext';
import { UnifiedDndProvider } from '@/components/editor/dnd/UnifiedDndProvider';
import ModularEditorPro from './components/ModularEditorPro';

interface EditorProProps {
    funnelId?: string;
}

/**
 * 🎯 EDITOR PRO - Componente Principal CONSOLIDADO
 * 
 * ✅ CONSOLIDADO COM SISTEMA UNIFICADO:
 * - EditorProvider único (substitui PureBuilderProvider)
 * - UnifiedDndProvider para drag & drop
 * - 21 etapas funcionais garantidas
 * - Interface mantida
 * - Performance superior
 * - Arquitetura limpa
 */
const EditorPro: React.FC<EditorProProps> = ({ funnelId }) => {
    console.log('⚡️ EditorPro: Inicializando CONSOLIDADO, funnelId:', funnelId);

    const editorFunnelId = funnelId || 'quiz-21-steps-consolidated';

    return (
        <div className="editor-pro-main-container h-full w-full">
            <EditorProvider funnelId={editorFunnelId}>
                <UnifiedDndProvider>
                    <div className="editor-pro-inner h-full w-full bg-gray-900">
                        <ModularEditorPro />
                    </div>
                </UnifiedDndProvider>
            </EditorProvider>
        </div>
    );
};

export default EditorPro;