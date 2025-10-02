import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useUnifiedCRUD } from '@/context/UnifiedCRUDProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QUIZ_STEPS, type QuizStep } from '@/data/quizSteps';
import { styleConfigGisele } from '@/data/styles';
import { Plus, Save, Trash2, ArrowUp, ArrowDown, Copy, RefreshCw } from 'lucide-react';

/**
 * QuizFunnelEditor
 * Layout 4 colunas:
 * 1) Steps (lista + reorder + CRUD)
 * 2) Componentes / Tipo & opções base (troca de tipo, geração de esqueleto)
 * 3) Canvas (preview aproximado do step selecionado, isolado)
 * 4) Propriedades (form dinâmico de edição)
 *
 * Persistência: salva em currentFunnel.quizSteps (array) -> crudContext.saveFunnel()
 * Fallback inicial: carrega de currentFunnel.quizSteps || QUIZ_STEPS (transformado em array ordenada por ID natural)
 */

export interface EditableQuizStep extends QuizStep { id: string; }

interface QuizFunnelEditorProps {
    funnelId?: string;
    templateId?: string;
}

const STEP_TYPES: Array<QuizStep['type']> = [
    'intro', 'question', 'strategic-question', 'transition', 'transition-result', 'result', 'offer'
];

// Util para criar novo step básico
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

const QuizFunnelEditor: React.FC<QuizFunnelEditorProps> = ({ funnelId, templateId }) => {
    const crud = useUnifiedCRUD();
    const [steps, setSteps] = useState<EditableQuizStep[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const [previewSelections, setPreviewSelections] = useState<Record<string, string[]>>({});

    // Carregar steps iniciais
    useEffect(() => {
        // Se funil tiver quizSteps, usar; caso contrário montar de QUIZ_STEPS
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

    const selectedStep = useMemo(() => steps.find(s => s.id === selectedId), [steps, selectedId]);

    const updateStep = (id: string, patch: Partial<EditableQuizStep>) => {
        setSteps(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));
    };

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

    // Preview simples replicando renderizações principais
    const renderPreview = () => {
        if (!selectedStep) return <div className="text-sm text-muted-foreground p-4">Nenhum step selecionado.</div>;
        switch (selectedStep.type) {
            case 'intro':
                return (
                    <div className="p-4 space-y-4">
                        <div className="prose" dangerouslySetInnerHTML={{ __html: selectedStep.title || '' }} />
                        {selectedStep.image && <img src={selectedStep.image} className="rounded max-w-sm" />}
                        <div>
                            <p className="font-semibold text-sm mb-2">{selectedStep.formQuestion}</p>
                            <input disabled placeholder={selectedStep.placeholder} className="border rounded px-2 py-1 w-64 text-xs bg-muted/30" />
                            <Button size="sm" className="mt-3" disabled>{selectedStep.buttonText || 'Continuar'}</Button>
                        </div>
                    </div>
                );
            case 'question': {
                const answers = previewSelections[selectedStep.id] || [];
                return (
                    <div className="p-4 space-y-4">
                        <h4 className="text-xs uppercase tracking-wide text-muted-foreground">{selectedStep.questionNumber}</h4>
                        <p className="font-bold text-sm">{selectedStep.questionText}</p>
                        <div className="grid grid-cols-2 gap-2">
                            {(selectedStep.options || []).map(opt => {
                                const sel = answers.includes(opt.id);
                                return (
                                    <div
                                        key={opt.id}
                                        onClick={() => {
                                            setPreviewSelections(prev => {
                                                const current = prev[selectedStep.id] || [];
                                                if (sel) return { ...prev, [selectedStep.id]: current.filter(i => i !== opt.id) };
                                                if (current.length >= (selectedStep.requiredSelections || 1)) return prev; // limite
                                                return { ...prev, [selectedStep.id]: [...current, opt.id] };
                                            });
                                        }}
                                        className={`border rounded p-2 text-xs cursor-pointer select-none ${sel ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
                                    >
                                        {opt.image && <img src={opt.image} className="mb-1 rounded" />}
                                        {opt.text}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="text-right text-[10px] text-muted-foreground">
                            {answers.length}/{selectedStep.requiredSelections || 1} selecionadas
                        </div>
                    </div>
                );
            }
            case 'strategic-question':
                return (
                    <div className="p-4 space-y-3">
                        <p className="font-bold text-sm">{selectedStep.questionText}</p>
                        <div className="flex flex-col gap-2">
                            {(selectedStep.options || []).map(opt => (
                                <div key={opt.id} className="border rounded p-2 text-xs bg-background hover:bg-muted cursor-pointer">
                                    {opt.text}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'transition':
            case 'transition-result':
                return (
                    <div className="p-4 space-y-2 text-center text-sm">
                        <div className="w-6 h-6 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="font-medium">{selectedStep.title}</p>
                        {selectedStep.text && <p className="text-xs text-muted-foreground">{selectedStep.text}</p>}
                    </div>
                );
            case 'result': {
                // Exemplo de estilo fictício para preview
                const style = styleConfigGisele['elegante'] || Object.values(styleConfigGisele)[0];
                return (
                    <div className="p-4 space-y-3 text-sm">
                        <h3 className="font-bold text-primary">{selectedStep.title?.replace('{userName}', 'Usuária')}</h3>
                        {style && <p><strong>Estilo:</strong> {style.name}</p>}
                        {style?.specialTips && (
                            <ul className="list-disc pl-4 text-xs space-y-1">
                                {style.specialTips.slice(0, 3).map((t: string, i: number) => <li key={i}>{t}</li>)}
                            </ul>
                        )}
                    </div>
                );
            }
            case 'offer':
                return (
                    <div className="p-4 text-sm space-y-2">
                        <h3 className="font-bold">Oferta Personalizada</h3>
                        <p className="text-xs text-muted-foreground">Preview simplificado. Conteúdo real depende de offerMap & resposta estratégica.</p>
                        {selectedStep.image && <img src={selectedStep.image} className="rounded max-w-xs" />}
                        <p className="text-[10px]">Map keys: {Object.keys(selectedStep.offerMap || {}).length}</p>
                    </div>
                );
            default:
                return <div className="p-4 text-xs">Tipo não suportado.</div>;
        }
    };

    // ================= RENDER =================
    return (
        <div className="h-full w-full flex overflow-hidden bg-background">
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
                            <div key={s.id} className={`px-3 py-2 border-b cursor-pointer group ${active ? 'bg-primary/10' : 'hover:bg-muted/50'}`} onClick={() => setSelectedId(s.id)}>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium truncate">{idx + 1}. {s.type}</span>
                                </div>
                                <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition">
                                    <Button size="icon" variant="ghost" className="h-5 w-5" disabled={idx === 0} onClick={(e) => { e.stopPropagation(); moveStep(s.id, -1); }}><ArrowUp className="w-3 h-3" /></Button>
                                    <Button size="icon" variant="ghost" className="h-5 w-5" disabled={idx === steps.length - 1} onClick={(e) => { e.stopPropagation(); moveStep(s.id, 1); }}><ArrowDown className="w-3 h-3" /></Button>
                                    <Button size="icon" variant="ghost" className="h-5 w-5" onClick={(e) => { e.stopPropagation(); duplicateStep(s.id); }}><Copy className="w-3 h-3" /></Button>
                                    <Button size="icon" variant="ghost" className="h-5 w-5 text-red-500" onClick={(e) => { e.stopPropagation(); removeStep(s.id); }}><Trash2 className="w-3 h-3" /></Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="p-2 border-t space-y-2">
                    <Button size="sm" variant="secondary" className="w-full" onClick={() => addStepAfter(selectedId, 'question')}>
                        <Plus className="w-4 h-4 mr-1" /> Nova Pergunta
                    </Button>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => addStepAfter(selectedId, 'strategic-question')}>+ Estratégica</Button>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => addStepAfter(selectedId, 'transition')}>+ Transição</Button>
                </div>
            </div>

            {/* COL 2 - COMPONENTES / TIPO */}
            <div className="w-64 border-r flex flex-col">
                <div className="p-3 border-b flex items-center justify-between text-xs font-semibold">Componentes</div>
                <div className="flex-1 overflow-auto p-3 text-xs space-y-4">
                    {selectedStep && (
                        <div className="space-y-2">
                            <label className="block text-[10px] uppercase tracking-wide text-muted-foreground">Tipo da Etapa</label>
                            <select className="w-full border rounded px-2 py-1 text-xs" value={selectedStep.type} onChange={e => updateStep(selectedStep.id, { type: e.target.value as any })}>
                                {STEP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            {selectedStep.type === 'question' && (
                                <div className="pt-2 border-t space-y-2">
                                    <div className="flex items-center justify-between text-[10px] font-medium"><span>Opções</span>
                                        <Button size="xs" variant="ghost" onClick={() => updateStep(selectedStep.id, { options: [...(selectedStep.options || []), { id: `opt-${Date.now()}`, text: 'Nova opção' }] })}>+ Add</Button>
                                    </div>
                                    <div className="space-y-1">
                                        {(selectedStep.options || []).map((opt, oi) => (
                                            <div key={opt.id} className="flex items-center gap-1">
                                                <input className="flex-1 border rounded px-1 py-0.5 text-[11px]" value={opt.text} onChange={(e) => {
                                                    const clone = [...(selectedStep.options || [])];
                                                    clone[oi] = { ...clone[oi], text: e.target.value };
                                                    updateStep(selectedStep.id, { options: clone });
                                                }} />
                                                <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => {
                                                    const clone = (selectedStep.options || []).filter((_, i) => i !== oi);
                                                    updateStep(selectedStep.id, { options: clone });
                                                }}><Trash2 className="w-3 h-3" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="p-2 border-t flex gap-2">
                    <Button size="sm" className="flex-1" onClick={handleSave} disabled={isSaving}>{isSaving ? 'Salvando...' : 'Salvar'}</Button>
                    <Button size="sm" variant="outline" onClick={() => {
                        // Recarregar do funnel ou fallback
                        const existing = (crud.currentFunnel as any)?.quizSteps as EditableQuizStep[] | undefined;
                        if (existing?.length) {
                            setSteps(existing.map(s => ({ ...s })));
                            setSelectedId(existing[0].id);
                        } else {
                            const conv: EditableQuizStep[] = Object.entries(QUIZ_STEPS).map(([id, step]) => ({ id, ...step }));
                            setSteps(conv);
                            setSelectedId(conv[0]?.id || '');
                        }
                    }}>
                        <RefreshCw className="w-4 h-4 mr-1" /> Reset
                    </Button>
                </div>
            </div>

            {/* COL 3 - CANVAS */}
            <div className="flex-1 border-r relative bg-muted/10">
                <div className="absolute inset-0 overflow-auto">
                    {renderPreview()}
                </div>
            </div>

            {/* COL 4 - PROPRIEDADES */}
            <div className="w-80 flex flex-col">
                <div className="p-3 border-b text-xs font-semibold">Propriedades</div>
                <div className="flex-1 overflow-auto p-4 text-xs space-y-4">
                    {!selectedStep && <div className="text-muted-foreground text-[11px]">Selecione uma etapa.</div>}
                    {selectedStep && (
                        <>
                            <div>
                                <label className="block mb-1 font-medium">ID</label>
                                <input disabled value={selectedStep.id} className="w-full border rounded px-2 py-1 text-[11px] bg-muted/30" />
                            </div>
                            {selectedStep.type === 'intro' && (
                                <>
                                    <div>
                                        <label className="block mb-1 font-medium">Título (HTML)</label>
                                        <textarea rows={3} value={selectedStep.title || ''} onChange={e => updateStep(selectedStep.id, { title: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block mb-1 font-medium">Form Question</label>
                                            <input value={selectedStep.formQuestion || ''} onChange={e => updateStep(selectedStep.id, { formQuestion: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Placeholder</label>
                                            <input value={selectedStep.placeholder || ''} onChange={e => updateStep(selectedStep.id, { placeholder: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block mb-1 font-medium">Button Text</label>
                                            <input value={selectedStep.buttonText || ''} onChange={e => updateStep(selectedStep.id, { buttonText: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Image URL</label>
                                            <input value={selectedStep.image || ''} onChange={e => updateStep(selectedStep.id, { image: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                        </div>
                                    </div>
                                </>
                            )}
                            {selectedStep.type === 'question' && (
                                <>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block mb-1 font-medium">Número</label>
                                            <input value={selectedStep.questionNumber || ''} onChange={e => updateStep(selectedStep.id, { questionNumber: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Seleções</label>
                                            <input type="number" value={selectedStep.requiredSelections || 1} onChange={e => updateStep(selectedStep.id, { requiredSelections: parseInt(e.target.value) || 1 })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium">Pergunta</label>
                                        <textarea rows={3} value={selectedStep.questionText || ''} onChange={e => updateStep(selectedStep.id, { questionText: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                    </div>
                                </>
                            )}
                            {selectedStep.type === 'strategic-question' && (
                                <div>
                                    <label className="block mb-1 font-medium">Pergunta Estratégica</label>
                                    <textarea rows={3} value={selectedStep.questionText || ''} onChange={e => updateStep(selectedStep.id, { questionText: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                </div>
                            )}
                            {(selectedStep.type === 'transition' || selectedStep.type === 'transition-result') && (
                                <>
                                    <div>
                                        <label className="block mb-1 font-medium">Título</label>
                                        <input value={selectedStep.title || ''} onChange={e => updateStep(selectedStep.id, { title: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                    </div>
                                    {selectedStep.type === 'transition' && (
                                        <div>
                                            <label className="block mb-1 font-medium">Texto</label>
                                            <textarea rows={2} value={selectedStep.text || ''} onChange={e => updateStep(selectedStep.id, { text: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                        </div>
                                    )}
                                </>
                            )}
                            {selectedStep.type === 'result' && (
                                <div>
                                    <label className="block mb-1 font-medium">Título Resultado</label>
                                    <input value={selectedStep.title || ''} onChange={e => updateStep(selectedStep.id, { title: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                </div>
                            )}
                            {selectedStep.type === 'offer' && (
                                <>
                                    <div>
                                        <label className="block mb-1 font-medium">Imagem Oferta</label>
                                        <input value={selectedStep.image || ''} onChange={e => updateStep(selectedStep.id, { image: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium">Offer Map Keys (somente visão)</label>
                                        <div className="text-[10px] bg-muted/30 rounded p-2">
                                            {Object.keys(selectedStep.offerMap || {}).length || 0} chaves configuradas.
                                        </div>
                                    </div>
                                </>
                            )}
                            <Separator />
                            <div>
                                <label className="block mb-1 font-medium">Próximo Step (nextStep)</label>
                                <input value={selectedStep.nextStep || ''} onChange={e => updateStep(selectedStep.id, { nextStep: e.target.value })} className="w-full border rounded px-2 py-1 text-[11px]" />
                                <p className="text-[10px] text-muted-foreground mt-1">Use ID existente (ex: step-2). Deixe vazio para não alterar.</p>
                            </div>
                        </>
                    )}
                </div>
                <div className="p-2 border-t flex gap-2">
                    <Button size="sm" className="flex-1" onClick={handleSave} disabled={isSaving}>{isSaving ? 'Salvando...' : 'Salvar'}</Button>
                </div>
            </div>
        </div>
    );
};

export default QuizFunnelEditor;
