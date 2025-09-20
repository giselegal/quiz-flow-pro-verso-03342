import React from 'react';
// 🚀 SIMPLE BUILDER SYSTEM - Sistema autônomo funcional
import SimpleBuilderProvider from '../SimpleBuilderProviderFixed';
import ModularEditorPro from './components/ModularEditorPro';

interface EditorProProps {
    funnelId?: string;
}

/**
 * 🎯 EDITOR PRO - Componente Principal com BUILDER SYSTEM
 * 
 * ✅ MIGRADO PARA PURE BUILDER SYSTEM:
 * - PureBuilderProvider (usa Builder System completo)
 * - 21 etapas funcionais garantidas
 * - Cálculos automáticos de estilo
 * - Analytics integrado
 * - Otimizações de conversão
 * - Interface idêntica mantida
 * - Performance superior
 */
const EditorPro: React.FC<EditorProProps> = ({ funnelId }) => {
    console.log('�️ EditorPro: Inicializando com BUILDER SYSTEM, funnelId:', funnelId);

    // Usar funnelId para Builder System
    const builderFunnelId = funnelId ? `builder-${funnelId}` : 'builder-quiz-21-steps';

    return (
        <div className="editor-pro-main-container h-full w-full">
            <SimpleBuilderProvider funnelId={builderFunnelId}>
                <div className="editor-pro-inner h-full w-full bg-gray-900">
                    <ModularEditorPro />
                </div>
            </SimpleBuilderProvider>
        </div>
    );
};

export default EditorPro;