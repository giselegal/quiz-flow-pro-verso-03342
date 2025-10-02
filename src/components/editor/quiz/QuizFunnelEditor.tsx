import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useUnifiedCRUD } from '@/context/UnifiedCRUDProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QUIZ_STEPS, type QuizStep } from '@/data/quizSteps';
import { styleConfigGisele } from '@/data/styles';
import { Plus, Save, Trash2, ArrowUp, ArrowDown, Copy, RefreshCw } from 'lucide-react';

/**
 * QuizFunnelEditor
 * Layout 4 colunas:
 * 1) Steps (lista + reorder + CRUD)
 * 2) Componentes / Tipo & opções base (troca de tipo, geração de esqueleto)
 * 3) Canvas (preview aproximado do step selecionado, isolado)
 * 4) Propriedades (form dinâmico de edição)
 *
 * Persistência: salva em currentFunnel.quizSteps (array) -> crudContext.saveFunnel()
 * Fallback inicial: carrega de currentFunnel.quizSteps || QUIZ_STEPS (transformado em array ordenada por ID natural)
 */

export interface EditableQuizStep extends QuizStep { id: string; }

interface QuizFunnelEditorProps {
    funnelId?: string;
    templateId?: string;
}

const STEP_TYPES: Array<QuizStep['type']> = [
    'intro', 'question', 'strategic-question', 'transition', 'transition-result', 'result', 'offer'
];

// Util para criar novo step básico
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

const QuizFunnelEditor: React.FC<QuizFunnelEditorProps> = ({ funnelId, templateId }) => {
    const crud = useUnifiedCRUD();
    const [steps, setSteps] = useState<EditableQuizStep[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const [previewSelections, setPreviewSelections] = useState<Record<string, string[]>>({});

    // ===================== MODO SIMULAÇÃO (Preview Real) =====================
    const [simActive, setSimActive] = useState(false);
    const [simState, setSimState] = useState<{
        currentStepId: string | null;
        userName: string;
        answers: Record<string, string[]>; // stepId -> option ids
        strategicAnswers: Record<string, string>; // questionText -> option id
        resultStyle?: string;
        secondaryStyles?: string[];
    }>({ currentStepId: null, userName: '', answers: {}, strategicAnswers: {} });
    const transitionTimers = useRef<number[]>([]);

    const orderedSteps = useMemo(() => steps, [steps]);
    const stepById = useCallback((id: string | null) => orderedSteps.find(s => s.id === id), [orderedSteps]);

    const startSimulation = () => {
        const selectedStep = useMemo(() => steps.find(s => s.id === selectedId), [steps, selectedId]);
        
        const updateStep = (id: string, patch: Partial<EditableQuizStep>) => {
            setSteps(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));
        };
        if (!orderedSteps.length) return;
        const first = orderedSteps[0];
        setSimState({ currentStepId: first.id, userName: '', answers: {}, strategicAnswers: {}, resultStyle: undefined, secondaryStyles: undefined });
        setSimActive(true);
    };

    const stopSimulation = () => {
        // Limpar timers
        transitionTimers.current.forEach(t => window.clearTimeout(t));
        transitionTimers.current = [];
        setSimActive(false);
    };

    const gotoStep = (id?: string) => {
        if (!id) return;
        setSimState(prev => ({ ...prev, currentStepId: id }));
    };

    const autoAdvance = (current: EditableQuizStep) => {
        if (!current.nextStep) return;
        const timer = window.setTimeout(() => {
            setSimState(prev => ({ ...prev, currentStepId: current.nextStep! }));
        }, current.type === 'transition' ? 2000 : 1200);
        transitionTimers.current.push(timer);
    };

    const toggleAnswer = (step: EditableQuizStep, optionId: string) => {
        setSimState(prev => {
            const current = prev.answers[step.id] || [];
            let next: string[];
            const max = step.requiredSelections || 1;
            if (current.includes(optionId)) {
                next = current.filter(i => i !== optionId);
            } else {
                if (current.length >= max) return prev; // ignore overflow
                next = [...current, optionId];
            }
            return { ...prev, answers: { ...prev.answers, [step.id]: next } };
        });
    };

    const selectStrategic = (step: EditableQuizStep, optionId: string) => {
        setSimState(prev => ({
            ...prev,
            strategicAnswers: { ...prev.strategicAnswers, [step.questionText || step.id]: optionId }
        }));
        if (step.nextStep) {
            const timer = window.setTimeout(() => gotoStep(step.nextStep), 800);
            transitionTimers.current.push(timer);
        }
    };

    const computeResult = useCallback(() => {
        // Somar frequências dos IDs de opções (assumindo que ID = estilo)
        const counts: Record<string, number> = {};
        Object.entries(simState.answers).forEach(([stepId, opts]) => {
            const s = stepById(stepId);
            if (!s || s.type !== 'question') return;
            opts.forEach(o => { counts[o] = (counts[o] || 0) + 1; });
        });
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        if (!sorted.length) return { primary: undefined as string | undefined, secondary: [] as string[] };
        return { primary: sorted[0][0], secondary: sorted.slice(1, 4).map(s => s[0]) };
    }, [simState.answers, stepById]);

    // Avanço automático para transições / cálculo resultado
    useEffect(() => {
        if (!simActive) return;
        const current = stepById(simState.currentStepId || '');
        if (!current) return;
        if (current.type === 'transition' || current.type === 'transition-result') {
            autoAdvance(current);
        } else if (current.type === 'result') {
            // calcular resultado e avançar depois
            const r = computeResult();
            setSimState(prev => ({ ...prev, resultStyle: r.primary, secondaryStyles: r.secondary }));
            if (current.nextStep) autoAdvance(current);
        }
    }, [simActive, simState.currentStepId, stepById, computeResult]);

    const simulationCurrentStep = simActive ? stepById(simState.currentStepId || '') : null;

    // Conjunto de IDs para validação rápida
    const stepIds = useMemo(() => new Set(steps.map(s => s.id)), [steps]);

    type NextStepStatus = 'ok' | 'missing' | 'invalid';
    const getNextStepStatus = useCallback((step: EditableQuizStep, index: number): NextStepStatus => {
        // Para etapas finais (offer) ou a última da lista, permitir ausência de nextStep sem warning
        if (!step.nextStep) {
            return (step.type === 'offer' || index === steps.length - 1) ? 'ok' : 'missing';
        }
        if (!stepIds.has(step.nextStep)) return 'invalid';
        return 'ok';
    }, [stepIds, steps.length]);

    // ================= OFFER MAP SUPPORT =================
    // Extendemos de forma compatível: campos originais + novos opcionais (ctaLabel, ctaUrl, image)
    type ExtendedOfferContent = {
        title?: string;
        description?: string;
        buttonText?: string;
        testimonial?: { quote?: string; author?: string };
        ctaLabel?: string;
        ctaUrl?: string;
        image?: string;
    };
    const strategicKeys = useMemo(() => {
        const keys = new Set<string>();
        steps.forEach(s => {
            if (s.type === 'strategic-question') {
                (s.options || []).forEach(o => keys.add(o.id));
            }
        });
        return Array.from(keys);
    }, [steps]);

    const addMissingOfferKeys = useCallback((offerStep: EditableQuizStep) => {
        if (offerStep.type !== 'offer') return;
        const map = { ...(offerStep.offerMap || {}) } as Record<string, ExtendedOfferContent>;
        let changed = false;
        strategicKeys.forEach(k => {
            if (!map[k]) { map[k] = { title: `Título para ${k}`, description: '', buttonText: '', ctaLabel: '', ctaUrl: '', image: '' }; changed = true; }
        });
        if (changed) updateStep(offerStep.id, { offerMap: map as any });
    }, [strategicKeys, updateStep]);

    const removeExtraOfferKeys = useCallback((offerStep: EditableQuizStep) => {
        if (offerStep.type !== 'offer') return;
        const map = { ...(offerStep.offerMap || {}) } as Record<string, ExtendedOfferContent>;
        let changed = false;
        Object.keys(map).forEach(k => {
            if (!strategicKeys.includes(k)) { delete map[k]; changed = true; }
        });
        if (changed) updateStep(offerStep.id, { offerMap: map as any });
    }, [strategicKeys, updateStep]);

    // Carregar steps iniciais
    useEffect(() => {
        // Se funil tiver quizSteps, usar; caso contrário montar de QUIZ_STEPS
        const existing = (crud.currentFunnel as any)?.quizSteps as EditableQuizStep[] | undefined;
        if (existing && existing.length) {
            setSteps(existing.map(s => ({ ...s })));
            setSelectedId(existing[0].id);
            return;
        }
        // Converter QUIZ_STEPS (Record) para array
        const conv: EditableQuizStep[] = Object.entries(QUIZ_STEPS).map(([id, step]) => ({ id, ...step }));
        setSteps(conv);
        if (conv.length) setSelectedId(conv[0].id);
    }, [crud.currentFunnel]);

    const selectedStep = useMemo(() => steps.find(s => s.id === selectedId), [steps, selectedId]);

    const updateStep = (id: string, patch: Partial<EditableQuizStep>) => {
        setSteps(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));
    };

    const addStepAfter = (afterId?: string, type: QuizStep['type'] = 'question') => {
        setSteps(prev => {
            const idx = afterId ? prev.findIndex(s => s.id === afterId) : prev.length - 1;
            const newStep = createBlankStep(type);
            const clone = [...prev];
            clone.splice(idx + 1, 0, newStep);
            return clone;
        });
    };

    const duplicateStep = (id: string) => {
        setSteps(prev => {
            const idx = prev.findIndex(s => s.id === id);
            if (idx === -1) return prev;
            const original = prev[idx];
            const dupe: EditableQuizStep = { ...original, id: `${original.id}-copy-${Date.now()}` };
            const clone = [...prev];
            clone.splice(idx + 1, 0, dupe);
            return clone;
        });
    };

    const removeStep = (id: string) => {
        setSteps(prev => {
            if (prev.length <= 1) return prev;
            const idx = prev.findIndex(s => s.id === id);
            if (idx === -1) return prev;
            const clone = prev.filter(s => s.id !== id);
            if (selectedId === id) {
                const newIdx = Math.max(0, idx - 1);
                setSelectedId(clone[newIdx]?.id || '');
            }
            return clone;
        });
    };

    const moveStep = (id: string, dir: -1 | 1) => {
        setSteps(prev => {
            const idx = prev.findIndex(s => s.id === id);
            const to = idx + dir;
            if (idx === -1 || to < 0 || to >= prev.length) return prev;
            const clone = [...prev];
            const [item] = clone.splice(idx, 1);
            clone.splice(to, 0, item);
            return clone;
        });
    };

    const handleSave = useCallback(async () => {
        if (!crud.currentFunnel) return;
        setIsSaving(true);
        try {
            (crud.currentFunnel as any).quizSteps = steps;
            await crud.saveFunnel();
        } catch (e) {
            console.error('Erro ao salvar quizSteps', e);
        } finally {
            setIsSaving(false);
        }
    }, [steps, crud]);

    // Preview simples (modo edição) – quando NÃO está em simulação
    const renderPreview = () => {
        if (!selectedStep) return <div className="text-sm text-muted-foreground p-4">Nenhum step selecionado.</div>;
        switch (selectedStep.type) {
            case 'intro':
                return (
                    <div className="p-4 space-y-4">
                        <div className="prose" dangerouslySetInnerHTML={{ __html: selectedStep.title || '' }} />
                        {selectedStep.image && <img src={selectedStep.image} className="rounded max-w-sm" />}
                        <div>
                            <p className="font-semibold text-sm mb-2">{selectedStep.formQuestion}</p>
                            <input disabled placeholder={selectedStep.placeholder} className="border rounded px-2 py-1 w-64 text-xs bg-muted/30" />
                            <Button size="sm" className="mt-3" disabled>{selectedStep.buttonText || 'Continuar'}</Button>
                        </div>
                    </div>
                );
            case 'question': {
                const answers = previewSelections[selectedStep.id] || [];
                return (
                    <div className="p-4 space-y-4">
                        <h4 className="text-xs uppercase tracking-wide text-muted-foreground">{selectedStep.questionNumber}</h4>
                        <p className="font-bold text-sm">{selectedStep.questionText}</p>
                        <div className="grid grid-cols-2 gap-2">
                            {(selectedStep.options || []).map(opt => {
                                const sel = answers.includes(opt.id);
                                return (
                                    <div
                                        key={opt.id}
                                        onClick={() => {
                                            setPreviewSelections(prev => {
                                                const current = prev[selectedStep.id] || [];
                                                if (sel) return { ...prev, [selectedStep.id]: current.filter(i => i !== opt.id) };
                                                if (current.length >= (selectedStep.requiredSelections || 1)) return prev; // limite
                                                return { ...prev, [selectedStep.id]: [...current, opt.id] };
                                            });
                                        }}
                                        className={`border rounded p-2 text-xs cursor-pointer select-none ${sel ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
                                    >
                                        {opt.image && <img src={opt.image} className="mb-1 rounded" />}
                                        {opt.text}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="text-right text-[10px] text-muted-foreground">
                            {answers.length}/{selectedStep.requiredSelections || 1} selecionadas
                        </div>
                    </div>
                );
            }
            case 'strategic-question':
                return (
                    <div className="p-4 space-y-3">
                        <p className="font-bold text-sm">{selectedStep.questionText}</p>
                        <div className="flex flex-col gap-2">
                            {(selectedStep.options || []).map(opt => (
                                <div key={opt.id} className="border rounded p-2 text-xs bg-background hover:bg-muted cursor-pointer">
                                    {opt.text}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'transition':
            case 'transition-result':
                return (
                    <div className="p-4 space-y-2 text-center text-sm">
                        <div className="w-6 h-6 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="font-medium">{selectedStep.title}</p>
                        {selectedStep.text && <p className="text-xs text-muted-foreground">{selectedStep.text}</p>}
                    </div>
                );
            case 'result': {
                // Exemplo de estilo fictício para preview
                const style = styleConfigGisele['elegante'] || Object.values(styleConfigGisele)[0];
                return (
                    <div className="p-4 space-y-3 text-sm">
                        <h3 className="font-bold text-primary">{selectedStep.title?.replace('{userName}', 'Usuária')}</h3>
                        {style && <p><strong>Estilo:</strong> {style.name}</p>}
                        {style?.specialTips && (
                            <ul className="list-disc pl-4 text-xs space-y-1">
                                {style.specialTips.slice(0, 3).map((t: string, i: number) => <li key={i}>{t}</li>)}
                            </ul>
                        )}
                    </div>
                );
            }
            case 'offer':
                return (
                    <div className="p-4 text-sm space-y-2">
                        <h3 className="font-bold">Oferta Personalizada</h3>
                        <p className="text-xs text-muted-foreground">Preview simplificado. Conteúdo real depende de offerMap & resposta estratégica.</p>
                        {selectedStep.image && <img src={selectedStep.image} className="rounded max-w-xs" />}
                        <p className="text-[10px]">Map keys: {Object.keys(selectedStep.offerMap || {}).length}</p>
                    </div>
                );
            default:
                return <div className="p-4 text-xs">Tipo não suportado.</div>;
        }
    };

    // Renderização do step real durante simulação
    const renderSimulation = () => {
        if (!simulationCurrentStep) return <div className="p-6 text-xs text-muted-foreground">Inicie a simulação para visualizar o fluxo.</div>;
        const step = simulationCurrentStep;
        switch (step.type) {
            case 'intro':
                return (
                    <div className="p-6 max-w-lg space-y-4">
                        {step.title && <div className="prose" dangerouslySetInnerHTML={{ __html: step.title }} />}
                        {step.image && <img src={step.image} className="rounded" />}
                        <div className="space-y-2">
                            <p className="font-medium text-sm">{step.formQuestion}</p>
                            <input
                                value={simState.userName}
                                onChange={e => setSimState(prev => ({ ...prev, userName: e.target.value }))}
                                placeholder={step.placeholder}
                                className="border rounded px-2 py-1 text-sm w-full"
                            />
                            <Button size="sm" disabled={!simState.userName.trim()} onClick={() => step.nextStep && gotoStep(step.nextStep)}> {step.buttonText || 'Continuar'} </Button>
                        </div>
                    </div>
                );
            case 'question': {
                const sel = simState.answers[step.id] || [];
                const max = step.requiredSelections || 1;
                const canNext = sel.length === max;
                return (
                    <div className="p-6 max-w-2xl space-y-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{step.questionNumber}</span>
                            <span>{sel.length}/{max}</span>
                        </div>
                        <p className="font-bold text-sm">{step.questionText}</p>
                        <div className="grid grid-cols-2 gap-3">
                            {(step.options || []).map(o => {
                                const active = sel.includes(o.id);
                                return (
                                    <div
                                        key={o.id}
                                        onClick={() => toggleAnswer(step, o.id)}
                                        className={`border rounded p-3 text-xs cursor-pointer select-none transition ${active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                                    >
                                        {o.image && <img src={o.image} className="mb-1 rounded" />}
                                        {o.text}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="pt-2">
                            <Button size="sm" disabled={!canNext || !step.nextStep} onClick={() => step.nextStep && gotoStep(step.nextStep)}>Próxima</Button>
                        </div>
                    </div>
                );
            }
            case 'strategic-question': {
                const currentSel = simState.strategicAnswers[step.questionText || step.id];
                return (
                    <div className="p-6 max-w-xl space-y-4">
                        <p className="font-bold text-sm">{step.questionText}</p>
                        <div className="flex flex-col gap-2">
                            {(step.options || []).map(o => (
                                <div
                                    key={o.id}
                                    onClick={() => selectStrategic(step, o.id)}
                                    className={`border rounded p-3 text-xs cursor-pointer select-none ${currentSel === o.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                                >{o.text}</div>
                            ))}
                        </div>
                    </div>
                );
            }
            case 'transition':
            case 'transition-result':
                return (
                    <div className="p-6 text-center space-y-3 text-sm">
                        <div className="w-8 h-8 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="font-medium">{step.title}</p>
                        {step.text && <p className="text-xs text-muted-foreground">{step.text}</p>}
                    </div>
                );
            case 'result': {
                const styleId = simState.resultStyle;
                const style = styleId ? (styleConfigGisele as any)[styleId] : null;
                return (
                    <div className="p-6 max-w-xl space-y-4 text-sm">
                        <h2 className="font-bold text-primary">{step.title?.replace('{userName}', simState.userName || 'Usuária')}</h2>
                        {styleId && style && (
                            <>
                                <p><strong>Estilo:</strong> {style.name}</p>
                                {style.specialTips && (
                                    <ul className="list-disc pl-4 text-[11px] space-y-1">
                                        {style.specialTips.slice(0, 4).map((t: string, i: number) => <li key={i}>{t}</li>)}
                                    </ul>
                                )}
                            </>
                        )}
                        {!styleId && <p className="text-xs text-muted-foreground">Calculando resultado...</p>}
                    </div>
                );
            }
            case 'offer': {
                const answerMap = simState.strategicAnswers;
                const finalKey = Object.values(answerMap).slice(-1)[0];
                const offerKeyMap = step.offerMap || {};
                const offer = finalKey ? (offerKeyMap as any)[finalKey] || Object.values(offerKeyMap)[0] : Object.values(offerKeyMap)[0];
                return (
                    <div className="p-6 max-w-xl space-y-4 text-sm">
                        <h2 className="font-bold">Oferta</h2>
                        {offer ? (
                            <>
                                <p className="font-medium" dangerouslySetInnerHTML={{ __html: offer.title?.replace?.('{userName}', simState.userName || 'Usuária') || '' }} />
                                <p className="text-xs">{offer.description}</p>
                                {(offer as any).ctaLabel && (offer as any).ctaUrl && (
                                    <div>
                                        <a
                                            href={(offer as any).ctaUrl}
                                            target="_blank"
                                            className="inline-block mt-2 bg-primary text-primary-foreground px-3 py-1 rounded text-xs hover:opacity-90"
                                        >{(offer as any).ctaLabel}</a>
                                    </div>
                                )}
                                {(offer as any).image && <img src={(offer as any).image} className="rounded max-w-sm" />}
                            </>
                        ) : <p className="text-xs text-muted-foreground">Sem oferta configurada.</p>}
                    </div>
                );
            }
            default:
                return <div className="p-6 text-xs">Tipo não suportado.</div>;
        }
    };

    // ================= RENDER =================
    return (
        <div className="h-full w-full flex flex-col bg-background">
            {/* Barra de controle de simulação */}
            <div className="h-10 border-b flex items-center gap-2 px-3 text-xs bg-muted/30">
                <span className="font-semibold">Quiz Editor</span>
                <Separator orientation="vertical" className="h-4" />
                {!simActive && <Button size="sm" variant="secondary" onClick={startSimulation}>▶ Iniciar Simulação</Button>}
                {simActive && (
                    <>
                        <Button size="sm" variant="outline" onClick={stopSimulation}>⏹ Parar</Button>
                        <Button size="sm" variant="outline" onClick={() => startSimulation()}>↺ Reiniciar</Button>
                        {simulationCurrentStep?.nextStep && simulationCurrentStep.type !== 'transition' && simulationCurrentStep.type !== 'transition-result' && simulationCurrentStep.type !== 'strategic-question' && simulationCurrentStep.type !== 'result' && (
                            <Button size="sm" variant="ghost" onClick={() => gotoStep(simulationCurrentStep.nextStep)}>Avançar →</Button>
                        )}
                        {simulationCurrentStep && <span className="text-[10px] text-muted-foreground">Step atual: {simulationCurrentStep.id}</span>}
                    </>
                )}
                {simActive && simState.resultStyle && (
                    <Badge variant="outline" className="ml-2">Resultado: {simState.resultStyle}</Badge>
                )}
            </div>
            <div className="flex-1 flex overflow-hidden">
                {/* COL 1 - STEPS LIST */}
                <div className="w-60 border-r flex flex-col">
                    <div className="p-3 flex items-center justify-between border-b">
                        <span className="text-xs font-semibold">Etapas</span>
                        <Badge variant="secondary" className="text-[10px]">{steps.length}</Badge>
                    </div>
                    <div className="flex-1 overflow-auto text-xs">
                        {steps.map((s, idx) => {
                            const active = s.id === selectedId;
                            const nStatus = getNextStepStatus(s, idx);
                            const statusColor = nStatus === 'ok' ? 'bg-emerald-500' : nStatus === 'missing' ? 'bg-amber-500' : 'bg-red-500';
                            const statusTitle = nStatus === 'ok' ? 'Fluxo OK' : nStatus === 'missing' ? 'nextStep ausente (pode impedir fluxo)' : 'nextStep inválido (ID não encontrado)';
                            return (
                                <div key={s.id} className={`px-3 py-2 border-b cursor-pointer group ${active ? 'bg-primary/10' : 'hover:bg-muted/50'}`} onClick={() => setSelectedId(s.id)}>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium truncate">{idx + 1}. {s.type}</span>
                                        <span className={`w-2 h-2 rounded-full ${statusColor}`} title={statusTitle} />
                                    </div>
                                    <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition">
                                        <Button size="icon" variant="ghost" className="h-5 w-5" disabled={idx === 0} onClick={(e) => { e.stopPropagation(); moveStep(s.id, -1); }}><ArrowUp className="w-3 h-3" /></Button>
                                        <Button size="icon" variant="ghost" className="h-5 w-5" disabled={idx === steps.length - 1} onClick={(e) => { e.stopPropagation(); moveStep(s.id, 1); }}><ArrowDown className="w-3 h-3" /></Button>
                                        <Button size="icon" variant="ghost" className="h-5 w-5" onClick={(e) => { e.stopPropagation(); duplicateStep(s.id); }}><Copy className="w-3 h-3" /></Button>
                                        <Button size="icon" variant="ghost" className="h-5 w-5 text-red-500" onClick={(e) => { e.stopPropagation(); removeStep(s.id); }}><Trash2 className="w-3 h-3" /></Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="p-2 border-t space-y-2">
                        <Button size="sm" variant="secondary" className="w-full" onClick={() => addStepAfter(selectedId, 'question')}>
                            <Plus className="w-4 h-4 mr-1" /> Nova Pergunta
                        </Button>
                        <Button size="sm" variant="outline" className="w-full" onClick={() => addStepAfter(selectedId, 'strategic-question')}>+ Estratégica</Button>
                        <Button size="sm" variant="outline" className="w-full" onClick={() => addStepAfter(selectedId, 'transition')}>+ Transição</Button>
                    </div>
                </div>

                {/* COL 2 - COMPONENTES / TIPO */}
                <div className="w-64 border-r flex flex-col">
                    <div className="p-3 border-b flex items-center justify-between text-xs font-semibold">Componentes</div>
                    <div className="flex-1 overflow-auto p-3 text-xs space-y-4">
                        {selectedStep && (
                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase tracking-wide text-muted-foreground">Tipo da Etapa</label>
                                <select className="w-full border rounded px-2 py-1 text-xs" value={selectedStep.type} onChange={e => updateStep(selectedStep.id, { type: e.target.value as any })}>
                                    {STEP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                {selectedStep.type === 'question' && (
                                    <div className="pt-2 border-t space-y-2">
                                        <div className="flex items-center justify-between text-[10px] font-medium"><span>Opções</span>
                                            <Button size="sm" variant="ghost" onClick={() => updateStep(selectedStep.id, { options: [...(selectedStep.options || []), { id: `opt-${Date.now()}`, text: 'Nova opção' }] })}>+ Add</Button>
                                        </div>
                                        <div className="space-y-1">
                                            {(selectedStep.options || []).map((opt, oi) => (
                                                <div key={opt.id} className="flex items-center gap-1">
                                                    <input className="flex-1 border rounded px-1 py-0.5 text-[11px]" value={opt.text} onChange={(e) => {
                                                        const clone = [...(selectedStep.options || [])];
                                                        clone[oi] = { ...clone[oi], text: e.target.value };
                                                        updateStep(selectedStep.id, { options: clone });
                                                    }} />
                                                    <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => {
                                                        const clone = (selectedStep.options || []).filter((_, i) => i !== oi);
                                                        updateStep(selectedStep.id, { options: clone });
                                                    }}><Trash2 className="w-3 h-3" /></Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="p-2 border-t flex gap-2">
                        <Button size="sm" className="flex-1" onClick={handleSave} disabled={isSaving}>{isSaving ? 'Salvando...' : 'Salvar'}</Button>
                        <Button size="sm" variant="outline" onClick={() => {
                            // Recarregar do funnel ou fallback
                            const existing = (crud.currentFunnel as any)?.quizSteps as EditableQuizStep[] | undefined;
                            if (existing?.length) {
                                setSteps(existing.map(s => ({ ...s })));
                                setSelectedId(existing[0].id);
                            } else {
                                const conv: EditableQuizStep[] = Object.entries(QUIZ_STEPS).map(([id, step]) => ({ id, ...step }));
                                setSteps(conv);
                                setSelectedId(conv[0]?.id || '');
                            }
                        }}>
                            <RefreshCw className="w-4 h-4 mr-1" /> Reset
                        </Button>
                    </div>
                </div>

                {/* COL 3 - CANVAS */}
                <div className="flex-1 border-r relative bg-muted/10">
                    <div className="absolute inset-0 overflow-auto">
                        {simActive ? renderSimulation() : renderPreview()}
                    </div>
                </div>

                {/* COL 4 - PROPRIEDADES */}
                <div className="w-80 flex flex-col">
                    <div className="p-3 border-b text-xs font-semibold">Propriedades</div>
                    <div className="flex-1 overflow-auto p-4 text-xs space-y-4">
                        {!selectedStep && <div className="text-muted-foreground text-[11px]">Selecione uma etapa.</div>}
                        {selectedStep && (
                            <>
                                <div>
                                    <label className="block mb-1 font-medium">ID</label>
                                    <input disabled value={selectedStep.id} className="w-full border rounded px-2 py-1 text-[11px] bg-muted/30" />
                                </div>
                                {selectedStep.type === 'intro' && (
                                    <>
                                        <div>
                                            <label className="block mb-1 font-medium">Título (HTML)</label>
                                            <textarea rows={3} value={selectedStep.title || ''} onChange={e => updateStep(selectedStep.id, { title: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block mb-1 font-medium">Form Question</label>
                                                <input value={selectedStep.formQuestion || ''} onChange={e => updateStep(selectedStep.id, { formQuestion: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                            </div>
                                            <div>
                                                <label className="block mb-1 font-medium">Placeholder</label>
                                                <input value={selectedStep.placeholder || ''} onChange={e => updateStep(selectedStep.id, { placeholder: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block mb-1 font-medium">Button Text</label>
                                                <input value={selectedStep.buttonText || ''} onChange={e => updateStep(selectedStep.id, { buttonText: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                            </div>
                                            <div>
                                                <label className="block mb-1 font-medium">Image URL</label>
                                                <input value={selectedStep.image || ''} onChange={e => updateStep(selectedStep.id, { image: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                            </div>
                                        </div>
                                    </>
                                )}
                                {selectedStep.type === 'question' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block mb-1 font-medium">Número</label>
                                                <input value={selectedStep.questionNumber || ''} onChange={e => updateStep(selectedStep.id, { questionNumber: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                            </div>
                                            <div>
                                                <label className="block mb-1 font-medium">Seleções</label>
                                                <input type="number" value={selectedStep.requiredSelections || 1} onChange={e => updateStep(selectedStep.id, { requiredSelections: parseInt(e.target.value) || 1 })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Pergunta</label>
                                            <textarea rows={3} value={selectedStep.questionText || ''} onChange={e => updateStep(selectedStep.id, { questionText: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                        </div>
                                    </>
                                )}
                                {selectedStep.type === 'strategic-question' && (
                                    <div>
                                        <label className="block mb-1 font-medium">Pergunta Estratégica</label>
                                        <textarea rows={3} value={selectedStep.questionText || ''} onChange={e => updateStep(selectedStep.id, { questionText: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                    </div>
                                )}
                                {(selectedStep.type === 'transition' || selectedStep.type === 'transition-result') && (
                                    <>
                                        <div>
                                            <label className="block mb-1 font-medium">Título</label>
                                            <input value={selectedStep.title || ''} onChange={e => updateStep(selectedStep.id, { title: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                        </div>
                                        {selectedStep.type === 'transition' && (
                                            <div>
                                                <label className="block mb-1 font-medium">Texto</label>
                                                <textarea rows={2} value={selectedStep.text || ''} onChange={e => updateStep(selectedStep.id, { text: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                            </div>
                                        )}
                                    </>
                                )}
                                {selectedStep.type === 'result' && (
                                    <div>
                                        <label className="block mb-1 font-medium">Título Resultado</label>
                                        <input value={selectedStep.title || ''} onChange={e => updateStep(selectedStep.id, { title: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                    </div>
                                )}
                                {selectedStep.type === 'offer' && (
                                    <>
                                        <div>
                                            <label className="block mb-1 font-medium">Imagem Oferta</label>
                                            <input value={selectedStep.image || ''} onChange={e => updateStep(selectedStep.id, { image: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="block font-medium">Offer Map</label>
                                                <div className="flex gap-1">
                                                    <Button size="sm" variant="outline" className="h-6 px-2" onClick={() => addMissingOfferKeys(selectedStep)}>Sync Keys</Button>
                                                    <Button size="sm" variant="outline" className="h-6 px-2" onClick={() => removeExtraOfferKeys(selectedStep)}>Limpar Extras</Button>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground">Chaves estratégicas detectadas: {strategicKeys.length || 0} {strategicKeys.length === 0 && '(nenhuma strategic-question)'}.</p>
                                            {/* Lista de chaves */}
                                            <div className="space-y-3 max-h-64 overflow-auto pr-1 border rounded p-2 bg-muted/30">
                                                {(() => {
                                                    const map = selectedStep.offerMap || {} as Record<string, OfferContent>;
                                                    const orderedKeys = [...Object.keys(map)].sort((a,b)=>a.localeCompare(b));
                                                    if (!orderedKeys.length) return <div className="text-[10px] text-muted-foreground">Nenhuma chave. Clique em Sync Keys.</div>;
                                                    return orderedKeys.map(k => {
                                                        const extra = !strategicKeys.includes(k);
                                                        return (
                                                            <div key={k} className="border rounded bg-background p-2 space-y-1">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[11px] font-semibold flex items-center gap-2">
                                                                        {k}
                                                                        <span className={`w-2 h-2 rounded-full ${extra ? 'bg-amber-500' : 'bg-emerald-500'}`} title={extra ? 'Chave não usada por strategic-question' : 'Chave válida'} />
                                                                    </span>
                                                                    <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => {
                                                                        const clone = { ...(selectedStep.offerMap || {}) } as Record<string, ExtendedOfferContent>;
                                                                        delete clone[k];
                                                                        updateStep(selectedStep.id, { offerMap: clone as any });
                                                                    }}><Trash2 className="w-3 h-3 text-red-500" /></Button>
                                                                </div>
                                                                <input
                                                                    placeholder="Título"
                                                                    className="w-full border rounded px-1 py-0.5 text-[11px]"
                                                                    value={(map as any)[k]?.title || ''}
                                                                    onChange={e => {
                                                                        const clone = { ...(selectedStep.offerMap || {}) } as Record<string, ExtendedOfferContent>;
                                                                        clone[k] = { ...(clone[k]||{}), title: e.target.value };
                                                                        updateStep(selectedStep.id, { offerMap: clone as any });
                                                                    }}
                                                                />
                                                                <textarea
                                                                    placeholder="Descrição"
                                                                    rows={2}
                                                                    className="w-full border rounded px-1 py-0.5 text-[11px]"
                                                                    value={(map as any)[k]?.description || ''}
                                                                    onChange={e => {
                                                                        const clone = { ...(selectedStep.offerMap || {}) } as Record<string, ExtendedOfferContent>;
                                                                        clone[k] = { ...(clone[k]||{}), description: e.target.value };
                                                                        updateStep(selectedStep.id, { offerMap: clone as any });
                                                                    }}
                                                                />
                                                                <div className="grid grid-cols-2 gap-1">
                                                                    <input
                                                                        placeholder="CTA Label"
                                                                        className="border rounded px-1 py-0.5 text-[11px]"
                                                                        value={(map as any)[k]?.ctaLabel || ''}
                                                                        onChange={e => {
                                                                            const clone = { ...(selectedStep.offerMap || {}) } as Record<string, ExtendedOfferContent>;
                                                                            clone[k] = { ...(clone[k]||{}), ctaLabel: e.target.value };
                                                                            updateStep(selectedStep.id, { offerMap: clone as any });
                                                                        }}
                                                                    />
                                                                    <input
                                                                        placeholder="CTA URL"
                                                                        className="border rounded px-1 py-0.5 text-[11px]"
                                                                        value={(map as any)[k]?.ctaUrl || ''}
                                                                        onChange={e => {
                                                                            const clone = { ...(selectedStep.offerMap || {}) } as Record<string, ExtendedOfferContent>;
                                                                            clone[k] = { ...(clone[k]||{}), ctaUrl: e.target.value };
                                                                            updateStep(selectedStep.id, { offerMap: clone as any });
                                                                        }}
                                                                    />
                                                                </div>
                                                                <input
                                                                    placeholder="Imagem (URL)"
                                                                    className="w-full border rounded px-1 py-0.5 text-[11px]"
                                                                    value={(map as any)[k]?.image || ''}
                                                                    onChange={e => {
                                                                        const clone = { ...(selectedStep.offerMap || {}) } as Record<string, ExtendedOfferContent>;
                                                                        clone[k] = { ...(clone[k]||{}), image: e.target.value };
                                                                        updateStep(selectedStep.id, { offerMap: clone as any });
                                                                    }}
                                                                />
                                                            </div>
                                                        );
                                                    });
                                                })()}
                                            </div>
                                            <div className="text-[10px] flex flex-wrap gap-1">
                                                {strategicKeys.map(k => {
                                                    const has = !!(selectedStep.offerMap || {})[k];
                                                    return <span key={k} className={`px-2 py-0.5 rounded border ${has ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700' : 'bg-amber-500/10 border-amber-500 text-amber-700'}`}>{k}</span>;
                                                })}
                                            </div>
                                        </div>
                                    </>
                                )}
                                <Separator />
                                <div>
                                    <label className="block mb-1 font-medium">Próximo Step (nextStep)</label>
                                    <select
                                        value={selectedStep.nextStep || ''}
                                        onChange={e => updateStep(selectedStep.id, { nextStep: e.target.value || '' })}
                                        className="w-full border rounded px-2 py-1 text-[11px]"
                                    >
                                        <option value="">-- (sem) --</option>
                                        {steps.filter(s => s.id !== selectedStep.id).map(s => (
                                            <option key={s.id} value={s.id}>{s.id} ({s.type})</option>
                                        ))}
                                    </select>
                                    {(() => {
                                        const idx = steps.findIndex(s => s.id === selectedStep.id);
                                        const st = getNextStepStatus(selectedStep, idx);
                                        if (st === 'invalid') return <p className="text-[10px] mt-1 text-red-500">ID informado não existe entre as etapas.</p>;
                                        if (st === 'missing') return <p className="text-[10px] mt-1 text-amber-600">Sem nextStep: fluxo pode parar aqui.</p>;
                                        return <p className="text-[10px] mt-1 text-muted-foreground">OK</p>;
                                    })()}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="p-2 border-t flex gap-2">
                        <Button size="sm" className="flex-1" onClick={handleSave} disabled={isSaving}>{isSaving ? 'Salvando...' : 'Salvar'}</Button>
                    </div>
                </div>
                {/* Fim colunas */}
            </div>{/* fecha wrapper flex-1 */}
        </div>
    );
};

export default QuizFunnelEditor;
