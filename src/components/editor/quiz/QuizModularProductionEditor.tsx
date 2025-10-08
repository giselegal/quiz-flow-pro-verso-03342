/**
 * 🎯 QUIZ MODULAR PRODUCTION EDITOR - 4 Colunas Completo
 * 
 * Layout profissional:
 * - Coluna 1: Lista de Etapas (navegação)
 * - Coluna 2: Biblioteca de Componentes (drag source)
 * - Coluna 3: Canvas Visual (drop zone + preview)
 * - Coluna 4: Painel de Propriedades (edição detalhada)
 * 
 * Recursos:
 * - ✅ Drag & Drop entre colunas
 * - ✅ Componentes modulares reutilizáveis
 * - ✅ Edição em tempo real
 * - ✅ Preview idêntico à produção
 * - ✅ Publicação para /quiz-estilo
 */

import React, { useState, useCallback, useEffect, useMemo, Suspense, useRef } from 'react';
import { useLocation } from 'wouter';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DynamicPropertiesForm from './components/DynamicPropertiesForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Save,
    Upload,
    Eye,
    ArrowLeft,
    CheckCircle,
    AlertTriangle,
    Loader2,
    Plus,
    Trash2,
    Copy,
    GripVertical,
    Settings,
    Image as ImageIcon,
    Type,
    List,
    MousePointer,
    Layout,
    ArrowRightCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { quizEditorBridge } from '@/services/QuizEditorBridge';
import QuizProductionPreview from './QuizProductionPreview';
import { useToast } from '@/hooks/use-toast';
import { replacePlaceholders } from '@/utils/placeholderParser';
import { useLiveScoring } from '@/hooks/useLiveScoring';
import { HistoryManager } from '@/utils/historyManager';
import { snippetsManager, BlockSnippet } from '@/utils/snippetsManager';
import ThemeEditorPanel from './components/ThemeEditorPanel';
import { EditorThemeProvider, DesignTokens } from '@/theme/editorTheme';
import { useValidation } from './hooks/useValidation';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

// Pré-visualizações especializadas (lazy) dos componentes finais de produção
const StyleResultCard = React.lazy(() => import('@/components/editor/quiz/components/StyleResultCard').then(m => ({ default: m.StyleResultCard })));
const OfferMap = React.lazy(() => import('@/components/editor/quiz/components/OfferMap').then(m => ({ default: m.OfferMap })));

// Tipos
interface BlockComponent {
    id: string;
    type: string;
    order: number;
    parentId?: string | null; // suporte a aninhamento
    properties: Record<string, any>;
    content: Record<string, any>;
}

// Tipagem mais estrita alinhada aos tipos de produção
type StepType = 'intro' | 'question' | 'strategic-question' | 'transition' | 'transition-result' | 'result' | 'offer';

interface EditableQuizStep {
    id: string;
    type: StepType; // restringe para manter compatibilidade com QuizFunnelData
    order: number;
    blocks: BlockComponent[];
    title?: string;
    questionText?: string;
    options?: any[];
    requiredSelections?: number;
    image?: string;
    buttonText?: string;
    nextStep?: string;
    offerMap?: Record<string, any>;
    [key: string]: any;
}

interface ComponentLibraryItem {
    type: string;
    label: string;
    icon: React.ReactNode;
    defaultProps: Record<string, any>;
    category: 'layout' | 'content' | 'interactive' | 'media';
}

// Biblioteca de componentes disponíveis
const COMPONENT_LIBRARY: ComponentLibraryItem[] = [
    {
        type: 'text',
        label: 'Texto',
        icon: <Type className="w-4 h-4" />,
        category: 'content',
        defaultProps: {
            text: 'Novo texto',
            fontSize: '16px',
            color: '#432818',
            textAlign: 'left'
        }
    },
    {
        type: 'heading',
        label: 'Título',
        icon: <Type className="w-5 h-5" />,
        category: 'content',
        defaultProps: {
            text: 'Novo Título',
            level: 2,
            fontSize: '24px',
            color: '#432818',
            textAlign: 'center'
        }
    },
    {
        type: 'image',
        label: 'Imagem',
        icon: <ImageIcon className="w-4 h-4" />,
        category: 'media',
        defaultProps: {
            src: 'https://via.placeholder.com/400x300',
            alt: 'Imagem',
            width: '100%',
            borderRadius: '8px'
        }
    },
    {
        type: 'button',
        label: 'Botão',
        icon: <MousePointer className="w-4 h-4" />,
        category: 'interactive',
        defaultProps: {
            text: 'Clique aqui',
            backgroundColor: '#B89B7A',
            textColor: '#FFFFFF',
            action: 'next-step'
        }
    },
    {
        type: 'quiz-options',
        label: 'Opções de Quiz',
        icon: <List className="w-4 h-4" />,
        category: 'interactive',
        defaultProps: {
            options: [
                { id: 'opt1', text: 'Opção 1' },
                { id: 'opt2', text: 'Opção 2' }
            ],
            multiSelect: true,
            maxSelections: 3
        }
    },
    {
        type: 'form-input',
        label: 'Campo de Texto',
        icon: <Type className="w-4 h-4" />,
        category: 'interactive',
        defaultProps: {
            label: 'Nome',
            placeholder: 'Digite aqui...',
            required: true
        }
    },
    {
        type: 'container',
        label: 'Container',
        icon: <Layout className="w-4 h-4" />,
        category: 'layout',
        defaultProps: {
            backgroundColor: '#F8F9FA',
            padding: '16px',
            borderRadius: '8px'
        }
    }
];

interface QuizModularProductionEditorProps {
    funnelId?: string;
}

export const QuizModularProductionEditor: React.FC<QuizModularProductionEditorProps> = ({
    funnelId: initialFunnelId
}) => {
    const [, setLocation] = useLocation();
    const { toast } = useToast();

    // Estados principais
    const [funnelId, setFunnelId] = useState<string | undefined>(initialFunnelId);
    const [steps, setSteps] = useState<EditableQuizStep[]>([]);
    const [selectedStepId, setSelectedStepId] = useState<string>('');
    const [selectedBlockId, setSelectedBlockId] = useState<string>('');
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    // Theme overrides carregados do localStorage e aplicados via EditorThemeProvider
    const [themeOverrides, setThemeOverrides] = useState<Partial<DesignTokens>>({});

    // Validação em tempo real (fase inicial - regras básicas)
    const { byStep, byBlock } = useValidation(steps);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('quiz_editor_theme_overrides_v1');
            if (raw) setThemeOverrides(JSON.parse(raw));
        } catch {/* ignore */ }
    }, []);
    const [isLoading, setIsLoading] = useState(true);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    // Undo/Redo
    const historyRef = useRef<HistoryManager<EditableQuizStep[]> | null>(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const pushHistory = (next: EditableQuizStep[]) => {
        if (!historyRef.current) return;
        historyRef.current.push(next);
        setCanUndo(historyRef.current.canUndo());
        setCanRedo(historyRef.current.canRedo());
    };
    const applyHistorySnapshot = (snap: EditableQuizStep[] | null) => {
        if (!snap) return;
        setSteps(snap);
        setCanUndo(historyRef.current?.canUndo() || false);
        setCanRedo(historyRef.current?.canRedo() || false);
        setIsDirty(true);
    };

    // Layout responsivo
    const [activeTab, setActiveTab] = useState<'canvas' | 'preview'>('canvas');

    // Drag & Drop
    const [activeId, setActiveId] = useState<string | null>(null);
    const [clipboard, setClipboard] = useState<BlockComponent[] | null>(null);
    const [lastSelectionStepId, setLastSelectionStepId] = useState<string>('');
    const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
    const [blockPendingDuplicate, setBlockPendingDuplicate] = useState<BlockComponent | null>(null);
    const [targetStepId, setTargetStepId] = useState<string>('');
    const [multiSelectedIds, setMultiSelectedIds] = useState<string[]>([]);
    // Snippets
    const [snippets, setSnippets] = useState<BlockSnippet[]>([]);
    const [snippetFilter, setSnippetFilter] = useState('');
    const refreshSnippets = () => setSnippets(snippetsManager.list());
    useEffect(() => { refreshSnippets(); }, []);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Carregar funil
    useEffect(() => {
        loadFunnel();
    }, [initialFunnelId]);

    const loadFunnel = async () => {
        setIsLoading(true);
        try {
            const funnel = await quizEditorBridge.loadFunnelForEdit(initialFunnelId);

            // Converter steps para formato modular com blocos
            const modularSteps: EditableQuizStep[] = funnel.steps.map((step: any, index: number) => ({
                id: step.id,
                type: (step.type || 'question') as StepType,
                order: step.order ?? index + 1,
                title: step.title,
                questionText: step.questionText,
                options: step.options,
                requiredSelections: step.requiredSelections,
                image: step.image,
                buttonText: step.buttonText,
                nextStep: step.nextStep,
                offerMap: step.offerMap,
                blocks: Array.isArray(step.blocks) ? step.blocks : convertStepToBlocks(step)
            }));

            setSteps(modularSteps);
            historyRef.current = new HistoryManager<EditableQuizStep[]>(modularSteps);
            setCanUndo(false);
            setCanRedo(false);
            setFunnelId(funnel.id);
            setSelectedStepId(modularSteps[0]?.id || '');

            toast({
                title: 'Funil carregado',
                description: `${modularSteps.length} etapas com componentes modulares`,
            });
        } catch (error) {
            console.error('❌ Erro ao carregar:', error);
            toast({
                title: 'Erro',
                description: 'Falha ao carregar o funil',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Converter step legado em blocos modulares
    const convertStepToBlocks = (step: any): BlockComponent[] => {
        const blocks: BlockComponent[] = [];
        let order = 0;

        // Título
        if (step.title) {
            blocks.push({
                id: `${step.id}-title`,
                type: 'heading',
                order: order++,
                properties: { level: 2, textAlign: 'center' },
                content: { text: step.title }
            });
        }

        // Pergunta
        if (step.questionText) {
            blocks.push({
                id: `${step.id}-question`,
                type: 'heading',
                order: order++,
                properties: { level: 3, textAlign: 'center' },
                content: { text: step.questionText }
            });
        }

        // Opções
        if (step.options && step.options.length > 0) {
            blocks.push({
                id: `${step.id}-options`,
                type: 'quiz-options',
                order: order++,
                properties: {
                    multiSelect: step.requiredSelections > 1,
                    maxSelections: step.requiredSelections || 1
                },
                content: { options: step.options }
            });
        }

        // Imagem
        if (step.image) {
            blocks.push({
                id: `${step.id}-image`,
                type: 'image',
                order: order++,
                properties: { width: '100%', borderRadius: '8px' },
                content: { src: step.image, alt: 'Imagem da etapa' }
            });
        }

        // Botão de ação
        if (step.buttonText) {
            blocks.push({
                id: `${step.id}-button`,
                type: 'button',
                order: order++,
                properties: {
                    backgroundColor: '#B89B7A',
                    textColor: '#FFFFFF',
                    action: 'next-step'
                },
                content: { text: step.buttonText }
            });
        }

        return blocks;
    };

    // Step selecionado
    const selectedStep = useMemo(() =>
        steps.find(s => s.id === selectedStepId),
        [steps, selectedStepId]
    );

    // Bloco selecionado
    const selectedBlock = useMemo(() =>
        selectedStep?.blocks.find(b => b.id === selectedBlockId),
        [selectedStep, selectedBlockId]
    );

    // Persistir seleção por etapa (quando alternar, manter bloco selecionado se existir)
    useEffect(() => {
        if (!selectedStepId) return;
        if (lastSelectionStepId !== selectedStepId) {
            setSelectedBlockId('');
            setLastSelectionStepId(selectedStepId);
        }
    }, [selectedStepId, lastSelectionStepId]);

    // Adicionar bloco ao step
    const addBlockToStep = useCallback((stepId: string, componentType: string) => {
        const component = COMPONENT_LIBRARY.find(c => c.type === componentType);
        if (!component) return;

        const newBlock: BlockComponent = {
            id: `block-${Date.now()}`,
            type: componentType,
            order: selectedStep?.blocks.length || 0,
            parentId: null,
            properties: { ...component.defaultProps },
            content: {}
        };

        setSteps(prev => {
            const next = prev.map(step => step.id === stepId ? { ...step, blocks: [...step.blocks, newBlock] } : step);
            pushHistory(next);
            return next;
        });

        setSelectedBlockId(newBlock.id);
        setIsDirty(true);

        toast({
            title: 'Componente adicionado',
            description: component.label,
        });
    }, [selectedStep, toast]);

    // Remover bloco
    const removeBlock = useCallback((stepId: string, blockId: string) => {
        setSteps(prev => {
            const next = prev.map(step => step.id === stepId ? { ...step, blocks: step.blocks.filter(b => b.id !== blockId) } : step);
            pushHistory(next);
            return next;
        });

        if (selectedBlockId === blockId) {
            setSelectedBlockId('');
        }

        setIsDirty(true);
    }, [selectedBlockId]);

    // Duplicar bloco
    const duplicateBlock = useCallback((stepId: string, block: BlockComponent) => {
        const clone: BlockComponent = {
            ...block,
            id: `${block.id}-dup-${Date.now()}`,
            order: (selectedStep?.blocks.length || 0)
        };
        setSteps(prev => {
            const next = prev.map(s => s.id === stepId ? { ...s, blocks: [...s.blocks, clone] } : s);
            pushHistory(next);
            return next;
        });
        setSelectedBlockId(clone.id);
        setIsDirty(true);
    }, [selectedStep]);

    const duplicateBlockToAnotherStep = useCallback(() => {
        if (!blockPendingDuplicate || !targetStepId) return;
        setSteps(prev => {
            const next = prev.map(s => {
                if (s.id === targetStepId) {
                    const clone: BlockComponent = {
                        ...blockPendingDuplicate,
                        id: `${blockPendingDuplicate.id}-xdup-${Date.now()}`,
                        order: s.blocks.length
                    };
                    return { ...s, blocks: [...s.blocks, clone] };
                }
                return s;
            });
            pushHistory(next);
            return next;
        });
        setIsDirty(true);
        setDuplicateModalOpen(false);
        setBlockPendingDuplicate(null);
        setTargetStepId('');
        toast({ title: 'Bloco duplicado', description: `Copiado para ${targetStepId}` });
    }, [blockPendingDuplicate, targetStepId, toast]);

    // Copiar bloco (ou múltiplos no futuro)
    const copyBlock = useCallback((block: BlockComponent) => {
        setClipboard([JSON.parse(JSON.stringify(block))]);
    }, []);

    const copyMultiple = useCallback((blocks: BlockComponent[]) => {
        setClipboard(blocks.map(b => JSON.parse(JSON.stringify(b))));
        toast({ title: 'Copiado', description: `${blocks.length} bloco(s) copiado(s)` });
    }, [toast]);
    // Colar bloco(s)
    const pasteBlocks = useCallback((stepId: string) => {
        if (!clipboard || clipboard.length === 0) return;
        setSteps(prev => {
            const next = prev.map(s => {
                if (s.id !== stepId) return s;
                const baseLen = s.blocks.length;
                const clones = clipboard.map((b, i) => ({
                    ...b,
                    id: `${b.id}-paste-${Date.now()}-${i}`,
                    order: baseLen + i
                }));
                return { ...s, blocks: [...s.blocks, ...clones] };
            });
            pushHistory(next);
            return next;
        });
        setIsDirty(true);
    }, [clipboard]);

    // Atualizar propriedades do bloco
    const updateBlockProperties = useCallback((stepId: string, blockId: string, updates: Record<string, any>) => {
        setSteps(prev => {
            const next = prev.map(step => step.id === stepId ? {
                ...step,
                blocks: step.blocks.map(block => block.id === blockId ? { ...block, properties: { ...block.properties, ...updates } } : block)
            } : step);
            pushHistory(next);
            return next;
        });

        setIsDirty(true);
    }, []);

    // Atualizar conteúdo do bloco
    const updateBlockContent = useCallback((stepId: string, blockId: string, updates: Record<string, any>) => {
        setSteps(prev => {
            const next = prev.map(step => step.id === stepId ? {
                ...step,
                blocks: step.blocks.map(block => block.id === blockId ? { ...block, content: { ...block.content, ...updates } } : block)
            } : step);
            pushHistory(next);
            return next;
        });

        setIsDirty(true);
    }, []);

    // Multi seleção helpers
    const isMultiSelected = useCallback((id: string) => multiSelectedIds.includes(id), [multiSelectedIds]);
    const clearMultiSelection = useCallback(() => setMultiSelectedIds([]), []);
    const handleBlockClick = (e: React.MouseEvent, block: BlockComponent) => {
        e.stopPropagation();
        const isShift = e.shiftKey;
        const isMeta = e.metaKey || e.ctrlKey;
        if (!isShift && !isMeta) {
            // seleção simples
            setSelectedBlockId(block.id);
            clearMultiSelection();
            return;
        }
        if (isShift && selectedStep) {
            const ordered = [...selectedStep.blocks].sort((a, b) => a.order - b.order);
            const last = multiSelectedIds.length ? multiSelectedIds[multiSelectedIds.length - 1] : selectedBlockId || block.id;
            const startIndex = ordered.findIndex(b => b.id === last);
            const endIndex = ordered.findIndex(b => b.id === block.id);
            if (startIndex === -1 || endIndex === -1) return;
            const [from, to] = startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
            const range = ordered.slice(from, to + 1).map(b => b.id);
            const merged = Array.from(new Set([...multiSelectedIds, ...range]));
            setMultiSelectedIds(merged);
            setSelectedBlockId(block.id);
            return;
        }
        if (isMeta) {
            setSelectedBlockId(block.id);
            setMultiSelectedIds(prev => prev.includes(block.id) ? prev.filter(id => id !== block.id) : [...prev, block.id]);
        }
    };

    const removeMultiple = () => {
        if (!selectedStep || multiSelectedIds.length === 0) return;
        const total = multiSelectedIds.length;
        setSteps(prev => {
            const next = prev.map(s => s.id === selectedStep.id ? { ...s, blocks: s.blocks.filter(b => !multiSelectedIds.includes(b.id)) } : s);
            pushHistory(next);
            return next;
        });
        setIsDirty(true);
        clearMultiSelection();
        if (multiSelectedIds.includes(selectedBlockId)) setSelectedBlockId('');
        toast({ title: 'Removidos', description: `${total} bloco(s)` });
    };

    // Reordenar / mover blocos (nested)
    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id || !selectedStepId) { setActiveId(null); return; }
        setSteps(prev => {
            let changed = false;
            const next = prev.map(step => {
                if (step.id !== selectedStepId) return step;
                const blocks = [...step.blocks];
                const activeBlock = blocks.find(b => b.id === active.id);
                const overBlock = blocks.find(b => b.id === over.id);
                if (!activeBlock || !overBlock) return step;

                const isDescendant = (parentId: string, potentialChildId: string): boolean => {
                    const node = blocks.find(b => b.id === potentialChildId);
                    if (!node) return false;
                    if (node.parentId === parentId) return true;
                    if (!node.parentId) return false;
                    return isDescendant(parentId, node.parentId);
                };
                if (isDescendant(activeBlock.id, overBlock.id)) return step; // impede ciclo

                let targetParentId: string | null;
                if (overBlock.type === 'container' && activeBlock.id !== overBlock.id) {
                    targetParentId = overBlock.id;
                } else {
                    targetParentId = overBlock.parentId || null;
                }

                const fromParent = activeBlock.parentId || null;
                const toParent = targetParentId;
                const siblings = (pid: string | null) => blocks.filter(b => (b.parentId || null) === pid).sort((a, b) => a.order - b.order);

                if (fromParent !== toParent) {
                    const oldSibs = siblings(fromParent).filter(b => b.id !== activeBlock.id);
                    oldSibs.forEach((b, i) => { b.order = i; });
                    const newSibs = siblings(toParent);
                    activeBlock.parentId = toParent || undefined;
                    activeBlock.order = newSibs.length;
                    changed = true;
                } else {
                    const sibs = siblings(fromParent);
                    const oldIndex = sibs.findIndex(b => b.id === activeBlock.id);
                    const newIndex = sibs.findIndex(b => b.id === overBlock.id);
                    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                        const reordered = arrayMove(sibs, oldIndex, newIndex);
                        reordered.forEach((b, i) => { b.order = i; });
                        changed = true;
                    }
                }
                return { ...step, blocks: blocks.map(b => ({ ...b })) };
            });
            if (changed) { pushHistory(next); setIsDirty(true); }
            setActiveId(null);
            return next;
        });
    };

    const handleUndo = () => {
        if (!historyRef.current || !historyRef.current.canUndo()) return;
        const snap = historyRef.current.undo();
        applyHistorySnapshot(snap);
    };
    const handleRedo = () => {
        if (!historyRef.current || !historyRef.current.canRedo()) return;
        const snap = historyRef.current.redo();
        applyHistorySnapshot(snap);
    };

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const meta = e.metaKey || e.ctrlKey;
            if (meta && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                if (e.shiftKey) handleRedo(); else handleUndo();
            } else if (meta && e.key.toLowerCase() === 'y') {
                e.preventDefault();
                handleRedo();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // ========================================
    // Live Preview State & Helpers
    // ========================================
    const [quizSelections, setQuizSelections] = useState<Record<string, string[]>>({});

    // Mapa de pontuação (futuro: editar via propriedades dos options). Estrutura: blockId -> optionId -> { estilo: valor }
    const scoringMap = useMemo<Record<string, Record<string, number>>>(() => {
        // Placeholder: cada opção vale 1 ponto genérico (usado apenas para demonstrar variação)
        const map: Record<string, Record<string, number>> = {};
        steps.forEach(step => {
            step.blocks.filter(b => b.type === 'quiz-options').forEach(b => {
                const options = b.content.options || [];
                map[b.id] = options.reduce((acc: any, opt: any) => {
                    acc[opt.id] = 1;
                    return acc;
                }, {});
            });
        });
        return map;
    }, [steps]);

    const { scores: liveScores, topStyle } = useLiveScoring({ selections: quizSelections, scoringMap });

    const toggleQuizOption = (blockId: string, optionId: string, multi = true, max = 1) => {
        setQuizSelections(prev => {
            const current = prev[blockId] || [];
            let next: string[];
            if (multi) {
                const exists = current.includes(optionId);
                if (exists) {
                    next = current.filter(id => id !== optionId);
                } else {
                    if (current.length >= max) return prev; // limita
                    next = [...current, optionId];
                }
            } else {
                next = [optionId];
            }
            return { ...prev, [blockId]: next };
        });
    };

    // Agrupar filhos por parentId
    const getChildren = (blocks: BlockComponent[], parentId: string | null = null) =>
        blocks.filter(b => (b.parentId || null) === parentId).sort((a, b) => a.order - b.order);

    const renderBlockPreview = (block: BlockComponent, all: BlockComponent[]) => {
        const { type, content, properties, id } = block;
        const children = getChildren(all, id);
        // Contexto provisório para placeholders (será expandido com scoring dinâmico e dados reais do usuário)
        const placeholderContext = {
            userName: 'Preview',
            resultStyle: 'classico',
            // Futuro: integrar live scoring hook
            scores: { classico: 12, natural: 8, romantico: 6 }
        };
        // Heading
        if (type === 'heading') {
            const level = properties?.level ?? 2;
            const Tag = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'][Math.min(Math.max(level - 1, 0), 5)]) as any;
            return (
                <Tag className={cn(
                    'font-semibold tracking-tight',
                    level === 1 && 'text-3xl',
                    level === 2 && 'text-2xl',
                    level === 3 && 'text-xl',
                    level >= 4 && 'text-lg'
                )}>{replacePlaceholders(content.text || 'Título', placeholderContext)}</Tag>
            );
        }
        // Text
        if (type === 'text') {
            return <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{replacePlaceholders(content.text || 'Texto', placeholderContext)}</p>;
        }
        // Image
        if (type === 'image') {
            return (
                <div className="w-full flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={content.src || 'https://via.placeholder.com/400x240?text=Imagem'}
                        alt={content.alt || 'Imagem'}
                        className="max-w-full rounded-md border shadow-sm"
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            );
        }
        // Button
        if (type === 'button') {
            return (
                <button
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-[#B89B7A] hover:bg-[#a08464] text-white shadow-sm transition-colors"
                >
                    {replacePlaceholders(content.text || 'Botão', placeholderContext)}
                </button>
            );
        }
        // Quiz Options
        if (type === 'quiz-options') {
            const options = content.options || [];
            const multi = properties?.multiSelect ?? false;
            const max = properties?.maxSelections ?? (multi ? options.length : 1);
            const selected = quizSelections[block.id] || [];
            return (
                <div className="space-y-2">
                    <div className={cn('grid gap-3',
                        options.length >= 4 && 'grid-cols-2',
                        options.length >= 6 && 'md:grid-cols-3'
                    )}>
                        {options.map((opt: any) => {
                            const active = selected.includes(opt.id);
                            return (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); toggleQuizOption(block.id, opt.id, multi, max); }}
                                    className={cn(
                                        'text-xs px-3 py-2 rounded border text-left transition-all select-none',
                                        'bg-white hover:border-blue-300 hover:bg-blue-50',
                                        active && 'border-blue-600 bg-blue-600 text-white shadow'
                                    )}
                                >
                                    {opt.text || 'Opção'}
                                </button>
                            );
                        })}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                        {multi ? `${selected.length}/${max} selecionadas` : 'Seleção única'}
                    </div>
                </div>
            );
        }
        // Form Input
        if (type === 'form-input') {
            return (
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">{content.label || 'Campo'}</label>
                    <input
                        placeholder={content.placeholder || 'Digite...'}
                        className="w-full px-3 py-2 rounded-md border text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        disabled
                    />
                </div>
            );
        }
        // Container
        if (type === 'container') {
            return (
                <div
                    className={cn(
                        'rounded-md border p-3 bg-gradient-to-br from-white to-slate-50 shadow-sm relative',
                        'min-h-[60px]'
                    )}
                    style={{
                        backgroundColor: properties?.backgroundColor || undefined,
                        padding: properties?.padding || undefined,
                        borderRadius: properties?.borderRadius || undefined
                    }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-medium text-slate-500">Container</p>
                        <span className="text-[10px] text-slate-400">{children.length} filhos</span>
                    </div>
                    {children.length === 0 && (
                        <div className="text-[10px] text-slate-400 italic">Solte blocos aqui</div>
                    )}
                    <div className="space-y-2">
                        {children.map(child => (
                            <div key={child.id} className="border rounded-md p-2 bg-white/70">
                                {renderBlockPreview(child, all)}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return <span className="text-xs italic text-slate-400">(Pré-visualização não suportada)</span>;
    };

    // Salvar
    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            const funnel = {
                id: funnelId || 'new-draft',
                name: 'Quiz Estilo Pessoal - Modular',
                slug: 'quiz-estilo',
                steps: steps.map(s => ({
                    id: s.id,
                    type: s.type,
                    order: s.order,
                    title: s.title,
                    questionText: s.questionText,
                    options: s.options,
                    requiredSelections: s.requiredSelections,
                    image: s.image,
                    buttonText: s.buttonText,
                    nextStep: s.nextStep,
                    offerMap: s.offerMap,
                    // Persistir blocks em campo auxiliar (não impacta produção)
                    blocks: s.blocks
                })),
                isPublished: false,
                version: 1
            };

            const savedId = await quizEditorBridge.saveDraft(funnel);
            setFunnelId(savedId);
            setIsDirty(false);

            toast({
                title: '✅ Salvo com sucesso',
                description: `Rascunho ${savedId}`,
            });
        } catch (error) {
            toast({
                title: 'Erro ao salvar',
                description: String(error),
                variant: 'destructive'
            });
        } finally {
            setIsSaving(false);
        }
    }, [steps, funnelId, toast]);

    // Publicar
    const handlePublish = useCallback(async () => {
        if (!funnelId || funnelId === 'production') {
            toast({
                title: 'Salve primeiro',
                description: 'Salve o rascunho antes de publicar',
                variant: 'destructive'
            });
            return;
        }

        const confirmed = window.confirm(
            '⚠️ Publicar para produção?\n\nIsso substituirá o funil /quiz-estilo atual.'
        );

        if (!confirmed) return;

        setIsPublishing(true);
        try {
            await quizEditorBridge.publishToProduction(funnelId);

            toast({
                title: '🚀 Publicado!',
                description: 'Funil está em produção',
            });

            setTimeout(() => window.open('/quiz-estilo', '_blank'), 1500);
        } catch (error) {
            toast({
                title: 'Erro ao publicar',
                description: String(error),
                variant: 'destructive'
            });
        } finally {
            setIsPublishing(false);
        }
    }, [funnelId, toast]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
                    <p className="text-muted-foreground">Carregando editor modular...</p>
                </div>
            </div>
        );
    }

    return (
        <EditorThemeProvider tokens={themeOverrides}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={(event) => setActiveId(event.active.id as string)}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-col h-screen bg-gray-50">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-3 bg-white border-b">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" onClick={() => setLocation('/quiz-estilo')}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Voltar
                            </Button>

                            <div className="h-6 w-px bg-border" />

                            <div>
                                <h1 className="text-lg font-semibold">Editor Modular 4 Colunas</h1>
                                <p className="text-xs text-muted-foreground">
                                    {steps.length} etapas • {selectedStep?.blocks.length || 0} componentes na etapa
                                </p>
                            </div>

                            {isDirty && <Badge variant="outline">Não salvo</Badge>}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving || !isDirty}>
                                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Salvar
                            </Button>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" disabled={!canUndo} onClick={handleUndo} className="text-xs px-2">
                                    ⮪ Undo
                                </Button>
                                <Button variant="ghost" size="sm" disabled={!canRedo} onClick={handleRedo} className="text-xs px-2">
                                    Redo ⮫
                                </Button>
                            </div>

                            <Button size="sm" onClick={handlePublish} disabled={isPublishing}>
                                {isPublishing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                                Publicar
                            </Button>
                        </div>
                    </div>

                    {/* Layout 4 colunas */}
                    <div className="flex-1 flex overflow-hidden">
                        {/* COLUNA 1: ETAPAS */}
                        <div className="w-64 bg-white border-r flex flex-col">
                            <div className="px-4 py-3 border-b">
                                <h2 className="font-semibold text-sm">Etapas</h2>
                                <p className="text-xs text-muted-foreground">{steps.length} etapas</p>
                            </div>

                            <ScrollArea className="flex-1">
                                <div className="p-2 space-y-1">
                                    {steps.map((step, index) => (
                                        <button
                                            key={step.id}
                                            className={cn(
                                                'w-full text-left px-3 py-2 rounded-lg transition-colors',
                                                selectedStepId === step.id
                                                    ? 'bg-blue-50 border-2 border-blue-500'
                                                    : 'hover:bg-gray-50 border-2 border-transparent'
                                            )}
                                            onClick={() => {
                                                setSelectedStepId(step.id);
                                                setSelectedBlockId('');
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">{index + 1}</Badge>
                                                <span className="text-sm font-medium truncate">{step.id}</span>
                                                {byStep[step.id]?.length ? (
                                                    <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium">
                                                        {(() => {
                                                            const errs = byStep[step.id];
                                                            const errorCount = errs.filter(e=>e.severity==='error').length;
                                                            const warnCount = errs.filter(e=>e.severity==='warning').length;
                                                            if (!errorCount && !warnCount) return null;
                                                            return (
                                                                <>
                                                                    {errorCount > 0 && <span className="w-2 h-2 rounded-full bg-red-600" />}
                                                                    {warnCount > 0 && errorCount === 0 && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                                                                    <span className={cn('px-1 rounded', errorCount>0 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700')}>{errorCount || warnCount}</span>
                                                                </>
                                                            );
                                                        })()}
                                                    </span>
                                                ) : null}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge className="text-xs">{step.type}</Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {step.blocks.length} blocos
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>

                        {/* COLUNA 2: BIBLIOTECA DE COMPONENTES */}
                        <div className="w-64 bg-white border-r flex flex-col">
                            <div className="px-4 py-3 border-b">
                                <h2 className="font-semibold text-sm">Componentes</h2>
                                <p className="text-xs text-muted-foreground">Arraste para o canvas</p>
                            </div>

                            <ScrollArea className="flex-1">
                                <div className="p-3 space-y-3">
                                    {['content', 'interactive', 'media', 'layout'].map(category => {
                                        const items = COMPONENT_LIBRARY.filter(c => c.category === category);

                                        return (
                                            <div key={category}>
                                                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                                                    {category === 'content' && 'Conteúdo'}
                                                    {category === 'interactive' && 'Interativo'}
                                                    {category === 'media' && 'Mídia'}
                                                    {category === 'layout' && 'Layout'}
                                                </h3>

                                                <div className="space-y-1">
                                                    {items.map(component => (
                                                        <button
                                                            key={component.type}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg border hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                                            onClick={() => selectedStepId && addBlockToStep(selectedStepId, component.type)}
                                                            disabled={!selectedStepId}
                                                        >
                                                            {component.icon}
                                                            <span>{component.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </div>

                        {/* COLUNA 3: CANVAS */}
                        <div className="flex-1 bg-gray-100 flex flex-col">
                            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
                                <div className="px-4 py-2 bg-white border-b">
                                    <TabsList>
                                        <TabsTrigger value="canvas">Canvas</TabsTrigger>
                                        <TabsTrigger value="preview">Preview</TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="canvas" className="flex-1 overflow-auto p-4 m-0">
                                    {selectedStep ? (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center justify-between">
                                                    <span>Etapa: {selectedStep.id}</span>
                                                    <Badge>{selectedStep.blocks.length} componentes</Badge>
                                                </CardTitle>
                                                <CardDescription className="sr-only">
                                                    Canvas
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                {selectedStep.blocks.length === 0 ? (
                                                    <div className="text-center py-8 text-muted-foreground text-xs border border-dashed rounded-md bg-white/40">
                                                        (vazio)
                                                    </div>
                                                ) : (
                                                    <>
                                                        {/* Preview avançado para etapas especiais (result / offer) */}
                                                        {(selectedStep.id === 'step-20' || selectedStep.id === 'step-21') && (
                                                            <div className="mb-6">
                                                                <div className="mb-2 flex items-center justify-between">
                                                                    <h4 className="text-xs font-medium text-gray-600 flex items-center gap-2">
                                                                        {selectedStep.id === 'step-20' ? 'Resultado' : 'Oferta'}
                                                                    </h4>
                                                                    <Badge variant="secondary" className="text-[9px]">live</Badge>
                                                                </div>
                                                                <div className="border rounded-lg bg-white p-4">
                                                                    <Suspense fallback={<div className="text-xs text-muted-foreground">Carregando componente...</div>}>
                                                                        {selectedStep.id === 'step-20' && (
                                                                            <StyleResultCard
                                                                                resultStyle={topStyle || 'classico'}
                                                                                userName="Preview"
                                                                                secondaryStyles={Object.keys(liveScores).filter(s => s !== (topStyle || 'classico')).slice(0, 2)}
                                                                                scores={Object.keys(liveScores).length ? liveScores : { classico: 12, natural: 8, romantico: 6 }}
                                                                                mode="result"
                                                                            />
                                                                        )}
                                                                        {selectedStep.id === 'step-21' && (
                                                                            <OfferMap
                                                                                content={{ offerMap: (selectedStep as any).offerMap || {} }}
                                                                                mode="preview"
                                                                                userName="Preview"
                                                                                selectedOfferKey="Montar looks com mais facilidade e confiança"
                                                                            />
                                                                        )}
                                                                    </Suspense>
                                                                    {/* Texto explicativo removido para canvas limpo */}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <SortableContext
                                                            items={selectedStep.blocks.map(b => b.id)}
                                                            strategy={verticalListSortingStrategy}
                                                        >
                                                            <TooltipProvider>
                                                            <div className="space-y-2">
                                                                {selectedStep.blocks
                                                                    .filter(b => !b.parentId)
                                                                    .sort((a, b) => a.order - b.order)
                                                                    .map(block => (
                                                                        <div
                                                                            key={block.id}
                                                                            className={cn(
                                                                                'group relative p-3 border rounded-lg cursor-move bg-white overflow-hidden',
                                                                                (selectedBlockId === block.id || isMultiSelected(block.id))
                                                                                    ? 'border-blue-500 ring-2 ring-blue-200'
                                                                                    : 'border-gray-200 hover:border-gray-300',
                                                                                byBlock[block.id]?.length && 'border-red-500',
                                                                                isMultiSelected(block.id) && 'bg-blue-50'
                                                                            )}
                                                                            onClick={(e) => handleBlockClick(e, block)}
                                                                        >
                                                                            {byBlock[block.id]?.length && (
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <div className="absolute -top-1 -right-1 text-white text-[9px] px-1 rounded shadow cursor-default select-none" style={{ background: byBlock[block.id].some(e=>e.severity==='error') ? '#dc2626' : '#d97706' }}>
                                                                                            {byBlock[block.id].length}
                                                                                        </div>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent side="left" className="max-w-xs p-2">
                                                                                        <div className="space-y-1">
                                                                                            {byBlock[block.id].map(e => (
                                                                                                <p key={e.id} className={cn('text-[11px] leading-snug', e.severity==='error' ? 'text-red-600' : 'text-amber-600')}>
                                                                                                    {e.message}
                                                                                                </p>
                                                                                            ))}
                                                                                        </div>
                                                                                    </TooltipContent>
                                                                                </Tooltip>
                                                                            )}
                                                                            <div className="absolute left-2 top-2 opacity-70 group-hover:opacity-100 transition-opacity">
                                                                                <GripVertical className="w-4 h-4 text-gray-400" />
                                                                            </div>
                                                                            <div className="pl-6 pr-8 space-y-2">
                                                                                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                                                    <Badge variant="outline" className="text-[10px] px-1 py-0 font-normal">{block.type}</Badge>
                                                                                    <span className="truncate max-w-[160px]">{block.content.text || block.content.label || block.type}</span>
                                                                                </div>
                                                                                <div className="text-left">
                                                                                    {renderBlockPreview(block, selectedStep.blocks)}
                                                                                </div>
                                                                            </div>
                                                                            <div className="absolute right-1 top-1">
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        removeBlock(selectedStep.id, block.id);
                                                                                    }}
                                                                                >
                                                                                    <Trash2 className="w-3 h-3 text-red-500" />
                                                                                </Button>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        setBlockPendingDuplicate(block);
                                                                                        setTargetStepId(selectedStep.id);
                                                                                        setDuplicateModalOpen(true);
                                                                                    }}
                                                                                >
                                                                                    <ArrowRightCircle className="w-3 h-3 text-blue-500" />
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                    ))}
                                </div>
                                </TooltipProvider>
                                                        </SortableContext>
                                                    </>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                            Selecione uma etapa para editar
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="preview" className="flex-1 m-0">
                                    <QuizProductionPreview funnelId={funnelId} className="h-full" />
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* COLUNA 4: PROPRIEDADES / TEMA */}
                        <div className="w-80 bg-white border-l flex flex-col">
                            <div className="px-4 pt-3 border-b flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="font-semibold text-sm">Painéis</h2>
                                        <p className="text-xs text-muted-foreground">Configuração de blocos e tema</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={!clipboard || clipboard.length === 0 || !selectedStep}
                                            onClick={() => selectedStep && pasteBlocks(selectedStep.id)}
                                            className="h-7 px-2 text-[11px]"
                                        >Colar</Button>
                                    </div>
                                </div>
                                <Tabs defaultValue="props" className="w-full">
                                    <TabsList className="grid grid-cols-2 h-8">
                                        <TabsTrigger value="props" className="text-[11px]">Propriedades</TabsTrigger>
                                        <TabsTrigger value="theme" className="text-[11px]">Tema</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="props" className="m-0 p-0 h-[calc(100vh-190px)]">
                                        <ScrollArea className="h-full">
                                            {selectedBlock && selectedStep ? (
                                                <div className="p-4 space-y-6">
                                                    <DynamicPropertiesForm
                                                        type={selectedBlock.type}
                                                        values={{ ...selectedBlock.properties, ...selectedBlock.content }}
                                                        onChange={(patch) => {
                                                            // Dividir patch entre properties e content (heurística: se chave existe em content usa content senão properties)
                                                            const contentKeys = new Set(Object.keys(selectedBlock.content));
                                                            const propPatch: Record<string, any> = {};
                                                            const contentPatch: Record<string, any> = {};
                                                            Object.entries(patch).forEach(([k, v]) => {
                                                                if (contentKeys.has(k)) contentPatch[k] = v; else propPatch[k] = v;
                                                            });
                                                            if (Object.keys(propPatch).length) updateBlockProperties(selectedStep.id, selectedBlock.id, propPatch);
                                                            if (Object.keys(contentPatch).length) updateBlockContent(selectedStep.id, selectedBlock.id, contentPatch);
                                                        }}
                                                    />
                                                    <div className="pt-2 border-t space-y-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full"
                                                            onClick={() => {
                                                                const newBlock = { ...selectedBlock, id: `block-${Date.now()}` };
                                                                setSteps(prev => prev.map(step => step.id === selectedStep.id ? { ...step, blocks: [...step.blocks, newBlock] } : step));
                                                                setIsDirty(true);
                                                            }}
                                                        >
                                                            <Copy className="w-4 h-4 mr-2" />
                                                            Duplicar
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            className="w-full"
                                                            onClick={() => {
                                                                setBlockPendingDuplicate(selectedBlock);
                                                                setTargetStepId(selectedStep.id);
                                                                setDuplicateModalOpen(true);
                                                            }}
                                                        >
                                                            <ArrowRightCircle className="w-4 h-4 mr-2" />
                                                            Duplicar em…
                                                        </Button>
                                                        {multiSelectedIds.length > 1 && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="w-full"
                                                                onClick={() => {
                                                                    const blocks = selectedStep.blocks.filter(b => multiSelectedIds.includes(b.id));
                                                                    copyMultiple(blocks);
                                                                }}
                                                            >
                                                                <Copy className="w-4 h-4 mr-2" /> Copiar {multiSelectedIds.length}
                                                            </Button>
                                                        )}
                                                        {multiSelectedIds.length > 1 && (
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                className="w-full"
                                                                onClick={removeMultiple}
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" /> Remover {multiSelectedIds.length}
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="w-full"
                                                            onClick={() => removeBlock(selectedStep.id, selectedBlock.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Remover
                                                        </Button>
                                                        {/* Snippet actions quando múltipla seleção */}
                                                        {selectedStep && (multiSelectedIds.length > 0 || selectedBlock) && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="w-full"
                                                                onClick={() => {
                                                                    const ids = multiSelectedIds.length ? multiSelectedIds : [selectedBlock.id];
                                                                    const blocksToSave = selectedStep.blocks.filter(b => ids.includes(b.id));
                                                                    const name = prompt('Nome do snippet:', blocksToSave[0]?.type || 'Snippet');
                                                                    if (!name) return;
                                                                    snippetsManager.create(name, blocksToSave);
                                                                    refreshSnippets();
                                                                    toast({ title: 'Snippet salvo', description: name });
                                                                }}
                                                            >
                                                                <Copy className="w-4 h-4 mr-2" /> Salvar como Snippet
                                                            </Button>
                                                        )}
                                                    </div>
                                                    {/* Lista de snippets */}
                                                    <div className="pt-4 border-t space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="text-xs font-semibold text-muted-foreground uppercase">Snippets</h3>
                                                            <button
                                                                onClick={() => { refreshSnippets(); }}
                                                                className="text-[10px] text-blue-600 hover:underline"
                                                            >Atualizar</button>
                                                        </div>
                                                        <Input
                                                            placeholder="Filtrar..."
                                                            value={snippetFilter}
                                                            onChange={e => setSnippetFilter(e.target.value)}
                                                            className="h-7 text-xs"
                                                        />
                                                        <div className="space-y-2 max-h-60 overflow-auto pr-1">
                                                            {snippets.filter(s => !snippetFilter || s.name.toLowerCase().includes(snippetFilter.toLowerCase())).map(s => (
                                                                <div key={s.id} className="border rounded-md p-2 group relative">
                                                                    <p className="text-xs font-medium truncate">{s.name}</p>
                                                                    <p className="text-[10px] text-muted-foreground">{s.blocks.length} blocos</p>
                                                                    <div className="flex gap-1 mt-1">
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="h-6 text-[10px] flex-1"
                                                                            onClick={() => {
                                                                                if (!selectedStep) return;
                                                                                // Inserir clonando mantendo hierarquia
                                                                                setSteps(prev => {
                                                                                    const next = prev.map(st => {
                                                                                        if (st.id !== selectedStep.id) return st;
                                                                                        const baseLen = st.blocks.filter(b => !b.parentId).length; // top-level count para order root
                                                                                        const timestamp = Date.now();
                                                                                        const idMap: Record<string, string> = {};
                                                                                        const cloned = s.blocks.map((b, idx) => {
                                                                                            const newId = `${b.id}-snip-${timestamp}-${idx}`;
                                                                                            idMap[b.id] = newId;
                                                                                            return { ...b, id: newId };
                                                                                        }).map(b => ({
                                                                                            ...b,
                                                                                            parentId: b.parentId ? idMap[b.parentId] : null,
                                                                                            order: b.parentId ? b.order : baseLen + b.order
                                                                                        }));
                                                                                        return { ...st, blocks: [...st.blocks, ...cloned] };
                                                                                    });
                                                                                    pushHistory(next);
                                                                                    return next;
                                                                                });
                                                                                setIsDirty(true);
                                                                                toast({ title: 'Snippet inserido', description: s.name });
                                                                            }}
                                                                        >Insert</Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-6 text-[10px]"
                                                                            onClick={() => {
                                                                                const newName = prompt('Renomear snippet:', s.name);
                                                                                if (!newName) return;
                                                                                snippetsManager.update(s.id, { name: newName });
                                                                                refreshSnippets();
                                                                            }}
                                                                        >Renomear</Button>
                                                                        <Button
                                                                            variant="destructive"
                                                                            size="sm"
                                                                            className="h-6 text-[10px]"
                                                                            onClick={() => {
                                                                                if (!confirm('Excluir snippet?')) return;
                                                                                snippetsManager.remove(s.id);
                                                                                refreshSnippets();
                                                                            }}
                                                                        >Del</Button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {snippets.length === 0 && (
                                                                <p className="text-[11px] text-muted-foreground">Nenhum snippet salvo</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-center text-muted-foreground p-4">
                                                    <div>
                                                        <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                        <p>Selecione um componente</p>
                                                        <p className="text-sm">para editar suas propriedades</p>
                                                    </div>
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </TabsContent>
                                    <TabsContent value="theme" className="m-0 p-0 h-[calc(100vh-190px)]">
                                        <ThemeEditorPanel onApply={(t) => setThemeOverrides(t)} />
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>

                    {/* Drag Overlay */}
                    <DragOverlay>
                        {activeId ? (
                            <div className="bg-white border-2 border-blue-500 rounded-lg p-3 shadow-lg">
                                <Badge>Arrastando...</Badge>
                            </div>
                        ) : null}
                    </DragOverlay>
                </div>
                <Dialog open={duplicateModalOpen} onOpenChange={(o) => { if (!o) { setDuplicateModalOpen(false); setBlockPendingDuplicate(null); } }}>
                    <DialogContent className="max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Duplicar bloco em outra etapa</DialogTitle>
                            <DialogDescription>
                                Selecione a etapa destino. O bloco será adicionado ao final da lista.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs mb-1 text-muted-foreground">Bloco</p>
                                <p className="text-sm font-medium">{blockPendingDuplicate?.type}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium mb-1 block">Etapa destino</label>
                                <select
                                    className="w-full border rounded-md p-2 text-sm"
                                    value={targetStepId}
                                    onChange={(e) => setTargetStepId(e.target.value)}
                                >
                                    {steps.map(s => (
                                        <option key={s.id} value={s.id}>{s.id} ({s.type})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <DialogFooter className="mt-4 flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => { setDuplicateModalOpen(false); setBlockPendingDuplicate(null); }}>Cancelar</Button>
                            <Button size="sm" disabled={!targetStepId || !blockPendingDuplicate} onClick={duplicateBlockToAnotherStep}>Duplicar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </DndContext>
        </EditorThemeProvider>
    );
};

export default QuizModularProductionEditor;
