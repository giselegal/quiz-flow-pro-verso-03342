import React, { useState } from 'react';
import { useTemplateDraft, useUpdateMeta, useAddStage, useReorderStages, usePublish, useValidateDraft } from '../api/hooks';

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
                {[...draft.stages].sort((a, b) => a.order - b.order).map((s, idx) => <li key={s.id} className="p-2 flex items-center gap-2 text-sm">
                    <span className="font-mono text-xs bg-gray-100 px-1 rounded">{s.order}</span>
                    <span>{s.type}</span>
                    <span className="text-gray-500">{s.id}</span>
                    <button disabled={idx === 0} onClick={() => handleReorderUp(idx)} className="ml-auto text-xs text-blue-600 disabled:opacity-40">Subir</button>
                </li>)}
            </ul>
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
