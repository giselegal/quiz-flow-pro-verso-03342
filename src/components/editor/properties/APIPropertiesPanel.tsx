/**
 * 🚀 API-DRIVEN PROPERTIES PANEL
 * 
 * Painel de propriedades que usa a API interna + dados reais do funil
 * - Comunicação via API interna
 * - Cache inteligente
 * - Validação em tempo real
 * - Dados reais do funil integrados
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
import { AlertCircle, RefreshCw, Check, X, Database } from 'lucide-react';

import { useBlockProperties } from '@/hooks/useBlockProperties';
import { usePureBuilder } from '@/components/editor/PureBuilderProvider';
import { useFunnels } from '@/providers/FunnelMasterProvider';
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

// ===== REAL FUNNEL DATA COMPONENT =====

const FunnelDataDisplay: React.FC<{
    blockId: string;
    blockType: string;
}> = memo(({ blockId, blockType }) => {
    const builder = usePureBuilder();
    const funnelsContext = useFunnels();

    // 🛡️ DEFENSIVE GUARD: Verificar se builder está disponível  
    if (!builder?.state) {
        return (
            <div className="flex items-center justify-center p-8 text-gray-500">
                <div className="text-center">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p>Builder context não disponível</p>
                    <p className="text-xs">Verifique se o componente está dentro de PureBuilderProvider</p>
                </div>
            </div>
        );
    }

    const funnelInfo = useMemo(() => {
        try {
            const stepState = builder?.state;
            const currentStepKey = `step-${stepState.currentStep}`;
            const currentStepBlocks = stepState.stepBlocks[currentStepKey] || [];
            const currentBlock = currentStepBlocks.find((b: any) => b.id === blockId);

            // TODO: Implement template blocks loading

            return {
                funnelId: funnelsContext?.currentFunnel?.id || 'local-funnel',
                currentStep: stepState.currentStep,
                totalSteps: Object.keys(stepState.stepBlocks).length || 21, // Dinâmico baseado nos dados reais
                blockIndex: currentStepBlocks.findIndex((b: any) => b.id === blockId) + 1,
                totalBlocks: currentStepBlocks.length,
                blockData: currentBlock,
                templateBlocksCount: 0,
                hasValidation: !!stepState.stepValidation[stepState.currentStep],
                lastModified: new Date().toLocaleString('pt-BR'),
                isSupabaseEnabled: false,
                databaseMode: 'local',
                // Informações específicas do bloco
                blockContent: currentBlock?.content,
                blockProperties: currentBlock?.properties,
                blockOrder: currentBlock ? currentStepBlocks.indexOf(currentBlock) : -1,
                // Status de integração
                isConnectedToFunnel: !!currentBlock && !!funnelsContext,
                canSaveToDatabase: false
            };
        } catch (error) {
            console.error('Erro ao buscar dados do funil:', error);
            return null;
        }
    }, [builder, funnelsContext, blockId]);

    if (!funnelInfo) {
        return (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-600">❌ Erro ao carregar dados do funil</p>
            </div>
        );
    }

    return (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">Dados Reais do Funil</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                    <span className="text-gray-500">Funil:</span>
                    <p className="font-mono text-blue-600">{funnelInfo.funnelId}</p>
                </div>
                <div>
                    <span className="text-gray-500">Etapa:</span>
                    <p className="font-semibold">{funnelInfo.currentStep}/{funnelInfo.totalSteps}</p>
                </div>
                <div>
                    <span className="text-gray-500">Bloco:</span>
                    <p className="font-semibold">{funnelInfo.blockIndex}/{funnelInfo.totalBlocks}</p>
                </div>
                <div>
                    <span className="text-gray-500">Tipo:</span>
                    <p className="font-mono text-purple-600">{blockType}</p>
                </div>
                <div>
                    <span className="text-gray-500">Storage:</span>
                    <p className="font-semibold">{funnelInfo.databaseMode}</p>
                </div>
                <div>
                    <span className="text-gray-500">Status:</span>
                    <Badge variant={funnelInfo.hasValidation ? "default" : "secondary"} className="text-xs">
                        {funnelInfo.hasValidation ? "Válido" : "Pendente"}
                    </Badge>
                </div>
            </div>

            {funnelInfo.blockData && (
                <div className="pt-2 border-t border-blue-200">
                    <span className="text-xs text-gray-500">Propriedades atuais:</span>
                    <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                        {JSON.stringify(funnelInfo.blockData.properties || {}, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
});

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
                        {schema.options.map((option, index) => (
                            <SelectItem key={index} value={String(option)}>
                                {String(option)}
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
        resetToDefaults
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
        <Card data-testid="properties-panel" className={className}>
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
                {/* Dados Reais do Funil */}
                <FunnelDataDisplay
                    blockId={blockId}
                    blockType={blockType}
                />

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