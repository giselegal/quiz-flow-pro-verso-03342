import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Block } from '@/types/editor';
import { BarChart3, Palette, Settings } from 'lucide-react';
import React from 'react';

interface ProgressPropertyEditorProps {
    block: Block;
    onUpdate: (updates: Partial<Block>) => void;
    isPreviewMode?: boolean;
}

export const ProgressPropertyEditor: React.FC<ProgressPropertyEditorProps> = ({
    block,
    onUpdate,
    isPreviewMode = false,
}) => {
    const content = block.content || {};

    // Propriedades específicas do progresso
    const currentStep = content.currentStep || 1;
    const totalSteps = content.totalSteps || 5;
    const showPercentage = content.showPercentage !== false;
    const color = content.color || '#3b82f6';
    const height = content.height || 4;

    const handleContentUpdate = (field: string, value: any) => {
        const updates = {
            content: {
                ...content,
                [field]: value,
            },
        };
        onUpdate(updates);
    };

    const percentage = Math.round((currentStep / totalSteps) * 100);

    return (
        <div className="space-y-4 p-4">
            {/* Preview */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Preview da Barra de Progresso
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {showPercentage && (
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Passo {currentStep} de {totalSteps}</span>
                                <span>{percentage}%</span>
                            </div>
                        )}
                        <div className="w-full bg-gray-200 rounded-full overflow-hidden" style={{ height: `${height}px` }}>
                            <div
                                className="h-full transition-all duration-300 ease-in-out"
                                style={{
                                    width: `${percentage}%`,
                                    backgroundColor: color,
                                }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Configurações */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Configurações
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Passo Atual */}
                    <div className="space-y-2">
                        <Label htmlFor="progress-current">Passo Atual</Label>
                        <Input
                            id="progress-current"
                            type="number"
                            min={1}
                            max={totalSteps}
                            value={currentStep}
                            onChange={(e) => handleContentUpdate('currentStep', parseInt(e.target.value) || 1)}
                        />
                        <p className="text-xs text-muted-foreground">Mínimo: 1, Máximo: {totalSteps}</p>
                    </div>

                    {/* Total de Passos */}
                    <div className="space-y-2">
                        <Label htmlFor="progress-total">Total de Passos</Label>
                        <Input
                            id="progress-total"
                            type="number"
                            min={1}
                            value={totalSteps}
                            onChange={(e) => handleContentUpdate('totalSteps', parseInt(e.target.value) || 1)}
                        />
                        <p className="text-xs text-muted-foreground">Mínimo: 1</p>
                    </div>

                    {/* Mostrar Porcentagem */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="progress-show-percentage">Mostrar Porcentagem</Label>
                            <p className="text-xs text-muted-foreground">Exibir texto com o progresso acima da barra</p>
                        </div>
                        <Switch
                            id="progress-show-percentage"
                            checked={showPercentage}
                            onCheckedChange={(checked) => handleContentUpdate('showPercentage', checked)}
                        />
                    </div>
                </CardContent>
            </Card>

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
                        <Label htmlFor="progress-color">Cor da Barra</Label>
                        <div className="flex gap-2">
                            <Input
                                id="progress-color"
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

                    {/* Altura */}
                    <div className="space-y-2">
                        <Label htmlFor="progress-height">Altura da Barra (px)</Label>
                        <Input
                            id="progress-height"
                            type="number"
                            min={2}
                            max={10}
                            value={height}
                            onChange={(e) => handleContentUpdate('height', parseInt(e.target.value) || 4)}
                        />
                        <p className="text-xs text-muted-foreground">Mínimo: 2px, Máximo: 10px</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
