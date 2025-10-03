import React, { useEffect, useState, useCallback } from 'react';
import { useUnifiedCRUD } from '@/context/UnifiedCRUDProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QUIZ_STEPS, type QuizStep } from '@/data/quizSteps';
import { Plus, Save, Trash2, ArrowUp, ArrowDown, Copy, Eye, ChevronDown } from 'lucide-react';
import './QuizEditorStyles.css';

// Importar componentes reais de produção para preview WYSIWYG
import IntroStep from '@/components/quiz/IntroStep';
import QuestionStep from '@/components/quiz/QuestionStep';
import StrategicQuestionStep from '@/components/quiz/StrategicQuestionStep';
import TransitionStep from '@/components/quiz/TransitionStep';
import ResultStep from '@/components/quiz/ResultStep';
import OfferStep from '@/components/quiz/OfferStep';

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

    // Carregar steps iniciais
    useEffect(() => {
        const existing = (crud.currentFunnel as any)?.quizSteps as EditableQuizStep[] | undefined;
        if (existing && existing.length) {
            setSteps(existing.map(s => ({ ...s })));
            setSelectedId(existing[0].id);
            return;
        }
        const conv: EditableQuizStep[] = Object.entries(QUIZ_STEPS).map(([id, step]) => ({ id, ...step as QuizStep }));
        setSteps(conv);
        if (conv.length) setSelectedId(conv[0].id);
    }, [crud.currentFunnel]);

    const selectedStep = steps.find(s => s.id === selectedId);

    const updateStep = useCallback((id: string, patch: Partial<EditableQuizStep>) => {
        setSteps(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));
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

    // Função para renderizar componente real no preview
    const renderRealComponent = (step: EditableQuizStep) => {
        const mockProps = {
            onNameSubmit: () => console.log('Mock: Nome submetido'),
            onAnswersChange: () => console.log('Mock: Respostas alteradas'),
            onComplete: () => console.log('Mock: Transição completa'),
            currentAnswers: [],
            scores: {
                natural: 0,
                classico: 0,
                contemporaneo: 0,
                elegante: 0,
                extravagante: 0,
                casual: 0,
                colorido: 0,
                minimalista: 0,
                romantico: 0,
                sexy: 0,
                dramatico: 0,
                criativo: 0
            },
            strategicAnswers: {},
            userName: 'Preview'
        };

        // Wrapper para capturar cliques e tornar selecionável
        const SelectableWrapper: React.FC<{ children: React.ReactNode; blockId: string; label: string }> =
            ({ children, blockId, label }) => (
                <div
                    className={`relative cursor-pointer transition-all duration-200 ${selectedBlockId === blockId
                        ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50'
                        : 'hover:ring-1 hover:ring-gray-300'
                        }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBlockId(blockId);
                    }}
                    data-block-id={blockId}
                    data-block-label={label}
                >
                    {selectedBlockId === blockId && (
                        <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 text-xs rounded z-10">
                            {label}
                        </div>
                    )}
                    {children}
                </div>
            );

        try {
            switch (step.type) {
                case 'intro':
                    return (
                        <SelectableWrapper blockId={`${step.id}-intro`} label="Introdução">
                            <IntroStep data={step} onNameSubmit={mockProps.onNameSubmit} />
                        </SelectableWrapper>
                    );
                case 'question':
                    return (
                        <SelectableWrapper blockId={`${step.id}-question`} label="Pergunta">
                            <QuestionStep
                                data={step}
                                currentAnswers={mockProps.currentAnswers}
                                onAnswersChange={mockProps.onAnswersChange}
                            />
                        </SelectableWrapper>
                    );
                case 'strategic-question':
                    return (
                        <SelectableWrapper blockId={`${step.id}-strategic`} label="Pergunta Estratégica">
                            <StrategicQuestionStep
                                data={step}
                                currentAnswer=""
                                onAnswerChange={() => console.log('Mock: Resposta estratégica')}
                            />
                        </SelectableWrapper>
                    );
                case 'transition':
                case 'transition-result':
                    return (
                        <SelectableWrapper blockId={`${step.id}-transition`} label="Transição">
                            <TransitionStep data={step} onComplete={mockProps.onComplete} />
                        </SelectableWrapper>
                    );
                case 'result':
                    return (
                        <SelectableWrapper blockId={`${step.id}-result`} label="Resultado">
                            <ResultStep
                                data={step}
                                userProfile={{
                                    userName: mockProps.userName,
                                    resultStyle: 'Preview Style',
                                    secondaryStyles: []
                                }}
                                scores={mockProps.scores}
                            />
                        </SelectableWrapper>
                    );
                case 'offer':
                    return (
                        <SelectableWrapper blockId={`${step.id}-offer`} label="Oferta">
                            <OfferStep
                                data={step}
                                userProfile={{
                                    userName: mockProps.userName,
                                    resultStyle: 'Preview Style'
                                }}
                                offerKey="default"
                            />
                        </SelectableWrapper>
                    );
                default:
                    return (
                        <SelectableWrapper blockId={`${step.id}-unknown`} label="Tipo Desconhecido">
                            <div className="p-4 border-2 border-dashed border-gray-300 rounded">
                                Tipo de step desconhecido: {step.type}
                            </div>
                        </SelectableWrapper>
                    );
            }
        } catch (error) {
            return (
                <SelectableWrapper blockId={`${step.id}-error`} label="Erro">
                    <div className="p-4 border-2 border-red-300 bg-red-50 rounded">
                        <p className="text-red-600 font-semibold">Erro ao renderizar componente</p>
                        <p className="text-red-500 text-sm">{String(error)}</p>
                    </div>
                </SelectableWrapper>
            );
        }
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
                {/* COL 1 - SEQUÊNCIA DE ETAPAS */}
                <div className="w-60 border-r flex flex-col">
                    <div className="p-3 flex items-center justify-between border-b">
                        <span className="text-xs font-semibold">Sequência do Funil</span>
                        <Badge variant="secondary" className="text-[10px]">{steps.length}</Badge>
                    </div>
                    <div className="flex-1 overflow-auto text-xs">
                        {steps.map((s, idx) => {
                            const active = s.id === selectedId;
                            return (
                                <div key={s.id}>
                                    {/* Zona de Inserção no Topo (apenas no primeiro elemento) */}
                                    {idx === 0 && (
                                        <div className="group/insert relative">
                                            <div className="h-1 hover:h-8 transition-all bg-transparent hover:bg-blue-50 border-2 border-dashed border-transparent hover:border-blue-300 flex items-center justify-center">
                                                <div className="opacity-0 group-hover/insert:opacity-100 transition-opacity">
                                                    <div className="relative">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-6 text-[10px] bg-white shadow-sm"
                                                            onClick={() => setActiveInsertDropdown(activeInsertDropdown === `before-${s.id}` ? null : `before-${s.id}`)}
                                                        >
                                                            <Plus className="w-3 h-3 mr-1" /> Inserir no Início
                                                            <ChevronDown className="w-3 h-3 ml-1" />
                                                        </Button>

                                                        {/* Dropdown Menu */}
                                                        {activeInsertDropdown === `before-${s.id}` && (
                                                            <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-50 min-w-32">
                                                                {STEP_TYPES.map(type => (
                                                                    <button
                                                                        key={type}
                                                                        className="w-full px-3 py-2 text-left text-[11px] hover:bg-gray-50 flex items-center gap-2"
                                                                        onClick={() => {
                                                                            addStepBefore(s.id, type);
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
                                                                        {type.replace('-', ' ')}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Elemento Step */}
                                    <div
                                        className={`relative border-b cursor-pointer group transition-all ${active ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                                            }`}
                                        onClick={() => setSelectedId(s.id)}
                                    >
                                        {/* Indicador de Posição */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500" />

                                        <div className="pl-4 pr-3 py-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                                                    {idx + 1}
                                                </div>
                                                <span className="font-medium truncate flex-1">
                                                    {s.type === 'intro' && '🏠 Introdução'}
                                                    {s.type === 'question' && '❓ Pergunta'}
                                                    {s.type === 'strategic-question' && '🎯 Estratégica'}
                                                    {s.type === 'transition' && '⏳ Transição'}
                                                    {s.type === 'transition-result' && '🔄 Trans. Result'}
                                                    {s.type === 'result' && '🏆 Resultado'}
                                                    {s.type === 'offer' && '🎁 Oferta'}
                                                </span>
                                            </div>

                                            {/* Preview do conteúdo */}
                                            <div className="text-[10px] text-gray-500 mb-2 truncate">
                                                {s.type === 'intro' && (s.title || 'Introdução do Quiz')}
                                                {s.type === 'question' && (s.questionText || 'Pergunta do Quiz')}
                                                {s.type === 'strategic-question' && (s.questionText || 'Pergunta Estratégica')}
                                                {s.type === 'transition' && (s.title || 'Tela de Transição')}
                                                {s.type === 'transition-result' && (s.title || 'Preparando Resultado')}
                                                {s.type === 'result' && (s.title || 'Resultado do Quiz')}
                                                {s.type === 'offer' && 'Oferta Personalizada'}
                                            </div>

                                            {/* Controles de Ação */}
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-6 w-6 text-blue-500 hover:bg-blue-100"
                                                    disabled={idx === 0}
                                                    onClick={(e) => { e.stopPropagation(); moveStep(s.id, -1); }}
                                                    title="Mover para cima"
                                                >
                                                    <ArrowUp className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-6 w-6 text-blue-500 hover:bg-blue-100"
                                                    disabled={idx === steps.length - 1}
                                                    onClick={(e) => { e.stopPropagation(); moveStep(s.id, 1); }}
                                                    title="Mover para baixo"
                                                >
                                                    <ArrowDown className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-6 w-6 text-green-500 hover:bg-green-100"
                                                    onClick={(e) => { e.stopPropagation(); duplicateStep(s.id); }}
                                                    title="Duplicar"
                                                >
                                                    <Copy className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-6 w-6 text-red-500 hover:bg-red-100"
                                                    onClick={(e) => { e.stopPropagation(); removeStep(s.id); }}
                                                    title="Remover"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Conexão Visual para o Próximo Step */}
                                        {idx < steps.length - 1 && (
                                            <div className="absolute bottom-0 left-7 w-0.5 h-3 bg-gradient-to-b from-purple-400 to-blue-400" />
                                        )}
                                    </div>

                                    {/* Zona de Inserção Entre Elementos */}
                                    <div className="group/insert relative">
                                        <div className="h-1 hover:h-8 transition-all bg-transparent hover:bg-green-50 border-2 border-dashed border-transparent hover:border-green-300 flex items-center justify-center">
                                            <div className="opacity-0 group-hover/insert:opacity-100 transition-opacity">
                                                <div className="relative">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-6 text-[10px] bg-white shadow-sm border-green-300 text-green-600 hover:bg-green-50"
                                                        onClick={() => setActiveInsertDropdown(activeInsertDropdown === `after-${s.id}` ? null : `after-${s.id}`)}
                                                    >
                                                        <Plus className="w-3 h-3 mr-1" /> Inserir Após
                                                        <ChevronDown className="w-3 h-3 ml-1" />
                                                    </Button>

                                                    {/* Dropdown Menu */}
                                                    {activeInsertDropdown === `after-${s.id}` && (
                                                        <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-50 min-w-32">
                                                            {STEP_TYPES.map(type => (
                                                                <button
                                                                    key={type}
                                                                    className="w-full px-3 py-2 text-left text-[11px] hover:bg-gray-50 flex items-center gap-2"
                                                                    onClick={() => {
                                                                        addStepAfter(s.id, type);
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
                                                                    {type.replace('-', ' ')}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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
                                    ))}
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

                {/* COL 3 - PREVIEW WYSIWYG */}
                <div className="flex-1 border-r bg-gray-50 flex flex-col">
                    <div className="p-3 border-b text-xs font-semibold flex items-center gap-2">
                        Preview WYSIWYG
                        {selectedBlockId && (
                            <Badge variant="outline" className="text-[10px]">
                                Bloco selecionado
                            </Badge>
                        )}
                    </div>
                    <div
                        className="flex-1 overflow-auto"
                        onClick={() => setSelectedBlockId('')} // Limpar seleção ao clicar no fundo
                    >
                        {!selectedStep ? (
                            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                Selecione uma etapa para ver o preview
                            </div>
                        ) : previewMode === 'preview' ? (
                            // Renderizar componente real de produção
                            <div className="min-h-full">
                                {renderRealComponent(selectedStep)}
                            </div>
                        ) : (
                            // Modo de edição com preview simplificado
                            <div className="p-4">
                                <div className="bg-white p-4 rounded border shadow-sm">
                                    <h4 className="font-semibold mb-2">{selectedStep.type}</h4>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Clique em "Preview" para ver o componente real
                                    </p>
                                    <Button
                                        size="sm"
                                        onClick={() => setPreviewMode('preview')}
                                        className="w-full"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Ver Preview Real
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* COL 4 - PROPRIEDADES */}
                <div className="w-80 flex flex-col">
                    <div className="p-3 border-b text-xs font-semibold">
                        Propriedades
                        {selectedBlockId && (
                            <div className="text-[10px] text-blue-600 mt-1">
                                Editando: {selectedBlockId}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 overflow-auto p-4 text-xs space-y-4">
                        {!selectedStep ? (
                            <div className="text-muted-foreground text-[11px]">Selecione uma etapa.</div>
                        ) : (
                            <>
                                <div>
                                    <label className="block mb-1 font-medium">ID</label>
                                    <input disabled value={selectedStep.id} className="w-full border rounded px-2 py-1 text-[11px] bg-muted/30" />
                                </div>

                                {selectedStep.type === 'intro' && (
                                    <>
                                        <div>
                                            <label className="block mb-1 font-medium">Título</label>
                                            <textarea
                                                rows={3}
                                                value={selectedStep.title || ''}
                                                onChange={e => updateStep(selectedStep.id, { title: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Pergunta do Form</label>
                                            <input
                                                value={selectedStep.formQuestion || ''}
                                                onChange={e => updateStep(selectedStep.id, { formQuestion: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Placeholder</label>
                                            <input
                                                value={selectedStep.placeholder || ''}
                                                onChange={e => updateStep(selectedStep.id, { placeholder: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Texto do Botão</label>
                                            <input
                                                value={selectedStep.buttonText || ''}
                                                onChange={e => updateStep(selectedStep.id, { buttonText: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">URL da Imagem</label>
                                            <input
                                                value={selectedStep.image || ''}
                                                onChange={e => updateStep(selectedStep.id, { image: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                                placeholder="https://..."
                                            />
                                            {selectedStep.image && (
                                                <img
                                                    src={selectedStep.image}
                                                    alt="Preview"
                                                    className="w-full h-16 object-cover rounded mt-1"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </>
                                )}

                                {selectedStep.type === 'question' && (
                                    <>
                                        <div>
                                            <label className="block mb-1 font-medium">Número da Pergunta</label>
                                            <input
                                                value={selectedStep.questionNumber || ''}
                                                onChange={e => updateStep(selectedStep.id, { questionNumber: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Texto da Pergunta</label>
                                            <textarea
                                                rows={3}
                                                value={selectedStep.questionText || ''}
                                                onChange={e => updateStep(selectedStep.id, { questionText: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Seleções Obrigatórias</label>
                                            <input
                                                type="number"
                                                value={selectedStep.requiredSelections || 1}
                                                onChange={e => updateStep(selectedStep.id, { requiredSelections: parseInt(e.target.value) || 1 })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                    </>
                                )}

                                {selectedStep.type === 'strategic-question' && (
                                    <div>
                                        <label className="block mb-1 font-medium">Pergunta Estratégica</label>
                                        <textarea
                                            rows={3}
                                            value={selectedStep.questionText || ''}
                                            onChange={e => updateStep(selectedStep.id, { questionText: e.target.value })}
                                            className="w-full border rounded px-2 py-1 text-[11px]"
                                        />
                                    </div>
                                )}

                                {(selectedStep.type === 'transition' || selectedStep.type === 'transition-result') && (
                                    <div>
                                        <label className="block mb-1 font-medium">Título</label>
                                        <input
                                            value={selectedStep.title || ''}
                                            onChange={e => updateStep(selectedStep.id, { title: e.target.value })}
                                            className="w-full border rounded px-2 py-1 text-[11px]"
                                        />
                                    </div>
                                )}

                                {selectedStep.type === 'result' && (
                                    <div>
                                        <label className="block mb-1 font-medium">Título do Resultado</label>
                                        <input
                                            value={selectedStep.title || ''}
                                            onChange={e => updateStep(selectedStep.id, { title: e.target.value })}
                                            className="w-full border rounded px-2 py-1 text-[11px]"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block mb-1 font-medium">Próximo Step</label>
                                    <select
                                        value={selectedStep.nextStep || ''}
                                        onChange={e => updateStep(selectedStep.id, { nextStep: e.target.value })}
                                        className="w-full border rounded px-2 py-1 text-[11px]"
                                    >
                                        <option value="">Selecione...</option>
                                        {steps.map(s => (
                                            <option key={s.id} value={s.id}>{s.id} ({s.type})</option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizFunnelEditorWYSIWYG;