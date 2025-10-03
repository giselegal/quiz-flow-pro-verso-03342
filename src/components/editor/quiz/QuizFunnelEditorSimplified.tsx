import React, { useEffect, useState, useCallback } from 'react';
import { useUnifiedCRUD } from '@/context/UnifiedCRUDProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QUIZ_STEPS, type QuizStep } from '@/data/quizSteps';
import { Plus, Save, Trash2, ArrowUp, ArrowDown, Copy } from 'lucide-react';
import './QuizEditorStyles.css';

interface QuizFunnelEditorProps {
    funnelId?: string;
    templateId?: string;
}

type EditableQuizStep = QuizStep & { id: string };

const STEP_TYPES: Array<QuizStep['type']> = [
    'intro', 'question', 'strategic-question', 'transition', 'transition-result', 'result', 'offer'
];

function createBlankStep(type: QuizStep['type']): EditableQuizStep {
    const baseId = `step-${Date.now()}`;
    switch (type) {
        case 'intro':
            return {
                id: baseId,
                type: 'intro',
                title: 'Título de Introdução',
                formQuestion: 'Como posso te chamar?',
                placeholder: 'Seu nome...',
                buttonText: 'Começar',
                nextStep: ''
            };
        case 'question':
            return {
                id: baseId,
                type: 'question',
                questionNumber: 'X de Y',
                questionText: 'Pergunta...',
                requiredSelections: 3,
                options: [
                    { id: 'opt-1', text: 'Opção 1' },
                    { id: 'opt-2', text: 'Opção 2' }
                ],
                nextStep: ''
            };
        case 'strategic-question':
            return {
                id: baseId,
                type: 'strategic-question',
                questionText: 'Pergunta estratégica...',
                options: [
                    { id: 'estr-1', text: 'Resposta A' },
                    { id: 'estr-2', text: 'Resposta B' }
                ],
                nextStep: ''
            };
        case 'transition':
            return { id: baseId, type: 'transition', title: 'Transição...', text: 'Processando...', nextStep: '' };
        case 'transition-result':
            return { id: baseId, type: 'transition-result', title: 'Preparando resultado...', nextStep: '' };
        case 'result':
            return { id: baseId, type: 'result', title: '{userName}, seu estilo é:', nextStep: '' };
        case 'offer':
            return { id: baseId, type: 'offer', offerMap: {}, image: '' };
        default:
            return { id: baseId, type: 'question', questionText: 'Pergunta...', options: [], nextStep: '' };
    }
}

const QuizFunnelEditorSimplified: React.FC<QuizFunnelEditorProps> = ({ funnelId, templateId }) => {
    const crud = useUnifiedCRUD();
    const [steps, setSteps] = useState<EditableQuizStep[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    // Carregar steps iniciais
    useEffect(() => {
        const existing = (crud.currentFunnel as any)?.quizSteps as EditableQuizStep[] | undefined;
        if (existing && existing.length) {
            setSteps(existing.map(s => ({ ...s })));
            setSelectedId(existing[0].id);
            return;
        }
        // Converter QUIZ_STEPS (Record) para array
        const conv: EditableQuizStep[] = Object.entries(QUIZ_STEPS).map(([id, step]) => ({ id, ...step }));
        setSteps(conv);
        if (conv.length) setSelectedId(conv[0].id);
    }, [crud.currentFunnel]);

    const selectedStep = steps.find(s => s.id === selectedId);

    const updateStep = useCallback((id: string, patch: Partial<EditableQuizStep>) => {
        setSteps(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));
    }, []);

    const addStepAfter = (afterId?: string, type: QuizStep['type'] = 'question') => {
        setSteps(prev => {
            const idx = afterId ? prev.findIndex(s => s.id === afterId) : prev.length - 1;
            const newStep = createBlankStep(type);
            const clone = [...prev];
            clone.splice(idx + 1, 0, newStep);
            return clone;
        });
    };

    const duplicateStep = (id: string) => {
        setSteps(prev => {
            const idx = prev.findIndex(s => s.id === id);
            if (idx === -1) return prev;
            const original = prev[idx];
            const dupe: EditableQuizStep = { ...original, id: `${original.id}-copy-${Date.now()}` };
            const clone = [...prev];
            clone.splice(idx + 1, 0, dupe);
            return clone;
        });
    };

    const removeStep = (id: string) => {
        setSteps(prev => {
            if (prev.length <= 1) return prev;
            const idx = prev.findIndex(s => s.id === id);
            if (idx === -1) return prev;
            const clone = prev.filter(s => s.id !== id);
            if (selectedId === id) {
                const newIdx = Math.max(0, idx - 1);
                setSelectedId(clone[newIdx]?.id || '');
            }
            return clone;
        });
    };

    const moveStep = (id: string, dir: -1 | 1) => {
        setSteps(prev => {
            const idx = prev.findIndex(s => s.id === id);
            const to = idx + dir;
            if (idx === -1 || to < 0 || to >= prev.length) return prev;
            const clone = [...prev];
            const [item] = clone.splice(idx, 1);
            clone.splice(to, 0, item);
            return clone;
        });
    };

    const handleSave = useCallback(async () => {
        if (!crud.currentFunnel) return;
        setIsSaving(true);
        try {
            (crud.currentFunnel as any).quizSteps = steps;
            await crud.saveFunnel();
        } catch (e) {
            console.error('Erro ao salvar quizSteps', e);
        } finally {
            setIsSaving(false);
        }
    }, [steps, crud]);

    return (
        <div className="quiz-editor-container h-full w-full flex flex-col bg-background">
            <div className="h-10 border-b flex items-center gap-2 px-3 text-xs bg-muted/30">
                <span className="font-semibold">Quiz Editor (Simplificado)</span>
                <Button size="sm" variant="outline" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* COL 1 - STEPS LIST */}
                <div className="w-60 border-r flex flex-col">
                    <div className="p-3 flex items-center justify-between border-b">
                        <span className="text-xs font-semibold">Etapas</span>
                        <Badge variant="secondary" className="text-[10px]">{steps.length}</Badge>
                    </div>
                    <div className="flex-1 overflow-auto text-xs">
                        {steps.map((s, idx) => {
                            const active = s.id === selectedId;
                            return (
                                <div
                                    key={s.id}
                                    className={`px-3 py-2 border-b cursor-pointer group ${active ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                                    onClick={() => setSelectedId(s.id)}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium truncate">{idx + 1}. {s.type}</span>
                                    </div>
                                    <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition">
                                        <Button size="icon" variant="ghost" className="h-5 w-5" disabled={idx === 0}
                                            onClick={(e) => { e.stopPropagation(); moveStep(s.id, -1); }}>
                                            <ArrowUp className="w-3 h-3" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-5 w-5" disabled={idx === steps.length - 1}
                                            onClick={(e) => { e.stopPropagation(); moveStep(s.id, 1); }}>
                                            <ArrowDown className="w-3 h-3" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-5 w-5"
                                            onClick={(e) => { e.stopPropagation(); duplicateStep(s.id); }}>
                                            <Copy className="w-3 h-3" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-5 w-5 text-red-500"
                                            onClick={(e) => { e.stopPropagation(); removeStep(s.id); }}>
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="p-2 border-t space-y-2">
                        <Button size="sm" variant="secondary" className="w-full"
                            onClick={() => addStepAfter(selectedId, 'question')}>
                            <Plus className="w-4 h-4 mr-1" /> Nova Pergunta
                        </Button>
                        <Button size="sm" variant="outline" className="w-full"
                            onClick={() => addStepAfter(selectedId, 'strategic-question')}>
                            + Estratégica
                        </Button>
                    </div>
                </div>

                {/* COL 2 - TIPO & OPCOES */}
                <div className="w-72 border-r flex flex-col">
                    <div className="p-3 border-b text-xs font-semibold">Componentes</div>
                    <div className="flex-1 overflow-auto p-3 text-xs space-y-4">
                        {selectedStep && (
                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                                    Tipo da Etapa
                                </label>
                                <select
                                    className="w-full border rounded px-2 py-1 text-xs"
                                    value={selectedStep.type}
                                    onChange={e => updateStep(selectedStep.id, { type: e.target.value as any })}
                                >
                                    {STEP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>

                                {selectedStep.type === 'question' && (
                                    <div className="pt-2 border-t space-y-2">
                                        <div className="flex items-center justify-between text-[10px] font-medium">
                                            <span>Opções</span>
                                            <Button size="sm" variant="ghost" onClick={() =>
                                                updateStep(selectedStep.id, {
                                                    options: [...(selectedStep.options || []),
                                                    { id: `opt-${Date.now()}`, text: 'Nova opção' }]
                                                })
                                            }>+ Add</Button>
                                        </div>
                                        <div className="space-y-1">
                                            {(selectedStep.options || []).map((opt, oi) => (
                                                <div key={opt.id} className="flex items-center gap-1">
                                                    <input
                                                        className="flex-1 border rounded px-1 py-0.5 text-[11px]"
                                                        value={opt.text}
                                                        onChange={(e) => {
                                                            const clone = [...(selectedStep.options || [])];
                                                            clone[oi] = { ...clone[oi], text: e.target.value };
                                                            updateStep(selectedStep.id, { options: clone });
                                                        }}
                                                    />
                                                    <Button size="icon" variant="ghost" className="h-5 w-5"
                                                        onClick={() => {
                                                            const clone = (selectedStep.options || []).filter((_, i) => i !== oi);
                                                            updateStep(selectedStep.id, { options: clone });
                                                        }}>
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* COL 3 - PREVIEW */}
                <div className="flex-1 border-r bg-muted/10 flex flex-col">
                    <div className="p-3 border-b text-xs font-semibold">Preview</div>
                    <div className="flex-1 overflow-auto p-4">
                        {!selectedStep ? (
                            <div className="text-sm text-muted-foreground">Nenhum step selecionado.</div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded border shadow-sm">
                                    <h4 className="font-semibold mb-2">{selectedStep.type}</h4>
                                    {selectedStep.type === 'intro' && (
                                        <div>
                                            <h3 className="font-bold mb-2">{selectedStep.title}</h3>
                                            <p className="mb-2">{selectedStep.formQuestion}</p>
                                            <input
                                                disabled
                                                placeholder={selectedStep.placeholder}
                                                className="border rounded px-2 py-1 w-full mb-2"
                                            />
                                            <Button size="sm" disabled>{selectedStep.buttonText}</Button>
                                        </div>
                                    )}
                                    {selectedStep.type === 'question' && (
                                        <div>
                                            <p className="font-bold mb-2">{selectedStep.questionText}</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {(selectedStep.options || []).map(opt => (
                                                    <div key={opt.id} className="border rounded p-2 text-sm bg-gray-50">
                                                        {opt.text}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {selectedStep.type === 'strategic-question' && (
                                        <div>
                                            <p className="font-bold mb-2">{selectedStep.questionText}</p>
                                            <div className="space-y-2">
                                                {(selectedStep.options || []).map(opt => (
                                                    <div key={opt.id} className="border rounded p-2 text-sm bg-gray-50">
                                                        {opt.text}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {(selectedStep.type === 'transition' || selectedStep.type === 'transition-result') && (
                                        <div className="text-center">
                                            <div className="w-6 h-6 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                                            <p className="font-medium">{selectedStep.title}</p>
                                        </div>
                                    )}
                                    {selectedStep.type === 'result' && (
                                        <div>
                                            <h3 className="font-bold text-primary">{selectedStep.title}</h3>
                                        </div>
                                    )}
                                    {selectedStep.type === 'offer' && (
                                        <div>
                                            <h3 className="font-bold">Oferta Personalizada</h3>
                                            <p className="text-sm text-muted-foreground">Preview simplificado da oferta</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* COL 4 - PROPRIEDADES */}
                <div className="w-80 flex flex-col">
                    <div className="p-3 border-b text-xs font-semibold">Propriedades</div>
                    <div className="flex-1 overflow-auto p-4 text-xs space-y-4">
                        {!selectedStep ? (
                            <div className="text-muted-foreground text-[11px]">Selecione uma etapa.</div>
                        ) : (
                            <>
                                <div>
                                    <label className="block mb-1 font-medium">ID</label>
                                    <input disabled value={selectedStep.id} className="w-full border rounded px-2 py-1 text-[11px] bg-muted/30" />
                                </div>

                                {selectedStep.type === 'intro' && (
                                    <>
                                        <div>
                                            <label className="block mb-1 font-medium">Título</label>
                                            <textarea
                                                rows={3}
                                                value={selectedStep.title || ''}
                                                onChange={e => updateStep(selectedStep.id, { title: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Pergunta do Form</label>
                                            <input
                                                value={selectedStep.formQuestion || ''}
                                                onChange={e => updateStep(selectedStep.id, { formQuestion: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Placeholder</label>
                                            <input
                                                value={selectedStep.placeholder || ''}
                                                onChange={e => updateStep(selectedStep.id, { placeholder: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Texto do Botão</label>
                                            <input
                                                value={selectedStep.buttonText || ''}
                                                onChange={e => updateStep(selectedStep.id, { buttonText: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                    </>
                                )}

                                {selectedStep.type === 'question' && (
                                    <>
                                        <div>
                                            <label className="block mb-1 font-medium">Número da Pergunta</label>
                                            <input
                                                value={selectedStep.questionNumber || ''}
                                                onChange={e => updateStep(selectedStep.id, { questionNumber: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Texto da Pergunta</label>
                                            <textarea
                                                rows={3}
                                                value={selectedStep.questionText || ''}
                                                onChange={e => updateStep(selectedStep.id, { questionText: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Seleções Obrigatórias</label>
                                            <input
                                                type="number"
                                                value={selectedStep.requiredSelections || 1}
                                                onChange={e => updateStep(selectedStep.id, { requiredSelections: parseInt(e.target.value) || 1 })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                    </>
                                )}

                                {selectedStep.type === 'strategic-question' && (
                                    <div>
                                        <label className="block mb-1 font-medium">Pergunta Estratégica</label>
                                        <textarea
                                            rows={3}
                                            value={selectedStep.questionText || ''}
                                            onChange={e => updateStep(selectedStep.id, { questionText: e.target.value })}
                                            className="w-full border rounded px-2 py-1 text-[11px]"
                                        />
                                    </div>
                                )}

                                {(selectedStep.type === 'transition' || selectedStep.type === 'transition-result') && (
                                    <div>
                                        <label className="block mb-1 font-medium">Título</label>
                                        <input
                                            value={selectedStep.title || ''}
                                            onChange={e => updateStep(selectedStep.id, { title: e.target.value })}
                                            className="w-full border rounded px-2 py-1 text-[11px]"
                                        />
                                    </div>
                                )}

                                {selectedStep.type === 'result' && (
                                    <div>
                                        <label className="block mb-1 font-medium">Título do Resultado</label>
                                        <input
                                            value={selectedStep.title || ''}
                                            onChange={e => updateStep(selectedStep.id, { title: e.target.value })}
                                            className="w-full border rounded px-2 py-1 text-[11px]"
                                        />
                                    </div>
                                )}

                                <div className="border-t pt-4">
                                    <label className="block mb-1 font-medium">Próximo Step</label>
                                    <select
                                        value={selectedStep.nextStep || ''}
                                        onChange={e => updateStep(selectedStep.id, { nextStep: e.target.value || '' })}
                                        className="w-full border rounded px-2 py-1 text-[11px]"
                                    >
                                        <option value="">-- (sem) --</option>
                                        {steps.filter(s => s.id !== selectedStep.id).map(s => (
                                            <option key={s.id} value={s.id}>{s.id} ({s.type})</option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizFunnelEditorSimplified;