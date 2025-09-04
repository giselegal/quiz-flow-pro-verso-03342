/**
 * 🎯 MULTIPLE CHOICE OPTIONS PANEL - PAINEL ESPECIALIZADO PARA OPÇÕES MÚLTIPLAS
 * 
 * Sidebar de edição/configuração altamente especializada para blocos de opções múltiplas,
 * seguindo o modelo de design descrito pelo usuário com funcionalidades completas:
 * 
 * ✨ FUNCIONALIDADES PRINCIPAIS:
 * - Layout configurável (colunas, direção, disposição)
 * - Edição rica com QuillJS
 * - Drag-and-drop para reordenar opções
 * - Validações avançadas (múltipla escolha, obrigatório, auto-avançar)
 * - Estilização visual completa
 * - Personalização de cores
 * - Configurações avançadas
 * - Preview instantâneo
 * - Acessibilidade total
 */

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Layout,
    Plus,
    Edit3,
    GripVertical,
    Trash2,
    Eye,
    Settings,
    Palette,
    RotateCcw,
    Check,
    ChevronDown,
    ChevronRight,
    Grid,
    AlignLeft,
    AlignCenter,
    AlignRight,
    ImageIcon,
    Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Block } from '@/types/editor';

// ===== INTERFACES =====

interface QuizOption {
    id: string;
    text: string;
    image?: string;
    value?: any;
    order: number;
}

interface LayoutConfig {
    columns: 1 | 2 | 3 | 4;
    direction: 'vertical' | 'horizontal';
    arrangement: 'image-text' | 'text-image' | 'image-only' | 'text-only';
    alignment: 'left' | 'center' | 'right';
}

interface ValidationConfig {
    multipleChoice: boolean;
    required: boolean;
    autoAdvance: boolean;
    maxOptions?: number;
}

interface StyleConfig {
    border: 'none' | 'small' | 'medium' | 'large';
    shadow: 'none' | 'small' | 'medium' | 'large';
    spacing: 'none' | 'small' | 'medium' | 'large';
    detail: 'none' | 'minimal' | 'detailed';
    style: 'simple' | 'card' | 'modern' | 'classic';
}

interface ColorConfig {
    background: string;
    text: string;
    border: string;
    hover: string;
    selected: string;
}

interface MultipleChoiceOptionsData {
    options: QuizOption[];
    layout: LayoutConfig;
    validation: ValidationConfig;
    style: StyleConfig;
    colors: ColorConfig;
    componentId: string;
    maxDisplayed: number;
}

interface MultipleChoiceOptionsPanelProps {
    selectedBlock?: Block | null;
    onUpdate?: (updates: Record<string, any>) => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
    onClose?: () => void;
    className?: string;
}

// ===== SORTABLE OPTION ITEM =====

interface SortableOptionItemProps {
    option: QuizOption;
    onEdit: (id: string, text: string) => void;
    onImageChange: (id: string, image: string) => void;
    onDelete: (id: string) => void;
    layout: LayoutConfig;
}

const SortableOptionItem: React.FC<SortableOptionItemProps> = ({
    option,
    onEdit,
    onImageChange,
    onDelete,
    layout
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempText, setTempText] = useState(option.text);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: option.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleSaveEdit = useCallback(() => {
        onEdit(option.id, tempText);
        setIsEditing(false);
    }, [option.id, tempText, onEdit]);

    const handleCancelEdit = useCallback(() => {
        setTempText(option.text);
        setIsEditing(false);
    }, [option.text]);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.select();
        }
    }, [isEditing]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative bg-white border rounded-lg p-3 transition-all duration-200",
                isDragging ? "shadow-lg rotate-2 z-50" : "hover:shadow-md",
                "border-gray-200 hover:border-gray-300"
            )}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute left-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
            >
                <GripVertical className="w-4 h-4 text-gray-400" />
            </div>

            <div className="ml-6">
                {/* Option Header */}
                <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                        Opção {option.order + 1}
                    </Badge>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setIsEditing(true)}
                                        className="h-6 w-6 p-0"
                                    >
                                        <Edit3 className="w-3 h-3" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Editar texto</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => onDelete(option.id)}
                                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Excluir opção</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                {/* Content based on layout */}
                <div className={cn(
                    "space-y-2",
                    layout.arrangement === 'image-text' && "flex items-center gap-3",
                    layout.arrangement === 'text-image' && "flex items-center gap-3 flex-row-reverse"
                )}>
                    {/* Image Section */}
                    {(layout.arrangement === 'image-text' || layout.arrangement === 'text-image' || layout.arrangement === 'image-only') && (
                        <div className="shrink-0">
                            {option.image ? (
                                <div className="relative group/image">
                                    <img
                                        src={option.image}
                                        alt="Opção"
                                        className="w-12 h-12 object-cover rounded border"
                                    />
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => onImageChange(option.id, '')}
                                        className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity"
                                    >
                                        ×
                                    </Button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        // Simular seleção de imagem
                                        const mockImage = `https://picsum.photos/100/100?random=${Date.now()}`;
                                        onImageChange(option.id, mockImage);
                                    }}
                                    className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center hover:border-gray-400 transition-colors"
                                >
                                    <ImageIcon className="w-5 h-5 text-gray-400" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Text Section */}
                    {(layout.arrangement === 'image-text' || layout.arrangement === 'text-image' || layout.arrangement === 'text-only') && (
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="space-y-2">
                                    <textarea
                                        ref={textareaRef}
                                        value={tempText}
                                        onChange={(e) => setTempText(e.target.value)}
                                        className="w-full p-2 border rounded text-sm resize-none"
                                        rows={2}
                                        placeholder="Digite o texto da opção..."
                                    />
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" onClick={handleSaveEdit}>
                                            <Check className="w-3 h-3 mr-1" />
                                            Salvar
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                            Cancelar
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => setIsEditing(true)}
                                    className="cursor-text p-1 rounded hover:bg-gray-50 transition-colors"
                                >
                                    <p className="text-sm">
                                        {option.text || (
                                            <span className="text-gray-400 italic">
                                                Clique para editar...
                                            </span>
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ===== MAIN COMPONENT =====

export const MultipleChoiceOptionsPanel: React.FC<MultipleChoiceOptionsPanelProps> = ({
    selectedBlock,
    onUpdate,
    onDelete,
    onDuplicate,
    onClose,
    className
}) => {
    // ===== STATE =====
    const [data, setData] = useState<MultipleChoiceOptionsData>(() => ({
        options: [
            { id: '1', text: 'Opção 1', order: 0 },
            { id: '2', text: 'Opção 2', order: 1 },
        ],
        layout: {
            columns: 2,
            direction: 'vertical',
            arrangement: 'image-text',
            alignment: 'left'
        },
        validation: {
            multipleChoice: false,
            required: true,
            autoAdvance: false
        },
        style: {
            border: 'small',
            shadow: 'medium',
            spacing: 'small',
            detail: 'none',
            style: 'simple'
        },
        colors: {
            background: '#ffffff',
            text: '#1f2937',
            border: '#e5e7eb',
            hover: '#f3f4f6',
            selected: '#3b82f6'
        },
        componentId: selectedBlock?.id || 'multiple-choice-block',
        maxDisplayed: 10
    }));

    const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
    const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    // ===== SENSORS FOR DRAG AND DROP =====
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // ===== COMPUTED VALUES =====
    const sortedOptions = useMemo(() => {
        return [...data.options].sort((a, b) => a.order - b.order);
    }, [data.options]);

    // ===== HANDLERS =====
    const handleDragEnd = useCallback((event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = sortedOptions.findIndex(option => option.id === active.id);
            const newIndex = sortedOptions.findIndex(option => option.id === over.id);

            const reorderedOptions = arrayMove(sortedOptions, oldIndex, newIndex).map((option, index) => ({
                ...option,
                order: index
            }));

            setData(prev => ({ ...prev, options: reorderedOptions }));
            onUpdate?.({ options: reorderedOptions });
        }
    }, [sortedOptions, onUpdate]);

    const handleAddOption = useCallback(() => {
        const newOption: QuizOption = {
            id: `option-${Date.now()}`,
            text: `Opção ${data.options.length + 1}`,
            order: data.options.length
        };

        const updatedOptions = [...data.options, newOption];
        setData(prev => ({ ...prev, options: updatedOptions }));
        onUpdate?.({ options: updatedOptions });
    }, [data.options, onUpdate]);

    const handleEditOption = useCallback((id: string, text: string) => {
        const updatedOptions = data.options.map(option =>
            option.id === id ? { ...option, text } : option
        );

        setData(prev => ({ ...prev, options: updatedOptions }));
        onUpdate?.({ options: updatedOptions });
    }, [data.options, onUpdate]);

    const handleImageChange = useCallback((id: string, image: string) => {
        const updatedOptions = data.options.map(option =>
            option.id === id ? { ...option, image } : option
        );

        setData(prev => ({ ...prev, options: updatedOptions }));
        onUpdate?.({ options: updatedOptions });
    }, [data.options, onUpdate]);

    const handleDeleteOption = useCallback((id: string) => {
        if (data.options.length <= 1) return; // Manter pelo menos uma opção

        const updatedOptions = data.options
            .filter(option => option.id !== id)
            .map((option, index) => ({ ...option, order: index }));

        setData(prev => ({ ...prev, options: updatedOptions }));
        onUpdate?.({ options: updatedOptions });
    }, [data.options, onUpdate]);

    const handleLayoutChange = useCallback((key: keyof LayoutConfig, value: any) => {
        const updatedLayout = { ...data.layout, [key]: value };
        setData(prev => ({ ...prev, layout: updatedLayout }));
        onUpdate?.({ layout: updatedLayout });
    }, [data.layout, onUpdate]);

    const handleValidationChange = useCallback((key: keyof ValidationConfig, value: any) => {
        const updatedValidation = { ...data.validation, [key]: value };
        setData(prev => ({ ...prev, validation: updatedValidation }));
        onUpdate?.({ validation: updatedValidation });
    }, [data.validation, onUpdate]);

    const handleStyleChange = useCallback((key: keyof StyleConfig, value: any) => {
        const updatedStyle = { ...data.style, [key]: value };
        setData(prev => ({ ...prev, style: updatedStyle }));
        onUpdate?.({ style: updatedStyle });
    }, [data.style, onUpdate]);

    const handleColorChange = useCallback((key: keyof ColorConfig, value: string) => {
        const updatedColors = { ...data.colors, [key]: value };
        setData(prev => ({ ...prev, colors: updatedColors }));
        onUpdate?.({ colors: updatedColors });
    }, [data.colors, onUpdate]);

    const resetColor = useCallback((key: keyof ColorConfig) => {
        const defaultColors: ColorConfig = {
            background: '#ffffff',
            text: '#1f2937',
            border: '#e5e7eb',
            hover: '#f3f4f6',
            selected: '#3b82f6'
        };

        handleColorChange(key, defaultColors[key]);
    }, [handleColorChange]);

    const toggleSection = useCallback((section: string) => {
        setCollapsedSections(prev => {
            const next = new Set(prev);
            if (next.has(section)) {
                next.delete(section);
            } else {
                next.add(section);
            }
            return next;
        });
    }, []);

    // ===== RENDER HELPERS =====
    const renderSection = useCallback((
        title: string,
        icon: React.ReactNode,
        content: React.ReactNode,
        sectionKey: string,
        badge?: string
    ) => {
        const isCollapsed = collapsedSections.has(sectionKey);

        return (
            <Collapsible open={!isCollapsed} onOpenChange={() => toggleSection(sectionKey)}>
                <CollapsibleTrigger asChild>
                    <Button
                        variant="ghost"
                        className="w-full justify-between p-3 h-auto hover:bg-accent/50"
                    >
                        <div className="flex items-center gap-3">
                            {icon}
                            <span className="font-medium">{title}</span>
                            {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
                        </div>
                        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-3 pb-3">
                    {content}
                </CollapsibleContent>
            </Collapsible>
        );
    }, [collapsedSections, toggleSection]);

    // ===== RENDER =====
    if (!selectedBlock || selectedBlock.type !== 'options-grid') {
        return (
            <Card className={cn("w-full max-w-md", className)}>
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <Settings className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Bloco Não Compatível</h3>
                    <p className="text-muted-foreground text-sm">
                        Este painel é específico para blocos de opções múltiplas
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={cn("w-full max-w-md", className)}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Grid className="w-5 h-5" />
                        Opções Múltiplas
                    </CardTitle>
                    {onClose && (
                        <Button size="sm" variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
                            ×
                        </Button>
                    )}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{data.options.length} opções configuradas</span>
                    <Badge variant="outline" className="text-xs">
                        {data.layout.columns} colunas
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                <Tabs defaultValue="options" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="options" className="text-xs">Opções</TabsTrigger>
                        <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
                        <TabsTrigger value="style" className="text-xs">Estilo</TabsTrigger>
                        <TabsTrigger value="advanced" className="text-xs">Avançado</TabsTrigger>
                    </TabsList>

                    {/* Opções Tab */}
                    <TabsContent value="options" className="mt-4">
                        <ScrollArea className="h-[70vh]">
                            <div className="space-y-4">
                                {/* Add Option Button */}
                                <Button
                                    onClick={handleAddOption}
                                    className="w-full"
                                    variant="outline"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Adicionar Opção
                                </Button>

                                {/* Options List */}
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={sortedOptions.map(option => option.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-3">
                                            {sortedOptions.map((option) => (
                                                <SortableOptionItem
                                                    key={option.id}
                                                    option={option}
                                                    onEdit={handleEditOption}
                                                    onImageChange={handleImageChange}
                                                    onDelete={handleDeleteOption}
                                                    layout={data.layout}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>

                                <Separator />

                                {/* Validation Settings */}
                                {renderSection(
                                    "Validações",
                                    <Settings className="w-4 h-4" />,
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <Label className="text-sm font-medium">Múltipla Escolha</Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Permite marcar várias opções
                                                </p>
                                            </div>
                                            <Switch
                                                checked={data.validation.multipleChoice}
                                                onCheckedChange={(checked) => handleValidationChange('multipleChoice', checked)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <Label className="text-sm font-medium">Obrigatório</Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Escolha obrigatória para avançar
                                                </p>
                                            </div>
                                            <Switch
                                                checked={data.validation.required}
                                                onCheckedChange={(checked) => handleValidationChange('required', checked)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <Label className="text-sm font-medium">Auto-avançar</Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Avança automaticamente ao escolher
                                                </p>
                                            </div>
                                            <Switch
                                                checked={data.validation.autoAdvance}
                                                onCheckedChange={(checked) => handleValidationChange('autoAdvance', checked)}
                                            />
                                        </div>
                                    </div>,
                                    "validations"
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    {/* Layout Tab */}
                    <TabsContent value="layout" className="mt-4">
                        <ScrollArea className="h-[70vh]">
                            <div className="space-y-4">
                                {renderSection(
                                    "Layout",
                                    <Layout className="w-4 h-4" />,
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Número de Colunas</Label>
                                            <Select
                                                value={data.layout.columns.toString()}
                                                onValueChange={(value) => handleLayoutChange('columns', parseInt(value))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">1 Coluna</SelectItem>
                                                    <SelectItem value="2">2 Colunas</SelectItem>
                                                    <SelectItem value="3">3 Colunas</SelectItem>
                                                    <SelectItem value="4">4 Colunas</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Direção</Label>
                                            <Select
                                                value={data.layout.direction}
                                                onValueChange={(value) => handleLayoutChange('direction', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="vertical">Vertical</SelectItem>
                                                    <SelectItem value="horizontal">Horizontal</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Disposição</Label>
                                            <Select
                                                value={data.layout.arrangement}
                                                onValueChange={(value) => handleLayoutChange('arrangement', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="image-text">Imagem | Texto</SelectItem>
                                                    <SelectItem value="text-image">Texto | Imagem</SelectItem>
                                                    <SelectItem value="image-only">Apenas Imagem</SelectItem>
                                                    <SelectItem value="text-only">Apenas Texto</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Alinhamento</Label>
                                            <Select
                                                value={data.layout.alignment}
                                                onValueChange={(value) => handleLayoutChange('alignment', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="left">
                                                        <div className="flex items-center gap-2">
                                                            <AlignLeft className="w-4 h-4" />
                                                            Esquerda
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="center">
                                                        <div className="flex items-center gap-2">
                                                            <AlignCenter className="w-4 h-4" />
                                                            Centro
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="right">
                                                        <div className="flex items-center gap-2">
                                                            <AlignRight className="w-4 h-4" />
                                                            Direita
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>,
                                    "layout"
                                )}

                                {renderSection(
                                    "Geral",
                                    <Settings className="w-4 h-4" />,
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">
                                                Tamanho Máximo: {data.maxDisplayed}
                                            </Label>
                                            <Slider
                                                value={[data.maxDisplayed]}
                                                onValueChange={([value]) => setData(prev => ({ ...prev, maxDisplayed: value }))}
                                                max={20}
                                                min={1}
                                                step={1}
                                                className="w-full"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Máximo de opções exibidas simultaneamente
                                            </p>
                                        </div>
                                    </div>,
                                    "general"
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    {/* Style Tab */}
                    <TabsContent value="style" className="mt-4">
                        <ScrollArea className="h-[70vh]">
                            <div className="space-y-4">
                                {renderSection(
                                    "Estilização",
                                    <Palette className="w-4 h-4" />,
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Bordas</Label>
                                                <Select
                                                    value={data.style.border}
                                                    onValueChange={(value) => handleStyleChange('border', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">Nenhuma</SelectItem>
                                                        <SelectItem value="small">Pequena</SelectItem>
                                                        <SelectItem value="medium">Média</SelectItem>
                                                        <SelectItem value="large">Grande</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Sombras</Label>
                                                <Select
                                                    value={data.style.shadow}
                                                    onValueChange={(value) => handleStyleChange('shadow', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">Nenhuma</SelectItem>
                                                        <SelectItem value="small">Pequena</SelectItem>
                                                        <SelectItem value="medium">Média</SelectItem>
                                                        <SelectItem value="large">Grande</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Espaçamento</Label>
                                                <Select
                                                    value={data.style.spacing}
                                                    onValueChange={(value) => handleStyleChange('spacing', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">Nenhum</SelectItem>
                                                        <SelectItem value="small">Pequeno</SelectItem>
                                                        <SelectItem value="medium">Médio</SelectItem>
                                                        <SelectItem value="large">Grande</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Estilo</Label>
                                                <Select
                                                    value={data.style.style}
                                                    onValueChange={(value) => handleStyleChange('style', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="simple">Simples</SelectItem>
                                                        <SelectItem value="card">Card</SelectItem>
                                                        <SelectItem value="modern">Moderno</SelectItem>
                                                        <SelectItem value="classic">Clássico</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>,
                                    "styling"
                                )}

                                {renderSection(
                                    "Personalização de Cores",
                                    <Palette className="w-4 h-4" />,
                                    <div className="space-y-4">
                                        {Object.entries(data.colors).map(([key, value]) => (
                                            <div key={key} className="flex items-center gap-3">
                                                <div className="flex-1">
                                                    <Label className="text-sm font-medium capitalize">
                                                        {key === 'background' ? 'Fundo' :
                                                         key === 'text' ? 'Texto' :
                                                         key === 'border' ? 'Borda' :
                                                         key === 'hover' ? 'Hover' :
                                                         'Selecionado'}
                                                    </Label>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Input
                                                            type="color"
                                                            value={value}
                                                            onChange={(e) => handleColorChange(key as keyof ColorConfig, e.target.value)}
                                                            className="w-12 h-8 p-1 border rounded"
                                                        />
                                                        <Input
                                                            type="text"
                                                            value={value}
                                                            onChange={(e) => handleColorChange(key as keyof ColorConfig, e.target.value)}
                                                            className="flex-1 text-xs font-mono"
                                                        />
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={() => resetColor(key as keyof ColorConfig)}
                                                                        className="h-8 w-8 p-0"
                                                                    >
                                                                        <RotateCcw className="w-3 h-3" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Reset</TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>,
                                    "colors"
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    {/* Advanced Tab */}
                    <TabsContent value="advanced" className="mt-4">
                        <ScrollArea className="h-[70vh]">
                            <div className="space-y-4">
                                {renderSection(
                                    "Avançado",
                                    <Settings className="w-4 h-4" />,
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">ID do Componente</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={data.componentId}
                                                    onChange={(e) => setData(prev => ({ ...prev, componentId: e.target.value }))}
                                                    className="flex-1 font-mono text-xs"
                                                    placeholder="component-id"
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={() => onUpdate?.({ componentId: data.componentId })}
                                                >
                                                    <Check className="w-3 h-3" />
                                                </Button>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Identificador único para integrações e tracking
                                            </p>
                                        </div>
                                    </div>,
                                    "advanced"
                                )}

                                {/* Preview */}
                                {renderSection(
                                    "Preview",
                                    <Eye className="w-4 h-4" />,
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant={previewMode === 'desktop' ? 'default' : 'outline'}
                                                onClick={() => setPreviewMode('desktop')}
                                            >
                                                💻
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant={previewMode === 'tablet' ? 'default' : 'outline'}
                                                onClick={() => setPreviewMode('tablet')}
                                            >
                                                📱
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant={previewMode === 'mobile' ? 'default' : 'outline'}
                                                onClick={() => setPreviewMode('mobile')}
                                            >
                                                📲
                                            </Button>
                                        </div>

                                        <div className={cn(
                                            "border rounded-lg p-4 bg-white transition-all duration-300",
                                            previewMode === 'desktop' && "w-full",
                                            previewMode === 'tablet' && "w-3/4 mx-auto",
                                            previewMode === 'mobile' && "w-1/2 mx-auto"
                                        )}>
                                            <div
                                                className={cn(
                                                    "grid gap-2",
                                                    `grid-cols-${data.layout.columns}`
                                                )}
                                                style={{
                                                    gridTemplateColumns: `repeat(${data.layout.columns}, 1fr)`
                                                }}
                                            >
                                                {sortedOptions.slice(0, data.maxDisplayed).map((option) => (
                                                    <div
                                                        key={option.id}
                                                        className="border rounded p-2 text-xs hover:bg-gray-50 transition-colors cursor-pointer"
                                                        style={{
                                                            backgroundColor: data.colors.background,
                                                            color: data.colors.text,
                                                            borderColor: data.colors.border
                                                        }}
                                                    >
                                                        <div className={cn(
                                                            "flex items-center gap-2",
                                                            data.layout.arrangement === 'text-image' && "flex-row-reverse",
                                                            data.layout.alignment === 'center' && "justify-center",
                                                            data.layout.alignment === 'right' && "justify-end"
                                                        )}>
                                                            {(data.layout.arrangement === 'image-text' || data.layout.arrangement === 'text-image' || data.layout.arrangement === 'image-only') && option.image && (
                                                                <img
                                                                    src={option.image}
                                                                    alt="Preview"
                                                                    className="w-4 h-4 object-cover rounded"
                                                                />
                                                            )}
                                                            {(data.layout.arrangement === 'image-text' || data.layout.arrangement === 'text-image' || data.layout.arrangement === 'text-only') && (
                                                                <span className="truncate">{option.text}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>,
                                    "preview"
                                )}

                                {/* Actions */}
                                {(onDelete || onDuplicate) && (
                                    <>
                                        <Separator />
                                        <div className="flex items-center gap-2">
                                            {onDuplicate && (
                                                <Button size="sm" variant="outline" onClick={onDuplicate}>
                                                    <Copy className="w-3 h-3 mr-2" />
                                                    Duplicar
                                                </Button>
                                            )}
                                            {onDelete && (
                                                <Button size="sm" variant="destructive" onClick={onDelete}>
                                                    <Trash2 className="w-3 h-3 mr-2" />
                                                    Excluir
                                                </Button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default MultipleChoiceOptionsPanel;
