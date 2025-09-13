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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

import { PropertyChangeIndicator } from '@/components/universal/PropertyChangeIndicator';

// Lazy loading para componentes pesados
const ColorPicker = lazy(() => import('@/components/visual-controls/ColorPicker'));
const SizeSlider = lazy(() => import('@/components/visual-controls/SizeSlider'));

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

// ===== PROPERTY FIELD RENDERER =====

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

    // Hook otimizado de propriedades com debouncing
    const { updateProperty, getPropertiesByCategory } = useOptimizedUnifiedProperties({
        blockType: selectedBlock?.type || '',
        blockId: selectedBlock?.id,
        currentBlock: selectedBlock,
        onUpdate: onUpdate ? (blockId: string, updates: any) => {
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
    }, [debouncedUpdateProperty]);    // Estado vazio
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
                <ScrollArea className="h-full">
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
                </ScrollArea>
            </CardContent>
        </Card>
    );
});

SinglePropertiesPanel.displayName = 'SinglePropertiesPanel';

export default SinglePropertiesPanel;