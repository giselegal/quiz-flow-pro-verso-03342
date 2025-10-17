import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Block } from '@/types/editor';
import { GripVertical, List, Plus, Trash2 } from 'lucide-react';
import React from 'react';

interface CharacteristicsPropertyEditorProps {
    block: Block;
    onUpdate: (updates: Partial<Block>) => void;
    isPreviewMode?: boolean;
}

interface Characteristic {
    id: string;
    label: string;
    value: string;
    icon?: string;
}

export const CharacteristicsPropertyEditor: React.FC<CharacteristicsPropertyEditorProps> = ({
    block,
    onUpdate,
    isPreviewMode = false,
}) => {
    const content = block.content || {};

    // Propriedades específicas das características
    const items: Characteristic[] = content.items || [];
    const layout = content.layout || 'list';

    const handleContentUpdate = (field: string, value: any) => {
        const updates = {
            content: {
                ...content,
                [field]: value,
            },
        };
        onUpdate(updates);
    };

    const addCharacteristic = () => {
        const newItem: Characteristic = {
            id: `char-${Date.now()}`,
            label: 'Nova característica',
            value: 'Valor',
            icon: undefined,
        };
        handleContentUpdate('items', [...items, newItem]);
    };

    const updateCharacteristic = (id: string, field: keyof Characteristic, value: string) => {
        const updatedItems = items.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
        );
        handleContentUpdate('items', updatedItems);
    };

    const removeCharacteristic = (id: string) => {
        const updatedItems = items.filter((item) => item.id !== id);
        handleContentUpdate('items', updatedItems);
    };

    const moveCharacteristic = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= items.length) return;

        const updatedItems = [...items];
        [updatedItems[index], updatedItems[newIndex]] = [updatedItems[newIndex], updatedItems[index]];
        handleContentUpdate('items', updatedItems);
    };

    const layoutOptions = [
        { value: 'list', label: 'Lista' },
        { value: 'grid', label: 'Grade' },
    ];

    return (
        <div className="space-y-4 p-4">
            {/* Preview */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <List className="w-4 h-4" />
                        Preview das Características
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={layout === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-3'}>
                        {items.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                Nenhuma característica adicionada. Clique em "Adicionar Característica" abaixo.
                            </p>
                        ) : (
                            items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{item.label}</p>
                                        <p className="text-sm text-muted-foreground">{item.value}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Layout */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Layout</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="characteristics-layout">Estilo de Exibição</Label>
                        <Select
                            value={layout}
                            onValueChange={(value) => handleContentUpdate('layout', value)}
                        >
                            <SelectTrigger id="characteristics-layout">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {layoutOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Lista de Características */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Características ({items.length})</CardTitle>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={addCharacteristic}
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Adicionar
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {items.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <List className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">Nenhuma característica adicionada</p>
                            <p className="text-xs mt-1">Clique em "Adicionar" para começar</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="p-4 border rounded-lg space-y-3 bg-white"
                                >
                                    {/* Header com controles */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                                            <span className="text-sm font-medium">Característica {index + 1}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => moveCharacteristic(index, 'up')}
                                                disabled={index === 0}
                                            >
                                                ↑
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => moveCharacteristic(index, 'down')}
                                                disabled={index === items.length - 1}
                                            >
                                                ↓
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => removeCharacteristic(item.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Campos */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label htmlFor={`char-label-${item.id}`} className="text-xs">
                                                Rótulo
                                            </Label>
                                            <Input
                                                id={`char-label-${item.id}`}
                                                value={item.label}
                                                onChange={(e) => updateCharacteristic(item.id, 'label', e.target.value)}
                                                placeholder="Ex: Estilo"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor={`char-value-${item.id}`} className="text-xs">
                                                Valor
                                            </Label>
                                            <Input
                                                id={`char-value-${item.id}`}
                                                value={item.value}
                                                onChange={(e) => updateCharacteristic(item.id, 'value', e.target.value)}
                                                placeholder="Ex: Romântico"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor={`char-icon-${item.id}`} className="text-xs">
                                            Ícone (opcional)
                                        </Label>
                                        <Input
                                            id={`char-icon-${item.id}`}
                                            value={item.icon || ''}
                                            onChange={(e) => updateCharacteristic(item.id, 'icon', e.target.value)}
                                            placeholder="Ex: ✨, 🎨, 💫"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
