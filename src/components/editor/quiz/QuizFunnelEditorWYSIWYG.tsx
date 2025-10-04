import React, { useEffect, useState, useCallback } from 'react';
import { useUnifiedCRUD } from '@/context/UnifiedCRUDProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QUIZ_STEPS, type QuizStep } from '@/data/quizSteps';
import { Plus, Save, Trash2, ArrowUp, ArrowDown, Copy, Eye, ChevronDown, Settings, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import './QuizEditorStyles.css';

// 🎯 SISTEMA DE QUIZ EM PRODUÇÃO - Integração com /quiz-estilo
import { useQuizState } from '@/hooks/useQuizState';
import { useQuizRuntimeRegistry } from '@/runtime/quiz/QuizRuntimeRegistry';
import { useComponentConfiguration } from '@/hooks/useComponentConfiguration';
import IntroStep from '@/components/quiz/IntroStep';
import QuestionStep from '@/components/quiz/QuestionStep';
import StrategicQuestionStep from '@/components/quiz/StrategicQuestionStep';
import TransitionStep from '@/components/quiz/TransitionStep';
import ResultStep from '@/components/quiz/ResultStep';
import OfferStep from '@/components/quiz/OfferStep';
import { BlockRegistryProvider, DEFAULT_BLOCK_DEFINITIONS, useBlockRegistry } from '@/runtime/quiz/blocks/BlockRegistry';
import sanitizeHtml from '@/utils/sanitizeHtml';
import type { QuizConfig } from '@/types/quiz-config';

// � FASE 3: COMPONENTES EDITÁVEIS ENCAPSULADOS - Sistema Modularizado
import {
    EditableIntroStep,
    EditableQuestionStep,
    EditableStrategicQuestionStep,
    EditableTransitionStep,
    EditableResultStep,
    EditableOfferStep,
    type EditableStepProps
} from '@/components/editor/editable-steps';

// 🎯 NOVO: Componentes de Editor Aprimorado
import SelectableBlock from '@/components/editor/SelectableBlock';
import QuizPropertiesPanel from '@/components/editor/QuizPropertiesPanel';
import DragDropManager from '@/components/editor/DragDropManager';

// 🧩 NOVO: Sistema de Componentes Atômicos Modulares
import {
    ModularStepContainer,
    ModularStep,
    AtomicComponent,
    AtomicComponentType,
    createModularStep,
    createAtomicComponent,
    reorderComponents,
    insertComponent,
    removeComponent
} from '@/components/editor/atomic-components';

interface QuizFunnelEditorProps {
    funnelId?: string;
    templateId?: string;
}

type EditableQuizStep = QuizStep & { id: string };

const STEP_TYPES: Array<QuizStep['type']> = [
    'intro', 'question', 'strategic-question', 'transition', 'transition-result', 'result', 'offer'
];

function createBlankStep(type: QuizStep['type']): EditableQuizStep {
    const baseId = `step-${Date.now()}`;
    switch (type) {
        case 'intro':
            return {
                id: baseId,
                type: 'intro',
                title: 'Título de Introdução',
                formQuestion: 'Como posso te chamar?',
                placeholder: 'Seu nome...',
                buttonText: 'Começar',
                nextStep: ''
            };
        case 'question':
            return {
                id: baseId,
                type: 'question',
                questionNumber: 'X de Y',
                questionText: 'Pergunta...',
                requiredSelections: 3,
                options: [
                    { id: 'opt-1', text: 'Opção 1' },
                    { id: 'opt-2', text: 'Opção 2' }
                ],
                nextStep: ''
            };
        case 'strategic-question':
            return {
                id: baseId,
                type: 'strategic-question',
                questionText: 'Pergunta estratégica...',
                options: [
                    { id: 'estr-1', text: 'Resposta A' },
                    { id: 'estr-2', text: 'Resposta B' }
                ],
                nextStep: ''
            };
        case 'transition':
            return { id: baseId, type: 'transition', title: 'Transição...', text: 'Processando...', nextStep: '' };
        case 'transition-result':
            return { id: baseId, type: 'transition-result', title: 'Preparando resultado...', nextStep: '' };
        case 'result':
            return { id: baseId, type: 'result', title: '{userName}, seu estilo é:', nextStep: '' };
        case 'offer':
            return { id: baseId, type: 'offer', offerMap: {}, image: '' };
        default:
            return { id: baseId, type: 'question', questionText: 'Pergunta...', options: [], nextStep: '' };
    }
}

const QuizFunnelEditorWYSIWYG: React.FC<QuizFunnelEditorProps> = ({ funnelId, templateId }) => {
    const crud = useUnifiedCRUD();

    // 🚀 FASE 3: Componentes editáveis já integrados - não precisa registrar steps

    const [steps, setSteps] = useState<EditableQuizStep[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');
    const [selectedBlockId, setSelectedBlockId] = useState<string>(''); // Para seleção de blocos no canvas
    const [isSaving, setIsSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
    const [activeInsertDropdown, setActiveInsertDropdown] = useState<string | null>(null);

    // 🎯 NOVOS: Estados para editor aprimorado
    const [showPropertiesPanel, setShowPropertiesPanel] = useState(true);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [dragEnabled, setDragEnabled] = useState(true);
    const [showProductionView, setShowProductionView] = useState(false);

    // 🧩 NOVOS: Estados para sistema de componentes atômicos
    const [modularSteps, setModularSteps] = useState<ModularStep[]>([]);
    const [selectedComponentId, setSelectedComponentId] = useState<string>('');

    // 🎯 INTEGRAÇÃO COM SISTEMA DE QUIZ EM PRODUÇÃO
    const quizState = useQuizState();
    const quizRegistry = useQuizRuntimeRegistry();
    const componentConfig = useComponentConfiguration({
        componentId: selectedComponentId || 'editor-main',
        funnelId: funnelId || 'quiz-estilo-21-steps',
        realTimeSync: true,
        cacheEnabled: true
    });

    // 🧩 SISTEMA EDITÁVEL MODULAR: Sempre usar componentes atômicos
    useEffect(() => {
        // Verificar se já existem etapas modulares salvas 
        const existing = (crud.currentFunnel as any)?.modularSteps as ModularStep[] | undefined;

        if (existing && existing.length) {
            // Usar etapas modulares existentes
            setModularSteps(existing.map(s => ({ ...s })));
            setSelectedId(existing[0].id);
        } else {
            // Criar as 21 etapas modulares específicas do /quiz-estilo
            const defaultModularSteps: ModularStep[] = [
                // 🏠 ETAPA 1: Introdução - Coleta de Nome
                createModularStep('intro'),

                // ❓ ETAPAS 2-11: 10 Questões de Estilo (3 seleções obrigatórias)
                createModularStep('question'), // Pergunta 1: Ocasiões
                createModularStep('question'), // Pergunta 2: Cores 
                createModularStep('question'), // Pergunta 3: Silhuetas
                createModularStep('question'), // Pergunta 4: Estampas
                createModularStep('question'), // Pergunta 5: Acessórios (Imagens)
                createModularStep('question'), // Pergunta 6: Cabelo e Maquiagem
                createModularStep('question'), // Pergunta 7: Inspirações
                createModularStep('question'), // Pergunta 8: Calçados
                createModularStep('question'), // Pergunta 9: Acessórios (Texto)
                createModularStep('question'), // Pergunta 10: Tecidos

                // ⏳ ETAPA 12: Transição para Questões Estratégicas
                createModularStep('custom'),

                // 🎯 ETAPAS 13-18: 6 Questões Estratégicas (1 seleção obrigatória)
                createModularStep('question'), // Estratégica 1: Prioridades de Vida
                createModularStep('question'), // Estratégica 2: Personalidade
                createModularStep('question'), // Estratégica 3: Lifestyle
                createModularStep('question'), // Estratégica 4: Objetivos de Imagem
                createModularStep('question'), // Estratégica 5: Desafios
                createModularStep('question'), // Estratégica 6: Expectativas

                // ⏳ ETAPA 19: Transição para Resultado
                createModularStep('custom'),

                // 🏆 ETAPA 20: Resultado Personalizado
                createModularStep('result'),

                // 🎁 ETAPA 21: Oferta/Conversão
                createModularStep('custom')
            ];
            setModularSteps(defaultModularSteps);
            setSelectedId(defaultModularSteps[0].id);
        }

        // Sistema modular: sempre usar componentes atômicos por padrão
    }, [crud.currentFunnel]);

    const selectedModularStep = modularSteps.find(s => s.id === selectedId);

    // Função para criar step modular


    const updateStep = useCallback((id: string, patch: Partial<EditableQuizStep>) => {
        setSteps(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));
    }, []);

    const handleStepReorder = useCallback((fromIndex: number, toIndex: number) => {
        setSteps(prev => {
            const reordered = [...prev];
            const [movedStep] = reordered.splice(fromIndex, 1);
            reordered.splice(toIndex, 0, movedStep);
            return reordered;
        });
    }, []);

    const addStepAfter = (afterId?: string, type: QuizStep['type'] = 'question') => {
        setSteps(prev => {
            const idx = afterId ? prev.findIndex(s => s.id === afterId) : prev.length - 1;
            const newStep = createBlankStep(type);
            const clone = [...prev];
            clone.splice(idx + 1, 0, newStep);
            // Selecionar automaticamente o novo step
            setSelectedId(newStep.id);
            return clone;
        });
    };

    const addStepBefore = (beforeId: string, type: QuizStep['type'] = 'question') => {
        setSteps(prev => {
            const idx = prev.findIndex(s => s.id === beforeId);
            if (idx === -1) return prev;
            const newStep = createBlankStep(type);
            const clone = [...prev];
            clone.splice(idx, 0, newStep);
            // Selecionar automaticamente o novo step
            setSelectedId(newStep.id);
            return clone;
        });
    };

    const addStepAtEnd = (type: QuizStep['type'] = 'question') => {
        const newStep = createBlankStep(type);
        setSteps(prev => [...prev, newStep]);
        setSelectedId(newStep.id);
    };

    const removeStep = (id: string) => {
        setSteps(prev => {
            const filtered = prev.filter(s => s.id !== id);
            if (selectedId === id && filtered.length > 0) {
                setSelectedId(filtered[0].id);
            }
            return filtered;
        });
    };

    const moveStep = (id: string, direction: number) => {
        setSteps(prev => {
            const idx = prev.findIndex(s => s.id === id);
            if (idx === -1) return prev;
            const newIdx = idx + direction;
            if (newIdx < 0 || newIdx >= prev.length) return prev;
            const clone = [...prev];
            [clone[idx], clone[newIdx]] = [clone[newIdx], clone[idx]];
            return clone;
        });
    };

    const duplicateStep = (id: string) => {
        setSteps(prev => {
            const idx = prev.findIndex(s => s.id === id);
            if (idx === -1) return prev;
            const original = prev[idx];
            const duplicate = { ...original, id: `${original.id}-copy-${Date.now()}` };
            const clone = [...prev];
            clone.splice(idx + 1, 0, duplicate);
            return clone;
        });
    };

    const handleSave = useCallback(async () => {
        if (!crud.currentFunnel) return;
        setIsSaving(true);
        try {
            const updated = { ...crud.currentFunnel, quizSteps: steps };
            crud.setCurrentFunnel(updated);
            await crud.saveFunnel(updated);
        } catch (e) {
            console.error('Erro ao salvar quizSteps', e);
        } finally {
            setIsSaving(false);
        }
    }, [steps, crud]);

    // 🎯 NOVOS: Callbacks para editor aprimorado
    const handleStepSelect = useCallback((stepId: string) => {
        setSelectedId(stepId);
        setSelectedBlockId(''); // Clear block selection when step changes
    }, []);

    const handleBlockSelect = useCallback((blockId: string) => {
        setSelectedBlockId(blockId);
        // Extract step ID from block ID (format: step-id-type)
        const stepId = blockId.split('-').slice(0, 2).join('-');
        if (stepId && stepId !== selectedId) {
            setSelectedId(stepId);
        }
    }, [selectedId]);



    const handlePropertiesPanelClose = useCallback(() => {
        setShowPropertiesPanel(false);
        setSelectedBlockId('');
    }, []);

    const handleOpenProperties = useCallback((blockId: string) => {
        setSelectedBlockId(blockId);
        setShowPropertiesPanel(true);
    }, []);

    // 🎨 FASE 3: Handler para cliques em propriedades editáveis
    const handlePropertyClick = useCallback((propKey: string, element: HTMLElement, stepId: string) => {
        console.log('[QuizFunnelEditor] Propriedade clicada:', { propKey, stepId, element });

        // Garantir que o step está selecionado
        setSelectedId(stepId);
        setSelectedBlockId(`step-${stepId}`);

        // Abrir painel de propriedades
        setShowPropertiesPanel(true);

        // Focar no campo da propriedade no painel (integração futura)
        // Isso será usado para destacar/focar o campo específico no QuizPropertiesPanel
        setTimeout(() => {
            const propertyInput = document.querySelector(`[data-property="${propKey}"]`) as HTMLElement;
            if (propertyInput) {
                propertyInput.focus();
                propertyInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }, []);

    // 🧩 HANDLERS PARA SISTEMA ATÔMICO
    const handleUpdateModularStep = useCallback((stepId: string, updates: Partial<ModularStep>) => {
        setModularSteps(prev => prev.map(step =>
            step.id === stepId ? { ...step, ...updates } : step
        ));
    }, []);

    const handleUpdateAtomicComponent = useCallback((stepId: string, componentId: string, updates: Partial<AtomicComponent>) => {
        setModularSteps(prev => prev.map(step => {
            if (step.id !== stepId) return step;

            return {
                ...step,
                components: step.components.map(comp =>
                    comp.id === componentId ? { ...comp, ...updates } as AtomicComponent : comp
                )
            };
        }));
    }, []);

    const handleSelectAtomicComponent = useCallback((componentId: string) => {
        setSelectedComponentId(componentId);
        setShowPropertiesPanel(true);
    }, []);

    const handleDeleteAtomicComponent = useCallback((stepId: string, componentId: string) => {
        setModularSteps(prev => prev.map(step => {
            if (step.id !== stepId) return step;

            return {
                ...step,
                components: removeComponent(step.components, componentId)
            };
        }));

        // Se o componente deletado estava selecionado, limpar seleção
        if (selectedComponentId === componentId) {
            setSelectedComponentId('');
        }
    }, [selectedComponentId]);

    const handleDuplicateAtomicComponent = useCallback((stepId: string, componentId: string) => {
        setModularSteps(prev => prev.map(step => {
            if (step.id !== stepId) return step;

            const component = step.components.find(c => c.id === componentId);
            if (!component) return step;

            const duplicatedComponent = {
                ...component,
                id: `${component.id}-copy-${Date.now()}`,
                order: component.order + 0.1
            };

            return {
                ...step,
                components: [...step.components, duplicatedComponent]
                    .sort((a, b) => a.order - b.order)
                    .map((comp, index) => ({ ...comp, order: index }))
            };
        }));
    }, []);

    const handleReorderAtomicComponents = useCallback((stepId: string, fromIndex: number, toIndex: number) => {
        setModularSteps(prev => prev.map(step => {
            if (step.id !== stepId) return step;

            return {
                ...step,
                components: reorderComponents(step.components, fromIndex, toIndex)
            };
        }));
    }, []);

    const handleInsertAtomicComponent = useCallback((stepId: string, afterComponentId: string | null, componentType: AtomicComponentType) => {
        setModularSteps(prev => prev.map(step => {
            if (step.id !== stepId) return step;

            const newComponent = createAtomicComponent(componentType);

            return {
                ...step,
                components: insertComponent(step.components, afterComponentId, newComponent)
            };
        }));
    }, []);

    const handleAddModularStep = useCallback((type: 'intro' | 'question' | 'result' | 'custom' = 'custom') => {
        const newStep = createModularStep(type);
        setModularSteps(prev => [...prev, newStep]);
        setSelectedId(newStep.id);
    }, []);

    const handleRemoveModularStep = useCallback((stepId: string) => {
        setModularSteps(prev => {
            const filtered = prev.filter(step => step.id !== stepId);
            if (selectedId === stepId && filtered.length > 0) {
                setSelectedId(filtered[0].id);
            }
            return filtered;
        });
    }, [selectedId]);

    // 🎯 RENDERIZAÇÃO DE COMPONENTES DE QUIZ DE PRODUÇÃO
    const renderQuizProductionComponent = useCallback((step: ModularStep, stepIndex: number) => {
        // Dados mock baseados no template de produção para cada etapa
        const generateStepData = (index: number): QuizStep => {
            const baseStep = {
                title: `Etapa ${index + 1}`,
                backgroundColor: '#ffffff',
                textColor: '#1a1716'
            };

            // Personalizar dados baseados no índice da etapa
            switch (index) {
                case 0: // Introdução
                    return { ...baseStep, type: 'intro', title: 'Vamos descobrir seu estilo!' };
                case 1: // Ocasiões
                    return {
                        ...baseStep,
                        type: 'question',
                        title: 'Para quais ocasiões você mais se veste?',
                        questionText: 'Selecione até 3 opções:',
                        options: [
                            { id: 'work', text: 'Trabalho/Profissional', image: '/images/quiz/ocasioes-trabalho.jpg' },
                            { id: 'casual', text: 'Casual/Dia a dia', image: '/images/quiz/ocasioes-casual.jpg' },
                            { id: 'social', text: 'Eventos sociais', image: '/images/quiz/ocasioes-social.jpg' }
                        ]
                    };
                default:
                    return {
                        ...baseStep,
                        type: 'question',
                        questionText: `Pergunta da etapa ${index + 1}`,
                        options: []
                    };
            }
        };

        const stepData = generateStepData(stepIndex);

        // Renderizar componente apropriado baseado no tipo e índice
        switch (step.type) {
            case 'intro':
                return (
                    <IntroStep
                        data={stepData}
                        onNameSubmit={(name: string) => {
                            console.log(`Nome coletado: ${name}`);
                            // Integrar com sistema de estado do quiz
                        }}
                    />
                );

            case 'question':
                if (stepIndex >= 12 && stepIndex <= 17) {
                    // Questões estratégicas
                    return (
                        <StrategicQuestionStep
                            data={stepData}
                            currentAnswer=""
                            onAnswerChange={(answer: string) => {
                                console.log(`Resposta estratégica: ${answer}`);
                            }}
                        />
                    );
                } else {
                    // Questões de estilo
                    return (
                        <QuestionStep
                            data={stepData}
                            currentAnswers={[]}
                            onAnswersChange={(answers: string[]) => {
                                console.log(`Respostas: ${answers.join(', ')}`);
                            }}
                        />
                    );
                }

            case 'custom':
                if (stepIndex === 11 || stepIndex === 18) {
                    // Transições
                    return (
                        <TransitionStep
                            data={stepData}
                            onComplete={() => {
                                console.log(`Transição da etapa ${stepIndex} completa`);
                            }}
                        />
                    );
                } else if (stepIndex === 20) {
                    // Oferta
                    return (
                        <OfferStep
                            data={stepData}
                            userProfile={{
                                userName: "Usuário",
                                resultStyle: "Estilo Personalizado"
                            }}
                            offerKey="estilo-completo"
                        />
                    );
                }
                return <div className="p-4 text-center text-gray-500">Etapa personalizada {stepIndex + 1}</div>;

            case 'result':
                return (
                    <ResultStep
                        data={stepData}
                        userProfile={{
                            userName: "Usuário",
                            resultStyle: "Seu Estilo Único",
                            secondaryStyles: ["Moderno", "Elegante"]
                        }}
                    />
                );

            default:
                return <div className="p-4 text-center text-gray-500">Tipo de etapa não reconhecido: {step.type}</div>;
        }
    }, []);

    // Mock de resultados para o componente ResultStep
    const mockResults = {
        userProfile: 'Empreendedor Visionário',
        categories: ['Liderança', 'Inovação', 'Estratégia']
    };

    // Wrapper simples para componentes no modo preview
    const SelectableWrapper: React.FC<{
        children: React.ReactNode;
        blockId: string;
        label: string;
    }> = ({ children, blockId, label }) => {
        return (
            <div
                className={`relative transition-all duration-200 group ${selectedBlockId === blockId
                    ? 'ring-2 ring-blue-500 ring-offset-2'
                    : 'hover:ring-1 hover:ring-gray-300'
                    }`}
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBlockId(blockId);
                }}
            >
                <div className="absolute -top-6 left-0 bg-gray-600 text-white px-2 py-1 text-xs rounded z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    {label}
                </div>
                {children}
            </div>
        );
    };

    // Wrapper para componentes editáveis
    const EditableWrapper: React.FC<{
        children: React.ReactNode;
        blockId: string;
        label: string;
        isEditable?: boolean;
    }> = ({ children, blockId, label, isEditable = false }) => {
        return (
            <div
                className={`relative transition-all duration-200 group ${selectedBlockId === blockId
                    ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/50'
                    : 'hover:ring-1 hover:ring-blue-300'
                    } ${isEditable ? 'cursor-pointer' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBlockId(blockId);
                }}
            >
                {/* Label do componente */}
                <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 text-xs rounded z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    {label} {isEditable && '(Editável)'}
                </div>

                {/* Toolbar de edição para modo editável */}
                {isEditable && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <div className="flex gap-1 bg-white shadow-lg rounded p-1 border">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="Configurações">
                                <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                title="Remover"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const stepId = blockId.split('-')[0];
                                    removeStep(stepId);
                                }}
                            >
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                )}

                {children}
            </div>
        );
    };

    // Função para renderizar componente real no preview
    // Função para converter step antigo em step modular


    // 🚀 FASE 3: COMPONENTES EDITÁVEIS ENCAPSULADOS - Sistema Modularizado
    const renderRealComponent = (step: EditableQuizStep, index: number) => {
        const isEditMode = previewMode === 'edit';
        const blockId = `step-${step.id}`;
        const isSelected = selectedBlockId === blockId;

        // 🎯 Mapear tipo de step para componente editável correspondente
        const EditableComponent = {
            'intro': EditableIntroStep,
            'question': EditableQuestionStep,
            'strategic-question': EditableStrategicQuestionStep,
            'transition': EditableTransitionStep,
            'transition-result': EditableTransitionStep, // Reutilizar TransitionStep
            'result': EditableResultStep,
            'offer': EditableOfferStep
        }[step.type];

        // Se o tipo não for suportado, mostrar erro
        if (!EditableComponent) {
            return (
                <div className="p-4 border-2 border-red-300 bg-red-50 rounded-lg">
                    <div className="text-red-600 font-semibold">
                        ⚠️ Tipo de step não suportado: {step.type}
                    </div>
                    <div className="text-red-500 text-sm mt-1">
                        Componente editável não encontrado para este tipo de step.
                    </div>
                </div>
            );
        }

        // 🎨 Props para o componente editável
        const editableProps: EditableStepProps = {
            data: step,
            isEditable: isEditMode,
            isSelected: isSelected,
            onUpdate: (updates) => updateStep(step.id, updates),
            onSelect: () => {
                setSelectedId(step.id);
                setSelectedBlockId(blockId);
            },
            onPropertyClick: (propKey: string, element: HTMLElement) => {
                handlePropertyClick(propKey, element, step.id);
            },
            onDuplicate: () => duplicateStep(step.id),
            onDelete: () => removeStep(step.id),
            onMoveUp: index > 0 ? () => moveStep(step.id, -1) : undefined,
            onMoveDown: index < steps.length - 1 ? () => moveStep(step.id, 1) : undefined,
            canMoveUp: index > 0,
            canMoveDown: index < steps.length - 1,
            canDelete: steps.length > 1,
            blockId: blockId
        };

        return <EditableComponent {...editableProps} />;
    };

    return (
        <BlockRegistryProvider definitions={DEFAULT_BLOCK_DEFINITIONS}>
            <div
                className="quiz-editor-container h-full w-full flex flex-col bg-background"
                style={{
                    color: '#1a1716',
                    backgroundColor: 'white',
                    '--tw-text-opacity': '1'
                } as React.CSSProperties}
            >
                <div className="h-10 border-b flex items-center gap-2 px-3 text-xs bg-muted/30">
                    <span className="font-semibold">Quiz Editor WYSIWYG</span>
                    <Button size="sm" variant="outline" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <div className="ml-auto flex gap-2">
                        <Button
                            size="sm"
                            variant={previewMode === 'edit' ? 'default' : 'outline'}
                            onClick={() => setPreviewMode('edit')}
                        >
                            Editar
                        </Button>
                        <Button
                            size="sm"
                            variant={previewMode === 'preview' ? 'default' : 'outline'}
                            onClick={() => setPreviewMode('preview')}
                        >
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                        </Button>
                    </div>
                </div>

                <div
                    className="flex-1 flex overflow-hidden"
                    onClick={() => setActiveInsertDropdown(null)} // Fechar dropdowns ao clicar fora
                >
                    {/* Layout Aprimorado: Sidebar de Steps + Canvas + Properties Panel */}
                    {/* COL 1 - SEQUÊNCIA DE ETAPAS */}
                    <div className="w-60 border-r flex flex-col">
                        <div className="p-3 flex items-center justify-between border-b">
                            <span className="text-xs font-semibold">
                                Etapas Modulares
                            </span>
                            <Badge variant="secondary" className="text-[10px]">
                                {modularSteps.length}
                            </Badge>
                        </div>
                        <div className="flex-1 overflow-auto text-xs">
                            {/* Lista Reordenável de Steps com DragDropManager */}
                            <DragDropManager
                                items={modularSteps}
                                onReorder={handleStepReorder}
                                enabled={dragEnabled}
                                renderItem={(step, index, isDragging) => {
                                    const active = step.id === selectedId;

                                    return (
                                        <div className={cn(
                                            "relative border-b cursor-pointer group transition-all",
                                            active ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50',
                                            isDragging && "opacity-50 scale-95"
                                        )}>
                                            {/* Indicador de Posição */}
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500" />

                                            <div
                                                className="pl-4 pr-3 py-3"
                                                onClick={() => setSelectedId(step.id)}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                                                        {index + 1}
                                                    </div>
                                                    <span className="font-medium truncate flex-1 text-[11px]">
                                                        {/* 21 Etapas Específicas do Quiz de Estilo */}
                                                        {index === 0 && '🏠 Introdução - Nome'}
                                                        {index === 1 && '❓ Ocasiões'}
                                                        {index === 2 && '🎨 Cores'}
                                                        {index === 3 && '👗 Silhuetas'}
                                                        {index === 4 && '🌸 Estampas'}
                                                        {index === 5 && '💍 Acessórios (Imagens)'}
                                                        {index === 6 && '💄 Cabelo e Maquiagem'}
                                                        {index === 7 && '✨ Inspirações'}
                                                        {index === 8 && '👠 Calçados'}
                                                        {index === 9 && '📿 Acessórios (Texto)'}
                                                        {index === 10 && '🧵 Tecidos'}
                                                        {index === 11 && '⏳ Trans. Estratégicas'}
                                                        {index === 12 && '🎯 Prioridades de Vida'}
                                                        {index === 13 && '🌟 Personalidade'}
                                                        {index === 14 && '🏡 Lifestyle'}
                                                        {index === 15 && '🎊 Objetivos de Imagem'}
                                                        {index === 16 && '⚡ Desafios'}
                                                        {index === 17 && '💫 Expectativas'}
                                                        {index === 18 && '⏳ Trans. Resultado'}
                                                        {index === 19 && '🏆 Resultado Final'}
                                                        {index === 20 && '🎁 Oferta'}
                                                        {index >= 19 && index <= 20 && `🎁 Oferta ${index - 18}`}
                                                    </span>
                                                </div>

                                                {/* Preview do conteúdo */}
                                                <div className="text-[10px] text-gray-500 mb-2 truncate">
                                                    {(() => {
                                                        const modularStep = modularSteps.find(s => s.id === step.id);
                                                        if (modularStep && modularStep.components.length > 0) {
                                                            const firstComponent = modularStep.components[0];
                                                            return `${modularStep.components.length} componentes - ${firstComponent.type}`;
                                                        }
                                                        return 'Etapa vazia';
                                                    })()}
                                                </div>                                            {/* Controles de Ação */}
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-6 w-6 text-green-500 hover:bg-green-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            duplicateStep(step.id);
                                                        }}
                                                        title="Duplicar"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-6 w-6 text-red-500 hover:bg-red-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeStep(step.id);
                                                        }}
                                                        title="Remover"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Conexão Visual para o Próximo Step */}
                                            {index < steps.length - 1 && (
                                                <div className="absolute bottom-0 left-7 w-0.5 h-3 bg-gradient-to-b from-purple-400 to-blue-400" />
                                            )}
                                        </div>
                                    );
                                }}
                                className="space-y-0"
                            />
                        </div>

                        {/* Adicionar no Final */}
                        <div className="p-3 border-t bg-gradient-to-r from-purple-50 to-blue-50">
                            <div className="text-[10px] font-medium text-gray-700 mb-2">ADICIONAR NO FINAL</div>
                            <div className="relative">
                                <Button
                                    size="sm"
                                    variant="default"
                                    className="w-full text-[10px] h-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                                    onClick={() => setActiveInsertDropdown(activeInsertDropdown === 'end' ? null : 'end')}
                                >
                                    <Plus className="w-3 h-3 mr-1" /> Novo Componente
                                    <ChevronDown className="w-3 h-3 ml-1" />
                                </Button>

                                {/* Dropdown Menu para adicionar no final */}
                                {activeInsertDropdown === 'end' && (
                                    <div className="absolute bottom-full left-0 mb-1 bg-white border rounded shadow-lg z-50 w-full">
                                        {STEP_TYPES.map(type => (
                                            <button
                                                key={type}
                                                className="w-full px-3 py-2 text-left text-[11px] hover:bg-gray-50 flex items-center gap-2 border-b last:border-b-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addStepAtEnd(type);
                                                    setActiveInsertDropdown(null);
                                                }}
                                            >
                                                <span>
                                                    {type === 'intro' && '🏠'}
                                                    {type === 'question' && '❓'}
                                                    {type === 'strategic-question' && '🎯'}
                                                    {type === 'transition' && '⏳'}
                                                    {type === 'transition-result' && '🔄'}
                                                    {type === 'result' && '🏆'}
                                                    {type === 'offer' && '🎁'}
                                                </span>
                                                <div>
                                                    <div className="font-medium">{type.replace('-', ' ')}</div>
                                                    <div className="text-[9px] text-gray-500">
                                                        {type === 'intro' && 'Introdução do quiz'}
                                                        {type === 'question' && 'Pergunta múltipla escolha'}
                                                        {type === 'strategic-question' && 'Pergunta estratégica'}
                                                        {type === 'transition' && 'Tela de transição'}
                                                        {type === 'transition-result' && 'Transição para resultado'}
                                                        {type === 'result' && 'Resultado do quiz'}
                                                        {type === 'offer' && 'Oferta personalizada'}
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* COL 2 - BIBLIOTECA DE COMPONENTES */}
                    <div className="w-72 border-r flex flex-col">
                        <div className="p-3 border-b text-xs font-semibold">
                            Biblioteca de Componentes
                        </div>

                        {/* 🧩 SISTEMA EDITÁVEL MODULAR: Componentes modulares integrados */}
                        <>
                            {/* Adicionar Etapas */}
                            <div className="p-3 border-b">
                                <label className="block text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
                                    Adicionar Etapa
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-[10px] h-8 flex flex-col items-center p-1"
                                        onClick={() => handleAddModularStep('intro')}
                                    >
                                        <span className="truncate w-full text-center">🏠 Intro</span>
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-[10px] h-8 flex flex-col items-center p-1"
                                        onClick={() => handleAddModularStep('question')}
                                    >
                                        <span className="truncate w-full text-center">❓ Pergunta</span>
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-[10px] h-8 flex flex-col items-center p-1"
                                        onClick={() => handleAddModularStep('result')}
                                    >
                                        <span className="truncate w-full text-center">🏆 Resultado</span>
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-[10px] h-8 flex flex-col items-center p-1"
                                        onClick={() => handleAddModularStep('custom')}
                                    >
                                        <span className="truncate w-full text-center">🧩 Custom</span>
                                    </Button>
                                </div>
                            </div>

                            {/* Componentes Modulares */}
                            <div className="p-3 border-b">
                                <label className="block text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
                                    Componentes Modulares
                                </label>
                                <div className="text-[9px] text-muted-foreground mb-2">
                                    Use os botões "+" dentro das etapas para adicionar componentes
                                </div>
                                <div className="grid grid-cols-2 gap-1 text-[9px]">
                                    <div className="p-2 border rounded bg-gray-50">📝 Título</div>
                                    <div className="p-2 border rounded bg-gray-50">📄 Texto</div>
                                    <div className="p-2 border rounded bg-gray-50">🔘 Botão</div>
                                    <div className="p-2 border rounded bg-gray-50">📝 Input</div>
                                    <div className="p-2 border rounded bg-gray-50">🖼️ Imagem</div>
                                    <div className="p-2 border rounded bg-gray-50">📏 Espaço</div>
                                    <div className="p-2 border rounded bg-gray-50">➖ Divisor</div>
                                    <div className="p-2 border rounded bg-gray-50">❓ Pergunta</div>
                                    <div className="p-2 border rounded bg-gray-50">☑️ Opções</div>
                                </div>
                            </div>
                        </>

                        {/* Configuração do Componente Selecionado */}
                        <div className="flex-1 overflow-auto p-3 text-xs space-y-4">
                            {selectedModularStep && (
                                <div className="space-y-2">
                                    <label className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                                        Etapa Modular Selecionada
                                    </label>
                                    <div className="bg-blue-50 p-2 rounded border">
                                        <div className="font-medium text-blue-700 mb-1">
                                            {selectedModularStep.type.toUpperCase()}
                                        </div>
                                        <div className="text-[10px] text-blue-600">
                                            Use os componentes atômicos para editar
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 p-2 border rounded">
                                        Sistema modular ativo - edite via componentes atômicos no canvas
                                    </div>


                                </div>
                            )}
                        </div>
                    </div>

                    {/* COL 3 - CANVAS COM DRAG & DROP */}
                    <div className="flex-1 border-r bg-gray-50 flex flex-col">
                        <div className="p-3 border-b text-xs font-semibold flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                                <span>Canvas Visual</span>
                                {selectedBlockId && (
                                    <Badge variant="outline" className="text-[10px]">
                                        Selecionado
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant={showProductionView ? "default" : "outline"}
                                    onClick={() => setShowProductionView(!showProductionView)}
                                    className="h-6 text-[10px]"
                                    title="Alternar entre visão modular e visão de produção"
                                >
                                    {showProductionView ? '🎯 Produção' : '🧩 Modular'}
                                </Button>
                                <Button
                                    size="sm"
                                    variant={dragEnabled ? "default" : "outline"}
                                    onClick={() => setDragEnabled(!dragEnabled)}
                                    className="h-6 text-[10px]"
                                >
                                    Drag & Drop
                                </Button>
                                <Button
                                    size="sm"
                                    variant={showPropertiesPanel ? "default" : "outline"}
                                    onClick={() => setShowPropertiesPanel(!showPropertiesPanel)}
                                    className="h-6 text-[10px]"
                                >
                                    <Settings className="w-3 h-3 mr-1" />
                                    Props
                                </Button>
                            </div>
                        </div>
                        <div
                            className="flex-1 overflow-auto p-4"
                            onClick={(e) => {
                                // Se clicar no fundo (não em um bloco), limpar seleção
                                if (e.target === e.currentTarget) {
                                    setSelectedBlockId('');
                                }
                            }}
                        >
                            {/* 🧩 Sistema Editável Modular - Componentes Atômicos Integrados */}

                            {/* 🧩 SISTEMA EDITÁVEL MODULAR: Sempre usar componentes modulares */}
                            {modularSteps.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                    <div className="text-center">
                                        <div className="text-lg mb-2">🧩</div>
                                        <div>Nenhuma etapa criada ainda</div>
                                        <div className="text-xs mb-4">Use a sidebar para adicionar etapas</div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleAddModularStep('intro')}
                                            className="text-xs"
                                        >
                                            Criar primeira etapa
                                        </Button>
                                    </div>
                                </div>
                            ) : selectedId && modularSteps.find(s => s.id === selectedId) ? (
                                showProductionView ? (
                                    // 🎯 VISÃO DE PRODUÇÃO: Componentes reais do /quiz-estilo
                                    <div className="p-4">
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                            <div className="text-sm font-medium text-yellow-800">
                                                🎯 Visão de Produção Ativa
                                            </div>
                                            <div className="text-xs text-yellow-700 mt-1">
                                                Mostrando como aparece no /quiz-estilo real
                                            </div>
                                        </div>
                                        {renderQuizProductionComponent(
                                            modularSteps.find(s => s.id === selectedId)!,
                                            modularSteps.findIndex(s => s.id === selectedId)
                                        )}
                                    </div>
                                ) : (
                                    // 🧩 VISÃO MODULAR: Componentes atômicos editáveis
                                    <ModularStepContainer
                                        step={modularSteps.find(s => s.id === selectedId)!}
                                        isEditable={previewMode === 'edit'}
                                        selectedComponentId={selectedComponentId}
                                        onUpdateStep={(updates) => handleUpdateModularStep(selectedId, updates)}
                                        onUpdateComponent={(componentId, updates) =>
                                            handleUpdateAtomicComponent(selectedId, componentId, updates)
                                        }
                                        onSelectComponent={handleSelectAtomicComponent}
                                        onDeleteComponent={(componentId) =>
                                            handleDeleteAtomicComponent(selectedId, componentId)
                                        }
                                        onDuplicateComponent={(componentId) =>
                                            handleDuplicateAtomicComponent(selectedId, componentId)
                                        }
                                        onReorderComponents={(fromIndex, toIndex) =>
                                            handleReorderAtomicComponents(selectedId, fromIndex, toIndex)
                                        }
                                        onInsertComponent={(afterComponentId, componentType) =>
                                            handleInsertAtomicComponent(selectedId, afterComponentId, componentType)
                                        }
                                    />
                                )
                            ) : (
                                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                    <div className="text-center">
                                        <div className="text-lg mb-2">📝</div>
                                        <div>Selecione uma etapa para editar</div>
                                        <div className="text-xs">Use a sidebar à esquerda para selecionar</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COL 4 - PAINEL DE PROPRIEDADES APRIMORADO */}
                    {showPropertiesPanel && (
                        <div className="w-80">
                            <QuizPropertiesPanel
                                selectedStep={null}
                                onUpdateStep={updateStep}
                                onClose={handlePropertiesPanelClose}
                                onDeleteStep={removeStep}
                                onDuplicateStep={duplicateStep}
                                isPreviewMode={isPreviewMode}
                                onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </BlockRegistryProvider>
    );
};

export default QuizFunnelEditorWYSIWYG;