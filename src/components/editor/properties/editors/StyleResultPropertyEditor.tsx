import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Block } from '@/types/editor';
import { FileText, Image as ImageIcon, Palette, Sparkles } from 'lucide-react';
import React from 'react';

interface StyleResultPropertyEditorProps {
    block: Block;
    onUpdate: (updates: Partial<Block>) => void;
    isPreviewMode?: boolean;
}

export const StyleResultPropertyEditor: React.FC<StyleResultPropertyEditorProps> = ({
    block,
    onUpdate,
    isPreviewMode = false,
}) => {
    const content = block.content || {};

    // Propriedades específicas do resultado de estilo
    const styleName = content.styleName || '';
    const description = content.description || '';
    const showIcon = content.showIcon !== false;
    const customImage = content.customImage || '';
    const backgroundColor = content.backgroundColor || '#ffffff';

    const handleContentUpdate = (field: string, value: any) => {
        const updates = {
            content: {
                ...content,
                [field]: value,
            },
        };
        onUpdate(updates);
    };

    return (
        <div className="space-y-4 p-4">
            {/* Preview */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Preview do Estilo Principal
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        className="p-6 rounded-lg border"
                        style={{ backgroundColor }}
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            {showIcon && customImage && (
                                <img
                                    src={customImage}
                                    alt={styleName}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                            )}
                            {showIcon && !customImage && (
                                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-12 h-12 text-gray-400" />
                                </div>
                            )}
                            <h3 className="text-2xl font-bold">
                                {styleName || 'Nome do Estilo'}
                            </h3>
                            {description && (
                                <p className="text-sm text-muted-foreground max-w-md">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Conteúdo */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Conteúdo
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Nome do Estilo */}
                    <div className="space-y-2">
                        <Label htmlFor="style-name">Nome do Estilo *</Label>
                        <Input
                            id="style-name"
                            value={styleName}
                            onChange={(e) => handleContentUpdate('styleName', e.target.value)}
                            placeholder="Ex: Romântico, Clássico, Moderno..."
                        />
                    </div>

                    {/* Descrição */}
                    <div className="space-y-2">
                        <Label htmlFor="style-description">Descrição</Label>
                        <Textarea
                            id="style-description"
                            value={description}
                            onChange={(e) => handleContentUpdate('description', e.target.value)}
                            placeholder="Descreva as características deste estilo..."
                            rows={3}
                        />
                        <p className="text-xs text-muted-foreground">
                            {description.length} caracteres
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Imagem/Ícone */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Imagem/Ícone
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Mostrar Ícone */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="style-show-icon">Mostrar Ícone/Imagem</Label>
                            <p className="text-xs text-muted-foreground">Exibir representação visual do estilo</p>
                        </div>
                        <Switch
                            id="style-show-icon"
                            checked={showIcon}
                            onCheckedChange={(checked) => handleContentUpdate('showIcon', checked)}
                        />
                    </div>

                    {/* URL da Imagem Personalizada */}
                    {showIcon && (
                        <div className="space-y-2">
                            <Label htmlFor="style-image">URL da Imagem Personalizada</Label>
                            <Input
                                id="style-image"
                                type="url"
                                value={customImage}
                                onChange={(e) => handleContentUpdate('customImage', e.target.value)}
                                placeholder="https://exemplo.com/imagem.jpg"
                            />
                            <p className="text-xs text-muted-foreground">
                                Deixe em branco para usar ícone padrão
                            </p>
                        </div>
                    )}
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
                    {/* Cor de Fundo */}
                    <div className="space-y-2">
                        <Label htmlFor="style-bg-color">Cor de Fundo</Label>
                        <div className="flex gap-2">
                            <Input
                                id="style-bg-color"
                                type="color"
                                value={backgroundColor}
                                onChange={(e) => handleContentUpdate('backgroundColor', e.target.value)}
                                className="w-20 h-10 cursor-pointer"
                            />
                            <Input
                                type="text"
                                value={backgroundColor}
                                onChange={(e) => handleContentUpdate('backgroundColor', e.target.value)}
                                placeholder="#ffffff"
                                className="flex-1"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
