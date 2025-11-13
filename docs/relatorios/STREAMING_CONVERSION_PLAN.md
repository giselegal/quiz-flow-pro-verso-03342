# Plano de Conversão Streaming Template → Funnel

Objetivo: Evoluir de conversão síncrona completa (carrega vários steps em paralelo) para pipeline incremental streaming que:
- Libera primeiro step em < 400ms
- Continua carregando passos seguintes em background
- Atualiza progress UI e métricas de conversão

Estado atual
- Hook `useEditorResource` chama `templateToFunnelAdapter.convertTemplateToFunnel({ loadAllSteps: false, specificSteps: ['step-01'] })` quando template completo → lazy load apenas step inicial.
- Adapter `TemplateToFunnelAdapter` suporta carregar todos steps via `Promise.allSettled`.
- Não existe interface para enviar blocos incrementalmente ao editor (retorna objeto funnel final somente ao término).

Objetivos técnicos
1. API streaming no adapter: emitir eventos conforme cada step é convertido.
2. Integrar com `useEditorResource` para criar funnel imediatamente e anexar steps conforme disponíveis.
3. Persistência incremental opcional (cache L1) para steps convertidos.
4. Barra de progresso (ex: stepsLoaded / totalSteps, tempo estimado restante).
5. Detecção de erros por step e tentativa de retry individual sem abortar pipeline.

Design da API proposta
```ts
interface TemplateStreamingOptions extends TemplateConversionOptions {
  onStep?: (payload: { stepId: string; blocks: Block[]; index: number; total: number; duration: number }) => void;
  onProgress?: (progress: { stepsLoaded: number; total: number; elapsed: number }) => void;
  onError?: (error: { stepId: string; reason: any }) => void;
  abortSignal?: AbortSignal;
}

interface TemplateStreamingResult {
  funnel: UnifiedFunnel; // criado com stages parciais
  metrics: { totalBlocks: number; stepsLoaded: number; duration: number; failedSteps: string[] };
}

async streamTemplateToFunnel(opts: TemplateStreamingOptions): Promise<TemplateStreamingResult>
```

Fluxo
1. Gerar funnel base vazio (metadata + settings padrão) → retorno imediato.
2. Iterar steps (sequencial ou batches pequenos p=2) para reduzir burst de CPU.
3. A cada step convertido:
   - Emitir `onStep`
   - Atualizar funnel.stages (push)
   - Calcular progresso e emitir `onProgress`
4. Em caso de falha de step:
   - Registrar em `failedSteps`
   - Emitir `onError`
   - Continuar pipeline (não abortar). Opcional: tentar retry 1 vez.
5. Ao finalizar, emitir métricas agregadas.

Alterações necessárias
- `TemplateToFunnelAdapter.ts`
  - Adicionar método `streamTemplateToFunnel` separado preservando `convertTemplateToFunnel`.
  - Reutilizar `loadStepBlocks(stepId)` com medição de tempo por step.
  - Remover `Promise.allSettled` para processo incremental (for await pattern).
- `useEditorResource.ts`
  - Novo modo: se `enableStreaming=true` em options, usar adapter.streaming.
  - Criar estado local `streamingProgress` e `failedSteps`.
  - Atualizar recurso após cada step via `setResource(prev => ({ ...prev, data: { ...prev.data, stages: [...prev.data.stages, newStage] } }))`.
  - Expor retorno adicional: `conversionProgress`, `failedSteps`, `isStreaming`.
- UI (futuro): Componente `StreamingConversionProgress` mostrando barra e etapas concluídas.

Edge Cases
- AbortSignal acionado (usuário cancela conversão): finalizar imediatamente e retornar funnel parcial.
- Template com steps faltando (>5 falhas): marcar funnel como `status: 'partial'`.
- Repetição de step ID (duplicado no serviço): ignorar segundo load e logar warning.
- Latência alta em um step: emitir progresso parcial mesmo sem novos steps (timer a cada 500ms usando elapsed).

Pseudo-código núcleo
```ts
async function streamTemplateToFunnel(opts: TemplateStreamingOptions) {
  const start = performance.now();
  const steps = resolveSteps(opts);
  const funnel: UnifiedFunnel = createBaseFunnel(opts.templateId, opts.customName);
  const failed: string[] = [];
  let totalBlocks = 0;

  for (let i = 0; i < steps.length; i++) {
    if (opts.abortSignal?.aborted) break;
    const stepId = steps[i];
    const stepStart = performance.now();
    try {
      const blocks = await loadStepBlocks(stepId);
      totalBlocks += blocks.length;
      const stage = buildStage(stepId, blocks, i);
      funnel.stages.push(stage);
      opts.onStep?.({ stepId, blocks, index: i, total: steps.length, duration: performance.now() - stepStart });
    } catch (error) {
      failed.push(stepId);
      opts.onError?.({ stepId, reason: error });
    }
    opts.onProgress?.({ stepsLoaded: funnel.stages.length, total: steps.length, elapsed: performance.now() - start });
  }

  return {
    funnel,
    metrics: {
      totalBlocks,
      stepsLoaded: funnel.stages.length,
      duration: performance.now() - start,
      failedSteps: failed,
    },
  };
}
```

Roadmap Incremental
- Fase 1: Implementar método streaming + hook `useEditorResource` com flag experimental.
- Fase 2: Adicionar UI de progresso (barra + lista de etapas) e cancelamento.
- Fase 3: Cache incremental (persistir steps convertidos em L1 e L2 após cada emissão para reuso).
- Fase 4: Retry adaptativo (backoff exponencial para steps com falha temporária).
- Fase 5: Telemetria (tempo por step, falhas, taxa de sucesso) em dashboard interno.

Critérios de Sucesso
- Primeiro stage pronto < 400ms em ambiente dev.
- Conversão completa 21 steps <= baseline atual + (máx +15%).
- Nenhuma quebra de editor ao receber funnel parcial.
- Retentativa de pelo menos 1 step falho funciona e não aborta pipeline.

Pendências para execução
- Definir shape de `UnifiedFunnel` definitivo (verificar se aceita stages dinâmicos sem recalcular metadata externa).
- Confirmar se serviços dependentes (ex: validação) suportam funnel parcial.

Pronto para implementação: SIM (dependências mapeadas).
