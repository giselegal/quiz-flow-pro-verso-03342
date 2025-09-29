# Critérios de Aceite & KPIs do Sistema de Quiz Unificado

> Objetivo macro: Garantir fonte única, edição 100%, performance adequada, integridade e confiabilidade de publicação.

## 1. Escopo dos Critérios

| Dimensão | O que mede | Por que importa |
|----------|------------|-----------------|
| Performance Carregamento | Tempo para primeira pergunta | Reduz abandono inicial |
| Navegação / Engajamento | Progresso completo vs iniciado | Conversão interna do funil |
| Qualidade de Dados | Divergência entre canonical e projeções | Previne inconsistências lógicas |
| Integridade | Hash e validação schema | Garante confiabilidade do runtime |
| Edição | % de campos editáveis / sucesso de validação | Alinha promessa de "100% editável" |
| Publicação | Sucesso na promoção de versão | Evita versões quebradas em produção |
| Oferta | Exibição e click-through da oferta final | Métrica de monetização/valor |
| Confiabilidade | Falhas ao salvar / snapshot / rollback | Saúde operacional |

## 2. KPIs Detalhados

### 2.1 Performance
- TTFQ (Time To First Question): diferença entre `performance.now()` no load e emissão do evento `quiz.step.viewed` do primeiro step "question".
  - Target: < 2000 ms (desktop), < 2500 ms (mobile)
  - Alert: ≥ 2200 ms desktop / ≥ 2700 ms mobile (3 execuções p95)
  - Breach: ≥ 3000 ms p95
- JSON Load + Validate Time: tempo entre início do fetch (ou import) e final da validação Zod.
  - Target: < 120 ms (cold) / < 15 ms (cached em memória)

### 2.2 Engajamento / Navegação
- Completion Rate: `(# sessões com quiz.result.computed) / (# sessões com quiz.step.viewed step-1)`
  - Target: ≥ 70%
- Drop-off por Step: distribuição de abandono (último `quiz.step.viewed` sem resultado).
  - Intervenção se qualquer step tiver abandono > 15% isolado.

### 2.3 Qualidade de Dados / Paridade
- Divergência Estrutural: script `quiz:compare` retornando 0 errors / 0 warnings.
  - Breach: qualquer divergência != 0.
- Contagem de Steps: `canonical.steps.length === countedStepIds.length + (não-contados)` garantindo nenhum step "órfão".

### 2.4 Integridade
- Hash Integrity Stable: hash calculado na carga = hash armazenado na definição (após normalização de placeholder).
  - Target: 100% das cargas.
- Validation Success Rate: `1 - (# falhas validação schema / tentativas de load)`
  - Target: 100%; Breach: < 99.5%.

### 2.5 Edição
- Edit Coverage: % dos atributos de steps editáveis via UI (intro, question, strategic, transition, result, offer).
  - Target: 100% campos previstos (exceção: IDs imutáveis por design).
- Validation Error Rate (pré-publicação): `(# erros bloqueantes / tentativas de publish)`
  - Target: ≤ 1%.
- Draft Save Latency: p95 do tempo entre clique em salvar e confirmação (inclui validação + snapshot local).
  - Target: < 300 ms p95; Alert: 400 ms; Breach: 500 ms.

### 2.6 Publicação / Versionamento
- Snapshot Creation Success: ≥ 99.9% (erros fatais = breach imediata).
- Publish Lead Time: Tempo entre última modificação e publicação (meta opcional de fluxo interno) <= 10 min p50.
- Rollback Time: Execução de rollback ≤ 5 s (local / ambiente dev) – prepara para produção.

### 2.7 Oferta
- Offer Visibility Rate: `quiz.offer.shown / quiz.result.computed` Target 100% (salvo feature gating).
- Offer CTR (Click Through Rate) (futuro se rastrear cliques): Target inicial ≥ 15%.

### 2.8 Confiabilidade Operacional
- Save Failure Rate (edição): < 0.5%.
- Event Bus Handler Error Rate: < 0.1% (logado por console/error boundary).
- Memory Footprint (quiz definition + runtime structures): < 500KB em JSON + overhead (monitoramento manual inicial).

## 3. Eventos Necessários para Instrumentação

| Evento | Campos | KPI que alimenta |
|--------|--------|------------------|
| quiz.step.viewed | stepId, ts | TTFQ, Drop-off |
| quiz.step.answered | stepId, answers[], ts | Engajamento detalhado, Scoring feed (opcional) |
| quiz.progress.updated | current, total, ts | Completion progress tracking |
| quiz.result.computed | dominantStyle, scores{}, ts | Completion rate, scoring analytics |
| quiz.offer.shown | matchValue, ts | Offer visibility |
| quiz.definition.reload | hash, ts | Integridade dinâmica |
| editor.step.modified | stepId, field, ts | Edit coverage, churn |
| version.snapshot.created | snapshotId, ts | Version throughput |
| version.published | version, ts | Publish success tracking |

## 4. Fontes de Dados
- InMemory Event Bus ⇒ multiplex para:
  - AnalyticsSink (buffer → batch flush / console no dev)
  - DebugConsoleSink (dev)
  - Future: RemoteUploadSink (HTTP / Beacon)

## 5. Fórmulas & Cálculo (Pseudo)

```ts
const ttfq = firstQuestionViewedTs - pageLoadTs;
const completionRate = totalResults / totalStarts;
const dropOffRate = (abandonosNoStepX / totalStarts);
const draftLatency = endSaveHighResTs - startSaveHighResTs;
const validationErrorRate = blockingErrors / publishAttempts;
```

## 6. Alertas & Observabilidade
- Log warnings quando TTFQ > Alert threshold (color code no console ou panel interno).
- Registrar diff de versões (added/removed/modified) sempre que publicar.
- Falha de validação antes do publish ⇒ evento `version.publish.blocked` (pode ser adicionado se necessário).

## 7. Pipeline de Verificação (Checklist CI Futuro)
1. `npm run quiz:compare` (paridade) – must pass.
2. Type-check (`npm run type-check`) – zero erros.
3. Testes unitários de scoring / offer.
4. Script de smoke (ex: step1 → step20) confirmando fluxo.
5. (Futuro) Teste sintético de TTFQ em ambiente headless.

## 8. Roadmap de Instrumentação
| Fase | Ação | Resultado |
|------|------|-----------|
| F1 | Emitir eventos core (viewed, answered, result, offer) | Base KPIs principal |
| F2 | Adicionar progress.updated + editor.step.modified | Métricas de edição e funil parcialmente preenchido |
| F3 | Version events (snapshot/published) | Ciclo completo versionamento |
| F4 | Conectar AnalyticsSink persistente | Histórico e dashboards |
| F5 | Threshold alert layer | Observabilidade pró-ativa |

## 9. Aceite Final (Go/No-Go)
| Critério | Condição Go |
|----------|-------------|
| Fonte única | Script paridade = 0 divergências |
| TTFQ | p95 < 2s desktop corpus amostra |
| Completion Rate | ≥ 70% em amostra interna >= 50 sessões |
| Edit Coverage | 100% campos definidos no schema suportados na UI |
| Validação Publish | Erro bloqueante ≤ 1% último lote de 30 publishes |
| Hash Integridade | 100% cargas confirmadas |
| Offer Visibility | 100% (ou justificado por gating) |

## 10. Próximos Artefatos
- `analyticsSink` inicial em memória (buffer + flush console).
- Hook wrapper para medir TTFQ via `performance.now()`.
- Função util `computeCompletionMetrics(events: QuizEvent[])` para testes.

---
_Gerado como base viva: atualizar conforme evolução real de implementação._
