/**
 * 🎨 DYNAMIC PROPERTIES PANEL V4 - Painel Dinâmico de Propriedades
 * 
 * Renderiza automaticamente controles de propriedades baseado nas
 * definições do BlockRegistry.
 * 
 * Features:
 * - Controles automáticos baseados em PropertyType
 * - Validação Zod em tempo real
 * - Suporte a categorias de propriedades
 * - Feedback visual de erros
 * - Integração com BlockRegistry
 * 
 * @version 1.0.0
 * @status PRODUCTION
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, CheckCircle2, Settings, X } from 'lucide-react';
import { QuizBlockSchemaZ, type QuizBlock } from '@/schemas/quiz-schema.zod';
import { BlockRegistry } from '@/core/quiz/blocks/registry';
import { PropertyTypeEnum, type BlockPropertyDefinition } from '@/core/quiz/blocks/types';
import { appLogger } from '@/lib/utils/appLogger';
import { cn } from '@/lib/utils';
import { z } from 'zod';

// ============================================================================
// TYPES
// ============================================================================

export interface DynamicPropertiesPanelV4Props {
    /** Bloco v4 selecionado */
    block: QuizBlock | null;
    /** Callback quando propriedades são atualizadas */
    onUpdate: (blockId: string, updates: Partial<QuizBlock>) => void;
    /** Callback para fechar o painel */
    onClose?: () => void;
    /** Callback para deletar o bloco */
    onDelete?: (blockId: string) => void;
    /** Callback para duplicar o bloco */
    onDuplicate?: (blockId: string) => void;
    /** Classe CSS adicional */
    className?: string;
}

interface ValidationError {
    property: string;
    message: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const DynamicPropertiesPanelV4: React.FC<DynamicPropertiesPanelV4Props> = ({
    block,
    onUpdate,
    onClose,
    onDelete,
    onDuplicate,
    className,
}) => {
    const [localProperties, setLocalProperties] = useState<Record<string, any>>({});
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    // Busca definição do bloco no registry
    const blockDefinition = useMemo(() => {
        if (!block) return null;
        return BlockRegistry.getDefinition(block.type);
    }, [block?.type]);

    // Agrupa propriedades por categoria
    const propertiesByCategory = useMemo(() => {
        if (!blockDefinition) return {};

        const grouped: Record<string, BlockPropertyDefinition[]> = {
            content: [],
            style: [],
            behavior: [],
            advanced: [],
        };

        blockDefinition.properties.forEach(prop => {
            const category = prop.category || 'content';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(prop);
        });

        return grouped;
    }, [blockDefinition]);

    // Sincroniza estado local com bloco
    useEffect(() => {
        if (block) {
            setLocalProperties(block.properties || {});
            setHasChanges(false);
            setValidationErrors([]);
        }
    }, [block?.id]);

    // Valida propriedades usando Zod
    const validateProperties = (properties: Record<string, any>): ValidationError[] => {
        if (!block) return [];

        const errors: ValidationError[] = [];

        try {
            // Valida usando schema Zod do bloco completo
            QuizBlockSchemaZ.parse({
                ...block,
                properties,
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                error.errors.forEach(err => {
                    if (err.path[0] === 'properties' && err.path.length > 1) {
                        errors.push({
                            property: String(err.path[1]),
                            message: err.message,
                        });
                    }
                });
            }
        }

        // Validações adicionais da definição
        blockDefinition?.properties.forEach(propDef => {
            const value = properties[propDef.key];

            // Required
            if (propDef.required && (value === undefined || value === null || value === '')) {
                errors.push({
                    property: propDef.key,
                    message: `${propDef.label} é obrigatório`,
                });
            }

            // Validações específicas
            if (value !== undefined && value !== null && propDef.validation) {
                const val = propDef.validation;

                if (val.min !== undefined && typeof value === 'number' && value < val.min) {
                    errors.push({
                        property: propDef.key,
                        message: `${propDef.label} deve ser >= ${val.min}`,
                    });
                }

                if (val.max !== undefined && typeof value === 'number' && value > val.max) {
                    errors.push({
                        property: propDef.key,
                        message: `${propDef.label} deve ser <= ${val.max}`,
                    });
                }

                if (val.pattern && typeof value === 'string') {
                    const regex = new RegExp(val.pattern);
                    if (!regex.test(value)) {
                        errors.push({
                            property: propDef.key,
                            message: `${propDef.label} está em formato inválido`,
                        });
                    }
                }
            }
        });

        return errors;
    };

    // Handler para mudança de propriedade
    const handlePropertyChange = (key: string, value: any) => {
        const newProperties = { ...localProperties, [key]: value };
        setLocalProperties(newProperties);
        setHasChanges(true);

        // Valida em tempo real
        const errors = validateProperties(newProperties);
        setValidationErrors(errors);
    };

    // Salva mudanças
    const handleSave = () => {
        if (!block) return;

        const errors = validateProperties(localProperties);
        if (errors.length > 0) {
            setValidationErrors(errors);
            appLogger.warn('Validation errors prevent save:', errors);
            return;
        }

        onUpdate(block.id, { properties: localProperties });
        setHasChanges(false);
        appLogger.info('Properties saved:', { blockId: block.id, properties: localProperties });
    };

    // Reseta mudanças
    const handleReset = () => {
        if (block) {
            setLocalProperties(block.properties || {});
            setHasChanges(false);
            setValidationErrors([]);
        }
    };

    // Renderiza controle baseado no tipo
    const renderPropertyControl = (propDef: BlockPropertyDefinition) => {
        const value = localProperties[propDef.key] ?? propDef.defaultValue;
        const error = validationErrors.find(e => e.property === propDef.key);
        const inputId = `prop-${propDef.key}`;

        switch (propDef.type) {
            case PropertyTypeEnum.TEXT:
            case PropertyTypeEnum.URL:
                return (
                    <div key={propDef.key} className="space-y-2">
                        <Label htmlFor={inputId} className="text-sm font-medium">
                            {propDef.label}
                            {propDef.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {propDef.description && (
                            <p className="text-xs text-muted-foreground">{propDef.description}</p>
                        )}
                        <Input
                            id={inputId}
                            type="text"
                            value={value || ''}
                            onChange={(e) => handlePropertyChange(propDef.key, e.target.value)}
                            className={cn(error && 'border-red-500')}
                        />
                        {error && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {error.message}
                            </p>
                        )}
                    </div>
                );

            case PropertyTypeEnum.TEXTAREA:
                return (
                    <div key={propDef.key} className="space-y-2">
                        <Label htmlFor={inputId} className="text-sm font-medium">
                            {propDef.label}
                            {propDef.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {propDef.description && (
                            <p className="text-xs text-muted-foreground">{propDef.description}</p>
                        )}
                        <Textarea
                            id={inputId}
                            value={value || ''}
                            onChange={(e) => handlePropertyChange(propDef.key, e.target.value)}
                            className={cn('min-h-[80px]', error && 'border-red-500')}
                            rows={4}
                        />
                        {error && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {error.message}
                            </p>
                        )}
                    </div>
                );

            case PropertyTypeEnum.NUMBER:
            case PropertyTypeEnum.RANGE:
                return (
                    <div key={propDef.key} className="space-y-2">
                        <Label htmlFor={inputId} className="text-sm font-medium">
                            {propDef.label}
                            {propDef.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {propDef.description && (
                            <p className="text-xs text-muted-foreground">{propDef.description}</p>
                        )}
                        <Input
                            id={inputId}
                            type="number"
                            value={value ?? ''}
                            onChange={(e) => handlePropertyChange(propDef.key, parseFloat(e.target.value) || 0)}
                            min={propDef.validation?.min}
                            max={propDef.validation?.max}
                            className={cn(error && 'border-red-500')}
                        />
                        {error && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {error.message}
                            </p>
                        )}
                    </div>
                );

            case PropertyTypeEnum.BOOLEAN:
                return (
                    <div key={propDef.key} className="flex items-center justify-between space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor={inputId} className="text-sm font-medium">
                                {propDef.label}
                            </Label>
                            {propDef.description && (
                                <p className="text-xs text-muted-foreground">{propDef.description}</p>
                            )}
                        </div>
                        <Switch
                            id={inputId}
                            checked={!!value}
                            onCheckedChange={(checked) => handlePropertyChange(propDef.key, checked)}
                        />
                    </div>
                );

            case PropertyTypeEnum.COLOR:
                return (
                    <div key={propDef.key} className="space-y-2">
                        <Label htmlFor={inputId} className="text-sm font-medium">
                            {propDef.label}
                            {propDef.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {propDef.description && (
                            <p className="text-xs text-muted-foreground">{propDef.description}</p>
                        )}
                        <div className="flex gap-2">
                            <Input
                                id={inputId}
                                type="color"
                                value={value || '#000000'}
                                onChange={(e) => handlePropertyChange(propDef.key, e.target.value)}
                                className="w-20 h-10"
                            />
                            <Input
                                type="text"
                                value={value || ''}
                                onChange={(e) => handlePropertyChange(propDef.key, e.target.value)}
                                className={cn('flex-1', error && 'border-red-500')}
                                placeholder="#000000"
                            />
                        </div>
                        {error && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {error.message}
                            </p>
                        )}
                    </div>
                );

            case PropertyTypeEnum.SELECT:
                const options = Array.isArray(propDef.validation?.options)
                    ? propDef.validation.options
                    : [];

                return (
                    <div key={propDef.key} className="space-y-2">
                        <Label htmlFor={inputId} className="text-sm font-medium">
                            {propDef.label}
                            {propDef.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {propDef.description && (
                            <p className="text-xs text-muted-foreground">{propDef.description}</p>
                        )}
                        <Select
                            value={value || ''}
                            onValueChange={(val) => handlePropertyChange(propDef.key, val)}
                        >
                            <SelectTrigger id={inputId} className={cn(error && 'border-red-500')}>
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((opt) => {
                                    const optValue = typeof opt === 'string' ? opt : opt.value;
                                    const optLabel = typeof opt === 'string' ? opt : opt.label;
                                    return (
                                        <SelectItem key={optValue} value={String(optValue)}>
                                            {optLabel}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                        {error && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {error.message}
                            </p>
                        )}
                    </div>
                );

            default:
                // Fallback para JSON/outros tipos
                return (
                    <div key={propDef.key} className="space-y-2">
                        <Label htmlFor={inputId} className="text-sm font-medium">
                            {propDef.label}
                            {propDef.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {propDef.description && (
                            <p className="text-xs text-muted-foreground">{propDef.description}</p>
                        )}
                        <Textarea
                            id={inputId}
                            value={JSON.stringify(value, null, 2)}
                            onChange={(e) => {
                                try {
                                    const parsed = JSON.parse(e.target.value);
                                    handlePropertyChange(propDef.key, parsed);
                                } catch {
                                    // Ignora JSON inválido durante digitação
                                }
                            }}
                            className={cn('font-mono text-xs min-h-[100px]', error && 'border-red-500')}
                        />
                        {error && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {error.message}
                            </p>
                        )}
                    </div>
                );
        }
    };

    // Empty state
    if (!block) {
        return (
            <Card className={cn('h-full', className)}>
                <CardContent className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center space-y-2">
                        <Settings className="w-12 h-12 mx-auto opacity-50" />
                        <p>Selecione um bloco para editar propriedades</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Não encontrou definição
    if (!blockDefinition) {
        return (
            <Card className={cn('h-full', className)}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Propriedades</CardTitle>
                        {onClose && (
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-center space-y-2 text-muted-foreground">
                        <AlertCircle className="w-12 h-12 mx-auto opacity-50" />
                        <p>Tipo de bloco não encontrado no registry</p>
                        <Badge variant="outline">{block.type}</Badge>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={cn('h-full flex flex-col', className)}>
            {/* Header */}
            <CardHeader className="pb-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Settings className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{blockDefinition.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{blockDefinition.description}</p>
                        </div>
                    </div>
                    {onClose && (
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 pt-2">
                    <Badge variant="secondary">{block.type}</Badge>
                    <Badge variant="outline">{blockDefinition.category}</Badge>
                    {hasChanges && <Badge variant="default">Não salvo</Badge>}
                    {validationErrors.length > 0 && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {validationErrors.length} erro(s)
                        </Badge>
                    )}
                    {validationErrors.length === 0 && !hasChanges && (
                        <Badge variant="default" className="flex items-center gap-1 bg-green-500">
                            <CheckCircle2 className="w-3 h-3" />
                            Válido
                        </Badge>
                    )}
                </div>
            </CardHeader>

            {/* Properties */}
            <ScrollArea className="flex-1">
                <CardContent className="space-y-6">
                    {Object.entries(propertiesByCategory).map(([category, props]) => {
                        if (props.length === 0) return null;

                        return (
                            <div key={category} className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                        {category}
                                    </h3>
                                    <Separator className="mt-2" />
                                </div>
                                <div className="space-y-4">
                                    {props.map(prop => renderPropertyControl(prop))}
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </ScrollArea>

            {/* Actions */}
            <div className="flex-shrink-0 border-t p-4 space-y-2">
                <div className="flex gap-2">
                    <Button
                        onClick={handleSave}
                        disabled={!hasChanges || validationErrors.length > 0}
                        className="flex-1"
                    >
                        Salvar
                    </Button>
                    <Button
                        onClick={handleReset}
                        variant="outline"
                        disabled={!hasChanges}
                    >
                        Resetar
                    </Button>
                </div>
                {(onDelete || onDuplicate) && (
                    <div className="flex gap-2">
                        {onDuplicate && (
                            <Button
                                onClick={() => onDuplicate(block.id)}
                                variant="outline"
                                className="flex-1"
                            >
                                Duplicar
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                onClick={() => onDelete(block.id)}
                                variant="destructive"
                                className="flex-1"
                            >
                                Deletar
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default DynamicPropertiesPanelV4;
