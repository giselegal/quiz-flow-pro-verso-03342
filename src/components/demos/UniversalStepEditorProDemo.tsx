/**
 * 🎯 DEMONSTRAÇÃO DO UNIVERSAL STEP EDITOR PRO
 * 
 * Este é um exemplo de como usar o editor híbrido definitivo que combina:
 * ✅ Arquitetura robusta do EditorPro
 * ✅ Painéis de propriedades detalhados do UniversalStepEditor
 * ✅ UX responsivo e modular
 */

import React from 'react';
import UniversalStepEditorPro from '@/components/editor/universal/UniversalStepEditorPro';
import { EditorProvider } from '@/components/editor/EditorProvider';

const UniversalStepEditorProDemo: React.FC = () => {
    const handleStepChange = (stepId: string) => {
        console.log('Step changed to:', stepId);
    };

    const handleSave = (stepId: string, data: any) => {
        console.log('Saving step:', stepId, data);
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <EditorProvider>
                <div className="container mx-auto p-4">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold text-white mb-2">
                            🎯 Universal Step Editor Pro - Versão Híbrida
                        </h1>
                        <p className="text-gray-300">
                            Editor NOCODE profissional com layout 4-colunas, propriedades avançadas,
                            drag & drop robusto, navegação inteligente e UX responsivo.
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg overflow-hidden" style={{ height: '80vh' }}>
                        <UniversalStepEditorPro
                            stepNumber={1}
                            onStepChange={handleStepChange}
                            onSave={handleSave}
                            showNavigation={true}
                        />
                    </div>
                </div>
            </EditorProvider>
        </div>
    );
}; export default UniversalStepEditorProDemo;