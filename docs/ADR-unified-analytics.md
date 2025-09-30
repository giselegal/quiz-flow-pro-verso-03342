# ADR: Unificação de Analytics (Unified Analytics Engine & Tracker)

Status: Accepted  
Data: 2025-09-30  
Autores: Plataforma / Arquitetura Frontend  
Revisores: (adicionar quando revisado)  

## 1. Contexto
O sistema evoluiu organicamente acumulando múltiplos serviços de analytics e telemetria com sobreposição parcial:
- `AnalyticsService` (core) – tracking genérico disperso
- `monitoring/AnalyticsService` – variante para GA4/monitoramento
- `analyticsEngine` e variantes avançadas – agregações específicas de funil / performance
- `realTimeAnalytics` – eventos recentes e usuários ativos
- `simpleAnalytics`, `compatibleAnalytics` (deprecated) – camadas simplificadas
- `unifiedAnalytics` (stub) – tentativa inicial não concluída
- `ActivatedAnalytics` / `EnhancedUnifiedDataService` – protótipos de insights

Problemas principais:
1. Fragmentação: múltiplas APIs e contratos distintos dificultando adoção consistente.
2. Inconsistência de schema: eventos diversos sem padronização de campos contextuais.
3. Duplicidade de processamento e queries redundantes no Supabase.
4. Dificuldade de instrumentar novas features com rastreabilidade ponta‑a‑ponta.
5. Ausência de estratégia clara de migração/rollback.
6. Falta de testes automatizados cobrindo persistência, flush e agregações.

## 2. Objetivos
- Centralizar tracking em um `UnifiedEventTracker` resiliente (buffer, flush, retry, offline fallback).
- Estabelecer schema único (`unified_events`).
- Fornecer um `UnifiedAnalyticsEngine` com consultas agregadas padronizadas + cache TTL.
- Permitir migração incremental via bridge de compatibilidade sem quebrar legacy imediato.
- Expor hook React (`useUnifiedAnalytics`) para ergonomia em UI/Editor.
- Incluir seed sintético para validação de métricas e demonstradores.
- Criar base para futuras métricas avançadas (caminhos, abandono cumulativo, experimentos).

## 3. Escopo
Inclui: tracker, engine, hook, schema, seed, testes, depreciação soft de serviços antigos.  
Não inclui (nesta fase): anonimização avançada, consent management granular, pipeline batch externo, export para data warehouse.

## 4. Estado Anterior (Resumo)
| Serviço | Função | Status | Problemas |
|---------|--------|--------|-----------|
| AnalyticsService (core) | tracking básico | Deprecated | Sem schema consistente |
| monitoring/AnalyticsService | GA4/monitoramento | Deprecated | Sobreposição parcial |
| analyticsEngine | agregações funil | Deprecated | Queries manuais ad hoc |
| realTimeAnalytics | snapshot curto | Deprecated | Cálculo duplicado |
| simple/compatibleAnalytics | wrappers simplificados | Deprecated | Valor marginal |
| unifiedAnalytics (stub) | protótipo | Superseded | Incompleto |
| ActivatedAnalytics / EnhancedUnifiedDataService | insights/AI | Congelado | Sem base unificada |

## 5. Requisitos Não-Funcionais
- Baixo overhead (flush assíncrono, batch insert).
- Resiliência offline (persistir buffer se falhar rede/insert).
- Observabilidade (resultados de flush + taxas de falha possíveis de logar futuramente em canal central).
- Extensibilidade (payload aberto; context extensível via `globalContext`).
- Testabilidade (mocks e overrides de feature flag / recuperação offline implementados).

## 6. Decisão
Adotar arquitetura em camadas:
1. `UnifiedEventTracker` centralizando captura e entrega.
2. Tabela `unified_events` como única fonte de verdade (append-only, versionada via campo `version`).
3. `UnifiedAnalyticsEngine` executando consultas resumidas com cache TTL em memória.
4. Hook `useUnifiedAnalytics` mediando UI ↔ tracker/engine.
5. Bridge de compat (`legacyAnalyticsEngineBridge`) adaptando chamadas antigas para evento unificado.
6. Feature flag (`VITE_ENABLE_UNIFIED_ANALYTICS` + override global de teste) para ativação/rollback controlado.

## 7. Arquitetura (Visão)
```
UI Components / Editor
        | (hook)
useUnifiedAnalytics
        |                         +-------------------+
        v                         | Legacy Services   | (Deprecated; chamam bridge)
UnifiedEventTracker  <----------- | Bridge            |
        |                        +-------------------+
   (buffer/flush) --> Supabase (unified_events) <-- UnifiedAnalyticsEngine (cache TTL)
```

## 8. Fluxos Principais
### Tracking
- `track()` enriquece evento (device, timestamp), adiciona ao buffer.
- Flush por: (a) tamanho >= 20, (b) timer 5s, (c) unload, (d) forcado.
- Falha de insert → eventos recolocados + persistência offline (`localStorage`).

### Recuperação Offline
- Ao inicializar em ambiente browser, método tenta recuperar lote armazenado e reprocessa via `trackBatch`.

### Agregação
- Engine executa consultas filtradas por `funnel_id` e janela temporal (`range` → cutoff). 
- Usa TTL diferente: realtime (10s), demais (30s). Invalidação pontual disponível.

## 9. Migração & Compatibilidade
- Serviços legados mantidos com banner `console.warn` + export `DEPRECATED`.
- Bridge garante que chamadas antigas geram eventos no novo tracker sem modificar chamadas de alto nível imediatamente.
- Seed script permite validar métricas em ambiente de staging/demonstração.

## 10. Alternativas Avaliadas
| Alternativa | Rejeição | Motivo |
|-------------|----------|-------|
| Manter múltiplos serviços e criar façade fina | Não | Complexidade contínua e dívida de manutenção. |
| Adotar solução analítica externa completa (ex: Segment + BigQuery) nesta fase | Adiado | Custo, latência e aumento de superfície de risco antes de estabilizar modelo de eventos. |
| Esquema polimórfico multi-tabela (por tipo de evento) | Não | Aumenta complexidade de queries e índice; volume atual não justifica sharding lógico. |

## 11. Trade-offs
- Cache em memória simples: rápido, porém não distribuído (escala horizontal exigirá camada compartilhada futura: Redis / Edge cache).
- Persistência offline somente `localStorage`: não cobre Safari Private / quotas reduzidas (aceitável para MVP).
- Sem deduplicação forte em recuperação offline (replay pode gerar tentativas duplicadas se flush parcial): priorizada simplicidade vs. complexidade de ids locais.

## 12. Riscos e Mitigações
| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Falha supabase prolongada gera buffer crescente | Perda parcial / memória | Persistência offline+flush forçado no unload; backlog controlado via tamanho buffer. |
| Cache desatualizado causa métricas ligeiramente inconsistentes | UX analytics | TTL curto + invalidação futura por evento. |
| Registros duplicados em replay offline | Distorsão leve estatística | Pode aplicar dedupe por (session_id, occurred_at, type) numa evolução. |
| Uso continuado de serviços legacy por descuido | Retardo migração | Linter + script de verificação (planejado). |

## 13. Observabilidade & Métricas (Futuro Próximo)
- Contador de falhas de flush por janela (pode ser enviado como próprio evento `error`).
- Tempo médio de flush (já retornado em `FlushResult`).
- Taxa de compressão (eventos/batch) – opcional.

## 14. Rollback Strategy
- Desativar `VITE_ENABLE_UNIFIED_ANALYTICS` → tracker não grava novos eventos.
- Bridge pode ser invertida para redirecionar (se necessário) a um serviço legacy mínimo.
- Monitorar % falha insert > limiar (ex: 20% em 5 minutos) → disparar fallback automático (próxima evolução).

## 15. Evolução Planejada
1. Métricas avançadas: caminho mais frequente, abandono cumulativo por step, tempo médio incremental por transição.
2. Enriquecimento de contexto: geolocalização aproximada (hash IP) com privacidade.
3. Linter custom (ESLint rule ou script CI) bloqueando `import` de módulos deprecated.
4. Configuração de TTL via env (`VITE_ANALYTICS_CACHE_TTL`, `VITE_ANALYTICS_RT_TTL`).
5. Cache distribuído (Redis) caso escala multi-pod aumente inconsistência de snapshots.
6. Deduplicação offline mediante hash local (sessionId + type + timestamp). 
7. Suporte a export incremental (cdc) para data warehouse.

## 16. Impacto em Equipes & Guidelines
- Devs devem usar o hook `useUnifiedAnalytics` em vez de chamar serviços legados.
- Novas categorias de eventos: propor antes de adicionar campos fixos; usar `payload` extensível.
- Ajustar dashboards internos para consumir métricas do engine unificado (evitar queries diretas manuais em `unified_events`).

## 17. Status
Implementado na branch principal com testes cobrindo tracker e engine. Próximos itens: ADR (este), cache configurável, métricas avançadas, linter de enforcement.

## 18. Referências Relacionadas
- `src/analytics/UnifiedEventTracker.ts`
- `src/analytics/UnifiedAnalyticsEngine.ts`
- `src/analytics/useUnifiedAnalytics.ts`
- `src/analytics/compat/legacyAnalyticsEngineBridge.ts`
- `scripts/seedUnifiedAnalytics.ts`
- Migração SQL: `supabase/migrations/*create_unified_events.sql`
- Testes: `src/__tests__/analytics/*`

---
Decisão aceita e em vigor. Atualizar este documento conforme evoluções forem entregues.
