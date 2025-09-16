import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Palette, Image as ImageIcon, Layout, Settings, Zap, Wand2 } from 'lucide-react';
import type { PropertyEditorProps } from '../interfaces/PropertyEditor';

/**
 * ResultCommonPropertyEditor
 * Editor unificado para componentes de resultado:
 * - result-header-inline
 * - modular-result-header
 * - quiz-result-header / quiz-result-style / quiz-result-secondary
 * - result-card
 */
export const ResultCommonPropertyEditor: React.FC<PropertyEditorProps> = ({
    block,
    onUpdate,
    onValidate,
    isPreviewMode = false,
}) => {
    const [tab, setTab] = useState('content');

    const props = block?.properties || {};

    const update = useCallback((patch: Record<string, any>) => {
        onUpdate?.(patch);
        // Validação básica: título obrigatório para header principal
        const titleValid = typeof (patch.title ?? props.title) === 'string' && (patch.title ?? props.title)?.trim().length > 0;
        onValidate?.(titleValid);
    }, [onUpdate, onValidate, props.title]);

    const componentType = block?.type || '';
    const isHeader = /result-header|quiz-result-header|modular-result-header/.test(componentType);
    const supportsImages = isHeader || componentType.includes('style') || componentType.includes('card');
    const supportsSecondary = componentType.includes('modular') || componentType.includes('style') || componentType.includes('secondary');

    // Presets simples (MVP)
    const presets = useMemo(() => ([
        {
            key: 'minimal',
            label: 'Minimal',
            patch: { showBothImages: false, showSpecialTips: false, backgroundColor: 'transparent', spacing: 'compact' }
        },
        {
            key: 'visual',
            label: 'Destaque Visual',
            patch: { showBothImages: true, showSpecialTips: true, backgroundColor: '#FFF8F3', spacing: 'relaxed', showBorder: true, borderColor: '#B89B7A' }
        },
        {
            key: 'guide',
            label: 'Guia + Imagem',
            patch: { showBothImages: true, showSpecialTips: true, guideImageUrl: props.guideImageUrl || '', styleGuideImageUrl: props.styleGuideImageUrl || '' }
        }
    ]), [props.guideImageUrl, props.styleGuideImageUrl]);

    if (isPreviewMode) {
        return <div className="p-4 text-sm text-muted-foreground">Modo preview - edição desativada</div>;
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" /> Editor de Resultado
                </CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                    {presets.map(p => (
                        <Button key={p.key} size="xs" variant="outline" onClick={() => update(p.patch)} className="h-6 text-[11px] px-2">
                            <Wand2 className="h-3 w-3 mr-1" />{p.label}
                        </Button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="pt-0 overflow-auto">
                <Tabs value={tab} onValueChange={setTab} className="w-full">
                    <TabsList className="grid grid-cols-5 mb-4">
                        <TabsTrigger value="content">Conteúdo</TabsTrigger>
                        <TabsTrigger value="images" disabled={!supportsImages}>Imagens</TabsTrigger>
                        <TabsTrigger value="layout">Layout</TabsTrigger>
                        <TabsTrigger value="style">Estilo</TabsTrigger>
                        <TabsTrigger value="dynamic">Dinâmica</TabsTrigger>
                    </TabsList>

                    {/* Conteúdo */}
                    <TabsContent value="content" className="space-y-4">
                        <div>
                            <Label>Título</Label>
                            <Input defaultValue={props.title} placeholder="Título do resultado" onChange={e => update({ title: e.target.value })} />
                        </div>
                        <div>
                            <Label>Subtítulo</Label>
                            <Input defaultValue={props.subtitle} placeholder="Subtítulo" onChange={e => update({ subtitle: e.target.value })} />
                        </div>
                        <div>
                            <Label>Descrição</Label>
                            <Textarea defaultValue={props.description} rows={4} placeholder="Descrição explicativa" onChange={e => update({ description: e.target.value })} />
                        </div>
                        {isHeader && (
                            <div className="flex items-center justify-between">
                                <Label>Mostrar nome do usuário</Label>
                                <Switch checked={!!props.showUserName} onCheckedChange={v => update({ showUserName: v })} />
                            </div>
                        )}
                    </TabsContent>

                    {/* Imagens */}
                    <TabsContent value="images" className="space-y-4">
                        <div>
                            <Label>Imagem Principal (imageUrl)</Label>
                            <Input defaultValue={props.imageUrl} placeholder="https://..." onChange={e => update({ imageUrl: e.target.value })} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Mostrar duas imagens</Label>
                            <Switch checked={!!props.showBothImages} onCheckedChange={v => update({ showBothImages: v })} />
                        </div>
                        {props.showBothImages && (
                            <>
                                <div>
                                    <Label>Imagem Guia (guideImageUrl)</Label>
                                    <Input defaultValue={props.guideImageUrl} placeholder="https://..." onChange={e => update({ guideImageUrl: e.target.value })} />
                                </div>
                                <div>
                                    <Label>Imagem Estilo (styleGuideImageUrl)</Label>
                                    <Input defaultValue={props.styleGuideImageUrl} placeholder="https://..." onChange={e => update({ styleGuideImageUrl: e.target.value })} />
                                </div>
                            </>
                        )}
                    </TabsContent>

                    {/* Layout */}
                    <TabsContent value="layout" className="space-y-4">
                        <div>
                            <Label>Largura do Container</Label>
                            <Select defaultValue={props.containerWidth || 'full'} onValueChange={v => update({ containerWidth: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="small">Small</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="large">Large</SelectItem>
                                    <SelectItem value="full">Full</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Espaçamento</Label>
                            <Select defaultValue={props.spacing || 'normal'} onValueChange={v => update({ spacing: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="compact">Compacto</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="relaxed">Relaxado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Alinhamento do Texto</Label>
                            <Select defaultValue={props.textAlign || 'center'} onValueChange={v => update({ textAlign: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="left">Esquerda</SelectItem>
                                    <SelectItem value="center">Centro</SelectItem>
                                    <SelectItem value="right">Direita</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Margin Top</Label>
                                <Input type="number" defaultValue={props.marginTop ?? 0} onChange={e => update({ marginTop: Number(e.target.value) })} />
                            </div>
                            <div>
                                <Label>Margin Bottom</Label>
                                <Input type="number" defaultValue={props.marginBottom ?? 0} onChange={e => update({ marginBottom: Number(e.target.value) })} />
                            </div>
                        </div>
                        <div>
                            <Label>Variante Mobile</Label>
                            <Select defaultValue={props.mobileVariant || 'stack'} onValueChange={v => update({ mobileVariant: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="stack">Stack</SelectItem>
                                    <SelectItem value="compact">Compact</SelectItem>
                                    <SelectItem value="minimal">Minimal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </TabsContent>

                    {/* Estilo */}
                    <TabsContent value="style" className="space-y-4">
                        <div>
                            <Label>Cor de Fundo</Label>
                            <Input type="color" defaultValue={props.backgroundColor || '#FFFFFF'} onChange={e => update({ backgroundColor: e.target.value })} />
                        </div>
                        <div>
                            <Label>Cor da Borda</Label>
                            <Input type="color" defaultValue={props.borderColor || '#E5E7EB'} onChange={e => update({ borderColor: e.target.value })} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Mostrar Borda</Label>
                            <Switch checked={!!props.showBorder} onCheckedChange={v => update({ showBorder: v })} />
                        </div>
                        <div>
                            <Label>Cor do Progresso</Label>
                            <Input type="color" defaultValue={props.progressColor || '#B89B7A'} onChange={e => update({ progressColor: e.target.value })} />
                        </div>
                        <div>
                            <Label>Badge Text</Label>
                            <Input defaultValue={props.badgeText || 'Exclusivo'} onChange={e => update({ badgeText: e.target.value })} />
                        </div>
                    </TabsContent>

                    {/* Dinâmica */}
                    <TabsContent value="dynamic" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Mostrar Dicas Especiais</Label>
                            <Switch checked={!!props.showSpecialTips} onCheckedChange={v => update({ showSpecialTips: v })} />
                        </div>
                        <div>
                            <Label>Override de Percentual (opcional)</Label>
                            <Input type="number" defaultValue={props.percentage ?? ''} placeholder="Ex: 78" onChange={e => update({ percentage: e.target.value ? Number(e.target.value) : undefined })} />
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default ResultCommonPropertyEditor;
