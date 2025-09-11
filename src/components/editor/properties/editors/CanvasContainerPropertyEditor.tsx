/**
 * 🎨 EDITOR DE PROPRIEDADES DOS CONTAINERS DO CANVAS
 * 
 * Sistema completo para personalização visual dos containers dos componentes,
 * área do canvas, botões de navegação e elementos do editor.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
    Layout,
    Navigation,
    Square,
    Eye,
    RotateCcw,
    Sparkles,
    Settings,
    Layers
} from 'lucide-react';
import ColorPicker from '@/components/visual-controls/ColorPicker';

interface CanvasContainerProperties {
    // === ÁREA PRINCIPAL DO CANVAS ===
    canvasBackground: string;
    canvasOpacity: number;
    canvasBorder: string;
    canvasBorderRadius: number;
    canvasPadding: number;
    canvasMargin: number;

    // === CONTAINERS DOS COMPONENTES ===
    componentContainerBackground: string;
    componentContainerBorder: string;
    componentContainerBorderRadius: number;
    componentContainerPadding: number;
    componentContainerShadow: string;
    componentContainerHoverEffect: boolean;

    // === BOTÕES DE NAVEGAÇÃO ===
    navigationButtonBackground: string;
    navigationButtonTextColor: string;
    navigationButtonHoverBackground: string;
    navigationButtonBorder: string;
    navigationButtonBorderRadius: number;
    navigationButtonPadding: string;
    navigationButtonAlignment: 'left' | 'center' | 'right';
    navigationButtonVerticalPosition: 'top' | 'middle' | 'bottom';
    navigationButtonSpacing: number;

    // === ÁREA DE TOOLBAR ===
    toolbarBackground: string;
    toolbarBorder: string;
    toolbarButtonBackground: string;
    toolbarButtonHoverBackground: string;

    // === DROPZONES ===
    dropzoneActiveBackground: string;
    dropzoneActiveBorder: string;
    dropzoneHoverBackground: string;
    dropzoneIndicatorColor: string;
}

interface CanvasContainerPropertyEditorProps {
    properties: CanvasContainerProperties;
    onUpdate: (updates: Partial<CanvasContainerProperties>) => void;
    onReset?: () => void;
    isPreviewMode?: boolean;
}

const DEFAULT_PROPERTIES: CanvasContainerProperties = {
    // Canvas principal
    canvasBackground: '#FEFEFE',
    canvasOpacity: 100,
    canvasBorder: '#E5E5E5',
    canvasBorderRadius: 8,
    canvasPadding: 16,
    canvasMargin: 0,

    // Containers dos componentes
    componentContainerBackground: '#FFFFFF',
    componentContainerBorder: '#B89B7A',
    componentContainerBorderRadius: 8,
    componentContainerPadding: 16,
    componentContainerShadow: '0 2px 4px rgba(0,0,0,0.1)',
    componentContainerHoverEffect: true,

    // Botões de navegação
    navigationButtonBackground: '#F8F9FA',
    navigationButtonTextColor: '#374151',
    navigationButtonHoverBackground: '#E5E7EB',
    navigationButtonBorder: '#D1D5DB',
    navigationButtonBorderRadius: 6,
    navigationButtonPadding: '8px 16px',
    navigationButtonAlignment: 'right' as const,
    navigationButtonVerticalPosition: 'bottom' as const,
    navigationButtonSpacing: 8,

    // Toolbar
    toolbarBackground: '#1F2937',
    toolbarBorder: '#374151',
    toolbarButtonBackground: 'transparent',
    toolbarButtonHoverBackground: '#374151',

    // Dropzones
    dropzoneActiveBackground: '#B89B7A10',
    dropzoneActiveBorder: '#B89B7A40',
    dropzoneHoverBackground: '#B89B7A05',
    dropzoneIndicatorColor: '#B89B7A',
};

export const CanvasContainerPropertyEditor: React.FC<CanvasContainerPropertyEditorProps> = ({
    properties,
    onUpdate,
    onReset,
    isPreviewMode = false
}) => {
    const [activeTab, setActiveTab] = useState('canvas');

    const handleUpdate = (key: keyof CanvasContainerProperties, value: any) => {
        onUpdate({ [key]: value });
    };

    const handleReset = () => {
        if (onReset) {
            onReset();
        } else {
            onUpdate(DEFAULT_PROPERTIES);
        }
    };

    // Preview dos estilos aplicados
    const renderPreview = () => {
        return (
            <div className="space-y-4">
                {/* Preview da área do canvas */}
                <div
                    className="relative h-32 rounded border-2 border-dashed overflow-hidden"
                    style={{
                        backgroundColor: properties.canvasBackground,
                        opacity: properties.canvasOpacity / 100,
                        borderColor: properties.canvasBorder,
                        borderRadius: `${properties.canvasBorderRadius}px`,
                        padding: `${properties.canvasPadding}px`,
                        margin: `${properties.canvasMargin}px`
                    }}
                >
                    {/* Preview de um componente dentro do canvas */}
                    <div
                        className="w-full h-16 rounded border flex items-center justify-center text-sm font-medium transition-all"
                        style={{
                            backgroundColor: properties.componentContainerBackground,
                            borderColor: properties.componentContainerBorder,
                            borderRadius: `${properties.componentContainerBorderRadius}px`,
                            padding: `${properties.componentContainerPadding}px`,
                            boxShadow: properties.componentContainerShadow,
                            transform: properties.componentContainerHoverEffect ? 'scale(1)' : 'none',
                            cursor: properties.componentContainerHoverEffect ? 'pointer' : 'default'
                        }}
                    >
                        Componente Preview
                    </div>

                    {/* Preview dos botões de navegação */}
                    <div
                        className={`absolute flex gap-${Math.floor(properties.navigationButtonSpacing / 4)} ${properties.navigationButtonVerticalPosition === 'top' ? 'top-2' :
                                properties.navigationButtonVerticalPosition === 'middle' ? 'top-1/2 -translate-y-1/2' : 'bottom-2'
                            } ${properties.navigationButtonAlignment === 'left' ? 'left-2' :
                                properties.navigationButtonAlignment === 'center' ? 'left-1/2 -translate-x-1/2' : 'right-2'
                            }`}
                    >
                        <button
                            className="text-xs rounded transition-all"
                            style={{
                                backgroundColor: properties.navigationButtonBackground,
                                color: properties.navigationButtonTextColor,
                                borderColor: properties.navigationButtonBorder,
                                borderRadius: `${properties.navigationButtonBorderRadius}px`,
                                padding: properties.navigationButtonPadding,
                                border: '1px solid'
                            }}
                        >
                            Anterior
                        </button>
                        <button
                            className="text-xs rounded transition-all"
                            style={{
                                backgroundColor: properties.navigationButtonHoverBackground,
                                color: properties.navigationButtonTextColor,
                                borderColor: properties.navigationButtonBorder,
                                borderRadius: `${properties.navigationButtonBorderRadius}px`,
                                padding: properties.navigationButtonPadding,
                                border: '1px solid'
                            }}
                        >
                            Próximo
                        </button>
                    </div>
                </div>

                {/* Preview da toolbar */}
                <div
                    className="h-12 rounded flex items-center px-3 gap-2"
                    style={{
                        backgroundColor: properties.toolbarBackground,
                        borderColor: properties.toolbarBorder,
                        border: '1px solid'
                    }}
                >
                    <div
                        className="w-8 h-8 rounded flex items-center justify-center"
                        style={{
                            backgroundColor: properties.toolbarButtonBackground
                        }}
                    >
                        <Settings className="w-4 h-4 text-gray-400" />
                    </div>
                    <div
                        className="w-8 h-8 rounded flex items-center justify-center"
                        style={{
                            backgroundColor: properties.toolbarButtonHoverBackground
                        }}
                    >
                        <Eye className="w-4 h-4 text-white" />
                    </div>
                </div>
            </div>
        );
    };

    if (isPreviewMode) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-[#B89B7A]" />
                        Preview: Containers do Canvas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {renderPreview()}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Layers className="h-5 w-5 text-[#B89B7A]" />
                        Estilos dos Containers
                    </CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="text-xs"
                    >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Reset
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4 h-8">
                        <TabsTrigger value="canvas" className="text-xs">
                            <Square className="h-3 w-3 mr-1" />
                            Canvas
                        </TabsTrigger>
                        <TabsTrigger value="components" className="text-xs">
                            <Layout className="h-3 w-3 mr-1" />
                            Componentes
                        </TabsTrigger>
                        <TabsTrigger value="navigation" className="text-xs">
                            <Navigation className="h-3 w-3 mr-1" />
                            Navegação
                        </TabsTrigger>
                        <TabsTrigger value="toolbar" className="text-xs">
                            <Settings className="h-3 w-3 mr-1" />
                            Toolbar
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="canvas" className="space-y-4 m-0">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Square className="h-4 w-4 text-[#B89B7A]" />
                                <h3 className="font-medium">Área Principal do Canvas</h3>
                            </div>

                            <ColorPicker
                                value={properties.canvasBackground}
                                onChange={(color: string) => handleUpdate('canvasBackground', color)}
                                label="Cor de Fundo"
                            />

                            <div className="space-y-2">
                                <Label>Opacidade (%)</Label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={properties.canvasOpacity}
                                        onChange={(e) => handleUpdate('canvasOpacity', parseInt(e.target.value))}
                                        className="flex-1"
                                    />
                                    <Badge variant="outline" className="text-xs min-w-[50px]">
                                        {properties.canvasOpacity}%
                                    </Badge>
                                </div>
                            </div>

                            <ColorPicker
                                value={properties.canvasBorder}
                                onChange={(color: string) => handleUpdate('canvasBorder', color)}
                                label="Cor da Borda"
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label>Raio da Borda</Label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="50"
                                        value={properties.canvasBorderRadius}
                                        onChange={(e) => handleUpdate('canvasBorderRadius', parseInt(e.target.value))}
                                        className="w-full px-2 py-1 border rounded text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Padding</Label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={properties.canvasPadding}
                                        onChange={(e) => handleUpdate('canvasPadding', parseInt(e.target.value))}
                                        className="w-full px-2 py-1 border rounded text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="components" className="space-y-4 m-0">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Layout className="h-4 w-4 text-[#B89B7A]" />
                                <h3 className="font-medium">Containers dos Componentes</h3>
                            </div>

                            <ColorPicker
                                value={properties.componentContainerBackground}
                                onChange={(color) => handleUpdate('componentContainerBackground', color)}
                                label="Cor de Fundo"
                            />

                            <ColorPicker
                                value={properties.componentContainerBorder}
                                onChange={(color) => handleUpdate('componentContainerBorder', color)}
                                label="Cor da Borda"
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label>Raio da Borda</Label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="50"
                                        value={properties.componentContainerBorderRadius}
                                        onChange={(e) => handleUpdate('componentContainerBorderRadius', parseInt(e.target.value))}
                                        className="w-full px-2 py-1 border rounded text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Padding</Label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={properties.componentContainerPadding}
                                        onChange={(e) => handleUpdate('componentContainerPadding', parseInt(e.target.value))}
                                        className="w-full px-2 py-1 border rounded text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Sombra</Label>
                                <select
                                    value={properties.componentContainerShadow}
                                    onChange={(e) => handleUpdate('componentContainerShadow', e.target.value)}
                                    className="w-full px-2 py-1 border rounded text-sm"
                                >
                                    <option value="none">Nenhuma</option>
                                    <option value="0 1px 3px rgba(0,0,0,0.1)">Sutil</option>
                                    <option value="0 2px 4px rgba(0,0,0,0.1)">Leve</option>
                                    <option value="0 4px 6px rgba(0,0,0,0.1)">Média</option>
                                    <option value="0 8px 15px rgba(0,0,0,0.1)">Forte</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Efeito Hover</Label>
                                    <p className="text-xs text-gray-500">Animação ao passar o mouse</p>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={properties.componentContainerHoverEffect}
                                        onChange={(e) => handleUpdate('componentContainerHoverEffect', e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${properties.componentContainerHoverEffect ? 'bg-[#B89B7A]' : 'bg-gray-300'
                                        }`}>
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${properties.componentContainerHoverEffect ? 'translate-x-6' : 'translate-x-1'
                                            }`} />
                                    </div>
                                </label>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="navigation" className="space-y-4 m-0">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Navigation className="h-4 w-4 text-[#B89B7A]" />
                                <h3 className="font-medium">Botões de Navegação</h3>
                            </div>

                            <ColorPicker
                                value={properties.navigationButtonBackground}
                                onChange={(color) => handleUpdate('navigationButtonBackground', color)}
                                label="Cor de Fundo"
                            />

                            <ColorPicker
                                value={properties.navigationButtonTextColor}
                                onChange={(color) => handleUpdate('navigationButtonTextColor', color)}
                                label="Cor do Texto"
                            />

                            <ColorPicker
                                value={properties.navigationButtonHoverBackground}
                                onChange={(color) => handleUpdate('navigationButtonHoverBackground', color)}
                                label="Cor de Fundo (Hover)"
                            />

                            <ColorPicker
                                value={properties.navigationButtonBorder}
                                onChange={(color) => handleUpdate('navigationButtonBorder', color)}
                                label="Cor da Borda"
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label>Raio da Borda</Label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="50"
                                        value={properties.navigationButtonBorderRadius}
                                        onChange={(e) => handleUpdate('navigationButtonBorderRadius', parseInt(e.target.value))}
                                        className="w-full px-2 py-1 border rounded text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Padding</Label>
                                    <input
                                        type="text"
                                        value={properties.navigationButtonPadding}
                                        onChange={(e) => handleUpdate('navigationButtonPadding', e.target.value)}
                                        placeholder="8px 16px"
                                        className="w-full px-2 py-1 border rounded text-sm"
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="font-medium text-sm">Posicionamento dos Botões</h4>

                                <div className="space-y-2">
                                    <Label>Alinhamento Horizontal</Label>
                                    <select
                                        value={properties.navigationButtonAlignment}
                                        onChange={(e) => handleUpdate('navigationButtonAlignment', e.target.value)}
                                        className="w-full px-2 py-1 border rounded text-sm"
                                    >
                                        <option value="left">Esquerda</option>
                                        <option value="center">Centro</option>
                                        <option value="right">Direita</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Posição Vertical</Label>
                                    <select
                                        value={properties.navigationButtonVerticalPosition}
                                        onChange={(e) => handleUpdate('navigationButtonVerticalPosition', e.target.value)}
                                        className="w-full px-2 py-1 border rounded text-sm"
                                    >
                                        <option value="top">Superior</option>
                                        <option value="middle">Centro</option>
                                        <option value="bottom">Inferior</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Espaçamento entre Botões (px)</Label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="32"
                                            value={properties.navigationButtonSpacing}
                                            onChange={(e) => handleUpdate('navigationButtonSpacing', parseInt(e.target.value))}
                                            className="flex-1"
                                        />
                                        <Badge variant="outline" className="text-xs min-w-[50px]">
                                            {properties.navigationButtonSpacing}px
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="toolbar" className="space-y-4 m-0">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Settings className="h-4 w-4 text-[#B89B7A]" />
                                <h3 className="font-medium">Barra de Ferramentas</h3>
                            </div>

                            <ColorPicker
                                value={properties.toolbarBackground}
                                onChange={(color) => handleUpdate('toolbarBackground', color)}
                                label="Cor de Fundo da Toolbar"
                            />

                            <ColorPicker
                                value={properties.toolbarBorder}
                                onChange={(color) => handleUpdate('toolbarBorder', color)}
                                label="Cor da Borda da Toolbar"
                            />

                            <ColorPicker
                                value={properties.toolbarButtonBackground}
                                onChange={(color) => handleUpdate('toolbarButtonBackground', color)}
                                label="Cor de Fundo dos Botões"
                            />

                            <ColorPicker
                                value={properties.toolbarButtonHoverBackground}
                                onChange={(color) => handleUpdate('toolbarButtonHoverBackground', color)}
                                label="Cor de Fundo dos Botões (Hover)"
                            />

                            <Separator />

                            <div className="space-y-3">
                                <h4 className="font-medium text-sm">Dropzones (Áreas de Soltar)</h4>

                                <ColorPicker
                                    value={properties.dropzoneActiveBackground}
                                    onChange={(color) => handleUpdate('dropzoneActiveBackground', color)}
                                    label="Fundo Ativo"
                                />

                                <ColorPicker
                                    value={properties.dropzoneActiveBorder}
                                    onChange={(color) => handleUpdate('dropzoneActiveBorder', color)}
                                    label="Borda Ativa"
                                />

                                <ColorPicker
                                    value={properties.dropzoneIndicatorColor}
                                    onChange={(color) => handleUpdate('dropzoneIndicatorColor', color)}
                                    label="Cor do Indicador"
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <Separator />

                {/* Preview ao vivo */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#B89B7A]" />
                        <h3 className="font-medium">Preview em Tempo Real</h3>
                    </div>
                    {renderPreview()}
                </div>
            </CardContent>
        </Card>
    );
};

export default CanvasContainerPropertyEditor;
