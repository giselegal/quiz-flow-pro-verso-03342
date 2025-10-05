/**
 * 🎯 EXEMPLO DE USO DO SISTEMA CANVAS
 * 
 * Página de demonstração mostrando como funcionaria o editor canvas
 */

import React from 'react';
import CanvasDemoEditor from '../components/editor/canvas/CanvasDemoEditor';
import CanvasIntegratedEditor from '../components/editor/canvas/CanvasIntegratedEditor';
import UnifiedCRUDProvider from '../context/UnifiedCRUDProvider';

export const CanvasEditorDemoPage: React.FC = () => {
    return (
        <UnifiedCRUDProvider>
            <div className="h-screen bg-gray-100">
                <div className="h-full p-4">
                    <div className="bg-white rounded-lg shadow-lg h-full overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b">
                            <h1 className="text-2xl font-bold text-gray-800">
                                🎨 Demo do Sistema Canvas
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Demonstração prática do novo sistema canvas híbrido
                            </p>
                        </div>

                        {/* Abas de demonstração */}
                        <div className="h-full">
                            <CanvasIntegratedEditor />
                        </div>
                    </div>
                </div>
            </div>
        </UnifiedCRUDProvider>
    );
};

export default CanvasEditorDemoPage;