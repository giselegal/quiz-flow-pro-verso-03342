/**
 * 🎯 INTEGRAÇÃO DO SISTEMA CANVAS COM EDITOR ATUAL
 * 
 * Demonstra como o sistema canvas se integraria com nosso QuizFunnelEditor atual
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useUnifiedCRUD } from '@/context/UnifiedCRUDProvider';
import { CanvasStep, CanvasItem, convertStepToCanvas, createCanvasItem } from './CanvasSystem';
import { VerticalCanvas } from './CanvasSystem';

// =============================================================================
// EDITOR CANVAS INTEGRADO
// =============================================================================

interface CanvasIntegratedEditorProps {
    funnelId?: string;
    templateId?: string;
}

export const CanvasIntegratedEditor: React.FC<CanvasIntegratedEditorProps> = ({
    funnelId,
    templateId
}) => {
    const crud = useUnifiedCRUD();

    // Estados do canvas
    const [canvasSteps, setCanvasSteps] = useState<CanvasStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [selectedItemId, setSelectedItemId] = useState<string>('');
    const [isEditMode, setIsEditMode] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Carregar e converter steps existentes para canvas
    useEffect(() => {
        if (!crud.currentFunnel) return;

        const existingSteps = (crud.currentFunnel as any)?.quizSteps || [];

        if (existingSteps.length > 0) {
            // Converter steps existentes para formato canvas
            const converted = existingSteps.map((step: any) => convertStepToCanvas(step));
            setCanvasSteps(converted);
        } else {
            // Criar step inicial se não existir
            const initialStep: CanvasStep = {
                stepId: 'intro-step',
                stepType: 'intro',
                canvasItems: [
                    createCanvasItem('heading', 0, {
                        text: 'Bem-vindo ao Quiz',
                        level: 1,
                        alignment: 'center'
                    }),
                    createCanvasItem('input', 1, {
                        label: 'Como posso te chamar?',
                        placeholder: 'Digite seu nome...',
                        required: true
                    }),
                    createCanvasItem('button', 2, {
                        text: 'Começar',
                        variant: 'primary',
                        fullWidth: true
                    })
                ],
                stepConfig: {
                    title: 'Introdução',
                    description: 'Step inicial do quiz'
                }
            };
            setCanvasSteps([initialStep]);
        }
    }, [crud.currentFunnel]);

    const currentStep = canvasSteps[currentStepIndex];

    // Handlers do canvas
    const handleItemSelect = useCallback((itemId: string) => {
        setSelectedItemId(itemId);
    }, []);

    const handleItemUpdate = useCallback((itemId: string, updates: Partial<CanvasItem>) => {
        setCanvasSteps(prev => prev.map((step, index) =>
            index === currentStepIndex
                ? {
                    ...step,
                    canvasItems: step.canvasItems.map(item =>
                        item.id === itemId ? { ...item, ...updates } : item
                    )
                }
                : step
        ));
    }, [currentStepIndex]);

    const handleItemAdd = useCallback((type: CanvasItem['type'], afterIndex?: number) => {
        const newOrder = afterIndex !== undefined ? afterIndex + 1 : currentStep.canvasItems.length;

        const defaultData = {
            heading: { text: 'Novo Título', level: 2, alignment: 'center' },
            image: { src: 'https://via.placeholder.com/400x300', alt: 'Nova imagem' },
            input: { label: 'Novo Campo', placeholder: 'Digite aqui...', required: false },
            button: { text: 'Próximo', variant: 'primary', fullWidth: true },
            text: { content: 'Novo parágrafo de texto...', fontSize: 'base' },
            divider: { style: 'solid', color: 'gray', thickness: 1 },
            spacer: { height: '20px' }
        };

        const newItem = createCanvasItem(type, newOrder, defaultData[type] || {});

        setCanvasSteps(prev => prev.map((step, index) =>
            index === currentStepIndex
                ? {
                    ...step,
                    canvasItems: [
                        ...step.canvasItems.map(item =>
                            item.order >= newOrder ? { ...item, order: item.order + 1 } : item
                        ),
                        newItem
                    ]
                }
                : step
        ));

        setSelectedItemId(newItem.id);
    }, [currentStep, currentStepIndex]);

    const handleItemDelete = useCallback((itemId: string) => {
        setCanvasSteps(prev => prev.map((step, index) =>
            index === currentStepIndex
                ? {
                    ...step,
                    canvasItems: step.canvasItems.filter(item => item.id !== itemId)
                }
                : step
        ));

        if (selectedItemId === itemId) {
            setSelectedItemId('');
        }
    }, [currentStepIndex, selectedItemId]);

    const handleItemReorder = useCallback((fromIndex: number, toIndex: number) => {
        setCanvasSteps(prev => prev.map((step, index) => {
            if (index !== currentStepIndex) return step;

            const items = [...step.canvasItems].sort((a, b) => a.order - b.order);
            const [movedItem] = items.splice(fromIndex, 1);
            items.splice(toIndex, 0, movedItem);

            const reorderedItems = items.map((item, idx) => ({
                ...item,
                order: idx
            }));

            return { ...step, canvasItems: reorderedItems };
        }));
    }, [currentStepIndex]);

    // Salvar alterações
    const handleSave = useCallback(async () => {
        if (!crud.currentFunnel) return;

        setIsSaving(true);
        try {
            // Converter canvas steps de volta para formato original
            const convertedSteps = canvasSteps.map(canvasStep => ({
                id: canvasStep.stepId,
                type: canvasStep.stepType,
                title: canvasStep.canvasItems.find(i => i.type === 'heading')?.data.text || canvasStep.stepConfig.title,
                image: canvasStep.canvasItems.find(i => i.type === 'image')?.data.src,
                formQuestion: canvasStep.canvasItems.find(i => i.type === 'input')?.data.label,
                placeholder: canvasStep.canvasItems.find(i => i.type === 'input')?.data.placeholder,
                buttonText: canvasStep.canvasItems.find(i => i.type === 'button')?.data.text,
                // Preservar outras propriedades do step original
                ...canvasStep.stepConfig
            }));

            const updated = { ...crud.currentFunnel, quizSteps: convertedSteps };
            crud.setCurrentFunnel(updated);
            await crud.saveFunnel(updated);

            console.log('✅ Canvas salvo com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao salvar canvas:', error);
        } finally {
            setIsSaving(false);
        }
    }, [canvasSteps, crud]);

    // Adicionar novo step
    const handleAddStep = () => {
        const newStep: CanvasStep = {
            stepId: `step-${Date.now()}`,
            stepType: 'question',
            canvasItems: [
                createCanvasItem('heading', 0, {
                    text: 'Nova Pergunta',
                    level: 2,
                    alignment: 'center'
                }),
                createCanvasItem('button', 1, {
                    text: 'Continuar',
                    variant: 'primary',
                    fullWidth: true
                })
            ],
            stepConfig: {
                title: `Step ${canvasSteps.length + 1}`,
                description: 'Novo step do quiz'
            }
        };

        setCanvasSteps(prev => [...prev, newStep]);
        setCurrentStepIndex(canvasSteps.length);
    };

    if (!currentStep) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                        Nenhum step carregado
                    </h3>
                    <button
                        onClick={handleAddStep}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Criar Primeiro Step
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="canvas-integrated-editor h-full flex flex-col">
            {/* Header com controles */}
            <div className="bg-white border-b p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h2 className="font-semibold">Canvas Editor - Step {currentStepIndex + 1}</h2>
                    <div className="flex gap-2">
                        {canvasSteps.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentStepIndex(index)}
                                className={`px-3 py-1 rounded text-sm ${index === currentStepIndex
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={handleAddStep}
                            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                        >
                            + Step
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsEditMode(!isEditMode)}
                        className={`px-3 py-1 rounded text-sm ${isEditMode
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-200'
                            }`}
                    >
                        {isEditMode ? '📝 Editando' : '👁️ Preview'}
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`px-4 py-1 rounded text-sm ${isSaving
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        {isSaving ? '💾 Salvando...' : '💾 Salvar'}
                    </button>
                </div>
            </div>

            {/* Corpo principal */}
            <div className="flex-1 flex">
                {/* Sidebar de componentes */}
                {isEditMode && (
                    <div className="w-64 bg-gray-50 border-r p-4">
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">Adicionar Componentes</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleItemAdd('heading')}
                                        className="w-full p-2 bg-blue-100 hover:bg-blue-200 rounded text-sm text-left"
                                    >
                                        📝 Título
                                    </button>
                                    <button
                                        onClick={() => handleItemAdd('image')}
                                        className="w-full p-2 bg-green-100 hover:bg-green-200 rounded text-sm text-left"
                                    >
                                        🖼️ Imagem
                                    </button>
                                    <button
                                        onClick={() => handleItemAdd('input')}
                                        className="w-full p-2 bg-yellow-100 hover:bg-yellow-200 rounded text-sm text-left"
                                    >
                                        📝 Campo de Entrada
                                    </button>
                                    <button
                                        onClick={() => handleItemAdd('button')}
                                        className="w-full p-2 bg-purple-100 hover:bg-purple-200 rounded text-sm text-left"
                                    >
                                        🔘 Botão
                                    </button>
                                    <button
                                        onClick={() => handleItemAdd('text')}
                                        className="w-full p-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-left"
                                    >
                                        📄 Texto
                                    </button>
                                    <button
                                        onClick={() => handleItemAdd('spacer')}
                                        className="w-full p-2 bg-indigo-100 hover:bg-indigo-200 rounded text-sm text-left"
                                    >
                                        📏 Espaçador
                                    </button>
                                </div>
                            </div>

                            {/* Estrutura do step atual */}
                            <div>
                                <h3 className="font-semibold mb-2">Estrutura</h3>
                                <div className="space-y-1 text-sm">
                                    {currentStep.canvasItems
                                        .sort((a, b) => a.order - b.order)
                                        .map((item, index) => (
                                            <div
                                                key={item.id}
                                                className={`p-2 rounded cursor-pointer ${selectedItemId === item.id
                                                        ? 'bg-blue-200 border-blue-400'
                                                        : 'bg-white hover:bg-gray-50'
                                                    } border text-xs`}
                                                onClick={() => handleItemSelect(item.id)}
                                            >
                                                {index + 1}. {item.type}
                                                {item.type === 'heading' && ` - "${item.data.text?.slice(0, 20)}"`}
                                                {item.type === 'button' && ` - "${item.data.text}"`}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Canvas principal */}
                <div className="flex-1 bg-white overflow-auto">
                    <VerticalCanvas
                        step={currentStep}
                        isEditable={isEditMode}
                        selectedItemId={selectedItemId}
                        onItemSelect={handleItemSelect}
                        onItemUpdate={handleItemUpdate}
                        onItemReorder={handleItemReorder}
                        onItemAdd={handleItemAdd}
                        onItemDelete={handleItemDelete}
                    />
                </div>
            </div>
        </div>
    );
};

export default CanvasIntegratedEditor;