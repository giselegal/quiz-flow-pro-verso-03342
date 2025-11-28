# 🔍 AUDITORIA CONSOLIDADA FINAL - QUIZ FLOW PRO V4.0

**Data:** 28 de Novembro de 2025  
**Versão:** 1.1 - Revisão factual  
**Escopo:** Código + JSON + Supabase + Arquitetura

---

## 📊 RESUMO EXECUTIVO

### Estatísticas do Projeto (fonte: `git ls-files` e `npx cloc`)
- **Arquivos TypeScript/TSX rastreados:** 3.516 (`git ls-files '*.ts' '*.tsx' | wc -l`)
- **Arquivos JSON rastreados:** 189 (`git ls-files '*.json' | wc -l`)
- **Linhas de código TypeScript (incluindo client + ferramentas):** 1.380.797 (cloc 2.06)
- **Linhas de código JSON:** 710.606 (cloc 2.06)
- **Scripts SQL em `supabase/migrations`:** 36 arquivos (32 declarações `CREATE TABLE`)

### ⚠️ Achados críticos atuais

| Categoria | Observação | Impacto | Prioridade |
|-----------|------------|---------|------------|
| **JSON Templates** | 189 JSONs rastreados; 73 em `public/`, 37 em `src/`. Apenas parte deles está no formato V4 (ex.: `public/templates/quiz21-v4.json` e `public/templates/steps-refs/*`), enquanto a maior parte continua em formato V3 (`public/templates/step-*.json`). Não há monitoramento automatizado do progresso de migração. | 🟡 ALTO | P1 |
| **Validação de Schemas** | Existe schema oficial (`schemas/quiz-template-v4.schema.json`) e validações Zod em `src/schemas/quiz-schema.zod.ts`, mas nenhum script consolidado garante que todos os JSONs rastreados sejam validados antes do deploy. | 🟡 ALTO | P1 |
| **Supabase Schema & Types** | O schema está versionado (migrations 001…20251110), porém há pelo menos quatro fontes de tipos (`shared/types/supabase.ts`, `src/services/integrations/supabase/types.ts`, `src/services/integrations/supabase/types_updated.ts`, `supabase/functions/_shared/types.ts`). Não existe diff recente entre migrations e tipos gerados. | 🟡 ALTO | P1 |
| **RLS Policies** | `supabase/migrations/20251110_auth_hardening_rls.sql` define políticas completas (select/insert/update/delete para `funnels`, `quiz_production`, `component_instances`, etc.), mas não há testes automatizados garantindo que todas as tabelas tenham RLS habilitado ou que políticas rejeitem acessos indevidos. | 🟡 ALTO | P1 |
| **Registries/Renderers duplicados** | Há múltiplas implementações ativas: `src/core/registry/UnifiedBlockRegistry.ts` (925 LOC), `src/core/registry/blockRegistry.ts`, `src/components/editor/blocks/enhancedBlockRegistry.ts`, `src/components/editor/quiz/schema/blockRegistry.ts` e `src/editor/registry/BlockComponentMap.ts`. Também existem renderers duplicados (`src/components/editor/blocks/UniversalBlockRenderer.tsx` e `client/src/components/editor/blocks/UniversalBlockRenderer.tsx`). | 🟡 MÉDIO | P2 |
| **Arquivos arquivados** | Diretório `archive/` contém `deprecated-hooks/`, `deprecated-providers/`, `deprecated-services/` e `legacy-panels/`. Apesar de estarem isolados, continuam presentes no tree principal e aparecem em buscas globais. | 🟢 BAIXO | P3 |

---

## 🎯 PARTE 1 · JSONS E TEMPLATES

### 1.1 Inventário real
```bash
git ls-files '*.json' | awk 'BEGIN{FS="/"}{dir=(NF==1?"./":$1); counts[dir]++} END {for (d in counts) printf "%s %d\n", d, counts[d]}' | sort -k2 -nr
```
**Resultado:** `public` 73 · `src` 37 · `.backup-config-templates-*` 21 · `docs` 17 · `scripts` 13 · diretórios diversos 28. O diretório `data/` contém apenas `extracted-questions.json`; não existe `data/templates/` nesta branch.

### 1.2 Versões e aderência ao V4
- `public/templates/quiz21-v4.json` e `public/templates/steps-refs/step-*-ref.json` possuem `version`, `$schema` e `metadata` compatíveis com o schema V4.
- `public/templates/step-01-v3.json` … `step-21-v3.json` seguem o layout V3 (`steps`, `version" 3.0.x`).
- Não foram encontrados duplicados entre `public/` e `data/`; o problema atual é heterogeneidade de versões dentro do mesmo diretório.
- Mocks em JSON **não** existem em `tests/fixtures` (há apenas `test-fixtures.ts`).

### 1.3 Schemas e validação
- Schemas JSON oficiais: `schemas/quiz-template-v4.schema.json`, `schemas/stage.schema.json`, `schemas/component.schema.json`, etc.
- Schemas Zod: `src/schemas/quiz-schema.zod.ts`, `src/core/schemas/blockSchema.ts`, `src/core/schemas/stepSchema.ts` e correlatos.
- Scripts úteis já presentes: `scripts/audit-jsons.mjs`, `scripts/validate-templates.ts`, `scripts/validate_supabase_references.js`, `scripts/test-json-v4-runtime.sh`.

### 1.4 Recomendações
1. **Inventário automatizado**: job diário executando `scripts/audit-jsons.mjs` + validação do schema V4, salvando relatório em `reports/json-validation-<data>.md`.
2. **Estratégia de migração**: priorizar os 73 arquivos em `public/templates/` com `node scripts/migrate-to-v4.mjs --path public/templates --report reports/json-migration.md`.
3. **Bloqueio no CI**: integrar `scripts/test-json-v4-runtime.sh` ao pipeline para impedir merges sem `version`/`$schema`.

---

## 🎯 PARTE 2 · SUPABASE

### 2.1 Schema e migrations
- `supabase/migrations/001_complete_schema.sql` cobre o schema inicial (funis, sessões, resultados, AI, etc.).
- Existem 35 migrations adicionais (`20250108_quiz_editor_tables.sql`, `20250125000000_seed_templates_paired.sql`, `20251110_auth_hardening_rls.sql`, ...).
- Aproximadamente 32 instruções `CREATE TABLE` e dezenas de ajustes posteriores (indexes, views, seeds).

### 2.2 Tipos TypeScript
- `shared/types/supabase.ts` (principal), `src/services/integrations/supabase/types.ts`, `types_updated.ts` e `supabase/functions/_shared/types.ts` convivem sem sincronização automática.
- Não há artefato recente gerado via `supabase gen types ...`, aumentando o risco de drift.

### 2.3 Políticas RLS e segurança
- `supabase/migrations/20251110_auth_hardening_rls.sql` habilita RLS e cria policies para `funnels`, `quiz_production`, `component_instances`, etc.
- Não existe script que verifique `relrowsecurity = true` em todas as tabelas.
- Sugestão: estender `scripts/validate-migrations.sh` ou `scripts/supabase-audit.sql` para executar essas queries automaticamente.

### 2.4 Serviços e clientes
- Clientes distribuídos: `src/integrations/supabase/client.ts`, `src/services/integrations/supabase/{client,client-enhanced,customClient,supabaseLazy}.ts`.
- Repositórios: `src/config/infrastructure/supabase/repositories/*`.
- Ausência de retry/timeout consistentes e risco de N+1 (muitos loops com `supabase.from(...).select('*')`).

### 2.5 Recomendações
1. **Regenerar tipos** com `npx supabase gen types typescript --local > shared/types/supabase.generated.ts` e comparar com cada variação existente.
2. **Checklist de RLS**: script SQL que verifica `relrowsecurity = true` + testes Vitest cobrindo policies críticas.
3. **Consolidar clientes** adotando wrapper único com retry/backoff e timeouts.
4. **Documentar** no README/Security quais migrations habilitam RLS e como validar localmente.

---

## 🎯 PARTE 3 · TIPOS E REGISTRIES DUPLICADOS

### 3.1 BlockData / BlockComponentProps
- Implementações paralelas em `src/types/core/BlockInterfaces.ts` (canônico), `src/types/blockTypes.ts`, `src/types/blockComponentProps.ts`, `src/components/editor/blocks/enhancedBlockRegistry.ts` e `.d.ts` legados (`ambient-blocks.d.ts`, `ambient-temp.d.ts`).
- Recomenda-se manter apenas `src/types/core/BlockInterfaces.ts`, expondo re-exports em `src/types/blocks.ts`/`Block.ts` e convertendo os demais arquivos em proxies temporários.

### 3.2 Registries
- `src/core/registry/UnifiedBlockRegistry.ts` (925 linhas) é o target oficial.
- Ainda coexistem `src/core/registry/blockRegistry.ts`, `src/components/editor/blocks/enhancedBlockRegistry.ts`, `src/components/editor/quiz/schema/blockRegistry.ts`, `src/config/enhancedBlockRegistry.ts`, `src/editor/registry/BlockComponentMap.ts` e equivalentes em `client/`.
- A multiplicidade dificulta lazy loading, telemetria e entendimento de props.

### 3.3 Renderers
- `src/components/editor/blocks/UniversalBlockRenderer.tsx` já usa Suspense + error boundaries.
- Versão legada em `client/src/components/editor/blocks/UniversalBlockRenderer.tsx` possui lógica divergente. É candidato a ser archivado após alinhamento.

### 3.4 Próximos passos
1. Executar `scripts/analyze-duplicity-steps.cjs` e `scripts/find-duplicates.mjs` para mapear dependências.
2. Criar lint customizado bloqueando imports de registries antigos.
3. Automatizar substituição de imports para `@/core/registry/UnifiedBlockRegistry` (ts-morph ou codemod).

---

## 🎯 PARTE 4 · CÓDIGO LEGADO / ARQUIVADO

| Diretório | Status | Observação |
|-----------|--------|------------|
| `archive/deprecated-hooks/` | ✅ Isolado | Hooks pré-consolidação; não há importações ativas. |
| `archive/deprecated-providers/` | ✅ Isolado | Providers obsoletos; aparecem em buscas globais. |
| `archive/deprecated-services/` | ✅ Isolado | Serviços antigos mantidos para referência. |
| `archive/legacy-panels/` | ✅ Isolado | Painéis legados fora do bundle atual. |

**Ação recomendada:** mover `archive/` para outro repositório ou aplicar `.gitignore` local para reduzir ruído durante buscas.

---

## 🎯 PARTE 5 · COMPONENTES E UTILITÁRIOS DE ALTO VALOR

### Inline blocks
`src/components/editor/blocks/` possui mais de 25 blocos inline (`TextInlineBlock.tsx`, `ImageInlineBlock.tsx`, `ProgressInlineBlock.tsx`, `UrgencyTimerInlineBlock.tsx`, etc.). Eles seguem o contrato unificado e merecem documentação/Storybook.

### Registry unificado
`src/core/registry/UnifiedBlockRegistry.ts` oferece carregamento híbrido (critical vs lazy) e cache inteligente. Manter este arquivo como fonte única reduz regressões.

### Renderizador universal
`src/components/editor/blocks/UniversalBlockRenderer.tsx` deve se tornar o único renderer (editor + runtime) após a migração de registries.

---

## 🎯 PLANO DE AÇÃO (SUGESTÃO)

### Semana 1 – Inventário e validação
1. Rodar `scripts/audit-jsons.mjs` + `scripts/validate-templates.ts` e publicar `reports/json-audit-<data>.md`.
2. Adicionar `scripts/test-json-v4-runtime.sh` ao pipeline CI.
3. Listar todos os JSONs V3 restantes em `public/templates/`.

### Semana 2 – Supabase & tipos
1. Regenerar tipos com `supabase gen types` e comparar com `shared/types/supabase.ts` e `src/services/integrations/supabase/types*.ts`.
2. Automatizar auditoria RLS (script SQL + testes Vitest).
3. Consolidar clientes Supabase em torno de um wrapper resiliente.

### Semana 3 – Consolidação de registries
1. Inventariar importações com `scripts/analyze-components-status.mjs`.
2. Migrar consumidores para `UnifiedBlockRegistry` e remover `blockRegistry.ts`, `enhancedBlockRegistry.ts`, `BlockComponentMap.ts`.
3. Unificar `UniversalBlockRenderer` (eliminando a versão em `client/`).

### Semana 4 – Limpeza e documentação
1. Arquivar/remover diretório `archive/` após snapshot.
2. Documentar inline blocks e fluxo do registry em `docs/`.
3. Atualizar `SECURITY.md` e `ARQUITETURA_FINAL_IMPLEMENTACAO.md` com o novo pipeline de validação e checklist RLS.

---

## ✅ CHECKLIST ATUALIZADO

### JSON & Schemas
- [ ] Relatório automático `scripts/audit-jsons.mjs`
- [ ] Validação completa usando `schemas/quiz-template-v4.schema.json`
- [ ] Status público da migração V3 → V4 (`public/templates/`)

### Supabase
- [ ] Tipos regenerados a partir do schema atual
- [ ] Script de auditoria RLS / segurança rodando no CI
- [ ] Clientes padronizados com retry/timeout

### Código
- [ ] Importações apontando apenas para `UnifiedBlockRegistry`
- [ ] Renderizadores legados desativados
- [ ] Diretório `archive/` fora do bundle principal

### Documentação & Testes
- [ ] Inline blocks documentados/Storybook
- [ ] Guia de migração JSON no `docs/`
- [ ] Testes de policies e integrações Supabase executados no pipeline

---

**Responsável pela revisão factual:** Equipe DevOps / Observabilidade  
**Próxima revisão recomendada:** 7 dias após concluir as ações da Semana 2.
