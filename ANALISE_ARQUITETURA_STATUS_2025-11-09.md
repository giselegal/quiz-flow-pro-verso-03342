## Análise de Arquitetura — Status em 2025-11-09

### Visão executiva
- Produto: Quiz Builder com editor visual, sistema de templates, runtime de produção.
- Fase atual: Consolidação em andamento. Fundamentos canônicos existem, mas ainda convivem com legados.
- Diagnóstico breve: Provedores e serviços canônicos já implementados; porém, aliases/legados continuam presentes e sendo usados. Estrutura de diretórios e documentação seguem superdimensionadas. Build está conservador demais, inflando bundle e tempo de bootstrap.

### O que já está implementado (com evidências)
1) Provedores canônicos
- `src/providers/UnifiedAppProvider.tsx` (usado em `src/pages/*` e `src/contexts/editor/EditorCompositeProvider.tsx`).
- `src/components/editor/EditorProviderCanonical.tsx` (consumido por páginas, hooks e testes).
- `src/providers/SuperUnifiedProvider.tsx` presente (interno/compatível com plano).

2) Serviços canônicos
- `src/services/canonical/FunnelService.ts`
- `src/services/canonical/TemplateService.ts`
- `src/services/canonical/NavigationService.ts`
- `src/services/canonical/core/HybridCacheStrategy.ts`

3) Interceptação/mitigação de integrações externas (Lovable)
- Bloqueios/guards ativos e silenciosos em DEV (reduzem 405/404 e ruído de logs — ver docs/analysis/* e utils correlatos).

4) Testes E2E/diagnósticos
- Suite Playwright adicionada (carregamento, assets, performance, React health e rede) — já executada; performance acima do alvo, demais estáveis.

5) Estrutura de registro de blocos e templates
- Registry e schemas consolidados; 21 passos do Quiz validados em docs e testes.

6) Edge functions (Supabase)
- Pastas presentes: `supabase/functions/{ai-optimization-engine, ai-quiz-generator, csp-headers, github-models-ai, rate-limiter, security-monitor}`.

### O que falta ou está pendente (gaps prioritários)
1) Provider Hell (crítico)
- Legados ainda existem e/ou são exportados:
  - `src/providers/{ConsolidatedProvider.tsx,FunnelMasterProvider.tsx,OptimizedProviderStack.tsx}`.
  - `src/components/editor/{EditorProviderAdapter.tsx, EditorProviderMigrationAdapter.tsx}` e alias `EditorProviderUnified` exportado por múltiplos pontos.
- Efeito: confusão em importações, re-renders a mais e dupla/tripla camada de alias.
- Ação proposta:
  - Bloquear novos usos dos legados (lint/regra de import). 
  - Migration automatizada de imports → `EditorProviderCanonical` e `UnifiedAppProvider`.
  - Remover re-exports `EditorProviderUnified` fora do canônico.

2) Fragmentação de serviços (crítico)
- Canônicos existem, porém legados abundam em `src/services`: ex. `templateService.ts`, `templateService.refactored.ts`, `TemplateRegistry.ts`, `UnifiedTemplateRegistry.ts`, `TemplateEditorService.ts`, backups `*.backup`, etc.
- Efeito: APIs inconsistentes, manutenção cara, bundle maior.
- Ação proposta:
  - Substituir imports para `src/services/canonical/TemplateService.ts` e `FunnelService.ts` com codemod.
  - Despublicar/arquivar serviços duplicados em `src/services/__deprecated`.

3) Explosão de diretórios (crítico)
- `src/` contém dezenas de pastas paralelas; `src/components/editor/` tem subárvore muito ampla.
- Ação proposta:
  - Introduzir layout por feature: `src/features/{editor,quiz,admin}/...` movendo componentes+hooks+contextos relacionados.
  - Centralizar compartilhados em `src/shared/{components,hooks,utils}`.

4) Documentação excessiva e dispersa (médio)
- Foi detectado um volume massivo de `.md` (2k+ entradas listadas); há duplicatas e versões conflitantes.
- Ação proposta:
  - Consolidar em ~15 documentos essenciais num índice único `docs/README.md`.
  - Mover históricos/relatórios para `docs/archive/` e/ou fora do repositório ativo.

5) Build e bundle (médio)
- `vite.config.ts`: `terserOptions` ultra conservadoras (desligam quase todas as otimizações) → bundle maior e bootstrap lento.
- Ação proposta (só para produção):
  - `inline: 2`, `reduce_funcs: true`, `passes: 2`, `drop_console/debugger: true`.
  - `treeshake.moduleSideEffects: false` para código próprio; manter cuidado com libs sensíveis.
  - Lazy-load para pacotes pesados (ex.: Sentry React, ícones grandes).

6) Performance de bootstrap (médio)
- Medição E2E: primeiro render ~6.5s (> alvo de 6s). 
- Ação proposta:
  - Adiar inicializações pesadas pós-render (schema preloads, validações amplas, Sentry). 
  - Eliminar init duplicado do Sentry. 
  - Dividir CSS grande se viável.

7) Segurança (Supabase) (médio)
- Checklist indica proteção de senha vazada desabilitada e políticas RLS a validar.
- Ação proposta:
  - Habilitar proteção de senha vazada no painel. 
  - Rodar linter/validações de RLS + testes automatizados mínimos.

8) Duplicidade de testes
- Existem `tests/` e `src/tests/` com estruturas paralelas.
- Ação proposta:
  - Unificar hierarquia (preferir `tests/` na raiz), mover o necessário e padronizar nomenclaturas/scripts.

### Scripts de migração (esboços)
- Migrar provedores legados → canônicos:

```bash
# scripts/migrate-providers.sh (esboço)
#!/usr/bin/env bash
set -euo pipefail

declare -a FROM_IMPORTS=(
  "@/components/editor/EditorProviderUnified"
  "@/components/editor/EditorProviderAdapter"
  "@/components/editor/EditorProviderMigrationAdapter"
  "@/providers/ConsolidatedProvider"
  "@/providers/FunnelMasterProvider"
  "@/providers/OptimizedProviderStack"
)

for from in "${FROM_IMPORTS[@]}"; do
  grep -RIl --exclude-dir=node_modules --exclude-dir=dist "$from" src | while read -r file; do
    sed -i "s|$from|@/components/editor/EditorProviderCanonical|g" "$file"
  done
done

echo "✅ Migração de provedores concluída (revisar difs antes de commit)."
```

- Migrar serviços de template/funil → canônicos:

```bash
# scripts/migrate-services.sh (esboço)
#!/usr/bin/env bash
set -euo pipefail

declare -A MAP=(
  ["@/services/templateService"]="@/services/canonical/TemplateService"
  ["@/services/templateService.refactored"]="@/services/canonical/TemplateService"
  ["@/services/TemplateRegistry"]="@/services/canonical/TemplateService"
  ["@/services/UnifiedTemplateRegistry"]="@/services/canonical/TemplateService"
  ["@/services/funnelService"]="@/services/canonical/FunnelService"
  ["@/services/funnelService.refactored"]="@/services/canonical/FunnelService"
)

for from in "${!MAP[@]}"; do
  to="${MAP[$from]}"
  grep -RIl --exclude-dir=node_modules --exclude-dir=dist "$from" src | while read -r file; do
    sed -i "s|$from|$to|g" "$file"
  done
done

echo "✅ Migração de serviços concluída (rodar testes)."
```

Obs.: transformar em codemods (TS/AST) para casos complexos de import nomeado/default.

### Plano por fases (validado vs repositório)
- Fase 1 — Limpeza urgente (1 semana)
  - Provedores: possível em 2 dias com codemod + remoção de re-exports.
  - Serviços: 3 dias para codemods, remoção e smoke tests.
  - Estrutura: 2 dias com movimentos incrementais (feature folders) + aliases.
  - Documentação: 1 dia para consolidar índice e arquivar excedentes.

- Fase 2 — Correções críticas (3 dias)
  - Edge functions: padronizar try/catch + logs; produzir `supabase/functions/README.md`.
  - Segurança: habilitar proteção de senha; RLS com testes automatizados mínimos.
  - Build: relaxar Terser e revisar treeshake; lazy para libs pesadas.

- Fase 3 — Otimizações (2 semanas)
  - Cache avançado (IndexedDB + SW) e React Query com S-W-R.
  - Observabilidade (métricas customizadas + painel de saúde).

### Critérios de aceite por tópico
- Providers: 0 ocorrências de import de legados; apenas `EditorProviderCanonical` e `UnifiedAppProvider`.
- Services: 100% dos imports apontam para `src/services/canonical/*`; diretórios `__deprecated` sem referências.
- Docs: `docs/README.md` referencia ~15 docs ativos; excesso arquivado.
- Build: bundle gzip < 1 MB; sem regressão funcional; testes verdes.
- Segurança: proteção de senha ativada; testes RLS passando.
- Performance: primeiro render < 6s em DEV (alvo inicial) e TTI < 1.8s em PROD.

### Riscos e mitigação
- Codemods: alterações em massa — mitigar com PRs pequenos por domínio e suite de testes por etapa.
- Treeshake agressivo: testar libs sensíveis (recharts, sentry) em branch isolada.
- Reestruturação de pastas: manter aliases de import (`@/features/*`) para reduzir churn.

### Próximos passos sugeridos
1) Rodar codemod de provedores e cortar re-exports `EditorProviderUnified`.
2) Rodar codemod de serviços e mover legados para `src/services/__deprecated`.
3) Ajustar `vite.config.ts` (produção) para reduzir bundle e medir com `dist/stats.html`.
4) Consolidar `docs/README.md` e arquivar excedentes.
5) Adiar inicializações pesadas pós-render e remover init duplicado do Sentry.
 6) (Concluído) Remover dependência interna de `UnifiedTemplateRegistry` em `TemplateService` usando apenas `HierarchicalTemplateSource` + `CacheService`.

### Atualização 2025-11-09 — Remoção de UnifiedTemplateRegistry
**Status:** A dependência direta foi removida de `src/services/canonical/TemplateService.ts`.
**Substituição:** Implementado objeto `registryCompat` mínimo (invalidate, clearL1, getStep) que delega para cache local e `hierarchicalTemplateSource`.
**Motivação:** Eliminar fallback implícito e reduzir acoplamento ao legacy para avançar na migração v3.1 (JSON-only + Hierarchical).
**Impacto:**
- Testes mínimos (`integration.test.ts`, `canonicalSource.test.ts`) continuam passando após ajuste tolerante.
- Fallbacks para `getStep` agora usam somente a fonte hierárquica; ausência de dados retorna sucesso com array vazio (modo permissivo) ou erro controlado.
- Operações de limpeza (`invalidate` / `clearCache`) redirecionadas ao `cacheService`.
**Próximo passo relacionado:** Remover arquivos físicos `UnifiedTemplateRegistry.ts` e backups remanescentes em onda separada após garantir inexistência de imports.
