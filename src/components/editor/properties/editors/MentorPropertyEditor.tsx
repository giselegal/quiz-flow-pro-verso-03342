import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Block } from '@/types/editor';
import { User, Palette, Layout, Settings } from 'lucide-react';
import { PropertyNumber } from '../components/PropertyNumber';

interface MentorPropertyEditorProps {
    block: Block;
    onUpdate: (updates: Partial<Block>) => void;
    isPreviewMode?: boolean;
}

export const MentorPropertyEditor: React.FC<MentorPropertyEditorProps> = ({
    block,
    onUpdate,
    isPreviewMode = false,
}) => {
    // Função helper para atualizar propriedades
    const updateProperty = (key: string, value: any) => {
        onUpdate({
            properties: {
                ...block.properties,
                [key]: value,
            },
        });
    };

    // Função helper para atualizar conteúdo
    const updateContent = (key: string, value: any) => {
        onUpdate({
            content: {
                ...block.content,
                [key]: value,
            },
        });
    };

    const content = block.content || {};
    const properties = block.properties || {};

    return (
        <div className="h-full overflow-y-auto">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-pink-500" />
                    <CardTitle className="text-sm font-medium">Seção da Mentora</CardTitle>
                </div>
                <Badge variant="outline" className="w-fit text-xs">
                    {block.type}
                </Badge>
            </CardHeader>

            <CardContent className="space-y-4 pb-4">
                {/* === CONTEÚDO === */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            <CardTitle className="text-sm">Conteúdo</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Título */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Título</Label>
                            <Input
                                placeholder="Ex: Conheça sua Mentora"
                                value={content.title || ''}
                                onChange={(e) => updateContent('title', e.target.value)}
                            />
                        </div>

                        {/* Subtítulo */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Subtítulo</Label>
                            <Input
                                placeholder="Ex: Especialista em Consultoria de Imagem"
                                value={content.subtitle || ''}
                                onChange={(e) => updateContent('subtitle', e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Separator />

                {/* === DESIGN === */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                            <Palette className="h-4 w-4" />
                            <CardTitle className="text-sm">Design</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Cor de fundo */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Cor de Fundo</Label>
                            <Input
                                type="color"
                                value={properties.backgroundColor || '#ffffff'}
                                onChange={(e) => updateProperty('backgroundColor', e.target.value)}
                            />
                        </div>

                        {/* Cor de destaque */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Cor de Destaque</Label>
                            <Input
                                type="color"
                                value={properties.accentColor || '#ec4899'}
                                onChange={(e) => updateProperty('accentColor', e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Separator />

                {/* === ESPAÇAMENTO === */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                            <Layout className="h-4 w-4" />
                            <CardTitle className="text-sm">Espaçamento</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Margem Superior */}
                        <PropertyNumber
                            label="Margem Superior"
                            value={properties.marginTop || 0}
                            onChange={(value) => updateProperty('marginTop', value)}
                            min={0}
                            max={200}
                            step={4}
                            unit="px"
                        />

                        {/* Margem Inferior */}
                        <PropertyNumber
                            label="Margem Inferior"
                            value={properties.marginBottom || 0}
                            onChange={(value) => updateProperty('marginBottom', value)}
                            min={0}
                            max={200}
                            step={4}
                            unit="px"
                        />

                        {/* Margem Esquerda */}
                        <PropertyNumber
                            label="Margem Esquerda"
                            value={properties.marginLeft || 0}
                            onChange={(value) => updateProperty('marginLeft', value)}
                            min={0}
                            max={200}
                            step={4}
                            unit="px"
                        />

                        {/* Margem Direita */}
                        <PropertyNumber
                            label="Margem Direita"
                            value={properties.marginRight || 0}
                            onChange={(value) => updateProperty('marginRight', value)}
                            min={0}
                            max={200}
                            step={4}
                            unit="px"
                        />
                    </CardContent>
                </Card>

                {/* Informações da Gisele (dados fixos) */}
                <Card className="bg-pink-50 border-pink-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-pink-700">Informações da Gisele Galvão</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-pink-600 space-y-1">
                        <p><strong>Nome:</strong> Gisele Galvão</p>
                        <p><strong>Título:</strong> Personal Stylist & Consultora de Imagem</p>
                        <p><strong>Experiência:</strong> 15+ anos, 10.000+ clientes</p>
                        <p><strong>Especialização:</strong> Consultoria de imagem e estilo pessoal</p>
                    </CardContent>
                </Card>
            </CardContent>
        </div>
    );
};

export default MentorPropertyEditor;