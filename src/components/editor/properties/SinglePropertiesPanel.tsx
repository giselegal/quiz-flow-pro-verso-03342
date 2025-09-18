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

import React, { useCallback, useMemo, useId, memo, lazy, Suspense } from 'react';
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
import { Settings, Type, Palette, Layout, Trash2, Copy } from 'lucide-react';

// ===== INTERFACES =====

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
                        isPreviewMode={false}
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
    console.log('🔍 SinglePropertiesPanel - selectedBlock recebido:', {
        hasBlock: !!selectedBlock,
        blockId: selectedBlock?.id,
        blockType: selectedBlock?.type,
        properties: selectedBlock?.properties,
        content: selectedBlock?.content,
        fullBlock: selectedBlock
    });

    console.log('🔍 DEBUG CRÍTICO - Análise detalhada do selectedBlock:', {
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
        contentValues: selectedBlock?.content || 'N/A'
    });

    // Hook otimizado de propriedades com debouncing
    const { updateProperty, getPropertiesByCategory } = useOptimizedUnifiedProperties({
        blockType: selectedBlock?.type || '',
        blockId: selectedBlock?.id,
        currentBlock: selectedBlock,
        onUpdate: onUpdate ? (_blockId: string, updates: any) => {
            console.log('🔄 SinglePropertiesPanel - enviando updates:', updates);
            // Adaptar para o formato esperado pelo editor atual
            onUpdate(updates.properties || updates);
        } : undefined
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
            advanced: getPropertiesByCategory('advanced')
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
        console.log('🚀 SinglePropertiesPanel handlePropertyUpdate:', { key, value });
        debouncedUpdateProperty(key, value);
    }, [debouncedUpdateProperty]);

    const handleContentUpdate = useCallback((key: string, value: any) => {
        console.log('🚀 SinglePropertiesPanel handleContentUpdate:', { key, value });
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
            'quiz-result-style', 'quiz-result-secondary', 'result-card'
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