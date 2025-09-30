import React, { useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash, Edit3 } from 'lucide-react';
import { STRATEGIC_ANSWER_TO_OFFER_KEY } from '@/data/quizSteps';

interface QuizUnifiedPropertiesPanelProps {
    question: any;
    styles: any[];
    onQuestionChange: (q: any) => void;
    onStylesChange?: (s: any[]) => void;
}

/**
 * Painel unificado Fase 3:
 * - Edita título, subtítulo
 * - Edita requiredSelections
 * - Edita opções (texto + imagem URL)
 * - Placeholder de pontuação por estilo (stylePoints) se existir styles
 */
const QuizUnifiedPropertiesPanel: React.FC<QuizUnifiedPropertiesPanelProps> = ({ question, styles, onQuestionChange }) => {

    const updateField = useCallback((field: string, value: any) => {
        onQuestionChange({ ...question, [field]: value });
    }, [question, onQuestionChange]);

    const updateOption = useCallback((index: number, field: string, value: any) => {
        const updated = [...(question.answers || [])];
        updated[index] = { ...updated[index], [field]: value };
        onQuestionChange({ ...question, answers: updated });
    }, [question, onQuestionChange]);

    const addOption = () => {
        const updated = [
            ...(question.answers || []),
            { id: `${question.id}-opt-${(question.answers?.length || 0) + 1}`, text: 'Nova opção', description: '', image: '', stylePoints: {} }
        ];
        onQuestionChange({ ...question, answers: updated });
    };

    const removeOption = (index: number) => {
        const updated = [...(question.answers || [])];
        updated.splice(index, 1);
        onQuestionChange({ ...question, answers: updated });
    };

    const updateStylePoint = (optionIndex: number, styleId: string, value: string) => {
        const answers = [...(question.answers || [])];
        const opt = { ...answers[optionIndex] };
        const pts = { ...(opt.stylePoints || {}) };
        const numeric = Number(value);
        if (!isNaN(numeric)) {
            pts[styleId] = numeric;
            opt.stylePoints = pts;
            answers[optionIndex] = opt;
            onQuestionChange({ ...question, answers });
        }
    };

    // ------- Variants (oferta) CRUD -------
    const ensureVariants = () => question.variants || [];
    const addVariant = () => {
        const variants = ensureVariants();
        const nextId = `variant-${variants.length + 1}`;
        const updated = [...variants, { id: nextId, matchValue: nextId, title: 'Nova Variante', description: '', buttonText: 'Comprar', testimonial: '' }];
        onQuestionChange({ ...question, variants: updated });
    };
    const updateVariantField = (index: number, field: string, value: any) => {
        const variants = ensureVariants().map((v: any, i: number) => i === index ? { ...v, [field]: value } : v);
        onQuestionChange({ ...question, variants });
    };
    const removeVariant = (index: number) => {
        const variants = ensureVariants();
        variants.splice(index, 1);
        onQuestionChange({ ...question, variants: [...variants] });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        Configuração da Questão
                        <Badge variant="outline">{question.type}</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label>Título</Label>
                            <Input value={question.title || ''} onChange={e => updateField('title', e.target.value)} placeholder="Título da questão" />
                        </div>
                        <div>
                            <Label>Subtítulo</Label>
                            <Input value={question.subtitle || ''} onChange={e => updateField('subtitle', e.target.value)} placeholder="Subtítulo (opcional)" />
                        </div>
                        {'requiredSelections' in question && (
                            <div>
                                <Label>Seleções Requeridas</Label>
                                <Input type="number" value={question.requiredSelections || ''} onChange={e => updateField('requiredSelections', Number(e.target.value) || null)} placeholder="Ex: 3" />
                            </div>
                        )}
                        <div>
                            <Label>Tipo</Label>
                            <Input value={question.type} disabled />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Opções ({question.answers?.length || 0})</CardTitle>
                    <Button size="sm" variant="outline" onClick={addOption}>
                        <Plus className="w-4 h-4 mr-1" /> Nova Opção
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {(question.answers || []).map((opt: any, idx: number) => (
                        <div key={opt.id} className="border rounded-lg p-4 space-y-3">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <Label>Texto</Label>
                                    <Input value={opt.text} onChange={e => updateOption(idx, 'text', e.target.value)} />
                                </div>
                                <div>
                                    <Label>Imagem (URL / Upload)</Label>
                                    <div className="flex items-start gap-2">
                                        <Input className="flex-1" value={opt.image || ''} onChange={e => updateOption(idx, 'image', e.target.value)} placeholder="https://... ou upload" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id={`upload-${question.id}-${opt.id}`}
                                            onChange={e => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (ev) => {
                                                        const dataUrl = ev.target?.result as string;
                                                        updateOption(idx, 'image', dataUrl);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => document.getElementById(`upload-${question.id}-${opt.id}`)?.click()}
                                        >
                                            Upload
                                        </Button>
                                        {opt.image && (
                                            <div className="w-14 h-14 border rounded overflow-hidden flex items-center justify-center bg-muted">
                                                <img src={opt.image} alt="preview" className="object-cover w-full h-full" onError={(ev) => { (ev.currentTarget as any).style.display = 'none'; }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label>Descrição</Label>
                                    <Input value={opt.description || ''} onChange={e => updateOption(idx, 'description', e.target.value)} placeholder="Opcional" />
                                </div>
                            </div>

                            {styles.length > 0 && (
                                <div className="overflow-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr>
                                                <th className="text-left py-1 pr-2">Estilo</th>
                                                <th className="text-left py-1">Pontuação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {styles.map(style => (
                                                <tr key={style.id} className="border-t">
                                                    <td className="py-1 pr-2">{style.name}</td>
                                                    <td className="py-1">
                                                        <Input
                                                            className="h-7"
                                                            type="number"
                                                            value={(opt.stylePoints && opt.stylePoints[style.id]) || ''}
                                                            onChange={e => updateStylePoint(idx, style.id, e.target.value)}
                                                            placeholder="0"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <Button size="sm" variant="ghost" onClick={() => removeOption(idx)}>
                                    <Trash className="w-4 h-4 mr-1" /> Remover
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Pontuação Agregada (Preview)</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Esta tabela é uma prévia simples da soma de pontos por estilo nesta questão.</p>
                    <div className="grid md:grid-cols-4 gap-4 mt-4">
                        {styles.map(s => {
                            const total = (question.answers || []).reduce((acc: number, a: any) => acc + (a.stylePoints?.[s.id] || 0), 0);
                            return (
                                <div key={s.id} className="border rounded p-2 text-center">
                                    <div className="text-sm font-medium">{s.name}</div>
                                    <div className="text-lg font-semibold">{total}</div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {question.rawType === 'offer' && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            Variantes da Oferta
                            <Badge variant="outline">{(question.variants?.length) || 0}</Badge>
                        </CardTitle>
                        <Button size="sm" variant="outline" onClick={addVariant}>
                            <Plus className="w-4 h-4 mr-1" /> Nova Variante
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {ensureVariants().length === 0 && (
                            <p className="text-sm text-muted-foreground">Nenhuma variante definida. Use "Nova Variante" para criar.</p>
                        )}
                        {ensureVariants().map((v: any, idx: number) => (
                            <div key={v.id || idx} className="border rounded-lg p-4 space-y-3">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <Label>Match Value</Label>
                                        <Input value={v.matchValue} onChange={e => updateVariantField(idx, 'matchValue', e.target.value)} placeholder="ex: ALTA_AUTONOMIA" />
                                    </div>
                                    <div>
                                        <Label>Título</Label>
                                        <Input value={v.title} onChange={e => updateVariantField(idx, 'title', e.target.value)} />
                                    </div>
                                    <div>
                                        <Label>CTA (Button)</Label>
                                        <Input value={v.buttonText} onChange={e => updateVariantField(idx, 'buttonText', e.target.value)} />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Descrição</Label>
                                        <Input value={v.description} onChange={e => updateVariantField(idx, 'description', e.target.value)} placeholder="Resumo da oferta" />
                                    </div>
                                    <div>
                                        <Label>Testimonial</Label>
                                        <Input value={v.testimonial} onChange={e => updateVariantField(idx, 'testimonial', e.target.value)} placeholder="Depoimento curto" />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button size="sm" variant="ghost" onClick={() => removeVariant(idx)}>
                                        <Trash className="w-4 h-4 mr-1" /> Remover
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {question.rawType === 'strategic-question' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Mapeamento Estratégico → Variantes de Oferta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Este painel mostra como cada resposta estratégica poderá direcionar para variantes de oferta (matchValue). Edição completa será implementada em fase posterior.
                        </p>
                        <div className="overflow-auto">
                            <table className="w-full text-xs border">
                                <thead>
                                    <tr className="bg-muted/30">
                                        <th className="text-left p-2">Resposta Estratégica</th>
                                        <th className="text-left p-2">Match Value (Previsto)</th>
                                        <th className="text-left p-2">Observação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(question.answers || []).map((a: any) => {
                                        const mv = a[STRATEGIC_ANSWER_TO_OFFER_KEY] || a.matchValue || a.id;
                                        return (
                                            <tr key={a.id} className="border-t">
                                                <td className="p-2 font-medium whitespace-nowrap">{a.text}</td>
                                                <td className="p-2">{mv}</td>
                                                <td className="p-2 text-muted-foreground">Ligação automática (read-only)</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default QuizUnifiedPropertiesPanel;
