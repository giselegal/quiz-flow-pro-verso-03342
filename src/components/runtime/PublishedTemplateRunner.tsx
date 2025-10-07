import React, { useMemo } from 'react';
import { useTemplateRuntime } from '@/hooks/useTemplateRuntime';

interface Props { slug: string }

// Runner mínimo para validar integração com backend runtime.
// Futuro: mapear types de stage/component para renderizadores reais.
export const PublishedTemplateRunner: React.FC<Props> = ({ slug }) => {
    const { snapshot, loading, error, sessionId, currentStageId, score, outcome, branchedLast, answer, complete, restart } = useTemplateRuntime(slug);

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

    // Adapter simples para componentes publicados
    const renderComponent = (componentId: string) => {
        const cmp = snapshot.components[componentId];
        if (!cmp) return <div key={componentId} style={{ color: 'crimson' }}>Componente ausente: {componentId}</div>;
        switch (cmp.type) {
            case 'Heading':
                return <h2 key={cmp.id}>{cmp.props?.text || 'Título'}</h2>;
            case 'Paragraph':
                return <p key={cmp.id}>{cmp.props?.text || 'Parágrafo'}</p>;
            case 'OptionList':
                return (
                    <div key={cmp.id} style={{ border: '1px solid #ccc', padding: 8, borderRadius: 4 }}>
                        <strong>Opções (placeholder)</strong>
                        <ul style={{ margin: '4px 0 0 16px' }}>
                            {(cmp.props?.options || []).map((o: any, idx: number) => <li key={idx}>{o.label || o.id || 'Opção'}</li>)}
                        </ul>
                    </div>
                );
            default:
                return <div key={cmp.id} style={{ fontStyle: 'italic', opacity: 0.8 }}>[{cmp.type}]</div>;
        }
    };

    const stageComponents = currentStage?.componentIds.map(renderComponent);

    return (
        <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
            <h3>Template Runtime Runner (MVP)</h3>
            <p><strong>Slug:</strong> {slug}</p>
            <p><strong>Session:</strong> {sessionId}</p>
            <p><strong>Stage Atual:</strong> {currentStageId} ({currentStage?.type}) {branchedLast && <span style={{ background: '#ffe8a3', padding: '2px 6px', borderRadius: 4, marginLeft: 4 }}>branch</span>}</p>
            <p><strong>Score:</strong> {score}</p>
            {stageComponents && stageComponents.length > 0 && (
                <div style={{ margin: '12px 0' }}>
                    {stageComponents}
                </div>
            )}
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
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                {outcome && (
                    <button onClick={restart}>Reiniciar</button>
                )}
                {!outcome && (
                    <button onClick={restart} style={{ background: '#eee' }}>Reset Sessão</button>
                )}
            </div>
            <details style={{ marginTop: 16 }}>
                <summary>Debug Snapshot</summary>
                <pre style={{ maxHeight: 240, overflow: 'auto', fontSize: 12 }}>{JSON.stringify(snapshot, null, 2)}</pre>
            </details>
        </div>
    );
};
