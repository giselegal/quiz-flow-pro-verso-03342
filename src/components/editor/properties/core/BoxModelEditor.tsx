import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Link,
    Unlink,
    Box,
    RotateCcw
} from 'lucide-react';
import { ContextualTooltip } from './ContextualTooltip';
import type { PropertyEditorProps } from './types';

interface BoxModelEditorProps extends PropertyEditorProps {
    type?: 'margin' | 'padding';
}

/**
 * Editor visual avançado para Box Model (margin/padding)
 * Features: Link/unlink values, multiple units, visual preview, presets
 */
const BoxModelEditor: React.FC<BoxModelEditorProps> = ({
    property,
    onChange,
    type = 'margin'
}) => {
    // Detectar se é margin ou padding pelo nome da propriedade
    const detectedType = property.key?.toLowerCase().includes('padding') ? 'padding' : 'margin';
    const boxType = type || detectedType;

    // Estado para valores individuais
    const [values, setValues] = useState({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    });

    const [isLinked, setIsLinked] = useState(true);
    const [unit, setUnit] = useState<'px' | 'rem' | '%' | 'auto'>('px');

    // Inicializar valores baseado na propriedade atual
    useEffect(() => {
        const currentValue = property.value;

        if (typeof currentValue === 'object' && currentValue !== null) {
            // Objeto com top, right, bottom, left
            setValues({
                top: currentValue.top || 0,
                right: currentValue.right || 0,
                bottom: currentValue.bottom || 0,
                left: currentValue.left || 0,
            });
            setIsLinked(false);
        } else if (typeof currentValue === 'number' || typeof currentValue === 'string') {
            // Valor único para todos os lados
            const numValue = typeof currentValue === 'string' ? parseInt(currentValue) || 0 : currentValue;
            setValues({
                top: numValue,
                right: numValue,
                bottom: numValue,
                left: numValue,
            });
            setIsLinked(true);
        }
    }, [property.value]);

    const updateValue = (side: keyof typeof values, newValue: number) => {
        let newValues = { ...values };

        if (isLinked) {
            // Atualizar todos os lados
            newValues = {
                top: newValue,
                right: newValue,
                bottom: newValue,
                left: newValue,
            };
            // Para compatibilidade com sistema existente, enviar valor único
            onChange(property.key, newValue);
        } else {
            // Atualizar apenas este lado
            newValues[side] = newValue;
            // Enviar objeto completo
            onChange(property.key, newValues);
        }

        setValues(newValues);
    };

    const toggleLink = () => {
        const newLinked = !isLinked;
        setIsLinked(newLinked);

        if (newLinked) {
            // Ao vincular, usar o valor do top para todos
            const uniformValue = values.top;
            const newValues = {
                top: uniformValue,
                right: uniformValue,
                bottom: uniformValue,
                left: uniformValue,
            };
            setValues(newValues);
            onChange(property.key, uniformValue);
        } else {
            // Ao desvincular, enviar objeto
            onChange(property.key, values);
        }
    };

    const applyPreset = (preset: 'none' | 'small' | 'medium' | 'large' | 'auto') => {
        let presetValue = 0;

        switch (preset) {
            case 'none':
                presetValue = 0;
                break;
            case 'small':
                presetValue = unit === 'rem' ? 0.5 : (unit === '%' ? 2 : 8);
                break;
            case 'medium':
                presetValue = unit === 'rem' ? 1 : (unit === '%' ? 4 : 16);
                break;
            case 'large':
                presetValue = unit === 'rem' ? 1.5 : (unit === '%' ? 6 : 24);
                break;
            case 'auto':
                // Para auto, enviar string
                onChange(property.key, 'auto');
                return;
        }

        updateValue('top', presetValue);
    };

    const resetValues = () => {
        const resetValue = 0;
        setValues({
            top: resetValue,
            right: resetValue,
            bottom: resetValue,
            left: resetValue,
        });
        onChange(property.key, isLinked ? resetValue : {
            top: resetValue,
            right: resetValue,
            bottom: resetValue,
            left: resetValue,
        });
    };

    const formatValue = (value: number) => {
        if (unit === 'auto') return 'auto';
        return `${value}${unit}`;
    };

    const getBackgroundColorClass = () => {
        return boxType === 'margin' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200';
    };

    const getAccentColor = () => {
        return boxType === 'margin' ? 'blue' : 'green';
    };

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Box className={`w-4 h-4 text-${getAccentColor()}-600`} />
                        <CardTitle className="text-sm">{property.label}</CardTitle>
                        <ContextualTooltip content="Configure margens e padding do elemento" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleLink}
                            className={`h-6 w-6 p-0 ${isLinked ? `text-${getAccentColor()}-600` : 'text-gray-400'}`}
                        >
                            {isLinked ? <Link className="w-3 h-3" /> : <Unlink className="w-3 h-3" />}
                        </Button>
                        <Select value={unit} onValueChange={(u: any) => setUnit(u)}>
                            <SelectTrigger className="w-16 h-6 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="px">px</SelectItem>
                                <SelectItem value="rem">rem</SelectItem>
                                <SelectItem value="%">%</SelectItem>
                                <SelectItem value="auto">auto</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {property.description && (
                    <p className="text-xs text-muted-foreground">{property.description}</p>
                )}
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Visual Box Model */}
                <div className={`relative p-6 rounded-lg border-2 ${getBackgroundColorClass()}`}>
                    <div className="relative border-2 border-dashed border-gray-400 rounded p-6 bg-white">

                        {/* Top Input */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                            <Input
                                type="number"
                                value={values.top}
                                onChange={(e) => updateValue('top', Number(e.target.value) || 0)}
                                className="w-16 h-7 text-xs text-center"
                                min={boxType === 'margin' ? -100 : 0}
                                max={200}
                            />
                        </div>

                        {/* Right Input */}
                        <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                            <Input
                                type="number"
                                value={values.right}
                                onChange={(e) => updateValue('right', Number(e.target.value) || 0)}
                                className="w-16 h-7 text-xs text-center"
                                min={boxType === 'margin' ? -100 : 0}
                                max={200}
                                disabled={isLinked}
                            />
                        </div>

                        {/* Bottom Input */}
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                            <Input
                                type="number"
                                value={values.bottom}
                                onChange={(e) => updateValue('bottom', Number(e.target.value) || 0)}
                                className="w-16 h-7 text-xs text-center"
                                min={boxType === 'margin' ? -100 : 0}
                                max={200}
                                disabled={isLinked}
                            />
                        </div>

                        {/* Left Input */}
                        <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
                            <Input
                                type="number"
                                value={values.left}
                                onChange={(e) => updateValue('left', Number(e.target.value) || 0)}
                                className="w-16 h-7 text-xs text-center"
                                min={boxType === 'margin' ? -100 : 0}
                                max={200}
                                disabled={isLinked}
                            />
                        </div>

                        {/* Content Area */}
                        <div className="bg-gray-100 border border-gray-300 rounded p-6 text-center min-h-[80px] flex flex-col items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">Content Area</span>
                            <div className="text-xs text-gray-500 mt-1">
                                {boxType === 'margin' ? 'Margin' : 'Padding'}: {
                                    isLinked ?
                                        formatValue(values.top) :
                                        `${formatValue(values.top)} ${formatValue(values.right)} ${formatValue(values.bottom)} ${formatValue(values.left)}`
                                }
                            </div>
                            {isLinked && (
                                <Badge variant="secondary" className="text-xs mt-1">
                                    {isLinked ? 'Linked' : 'Individual'}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Presets */}
                <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-700">Quick Presets:</Label>
                    <div className="flex flex-wrap gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applyPreset('none')}
                            className="h-7 px-2 text-xs"
                        >
                            None (0)
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applyPreset('small')}
                            className="h-7 px-2 text-xs"
                        >
                            Small ({unit === 'rem' ? '0.5rem' : unit === '%' ? '2%' : '8px'})
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applyPreset('medium')}
                            className="h-7 px-2 text-xs"
                        >
                            Medium ({unit === 'rem' ? '1rem' : unit === '%' ? '4%' : '16px'})
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applyPreset('large')}
                            className="h-7 px-2 text-xs"
                        >
                            Large ({unit === 'rem' ? '1.5rem' : unit === '%' ? '6%' : '24px'})
                        </Button>
                        {boxType === 'margin' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => applyPreset('auto')}
                                className="h-7 px-2 text-xs"
                            >
                                Auto
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetValues}
                            className="h-7 px-2 text-xs text-red-600 hover:text-red-700"
                        >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Reset
                        </Button>
                    </div>
                </div>

                {/* Tips */}
                <div className={`text-xs p-2 rounded border ${getBackgroundColorClass()}`}>
                    <strong>Tip:</strong> {
                        boxType === 'margin'
                            ? 'Margins create space outside the element. Use negative values to overlap elements.'
                            : 'Padding creates space inside the element, between the content and border.'
                    } Click the link icon to {isLinked ? 'unlink' : 'link'} values.
                </div>
            </CardContent>
        </Card>
    );
};

export default BoxModelEditor;
