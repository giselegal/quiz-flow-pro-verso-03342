/**
 * 🎛️ INTRO STEP 01 - PROPERTIES PANEL
 * 
 * Painel de propriedades específico para a etapa 1 no editor
 * Permite configurar todos os aspectos visuais e de conteúdo
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export interface IntroStep01PropertiesPanelProps {
    properties: Record<string, any>;
    onUpdate: (key: string, value: any) => void;
}

export const IntroStep01_PropertiesPanel: React.FC<IntroStep01PropertiesPanelProps> = ({
    properties,
    onUpdate
}) => {
    // Extrair propriedades com valores padrão
    const {
        // Header
        logoUrl = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt = 'Logo Gisele Galvão',
        logoWidth = 96,
        logoHeight = 96,
        showBackButton = false,
        showProgressBar = false,
        progressValue = 0,

        // Title
        title = 'Chega de um guarda-roupa lotado...',
        titleColor = '#432818',
        titleAccentColor = '#B89B7A',

        // Image
        imageUrl = '',
        imageAlt = 'Descubra seu estilo',
        imageMaxWidth = 300,
        imageMaxHeight = 204,

        // Description
        description = 'Em poucos minutos, descubra seu estilo...',
        descriptionColor = '#6B7280',

        // Form
        formQuestion = 'Como posso te chamar?',
        inputPlaceholder = 'Digite seu primeiro nome aqui...',
        inputLabel = 'NOME',
        buttonText = 'Quero Descobrir meu Estilo Agora!',
        required = true,
        buttonColor = '#B89B7A',
        buttonTextColor = '#FFFFFF',
        inputBorderColor = '#B89B7A',

        // Background
        backgroundColor = '#FAF9F7'
    } = properties;

    return (
        <div className="space-y-6 p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* ====================================================================
                CABEÇALHO (HEADER)
            ==================================================================== */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold">🎯 Cabeçalho</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="logoUrl">URL da Logo</Label>
                        <Input
                            id="logoUrl"
                            value={logoUrl}
                            onChange={(e) => onUpdate('logoUrl', e.target.value)}
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <Label htmlFor="logoAlt">Texto Alternativo da Logo</Label>
                        <Input
                            id="logoAlt"
                            value={logoAlt}
                            onChange={(e) => onUpdate('logoAlt', e.target.value)}
                            placeholder="Logo da marca"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Largura: {logoWidth}px</Label>
                            <Slider
                                value={[logoWidth]}
                                onValueChange={([value]) => onUpdate('logoWidth', value)}
                                min={48}
                                max={200}
                                step={2}
                            />
                        </div>
                        <div>
                            <Label>Altura: {logoHeight}px</Label>
                            <Slider
                                value={[logoHeight]}
                                onValueChange={([value]) => onUpdate('logoHeight', value)}
                                min={48}
                                max={200}
                                step={2}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="showBackButton">Mostrar Botão Voltar</Label>
                        <Switch
                            id="showBackButton"
                            checked={showBackButton}
                            onCheckedChange={(checked) => onUpdate('showBackButton', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="showProgressBar">Mostrar Barra de Progresso</Label>
                        <Switch
                            id="showProgressBar"
                            checked={showProgressBar}
                            onCheckedChange={(checked) => onUpdate('showProgressBar', checked)}
                        />
                    </div>

                    {showProgressBar && (
                        <div>
                            <Label>Progresso: {progressValue}%</Label>
                            <Slider
                                value={[progressValue]}
                                onValueChange={([value]) => onUpdate('progressValue', value)}
                                min={0}
                                max={100}
                                step={5}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            <Separator />

            {/* ====================================================================
                TÍTULO
            ==================================================================== */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold">📝 Título Principal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="title">Texto do Título (HTML permitido)</Label>
                        <Textarea
                            id="title"
                            value={title}
                            onChange={(e) => onUpdate('title', e.target.value)}
                            placeholder="Digite o título..."
                            rows={3}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            💡 Use &lt;span style="color: #B89B7A;"&gt;texto&lt;/span&gt; para destacar
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="titleColor">Cor do Texto</Label>
                            <Input
                                id="titleColor"
                                type="color"
                                value={titleColor}
                                onChange={(e) => onUpdate('titleColor', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="titleAccentColor">Cor de Destaque</Label>
                            <Input
                                id="titleAccentColor"
                                type="color"
                                value={titleAccentColor}
                                onChange={(e) => onUpdate('titleAccentColor', e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* ====================================================================
                IMAGEM
            ==================================================================== */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold">🖼️ Imagem Principal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="imageUrl">URL da Imagem</Label>
                        <Input
                            id="imageUrl"
                            value={imageUrl}
                            onChange={(e) => onUpdate('imageUrl', e.target.value)}
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <Label htmlFor="imageAlt">Texto Alternativo</Label>
                        <Input
                            id="imageAlt"
                            value={imageAlt}
                            onChange={(e) => onUpdate('imageAlt', e.target.value)}
                            placeholder="Descrição da imagem"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Largura Máx: {imageMaxWidth}px</Label>
                            <Slider
                                value={[imageMaxWidth]}
                                onValueChange={([value]) => onUpdate('imageMaxWidth', value)}
                                min={200}
                                max={600}
                                step={10}
                            />
                        </div>
                        <div>
                            <Label>Altura Máx: {imageMaxHeight}px</Label>
                            <Slider
                                value={[imageMaxHeight]}
                                onValueChange={([value]) => onUpdate('imageMaxHeight', value)}
                                min={150}
                                max={500}
                                step={10}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* ====================================================================
                DESCRIÇÃO
            ==================================================================== */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold">📄 Descrição</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="description">Texto Descritivo (HTML permitido)</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => onUpdate('description', e.target.value)}
                            placeholder="Digite a descrição..."
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="descriptionColor">Cor do Texto</Label>
                        <Input
                            id="descriptionColor"
                            type="color"
                            value={descriptionColor}
                            onChange={(e) => onUpdate('descriptionColor', e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* ====================================================================
                FORMULÁRIO
            ==================================================================== */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold">📋 Formulário</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="formQuestion">Pergunta do Formulário</Label>
                        <Input
                            id="formQuestion"
                            value={formQuestion}
                            onChange={(e) => onUpdate('formQuestion', e.target.value)}
                            placeholder="Como posso te chamar?"
                        />
                    </div>

                    <div>
                        <Label htmlFor="inputLabel">Label do Input</Label>
                        <Input
                            id="inputLabel"
                            value={inputLabel}
                            onChange={(e) => onUpdate('inputLabel', e.target.value)}
                            placeholder="NOME"
                        />
                    </div>

                    <div>
                        <Label htmlFor="inputPlaceholder">Placeholder do Input</Label>
                        <Input
                            id="inputPlaceholder"
                            value={inputPlaceholder}
                            onChange={(e) => onUpdate('inputPlaceholder', e.target.value)}
                            placeholder="Digite seu primeiro nome aqui..."
                        />
                    </div>

                    <div>
                        <Label htmlFor="buttonText">Texto do Botão</Label>
                        <Input
                            id="buttonText"
                            value={buttonText}
                            onChange={(e) => onUpdate('buttonText', e.target.value)}
                            placeholder="Quero Descobrir meu Estilo Agora!"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="required">Campo Obrigatório</Label>
                        <Switch
                            id="required"
                            checked={required}
                            onCheckedChange={(checked) => onUpdate('required', checked)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="buttonColor">Cor do Botão</Label>
                            <Input
                                id="buttonColor"
                                type="color"
                                value={buttonColor}
                                onChange={(e) => onUpdate('buttonColor', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="buttonTextColor">Cor do Texto do Botão</Label>
                            <Input
                                id="buttonTextColor"
                                type="color"
                                value={buttonTextColor}
                                onChange={(e) => onUpdate('buttonTextColor', e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="inputBorderColor">Cor da Borda do Input</Label>
                        <Input
                            id="inputBorderColor"
                            type="color"
                            value={inputBorderColor}
                            onChange={(e) => onUpdate('inputBorderColor', e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* ====================================================================
                FUNDO
            ==================================================================== */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold">🎨 Aparência Geral</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="backgroundColor">Cor de Fundo</Label>
                        <Input
                            id="backgroundColor"
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => onUpdate('backgroundColor', e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default IntroStep01_PropertiesPanel;
