// 🚀 FASE 3B.1: PropertiesPanel extraído para lazy loading
// Arquivo separado para reduzir app-editor de 381KB → ~200KB

import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type { EditorElement } from '../types';

export interface EditorPropertiesPanelProps {
    selectedElement: EditorElement | null;
    onElementUpdate: (element: EditorElement) => void;
}

export const EditorPropertiesPanel: React.FC<EditorPropertiesPanelProps> = ({
    selectedElement,
    onElementUpdate,
}) => {
    const handlePropertyChange = (key: string, value: any, section: 'content' | 'properties' | 'styles' | 'behaviors' = 'properties') => {
        if (!selectedElement) return;

        const updated = { ...selectedElement };

        if (section === 'styles') {
            updated.styles = { ...updated.styles, [key]: value };
        } else if (section === 'content') {
            updated.content = { ...updated.content, [key]: value };
        } else if (section === 'properties') {
            updated.properties = { ...updated.properties, [key]: value };
        } else if (section === 'behaviors') {
            updated.behaviors = { ...updated.behaviors, [key]: value };
        }

        onElementUpdate(updated);
    };

    if (!selectedElement) {
        return (
            <div className="w-80 border-l border-gray-200 bg-gray-50 p-6">
                <div className="text-center text-gray-500">
                    <Settings className="w-12 h-12 mx-auto mb-4" />
                    <p className="font-medium">Nenhum elemento selecionado</p>
                    <p className="text-sm mt-1">Selecione um elemento no canvas para editar suas propriedades</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-80 border-l border-gray-200 bg-white">
            <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                    {/* Element Info */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            {selectedElement.name || selectedElement.type}
                        </h3>

                        <div className="space-y-2">
                            <div>
                                <Label htmlFor="element-name" className="text-sm">Nome do Elemento</Label>
                                <Input
                                    id="element-name"
                                    value={selectedElement.name || ''}
                                    onChange={(e) => handlePropertyChange('name', e.target.value)}
                                    placeholder="Nome do elemento"
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Content Properties */}
                    {(selectedElement.type === 'text' || selectedElement.type === 'heading' || selectedElement.type === 'button') && (
                        <div>
                            <h4 className="font-medium text-gray-800 mb-3">Conteúdo</h4>
                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="element-text" className="text-sm">Texto</Label>
                                    <Textarea
                                        id="element-text"
                                        value={selectedElement.content.text || ''}
                                        onChange={(e) => handlePropertyChange('text', e.target.value, 'content')}
                                        placeholder="Digite o texto aqui..."
                                        className="mt-1"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedElement.type === 'image' && (
                        <div>
                            <h4 className="font-medium text-gray-800 mb-3">Imagem</h4>
                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="image-src" className="text-sm">URL da Imagem</Label>
                                    <Input
                                        id="image-src"
                                        value={selectedElement.content.src || ''}
                                        onChange={(e) => handlePropertyChange('src', e.target.value, 'content')}
                                        placeholder="https://..."
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="image-alt" className="text-sm">Texto Alternativo</Label>
                                    <Input
                                        id="image-alt"
                                        value={selectedElement.content.alt || ''}
                                        onChange={(e) => handlePropertyChange('alt', e.target.value, 'content')}
                                        placeholder="Descrição da imagem"
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Style Properties */}
                    <div>
                        <h4 className="font-medium text-gray-800 mb-3">Aparência</h4>

                        <Tabs defaultValue="layout" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
                                <TabsTrigger value="typography" className="text-xs">Texto</TabsTrigger>
                                <TabsTrigger value="colors" className="text-xs">Cores</TabsTrigger>
                            </TabsList>

                            <TabsContent value="layout" className="space-y-3 mt-4">
                                {/* Width */}
                                <div>
                                    <Label htmlFor="width" className="text-sm">Largura</Label>
                                    <Input
                                        id="width"
                                        value={selectedElement.styles?.width || ''}
                                        onChange={(e) => handlePropertyChange('width', e.target.value, 'styles')}
                                        placeholder="auto, 100px, 50%"
                                        className="mt-1"
                                    />
                                </div>

                                {/* Height */}
                                <div>
                                    <Label htmlFor="height" className="text-sm">Altura</Label>
                                    <Input
                                        id="height"
                                        value={selectedElement.styles?.height || ''}
                                        onChange={(e) => handlePropertyChange('height', e.target.value, 'styles')}
                                        placeholder="auto, 200px, 100%"
                                        className="mt-1"
                                    />
                                </div>

                                {/* Padding */}
                                <div>
                                    <Label htmlFor="padding" className="text-sm">Padding</Label>
                                    <Input
                                        id="padding"
                                        value={selectedElement.styles?.padding || ''}
                                        onChange={(e) => handlePropertyChange('padding', e.target.value, 'styles')}
                                        placeholder="10px, 10px 20px"
                                        className="mt-1"
                                    />
                                </div>

                                {/* Margin */}
                                <div>
                                    <Label htmlFor="margin" className="text-sm">Margin</Label>
                                    <Input
                                        id="margin"
                                        value={selectedElement.styles?.margin || ''}
                                        onChange={(e) => handlePropertyChange('margin', e.target.value, 'styles')}
                                        placeholder="10px, 10px 20px"
                                        className="mt-1"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="typography" className="space-y-3 mt-4">
                                {/* Font Size */}
                                <div>
                                    <Label htmlFor="fontSize" className="text-sm">Tamanho da Fonte</Label>
                                    <Input
                                        id="fontSize"
                                        value={selectedElement.styles?.fontSize || ''}
                                        onChange={(e) => handlePropertyChange('fontSize', e.target.value, 'styles')}
                                        placeholder="16px, 1rem, 1.2em"
                                        className="mt-1"
                                    />
                                </div>

                                {/* Font Weight */}
                                <div>
                                    <Label htmlFor="fontWeight" className="text-sm">Peso da Fonte</Label>
                                    <Select
                                        value={selectedElement.styles?.fontWeight || ''}
                                        onValueChange={(value) => handlePropertyChange('fontWeight', value, 'styles')}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Selecione o peso" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="bold">Negrito</SelectItem>
                                            <SelectItem value="lighter">Mais Leve</SelectItem>
                                            <SelectItem value="bolder">Mais Pesado</SelectItem>
                                            <SelectItem value="100">100</SelectItem>
                                            <SelectItem value="400">400</SelectItem>
                                            <SelectItem value="700">700</SelectItem>
                                            <SelectItem value="900">900</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Text Align */}
                                <div>
                                    <Label htmlFor="textAlign" className="text-sm">Alinhamento</Label>
                                    <Select
                                        value={selectedElement.styles?.textAlign || ''}
                                        onValueChange={(value) => handlePropertyChange('textAlign', value, 'styles')}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Alinhamento do texto" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="left">Esquerda</SelectItem>
                                            <SelectItem value="center">Centro</SelectItem>
                                            <SelectItem value="right">Direita</SelectItem>
                                            <SelectItem value="justify">Justificado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TabsContent>

                            <TabsContent value="colors" className="space-y-3 mt-4">
                                {/* Text Color */}
                                <div>
                                    <Label htmlFor="color" className="text-sm">Cor do Texto</Label>
                                    <div className="flex gap-2 mt-1">
                                        <Input
                                            id="color"
                                            type="color"
                                            value={selectedElement.styles?.color || '#000000'}
                                            onChange={(e) => handlePropertyChange('color', e.target.value, 'styles')}
                                            className="w-12 h-8 p-0 border"
                                        />
                                        <Input
                                            value={selectedElement.styles?.color || ''}
                                            onChange={(e) => handlePropertyChange('color', e.target.value, 'styles')}
                                            placeholder="#000000"
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                {/* Background Color */}
                                <div>
                                    <Label htmlFor="backgroundColor" className="text-sm">Cor de Fundo</Label>
                                    <div className="flex gap-2 mt-1">
                                        <Input
                                            id="backgroundColor"
                                            type="color"
                                            value={selectedElement.styles?.backgroundColor || '#ffffff'}
                                            onChange={(e) => handlePropertyChange('backgroundColor', e.target.value, 'styles')}
                                            className="w-12 h-8 p-0 border"
                                        />
                                        <Input
                                            value={selectedElement.styles?.backgroundColor || ''}
                                            onChange={(e) => handlePropertyChange('backgroundColor', e.target.value, 'styles')}
                                            placeholder="transparent, #ffffff"
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                {/* Border */}
                                <div>
                                    <Label htmlFor="border" className="text-sm">Borda</Label>
                                    <Input
                                        id="border"
                                        value={selectedElement.styles?.border || ''}
                                        onChange={(e) => handlePropertyChange('border', e.target.value, 'styles')}
                                        placeholder="1px solid #ccc"
                                        className="mt-1"
                                    />
                                </div>

                                {/* Border Radius */}
                                <div>
                                    <Label htmlFor="borderRadius" className="text-sm">Arredondamento</Label>
                                    <Input
                                        id="borderRadius"
                                        value={selectedElement.styles?.borderRadius || ''}
                                        onChange={(e) => handlePropertyChange('borderRadius', e.target.value, 'styles')}
                                        placeholder="0px, 4px, 50%"
                                        className="mt-1"
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <Separator />

                    {/* Visibility and Position */}
                    <div>
                        <h4 className="font-medium text-gray-800 mb-3">Configurações</h4>
                        <div className="space-y-3">
                            {/* Visibility */}
                            <div className="flex items-center justify-between">
                                <Label htmlFor="visible" className="text-sm">Visível</Label>
                                <Switch
                                    id="visible"
                                    checked={selectedElement.visible !== false}
                                    onCheckedChange={(checked) => handlePropertyChange('visible', checked)}
                                />
                            </div>

                            {/* Locked */}
                            <div className="flex items-center justify-between">
                                <Label htmlFor="locked" className="text-sm">Bloqueado</Label>
                                <Switch
                                    id="locked"
                                    checked={selectedElement.locked || false}
                                    onCheckedChange={(checked) => handlePropertyChange('locked', checked)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default EditorPropertiesPanel;
