import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { emitQuizEvent, setQuizAnalyticsNamespace } from '@/utils/quizAnalytics';
import sanitizeHtml from '@/utils/sanitizeHtml';
import { z } from 'zod';
import { useUnifiedCRUD } from '@/context/UnifiedCRUDProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QUIZ_STEPS, type QuizStep } from '@/data/quizSteps';
import { styleConfigGisele } from '@/data/styles';
import { Plus, Save, Trash2, ArrowUp, ArrowDown, Copy, RefreshCw, ListTree } from 'lucide-react';
import { Undo2, Redo2 } from 'lucide-react';
import { QuizRuntimeRegistryProvider, useQuizRuntimeRegistry } from '@/runtime/quiz/QuizRuntimeRegistry';
import { editorStepsToRuntimeMap } from '@/runtime/quiz/editorAdapter';
import QuizAppConnected from '@/components/quiz/QuizAppConnected';
import { useBlockRegistry } from '@/runtime/quiz/blocks/BlockRegistry';
import { BlockRegistryProvider, DEFAULT_BLOCK_DEFINITIONS } from '@/runtime/quiz/blocks/BlockRegistry';
import { BlockRegistryProvider as BRP, useBlockRegistry as useBR } from '@/runtime/quiz/blocks/BlockRegistry';

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

export interface EditableQuizStep extends QuizStep { id: string; blocks?: Array<{ id: string; type: string; config: Record<string, any> }>; }

interface QuizFunnelEditorProps {
    funnelId?: string;
    templateId?: string;
}

// ================== ZOD SCHEMAS (Step / OfferMap / Export) ==================
const OfferContentSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    buttonText: z.string().optional(),
    testimonial: z.object({
        quote: z.string().optional(),
        author: z.string().optional()
    }).optional(),
    ctaLabel: z.string().optional(),
    ctaUrl: z.string().url().optional().or(z.literal('')).optional(),
    image: z.string().optional()
});

const BlockInstanceSchema = z.object({
    id: z.string(),
    type: z.string(),
    config: z.record(z.any()).default({})
});

const BaseStepSchema = z.object({
    id: z.string().min(1),
    type: z.enum(['intro', 'question', 'strategic-question', 'transition', 'transition-result', 'result', 'offer']),
    nextStep: z.string().optional().or(z.literal('')),
    blocks: z.array(BlockInstanceSchema).optional()
});

const IntroStepSchema = BaseStepSchema.extend({
    type: z.literal('intro'),
    title: z.string().optional(),
    formQuestion: z.string().optional(),
    placeholder: z.string().optional(),
    buttonText: z.string().optional(),
    image: z.string().optional()
});

const QuestionOptionSchema = z.object({ id: z.string(), text: z.string(), image: z.string().optional() });
const QuestionStepSchema = BaseStepSchema.extend({
    type: z.literal('question'),
    questionNumber: z.string().optional(),
    questionText: z.string().optional(),
    requiredSelections: z.number().int().positive().max(20).optional(),
    options: z.array(QuestionOptionSchema).default([])
});

const StrategicQuestionStepSchema = BaseStepSchema.extend({
    type: z.literal('strategic-question'),
    questionText: z.string().optional(),
    options: z.array(z.object({ id: z.string(), text: z.string() })).default([])
});

const TransitionStepSchema = BaseStepSchema.extend({
    type: z.literal('transition'),
    title: z.string().optional(),
    text: z.string().optional()
});
const TransitionResultStepSchema = BaseStepSchema.extend({
    type: z.literal('transition-result'),
    title: z.string().optional()
});
const ResultStepSchema = BaseStepSchema.extend({
    type: z.literal('result'),
    title: z.string().optional()
});
const OfferStepSchema = BaseStepSchema.extend({
    type: z.literal('offer'),
    offerMap: z.record(OfferContentSchema).default({}),
    image: z.string().optional()
});

const AnyStepSchema = z.discriminatedUnion('type', [
    IntroStepSchema,
    QuestionStepSchema,
    StrategicQuestionStepSchema,
    TransitionStepSchema,
    TransitionResultStepSchema,
    ResultStepSchema,
    OfferStepSchema
]);

const StepsArraySchema = z.array(AnyStepSchema).min(1);
// Schema de export com metadados de blocos para futura migração
const BlockExportMetaSchema = z.object({ id: z.string(), version: z.number().int() });
const ExportSchema = z.object({
    version: z.number().int().default(1),
    exportedAt: z.string().optional(),
    blockRegistry: z.array(BlockExportMetaSchema).default([]),
    steps: StepsArraySchema
});

type ParsedStep = z.infer<typeof AnyStepSchema>;

// ================== DETECÇÃO DE CICLOS ==================
interface CycleReport {
    hasCycle: boolean;
    path: string[];
    cycles: string[][];
}

function detectCycle(steps: ParsedStep[]): CycleReport {
    const idMap = new Map<string, ParsedStep>();
    steps.forEach(s => idMap.set(s.id, s));
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const cycles: string[][] = [];
    const pathStack: string[] = [];

    function dfs(id: string): boolean { // retorna true se ciclo
        if (visiting.has(id)) {
            // Encontramos ciclo - extrair sequência
            const idx = pathStack.indexOf(id);
            if (idx !== -1) {
                const cyc = pathStack.slice(idx).concat(id);
                cycles.push(cyc);
            }
            return true;
        }
        if (visited.has(id)) return false;
        visiting.add(id);
        pathStack.push(id);
        const step = idMap.get(id);
        if (step?.nextStep && idMap.has(step.nextStep)) {
            if (dfs(step.nextStep)) {
                visiting.delete(id);
                pathStack.pop();
                visited.add(id);
                return true; // early stop se desejado
            }
        }
        visiting.delete(id);
        pathStack.pop();
        visited.add(id);
        return false;
    }

    // Considerar primeiro step como raiz; mas buscar ciclos em qualquer componente alcançável
    for (const s of steps) {
        if (!visited.has(s.id)) dfs(s.id);
    }
    return { hasCycle: cycles.length > 0, path: cycles[0] || [], cycles };
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
    // Namespace analytics para não poluir produção
    useEffect(() => {
        setQuizAnalyticsNamespace('editor_preview');
        return () => setQuizAnalyticsNamespace(null);
    }, []);
    const crud = useUnifiedCRUD();
    const blockRegistry = useBlockRegistry();
    const [steps, setSteps] = useState<EditableQuizStep[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');
    const [isInitialized, setIsInitialized] = useState(false); // Flag para evitar re-carregamento
    const [isSaving, setIsSaving] = useState(false);
    const [previewSelections, setPreviewSelections] = useState<Record<string, string[]>>({});
    // Undo/Redo stacks
    const [history, setHistory] = useState<EditableQuizStep[][]>([]);
    const [future, setFuture] = useState<EditableQuizStep[][]>([]);
    const MAX_HISTORY = 40;
    // Estado de edição de configuração de bloco
    const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
    const [blockConfigDraft, setBlockConfigDraft] = useState<string>('');
    const [blockConfigError, setBlockConfigError] = useState<string | null>(null);
    // Preview dedicado de blocos
    const [activeBlockPreviewId, setActiveBlockPreviewId] = useState<string | null>(null);
    // Placeholders Preview (FASE 3)
    const [phUserName, setPhUserName] = useState<string>('Usuária Teste');
    const [phPrimaryStyle, setPhPrimaryStyle] = useState<string>('elegante');
    const [phSecondaryStyles, setPhSecondaryStyles] = useState<string>('casual,dramatico');
    // Diff Viewer state
    const [pendingImport, setPendingImport] = useState<EditableQuizStep[] | null>(null);
    const [importDiff, setImportDiff] = useState<null | {
        added: EditableQuizStep[];
        removed: EditableQuizStep[];
        modified: Array<{ before: EditableQuizStep; after: EditableQuizStep; changes: string[] }>;
    }>(null);

    const pushHistory = useCallback((prev: EditableQuizStep[]) => {
        setHistory(h => {
            const clone = [...h, prev.map(s => ({ ...s }))];
            if (clone.length > MAX_HISTORY) clone.splice(0, clone.length - MAX_HISTORY);
            return clone;
        });
        // ao criar novo estado invalida o futuro
        setFuture([]);
    }, []);

    const undo = useCallback(() => {
        setHistory(h => {
            if (!h.length) return h;
            setSteps(current => {
                const prev = h[h.length - 1];
                setFuture(f => [current.map(s => ({ ...s })), ...f]);
                return prev.map(s => ({ ...s }));
            });
            return h.slice(0, -1);
        });
    }, []);

    const redo = useCallback(() => {
        setFuture(f => {
            if (!f.length) return f;
            setSteps(current => {
                const next = f[0];
                setHistory(h => [...h, current.map(s => ({ ...s }))]);
                return next.map(s => ({ ...s }));
            });
            return f.slice(1);
        });
    }, []);

    // Capturar alterações de steps para empilhar histórico (exceto inicial carregamento)
    const initializedRef = useRef(false);
    useEffect(() => {
        if (!initializedRef.current) { // primeira atribuição acontece no carregamento inicial
            initializedRef.current = true;
            return;
        }
        pushHistory(steps);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [steps.map(s => JSON.stringify({
        ...s, // serializar campos principais para detectar mudança estrutural
        id: s.id,
        type: s.type,
        nextStep: s.nextStep,
        options: s.type === 'question' || s.type === 'strategic-question' ? s.options : undefined,
        offerMap: s.type === 'offer' ? s.offerMap : undefined,
        blocks: (s.blocks || []).map(b => ({ id: b.id, type: b.type, config: b.config }))
    })).join('|')]);

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

    // Atalhos de teclado: Ctrl+Z / Ctrl+Y
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                undo();
            } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
                e.preventDefault();
                redo();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [undo, redo]);

    const startSimulation = () => {
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
        // Algoritmo Avançado:
        // 1. Cada opção conta 1 ponto por padrão (peso base = 1).
        // 2. Se step.questionNumber contém padrão "(x2)" ou similar, aplica multiplicador.
        // 3. Desempate multi-critério: maior peso total > maior diversidade de steps > ordem de aparecimento.
        // 4. Retorna top 1 como primary e próximas até 3 como secondary.
        const score: Record<string, { total: number; steps: Set<string>; firstIndex: number }> = {};
        let globalIndex = 0;
        Object.entries(simState.answers).forEach(([stepId, opts]) => {
            const s = stepById(stepId);
            if (!s || s.type !== 'question') return;
            // Heurística de multiplicador a partir do questionNumber (ex: "3 de 7 (x2)")
            let multiplier = 1;
            if (s.questionNumber && /x(\d+)/i.test(s.questionNumber)) {
                const m = s.questionNumber.match(/x(\d+)/i);
                if (m) multiplier = Math.max(1, parseInt(m[1]!, 10));
            }
            opts.forEach(oId => {
                if (!score[oId]) score[oId] = { total: 0, steps: new Set(), firstIndex: globalIndex };
                score[oId].total += 1 * multiplier;
                score[oId].steps.add(stepId);
                globalIndex++;
            });
        });
        const entries = Object.entries(score);
        if (!entries.length) return { primary: undefined as string | undefined, secondary: [] as string[] };
        entries.sort((a, b) => {
            const A = a[1];
            const B = b[1];
            if (B.total !== A.total) return B.total - A.total; // maior pontuação
            if (B.steps.size !== A.steps.size) return B.steps.size - A.steps.size; // mais diversidade de steps
            return A.firstIndex - B.firstIndex; // apareceu antes
        });
        return { primary: entries[0][0], secondary: entries.slice(1, 4).map(e => e[0]) };
    }, [simState.answers, stepById]);

    // Persistir resultado quando calculado (apenas quando primary definido ou mudança relevante)
    useEffect(() => {
        if (!simActive) return;
        if (!simState.resultStyle) return;
        try {
            const payload = {
                userName: simState.userName,
                primaryStyle: simState.resultStyle,
                secondaryStyles: simState.secondaryStyles,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('quizResultPayload', JSON.stringify(payload));
        } catch (e) {
            console.warn('Falha ao persistir quizResultPayload', e);
        }
    }, [simState.resultStyle, simState.secondaryStyles, simState.userName, simActive]);

    // Avanço automático para transições / cálculo resultado + instrumentação
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
            emitQuizEvent({ type: 'result_compute', primary: r.primary, secondary: r.secondary, answersCount: Object.values(simState.answers).reduce((a, c) => a + c.length, 0) });
            if (current.nextStep) autoAdvance(current);
        }
    }, [simActive, simState.currentStepId, stepById, computeResult]);

    const simulationCurrentStep = simActive ? stepById(simState.currentStepId || '') : null;

    // ================= PLACEHOLDERS (aplicação no preview não-simulação) =================
    const applyPlaceholders = useCallback((text?: string): string => {
        if (!text) return '';
        const primary = phPrimaryStyle || 'principal';
        const secondaries = phSecondaryStyles.split(',').map(s => s.trim()).filter(Boolean);
        const repl = (src: string, token: string, value: string) => src.replace(new RegExp(token.replace(/[{}]/g, m => '\\' + m), 'g'), value);
        let out = text;
        out = repl(out, '{userName}', phUserName || 'Usuária');
        out = repl(out, '{primaryStyle}', primary);
        out = repl(out, '{secondaryStyles}', secondaries.join(', '));
        return out;
    }, [phUserName, phPrimaryStyle, phSecondaryStyles]);

    // Instrumentação step_view
    useEffect(() => {
        if (!simActive) return;
        if (!simulationCurrentStep) return;
        const idx = steps.findIndex(s => s.id === simulationCurrentStep.id);
        emitQuizEvent({ type: 'step_view', stepId: simulationCurrentStep.id, stepType: simulationCurrentStep.type, position: idx });
    }, [simActive, simulationCurrentStep?.id]);

    // ================= ALCANCE / STEPS ÓRFÃOS =================
    const reachableInfo = useMemo(() => {
        if (!steps.length) return { reachable: new Set<string>(), orphans: new Set<string>() };
        const idToStep = new Map(steps.map(s => [s.id, s] as const));
        const start = steps[0].id;
        const visited = new Set<string>();
        const stack = [start];
        while (stack.length) {
            const current = stack.pop()!;
            if (visited.has(current)) continue;
            visited.add(current);
            const st = idToStep.get(current);
            if (st?.nextStep && idToStep.has(st.nextStep) && !visited.has(st.nextStep)) {
                stack.push(st.nextStep);
            }
        }
        const allIds = steps.map(s => s.id);
        const orphans = new Set(allIds.filter(id => !visited.has(id)));
        return { reachable: visited, orphans };
    }, [steps]);

    const cycleReport = useMemo(() => detectCycle(steps as any), [steps]);

    const isOrphan = useCallback((id: string) => reachableInfo.orphans.has(id), [reachableInfo]);

    // Conjunto de IDs para validação rápida
    const stepIds = useMemo(() => new Set(steps.map(s => s.id)), [steps]);

    // Função de atualização de step (deve vir antes de callbacks que dependem)
    const updateStep = useCallback((id: string, patch: Partial<EditableQuizStep>) => {
        setSteps(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));
    }, []);

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

    // Carregar steps iniciais (APENAS UMA VEZ)
    useEffect(() => {
        if (isInitialized) return;

        // Se funil tiver quizSteps, usar; caso contrário montar de QUIZ_STEPS
        const existing = (crud.currentFunnel as any)?.quizSteps as EditableQuizStep[] | undefined;
        if (existing && existing.length) {
            setSteps(existing.map(s => ({ ...s })));
            setSelectedId(existing[0].id);
            setIsInitialized(true);
            return;
        }
        // Converter QUIZ_STEPS (Record) para array
        const conv: EditableQuizStep[] = Object.entries(QUIZ_STEPS).map(([id, step]) => ({ id, ...step }));
        setSteps(conv);
        if (conv.length) setSelectedId(conv[0].id);
        setIsInitialized(true);
    }, [crud.currentFunnel, isInitialized]); const selectedStep = useMemo(() => steps.find(s => s.id === selectedId), [steps, selectedId]);

    // Auto inicialização de blocos para tipos suportados se ainda não houver
    useEffect(() => {
        if (!selectedStep) return;
        if ((selectedStep.type === 'result' || selectedStep.type === 'offer') && !selectedStep.blocks) {
            const defaultType = selectedStep.type === 'result' ? 'result.headline' : 'offer.core';
            if (blockRegistry.get(defaultType)) {
                updateStep(selectedStep.id, { blocks: [{ id: `${defaultType}-${Date.now()}`, type: defaultType, config: blockRegistry.get(defaultType)!.defaultConfig }] as any });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStep?.id, selectedStep?.type]);

    // removido: definição duplicada de updateStep

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
            // Validação antes de salvar
            const parsed = StepsArraySchema.safeParse(steps);
            if (!parsed.success) {
                console.error('❌ Validação falhou ao salvar:', parsed.error.format());
                alert('Falha de validação: ver console para detalhes.');
                return;
            }
            // Checar ciclos antes de salvar
            const cycle = detectCycle(parsed.data as any);
            if (cycle.hasCycle) {
                console.error('❌ Ciclo detectado ao salvar:', cycle);
                alert('Não é possível salvar: ciclo detectado no fluxo.');
                return;
            }
            (crud.currentFunnel as any).quizSteps = parsed.data;
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
                        <div className="prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(applyPlaceholders(selectedStep.title || '')) }} />
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
                        <h3 className="font-bold text-primary">{applyPlaceholders(selectedStep.title || '')}</h3>
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
                        {step.title && <div className="prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(step.title) }} />}
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
                // Nova lógica: usar estilo primário calculado; fallback para secundários; fallback final para primeira chave existente
                const offerKeyMap = step.offerMap || {};
                const primary = simState.resultStyle;
                const secondaries = simState.secondaryStyles || [];
                const candidateKeys = [primary, ...secondaries].filter(Boolean) as string[];
                let offer: any = null;
                for (const k of candidateKeys) {
                    if (k && (offerKeyMap as any)[k]) { offer = (offerKeyMap as any)[k]; break; }
                }
                if (!offer) {
                    // fallback legado: última resposta estratégica
                    const answerMap = simState.strategicAnswers;
                    const finalKey = Object.values(answerMap).slice(-1)[0];
                    if (finalKey && (offerKeyMap as any)[finalKey]) offer = (offerKeyMap as any)[finalKey];
                }
                if (!offer) offer = Object.values(offerKeyMap)[0];
                // Persistir oferta selecionada para ResultPage
                if (offer) {
                    try {
                        localStorage.setItem('quizSelectedOffer', JSON.stringify(offer));
                    } catch (e) {
                        console.warn('Falha ao persistir quizSelectedOffer', e);
                    }
                    emitQuizEvent({ type: 'offer_view', offerKey: primary || secondaries[0], hasImage: !!offer.image });
                }
                return (
                    <div className="p-6 max-w-xl space-y-4 text-sm">
                        <h2 className="font-bold">Oferta</h2>
                        {offer ? (
                            <>
                                <p className="font-medium" dangerouslySetInnerHTML={{ __html: sanitizeHtml(offer.title?.replace?.('{userName}', simState.userName || 'Usuária') || '') }} />
                                <p className="text-xs">{offer.description}</p>
                                {(offer as any).ctaLabel && (offer as any).ctaUrl && (
                                    <div>
                                        <a
                                            href={(offer as any).ctaUrl}
                                            target="_blank"
                                            className="inline-block mt-2 bg-primary text-primary-foreground px-3 py-1 rounded text-xs hover:opacity-90"
                                            onClick={() => emitQuizEvent({ type: 'cta_click', offerKey: primary || secondaries[0], url: (offer as any).ctaUrl })}
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

    // ================= Runtime Preview Component =================
    const RuntimePreview: React.FC = () => {
        const { setSteps, version } = useQuizRuntimeRegistry();

        // Usar useMemo para evitar recalcular a cada render
        const runtimeSteps = useMemo(() => editorStepsToRuntimeMap(steps as any), [steps]);

        // Debounce: só atualiza runtime após 500ms sem mudanças
        const timeoutRef = useRef<number | null>(null);
        useEffect(() => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = window.setTimeout(() => {
                setSteps(runtimeSteps);
            }, 500); // 500ms de debounce

            return () => {
                if (timeoutRef.current) {
                    window.clearTimeout(timeoutRef.current);
                }
            };
        }, [runtimeSteps, setSteps]);

        return (
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-auto bg-white">
                    <QuizAppConnected funnelId={funnelId} editorMode />
                </div>
                <div className="p-1 text-[10px] text-muted-foreground border-t bg-muted/30">runtime v{version}</div>
            </div>
        );
    };

    // ================= RENDER =================
    return (
        <QuizRuntimeRegistryProvider>
            <BlockRegistryProvider definitions={DEFAULT_BLOCK_DEFINITIONS}>
                <div className="h-full w-full flex flex-col bg-background">
                    {importDiff && pendingImport && (
                        <div className="absolute inset-x-0 top-0 z-50 flex justify-center">
                            <div className="mt-4 w-[720px] border rounded shadow-lg bg-background p-4 text-xs space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold">Pré-visualização de Importação</h3>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => { setImportDiff(null); setPendingImport(null); }}>Cancelar</Button>
                                        <Button size="sm" onClick={() => {
                                            setSteps(pendingImport);
                                            setSelectedId(pendingImport[0]?.id || '');
                                            setImportDiff(null);
                                            setPendingImport(null);
                                        }}>Aplicar</Button>
                                    </div>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <div className="font-medium mb-1">Adicionados ({importDiff.added.length})</div>
                                        <ul className="space-y-1 max-h-40 overflow-auto">
                                            {importDiff.added.map(s => <li key={s.id} className="px-2 py-1 rounded bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 border border-emerald-600/30">{s.id} <span className="opacity-60">[{s.type}]</span></li>)}
                                            {!importDiff.added.length && <li className="text-muted-foreground italic">Nenhum</li>}
                                        </ul>
                                    </div>
                                    <div>
                                        <div className="font-medium mb-1">Removidos ({importDiff.removed.length})</div>
                                        <ul className="space-y-1 max-h-40 overflow-auto">
                                            {importDiff.removed.map(s => <li key={s.id} className="px-2 py-1 rounded bg-red-600/10 text-red-700 dark:text-red-300 border border-red-600/30">{s.id} <span className="opacity-60">[{s.type}]</span></li>)}
                                            {!importDiff.removed.length && <li className="text-muted-foreground italic">Nenhum</li>}
                                        </ul>
                                    </div>
                                    <div>
                                        <div className="font-medium mb-1">Modificados ({importDiff.modified.length})</div>
                                        <ul className="space-y-1 max-h-40 overflow-auto">
                                            {importDiff.modified.map(m => (
                                                <li key={m.before.id} className="px-2 py-1 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                                                    {m.before.id} <span className="opacity-60">[{m.before.type}→{m.after.type}]</span>
                                                    <div className="mt-1 flex flex-wrap gap-1">
                                                        {m.changes.map(c => <span key={c} className="px-1 py-0.5 rounded bg-amber-600/20">{c}</span>)}
                                                    </div>
                                                </li>
                                            ))}
                                            {!importDiff.modified.length && <li className="text-muted-foreground italic">Nenhum</li>}
                                        </ul>
                                    </div>
                                </div>
                                <Separator />
                                <p className="text-[10px] text-muted-foreground">Revise as alterações antes de aplicar. A ação Aplicar substitui completamente o fluxo atual.</p>
                            </div>
                        </div>
                    )}
                    {/* Barra de controle de simulação */}
                    <div className="h-10 border-b flex items-center gap-2 px-3 text-xs bg-muted/30">
                        <span className="font-semibold">Quiz Editor</span>
                        <Button size="sm" variant="ghost" onClick={() => window.open('/quiz-analytics', '_blank')} className="text-[11px]">Analytics</Button>
                        {cycleReport.hasCycle && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-red-600 text-white" title={`Ciclo detectado: ${cycleReport.path.join(' -> ')}`}>
                                Ciclo!
                            </span>
                        )}
                        <Button size="sm" variant="ghost" disabled={!history.length} onClick={undo} title="Undo (Ctrl+Z)">
                            <Undo2 className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" disabled={!future.length} onClick={redo} title="Redo (Ctrl+Y)">
                            <Redo2 className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                            const parsed = StepsArraySchema.safeParse(steps);
                            if (!parsed.success) {
                                alert('Export bloqueado: validação falhou. Ver console.');
                                console.error(parsed.error.flatten());
                                return;
                            }
                            const cycle = detectCycle(parsed.data as any);
                            if (cycle.hasCycle) {
                                alert('Export bloqueado: ciclo detectado. Ver console.');
                                console.error('Ciclo detectado:', cycle);
                                return;
                            }
                            // Coletar metadados de blocos usados
                            const blockMetaMap = new Map<string, number>();
                            parsed.data.forEach(st => {
                                (st as any).blocks?.forEach((b: any) => {
                                    // versão é best-effort (não temos store de versões por bloco no runtime agora) -> assume 1
                                    if (!blockMetaMap.has(b.type)) blockMetaMap.set(b.type, 1);
                                });
                            });
                            const blockRegistry = Array.from(blockMetaMap.entries()).map(([id, version]) => ({ id, version }));
                            const data = ExportSchema.parse({ version: 1, exportedAt: new Date().toISOString(), steps: parsed.data, blockRegistry });
                            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'quiz-funnel.json';
                            a.click();
                            URL.revokeObjectURL(url);
                        }}>Exportar</Button>
                        <div>
                            <input
                                type="file"
                                accept="application/json"
                                id="quiz-import-input"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                        try {
                                            const json = JSON.parse(String(ev.target?.result || '{}'));
                                            const parsed = ExportSchema.safeParse(json);
                                            if (!parsed.success) {
                                                console.error('❌ Erros de validação no import:', parsed.error.flatten());
                                                alert('Falha de validação do JSON importado. Ver console.');
                                                return;
                                            }
                                            // Validar blocos declarados versus disponíveis (warning apenas)
                                            try {
                                                const available = new Set(blockRegistry.list.map(b => b.id));
                                                const missingBlocks = (parsed.data.blockRegistry || []).filter(b => !available.has(b.id));
                                                if (missingBlocks.length) {
                                                    console.warn('⚠️ Blocos ausentes no registry atual:', missingBlocks.map(b => b.id));
                                                }
                                            } catch (e) { /* ignore */ }
                                            const importedSteps = parsed.data.steps;
                                            // Normalização de IDs duplicados pós-validação
                                            const seen = new Set<string>();
                                            const normalized: EditableQuizStep[] = [];
                                            importedSteps.forEach((st: any, idx: number) => {
                                                if (!st.id || typeof st.id !== 'string') st.id = `imp-${idx}`;
                                                if (seen.has(st.id)) st.id = `${st.id}-${Date.now()}-${idx}`;
                                                seen.add(st.id);
                                                normalized.push({ ...st });
                                            });
                                            // Segunda validação para garantir consistência após normalização de ID
                                            const second = StepsArraySchema.safeParse(normalized);
                                            if (!second.success) {
                                                console.error('❌ Erro após normalização de IDs:', second.error.flatten());
                                                alert('Import falhou após normalização de IDs.');
                                                return;
                                            }
                                            // Validação leve de blocos por step (schema base já aceitou, aqui fazemos sanity extra)
                                            second.data.forEach((st: any) => {
                                                if (st.blocks) {
                                                    st.blocks = st.blocks.map((b: any) => {
                                                        if (!b.id) b.id = `${b.type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
                                                        return b;
                                                    });
                                                }
                                            });
                                            // Calcular diff
                                            const currentById = new Map(steps.map(s => [s.id, s] as const));
                                            const nextById = new Map(second.data.map(s => [s.id, s] as const));
                                            const added: EditableQuizStep[] = [];
                                            const removed: EditableQuizStep[] = [];
                                            const modified: Array<{ before: EditableQuizStep; after: EditableQuizStep; changes: string[] }> = [];
                                            // Added
                                            for (const [id, st] of nextById.entries()) {
                                                if (!currentById.has(id)) added.push(st as EditableQuizStep);
                                            }
                                            // Removed
                                            for (const [id, st] of currentById.entries()) {
                                                if (!nextById.has(id)) removed.push(st as EditableQuizStep);
                                            }
                                            // Modified
                                            for (const [id, before] of currentById.entries()) {
                                                const after = nextById.get(id) as EditableQuizStep | undefined;
                                                if (!after) continue;
                                                const changes: string[] = [];
                                                const fields: Array<keyof EditableQuizStep> = ['type', 'nextStep', 'questionText', 'questionNumber', 'title', 'formQuestion', 'placeholder', 'buttonText'];
                                                fields.forEach(f => {
                                                    if ((before as any)[f] !== (after as any)[f]) changes.push(String(f));
                                                });
                                                // options length / ids
                                                if ((before as any).options || (after as any).options) {
                                                    const bOpts = ((before as any).options || []).map((o: any) => o.id + ':' + o.text).join('|');
                                                    const aOpts = ((after as any).options || []).map((o: any) => o.id + ':' + o.text).join('|');
                                                    if (bOpts !== aOpts) changes.push('options');
                                                }
                                                if (before.type === 'offer' || after.type === 'offer') {
                                                    const bMap = JSON.stringify((before as any).offerMap || {});
                                                    const aMap = JSON.stringify((after as any).offerMap || {});
                                                    if (bMap !== aMap) changes.push('offerMap');
                                                }
                                                // Blocks diff
                                                const bBlocks = JSON.stringify((before as any).blocks || []);
                                                const aBlocks = JSON.stringify((after as any).blocks || []);
                                                if (bBlocks !== aBlocks) changes.push('blocks');
                                                if (changes.length) modified.push({ before: before as EditableQuizStep, after: after as EditableQuizStep, changes });
                                            }
                                            setImportDiff({ added, removed, modified });
                                            setPendingImport(second.data as EditableQuizStep[]);
                                        } catch (err: any) {
                                            alert('Falha ao importar JSON: ' + err.message);
                                        } finally {
                                            e.target.value = '';
                                        }
                                    };
                                    reader.readAsText(file);
                                }}
                            />
                            <Button size="sm" variant="outline" onClick={() => document.getElementById('quiz-import-input')?.click()}>Importar</Button>
                        </div>
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
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold">Etapas</span>
                                    {reachableInfo.orphans.size > 0 && (
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-pink-600 text-white" title="Existem etapas que não são alcançadas a partir da primeira.">
                                            {reachableInfo.orphans.size} órfã(s)
                                        </span>
                                    )}
                                </div>
                                <Badge variant="secondary" className="text-[10px]">{steps.length}</Badge>
                            </div>
                            <div className="flex-1 overflow-auto text-xs">
                                {steps.map((s, idx) => {
                                    const active = s.id === selectedId;
                                    const nStatus = getNextStepStatus(s, idx);
                                    const statusColor = nStatus === 'ok' ? 'bg-emerald-500' : nStatus === 'missing' ? 'bg-amber-500' : 'bg-red-500';
                                    const statusTitle = nStatus === 'ok' ? 'Fluxo OK' : nStatus === 'missing' ? 'nextStep ausente (pode impedir fluxo)' : 'nextStep inválido (ID não encontrado)';
                                    const orphan = isOrphan(s.id);
                                    return (
                                        <div key={s.id} className={`px-3 py-2 border-b cursor-pointer group ${active ? 'bg-primary/10' : 'hover:bg-muted/50'}`} onClick={() => setSelectedId(s.id)}>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium truncate">{idx + 1}. {s.type}</span>
                                                <span className={`w-2 h-2 rounded-full ${statusColor}`} title={statusTitle} />
                                                {orphan && <span className="text-[9px] px-1 py-0.5 rounded bg-pink-600 text-white" title="Step não alcançável a partir da origem">ÓRFÃO</span>}
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

                        {/* COL 2 - COMPONENTES / TIPO + INVENTÁRIO */}
                        <div className="w-72 border-r flex flex-col">
                            <div className="p-3 border-b flex items-center justify-between text-xs font-semibold">
                                <span className="flex items-center gap-1"><ListTree className="w-3 h-3" /> Componentes</span>
                                <Badge variant="secondary" className="text-[10px]">{steps.length}</Badge>
                            </div>
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
                                {/* Inventário de componentes por tipo de etapa */}
                                <div className="pt-2 border-t space-y-2">
                                    <div className="text-[10px] font-semibold uppercase tracking-wide">Inventário</div>
                                    {(() => {
                                        const groups: Record<string, number> = {};
                                        steps.forEach(s => { groups[s.type] = (groups[s.type] || 0) + 1; });
                                        const entries = Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
                                        return entries.map(([type, count]) => (
                                            <div key={type} className="flex items-center justify-between bg-muted/40 rounded px-2 py-1">
                                                <button type="button" className={`text-left text-[11px] font-medium hover:underline ${selectedStep?.type === type ? 'text-primary' : ''}`} onClick={() => {
                                                    const firstOfType = steps.find(s => s.type === type); if (firstOfType) setSelectedId(firstOfType.id);
                                                }}>{type}</button>
                                                <span className="text-[10px] bg-background/60 px-1 rounded border" title="Quantidade deste tipo">{count}</span>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>
                            <div className="p-2 border-t flex gap-2">
                                <Button size="sm" className="flex-1" onClick={handleSave} disabled={isSaving}>{isSaving ? 'Salvando...' : 'Salvar'}</Button>
                                <Button size="sm" variant="outline" onClick={() => {
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
                        <div className="flex-1 border-r relative bg-muted/10 flex flex-col">
                            {/* Painel preview de bloco (se houver bloco selecionado) */}
                            {selectedStep && (selectedStep.type === 'result' || selectedStep.type === 'offer') && activeBlockPreviewId && (
                                <div className="border-b bg-background/70 backdrop-blur p-2 text-[11px] flex items-center justify-between">
                                    <span className="font-semibold">Preview Bloco: {activeBlockPreviewId}</span>
                                    <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => setActiveBlockPreviewId(null)}>Fechar</Button>
                                </div>
                            )}
                            <div className="flex-1 overflow-auto">
                                {activeBlockPreviewId && selectedStep?.blocks?.length ? (
                                    (() => {
                                        const blk = (selectedStep.blocks || []).find(b => b.id === activeBlockPreviewId);
                                        const def = blk && blockRegistry.get(blk.type);
                                        if (!blk || !def) return <div className="p-4 text-[11px] text-red-600">Bloco não encontrado.</div>;
                                        let node: React.ReactNode = null;
                                        try { node = def.render({ config: blk.config || def.defaultConfig, state: { step: selectedStep } }); } catch (e: any) { node = <div className="text-red-600">Erro render: {e.message}</div>; }
                                        return <div className="p-4">{node}</div>;
                                    })()
                                ) : (
                                    <div className="absolute inset-0 overflow-auto">
                                        {simActive ? renderSimulation() : renderPreview()}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* COL 4 - PROPRIEDADES */}
                        <div className="w-80 flex flex-col">
                            <div className="p-3 border-b text-xs font-semibold">Propriedades</div>
                            <div className="flex-1 overflow-auto p-4 text-xs space-y-4">
                                {/* Painel Placeholders */}
                                <div className="border rounded p-2 bg-muted/20 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-semibold">Placeholders Preview</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block mb-1 font-medium">userName</label>
                                            <input value={phUserName} onChange={e => setPhUserName(e.target.value)} className="w-full border rounded px-2 py-1 text-[11px]" />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">primaryStyle</label>
                                            <input value={phPrimaryStyle} onChange={e => setPhPrimaryStyle(e.target.value)} className="w-full border rounded px-2 py-1 text-[11px]" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium">secondaryStyles (csv)</label>
                                        <input value={phSecondaryStyles} onChange={e => setPhSecondaryStyles(e.target.value)} className="w-full border rounded px-2 py-1 text-[11px]" />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">Use tokens: {'{userName}'} {'{primaryStyle}'} {'{secondaryStyles}'}</p>
                                </div>
                                {!selectedStep && <div className="text-muted-foreground text-[11px]">Selecione uma etapa.</div>}
                                {selectedStep && (
                                    <>
                                        {(selectedStep.type === 'result' || selectedStep.type === 'offer') && (
                                            <div className="border rounded p-2 bg-muted/30 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-semibold">Blocos</span>
                                                    <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => {
                                                        const defs = blockRegistry.list.filter(d => (selectedStep.type === 'result' ? d.category === 'resultado' : d.category === 'oferta'));
                                                        const def = defs[0];
                                                        if (!def) return;
                                                        const current = selectedStep.blocks || [];
                                                        updateStep(selectedStep.id, { blocks: [...current, { id: `${def.id}-${Date.now()}`, type: def.id, config: def.defaultConfig }] as any });
                                                    }}>+ Add</Button>
                                                </div>
                                                <div className="space-y-1">
                                                    {(selectedStep.blocks || []).map((b, i) => {
                                                        const def = blockRegistry.get(b.type);
                                                        const isEditing = editingBlockId === b.id;
                                                        return (
                                                            <div key={b.id} className={`bg-background rounded border p-2 space-y-1 ${activeBlockPreviewId === b.id ? 'ring-1 ring-primary' : ''}`}>
                                                                <div className="flex items-center justify-between text-[11px]">
                                                                    <span className="truncate font-medium" title={b.type}>{def?.label || b.type}</span>
                                                                    <div className="flex gap-1">
                                                                        <Button size="icon" variant="ghost" className="h-5 w-5" title="Preview" onClick={() => setActiveBlockPreviewId(p => p === b.id ? null : b.id)}>👁</Button>
                                                                        <Button size="icon" variant="ghost" className="h-5 w-5" title={isEditing ? 'Fechar' : 'Editar'} onClick={() => {
                                                                            if (isEditing) {
                                                                                setEditingBlockId(null); setBlockConfigError(null);
                                                                            } else {
                                                                                setEditingBlockId(b.id);
                                                                                setBlockConfigDraft(JSON.stringify(b.config || {}, null, 2));
                                                                                setBlockConfigError(null);
                                                                            }
                                                                        }}>✎</Button>
                                                                        <Button size="icon" variant="ghost" className="h-5 w-5" disabled={i === 0} onClick={() => {
                                                                            const arr = [...(selectedStep.blocks || [])];
                                                                            if (i === 0) return;
                                                                            const [m] = arr.splice(i, 1); arr.splice(i - 1, 0, m);
                                                                            updateStep(selectedStep.id, { blocks: arr as any });
                                                                        }}>↑</Button>
                                                                        <Button size="icon" variant="ghost" className="h-5 w-5" disabled={i === (selectedStep.blocks || []).length - 1} onClick={() => {
                                                                            const arr = [...(selectedStep.blocks || [])];
                                                                            if (i === arr.length - 1) return;
                                                                            const [m] = arr.splice(i, 1); arr.splice(i + 1, 0, m);
                                                                            updateStep(selectedStep.id, { blocks: arr as any });
                                                                        }}>↓</Button>
                                                                        <Button size="icon" variant="ghost" className="h-5 w-5 text-red-500" onClick={() => {
                                                                            const arr = (selectedStep.blocks || []).filter(x => x.id !== b.id);
                                                                            updateStep(selectedStep.id, { blocks: arr as any });
                                                                            if (editingBlockId === b.id) { setEditingBlockId(null); setBlockConfigError(null); }
                                                                        }}>✕</Button>
                                                                    </div>
                                                                </div>
                                                                {isEditing && (
                                                                    <div className="space-y-1">
                                                                        <textarea
                                                                            className="w-full border rounded px-1 py-0.5 text-[10px] font-mono h-28"
                                                                            value={blockConfigDraft}
                                                                            onChange={e => { setBlockConfigDraft(e.target.value); setBlockConfigError(null); }}
                                                                        />
                                                                        <div className="flex gap-2 justify-end">
                                                                            <Button size="sm" variant="outline" className="h-6 px-2" onClick={() => { setEditingBlockId(null); setBlockConfigError(null); }}>Cancelar</Button>
                                                                            <Button size="sm" className="h-6 px-2" onClick={() => {
                                                                                try {
                                                                                    const json = JSON.parse(blockConfigDraft || '{}');
                                                                                    if (def?.schema) {
                                                                                        const parsed = def.schema.safeParse(json);
                                                                                        if (!parsed.success) {
                                                                                            setBlockConfigError('Config inválida');
                                                                                            return;
                                                                                        }
                                                                                    }
                                                                                    const arr = [...(selectedStep.blocks || [])];
                                                                                    const idx = arr.findIndex(x => x.id === b.id);
                                                                                    if (idx !== -1) { arr[idx] = { ...arr[idx], config: json }; }
                                                                                    updateStep(selectedStep.id, { blocks: arr as any });
                                                                                    setEditingBlockId(null);
                                                                                    // Atualizar preview se estiver ativo
                                                                                    if (activeBlockPreviewId === b.id) setActiveBlockPreviewId(b.id);
                                                                                } catch (err: any) {
                                                                                    setBlockConfigError('JSON inválido: ' + err.message);
                                                                                }
                                                                            }}>Salvar</Button>
                                                                        </div>
                                                                        {blockConfigError && <p className="text-[10px] text-red-600">{blockConfigError}</p>}
                                                                        <p className="text-[9px] text-muted-foreground">Config JSON (validado)</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                    {!(selectedStep.blocks || []).length && <div className="text-[10px] text-muted-foreground italic">Nenhum bloco.</div>}
                                                </div>
                                            </div>
                                        )}
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
                                                            const map = selectedStep.offerMap || {} as Record<string, ExtendedOfferContent>;
                                                            const orderedKeys = [...Object.keys(map)].sort((a, b) => a.localeCompare(b));
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
                                                                                clone[k] = { ...(clone[k] || {}), title: e.target.value };
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
                                                                                clone[k] = { ...(clone[k] || {}), description: e.target.value };
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
                                                                                    clone[k] = { ...(clone[k] || {}), ctaLabel: e.target.value };
                                                                                    updateStep(selectedStep.id, { offerMap: clone as any });
                                                                                }}
                                                                            />
                                                                            <input
                                                                                placeholder="CTA URL"
                                                                                className="border rounded px-1 py-0.5 text-[11px]"
                                                                                value={(map as any)[k]?.ctaUrl || ''}
                                                                                onChange={e => {
                                                                                    const clone = { ...(selectedStep.offerMap || {}) } as Record<string, ExtendedOfferContent>;
                                                                                    clone[k] = { ...(clone[k] || {}), ctaUrl: e.target.value };
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
                                                                                clone[k] = { ...(clone[k] || {}), image: e.target.value };
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
                        {/* COL 5 - RUNTIME PREVIEW */}
                        <div className="w-80 flex flex-col border-l bg-muted/10">
                            <div className="p-3 border-b text-xs font-semibold">Runtime</div>
                            <div className="flex-1 overflow-hidden">
                                <RuntimePreview />
                            </div>
                        </div>
                    </div>{/* fecha wrapper flex-1 */}
                </div>
            </BlockRegistryProvider>
        </QuizRuntimeRegistryProvider>
    );
};

export default QuizFunnelEditor;
