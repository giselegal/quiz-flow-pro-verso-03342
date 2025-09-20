import React from 'react';
import { EditorProvider } from '../EditorProvider';
import ModularEditorPro from './components/ModularEditorPro';

interface EditorProProps {
    funnelId?: string;
}

/**
 * 🎯 EDITOR PRO - Componente Principal
 * 
 * Wrapper do ModularEditorPro que fornece:
 * ✅ EditorProvider com contexto global
 * ✅ Integração com funnelId da URL
 * ✅ Container principal com layout
 * ✅ Fallbacks de erro
 */
const EditorPro: React.FC<EditorProProps> = ({ funnelId }) => {
    console.log('🎯 EditorPro: Inicializando com funnelId:', funnelId);

    // Usar storageKey distinto para evitar reutilizar drafts antigos quando criando novo funil
    const storageKey = funnelId ? `editor-${funnelId}` : 'editor-new-funnel';

    return (
        <div className="editor-pro-main-container h-full w-full">
            <EditorProvider funnelId={funnelId} enableSupabase={false} storageKey={storageKey} initial={{ stepBlocks: {}, currentStep: 1 }}>
                <div className="editor-pro-inner h-full w-full bg-gray-900">
                    <ModularEditorPro />
                </div>
            </EditorProvider>
        </div>
    );
};

export default EditorPro;