import React, { useState } from 'react';
import { runStyleFunnelAgent } from '@/agent/styleFunnelAgent';
import { useUnifiedQuizState } from '@/hooks/useUnifiedQuizState';

const AgentStyleFunnelTestPage: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<any | null>(null);
  const { data } = useUnifiedQuizState();

  const runAgent = async (target: string) => {
    setRunning(true);
    setLog(null);
    try {
      const res = await runStyleFunnelAgent({ userName: 'Teste Agente', targetStyle: target as any, multiPerQuestion: 2 });
      setLog(res);
    } catch (e) {
      setLog({ error: String(e) });
    } finally {
      setRunning(false);
    }
  };

  const styles = ['natural','classico','contemporaneo','elegante','romantico','sexy','dramatico','criativo'];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Agent Test: Funil de Estilo</h1>
      <p className="text-sm text-gray-600 mb-4">Gera respostas automaticamente (q1..q10) e calcula o resultado pelo pipeline atual.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {styles.map(s => (
          <button
            key={s}
            disabled={running}
            onClick={() => runAgent(s)}
            className="px-3 py-2 bg-amber-600 text-white rounded disabled:opacity-60"
          >
            Rodar agente: {s}
          </button>
        ))}
      </div>

      {running && <div className="text-blue-600">Executando agente...</div>}
      {log && (
        <pre className="text-xs bg-neutral-100 p-3 rounded overflow-auto max-h-96">{JSON.stringify(log, null, 2)}</pre>
      )}

      <div className="mt-6">
        <h2 className="font-semibold mb-2">Snapshot unificado</h2>
        <pre className="text-xs bg-neutral-100 p-3 rounded overflow-auto max-h-96">{JSON.stringify({
          selections: Object.keys(data.selections).length,
          formData: data.formData,
          result: data.result?.primaryStyle,
        }, null, 2)}</pre>
      </div>
    </div>
  );
};

export default AgentStyleFunnelTestPage;
