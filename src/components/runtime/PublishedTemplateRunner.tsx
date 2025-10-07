import React, { useMemo } from 'react';
import { useTemplateRuntime } from '@/hooks/useTemplateRuntime';

interface Props { slug: string }

// Runner mínimo para validar integração com backend runtime.
// Futuro: mapear types de stage/component para renderizadores reais.
export const PublishedTemplateRunner: React.FC<Props> = ({ slug }) => {
  const { snapshot, loading, error, sessionId, currentStageId, score, outcome, branchedLast, answer, complete } = useTemplateRuntime(slug);

  const currentStage = useMemo(() => snapshot?.stages.find(s => s.id === currentStageId), [snapshot, currentStageId]);

  if (loading && !snapshot) return <div>Carregando template publicado...</div>;
  if (error) return <div style={{ color: 'red' }}>Erro: {error}</div>;
  if (!snapshot) return <div>Nenhum snapshot.</div>;

  const isResult = currentStage?.type === 'result' || !!outcome;

  const handleAdvance = async () => {
    if (!currentStage) return;
    if (isResult && !outcome) {
      await complete();
      return;
    }
    // Placeholder: envia respostas vazias (ou simuladas) pois ainda não temos UI de inputs ligada
    await answer(currentStage.id, []);
  };

  return (
    <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
      <h3>Template Runtime Runner (MVP)</h3>
      <p><strong>Slug:</strong> {slug}</p>
      <p><strong>Session:</strong> {sessionId}</p>
      <p><strong>Stage Atual:</strong> {currentStageId} ({currentStage?.type}) {branchedLast && <em>(branched)</em>}</p>
      <p><strong>Score:</strong> {score}</p>
      {outcome && (
        <div style={{ marginTop: 12 }}>
          <h4>Outcome</h4>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{outcome.template}</pre>
        </div>
      )}
      {!outcome && (
        <button onClick={handleAdvance} style={{ marginTop: 12 }}>
          {isResult ? 'Finalizar' : 'Avançar'}
        </button>
      )}
      {outcome && (
        <button onClick={() => window.location.reload()} style={{ marginTop: 12 }}>Reiniciar (reload)</button>
      )}
      <details style={{ marginTop: 16 }}>
        <summary>Debug Snapshot</summary>
        <pre style={{ maxHeight: 240, overflow: 'auto', fontSize: 12 }}>{JSON.stringify(snapshot, null, 2)}</pre>
      </details>
    </div>
  );
};
