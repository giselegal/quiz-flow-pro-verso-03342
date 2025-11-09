# Auditoria Técnica Automatizada — 2025-11-05

Este relatório resume uma auditoria completa do projeto (inventário, build/lint/tipos/testes, performance de bundle, qualidade de código, segurança e DX), destacando gargalos e pontos cegos com recomendações priorizadas.

## Resumo executivo

- Estado atual: app Vite + React 18 com servidor Express (proxy 3001), TypeScript estrito, Vitest + Playwright, Tailwind 3; arquitetura modular do Editor e runtime de quiz.
- Build: OK em modo desenvolvimento (vite build --mode development) após corrigir dependências. Chunk principal e editor grandes; avisos de divisão de código.
- Tipos: FALHA — erros críticos em `EditorProviderUnified.tsx` (uso de `setState` inexistente) e acoplamento incorreto com `SuperUnifiedProvider`. 
- Lint: MUITO RUÍDO — 94 erros e ~21k avisos; regras severas (no-console, any) sem exceções suficientes para scripts e testes.
- Testes: Subconjunto rápido executou; validação de schemas Zod falha em 46/208 casos (mismatch entre templates e schemas canônicos). Outros testes unitários principais OK.
- Segurança: 2 vulnerabilidades moderadas (quill via react-quill). Chaves sensíveis não aparentes (.env contém apenas flags VITE_*), mas há amplo uso de localStorage direto.

Prioridade Máxima (P0):
1) Corrigir `EditorProviderUnified.tsx` (estado: setLocalState vs estado proxy + chamadas para SuperUnifiedProvider). Hoje quebra typecheck e pode mascarar estado real. 
2) Corrigir validações Zod das etapas (46 falhas) — risco de inconsistência de dados em publicação.
3) Reduzir ruído de ESLint e estabilizar CI (regras e escopos) — hoje bloqueia adoção de lint.

## Inventário do projeto

- Build/bundler: Vite 7 (`vite.config.ts` consolidado), manualChunks por domínios, esbuild minify, sourcemaps ativos só em staging, HMR em 8080; servidor Express (`server/index.ts`) atende `dist/` e expõe APIs mock/WS.
- TS: `tsconfig.json` (moduleResolution: bundler, strict, paths @/*), `tsconfig.typecheck.json` para `type-check` (inclui subconjunto e puxa transitivos).
- Lint: Flat config `eslint.config.js` com regras rigorosas (hooks, no-console em prod/CI, imports profundos restritos, localStorage restrito com exceções pontuais).
- Testes: `vitest.config.ts` (happy-dom + forks, deprecation: environmentMatchGlobs), várias suítes; e2e via Playwright.
- Scripts: ampla suíte de scripts para migrações, auditorias, smoke, templates, consolidações.

## Qualidade (gates)

- Build: PASS — vite build --mode development concluiu com avisos de chunking e duplicatas de import dinâmico/estático. 
- Typecheck: FAIL — 30 erros em `src/components/editor/EditorProviderUnified.tsx` e antes falta de módulo mustache (resolvida após `npm install`).
- Lint: FAIL — 94 erros e 21.8k avisos (principalmente no-console e any). 
- Testes: FAIL (parcial) — 46 falhas em validação Zod em `block-schemas.test.ts`; outras suítes principais passaram.

## Gargalos identificados (com evidências)

1) Quebra estrutural no EditorProviderUnified (P0)
   - Sintomas: TypeScript não encontra `setState` (30 ocorrências). Navegação/seleção atualizam um estado que é derivado do `SuperUnifiedProvider` (não efetivo).
   - Risco: Editor inconsistênte, histórico corrompido, efeitos duplicados. 
   - Ação: 
     - Substituir todas as mutações de `state` por `setLocalState` apenas para chaves locais (isLoading, stepValidation, stepSources, etc.).
     - Delegar mutações de `currentStep`, `selectedBlockId` e `stepBlocks` para `superUnified.actions` ou para `EditorStateManager` trabalhando sobre a fonte canônica.
     - Especificar contrato: estado local vs estado proxy; adicionar testes unitários para `setCurrentStep`, `updateBlock` e `reloadStepFromJSON`.

2) Falhas de validação Zod em 46 blocos (P0)
   - Sintomas: Falhas em options-grid, question-hero, transition (step-12, step-19) e result blocks (step-20, step-21). 
   - Risco: inconsistência entre templates e schemas; publicações inválidas; rendering quebrado.
   - Ação: Rodar auditorias de schemas e alinhar mapeamentos canônicos. Reexecutar `vitest` até 100% no conjunto de validação. Avaliar scripts existentes: `scripts/validate-templates.ts`, `migrate:canonical-imports`.

3) Lint com ruído excessivo (P0)
   - Sintomas: 21k+ avisos; erros por `no-console` em scripts/utilitários e testes; muitos `any` previstos.
   - Risco: baixa aderência e cegueira (sinais importantes perdidos). 
   - Ação: 
     - Ajustar escopos no `eslint.config.js` (expandir ignores para testes/e2e/scripts isolados; relaxar `no-console` em ambientes de teste/dev; reduzir severidade de `no-explicit-any` em utils e testes). 
     - Ativar `--max-warnings` no CI com limite progressivo (ex.: 2500 ➜ 1000 ➜ 0).

4) Bundle grande e chunking inefetivo (P1)
   - Evidência: vendor ~640 kB, editor ~989 kB (dev build minificado). Warnings: o mesmo módulo importado dinâmica e estaticamente (p.ex. `TemplateService.ts`, blocos atômicos). 
   - Ação: Consolidar estratégia de import (preferir estático nos core paths e dinâmico apenas em registries). Garantir que módulos não sejam mistos; revisar manualChunks existentes.

5) Uso direto de localStorage disseminado (P1)
   - Evidência: dezenas de ocorrências em `src/pages`, `src/api`, `src/infrastructure`.
   - Risco: SSR/portabilidade, privacidade, testabilidade.
   - Ação: Migrar para um `StorageService` unificado (há infraestrutura), gateando por ambiente e com fallback seguro.

6) Imports relativos profundos (P1)
   - Evidência: `../../../` em vários componentes do editor; regra já existe mas não cobre todos os casos.
   - Ação: Corrigir para aliases (`@/hooks/...`, `@/providers/...`), padronizar caminhos e reduzir acoplamento.

7) Gestão de dependências instável (P1)
   - Sintomas: `npm install` falhou por conflito de peer (@types/node vs vite@7). 
   - Ação: Atualizado para `@types/node@^20.19.0` (aplicado). Adicionar verificação em CI de `npm ci` + `npm run build`.

8) Resolução de módulos externos (P2)
   - Sintomas: build inicialmente falhou ao resolver `mustache`; instalado corretamente resolveu.
   - Ação: Garantir lockfile consistente e CI com instalação limpa.

9) Depreciações em testes (P2)
   - Evidência: Vitest: `environmentMatchGlobs` deprecado.
   - Ação: Migrar para `test.projects` na `vitest.config.ts` separando ambientes node/jsdom.

10) Código morto/duplicado em renderers (P2)
   - Evidência: mensagens do esbuild em `BlockTypeRenderer.tsx` sobre `case` duplicados.
   - Ação: Limpar duplicações para reduzir bundle e risco de rota errada.

## Pontos cegos (blind spots)

- Ausência de pipeline CI consolidando: `type-check`, `lint` (com limite de warnings), `test:fast`, `build` e upload de `coverage/test-report.html` como artefato.
- Segurança: sem varredura automatizada (npm audit) no CI; sem SAST simples (eslint-plugin-security opcional).
- Observabilidade: logs verbosos sem níveis consistentes; regra `no-console` conflita com necessidade de debug.
- Documentação: há grande volume de MDs, mas falta um índice/TOC automatizado e um "estado atual" de qualidade (badges).

## Recomendações priorizadas e plano de ação

P0 — Correções críticas (1–2 dias):
- EditorProviderUnified: 
  - Mapear chaves locais: `isLoading`, `stepValidation`, `stepSources` ➜ usar `setLocalState`.
  - Navegação/seleção: usar `superUnified.actions.setCurrentStep` e `setSelectedBlockId`.
  - Operações de bloco: manter via `EditorStateManager`, garantindo que fonte canônica seja atualizada (não o proxy). 
  - Adicionar testes unitários para garantir efeitos (histórico, ensureStepLoaded, reloadAllSteps).
- Zod Schemas vs Templates: executar `validate:templates` e ajustar propriedades faltantes. Corrigir 46 falhas até verde.
- CI: Adicionar workflow simples (checkout ➜ setup-node ➜ npm ci ➜ type-check ➜ test:fast ➜ build:dev).

P1 — Estabilização e performance (3–5 dias):
- ESLint: reduzir escopo em docs/scripts/e2e; relaxar regras para `utils/**` e `tests/**`; ativar `--max-warnings` progressivo.
- Imports: converter `../../../` para aliases e garantir unicidade de React.
- Bundle: alinhar imports dinâmicos vs estáticos; mover renderers pesados para lazy; revisar manualChunks.
- Storage: migrar acessos a `localStorage` para serviço unificado com interface isomórfica.

P2 — Qualidade contínua (1–2 semanas):
- Migrar Vitest para `test.projects`; separar suites por domínio; reduzir concorrência onde não necessário.
- Security: rodar `npm audit` no CI; avaliar atualização de `react-quill`/`quill` (quebra potencial), ou isolar uso.
- DX: adicionar pre-commit (lint-staged + prettier) e collection de docs atualizadas.

## Evidências resumidas

- Typecheck: 30 erros em `EditorProviderUnified.tsx` relacionados a `setState` inexistente (fonte: `npm run type-check`).
- Build: sucesso com avisos de chunking, bundles grandes (fonte: `npm run build:dev`).
- Lint: 94 erros e 21k+ avisos (fonte: `npm run lint`).
- Testes: 46 falhas em validação de schemas Zod; demais testes unitários relevantes passaram (fonte: `npm run test:fast`).
- Audit: 2 vulnerabilidades moderadas (quill via react-quill).

## Próximos passos imediatos (executáveis)

- [ ] Implementar correção no EditorProviderUnified conforme P0 e reexecutar `type-check`.
- [ ] Rodar `npm run validate:templates` e ajustar mismatches até os 46 testes ficarem verdes.
- [ ] Criar workflow CI básico (type-check, test:fast, lint com `--max-warnings 5000`, build:dev) e ajustar gradualmente.
- [ ] Configurar regra eslint adicional para ignorar `no-console` em `scripts/**`, `tests/**` e `supabase/functions/**`.
- [ ] Planejar migração de imports relativos profundos para aliases.

—
Relatório gerado automaticamente pelo agente.
