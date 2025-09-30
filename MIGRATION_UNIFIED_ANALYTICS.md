# Migração para Unified Analytics

## Objetivo
Consolidar todos os fluxos de tracking e métricas no `UnifiedEventTracker` + `UnifiedAnalyticsEngine`, eliminando serviços legados (`analyticsEngine`, `AnalyticsService`, `realTimeAnalytics`, `ActivatedAnalyticsService`, `EnhancedUnifiedDataService`).

## Fases
1. Adapters de Compatibilidade (CONCLUÍDO)
   - `analyticsEngineAdapter`, `analyticsServiceAdapter`, `enhancedUnifiedDataServiceAdapter` (fase 3)
2. Substituição de Imports (80% → CONCLUÍDO PARA SERVIÇOS CRÍTICOS)
   - Restam apenas dashboards/bridges especializados listados abaixo
3. Hooks Unificados (CONCLUÍDO - FASE ATUAL)
   - `useFunnelAnalytics` (funnel), `useUnifiedAnalytics` migrado p/ unified engine
4. Remoção de Funções Legacy Não Usadas (EM PROGRESSO)
   - RealTime / Activated substituídos por eventos `editor_action`
5. Exposição de Métricas Avançadas (PENDENTE)
   - Planejar camada derivada (paths, abandono refinado, estilo predominante)
6. Remoção Final dos Adapters (PENDENTE)
   - Quando zero consumidores externos
7. Linter Estrito + CI Gate (PENDENTE)
   - Falha de pipeline se qualquer import legacy (sem `// legacy-allow`)

## Status Atual (Fim Fase 3)
Concluído nesta fase:
- Removidos usos diretos de: `AnalyticsService` (principais serviços), `realTimeAnalytics`, `ActivatedAnalytics` em hooks centrais.
- Criado adapter `enhancedUnifiedDataServiceAdapter` substituindo `EnhancedUnifiedDataService` nas páginas dashboard.
- Migrado `EditorMetricsProvider` para `unifiedEventTracker`.
- Hook `useUnifiedAnalytics` reescrito para unified engine.

Remanescentes apontados pelo linter (especializados ou exemplo):
| Arquivo | Ação Planejada | Classificação |
|---------|----------------|---------------|
| `components/dashboard/EnhancedRealTimeDashboard.tsx` | Migrar para snapshots engine ou depreciar | Dashboard (especializado) |
| `components/dashboard/RealTimeDashboard.tsx` | Unificar com versão enhanced / snapshots | Dashboard |
| `components/editor/unified/AnalyticsDashboard.tsx` | Migrar para unified adapter/hook | Editor Dashboard |
| `pages/admin/AnalyticsPage.tsx` | Trocar `realDataAnalyticsService` por engine / remover bridge | Admin |
| `pages/admin/ConsolidatedOverviewPage.tsx` | Idem acima | Admin |
| `pages/admin/ParticipantsPage.tsx` | Idem acima | Admin |
| `pages/dashboard/AnalyticsPage.tsx` | Ajustar para adapter/hook | Dashboard |
| `pages/dashboard/MonitoringPage.tsx` | Validar se substituído pelos novos painéis | Dashboard |
| `pages/dashboard/SettingsPage.tsx` | Remover dependência residual | Dashboard |
| `examples/AnalyticsConsolidatedExamples.tsx` | Marcar como legacy doc ou atualizar | Example |

Se algum desses for mantido apenas como referência, adicionar `// legacy-allow` até remoção planejada.

## Checklist Consolidado (Atualizado)
| Item | Estado | Próxima Ação |
|------|--------|--------------|
| Adapters principais | Concluído | Preparar plano de remoção gradual |
| Hook `useUnifiedAnalytics` | Concluído | Refinar tipagem eventos |
| Dashboards Realtime/Enhanced | Pendente | Unificar em um componente snapshot-driven |
| Admin Analytics Pages | Pendente | Substituir bridges por engine direto |
| Example Consolidated | Pendente | Atualizar ou arquivar |
| Remoção arquivos legacy | Parcial | Agendar limpeza pós-zero usos |

## Estratégia de Evento (Mapeamento Simplificado)
| Evento Novo | Origem Antiga | Observações |
|-------------|---------------|-------------|
| quiz_started | trackQuizStart / step_navigation inicial | Consolidado no tracker |
| question_answered | trackQuestionAnswer | payload inclui answer + questionId |
| quiz_completed | trackQuizCompletion | gera também `conversion` para funil |
| conversion | conversion_completed / quiz_completed | Normaliza finalização |
| performance_metric / editor_action | web vitals / monitoring / editor | Unificado em payload contextual |

## Boas Práticas
- Sempre usar `sessionId` consistente por funil/sessão (salvar em estado ou contexto).
- Evitar dispatch duplicado (não chamar adapter + tracker diretamente).
- Para métricas em lote, confiar no cache TTL do engine antes de recomputar.

## Remoção Planejada
Critério: zero referências (sem `legacy-allow`).
Arquivos alvo:
1. `src/services/analyticsEngine.ts` (bridge) – após dashboards migrados
2. `src/services/AnalyticsService.ts` – após example/update
3. `src/services/realTimeAnalytics.ts` – já substituído (agendar remoção)
4. `src/services/ActivatedAnalytics.ts` – substituído (agendar remoção)
5. `src/services/EnhancedUnifiedDataService.ts` – após dashboards finais

## Conclusão da Migração (Critérios)
1. 0 imports de `services/*Analytics*` (exceto unified novos)
2. 100% tracking via `unifiedEventTracker`
3. Dashboards apenas com hooks / engine / adapters transitórios zero
4. Linter sem violações (modo estrito)
5. Adapters removidos ou anotados com data de sunset ≤ 30 dias

---
Atualize esta lista a cada PR de migração. (Última atualização: Fase 3 concluída)
