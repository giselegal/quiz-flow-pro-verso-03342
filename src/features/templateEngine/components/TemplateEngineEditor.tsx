import React, { useState } from 'react';
import { useTemplateDraft, useUpdateMeta, useAddStage, useReorderStages, usePublish, useValidateDraft, useAddStageComponent, useRemoveStageComponent, useReorderStageComponents, useUpdateComponentProps } from '../api/hooks';
import { renderComponent } from '../render/registry';
import { getComponentSchema } from './componentPropSchemas';
// Ajuste: evitar conflito de tipos TemplateDraft (frontend vs server). Vamos tratar draft como 'any' onde passamos para renderComponent.

export const TemplateEngineEditor: React.FC<{ id: string; onBack: () => void }> = ({ id, onBack }) => {
    const { data: draft, isLoading, error } = useTemplateDraft(id);
    const updateMeta = useUpdateMeta(id);
    const addStage = useAddStage(id);
    const reorder = useReorderStages(id);
    const publishMut = usePublish(id);
    const { data: validation } = useValidateDraft(id);
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
    const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
    const selectedComponent = selectedComponentId ? draft.components[selectedComponentId] : null;
    const updateComponentProps = selectedComponentId ? useUpdateComponentProps(selectedComponentId, draft.id) : undefined;

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
                                    return <li key={cid} className="border rounded p-2 bg-white shadow-sm">
                                        <div className="flex items-center gap-2 text-xs mb-2">
                                            <span className="font-mono bg-gray-100 px-1 rounded">{cIndex}</span>
                                            <span className="font-semibold">{comp?.type || '??'}</span>
                                            <span className="text-gray-400">{cid}</span>
                                            <div className="ml-auto flex gap-1">
                                                <button onClick={() => moveComponent(cIndex, -1)} disabled={cIndex === 0 || reorderCmps?.isPending} className="border px-1 rounded disabled:opacity-40">↑</button>
                                                <button onClick={() => moveComponent(cIndex, 1)} disabled={cIndex === s.componentIds.length - 1 || reorderCmps?.isPending} className="border px-1 rounded disabled:opacity-40">↓</button>
                                                <button onClick={() => removeComponent(cid)} disabled={remCmp?.isPending} className="border px-1 rounded text-red-600 disabled:opacity-40">✕</button>
                                            </div>
                                        </div>
                                        {comp ? <div className={`text-xs cursor-pointer ${selectedComponentId === cid ? 'ring-2 ring-blue-500 rounded' : ''}`} onClick={() => setSelectedComponentId(cid)}>{renderComponent({ ...comp, kind: (comp as any).kind || (comp as any).type }, { draft: draft as any, stageId: s.id })}</div> : <div className="text-xs text-red-600">Componente inexistente</div>}
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
                return <div className="space-y-3 text-xs">
                    {compIssues.length > 0 && <div className="space-y-1">
                        {compIssues.map(ci => {
                            const sev = (ci as any).severity || (ci.code.includes('ERROR') ? 'error' : 'warning');
                            return <div key={ci.code} className={`text-[10px] rounded px-1 py-0.5 inline-block ${sev === 'error' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{ci.code.split('_').slice(-1)[0]}: {ci.message.replace(`[${selectedComponent.id}] `, '')}</div>;
                        })}
                    </div>}
                    {!schema && <div className="text-[11px] text-amber-600">Sem schema registrado — fallback exibindo JSON bruto.</div>}
                    {schema && <div className="space-y-3">
                        {schema.fields.map(field => {
                            const val = props[field.name];
                            const baseLabel = <label className="text-[10px] uppercase tracking-wide text-gray-500 flex items-center gap-1">{field.label}{field.required && <span className="text-red-500">*</span>}</label>;
                            if (field.type === 'boolean') {
                                return <div key={field.name} className="flex items-center gap-2">
                                    <input type="checkbox" defaultChecked={!!val} onChange={e => updateComponentProps?.mutate({ [field.name]: e.target.checked })} />
                                    <span className="text-[11px]">{field.label}</span>
                                </div>;
                            }
                            if (field.type === 'text') {
                                return <div key={field.name} className="flex flex-col">
                                    {baseLabel}
                                    <textarea className="border rounded px-1 py-0.5 text-xs bg-gray-50 resize-y min-h-[60px]" defaultValue={val || ''} placeholder={field.placeholder}
                                        onBlur={e => updateComponentProps?.mutate({ [field.name]: e.target.value })} />
                                </div>;
                            }
                            if (field.type === 'number') {
                                return <div key={field.name} className="flex flex-col">
                                    {baseLabel}
                                    <input type="number" className="border rounded px-1 py-0.5 text-xs bg-gray-50" defaultValue={val ?? ''} placeholder={field.placeholder}
                                        onBlur={e => {
                                            const num = e.target.value === '' ? undefined : Number(e.target.value);
                                            updateComponentProps?.mutate({ [field.name]: num });
                                        }} />
                                </div>;
                            }
                            if (field.type === 'optionsArray') {
                                const options = Array.isArray(val) ? val : [];
                                return <div key={field.name} className="flex flex-col gap-1 border rounded p-2 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] uppercase tracking-wide text-gray-500">{field.label}</span>
                                        <button className="text-[10px] text-blue-600" onClick={() => {
                                            const next = [...options, { id: `opt${options.length + 1}`, label: `Opção ${options.length + 1}` }];
                                            updateComponentProps?.mutate({ [field.name]: next });
                                        }}>+ opção</button>
                                    </div>
                                    {options.length === 0 && <div className="text-[10px] text-gray-500">Nenhuma opção.</div>}
                                    <ul className="space-y-1">
                                        {options.map((o: any, i: number) => <li key={o.id} className="flex items-center gap-1">
                                            <input className="border rounded px-1 py-0.5 text-[10px] w-16" defaultValue={o.id} title="id" onBlur={e => {
                                                const next = [...options]; next[i] = { ...next[i], id: e.target.value };
                                                updateComponentProps?.mutate({ [field.name]: next });
                                            }} />
                                            <input className="border rounded px-1 py-0.5 text-[10px] flex-1" defaultValue={o.label} title="label" onBlur={e => {
                                                const next = [...options]; next[i] = { ...next[i], label: e.target.value };
                                                updateComponentProps?.mutate({ [field.name]: next });
                                            }} />
                                            <input className="border rounded px-1 py-0.5 text-[10px] w-14" defaultValue={o.points ?? ''} placeholder="pts" title="points" onBlur={e => {
                                                const next = [...options]; const v = e.target.value === '' ? undefined : Number(e.target.value); next[i] = { ...next[i], points: v };
                                                updateComponentProps?.mutate({ [field.name]: next });
                                            }} />
                                            <button className="text-[10px] text-red-600" onClick={() => {
                                                const next = options.filter((_: any, idx: number) => idx !== i);
                                                updateComponentProps?.mutate({ [field.name]: next });
                                            }}>✕</button>
                                        </li>)}
                                    </ul>
                                </div>;
                            }
                            if (field.type === 'json') {
                                return <div key={field.name} className="flex flex-col">
                                    {baseLabel}
                                    <textarea className="border rounded px-1 py-0.5 text-xs font-mono bg-gray-50 min-h-[100px]" defaultValue={JSON.stringify(val, null, 2)} onBlur={e => {
                                        try { const parsed = JSON.parse(e.target.value); updateComponentProps?.mutate({ [field.name]: parsed }); } catch { /* ignore */ }
                                    }} />
                                </div>;
                            }
                            // default string
                            return <div key={field.name} className="flex flex-col">
                                {baseLabel}
                                <input className="border rounded px-1 py-0.5 text-xs bg-gray-50" defaultValue={val || ''} placeholder={field.placeholder}
                                    onBlur={e => updateComponentProps?.mutate({ [field.name]: e.target.value })} />
                            </div>;
                        })}
                    </div>}
                    {!schema && <pre className="text-[10px] max-h-40 overflow-auto border rounded p-2 bg-gray-50">{JSON.stringify(props, null, 2)}</pre>}
                    <div className="text-[10px] text-gray-500">(Edição sem inline — schema dinâmico alfa)</div>
                    {updateComponentProps?.isPending && <div className="text-[10px] text-blue-600">Salvando...</div>}
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
    </div>;
};
