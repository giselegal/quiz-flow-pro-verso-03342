import React from 'react';
import { useLegacyQuizDraft, useApplyLegacyDelta } from '../api/legacyAdapter';
import { useState } from 'react';

export const LegacyTemplateViewer: React.FC<{ slug: string; onBack: () => void }> = ({ slug, onBack }) => {
    const { data, isLoading, error } = useLegacyQuizDraft(slug);
    const applyDelta = useApplyLegacyDelta();
    const [editName, setEditName] = useState<string>('');
    const [editDesc, setEditDesc] = useState<string>('');
    const [reorderIds, setReorderIds] = useState<string[]>([]); // stage ids na ordem que o usuário montar

    React.useEffect(() => {
        if (data) {
            setEditName(data.meta.name || '');
            setEditDesc(data.meta.description || '');
            const ordered = [...data.stages].sort((a, b) => a.order - b.order).map(s => s.id);
            setReorderIds(ordered);
        }
    }, [data?.id]);

    function moveStage(index: number, dir: -1 | 1) {
        setReorderIds(prev => {
            const next = [...prev];
            const target = index + dir;
            if (target < 0 || target >= next.length) return prev;
            const tmp = next[index];
            next[index] = next[target];
            next[target] = tmp;
            return next;
        });
    }

    function submitMeta() {
        applyDelta.mutate({ slug, meta: { name: editName, description: editDesc } });
    }

    function submitReorder() {
        applyDelta.mutate({ slug, stagesReorder: reorderIds });
    }

    return <div className="space-y-4">
        <div className="flex items-center gap-2">
            <button onClick={onBack} className="text-sm text-blue-600 hover:underline">← Voltar</button>
            <h1 className="text-xl font-semibold">Legacy Quiz-Style (Read-Only)</h1>
            <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded border border-amber-300">ADAPTER</span>
            <span className="ml-auto text-xs text-gray-500">slug: {slug}</span>
        </div>
        {isLoading && <div>Carregando legacy draft...</div>}
        {error && <div className="text-red-600 text-sm">Erro: {(error as Error).message}</div>}
        {data && <div className="space-y-6">
            <section className="space-y-2">
                <h2 className="font-medium flex items-center gap-2">Metadados <span className="text-xs font-normal text-gray-500">(adapter)</span></h2>
                <div className="grid md:grid-cols-4 gap-4 text-sm items-end">
                    <div className="flex flex-col">
                        <label className="text-xs">Nome</label>
                        <input className="border rounded px-2 py-1" value={editName} onChange={e => setEditName(e.target.value)} />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs">Slug (fixo)</label>
                        <input className="border rounded px-2 py-1 bg-gray-100" value={data.meta.slug} disabled />
                    </div>
                    <div className="flex flex-col col-span-2">
                        <label className="text-xs">Descrição</label>
                        <input className="border rounded px-2 py-1" value={editDesc} onChange={e => setEditDesc(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2 col-span-4">
                        <button onClick={submitMeta} disabled={applyDelta.isPending} className="bg-emerald-600 text-white px-3 py-1 rounded text-xs disabled:opacity-50">Salvar Meta</button>
                        {applyDelta.isSuccess && <span className="text-xs text-green-700">Salvo</span>}
                        {applyDelta.error && <span className="text-xs text-red-600">Erro</span>}
                    </div>
                </div>
            </section>
            <section className="space-y-2">
                <h2 className="font-medium flex items-center gap-2">Stages ({data.stages.length}) <span className="text-xs text-gray-500">(reorder adapter)</span></h2>
                <div className="text-xs text-gray-500">Use os botões ↑ ↓ para ajustar a ordem e depois clique em Salvar Reorder.</div>
                <ul className="divide-y border rounded bg-white text-sm">
                    {reorderIds.map((stageId, idx) => {
                        const st = data.stages.find(s => s.id === stageId)!;
                        const cmp = st.componentIds.map(cid => data.components[cid]);
                        return <li key={stageId} className="p-2 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs bg-gray-100 px-1 rounded">{idx}</span>
                                <span className="font-semibold">{st.type}</span>
                                <span className="text-gray-400 text-xs">{st.id}</span>
                                <div className="ml-auto flex gap-1">
                                    <button onClick={() => moveStage(idx, -1)} disabled={idx === 0} className="text-xs px-2 py-0.5 border rounded disabled:opacity-40">↑</button>
                                    <button onClick={() => moveStage(idx, 1)} disabled={idx === reorderIds.length - 1} className="text-xs px-2 py-0.5 border rounded disabled:opacity-40">↓</button>
                                </div>
                            </div>
                            <div className="ml-6 text-xs text-gray-600">Componentes: {cmp.length}</div>
                            {cmp.map(c => <details key={c.id} className="ml-6">
                                <summary className="cursor-pointer text-xs text-blue-700">{c.type} ({c.id})</summary>
                                <pre className="text-[10px] bg-gray-50 p-2 overflow-auto rounded max-h-64">{JSON.stringify(c.props, null, 2)}</pre>
                            </details>)}
                        </li>;
                    })}
                </ul>
                <button onClick={submitReorder} disabled={applyDelta.isPending} className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-xs disabled:opacity-50">Salvar Reorder</button>
            </section>
            <section className="space-y-2">
                <h2 className="font-medium">Outcomes</h2>
                <pre className="text-[11px] bg-gray-50 p-2 rounded overflow-x-auto">{JSON.stringify(data.outcomes, null, 2)}</pre>
            </section>
            <section className="space-y-2">
                <h2 className="font-medium">Scoring (simplificado)</h2>
                <pre className="text-[11px] bg-gray-50 p-2 rounded overflow-x-auto">{JSON.stringify(data.logic.scoring, null, 2)}</pre>
                <p className="text-xs text-gray-500">Nível 1: pesos não calculados; será preenchido em fase futura.</p>
            </section>
            <section className="space-y-2">
                <h2 className="font-medium">Status</h2>
                <div className="text-xs text-gray-600">Read-only adapter – nenhuma ação de edição habilitada.</div>
            </section>
        </div>}
    </div>;
};
