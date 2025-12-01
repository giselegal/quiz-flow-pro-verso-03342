import React, { useEffect, useState } from 'react';

type SavedItem = { name: string; path: string };

export default function SavedSnapshotsPanel() {
    const [items, setItems] = useState<SavedItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingSnapshot, setLoadingSnapshot] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            // ✅ TODO: Implementar API /api/quiz/saved quando backend estiver pronto
            // Por enquanto, retornar lista vazia para evitar erro 404
            console.warn('SavedSnapshotsPanel: API /api/quiz/saved não implementada ainda');
            setItems([]);
        } catch (e: any) {
            setError(String(e?.message || e));
        } finally {
            setLoading(false);
        }
    };

    const loadSnapshot = async (filePath: string) => {
        setLoadingSnapshot(filePath);
        setError(null);
        try {
            const res = await fetch(filePath);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const snapshot = await res.json();

            // Importar para o editor via store
            const { useQuizStore } = await import('../store/quizStore');
            const setQuiz = useQuizStore.getState().setQuiz;
            if (snapshot.quiz) {
                setQuiz(snapshot.quiz);
            }
        } catch (e: any) {
            setError(`Erro ao carregar: ${String(e?.message || e)}`);
        } finally {
            setLoadingSnapshot(null);
        }
    }; useEffect(() => {
        load();
        const id = setInterval(load, 5000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="bg-white border border-gray-200 rounded p-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800">Snapshots salvos</h3>
                <button className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded" onClick={load} disabled={loading}>
                    {loading ? 'Carregando...' : 'Atualizar'}
                </button>
            </div>
            {error && <p className="text-xs text-red-600 mt-2">Erro: {error}</p>}
            <ul className="mt-2 space-y-1 max-h-48 overflow-auto">
                {items.length === 0 && !loading && (
                    <li className="text-xs text-gray-500">Nenhum snapshot encontrado</li>
                )}
                {items.map((it) => (
                    <li key={it.name} className="flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-700 truncate flex-1" title={it.name}>{it.name}</span>
                        <div className="flex items-center gap-1">
                            <button
                                className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded disabled:opacity-50"
                                onClick={() => loadSnapshot(it.path)}
                                disabled={loadingSnapshot !== null}
                                title="Carregar este snapshot no editor"
                            >
                                {loadingSnapshot === it.path ? '...' : 'Carregar'}
                            </button>
                            <button
                                className="text-xs px-1 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                                onClick={() => navigator.clipboard?.writeText(it.path)}
                                title="Copiar caminho do arquivo"
                            >
                                📋
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
