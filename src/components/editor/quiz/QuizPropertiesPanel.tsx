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
    const step = useMemo(() => quiz.state.steps.find(s => s.id === quiz.selectedStepId) || null, [quiz.state.steps, quiz.selectedStepId]);

    if (!step) {
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

    // Global editing helpers
    const root = quiz.rootOverrides;
    const def = quiz.state.definition;
    const currentScoring = root.scoring || def.scoring;
    const currentProgress = root.progress || def.progress;
    const currentOfferMapping = root.offerMapping || def.offerMapping;

    const updateDefaultWeight = (value: string) => {
        const num = parseInt(value, 10);
        if (!isNaN(num)) quiz.updateScoring({ defaultWeight: num });
    };

    const updateCountedSteps = (value: string) => {
        const ids = value.split(',').map(v => v.trim()).filter(Boolean);
        quiz.updateProgress({ countedStepIds: ids });
    };

    const updateStrategicFinal = (value: string) => {
        quiz.updateOfferMapping({ strategicFinalStepId: value });
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
                                <Input placeholder="matchValue" defaultValue={v.matchValue} onChange={e => handleVariantChange(idx, 'matchValue', e.target.value)} className="h-7 text-xs" />
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
            {/* Global config (scoring / progress / offerMapping) */}
            <div className="space-y-3 border-t pt-3">
                <h4 className="text-xs font-semibold text-muted-foreground">Config Global</h4>
                <div className="space-y-1">
                    <label className="text-[10px] font-medium">Scoring Default Weight</label>
                    <Input className="h-7 text-xs" defaultValue={String(currentScoring.defaultWeight)} onChange={e => updateDefaultWeight(e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-medium">Progress countedStepIds (comma)</label>
                    <Textarea rows={2} className="text-[10px]" defaultValue={currentProgress.countedStepIds.join(',')} onChange={e => updateCountedSteps(e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-medium">strategicFinalStepId</label>
                    <Input className="h-7 text-xs" defaultValue={currentOfferMapping.strategicFinalStepId} onChange={e => updateStrategicFinal(e.target.value)} />
                </div>
            </div>
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
