/**
 * 🎯 EDITOR PRO CONSOLIDADO - PRODUÇÃO
 * 
 * Editor consolidado com stack completo de providers unificado que combina:
 * ✅ Arquitetura robusta do EditorPro
 * ✅ Provider stack consolidado (EditorRuntimeProviders)
 * ✅ Carregamento otimizado das 21 etapas
 * ✅ Sistema unificado de contextos
 */

import React from 'react';
import UniversalStepEditorPro from '@/components/editor/universal/UniversalStepEditorPro';
import { EditorRuntimeProviders } from '@/contexts';

const UniversalStepEditorProDemo: React.FC = () => {
    const handleStepChange = (stepId: string) => {
        console.log('🎯 Editor Pro: Step changed to:', stepId);
    };

    return (
        <EditorRuntimeProviders
            initialStep={1}
            debugMode={false}
            supabaseConfig={{
                enabled: true,
                funnelId: 'quiz-style-21-steps',
                quizId: 'quiz-style-21-steps',
                storageKey: 'quiz-21-steps-editor-state'
            }}
        >
            <div className="w-full h-screen overflow-hidden bg-background">
                <UniversalStepEditorPro
                    stepNumber={1}
                    onStepChange={handleStepChange}
                    showNavigation={true}
                />
            </div>
        </EditorRuntimeProviders>
    );
};

export default UniversalStepEditorProDemo;