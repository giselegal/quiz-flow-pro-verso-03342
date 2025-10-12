import React, { useState } from 'react';
import TemplateEngineEditorLayout from './TemplateEngineEditorLayout';
import { useTemplateDraft, useUpdateMeta, useAddStage, useReorderStages, usePublish, useValidateDraft, useAddStageComponent, useRemoveStageComponent, useReorderStageComponents, useUpdateComponentProps, usePreviewStart, usePreviewAnswer, useTemplateHistory } from '../api/hooks';
import { compareHistoryEntry } from '../utils/historyHashes';
import { renderComponent } from '../render/registry';
import { TemplateDraftShared } from '@/shared/templateEngineTypes';
import { getComponentSchema } from './componentPropSchemas';
import { diffProps } from '../utils/diffProps';
// Ajuste: evitar conflito de tipos TemplateDraft (frontend vs server). Vamos tratar draft como 'any' onde passamos para renderComponent.

export const TemplateEngineEditor: React.FC<{ id: string; onBack: () => void }> = ({ id, onBack }) => {
    // Flag temporária: usar novo layout 4 colunas diretamente
    const USE_NEW_LAYOUT = true;
    if (USE_NEW_LAYOUT) {
        return <TemplateEngineEditorLayout id={id} onBack={onBack} />;
    }
    const { data: draft, isLoading, error } = useTemplateDraft(id) as { data: TemplateDraftShared | undefined; isLoading: boolean; error: any };
    const updateMeta = useUpdateMeta(id);
    const addStage = useAddStage(id);
    const reorder = useReorderStages(id);
    const publishMut = usePublish(id);
    const { data: validation } = useValidateDraft(id);
    const { data: history } = useTemplateHistory(id) as { data: any[] | undefined };
    const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
    const [localName, setLocalName] = useState('');
    const [localDesc, setLocalDesc] = useState('');

    React.useEffect(() => {
        if (draft) {
            setLocalName(draft.meta.name);
            setLocalDesc(draft.meta.description || '');
        }
    }, [draft?.id]);

    if (isLoading) return <div>Carregando draft...</div>;
    if (error) return <div>Erro: {(error as Error).message}</div>;
    if (!draft) return null;

    const saveMeta = () => { updateMeta.mutate({ name: localName, description: localDesc }); };
    const handleAddStage = () => { addStage.mutate({ type: 'question' }); };
    const handleReorderUp = (idx: number) => {
        if (idx === 0) return;
        const ordered = [...draft.stages].sort((a, b) => a.order - b.order);
        const tmp = ordered[idx - 1];
        ordered[idx - 1] = ordered[idx];
        ordered[idx] = tmp;
        reorder.mutate(ordered.map(s => s.id));
    };
    const handlePublish = () => publishMut.mutate();

    const [openStageId, setOpenStageId] = useState<string | null>(null);
    const stagesOrdered = [...draft.stages].sort((a, b) => a.order - b.order);
    const activeStage = openStageId ? stagesOrdered.find(s => s.id === openStageId) : undefined;
    const addCmp = activeStage ? useAddStageComponent(draft.id, activeStage.id) : undefined;
    const remCmp = activeStage ? useRemoveStageComponent(draft.id, activeStage.id) : undefined;
    const reorderCmps = activeStage ? useReorderStageComponents(draft.id, activeStage.id) : undefined;
    const [selectedComponentId, _setSelectedComponentId] = useState<string | null>(null);
    function setSelectedComponentId(next: string | null) {
        if (next !== selectedComponentId && dirtyKeys.size > 0) {
            // flush antes de trocar
            flush(true);
        }
        _setSelectedComponentId(next);
    }
    const selectedComponent = selectedComponentId ? draft.components[selectedComponentId] : null;
    const updateComponentProps = selectedComponentId ? useUpdateComponentProps(selectedComponentId, draft.id) : undefined;
    // --- Batch / Optimistic props state ---
    const [localProps, setLocalProps] = useState<Record<string, any>>({});
    const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(new Set());
    const [isFlushing, setIsFlushing] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
    const debounceRef = React.useRef<any>(null);

    React.useEffect(() => {
        if (selectedComponent) {
            setLocalProps({ ...(selectedComponent.props || {}) });
            setDirtyKeys(new Set());
        } else {
            setLocalProps({});
            setDirtyKeys(new Set());
        }
    }, [selectedComponentId, selectedComponent?.id]);

    function markChange(key: string, value: any) {
        setLocalProps(prev => ({ ...prev, [key]: value }));
        setDirtyKeys(prev => {
            const next = new Set(prev);
            if (selectedComponent && JSON.stringify((selectedComponent.props || {})[key]) === JSON.stringify(value)) next.delete(key); else next.add(key);
            return next;
        });
    }
    function buildPatch(): Record<string, any> {
        if (!selectedComponent) return {};
        const patch: Record<string, any> = {};
        dirtyKeys.forEach(k => { patch[k] = localProps[k]; });
        return patch;
    }
    function flush(now = false) {
        if (!updateComponentProps || dirtyKeys.size === 0) return;
        const patch = buildPatch();
        if (Object.keys(patch).length === 0) return;
        setIsFlushing(true);
        updateComponentProps.mutate(patch, {
            onSettled: () => setIsFlushing(false),
            onSuccess: () => { setLastSavedAt(Date.now()); setDirtyKeys(new Set()); }
        });
        if (now && debounceRef.current) clearTimeout(debounceRef.current);
    }
    React.useEffect(() => {
        if (dirtyKeys.size === 0) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => flush(), 700);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [Array.from(dirtyKeys).join('|'), localProps]);
    function revertChanges() {
        if (!selectedComponent) return;
        setLocalProps({ ...(selectedComponent.props || {}) });
        setDirtyKeys(new Set());
        if (debounceRef.current) clearTimeout(debounceRef.current);
    }

    // Preview runtime (draft) - simplificado: apenas inicia e mantém estado local de respostas
    const previewStart = usePreviewStart(draft.id);
    const answerPreview = usePreviewAnswer(draft.id);
    const [runtime, setRuntime] = useState<{ sessionId: string; currentStageId: string } | null>(null);
    const [runtimeAnswers, setRuntimeAnswers] = useState<Record<string, string[]>>({});
    function startPreview() {
        previewStart.mutate(undefined, { onSuccess: (res: any) => { setRuntime(res); setRuntimeAnswers({}); } });
    }
    const currentRuntimeStage = runtime ? draft.stages.find(s => s.id === runtime.currentStageId) : undefined;
    function answerOption(stageId: string, optionId: string, multi: boolean) {
        if (!runtime) return;
        setRuntimeAnswers(prev => {
            const current = prev[stageId] || [];
            let next: string[];
            if (multi) {
                next = current.includes(optionId) ? current.filter(o => o !== optionId) : [...current, optionId];
            } else {
                next = [optionId];
            }
            // dispara chamada para servidor para avançar
            answerPreview.mutate({ sessionId: runtime.sessionId, stageId, optionIds: next }, {
                onSuccess: (res: any) => {
                    if (res.nextStageId) setRuntime(r => r ? { ...r, currentStageId: res.nextStageId } : r);
                    if (res.completed) {
                        setRuntime(r => r ? { ...r, currentStageId: r.currentStageId } : r);
                    }
                }
            });
            return { ...prev, [stageId]: next };
        });
    }

    function toggleStage(stId: string) { setOpenStageId(prev => prev === stId ? null : stId); }
    function addQuick(kind: string) {
        if (!addCmp || !activeStage) return;
        const defaults: Record<string, any> = {
            Header: { title: 'Título', subtitle: 'Sub', description: 'Descrição' },
            Navigation: { showNext: true },
            QuestionSingle: { title: 'Pergunta', options: [{ id: 'opt1', label: 'Opção 1' }, { id: 'opt2', label: 'Opção 2' }] },
            QuestionMulti: { title: 'Pergunta Multi', options: [{ id: 'm1', label: 'Item 1' }, { id: 'm2', label: 'Item 2' }] },
            Transition: { message: 'Transição...' },
            ResultPlaceholder: { template: 'Seu resultado: {{score}}' }
        };
        addCmp.mutate({ component: { type: kind, props: defaults[kind] || {} } });
    }
    function moveComponent(index: number, dir: -1 | 1) {
        if (!activeStage || !reorderCmps) return;
        const ids = [...activeStage.componentIds];
        const target = index + dir;
        if (target < 0 || target >= ids.length) return;
        const tmp = ids[index]; ids[index] = ids[target]; ids[target] = tmp;
        reorderCmps.mutate(ids);
    }
    function removeComponent(componentId: string) { if (remCmp) remCmp.mutate(componentId); }

    // Métricas de decomposição (count tipados vs legacy bundle)
    const allComponents = Object.values(draft.components || {});
    const typedCount = allComponents.filter(c => (c as any).kind && (c as any).kind !== 'RawLegacyBundle').length;
    const legacyCount = allComponents.filter(c => (c as any).kind === 'RawLegacyBundle' || (!('kind' in c) && c.type === 'legacyBlocksBundle')).length;
    const totalCount = allComponents.length || 1;
    const typedPct = Math.round((typedCount / totalCount) * 100);

    return <div className="space-y-4">
        <div className="flex items-center gap-2">
            <button onClick={onBack} className="text-sm text-blue-600 hover:underline">← Voltar</button>
            <h1 className="text-xl font-semibold">Editar Template</h1>
            <div className="ml-auto text-xs text-gray-500">v{draft.draftVersion}</div>
        </div>
        <section className="space-y-2">
            <h2 className="font-medium">Metadados</h2>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col flex-1">
                    <label className="text-xs">Nome</label>
                    <input className="border rounded px-2 py-1" value={localName} onChange={e => setLocalName(e.target.value)} />
                </div>
                <div className="flex flex-col flex-1">
                    <label className="text-xs">Descrição</label>
                    <input className="border rounded px-2 py-1" value={localDesc} onChange={e => setLocalDesc(e.target.value)} />
                </div>
                <div className="flex flex-col justify-end">
                    <button onClick={saveMeta} disabled={updateMeta.isPending} className="bg-emerald-600 text-white px-3 py-1 rounded disabled:opacity-50 text-sm">Salvar</button>
                </div>
            </div>
        </section>
        <section className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="font-medium">Stages ({draft.stages.length})</h2>
                <button onClick={handleAddStage} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Adicionar Stage</button>
                <div className="ml-auto flex items-center gap-2 text-[10px]">
                    <div className="flex items-center gap-1"><span className="font-semibold">Tipados:</span><span>{typedCount}</span></div>
                    <div className="flex items-center gap-1"><span className="font-semibold">Legacy:</span><span>{legacyCount}</span></div>
                    <div className="w-32 h-2 bg-gray-200 rounded overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${typedPct}%` }} />
                    </div>
                    <span className="text-emerald-700 font-medium">{typedPct}%</span>
                </div>
            </div>
            <ul className="divide-y border rounded bg-white">
                {stagesOrdered.map((s, idx) => {
                    const isOpen = s.id === openStageId;
                    return <li key={s.id} className="p-2 text-sm space-y-2">
                        <div className="flex items-center gap-2">
                            <button onClick={() => toggleStage(s.id)} className="text-xs px-1 rounded border bg-gray-50">{isOpen ? '−' : '+'}</button>
                            <span className="font-mono text-xs bg-gray-100 px-1 rounded">{s.order}</span>
                            <span className="font-medium">{s.type}</span>
                            <span className="text-gray-500 text-xs">{s.id}</span>
                            <span className="ml-2 text-[10px] text-gray-500">{s.componentIds.length} componentes</span>
                            <button disabled={idx === 0} onClick={() => handleReorderUp(idx)} className="ml-auto text-xs text-blue-600 disabled:opacity-40">Subir</button>
                        </div>
                        {isOpen && <div className="ml-6 space-y-3">
                            <div className="flex flex-wrap gap-2 text-xs">
                                {['Header', 'Navigation', 'QuestionSingle', 'QuestionMulti', 'Transition', 'ResultPlaceholder'].map(k => <button key={k} onClick={() => addQuick(k)} disabled={addCmp?.isPending} className="border px-2 py-0.5 rounded hover:bg-gray-50 disabled:opacity-50">+ {k}</button>)}
                            </div>
                            <ul className="space-y-2">
                                {s.componentIds.map((cid, cIndex) => {
                                    const comp = draft.components[cid];
                                    // diff vs publicado (se houver snapshot)
                                    const published = (draft as any).published?.components?.[cid];
                                    let propDiffCount = 0;
                                    if (published) {
                                        const keys = new Set([...Object.keys(comp?.props || {}), ...Object.keys(published.props || {})]);
                                        keys.forEach(k => { if (JSON.stringify(comp?.props?.[k]) !== JSON.stringify(published.props?.[k])) propDiffCount++; });
                                    }
                                    const isSelected = selectedComponentId === cid;
                                    return <li key={cid} className="border rounded p-2 bg-white shadow-sm">
                                        <div className="flex items-center gap-2 text-xs mb-2">
                                            <span className="font-mono bg-gray-100 px-1 rounded">{cIndex}</span>
                                            <span className="font-semibold flex items-center gap-1">{comp?.type || '??'}
                                                {propDiffCount > 0 && <span title={`${propDiffCount} props alteradas vs publicado`} className="text-[9px] px-1 rounded bg-blue-100 text-blue-700">Δ{propDiffCount}</span>}
                                            </span>
                                            <span className="text-gray-400">{cid}</span>
                                            {isSelected && dirtyKeys.size > 0 && <span className="text-[9px] text-amber-600">{dirtyKeys.size} pend.</span>}
                                            <div className="ml-auto flex gap-1">
                                                <button onClick={() => moveComponent(cIndex, -1)} disabled={cIndex === 0 || reorderCmps?.isPending} className="border px-1 rounded disabled:opacity-40">↑</button>
                                                <button onClick={() => moveComponent(cIndex, 1)} disabled={cIndex === s.componentIds.length - 1 || reorderCmps?.isPending} className="border px-1 rounded disabled:opacity-40">↓</button>
                                                <button onClick={() => removeComponent(cid)} disabled={remCmp?.isPending} className="border px-1 rounded text-red-600 disabled:opacity-40">✕</button>
                                            </div>
                                        </div>
                                        {comp ? <div className={`text-xs cursor-pointer ${isSelected ? 'ring-2 ring-blue-500 rounded' : ''}`} onClick={() => setSelectedComponentId(cid)}>{renderComponent({ ...comp, kind: (comp as any).kind || (comp as any).type }, { draft: draft as any, stageId: s.id })}</div> : <div className="text-xs text-red-600">Componente inexistente</div>}
                                    </li>;
                                })}
                                {s.componentIds.length === 0 && <li className="text-[11px] text-gray-500">Nenhum componente ainda.</li>}
                            </ul>
                        </div>}
                    </li>;
                })}
            </ul>
        </section>
        <section className="space-y-2 border rounded p-3 bg-white">
            <h2 className="font-medium text-sm flex items-center gap-2">Painel de Propriedades {selectedComponent && <span className="text-[10px] text-gray-500">({selectedComponent.type})</span>}</h2>
            {!selectedComponent && <div className="text-[11px] text-gray-500">Selecione um componente para editar.</div>}
            {selectedComponent && (() => {
                const schema = getComponentSchema((selectedComponent as any).kind || selectedComponent.type);
                const props = selectedComponent.props || {};
                const compIssues = validation ? [...validation.errors, ...validation.warnings].filter(i => i.message.includes(`[${selectedComponent.id}]`)) : [];
                const fieldIssues = (fieldName: string) => compIssues.filter(ci => (ci as any).field === fieldName);
                const statusLabel = isFlushing ? 'Salvando...' : dirtyKeys.size ? `${dirtyKeys.size} pendente(s)` : lastSavedAt ? 'Salvo' : '—';
                return <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-[10px] p-1 rounded bg-gray-50 border">
                        <span className="font-medium">Sync:</span>
                        <span className={isFlushing ? 'text-amber-600' : dirtyKeys.size ? 'text-blue-600' : 'text-emerald-700'}>{statusLabel}</span>
                        <div className="ml-auto flex gap-1">
                            <button onClick={() => flush(true)} disabled={isFlushing || dirtyKeys.size === 0} className="px-2 py-0.5 rounded border bg-white disabled:opacity-40">Aplicar agora</button>
                            <button onClick={revertChanges} disabled={isFlushing || dirtyKeys.size === 0} className="px-2 py-0.5 rounded border bg-white text-red-600 disabled:opacity-40">Reverter</button>
                        </div>
                    </div>
                    {compIssues.length > 0 && <div className="space-y-1">
                        {compIssues.map(ci => {
                            const sev = (ci as any).severity || (ci.code.includes('ERROR') ? 'error' : 'warning');
                            return <div key={ci.code} className={`text-[10px] rounded px-1 py-0.5 inline-block ${sev === 'error' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{ci.code.split('_').slice(-1)[0]}: {ci.message.replace(`[${selectedComponent.id}] `, '')}</div>;
                        })}
                    </div>}
                    {!schema && <div className="text-[11px] text-amber-600">Sem schema registrado — fallback exibindo JSON bruto.</div>}
                    {schema && <div className="space-y-3">
                        {schema.fields.map(field => {
                            const serverVal = props[field.name];
                            const val = localProps[field.name];
                            const isDirty = JSON.stringify(serverVal) !== JSON.stringify(val);
                            const issuesForField = fieldIssues(field.name);
                            const hasError = issuesForField.some(i => (i as any).severity === 'error');
                            const hasWarning = issuesForField.some(i => (i as any).severity === 'warning');
                            const baseLabel = <label className="text-[10px] uppercase tracking-wide text-gray-500 flex items-center gap-1">{field.label}{field.required && <span className="text-red-500">*</span>}</label>;
                            if (field.type === 'boolean') {
                                return <div key={field.name} className="flex items-center gap-2">
                                    <input type="checkbox" checked={!!val} onChange={e => markChange(field.name, e.target.checked)} />
                                    <span className="text-[11px] flex items-center gap-1">{field.label}{isDirty && <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />}</span>
                                </div>;
                            }
                            if (field.type === 'text') {
                                return <div key={field.name} className="flex flex-col relative">
                                    <div className="flex items-center gap-1">{baseLabel}{issuesForField.map(is => <span key={is.code} title={is.message} className={`text-[9px] px-1 rounded ${(is as any).severity === 'error' ? 'bg-red-200 text-red-700' : 'bg-amber-200 text-amber-800'}`}>{(is as any).severity === 'error' ? 'E' : 'W'}</span>)}{isDirty && <>
                                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                                        <button type="button" className="text-[9px] text-gray-500 underline" onClick={() => markChange(field.name, serverVal)}>↺</button>
                                    </>}</div>
                                    <textarea className={`border rounded px-1 py-0.5 text-xs bg-gray-50 resize-y min-h-[60px] ${hasError ? 'border-red-500 ring-1 ring-red-400' : hasWarning ? 'border-amber-400' : ''}`} value={val || ''} placeholder={field.placeholder}
                                        onChange={e => markChange(field.name, e.target.value)} />
                                </div>;
                            }
                            if (field.type === 'number') {
                                return <div key={field.name} className="flex flex-col">
                                    <div className="flex items-center gap-1">{baseLabel}{issuesForField.map(is => <span key={is.code} title={is.message} className={`text-[9px] px-1 rounded ${(is as any).severity === 'error' ? 'bg-red-200 text-red-700' : 'bg-amber-200 text-amber-800'}`}>{(is as any).severity === 'error' ? 'E' : 'W'}</span>)}{isDirty && <>
                                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                                        <button type="button" className="text-[9px] text-gray-500 underline" onClick={() => markChange(field.name, serverVal)}>↺</button>
                                    </>}</div>
                                    <input type="number" className={`border rounded px-1 py-0.5 text-xs bg-gray-50 ${hasError ? 'border-red-500 ring-1 ring-red-400' : hasWarning ? 'border-amber-400' : ''}`} value={val ?? ''} placeholder={field.placeholder}
                                        onChange={e => {
                                            const num = e.target.value === '' ? undefined : Number(e.target.value);
                                            markChange(field.name, num);
                                        }} />
                                </div>;
                            }
                            if (field.type === 'optionsArray') {
                                const options = Array.isArray(val) ? val : [];
                                return <div key={field.name} className="flex flex-col gap-1 border rounded p-2 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] uppercase tracking-wide text-gray-500 flex items-center gap-1">{field.label}{issuesForField.map(is => <span key={is.code} title={is.message} className={`text-[9px] px-1 rounded ${(is as any).severity === 'error' ? 'bg-red-200 text-red-700' : 'bg-amber-200 text-amber-800'}`}>{(is as any).severity === 'error' ? 'E' : 'W'}</span>)}{isDirty && <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />}</span>
                                        <button className="text-[10px] text-blue-600" onClick={() => {
                                            const next = [...options, { id: `opt${options.length + 1}`, label: `Opção ${options.length + 1}` }];
                                            markChange(field.name, next);
                                        }}>+ opção</button>
                                    </div>
                                    {options.length === 0 && <div className="text-[10px] text-gray-500">Nenhuma opção.</div>}
                                    <ul className="space-y-1">
                                        {options.map((o: any, i: number) => <li key={o.id} className="flex items-center gap-1">
                                            <input className="border rounded px-1 py-0.5 text-[10px] w-16" value={o.id} title="id" onChange={e => { const next = [...options]; next[i] = { ...next[i], id: e.target.value }; markChange(field.name, next); }} />
                                            <input className="border rounded px-1 py-0.5 text-[10px] flex-1" value={o.label} title="label" onChange={e => { const next = [...options]; next[i] = { ...next[i], label: e.target.value }; markChange(field.name, next); }} />
                                            <input className="border rounded px-1 py-0.5 text-[10px] w-14" value={o.points ?? ''} placeholder="pts" title="points" onChange={e => { const next = [...options]; const v = e.target.value === '' ? undefined : Number(e.target.value); next[i] = { ...next[i], points: v }; markChange(field.name, next); }} />
                                            <button className="text-[10px] text-red-600" onClick={() => { const next = options.filter((_: any, idx: number) => idx !== i); markChange(field.name, next); }}>✕</button>
                                        </li>)}
                                    </ul>
                                </div>;
                            }
                            if (field.type === 'json') {
                                return <div key={field.name} className="flex flex-col">
                                    <div className="flex items-center gap-1">{baseLabel}{isDirty && <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />}</div>
                                    <textarea className="border rounded px-1 py-0.5 text-xs font-mono bg-gray-50 min-h-[100px]" value={(() => { try { return JSON.stringify(val, null, 2); } catch { return ''; } })()} onChange={e => { try { const parsed = JSON.parse(e.target.value); markChange(field.name, parsed); } catch { /* ignore until válido */ } }} />
                                </div>;
                            }
                            // default string
                            return <div key={field.name} className="flex flex-col">
                                <div className="flex items-center gap-1">{baseLabel}{isDirty && <>
                                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                                    <button type="button" className="text-[9px] text-gray-500 underline" onClick={() => markChange(field.name, serverVal)}>↺</button>
                                </>}</div>
                                <input className="border rounded px-1 py-0.5 text-xs bg-gray-50" value={val || ''} placeholder={field.placeholder}
                                    onChange={e => markChange(field.name, e.target.value)} />
                            </div>;
                        })}
                    </div>}
                    {!schema && <pre className="text-[10px] max-h-40 overflow-auto border rounded p-2 bg-gray-50">{JSON.stringify(localProps, null, 2)}</pre>}
                    <div className="text-[10px] text-gray-500">Batch edit α — alterações agrupadas com debounce (700ms)</div>
                </div>;
            })()}
        </section>
        <section className="space-y-2">
            <h2 className="font-medium">Validação</h2>
            {!validation && <div className="text-xs text-gray-500">Validando...</div>}
            {validation && validation.errors.length === 0 && <div className="text-xs text-green-700">Sem erros.</div>}
            {validation && validation.errors.length > 0 && <ul className="text-xs text-red-600 list-disc ml-5">
                {validation.errors.map(e => <li key={e.code}>{e.code}</li>)}
            </ul>}
        </section>
        <section className="space-y-2">
            <h2 className="font-medium">Publicação</h2>
            <button onClick={handlePublish} disabled={publishMut.isPending || (validation && validation.errors.length > 0)} className="bg-purple-600 text-white px-3 py-1 rounded disabled:opacity-50 text-sm">Publicar</button>
            {publishMut.isSuccess && <span className="text-xs text-green-700 ml-2">Publicado!</span>}
            {publishMut.error && <span className="text-xs text-red-600 ml-2">Erro: {(publishMut.error as Error).message}</span>}
        </section>
        {(draft as any).published ? <section className="space-y-2 border rounded p-3 bg-white">
            <h2 className="font-medium text-sm">Diff vs Publicado</h2>
            {(() => {
                const pub = (draft as any).published; // caso o modelo draft traga snapshot (ajuste futuro: fetch published separado)
                if (!pub) return <div className="text-[11px] text-gray-500">Nenhum snapshot publicado disponível.</div>;
                const addedStages = draft.stages.filter(s => !pub.stages.find((ps: any) => ps.id === s.id));
                const removedStages = pub.stages.filter((ps: any) => !draft.stages.find(s => s.id === ps.id));
                const addedComponents = Object.keys(draft.components).filter(cid => !pub.components[cid]);
                const removedComponents = Object.keys(pub.components).filter((cid: string) => !draft.components[cid]);
                // Diff de props por componente
                const modifiedComponents = Object.keys(draft.components)
                    .filter(cid => pub.components[cid])
                    .map(cid => ({ id: cid, diffs: diffProps(draft.components[cid]?.props, pub.components[cid]?.props) }))
                    .filter(c => c.diffs.length > 0);
                const totalPropChanges = modifiedComponents.reduce((acc, c) => acc + c.diffs.length, 0);
                return <div className="text-[11px] space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 p-2 rounded border">
                            <div className="font-semibold mb-1">Resumo</div>
                            <ul className="list-disc ml-4 space-y-0.5">
                                <li>Stages atuais: {draft.stages.length} (publicado: {pub.stages.length})</li>
                                <li>Componentes atuais: {Object.keys(draft.components).length} (publicado: {Object.keys(pub.components).length})</li>
                                <li>Versão publicada: {pub.version}</li>
                                <li>Componentes com props alteradas: {modifiedComponents.length}</li>
                                <li>Total de props alteradas: {totalPropChanges}</li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 p-2 rounded border">
                            <div className="font-semibold mb-1">Mudanças Estruturais</div>
                            <ul className="list-disc ml-4 space-y-0.5">
                                <li>Stages adicionadas: {addedStages.length}</li>
                                <li>Stages removidas: {removedStages.length}</li>
                                <li>Componentes adicionados: {addedComponents.length}</li>
                                <li>Componentes removidos: {removedComponents.length}</li>
                            </ul>
                        </div>
                    </div>
                    {modifiedComponents.length > 0 && <div className="bg-gray-50 p-2 rounded border">
                        <div className="font-semibold mb-1">Diff de Propriedades</div>
                        <ul className="space-y-1">
                            {modifiedComponents.map(mc => <li key={mc.id} className="border rounded p-2 bg-white">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono bg-gray-100 px-1 rounded">{mc.id.slice(0, 8)}</span>
                                    <span className="text-gray-700 font-medium">{(draft.components[mc.id] as any).type || (draft.components[mc.id] as any).kind}</span>
                                    <span className="ml-auto text-[10px] text-blue-700">{mc.diffs.length} prop(s)</span>
                                    <button onClick={() => setSelectedComponentId(mc.id)} className="text-[10px] text-blue-600 underline">Ir</button>
                                </div>
                                <ul className="text-[10px] space-y-0.5">
                                    {mc.diffs.slice(0, 6).map(d => <li key={d.key} className="flex gap-1 items-start">
                                        <span className="font-semibold text-gray-600">{d.key}:</span>
                                        <span className="text-red-600 line-through max-w-[120px] truncate" title={JSON.stringify(d.before)}>{typeof d.before === 'object' ? JSON.stringify(d.before) : String(d.before)}</span>
                                        <span className="text-gray-400">→</span>
                                        <span className="text-emerald-700 max-w-[120px] truncate" title={JSON.stringify(d.after)}>{typeof d.after === 'object' ? JSON.stringify(d.after) : String(d.after)}</span>
                                    </li>)}
                                    {mc.diffs.length > 6 && <li className="text-[10px] text-gray-500">… {mc.diffs.length - 6} mais</li>}
                                </ul>
                            </li>)}
                        </ul>
                    </div>}
                    {(addedStages.length || removedStages.length || addedComponents.length || removedComponents.length) === 0 && <div className="text-emerald-700">Sem mudanças estruturais desde a publicação.</div>}
                </div>;
            })()}
        </section> : null}
        <section className="space-y-2 border rounded p-3 bg-white">
            <h2 className="font-medium text-sm">Timeline</h2>
            {!history && <div className="text-[11px] text-gray-500">Carregando histórico...</div>}
            {history && history.length === 0 && <div className="text-[11px] text-gray-500">Nenhuma publicação ainda.</div>}
            {history && history.length > 0 && <ul className="divide-y border rounded bg-white">
                {history.map((h: any) => {
                    const active = h.id === selectedHistoryId;
                    return <li key={h.id} className={`p-2 text-xs flex flex-col gap-1 ${active ? 'bg-blue-50' : ''}`}>
                        <div className="flex items-center gap-2">
                            <button className={`text-[10px] px-1 rounded border ${active ? 'bg-blue-600 text-white' : 'bg-gray-50'}`} onClick={() => setSelectedHistoryId(active ? null : h.id)}>{active ? '✓' : '⟲'}</button>
                            <span className="font-mono text-[10px]">{h.version ? 'v' + h.version : h.op}</span>
                            <span className="text-gray-500">{new Date(h.timestamp).toLocaleString()}</span>
                            <span className="ml-auto text-[10px] text-gray-400">{h.stagesCount} stages / {h.componentsCount} comps</span>
                        </div>
                        <div className="flex flex-wrap gap-1 text-[9px] text-gray-500">
                            <span title="metaHash" className="px-1 rounded bg-gray-100">M:{h.metaHash}</span>
                            <span title="stagesHash" className="px-1 rounded bg-gray-100">S:{h.stagesHash}</span>
                            <span title="componentsHash" className="px-1 rounded bg-gray-100">C:{h.componentsHash}</span>
                        </div>
                    </li>;
                })}
            </ul>}
            {selectedHistoryId && (() => {
                const entry = history?.find(h => h.id === selectedHistoryId);
                if (!entry) return null;
                const cmp = compareHistoryEntry(draft, entry);
                // diffs estruturais adicionais
                const addedStages = draft.stages.filter(s => !(entry as any).stagesHash /* fallback only hash-level */);
                // Para granularidade real precisaríamos snapshot completo; por enquanto só apresentamos estado hash-level
                return <div className="text-[11px] mt-2 p-2 border rounded bg-gray-50 space-y-2">
                    <div className="font-medium mb-1">Diff Snapshot vs Atual</div>
                    <ul className="list-disc ml-4 space-y-0.5">
                        <li>Meta: {cmp.metaChanged ? <span className="text-amber-600">alterado</span> : <span className="text-emerald-700">igual</span>}</li>
                        <li>Stages: {cmp.stagesChanged ? <span className="text-amber-600">alterado</span> : <span className="text-emerald-700">igual</span>}</li>
                        <li>Componentes: {cmp.componentsChanged ? <span className="text-amber-600">alterado</span> : <span className="text-emerald-700">igual</span>}</li>
                    </ul>
                    {(draft as any).published && entry.version === (draft as any).published.version && <div className="text-[10px] text-gray-500">Esta entry é a versão publicada atual — use a seção "Diff vs Publicado" para detalhes de props.</div>}
                    {(cmp.metaChanged || cmp.stagesChanged || cmp.componentsChanged) === false && <div className="text-[10px] text-gray-500">Nenhuma mudança estrutural agregada detectada (hashes idênticos).</div>}
                </div>;
            })()}
        </section>
        <section className="space-y-2 border-t pt-4">
            <h2 className="font-medium">Preview Runtime (Draft)</h2>
            {!runtime && <button onClick={startPreview} disabled={previewStart.isPending} className="bg-gray-800 text-white px-3 py-1 rounded text-sm disabled:opacity-50">Iniciar Preview</button>}
            {runtime && <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2">
                    <span className="font-mono bg-gray-100 px-1 rounded">sess:{runtime.sessionId.slice(0, 8)}</span>
                    <span className="text-gray-500">Stage atual: {runtime.currentStageId}</span>
                    <button onClick={() => { setRuntime(null); }} className="ml-auto text-[10px] text-red-600">Encerrar</button>
                </div>
                {currentRuntimeStage ? <div className="border rounded p-2 bg-white">
                    <div className="text-[11px] font-semibold mb-1">Stage #{currentRuntimeStage.order}</div>
                    <ul className="space-y-2">
                        {currentRuntimeStage.componentIds.map(cid => {
                            const comp = draft.components[cid];
                            const kind = (comp as any).kind || comp.type;
                            const isQuestion = kind === 'QuestionSingle' || kind === 'QuestionMulti';
                            return <li key={cid} className="border rounded p-2 space-y-2">
                                {renderComponent({ ...comp, kind }, { draft: draft as any, stageId: currentRuntimeStage.id })}
                                {isQuestion && Array.isArray(comp.props?.options) && <ul className="space-y-1 text-[11px]">
                                    {comp.props.options.map((o: any) => {
                                        const multi = kind === 'QuestionMulti';
                                        const selected = (runtimeAnswers[currentRuntimeStage.id] || []).includes(o.id);
                                        return <li key={o.id}>
                                            <button onClick={() => answerOption(currentRuntimeStage.id, o.id, multi)} className={`px-2 py-1 rounded border text-left w-full ${selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50'}`}>{o.label}</button>
                                        </li>;
                                    })}
                                </ul>}
                            </li>;
                        })}
                    </ul>
                </div> : <div className="text-[11px] text-gray-500">Stage atual não encontrada (pode ter sido removida).</div>}
            </div>}
        </section>
    </div>;
};
