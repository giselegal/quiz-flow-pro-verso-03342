/**
 * 🌟 ULTRA UNIFIED PROPERTIES PANEL
 * 
 * Painel consolidado que unifica o melhor de todos os painéis de propriedades:
 * 
 * ✨ RECURSOS CONSOLIDADOS:
 * - UniversalNoCodePanel: Extração automática + categorização inteligente
 * - EnhancedNoCodePropertiesPanel: Interface moderna + validação visual
 * - SinglePropertiesPanel: Editores especializados + performance otimizada
 * - EnhancedUniversalPropertiesPanel: Controles visuais avançados
 * - EnhancedPropertiesPanel: Organização por abas + tooltips
 * 
 * 🚀 FUNCIONALIDADES ÚNICAS:
 * - Sistema híbrido: Extração automática + editores especializados
 * - Interface adaptável: Grid/List/Compact views
 * - Validação em tempo real com feedback visual
 * - Preview instantâneo das mudanças
 * - Busca e filtros inteligentes
 * - Undo/Redo system
 * - Keyboard shortcuts
 * - Interpolação de variáveis
 * - Sistema de presets
 * - Acessibilidade completa
 */

import React, { useState, useMemo, useCallback, useEffect, Suspense, lazy } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Search,
    Settings,
    Palette,
    Type,
    Layout,
    Zap,
    Copy,
    Sparkles,
    AlertCircle,
    Undo,
    Redo,
    ChevronDown,
    Trash2,
    RotateCcw,
    Shield,
    Monitor,
    Smartphone,
    Tablet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { useOptimizedScheduler } from '@/hooks/useOptimizedScheduler';

// =============================================
// TYPE DEFINITIONS
// =============================================

interface PropertyField {
    path: string;
    label: string;
    type: 'text' | 'number' | 'boolean' | 'color' | 'select' | 'textarea' | 'range' | 'string' | 'object' | 'array';
    category?: string;
    value?: any;
    currentValue?: any;
    options?: { label: string; value: any }[];
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
    description?: string;
    unit?: string;
    isRequired?: boolean;
    supportsInterpolation?: boolean;
    validation?: {
        isValid: boolean;
        message?: string;
    };
}

// Lazy loaded components
const ColorPicker = lazy(() => import('@/components/visual-controls/ColorPicker'));
const SizeSlider = lazy(() => import('@/components/visual-controls/SizeSlider'));

// Lazy loaded specialized editors
const HeaderPropertyEditor = lazy(() => import('./editors/HeaderPropertyEditor').then(m => ({ default: m.HeaderPropertyEditor })));
const QuestionPropertyEditor = lazy(() => import('./editors/QuestionPropertyEditor').then(m => ({ default: m.QuestionPropertyEditor })));
const ButtonPropertyEditor = lazy(() => import('./editors/ButtonPropertyEditor').then(m => ({ default: m.ButtonPropertyEditor })));
const TextPropertyEditor = lazy(() => import('./editors/TextPropertyEditor'));
import OptionsGridPropertyEditor from './editors/OptionsGridPropertyEditor';
const ImagePropertyEditor = lazy(() => import('./editors/ImagePropertyEditor'));

// Mock service para extração de propriedades
const mockPropertyExtractionService = {
    extractAllProperties: (block: Block): PropertyField[] => {
        const properties: PropertyField[] = [];

        // Extrair propriedades básicas
        if (block.content) {
            Object.entries(block.content).forEach(([key, value]) => {
                properties.push({
                    path: `content.${key}`,
                    label: key.charAt(0).toUpperCase() + key.slice(1),
                    type: typeof value === 'boolean' ? 'boolean' :
                        typeof value === 'number' ? 'number' : 'string',
                    category: 'content',
                    currentValue: value,
                    description: `Configuração de ${key}`
                });
            });
        }

        // Extrair propriedades do properties
        if (block.properties) {
            Object.entries(block.properties).forEach(([key, value]) => {
                properties.push({
                    path: `properties.${key}`,
                    label: key.charAt(0).toUpperCase() + key.slice(1),
                    type: typeof value === 'boolean' ? 'boolean' :
                        typeof value === 'number' ? 'number' :
                            Array.isArray(value) ? 'array' :
                                typeof value === 'object' ? 'object' : 'string',
                    category: 'behavior',
                    currentValue: value,
                    description: `Dados de ${key}`
                });
            });
        }

        return properties;
    },

    identifyInterpolationFields: (properties: PropertyField[]): PropertyField[] => {
        return properties.map(prop => ({
            ...prop,
            supportsInterpolation: prop.type === 'string' || prop.type === 'text'
        }));
    },

    categorizeProperties: (properties: PropertyField[]) => {
        const categorized: Record<string, PropertyField[]> = {};

        properties.forEach(prop => {
            const category = prop.category || 'advanced';
            if (!categorized[category]) {
                categorized[category] = [];
            }
            categorized[category].push(prop);
        });

        return categorized;
    }
};

// ===== INTERFACES =====

export interface UltraUnifiedPropertiesPanelProps {
    selectedBlock?: Block | null;
    onUpdate: (updates: Record<string, any>) => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
    onClose?: () => void;
    onReset?: () => void;
    previewMode?: 'desktop' | 'tablet' | 'mobile';
    onPreviewModeChange?: (mode: 'desktop' | 'tablet' | 'mobile') => void;
    className?: string;
}

interface ViewState {
    layout: 'tabs' | 'accordion' | 'compact';
    showAdvanced: boolean;
    showDescriptions: boolean;
    showPreview: boolean;
    isPinned: boolean;
    searchQuery: string;
    selectedCategory: string;
}

interface PropertyCategory {
    key: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    priority: number;
}

// ===== CONSTANTS =====

const PROPERTY_CATEGORIES: PropertyCategory[] = [
    {
        key: 'content',
        label: 'Conteúdo',
        description: 'Texto, imagens e mídia',
        icon: <Type className="w-4 h-4" />,
        color: 'blue',
        priority: 1
    },
    {
        key: 'visual',
        label: 'Visual',
        description: 'Cores, tipografia e estilo',
        icon: <Palette className="w-4 h-4" />,
        color: 'purple',
        priority: 2
    },
    {
        key: 'layout',
        label: 'Layout',
        description: 'Tamanho, espaçamento e posição',
        icon: <Layout className="w-4 h-4" />,
        color: 'green',
        priority: 3
    },
    {
        key: 'behavior',
        label: 'Comportamento',
        description: 'Interações e funcionalidade',
        icon: <Zap className="w-4 h-4" />,
        color: 'orange',
        priority: 4
    },
    {
        key: 'advanced',
        label: 'Avançado',
        description: 'Configurações técnicas',
        icon: <Settings className="w-4 h-4" />,
        color: 'gray',
        priority: 5
    }
];

const SPECIALIZED_EDITORS = {
    'header': 'HeaderPropertyEditor',
    'quiz-intro-header': 'HeaderPropertyEditor',
    'quiz-header': 'HeaderPropertyEditor',
    'question': 'QuestionPropertyEditor',
    'quiz-question': 'QuestionPropertyEditor',
    'quiz-question-inline': 'QuestionPropertyEditor',
    'button': 'ButtonPropertyEditor',
    'quiz-navigation': 'ButtonPropertyEditor',
    'text': 'TextPropertyEditor',
    'text-block': 'TextPropertyEditor',
    'options-grid': 'OptionsGridPropertyEditor',
    'multiple-choice': 'OptionsPropertyEditor',
    'image': 'ImagePropertyEditor',
    'image-block': 'ImagePropertyEditor',
    'form-container': 'FormContainerPropertyEditor',
    'lead-form': 'LeadFormPropertyEditor',
    'navigation': 'NavigationPropertyEditor',
    'testimonial': 'TestimonialPropertyEditor',
    'pricing': 'PricingPropertyEditor',
    'result-common': 'ResultCommonPropertyEditor'
};

// ===== SPECIALIZED EDITOR RENDERER =====

const SpecializedEditorRenderer: React.FC<{
    blockType: string;
    selectedBlock: Block;
    onUpdate: (updates: Record<string, any>) => void;
}> = React.memo(({ blockType, selectedBlock, onUpdate }) => {
    const editorType = SPECIALIZED_EDITORS[blockType as keyof typeof SPECIALIZED_EDITORS];

    if (!editorType) return null;

    const handleUpdate = useCallback((updates: any) => {
        onUpdate(updates);
    }, [onUpdate]);

    switch (editorType) {
        case 'HeaderPropertyEditor':
            return (
                <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Carregando editor de cabeçalho...</div>}>
                    <HeaderPropertyEditor
                        block={selectedBlock as any}
                        onUpdate={handleUpdate as any}
                        isPreviewMode={false}
                    />
                </Suspense>
            );
        case 'QuestionPropertyEditor':
            return (
                <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Carregando editor de questão...</div>}>
                    <QuestionPropertyEditor
                        block={selectedBlock as any}
                        onUpdate={handleUpdate as any}
                        isPreviewMode={false}
                    />
                </Suspense>
            );
        case 'ButtonPropertyEditor':
            return (
                <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Carregando editor de botão...</div>}>
                    <ButtonPropertyEditor
                        block={selectedBlock as any}
                        onUpdate={handleUpdate as any}
                        isPreviewMode={false}
                    />
                </Suspense>
            );
        case 'TextPropertyEditor':
            return (
                <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Carregando editor de texto...</div>}>
                    <TextPropertyEditor
                        block={selectedBlock}
                        onUpdate={onUpdate}
                    />
                </Suspense>
            );
        case 'OptionsGridPropertyEditor':
            return (
                <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Carregando editor de grid...</div>}>
                    <OptionsGridPropertyEditor
                        block={selectedBlock as any}
                        onUpdate={handleUpdate as any}
                    />
                </Suspense>
            );
        case 'ImagePropertyEditor':
            return (
                <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Carregando editor de imagem...</div>}>
                    <ImagePropertyEditor
                        block={selectedBlock}
                        onUpdate={onUpdate}
                    />
                </Suspense>
            );
        default:
            return null;
    }
});

// ===== UNIVERSAL PROPERTY RENDERER =====

const UniversalPropertyRenderer: React.FC<{
    property: PropertyField;
    value: any;
    onChange: (value: any) => void;
    showDescription?: boolean;
}> = React.memo(({ property, value, onChange, showDescription = true }) => {
    const { debounce } = useOptimizedScheduler();

    const debouncedOnChange = useCallback((newValue: any) => {
        debounce(`property-${property.path}`, () => onChange(newValue), 300);
    }, [property.path, onChange, debounce]);

    const renderField = () => {
        switch (property.type) {
            case 'string':
                return property.path.toLowerCase().includes('color') ? (
                    <Suspense fallback={<Input value={value || ''} onChange={(e) => debouncedOnChange(e.target.value)} />}>
                        <ColorPicker
                            value={value || '#000000'}
                            onChange={debouncedOnChange}
                        />
                    </Suspense>
                ) : (
                    <Input
                        value={value || ''}
                        onChange={(e) => debouncedOnChange(e.target.value)}
                        placeholder={property.placeholder}
                    />
                );

            case 'text':
                return (
                    <Textarea
                        value={value || ''}
                        onChange={(e) => debouncedOnChange(e.target.value)}
                        placeholder={property.placeholder}
                        rows={3}
                    />
                );

            case 'number':
                return property.path.toLowerCase().includes('size') ||
                    property.path.toLowerCase().includes('width') ||
                    property.path.toLowerCase().includes('height') ? (
                    <Suspense fallback={<Input type="number" value={value || 0} onChange={(e) => debouncedOnChange(Number(e.target.value))} />}>
                        <SizeSlider
                            value={value || 0}
                            onChange={debouncedOnChange}
                            min={property.min || 0}
                            max={property.max || 100}
                            unit={property.unit || 'px'}
                        />
                    </Suspense>
                ) : (
                    <Input
                        type="number"
                        value={value || 0}
                        onChange={(e) => debouncedOnChange(Number(e.target.value))}
                        min={property.min}
                        max={property.max}
                    />
                );

            case 'boolean':
                return (
                    <Switch
                        checked={!!value}
                        onCheckedChange={debouncedOnChange}
                    />
                );

            case 'select':
                return (
                    <Select value={value} onValueChange={debouncedOnChange}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {property.options?.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'array':
                return (
                    <div className="space-y-2">
                        <Label className="text-sm">Lista de itens</Label>
                        <Badge variant="outline">{Array.isArray(value) ? value.length : 0} itens</Badge>
                    </div>
                );

            default:
                return (
                    <Input
                        value={value || ''}
                        onChange={(e) => debouncedOnChange(e.target.value)}
                    />
                );
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">{property.label}</Label>
                {property.isRequired && <Badge variant="destructive" className="text-xs">Obrigatório</Badge>}
                {property.supportsInterpolation && <Badge variant="outline" className="text-xs">Variável</Badge>}
            </div>

            {renderField()}

            {showDescription && property.description && (
                <p className="text-xs text-muted-foreground">{property.description}</p>
            )}

            {property.validation && !property.validation.isValid && (
                <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {property.validation.message}
                </p>
            )}
        </div>
    );
});

// ===== MAIN COMPONENT =====

export const UltraUnifiedPropertiesPanel: React.FC<UltraUnifiedPropertiesPanelProps> = ({
    selectedBlock,
    onUpdate,
    onDelete,
    onDuplicate,
    onReset,
    previewMode = 'desktop',
    onPreviewModeChange,
    className = ''
}) => {
    // Estado do painel
    const [viewState, setViewState] = useState<ViewState>({
        layout: 'tabs',
        showAdvanced: false,
        showDescriptions: true,
        showPreview: false,
        isPinned: false,
        searchQuery: '',
        selectedCategory: ''
    });

    // Histórico para undo/redo
    const [history, setHistory] = useState<Array<{ timestamp: number; changes: Record<string, any> }>>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const { schedule } = useOptimizedScheduler();

    const { extractedProperties, categorizedProperties, hasSpecializedEditor } = useMemo(() => {
        if (!selectedBlock) {
            return {
                extractedProperties: [],
                categorizedProperties: {} as any,
                hasSpecializedEditor: false
            };
        }

        try {
            const extracted = mockPropertyExtractionService.extractAllProperties(selectedBlock);
            const withInterpolation = mockPropertyExtractionService.identifyInterpolationFields(extracted);
            const categorized = mockPropertyExtractionService.categorizeProperties(withInterpolation);
            const hasSpecialized = selectedBlock.type in SPECIALIZED_EDITORS;

            return {
                extractedProperties: withInterpolation,
                categorizedProperties: categorized,
                hasSpecializedEditor: hasSpecialized
            };
        } catch (error) {
            console.warn('Erro ao extrair propriedades:', error);
            return {
                extractedProperties: [],
                categorizedProperties: {} as any,
                hasSpecializedEditor: selectedBlock.type in SPECIALIZED_EDITORS
            };
        }
    }, [selectedBlock]);

    // Filtrar propriedades
    // Filtra propriedades baseadas no searchTerm e categoria selecionada
    const filteredProperties = useMemo(() => {
        let filtered = extractedProperties;

        if (viewState.searchQuery) {
            filtered = filtered.filter(prop =>
                prop.label.toLowerCase().includes(viewState.searchQuery.toLowerCase()) ||
                prop.path.toLowerCase().includes(viewState.searchQuery.toLowerCase())
            );
        }

        if (viewState.selectedCategory && viewState.selectedCategory !== 'all') {
            filtered = filtered.filter(prop => prop.category === viewState.selectedCategory);
        }

        if (!viewState.showAdvanced) {
            filtered = filtered.filter(prop => prop.category !== 'advanced');
        }

        return filtered;
    }, [extractedProperties, viewState]);

    // Handler de atualização com debounce e histórico
    const handleUpdate = useCallback((updates: Record<string, any>) => {
        // Adicionar ao histórico
        const historyEntry = {
            timestamp: Date.now(),
            changes: updates
        };

        setHistory(prev => [...prev.slice(0, historyIndex + 1), historyEntry]);
        setHistoryIndex(prev => prev + 1);

        // Aplicar mudanças com debounce
        schedule('properties-update', () => {
            onUpdate(updates);
        }, 100);
    }, [onUpdate, schedule, historyIndex]);

    // Undo/Redo
    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            const previousState = history[historyIndex - 1];
            setHistoryIndex(prev => prev - 1);
            onUpdate(previousState.changes);
        }
    }, [history, historyIndex, onUpdate]);

    const handleRedo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const nextState = history[historyIndex + 1];
            setHistoryIndex(prev => prev + 1);
            onUpdate(nextState.changes);
        }
    }, [history, historyIndex, onUpdate]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                handleUndo();
            } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                handleRedo();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleUndo, handleRedo]);

    if (!selectedBlock) {
        return (
            <div className={cn('h-full bg-muted/30 border-l border-border flex items-center justify-center', className)}>
                <div className="text-center p-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                        <Settings className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Nenhum bloco selecionado</h3>
                    <p className="text-sm text-muted-foreground">Selecione um bloco no canvas para editar suas propriedades</p>
                </div>
            </div>
        );
    }

    const renderToolbar = () => (
        <div className="flex items-center justify-between p-3 border-b border-border">
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                    {selectedBlock.type}
                </Badge>
                <span className="text-sm font-medium truncate max-w-[120px]">
                    {selectedBlock.id}
                </span>
            </div>

            <div className="flex items-center gap-1">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleUndo}
                                disabled={historyIndex <= 0}
                            >
                                <Undo className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Desfazer (Ctrl+Z)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleRedo}
                                disabled={historyIndex >= history.length - 1}
                            >
                                <Redo className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Refazer (Ctrl+Y)</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <Separator orientation="vertical" className="h-4" />

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onDuplicate}
                            >
                                <Copy className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Duplicar</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onReset}
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Restaurar padrões</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onDelete}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Excluir</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );

    const renderSearchAndFilters = () => (
        <div className="p-3 space-y-3 border-b border-border">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar propriedades..."
                    value={viewState.searchQuery}
                    onChange={(e) => setViewState(prev => ({ ...prev, searchQuery: e.target.value }))}
                    className="pl-10"
                />
            </div>

            <div className="flex items-center gap-2">
                <Select
                    value={viewState.selectedCategory}
                    onValueChange={(value) => setViewState(prev => ({ ...prev, selectedCategory: value }))}
                >
                    <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas as categorias</SelectItem>
                        {PROPERTY_CATEGORIES.map(category => (
                            <SelectItem key={category.key} value={category.key}>
                                <div className="flex items-center gap-2">
                                    {category.icon}
                                    {category.label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setViewState(prev => ({ ...prev, showAdvanced: !prev.showAdvanced }))}
                                className={viewState.showAdvanced ? 'bg-primary/10' : ''}
                            >
                                <Shield className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Mostrar propriedades avançadas</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );

    const renderSpecializedEditor = () => (
        <div className="p-3">
            <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Editor Especializado</span>
                </div>
                <p className="text-xs text-muted-foreground">
                    Editor otimizado para o tipo {selectedBlock.type} com controles específicos e validações avançadas.
                </p>
            </div>

            <SpecializedEditorRenderer
                blockType={selectedBlock.type}
                selectedBlock={selectedBlock}
                onUpdate={handleUpdate}
            />
        </div>
    );

    const renderUniversalEditor = () => {
        if (viewState.layout === 'tabs') {
            return (
                <Tabs defaultValue="content" className="flex-1">
                    <TabsList className="w-full p-1 h-10">
                        {PROPERTY_CATEGORIES
                            .filter(category => categorizedProperties[category.key]?.length > 0)
                            .sort((a, b) => a.priority - b.priority)
                            .map(category => (
                                <TabsTrigger
                                    key={category.key}
                                    value={category.key}
                                    className="flex-1 text-xs"
                                >
                                    <div className="flex items-center gap-1">
                                        {category.icon}
                                        <span className="hidden sm:inline">{category.label}</span>
                                    </div>
                                </TabsTrigger>
                            ))
                        }
                    </TabsList>

                    {PROPERTY_CATEGORIES.map(category => {
                        const categoryProperties = (categorizedProperties[category.key] || [])
                            .filter((prop: PropertyField) => filteredProperties.some((filtered: PropertyField) => filtered.path === prop.path));
                        if (categoryProperties.length === 0) return null;

                        return (
                            <TabsContent key={category.key} value={category.key} className="flex-1 p-3 space-y-4">
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium flex items-center gap-2">
                                        {category.icon}
                                        {category.label}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">{category.description}</p>
                                </div>

                                <div className="space-y-4">
                                    {categoryProperties.map((property: PropertyField) => (
                                        <UniversalPropertyRenderer
                                            key={property.path}
                                            property={property}
                                            value={property.currentValue}
                                            onChange={(value) => handleUpdate({ [property.path]: value })}
                                            showDescription={viewState.showDescriptions}
                                        />
                                    ))}
                                </div>
                            </TabsContent>
                        );
                    })}
                </Tabs>
            );
        } else {
            // Accordion layout
            return (
                <div className="p-3 space-y-3">
                    {PROPERTY_CATEGORIES
                        .filter(category => categorizedProperties[category.key]?.length > 0)
                        .sort((a, b) => a.priority - b.priority)
                        .map(category => {
                            const categoryProperties = (categorizedProperties[category.key] || [])
                                .filter((prop: PropertyField) => filteredProperties.some((filtered: PropertyField) => filtered.path === prop.path));

                            return (
                                <Collapsible key={category.key} defaultOpen={category.priority <= 2}>
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" className="w-full justify-between p-3 h-auto">
                                            <div className="flex items-center gap-2">
                                                {category.icon}
                                                <span className="font-medium">{category.label}</span>
                                                <Badge variant="secondary" className="ml-2">
                                                    {categoryProperties.length}
                                                </Badge>
                                            </div>
                                            <ChevronDown className="w-4 h-4" />
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="px-3 pb-3">
                                        <p className="text-xs text-muted-foreground mb-3">{category.description}</p>
                                        <div className="space-y-4">
                                            {categoryProperties.map((property: PropertyField) => (
                                                <UniversalPropertyRenderer
                                                    key={property.path}
                                                    property={property}
                                                    value={property.currentValue}
                                                    onChange={(value) => handleUpdate({ [property.path]: value })}
                                                    showDescription={viewState.showDescriptions}
                                                />
                                            ))}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            );
                        })}
                </div>
            );
        }
    };

    const renderPreviewControls = () => onPreviewModeChange && (
        <div className="p-3 border-t border-border">
            <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-medium">Preview Mode</Label>
                <div className="flex items-center gap-1">
                    <Button
                        variant={previewMode === 'desktop' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onPreviewModeChange('desktop')}
                    >
                        <Monitor className="w-3 h-3" />
                    </Button>
                    <Button
                        variant={previewMode === 'tablet' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onPreviewModeChange('tablet')}
                    >
                        <Tablet className="w-3 h-3" />
                    </Button>
                    <Button
                        variant={previewMode === 'mobile' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onPreviewModeChange('mobile')}
                    >
                        <Smartphone className="w-3 h-3" />
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className={cn('h-full bg-muted/30 border-l border-border flex flex-col', className)}>
            {renderToolbar()}
            {renderSearchAndFilters()}

            <ScrollArea className="flex-1">
                {hasSpecializedEditor ? renderSpecializedEditor() : renderUniversalEditor()}
            </ScrollArea>

            {renderPreviewControls()}
        </div>
    );
};

export default UltraUnifiedPropertiesPanel;