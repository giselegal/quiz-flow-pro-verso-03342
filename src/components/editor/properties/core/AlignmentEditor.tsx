import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Rows,
    Columns,
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    Grid3x3,
    Layout
} from 'lucide-react';
import type { PropertyEditorProps } from './types';

interface AlignmentValue {
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    display?: 'flex' | 'grid' | 'block' | 'inline-block';
    gap?: string;
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
}

export const AlignmentEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => {
    const value = (property.value as AlignmentValue) || {
        textAlign: 'left',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        display: 'flex'
    };

    const updateValue = (updates: Partial<AlignmentValue>) => {
        onChange(property.key, { ...value, ...updates });
    };

    const textAlignOptions = [
        { value: 'left', icon: AlignLeft, label: 'Esquerda' },
        { value: 'center', icon: AlignCenter, label: 'Centro' },
        { value: 'right', icon: AlignRight, label: 'Direita' },
        { value: 'justify', icon: AlignJustify, label: 'Justificado' }
    ];

    const justifyOptions = [
        { value: 'flex-start', label: 'Início', icon: ArrowLeft },
        { value: 'center', label: 'Centro', icon: Grid3x3 },
        { value: 'flex-end', label: 'Fim', icon: ArrowRight },
        { value: 'space-between', label: 'Entre', icon: Layout },
        { value: 'space-around', label: 'Ao Redor', icon: Layout },
        { value: 'space-evenly', label: 'Uniforme', icon: Layout }
    ];

    const alignOptions = [
        { value: 'flex-start', label: 'Topo', icon: ArrowUp },
        { value: 'center', label: 'Centro', icon: Grid3x3 },
        { value: 'flex-end', label: 'Base', icon: ArrowDown },
        { value: 'stretch', label: 'Esticar', icon: Rows }
    ];

    const directionOptions = [
        { value: 'row', label: 'Linha →', icon: ArrowRight },
        { value: 'column', label: 'Coluna ↓', icon: ArrowDown },
        { value: 'row-reverse', label: 'Linha ←', icon: ArrowLeft },
        { value: 'column-reverse', label: 'Coluna ↑', icon: ArrowUp }
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
                <Layout className="w-4 h-4 text-blue-600" />
                <Label className="font-medium">{property.label}</Label>
            </div>

            {/* Tipo de Display */}
            <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-600">Tipo de Layout</Label>
                <Select value={value.display} onValueChange={v => updateValue({ display: v as any })}>
                    <SelectTrigger className="h-8">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="flex">Flex (Recomendado)</SelectItem>
                        <SelectItem value="grid">Grid</SelectItem>
                        <SelectItem value="block">Block</SelectItem>
                        <SelectItem value="inline-block">Inline Block</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Alinhamento de Texto */}
            <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-600">Alinhamento de Texto</Label>
                <div className="grid grid-cols-4 gap-1">
                    {textAlignOptions.map(option => {
                        const Icon = option.icon;
                        const isActive = value.textAlign === option.value;
                        return (
                            <Button
                                key={option.value}
                                variant={isActive ? "default" : "outline"}
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => updateValue({ textAlign: option.value as any })}
                            >
                                <Icon className="w-3 h-3" />
                            </Button>
                        );
                    })}
                </div>
            </div>

            {/* Layout Flex/Grid */}
            {value.display === 'flex' && (
                <>
                    {/* Direção */}
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-gray-600">Direção</Label>
                        <div className="grid grid-cols-2 gap-1">
                            {directionOptions.map(option => {
                                const Icon = option.icon;
                                const isActive = value.flexDirection === option.value;
                                return (
                                    <Button
                                        key={option.value}
                                        variant={isActive ? "default" : "outline"}
                                        size="sm"
                                        className="h-8 px-2 text-xs"
                                        onClick={() => updateValue({ flexDirection: option.value as any })}
                                    >
                                        <Icon className="w-3 h-3 mr-1" />
                                        {option.label}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Justificação (eixo principal) */}
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-gray-600">
                            Alinhamento {value.flexDirection?.includes('column') ? 'Vertical' : 'Horizontal'}
                        </Label>
                        <div className="grid grid-cols-3 gap-1">
                            {justifyOptions.map(option => {
                                const Icon = option.icon;
                                const isActive = value.justifyContent === option.value;
                                return (
                                    <Button
                                        key={option.value}
                                        variant={isActive ? "default" : "outline"}
                                        size="sm"
                                        className="h-8 px-1 text-xs"
                                        onClick={() => updateValue({ justifyContent: option.value as any })}
                                    >
                                        <Icon className="w-3 h-3" />
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Alinhamento (eixo transversal) */}
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-gray-600">
                            Alinhamento {value.flexDirection?.includes('column') ? 'Horizontal' : 'Vertical'}
                        </Label>
                        <div className="grid grid-cols-4 gap-1">
                            {alignOptions.map(option => {
                                const Icon = option.icon;
                                const isActive = value.alignItems === option.value;
                                return (
                                    <Button
                                        key={option.value}
                                        variant={isActive ? "default" : "outline"}
                                        size="sm"
                                        className="h-8 px-1 text-xs"
                                        onClick={() => updateValue({ alignItems: option.value as any })}
                                    >
                                        <Icon className="w-3 h-3" />
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Gap */}
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-gray-600">Espaçamento</Label>
                        <Select value={value.gap || '8px'} onValueChange={v => updateValue({ gap: v })}>
                            <SelectTrigger className="h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Sem espaçamento</SelectItem>
                                <SelectItem value="4px">Pequeno (4px)</SelectItem>
                                <SelectItem value="8px">Médio (8px)</SelectItem>
                                <SelectItem value="12px">Grande (12px)</SelectItem>
                                <SelectItem value="16px">Extra Grande (16px)</SelectItem>
                                <SelectItem value="24px">Muito Grande (24px)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </>
            )}

            {/* Grid Layout */}
            {value.display === 'grid' && (
                <>
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-gray-600">Colunas do Grid</Label>
                        <Select
                            value={value.gridTemplateColumns || 'repeat(1, 1fr)'}
                            onValueChange={v => updateValue({ gridTemplateColumns: v })}
                        >
                            <SelectTrigger className="h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1fr">1 coluna</SelectItem>
                                <SelectItem value="repeat(2, 1fr)">2 colunas</SelectItem>
                                <SelectItem value="repeat(3, 1fr)">3 colunas</SelectItem>
                                <SelectItem value="repeat(4, 1fr)">4 colunas</SelectItem>
                                <SelectItem value="auto 1fr">Auto + 1fr</SelectItem>
                                <SelectItem value="1fr auto">1fr + Auto</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-gray-600">Gap do Grid</Label>
                        <Select value={value.gap || '8px'} onValueChange={v => updateValue({ gap: v })}>
                            <SelectTrigger className="h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Sem gap</SelectItem>
                                <SelectItem value="4px">4px</SelectItem>
                                <SelectItem value="8px">8px</SelectItem>
                                <SelectItem value="12px">12px</SelectItem>
                                <SelectItem value="16px">16px</SelectItem>
                                <SelectItem value="24px">24px</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </>
            )}

            {/* Preview */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                <Label className="text-xs font-medium text-gray-600 mb-2 block">Preview</Label>
                <div
                    className="min-h-[60px] bg-white border rounded p-2"
                    style={{
                        display: value.display,
                        flexDirection: value.flexDirection,
                        justifyContent: value.justifyContent,
                        alignItems: value.alignItems,
                        textAlign: value.textAlign,
                        gap: value.gap,
                        gridTemplateColumns: value.gridTemplateColumns,
                    }}
                >
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Item 1</div>
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Item 2</div>
                    <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Item 3</div>
                </div>
            </div>
        </div>
    );
};

export default AlignmentEditor;
