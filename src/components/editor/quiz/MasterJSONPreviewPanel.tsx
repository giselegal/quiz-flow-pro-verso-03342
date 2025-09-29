import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { dynamicMasterJSON } from '@/services/DynamicMasterJSONGenerator';
import { quizEditingService } from '@/domain/quiz/QuizEditingService';

interface DiffResult {
  changedSteps: string[];
  stepTitleChanges: Array<{ stepId: string; before: string; after: string }>;
  addedSteps: string[];
  removedSteps: string[];
  hashBefore?: string;
  hashAfter?: string;
}

const pretty = (obj: any) => JSON.stringify(obj, null, 2);

function computeDiff(prev: any | null, next: any | null): DiffResult {
  if (!prev || !next) {
    return { changedSteps: [], stepTitleChanges: [], addedSteps: [], removedSteps: [], hashBefore: prev?.metadata?.id, hashAfter: next?.metadata?.id };
  }
  const prevSteps = prev.steps || {};
  const nextSteps = next.steps || {};
  const prevIds = Object.keys(prevSteps);
  const nextIds = Object.keys(nextSteps);
  const addedSteps = nextIds.filter(id => !prevIds.includes(id));
  const removedSteps = prevIds.filter(id => !nextIds.includes(id));
  const stepTitleChanges: Array<{ stepId: string; before: string; after: string }> = [];
  const changedSteps: string[] = [];
  for (const id of nextIds) {
    if (!prevSteps[id]) continue;
    const beforeTitle = prevSteps[id].metadata?.name;
    const afterTitle = nextSteps[id].metadata?.name;
    if (beforeTitle !== afterTitle) {
      stepTitleChanges.push({ stepId: id, before: beforeTitle, after: afterTitle });
      changedSteps.push(id);
    }
  }
  return { changedSteps, stepTitleChanges, addedSteps, removedSteps, hashBefore: prev.metadata?.generatedAt, hashAfter: next.metadata?.generatedAt };
}

const MasterJSONPreviewPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastJSON, setLastJSON] = useState<any | null>(null);
  const [currentJSON, setCurrentJSON] = useState<any | null>(null);
  const [headlessJSON, setHeadlessJSON] = useState<any | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [headlessMode, setHeadlessMode] = useState(false);

  const diff = useMemo(() => computeDiff(lastJSON, currentJSON), [lastJSON, currentJSON]);

  const generate = useCallback(async (opts: { headless?: boolean } = {}) => {
    setLoading(true); setError(null);
    try {
      // invalidar cache para refletir overrides atuais
      dynamicMasterJSON.invalidateCache();
      if (opts.headless) {
        // forçar headless temporário criando cópia de função env (não mudamos process.env real no browser)
        (window as any).__QUIZ_HEADLESS_PREVIEW = true; // marcador debug
      }
      const json = await dynamicMasterJSON.generateMasterJSON();
      if (opts.headless) {
        setHeadlessJSON(json);
      } else {
        setLastJSON(currentJSON);
        setCurrentJSON(json);
      }
    } catch (e: any) {
      console.error('Preview master JSON error', e);
      setError(e?.message || 'Erro ao gerar JSON');
    } finally {
      setLoading(false);
    }
  }, [currentJSON]);

  // Atualizar preview automaticamente quando hash mudar (auto auditoria rápida)
  useEffect(() => {
    const unsub = quizEditingService.subscribe(() => {
      // Não regenerar se usuário ainda não abriu o painel (currentJSON null) para evitar custo
      if (currentJSON) {
        generate();
      }
    });
    return unsub;
  }, [currentJSON, generate]);

  const headlessDiff = useMemo(() => {
    if (!currentJSON || !headlessJSON) return null;
    return computeDiff(currentJSON, headlessJSON);
  }, [currentJSON, headlessJSON]);

  return (
    <div className="p-3 space-y-3 text-xs">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-sm">Master JSON Preview & Diff</h3>
        <div className="flex items-center gap-2">
          <button disabled={loading} onClick={() => generate()} className="px-2 py-1 border rounded bg-background hover:bg-muted">{loading ? 'Gerando...' : 'Gerar'}</button>
          <button disabled={loading} onClick={() => generate({ headless: true })} className="px-2 py-1 border rounded bg-background hover:bg-muted">Headless</button>
          <button onClick={() => setShowRaw(r => !r)} className="px-2 py-1 border rounded bg-background hover:bg-muted">{showRaw ? 'Resumo' : 'Raw'}</button>
        </div>
      </div>
      <p className="text-muted-foreground leading-relaxed">Gera o Master JSON dinâmico atual (aplicando overrides). Mostra diffs de títulos de steps e permite comparar com versão headless mínima.</p>
      {error && <div className="text-red-500">{error}</div>}
      {!currentJSON && !loading && (
        <div className="text-muted-foreground">Nenhuma geração ainda. Clique em "Gerar".</div>
      )}
      {currentJSON && (
        <div className="space-y-4">
          <div className="border rounded p-2 bg-muted/30">
            <div className="font-medium mb-1">Diff vs geração anterior</div>
            {diff.changedSteps.length === 0 && diff.addedSteps.length === 0 && diff.removedSteps.length === 0 && (
              <div className="text-muted-foreground">Sem mudanças detectadas em títulos de steps.</div>
            )}
            {diff.stepTitleChanges.length > 0 && (
              <ul className="list-disc ml-4 space-y-1">
                {diff.stepTitleChanges.map(c => (
                  <li key={c.stepId}><span className="text-purple-400">{c.stepId}</span>: "{c.before}" → <span className="text-green-500">"{c.after}"</span></li>
                ))}
              </ul>
            )}
            {(diff.addedSteps.length > 0 || diff.removedSteps.length > 0) && (
              <div className="mt-2 space-y-1">
                {diff.addedSteps.length > 0 && <div>Adicionados: {diff.addedSteps.join(', ')}</div>}
                {diff.removedSteps.length > 0 && <div>Removidos: {diff.removedSteps.join(', ')}</div>}
              </div>
            )}
          </div>

          {headlessJSON && (
            <div className="border rounded p-2 bg-muted/30">
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium">Comparação Headless</div>
                <button className="text-[10px] underline" onClick={() => setHeadlessJSON(null)}>Limpar</button>
              </div>
              {!headlessDiff && <div className="text-muted-foreground">Gere a versão headless para comparar.</div>}
              {headlessDiff && (
                <div className="space-y-1">
                  <div>Steps headless: {Object.keys(headlessJSON.steps || {}).length}</div>
                  <div className="text-muted-foreground">Diferenças de título (headless vs atual):</div>
                  {headlessDiff.stepTitleChanges.length === 0 && <div className="text-muted-foreground">Nenhuma.</div>}
                  {headlessDiff.stepTitleChanges.length > 0 && (
                    <ul className="list-disc ml-4 space-y-1">
                      {headlessDiff.stepTitleChanges.map(c => (
                        <li key={c.stepId}>{c.stepId}: "{c.before}" → <span className="text-green-500">"{c.after}"</span></li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {showRaw && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-auto">
              <div className="border rounded bg-black/40 p-2 overflow-auto">
                <div className="font-medium mb-1">Atual</div>
                <pre className="text-[10px] whitespace-pre-wrap leading-snug">{pretty(currentJSON)}</pre>
              </div>
              {headlessJSON && (
                <div className="border rounded bg-black/40 p-2 overflow-auto">
                  <div className="font-medium mb-1">Headless</div>
                  <pre className="text-[10px] whitespace-pre-wrap leading-snug">{pretty(headlessJSON)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MasterJSONPreviewPanel;
