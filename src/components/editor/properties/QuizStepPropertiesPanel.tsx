import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export interface QuizStepPropertiesPanelProps {
    step: {
        id: string;
        type: string;
        title?: string;
        questionText?: string;
        buttonText?: string;
        requiredSelections?: number;
        image?: string;
    } | null;
    onChange: (id: string, updates: Record<string, any>) => void;
}

/**
 * Painel de propriedades mínimo para edição de etapas do quiz.
 * MVP: título, questionText, buttonText, requiredSelections, image.
 */
export const QuizStepPropertiesPanel: React.FC<QuizStepPropertiesPanelProps> = ({ step, onChange }) => {
    const [local, setLocal] = useState<any | null>(step);

    useEffect(() => {
        setLocal(step);
    }, [step?.id]);

    if (!step) return <div className="p-4 text-xs text-muted-foreground">Selecione uma etapa para editar.</div>;

    const commit = (field: string, value: any) => {
        if (!local) return;
        const next = { ...local, [field]: value };
        setLocal(next);
        onChange(step.id, { [field]: value });
    };

    return (
        <div className="flex flex-col h-full overflow-auto">
            <div className="px-4 py-3 border-b bg-background/70 backdrop-blur-sm">
                <h2 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Propriedades da Etapa</h2>
                <div className="mt-1 text-[10px] text-muted-foreground/70">ID: {step.id} • Tipo: {step.type}</div>
            </div>
            <div className="flex-1 p-4 space-y-4">
                <div>
                    <label className="block text-[10px] font-medium uppercase tracking-wide mb-1 text-muted-foreground">Título</label>
                    <input
                        className="w-full px-2 py-1 rounded border bg-background text-sm"
                        value={local?.title || ''}
                        onChange={e => commit('title', e.target.value)}
                        placeholder="Título / heading"
                    />
                </div>
                {(step.type === 'question' || step.type === 'strategic-question' || step.type === 'intro') && (
                    <div>
                        <label className="block text-[10px] font-medium uppercase tracking-wide mb-1 text-muted-foreground">Texto da Pergunta</label>
                        <textarea
                            className="w-full px-2 py-1 rounded border bg-background text-sm min-h-[80px] resize-y"
                            value={local?.questionText || ''}
                            onChange={e => commit('questionText', e.target.value)}
                            placeholder="Digite a pergunta"
                        />
                    </div>
                )}
                <div>
                    <label className="block text-[10px] font-medium uppercase tracking-wide mb-1 text-muted-foreground">Texto do Botão</label>
                    <input
                        className="w-full px-2 py-1 rounded border bg-background text-sm"
                        value={local?.buttonText || ''}
                        onChange={e => commit('buttonText', e.target.value)}
                        placeholder="Continuar / Avançar"
                    />
                </div>
                {(step.type === 'question' || step.type === 'strategic-question') && (
                    <div>
                        <label className="block text-[10px] font-medium uppercase tracking-wide mb-1 text-muted-foreground">Seleções Obrigatórias</label>
                        <input
                            type="number"
                            className="w-full px-2 py-1 rounded border bg-background text-sm"
                            value={local?.requiredSelections ?? ''}
                            onChange={e => commit('requiredSelections', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                            min={1}
                            placeholder="Ex: 1"
                        />
                    </div>
                )}
                <div>
                    <label className="block text-[10px] font-medium uppercase tracking-wide mb-1 text-muted-foreground">Imagem (URL)</label>
                    <input
                        className="w-full px-2 py-1 rounded border bg-background text-sm"
                        value={local?.image || ''}
                        onChange={e => commit('image', e.target.value)}
                        placeholder="https://..."
                    />
                </div>
            </div>
            <div className="p-3 border-t flex justify-end gap-2 bg-background/70 backdrop-blur-sm">
                <Button variant="outline" size="sm" disabled>Reset (soon)</Button>
                <Button size="sm" disabled>Aplicar (auto)</Button>
            </div>
        </div>
    );
};

export default QuizStepPropertiesPanel;
