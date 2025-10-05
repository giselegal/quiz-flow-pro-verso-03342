/**
 * 🎯 EDITOR MODULAR INTEGRADO NO SISTEMA PRINCIPAL
 * 
 * Sistema completo de edição modular de quiz integrado na rota /editor:
 * ✅ Componentes modulares independentes 
 * ✅ Drag & Drop com @dnd-kit
 * ✅ Chakra UI integrado
 * ✅ Context e state management
 * ✅ Visual editor completo
 * ✅ Suporte a funnelId dinâmico
 */

import React from 'react';
import { ModularEditorExample } from '@/components/editor/modular/ModularEditorExample';
import { QuizEditorProvider } from '@/context/QuizEditorContext';

interface ModularEditorPageProps {
    funnelId?: string;
}

/**
 * Editor Modular Integrado no Sistema Principal
 * Substitui o editor antigo por sistema modular completo
 */
const ModularEditorPage: React.FC<ModularEditorPageProps> = ({ funnelId }) => {
    return (
        <QuizEditorProvider>
            <div style={{ minHeight: '100vh', width: '100%' }}>
                <ModularEditorExample funnelId={funnelId} />
            </div>
        </QuizEditorProvider>
    );
};

export default ModularEditorPage;