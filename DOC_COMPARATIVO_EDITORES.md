# Comparativo dos Editores do Projeto

Este documento resume diferenças e recomendações entre os três editores presentes no projeto:

- EditorPro (legacy robusto): `src/legacy/editor/EditorPro.tsx`
- SchemaDrivenEditorResponsive (moderno): `src/components/editor/SchemaDrivenEditorResponsive.tsx`
- ModularEditorPro (modular): `src/components/editor/EditorPro/components/ModularEditorPro.tsx`

## Visão geral

- EditorPro: solução madura com DnD completo, diagnósticos e validação centralizada; mais pesado e complexo.
- SchemaDriven: UI moderna, simples, com modo interativo; DnD básico (sem provider dedicado por padrão).
- ModularEditorPro: refatoração modular do Pro, mais sustentável; requer integrar provider de DnD para paridade.

## Layout e barra superior

- EditorPro
  - Header: `FunnelHeader` (app bar do funil).
  - Colunas: Etapas (10%), Componentes (15%), Canvas (55%), Propriedades (20%).
- SchemaDriven
  - Toolbar: `EditorToolbar` moderno no topo, com alternância para modo interativo.
  - Layout: `FourColumnLayout` com painéis explícitos.
- ModularEditorPro
  - Toolbar: `EditorPro/components/EditorToolbar` com ações (undo/redo/salvar/publicar/preview).
  - Layout: 4 colunas (StepSidebar, ComponentsSidebar, EditorCanvas, PropertiesColumn).

## Drag & Drop (DnD)

- EditorPro
  - Usa `StepDndProvider` + `useEditorDragAndDrop` (DnD robusto por etapa).
  - Integrado ao `CanvasAreaLayout` e reordenação precisa.
- SchemaDriven
  - Usa `CanvasDropZone.simple`; sem `StepDndProvider` global por padrão.
  - DnD limitado; para paridade, envolver canvas com `StepDndProvider`.
- ModularEditorPro
  - Expõe `onReorderBlocks` no `EditorCanvas`; para DnD completo, adicionar `StepDndProvider` ao redor.

## Providers e dependências

- Todos dependem de `EditorProvider` (moderno). Ambos possuem fallback amigável se usados fora do provider.
- EditorPro adiciona hooks auxiliares (hotkeys, anti-autoscroll, validação centralizada, diagnósticos 21 etapas, cálculo de resultado em 19/20).
- SchemaDriven integra `EditorToolbar`, `FunnelStagesPanelUnified` e `RegistryPropertiesPanel`.
- ModularEditorPro usa `useOptimizedScheduler` para debounce de salvar/publicar e mantém centralização via `EditorProvider`.

## Recursos e diagnósticos

- EditorPro
  - `run21StepDiagnostic`, `runCompleteDiagnostics`.
  - `useCentralizedStepValidation`, `validateStep`.
  - `calculateAndSaveQuizResult` (etapas 19/20), hotkeys globais, notificações, eventos globais.
- SchemaDriven
  - Modo interativo (`QuizMainDemo`) e fallback para etapa 20 (`Step20EditorFallback`).
  - Toolbar moderna e propriedades via registry.
- ModularEditorPro
  - Toolbar modular, `EditorCanvas` desacoplado, `PropertiesColumn` integrado.
  - Agendamento otimizado via `useOptimizedScheduler`.

## Performance e complexidade

- EditorPro: maior complexidade e bundle, porém com lazy-load e caches; alta estabilidade do DnD.
- SchemaDriven: inicial mais leve; ótimo para iteração/preview rápido; menos diagnósticos.
- ModularEditorPro: código mais limpo e sustentável; precisa completar DnD provider para paridade.

## Como o UnifiedEditor escolhe

`src/components/editor/UnifiedEditor.tsx` tenta carregar primeiro o `EditorPro`. Se falhar, faz fallback para `SchemaDrivenEditorResponsive`.

Para forçar:
- Pro: garantir import de `@/legacy/editor/EditorPro` e/ou remover fallback.
- SchemaDriven: inverter ordem de import ou usar flag.

## Recomendações

- Precisa de DnD robusto e diagnósticos agora: usar EditorPro no /editor.
- Quer UI limpa/preview interativo rápido e aceita DnD básico: usar SchemaDriven.
- Caminho de evolução: adotar ModularEditorPro, integrar `StepDndProvider` e migrar features do Pro.

## Próximos passos sugeridos

- Adicionar `StepDndProvider` ao redor do `EditorCanvas` no ModularEditorPro.
- Padronizar barra superior (decidir entre `FunnelHeader` vs `EditorToolbar`).
- Adicionar flag `VITE_EDITOR_VARIANT=pro|modular|schema` para alternância no `UnifiedEditor`.
- Criar testes de fumaça e DnD (reordenar, inserir) por variante.

—
Última atualização: 2025-09-07
