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


console.log('📦 QuizModularProductionEditor: Module loading...');

import React, { useState, useCallback, useEffect, useMemo, Suspense, useRef } from 'react';
import '@/styles/globals.css'; // garante estilos de produção (quiz-option*, quiz-options-*)
import { useLocation } from 'wouter';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors, useDraggable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Logo corporativa (centralizada em um único ponto) - reutilizada em cabeçalhos
const BRAND_LOGO_URL = 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_120,h_50,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png';
// Placeholder inline para imagens (evita URLs externas quebradas)
const INLINE_IMG_PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="100%" height="100%" fill="%23E5E7EB"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239CA3AF" font-size="14">Imagem</text></svg>';
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
import { snippetsManager, BlockSnippet as ExternalBlockSnippet } from '@/utils/snippetsManager';
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
import { useEditor } from '@/components/editor/EditorProviderUnified';
import { BlockComponent as EditorBlockComponent, EditableQuizStep as EditorEditableQuizStep, ComponentLibraryItem } from './types';
import { buildFashionStyle21Steps } from '@/templates/fashionStyle21PtBR';
import { QUIZ_STYLE_21_STEPS_TEMPLATE, getPersonalizedStepTemplate } from '@/templates/quiz21StepsComplete';
import { QuizTemplateAdapter } from '@/core/migration/QuizTemplateAdapter';
import { safeGetTemplateBlocks } from '@/utils/templateConverter';
import type { StepType } from '@/types/quiz-schema';
import { useSelectionClipboard } from './hooks/useSelectionClipboard';
import { useVirtualBlocks } from './hooks/useVirtualBlocks';
import StepNavigator from './components/StepNavigator';
import ComponentLibraryPanel from './components/ComponentLibraryPanel';
import { BuilderSystemPanel } from '@/components/editor/BuilderSystemPanel';
// Dados canônicos das etapas (lazy loading para performance)
import { loadQuizStep, loadAllQuizSteps, STEP_ORDER, preloadAdjacentSteps } from '@/data/quizStepsLazy';
import type { QuizStep } from '@/data/quizSteps';
import CanvasArea from './components/CanvasArea';
import BlockRow from './components/BlockRow';
import { BlockComponent, EditableQuizStep, BlockSnippet } from './types';
import PropertiesPanel from './components/PropertiesPanel';
import DuplicateBlockDialog from './components/DuplicateBlockDialog';
// Cálculo real de resultado (produção)
import { computeResult } from '@/utils/result/computeResult';
import type { QuizFunnelSchema } from '@/types/quiz-schema';
import { StorageService } from '@/services/core/StorageService';

// Pré-visualizações especializadas (lazy) dos componentes finais de produção
const StyleResultCard = React.lazy(() => import('@/components/editor/quiz/components/StyleResultCard').then(m => ({ default: m.StyleResultCard })));
const OfferMap = React.lazy(() => import('@/components/editor/quiz/components/OfferMap').then(m => ({ default: m.OfferMap })));

// Tipos centrais importados de ./types (removidas definições locais duplicadas)

// Import da biblioteca de componentes do registry
import { AVAILABLE_COMPONENTS } from '@/components/editor/blocks/EnhancedBlockRegistry';
// Import direto da função para evitar uso de require() no ambiente ESM do browser
import { getEnhancedBlockComponent } from '@/components/editor/blocks/EnhancedBlockRegistry';

/**
 * Mapeia categorias para ícones React
 */
const getCategoryIcon = (category: string): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
        layout: <Layout className="w-4 h-4" />,
        content: <Type className="w-4 h-4" />,
        visual: <ImageIcon className="w-4 h-4" />,
        quiz: <List className="w-4 h-4" />,
        forms: <Type className="w-4 h-4" />,
        action: <MousePointer className="w-4 h-4" />,
        result: <CheckCircle className="w-4 h-4" />,
        offer: <ArrowRightCircle className="w-4 h-4" />,
        navigation: <Layout className="w-4 h-4" />,
        ai: <Settings className="w-4 h-4" />,
        advanced: <Settings className="w-4 h-4" />,
    };
    return iconMap[category] || <Layout className="w-4 h-4" />;
};

/**
 * Converte AVAILABLE_COMPONENTS do registry para o formato ComponentLibraryItem do editor
 */
const COMPONENT_LIBRARY: ComponentLibraryItem[] = AVAILABLE_COMPONENTS.map(comp => ({
    type: comp.type,
    label: comp.label,
    icon: getCategoryIcon(comp.category),
    category: comp.category as ComponentLibraryItem['category'],
    defaultProps: {
        // Props padrão baseados no tipo
        ...(comp.type.includes('text') && {
            text: comp.label,
            fontSize: '16px',
            color: '#432818',
            textAlign: 'left'
        }),
        ...(comp.type.includes('heading') && {
            text: comp.label,
            level: 2,
            fontSize: '24px',
            color: '#432818',
            textAlign: 'center'
        }),
        ...(comp.type.includes('button') && {
            text: 'Continuar',
            backgroundColor: '#B89B7A',
            textColor: '#FFFFFF',
            action: 'next-step'
        }),
        ...(comp.type.includes('image') && {
            src: INLINE_IMG_PLACEHOLDER,
            alt: 'Imagem',
            width: '100%',
            borderRadius: '8px'
        }),
        ...(comp.type.includes('container') && {
            backgroundColor: '#F8F9FA',
            padding: '16px',
            borderRadius: '8px'
        }),
        ...(comp.type.includes('form-input') && {
            label: 'Campo',
            placeholder: 'Digite aqui...',
            required: true
        }),
        ...(comp.type === 'quiz-options' && {
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
        }),
        ...(comp.type === 'progress-header' && {
            showLogo: true,
            logoUrl: BRAND_LOGO_URL,
            logoWidth: '120px',
            progressEnabled: true,
            progressPercent: 0,
            autoProgress: true,
            barHeight: '4px',
            // Usar cor em formato #rrggbb (sem canal alpha) para compatibilidade com inputs type="color"
            barColor: '#b3a26a',
            barBackground: '#E5E7EB'
        }),
    }
}));

// ⚠️ LEGACY COMPONENT_LIBRARY (mantido comentado para referência)
// Foi substituído pela versão dinâmica acima que usa o registry
const COMPONENT_LIBRARY_LEGACY: ComponentLibraryItem[] = [
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
            src: INLINE_IMG_PLACEHOLDER,
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
            barColor: '#b3a26a',
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
    console.log('✅ QuizModularProductionEditor: Component rendering', { initialFunnelId });

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
    // selectedBlockId agora fornecido pelo useSelectionClipboard (ou pelo EditorProviderUnified se disponível)

    // Editor unified provider (opcional durante migração)
    const editorCtx = useEditor({ optional: true } as any);

    const stepIdFromNumber = useCallback((n: number) => `step-${String(n).padStart(2, '0')}`, []);
    const stepNumberFromId = useCallback((id: string) => {
        const m = id?.match(/step-(\d+)/);
        return m ? parseInt(m[1], 10) : NaN;
    }, []);

    // Quando o provider está presente, sincronizar o estado local com o provider (somente leitura → local)
    const effectiveSelectedStepId = useMemo(() => {
        if (editorCtx?.state?.currentStep) {
            return stepIdFromNumber(editorCtx.state.currentStep);
        }
        return selectedStepId;
    }, [editorCtx?.state?.currentStep, selectedStepId, stepIdFromNumber]);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    // Config unificada para consumo no preview
    const [unifiedConfig, setUnifiedConfig] = useState<{
        runtime?: QuizFunnelSchema['runtime'];
        results?: QuizFunnelSchema['results'];
        ui?: QuizFunnelSchema['ui'];
        settings?: QuizFunnelSchema['settings'];
    } | null>(null);
    // Theme overrides carregados do localStorage e aplicados via EditorThemeProvider
    const [themeOverrides, setThemeOverrides] = useState<Partial<DesignTokens>>({});
    // Configuração global de cabeçalho (logo + progresso) fixo
    const [headerConfig, setHeaderConfig] = useState(() => {
        try {
            const raw = StorageService.safeGetString('quiz_editor_header_config_v1');
            if (raw) return JSON.parse(raw);
        } catch {/* ignore */ }
        return {
            showLogo: true,
            logoUrl: BRAND_LOGO_URL,
            logoWidth: '140px',
            progressEnabled: true,
            autoProgress: true,
            manualPercent: 0,
            barHeight: '4px',
            // Usar cor em formato #rrggbb (sem canal alpha) para compatibilidade com inputs type="color"
            barColor: '#ccaa6a',
            barBackground: '#E5E7EB',
            align: 'left', // 'left' | 'center' | 'right'
            title: ''
        };
    });
    useEffect(() => { try { StorageService.safeSetJSON('quiz_editor_header_config_v1', headerConfig); } catch {/* ignore */ } }, [headerConfig]);

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
        const justify = config.align === 'center' ? 'justify-center' : config.align === 'right' ? 'justify-end' : 'justify-between';
        return (
            <div className={cn('w-full flex items-center gap-4', justify)}>
                <div className={cn('flex items-center gap-4', config.align === 'center' && 'justify-center', config.align === 'right' && 'justify-end')}>
                    {config.showLogo && (
                        <div className="shrink-0" style={{ maxWidth: config.logoWidth }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={config.logoUrl} alt="Logo" className="object-contain max-h-12" />
                        </div>
                    )}
                    {config.title && (
                        <div className={cn('text-sm font-semibold text-slate-800', config.align === 'center' && 'text-center')}>
                            {config.title}
                        </div>
                    )}
                </div>
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
            const raw = StorageService.safeGetString('quiz_editor_theme_overrides_v1');
            if (raw) setThemeOverrides(JSON.parse(raw));
        } catch {/* ignore */ }
    }, []);
    const [isLoading, setIsLoading] = useState(true);
    // Evita loop infinito de carregamento: finaliza o loading após mount
    useEffect(() => {
        // Carregamento inicial: se houver ?template=, construir steps default
        console.log('🎯 EDITOR: useEffect inicial disparado');
        try {
            const sp = new URLSearchParams(typeof window !== 'undefined' && window.location ? window.location.search : '');
            const templateId = sp.get('template');
            const funnelParam = sp.get('funnel') || undefined;
            console.log('🔍 PARAMETROS:', { templateId, funnelParam, stepsExistentes: steps?.length || 0 });

            // 0) Se vier um funnelId, tentar carregar rascunho existente primeiro
            if (funnelParam && !steps?.length) {
                (async () => {
                    try {
                        const draft = await quizEditorBridge.loadFunnelForEdit(funnelParam);
                        if (draft && Array.isArray(draft.steps) && draft.steps.length > 0) {
                            const validSteps = draft.steps.map((step: any) => ({
                                ...step,
                                blocks: Array.isArray(step.blocks) ? step.blocks : []
                            }));
                            setSteps(validSteps as any);
                            setSelectedStepIdUnified(draft.steps[0]?.id || '');
                            setFunnelId(draft.id || funnelParam);
                            const { runtime, results, ui, settings } = (draft as any);
                            setUnifiedConfig({ runtime, results, ui, settings });
                            setIsLoading(false);
                            return; // sucesso – não continuar fallback
                        } else {
                            // ✅ FASE 4: FALLBACK - Funnel não encontrado, carregar template padrão
                            console.warn(`⚠️ Funnel ${funnelParam} não encontrado ou vazio, carregando template padrão quiz21StepsComplete`);
                            throw new Error('Funnel not found, using template fallback');
                        }
                    } catch (e) {
                        console.warn('🔄 Falha ao carregar funnel, usando template quiz21StepsComplete como fallback', e);

                        // Forçar carregamento do template como fallback
                        const initial: EditorEditableQuizStep[] = Array.from({ length: 21 }).map((_, idx) => {
                            const stepNumber = idx + 1;
                            const stepId = `step-${stepNumber.toString().padStart(2, '0')}`;
                            const blocks = safeGetTemplateBlocks(stepId, QUIZ_STYLE_21_STEPS_TEMPLATE, funnelParam);

                            // Determinar tipo de step baseado no índice (mesmo padrão usado abaixo)
                            const getStepType = (index: number): 'intro' | 'question' | 'strategic-question' | 'transition' | 'transition-result' | 'result' | 'offer' => {
                                if (index === 0) return 'intro';
                                if (index >= 1 && index <= 10) return 'question';
                                if (index === 11) return 'transition';
                                if (index >= 12 && index <= 17) return 'strategic-question';
                                if (index === 18) return 'transition-result';
                                if (index === 19) return 'result';
                                return 'offer'; // index === 20
                            };

                            return {
                                id: stepId,
                                type: getStepType(idx),
                                order: stepNumber,
                                blocks,
                                nextStep: stepNumber < 21 ? `step-${(stepNumber + 1).toString().padStart(2, '0')}` : undefined
                            };
                        });

                        console.log(`✅ Template fallback carregado: ${initial.length} steps, ${initial.reduce((sum, s) => sum + s.blocks.length, 0)} blocos totais`);
                        setSteps(initial);
                        setSelectedStepIdUnified(initial[0]?.id || '');
                        setIsLoading(false);
                    }
                })();
            }
            if (templateId) {
                if (!steps || steps.length === 0) {
                    if (templateId === 'fashionStyle21PtBR') {
                        const initial = buildFashionStyle21Steps(funnelParam);
                        setSteps(initial);
                        setSelectedStepIdUnified(initial[0]?.id || '');
                        setFunnelId(funnelParam || `funnel-${templateId}-${Date.now()}`);
                        setIsLoading(false);
                    } else if (templateId === 'quiz21StepsComplete' || templateId === 'quiz-estilo-21-steps') {
                        // 🎯 Suporte para ambos os IDs de template
                        // NOTA: QuizTemplateAdapter.loadLegacyTemplate() retorna null - usando fallback legacy diretamente
                        console.log('🎯 Carregando template legacy diretamente:', templateId);
                        const buildStepType = (idx: number): EditableQuizStep['type'] => {
                            if (idx === 0) return 'intro';
                            if (idx >= 1 && idx <= 10) return 'question';
                            if (idx === 11) return 'transition';
                            if (idx >= 12 && idx <= 17) return 'strategic-question';
                            if (idx === 18) return 'transition-result';
                            if (idx === 19) return 'result';
                            return 'offer'; // idx === 20
                        };

                        // ==========================
                        // 🔄 NOVO: Construção enriquecida baseada em QUIZ_STEPS (substitui apenas se dados canônicos disponíveis)
                        // ==========================
                        const buildEnrichedBlocksForStep = (stepId: string, quizStep: any): any[] => {
                            const blocks: any[] = [];
                            let order = 0;
                            const push = (partial: Partial<EditorBlockComponent> & { type: string }) => {
                                blocks.push({
                                    id: `${stepId}-${partial.type}-${blocks.length + 1}`,
                                    type: partial.type,
                                    order: order++,
                                    parentId: null,
                                    content: partial.content || {},
                                    properties: partial.properties || {}
                                });
                            };
                            switch (quizStep.type) {
                                case 'intro': {
                                    if (quizStep.title) {
                                        push({
                                            type: 'heading',
                                            content: { text: quizStep.title },
                                            properties: { level: 2, allowHtml: true, textAlign: 'center' }
                                        });
                                    }
                                    if (quizStep.image) {
                                        push({
                                            type: 'image',
                                            content: { src: quizStep.image, alt: 'Intro' },
                                            properties: { width: '100%', borderRadius: '12px' }
                                        });
                                    }
                                    if (quizStep.formQuestion) {
                                        push({
                                            type: 'form-input',
                                            content: { label: quizStep.formQuestion, placeholder: quizStep.placeholder || '' },
                                            properties: { required: true }
                                        });
                                    }
                                    push({
                                        type: 'button',
                                        content: { text: quizStep.buttonText || 'Continuar' },
                                        properties: { action: 'next-step' }
                                    });
                                    break;
                                }
                                case 'question': {
                                    if (quizStep.questionText) {
                                        push({
                                            type: 'heading',
                                            content: { text: quizStep.questionText },
                                            properties: { level: 3, allowHtml: false, textAlign: 'center' }
                                        });
                                    }
                                    push({
                                        type: 'quiz-options',
                                        content: { options: quizStep.options || [] },
                                        properties: {
                                            question: quizStep.questionText,
                                            questionNumber: quizStep.questionNumber,
                                            multiSelect: true,
                                            requiredSelections: quizStep.requiredSelections || 1,
                                            maxSelections: quizStep.requiredSelections || 3,
                                            autoAdvance: true
                                        }
                                    });
                                    break;
                                }
                                case 'strategic-question': {
                                    if (quizStep.questionText) {
                                        push({
                                            type: 'heading',
                                            content: { text: quizStep.questionText },
                                            properties: { level: 3, textAlign: 'center' }
                                        });
                                    }
                                    push({
                                        type: 'quiz-options',
                                        content: { options: quizStep.options || [] },
                                        properties: {
                                            question: quizStep.questionText,
                                            multiSelect: false,
                                            requiredSelections: 1,
                                            maxSelections: 1,
                                            autoAdvance: true
                                        }
                                    });
                                    break;
                                }
                                case 'transition':
                                case 'transition-result': {
                                    if (quizStep.title) {
                                        push({
                                            type: 'heading',
                                            content: { text: quizStep.title },
                                            properties: { level: 2, allowHtml: true, textAlign: 'center' }
                                        });
                                    }
                                    if (quizStep.text) {
                                        push({
                                            type: 'text',
                                            content: { text: quizStep.text },
                                            properties: { textAlign: 'center' }
                                        });
                                    }
                                    if (quizStep.showContinueButton) {
                                        push({
                                            type: 'button',
                                            content: { text: quizStep.continueButtonText || 'Continuar' },
                                            properties: { action: 'next-step' }
                                        });
                                    }
                                    break;
                                }
                                case 'result': {
                                    push({
                                        type: 'result-header-inline',
                                        content: { title: quizStep.title || 'Seu Resultado:' },
                                        properties: {}
                                    });
                                    break;
                                }
                                case 'offer': {
                                    if (quizStep.image) {
                                        push({
                                            type: 'image',
                                            content: { src: quizStep.image, alt: 'Oferta' },
                                            properties: { width: '100%', borderRadius: '12px' }
                                        });
                                    }
                                    // Um bloco CTA genérico usando a primeira oferta do mapa como preview
                                    const firstOffer = quizStep.offerMap ? Object.values(quizStep.offerMap)[0] as any : null;
                                    push({
                                        type: 'quiz-offer-cta-inline',
                                        content: {
                                            title: (firstOffer?.title as string) || 'Oferta Especial',
                                            description: (firstOffer?.description as string) || 'Conteúdo exclusivo liberado',
                                            buttonText: (firstOffer?.buttonText as string) || 'Quero Aproveitar',
                                            offerKey: firstOffer ? Object.keys(quizStep.offerMap)[0] : undefined
                                        },
                                        properties: {}
                                    });
                                    break;
                                }
                                default: {
                                    // fallback genérico preservando blocks antigos se existirem
                                    const legacyBlocks = safeGetTemplateBlocks(stepId, QUIZ_STYLE_21_STEPS_TEMPLATE, funnelParam) || [];
                                    return legacyBlocks;
                                }
                            }
                            return blocks;
                        };

                        // 🚀 ASYNC: Carregar steps de forma lazy e assíncrona
                        (async () => {
                            try {
                                console.time('⚡ Lazy load all steps');
                                const stepsMap = await loadAllQuizSteps();
                                console.timeEnd('⚡ Lazy load all steps');

                                const enriched: EditableQuizStep[] = STEP_ORDER.map((stepId, idx) => {
                                    const quizStep = stepsMap.get(stepId);
                                    const legacyType = buildStepType(idx);
                                    const next = quizStep?.nextStep || (idx < STEP_ORDER.length - 1 ? STEP_ORDER[idx + 1] : undefined);
                                    let blocks: any[] = [];
                                    try {
                                        if (quizStep) {
                                            blocks = buildEnrichedBlocksForStep(stepId, quizStep);
                                        } else {
                                            blocks = safeGetTemplateBlocks(stepId, QUIZ_STYLE_21_STEPS_TEMPLATE, funnelParam) || [];
                                        }
                                    } catch (e) {
                                        console.warn('⚠️ Falha ao construir blocks enriquecidos para', stepId, e);
                                        blocks = safeGetTemplateBlocks(stepId, QUIZ_STYLE_21_STEPS_TEMPLATE, funnelParam) || [];
                                    }
                                    return {
                                        id: stepId,
                                        type: quizStep?.type || legacyType,
                                        order: idx + 1,
                                        blocks,
                                        nextStep: next,
                                        // Metadados completos do quizStep para futura edição detalhada
                                        meta: quizStep
                                    } as EditableQuizStep;
                                });

                                setSteps(enriched);
                                setSelectedStepIdUnified(enriched[0]?.id || '');
                                setFunnelId(funnelParam || `funnel-${templateId}-${Date.now()}`);
                                setIsLoading(false);
                                console.log('✅ Fallback enriquecido concluído! Total de steps:', enriched.length);
                            } catch (err) {
                                console.error('❌ Erro ao carregar steps lazy:', err);
                                setIsLoading(false);
                            }
                        })();
                    }
                }
            }
        } catch (err) {
            console.error('❌ Erro no useEffect:', err);
        }
        // Se não houver parâmetros de template ou funnel e ainda não carregamos steps,
        // finalize o loading para permitir que o fallback vazio seja exibido em /editor
        try {
            const sp = new URLSearchParams(typeof window !== 'undefined' && window.location ? window.location.search : '');
            const templateId = sp.get('template');
            const funnelParam = sp.get('funnel');
            const noParams = !templateId && !funnelParam;
            const noSteps = !steps || steps.length === 0;
            if (noParams && noSteps) {
                console.warn('⚠️ Nenhum template/funnel informado. Encerrando loading e exibindo fallback vazio.');
                setIsLoading(false);
            }
        } catch {/* ignore */ }
        console.log('🏁 Finalizando useEffect (loading avaliado)');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ✅ FASE 3: FALLBACK Empty State - Mostrar mensagem se nenhum step foi carregado
    useEffect(() => {
        if (!isLoading && (!steps || steps.length === 0)) {
            console.error('❌ EDITOR VAZIO: Nenhuma etapa carregada após useEffect inicial!');
            console.log('📊 Debug info:', {
                hasSteps: !!steps,
                stepsLength: steps?.length,
                isLoading,
                url: typeof window !== 'undefined' ? window.location.href : 'N/A'
            });

            // Criar etapa vazia padrão para não deixar editor completamente vazio
            const fallbackStep: EditableQuizStep = {
                id: 'step-01',
                type: 'intro',
                order: 1,
                blocks: [{
                    id: 'block-welcome',
                    type: 'heading',
                    content: { text: '⚠️ Template não carregado' },
                    properties: {
                        level: 2,
                        fontSize: '24px',
                        color: '#432818',
                        textAlign: 'center'
                    },
                    order: 0,
                    parentId: null
                }, {
                    id: 'block-instructions',
                    type: 'text',
                    content: { text: 'Adicione componentes usando a biblioteca à direita →' },
                    properties: {
                        fontSize: '16px',
                        color: '#6B7280',
                        textAlign: 'center'
                    },
                    order: 1,
                    parentId: null
                }],
                nextStep: undefined
            };

            setSteps([fallbackStep]);
            setSelectedStepIdUnified('step-01');
            console.log('✅ Fallback step criado para evitar editor vazio');
        }
    }, [isLoading, steps]);

    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    // Undo/Redo via hook
    const { canUndo, canRedo, init: initHistory, push: pushHistory, undo, redo } = useEditorHistory<EditableQuizStep[]>();
    const applyHistorySnapshot = (snap: EditableQuizStep[] | null) => {
        if (!snap) return;
        setSteps(snap);
        setIsDirty(true);
    };

    // Memo estável para passar ao PropertiesPanel sem violar as regras de hooks
    const currentRuntimeScoringMemo = useMemo(() => {
        const scoring = (unifiedConfig as any)?.runtime?.scoring;
        if (!scoring) return null;
        return { tieBreak: scoring.tieBreak, weights: scoring.weights } as any;
    }, [unifiedConfig]);

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
        onSelectStep: (id: string) => {
            setSelectedStepIdUnified(id);
            if (editorCtx?.actions?.setCurrentStep) {
                const n = stepNumberFromId(id);
                if (!isNaN(n)) editorCtx.actions.setCurrentStep(n);
            }
        }
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
        getSelectedStepId: () => effectiveSelectedStepId
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
    const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
    const [blockPendingDuplicate, setBlockPendingDuplicate] = useState<BlockComponent | null>(null);
    const [targetStepId, setTargetStepId] = useState<string>('');
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );
    const [snippets, setSnippets] = useState<BlockSnippet[]>([]);
    const [snippetFilter, setSnippetFilter] = useState('');
    const refreshSnippets = () => setSnippets(snippetsManager.list());
    useEffect(() => { refreshSnippets(); }, []);

    // Step selecionado
    const selectedStep = useMemo(() =>
        steps.find(s => s.id === (editorCtx ? effectiveSelectedStepId : selectedStepId)),
        [steps, effectiveSelectedStepId, selectedStepId, editorCtx]
    );

    const setSelectedStepIdUnified = useCallback((id: string) => {
        setSelectedStepId(id);
        if (editorCtx?.actions?.setCurrentStep) {
            const n = stepNumberFromId(id);
            if (!isNaN(n)) editorCtx.actions.setCurrentStep(n);
        }
        // 🚀 Pré-carregar steps adjacentes para melhorar UX
        preloadAdjacentSteps(id, 2);
    }, [setSelectedStepId, editorCtx, stepNumberFromId]);

    // Hook de seleção / clipboard deve vir antes de dependências que usam selectedBlockId
    const selectionApi = useSelectionClipboard({
        steps,
        selectedStepId: editorCtx ? effectiveSelectedStepId : selectedStepId,
        setSteps,
        pushHistory,
        onDirty: () => setIsDirty(true)
    });
    const { multiSelectedIds, clipboard, copy: copyGeneric, paste: pasteGeneric, removeSelected: removeMultiple, isMultiSelected, handleBlockClick, selectedBlockId, setSelectedBlockId } = selectionApi;

    // Unificar seleção de bloco com o provider quando disponível
    const effectiveSelectedBlockId = editorCtx?.state?.selectedBlockId ?? selectedBlockId;
    const setSelectedBlockIdUnified = useCallback((id: string) => {
        setSelectedBlockId(id);
        if (editorCtx?.actions?.setSelectedBlockId) {
            editorCtx.actions.setSelectedBlockId(id || null);
        }
    }, [setSelectedBlockId, editorCtx]);

    // Bloco selecionado (usa selectedBlockId efetivo considerando provider)
    const selectedBlock = useMemo(() => selectedStep?.blocks.find(b => b.id === effectiveSelectedBlockId), [selectedStep, effectiveSelectedBlockId]);

    // Sincronizar seleção local -> provider (quando provider estiver disponível)
    useEffect(() => {
        if (!editorCtx?.actions?.setSelectedBlockId) return;
        const providerId = editorCtx?.state?.selectedBlockId ?? null;
        const localId = selectedBlockId || null;
        if (providerId !== localId) {
            editorCtx.actions.setSelectedBlockId(localId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBlockId]);

    // Ao trocar de etapa, se o bloco selecionado não pertencer à etapa atual, limpar seleção
    useEffect(() => {
        if (!selectedStep) return;
        if (!effectiveSelectedBlockId) return;
        const existsInStep = selectedStep.blocks?.some(b => b.id === effectiveSelectedBlockId);
        if (!existsInStep) {
            setSelectedBlockIdUnified('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [effectiveSelectedStepId]);

    // Persistência de seleção por etapa agora tratada no hook

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
        if (effectiveSelectedBlockId === blockId) setSelectedBlockIdUnified('');
    }, [removeBlockHook, effectiveSelectedBlockId, setSelectedBlockIdUnified]);

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
        const sourceStepId = blockDup.parentId ? blockDup.parentId : (editorCtx ? (effectiveSelectedStepId || '') : (selectedStepId || ''));
        duplicateBlockHook(sourceStepId, blockDup.id, target);
        setDuplicateModalOpen(false);
        setBlockPendingDuplicate(null);
        setTargetStepId('');
        toastRef.current({ title: 'Bloco duplicado', description: `Copiado para ${target}` });
    }, [duplicateBlockHook, selectedStepId, editorCtx, effectiveSelectedStepId]);

    const copyBlock = useCallback((block: BlockComponent) => copyGeneric([block.id]), [copyGeneric]);
    const copyMultiple = useCallback((blocks: BlockComponent[]) => { copyGeneric(blocks.map(b => b.id)); toastRef.current({ title: 'Copiado', description: `${blocks.length} bloco(s) copiado(s)` }); }, [copyGeneric]);
    const pasteBlocks = useCallback((stepId: string) => pasteGeneric(stepId), [pasteGeneric]);

    // Atualizar propriedades do bloco
    const updateBlockProperties = useCallback((stepId: string, blockId: string, updates: Record<string, any>) => {
        updateBlock(stepId, blockId, { properties: updates });
    }, [updateBlock]);

    // Atualizar conteúdo do bloco
    const updateBlockContent = useCallback((stepId: string, blockId: string, updates: Record<string, any>) => {
        updateBlock(stepId, blockId, { content: updates });
    }, [updateBlock]);

    // Debounce de histórico removido.
    const scheduleHistoryPush = (next: EditableQuizStep[]) => { pushHistory(next); };


    // Multi seleção & remoção agora via selectionApi


    // Reordenar / mover blocos (nested)
    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        const curStepId = editorCtx ? effectiveSelectedStepId : selectedStepId;
        if (!curStepId) { setActiveId(null); return; }
        if (!over) { setActiveId(null); setHoverContainerId(null); return; }
        const droppedAtEnd = over.id === 'canvas-end';
        const targetContainerId = !droppedAtEnd && String(over.id).startsWith('container-slot:') ? String(over.id).slice('container-slot:'.length) : null;
        // Novo bloco da paleta
        if (String(active.id).startsWith('lib:')) {
            const componentType = String(active.id).slice(4);
            addBlockToStep(curStepId, componentType);
            setActiveId(null); setHoverContainerId(null); return;
        }
        if (active.id === over.id && !targetContainerId && !droppedAtEnd) { setActiveId(null); setHoverContainerId(null); return; }
        // Reordenação / movimento
        const overId = String(over.id).startsWith('container-slot:') ? null : over.id;
        reorderOrMove(curStepId, active.id, targetContainerId, overId);
        setActiveId(null); setHoverContainerId(null);
    };

    const handleUndo = () => applyHistorySnapshot(undo());
    const handleRedo = () => applyHistorySnapshot(redo());

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const meta = e.metaKey || e.ctrlKey;
            const target = e.target as HTMLElement | null;
            const isTyping = !!target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target as any).isContentEditable);

            // Undo/Redo
            if (meta && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                if (e.shiftKey) handleRedo(); else handleUndo();
                return;
            }
            if (meta && e.key.toLowerCase() === 'y') {
                e.preventDefault();
                handleRedo();
                return;
            }

            // Remoção rápida: Delete/Backspace (fora de campos de texto)
            if (!isTyping && (e.key === 'Delete' || e.key === 'Backspace')) {
                // Se houver multi-seleção, remove múltiplos; senão remove bloco selecionado
                if (multiSelectedIds.length > 0) {
                    e.preventDefault();
                    removeMultiple();
                    return;
                }
                if (selectedStep && effectiveSelectedBlockId) {
                    e.preventDefault();
                    removeBlock(selectedStep.id, effectiveSelectedBlockId);
                    return;
                }
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [handleUndo, handleRedo, multiSelectedIds, selectedStep, effectiveSelectedBlockId, removeMultiple, removeBlock]);

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

    // Flags de preview: ler do documento unificado quando disponível (fallback: defaults)
    const previewRuntimeFlags = useMemo(() => {
        // Tentar obter runtime do adapter (caso já tenha sido carregado no mount)
        // Observação: convertLegacyTemplate é assíncrono; como fallback usamos defaults.
        // Em execuções subsequentes, poderemos armazenar em localStorage/session ou contexto.
        const defaults = { enableAutoAdvance: true, autoAdvanceDelayMs: 800 };
        try {
            // Usar somente unifiedConfig (sem globais)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rt = (unifiedConfig?.runtime as any) as { navigation?: { autoAdvance?: { enable?: boolean; delayMs?: number } } } | undefined;
            const enable = rt?.navigation?.autoAdvance?.enable;
            const delay = rt?.navigation?.autoAdvance?.delayMs;
            return {
                enableAutoAdvance: typeof enable === 'boolean' ? enable : defaults.enableAutoAdvance,
                autoAdvanceDelayMs: typeof delay === 'number' ? delay : defaults.autoAdvanceDelayMs,
            };
        } catch {
            return defaults;
        }
    }, [unifiedConfig]);

    // Converte seleções locais (por bloco) em respostas por etapa, compatíveis com o runtime de produção
    const previewAnswers = useMemo<Record<string, string[]>>(() => {
        const map: Record<string, string[]> = {};
        steps.forEach(step => {
            // Considera apenas blocos de pergunta (quiz-options)
            const qBlocks = step.blocks.filter(b => b.type === 'quiz-options');
            const selections: string[] = [];
            qBlocks.forEach(b => {
                const sel = quizSelections[b.id] || [];
                // Cada seleção representa um estilo/opção
                sel.forEach(s => selections.push(s));
            });
            if (selections.length > 0) {
                map[step.id] = selections;
            }
        });
        return map;
    }, [steps, quizSelections]);

    // Cálculo de resultado real (usa computeResult da produção)
    const previewResult = useMemo(() => {
        try {
            const scoring = (unifiedConfig?.runtime as any)?.scoring;
            return computeResult({ answers: previewAnswers, scoring });
        } catch {
            return null;
        }
    }, [previewAnswers, unifiedConfig]);

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

    const renderBlockPreview = (block: EditorBlockComponent, all: EditorBlockComponent[]) => {
        const { type, content, properties, id } = block;
        const children = getChildren(all, id);
        // Construir hash de dependências (alterações de dados relevantes invalidam cache)
        const expanded = type === 'container' ? (expandedContainers ? expandedContainers.has(id) : false) : false; // guarda defensiva
        const childIds = type === 'container' ? children.map(c => c.id).join(',') : '';
        const dynamicContextHash = JSON.stringify({ liveScores, selections: quizSelections[id], currentStep: editorCtx ? effectiveSelectedStepId : selectedStepId }); // inclui seleções e etapa atual
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
        // Dados unificados via estado local
        const stylesMap: Record<string, any> = (unifiedConfig?.results?.styles as any) || {};
        const offersMap: Record<string, any> = (unifiedConfig?.results?.offersMap as any) || {};
        const primaryId = previewResult?.primaryStyleId;
        const primaryTitle = primaryId && stylesMap[primaryId]?.title ? stylesMap[primaryId].title : (primaryId || 'classico');
        // Contexto provisório para placeholders (será expandido com scoring dinâmico e dados reais do usuário)
        const placeholderContext = {
            userName: 'Preview',
            resultStyle: primaryTitle,
            scores: previewResult?.scores || { classico: 0, natural: 0, romantico: 0 }
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
            node = <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{replacePlaceholders(content.text || properties?.text || 'Texto', placeholderContext)}</p>;
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Image
        if (type === 'image') {
            const align = properties?.alignment || 'center';
            const justify = align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center';
            const width = properties?.width || content.width;
            const height = properties?.height || content.height;
            const borderRadius = properties?.borderRadius || content.borderRadius || '8px';
            node = (
                <div className={cn('w-full flex', justify)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={content.src || properties?.src || INLINE_IMG_PLACEHOLDER}
                        alt={content.alt || properties?.alt || 'Imagem'}
                        className="border shadow-sm"
                        style={{
                            objectFit: 'cover',
                            width: typeof width === 'number' ? `${width}px` : (width || '100%'),
                            height: typeof height === 'number' ? `${height}px` : (height || 'auto'),
                            borderRadius
                        }}
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
                    {replacePlaceholders(content.text || properties?.text || 'Botão', placeholderContext)}
                </button>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Quiz Options
        if (type === 'quiz-options') {
            node = (
                <div
                    style={{
                        ['--color-selected' as any]: properties?.selectedColor || '#deac6d',
                        ['--color-primary' as any]: properties?.hoverColor || '#d4a05a',
                    } as React.CSSProperties}
                >
                    <div className="space-y-2">
                        {properties?.question && (
                            <div className="text-sm font-medium text-slate-700">
                                {looksLikeHtml(properties.question)
                                    ? <span dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(properties.question) }} />
                                    : properties.question}
                            </div>
                        )}
                        <QuizOptionsPreview
                            blockId={id}
                            options={content.options || []}
                            properties={properties || {}}
                            selectedStep={selectedStep}
                            selections={quizSelections[id] || []}
                            onToggle={(optionId: string, multi: boolean, required: number) => toggleQuizOption(id, optionId, multi, required)}
                            advanceStep={(nextStepId: string) => { setSelectedStepIdUnified(nextStepId); setSelectedBlockIdUnified(''); }}
                        />
                    </div>
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Form Input
        if (type === 'form-input') {
            node = (
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">{content.label || properties?.label || 'Campo'}</label>
                    <input
                        placeholder={content.placeholder || properties?.placeholder || 'Digite...'}
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
            const expanded = expandedContainers ? expandedContainers.has(id) : false;
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
        // Quiz Intro Header
        if (type === 'quiz-intro-header') {
            const showLogo = (properties?.showLogo ?? content?.showLogo) !== false;
            const enableProgressBar = properties?.enableProgressBar ?? content?.showProgress ?? false;
            const showBackButton = properties?.showBackButton ?? content?.showNavigation ?? false;
            node = (
                <div className="w-full bg-white rounded-lg p-4 space-y-3 border shadow-sm">
                    <div className="flex items-center justify-between">
                        {showLogo && (
                            <div className="flex-shrink-0">
                                <img
                                    src={properties?.logoUrl || BRAND_LOGO_URL}
                                    alt={properties?.logoAlt || 'Logo'}
                                    className="h-10 object-contain"
                                />
                            </div>
                        )}
                        {enableProgressBar && (
                            <div className="flex-1 ml-4">
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                    <div className="bg-[#B89B7A] h-1 rounded-full" style={{ width: '0%' }} />
                                </div>
                            </div>
                        )}
                        {showBackButton && (
                            <button type="button" className="ml-2 text-gray-400 hover:text-gray-600 text-sm">
                                ← Voltar
                            </button>
                        )}
                    </div>
                    <div className="text-[10px] text-slate-400 italic">Quiz Header</div>
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Options Grid (grade de opções similar a quiz-options mas com layout grid específico)
        if (type === 'options-grid') {
            const options = Array.isArray(content.options) ? content.options : [];
            const cols = properties?.columns || 2;
            node = (
                <div className="space-y-2">
                    {properties?.question && (
                        <div className="text-sm font-medium text-slate-700">
                            {looksLikeHtml(properties.question)
                                ? <span dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(properties.question) }} />
                                : properties.question}
                        </div>
                    )}
                    <div className={cn('grid gap-3', cols === 2 ? 'grid-cols-2' : cols === 3 ? 'grid-cols-3' : 'grid-cols-1')}>
                        {options.map((opt: any, idx: number) => {
                            const img = opt.image || opt.imageUrl;
                            const label = opt.label || opt.text || `Opção ${idx + 1}`;
                            return (
                                <div key={opt.id || idx} className="border rounded-lg p-3 bg-white hover:border-blue-400 transition-colors cursor-pointer">
                                    {img && (
                                        <img src={img} alt={label} className="w-full h-24 object-cover rounded mb-2" />
                                    )}
                                    <div className="text-sm font-medium">{label}</div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="text-[10px] text-slate-400 italic">Options Grid ({options.length} opções)</div>
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Text Inline (texto inline com variações de estilo)
        if (type === 'text-inline') {
            const align = properties?.textAlign || 'left';
            const size = properties?.fontSize || 'base';
            const weight = properties?.fontWeight || 'normal';
            const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : size === 'xl' ? 'text-xl' : 'text-base';
            const weightClass = weight === 'bold' ? 'font-bold' : weight === 'semibold' ? 'font-semibold' : 'font-normal';
            node = (
                <p className={cn('leading-relaxed text-slate-700', sizeClass, weightClass)} style={{ textAlign: align }}>
                    {replacePlaceholders(content.text || 'Texto inline', placeholderContext)}
                </p>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Button Inline (botão inline com estilos específicos)
        if (type === 'button-inline') {
            const variant = properties?.variant || 'primary';
            const bgColor = properties?.backgroundColor || '#B89B7A';
            const textColor = properties?.textColor || '#FFFFFF';
            node = (
                <button
                    type="button"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-medium shadow-sm transition-colors"
                    style={{ backgroundColor: bgColor, color: textColor }}
                >
                    {replacePlaceholders(content.text || content.label || properties?.text || 'Botão', placeholderContext)}
                </button>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Decorative Bar (barra decorativa)
        if (type === 'decorative-bar') {
            const height = properties?.height || '4px';
            const bgColor = properties?.backgroundColor || '#D4AF37';
            node = (
                <div className="w-full flex justify-center my-4">
                    <div className="w-24 rounded-full" style={{ height, backgroundColor: bgColor }} />
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Form Container (container de formulário)
        if (type === 'form-container') {
            const childBlocks = children.filter(c => c.type === 'form-input' || c.type === 'button-inline');
            node = (
                <div className="border rounded-lg p-4 bg-gradient-to-br from-white to-slate-50 space-y-3">
                    <div className="text-sm font-medium text-slate-700 mb-2">{content.title || 'Formulário'}</div>
                    {childBlocks.length === 0 && (
                        <div className="text-xs text-slate-400 italic">Adicione campos ao formulário</div>
                    )}
                    {childBlocks.map(child => (
                        <div key={child.id}>{renderBlockPreview(child, all)}</div>
                    ))}
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Legal Notice (aviso legal)
        if (type === 'legal-notice') {
            const copy = properties?.copyrightText || content.copyrightText || '© 2025 Sua Marca';
            const showPrivacy = properties?.showPrivacyLink ?? true;
            const showTerms = properties?.showTermsLink ?? true;
            const privacyText = properties?.privacyText || 'Política de Privacidade';
            const termsText = properties?.termsText || 'Termos de Uso';
            const privacyUrl = properties?.privacyLinkUrl || '#';
            const termsUrl = properties?.termsLinkUrl || '#';
            node = (
                <div className="text-xs text-slate-500 text-center leading-relaxed">
                    <span>{copy}</span>
                    <div className="mt-1 space-x-3">
                        {showPrivacy && <a href={privacyUrl} className="underline" target="_blank" rel="noreferrer">{privacyText}</a>}
                        {showTerms && <a href={termsUrl} className="underline" target="_blank" rel="noreferrer">{termsText}</a>}
                    </div>
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Quiz Offer CTA Inline (CTA de oferta do quiz)
        if (type === 'quiz-offer-cta-inline') {
            // Permite mapear por content.offerKey para buscar no offersMap
            const offerKey: string | undefined = content.offerKey;
            const offer = offerKey && offersMap && offersMap[offerKey]
                ? offersMap[offerKey]
                : (Object.values(offersMap || {})[0] as any) || null;
            const title = (offer?.title) || content.title || 'Oferta Especial';
            const description = (offer?.description) || content.description || 'Aproveite esta oportunidade única';
            const image = offer?.image || content.image;
            const ctaLabel = (offer?.ctaLabel) || content.buttonText || 'Quero Aproveitar';
            const ctaUrl = (offer?.ctaUrl) || content.buttonUrl || '#';
            node = (
                <div className="bg-gradient-to-r from-[#B89B7A] to-[#D4AF37] text-white rounded-lg p-6 shadow-lg">
                    {image && (
                        <img src={image} alt={title} className="w-full h-40 object-cover rounded mb-3 opacity-95" />
                    )}
                    <h3 className="text-xl font-bold mb-2">{title}</h3>
                    <p className="text-sm mb-4 opacity-90">{description}</p>
                    <a href={ctaUrl} target="_blank" rel="noreferrer">
                        <button type="button" className="bg-white text-[#B89B7A] px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                            {ctaLabel}
                        </button>
                    </a>
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Testimonials (depoimentos)
        if (type === 'testimonials') {
            const raw = Array.isArray(content.testimonials) ? content.testimonials : [];
            const testimonials = raw.map((t: any) => (typeof t === 'string' ? { quote: t } : t));
            node = (
                <div className="space-y-4">
                    {testimonials.map((t: any, idx: number) => (
                        <div key={idx} className="bg-white border rounded-lg p-4 shadow-sm">
                            <p className="text-sm italic text-slate-600 mb-2">"{t.quote || 'Depoimento'}"</p>
                            <div className="flex items-center gap-2">
                                {t.image && <img src={t.image} alt={t.author} className="w-10 h-10 rounded-full object-cover" />}
                                <div>
                                    <div className="text-sm font-medium">{t.author || 'Cliente'}</div>
                                    {t.role && <div className="text-xs text-slate-500">{t.role}</div>}
                                </div>
                            </div>
                        </div>
                    ))}
                    {testimonials.length === 0 && (
                        <div className="text-xs text-slate-400 italic">Nenhum depoimento adicionado</div>
                    )}
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Result Header Inline (cabeçalho de resultado)
        if (type === 'result-header-inline') {
            const title = content.title || (previewResult ? `Seu estilo é ${placeholderContext.resultStyle}` : 'Seu Resultado:');
            node = (
                <div className="text-center space-y-2 py-4">
                    <h2 className="text-2xl font-bold text-slate-800">
                        {replacePlaceholders(title, placeholderContext)}
                    </h2>
                    {content.subtitle && (
                        <p className="text-sm text-slate-600">{replacePlaceholders(content.subtitle, placeholderContext)}</p>
                    )}
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Style Card Inline (cartão de estilo)
        if (type === 'style-card-inline') {
            const styleId = content.styleId || primaryId;
            const styleData = styleId ? stylesMap[styleId] : undefined;
            const title = content.styleName || styleData?.title || 'Seu Estilo';
            const image = content.image || styleData?.image;
            const description = content.description || styleData?.description || 'Descrição do estilo';
            node = (
                <div className="border rounded-lg p-6 bg-gradient-to-br from-white to-slate-50 shadow-sm">
                    <h3 className="text-lg font-bold mb-2">{title}</h3>
                    {image && (
                        <img src={image} alt={title} className="w-full h-48 object-cover rounded-lg mb-3" />
                    )}
                    <p className="text-sm text-slate-600">{description}</p>
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Secondary Styles (estilos secundários)
        if (type === 'secondary-styles') {
            const raw = Array.isArray(content.styles) ? content.styles : [];
            let styles = raw.map((s: any) => (typeof s === 'string' ? { name: s } : s));
            // Se não houver conteúdo definido, derivar top 2 secundários do cálculo de resultado
            if ((!styles || styles.length === 0) && previewResult?.scores) {
                const entries = Object.entries(previewResult.scores)
                    .filter(([k]) => k !== primaryId)
                    .sort((a, b) => (b[1] - a[1]))
                    .slice(0, 2)
                    .map(([k, v]) => ({ id: k, name: stylesMap[k]?.title || k, score: Math.round(v) }));
                styles = entries as any;
            }
            node = (
                <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-700 mb-2">Estilos Secundários:</div>
                    <div className="grid grid-cols-2 gap-2">
                        {styles.map((style: any, idx: number) => (
                            <div key={idx} className="border rounded-lg p-3 bg-white text-center">
                                <div className="text-sm font-medium">{style.name || `Estilo ${idx + 1}`}</div>
                                {style.score != null && <div className="text-xs text-slate-500">{style.score}%</div>}
                            </div>
                        ))}
                    </div>
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Conversion (bloco de conversão)
        if (type === 'conversion') {
            const headline = content.headline || 'Pronta para transformar seu estilo?';
            const sub = content.subheadline || 'Conheça nosso programa completo.';
            const cta = content.ctaText || 'Quero participar';
            node = (
                <div className="rounded-lg p-6 border bg-white shadow-sm text-center">
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{headline}</h3>
                    <p className="text-sm text-slate-600 mb-4">{sub}</p>
                    <button type="button" className="px-6 py-3 rounded-md bg-[#B89B7A] text-white font-semibold">{cta}</button>
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Urgency Timer Inline (timer de urgência)
        if (type === 'urgency-timer-inline') {
            node = (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <div className="text-sm font-medium text-red-700 mb-2">⏰ Oferta Expira em:</div>
                    <div className="text-2xl font-bold text-red-600 font-mono">00:15:00</div>
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Guarantee (garantia)
        if (type === 'guarantee') {
            node = (
                <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-lg font-bold text-green-700 mb-2">✓ {content.title || 'Garantia'}</div>
                    <p className="text-sm text-green-600">{content.description || 'Satisfação garantida'}</p>
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Bonus (bônus)
        if (type === 'bonus') {
            node = (
                <div className="border-2 border-yellow-300 bg-yellow-50 rounded-lg p-4">
                    <div className="text-lg font-bold text-yellow-700 mb-2">🎁 {content.title || 'Bônus Exclusivo'}</div>
                    <p className="text-sm text-yellow-600">{content.description || 'Aproveite este bônus'}</p>
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Benefits (benefícios)
        if (type === 'benefits') {
            const benefits = content.benefits || [];
            node = (
                <div className="space-y-2">
                    {benefits.map((benefit: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-2">
                            <span className="text-green-500 font-bold">✓</span>
                            <span className="text-sm text-slate-700">{benefit.text || benefit}</span>
                        </div>
                    ))}
                    {benefits.length === 0 && (
                        <div className="text-xs text-slate-400 italic">Nenhum benefício adicionado</div>
                    )}
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Secure Purchase (compra segura)
        if (type === 'secure-purchase') {
            node = (
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                    <span>🔒</span>
                    <span>{content.text || 'Compra 100% Segura'}</span>
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Value Anchoring (ancoragem de valor)
        if (type === 'value-anchoring') {
            node = (
                <div className="text-center space-y-2">
                    <div className="text-sm text-slate-500 line-through">{content.oldPrice || 'R$ 297,00'}</div>
                    <div className="text-3xl font-bold text-green-600">{content.newPrice || 'R$ 97,00'}</div>
                    <div className="text-sm text-red-600 font-medium">{content.discount || 'Economize 67%'}</div>
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Before After Inline (antes e depois)
        if (type === 'before-after-inline') {
            node = (
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className="text-sm font-medium text-slate-600 mb-2">Antes</div>
                        {content.beforeImage && <img src={content.beforeImage} alt="Antes" className="w-full rounded-lg" />}
                        <p className="text-xs text-slate-500 mt-2">{content.beforeText || 'Situação anterior'}</p>
                    </div>
                    <div className="text-center">
                        <div className="text-sm font-medium text-green-600 mb-2">Depois</div>
                        {content.afterImage && <img src={content.afterImage} alt="Depois" className="w-full rounded-lg" />}
                        <p className="text-xs text-slate-700 mt-2">{content.afterText || 'Resultado alcançado'}</p>
                    </div>
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Mentor Section Inline (seção de mentor)
        if (type === 'mentor-section-inline') {
            node = (
                <div className="flex items-start gap-4 bg-slate-50 border rounded-lg p-4">
                    {content.mentorImage && (
                        <img src={content.mentorImage} alt={content.mentorName} className="w-20 h-20 rounded-full object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1">
                        <div className="text-sm font-bold text-slate-800 mb-1">{content.mentorName || 'Mentor'}</div>
                        <p className="text-xs text-slate-600">{content.mentorBio || 'Descrição do mentor'}</p>
                    </div>
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Fashion AI Generator (gerador de IA de moda - placeholder)
        if (type === 'fashion-ai-generator') {
            node = (
                <div className="border-2 border-dashed border-purple-300 bg-purple-50 rounded-lg p-6 text-center">
                    <div className="text-lg font-bold text-purple-700 mb-2">🤖 Fashion AI Generator</div>
                    <p className="text-sm text-purple-600">Componente interativo de IA</p>
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Connected Template Wrapper (wrapper de template conectado - passa children)
        if (type === 'connected-template-wrapper') {
            node = (
                <div className="border rounded-lg p-4 bg-slate-50">
                    <div className="text-xs text-slate-400 italic mb-2">Connected Template Wrapper</div>
                    {children.length > 0 ? (
                        <div className="space-y-2">
                            {children.map(child => (
                                <div key={child.id}>{renderBlockPreview(child, all)}</div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-xs text-slate-400 italic">Adicione blocos internos</div>
                    )}
                </div>
            );
            previewCacheRef.current.set(id, { key, node });
            return node;
        }
        // Fallback: usar EnhancedBlockRenderer para tipos não suportados nativamente
        // Usar função importada (ESM) para evitar require() no bundle do cliente
        const EnhancedComponent = getEnhancedBlockComponent(type);

        if (EnhancedComponent) {
            // Componente existe no registry - renderizar com props básicas
            node = (
                <div className="relative">
                    <EnhancedComponent
                        block={block}
                        properties={properties || {}}
                        content={content || {}}
                        isSelected={false}
                        isPreviewing={true}
                        isEditor={false}
                    />
                </div>
            );
        } else {
            // Componente realmente não existe - mostrar placeholder
            node = (
                <div className="border border-dashed border-amber-300 bg-amber-50 rounded p-3 text-center">
                    <span className="text-xs italic text-amber-700">Tipo: {type}</span>
                    <div className="text-[10px] text-amber-600 mt-1">(Componente não encontrado no registry)</div>
                </div>
            );
        }
        previewCacheRef.current.set(id, { key, node });
        return node;
    };

    // Limpar cache ao trocar de etapa selecionada (evita crescimento indefinido e garante contexto correto)
    useEffect(() => {
        previewCacheRef.current.clear();
    }, [effectiveSelectedStepId]);

    // Virtualização: lógica extraída para hook interno em CanvasArea (remoção da implementação inline anterior)


    // BlockRow agora extraído para components/BlockRow.tsx

    // Flush do histórico debounced ao trocar de step ou desmontar
    useEffect(() => {
        return () => {
            // Flush de histórico debounced removido (não mais necessário)
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editorCtx ? effectiveSelectedStepId : selectedStepId]);

    // ========================================
    // Expansão Lazy de Containers
    // ========================================
    const [expandedContainers, setExpandedContainers] = useState<Set<string>>(new Set());
    useEffect(() => {
        try {
            const raw = StorageService.safeGetString('quiz_editor_expanded_containers_v1');
            if (raw) setExpandedContainers(new Set(JSON.parse(raw)));
        } catch {/* ignore */ }
    }, []);
    const persistExpanded = (next: Set<string>) => {
        try { StorageService.safeSetJSON('quiz_editor_expanded_containers_v1', Array.from(next)); } catch {/* ignore */ }
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
        const required = properties?.requiredSelections || (multi ? 1 : 1);
        const max = properties?.maxSelections || required;
        const showImages = properties?.showImages !== false;
        const showNextButton = properties?.showNextButton !== false; // default true
        const enableButtonOnlyWhenValid = properties?.enableButtonOnlyWhenValid !== false; // default true
        const nextButtonText = properties?.nextButtonText || 'Avançar';
        // Auto-avanço: respeita flag global e local (properties.autoAdvance)
        const autoAdvance = (properties?.autoAdvance !== false) && previewRuntimeFlags.enableAutoAdvance && !!(selectedStep && selectedStep.type === 'question');
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
                const t = setTimeout(() => advanceStep(selectedStep.nextStep!), previewRuntimeFlags.autoAdvanceDelayMs);
                return () => clearTimeout(t);
            }
        }, [autoAdvance, selections.length, required, selectedStep, advanceStep]);
        const isValid = selections.length >= required && required > 0;
        const handleNext = () => {
            if (!selectedStep?.nextStep) return;
            if (enableButtonOnlyWhenValid && !isValid) return;
            advanceStep(selectedStep.nextStep);
        };
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
                                    <img
                                        src={opt.image}
                                        alt={opt.text || 'Opção'}
                                        className="mb-2 rounded"
                                        style={{
                                            width: properties?.imageMaxWidth ? `${properties.imageMaxWidth}px` : '100%',
                                            maxWidth: '100%',
                                            height: properties?.imageMaxHeight ? `${properties.imageMaxHeight}px` : 'auto',
                                            objectFit: 'cover'
                                        }}
                                    />
                                )}
                                <p className="quiz-option-text text-xs font-medium leading-snug">{opt.text || 'Opção'}</p>
                            </div>
                        );
                    })}
                </div>
                <div className="text-[10px] text-muted-foreground">
                    {multi ? `${selections.length}/${required} selecionadas` : (selections.length === 1 ? '1 selecionada' : 'Selecione 1')}
                </div>
                {showNextButton && (
                    <div className="pt-1">
                        <button
                            type="button"
                            onClick={handleNext}
                            className={cn(
                                'quiz-button px-4 py-2 rounded-full text-sm',
                                enableButtonOnlyWhenValid && !isValid && 'quiz-button-disabled'
                            )}
                            disabled={enableButtonOnlyWhenValid && !isValid}
                        >
                            {nextButtonText}
                        </button>
                    </div>
                )}
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
                version: 1,
                // Persistir configurações unificadas relevantes
                runtime: (unifiedConfig as any)?.runtime,
                results: (unifiedConfig as any)?.results,
                ui: (unifiedConfig as any)?.ui,
                settings: (unifiedConfig as any)?.settings,
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

    // Handler para quando um quiz é criado pelo Builder System
    const handleBuilderQuizCreated = useCallback((quizData: any) => {
        console.log('🎯 Quiz criado pelo Builder System:', quizData);

        try {
            // Converter FunnelConfig para EditableQuizStep[]
            const convertedSteps: EditableQuizStep[] = quizData.steps.map((step: any, index: number) => ({
                id: `step-${index + 1}`,
                title: step.title || `Etapa ${index + 1}`,
                type: step.stepType || 'question',
                order: index,
                blocks: Array.isArray(step.blocks)
                    ? step.blocks.map((block: any, blockIndex: number) => ({
                        id: `block-${index}-${blockIndex}`,
                        type: block.type,
                        content: block.content || {},
                        properties: block.properties || {},
                        order: blockIndex
                    }))
                    : []
            }));

            setSteps(convertedSteps);
            if (convertedSteps.length > 0) {
                setSelectedStepIdUnified(convertedSteps[0].id);
            }
            setIsDirty(true);

            toast({
                title: '✅ Quiz criado',
                description: `${convertedSteps.length} etapas geradas pelo Builder System`,
            });
        } catch (error) {
            console.error('❌ Erro ao converter quiz do builder:', error);
            toast({
                title: 'Erro',
                description: 'Falha ao converter quiz gerado',
                variant: 'destructive'
            });
        }
    }, [toast]);

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
                                                        <button onClick={() => { setSelectedStepIdUnified(s.id); setNavOpen(false); }} className="text-left font-medium text-[11px] text-slate-800 hover:underline">{s.id}</button>
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
                                <Button variant="outline" size="sm" onClick={() => {
                                    const previewUrl = `/preview?slug=quiz-estilo${funnelId ? `&funnel=${funnelId}` : ''}`;
                                    window.open(previewUrl, '_blank');
                                }} title="Abrir preview de produção em nova aba">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Preview Produção
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleExport}>Exportar</Button>
                                <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving || !isDirty}>{isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Salvar</Button>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="sm" disabled={!canUndo} onClick={handleUndo} className="text-xs px-2">⮪ Undo</Button>
                                    <Button variant="ghost" size="sm" disabled={!canRedo} onClick={handleRedo} className="text-xs px-2">Redo ⮫</Button>
                                </div>
                                <div className="h-6 w-px bg-border" />
                                <div className="flex items-center gap-1" data-testid="preview-toggle">
                                    <Button variant={activeTab === 'canvas' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('canvas')}>Canvas</Button>
                                    <Button variant={activeTab === 'preview' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('preview')}>Preview</Button>
                                </div>
                                <Button size="sm" onClick={handlePublish} disabled={isPublishing}>{isPublishing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}Publicar</Button>
                            </div>
                        </div>
                    )}
                    stepsPanel={(
                        <StepNavigator
                            steps={steps}
                            selectedStepId={editorCtx ? effectiveSelectedStepId : selectedStepId}
                            byStep={byStep as any}
                            onSelect={(id) => { setSelectedStepIdUnified(id); setSelectedBlockIdUnified(''); }}
                            onAddStep={handleAddStep}
                            onMoveStep={handleMoveStep}
                            onDeleteStep={handleDeleteStep}
                            extractStepMeta={(s: any) => ({ id: s.id, type: s.type, blockCount: s.blocks?.length || 0 })}
                        />
                    )}
                    libraryPanel={(
                        <ComponentLibraryPanel
                            components={COMPONENT_LIBRARY as any}
                            categories={['layout', 'content', 'visual', 'quiz', 'forms', 'action', 'result', 'offer', 'navigation', 'ai', 'advanced']}
                            selectedStepId={editorCtx ? effectiveSelectedStepId : selectedStepId}
                            onAdd={(type) => {
                                const stepIdToUse = editorCtx ? effectiveSelectedStepId : selectedStepId;
                                if (stepIdToUse) addBlockToStep(stepIdToUse, type);
                            }}
                            onQuizCreated={handleBuilderQuizCreated}
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
                            BlockRow={BlockRow}
                            byBlock={byBlock}
                            selectedBlockId={effectiveSelectedBlockId}
                            isMultiSelected={isMultiSelected}
                            handleBlockClick={(e, block) => {
                                const isShift = e.shiftKey;
                                const isMeta = e.metaKey || (e as any).ctrlKey;
                                // orderedBlocks: ordem top-level + filhos linearizada para range com Shift
                                const ordered = (selectedStep?.blocks || [])
                                    .filter(b => !b.parentId)
                                    .sort((a, b) => a.order - b.order)
                                    .flatMap(root => [root, ...((selectedStep?.blocks || []).filter(c => c.parentId === root.id).sort((a, b) => a.order - b.order))]);
                                if (!isShift && !isMeta) {
                                    e.stopPropagation();
                                    setSelectedBlockIdUnified(block.id);
                                    return;
                                }
                                handleBlockClick(e, block, ordered);
                            }}
                            renderBlockPreview={renderBlockPreview}
                            removeBlock={removeBlock}
                            setBlockPendingDuplicate={setBlockPendingDuplicate}
                            setTargetStepId={setTargetStepId}
                            setDuplicateModalOpen={setDuplicateModalOpen}
                            activeId={activeId}
                            previewNode={<LivePreviewContainer funnelId={funnelId} steps={steps} selectedStepId={(editorCtx ? effectiveSelectedStepId : selectedStepId) || selectedStep?.id} />}
                            FixedProgressHeader={FixedProgressHeader}
                            StyleResultCard={StyleResultCard}
                            OfferMap={OfferMap}
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
                            onBlockPatch={(patch) => {
                                if (!selectedBlock || !selectedStep) return;
                                const contentObj = selectedBlock.content && typeof selectedBlock.content === 'object' ? selectedBlock.content : {};
                                const contentKeys = new Set(Object.keys(contentObj));
                                const propPatch: Record<string, any> = {};
                                const contentPatch: Record<string, any> = {};
                                Object.entries(patch).forEach(([k, v]) => {
                                    if (contentKeys.has(k)) contentPatch[k] = v; else propPatch[k] = v;
                                });
                                if (Object.keys(propPatch).length) updateBlockProperties(selectedStep.id, selectedBlock.id, propPatch);
                                if (Object.keys(contentPatch).length) updateBlockContent(selectedStep.id, selectedBlock.id, contentPatch);
                            }}
                            isOfferStep={!!(selectedStep && selectedStep.type === 'offer')}
                            OfferMapComponent={OfferMap as any}
                            onOfferMapUpdate={(c: any) => { if (!selectedStep) return; setSteps(prev => prev.map(st => st.id === selectedStep.id ? { ...st, offerMap: c.offerMap } : st)); setIsDirty(true); }}
                            ThemeEditorPanel={ThemeEditorPanel as any}
                            onApplyTheme={(t) => setThemeOverrides(t)}
                            currentRuntimeScoring={currentRuntimeScoringMemo}
                            unifiedConfig={unifiedConfig as any}
                            onUnifiedConfigPatch={(patch) => {
                                setUnifiedConfig(prev => {
                                    const base = prev || {} as any;
                                    // merge raso por seções, mantendo objetos aninhados existentes quando possível
                                    const next: any = { ...base };
                                    if (patch.runtime) next.runtime = { ...(base.runtime || {}), ...patch.runtime };
                                    if (patch.results) next.results = { ...(base.results || {}), ...patch.results };
                                    if (patch.ui) next.ui = { ...(base.ui || {}), ...patch.ui };
                                    if (patch.settings) next.settings = { ...(base.settings || {}), ...patch.settings };
                                    return next;
                                });
                            }}
                            onRuntimeScoringChange={(scoring) => {
                                // Atualiza unifiedConfig local para refletir no preview imediatamente
                                setUnifiedConfig(prev => {
                                    const base = prev || {} as any;
                                    const nextRuntime = { ...(base.runtime || {}), scoring: { ...(base.runtime?.scoring || {}), ...scoring } };
                                    return { ...base, runtime: nextRuntime } as any;
                                });
                            }}
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
    selectedStepId?: string;
}

const LivePreviewContainer: React.FC<LivePreviewContainerProps> = ({ funnelId, steps, selectedStepId }) => {
    // Define o modo inicial priorizando query (?preview=live|production), depois localStorage, por fim 'live'
    const [mode, setMode] = React.useState<'production' | 'live'>(() => {
        try {
            const sp = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
            const q = sp.get('preview');
            if (q === 'live' || q === 'production') return q;
            const stored = typeof window !== 'undefined' ? StorageService.safeGetString('editor_preview_mode') : null;
            if (stored === 'live' || stored === 'production') return stored;
        } catch {/* ignore */ }
        return 'live';
    });
    const [debouncedSteps, setDebouncedSteps] = React.useState(steps);
    const debounceRef = React.useRef<number | null>(null);

    // Debounce para não repintar runtime a cada digitação
    React.useEffect(() => {
        if (debounceRef.current) window.clearTimeout(debounceRef.current);
        debounceRef.current = window.setTimeout(() => setDebouncedSteps(steps), 400);
        return () => { if (debounceRef.current) window.clearTimeout(debounceRef.current); };
    }, [steps]);

    // Persistir preferência de modo
    React.useEffect(() => {
        try { StorageService.safeSetString('editor_preview_mode', mode); } catch {/* ignore */ }
    }, [mode]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden">
                {mode === 'production' ? (
                    <QuizProductionPreview funnelId={funnelId} className="h-full" />
                ) : (
                    <QuizRuntimeRegistryProvider>
                        <LiveRuntimePreview steps={debouncedSteps} funnelId={funnelId} selectedStepId={selectedStepId} />
                    </QuizRuntimeRegistryProvider>
                )}
            </div>
        </div>
    );
};

interface LiveRuntimePreviewProps {
    steps: EditableQuizStep[];
    funnelId?: string;
    selectedStepId?: string;
}

const LiveRuntimePreview: React.FC<LiveRuntimePreviewProps> = ({ steps, funnelId, selectedStepId }) => {
    const { setSteps, version } = useQuizRuntimeRegistry();
    const runtimeMap = React.useMemo(() => editorStepsToRuntimeMap(steps as any), [steps]);
    const mapRef = React.useRef(runtimeMap);

    // Hash estável para evitar loops desnecessários
    const mapHash = React.useMemo(() => {
        try {
            return JSON.stringify(Object.keys(runtimeMap).sort().map(k => [k, typeof runtimeMap[k]]));
        } catch {
            return String(Date.now());
        }
    }, [runtimeMap]);
    const hashRef = React.useRef(mapHash);

    // Atualizar registry quando mapa realmente muda (baseado em hash estável)
    React.useEffect(() => {
        if (hashRef.current !== mapHash) {
            hashRef.current = mapHash;
            mapRef.current = runtimeMap;
            setSteps(runtimeMap);
            console.log('🔁 Live preview registry atualizado', Object.keys(runtimeMap).length, 'steps');
        }
    }, [mapHash, runtimeMap, setSteps]);

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="flex-1 overflow-auto">
                <QuizAppConnected funnelId={funnelId} editorMode initialStepId={selectedStepId} />
            </div>
            <div className="px-2 py-1 border-t bg-slate-50 text-[10px] text-slate-500 flex items-center justify-between">
                <span>Live Runtime v{version}</span>
                <span>{Object.keys(runtimeMap).length} steps</span>
            </div>
        </div>
    );
};

