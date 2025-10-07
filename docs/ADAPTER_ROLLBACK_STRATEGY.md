# Adapter Legacy Rollback Strategy

## Objetivo
Garantir continuidade de operação (visualização básica dos passos legacy) mesmo se o pipeline de conversão para TemplateDraft falhar.

## Flag de Controle
- `LEGACY_ADAPTER_FALLBACK=true` habilita modo tolerante a falhas.
- Default: ausente/false (fail-fast para ambientes de desenvolvimento/teste).

## Comportamento
1. Requisição `GET /api/quiz-style/:slug/as-draft`:
   - Sem falha: retorna `TemplateDraft` normal.
   - Com falha (ex: diretório ausente, JSON inválido irreparável): se flag ativa retorna:
     ```json
     {
       "fallback": true,
       "reason": "<mensagem de erro>",
       "rawSteps": [ { "id": "...", "blocks": [...] }, ... ],
       "manifest": { ... | null }
     }
     ```
   - Se flag desativada: HTTP 500 com `{ error }`.
2. Métricas: incrementa `fallbackCount` e registra `lastFallbackAt` em `/api/quiz-style/_internal/metrics`.

## Gatilhos Comuns de Fallback
- Diretório `public/templates/quiz-steps` ausente.
- Corrupção de JSON (parsing repetidamente falhando e nenhum step válido restante).
- Erro de permissões de leitura/escrita no `manifest.adapter.json`.

## Critérios de Escalonamento
- `fallbackCount` > 3 em 10 min sugere incidente → investigar logs.
- `fallbackCount` crescente + `conversions` estável indica falha persistente de recuperação.

## Ação Manual de Recuperação
1. Validar integridade dos arquivos JSON (`jq . arquivo.json`).
2. Remover ou renomear `manifest.adapter.json` se suspeita de corrupção.
3. Verificar permissões do diretório (`ls -l`).
4. Reiniciar processo do servidor após correção.

## Futuras Extensões
- Persistir eventos de fallback em log estruturado.
- Integrar alerting (Prometheus/Grafana ou OpenTelemetry). 
- Endpoint de diagnóstico mais completo (`/api/quiz-style/_internal/diagnostics`).

## Riscos Aceitos
- Fallback não garante semântica completa (sem validation detalhada, sem outcomes refinados).
- `rawSteps` pode expor estrutura bruta; restringir em produção se sensível.

## Check rápido (Runbook)
| Passo | Comando / Ação | Esperado |
|-------|----------------|----------|
| Ver métricas | `GET /api/quiz-style/_internal/metrics` | Campos `fallbackCount`, `lastFallbackAt` |
| Testar modo fail-fast | unset flag + requisitar | 500 em caso de erro real |
| Testar fallback | set flag + simular erro (renomear diretório) | resposta `fallback: true` |

---
Documentado para acelerar resposta operacional e reduzir MTTR.
