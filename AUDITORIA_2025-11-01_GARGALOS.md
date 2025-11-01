# 🔍 Auditoria Completa — Mapeamento de Gargalos (2025-11-01)

Data: 2025-11-01
Branch: main
Ambiente: Dev container (Ubuntu 24.04)

## Resumo executivo
- Status: Em desenvolvimento ativo, complexidade alta
- Fase atual: FASE 1 — Consolidação (subfase 1.3 Banco de Dados em andamento)
- Débito técnico: Elevado, com desalinhamento entre schema e tipos TS

## Evidências coletadas
- Editor principal: `src/components/editor/quiz/QuizModularProductionEditor.tsx` — 4317 linhas
- Logs e marcadores de débito técnico (src/):
  - TODO/FIXME/HACK: 248
  - console.warn/error: 1921
  - termos de legado (deprecated/legacy/old/unused): 6146
- Type-check (tsc --noEmit): 113 erros em 28 arquivos
  - Principais categorias:
    - Tabelas ausentes nos tipos Supabase: `funnel_pages`, `quiz_conversions`, `profiles`, `session_analytics`, etc.
    - Campos ausentes/mudanças de schema: `is_published`, `version`, `settings` em `funnels`, nulabilidade de `created_at`, etc.
    - Uso de tipos derivados de `Database[...]` incompatíveis com o schema atual
- Build tooling (Vite):
  - `vite.config.ts` com chunk único `vendor` (manualChunks simplificado), tree-shaking agressivo, limite de 500KB para warnings
  - Oportunidade: separar vendors em grupos (react-vendor, ui-vendor) conforme crescimento do bundle
- Banco de dados:
  - Migration `001_complete_schema.sql` atualizada para triggers idempotentes com `tgrelid`
  - Script utilitário criado: `scripts/sql/2025-11-01_triggers_safety.sql`
  - Índices e RPC prontos em `scripts/sql/2025-11-01_indices_and_rpc.sql` (inclui `batch_update_components`)

## Gargalos prioritários
1) Desalinhamento Schema vs Types (CRÍTICO)
- Efeito: 113 erros de tipo; APIs Supabase gerando erros de sobrecarga; propriedades inexistentes.
- Causa: `src/integrations/supabase/types.ts` não contém novas tabelas usados pelo código.
- Risco: Quebra de build/CI, bugs silenciosos em produção.

2) Editor monolítico (ALTO)
- Um único arquivo com 4317 linhas; múltiplos usos de hooks e re-renders potenciais.
- Impacto: Tempo de carregamento maior e dificuldade de manutenção/testes.

3) Ruído de logs e legado (ALTO)
- 1921 `console.warn/error` e 6k+ ocorrências de legado.
- Impacto: Dificulta diagnóstico, mascara erros reais, aumenta custo cognitivo.

4) Banco de dados — governança (MÉDIO)
- Triggers corrigidos (idempotência) — OK.
- Índices e RPC prontos, porém precisam ser promovidos para migrações oficiais.

5) Bundling/Code Split (MÉDIO)
- Chunk único `vendor` pode crescer demais; oportunidade de divisão mais granular e lazy real.

## Em que fase estamos?
- FASE 1 — Consolidação
  - 1.1 Unificar camada de dados — PENDENTE
  - 1.2 Refatorar Editor principal — PENDENTE
  - 1.3 Banco de Dados — EM ANDAMENTO
    - [x] Triggers idempotentes por tabela (ajuste com `tgrelid`)
    - [x] Script de segurança de triggers (`scripts/sql/2025-11-01_triggers_safety.sql`)
    - [±] RPC `batch_update_components` e índices — prontos em script, falta promover/aplicar em migrações Supabase
  - 1.4 Limpar débito técnico — PENDENTE (métricas coletadas)

## Plano de ação por fases

### FASE 1: Consolidação (prioridade máxima)
1.3 Banco de Dados (continuar)
- Promover `scripts/sql/2025-11-01_indices_and_rpc.sql` para `supabase/migrations` com carimbo de data.
- Rodar utilitário de triggers antes de replays: `scripts/sql/2025-11-01_triggers_safety.sql`.
- Atualizar tipos Supabase (see Ações imediatas) para incluir `funnel_pages`, `quiz_conversions`, `profiles`, etc.

1.1 Unificar camada de dados
- Reduzir fontes de dados concorrentes a 3 camadas: Cache → Supabase/JSON público → Fallback TS.
- Consolidar serviços redundantes (começar por `FunnelUnifiedService`, `ConsolidatedFunnelService`, `UnifiedDataService`).

1.2 Refatoração do Editor
- Quebrar `QuizModularProductionEditor.tsx` em submódulos:
  - hooks/: `useEditorState`, `useBlockOperations`, `useEditorPersistence`
  - components/: CanvasColumn, PropertiesColumn, StepNavigatorColumn, ComponentLibraryColumn
- Garantir lazy real: renderização condicional por aba/rota (sem pré-carregar filhos).

1.4 Débito técnico
- Zerar `console.warn/error` não essenciais e substituir por logger com níveis.
- Criar regra ESLint para bloquear novos `console.*` em produção.
- Mapear e remover `DEPRECATED_*` e aliases legados em etapas semanais.

### FASE 2: Desempenho
- Code splitting por domínios:
  - react-vendor, ui-vendor (radix/lucide), editor, quiz-runtime
- Virtualização de listas (step navigator, library)
- Medições no runtime (LCP, cache hit/miss, chamadas Supabase)

### FASE 3: Estabilização
- Padronizar versões Supabase SDK e pontos de entrada
- Re-habilitar testes antes excluídos; reduzir heap necessário
- Documentação de arquitetura e fluxo de dados

## Ações imediatas (executáveis hoje)
1) Sincronizar tipos Supabase com o schema atual
- Gerar tipos:
  - Via CLI (local ou remoto):
    - supabase gen types typescript --schema public > src/integrations/supabase/types.ts
  - Conferir que as tabelas `funnel_pages`, `quiz_conversions`, `profiles`, `session_analytics` e colunas adicionadas (ex.: `is_published`, `version`, `settings`) apareçam.
- Re-rodar `npm run type-check` e ajustar as chamadas `.from()` conforme tipos gerados.

2) Promover e aplicar SQL de índices/RPC
- Mover `scripts/sql/2025-11-01_indices_and_rpc.sql` para `supabase/migrations/<timestamp>_indices_and_rpc.sql`.
- Executar migrações (local/CI/Remoto) conforme pipeline do projeto.

3) Remover `CREATE TRIGGER` cru de scripts reaplicáveis
- Usar bloco condicional com `tgrelid` ou utilitário `ensure_updated_at_trigger` (já disponível no script criado).

4) Fatiar o Editor (primeiro corte seguro)
- Extrair `StepNavigatorColumn`, `ComponentLibraryColumn`, `PropertiesColumn`, `CanvasColumn` (partes já existem em `components/quiz/components/`).
- Garantir que rotas/páginas que não usam o editor não importem suas dependências.

## Quality gates (snapshot)
- Build: PASS (config verificada; não executado build completo nesta auditoria)
- Lint: NÃO AVALIADO (recomendo rodar eslint após sincronizar tipos)
- Type-check: FAIL (113 erros)
- Testes: NÃO AVALIADO (rodar grupos fast/medium após types OK)

## Próximos passos sugeridos
- [ ] Gerar tipos Supabase atualizados e corrigir chamadas `.from()`/payloads
- [ ] Promover/aplicar `indices_and_rpc.sql` em migrações
- [ ] Primeiro corte de refatoração do Editor (subdivisão em 4 colunas e hooks)
- [ ] Criar regra ESLint para bloquear `console.*` em prod e introduzir logger
- [ ] Revisar `vite.config.ts` para manualChunks por domínios quando o bundle crescer

---
Relatório gerado automaticamente a partir do repositório local e checagens rápidas. Ajustes adicionais podem ser incorporados conforme novos dados de build/testes e métricas de runtime.
