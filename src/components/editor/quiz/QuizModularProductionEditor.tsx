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
import '@/styles/globals.css'; // garante estilos de produção (quiz-option*, quiz-options-*)
import { useLocation } from 'wouter';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors, useDraggable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Logo corporativa (centralizada em um único ponto) - reutilizada em cabeçalhos
const BRAND_LOGO_URL = 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_120,h_50,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png';
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
import QuizAppConnected from '@/components/quiz/QuizAppConnected';
import { useToast } from '@/hooks/use-toast';
import { replacePlaceholders } from '@/utils/placeholderParser';
import { useLiveScoring } from '@/hooks/useLiveScoring';
import { HistoryManager } from '@/utils/historyManager';
import { snippetsManager, BlockSnippet } from '@/utils/snippetsManager';
import ThemeEditorPanel from './components/ThemeEditorPanel';
import { EditorThemeProvider, DesignTokens } from '@/theme/editorTheme';
import { useValidation } from './hooks/useValidation';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { sanitizeInlineHtml, looksLikeHtml } from '@/utils/sanitizeInlineHtml';
import { convertBlocksToStep as convertBlocksToStepUtil } from '@/utils/quizConversionUtils';
import { autoFillNextSteps } from '@/utils/autoFillNextSteps';
import { buildNavigationMap, formatNavigationReport } from '@/utils/funnelNavigation';
import { QuizRuntimeRegistryProvider, useQuizRuntimeRegistry } from '@/runtime/quiz/QuizRuntimeRegistry';
import { editorStepsToRuntimeMap } from '@/runtime/quiz/editorAdapter';
import { LayoutShell } from './LayoutShell';
import { usePanelWidths } from './hooks/usePanelWidths.tsx';
import { useEditorHistory } from './hooks/useEditorHistory';
import { useStepsBlocks } from './hooks/useStepsBlocks';
import { useBlocks } from './hooks/useBlocks';
import StepNavigator from './components/StepNavigator';
import ComponentLibraryPanel from './components/ComponentLibraryPanel';
import CanvasArea from './components/CanvasArea';
import PropertiesPanel from './components/PropertiesPanel';
import DuplicateBlockDialog from './components/DuplicateBlockDialog';

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
    /** Identificador único do item na paleta */
    type: string;
    /** Tipo real do bloco salvo (se diferente) */
    blockType?: string;
    label: string;
    icon: React.ReactNode;
    defaultProps: Record<string, any>;
    /** Conteúdo default (ex: text) separado de propriedades */
    defaultContent?: Record<string, any>;
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
    // Variantes específicas da Etapa 1 (Intro) e reutilizáveis
    {
        type: 'subtitle',
        blockType: 'text',
        label: 'Subtítulo',
        icon: <Type className="w-4 h-4" />,
        category: 'content',
        defaultProps: {
            textAlign: 'center',
            fontSize: '18px',
            color: '#432818'
        },
        defaultContent: { text: 'Subtítulo descritivo aqui...' }
    },
    {
        type: 'help-text',
        blockType: 'text',
        label: 'Texto Ajuda',
        icon: <Type className="w-3 h-3" />,
        category: 'content',
        defaultProps: {
            textAlign: 'center',
            fontSize: '12px',
            color: '#6B7280'
        },
        defaultContent: { text: 'Mensagem auxiliar para o usuário.' }
    },
    {
        type: 'primary-button',
        blockType: 'button',
        label: 'Botão Primário',
        icon: <MousePointer className="w-4 h-4" />,
        category: 'interactive',
        defaultProps: {
            text: 'Continuar',
            backgroundColor: '#B89B7A',
            textColor: '#FFFFFF',
            action: 'next-step'
        }
    },
    {
        type: 'copyright',
        blockType: 'text',
        label: 'Copyright',
        icon: <Type className="w-3 h-3" />,
        category: 'content',
        defaultProps: {
            textAlign: 'center',
            fontSize: '11px',
            color: '#6B7280'
        },
        defaultContent: { text: '© 2025 Sua Marca - Todos os direitos reservados' }
    },
    {
        type: 'lead-name',
        blockType: 'form-input',
        label: 'Nome (Lead)',
        icon: <Type className="w-4 h-4" />,
        category: 'interactive',
        defaultProps: {
            label: 'Como posso te chamar?',
            placeholder: 'Digite seu primeiro nome...',
            required: true
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
            requiredSelections: 1,
            maxSelections: 3,
            autoAdvance: true,
            showImages: true,
            layout: 'auto'
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
    },
    {
        type: 'progress-header',
        label: 'Header Progresso (Bloco)',
        icon: <Layout className="w-4 h-4" />,
        category: 'layout',
        defaultProps: {
            showLogo: true,
            logoUrl: 'https://via.placeholder.com/120x40?text=Logo',
            logoWidth: '120px',
            progressEnabled: true,
            progressPercent: 0,
            autoProgress: true,
            barHeight: '4px',
            barColor: '#b3a26aff',
            barBackground: '#E5E7EB'
        }
    }
];

interface QuizModularProductionEditorProps {
    funnelId?: string;
}

export const QuizModularProductionEditor: React.FC<QuizModularProductionEditorProps> = ({
    funnelId: initialFunnelId
}) => {
    // ======================
    // Larguras redimensionáveis dos painéis (persistidas)
    // ======================
    const { panelWidths, Resizer } = usePanelWidths();
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
    // Configuração global de cabeçalho (logo + progresso) fixo
    const [headerConfig, setHeaderConfig] = useState(() => {
        try {
            const raw = localStorage.getItem('quiz_editor_header_config_v1');
            if (raw) return JSON.parse(raw);
        } catch {/* ignore */ }
        return {
            showLogo: true,
            logoUrl: 'https://via.placeholder.com/140x48?text=Logo',
            logoWidth: '140px',
            progressEnabled: true,
            autoProgress: true,
            manualPercent: 0,
            barHeight: '4px',
            barColor: '#D4AF37',
            barBackground: '#E5E7EB'
        };
    });
    useEffect(() => { try { localStorage.setItem('quiz_editor_header_config_v1', JSON.stringify(headerConfig)); } catch {/* ignore */ } }, [headerConfig]);

    // Componente de cabeçalho fixo
    const FixedProgressHeader: React.FC<{ config: any; steps: EditableQuizStep[]; currentStepId: string }> = ({ config, steps, currentStepId }) => {
        if (!config.showLogo && !config.progressEnabled) return null;
        const currentIndex = steps.findIndex(s => s.id === currentStepId);
        // Filtrar etapas que contam (exclui result e offer)
        const counted = steps.filter(s => !['result', 'offer'].includes(s.type));
        const idxCounted = counted.findIndex(s => s.id === currentStepId);
        let percent = config.manualPercent;
        if (config.progressEnabled && config.autoProgress && idxCounted >= 0 && counted.length > 0) {
            percent = Math.min(100, Math.round(((idxCounted + 1) / counted.length) * 100));
        }
        return (
            <div className="flex items-center justify-between gap-4">
                {config.showLogo && (
                    <div className="shrink-0" style={{ maxWidth: config.logoWidth }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={config.logoUrl} alt="Logo" className="object-contain max-h-12" />
                    </div>
                )}
                {config.progressEnabled && (
                    <div className="flex-1 flex flex-col min-w-[160px]">
                        <div className="w-full rounded-full overflow-hidden" style={{ background: config.barBackground, height: config.barHeight }}>
                            <div className="h-full transition-all" style={{ width: `${percent}%`, background: config.barColor }} />
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 text-right">{percent}%</div>
                    </div>
                )}
            </div>
        );
    };

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
    // Undo/Redo via hook
    const { canUndo, canRedo, init: initHistory, push: pushHistory, undo, redo } = useEditorHistory<EditableQuizStep[]>();
    const applyHistorySnapshot = (snap: EditableQuizStep[] | null) => {
        if (!snap) return;
        setSteps(snap);
        setIsDirty(true);
    };

    // Layout responsivo
    const [activeTab, setActiveTab] = useState<'canvas' | 'preview'>('canvas');
    const [navOpen, setNavOpen] = useState(false);
    const navAnalysis = useMemo(() => buildNavigationMap(steps.map(s => ({ id: s.id, order: s.order, nextStep: s.nextStep as any, autoLinked: (s as any).autoLinked }))), [steps]);

    // ==========================
    // Gestão de Etapas (Add / Reorder / Delete)
    // ==========================
    const recomputeOrders = (list: EditableQuizStep[]) => list.map((s, i) => ({ ...s, order: i + 1 }));

    // Hook de etapas (CRUD / reorder)
    const { addStep: handleAddStep, moveStep: handleMoveStep, deleteStep: handleDeleteStep } = useStepsBlocks<EditableQuizStep>({
        steps,
        setSteps,
        pushHistory,
        setDirty: setIsDirty,
        onSelectStep: setSelectedStepId
    });

    // Hook de blocos (integração parcial - substituição progressiva dos handlers inline)
    const {
        addBlock,
        updateBlock,
        deleteBlock: removeBlockHook,
        reorderOrMove,
        duplicateBlock: duplicateBlockHook,
        insertSnippetBlocks
    } = useBlocks<{ id: string; blocks: any[] } & EditableQuizStep, any>({
        steps: steps as any,
        setSteps: setSteps as any,
        pushHistory,
        setDirty: setIsDirty,
        getSelectedStepId: () => selectedStepId
    });

    const generateNextStepId = (existing: string[]) => {
        let n = 1;
        while (true) {
            const id = `step-${String(n).padStart(2, '0')}`;
            if (!existing.includes(id)) return id;
            n++;
        }
    };

    // Removido: handleAddStep / handleMoveStep / handleDeleteStep agora vêm do hook

    // Drag & Drop
    const [activeId, setActiveId] = useState<string | null>(null);
    const [hoverContainerId, setHoverContainerId] = useState<string | null>(null);
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
            initHistory(modularSteps);
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
                properties: { level: 2, textAlign: 'center', allowHtml: /<\w+[^>]*>/.test(step.title) },
                content: { text: step.title }
            });
        }

        // Subtítulo específico (se detectar frase padrão ou campo custom step.subtitle)
        if (step.subtitle) {
            blocks.push({
                id: `${step.id}-subtitle`,
                type: 'text',
                order: order++,
                properties: { textAlign: 'center', fontSize: '18px', color: '#432818' },
                content: { text: step.subtitle }
            });
        } else if (step.id === 'step-01') {
            const defaultSubtitle = 'Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.';
            blocks.push({
                id: `${step.id}-subtitle`,
                type: 'text',
                order: order++,
                properties: { textAlign: 'center', fontSize: '18px', color: '#432818' },
                content: { text: defaultSubtitle }
            });
        }

        // Campo coleta nome (caso intro)
        if (step.formQuestion || step.placeholder || step.buttonText) {
            blocks.push({
                id: `${step.id}-leadform`,
                type: 'form-input',
                order: order++,
                properties: {
                    label: step.formQuestion || 'Como posso te chamar?',
                    placeholder: step.placeholder || 'Digite seu primeiro nome aqui...',
                    required: true
                },
                content: {}
            });
            // Help text (nome necessário)
            blocks.push({
                id: `${step.id}-name-help`,
                type: 'text',
                order: order++,
                properties: { textAlign: 'center', fontSize: '12px', color: '#6B7280' },
                content: { text: 'Seu nome é necessário para personalizar sua experiência.' }
            });
            // Botão principal
            if (step.buttonText) {
                blocks.push({
                    id: `${step.id}-primary-button`,
                    type: 'button',
                    order: order++,
                    properties: { textColor: '#FFFFFF', backgroundColor: '#B89B7A', action: 'next-step' },
                    content: { text: step.buttonText }
                });
            }
        }

        // Copyright
        if (step.id === 'step-01') {
            blocks.push({
                id: `${step.id}-copyright`,
                type: 'text',
                order: order++,
                properties: { textAlign: 'center', fontSize: '11px', color: '#6B7280' },
                content: { text: '© 2025 Gisele Galvão - Todos os direitos reservados' }
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

    // Refs para estados usados apenas para leitura em callbacks estáveis
    const selectedStepRef = useRef<EditableQuizStep | undefined>(undefined);
    useEffect(() => { selectedStepRef.current = selectedStep; }, [selectedStep]);
    const toastRef = useRef(toast);
    useEffect(() => { toastRef.current = toast; }, [toast]);

    // Adicionar bloco ao step (callback estável)
    const addBlockToStep = useCallback((stepId: string, componentType: string) => {
        const component = COMPONENT_LIBRARY.find(c => c.type === componentType || c.blockType === componentType);
        if (!component) return;
        addBlock(stepId, {
            type: component.blockType || component.type,
            properties: { ...component.defaultProps },
            content: { ...(component.defaultContent || {}) }
        } as any);
        // seleção do novo bloco: não temos id exato retornado; poderia ser aprimorado com retorno do hook
        setIsDirty(true);
        toastRef.current({ title: 'Componente adicionado', description: component.label });
    }, [addBlock]);

    // Remover bloco
    const removeBlock = useCallback((stepId: string, blockId: string) => {
        removeBlockHook(stepId, blockId);
        if (selectedBlockId === blockId) setSelectedBlockId('');
    }, [removeBlockHook, selectedBlockId]);

    // Duplicar bloco
    const duplicateBlock = useCallback((stepId: string, block: BlockComponent) => {
        duplicateBlockHook(stepId, block.id);
    }, [duplicateBlockHook]);

    const blockPendingDuplicateRef = useRef<BlockComponent | null>(null);
    const targetStepIdRef = useRef<string>('');
    useEffect(() => { blockPendingDuplicateRef.current = blockPendingDuplicate; }, [blockPendingDuplicate]);
    useEffect(() => { targetStepIdRef.current = targetStepId; }, [targetStepId]);
    const duplicateBlockToAnotherStep = useCallback(() => {
        const blockDup = blockPendingDuplicateRef.current;
        const target = targetStepIdRef.current;
        if (!blockDup || !target) return;
        duplicateBlockHook(blockDup.parentId ? blockDup.parentId : (selectedStepId || ''), blockDup.id, target);
        setDuplicateModalOpen(false);
        setBlockPendingDuplicate(null);
        setTargetStepId('');
        toastRef.current({ title: 'Bloco duplicado', description: `Copiado para ${target}` });
    }, [duplicateBlockHook, selectedStepId]);

    // Copiar bloco (ou múltiplos no futuro)
    const copyBlock = useCallback((block: BlockComponent) => {
        setClipboard([JSON.parse(JSON.stringify(block))]);
    }, []);

    const copyMultiple = useCallback((blocks: BlockComponent[]) => {
        setClipboard(blocks.map(b => JSON.parse(JSON.stringify(b))));
        toastRef.current({ title: 'Copiado', description: `${blocks.length} bloco(s) copiado(s)` });
    }, []);
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
        updateBlock(stepId, blockId, { properties: updates });
    }, [updateBlock]);

    // Atualizar conteúdo do bloco
    const updateBlockContent = useCallback((stepId: string, blockId: string, updates: Record<string, any>) => {
        updateBlock(stepId, blockId, { content: updates });
    }, [updateBlock]);

    // Debounce para histórico em edições rápidas de conteúdo/propriedades
    const historyDebounceRef = useRef<any>(null);
    const pendingHistoryRef = useRef<EditableQuizStep[] | null>(null);
    const scheduleHistoryPush = (next: EditableQuizStep[]) => {
        pendingHistoryRef.current = next;
        if (historyDebounceRef.current) clearTimeout(historyDebounceRef.current);
        historyDebounceRef.current = setTimeout(() => {
            if (pendingHistoryRef.current) {
                pushHistory(pendingHistoryRef.current);
                pendingHistoryRef.current = null;
            }
        }, 400);
    };

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
        if (!selectedStepId) { setActiveId(null); return; }
        if (!over) {
            // Caso raro: soltar fora de alvo conhecido -> apenas reset
            setActiveId(null);
            setHoverContainerId(null);
            return;
        }
        // Drop no final explícito
        const droppedAtEnd = over.id === 'canvas-end';
        if (active.id === over.id && !droppedAtEnd) { setActiveId(null); setHoverContainerId(null); return; }
        const targetContainerId = !droppedAtEnd && String(over.id).startsWith('container-slot:') ? String(over.id).slice('container-slot:'.length) : null;
        // Inserção de novo bloco vindo da biblioteca (id inicia com lib:tipo)
        if (String(active.id).startsWith('lib:')) {
            const componentType = String(active.id).slice(4);
            setSteps(prev => {
                const next = prev.map(step => {
                    if (step.id !== selectedStepId) return step;
                    const blocks = [...step.blocks];
                    const component = COMPONENT_LIBRARY.find(c => c.type === componentType);
                    if (!component) return step;
                    const newBlock: BlockComponent = {
                        id: `block-${Date.now()}`,
                        type: component.blockType || component.type,
                        order: 0,
                        parentId: targetContainerId || null,
                        properties: { ...component.defaultProps },
                        content: {}
                    };
                    if (['heading', 'text', 'button'].includes(newBlock.type) && (newBlock.properties as any).text) {
                        newBlock.content.text = (newBlock.properties as any).text;
                        delete (newBlock.properties as any).text;
                    }
                    if (component.defaultContent) {
                        newBlock.content = { ...component.defaultContent, ...newBlock.content };
                    }
                    // Determinar posição de inserção (antes do bloco alvo 'over') se existir, senão append
                    if (targetContainerId) {
                        // inserir como último filho
                        const siblings = blocks.filter(b => b.parentId === targetContainerId).sort((a, b) => a.order - b.order);
                        newBlock.order = siblings.length;
                    } else {
                        const rootBlocks = blocks.filter(b => !b.parentId).sort((a, b) => a.order - b.order);
                        let insertOrder = rootBlocks.length; // default append
                        if (!droppedAtEnd && !targetContainerId) {
                            const overIndex = blocks.findIndex(b => b.id === over.id);
                            if (overIndex !== -1) {
                                const overBlock = blocks[overIndex];
                                if (!overBlock.parentId) {
                                    insertOrder = overBlock.order; // inserir antes
                                    rootBlocks.filter(b => b.order >= insertOrder).forEach(b => { b.order += 1; });
                                }
                            }
                        }
                        if (droppedAtEnd) {
                            insertOrder = rootBlocks.length;
                        }
                        newBlock.order = insertOrder;
                    }
                    blocks.push(newBlock);
                    return { ...step, blocks: blocks.map(b => ({ ...b })) };
                });
                pushHistory(next);
                setIsDirty(true);
                return next;
            });
            setActiveId(null);
            setHoverContainerId(null);
            return;
        }
        setSteps(prev => {
            let changed = false;
            const next = prev.map(step => {
                if (step.id !== selectedStepId) return step;
                const blocks = [...step.blocks];
                const activeBlock = blocks.find(b => b.id === active.id);
                const overBlock = blocks.find(b => b.id === over.id);
                // Se soltou em slot de container
                if (targetContainerId && activeBlock) {
                    const fromParent = activeBlock.parentId || null;
                    const toParent = targetContainerId;
                    if (fromParent !== toParent) {
                        // Reindexa antigos irmãos de origem
                        const oldSibs = blocks.filter(b => (b.parentId || null) === fromParent && b.id !== activeBlock.id).sort((a, b) => a.order - b.order);
                        oldSibs.forEach((b, i) => { b.order = i; });
                        const newSibs = blocks.filter(b => b.parentId === toParent).sort((a, b) => a.order - b.order);
                        activeBlock.parentId = toParent;
                        activeBlock.order = newSibs.length;
                        changed = true;
                    }
                    return { ...step, blocks: blocks.map(b => ({ ...b })) };
                }
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
            setHoverContainerId(null);
            return next;
        });
    };

    const handleUndo = () => applyHistorySnapshot(undo());
    const handleRedo = () => applyHistorySnapshot(redo());

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

    const toggleQuizOption = useCallback((blockId: string, optionId: string, multi = true, max = 1) => {
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
    }, []);

    // Agrupar filhos por parentId
    const getChildren = (blocks: BlockComponent[], parentId: string | null = null) =>
        blocks.filter(b => (b.parentId || null) === parentId).sort((a, b) => a.order - b.order);

    // Cache de pré-visualizações para evitar recomputar nós React pesados
    const previewCacheRef = useRef<Map<string, { key: string; node: React.ReactNode }>>(new Map());

    const renderBlockPreview = (block: BlockComponent, all: BlockComponent[]) => {
        const { type, content, properties, id } = block;
        const children = getChildren(all, id);
        // Construir hash de dependências (alterações de dados relevantes invalidam cache)
        const expanded = type === 'container' ? expandedContainers.has(id) : false; // usa state mais abaixo mas é avaliado apenas em execução
        const childIds = type === 'container' ? children.map(c => c.id).join(',') : '';
        const dynamicContextHash = JSON.stringify({ liveScores, selections: quizSelections[id], currentStep: selectedStepId }); // inclui seleções e etapa atual
        const key = [
            id,
            type,
            block.order,
            block.parentId || '',
            expanded ? '1' : '0',
            childIds,
            JSON.stringify(properties || {}),
            JSON.stringify(content || {}),
            dynamicContextHash
        ].join('|');
        const cached = previewCacheRef.current.get(id);
        if (cached && cached.key === key) return cached.node;
        // Contexto provisório para placeholders (será expandido com scoring dinâmico e dados reais do usuário)
        const placeholderContext = {
            userName: 'Preview',
            resultStyle: 'classico',
            // Futuro: integrar live scoring hook
            scores: { classico: 12, natural: 8, romantico: 6 }
        };
        let node: React.ReactNode = null;
        // Heading
        if (type === 'heading') {
            const level = properties?.level ?? 2;
            const Tag = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'][Math.min(Math.max(level - 1, 0), 5)]) as any;
            const rawText = content.text || 'Título';
            const allowHtml = properties?.allowHtml && looksLikeHtml(rawText);
            let inner: React.ReactNode;
            if (allowHtml) {
                const safe = sanitizeInlineHtml(replacePlaceholders(rawText, placeholderContext));
                inner = <span dangerouslySetInnerHTML={{ __html: safe }} />;
            } else {
                inner = replacePlaceholders(rawText, placeholderContext);
            }
            node = (
                <Tag
                    className={cn(
                        'font-semibold tracking-tight',
                        level === 1 && 'text-3xl',
                        level === 2 && 'text-2xl',
                        level === 3 && 'text-xl',
                        level >= 4 && 'text-lg'
                    )}
                >{inner}</Tag>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Text
        if (type === 'text') {
            node = <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{replacePlaceholders(content.text || 'Texto', placeholderContext)}</p>;
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Image
        if (type === 'image') {
            node = (
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
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Button
        if (type === 'button') {
            node = (
                <button
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-[#B89B7A] hover:bg-[#a08464] text-white shadow-sm transition-colors"
                >
                    {replacePlaceholders(content.text || 'Botão', placeholderContext)}
                </button>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Quiz Options
        if (type === 'quiz-options') {
            node = (
                <QuizOptionsPreview
                    blockId={id}
                    options={content.options || []}
                    properties={properties || {}}
                    selectedStep={selectedStep}
                    selections={quizSelections[id] || []}
                    onToggle={(optionId: string, multi: boolean, required: number) => toggleQuizOption(id, optionId, multi, required)}
                    advanceStep={(nextStepId: string) => { setSelectedStepId(nextStepId); setSelectedBlockId(''); }}
                />
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Form Input
        if (type === 'form-input') {
            node = (
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">{content.label || 'Campo'}</label>
                    <input
                        placeholder={content.placeholder || 'Digite...'}
                        className="w-full px-3 py-2 rounded-md border text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        disabled
                    />
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Container
        if (type === 'container') {
            const expanded = expandedContainers.has(id);
            node = (
                <div
                    className={cn(
                        'rounded-md border p-3 bg-gradient-to-br from-white to-slate-50 shadow-sm relative',
                        'min-h-[48px]'
                    )}
                    style={{
                        backgroundColor: properties?.backgroundColor || undefined,
                        padding: properties?.padding || undefined,
                        borderRadius: properties?.borderRadius || undefined
                    }}
                >
                    <div className="flex items-center justify-between mb-1">
                        <button type="button" onClick={(e) => { e.stopPropagation(); toggleContainer(id); }} className="text-[11px] font-medium text-slate-600 inline-flex items-center gap-1">
                            <span className={cn('transition-transform', expanded ? 'rotate-90' : '')}>▶</span>
                            Container
                        </button>
                        <span className="text-[10px] text-slate-400">{children.length} filho(s)</span>
                    </div>
                    {!expanded && children.length > 0 && (
                        <div className="text-[10px] text-slate-400 italic">(colapsado)</div>
                    )}
                    {expanded && (
                        <div className="space-y-2">
                            {children.length === 0 && (
                                <div className="text-[10px] text-slate-400 italic">Solte blocos aqui</div>
                            )}
                            {children.map(child => (
                                <div key={child.id} className="border rounded-md p-2 bg-white/70">
                                    {renderBlockPreview(child, all)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Progress Header (bloco opcional adicional ao cabeçalho fixo)
        if (type === 'progress-header') {
            const totalSteps = steps.length;
            const currentIndex = selectedStep ? steps.findIndex(s => s.id === selectedStep.id) : -1;
            const auto = properties?.autoProgress !== false && properties?.progressEnabled !== false;
            const percent = auto && currentIndex >= 0 && totalSteps > 0
                ? Math.min(100, Math.round(((currentIndex + 1) / totalSteps) * 100))
                : (properties?.progressPercent ?? 0);
            const showLogo = properties?.showLogo !== false;
            const progressEnabled = properties?.progressEnabled !== false;
            node = (
                <div className="w-full flex flex-col gap-2">
                    <div className="flex items-center justify-between min-h-[40px]">
                        {showLogo && (
                            <div className="shrink-0" style={{ maxWidth: properties?.logoWidth || '120px' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={properties?.logoUrl || BRAND_LOGO_URL}
                                    alt="Logo"
                                    className="object-contain max-h-12"
                                />
                            </div>
                        )}
                        {progressEnabled && (
                            <div className="flex-1 ml-4 flex flex-col">
                                <div
                                    className="w-full rounded-full overflow-hidden"
                                    style={{ background: properties?.barBackground || '#E5E7EB', height: properties?.barHeight || '4px' }}
                                >
                                    <div
                                        className="h-full transition-all"
                                        style={{ width: `${percent}%`, background: properties?.barColor || '#D4AF37' }}
                                    />
                                </div>
                                <div className="text-[10px] text-slate-500 mt-1 text-right">{percent}%</div>
                            </div>
                        )}
                    </div>
                    <div className="text-[10px] text-slate-400 italic">(Header local - coexistindo com cabeçalho global)</div>
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        node = <span className="text-xs italic text-slate-400">(Pré-visualização não suportada)</span>;
        previewCacheRef.current.set(id, { key, node });
        return node;
    };

    // Limpar cache ao trocar de etapa selecionada (evita crescimento indefinido e garante contexto correto)
    useEffect(() => {
        previewCacheRef.current.clear();
    }, [selectedStepId]);

    // ========================================
    // Virtualização simples (janela) para blocos top-level
    // ========================================
    const VIRTUALIZATION_THRESHOLD = 60; // ativa acima de 60 blocos raiz
    const ESTIMATED_ROW_HEIGHT = 140; // estimativa média (px)
    const OVERSCAN = 6; // blocos extras antes/depois
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [scrollState, setScrollState] = useState({ top: 0, height: 0 });

    const updateScrollMetrics = useCallback(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        setScrollState({ top: el.scrollTop, height: el.clientHeight });
    }, []);

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        updateScrollMetrics();
        const onScroll = () => updateScrollMetrics();
        el.addEventListener('scroll', onScroll, { passive: true });
        const onResize = () => updateScrollMetrics();
        window.addEventListener('resize', onResize);
        return () => {
            el.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
        };
    }, [updateScrollMetrics]);

    const computeVirtualWindow = useCallback((rootBlocks: BlockComponent[]) => {
        if (rootBlocks.length <= VIRTUALIZATION_THRESHOLD) {
            return { enabled: false, visible: rootBlocks, topSpacer: 0, bottomSpacer: 0 };
        }
        // Desativa durante drag para evitar inconsistências de DnD
        if (activeId) {
            return { enabled: false, visible: rootBlocks, topSpacer: 0, bottomSpacer: 0 };
        }
        const { top, height } = scrollState;
        const total = rootBlocks.length;
        const startIndex = Math.max(Math.floor(top / ESTIMATED_ROW_HEIGHT) - OVERSCAN, 0);
        const viewportCount = Math.ceil(height / ESTIMATED_ROW_HEIGHT) + OVERSCAN * 2;
        const endIndex = Math.min(startIndex + viewportCount, total);
        const visible = rootBlocks.slice(startIndex, endIndex);
        const topSpacer = startIndex * ESTIMATED_ROW_HEIGHT;
        const bottomSpacer = (total - endIndex) * ESTIMATED_ROW_HEIGHT;
        return { enabled: true, visible, topSpacer, bottomSpacer };
    }, [scrollState, activeId]);


    // ========================================
    // BlockRow memoizado para reduzir re-renders em listas grandes
    // ========================================
    interface BlockRowProps {
        block: BlockComponent;
        byBlock: Record<string, any[]>;
        selectedBlockId: string;
        isMultiSelected: (id: string) => boolean;
        handleBlockClick: (e: React.MouseEvent, block: BlockComponent) => void;
        renderBlockPreview: (block: BlockComponent, all: BlockComponent[]) => React.ReactNode;
        allBlocks: BlockComponent[];
        removeBlock: (stepId: string, blockId: string) => void;
        stepId: string;
        setBlockPendingDuplicate: (b: BlockComponent) => void;
        setTargetStepId: (id: string) => void;
        setDuplicateModalOpen: (v: boolean) => void;
    }
    const BlockRow: React.FC<BlockRowProps> = React.memo((props) => {
        const { block, byBlock, selectedBlockId, isMultiSelected, handleBlockClick, renderBlockPreview, allBlocks, removeBlock, stepId, setBlockPendingDuplicate, setTargetStepId, setDuplicateModalOpen } = props;
        const hasErrors = !!byBlock[block.id]?.length;
        // DnD sortable hook
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
        const style: React.CSSProperties = {
            transform: transform ? CSS.Transform.toString(transform) : undefined,
            transition,
        };
        const isContainer = block.type === 'container';
        const isHoverTarget = hoverContainerId === block.id;
        const isExpanded = !isContainer || expandedContainers.has(block.id);
        return (
            <div
                key={block.id}
                className={cn(
                    'group relative p-3 rounded-lg cursor-move bg-white overflow-hidden transition-shadow',
                    (selectedBlockId === block.id || isMultiSelected(block.id)) && 'border border-blue-500 ring-2 ring-blue-200 shadow-sm',
                    // Mantém indicador visual mínimo em caso de erro sem violar regra de borda somente ao selecionar
                    hasErrors && !(selectedBlockId === block.id || isMultiSelected(block.id)) && 'shadow-[0_0_0_1px_#dc2626]',
                    isMultiSelected(block.id) && 'bg-blue-50',
                    isDragging && 'opacity-50',
                    isContainer && 'pb-8',
                    isContainer && isHoverTarget && 'outline outline-2 outline-blue-400'
                )}
                onClick={(e) => handleBlockClick(e, block)}
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
            >
                {hasErrors && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="absolute -top-1 -right-1 text-white text-[9px] px-1 rounded shadow cursor-default select-none" style={{ background: byBlock[block.id].some(e => e.severity === 'error') ? '#dc2626' : '#d97706' }}>
                                {byBlock[block.id].length}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs p-2">
                            <div className="space-y-1">
                                {byBlock[block.id].map((e: any) => (
                                    <p key={e.id} className={cn('text-[11px] leading-snug', e.severity === 'error' ? 'text-red-600' : 'text-amber-600')}>
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
                <div className="pl-6 pr-8">
                    {/* Metadados (tipo/nome) ocultados para canvas limpo */}
                    <div className="text-left flex items-start gap-2">
                        {isContainer && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); toggleContainer(block.id); }}
                                className="mt-1 text-[10px] px-1 rounded border bg-white hover:bg-blue-50"
                            >
                                {isExpanded ? '−' : '+'}
                            </button>
                        )}
                        <div className="flex-1">{renderBlockPreview(block, allBlocks)}</div>
                    </div>
                    {isContainer && isExpanded && (
                        <div className="mt-3 relative">
                            <div className="text-[10px] text-slate-400 italic mb-1 flex items-center gap-2">
                                <span>Conteúdo</span>
                                <span className="text-[9px] text-slate-400">{allBlocks.filter(b => b.parentId === block.id).length}</span>
                            </div>
                            <SortableContext
                                items={[...allBlocks.filter(b => b.parentId === block.id).sort((a, b) => a.order - b.order).map(c => c.id), `container-slot:${block.id}`]}
                                strategy={verticalListSortingStrategy}
                            >
                                <div
                                    className={cn(
                                        'min-h-[32px] rounded-md border border-dashed flex flex-col gap-2 p-2 bg-white/40 transition-colors',
                                        isHoverTarget && 'border-blue-400 bg-blue-50/40'
                                    )}
                                    onDragOver={() => setHoverContainerId(block.id)}
                                    onDragLeave={(e) => {
                                        if (!e.currentTarget.contains(e.relatedTarget as Node)) setHoverContainerId(prev => prev === block.id ? null : prev);
                                    }}
                                >
                                    {allBlocks.filter(b => b.parentId === block.id).length === 0 && (
                                        <div className="text-[10px] text-slate-400 italic">Solte aqui para aninhar</div>
                                    )}
                                    {allBlocks.filter(b => b.parentId === block.id).sort((a, b) => a.order - b.order).map(child => (
                                        <BlockRow
                                            key={child.id}
                                            block={child}
                                            byBlock={byBlock}
                                            selectedBlockId={selectedBlockId}
                                            isMultiSelected={isMultiSelected}
                                            handleBlockClick={handleBlockClick}
                                            renderBlockPreview={renderBlockPreview}
                                            allBlocks={allBlocks}
                                            removeBlock={removeBlock}
                                            stepId={stepId}
                                            setBlockPendingDuplicate={setBlockPendingDuplicate}
                                            setTargetStepId={setTargetStepId}
                                            setDuplicateModalOpen={setDuplicateModalOpen}
                                        />
                                    ))}
                                    <div id={`container-slot:${block.id}`} className="h-2 w-full" />
                                </div>
                            </SortableContext>
                        </div>
                    )}
                </div>
                <div className="absolute right-1 top-1 flex flex-col gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeBlock(stepId, block.id);
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
                            setTargetStepId(stepId);
                            setDuplicateModalOpen(true);
                        }}
                    >
                        <ArrowRightCircle className="w-3 h-3 text-blue-500" />
                    </Button>
                </div>
            </div>
        );
    }, (prev, next) => {
        if (prev.block.id !== next.block.id) return false;
        if (prev.block.order !== next.block.order) return false;
        if (prev.block.type !== next.block.type) return false;
        if (prev.block.parentId !== next.block.parentId) return false;
        // Se container, comparar estado expandido e quantidade de filhos
        if (prev.block.type === 'container') {
            const prevChildren = prev.allBlocks.filter(b => b.parentId === prev.block.id).length;
            const nextChildren = next.allBlocks.filter(b => b.parentId === next.block.id).length;
            if (prevChildren !== nextChildren) return false;
        }
        if (prev.selectedBlockId === prev.block.id || next.selectedBlockId === next.block.id) {
            if (prev.selectedBlockId !== next.selectedBlockId) return false;
        }
        const prevMulti = prev.isMultiSelected(prev.block.id);
        const nextMulti = next.isMultiSelected(next.block.id);
        if (prevMulti !== nextMulti) return false;
        if (prev.block.properties !== next.block.properties) return false;
        if (prev.block.content !== next.block.content) return false;
        const prevErrs = prev.byBlock[prev.block.id];
        const nextErrs = next.byBlock[next.block.id];
        if ((prevErrs?.length || 0) !== (nextErrs?.length || 0)) return false;
        if (prevErrs && nextErrs) {
            for (let i = 0; i < prevErrs.length; i++) {
                if (prevErrs[i].severity !== nextErrs[i].severity || prevErrs[i].message !== nextErrs[i].message) return false;
            }
        }
        return true;
    });

    // Flush do histórico debounced ao trocar de step ou desmontar
    useEffect(() => {
        return () => {
            if (historyDebounceRef.current) {
                clearTimeout(historyDebounceRef.current);
                historyDebounceRef.current = null;
            }
            if (pendingHistoryRef.current) {
                pushHistory(pendingHistoryRef.current);
                pendingHistoryRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStepId]);

    // ========================================
    // Expansão Lazy de Containers
    // ========================================
    const [expandedContainers, setExpandedContainers] = useState<Set<string>>(new Set());
    useEffect(() => {
        try {
            const raw = localStorage.getItem('quiz_editor_expanded_containers_v1');
            if (raw) setExpandedContainers(new Set(JSON.parse(raw)));
        } catch {/* ignore */ }
    }, []);
    const persistExpanded = (next: Set<string>) => {
        try { localStorage.setItem('quiz_editor_expanded_containers_v1', JSON.stringify(Array.from(next))); } catch {/* ignore */ }
    };
    const toggleContainer = useCallback((id: string) => {
        setExpandedContainers(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            persistExpanded(next);
            return next;
        });
    }, []);

    // Componente especializado para quiz-options (isolado para respeitar regras de hooks)
    interface QuizOptionsPreviewProps {
        blockId: string;
        options: any[];
        properties: Record<string, any>;
        selectedStep?: EditableQuizStep;
        selections: string[];
        onToggle: (optionId: string, multi: boolean, required: number) => void;
        advanceStep: (nextStepId: string) => void;
    }
    const QuizOptionsPreview: React.FC<QuizOptionsPreviewProps> = ({ blockId, options, properties, selectedStep, selections, onToggle, advanceStep }) => {
        const multi = properties?.multiSelect ?? false;
        const required = properties?.requiredSelections || (multi ? 1 : 1); // requiredSelections explícito; fallback 1
        const max = properties?.maxSelections || required;
        const showImages = properties?.showImages !== false;
        const autoAdvance = !!properties?.autoAdvance || !!(selectedStep && ['question', 'strategic-question'].includes(selectedStep.type));
        const hasImages = showImages && options.some(o => !!o.image);
        // Layout automático: se auto e tem imagens usar 3col, se >4 opções sem imagem usar 2col, senão 1col
        const layout = properties?.layout || 'auto';
        let gridClass = 'quiz-options-1col';
        if (layout === 'grid-2') gridClass = 'quiz-options-2col';
        else if (layout === 'grid-3') gridClass = 'quiz-options-3col';
        else if (layout === 'auto') {
            if (hasImages) gridClass = 'quiz-options-3col';
            else if (options.length >= 4) gridClass = 'quiz-options-2col';
        }
        // Efeito de auto-avance
        useEffect(() => {
            if (autoAdvance && selections.length === required && required > 0 && selectedStep?.nextStep) {
                const t = setTimeout(() => advanceStep(selectedStep.nextStep!), 800);
                return () => clearTimeout(t);
            }
        }, [autoAdvance, selections.length, required, selectedStep, advanceStep]);
        return (
            <div className="space-y-2">
                <div className={cn('quiz-options', gridClass)}>
                    {options.map(opt => {
                        const active = selections.includes(opt.id);
                        return (
                            <div
                                key={opt.id}
                                role="button"
                                tabIndex={0}
                                onClick={(e) => { e.preventDefault(); onToggle(opt.id, multi, max); }}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(opt.id, multi, max); } }}
                                className={cn('quiz-option transition-all', active && 'quiz-option-selected', !active && 'cursor-pointer')}
                            >
                                {showImages && opt.image && (
                                    <img src={opt.image} alt={opt.text || 'Opção'} className="w-full mb-2 rounded" />
                                )}
                                <p className="quiz-option-text text-xs font-medium leading-snug">{opt.text || 'Opção'}</p>
                            </div>
                        );
                    })}
                </div>
                <div className="text-[10px] text-muted-foreground">
                    {multi ? `${selections.length}/${required} selecionadas` : (selections.length === 1 ? '1 selecionada' : 'Selecione 1')}
                </div>
            </div>
        );
    };

    // Salvar
    const [saveNotice, setSaveNotice] = useState<{ type: 'warning' | 'info'; message: string } | null>(null);
    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            const { steps: filledSteps, adjusted } = autoFillNextSteps(steps);
            if (adjusted) {
                setSteps(prev => {
                    const map = new Map(filledSteps.map(s => [s.id, s.nextStep] as const));
                    const next = prev.map(s => map.has(s.id) ? { ...s, nextStep: map.get(s.id)! } : s);
                    pushHistory(next);
                    return next;
                });
            }
            const funnel = {
                id: funnelId || 'new-draft',
                name: 'Quiz Estilo Pessoal - Modular',
                slug: 'quiz-estilo',
                steps: (adjusted ? filledSteps : steps).map(s => {
                    const reconstructed = convertBlocksToStepUtil(s.id, s.type as any, s.blocks as any);
                    return {
                        id: s.id,
                        order: s.order,
                        ...(reconstructed as any),
                        nextStep: (reconstructed as any).nextStep || s.nextStep,
                        offerMap: (reconstructed as any).offerMap || s.offerMap,
                        blocks: s.blocks
                    };
                }),
                isPublished: false,
                version: 1
            };

            const savedId = await quizEditorBridge.saveDraft(funnel);
            setFunnelId(savedId);
            setIsDirty(false);

            toast({
                title: '✅ Salvo com sucesso',
                description: adjusted ? `Rascunho ${savedId} · nextStep(s) preenchidos automaticamente` : `Rascunho ${savedId}`,
            });
            if (adjusted) {
                setSaveNotice({ type: 'info', message: 'Links de próxima etapa preenchidos automaticamente.' });
            }
        } catch (error: any) {
            const message = String(error || 'Erro desconhecido');
            if (/nextstep/i.test(message)) {
                // aviso discreto
                setSaveNotice({ type: 'warning', message: message.replace(/Error: /i, '') });
            } else {
                toast({
                    title: 'Erro ao salvar',
                    description: message,
                    variant: 'destructive'
                });
            }
        } finally {
            setIsSaving(false);
        }
    }, [steps, funnelId, toast]);

    // Exportar JSON simples (será refinado depois com metadados)
    const handleExport = useCallback(() => {
        const data = JSON.stringify(steps, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'funnel-draft.json'; a.click();
        URL.revokeObjectURL(url);
    }, [steps]);

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
                <LayoutShell
                    panelWidths={panelWidths}
                    Resizer={Resizer as any}
                    navOverlay={navOpen && (
                        <div className="fixed inset-0 z-50 flex">
                            <div className="absolute inset-0 bg-black/40" onClick={() => setNavOpen(false)} />
                            <div className="relative ml-auto h-full w-[420px] bg-white shadow-xl border-l flex flex-col">
                                <div className="p-4 border-b flex items-center justify-between">
                                    <h2 className="text-sm font-semibold">Mapa de Navegação</h2>
                                    <Button variant="ghost" size="sm" onClick={() => setNavOpen(false)}>Fechar</Button>
                                </div>
                                <div className="p-4 overflow-auto flex-1 space-y-4 text-xs">
                                    <div>
                                        <p className="font-medium mb-1">Resumo</p>
                                        <p>{navAnalysis.steps.length} steps · {navAnalysis.issues.length} problemas</p>
                                    </div>
                                    {navAnalysis.issues.length > 0 && (
                                        <div className="space-y-1">
                                            {navAnalysis.issues.map(i => (
                                                <div key={i.stepId + i.type} className={`px-2 py-1 rounded border text-[11px] ${i.severity === 'error' ? 'border-red-300 bg-red-50 text-red-700' : 'border-amber-300 bg-amber-50 text-amber-700'}`}>[{i.severity}] {i.message}</div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        {navAnalysis.steps.map(s => {
                                            const current = steps.find(st => st.id === s.id)!;
                                            return (
                                                <div key={s.id} className="p-2 rounded border bg-slate-50 flex flex-col gap-1">
                                                    <div className="flex items-center justify-between">
                                                        <button onClick={() => { setSelectedStepId(s.id); setNavOpen(false); }} className="text-left font-medium text-[11px] text-slate-800 hover:underline">{s.id}</button>
                                                        {s.autoLinked && <span className="text-[9px] px-1 py-0.5 rounded bg-indigo-100 text-indigo-600" title="Preenchido automaticamente">auto</span>}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-slate-500">→</span>
                                                        <select
                                                            value={current.nextStep || ''}
                                                            onChange={e => {
                                                                const value = e.target.value || undefined;
                                                                setSteps(prev => prev.map(st => st.id === s.id ? { ...st, nextStep: value } : st));
                                                                setIsDirty(true);
                                                            }}
                                                            className="border px-1 py-0.5 text-[11px] rounded bg-white"
                                                        >
                                                            <option value="">(finalizar)</option>
                                                            {steps.filter(t => t.id !== s.id).map(t => (
                                                                <option key={t.id} value={t.id}>{t.id}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-4">
                                        <p className="font-medium mb-1">Relatório texto</p>
                                        <pre className="whitespace-pre-wrap bg-slate-900 text-slate-100 p-2 rounded max-h-52 overflow-auto text-[10px]">{formatNavigationReport(navAnalysis)}</pre>
                                    </div>
                                </div>
                                <div className="p-3 border-t flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => { setNavOpen(false); }}>Fechar</Button>
                                    <Button size="sm" onClick={handleSave} disabled={isSaving}>Salvar Alterações</Button>
                                </div>
                            </div>
                        </div>
                    )}
                    dragOverlay={<DragOverlay>{activeId ? (String(activeId).startsWith('lib:') ? (<div className="px-3 py-2 text-xs rounded-md border bg-white shadow-sm flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" />{(COMPONENT_LIBRARY.find(c => c.type === String(activeId).slice(4))?.label) || 'Novo componente'}</div>) : (<div className="px-3 py-2 text-xs rounded-md border bg-white shadow-sm opacity-80">Bloco</div>)) : null}</DragOverlay>}
                    header={(
                        <div className="flex items-center justify-between px-6 py-3 bg-white border-b">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" onClick={() => setLocation('/quiz-estilo')}>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Voltar
                                </Button>
                                <div className="h-6 w-px bg-border" />
                                <img
                                    src={BRAND_LOGO_URL}
                                    alt="Logo Gisele Galvão"
                                    style={{ height: 36, width: 90, objectFit: 'contain', borderRadius: 8 }}
                                />
                                {saveNotice && (
                                    <div className="text-[10px] px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                                        <span className="font-medium">!</span>
                                        <span className="truncate max-w-[220px]">{saveNotice.message}</span>
                                        <button onClick={() => setSaveNotice(null)} className="ml-1 text-amber-600 hover:text-amber-800">×</button>
                                    </div>
                                )}
                                {isDirty && <Badge variant="outline">Não salvo</Badge>}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => setNavOpen(true)}>Navegação</Button>
                                <Button variant="outline" size="sm" onClick={handleExport}>Exportar</Button>
                                <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving || !isDirty}>{isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Salvar</Button>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="sm" disabled={!canUndo} onClick={handleUndo} className="text-xs px-2">⮪ Undo</Button>
                                    <Button variant="ghost" size="sm" disabled={!canRedo} onClick={handleRedo} className="text-xs px-2">Redo ⮫</Button>
                                </div>
                                <Button size="sm" onClick={handlePublish} disabled={isPublishing}>{isPublishing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}Publicar</Button>
                            </div>
                        </div>
                    )}
                    stepsPanel={(
                        <StepNavigator
                            steps={steps}
                            selectedStepId={selectedStepId}
                            byStep={byStep as any}
                            onSelect={(id) => { setSelectedStepId(id); setSelectedBlockId(''); }}
                            onAddStep={handleAddStep}
                            onMoveStep={handleMoveStep}
                            onDeleteStep={handleDeleteStep}
                            extractStepMeta={(s: any) => ({ id: s.id, type: s.type, blockCount: s.blocks?.length || 0 })}
                        />
                    )}
                    libraryPanel={(
                        <ComponentLibraryPanel
                            components={COMPONENT_LIBRARY as any}
                            selectedStepId={selectedStepId}
                            onAdd={(type) => selectedStepId && addBlockToStep(selectedStepId, type)}
                        />
                    )}
                    canvasPanel={(
                        <CanvasArea
                            activeTab={activeTab}
                            onTabChange={(v) => setActiveTab(v as 'canvas' | 'preview')}
                            steps={steps}
                            selectedStep={selectedStep}
                            headerConfig={headerConfig}
                            liveScores={liveScores}
                            topStyle={topStyle || undefined}
                            BlockRow={BlockRow as any}
                            byBlock={byBlock as any}
                            selectedBlockId={selectedBlockId}
                            isMultiSelected={isMultiSelected}
                            handleBlockClick={handleBlockClick as any}
                            renderBlockPreview={renderBlockPreview as any}
                            removeBlock={removeBlock}
                            setBlockPendingDuplicate={setBlockPendingDuplicate}
                            setTargetStepId={setTargetStepId}
                            setDuplicateModalOpen={setDuplicateModalOpen}
                            computeVirtualWindow={computeVirtualWindow as any}
                            scrollContainerRef={scrollContainerRef}
                            previewNode={<LivePreviewContainer funnelId={funnelId} steps={steps} />}
                            FixedProgressHeader={FixedProgressHeader as any}
                            StyleResultCard={StyleResultCard as any}
                            OfferMap={OfferMap as any}
                        />
                    )}
                    propsPanel={(
                        <PropertiesPanel
                            selectedStep={selectedStep}
                            selectedBlock={selectedBlock}
                            headerConfig={headerConfig}
                            onHeaderConfigChange={(patch) => setHeaderConfig((c: any) => ({ ...c, ...patch }))}
                            clipboard={clipboard}
                            canPaste={!!clipboard && clipboard.length > 0 && !!selectedStep}
                            onPaste={() => selectedStep && pasteBlocks(selectedStep.id)}
                            multiSelectedIds={multiSelectedIds}
                            onDuplicateInline={() => { if (!selectedStep || !selectedBlock) return; const newBlock = { ...selectedBlock, id: `block-${Date.now()}` }; setSteps(prev => prev.map(step => step.id === selectedStep.id ? { ...step, blocks: [...step.blocks, newBlock] } : step)); setIsDirty(true); }}
                            onPrepareDuplicateToAnother={() => { if (!selectedStep || !selectedBlock) return; setBlockPendingDuplicate(selectedBlock); setTargetStepId(selectedStep.id); setDuplicateModalOpen(true); }}
                            onCopyMultiple={() => { if (!selectedStep) return; const blocks = selectedStep.blocks.filter(b => multiSelectedIds.includes(b.id)); copyMultiple(blocks); }}
                            onRemoveMultiple={removeMultiple}
                            onRemoveBlock={() => { if (!selectedStep || !selectedBlock) return; removeBlock(selectedStep.id, selectedBlock.id); }}
                            onSaveAsSnippet={() => { if (!selectedStep) return; const ids = multiSelectedIds.length ? multiSelectedIds : (selectedBlock ? [selectedBlock.id] : []); if (ids.length === 0) return; const blocksToSave = selectedStep.blocks.filter(b => ids.includes(b.id)); const name = prompt('Nome do snippet:', blocksToSave[0]?.type || 'Snippet'); if (!name) return; snippetsManager.create(name, blocksToSave); refreshSnippets(); toast({ title: 'Snippet salvo', description: name }); }}
                            snippets={snippets as any}
                            snippetFilter={snippetFilter}
                            onSnippetFilterChange={setSnippetFilter}
                            onSnippetInsert={(s: any) => { if (!selectedStep) return; setSteps(prev => { const next = prev.map(st => { if (st.id !== selectedStep.id) return st; const baseLen = st.blocks.filter(b => !b.parentId).length; const timestamp = Date.now(); const idMap: Record<string, string> = {}; const cloned = s.blocks.map((b: any, idx: number) => { const newId = `${b.id}-snip-${timestamp}-${idx}`; idMap[b.id] = newId; return { ...b, id: newId }; }).map((b: any) => ({ ...b, parentId: b.parentId ? idMap[b.parentId] : null, order: b.parentId ? b.order : baseLen + b.order })); return { ...st, blocks: [...st.blocks, ...cloned] }; }); pushHistory(next); return next; }); setIsDirty(true); toast({ title: 'Snippet inserido', description: s.name }); }}
                            onSnippetRename={(s: any, newName: string) => { snippetsManager.update(s.id, { name: newName }); refreshSnippets(); }}
                            onSnippetDelete={(s: any) => { snippetsManager.remove(s.id); refreshSnippets(); }}
                            onRefreshSnippets={refreshSnippets}
                            onBlockPatch={(patch) => { if (!selectedBlock || !selectedStep) return; const contentKeys = new Set(Object.keys(selectedBlock.content)); const propPatch: Record<string, any> = {}; const contentPatch: Record<string, any> = {}; Object.entries(patch).forEach(([k, v]) => { if (contentKeys.has(k)) contentPatch[k] = v; else propPatch[k] = v; }); if (Object.keys(propPatch).length) updateBlockProperties(selectedStep.id, selectedBlock.id, propPatch); if (Object.keys(contentPatch).length) updateBlockContent(selectedStep.id, selectedBlock.id, contentPatch); }}
                            isOfferStep={!!(selectedStep && selectedStep.type === 'offer')}
                            OfferMapComponent={OfferMap as any}
                            onOfferMapUpdate={(c: any) => { if (!selectedStep) return; setSteps(prev => prev.map(st => st.id === selectedStep.id ? { ...st, offerMap: c.offerMap } : st)); setIsDirty(true); }}
                            ThemeEditorPanel={ThemeEditorPanel as any}
                            onApplyTheme={(t) => setThemeOverrides(t)}
                        />
                    )}
                    duplicateDialog={(
                        <DuplicateBlockDialog
                            open={duplicateModalOpen}
                            blockType={blockPendingDuplicate?.type}
                            steps={steps.map(s => ({ id: s.id, type: s.type }))}
                            targetStepId={targetStepId}
                            onChangeTarget={setTargetStepId}
                            onCancel={() => { setDuplicateModalOpen(false); setBlockPendingDuplicate(null); }}
                            onConfirm={duplicateBlockToAnotherStep}
                            disabledConfirm={!targetStepId || !blockPendingDuplicate}
                        />
                    )}
                />
            </DndContext>
        </EditorThemeProvider>
    );
};

export default QuizModularProductionEditor;

// =================== LIVE PREVIEW (Embedded Runtime) ===================
// Colocado após export principal para evitar alterar lógica existente.

interface LivePreviewContainerProps {
    funnelId?: string;
    steps: EditableQuizStep[];
}

const LivePreviewContainer: React.FC<LivePreviewContainerProps> = ({ funnelId, steps }) => {
    const [mode, setMode] = React.useState<'production' | 'live'>('live');
    const [debouncedSteps, setDebouncedSteps] = React.useState(steps);
    const debounceRef = React.useRef<number | null>(null);

    // Debounce para não repintar runtime a cada digitação
    React.useEffect(() => {
        if (debounceRef.current) window.clearTimeout(debounceRef.current);
        debounceRef.current = window.setTimeout(() => setDebouncedSteps(steps), 400);
        return () => { if (debounceRef.current) window.clearTimeout(debounceRef.current); };
    }, [steps]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-2 border-b bg-white">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">Preview</span>
                    <div className="flex items-center gap-1">
                        <button
                            className={`text-[11px] px-2 py-1 rounded border ${mode === 'live' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-slate-50'}`}
                            onClick={() => setMode('live')}
                        >Live</button>
                        <button
                            className={`text-[11px] px-2 py-1 rounded border ${mode === 'production' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-slate-50'}`}
                            onClick={() => setMode('production')}
                        >Produção</button>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    {mode === 'live' ? (
                        <>
                            <span>Atualiza em tempo real (400ms debounce)</span>
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </>
                    ) : (
                        <span>Renderizando versão publicada</span>
                    )}
                </div>
            </div>
            <div className="flex-1 overflow-hidden">
                {mode === 'production' ? (
                    <QuizProductionPreview funnelId={funnelId} className="h-full" />
                ) : (
                    <QuizRuntimeRegistryProvider>
                        <LiveRuntimePreview steps={debouncedSteps} funnelId={funnelId} />
                    </QuizRuntimeRegistryProvider>
                )}
            </div>
        </div>
    );
};

interface LiveRuntimePreviewProps {
    steps: EditableQuizStep[];
    funnelId?: string;
}

const LiveRuntimePreview: React.FC<LiveRuntimePreviewProps> = ({ steps, funnelId }) => {
    const { setSteps, version } = useQuizRuntimeRegistry();
    const runtimeMap = React.useMemo(() => editorStepsToRuntimeMap(steps as any), [steps]);
    const mapRef = React.useRef(runtimeMap);

    // Atualizar registry quando mapa muda
    React.useEffect(() => {
        const sameKeys = Object.keys(mapRef.current).join('|') === Object.keys(runtimeMap).join('|');
        mapRef.current = runtimeMap;
        setSteps(runtimeMap);
        if (!sameKeys) {
            console.log('🔁 Live preview registry atualizado', Object.keys(runtimeMap).length, 'steps');
        }
    }, [runtimeMap, setSteps]);

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="flex-1 overflow-auto">
                <QuizAppConnected funnelId={funnelId} editorMode />
            </div>
            <div className="px-2 py-1 border-t bg-slate-50 text-[10px] text-slate-500 flex items-center justify-between">
                <span>Live Runtime v{version}</span>
                <span>{Object.keys(runtimeMap).length} steps</span>
            </div>
        </div>
    );
};
