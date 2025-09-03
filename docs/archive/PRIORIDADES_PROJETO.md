# Quiz Quest Challenge Verse — Prioridades e Plano

Este documento organiza as prioridades do projeto com foco no EditorPro (editor no-code), estado global e desempenho, e define objetivos, critérios de sucesso (OKRs), entregáveis e próximos passos.

## OKRs (mensuráveis)
- O1: Edição 100% visual (no-code) das 21 etapas.
  - KR1: 100% das props dos componentes mapeadas no painel de propriedades.
  - KR2: Alterações refletem no canvas em <150ms e persistem no estado global.
- O2: Desempenho.
  - KR1: Load do editor e do quiz < 2s (rede local, cache frio), TTI < 1.5s.
  - KR2: Re-render mediano por ação < 2 frames; ausência de renders em cascata.
- O3: Robustez/segurança.
  - KR1: 0 erros uncaught em produção (Sentry) por sessão.
  - KR2: RLS Supabase cobrem leitura/escrita por owner e publish/unpublish.
- O4: Extensibilidade.
  - KR1: Novo componente aparece automaticamente no painel sem codificação manual.
  - KR2: 80%+ de cobertura de testes dos fluxos críticos (criar/editar/salvar/undo/redo/publicar).
- O5: Analytics.
  - KR1: 100% das ações-chave com eventos (início edição, add/remove/reorder, salvar, publicar).

---

## 1) Fidelidade e Editabilidade Visual Total (NO-CODE)
Objetivo: Painel de propriedades reflete 100% do que é renderizado nas 21 etapas.

Entregáveis
- Esquema declarativo de propriedades por tipo de bloco (schema do core).
- Painel de propriedades dinâmico (auto-gerado a partir do schema).
- Bind bidirecional painel ↔ estado ↔ canvas com pré-visualização fiel.

Abordagem técnica
- Core: registry de componentes no `core` (ex: `src/core/blocks/registry.ts`), com:
  - id, título, categoria, ícone, constraints e `propsSchema` (JSON-schema leve ou tipagem TS serializável).
  - renderFn (ou mapeamento para componente) + defaultProps.
- EditorPro:
  - `PropertiesPanel/PropertiesColumn` gera controles via `propsSchema` (tipos: string, number, enum, boolean, color, image, array, object) e aplica updates via `actions.updateBlock` (debounced).
  - Seleção de bloco é a fonte do formulário; validação leve por campo.

Critérios de aceite
- Qualquer campo novo no schema aparece no painel sem alterações no EditorPro.
- Atualizações refletidas imediatamente no canvas e persistidas no estado.

---

## 2) Centralização de Modelos e Tipos no core
Objetivo: Modelos, tipos, regras e configurações centralizados no `core`.

Entregáveis
- `core` com tipos únicos de Block/Step/Template.
- Schema/registry unificado consumido por EditorPro, renderer e serviços.

Abordagem
- Migrar tipos duplicados para `src/core/types.ts` e criar `src/core/blocks/registry.ts`.
- Adaptar `EditorProvider` e o renderer para consumir o registry.

Critérios
- Um único ponto de verdade; remover mapeamentos ad-hoc no editor.

---

## 3) Persistência, Desfazer/Refazer e Templates
Objetivo: Toda alteração valida e persiste no estado global com histórico.

Entregáveis
- Persistência local (estado) com undo/redo cobrindo add/update/remove/reorder.
- Templates base e criação a partir de template.

Abordagem
- Consolidar histórico no provider (ou migrar para Zustand com middleware `zustand/middleware` para history).
- Salvar snapshots por step; compressão leve do histórico.
- Templates: `core/templates/{nome}.json` + loader no provider.

Critérios
- Undo/redo funciona para 100% das operações do editor.

---

## 4) Performance e Otimização
Objetivo: <2s de carga e UI fluida.

Entregáveis
- Lazy loading de painéis pesados, listas e blocos raros.
- Memoização de seletores (ex: selectedBlock, groupedComponents) e virtualização onde necessário.
- Suspense boundaries e split por rota/etapa.

Abordagem
- Rastrear re-renders com `why-did-you-render` em DEV e medidas do React Profiler.
- DnD sem renders em cascata (estruturas leves para overlays).
- Orquestrar import dinâmico de blocks no renderer.

Métricas
- TTFB/TTI/LCP no editor e no quiz medidos com Web Vitals.

---

## 5) Sincronização e Estado Global Consistente
Objetivo: Estado centralizado e preparado para sincronização com Supabase.

Entregáveis
- Provider estável (ou Zustand) com seletores/middleware.
- Modo online/offline e merge seguro ao sincronizar.

Abordagem
- Plano de migração para Zustand: slices `editor`, `templates`, `session`.
- Mapear operações CRUD para Supabase e resoluções de conflito (last-write-wins + versionamento por step).

---

## 6) Segurança e Robustez
Objetivo: Segurança por padrão e UX resiliente.

Entregáveis
- Políticas RLS Supabase (owner, workspace, publish/unpublish).
- Diálogo de confirmação para exclusões e feedbacks de erro/sucesso.
- Captura global de erros (ErrorBoundary) + Sentry (prod).

---

## 7) Experiência do Usuário (UX)
Objetivo: Navegação fluida, prévia fiel e respostas instantâneas.

Entregáveis
- StepSidebar com estados e validações claros (já iniciado).
- Prévia (EditorCanvas) 1:1 com renderer final.
- Atalhos de teclado: undo/redo, duplicar, deletar, navegar etapas.

---

## 8) Extensibilidade e Manutenção
Objetivo: Adicionar componentes/propriedades sem fricção.

Entregáveis
- Contribuição de novos blocks via registry do core.
- Testes automatizados: unidade (provider), integração (EditorPro), e2e (caminhos críticos).
- Documentação rápida: como criar block, como adicionar props.

---

## 9) Analytics e Monitoramento
Objetivo: Instrumentação completa do fluxo.

Entregáveis
- Camada de analytics (adapter) com eventos padronizados.
- Painel simples com métricas chave (carregamento, conclusão, conversão, NPS).

Abordagem
- Adapter (ex.: PostHog/Segment) + fallback no localStorage em DEV.
- Eventos: `editor_open`, `block_add`, `block_update`, `block_remove`, `reorder`, `save`, `publish`.

---

## Roadmap sugerido (4–6 semanas)
- Semana 1: Core registry + tipos unificados + PropertiesPanel dinâmico MVP (2–3 tipos).
- Semana 2: Cobrir 21 etapas no painel + undo/redo completo + templates base.
- Semana 3: Otimizações (lazy/memo/virtualização) + métricas de performance.
- Semana 4: Migração/ajuste para Zustand + sync inicial Supabase (draft).
- Semana 5: Segurança (RLS) + UX refinamentos + atalhos teclado + confirmações.
- Semana 6: Analytics adapter + testes e2e + docs de contribuição.

## Riscos e mitigação
- Divergência painel ↔ canvas: fonte de verdade no schema do core + testes.
- Re-render em cascata: memoização seletiva; devtools/profiler em DEV.
- Conflitos de sincronização: versionamento por step e fallback offline.

## Observações
- Em DEV há logs condicionais no EditorPro para depuração de seleção, updates, insert/reorder e validação por etapa.
- Manter builds verdes (CI) e medir web vitals no editor e no quiz.
