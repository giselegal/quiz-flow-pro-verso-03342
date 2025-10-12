import React, { useMemo, useState } from 'react';
import { useTemplateDraft, useUpdateMeta, useAddStage, useReorderStages, usePublish, useValidateDraft, useAddStageComponent, useRemoveStageComponent, useReorderStageComponents, useUpdateComponentProps, useTemplateHistory } from '../api/hooks';
import { useComponentEditingState } from '../hooks/useComponentEditingState';
import { diffProps } from '../utils/diffProps';
import { getComponentSchema } from './componentPropSchemas';
import { renderComponent } from '../render/registry';
import { compareHistoryEntry } from '../utils/historyHashes';
import type { TemplateDraftShared } from '@/shared/templateEngineTypes';

interface Props { id: string; onBack: () => void; }

/** Layout 4 colunas: Stages | Biblioteca & Componentes | Canvas | Propriedades */
export const TemplateEngineEditorLayout: React.FC<Props> = ({ id, onBack }) => {
    const { data: draft, isLoading, error } = useTemplateDraft(id) as { data: TemplateDraftShared | undefined; isLoading: boolean; error: any };
    const updateMeta = useUpdateMeta(id);
    const addStage = useAddStage(id);
    const reorderStages = useReorderStages(id);
    const publishMut = usePublish(id);
    const { data: validation } = useValidateDraft(id);
    const { data: history } = useTemplateHistory(id) as { data: any[] | undefined };
    const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

    const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
    const stagesOrdered = useMemo(() => {
        if (!draft || !Array.isArray(draft.stages)) return [] as any[];
        return [...draft.stages].filter(s => s && typeof s.order === 'number' && Array.isArray((s as any).componentIds)).sort((a, b) => a.order - b.order);
    }, [draft?.id, draft?.draftVersion]);
    // Seleciona automaticamente o primeiro stage quando carregar o draft
    React.useEffect(() => {
        if (!selectedStageId && stagesOrdered.length > 0) {
            setSelectedStageId(stagesOrdered[0].id);
        }
    }, [stagesOrdered.length]);
    const activeStage = stagesOrdered.find(s => s.id === selectedStageId) || stagesOrdered[0];
    const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
    const selectedComponent = selectedComponentId && draft ? draft.components[selectedComponentId] : null;
    const updateComponentProps = selectedComponentId ? useUpdateComponentProps(selectedComponentId, id) : undefined;
    const editing = useComponentEditingState({ componentId: selectedComponentId, serverProps: selectedComponent?.props, updateMutation: updateComponentProps });

    // Mutations por stage ativo
    const addCmp = activeStage ? useAddStageComponent(id, activeStage.id) : undefined;
    const remCmp = activeStage ? useRemoveStageComponent(id, activeStage.id) : undefined;
    const reorderCmps = activeStage ? useReorderStageComponents(id, activeStage.id) : undefined;

    // Metadados locais
    const [localName, setLocalName] = useState('');
    const [localDesc, setLocalDesc] = useState('');
    React.useEffect(() => { if (draft) { setLocalName(draft.meta.name); setLocalDesc(draft.meta.description || ''); } }, [draft?.id]);
    const saveMeta = () => updateMeta.mutate({ name: localName, description: localDesc });

    // Helpers
    function handleAddStage(type: string) { addStage.mutate({ type: type as any }); }
    function reorderUp(idx: number) { if (!draft) return; const ordered = [...stagesOrdered]; if (idx === 0) return; const tmp = ordered[idx - 1]; ordered[idx - 1] = ordered[idx]; ordered[idx] = tmp; reorderStages.mutate(ordered.map(s => s.id)); }
    function selectStage(id: string) { setSelectedStageId(id); setSelectedComponentId(null); }
    function addQuick(kind: string) { if (!addCmp || !activeStage) return; const defaults: Record<string, any> = { Header: { title: 'Título', subtitle: 'Sub' }, Navigation: { showNext: true }, QuestionSingle: { title: 'Pergunta', options: [{ id: 'opt1', label: 'Opção 1' }] }, QuestionMulti: { title: 'Pergunta Multi', options: [{ id: 'm1', label: 'Item 1' }] }, Transition: { message: 'Transição...' }, ResultPlaceholder: { template: 'Resultado: {{score}}' } }; addCmp.mutate({ component: { type: kind, props: defaults[kind] || {} } }); }
    function moveComponent(index: number, dir: -1 | 1) { if (!activeStage || !reorderCmps) return; const ids = [...activeStage.componentIds]; const target = index + dir; if (target < 0 || target >= ids.length) return; const t = ids[index]; ids[index] = ids[target]; ids[target] = t; reorderCmps.mutate(ids); }
    function removeComponent(cid: string) { remCmp?.mutate(cid); if (cid === selectedComponentId) setSelectedComponentId(null); }
    function publish() { editing.flush(true); publishMut.mutate(); }

    // Diff vs publicado (resumo simples)
    const published = (draft as any)?.published;
    const diffSummary = React.useMemo(() => {
        if (!draft || !published) return null;
        const addedComponents = Object.keys(draft.components).filter(cid => !published.components[cid]);
        const removedComponents = Object.keys(published.components).filter((cid: string) => !draft.components[cid]);
        const modified = Object.keys(draft.components).filter(cid => published.components[cid]).map(cid => ({ id: cid, diffs: diffProps(draft.components[cid]?.props, published.components[cid]?.props) })).filter(m => m.diffs.length > 0);
        return { addedComponents, removedComponents, modified };
    }, [draft?.id, draft?.draftVersion, published?.version]);

    // History compare (se usuário seleciona uma entry)
    const selectedHistoryEntry = history?.find(h => h.id === selectedHistoryId);
    const historyCompare = React.useMemo(() => {
        if (!draft || !selectedHistoryEntry) return null;
        return compareHistoryEntry(draft, selectedHistoryEntry);
    }, [draft?.draftVersion, selectedHistoryEntry?.id]);

    if (isLoading) return <div className="p-4 text-sm">Carregando draft...</div>;
    if (error) return <div className="p-4 text-sm text-red-600">Erro: {(error as Error).message}</div>;
    if (!draft) return null;

    return (
        <div className="flex flex-col h-full w-full" data-testid="template-engine-editor-layout">
            {/* Top bar */}
            <div className="h-11 border-b flex items-center gap-3 px-4 bg-white text-sm">
                <button onClick={onBack} className="text-blue-600 hover:underline">← Voltar</button>
                <span className="font-semibold">Template Engine Editor</span>
                <span className="text-xs text-gray-500">v{draft.draftVersion}</span>
                {publishMut.isSuccess && <span className="text-xs text-emerald-600">Publicado!</span>}
                {publishMut.error && <span className="text-xs text-red-600">Erro publish</span>}
                <div className="ml-auto flex gap-2 items-center">
                    <button onClick={() => saveMeta()} disabled={updateMeta.isPending} className="px-2 py-1 rounded border text-xs bg-white disabled:opacity-40">Salvar Meta</button>
                    <button onClick={() => publish()} disabled={publishMut.isPending || (validation && validation.errors.length > 0)} className="px-2 py-1 rounded bg-purple-600 text-white text-xs disabled:opacity-40">Publicar</button>
                </div>
            </div>
            {/* Main grid */}
            <div className="flex flex-1 overflow-hidden">
                {/* Col 1: Stages */}
                <div className="w-56 border-r flex flex-col bg-white">
                    <div className="p-2 border-b flex items-center justify-between">
                        <span className="text-xs font-semibold">Stages</span>
                        <button onClick={() => handleAddStage('question')} className="text-[10px] px-2 py-0.5 border rounded bg-gray-50">+ Stage</button>
                    </div>
                    <div className="flex-1 overflow-auto text-xs">
                        <ul>
                            {stagesOrdered.map((s, idx) => {
                                const issues = validation ? [...validation.errors, ...validation.warnings].filter(i => (i as any).stageId === s.id) : [];
                                const hasError = issues.some(i => (i as any).severity === 'error');
                                const hasWarn = issues.some(i => (i as any).severity === 'warning');
                                const active = s.id === activeStage?.id;
                                return <li key={s.id} className={`px-2 py-1 border-b cursor-pointer ${active ? 'bg-blue-50' : ''}`} onClick={() => selectStage(s.id)}>
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium truncate">{s.type}</span>
                                        {hasError && <span className="w-2 h-2 rounded-full bg-red-500" />}
                                        {!hasError && hasWarn && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                                        <span className="ml-auto font-mono text-[10px]">{s.order}</span>
                                    </div>
                                    <div className="flex gap-1 mt-1">
                                        <button disabled={idx === 0 || reorderStages.isPending} onClick={(e) => { e.stopPropagation(); reorderUp(idx); }} className="h-4 px-1 border rounded disabled:opacity-40">↑</button>
                                    </div>
                                </li>;
                            })}
                        </ul>
                    </div>
                </div>
                {/* Col 2: Biblioteca & Componentes do Stage */}
                <div className="w-72 border-r flex flex-col bg-white text-xs">
                    <div className="p-2 border-b font-semibold flex items-center justify-between">
                        <span>Componentes</span>
                        {activeStage && <span className="text-[10px] text-gray-500">{Array.isArray(activeStage.componentIds) ? activeStage.componentIds.length : 0}</span>}
                    </div>
                    {activeStage ? <div className="flex-1 overflow-auto p-2 space-y-3">
                        <div className="space-y-1">
                            <div className="text-[10px] uppercase tracking-wide text-gray-500">Adicionar Rápido</div>
                            <div className="flex flex-wrap gap-1">
                                {['Header', 'Navigation', 'QuestionSingle', 'QuestionMulti', 'Transition', 'ResultPlaceholder'].map(k => <button key={k} onClick={() => addQuick(k)} disabled={addCmp?.isPending} className="px-2 py-0.5 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-40">+ {k}</button>)}
                            </div>
                        </div>
                        <ul className="space-y-2">
                            {Array.isArray(activeStage.componentIds) && activeStage.componentIds.map((cid: string, i: number) => {
                                const comp = draft.components[cid];
                                const publishedComp = published?.components?.[cid];
                                const diffCount = publishedComp ? diffProps(comp?.props, publishedComp.props).length : 0;
                                const selected = cid === selectedComponentId;
                                return <li key={cid} className={`border rounded p-2 bg-white shadow-sm ${selected ? 'ring-2 ring-blue-500' : ''}`}>
                                    <div className="flex items-center gap-1 mb-1">
                                        <span className="font-semibold truncate">{comp?.type || '?'}</span>
                                        {diffCount > 0 && <span className="text-[9px] px-1 rounded bg-blue-100 text-blue-700" title="Diferenças de props">Δ{diffCount}</span>}
                                        <span className="text-gray-400 text-[10px]">{cid}</span>
                                        <div className="ml-auto flex gap-1">
                                            <button onClick={() => moveComponent(i, -1)} disabled={i === 0 || reorderCmps?.isPending} className="h-4 px-1 border rounded disabled:opacity-40">↑</button>
                                            <button onClick={() => moveComponent(i, 1)} disabled={i === activeStage.componentIds.length - 1 || reorderCmps?.isPending} className="h-4 px-1 border rounded disabled:opacity-40">↓</button>
                                            <button onClick={() => removeComponent(cid)} disabled={remCmp?.isPending} className="h-4 px-1 border rounded text-red-600 disabled:opacity-40">✕</button>
                                        </div>
                                    </div>
                                    <div className="cursor-pointer" onClick={() => setSelectedComponentId(cid)}>
                                        {comp ? renderComponent({ ...comp, kind: (comp as any).kind || comp.type }, { draft: draft as any, stageId: activeStage.id }) : <span className="text-[11px] text-red-600">Inexistente</span>}
                                    </div>
                                </li>;
                            })}
                            {Array.isArray(activeStage.componentIds) && activeStage.componentIds.length === 0 && <li className="text-[11px] text-gray-500">Nenhum componente.</li>}
                        </ul>
                    </div> : <div className="flex-1 p-2 text-[11px] text-gray-500">Nenhum stage.</div>}
                </div>
                {/* Col 3: Canvas */}
                <div className="flex-1 border-r bg-gray-50 relative">
                    <div className="absolute inset-0 overflow-auto p-4 grid gap-4">
                        {activeStage && Array.isArray(activeStage.componentIds) && activeStage.componentIds.map((cid: string) => {
                            const comp = draft.components[cid];
                            return <div key={cid} className="border bg-white rounded p-3 text-xs">{comp ? renderComponent({ ...comp, kind: (comp as any).kind || comp.type }, { draft: draft as any, stageId: activeStage.id }) : '—'}</div>;
                        })}
                        {!activeStage && <div className="text-xs text-gray-500">Selecione um stage.</div>}
                    </div>
                </div>
                {/* Col 4: Propriedades */}
                <div className="w-96 flex flex-col bg-white">
                    <div className="p-2 border-b text-xs font-semibold flex items-center gap-2">Propriedades
                        {selectedComponent && editing.dirtyKeys.size > 0 && <span className="text-[10px] text-amber-600">{editing.dirtyKeys.size} pend.</span>}
                    </div>
                    <div className="flex-1 overflow-auto p-3 text-xs space-y-4">
                        {/* Metadados Template */}
                        <div className="border rounded p-2 space-y-2 bg-gray-50">
                            <div className="text-[10px] font-semibold uppercase tracking-wide">Metadados</div>
                            <input value={localName} onChange={e => setLocalName(e.target.value)} className="w-full border rounded px-2 py-1 text-xs" placeholder="Nome" />
                            <input value={localDesc} onChange={e => setLocalDesc(e.target.value)} className="w-full border rounded px-2 py-1 text-xs" placeholder="Descrição" />
                            <button onClick={() => saveMeta()} disabled={updateMeta.isPending} className="px-2 py-1 rounded border bg-white text-[11px] disabled:opacity-40">Salvar</button>
                        </div>
                        {/* Histórico */}
                        {history && history.length > 0 && <div className="border rounded p-2 space-y-2">
                            <div className="flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-wide">Histórico</span><button onClick={() => setSelectedHistoryId(null)} className="text-[10px] underline">Limpar</button></div>
                            <ul className="space-y-1 max-h-40 overflow-auto">
                                {history.slice(-8).reverse().map(h => <li key={h.id} className={`px-2 py-1 rounded cursor-pointer text-[11px] ${h.id === selectedHistoryId ? 'bg-blue-100' : 'bg-gray-50 hover:bg-gray-100'}`} onClick={() => setSelectedHistoryId(h.id)}>
                                    v{h.version} <span className="text-gray-500">{h.createdAt?.slice(11, 19)}</span>
                                </li>)}
                            </ul>
                            {selectedHistoryEntry && historyCompare && <div className="text-[10px] bg-gray-50 border rounded p-2">
                                <div className="font-semibold mb-1">Comparação</div>
                                <div className="grid grid-cols-2 gap-1">
                                    <span className="text-gray-500">Meta Hash:</span><span>{historyCompare.metaChanged ? '≠' : '='}</span>
                                    <span className="text-gray-500">Stages Hash:</span><span>{historyCompare.stagesChanged ? '≠' : '='}</span>
                                    <span className="text-gray-500">Components Hash:</span><span>{historyCompare.componentsChanged ? '≠' : '='}</span>
                                </div>
                            </div>}
                        </div>}
                        {/* Component Props */}
                        {!selectedComponent && <div className="text-[11px] text-gray-500">Selecione um componente.</div>}
                        {selectedComponent && (() => {
                            const schema = getComponentSchema((selectedComponent as any).kind || selectedComponent.type);
                            const props = selectedComponent.props || {};
                            const compIssues = validation ? [...validation.errors, ...validation.warnings].filter(i => i.message.includes(`[${selectedComponent.id}]`)) : [];
                            const fieldIssues = (fname: string) => compIssues.filter(ci => (ci as any).field === fname);
                            return <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[10px] p-1 rounded bg-gray-50 border">
                                    <span className="font-medium">Sync:</span>
                                    <span className={editing.isFlushing ? 'text-amber-600' : editing.dirtyKeys.size ? 'text-blue-600' : 'text-emerald-700'}>
                                        {editing.isFlushing ? 'Salvando...' : editing.dirtyKeys.size ? `${editing.dirtyKeys.size} pend.` : editing.lastSavedAt ? 'Salvo' : '—'}
                                    </span>
                                    <div className="ml-auto flex gap-1">
                                        <button onClick={() => editing.flush(true)} disabled={editing.isFlushing || editing.dirtyKeys.size === 0} className="px-2 py-0.5 rounded border bg-white text-[10px] disabled:opacity-40">Aplicar</button>
                                        <button onClick={() => editing.revertChanges()} disabled={editing.isFlushing || editing.dirtyKeys.size === 0} className="px-2 py-0.5 rounded border bg-white text-[10px] disabled:opacity-40">Reverter</button>
                                    </div>
                                </div>
                                {!schema && <div className="text-[11px] text-amber-600">Sem schema — exibindo JSON.</div>}
                                {schema && schema.fields.map(field => {
                                    const serverVal = props[field.name];
                                    const val = editing.localProps[field.name];
                                    const isDirty = JSON.stringify(serverVal) !== JSON.stringify(val);
                                    const issuesForField = fieldIssues(field.name);
                                    const baseLabel = <label className="text-[10px] uppercase tracking-wide text-gray-500 flex items-center gap-1">{field.label}{field.required && <span className="text-red-500">*</span>}</label>;
                                    if (field.type === 'boolean') return <div key={field.name} className="flex items-center gap-2"><input type="checkbox" checked={!!val} onChange={e => editing.markChange(field.name, e.target.checked)} /><span className="text-[11px] flex items-center gap-1">{field.label}{isDirty && <span className="w-2 h-2 rounded-full bg-blue-500" />}</span></div>;
                                    if (field.type === 'text') return <div key={field.name} className="flex flex-col">{baseLabel}<textarea className={`border rounded px-1 py-0.5 text-xs bg-gray-50 resize-y min-h-[50px] ${issuesForField.length ? 'border-amber-400' : ''}`} value={val || ''} onChange={e => editing.markChange(field.name, e.target.value)} /></div>;
                                    if (field.type === 'number') return <div key={field.name} className="flex flex-col">{baseLabel}<input type="number" className="border rounded px-1 py-0.5 text-xs bg-gray-50" value={val ?? ''} onChange={e => editing.markChange(field.name, e.target.value === '' ? undefined : Number(e.target.value))} /></div>;
                                    if (field.type === 'optionsArray') { const options = Array.isArray(val) ? val : []; return <div key={field.name} className="flex flex-col gap-1 border rounded p-2 bg-gray-50"><div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-gray-500">{field.label}<button onClick={() => editing.markChange(field.name, [...options, { id: `opt${options.length + 1}`, label: `Opção ${options.length + 1}` }])} className="text-blue-600">+ opção</button></div>{options.length === 0 && <div className="text-[10px] text-gray-500">Nenhuma opção.</div>}<ul className="space-y-1">{options.map((o: any, i: number) => <li key={o.id} className="flex items-center gap-1"><input className="border rounded px-1 py-0.5 text-[10px] w-16" value={o.id} onChange={e => { const next = [...options]; next[i] = { ...next[i], id: e.target.value }; editing.markChange(field.name, next); }} /><input className="border rounded px-1 py-0.5 text-[10px] flex-1" value={o.label} onChange={e => { const next = [...options]; next[i] = { ...next[i], label: e.target.value }; editing.markChange(field.name, next); }} /><button className="text-[10px] text-red-600" onClick={() => { const next = options.filter((_: any, idx: number) => idx !== i); editing.markChange(field.name, next); }}>✕</button></li>)}</ul></div>; }
                                    if (field.type === 'json') return <div key={field.name} className="flex flex-col">{baseLabel}<textarea className="border rounded px-1 py-0.5 text-xs font-mono bg-gray-50 min-h-[80px]" value={(() => { try { return JSON.stringify(val, null, 2); } catch { return ''; } })()} onChange={e => { try { const parsed = JSON.parse(e.target.value); editing.markChange(field.name, parsed); } catch {/* ignore */ } }} /></div>;
                                    return <div key={field.name} className="flex flex-col">{baseLabel}<input className="border rounded px-1 py-0.5 text-xs bg-gray-50" value={val || ''} onChange={e => editing.markChange(field.name, e.target.value)} /></div>;
                                })}
                                {!schema && <pre className="text-[10px] max-h-40 overflow-auto border rounded p-2 bg-gray-50">{JSON.stringify(editing.localProps, null, 2)}</pre>}
                            </div>;
                        })()}
                        {/* Diff resumido vs publicado */}
                        {diffSummary && <div className="border rounded p-2 space-y-1 bg-gray-50">
                            <div className="text-[10px] font-semibold uppercase tracking-wide">Diff Publicado</div>
                            <div className="text-[10px]">+{diffSummary.addedComponents.length} / -{diffSummary.removedComponents.length} / ~{diffSummary.modified.length}</div>
                        </div>}
                        {validation && <div className="border rounded p-2 space-y-1 bg-gray-50 text-[10px]"> <div className="font-semibold uppercase tracking-wide">Validação</div> <div>Erros: {validation.errors.length} · Warnings: {validation.warnings.length}</div></div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateEngineEditorLayout;
