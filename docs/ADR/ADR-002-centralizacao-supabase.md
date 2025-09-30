# ADR-002: Centralização do Cliente Supabase

Data: 2025-09-30
Status: Aprovado / Implementado
Autor: Arquitetura do Editor Unificado

## Contexto
O código possuía múltiplos pontos de criação direta de `createClient` do Supabase espalhados em hooks e serviços (`ComponentsService`, `CollaborationService`, `MigrationService`, `UnifiedCRUDService`, etc.). Isso gerava:
- Risco de configurações divergentes (auth, persistSession, chaves).
- Dificuldade de auditoria e testes (mock repetitivo).
- Overhead potencial de múltiplas instâncias.
- Aumento de acoplamento entre camadas de domínio e a lib Supabase.

## Decisão
Introduzimos módulo central `src/supabase/config.ts` que expõe:
- `getSupabase()`: inicializa lazy uma única instância (retorna null se variáveis ausentes).
- `resetSupabaseForTests()`: utilitário para testes unitários.

Foi criado script de auditoria `scripts/audit/supabase-imports.ts` que falha o build se houver `createClient(` fora da whitelist (atualmente apenas `src/supabase/config.ts`).

Serviços migrados para `getSupabase()`:
- `ComponentsService`
- `CollaborationService`
- `MigrationService`
- `UnifiedCRUDService` (carregamento e sync)
- Hooks que persistem estado (ex: `useQuizSyncBridge`).

## Alternativas Consideradas
1. Manter criação distribuída (rejeitado: alto risco/fragmentação).
2. Criar provider React de contexto para Supabase (descartado por agora: necessidade mínima; lazy global suficiente).
3. Injeção por parâmetro em cada serviço (mais verboso; poderia ser evoluído futuramente se multi-tenancy for requerido).

## Consequências
### Positivas
- Único ponto de configuração e extensão (ex: logging, tracing futuro).
- Mock simplificado em testes via `vi.mock('@/supabase/config', ...)`.
- Auditoria automática evita regressões.
- Menor risco de divergência de policies/auth.

### Negativas / Trade-offs
- Acesso global suave pode incentivar uso indiscriminado em camadas que deveriam ser puras (ex: lógica de domínio). Mitigação: revisar PRs.
- Para cenários multi-projeto ou multi-tenant simultâneo, abordagem atual exigiria refatorar para fábrica diferenciada.

## Métricas de Sucesso
- `grep createClient` → apenas 1 ocorrência em `src/supabase/config.ts`.
- Scripts e testes executam sem warnings duplicados de cliente.
- Redução de boilerplate de mocks (observável em novos testes do quiz).

## Próximos Passos
- (Opcional) Adicionar telemetria de latência em operações Supabase.
- Expandir script de auditoria para incluir uso direto de `@supabase/supabase-js` fora de módulos autorizados.
- Versionar configurações (ex: modos de caching) via feature flags.

## Referências
- Commit de migração dos serviços (ver histórico Git).
- Documento `docs/DB/quiz_editor_states.md` (persistência incremental) usando o client central.
