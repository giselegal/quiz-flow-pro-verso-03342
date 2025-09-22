/**
 * 🎯 MODULAR V1 EDITOR - IMPLEMENTAÇÃO COMPLETA
 * 
 * Editor baseado na simplicidade da V1 com capacidades de edição modular
 * Usa dados reais do quiz21StepsComplete.ts
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { QuizCalculationEngine, UserAnswer, QuizResult } from './QuizCalculationEngine';
import { NoCodeConfigExtractor } from './NoCodeConfig';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Edit3, Eye, Play, Settings, BarChart3 } from 'lucide-react';

// 🎯 NOVOS BLOCOS SIMPLES PARA SUPORTAR TODAS AS ETAPAS
import SimpleTextBlock from '@/components/blocks/simple/SimpleTextBlock';
import SimpleImageBlock from '@/components/blocks/simple/SimpleImageBlock';
import SimpleDecorativeBarBlock from '@/components/blocks/simple/SimpleDecorativeBarBlock';
import SimpleFormContainerBlock from '@/components/blocks/simple/SimpleFormContainerBlock';
import SimpleLegalNoticeBlock from '@/components/blocks/simple/SimpleLegalNoticeBlock';

// 🏷️ TIPOS
interface ModularStep {
    id: string;
    title: string;
    blocks: any[];
    isQuizStep: boolean;
    isCompleted: boolean;
}

interface EditableBlock {
    id: string;
    type: string;
    content: any;
    properties: any;
    isSelected: boolean;
    isEditing: boolean;
}

/**
 * 🎨 COMPONENTE PRINCIPAL - MODULAR V1 EDITOR
 */
export const ModularV1Editor: React.FC = () => {
    // 📊 Estados principais (simples como na V1)
    const [currentStep, setCurrentStep] = useState(1);
    const [editMode, setEditMode] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

    // 🧮 Sistema de cálculo e configurações
    const [quizEngine] = useState(() => new QuizCalculationEngine());
    const [noCodeConfig] = useState(() => new NoCodeConfigExtractor());
    const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

    // 📝 Dados extraídos do template
    const [steps, setSteps] = useState<ModularStep[]>([]);
    const [questions, setQuestions] = useState<Record<string, any>>({});
    const [imageOptions, setImageOptions] = useState<Record<string, any>>({});

    // 👤 Dados do usuário (como na V1)
    const [userName, setUserName] = useState('');
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

    /**
     * 🚀 Inicialização - Extrai dados do template
     */
    useEffect(() => {
        initializeFromTemplate();
    }, []);

    const initializeFromTemplate = useCallback(() => {
        // Converte template em steps modulares
        const modularSteps: ModularStep[] = Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE).map(([stepId, blocks], index) => {
            const hasQuizGrid = blocks.some(block => block.type === 'options-grid');

            return {
                id: stepId,
                title: getStepTitle(stepId, index + 1),
                blocks: blocks.map(block => ({
                    ...block,
                    isSelected: false,
                    isEditing: false,
                })),
                isQuizStep: hasQuizGrid,
                isCompleted: false,
            };
        });

        setSteps(modularSteps);
        setQuestions(noCodeConfig.extractQuestions());
        setImageOptions(noCodeConfig.extractImageOptions());
    }, [noCodeConfig]);

    /**
     * 🏷️ Obtém título da etapa
     */
    const getStepTitle = (stepId: string, stepNumber: number): string => {
        const titleMap: Record<string, string> = {
            'step-1': 'Introdução',
            'step-2': 'Questão 1 - Tipo de Roupa',
            'step-3': 'Questão 2 - Personalidade',
            'step-4': 'Questão 3 - Visual',
            'step-5': 'Questão 4 - Detalhes',
            'step-6': 'Questão 5 - Estampas',
            'step-7': 'Questão 6 - Casacos',
            'step-8': 'Questão 7 - Calças',
            'step-9': 'Questão 8 - Sapatos',
            'step-10': 'Questão 9 - Acessórios',
            'step-11': 'Questão 10 - Tecidos',
            'step-12': 'Transição - Questões Estratégicas',
            'step-13': 'Questão Estratégica 1',
            'step-14': 'Questão Estratégica 2',
            'step-15': 'Questão Estratégica 3',
            'step-16': 'Questão Estratégica 4',
            'step-17': 'Questão Estratégica 5',
            'step-18': 'Questão Estratégica 6',
            'step-19': 'Transição - Resultado',
            'step-20': 'Página de Resultado',
            'step-21': 'Página de Oferta',
        };

        return titleMap[stepId] || `Etapa ${stepNumber}`;
    };

    /**
     * 🎯 Navegação entre etapas (como na V1)
     */
    const goToStep = (stepNumber: number) => {
        if (stepNumber >= 1 && stepNumber <= steps.length) {
            setCurrentStep(stepNumber);
            setSelectedBlock(null);
        }
    };

    const goToNextStep = () => goToStep(currentStep + 1);
    const goToPreviousStep = () => goToStep(currentStep - 1);

    /**
     * ✍️ Manipulação de respostas do quiz
     */
    const handleQuizAnswer = (stepId: string, optionIds: string[]) => {
        const answer: UserAnswer = {
            questionId: `question_${stepId}`,
            stepId,
            selectedOptions: optionIds,
            timestamp: Date.now(),
        };

        // Registra resposta no engine
        quizEngine.addAnswer(answer);

        // Atualiza estado local
        setUserAnswers(prev => {
            const filtered = prev.filter(a => a.questionId !== answer.questionId);
            return [...filtered, answer];
        });

        // Marca etapa como completa
        setSteps(prev => prev.map(step =>
            step.id === stepId ? { ...step, isCompleted: true } : step
        ));

        console.log(`✅ Resposta registrada para ${stepId}:`, optionIds);
    };

    /**
     * 📊 Calcula resultado final
     */
    const calculateFinalResult = () => {
        const result = quizEngine.calculateResults();
        setQuizResult(result);
        console.log('🎯 Resultado calculado:', result);
        return result;
    };

    /**
     * 🎨 Toggle entre modos
     */
    const toggleEditMode = () => {
        setEditMode(!editMode);
        setSelectedBlock(null);
    };

    const togglePreviewMode = () => {
        setPreviewMode(!previewMode);
        setEditMode(false);
        setSelectedBlock(null);
    };

    /**
     * 🔧 Manipulação de blocos
     */
    const selectBlock = (blockId: string) => {
        if (editMode) {
            setSelectedBlock(selectedBlock === blockId ? null : blockId);
        }
    };

    /**
     * 🎮 Interface principal
     */
    const currentStepData = steps[currentStep - 1];
    const globalConfig = noCodeConfig.getGlobalConfig();
    const progress = Math.round((currentStep / steps.length) * 100);

    if (!currentStepData) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando editor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex bg-gray-50">
            {/* 📱 SIDEBAR DE ETAPAS */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <img
                        src={globalConfig.branding.logo}
                        alt={globalConfig.branding.logoAlt}
                        className="h-8 mb-2"
                    />
                    <h2 className="font-bold text-gray-800">Quiz Editor V1</h2>
                    <p className="text-sm text-gray-600">21 Etapas Modulares</p>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {steps.map((step, index) => (
                        <button
                            key={step.id}
                            onClick={() => goToStep(index + 1)}
                            className={`w-full text-left p-3 mb-1 rounded-lg transition-colors ${currentStep === index + 1
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : 'hover:bg-gray-100 text-gray-700'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-sm">{index + 1}. {step.title}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {step.isQuizStep ? '📊 Quiz' : '📄 Página'}
                                        {step.isCompleted && ' ✅'}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* 📊 Estatísticas */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Progresso:</span>
                            <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Respostas: {userAnswers.length}</span>
                            <span>Etapa {currentStep}/{steps.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🎨 ÁREA PRINCIPAL */}
            <div className="flex-1 flex flex-col">
                {/* 🔧 TOOLBAR */}
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToPreviousStep}
                            disabled={currentStep === 1}
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Anterior
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToNextStep}
                            disabled={currentStep === steps.length}
                        >
                            Próxima
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>

                        <div className="h-6 border-l border-gray-300"></div>

                        <Button
                            variant={editMode ? "default" : "outline"}
                            size="sm"
                            onClick={toggleEditMode}
                        >
                            <Edit3 className="w-4 h-4 mr-1" />
                            {editMode ? 'Sair da Edição' : 'Editar'}
                        </Button>

                        <Button
                            variant={previewMode ? "default" : "outline"}
                            size="sm"
                            onClick={togglePreviewMode}
                        >
                            <Eye className="w-4 h-4 mr-1" />
                            {previewMode ? 'Sair do Preview' : 'Preview'}
                        </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button size="sm" onClick={calculateFinalResult}>
                            <BarChart3 className="w-4 h-4 mr-1" />
                            Calcular Resultado
                        </Button>
                        <Button size="sm" variant="outline">
                            <Settings className="w-4 h-4 mr-1" />
                            Configurações
                        </Button>
                    </div>
                </div>

                {/* 🖼️ CANVAS DE EDIÇÃO */}
                <div className="flex-1 p-6 overflow-auto">
                    <Card className="max-w-4xl mx-auto">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl">
                                    {currentStepData.title}
                                </CardTitle>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <span>ID: {currentStepData.id}</span>
                                    <span>•</span>
                                    <span>{currentStepData.blocks.length} blocos</span>
                                </div>
                            </div>
                            {globalConfig.quiz.showProgress && (
                                <Progress value={progress} className="mt-2" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <EditableCanvas
                                stepData={currentStepData}
                                editMode={editMode}
                                previewMode={previewMode}
                                selectedBlock={selectedBlock}
                                onBlockSelect={selectBlock}
                                onQuizAnswer={handleQuizAnswer}
                                globalConfig={globalConfig}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* 🔧 PAINEL DE PROPRIEDADES */}
            {editMode && selectedBlock && (
                <div className="w-80 bg-white border-l border-gray-200">
                    <PropertiesPanel
                        blockId={selectedBlock}
                        stepData={currentStepData}
                        onBlockUpdate={(blockId, updates) => {
                            console.log('Atualizar bloco:', blockId, updates);
                        }}
                    />
                </div>
            )}

            {/* 📊 MODAL DE RESULTADO */}
            {quizResult && (
                <ResultModal
                    result={quizResult}
                    onClose={() => setQuizResult(null)}
                />
            )}
        </div>
    );
};

/**
 * 🎨 CANVAS EDITÁVEL
 */
interface EditableCanvasProps {
    stepData: ModularStep;
    editMode: boolean;
    previewMode: boolean;
    selectedBlock: string | null;
    onBlockSelect: (blockId: string) => void;
    onQuizAnswer: (stepId: string, optionIds: string[]) => void;
    globalConfig: any;
}

const EditableCanvas: React.FC<EditableCanvasProps> = ({
    stepData,
    editMode,
    previewMode,
    selectedBlock,
    onBlockSelect,
    onQuizAnswer,
    globalConfig,
}) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const handleOptionClick = (optionId: string, isMultiple: boolean) => {
        if (previewMode || editMode) return;

        let newSelection: string[];

        if (isMultiple) {
            newSelection = selectedOptions.includes(optionId)
                ? selectedOptions.filter(id => id !== optionId)
                : [...selectedOptions, optionId];
        } else {
            newSelection = [optionId];
        }

        setSelectedOptions(newSelection);

        // Resposta automática para questões de seleção única
        if (!isMultiple) {
            onQuizAnswer(stepData.id, newSelection);
        }
    };

    return (
        <div className="space-y-6">
            {stepData.blocks.map((block) => (
                <EditableBlock
                    key={block.id}
                    block={block}
                    isSelected={selectedBlock === block.id}
                    editMode={editMode}
                    previewMode={previewMode}
                    onSelect={() => onBlockSelect(block.id)}
                    onQuizAnswer={(optionIds) => onQuizAnswer(stepData.id, optionIds)}
                    selectedOptions={selectedOptions}
                    onOptionClick={handleOptionClick}
                />
            ))}
        </div>
    );
};

/**
 * 🧱 BLOCO EDITÁVEL
 */
interface EditableBlockProps {
    block: any;
    isSelected: boolean;
    editMode: boolean;
    previewMode: boolean;
    onSelect: () => void;
    onQuizAnswer: (optionIds: string[]) => void;
    selectedOptions: string[];
    onOptionClick: (optionId: string, isMultiple: boolean) => void;
}

const EditableBlock: React.FC<EditableBlockProps> = ({
    block,
    isSelected,
    editMode,
    previewMode,
    onSelect,
    selectedOptions,
    onOptionClick,
}) => {
    const renderBlockContent = () => {
        switch (block.type) {
            case 'quiz-intro-header':
                return (
                    <div className="text-center">
                        {block.properties.showLogo && block.properties.logoUrl && (
                            <img
                                src={block.properties.logoUrl}
                                alt={block.properties.logoAlt || 'Logo'}
                                className="h-12 mx-auto mb-4"
                            />
                        )}
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            {block.content.title}
                        </h1>
                        {block.content.subtitle && (
                            <h2 className="text-lg text-gray-600 mb-2">
                                {block.content.subtitle}
                            </h2>
                        )}
                        {block.content.description && (
                            <p className="text-gray-600">
                                {block.content.description}
                            </p>
                        )}
                    </div>
                );

            case 'options-grid':
                const isMultiple = block.properties.multipleSelection;
                const showImages = block.properties.showImages;

                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-center">
                            {block.content.question}
                        </h2>
                        <div className={`grid gap-4 ${(() => {
                            // 🎯 REGRA AUTOMATICA: 1 coluna para texto-only, 2 colunas para imagem+texto
                            const hasImages = showImages && block.content.options?.some((opt: any) =>
                                opt.imageUrl || opt.image
                            );

                            if (!hasImages) {
                                console.log('🎯 ModularV1Editor: Detectado apenas texto → usando 1 coluna');
                                return 'grid-cols-1';
                            }

                            console.log('🎯 ModularV1Editor: Detectado imagens → usando 2 colunas responsivas');
                            return 'grid-cols-1 md:grid-cols-2';
                        })()}`}>
                            {block.content.options?.map((option: any) => (
                                <button
                                    key={option.id}
                                    onClick={() => onOptionClick(option.id, isMultiple)}
                                    disabled={editMode}
                                    className={`p-4 border rounded-lg transition-all duration-300 ${selectedOptions.includes(option.id)
                                        ? 'border-amber-400 bg-gradient-to-b from-amber-50 to-amber-100 shadow-lg ring-1 ring-amber-300/50'
                                        : 'border-gray-200 bg-white hover:border-amber-200 hover:shadow-md'
                                        } ${editMode ? 'cursor-default' : 'cursor-pointer'}`}
                                >
                                    {option.imageUrl && showImages && (
                                        <img
                                            src={option.imageUrl}
                                            alt={option.text}
                                            className="w-full h-32 object-cover rounded mb-2"
                                        />
                                    )}
                                    <p className="text-sm font-medium">{option.text}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 'text-inline':
                return (
                    <div className="text-center">
                        <p className={`${block.properties.fontSize || 'text-base'
                            } ${block.properties.fontWeight || 'font-normal'
                            } ${block.properties.textAlign || 'text-center'
                            }`}
                            style={{ color: block.properties.color }}
                        >
                            {block.content.content}
                        </p>
                    </div>
                );

            case 'button':
                return (
                    <div className="text-center">
                        <Button
                            className="px-8 py-3"
                            style={{
                                backgroundColor: block.properties.backgroundColor,
                                color: block.properties.textColor,
                            }}
                        >
                            {block.content.buttonText}
                        </Button>
                    </div>
                );

            case 'text':
                // Renderizar texto formatado usando componente simples
                return <SimpleTextBlock block={block} isSelected={isSelected} editMode={editMode} onSelect={onSelect} />;

            case 'image':
                // Renderizar imagem usando componente simples
                return <SimpleImageBlock block={block} isSelected={isSelected} editMode={editMode} onSelect={onSelect} />;

            case 'decorative-bar':
                // Renderizar barra decorativa
                return <SimpleDecorativeBarBlock block={block} isSelected={isSelected} editMode={editMode} onSelect={onSelect} />;

            case 'form-container':
                // Renderizar formulário usando componente simples
                return <SimpleFormContainerBlock block={block} isSelected={isSelected} editMode={editMode} previewMode={previewMode} onSelect={onSelect} />;

            case 'legal-notice':
                // Renderizar aviso legal
                return <SimpleLegalNoticeBlock block={block} isSelected={isSelected} editMode={editMode} onSelect={onSelect} />;

            default:
                return (
                    <div className="p-4 bg-gray-100 rounded border-dashed border-2">
                        <p className="text-sm text-gray-600">
                            Tipo de bloco: <code>{block.type}</code>
                        </p>
                        <pre className="text-xs text-gray-500 mt-2 overflow-auto">
                            {JSON.stringify(block.content, null, 2)}
                        </pre>
                    </div>
                );
        }
    };

    return (
        <div
            onClick={onSelect}
            className={`relative transition-all ${editMode
                ? `cursor-pointer border-2 rounded-lg p-2 ${isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-transparent hover:border-gray-300'
                }`
                : ''
                }`}
        >
            {renderBlockContent()}

            {editMode && isSelected && (
                <div className="absolute top-0 right-0 -mt-2 -mr-2">
                    <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                        {block.type}
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * 🔧 PAINEL DE PROPRIEDADES
 */
interface PropertiesPanelProps {
    blockId: string;
    stepData: ModularStep;
    onBlockUpdate: (blockId: string, updates: any) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
    blockId,
    stepData,
    onBlockUpdate,
}) => {
    const block = stepData.blocks.find(b => b.id === blockId);

    if (!block) {
        return (
            <div className="p-4">
                <p className="text-gray-500">Bloco não encontrado</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h3 className="font-bold text-lg mb-4">Propriedades</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Bloco
                    </label>
                    <input
                        type="text"
                        value={block.type}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID do Bloco
                    </label>
                    <input
                        type="text"
                        value={block.id}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Conteúdo (JSON)
                    </label>
                    <textarea
                        value={JSON.stringify(block.content, null, 2)}
                        onChange={(e) => {
                            try {
                                const newContent = JSON.parse(e.target.value);
                                onBlockUpdate(blockId, { content: newContent });
                            } catch (error) {
                                // JSON inválido - não atualiza
                            }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                        rows={8}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Propriedades (JSON)
                    </label>
                    <textarea
                        value={JSON.stringify(block.properties, null, 2)}
                        onChange={(e) => {
                            try {
                                const newProperties = JSON.parse(e.target.value);
                                onBlockUpdate(blockId, { properties: newProperties });
                            } catch (error) {
                                // JSON inválido - não atualiza
                            }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                        rows={6}
                    />
                </div>
            </div>
        </div>
    );
};

/**
 * 📊 MODAL DE RESULTADO
 */
interface ResultModalProps {
    result: QuizResult;
    onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ result, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Resultado do Quiz</h2>
                    <Button variant="outline" size="sm" onClick={onClose}>
                        ✕
                    </Button>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Estilo Primário</h3>
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">{result.primaryStyle.name}</span>
                                <span className="text-blue-600 font-bold">{result.primaryStyle.percentage}%</span>
                            </div>
                            <p className="text-sm text-gray-600">{result.primaryStyle.description}</p>
                        </div>
                    </div>

                    {result.secondaryStyles.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Estilos Secundários</h3>
                            <div className="space-y-2">
                                {result.secondaryStyles.map((style, index) => (
                                    <div key={index} className="p-3 bg-gray-50 rounded">
                                        <div className="flex justify-between">
                                            <span>{style.name}</span>
                                            <span className="font-medium">{style.percentage}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Recomendações</h3>
                        <ul className="space-y-1">
                            {result.personalizedRecommendations.map((rec, index) => (
                                <li key={index} className="text-sm flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModularV1Editor;