import React, { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import useDashboard from '../../hooks/useDashboard';

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold text-indigo-600 mt-1">{value}</div>
    </div>
  );
}

const EditorModularProDashboard: React.FC = () => {
  const {
    state,
    refreshAll,
    refreshMetrics,
    refreshParticipants,
    refreshRealTime,
    isLoading,
    hasErrors,
  } = useDashboard();

  useEffect(() => {
    // Carrega tudo ao montar para garantir dados reais
    refreshAll();
  }, []);

  const totalFunis = (state.metrics as any)?.overview?.totalFunnels ?? '-';
  const totalInteracoes = (state.metrics as any)?.overview?.totalInteractions ?? '-';
  const participantesTotal = state.participants?.total ?? '-';
  const errosRealtime = (state.realTimeMetrics as any)?.errors?.count ?? 0;
  const sessoesAtivas = (state.realTimeMetrics as any)?.activeSessions ?? '-';

  return (
    <div className="p-6 space-y-6" data-testid="editor-modular-pro-dashboard">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Editor Modular Pro — Métricas Reais</h1>
          <p className="text-gray-600 mt-1">
            Visão consolidada do editor em produção com funis e estatísticas em tempo real.
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={() => refreshAll()}
        >
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
      </div>

      {/* Rotas relevantes do editor modular */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h2 className="text-lg font-semibold mb-2">Rotas Atuais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Link className="text-indigo-700 hover:underline" to="/editor/quiz-estilo-modular-pro">
            /editor/quiz-estilo-modular-pro
          </Link>
          <Link className="text-indigo-700 hover:underline" to="/modular-editor">
            /modular-editor
          </Link>
          <Link className="text-indigo-700 hover:underline" to="/editor-modular/quiz21StepsComplete">
            /editor-modular/:funnelId?
          </Link>
          <Link className="text-indigo-700 hover:underline" to="/editor?template=quiz21StepsComplete">
            /editor?template=quiz21StepsComplete
          </Link>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total de Funis" value={totalFunis} />
        <StatCard label="Interações" value={totalInteracoes} />
        <StatCard label="Participantes" value={participantesTotal} />
        <StatCard label="Erros (Tempo Real)" value={errosRealtime} />
      </div>

      {/* Estado de carregamento/erro */}
      {(((isLoading as any)?.metrics) || ((isLoading as any)?.participants) || ((isLoading as any)?.realTime) || (typeof isLoading === 'boolean' && isLoading)) && (
        <div className="flex items-center gap-2 text-gray-600">
          <RefreshCw className="w-4 h-4 animate-spin" /> Carregando dados...
        </div>
      )}
      {(((hasErrors as any)?.metrics) || ((hasErrors as any)?.participants) || ((hasErrors as any)?.realTime) || (typeof hasErrors === 'boolean' && hasErrors)) && (
        <div className="text-red-600">Erro ao carregar algumas métricas. Tente atualizar.</div>
      )}

      {/* Painéis detalhados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Métricas agregadas</h3>
            <button className="text-sm text-indigo-700" onClick={() => refreshMetrics()}>Atualizar métricas</button>
          </div>
          <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-64">
            {JSON.stringify(state.metrics, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Participantes</h3>
            <button className="text-sm text-indigo-700" onClick={() => refreshParticipants()}>Atualizar participantes</button>
          </div>
          <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-64">
            {JSON.stringify(state.participants, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-200 lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Tempo Real</h3>
            <button className="text-sm text-indigo-700" onClick={() => refreshRealTime()}>Atualizar tempo real</button>
          </div>
          <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-64">
            {JSON.stringify(state.realTimeMetrics, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default EditorModularProDashboard;