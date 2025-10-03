import React, { useEffect, useState, useCallback } from 'react';
import { useUnifiedCRUD } from '@/context/UnifiedCRUDProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QUIZ_STEPS, type QuizStep } from '@/data/quizSteps';
import { Plus, Save, Trash2, ArrowUp, ArrowDown, Copy, Eye, ChevronDown, Settings, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import './QuizEditorStyles.css';

// Importar componentes reais de produção para preview WYSIWYG
import IntroStep from '@/components/quiz/IntroStep';
import QuestionStep from '@/components/quiz/QuestionStep';
import StrategicQuestionStep from '@/components/quiz/StrategicQuestionStep';
import TransitionStep from '@/components/quiz/TransitionStep';
import ResultStep from '@/components/quiz/ResultStep';
import OfferStep from '@/components/quiz/OfferStep';

// Importar componentes editáveis híbridos
import EditableIntroStep from '@/components/quiz/editable/EditableIntroStep';
import EditableQuestionStep from '@/components/quiz/editable/EditableQuestionStep';

// ✨ NOVO: Sistema Modular de Steps
import { StepRenderer } from '@/components/step-registry/StepRenderer';
import { stepRegistry } from '@/components/step-registry/StepRegistry';
import '@/components/steps'; // Inicializar todos os steps registrados

// 🎯 NOVO: Componentes de Editor Aprimorado
import SelectableBlock from '@/components/editor/SelectableBlock';
import QuizPropertiesPanel from '@/components/editor/QuizPropertiesPanel';
import DragDropManager from '@/components/editor/DragDropManager';
import ModularStepRenderer from '@/components/editor/ModularStepRenderer';

// 🎯 NOVO: Tipos modulares
import { ModularStep, StepComponent, COMPONENT_TEMPLATES } from '@/types/ComponentTypes';

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

    // 🎯 NOVO: Estados para sistema modular
    const [modularSteps, setModularSteps] = useState<ModularStep[]>([]);
    const [selectedComponentId, setSelectedComponentId] = useState<string>('');
    const [useModularSystem, setUseModularSystem] = useState(true);

    // Carregar steps iniciais
    useEffect(() => {
        if (useModularSystem) {
            // Inicializar sistema modular com steps padrão
            const defaultModularSteps: ModularStep[] = [
                createBlankModularStep('intro'),
                createBlankModularStep('question'),
                createBlankModularStep('result')
            ];
            setModularSteps(defaultModularSteps);
            setSelectedId(defaultModularSteps[0].id);
        } else {
            // Sistema antigo
            const existing = (crud.currentFunnel as any)?.quizSteps as EditableQuizStep[] | undefined;
            if (existing && existing.length) {
                setSteps(existing.map(s => ({ ...s })));
                setSelectedId(existing[0].id);
                return;
            }
            const conv: EditableQuizStep[] = Object.entries(QUIZ_STEPS).map(([id, step]) => ({ id, ...step as QuizStep }));
            setSteps(conv);
            if (conv.length) setSelectedId(conv[0].id);
        }
    }, [crud.currentFunnel, useModularSystem]);

    const selectedStep = steps.find(s => s.id === selectedId);
    const selectedModularStep = modularSteps.find(s => s.id === selectedId);

    // Função para criar step modular
    const createBlankModularStep = (type: string): ModularStep => {
        const baseId = `step-${Date.now()}`;
        const defaultComponents: StepComponent[] = [];

        // Criar componentes padrão baseados no tipo
        switch (type) {
            case 'intro':
                defaultComponents.push(
                    {
                        id: `comp-${Date.now()}-1`,
                        type: 'header',
                        order: 0,
                        title: 'Bem-vindos!',
                        alignment: 'center',
                        size: 'large'
                    } as any,
                    {
                        id: `comp-${Date.now()}-2`,
                        type: 'text',
                        order: 1,
                        content: 'Descubra seu estilo personalizado respondendo algumas perguntas.',
                        alignment: 'center',
                        size: 'medium'
                    } as any,
                    {
                        id: `comp-${Date.now()}-3`,
                        type: 'input',
                        order: 2,
                        label: 'Como posso te chamar?',
                        placeholder: 'Digite seu nome',
                        inputType: 'text',
                        required: true
                    } as any,
                    {
                        id: `comp-${Date.now()}-4`,
                        type: 'button',
                        order: 3,
                        text: 'Começar Quiz',
                        action: 'next',
                        style: 'primary'
                    } as any
                );
                break;
            case 'question':
                defaultComponents.push(
                    {
                        id: `comp-${Date.now()}-1`,
                        type: 'question',
                        order: 0,
                        questionText: 'Nova pergunta?',
                        options: [
                            { id: 'opt1', text: 'Opção 1' },
                            { id: 'opt2', text: 'Opção 2' }
                        ],
                        requiredSelections: 1
                    } as any,
                    {
                        id: `comp-${Date.now()}-2`,
                        type: 'button',
                        order: 1,
                        text: 'Continuar',
                        action: 'next',
                        style: 'primary'
                    } as any
                );
                break;
            case 'result':
                defaultComponents.push(
                    {
                        id: `comp-${Date.now()}-1`,
                        type: 'header',
                        order: 0,
                        title: 'Seu Resultado!',
                        alignment: 'center',
                        size: 'large'
                    } as any,
                    {
                        id: `comp-${Date.now()}-2`,
                        type: 'text',
                        order: 1,
                        content: 'Baseado nas suas respostas, descobrimos seu estilo único.',
                        alignment: 'center',
                        size: 'medium'
                    } as any,
                    {
                        id: `comp-${Date.now()}-3`,
                        type: 'button',
                        order: 2,
                        text: 'Ver Detalhes',
                        action: 'next',
                        style: 'primary'
                    } as any
                );
                break;
            default:
                // Step básico com apenas um cabeçalho
                defaultComponents.push({
                    id: `comp-${Date.now()}-1`,
                    type: 'header',
                    order: 0,
                    title: 'Nova Etapa',
                    alignment: 'center',
                    size: 'medium'
                } as any);
        }

        return {
            id: baseId,
            name: `${type.charAt(0).toUpperCase() + type.slice(1)} Step`,
            type: type as any,
            components: defaultComponents
        };
    };

    const updateStep = useCallback((id: string, patch: Partial<EditableQuizStep>) => {
        setSteps(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));
    }, []);

    // Handlers para sistema modular
    const updateModularStep = useCallback((stepId: string, updates: Partial<ModularStep>) => {
        setModularSteps(prev => prev.map(s => (s.id === stepId ? { ...s, ...updates } : s)));
    }, []);

    const handleStepReorder = useCallback((fromIndex: number, toIndex: number) => {
        if (useModularSystem) {
            setModularSteps(prev => {
                const reordered = [...prev];
                const [movedStep] = reordered.splice(fromIndex, 1);
                reordered.splice(toIndex, 0, movedStep);
                return reordered;
            });
        } else {
            setSteps(prev => {
                const reordered = [...prev];
                const [movedStep] = reordered.splice(fromIndex, 1);
                reordered.splice(toIndex, 0, movedStep);
                return reordered;
            });
        }
    }, [useModularSystem]);

    const addModularStep = (type: string) => {
        const newStep = createBlankModularStep(type);
        setModularSteps(prev => [...prev, newStep]);
        setSelectedId(newStep.id);
    };

    const removeModularStep = (stepId: string) => {
        setModularSteps(prev => prev.filter(s => s.id !== stepId));
        if (selectedId === stepId && modularSteps.length > 1) {
            const remaining = modularSteps.filter(s => s.id !== stepId);
            setSelectedId(remaining[0].id);
        }
    };

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
    const convertStepToModular = (step: EditableQuizStep): ModularStep => {
        const components: StepComponent[] = [];

        switch (step.type) {
            case 'intro':
                // Converter intro step para componentes modulares
                if (step.title) {
                    components.push({
                        id: `comp-${Date.now()}-1`,
                        type: 'header',
                        order: 0,
                        title: step.title,
                        alignment: 'center',
                        size: 'large'
                    } as any);
                }

                if (step.formQuestion) {
                    components.push({
                        id: `comp-${Date.now()}-2`,
                        type: 'input',
                        order: 1,
                        label: step.formQuestion,
                        placeholder: step.placeholder || 'Digite aqui...',
                        inputType: 'text',
                        required: true
                    } as any);
                }

                if (step.buttonText) {
                    components.push({
                        id: `comp-${Date.now()}-3`,
                        type: 'button',
                        order: 2,
                        text: step.buttonText,
                        action: 'next',
                        style: 'primary'
                    } as any);
                }
                break;

            case 'question':
                // Converter question step para componentes modulares
                if (step.questionText) {
                    components.push({
                        id: `comp-${Date.now()}-1`,
                        type: 'question',
                        order: 0,
                        questionText: step.questionText,
                        options: step.options || [],
                        requiredSelections: step.requiredSelections || 1,
                        multipleChoice: (step.requiredSelections || 1) > 1
                    } as any);
                }

                components.push({
                    id: `comp-${Date.now()}-2`,
                    type: 'button',
                    order: 1,
                    text: 'Continuar',
                    action: 'next',
                    style: 'primary'
                } as any);
                break;

            case 'result':
                // Converter result step para componentes modulares
                if (step.title) {
                    components.push({
                        id: `comp-${Date.now()}-1`,
                        type: 'header',
                        order: 0,
                        title: step.title,
                        alignment: 'center',
                        size: 'large'
                    } as any);
                }

                if (step.text) {
                    components.push({
                        id: `comp-${Date.now()}-2`,
                        type: 'text',
                        order: 1,
                        content: step.text,
                        alignment: 'center',
                        size: 'medium'
                    } as any);
                }
                break;

            default:
                // Step genérico - apenas um header
                components.push({
                    id: `comp-${Date.now()}-1`,
                    type: 'header',
                    order: 0,
                    title: step.title || `${step.type} Step`,
                    alignment: 'center',
                    size: 'medium'
                } as any);
        }

        return {
            id: step.id,
            name: `${step.type.charAt(0).toUpperCase() + step.type.slice(1)} Step`,
            type: step.type as any,
            components
        };
    };

    // Função para converter componentes modulares de volta para step antigo
    const convertModularToStep = (components: StepComponent[], originalStep: EditableQuizStep): Partial<EditableQuizStep> => {
        const updates: Partial<EditableQuizStep> = {};

        components.forEach(comp => {
            switch (comp.type) {
                case 'header':
                    const headerComp = comp as any;
                    updates.title = headerComp.title;
                    break;
                case 'text':
                    const textComp = comp as any;
                    updates.text = textComp.content;
                    break;
                case 'input':
                    const inputComp = comp as any;
                    updates.formQuestion = inputComp.label;
                    updates.placeholder = inputComp.placeholder;
                    break;
                case 'button':
                    const buttonComp = comp as any;
                    updates.buttonText = buttonComp.text;
                    break;
                case 'question':
                    const questionComp = comp as any;
                    updates.questionText = questionComp.questionText;
                    updates.options = questionComp.options;
                    updates.requiredSelections = questionComp.requiredSelections;
                    break;
            }
        });

        return updates;
    };

    const renderRealComponent = (step: EditableQuizStep, index: number) => {
        const isEditMode = previewMode === 'edit';

        // 🎯 NOVO: Usar sistema modular para renderizar steps antigos
        const modularStep = convertStepToModular(step);

        return (
            <ModularStepRenderer
                step={modularStep}
                isEditable={isEditMode}
                selectedComponentId={selectedComponentId}
                onUpdateStep={(stepId, updates) => {
                    // Converter updates modulares de volta para step antigo
                    if (updates.components) {
                        const updatedStep = convertModularToStep(updates.components, step);
                        updateStep(stepId, updatedStep);
                    }
                }}
                onSelectComponent={setSelectedComponentId}
                onOpenComponentProperties={(componentId) => {
                    setSelectedBlockId(componentId);
                    setShowPropertiesPanel(true);
                }}
            />
        );
    };

    return (
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
                        <span className="text-xs font-semibold">Sequência do Funil</span>
                        <Badge variant="secondary" className="text-[10px]">
                            {useModularSystem ? modularSteps.length : steps.length}
                        </Badge>
                    </div>
                    <div className="flex-1 overflow-auto text-xs">
                        {/* Lista Reordenável de Steps com DragDropManager */}
                        <DragDropManager
                            items={useModularSystem ? modularSteps : steps}
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
                                                <span className="font-medium truncate flex-1">
                                                    {useModularSystem ? (
                                                        // Sistema modular - mostrar nome customizado
                                                        <>
                                                            {step.type === 'intro' && '🏠'}
                                                            {step.type === 'question' && '❓'}
                                                            {step.type === 'result' && '🏆'}
                                                            {step.type === 'custom' && '⚙️'}
                                                            {' '}
                                                            {(step as ModularStep).name}
                                                        </>
                                                    ) : (
                                                        // Sistema antigo
                                                        <>
                                                            {step.type === 'intro' && '🏠 Introdução'}
                                                            {step.type === 'question' && '❓ Pergunta'}
                                                            {step.type === 'strategic-question' && '🎯 Estratégica'}
                                                            {step.type === 'transition' && '⏳ Transição'}
                                                            {step.type === 'transition-result' && '🔄 Trans. Result'}
                                                            {step.type === 'result' && '🏆 Resultado'}
                                                            {step.type === 'offer' && '🎁 Oferta'}
                                                        </>
                                                    )}
                                                </span>
                                            </div>

                                            {/* Preview do conteúdo */}
                                            <div className="text-[10px] text-gray-500 mb-2 truncate">
                                                {useModularSystem ? (
                                                    // Sistema modular - mostrar número de componentes
                                                    `${(step as ModularStep).components.length} componente(s)`
                                                ) : (
                                                    // Sistema antigo
                                                    <>
                                                        {step.type === 'intro' && ((step as any).title || 'Introdução do Quiz')}
                                                        {step.type === 'question' && ((step as any).questionText || 'Pergunta do Quiz')}
                                                        {step.type === 'strategic-question' && ((step as any).questionText || 'Pergunta Estratégica')}
                                                        {step.type === 'transition' && ((step as any).title || 'Tela de Transição')}
                                                        {step.type === 'transition-result' && ((step as any).title || 'Preparando Resultado')}
                                                        {step.type === 'result' && ((step as any).title || 'Resultado do Quiz')}
                                                        {step.type === 'offer' && 'Oferta Personalizada'}
                                                    </>
                                                )}
                                            </div>

                                            {/* Controles de Ação */}
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-6 w-6 text-green-500 hover:bg-green-100"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (useModularSystem) {
                                                            // Duplicar step modular
                                                            const modularStep = step as ModularStep;
                                                            const duplicated = createBlankModularStep(modularStep.type);
                                                            duplicated.name = `${modularStep.name} (Cópia)`;
                                                            duplicated.components = modularStep.components.map(comp => ({
                                                                ...comp,
                                                                id: `comp-${Date.now()}-${Math.random()}`
                                                            }));
                                                            setModularSteps(prev => [...prev, duplicated]);
                                                        } else {
                                                            duplicateStep(step.id);
                                                        }
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
                                                        if (useModularSystem) {
                                                            removeModularStep(step.id);
                                                        } else {
                                                            removeStep(step.id);
                                                        }
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
                                    {useModularSystem ? (
                                        // Opções para sistema modular
                                        ['intro', 'question', 'result', 'custom'].map(type => (
                                            <button
                                                key={type}
                                                className="w-full px-3 py-2 text-left text-[11px] hover:bg-gray-50 flex items-center gap-2 border-b last:border-b-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addModularStep(type);
                                                    setActiveInsertDropdown(null);
                                                }}
                                            >
                                                <span>
                                                    {type === 'intro' && '🏠'}
                                                    {type === 'question' && '❓'}
                                                    {type === 'result' && '🏆'}
                                                    {type === 'custom' && '⚙️'}
                                                </span>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </button>
                                        ))
                                    ) : (
                                        // Opções para sistema antigo
                                        STEP_TYPES.map(type => (
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
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* COL 2 - BIBLIOTECA DE COMPONENTES */}
                <div className="w-72 border-r flex flex-col">
                    <div className="p-3 border-b text-xs font-semibold">Biblioteca de Componentes</div>

                    {/* Seção de Componentes Disponíveis */}
                    <div className="p-3 border-b">
                        <label className="block text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
                            Adicionar Componente
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {STEP_TYPES.map(type => (
                                <Button
                                    key={type}
                                    size="sm"
                                    variant="outline"
                                    className="text-[10px] h-8 flex flex-col items-center p-1"
                                    onClick={() => addStepAfter(selectedId, type)}
                                >
                                    <span className="truncate w-full text-center">
                                        {type === 'intro' && '🏠 Intro'}
                                        {type === 'question' && '❓ Pergunta'}
                                        {type === 'strategic-question' && '🎯 Estratégica'}
                                        {type === 'transition' && '⏳ Transição'}
                                        {type === 'transition-result' && '🔄 Trans. Result'}
                                        {type === 'result' && '🏆 Resultado'}
                                        {type === 'offer' && '🎁 Oferta'}
                                    </span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Configuração do Componente Selecionado */}
                    <div className="flex-1 overflow-auto p-3 text-xs space-y-4">
                        {selectedStep && (
                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                                    Configurar Componente
                                </label>
                                <div className="bg-blue-50 p-2 rounded border">
                                    <div className="font-medium text-blue-700 mb-1">
                                        {selectedStep.type.toUpperCase()}
                                    </div>
                                    <div className="text-[10px] text-blue-600">
                                        Componente selecionado para edição
                                    </div>
                                </div>
                                <select
                                    className="w-full border rounded px-2 py-1 text-xs"
                                    value={selectedStep.type}
                                    onChange={e => updateStep(selectedStep.id, { type: e.target.value as any })}
                                >
                                    {STEP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>

                                {selectedStep.type === 'question' && (
                                    <div className="pt-2 border-t space-y-2">
                                        <div className="flex items-center justify-between text-[10px] font-medium">
                                            <span>Opções</span>
                                            <Button size="sm" variant="ghost" onClick={() =>
                                                updateStep(selectedStep.id, {
                                                    options: [...(selectedStep.options || []),
                                                    { id: `opt-${Date.now()}`, text: 'Nova opção' }]
                                                })
                                            }>+ Add</Button>
                                        </div>
                                        <div className="space-y-2">
                                            {(selectedStep.options || []).map((opt: any, oi: number) => (
                                                <div key={opt.id} className="border rounded p-2 space-y-1">
                                                    <div className="flex items-center gap-1">
                                                        <input
                                                            className="flex-1 border rounded px-1 py-0.5 text-[11px]"
                                                            placeholder="Texto da opção"
                                                            value={opt.text}
                                                            onChange={(e) => {
                                                                const clone = [...(selectedStep.options || [])];
                                                                clone[oi] = { ...clone[oi], text: e.target.value };
                                                                updateStep(selectedStep.id, { options: clone });
                                                            }}
                                                        />
                                                        <Button size="icon" variant="ghost" className="h-5 w-5"
                                                            onClick={() => {
                                                                const clone = (selectedStep.options || []).filter((_: any, i: number) => i !== oi);
                                                                updateStep(selectedStep.id, { options: clone });
                                                            }}>
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                    <input
                                                        className="w-full border rounded px-1 py-0.5 text-[11px]"
                                                        placeholder="URL da imagem (opcional)"
                                                        value={opt.image || ''}
                                                        onChange={(e) => {
                                                            const clone = [...(selectedStep.options || [])];
                                                            clone[oi] = { ...clone[oi], image: e.target.value || undefined };
                                                            updateStep(selectedStep.id, { options: clone });
                                                        }}
                                                    />
                                                    {opt.image && (
                                                        <img
                                                            src={opt.image}
                                                            alt="Preview"
                                                            className="w-full h-12 object-cover rounded"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                        {/* Toggle entre sistema antigo e modular */}
                        <div className="mb-4 flex items-center gap-2">
                            <Button
                                size="sm"
                                variant={useModularSystem ? "default" : "outline"}
                                onClick={() => setUseModularSystem(true)}
                                className="h-6 text-[10px]"
                            >
                                🎯 Sistema Modular
                            </Button>
                            <Button
                                size="sm"
                                variant={!useModularSystem ? "default" : "outline"}
                                onClick={() => setUseModularSystem(false)}
                                className="h-6 text-[10px]"
                            >
                                🔧 Sistema Antigo
                            </Button>
                        </div>

                        {useModularSystem ? (
                            // NOVO SISTEMA MODULAR
                            modularSteps.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                    <div className="text-center">
                                        <div className="text-lg mb-2">🎯</div>
                                        <div>Nenhum step criado ainda</div>
                                        <div className="text-xs">Use a sidebar para adicionar steps</div>
                                    </div>
                                </div>
                            ) : selectedModularStep ? (
                                <ModularStepRenderer
                                    step={selectedModularStep}
                                    isEditable={previewMode === 'edit'}
                                    selectedComponentId={selectedComponentId}
                                    onUpdateStep={updateModularStep}
                                    onSelectComponent={setSelectedComponentId}
                                    onOpenComponentProperties={(componentId) => {
                                        setSelectedBlockId(componentId);
                                        setShowPropertiesPanel(true);
                                    }}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                    <div className="text-center">
                                        <div className="text-lg mb-2">📝</div>
                                        <div>Selecione um step para editar</div>
                                        <div className="text-xs">Use a sidebar à esquerda para selecionar</div>
                                    </div>
                                </div>
                            )
                        ) : (
                            // SISTEMA ANTIGO
                            steps.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                    <div className="text-center">
                                        <div className="text-lg mb-2">🎯</div>
                                        <div>Nenhum step criado ainda</div>
                                        <div className="text-xs">Use a sidebar para adicionar steps</div>
                                    </div>
                                </div>
                            ) : selectedStep ? (
                                // Renderizar apenas o step selecionado
                                <div className="p-4">
                                    {renderRealComponent(selectedStep, steps.findIndex(s => s.id === selectedStep.id))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                    <div className="text-center">
                                        <div className="text-lg mb-2">📝</div>
                                        <div>Selecione um step para editar</div>
                                        <div className="text-xs">Use a sidebar à esquerda para selecionar</div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* COL 4 - PAINEL DE PROPRIEDADES APRIMORADO */}
                {showPropertiesPanel && (
                    <div className="w-80">
                        <QuizPropertiesPanel
                            selectedStep={selectedBlockId ? selectedStep : null}
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
    );
};

export default QuizFunnelEditorWYSIWYG;