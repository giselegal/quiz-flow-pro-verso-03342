/**
 * 🚀 API-DRIVEN PROPERTIES PANEL
 * 
 * Painel de propriedades que usa a API interna para máxima performance
 * - Comunicação via API interna
 * - Cache inteligente
 * - Validação em tempo real
 * - Re-renders otimizados
 */

import React, { memo, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, RefreshCw, Check, X } from 'lucide-react';

import { useBlockProperties, type UseBlockPropertiesOptions } from '@/hooks/useBlockProperties';
import { type BlockPropertySchema } from '@/api/internal/BlockPropertiesAPI';

// ===== INTERFACES =====

interface APIPropertiesPanelProps {
    blockId: string;
    blockType: string;
    initialProperties?: Record<string, any>;
    onPropertyChange?: (key: string, value: any, isValid: boolean) => void;
    onClose?: () => void;
    onDelete?: () => void;
    className?: string;
}

interface PropertyFieldProps {
    propertyKey: string;
    schema: BlockPropertySchema;
    value: any;
    isValid: boolean;
    onChange: (value: any) => Promise<void>;
}

// ===== PROPERTY FIELD COMPONENTS =====

const PropertyField: React.FC<PropertyFieldProps> = memo(({
    propertyKey,
    schema,
    value,
    isValid,
    onChange
}) => {
    const handleChange = useCallback((newValue: any) => {
        onChange(newValue);
    }, [onChange]);

    const fieldId = `prop-${propertyKey}`;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label htmlFor={fieldId} className="text-sm font-medium">
                    {schema.label}
                </Label>
                <div className="flex items-center gap-1">
                    {isValid ? (
                        <Check className="w-3 h-3 text-green-500" />
                    ) : (
                        <X className="w-3 h-3 text-red-500" />
                    )}
                </div>
            </div>

            {/* Render appropriate input based on schema kind */}
            {schema.kind === 'text' && (
                <Input
                    id={fieldId}
                    value={value || ''}
                    onChange={(e) => handleChange(e.target.value)}
                    className={isValid ? '' : 'border-red-300 focus:ring-red-500'}
                />
            )}

            {schema.kind === 'number' && (
                <Input
                    id={fieldId}
                    type="number"
                    value={value || ''}
                    onChange={(e) => handleChange(Number(e.target.value))}
                    className={isValid ? '' : 'border-red-300 focus:ring-red-500'}
                />
            )}

            {schema.kind === 'boolean' && (
                <div className="flex items-center space-x-2">
                    <Switch
                        id={fieldId}
                        checked={Boolean(value)}
                        onCheckedChange={handleChange}
                    />
                    <Label htmlFor={fieldId} className="text-sm">
                        {Boolean(value) ? 'Ativado' : 'Desativado'}
                    </Label>
                </div>
            )}

            {schema.kind === 'select' && schema.options && (
                <Select value={value || ''} onValueChange={handleChange}>
                    <SelectTrigger className={isValid ? '' : 'border-red-300'}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {schema.options.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {schema.kind === 'range' && (
                <div className="space-y-2">
                    <Slider
                        id={fieldId}
                        value={[value || schema.defaultValue || 0]}
                        onValueChange={(values) => handleChange(values[0])}
                        max={100}
                        min={0}
                        step={1}
                        className="w-full"
                    />
                    <div className="text-xs text-muted-foreground text-center">
                        {value || schema.defaultValue || 0}
                    </div>
                </div>
            )}

            {schema.kind === 'color' && (
                <div className="flex items-center space-x-2">
                    <input
                        id={fieldId}
                        type="color"
                        value={value || schema.defaultValue || '#000000'}
                        onChange={(e) => handleChange(e.target.value)}
                        className="w-12 h-8 rounded border cursor-pointer"
                    />
                    <Input
                        value={value || ''}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder="#000000"
                        className={`flex-1 ${isValid ? '' : 'border-red-300 focus:ring-red-500'}`}
                    />
                </div>
            )}
        </div>
    );
});

// ===== MAIN COMPONENT =====

export const APIPropertiesPanel: React.FC<APIPropertiesPanelProps> = memo(({
    blockId,
    blockType,
    initialProperties = {},
    onPropertyChange,
    onClose,
    onDelete,
    className = ''
}) => {
    // Use our optimized hook with API
    const {
        definition,
        properties,
        isLoading,
        error,
        updateProperty,
        resetToDefaults,
        validateProperty
    } = useBlockProperties({
        blockId,
        blockType,
        initialProperties,
        onPropertyChange,
        enableValidation: true,
        enableTransformation: true
    });

    // Property validation states
    const [validationStates, setValidationStates] = React.useState<Record<string, boolean>>({});

    // Handle property change with validation
    const handlePropertyChange = useCallback(async (key: string, value: any) => {
        const isValid = await updateProperty(key, value);
        setValidationStates(prev => ({ ...prev, [key]: isValid }));
    }, [updateProperty]);

    // Memoize property fields for performance
    const propertyFields = useMemo(() => {
        if (!definition?.properties) return [];

        return Object.entries(definition.properties).map(([key, schema]) => ({
            key,
            schema,
            value: properties[key],
            isValid: validationStates[key] !== false // default to true if not validated yet
        }));
    }, [definition?.properties, properties, validationStates]);

    // Loading state
    if (isLoading) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Carregando Propriedades...
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 bg-muted rounded animate-pulse" />
                                <div className="h-8 bg-muted rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Error state
    if (error) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="w-4 h-4" />
                        Erro ao Carregar
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.reload()}
                        className="mt-2"
                    >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Tentar Novamente
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // No block definition
    if (!definition) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Tipo Desconhecido
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Tipo de bloco "{blockType}" não encontrado no registry.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        {definition.icon && <span>{definition.icon}</span>}
                        {definition.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                            API v1.0
                        </Badge>
                        {onClose && (
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
                {definition.category && (
                    <Badge variant="secondary" className="w-fit text-xs">
                        {definition.category}
                    </Badge>
                )}
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Property Fields */}
                {propertyFields.length > 0 ? (
                    <div className="space-y-4">
                        {propertyFields.map(({ key, schema, value, isValid }) => (
                            <PropertyField
                                key={key}
                                propertyKey={key}
                                schema={schema}
                                value={value}
                                isValid={isValid}
                                onChange={(newValue) => handlePropertyChange(key, newValue)}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma propriedade configurável encontrada.
                    </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetToDefaults}
                        className="flex-1"
                    >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Restaurar Padrões
                    </Button>
                    {onDelete && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={onDelete}
                        >
                            Excluir
                        </Button>
                    )}
                </div>

                {/* Debug info in development */}
                {process.env.NODE_ENV === 'development' && (
                    <details className="text-xs">
                        <summary className="cursor-pointer text-muted-foreground">
                            Debug Info (API Internal)
                        </summary>
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                            {JSON.stringify({
                                blockId,
                                blockType,
                                propertiesCount: Object.keys(properties).length,
                                validationStates
                            }, null, 2)}
                        </pre>
                    </details>
                )}
            </CardContent>
        </Card>
    );
});

APIPropertiesPanel.displayName = 'APIPropertiesPanel';

export default APIPropertiesPanel;