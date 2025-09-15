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

    return (
        <div className="min-h-screen bg-gray-900">
            <EditorProvider>
                <div className="container mx-auto p-4">
                    <div className="bg-gray-800 rounded-lg overflow-hidden" style={{ height: '80vh' }}>
                        <UniversalStepEditorPro
                            stepNumber={1}
                            onStepChange={handleStepChange}
                            showNavigation={true}
                        />
                    </div>
                </div>
            </EditorProvider>
        </div>
    );
}; 

export default UniversalStepEditorProDemo;