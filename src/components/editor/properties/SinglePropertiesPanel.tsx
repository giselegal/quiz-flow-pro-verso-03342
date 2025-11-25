/**
 * 🎯 SinglePropertiesPanel - Painel de propriedades unificado e simplificado
 * 
 * Características:
 * - ✅ IDs únicos garantidos por instância
 * - ✅ Renderização dinâmica baseada no tipo de bloco
 * - ✅ Todas as funcionalidades dos editores específicos
 * - ✅ Zero duplicação de código
 * - ✅ Performance otimizada
 */

import React, { useCallback, useMemo, useId, memo, lazy, Suspense, useState, useRef, useEffect } from 'react';
import { appLogger } from '@/lib/utils/logger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

import { PropertyChangeIndicator } from '@/components/universal/PropertyChangeIndicator';

// Lazy loading para componentes pesados
const ColorPicker = lazy(() => import('@/components/visual-controls/ColorPicker'));
const SizeSlider = lazy(() => import('@/components/visual-controls/SizeSlider'));

// 🔥 HÍBRIDO: Lazy loading para editores especializados
const HeaderPropertyEditor = lazy(() => import('./editors/HeaderPropertyEditor').then(m => ({ default: m.HeaderPropertyEditor })));
const QuestionPropertyEditor = lazy(() => import('./editors/QuestionPropertyEditor').then(m => ({ default: m.QuestionPropertyEditor })));
const ButtonPropertyEditor = lazy(() => import('./editors/ButtonPropertyEditor').then(m => ({ default: m.ButtonPropertyEditor })));
const TextPropertyEditor = lazy(() => import('./editors/TextPropertyEditor'));
import OptionsGridPropertyEditor from './editors/OptionsGridPropertyEditor';
const OptionsPropertyEditor = lazy(() => import('./editors/OptionsPropertyEditor').then(m => ({ default: m.OptionsPropertyEditor })));
const ImagePropertyEditor = lazy(() => import('./editors/ImagePropertyEditor'));
const FormContainerPropertyEditor = lazy(() => import('./editors/FormContainerPropertyEditor').then(m => ({ default: m.FormContainerPropertyEditor })));
const LeadFormPropertyEditor = lazy(() => import('./editors/LeadFormPropertyEditor').then(m => ({ default: m.LeadFormPropertyEditor })));
const NavigationPropertyEditor = lazy(() => import('./editors/NavigationPropertyEditor').then(m => ({ default: m.NavigationPropertyEditor })));
const TestimonialPropertyEditor = lazy(() => import('./editors/TestimonialPropertyEditor').then(m => ({ default: m.TestimonialPropertyEditor })));
const PricingPropertyEditor = lazy(() => import('./editors/PricingPropertyEditor').then(m => ({ default: m.PricingPropertyEditor })));
const ResultCommonPropertyEditor = lazy(() => import('./editors/ResultCommonPropertyEditor').then(m => ({ default: m.ResultCommonPropertyEditor })));
const MentorPropertyEditor = lazy(() => import('./editors/MentorPropertyEditor'));

import { PropertyType, UnifiedBlock } from '@/hooks/useUnifiedProperties';
import { useOptimizedUnifiedProperties } from '@/hooks/useOptimizedUnifiedProperties';
import { useDebouncedCallback } from '@/hooks/useDebounce';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { schemaInterpreter, type BlockTypeSchema, type PropertySchema } from '@/core/schema/SchemaInterpreter';
import { buildZodSchemaFromBlockSchema } from '@/core/schema/zodSchemaBuilder';
import { DynamicPropertyControls } from '@/components/editor/DynamicPropertyControls';
import { useDraftProperties } from '@/components/editor/quiz/QuizModularEditor/hooks/useDraftProperties';
import { Settings, Type, Palette, Layout, Trash2, Copy, Check, Loader2, XCircle, Info, ChevronDown, Sparkles } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

// ===== INTERFACES =====

interface BuilderDrivenPanelProps {
    block: UnifiedBlock;
    schema: BlockTypeSchema;
    onUpdate?: (updates: Record<string, any>) => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
}

type PanelSection = {
    id: string;
    title: string;
    description?: string;
    properties: Record<string, PropertySchema>;
};

type SectionPreset = {
    id: string;
    title: string;
    description?: string;
    match: (key: string, property: PropertySchema) => boolean;
};

type PresetItem = {
    id: string;
    label: string;
    updates: Record<string, any>;
    helperText?: string;
};

type PresetGroup = {
    id: string;
    title: string;
    description?: string;
    items: PresetItem[];
};

const createMatcher = (keys: string[]): ((key: string) => boolean) => {
    const set = new Set(keys);
    return (key: string) => set.has(key);
};

const BLOCK_SECTION_PRESETS: Record<string, SectionPreset[]> = {
    'options-grid': [
        {
            id: 'layout',
            title: 'Layout',
            description: 'Organize colunas, espaçamentos e posicionamentos.',
            match: (key) => createMatcher([
                'columns',
                'gridGap',
                'responsiveColumns',
                'padding',
                'marginTop',
                'marginBottom',
                'contentMode',
                'textPosition',
                'imageLayout',
                'imagePosition',
            ])(key),
        },
        {
            id: 'selection',
            title: 'Seleção e Validação',
            description: 'Defina regras de seleção e mensagens de validação.',
            match: (key) => createMatcher([
                'multipleSelection',
                'minSelections',
                'maxSelections',
                'requiredSelections',
                'allowDeselection',
                'showSelectionCount',
                'selectionCountText',
                'enableValidation',
                'showValidationMessage',
                'validationMessage',
                'validationMessageColor',
            ])(key),
        },
        {
            id: 'auto-advance',
            title: 'Auto-avanço',
            description: 'Controle quando avançar automaticamente.',
            match: (key) => createMatcher([
                'autoAdvanceOnComplete',
                'autoAdvanceDelay',
                'autoAdvanceOnMaxSelection',
            ])(key),
        },
        {
            id: 'pontuacao',
            title: 'Pontuação',
            description: 'Ajuste visibilidade e pontuação das opções.',
            match: (key) => createMatcher([
                'showPoints',
                'options',
            ])(key),
        },
        {
            id: 'aparencia',
            title: 'Aparência',
            description: 'Cores, estilo de seleção e efeitos visuais.',
            match: (key) => createMatcher([
                'showImages',
                'imageSize',
                'imageWidth',
                'imageHeight',
                'imageBorderRadius',
                'imageObjectFit',
                'backgroundColor',
                'borderColor',
                'selectedColor',
                'selectedBorderColor',
                'hoverColor',
                'hoverBorderColor',
                'textColor',
                'selectedTextColor',
                'borderRadius',
                'borderWidth',
                'selectionStyle',
                'selectionAnimation',
                'hoverEffect',
                'scale',
                'opacity',
                'disabledOpacity',
            ])(key),
        },
        {
            id: 'acoes',
            title: 'Ações e Navegação',
            description: 'Controle botões e fluxo da questão.',
            match: (key) => createMatcher([
                'showButtons',
                'buttonPosition',
                'enableButtonOnlyWhenValid',
                'nextButtonText',
                'nextButtonUrl',
                'nextButtonAction',
                'showPreviousButton',
                'previousButtonText',
            ])(key),
        },
        {
            id: 'opcoes',
            title: 'Opções',
            description: 'Gerencie a lista de opções exibidas.',
            match: (key) => key === 'options',
        },
    ],
};

const CATEGORY_LABELS: Record<string, { title: string; description?: string }> = {
    content: { title: 'Conteúdo', description: 'Textos, itens e dados exibidos.' },
    layout: { title: 'Layout', description: 'Estrutura e distribuição visual.' },
    behavior: { title: 'Comportamento', description: 'Regras de seleção e fluxo.' },
    style: { title: 'Aparência', description: 'Cores, estilos e efeitos visuais.' },
    animation: { title: 'Animações', description: 'Movimentos e transições.' },
    advanced: { title: 'Avançado', description: 'Ajustes avançados e técnicos.' },
};

const CATEGORY_ORDER = ['content', 'layout', 'behavior', 'style', 'animation', 'advanced', 'general'];

const formatCategoryLabel = (category: string) => {
    if (!category) return 'Outros';
    return category.charAt(0).toUpperCase() + category.slice(1);
};

const buildPanelSections = (schema: BlockTypeSchema): PanelSection[] => {
    const presets = BLOCK_SECTION_PRESETS[schema.type] ?? [];
    const assigned = new Set<string>();
    const sections: PanelSection[] = [];

    presets.forEach((preset) => {
        const matchedEntries = Object.entries(schema.properties).filter(([key, property]) => {
            if (assigned.has(key)) return false;
            return preset.match(key, property);
        });

        if (!matchedEntries.length) {
            return;
        }

        matchedEntries.forEach(([key]) => assigned.add(key));

        sections.push({
            id: preset.id,
            title: preset.title,
            description: preset.description,
            properties: Object.fromEntries(matchedEntries),
        });
    });

    const remainingEntries = Object.entries(schema.properties).filter(([key]) => !assigned.has(key));

    if (remainingEntries.length) {
        const grouped = new Map<string, Array<[string, PropertySchema]>>();
        remainingEntries.forEach(([key, property]) => {
            const category = property.category ?? 'general';
            if (!grouped.has(category)) {
                grouped.set(category, []);
            }
            grouped.get(category)!.push([key, property]);
        });

        const sortedCategories = Array.from(grouped.keys()).sort((a, b) => {
            const indexA = CATEGORY_ORDER.indexOf(a);
            const indexB = CATEGORY_ORDER.indexOf(b);
            const safeA = indexA === -1 ? CATEGORY_ORDER.length : indexA;
            const safeB = indexB === -1 ? CATEGORY_ORDER.length : indexB;
            return safeA - safeB;
        });

        sortedCategories.forEach((category) => {
            const entries = grouped.get(category)!;
            const metadata = CATEGORY_LABELS[category];
            sections.push({
                id: `category-${category}`,
                title: metadata?.title ?? formatCategoryLabel(category),
                description: metadata?.description,
                properties: Object.fromEntries(entries),
            });
        });
    }

    if (!sections.length) {
        sections.push({
            id: 'default',
            title: 'Configurações',
            properties: { ...schema.properties },
        });
    }

    return sections;
};

const BLOCK_PRESET_GROUPS: Record<string, PresetGroup[]> = {
    'options-grid': [
        {
            id: 'layout-presets',
            title: 'Layout Rápido',
            description: 'Escolha rapidamente a estrutura das opções.',
            items: [
                {
                    id: 'layout-1col',
                    label: '1 coluna',
                    updates: { columns: 1, responsiveColumns: false },
                },
                {
                    id: 'layout-2col',
                    label: '2 colunas',
                    updates: { columns: 2, responsiveColumns: true },
                },
                {
                    id: 'layout-imagem-texto',
                    label: 'Imagem + Texto',
                    updates: { contentMode: 'text-and-image', showImages: true, imageLayout: 'vertical' },
                },
            ],
        },
        {
            id: 'selection-presets',
            title: 'Seleção',
            description: 'Aplique regras de seleção frequentes.',
            items: [
                {
                    id: 'selection-exact-3',
                    label: 'Exatamente 3',
                    helperText: 'Ideal para etapas 2–11',
                    updates: {
                        multipleSelection: true,
                        minSelections: 3,
                        maxSelections: 3,
                        requiredSelections: 3,
                        showSelectionCount: true,
                    },
                },
                {
                    id: 'selection-min1-max3',
                    label: 'Mín 1 / Máx 3',
                    updates: {
                        multipleSelection: true,
                        minSelections: 1,
                        maxSelections: 3,
                        requiredSelections: 1,
                        showSelectionCount: true,
                    },
                },
            ],
        },
        {
            id: 'auto-advance-presets',
            title: 'Auto-avanço',
            description: 'Escolha a velocidade do auto-avanço.',
            items: [
                {
                    id: 'auto-advance-250',
                    label: '250 ms',
                    updates: { autoAdvanceOnComplete: true, autoAdvanceDelay: 250 },
                },
                {
                    id: 'auto-advance-800',
                    label: '800 ms',
                    updates: { autoAdvanceOnComplete: true, autoAdvanceDelay: 800 },
                },
                {
                    id: 'auto-advance-1500',
                    label: '1,5 s',
                    updates: { autoAdvanceOnComplete: true, autoAdvanceDelay: 1500 },
                },
            ],
        },
    ],
};

const BuilderDrivenPanel: React.FC<BuilderDrivenPanelProps> = ({
    block,
    schema,
    onUpdate,
    onDelete,
    onDuplicate,
}) => {
    const zodSchema = useMemo(() => {
        try {
            return buildZodSchemaFromBlockSchema(schema);
        } catch (error) {
            appLogger.error('[SinglePropertiesPanel] Falha ao construir schema Zod', {
                data: [{ blockType: schema.type, error }],
            });
            return null;
        }
    }, [schema]);

    const initialProperties = useMemo(() => {
        const merged: Record<string, any> = { ...(block.properties ?? {}) };

        Object.entries(schema.properties).forEach(([key, propertySchema]) => {
            if (merged[key] === undefined && propertySchema.default !== undefined) {
                merged[key] = propertySchema.default;
            }
        });

        return merged;
    }, [block.properties, schema]);

    const baselineRef = useRef<Record<string, any>>(initialProperties);

    useEffect(() => {
        baselineRef.current = initialProperties;
    }, [initialProperties, block.id, schema.type]);

    const handleCommit = useCallback((values: Record<string, any>) => {
        const diff: Record<string, any> = {};
        Object.entries(values).forEach(([key, value]) => {
            if (baselineRef.current[key] !== value) {
                diff[key] = value;
            }
        });

        if (Object.keys(diff).length > 0) {
            onUpdate?.(diff);
            appLogger.info('[SinglePropertiesPanel] Atualizações aplicadas via builder', {
                data: [{ blockId: block.id, updates: diff }],
            });
        }

        baselineRef.current = { ...baselineRef.current, ...values };
    }, [onUpdate, block.id]);

    const {
        draft,
        errors,
        isDirty,
        updateField,
        updateJsonField,
        commitDraft,
        cancelDraft,
        getJsonBuffer,
    } = useDraftProperties({
        schema,
        zodSchema,
        initialProperties,
        onCommit: handleCommit,
    });

    const [isSaving, setIsSaving] = useState(false);
    const hasErrors = Object.keys(errors).length > 0;

    const handleApply = useCallback(() => {
        setIsSaving(true);
        const success = commitDraft();
        setIsSaving(false);

        if (!success) {
            appLogger.warn('[SinglePropertiesPanel] Commit bloqueado por erros de validação');
        }
    }, [commitDraft]);

    const handleCancel = useCallback(() => {
        cancelDraft();
    }, [cancelDraft]);

    const sections = useMemo(() => buildPanelSections(schema), [schema]);

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setOpenSections((prev) => {
            const next: Record<string, boolean> = {};
            sections.forEach((section, index) => {
                next[section.id] = prev[section.id] ?? index === 0;
            });
            return next;
        });
    }, [sections]);

    const availablePresetGroups = useMemo(() => {
        const groups = BLOCK_PRESET_GROUPS[schema.type] ?? [];
        return groups
            .map((group) => ({
                ...group,
                items: group.items.filter((item) =>
                    Object.keys(item.updates).some((key) => schema.properties[key] !== undefined),
                ),
            }))
            .filter((group) => group.items.length > 0);
    }, [schema]);

    const applyPreset = useCallback((updates: Record<string, any>) => {
        const applicableEntries = Object.entries(updates).filter(([key]) => schema.properties[key] !== undefined);

        if (!applicableEntries.length) {
            appLogger.warn('[SinglePropertiesPanel] Preset sem propriedades compatíveis', {
                data: [{ blockType: schema.type, updates }],
            });
            return;
        }

        applicableEntries.forEach(([key, value]) => {
            updateField(key, value);
        });

        appLogger.info('[SinglePropertiesPanel] Preset aplicado', {
            data: [{ blockId: block.id, presetKeys: applicableEntries.map(([key]) => key) }],
        });
    }, [schema, updateField, block.id]);

    return (
        <Card className="h-full flex flex-col border-0 bg-transparent">
            <CardHeader className="sticky top-0 z-40 space-y-2 border-b border-border/60 bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                        <CardTitle className="text-sm font-semibold">{schema.label ?? block.type}</CardTitle>
                        +                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            +                            <span className="font-mono">#{block.id}</span>
                            +                            <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                                +                                {schema.category}
                                +                            </Badge>
                            +                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {onDuplicate && (
                            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onDuplicate}>
                                <Copy className="w-3 h-3 mr-1" />
                                Duplicar
                            </Button>
                        )}
                        {onDelete && (
                            <Button variant="destructive" size="sm" className="h-8 text-xs" onClick={onDelete}>
                                <Trash2 className="w-3 h-3 mr-1" />
                                Remover
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                    {hasErrors ? (
                        <span className="flex items-center gap-1 text-destructive">
                            <XCircle className="w-3 h-3" />
                            Erros de validação
                        </span>
                    ) : isDirty ? (
                        <span className="flex items-center gap-1 text-amber-600">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Alterações não aplicadas
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-green-600">
                            <Check className="w-3 h-3" />
                            Sincronizado
                        </span>
                    )}
                </div>
            </CardHeader>

            <CardContent className="flex-1 min-h-0 px-0 py-0">
                <ScrollArea className="h-full">
                    <div className="px-6 py-5 space-y-5">
                        {schema.description && (
                            <Alert>
                                <Info className="w-4 h-4" />
                                <AlertDescription className="text-xs">
                                    {schema.description}
                                </AlertDescription>
                            </Alert>
                        )}

                        {hasErrors && (
                            <Alert variant="destructive">
                                <XCircle className="w-4 h-4" />
                                <AlertDescription className="text-xs space-y-1">
                                    {Object.entries(errors).map(([key, message]) => (
                                        <div key={key}>
                                            <strong>{key}:</strong> {message}
                                        </div>
                                    ))}
                                </AlertDescription>
                            </Alert>
                        )}

                        {availablePresetGroups.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase text-muted-foreground">
                                    <Sparkles className="h-3 w-3" />
                                    Presets rápidos
                                </div>
                                {availablePresetGroups.map((group) => (
                                    <div
                                        key={group.id}
                                        className="space-y-2 rounded-lg border border-dashed border-border/60 bg-muted/30 p-3"
                                    >
                                        <div>
                                            <p className="text-xs font-medium text-foreground">{group.title}</p>
                                            {group.description && (
                                                <p className="text-[11px] text-muted-foreground">{group.description}</p>
                                            )}
                                        </div>
                                        <div className="grid gap-2">
                                            {group.items.map((item) => (
                                                <div key={item.id} className="flex flex-wrap items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="secondary"
                                                        className="h-8 text-xs"
                                                        onClick={() => applyPreset(item.updates)}
                                                    >
                                                        {item.label}
                                                    </Button>
                                                    {item.helperText && (
                                                        <span className="text-[11px] text-muted-foreground">
                                                            {item.helperText}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="space-y-3">
                            {sections.map((section) => (
                                <div key={section.id} className="rounded-lg border border-border/60 bg-card">
                                    <Collapsible
                                        open={openSections[section.id]}
                                        onOpenChange={(value) =>
                                            setOpenSections((prev) => ({ ...prev, [section.id]: value }))
                                        }
                                    >
                                        <CollapsibleTrigger asChild>
                                            <button
                                                type="button"
                                                className={cn(
                                                    'flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors',
                                                    openSections[section.id] ? 'bg-muted/70' : 'hover:bg-muted/40'
                                                )}
                                            >
                                                <div className="flex-1">
                                                    <div>{section.title}</div>
                                                    {section.description && (
                                                        <p className="text-xs font-normal text-muted-foreground">
                                                            {section.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <ChevronDown
                                                    className={cn(
                                                        'h-4 w-4 shrink-0 transition-transform',
                                                        openSections[section.id] ? 'rotate-180' : ''
                                                    )}
                                                />
                                            </button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="px-4 pb-4 pt-3">
                                            <DynamicPropertyControls
                                                elementType={block.type}
                                                schemaOverride={{ ...schema, properties: section.properties }}
                                                properties={draft}
                                                onChange={(key, value) => updateField(key, value)}
                                                errors={errors}
                                                onJsonTextChange={(key, value) => updateJsonField(key, value)}
                                                getJsonBuffer={(key) => getJsonBuffer(key)}
                                            />
                                        </CollapsibleContent>
                                    </Collapsible>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollArea>
            </CardContent>

            <div className="sticky bottom-0 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleApply}
                        disabled={!isDirty || hasErrors || isSaving}
                        className="flex-1 gap-2 text-xs"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Validando...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Aplicar
                            </>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={!isDirty || isSaving}
                        className="text-xs"
                    >
                        Cancelar
                    </Button>
                </div>
            </div>
        </Card>
    );
};

interface SinglePropertiesPanelProps {
    selectedBlock: UnifiedBlock | null;
    onUpdate?: (updates: Record<string, any>) => void; // Compatível com o formato do editor atual
    onDelete?: () => void;
    onDuplicate?: () => void;
    onClose?: () => void;
}interface PropertyFieldProps {
    property: any;
    value: any;
    onChange: (value: any) => void;
    uniqueId: string;
}

// ===== PROPERTY FIELD RENDERER WITH HYBRID EDITORS =====

// 🔥 HÍBRIDO: Renderizador de editor especializado
const SpecializedEditor: React.FC<{
    blockType: string;
    selectedBlock: UnifiedBlock;
    onUpdate: (updates: Record<string, any>) => void;
}> = memo(({ blockType, selectedBlock, onUpdate }) => {
    // Adaptar interface para editores especializados
    const handleUpdate = useCallback((updates: any) => {
        // Converter updates para formato compatível
        onUpdate(updates);
    }, [onUpdate]);

    // Switch para editores especializados com lazy loading
    switch (blockType) {
        case 'header':
        case 'quiz-intro-header':
        case 'quiz-header':
            return (
                <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Carregando editor de cabeçalho...</div>}>
                    <HeaderPropertyEditor
                        block={selectedBlock as any}
                        onUpdate={handleUpdate as any}
                        isPreviewMode={false}
                    />
                </Suspense>
            );

        case 'question':
        case 'quiz-question':
        case 'quiz-question-inline':
            return (
                <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Carregando editor de questão...</div>}>
                    <QuestionPropertyEditor
                        block={selectedBlock as any}
                        onUpdate={handleUpdate as any}
                        isPreviewMode={false}
                    />
                </Suspense>
            );

        case 'button':
        case 'cta':
        case 'quiz-cta':
            return (
                <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Carregando editor de botão...</div>}>
                    <ButtonPropertyEditor
                        block={selectedBlock as any}
                        onUpdate={handleUpdate as any}
                        isPreviewMode={false}
                    />
                </Suspense>
            );

        case 'text':
        case 'text-inline':
        case 'headline':
        case 'title':
            return (
                <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Carregando editor de texto...</div>}>
                    <TextPropertyEditor
                        block={selectedBlock as any}
                        onUpdate={handleUpdate as any}
                        isPreviewMode={false}
                    />
                </Suspense>
            );

        case 'options-grid':
        case 'options-grid-inline':
            return (
                <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Carregando editor de opções...</div>}>
                    <OptionsGridPropertyEditor
                        block={selectedBlock as any}
                        onUpdate={handleUpdate as any}
                        isPreviewMode={false}
                    />
                </Suspense>
            );

        // ===== RESULT COMPONENTS (unified) =====
        case 'result-header-inline':
        case 'modular-result-header':
        case 'quiz-result-header':
        case 'quiz-result-style':
        case 'quiz-result-secondary':
        case 'result-card':
            return (
                <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Carregando editor de resultado...</div>}>
                    <ResultCommonPropertyEditor
                        block={selectedBlock as any}
                        onUpdate={handleUpdate as any}
                        isPreviewMode={false}
                    />
                </Suspense>
            );

        case 'options':
        case 'result':
        case 'quiz-result':
            return (
                <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Carregando editor de opções...</div>}>
                    <OptionsPropertyEditor
                        block={selectedBlock as any}
                        onUpdate={handleUpdate as any}
                        isPreviewMode={false}
                    />
                </Suspense>
            );

        case 'image':
        case 'image-display-inline':
            return (
                <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Carregando editor de imagem...</div>}>
                    <ImagePropertyEditor
                        block={selectedBlock as any}
                        onUpdate={handleUpdate as any}
                        isPreviewMode={false}
                    />
                </Suspense>
            );

        case 'form-container':
        case 'form-input':
            return (
                <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Carregando editor de formulário...</div>}>
                    <FormContainerPropertyEditor
                        block={selectedBlock as any}
                        onUpdate={handleUpdate as any}
                        isPreviewMode={false}
                    />
                </Suspense>
            );

        case 'lead-form':
            return (
                <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Carregando editor de lead form...</div>}>
                    <LeadFormPropertyEditor
                        block={selectedBlock as any}
                        onUpdate={handleUpdate as any}
                        onValidate={() => { }}
                        isPreviewMode={false}
                    />
                </Suspense>
            );

        case 'navigation':
        case 'nav':
        case 'menu':
            return (
                <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Carregando editor de navegação...</div>}>
                    <NavigationPropertyEditor
                        block={selectedBlock as any}
                        onUpdate={handleUpdate as any}
                        isPreviewMode={false}
                    />
                </Suspense>
            );

        case 'testimonial':
        case 'testimonials':
        case 'testimonial-card-inline':
        case 'testimonials-carousel-inline':
            return (
                <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Carregando editor de depoimento...</div>}>
                    <TestimonialPropertyEditor
                        block={selectedBlock as any}
                        onUpdate={handleUpdate as any}
                        isPreviewMode={false}
                    />
                </Suspense>
            );

        case 'mentor-section-inline':
            return (
                <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Carregando editor de mentora...</div>}>
                    <MentorPropertyEditor
                        block={selectedBlock as any}
                        onUpdate={handleUpdate as any}
                    />
                </Suspense>
            );

        case 'pricing':
        case 'pricing-card-inline':
            return (
                <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Carregando editor de preços...</div>}>
                    <PricingPropertyEditor
                        block={selectedBlock as any}
                        onUpdate={handleUpdate as any}
                        isPreviewMode={false}
                    />
                </Suspense>
            );

        default:
            // Fallback para o sistema genérico (mantém performance original)
            return null;
    }
});

SpecializedEditor.displayName = 'SpecializedEditor';

const PropertyField: React.FC<PropertyFieldProps> = memo(({ property, value, onChange, uniqueId }) => {
    const fieldId = `${uniqueId}-${property.key}`;

    const handleChange = useCallback((newValue: any) => {
        onChange(newValue);
    }, [onChange]);

    // Renderização baseada no tipo de propriedade
    switch (property.type) {
        case PropertyType.TEXT:
            return (
                <div className="space-y-2">
                    <Label htmlFor={fieldId} className="text-sm font-medium">
                        {property.label}
                    </Label>
                    <PropertyChangeIndicator>
                        <Input
                            id={fieldId}
                            type="text"
                            value={value || ''}
                            onChange={(e) => handleChange(e.target.value)}
                            placeholder={property.placeholder}
                        />
                    </PropertyChangeIndicator>
                </div>
            );

        case PropertyType.TEXTAREA:
            return (
                <div className="space-y-2">
                    <Label htmlFor={fieldId} className="text-sm font-medium">
                        {property.label}
                    </Label>
                    <PropertyChangeIndicator>
                        <Textarea
                            id={fieldId}
                            value={value || ''}
                            onChange={(e) => handleChange(e.target.value)}
                            placeholder={property.placeholder}
                            rows={3}
                        />
                    </PropertyChangeIndicator>
                </div>
            );

        case PropertyType.NUMBER:
            return (
                <div className="space-y-2">
                    <Label htmlFor={fieldId} className="text-sm font-medium">
                        {property.label}
                    </Label>
                    <PropertyChangeIndicator>
                        <Input
                            id={fieldId}
                            type="number"
                            value={value || 0}
                            onChange={(e) => handleChange(Number(e.target.value))}
                            min={property.min}
                            max={property.max}
                            step={property.step}
                        />
                    </PropertyChangeIndicator>
                </div>
            );

        case PropertyType.RANGE:
            return (
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label className="text-sm font-medium">
                            {property.label}
                        </Label>
                        <span className="text-sm text-muted-foreground">
                            {value || property.min || 0}{property.unit || ''}
                        </span>
                    </div>
                    <PropertyChangeIndicator>
                        <Suspense fallback={<div className="h-6 bg-muted rounded animate-pulse" />}>
                            <SizeSlider
                                value={value || property.min || 0}
                                onChange={handleChange}
                                min={property.min || 0}
                                max={property.max || 100}
                                step={property.step || 1}
                                label={property.label}
                            />
                        </Suspense>
                    </PropertyChangeIndicator>
                </div>
            );

        case PropertyType.COLOR:
            return (
                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        {property.label}
                    </Label>
                    <PropertyChangeIndicator>
                        <Suspense fallback={<div className="h-10 bg-muted rounded animate-pulse" />}>
                            <ColorPicker
                                value={value || property.defaultValue || '#000000'}
                                onChange={handleChange}
                                label={property.label}
                            />
                        </Suspense>
                    </PropertyChangeIndicator>
                </div>
            );

        case PropertyType.SWITCH:
            return (
                <div className="flex items-center justify-between">
                    <Label htmlFor={fieldId} className="text-sm font-medium">
                        {property.label}
                    </Label>
                    <PropertyChangeIndicator>
                        <Switch
                            id={fieldId}
                            checked={Boolean(value)}
                            onCheckedChange={handleChange}
                        />
                    </PropertyChangeIndicator>
                </div>
            );

        case PropertyType.SELECT:
            return (
                <div className="space-y-2">
                    <Label htmlFor={fieldId} className="text-sm font-medium">
                        {property.label}
                    </Label>
                    <PropertyChangeIndicator>
                        <Select value={value || ''} onValueChange={handleChange}>
                            <SelectTrigger id={fieldId} aria-label={property.label}>
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                {property.options?.map((option: any) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </PropertyChangeIndicator>
                </div>
            );

        default:
            return (
                <div className="space-y-2">
                    <Label htmlFor={fieldId} className="text-sm font-medium">
                        {property.label}
                    </Label>
                    <PropertyChangeIndicator>
                        <Input
                            id={fieldId}
                            type="text"
                            value={String(value || '')}
                            onChange={(e) => handleChange(e.target.value)}
                            placeholder={property.placeholder}
                        />
                    </PropertyChangeIndicator>
                </div>
            );
    }
});

PropertyField.displayName = 'PropertyField';

// ===== MAIN COMPONENT =====

export const SinglePropertiesPanel: React.FC<SinglePropertiesPanelProps> = memo(({
    selectedBlock,
    onUpdate,
    onDelete,
    onDuplicate,
}) => {
    // ID único para esta instância do painel
    const uniqueId = useId();

    // 🔍 DEBUG DETALHADO: Investigar desconexão do painel
    appLogger.debug('🔍 SinglePropertiesPanel - selectedBlock recebido:', {
        hasBlock: !!selectedBlock,
        blockId: selectedBlock?.id,
        blockType: selectedBlock?.type,
        properties: selectedBlock?.properties,
        content: selectedBlock?.content,
        fullBlock: selectedBlock,
    });

    appLogger.debug('🔍 DEBUG CRÍTICO - Análise detalhada do selectedBlock:', {
        selectedBlockExists: selectedBlock !== null && selectedBlock !== undefined,
        selectedBlockType: typeof selectedBlock,
        selectedBlockKeys: selectedBlock ? Object.keys(selectedBlock) : 'N/A',
        hasProperties: selectedBlock?.properties !== undefined,
        propertiesType: typeof selectedBlock?.properties,
        propertiesKeys: selectedBlock?.properties ? Object.keys(selectedBlock.properties) : 'N/A',
        propertiesValues: selectedBlock?.properties || 'N/A',
        hasContent: selectedBlock?.content !== undefined,
        contentType: typeof selectedBlock?.content,
        contentKeys: selectedBlock?.content ? Object.keys(selectedBlock.content) : 'N/A',
        contentValues: selectedBlock?.content || 'N/A',
    });

    const builderSchema = useMemo(() => {
        if (!selectedBlock) return null;
        try {
            const schema = schemaInterpreter.getBlockSchema(selectedBlock.type);
            if (schema) {
                appLogger.info('[SinglePropertiesPanel] Schema encontrado para builder', {
                    data: [{ blockType: selectedBlock.type }],
                });
            }
            return schema ?? null;
        } catch (error) {
            appLogger.warn('[SinglePropertiesPanel] Falha ao recuperar schema do builder', {
                data: [{ blockType: selectedBlock.type, error }],
            });
            return null;
        }
    }, [selectedBlock?.type]);

    if (selectedBlock && builderSchema) {
        return (
            <BuilderDrivenPanel
                block={selectedBlock}
                schema={builderSchema}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
            />
        );
    }

    // Hook otimizado de propriedades com debouncing
    const { updateProperty, getPropertiesByCategory } = useOptimizedUnifiedProperties({
        blockType: selectedBlock?.type || '',
        blockId: selectedBlock?.id,
        currentBlock: selectedBlock,
        onUpdate: onUpdate ? (_blockId: string, updates: any) => {
            appLogger.debug('🔄 SinglePropertiesPanel - enviando updates:', updates);
            // Adaptar para o formato esperado pelo editor atual
            onUpdate(updates.properties || updates);
        } : undefined,
    });

    // Debounced update para melhor performance
    const debouncedUpdateProperty = useDebouncedCallback(updateProperty, 300);

    // Organiza propriedades por categoria (usando função otimizada)
    const categorizedProperties = useMemo(() => {
        const categories = {
            content: getPropertiesByCategory('content'),
            style: getPropertiesByCategory('style'),
            layout: getPropertiesByCategory('layout'),
            behavior: getPropertiesByCategory('behavior'),
            advanced: getPropertiesByCategory('advanced'),
        };

        // Remove categorias vazias
        Object.keys(categories).forEach(key => {
            if (categories[key as keyof typeof categories].length === 0) {
                delete categories[key as keyof typeof categories];
            }
        });

        return categories;
    }, [getPropertiesByCategory]);

    // Handlers otimizados com debouncing
    const handlePropertyUpdate = useCallback((key: string, value: any) => {
        appLogger.debug('🚀 SinglePropertiesPanel handlePropertyUpdate:', { key, value });
        debouncedUpdateProperty(key, value);
    }, [debouncedUpdateProperty]);

    const handleContentUpdate = useCallback((key: string, value: any) => {
        appLogger.debug('🚀 SinglePropertiesPanel handleContentUpdate:', { key, value });
        // Para conteúdo, usar o mesmo update mas com indicação de categoria
        debouncedUpdateProperty(key, value);
    }, [debouncedUpdateProperty]);

    // 🔥 HÍBRIDO: Se tem editor especializado disponível, usar ele
    const hasSpecializedEditor = useMemo(() => {
        if (!selectedBlock) return false;
        const supportedTypes = [
            'header', 'quiz-intro-header', 'quiz-header',
            'question', 'quiz-question', 'quiz-question-inline',
            'button', 'cta', 'quiz-cta',
            'text', 'text-inline', 'headline', 'title',
            'options-grid', 'options-grid-inline',
            'options', 'result', 'quiz-result',
            'image', 'image-display-inline',
            'form-container', 'form-input', 'lead-form',
            'navigation', 'nav', 'menu',
            'testimonial', 'testimonials', 'testimonial-card-inline',
            'pricing', 'pricing-card-inline',
            // ✅ RESULT COMPONENTS - Componentes de resultado
            'result-header-inline', 'modular-result-header', 'quiz-result-header',
            'quiz-result-style', 'quiz-result-secondary', 'result-card',
        ];
        return supportedTypes.includes(selectedBlock.type);
    }, [selectedBlock?.type]);

    // Estado vazio
    if (!selectedBlock) {
        return (
            <Card className="h-full max-w-full overflow-hidden">
                <CardContent className="flex flex-col items-center justify-center h-full p-8">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Settings className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Selecione um Elemento</h3>
                    <p className="text-muted-foreground text-center">
                        Clique em um elemento no canvas para editar suas propriedades
                    </p>
                </CardContent>
            </Card>
        );
    }

    // 🔥 HÍBRIDO: Se tem editor especializado, renderizar ele
    if (hasSpecializedEditor && selectedBlock) {
        return (
            <div className="h-full flex flex-col">
                {/* Header híbrido */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold">Propriedades</h3>
                        <Badge variant="secondary" className="text-xs">
                            {selectedBlock.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            🔥 Especializado
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        {onDuplicate && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={onDuplicate}
                                className="h-8 px-2"
                                aria-label="Duplicar elemento"
                            >
                                <Copy className="h-3 w-3" />
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={onDelete}
                                className="h-8 px-2"
                                aria-label="Excluir elemento"
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Editor especializado */}
                <div className="flex-1 overflow-auto">
                    <SpecializedEditor
                        blockType={selectedBlock.type}
                        selectedBlock={selectedBlock}
                        onUpdate={onUpdate || (() => { })}
                    />
                </div>
            </div>
        );
    }

    // Fallback para sistema genérico (mantém performance original)

    return (
        <Card className="h-full max-w-full overflow-hidden flex flex-col">
            {/* Header */}
            <CardHeader className="pb-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                            <Settings className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <CardTitle className="text-lg truncate">Propriedades</CardTitle>
                            <p className="text-sm text-muted-foreground truncate">
                                {selectedBlock.type} • ID: {selectedBlock.id.slice(-6)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        {onDuplicate && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onDuplicate}
                                aria-label="Duplicar elemento"
                            >
                                <Copy className="w-4 h-4" />
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onDelete}
                                aria-label="Excluir elemento"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                    <div className="space-y-6">
                        {/* Renderiza propriedades por categoria */}
                        {Object.entries(categorizedProperties).map(([category, categoryProps]) => (
                            <div key={category} className="space-y-4">
                                <div className="flex items-center gap-2">
                                    {category === 'content' && <Type className="w-4 h-4" />}
                                    {category === 'style' && <Palette className="w-4 h-4" />}
                                    {category === 'layout' && <Layout className="w-4 h-4" />}
                                    {category === 'behavior' && <Settings className="w-4 h-4" />}
                                    {category === 'advanced' && <Settings className="w-4 h-4" />}

                                    <h3 className="text-sm font-semibold capitalize">{category}</h3>
                                    <Badge variant="secondary" className="text-xs">
                                        {categoryProps.length}
                                    </Badge>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    {categoryProps.map((property) => {
                                        const currentValue =
                                            selectedBlock.properties?.[property.key] ??
                                            selectedBlock.content?.[property.key] ??
                                            property.defaultValue;

                                        return (
                                            <PropertyField
                                                key={`${uniqueId}-${property.key}`}
                                                property={property}
                                                value={currentValue}
                                                onChange={(value) => {
                                                    // Decide se é property ou content baseado na categoria
                                                    if (category === 'content') {
                                                        handleContentUpdate(property.key, value);
                                                    } else {
                                                        handlePropertyUpdate(property.key, value);
                                                    }
                                                }}
                                                uniqueId={uniqueId}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});

SinglePropertiesPanel.displayName = 'SinglePropertiesPanel';

export default SinglePropertiesPanel;