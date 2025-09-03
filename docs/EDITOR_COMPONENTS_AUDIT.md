# Auditoria de Componentes do Editor (/editor)

Este documento mapeia os componentes disponíveis no editor principal, como são registrados, onde suas definições/props vivem, como são renderizados e quais são os mais completos para edição no caminho oficial do editor.

## Visão geral do editor principal

- Entrada: `src/pages/MainEditor.tsx` → carrega `SchemaDrivenEditorResponsive` dentro de `EditorProvider` e `QuizFlowProvider`.
- Editor: `src/components/editor/SchemaDrivenEditorResponsive.tsx`
  - Layout: `FourColumnLayout` com 4 colunas (Etapas | Componentes | Canvas | Propriedades).
  - Canvas: `CanvasDropZone.simple` + `SortableBlockWrapper.simple` (DnD, seleção, exclusão).
  - Propriedades: `EnhancedUniversalPropertiesPanelFixed` (painel unificado e fixo).
  - Fallback etapa 20: `Step20EditorFallback` (garante conteúdo mesmo sem blocos válidos).
- Estado: `EditorProvider` centraliza stepBlocks, seleção, ações (add/update/remove/reorder), import/export, integração Supabase.

## Pipeline de renderização (do clique até pintar)

1) Sidebar de componentes
- `ComponentsSidebar` dispara `onComponentSelect(type)`.
- Criação do bloco: `createBlockFromComponent(type)` (usa defaults do registro) + `actions.addBlock`.

2) Canvas do editor
- `CanvasDropZone.simple` organiza blocos com DnD-Kit; cada bloco é embrulhado por `SortableBlockWrapper.simple`.
- O conteúdo do bloco é renderizado via componente real do registro otimizado: `getOptimizedBlockComponent(type)`.

3) Painel de propriedades (edição)
- `EnhancedUniversalPropertiesPanelFixed` resolve o schema do bloco e renderiza campos (text, textarea, number, range, boolean, color, select, json, options-list), chamando `onUpdate` → `actions.updateBlock`.

4) Produção/preview (fora do editor)
- Páginas de execução usam `UniversalBlockRenderer` que também resolve o mesmo componente via `getOptimizedBlockComponent` e aplica propriedades de container/escala via `useContainerProperties`.

## Onde vivem as definições (registries e schemas)

- Registro otimizado de blocos (fonte de verdade para render):
  - `src/components/editor/blocks/EnhancedBlockRegistry.tsx`
  - Exporta: `ENHANCED_BLOCK_REGISTRY`, `getEnhancedBlockComponent(type)`, `normalizeBlockProperties(block)`, `AVAILABLE_COMPONENTS`.
  - Cobre 150+ tipos, com imports estáticos para blocos críticos (evita flash no canvas) e fallbacks por categoria.
- Wrapper do registro otimizado:
  - `src/utils/optimizedRegistry.ts` → `getOptimizedBlockComponent` + fallback de emergência.
- Schemas de propriedades para o painel (ordem de resolução):
  1) `src/config/blockPropertySchemas.ts` (universais + muitos tipos específicos, ex.: options-grid, button-inline, urgency-timer-inline, etc.)
  2) Fallback: `src/config/funnelBlockDefinitions.ts` (contém `propertiesSchema` legado para dezenas de blocos)
- Painel de propriedades unificado:
  - `src/components/universal/EnhancedUniversalPropertiesPanelFixed.tsx` → busca schema em `blockPropertySchemas` e, se faltar, recorre a `getBlockDefinition` (funnelBlockDefinitions). Mescla campos "universais" (grupo transform: scale, origin, classe) e aplica grupos/condições showIf.

Arquivos auxiliares relevantes:
- `src/core/blocks/registry.ts`: registro mínimo (usado por `createBlockFromComponent` para defaults).
- `src/types/editor.ts`: união dos BlockType e estruturas de conteúdo.
- `src/hooks/useContainerProperties.ts`: normaliza classes/estilos de container, aplicado no UniversalBlockRenderer.

## Componentes mais completos e estruturados (recomendados no /editor)

Critérios: presentes no `ENHANCED_BLOCK_REGISTRY`, com defaultProps, schemas no `blockPropertySchemas` (ou fallback no `funnelBlockDefinitions`), e boa integração Canvas/Propriedades/Render.

Top recomendados por categoria:

- Quiz (estrutura e perguntas)
  - quiz-intro-header
    - Definições: EnhancedBlockRegistry (import estático), schemas em `blockPropertySchemas` (cabeçalho) e em `funnelBlockDefinitions` (intro/header).
    - Motivo: componente crítico do Step 1, bem tipado, com propriedades de branding, progresso e layout.
  - options-grid
    - Definições: EnhancedBlockRegistry, schema rico em `blockPropertySchemas` (lista de opções, layout, seleção, visual e avançado).
    - Motivo: suporte completo a seleção única/múltipla, validação e estilos; editor de lista de opções dedicado.
  - button-inline
    - Definições: EnhancedBlockRegistry, schema detalhado em `blockPropertySchemas` (ação, estados, dependências de grid).
    - Motivo: integrações de validação com grid, presets visuais e estados de carregamento.
  - form-container e form-input
    - Definições: EnhancedBlockRegistry; schemas em `blockPropertySchemas`.
    - Motivo: base sólida para captura de dados (inclui variantes conectadas e validação).
  - progress-inline
    - Definições: EnhancedBlockRegistry; schemas em `blockPropertySchemas`.
    - Motivo: feedback visual de etapa com propriedades claras.

- Resultado/Oferta (Step 20/21)
  - result-header-inline
    - Definições: EnhancedBlockRegistry; schema em `funnelBlockDefinitions`; coberto por fallback da etapa 20.
    - Motivo: entrada principal do resultado com imagem/percentual e layout.
  - style-card-inline e style-cards-grid
    - Definições: EnhancedBlockRegistry; schemas em `blockPropertySchemas` (grid e card) e `funnelBlockDefinitions`.
    - Motivo: estrutura para estilo primário e secundários; edição fluida.
  - urgency-timer-inline, before-after-inline, testimonials, value-anchoring, secure-purchase, guarantee, mentor-section-inline
    - Definições: EnhancedBlockRegistry; schemas presentes em `blockPropertySchemas`.
    - Motivo: arsenal de conversão com propriedades de conteúdo, estilo e espaçamento bem modeladas.

- Conteúdo/Visual
  - text-inline, image-display-inline, decorative-bar-inline, heading-inline, spacer-inline
    - Definições: EnhancedBlockRegistry; schemas em `blockPropertySchemas`.
    - Motivo: blocos estáveis, simples e universais, com suporte a escala/margens.

Resumo curto (ordem sugerida na sidebar):
- quiz-intro-header, options-grid, button-inline, form-container, form-input, progress-inline
- result-header-inline, style-card-inline, style-cards-grid, urgency-timer-inline, testimonials, value-anchoring, secure-purchase, guarantee, mentor-section-inline
- text-inline, image-display-inline, decorative-bar-inline, heading-inline, spacer-inline

## Painel de propriedades: capacidades e tipos suportados

- Tipos de campo: text, textarea, number, range, boolean, color, select, json, options-list (com editor dedicado de itens com imagem, descrição, pontos, etc.).
- Regras: required, min/max/step, grupos (content/style/layout/behavior/spacing/transform), showIf simples (ex.: "prop === value").
- Extensões universais: scale/scaleX/scaleY, scaleOrigin, scaleClass; aplicadas visualmente via `UniversalBlockRenderer`.
- Ações rápidas: reset/quick presets de escala, exclusão e fechar painel.

## Como o canvas seleciona e renderiza

- DnD/Reordenar: `SortableBlockWrapper.simple` usa `@dnd-kit/sortable` e gera IDs únicos por etapa/posição.
- Seleção: hook `useStepSelection` trata seleção com debounce; wrapper captura pointer para evitar caret em cliques não interativos.
- Renderização no canvas: resolve componente via `getOptimizedBlockComponent`; o conteúdo é somente visual (edição acontece no painel de propriedades à direita).

## Gaps e recomendações

- Sidebar de Componentes: `ComponentsSidebar` usa uma lista estática reduzida; considerar alinhar com `AVAILABLE_COMPONENTS` do `EnhancedBlockRegistry` para ter uma única fonte de verdade.
- Registro legado vazio: `src/registry/quizComponentRegistry.ts` está vazio. Se não for usado, arquivar/remover ou preencher apontando para o registro otimizado.
- Duplicidade de schemas: há definições tanto em `blockPropertySchemas` quanto em `funnelBlockDefinitions`. Próximo passo saudável é consolidar schemas no arquivo de config unificado (mantendo fallback para compatibilidade).

## Como adicionar um novo componente (roteiro rápido)

1) Implementar o componente em `src/components/editor/blocks/<Nome>Block.tsx`.
2) Registrar no `ENHANCED_BLOCK_REGISTRY` (e, opcionalmente, em `AVAILABLE_COMPONENTS`).
3) Adicionar schema em `config/blockPropertySchemas.ts` (preferencial) ou em `config/funnelBlockDefinitions.ts` (legado de compatibilidade).
4) Garantir defaults em `core/blocks/registry.ts` se for usado pelo `createBlockFromComponent`.
5) Se precisar, estender `normalizeBlockProperties` para cobrir chaves típicas (title, subtitle, content, src, etc.).
6) Validar no /editor (canvas + painel) e, se aplicável, no preview/produção via `UniversalBlockRenderer`.

## Mapa rápido de arquivos (referência)

- Editor e estado
  - `src/pages/MainEditor.tsx`: Entrypoint do editor.
  - `src/components/editor/SchemaDrivenEditorResponsive.tsx`: layout, fallback step 20, orquestração.
  - `src/components/editor/EditorProvider.tsx`: estado, ações e persistência.
- Canvas / DnD
  - `src/components/editor/canvas/CanvasDropZone.simple.tsx`: drop principal e virtualização condicional.
  - `src/components/editor/canvas/SortableBlockWrapper.simple.tsx`: wrapper do bloco com drag handle e seleção.
- Registries / render
  - `src/components/editor/blocks/EnhancedBlockRegistry.tsx`: registro principal de blocos.
  - `src/utils/optimizedRegistry.ts`: acesso com cache e fallback.
  - `src/components/editor/blocks/UniversalBlockRenderer.tsx`: render universal para produção/preview.
- Propriedades
  - `src/components/universal/EnhancedUniversalPropertiesPanelFixed.tsx`: painel unificado.
  - `src/config/blockPropertySchemas.ts`: schemas recomendados.
  - `src/config/funnelBlockDefinitions.ts`: schemas legados (fallback).

---

Em caso de dúvidas sobre um tipo específico, procure primeiro no `EnhancedBlockRegistry`, depois verifique o schema correspondente em `blockPropertySchemas`. Esses dois arquivos cobrem a maior parte do fluxo de edição no /editor.
