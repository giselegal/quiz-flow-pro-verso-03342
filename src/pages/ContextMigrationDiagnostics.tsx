import React, { useMemo, useState } from 'react';
import { FunnelContext, listContextualStorageKeys } from '@/core/contexts/FunnelContext';

const ContextMigrationDiagnostics: React.FC = () => {
    const [context, setContext] = useState<FunnelContext>(FunnelContext.EDITOR);
    const keys = useMemo(() => listContextualStorageKeys(context), [context]);

    return (
        <div className="p-4">
            <h1 className="text-lg font-semibold mb-2">Context Migration Diagnostics</h1>
            <label className="text-sm mr-2">Contexto:</label>
            <select
                value={context}
                onChange={(e) => setContext(e.target.value as FunnelContext)}
                className="border px-2 py-1 rounded text-sm"
            >
                {Object.values(FunnelContext).map((c) => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>

            <div className="mt-4">
                <h2 className="text-sm font-medium">Chaves no localStorage (prefixadas):</h2>
                <ul className="mt-2 text-xs space-y-1">
                    {keys.length === 0 && <li className="text-gray-500">Nenhuma chave encontrada.</li>}
                    {keys.map((k) => (
                        <li key={k} className="font-mono break-all">{k}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ContextMigrationDiagnostics;
