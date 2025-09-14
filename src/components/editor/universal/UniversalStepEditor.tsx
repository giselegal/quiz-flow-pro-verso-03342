/**
 * 🎯 UNIVERSAL STEP EDITOR - VERSÃO FUNCIONAL COM 4 COLUNAS
 * 
 * Editor visual universal com layout de 4 colunas e renderização real
 */

import React from 'react';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';

export interface UniversalStepEditorProps {
    stepId: string;
    stepNumber: number;
    funnelId?: string;
    onStepChange?: (stepId: string) => void;
    onSave?: (stepId: string, data: any) => void;
    readOnly?: boolean;
    showNavigation?: boolean;
}

const UniversalStepEditor: React.FC<UniversalStepEditorProps> = ({
    stepId = 'step-1',
    stepNumber = 1,
    funnelId = 'quiz-21-steps-complete',
    onStepChange,
    onSave,
    readOnly = false,
    showNavigation = true
}) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [currentStepData, setCurrentStepData] = React.useState<any>(null);

    // Carregar dados do step atual
    React.useEffect(() => {
        const loadStepData = () => {
            try {
                // Buscar dados do step no template
                const stepData = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId];
                if (stepData) {
                    setCurrentStepData(stepData);
                    console.log('✅ Dados do step carregados:', stepId, stepData);
                } else {
                    console.warn('⚠️ Step não encontrado:', stepId);
                    setCurrentStepData({
                        blocks: [],
                        name: `Step ${stepNumber}`,
                        description: `Conteúdo do step ${stepNumber}`
                    });
                }
            } catch (error) {
                console.error('❌ Erro ao carregar step:', error);
                setCurrentStepData({
                    blocks: [],
                    name: `Step ${stepNumber} (Erro)`,
                    description: 'Erro ao carregar conteúdo'
                });
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(loadStepData, 500);
        return () => clearTimeout(timer);
    }, [stepId, stepNumber]);

    const handleNext = () => {
        if (stepNumber < 21) {
            const nextStepId = `step-${stepNumber + 1}`;
            onStepChange?.(nextStepId);
        }
    };

    const handlePrevious = () => {
        if (stepNumber > 1) {
            const prevStepId = `step-${stepNumber - 1}`;
            onStepChange?.(prevStepId);
        }
    };

    const handleSave = () => {
        const saveData = {
            stepId,
            stepNumber,
            data: currentStepData,
            timestamp: Date.now()
        };
        onSave?.(stepId, saveData);
        console.log('✅ Step salvo:', saveData);
    };

    // Renderizar componente visual baseado no tipo
    const renderComponent = (component: any, index: number) => {
        const { type, props } = component;

        switch (type) {
            case 'HeaderSection':
                return (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">📋 Header</h3>
                            <span className="text-xs text-gray-500">HeaderSection</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                                <h2 className="text-2xl font-bold text-gray-900">{props?.title || 'Título do Step'}</h2>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
                                <p className="text-gray-600">{props?.subtitle || 'Subtítulo do step'}</p>
                            </div>
                        </div>
                    </div>
                );

            case 'UserInfoSection':
                return (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">👤 Informações do Usuário</h3>
                            <span className="text-xs text-gray-500">UserInfoSection</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold">👤</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Nome do Usuário</p>
                                    <p className="text-sm text-gray-500">Informações personalizadas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'ProgressSection':
                return (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">📊 Progresso</h3>
                            <span className="text-xs text-gray-500">ProgressSection</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Step {stepNumber} de 21</span>
                                <span className="text-sm font-medium text-gray-900">{Math.round((stepNumber / 21) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                    style={{ width: `${(stepNumber / 21) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                );

            case 'MainImageSection':
                return (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">🖼️ Imagem Principal</h3>
                            <span className="text-xs text-gray-500">MainImageSection</span>
                        </div>
                        <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-4xl mb-2">🖼️</div>
                                <p className="text-gray-500">Imagem do Step {stepNumber}</p>
                            </div>
                        </div>
                    </div>
                );

            case 'QuestionSection':
                return (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">❓ Pergunta</h3>
                            <span className="text-xs text-gray-500">QuestionSection</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 mb-3">
                                    {props?.question || `Pergunta do Step ${stepNumber}?`}
                                </h4>
                                <div className="space-y-2">
                                    {(props?.options || ['Opção A', 'Opção B', 'Opção C']).map((option: string, optIndex: number) => (
                                        <label key={optIndex} className="flex items-center space-x-3">
                                            <input 
                                                type="radio" 
                                                name={`question-${index}`}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <span className="text-gray-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">🧩 Componente Genérico</h3>
                            <span className="text-xs text-gray-500">{type}</span>
                        </div>
                        <p className="text-gray-600">Tipo: {type}</p>
                        <pre className="text-xs text-gray-500 mt-2 bg-gray-100 p-2 rounded overflow-auto">
                            {JSON.stringify(props, null, 2)}
                        </pre>
                    </div>
                );
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando Step {stepNumber}...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                        {currentStepData?.name || `Step ${stepNumber}`}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {currentStepData?.description || `Conteúdo do step ${stepNumber}`}
                    </p>
                </div>
                
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleSave}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        💾 Salvar
                    </button>
                </div>
            </div>

            {/* Layout de 4 Colunas */}
            <div className="flex-1 flex">
                {/* Coluna 1: Navegação / Estrutura */}
                <div className="w-64 bg-white border-r border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🗂️ Estrutura</h3>
                    
                    <div className="space-y-2">
                        {Array.from({ length: 21 }, (_, i) => i + 1).map((num) => (
                            <button
                                key={num}
                                onClick={() => onStepChange?.(`step-${num}`)}
                                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                                    num === stepNumber 
                                        ? 'bg-blue-100 text-blue-800 font-medium' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                Step {num}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Coluna 2: Componentes Disponíveis */}
                <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🧩 Componentes</h3>
                    
                    <div className="space-y-3">
                        <div className="bg-white rounded-lg p-3 border border-gray-200 cursor-pointer hover:bg-gray-50">
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">📋</span>
                                <div>
                                    <p className="font-medium text-gray-900">Header</p>
                                    <p className="text-xs text-gray-500">Título e subtítulo</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-gray-200 cursor-pointer hover:bg-gray-50">
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">👤</span>
                                <div>
                                    <p className="font-medium text-gray-900">User Info</p>
                                    <p className="text-xs text-gray-500">Informações do usuário</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-gray-200 cursor-pointer hover:bg-gray-50">
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">📊</span>
                                <div>
                                    <p className="font-medium text-gray-900">Progress</p>
                                    <p className="text-xs text-gray-500">Barra de progresso</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-gray-200 cursor-pointer hover:bg-gray-50">
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">🖼️</span>
                                <div>
                                    <p className="font-medium text-gray-900">Image</p>
                                    <p className="text-xs text-gray-500">Imagem principal</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-gray-200 cursor-pointer hover:bg-gray-50">
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">❓</span>
                                <div>
                                    <p className="font-medium text-gray-900">Question</p>
                                    <p className="text-xs text-gray-500">Pergunta com opções</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coluna 3: Editor Visual Principal */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                🎯 Preview - Step {stepNumber}
                            </h2>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">ID:</span>
                                <span className="text-sm font-mono text-gray-700">{stepId}</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {currentStepData?.blocks && currentStepData.blocks.length > 0 ? (
                                currentStepData.blocks.map((block: any, index: number) => (
                                    renderComponent(block, index)
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🎯</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Step {stepNumber}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {currentStepData?.description || 'Arrastar componentes para começar a editar'}
                                    </p>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500">
                                            Funil: {funnelId} | ID: {stepId}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Coluna 4: Propriedades */}
                <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Propriedades</h3>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nome do Step
                            </label>
                            <input
                                type="text"
                                defaultValue={currentStepData?.name || `Step ${stepNumber}`}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                readOnly={readOnly}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descrição
                            </label>
                            <textarea
                                defaultValue={currentStepData?.description || `Conteúdo do step ${stepNumber}`}
                                rows={3}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                readOnly={readOnly}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo do Step
                            </label>
                            <select 
                                defaultValue="quiz-question"
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                disabled={readOnly}
                            >
                                <option value="intro">Introdução</option>
                                <option value="quiz-question">Pergunta Quiz</option>
                                <option value="strategic-question">Pergunta Estratégica</option>
                                <option value="result">Resultado</option>
                            </select>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Dados Brutos</h4>
                            <pre className="text-xs bg-gray-100 p-3 rounded-md overflow-auto max-h-40">
                                {JSON.stringify(currentStepData, null, 2)}
                            </pre>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Estatísticas</h4>
                            <div className="bg-gray-50 rounded-md p-3 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Componentes:</span>
                                    <span className="text-sm font-medium">{currentStepData?.blocks?.length || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Progresso:</span>
                                    <span className="text-sm font-medium">{Math.round((stepNumber / 21) * 100)}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Step:</span>
                                    <span className="text-sm font-medium">{stepNumber}/21</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Footer */}
            {showNavigation && (
                <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={handlePrevious}
                        disabled={stepNumber <= 1}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                        <span>←</span>
                        <span>Step {stepNumber - 1}</span>
                    </button>
                    
                    <div className="text-center">
                        <span className="text-sm text-gray-500">Step {stepNumber} de 21</span>
                        <div className="w-32 bg-gray-200 rounded-full h-1 mt-1">
                            <div 
                                className="bg-blue-600 h-1 rounded-full transition-all duration-300" 
                                style={{ width: `${(stepNumber / 21) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleNext}
                        disabled={stepNumber >= 21}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                        <span>Step {stepNumber + 1}</span>
                        <span>→</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UniversalStepEditor;