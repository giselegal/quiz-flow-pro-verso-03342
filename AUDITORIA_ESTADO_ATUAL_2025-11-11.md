# Auditoria do Estado Atual – 11/11/2025

Este relatório resume a saúde técnica do projeto no momento da auditoria, cobrindo stack, build, tipos, lint, testes e riscos, além de recomendações priorizadas.

## Visão geral

- Stack: React 18 + TypeScript + Vite 7, Vitest, Playwright, Tailwind; servidor Node/Express (buildado com esbuild) e integrações Supabase.
- Build: Vite com code splitting e chunking manual, Terser em produção; Netlify configurado para SPA e headers de cache agressivos.
- Aliases TS/Vite: `@/*`, `@templates/*`, `@services/*`.

## Quality Gates

- Build: PASS
  - Comando: `npm run build`
  - Resultado: sucesso, múltiplos chunks gerados; avisos de dynamic+static import coexistentes em alguns módulos (não bloqueiam o build).
- Typecheck: PASS
  - Comando: `npm run type-check`
  - Resultado: sem erros de tipos nas áreas incluídas por `tsconfig.typecheck.json`.
- Lint: FAIL
  - Comando: `npm run lint`
  - Resultado: 112 erros, ~20.8k warnings (principalmente regras de estilo, `no-console` e `no-explicit-any`, muitos em testes e Supabase Edge Functions). Lint retorna código 1 e falha o gate.
- Testes unitários/parciais (subset): FAIL
  - Comando: `npm run -s test:run:core`
  - Resultado: 9 arquivos falharam, 12 passaram, 1 skip (62 testes falhando, 134 passando). Falhas concentradas em `TemplateService`/`HierarchicalTemplateSource` (expectativas desatualizadas) e hooks de React Query (JSDOM ausente na execução desse script).

## Principais achados

1) Lint excessivamente ruidoso em escopos não-críticos
- Grande volume de warnings/erros em:
  - `tests/**` (inclui e2e Playwright e testes utilitários)
  - `supabase/functions/**` (Deno runtime, regras de Node/TS e estilo conflitam)
- Regras: `comma-dangle`, `no-console` (CI eleva severidade), `no-explicit-any`, `@typescript-eslint/no-unused-vars` em arquivos de testes e scripts.

2) Convergência de testes e implementação
- Várias expectativas de testes dos services (ex.: `TemplateService` e `HierarchicalTemplateSource`) não batem com a implementação atual (ex.: formato normalizado de blocos contém `content`, `order`, tipagens e retornos diferentes do legado esperado pelos testes).
- Cenários de sincronização de template ativo (mock de `setActiveTemplate`) não são observados (chamadas esperadas = 0), indicando mudança de responsabilidade/fluxo.

3) Ambiente de testes para hooks React
- Erros “document is not defined” em testes de hooks (`@testing-library/react`) quando executados via script `test:run:core`. Indícios de que a configuração de Vitest (environment jsdom + setup) não está sendo aplicada nesse alvo específico.
  - Observação: A config de Vitest está embutida em `vite.config.ts` (seção `test`). Scripts que invocam Vitest devem herdá-la, mas filtros/paths customizados podem estar burlando include/exclude ou não carregar o setup.

4) Build de produção íntegro
- Build passa com sucesso, com chunking e dedupe adequados e tamanhos razoáveis dos principais vendors (React, Radix, charts, supabase). Avisos sobre dynamic+static import coexistente não impactam funcionalidade, mas podem reduzir efetividade do code splitting.

## Riscos práticos

- CI vermelho por Lint: Atualmente o lint sai com código 1; isso bloqueia pipelines se o gate for exigido.
- Incerteza dos testes: Falhas em serviços core e environment dos hooks podem mascarar regressões reais. A cobertura “verde” do README não reflete a execução local.
- Ruído em Supabase Edge Functions: Regras de lint do Node/TS no monorepo conflitam com Deno; requer perfil de lint separado.

## Recomendações priorizadas

P0 – Destravar o ciclo (0-1 dia)
- Ajustar target do Lint para “app code” no dia a dia:
  - Criar script `lint:app` com escopo: `eslint src --ext .ts,.tsx` excluindo `src/__tests__`, `tests/**`, `supabase/functions/**`.
  - Manter `lint` completo só no fluxo de manutenção (ou em branch dedicada), ou rebaixar severidade de regras de estilo em testes e edge.
- Vitest environment para hooks: garantir JSDOM e setup sendo carregados nos scripts segmentados.
  - Opção A: adicionar `vitest.config.ts` mínimo herdando a config do `vite.config.ts` e validando includes.
  - Opção B: padronizar scripts de teste para `vitest run` sem filtros de path que ignorem o setup.

P1 – Alinhar testes e contratos (1-3 dias)
- Revisar e atualizar expectativas em `TemplateService` e `HierarchicalTemplateSource` para refletir o formato normalizado atual (campos `content`, `order`, etc.).
- Onde o comportamento mudou por design (ex.: fallback/abort, erro vs. sucesso), documentar no teste o novo contrato.
- Para sincronização de template ativo, decidir “fonte da verdade” e atualizar mocks/asserts.

P2 – Redução de ruído e ergonomia (3-5 dias)
- Regras de Lint por contexto:
  - Tests: relaxar `no-console`, `comma-dangle`, `no-empty-function`, `no-unused-vars` para reduzir ruído de E2E.
  - Supabase (Deno): perfil próprio para não conflitar com regras Node/Browser.
- Automatizar “fix trivial”: `eslint --fix` em diretórios de baixo risco (tests, supabase), priorizando `comma-dangle` e `quotes`.

P3 – Qualidade contínua
- Adicionar job de CI separado: `type-check` e `build` sempre, `lint:app` em PRs, `lint:full` sob gatilho manual/cron.
- Métricas: publicar bundle report (`dist/stats.html`) no artefato de build para rastrear evolução.

## Itens verificados (comandos executados)

- Instalação: `npm install` (ok)
- Typecheck: `npm run type-check` (ok)
- Lint: `npm run lint` (FAIL, 112 erros, ~20.8k warnings)
- Testes parciais: `npm run -s test:run:core` (FAIL, ver detalhes acima)
- Build: `npm run -s build` (PASS)

## Próximos passos sugeridos

1. Criar/ajustar config de Vitest para garantir JSDOM nos scripts segmentados; reexecutar `test:run:core` até eliminar erros de ambiente.
2. Atualizar testes dos services para o formato normalizado vigente.
3. Introduzir `lint:app` e ajustar severidade em testes/edge para reduzir o ruído imediato sem abrir brechas na aplicação.
4. Opcional: adicionar CI com gates separados (type-check/build/lint:app/test subset) para feedback rápido.

---

Relatório gerado automaticamente em 11/11/2025.
