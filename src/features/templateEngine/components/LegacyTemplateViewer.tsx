import React from 'react';
import { useLegacyQuizDraft } from '../api/legacyAdapter';

export const LegacyTemplateViewer: React.FC<{ slug: string; onBack: () => void }> = ({ slug, onBack }) => {
    const { data, isLoading, error } = useLegacyQuizDraft(slug);

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
                <h2 className="font-medium flex items-center gap-2">Metadados <span className="text-xs font-normal text-gray-500">(gerado)</span></h2>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div><div className="text-xs text-gray-500">Nome</div><div>{data.meta.name}</div></div>
                    <div><div className="text-xs text-gray-500">Slug</div><div>{data.meta.slug}</div></div>
                    <div><div className="text-xs text-gray-500">Tags</div><div>{data.meta.tags?.join(', ')}</div></div>
                </div>
                <p className="text-xs text-gray-600">Descrição: {data.meta.description}</p>
            </section>
            <section className="space-y-2">
                <h2 className="font-medium">Stages ({data.stages.length})</h2>
                <ul className="divide-y border rounded bg-white text-sm">
                    {[...data.stages].sort((a, b) => a.order - b.order).map(st => {
                        const cmp = st.componentIds.map(cid => data.components[cid]);
                        return <li key={st.id} className="p-2 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs bg-gray-100 px-1 rounded">{st.order}</span>
                                <span className="font-semibold">{st.type}</span>
                                <span className="text-gray-400 text-xs">{st.id}</span>
                            </div>
                            <div className="ml-6 text-xs text-gray-600">Componentes: {cmp.length}</div>
                            {cmp.map(c => <details key={c.id} className="ml-6">
                                <summary className="cursor-pointer text-xs text-blue-700">{c.type} ({c.id})</summary>
                                <pre className="text-[10px] bg-gray-50 p-2 overflow-auto rounded max-h-64">{JSON.stringify(c.props, null, 2)}</pre>
                            </details>)}
                        </li>;
                    })}
                </ul>
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
