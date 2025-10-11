/**
 * ⚠️ ⚠️ ⚠️ DEPRECATED - NÃO USAR ⚠️ ⚠️ ⚠️
 * 
 * Este editor foi DEPRECIADO em 11/out/2025 (Sprint 3).
 * 
 * 🚨 Use o editor oficial:
 *    QuizModularProductionEditor
 *    Localização: src/components/editor/quiz/QuizModularProductionEditor.tsx
 *    Rota: /editor
 * 
 * 📋 Guia de migração: MIGRATION_EDITOR.md
 * 
 * ⏰ Este componente será REMOVIDO em 01/nov/2025
 * 
 * @deprecated Use QuizModularProductionEditor instead
 * @see {@link file://./MIGRATION_EDITOR.md}
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useUnifiedCRUD } from '@/contexts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QUIZ_STEPS, type QuizStep } from '@/data/quizSteps';
import { Plus, Save, Trash2, ArrowUp, ArrowDown, Copy, Eye, ChevronDown, ChevronLeft, ChevronRight, Settings, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import './QuizEditorStyles.css';
// Imports adicionais necessários
import { stepToBlocks } from '@/editor/utils/stepToBlocks';
import { BlockRenderer } from '@/editor/components/BlockRenderer';
import DragDropManager from '@/components/editor/DragDropManager';
import ModularCanvasRenderer from '@/editor/components/ModularCanvasRenderer';
import QuizPropertiesPanel from '@/components/editor/QuizPropertiesPanel';

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

// 🚀 SISTEMA HÍBRIDO: Blocos modulares dentro de steps
// (imports seguintes permanecem inalterados mais abaixo)

interface QuizFunnelEditorProps {
    funnelId?: string;
    templateId?: string;
}

// 🎯 TIPO ESTENDIDO COM TODAS AS CONFIGURAÇÕES DE PRODUÇÃO
type EditableQuizStep = QuizStep & {
    id: string;
    // Configurações de pontuação
    scoreValues?: Record<string, number>;
    // Layout e visual
    columns?: number;
    imageSize?: { width: number; height: number };
    // Comportamento
    autoAdvance?: boolean;
    transition?: { type: string; duration: number };
    validationRules?: { required: boolean; minSelections?: number; maxSelections?: number };
    // Analytics e tracking
    analytics?: { trackSelections: boolean; trackTime?: boolean };
    seo?: { title?: string; description?: string; keywords?: string };
    pixel?: { facebook?: string; google?: string };
    utm?: { source?: string; medium?: string; campaign?: string };
    // Ordem explícita dos blocos (ids) após reordenação manual
    blockOrder?: string[];
};

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
    // ⚠️ DEPRECATION WARNING
    useEffect(() => {
        console.warn(
            '⚠️⚠️⚠️ DEPRECATED: QuizFunnelEditorWYSIWYG foi depreciado em 11/out/2025.\n' +
            '✅ Use QuizModularProductionEditor em vez disso.\n' +
            '📋 Guia de migração: MIGRATION_EDITOR.md\n' +
            '⏰ Este componente será removido em 01/nov/2025'
        );
    }, []);

    // Feature flag Template Engine
    const useTemplateEngine = (import.meta as any).env?.VITE_USE_TEMPLATE_ENGINE === 'true';
    // Permitir override por query param ?templateId=xxx
    const [queryTemplateId, setQueryTemplateId] = useState<string | undefined>(templateId);
    useEffect(() => {
        try {
            const sp = new URLSearchParams(window.location.search);
            const qid = sp.get('templateId');
            if (qid) setQueryTemplateId(qid);
        } catch { }
    }, []);
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
    const [useModularBlocks, setUseModularBlocks] = useState(true); // 🎯 NOVO: Toggle para blocos modulares

    // Carregar steps iniciais - Sistema Unificado usando componentes editáveis
    useEffect(() => {
        // Se não estiver com Template Engine, comportamento padrão atual
        if (!useTemplateEngine || !queryTemplateId) {
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
    }, [crud.currentFunnel, useTemplateEngine, queryTemplateId]);

    const selectedStep = steps.find(s => s.id === selectedId);

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


    // 🚀 COMPONENTES DE PRODUÇÃO REAIS - Sistema Unificado
    // 🚀 SISTEMA HÍBRIDO UNIFICADO - Blocos Visuais com Reordenação Independente
    const renderHybridStep = (step: EditableQuizStep, index: number) => {
        const isEditMode = previewMode === 'edit';
        const stepBlockId = `step-${step.id}`;
        const isStepSelected = selectedBlockId === stepBlockId;

        // 🎯 DADOS COMPLETOS DO FUNIL (mesmo formato do /quiz-estilo)
        const productionStepData = {
            ...step,
            // Garantir que todas as configurações de produção estejam presentes
            scoreValues: step.scoreValues || {},
            columns: step.columns || 2,
            imageSize: step.imageSize || { width: 256, height: 256 },
            autoAdvance: step.autoAdvance || false,
            transition: step.transition || { type: 'fade', duration: 500 },
            validationRules: step.validationRules || { required: true },
            analytics: step.analytics || { trackSelections: true },
            seo: step.seo || {},
            pixel: step.pixel || {},
            utm: step.utm || {}
        };

        // 🎯 DECOMPOSIÇÃO EM BLOCOS MODULARES
        let blocks = stepToBlocks(productionStepData);
        // Aplicar ordem custom se existir
        if (step.blockOrder && step.blockOrder.length) {
            const map = new Map(blocks.map(b => [b.id, b]));
            const ordered: any[] = [];
            step.blockOrder.forEach(id => {
                const blk = map.get(id);
                if (blk) ordered.push(blk);
            });
            // Adicionar blocos novos que ainda não estavam em blockOrder
            blocks.forEach(b => { if (!step.blockOrder?.includes(b.id)) ordered.push(b); });
            // Reatribuir ordem sequencial
            blocks = ordered.map((b, i) => ({ ...b, order: i + 1 }));
        }

        // 🎨 HANDLERS PARA BLOCOS
        const handleBlockSelect = (blockId: string) => {
            setSelectedBlockId(blockId);
            setSelectedId(step.id); // Garantir que o step também esteja selecionado
        };

        const handleBlockUpdate = (blockId: string, updates: any) => {
            // Mapear blockId -> propriedade do step
            // Padrões simples: title, image, formQuestion, buttonText, questionText, options
            const newStep: Partial<EditableQuizStep> = {};
            if (blockId.includes('title') && typeof updates.text === 'string') {
                newStep.title = updates.text;
            }
            if (blockId.includes('image') && updates.src) {
                (newStep as any).image = updates.src;
            }
            if (blockId.includes('form-input')) {
                if (updates.label) newStep.formQuestion = updates.label;
                if (updates.placeholder !== undefined) newStep.placeholder = updates.placeholder;
            }
            if (blockId.includes('button') && updates.text) {
                newStep.buttonText = updates.text;
            }
            if (blockId.includes('question-text') && updates.text) {
                newStep.questionText = updates.text;
            }
            if (blockId.includes('options') && updates.options) {
                (newStep as any).options = updates.options;
            }
            if (Object.keys(newStep).length) {
                updateStep(step.id, newStep as any);
            }
        };

        const handleBlockReorder = (blockId: string, direction: 'up' | 'down') => {
            // Gerar lista atual de ids
            const currentOrder = step.blockOrder && step.blockOrder.length
                ? step.blockOrder.slice()
                : blocks.map(b => b.id);
            const idx = currentOrder.indexOf(blockId);
            if (idx === -1) return;
            const target = direction === 'up' ? idx - 1 : idx + 1;
            if (target < 0 || target >= currentOrder.length) return;
            [currentOrder[idx], currentOrder[target]] = [currentOrder[target], currentOrder[idx]];
            updateStep(step.id, { blockOrder: currentOrder });
        };

        return (
            <div className="hybrid-step-container">
                {/* Header do Step */}
                <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded-t-lg border">
                    <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-xs">
                            Step {index + 1} / {steps.length}
                        </Badge>
                        <span className="text-sm font-semibold text-blue-700">
                            {step.type.toUpperCase().replace('-', ' ')}
                        </span>
                    </div>

                    {/* Controles do Step */}
                    <div className="flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => index > 0 && setSelectedId(steps[index - 1].id)}
                            title="Step anterior"
                            disabled={index === 0}
                        >
                            <ChevronLeft className="w-3 h-3" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => index < steps.length - 1 && setSelectedId(steps[index + 1].id)}
                            title="Próximo step"
                            disabled={index === steps.length - 1}
                        >
                            <ChevronRight className="w-3 h-3" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => duplicateStep(step.id)}
                            title="Duplicar step"
                        >
                            <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                            onClick={() => {
                                if (confirm(`Remover step ${index + 1}?`)) {
                                    removeStep(step.id);
                                }
                            }}
                            title="Remover step"
                            disabled={steps.length === 1}
                        >
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    </div>
                </div>

                {/* Blocos Modulares do Step */}
                <div className="step-blocks-container space-y-2">
                    {blocks.map((block: any, blockIndex: number) => {
                        const isBlockSelected = selectedBlockId === block.id;

                        return (
                            <div
                                key={block.id}
                                className={cn(
                                    "block-section relative border rounded-lg p-3 bg-white transition-all duration-200 cursor-pointer group",
                                    isBlockSelected
                                        ? "ring-2 ring-blue-500 bg-blue-50/30"
                                        : "border-gray-200 hover:border-blue-300"
                                )}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleBlockSelect(block.id);
                                }}
                            >
                                {/* Label do Bloco */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">
                                            {block.metadata?.icon} {block.metadata?.label}
                                        </span>
                                        <Badge variant="outline" className="text-[10px]">
                                            {block.type}
                                        </Badge>
                                    </div>

                                    {/* Controles de Reordenação do Bloco */}
                                    {isEditMode && (
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleBlockReorder(block.id, 'up');
                                                }}
                                                title="Mover bloco para cima"
                                                disabled={blockIndex === 0}
                                            >
                                                <ArrowUp className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleBlockReorder(block.id, 'down');
                                                }}
                                                title="Mover bloco para baixo"
                                                disabled={blockIndex === blocks.length - 1}
                                            >
                                                <ArrowDown className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Renderização do Bloco */}
                                <BlockRenderer
                                    block={block}
                                    isEditable={isEditMode}
                                    isSelected={isBlockSelected}
                                    onUpdate={(updates: any) => handleBlockUpdate(block.id, updates)}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }; // fim renderHybridStep

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

                {/* 🎯 NOVO: Toggle Blocos Modulares */}
                <Button
                    size="sm"
                    variant={useModularBlocks ? 'default' : 'outline'}
                    onClick={() => setUseModularBlocks(!useModularBlocks)}
                    title="Ativar/Desativar Blocos Modulares"
                >
                    📦 Blocos {useModularBlocks ? 'ON' : 'OFF'}
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
                            {steps.length}
                        </Badge>
                    </div>
                    <div className="flex-1 overflow-auto text-xs">
                        {/* Lista Reordenável de Steps com DragDropManager */}
                        <DragDropManager
                            items={steps}
                            onReorder={handleStepReorder}
                            enabled={dragEnabled}
                            renderItem={(step: EditableQuizStep, index: number, isDragging: boolean) => {
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
                                                    {step.type === 'intro' && '🏠 Introdução'}
                                                    {step.type === 'question' && '❓ Pergunta'}
                                                    {step.type === 'strategic-question' && '🎯 Estratégica'}
                                                    {step.type === 'transition' && '⏳ Transição'}
                                                    {step.type === 'transition-result' && '🔄 Trans. Result'}
                                                    {step.type === 'result' && '🏆 Resultado'}
                                                    {step.type === 'offer' && '🎁 Oferta'}
                                                </span>
                                            </div>

                                            {/* Preview do conteúdo */}
                                            <div className="text-[10px] text-gray-500 mb-2 truncate">
                                                {step.type === 'intro' && ((step as any).title || 'Introdução do Quiz')}
                                                {step.type === 'question' && ((step as any).questionText || 'Pergunta do Quiz')}
                                                {step.type === 'strategic-question' && ((step as any).questionText || 'Pergunta Estratégica')}
                                                {step.type === 'transition' && ((step as any).title || 'Tela de Transição')}
                                                {step.type === 'transition-result' && ((step as any).title || 'Preparando Resultado')}
                                                {step.type === 'result' && ((step as any).title || 'Resultado do Quiz')}
                                                {step.type === 'offer' && 'Oferta Personalizada'}
                                            </div>

                                            {/* Controles de Ação */}
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
                        {steps.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                <div className="text-center">
                                    <div className="text-lg mb-2">🎯</div>
                                    <div>Nenhum step criado ainda</div>
                                    <div className="text-xs">Use a sidebar para adicionar steps</div>
                                </div>
                            </div>
                        ) : selectedStep ? (
                            // 🎯 CANVAS INDIVIDUAL: APENAS O STEP SELECIONADO
                            <div className="h-full">
                                {(() => {
                                    const step = selectedStep;
                                    const index = steps.findIndex(s => s.id === selectedStep.id);
                                    const isSelected = true; // sempre true pois é o step selecionado
                                    const blockId = `step-${step.id}`;

                                    // 🎯 NOVO: Usar blocos modulares se ativado
                                    if (useModularBlocks) {
                                        return (
                                            <ModularCanvasRenderer
                                                key={step.id}
                                                step={step}
                                                index={index}
                                                totalSteps={steps.length}
                                                isSelected={isSelected}
                                                selectedBlockId={selectedBlockId}
                                                isEditMode={previewMode === 'edit'}
                                                steps={steps} // Passar lista completa de steps
                                                renderComponent={renderHybridStep} // Usar o sistema híbrido unificado
                                                onSelectStep={() => {
                                                    setSelectedId(step.id);
                                                    setSelectedBlockId(blockId);
                                                }}
                                                onSelectBlock={(blockId: string) => {
                                                    setSelectedBlockId(blockId);
                                                    setSelectedId(step.id);
                                                }}
                                                onUpdateBlock={(blockId: string, props: any) => {
                                                    // TODO: implementar atualização de bloco individual
                                                    console.log('Update block:', blockId, props);
                                                }}
                                                onReorderBlock={(blockId: string, direction: 'up' | 'down') => {
                                                    const currentStep = steps.find(s => s.id === step.id);
                                                    if (!currentStep) return;
                                                    const currentBlocks = stepToBlocks(currentStep as any);
                                                    const order = currentStep.blockOrder && currentStep.blockOrder.length
                                                        ? currentStep.blockOrder.slice()
                                                        : currentBlocks.map(b => b.id);
                                                    const idx = order.indexOf(blockId);
                                                    if (idx === -1) return;
                                                    const target = direction === 'up' ? idx - 1 : idx + 1;
                                                    if (target < 0 || target >= order.length) return;
                                                    [order[idx], order[target]] = [order[target], order[idx]];
                                                    updateStep(currentStep.id, { blockOrder: order });
                                                }}
                                                onMoveStep={(direction: number) => moveStep(step.id, direction)}
                                                onNavigateStep={(stepId: string) => setSelectedId(stepId)} // Navegação entre steps
                                                onDuplicateStep={() => duplicateStep(step.id)}
                                                onDeleteStep={() => {
                                                    if (confirm(`Remover step ${index + 1}?`)) {
                                                        removeStep(step.id);
                                                    }
                                                }}
                                            />
                                        );
                                    }

                                    // 🔄 MODO ANTIGO: Renderização tradicional do step selecionado
                                    return (
                                        <div
                                            key={step.id}
                                            className={cn(
                                                "border-2 rounded-lg p-4 transition-all duration-200 cursor-pointer relative h-full",
                                                "border-blue-500 shadow-lg bg-blue-50/30 ring-2 ring-blue-300 ring-offset-2"
                                            )}
                                            onClick={() => {
                                                setSelectedId(step.id);
                                                setSelectedBlockId(blockId);
                                            }}
                                        >
                                            {/* Header do Step */}
                                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="default" className="text-xs">
                                                        Step {index + 1} / {steps.length}
                                                    </Badge>
                                                    <span className="text-sm font-semibold text-blue-700">
                                                        {step.type.toUpperCase().replace('-', ' ')}
                                                    </span>
                                                    <Badge variant="secondary" className="text-[10px]">
                                                        ✏️ Editando
                                                    </Badge>
                                                </div>

                                                {/* Navegação entre steps */}
                                                <div className="flex gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 w-7 p-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const prevIndex = index - 1;
                                                            if (prevIndex >= 0) {
                                                                setSelectedId(steps[prevIndex].id);
                                                            }
                                                        }}
                                                        title="Step anterior"
                                                        disabled={index === 0}
                                                    >
                                                        <ChevronLeft className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 w-7 p-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const nextIndex = index + 1;
                                                            if (nextIndex < steps.length) {
                                                                setSelectedId(steps[nextIndex].id);
                                                            }
                                                        }}
                                                        title="Próximo step"
                                                        disabled={index === steps.length - 1}
                                                    >
                                                        <ChevronRight className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 w-7 p-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            duplicateStep(step.id);
                                                        }}
                                                        title="Duplicar"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (confirm(`Remover step ${index + 1}?`)) {
                                                                removeStep(step.id);
                                                            }
                                                        }}
                                                        title="Remover"
                                                        disabled={steps.length === 1}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Renderizar sistema híbrido */}
                                            <div className="transition-opacity opacity-100">
                                                {renderHybridStep(step, index)}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                <div className="text-center">
                                    <div className="text-lg mb-2">🎯</div>
                                    <div>Selecione um step na primeira coluna</div>
                                    <div className="text-xs">Para começar a editar</div>
                                </div>
                            </div>
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