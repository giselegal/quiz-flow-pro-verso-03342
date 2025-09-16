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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Palette, Settings, Smartphone } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { PropertyEditorProps } from '../interfaces/PropertyEditor';

export const LeadFormPropertyEditor: React.FC<PropertyEditorProps> = ({
    block,
    onUpdate,
    onValidate,
    isPreviewMode = false,
}) => {
    const [activeTab, setActiveTab] = useState<'fields' | 'style' | 'behavior' | 'mobile'>('fields');

    const handlePropertyChange = useCallback(
        (propertyName: string, value: any) => {
            onUpdate({ [propertyName]: value });

            // Validação: pelo menos um campo deve estar ativo
            const fields = value.fields || block.properties?.fields || [];
            const isValid = Array.isArray(fields) && fields.length > 0;
            onValidate?.(isValid);
        },
        [onUpdate, onValidate, block.properties?.fields]
    );

    if (isPreviewMode) {
        return (
            <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Preview mode - properties editing disabled</p>
            </div>
        );
    }

    const currentFields = block.properties?.fields || ['name', 'email'];
    const submitText = block.properties?.submitText || 'Receber Guia Gratuito';
    const containerWidth = block.properties?.containerWidth || 'full';
    const spacing = block.properties?.spacing || 'small';
    const backgroundColor = block.properties?.backgroundColor || '#FFFFFF';
    const borderColor = block.properties?.borderColor || '#E5E7EB';
    const textColor = block.properties?.textColor || '#374151';
    const buttonColor = block.properties?.buttonColor || '#B89B7A';
    const buttonTextColor = block.properties?.buttonTextColor || '#FFFFFF';
    const borderRadius = block.properties?.borderRadius || 8;
    const fontSize = block.properties?.fontSize || 16;

    // Propriedades mobile-first
    const mobileColumns = block.properties?.mobileColumns || 1;
    const tabletColumns = block.properties?.tabletColumns || 1;
    const desktopColumns = block.properties?.desktopColumns || 1;
    const mobilePadding = block.properties?.mobilePadding || 16;
    const tabletPadding = block.properties?.tabletPadding || 24;
    const desktopPadding = block.properties?.desktopPadding || 32;

    return (
        <Card className="h-full">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    Propriedades do Lead Form
                </CardTitle>

                {/* Tabs de Navegação */}
                <div className="flex bg-muted rounded-lg p-1">
                    <Button
                        variant={activeTab === 'fields' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('fields')}
                        className="flex-1 text-xs h-8"
                    >
                        <FileText className="h-3 w-3 mr-1" />
                        Campos
                    </Button>
                    <Button
                        variant={activeTab === 'style' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('style')}
                        className="flex-1 text-xs h-8"
                    >
                        <Palette className="h-3 w-3 mr-1" />
                        Estilo
                    </Button>
                    <Button
                        variant={activeTab === 'behavior' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('behavior')}
                        className="flex-1 text-xs h-8"
                    >
                        <Settings className="h-3 w-3 mr-1" />
                        Comportamento
                    </Button>
                    <Button
                        variant={activeTab === 'mobile' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('mobile')}
                        className="flex-1 text-xs h-8"
                    >
                        <Smartphone className="h-3 w-3 mr-1" />
                        Mobile
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {activeTab === 'fields' && (
                    <div className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium mb-3 block">Campos do Formulário</Label>
                            <div className="space-y-2">
                                {['name', 'email', 'phone', 'whatsapp'].map(field => (
                                    <div key={field} className="flex items-center space-x-2">
                                        <Switch
                                            checked={currentFields.includes(field)}
                                            onCheckedChange={checked => {
                                                const newFields = checked
                                                    ? [...currentFields, field]
                                                    : currentFields.filter(f => f !== field);
                                                handlePropertyChange('fields', newFields);
                                            }}
                                        />
                                        <Label className="text-sm">{
                                            field === 'name' ? 'Nome Completo' :
                                                field === 'email' ? 'E-mail' :
                                                    field === 'phone' ? 'Telefone' :
                                                        field === 'whatsapp' ? 'WhatsApp' : field
                                        }</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-medium">Texto do Botão</Label>
                            <Input
                                value={submitText}
                                onChange={e => handlePropertyChange('submitText', e.target.value)}
                                placeholder="Ex: Receber Guia Gratuito"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label className="text-sm font-medium">Mensagem de Sucesso</Label>
                            <Textarea
                                value={block.properties?.successMessage || ''}
                                onChange={e => handlePropertyChange('successMessage', e.target.value)}
                                placeholder="Ex: Obrigado! Você receberá seu guia por email."
                                className="mt-1 resize-none"
                                rows={2}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'style' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium">Largura do Container</Label>
                                <Select
                                    value={containerWidth}
                                    onValueChange={value => handlePropertyChange('containerWidth', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="full">Largura total</SelectItem>
                                        <SelectItem value="large">Grande (800px)</SelectItem>
                                        <SelectItem value="medium">Médio (600px)</SelectItem>
                                        <SelectItem value="small">Pequeno (400px)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Espaçamento</Label>
                                <Select
                                    value={spacing}
                                    onValueChange={value => handlePropertyChange('spacing', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tight">Apertado</SelectItem>
                                        <SelectItem value="small">Pequeno</SelectItem>
                                        <SelectItem value="medium">Médio</SelectItem>
                                        <SelectItem value="large">Grande</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium">Cor de Fundo</Label>
                                <input
                                    type="color"
                                    className="w-full h-10 border rounded-md cursor-pointer"
                                    value={backgroundColor}
                                    onChange={e => handlePropertyChange('backgroundColor', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Cor da Borda</Label>
                                <input
                                    type="color"
                                    className="w-full h-10 border rounded-md cursor-pointer"
                                    value={borderColor}
                                    onChange={e => handlePropertyChange('borderColor', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium">Cor do Texto</Label>
                                <input
                                    type="color"
                                    className="w-full h-10 border rounded-md cursor-pointer"
                                    value={textColor}
                                    onChange={e => handlePropertyChange('textColor', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Cor do Botão</Label>
                                <input
                                    type="color"
                                    className="w-full h-10 border rounded-md cursor-pointer"
                                    value={buttonColor}
                                    onChange={e => handlePropertyChange('buttonColor', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium">Arredondamento (px)</Label>
                                <Input
                                    type="number"
                                    value={borderRadius}
                                    onChange={e => handlePropertyChange('borderRadius', parseInt(e.target.value) || 0)}
                                    min={0}
                                    max={50}
                                />
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Tamanho da Fonte (px)</Label>
                                <Input
                                    type="number"
                                    value={fontSize}
                                    onChange={e => handlePropertyChange('fontSize', parseInt(e.target.value) || 16)}
                                    min={12}
                                    max={24}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'behavior' && (
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={block.properties?.required !== false}
                                    onCheckedChange={checked => handlePropertyChange('required', checked)}
                                />
                                <Label className="text-sm">Campos obrigatórios</Label>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={block.properties?.showValidation !== false}
                                    onCheckedChange={checked => handlePropertyChange('showValidation', checked)}
                                />
                                <Label className="text-sm">Mostrar mensagens de validação</Label>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={block.properties?.autoFocus === true}
                                    onCheckedChange={checked => handlePropertyChange('autoFocus', checked)}
                                />
                                <Label className="text-sm">Foco automático no primeiro campo</Label>
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-medium">Ação após envio</Label>
                            <Select
                                value={block.properties?.onSubmitAction || 'show-message'}
                                onValueChange={value => handlePropertyChange('onSubmitAction', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="show-message">Mostrar mensagem</SelectItem>
                                    <SelectItem value="redirect">Redirecionar</SelectItem>
                                    <SelectItem value="next-step">Próximo passo</SelectItem>
                                    <SelectItem value="custom">Ação customizada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="text-sm font-medium">URL de Redirecionamento (se aplicável)</Label>
                            <Input
                                value={block.properties?.redirectUrl || ''}
                                onChange={e => handlePropertyChange('redirectUrl', e.target.value)}
                                placeholder="https://exemplo.com/obrigado"
                                disabled={block.properties?.onSubmitAction !== 'redirect'}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'mobile' && (
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-900 mb-2">Configurações Mobile-First</h4>
                            <p className="text-xs text-blue-700">
                                Configure a aparência do formulário em diferentes tamanhos de tela
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium mb-3 block">Layout Responsivo</Label>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <Label className="text-xs">Mobile</Label>
                                    <Select
                                        value={String(mobileColumns)}
                                        onValueChange={value => handlePropertyChange('mobileColumns', parseInt(value))}
                                    >
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 coluna</SelectItem>
                                            <SelectItem value="2">2 colunas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-xs">Tablet</Label>
                                    <Select
                                        value={String(tabletColumns)}
                                        onValueChange={value => handlePropertyChange('tabletColumns', parseInt(value))}
                                    >
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 coluna</SelectItem>
                                            <SelectItem value="2">2 colunas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-xs">Desktop</Label>
                                    <Select
                                        value={String(desktopColumns)}
                                        onValueChange={value => handlePropertyChange('desktopColumns', parseInt(value))}
                                    >
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 coluna</SelectItem>
                                            <SelectItem value="2">2 colunas</SelectItem>
                                            <SelectItem value="3">3 colunas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-medium mb-3 block">Padding Responsivo</Label>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <Label className="text-xs">Mobile (px)</Label>
                                    <Input
                                        type="number"
                                        value={mobilePadding}
                                        onChange={e => handlePropertyChange('mobilePadding', parseInt(e.target.value) || 16)}
                                        className="h-8 text-xs"
                                        min={8}
                                        max={48}
                                    />
                                </div>

                                <div>
                                    <Label className="text-xs">Tablet (px)</Label>
                                    <Input
                                        type="number"
                                        value={tabletPadding}
                                        onChange={e => handlePropertyChange('tabletPadding', parseInt(e.target.value) || 24)}
                                        className="h-8 text-xs"
                                        min={8}
                                        max={48}
                                    />
                                </div>

                                <div>
                                    <Label className="text-xs">Desktop (px)</Label>
                                    <Input
                                        type="number"
                                        value={desktopPadding}
                                        onChange={e => handlePropertyChange('desktopPadding', parseInt(e.target.value) || 32)}
                                        className="h-8 text-xs"
                                        min={8}
                                        max={48}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={block.properties?.mobileOptimized !== false}
                                    onCheckedChange={checked => handlePropertyChange('mobileOptimized', checked)}
                                />
                                <Label className="text-sm">Otimização para mobile</Label>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Aplica estilos específicos para melhorar a experiência em dispositivos móveis
                            </p>
                        </div>
                    </div>
                )}

                {/* Preview Section */}
                <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
                    <h4 className="text-sm font-medium text-foreground mb-3">Preview:</h4>

                    <div className="space-y-3">
                        <div className="text-xs text-muted-foreground space-y-1">
                            <div>• Campos: {currentFields.join(', ')}</div>
                            <div>• Container: {containerWidth}</div>
                            <div>• Espaçamento: {spacing}</div>
                            <div>• Botão: "{submitText}"</div>
                        </div>

                        {/* Simulação visual do formulário */}
                        <div
                            className="border rounded-lg p-4 space-y-3"
                            style={{
                                backgroundColor,
                                borderColor,
                                borderRadius: `${borderRadius}px`,
                                fontSize: `${fontSize}px`
                            }}
                        >
                            {currentFields.map(field => (
                                <div key={field} className="space-y-1">
                                    <label className="text-xs font-medium" style={{ color: textColor }}>
                                        {field === 'name' ? 'Nome Completo' :
                                            field === 'email' ? 'E-mail' :
                                                field === 'phone' ? 'Telefone' :
                                                    field === 'whatsapp' ? 'WhatsApp' : field}
                                    </label>
                                    <div
                                        className="w-full h-8 border rounded px-2 text-xs flex items-center"
                                        style={{ borderColor }}
                                    >
                                        {field === 'name' ? 'Digite seu nome...' :
                                            field === 'email' ? 'Digite seu email...' :
                                                field === 'phone' ? 'Digite seu telefone...' :
                                                    field === 'whatsapp' ? 'Digite seu WhatsApp...' : '...'}
                                    </div>
                                </div>
                            ))}

                            <button
                                className="w-full py-2 px-4 rounded font-medium text-sm"
                                style={{
                                    backgroundColor: buttonColor,
                                    color: buttonTextColor,
                                    borderRadius: `${borderRadius}px`
                                }}
                            >
                                {submitText}
                            </button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};