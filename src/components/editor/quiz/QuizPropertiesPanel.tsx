import React, { useMemo } from 'react';
import { useQuizEditor } from '@/domain/quiz/useQuizEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

/**
 * QuizPropertiesPanel (Fase A - versão inicial)
 * - Exibe e permite edição básica de campos principais do step selecionado:
 *   - title (quando existir)
 *   - questionText (question / strategic-question)
 *   - options text (question / strategic-question)
 * - Integra diretamente com useQuizEditor (updateStep)
 * - Não cobre ainda scoring / variants / offerMapping (Phase B)
 */
export const QuizPropertiesPanel: React.FC = () => {
    const quiz = useQuizEditor();
    /**
     * 🚨 DEPRECATED: QuizPropertiesPanel
     * Mantido apenas para referência histórica. Substituído por QuizUnifiedPropertiesPanel.
     */
    return <div className="p-3 text-xs text-muted-foreground">Nenhum step selecionado</div>;
}

const isQuestion = step.type === 'question';
const isStrategic = step.type === 'strategic-question';
const isOffer = step.type === 'offer';

const handleChange = (field: string, value: any) => {
    quiz.updateStep({ [field]: value });
};

const handleOptionChange = (idx: number, value: string) => {
    if (!isQuestion && !isStrategic) return;
    const options = [...(step as any).options];
    options[idx] = { ...options[idx], text: value };
    quiz.updateStep({ options });
};

const handleAddOption = () => {
    if (!isQuestion && !isStrategic) return;
    const options = [...(step as any).options];
    const baseId = `opt-${Date.now()}`;
    options.push({ id: baseId, text: 'Nova opção' });
    quiz.updateStep({ options });
};

const handleRemoveOption = (idx: number) => {
    if (!isQuestion && !isStrategic) return;
    const options = [...(step as any).options];
    options.splice(idx, 1);
    quiz.updateStep({ options });
};

const handleVariantChange = (idx: number, field: string, value: string) => {
    if (!isOffer) return;
    const variants = [...(step as any).variants];
    variants[idx] = { ...variants[idx], [field]: value };
    quiz.updateStep({ variants });
};

const handleVariantTestimonialChange = (idx: number, field: string, value: string) => {
    if (!isOffer) return;
    const variants = [...(step as any).variants];
    const testimonial = { ...(variants[idx].testimonial || { quote: '', author: '' }), [field]: value };
    variants[idx] = { ...variants[idx], testimonial };
    quiz.updateStep({ variants });
};

const handleAddVariant = () => {
    if (!isOffer) return;
    const variants = [...(step as any).variants];
    variants.push({
        matchValue: 'novo',
        title: 'Nova Variante',
        description: 'Descrição',
        buttonText: 'Chamar Ação',
        testimonial: { quote: 'Depoimento', author: 'Autor' }
    });
    quiz.updateStep({ variants });
};

const handleRemoveVariant = (idx: number) => {
    if (!isOffer) return;
    const variants = [...(step as any).variants];
    variants.splice(idx, 1);
    quiz.updateStep({ variants });
};


return (
    <div className="p-3 space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Step: {step.id}</h3>
            {quiz.dirty && <span className="text-amber-600 text-xs">*dirty</span>}
        </div>
        <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Tipo</label>
            <div className="text-xs px-2 py-1 rounded bg-muted inline-block">{step.type}</div>
        </div>
        {'title' in step && (
            <div className="space-y-1">
                <label className="text-xs font-medium">Título</label>
                <Input defaultValue={(step as any).title} onChange={e => handleChange('title', e.target.value)} />
            </div>
        )}
        {(isQuestion || isStrategic) && (
            <div className="space-y-1">
                <label className="text-xs font-medium">Pergunta</label>
                <Textarea defaultValue={(step as any).questionText} onChange={e => handleChange('questionText', e.target.value)} rows={3} />
            </div>
        )}
        {(isQuestion || isStrategic) && (
            <div className="space-y-2 border rounded p-2 bg-muted/20">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-muted-foreground">Overrides de Layout</span>
                    <Button size="sm" variant="ghost" className="text-[10px]" onClick={() => {
                        // reset: remover campos de override definindo undefined
                        quiz.updateStep({ layout: undefined as any, columns: undefined as any, optionStyle: undefined as any });
                    }}>Reset</Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                        <label className="text-[10px] font-medium">Layout</label>
                        <select
                            className="h-7 text-xs w-full border rounded px-1 bg-background"
                            defaultValue={(step as any).layout || ''}
                            onChange={e => handleChange('layout', e.target.value || undefined)}
                        >
                            <option value="">auto</option>
                            <option value="grid">grid</option>
                            <option value="list">list</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-medium">Columns</label>
                        <input
                            type="number"
                            min={1}
                            max={6}
                            className="h-7 text-xs w-full border rounded px-1 bg-background"
                            defaultValue={(step as any).columns || ''}
                            onChange={e => handleChange('columns', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-medium">Option Style</label>
                        <select
                            className="h-7 text-xs w-full border rounded px-1 bg-background"
                            defaultValue={(step as any).optionStyle || ''}
                            onChange={e => handleChange('optionStyle', e.target.value || undefined)}
                        >
                            <option value="">auto</option>
                            <option value="image-card">image-card</option>
                            <option value="text-card">text-card</option>
                        </select>
                    </div>
                </div>
                <p className="text-[10px] text-muted-foreground">Se vazio = heurística automática (derivada de imagens e quantidade de opções).</p>
            </div>
        )}
        {(isQuestion || isStrategic) && Array.isArray((step as any).options) && (
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-medium">Opções</label>
                    <Button size="sm" variant="outline" onClick={handleAddOption}>Adicionar</Button>
                </div>
                <div className="space-y-2">
                    {(step as any).options.map((opt: any, idx: number) => (
                        <div key={opt.id} className="flex items-center gap-2">
                            <Input
                                className="h-7 text-xs"
                                defaultValue={opt.text}
                                onChange={e => handleOptionChange(idx, e.target.value)}
                            />
                            <Button size="sm" variant="ghost" onClick={() => handleRemoveOption(idx)}>✕</Button>
                        </div>
                    ))}
                </div>
            </div>
        )}
        {(isOffer) && (
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-medium">Variantes</label>
                    <Button size="sm" variant="outline" onClick={handleAddVariant}>Adicionar</Button>
                </div>
                <div className="space-y-3">
                    {(step as any).variants.map((v: any, idx: number) => (
                        <div key={idx} className="border rounded p-2 space-y-2 bg-muted/30">
                            <div className="flex items-center justify-between text-[11px] font-medium">
                                <span>{v.matchValue || '(sem match)'}</span>
                                <Button size="sm" variant="ghost" onClick={() => handleRemoveVariant(idx)}>Remover</Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-medium">matchValue</label>
                                    <Input placeholder="matchValue" defaultValue={v.matchValue} onChange={e => handleVariantChange(idx, 'matchValue', e.target.value)} className="h-7 text-xs" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-medium">matchOptionId</label>
                                    <Input
                                        placeholder="ex: opt-abc123"
                                        defaultValue={v.matchOptionId}
                                        onChange={e => handleVariantChange(idx, 'matchOptionId', e.target.value)}
                                        className="h-7 text-xs"
                                    />
                                </div>
                            </div>
                            <Input placeholder="Título" defaultValue={v.title} onChange={e => handleVariantChange(idx, 'title', e.target.value)} className="h-7 text-xs" />
                            <Textarea placeholder="Descrição" defaultValue={v.description} onChange={e => handleVariantChange(idx, 'description', e.target.value)} rows={2} className="text-xs" />
                            <Input placeholder="Botão" defaultValue={v.buttonText} onChange={e => handleVariantChange(idx, 'buttonText', e.target.value)} className="h-7 text-xs" />
                            <div className="space-y-1">
                                <label className="text-[10px] font-medium">Testimonial</label>
                                <Input placeholder="Quote" defaultValue={v.testimonial?.quote} onChange={e => handleVariantTestimonialChange(idx, 'quote', e.target.value)} className="h-7 text-xs" />
                                <Input placeholder="Author" defaultValue={v.testimonial?.author} onChange={e => handleVariantTestimonialChange(idx, 'author', e.target.value)} className="h-7 text-xs" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        <div className="pt-2 border-t text-[10px] text-muted-foreground flex items-center justify-between">
            <span>Hash: {quiz.state.hash}</span>
            <div className="flex gap-1">
                <Button size="sm" variant="secondary" onClick={() => quiz.save()}>Salvar</Button>
                <Button size="sm" onClick={() => quiz.publish()}>Publicar</Button>
            </div>
        </div>
    </div>
);
};

export default QuizPropertiesPanel;
