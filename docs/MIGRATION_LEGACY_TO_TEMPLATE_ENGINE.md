# Migração Legacy Quiz → Template Engine

## Objetivo
Guiar a transição segura e incremental do fluxo legacy (quiz-style JSON steps) para a Template Engine modular, preservando continuidade operacional e habilitando evolução (componentização, versionamento, validações enriquecidas).

## Fases de Migração
1. Observabilidade Inicial (COMPLETO)
   - Adapter read-only gera `TemplateDraft` sintético.
   - Métricas básicas: conversões (tempo), deltas.
2. Persistência Incremental (COMPLETO)
   - Manifest `manifest.adapter.json` para overrides (meta, reorder).
   - Endpoint delta: aplica meta + reorder → persistido.
3. Validação e Warnings (COMPLETO)
   - Regras core (outcomes, gaps) + warnings específicos legacy.
4. Resiliência / Rollback (COMPLETO)
   - Flag `LEGACY_ADAPTER_FALLBACK` + `safeToTemplateDraft`.
   - Métricas: `fallbackCount`, `lastFallbackAt`.
5. Componentização (EM ANDAMENTO)
   - Modelo de Component abstraindo blocks legacy.
   - CRUD de componentes (in-memory → storage real).
6. Normalização & Versionamento
   - Mapear cada block legacy → componente typed.
   - `schemaVersion` incremental.
7. Publicação & Difusão
   - Draft → publish pipeline com history + diff.
8. Deprecação do Legacy
   - Remover paths diretos dos JSON steps.
   - Conversão offline final e arquivamento.

## Flags & Feature Toggles
| Flag | Função |
|------|--------|
| `VITE_USE_TEMPLATE_ENGINE` | Ativa UI baseada na Template Engine. |
| `VITE_QUIZ_STYLE_ADAPTER` / `USE_QUIZ_STYLE_ADAPTER` | Habilita adapter no backend/frontend. |
| `LEGACY_ADAPTER_FALLBACK` | Ativa modo seguro: falha → objeto `fallback`. |
| `ADAPTER_COMPONENT_SPLIT` | Habilita decomposição de blocks em componentes tipados no adapter. |

## Fluxo Atual Simplificado
Legacy JSON Steps → Adapter (toTemplateDraft) → Draft sintético → (Delta via manifest) → (Validação + Métricas) → UI (Feature Flag) → Fase futura: Component CRUD.

### Endpoints Relacionados
- `POST /api/templates/:id/validate` execução explícita (histórico futuro).
- `GET /api/templates/:id/validation` leitura idempotente do relatório.
- `GET /api/components` CRUD componentes (fase experimental).
- `GET /api/components/__metrics/decomposition` progresso de decomposição.
 - `POST /api/templates/:id/stages/:stageId/components` adicionar componente (criar ou anexar existente) em posição opcional.
 - `POST /api/templates/:id/stages/:stageId/components/reorder` reorder dos componentes dentro da stage.
 - `DELETE /api/templates/:id/stages/:stageId/components/:componentId` remove componente da stage (e deleta objeto se não referenciado).

## Rollback Estratégico
- Se adapter falhar e flag ativa → retorna `{ fallback: { reason, rawSteps, manifest } }`.
- Métricas permitem detectar reincidência. Critério de alerta: >3 fallbacks em 10 min.
- Runbook:
  1. Checar logs de erro raiz.
  2. Verificar diff de arquivos JSON/manifest recente.
  3. Se mudança suspeita → revert ou corrigir schema local.
  4. Manter fallback ON até 2 execuções bem-sucedidas consecutivas.

## Riscos Mapeados & Mitigações
| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Parsing quebrado em novo step JSON | Draft indisponível | Fallback + logs por arquivo | 
| Ordem divergente vs manifest | Draft inconsistente | Validação reorder + testes | 
| Crescimento não tipado de blocks | Dificuldade de evolução | Introdução Modelo Component | 
| Perda de meta custom | Inconsistência SEO/UX | Persistência em manifest | 
| Falhas silenciosas sem observabilidade | Diagnóstico lento | Métricas + fallbackCount | 

## Próximos Passos (Roadmap Técnico)
1. Formalizar Component Model (spec + tipos). 
2. CRUD in-memory para componentes (isolação de estado). 
3. Mapeamento incremental: converter `legacyBlocksBundle` em múltiplos componentes tipados. 
4. Introduzir camada de versionamento (ex: `schemaVersion: 1.1.0-components`). 
5. Adicionar testes de compatibilidade regressiva (old manifest vs nova engine). 

## Critérios de Conclusão da Migração
- 0% de dependência em JSON steps diretos para runtime principal.
- Conversor legacy executado uma única vez (migração offline) ou sob demanda apenas em modo manutenção.
- Cobertura de testes: >90% para paths críticos (adapter, componentes-core, validação, delta).
- Observabilidade: métricas + logs estruturados + dashboard simples.

## Checklist Operacional (Curto Prazo)
- [x] Adapter read-only
- [x] Persistência via manifest
- [x] Validações e warnings
- [x] Rollback seguro
- [ ] Component Model público
- [ ] CRUD componentes
   - [x] Operações básicas de stage: add / reorder / remove
- [ ] Normalização blocks → componentes
- [ ] Versionamento ampliado
- [ ] Pipeline publish
- [ ] Deprecação definitiva legacy

_Atualizado em: 2025-10-07_
