import React, { useEffect, useMemo, useState } from 'react';
import { CanonicalServicesMonitor } from '@/services/canonical/monitoring';

type Stats = ReturnType<typeof CanonicalServicesMonitor.getStats>;

const CanonicalAdoptionDashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats>(() => CanonicalServicesMonitor.getStats());

    useEffect(() => {
        setStats(CanonicalServicesMonitor.getStats());
        const id = setInterval(() => {
            setStats(CanonicalServicesMonitor.getStats());
        }, 2000);
        return () => clearInterval(id);
    }, []);

    const legend = useMemo(() => (
        [
            { label: 'Chamadas Canônicas', value: stats.totalCanonical, color: 'text-green-600' },
            { label: 'Chamadas Legacy (bridge)', value: stats.totalLegacy, color: 'text-amber-600' },
            { label: 'Adoção (%)', value: `${stats.adoptionRate  }%`, color: 'text-blue-600' },
        ]
    ), [stats]);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-semibold mb-2">Adoção da Camada Canônica</h1>
            <p className="text-sm text-gray-500 mb-6">Métricas simples coletadas via CanonicalServicesMonitor</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {legend.map((item) => (
                    <div key={item.label} className="rounded-lg border p-4 bg-white">
                        <div className="text-sm text-gray-500">{item.label}</div>
                        <div className={`text-3xl font-bold ${item.color}`}>{item.value}</div>
                    </div>
                ))}
            </div>

            <div className="rounded-lg border bg-white overflow-hidden">
                <div className="px-4 py-3 border-b font-medium">Eventos Recentes</div>
                <div className="max-h-[420px] overflow-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="text-left px-4 py-2">Quando</th>
                                <th className="text-left px-4 py-2">Serviço</th>
                                <th className="text-left px-4 py-2">Método</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recent.length === 0 && (
                                <tr>
                                    <td className="px-4 py-3 text-gray-500" colSpan={3}>Sem eventos ainda. Use o app para acionar chamadas.</td>
                                </tr>
                            )}
                            {stats.recent.slice().reverse().map((e, idx) => {
                                const d = new Date(e.at);
                                return (
                                    <tr key={idx} className="even:bg-gray-50">
                                        <td className="px-4 py-2 text-gray-700">{d.toLocaleTimeString()}</td>
                                        <td className="px-4 py-2 font-mono">{e.service}</td>
                                        <td className="px-4 py-2 font-mono">{e.method}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-6 text-xs text-gray-500">
                Dica: O monitor também publica um snapshot em <code>window.__canonicalMonitor</code> no browser para inspeção via DevTools.
            </div>
        </div>
    );
};

export default CanonicalAdoptionDashboard;
