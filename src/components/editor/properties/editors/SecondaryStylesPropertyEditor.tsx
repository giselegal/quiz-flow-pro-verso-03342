import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Block } from '@/types/editor';
import { AlertCircle, FileText, GripVertical, Layers, Plus, Trash2 } from 'lucide-react';
import React from 'react';

interface SecondaryStylesPropertyEditorProps {
    block: Block;
    onUpdate: (updates: Partial<Block>) => void;
    isPreviewMode?: boolean;
}

interface SecondaryStyle {
    id: string;
    name: string;
    percentage: number;
    description?: string;
}

export const SecondaryStylesPropertyEditor: React.FC<SecondaryStylesPropertyEditorProps> = ({
    block,
    onUpdate,
    isPreviewMode = false,
}) => {
    const content = block.content || {};

    // Propriedades específicas dos estilos secundários
    const title = content.title || 'Outros Estilos Compatíveis';
    const styles: SecondaryStyle[] = content.styles || [];
    const showPercentages = content.showPercentages !== false;

    const handleContentUpdate = (field: string, value: any) => {
        const updates = {
            content: {
                ...content,
                [field]: value,
            },
        };
        onUpdate(updates);
    };

    const addStyle = () => {
        const newStyle: SecondaryStyle = {
            id: `style-${Date.now()}`,
            name: 'Novo estilo',
            percentage: 0,
            description: '',
        };
        handleContentUpdate('styles', [...styles, newStyle]);
    };

    const updateStyle = (id: string, field: keyof SecondaryStyle, value: string | number) => {
        const updatedStyles = styles.map((style) =>
            style.id === id ? { ...style, [field]: value } : style
        );
        handleContentUpdate('styles', updatedStyles);
    };

    const removeStyle = (id: string) => {
        const updatedStyles = styles.filter((style) => style.id !== id);
        handleContentUpdate('styles', updatedStyles);
    };

    const moveStyle = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= styles.length) return;

        const updatedStyles = [...styles];
        [updatedStyles[index], updatedStyles[newIndex]] = [updatedStyles[newIndex], updatedStyles[index]];
        handleContentUpdate('styles', updatedStyles);
    };

    // Calcular soma total das porcentagens
    const totalPercentage = styles.reduce((sum, style) => sum + (style.percentage || 0), 0);
    const isPercentageValid = totalPercentage <= 100;

    return (
        <div className="space-y-4 p-4">
            {/* Preview */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        Preview dos Estilos Secundários
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <h4 className="font-semibold">{title}</h4>
                        {styles.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Nenhum estilo secundário adicionado.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {styles.map((style) => (
                                    <div key={style.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium">{style.name}</p>
                                                {showPercentages && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {style.percentage}%
                                                    </span>
                                                )}
                                            </div>
                                            {style.description && (
                                                <p className="text-xs text-muted-foreground mt-1">{style.description}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Título */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Título da Seção
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="secondary-title">Título</Label>
                        <Input
                            id="secondary-title"
                            value={title}
                            onChange={(e) => handleContentUpdate('title', e.target.value)}
                            placeholder="Ex: Outros Estilos Compatíveis"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Configurações */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Configurações</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="show-percentages">Mostrar Porcentagens</Label>
                            <p className="text-xs text-muted-foreground">Exibir % ao lado de cada estilo</p>
                        </div>
                        <Switch
                            id="show-percentages"
                            checked={showPercentages}
                            onCheckedChange={(checked) => handleContentUpdate('showPercentages', checked)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Lista de Estilos */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Estilos Secundários ({styles.length})</CardTitle>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={addStyle}
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Adicionar
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Validação de porcentagem */}
                    {styles.length > 0 && (
                        <div className={`flex items-start gap-2 p-3 rounded-lg ${isPercentageValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 text-sm">
                                <p className="font-medium">
                                    Total: {totalPercentage}% de 100%
                                </p>
                                {!isPercentageValid && (
                                    <p className="text-xs mt-1">
                                        A soma das porcentagens não pode ultrapassar 100%
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {styles.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Layers className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">Nenhum estilo secundário adicionado</p>
                            <p className="text-xs mt-1">Clique em "Adicionar" para começar</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {styles.map((style, index) => (
                                <div
                                    key={style.id}
                                    className="p-4 border rounded-lg space-y-3 bg-white"
                                >
                                    {/* Header com controles */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                                            <span className="text-sm font-medium">Estilo {index + 1}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => moveStyle(index, 'up')}
                                                disabled={index === 0}
                                            >
                                                ↑
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => moveStyle(index, 'down')}
                                                disabled={index === styles.length - 1}
                                            >
                                                ↓
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => removeStyle(style.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Campos */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label htmlFor={`style-name-${style.id}`} className="text-xs">
                                                Nome do Estilo *
                                            </Label>
                                            <Input
                                                id={`style-name-${style.id}`}
                                                value={style.name}
                                                onChange={(e) => updateStyle(style.id, 'name', e.target.value)}
                                                placeholder="Ex: Clássico"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor={`style-percentage-${style.id}`} className="text-xs">
                                                Porcentagem (0-100) *
                                            </Label>
                                            <Input
                                                id={`style-percentage-${style.id}`}
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={style.percentage}
                                                onChange={(e) => updateStyle(style.id, 'percentage', parseInt(e.target.value) || 0)}
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor={`style-desc-${style.id}`} className="text-xs">
                                            Descrição (opcional)
                                        </Label>
                                        <Textarea
                                            id={`style-desc-${style.id}`}
                                            value={style.description || ''}
                                            onChange={(e) => updateStyle(style.id, 'description', e.target.value)}
                                            placeholder="Descreva este estilo..."
                                            rows={2}
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
