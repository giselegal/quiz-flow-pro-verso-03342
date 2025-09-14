/**
 * 🎬 UNIVERSAL STEP EDITOR DEMO
 * 
 * Componente de demonstração que mostra o UniversalStepEditor em ação
 * Integração completa: FunnelCore + IndexedDB + Craft.js + Adaptador
 */

import React, { useState } from 'react';
import { UniversalStepEditor } from '@/components/editor/universal/UniversalStepEditor';
import { useUniversalStepEditor } from '@/hooks/useUniversalStepEditor.simple';

// ============================================================================
// COMPONENTE DEMO PRINCIPAL
// ============================================================================

export const UniversalStepEditorDemo: React.FC = () => {
    const [selectedStepId, setSelectedStepId] = useState('step-1');
    const selectedStepNumber = parseInt(selectedStepId.split('-')[1]) || 1;

    // Usar hook personalizado
    const [editorState, editorActions] = useUniversalStepEditor(selectedStepId, {
        autoSave: true,
        autoSaveInterval: 5000, // 5 segundos
        enableSync: true,
        onStepChange: (stepId) => {
            console.log(`📍 Navegou para: ${stepId}`);
            setSelectedStepId(stepId);
        },
        onSave: (stepId, data) => {
            console.log(`💾 Step ${stepId} salvo:`, data);
        },
        onError: (error) => {
            console.error('❌ Erro no editor:', error);
        }
    });

    // ========================================================================
    // HANDLERS
    // ========================================================================

    const handleStepSelect = async (stepId: string) => {
        await editorActions.goToStep(stepId);
    };

    const handleSaveAll = async () => {
        await editorActions.saveStep();
        alert('✅ Step salvo com sucesso!');
    };

    const handleReset = async () => {
        if (confirm('🔄 Resetar step para versão original?')) {
            await editorActions.resetStep();
        }
    };

    const handleExport = () => {
        const data = editorActions.exportStep();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `step-${selectedStepNumber}-export.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = JSON.parse(e.target?.result as string);
                    await editorActions.importStep(data);
                    alert('📥 Step importado com sucesso!');
                } catch (error) {
                    alert('❌ Erro ao importar: ' + error);
                }
            };
            reader.readAsText(file);
        }
    };

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <div className="h-screen bg-gray-100 flex flex-col">
            {/* Header da Demo */}
            <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            🎯 Universal Step Editor
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Sistema modular completo: FunnelCore + IndexedDB + Craft.js
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Status Indicator */}
                        <div className="flex items-center space-x-2">
                            {editorState.isLoading && (
                                <div className="flex items-center text-blue-600">
                                    <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                                    <span className="text-sm">Carregando...</span>
                                </div>
                            )}

                            {editorState.isSaving && (
                                <div className="flex items-center text-green-600">
                                    <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <span className="text-sm">Salvando...</span>
                                </div>
                            )}

                            {editorState.hasUnsavedChanges && !editorState.isSaving && (
                                <div className="flex items-center text-amber-600">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                                    <span className="text-sm">Não salvo</span>
                                </div>
                            )}

                            {!editorState.hasUnsavedChanges && !editorState.isLoading && editorState.lastSaved && (
                                <div className="flex items-center text-green-600">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <span className="text-sm">
                                        Salvo {editorState.lastSaved.toLocaleTimeString()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleSaveAll}
                                disabled={!editorState.hasUnsavedChanges || editorState.isSaving}
                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                💾 Salvar
                            </button>

                            <button
                                onClick={handleReset}
                                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                                🔄 Reset
                            </button>

                            <button
                                onClick={handleExport}
                                className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                            >
                                📤 Export
                            </button>

                            <label className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 cursor-pointer">
                                📥 Import
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleImport}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex">
                {/* Sidebar - Seletor de Steps */}
                <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
                    <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-4">
                            📋 Etapas do Funil (21)
                        </h3>

                        <div className="space-y-1">
                            {Array.from({ length: 21 }, (_, i) => {
                                const stepNum = i + 1;
                                const stepId = `step-${stepNum}`;
                                const isActive = stepId === selectedStepId;
                                const stepName = getStepDisplayName(stepNum);

                                return (
                                    <button
                                        key={stepId}
                                        onClick={() => handleStepSelect(stepId)}
                                        className={`
                                            w-full text-left px-3 py-2 text-sm rounded-md transition-colors
                                            ${isActive
                                                ? 'bg-blue-100 text-blue-900 border-l-4 border-blue-600'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">Step {stepNum}</span>
                                            <span className="text-xs text-gray-500">
                                                {getStepTypeIcon(stepNum)}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 truncate">
                                            {stepName}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 flex flex-col">
                    {editorState.error ? (
                        <div className="p-6 bg-red-50 border-l-4 border-red-400">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Erro no Editor
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        {editorState.error.message}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <UniversalStepEditor
                            stepId={selectedStepId}
                            stepNumber={selectedStepNumber}
                            onStepChange={handleStepSelect}
                            onSave={editorActions.saveStep}
                            showNavigation={true}
                        />
                    )}
                </div>
            </div>

            {/* Footer com Info */}
            <div className="bg-gray-800 text-white px-6 py-3 text-xs">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <span>🏗️ FunnelCore: Ativo</span>
                        <span>💾 IndexedDB: Conectado</span>
                        <span>🎨 Craft.js: {editorState.isLoading ? 'Carregando' : 'Pronto'}</span>
                        <span>🔄 Adaptador: Quiz21Steps → FunnelCore</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span>📊 Componentes: {editorState.funnelStep?.components.length || 0}</span>
                        <span>⏱️ Auto-save: 5s</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

const getStepDisplayName = (stepNumber: number): string => {
    const names: Record<number, string> = {
        1: 'Coleta de Nome',
        2: 'Roupa Favorita',
        3: 'Personalidade',
        4: 'Visual Preferido',
        5: 'Detalhes',
        6: 'Estampas',
        7: 'Casaco',
        8: 'Calça',
        9: 'Sapatos',
        10: 'Acessórios',
        11: 'Tecidos',
        12: 'Transição Estratégica',
        13: 'Auto-percepção',
        14: 'Desafios',
        15: 'Frequência de Dúvidas',
        16: 'Gastos',
        17: 'Valor',
        18: 'Resultados Desejados',
        19: 'Transição Resultado',
        20: 'Resultado Personalizado',
        21: 'Oferta Direta'
    };

    return names[stepNumber] || `Etapa ${stepNumber}`;
};

const getStepTypeIcon = (stepNumber: number): string => {
    if (stepNumber === 1) return '📝'; // Form
    if (stepNumber >= 2 && stepNumber <= 11) return '❓'; // Question
    if (stepNumber === 12 || stepNumber === 19) return '🔄'; // Transition
    if (stepNumber >= 13 && stepNumber <= 18) return '🎯'; // Strategic
    if (stepNumber === 20) return '🏆'; // Result
    if (stepNumber === 21) return '💰'; // Offer
    return '📄';
};

export default UniversalStepEditorDemo;