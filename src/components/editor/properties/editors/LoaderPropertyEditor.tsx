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
import { Loader2, Palette, Settings } from 'lucide-react';
import React from 'react';

interface LoaderPropertyEditorProps {
    block: Block;
    onUpdate: (updates: Partial<Block>) => void;
    isPreviewMode?: boolean;
}

export const LoaderPropertyEditor: React.FC<LoaderPropertyEditorProps> = ({
    block,
    onUpdate,
    isPreviewMode = false,
}) => {
    const content = block.content || {};

    // Propriedades específicas do loader
    const color = content.color || '#3b82f6';
    const dots = content.dots || 3;
    const size = content.size || 'md';
    const animationSpeed = content.animationSpeed || 'normal';

    const handleContentUpdate = (field: string, value: any) => {
        const updates = {
            content: {
                ...content,
                [field]: value,
            },
        };
        onUpdate(updates);
    };

    const sizeOptions = [
        { value: 'sm', label: 'Pequeno' },
        { value: 'md', label: 'Médio' },
        { value: 'lg', label: 'Grande' },
        { value: 'xl', label: 'Extra Grande' },
    ];

    const speedOptions = [
        { value: 'slow', label: 'Lento' },
        { value: 'normal', label: 'Normal' },
        { value: 'fast', label: 'Rápido' },
    ];

    return (
        <div className="space-y-4 p-4">
            {/* Preview */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Loader2 className="w-4 h-4" />
                        Preview do Loader
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8 bg-gray-50 rounded-md">
                        <div className="flex gap-2">
                            {Array.from({ length: Number(dots) }).map((_, i) => (
                                <div
                                    key={i}
                                    className="rounded-full animate-pulse"
                                    style={{
                                        backgroundColor: color,
                                        width: size === 'sm' ? '8px' : size === 'md' ? '12px' : size === 'lg' ? '16px' : '20px',
                                        height: size === 'sm' ? '8px' : size === 'md' ? '12px' : size === 'lg' ? '16px' : '20px',
                                        animationDelay: `${i * 0.15}s`,
                                        animationDuration: animationSpeed === 'slow' ? '1.5s' : animationSpeed === 'normal' ? '1s' : '0.5s',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Aparência */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Aparência
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Cor */}
                    <div className="space-y-2">
                        <Label htmlFor="loader-color">Cor</Label>
                        <div className="flex gap-2">
                            <Input
                                id="loader-color"
                                type="color"
                                value={color}
                                onChange={(e) => handleContentUpdate('color', e.target.value)}
                                className="w-20 h-10 cursor-pointer"
                            />
                            <Input
                                type="text"
                                value={color}
                                onChange={(e) => handleContentUpdate('color', e.target.value)}
                                placeholder="#3b82f6"
                                className="flex-1"
                            />
                        </div>
                    </div>

                    {/* Tamanho */}
                    <div className="space-y-2">
                        <Label htmlFor="loader-size">Tamanho</Label>
                        <Select
                            value={size}
                            onValueChange={(value) => handleContentUpdate('size', value)}
                        >
                            <SelectTrigger id="loader-size">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {sizeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Configurações */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Configurações
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Número de Pontos */}
                    <div className="space-y-2">
                        <Label htmlFor="loader-dots">Número de Pontos</Label>
                        <Input
                            id="loader-dots"
                            type="number"
                            min={2}
                            max={5}
                            value={dots}
                            onChange={(e) => handleContentUpdate('dots', parseInt(e.target.value))}
                        />
                        <p className="text-xs text-muted-foreground">Mínimo: 2, Máximo: 5</p>
                    </div>

                    {/* Velocidade da Animação */}
                    <div className="space-y-2">
                        <Label htmlFor="loader-speed">Velocidade da Animação</Label>
                        <Select
                            value={animationSpeed}
                            onValueChange={(value) => handleContentUpdate('animationSpeed', value)}
                        >
                            <SelectTrigger id="loader-speed">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {speedOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
