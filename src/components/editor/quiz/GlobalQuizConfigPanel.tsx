import React, { useMemo } from 'react';
import { useQuizEditor } from '@/domain/quiz/useQuizEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

/**
 * Painel Global para edição de scoring, progress e offerMapping.
 * Remove essa responsabilidade do painel de propriedades por step.
 */
const GlobalQuizConfigPanel: React.FC = () => {
    const quiz = useQuizEditor();
    const root = quiz.rootOverrides;
    const def = quiz.state.definition;
    const scoring = root.scoring || def.scoring;
    const progress = root.progress || def.progress;
    const offer = root.offerMapping || def.offerMapping;

    const stepIds = useMemo(() => quiz.state.steps.map(s => s.id), [quiz.state.steps]);

    return (
        <div className="p-3 space-y-5">
            <div className="space-y-2">
                <h3 className="text-sm font-semibold">Configuração Global</h3>
                <p className="text-[11px] text-muted-foreground">Scoring, Progress Tracking e Offer Mapping aplicados ao quiz inteiro.</p>
            </div>

            <section className="space-y-3">
                <h4 className="text-xs font-semibold tracking-wide text-muted-foreground">Scoring</h4>
                <div className="space-y-1">
                    <label className="text-[10px] font-medium">Default Weight</label>
                    <Input className="h-7 text-xs" defaultValue={String(scoring.defaultWeight)} onChange={e => quiz.updateScoring({ defaultWeight: parseInt(e.target.value, 10) || 0 })} />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-medium">Pesos por Step (stepId=weight, linha a linha)</label>
                    <Textarea
                        rows={3}
                        className="text-[11px]"
                        placeholder={"step-2=2\nstep-5=5"}
                        defaultValue={Object.entries(scoring.perStep || {}).map(([k, v]) => `${k}=${v}`).join('\n')}
                        onChange={e => {
                            const lines = e.target.value.split(/\n+/).map(l => l.trim()).filter(Boolean);
                            const perStep: Record<string, number> = {};
                            lines.forEach(l => { const [k, v] = l.split('='); if (k && v) perStep[k.trim()] = parseInt(v, 10) || 0; });
                            quiz.updateScoring({ perStep });
                        }}
                    />
                </div>
            </section>

            <section className="space-y-3 border-t pt-4">
                <h4 className="text-xs font-semibold tracking-wide text-muted-foreground">Progress</h4>
                <div className="space-y-1">
                    <label className="text-[10px] font-medium">Steps contados (checkbox)</label>
                    <div className="grid grid-cols-2 gap-1">
                        {stepIds.map(id => (
                            <label key={id} className="flex items-center gap-1 text-[11px] font-medium bg-muted/40 px-2 py-1 rounded">
                                <input
                                    type="checkbox"
                                    className="scale-90"
                                    defaultChecked={progress.countedStepIds.includes(id)}
                                    onChange={e => {
                                        const set = new Set(progress.countedStepIds);
                                        if (e.target.checked) set.add(id); else set.delete(id);
                                        quiz.updateProgress({ countedStepIds: Array.from(set) });
                                    }}
                                />
                                {id.replace('step-', 'S')}
                            </label>
                        ))}
                    </div>
                </div>
            </section>

            <section className="space-y-3 border-t pt-4">
                <h4 className="text-xs font-semibold tracking-wide text-muted-foreground">Offer Mapping</h4>
                <div className="space-y-1">
                    <label className="text-[10px] font-medium">strategicFinalStepId</label>
                    <Input
                        className="h-7 text-xs"
                        list="quiz-step-ids"
                        defaultValue={offer.strategicFinalStepId}
                        onChange={e => quiz.updateOfferMapping({ strategicFinalStepId: e.target.value })}
                    />
                    <datalist id="quiz-step-ids">
                        {stepIds.map(id => <option key={id} value={id}>{id}</option>)}
                    </datalist>
                </div>
            </section>

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

export default GlobalQuizConfigPanel;
