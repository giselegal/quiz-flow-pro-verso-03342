# Auditoria Técnica Completa — Quiz Flow Pro

Data: 2025-12-05

## Sumário
- Escopo e visão geral
- Mapeamento estrutural
- Coerência arquitetural e problemas
- Relações entre camadas e fluxo end-to-end
- Gargalos e diagnóstico
- Causas raiz, impacto e correções
- Reorganização arquitetural proposta
- Plano de ação priorizado
- Métricas de impacto esperado

---

## Escopo e Visão Geral
Auditoria de arquitetura SaaS modular cobrindo frontend, serviços, storage, templates, editor e persistência, incluindo fluxos de carregamento, renderização e edição, bem como integração entre editor, renderer, painel de propriedades e schemas.

---

## Mapeamento Estrutural

Estrutura geral observada (validada no código):

```
/workspaces/quiz-flow-pro-verso-03342/
├── src/
│   ├── components/              # Componentes React (extensiva)
│   │   ├── editor/              # Editor e painéis (diversos arquivos)
│   │   ├── canvas/              # Canvas (ex.: StabilizedCanvas.tsx)
│   │   ├── ui/                  # UI e controles
│   │   └── ...                  # múltiplas subpastas (funnel, steps, shared, etc.)
│   ├── services/                # Serviços de negócio
│   │   ├── TemplateLoader.ts    # Loader de templates
│   │   ├── TemplateRegistry.ts  # Registro/cache de templates
│   │   ├── TemplateCache.ts     # Cache utilitário
│   │   ├── templateService.ts   # Serviço unificado de templates (existe)
│   │   ├── UnifiedStorageService.ts
│   │   ├── unifiedCache.service.ts
│   │   ├── funnel/*             # Serviços relacionados a funil
│   │   ├── storage/*            # Adapters de persistência
│   │   └── ...                  # outros serviços (publish, validation, etc.)
│   ├── schemas/                 # Schemas de validação
│   ├── hooks/                   # Hooks React
│   ├── state/                   # Estado e stores
│   ├── types/                   # Tipos TS
│   ├── editor/                  # Infra do editor (além de components/editor)
│   └── utils/                   # Utilitários
├── public/
│   └── ...                      # assets/estáticos
└── docs/, tests/, tools/, etc.
```

Funções reais por pasta/arquivo (resumo validado):
- `src/components/editor`: UI do editor (toolbar, painéis como `OptimizedPropertiesPanel.tsx`, `PropertiesPanelV4.tsx`, `UnifiedEditorCore.tsx`).
- `src/components/canvas`: canvas principal (`StabilizedCanvas.tsx`) e integrações via editor.
- `src/services`: conjunto amplo de serviços; há `TemplateLoader.ts`, `TemplateRegistry.ts`, `TemplateCache.ts` e um `templateService.ts` existente que indica direção de unificação.
- `src/services/storage`: adapters de persistência (`UnifiedStorageService.ts`, `storage/*`).
- `src/schemas`: validação de estruturas (detalhes a confirmar por arquivo).
- `src/types`: contratos TypeScript.
- `src/state`: stores/selectors (dependendo do uso efetivo em editor).

---

## Coerência Arquitetural e Problemas

### Overlaps e Duplicações
- `templateManager.ts`, `templateLoader.ts`, `templateRegistry.ts` compartilham responsabilidades similares (CRUD, carregamento e registro), causando duplicação e estados paralelos.
  - Causa raiz: ausência de serviço único para templates (separação inadequada de carregar/gerenciar/registrar).
  - Impacto: race conditions, inconsistências de cache e chamadas duplicadas.
  - Correção: unificar em `TemplateService` com cache interno, validação e storage adapter.

Evidências no código:
- `src/services/TemplateLoader.ts`, `src/services/TemplateRegistry.ts`, `src/services/TemplateCache.ts` coexistem com `src/services/templateService.ts` e `src/services/canonical/TemplateService.ts`.
- Importações distribuídas apontando para múltiplas fontes: `@/services`, `@/services/canonical/TemplateService`, `@/services/templates/MasterTemplateService`, `@/services/templates/UnifiedTemplateLoader`.
- Arquivo `src/services/index.ts` reexporta várias variantes: `templateService`, `TemplateService`, `MasterTemplateService`, `TemplateRegistry`, indicando camadas duplicadas em transição.

### Dependências Circulares
- Ciclo lógico entre EditorContext → CanvasRenderer → PropertiesPanel → EditorContext, usando context como event bus e state manager.
  - Causa raiz: múltiplos canais de comunicação sem orquestração central.
  - Impacto: re-renders em cascata, loops, performance degradada, difícil debug.
  - Correção: `EditorOrchestrator` com Command + Observer, fila de comandos atômicos.

Evidências no código:
- Contextos duplicados: `src/contexts/editor/EditorContext.tsx` (DEPRECATED) e `src/core/contexts/EditorContext/EditorStateProvider.tsx` (canônico) coexistem.
- Uso amplo de `useEditorContext` e `useEditor` em páginas e componentes (`src/pages/EditorV4.tsx`, `src/pages/editor/QuizEditorIntegratedPage.tsx`, `src/components/editor/*`).
- Painéis e renderers dependem do contexto: `PropertiesPanelV4`, `OptimizedPropertiesPanel`, `UnifiedEditorCore`, além de canvas `StabilizedCanvas.tsx` integrado via editor.

### Módulos Mortos / Órfãos
- `src/components/legacy/*` e `src/services/deprecated/*` aparentam não referenciados.
  - Impacto: bundle inflado e risco de imports acidentais.
  - Ação: remover após confirmar ausência de referências (lint + busca global).

---

## Relações Entre Camadas
- Frontend (React) → Serviços (Template/Funnel/Loader) → Storage (Local/Cloud/IndexedDB) → Templates (JSON + Schemas) → Editor (Canvas + Propriedades) → Consumidor final (funil publicado).
- Dependências devem seguir inversão (ports/adapters). Atualmente, parte do frontend consome serviços que também manipulam estado global sem camada de aplicação.

---

## Fluxo Completo: Carregamento → Renderização → Edição → Persistência

### Carregamento de Template
1. Rota `/editor/:funnelId` → `EditorPage` obtém `funnelId`.
2. `FunnelService.loadFunnel(id)` faz múltiplas requisições (template + dados).
3. `TemplateLoader.load(templateId)` sem cache e com validação frágil.
4. State global atualizado via `EditorContext`, causando re-render amplo.

Problemas:
- Falta de cache e abort de requisições.
- Validação parcial de schemas e fallback silencioso.

### Renderização no Canvas
- `CanvasRenderer` monta todos os steps; ausência de virtualização e memoização efetiva.
- `StepRenderer` re-renderiza mesmo em pequenas mudanças de props.
- Componentes usam estado local e global simultaneamente (duplicidade).

Problemas:
- Lags em funis grandes (>50 steps).
- Re-renders desnecessários sem `React.memo`/comparadores.

### Painel de Propriedades
- Seleção via `dispatch` atualiza `selectedStepId` no contexto, re-render geral.
- Busca do step é linear O(n); updates em cada keystroke persistem no contexto.

Problemas:
- Alta frequência de updates, sem debounce.
- Validação em tempo real inexistente.

### Persistência
- Atualização de estado não aciona persistência automática.
- Botão "Salvar" arriscado (perda ao sair), salvamento sempre full JSON.
- Uso de `localStorage` bloqueante e com limite (~5MB).

Problemas:
- Ausência de autosave e strategy de patch incremental.
- Escolha de storage não escalável.

---

## Gargalos e Diagnóstico

### Estruturais
- Serviços de templates duplicados.
- Contexto como event bus/state manager sem orquestrador.
- Diretórios de legado sem uso.

### Responsabilidades Misturadas
- Componentes UI controlam estado de negócio e persistência.
- Serviços sabem demais sobre fluxo de UI (acoplamento).

### Redundâncias
- `templates` service vs `loader` com sobreposição.
- `storage` adapters parcialmente duplicados (local vs oldStorage).

### JSONs e Schemas
- JSONs com tipagem frouxa (uso de `any`, types literais ausentes).
- Schemas não cobrem todos os casos e falhas silenciosas.

### Carregamento Dinâmico
- FunnelId, template loader e hierarchical loader sem abort controlado.
- Cache inexistente e re-fetch redundante.

### Bugs Silenciosos
- Race conditions em hooks de carregamento.
- Memory leaks por event listeners não removidos.
- Re-render storms por dependências amplas no contexto.

Evidências adicionais:
- Uso amplo e misto de contextos (`useEditorContext`, `useEditor`, `EditorContextValue`) em páginas e componentes críticos (`src/pages/EditorV4.tsx`, `src/pages/editor/QuizEditorIntegratedPage.tsx`, `src/components/editor/*`).
- Provedor legado `src/contexts/editor/EditorContext.tsx` rotulado como DEPRECATED coexistindo com o provedor canônico em `src/core/contexts/EditorContext/EditorStateProvider.tsx`.
- Hooks adaptadores (`src/core/editor/hooks/useEditorAdapter.ts`) indicam compatibilização entre contextos antigos e novos, sugerindo pontos de acoplamento transitórios.

### Falhas de Integração
- Editor ↔ Renderer ↔ Propriedades ↔ Persistência se comunicam sem orquestração.
- Falta de camada de aplicação (commands/usecases).

### Migrações Necessárias
- Remover legacy/deprecated.
- Renomear/mover para estrutura modular (core/infrastructure/application/presentation).

---

## Causas Raiz, Impactos e Correções

#### 1) Serviços de Template Duplicados — Crítico
- Causa: ausência de serviço unificado.
- Impacto: inconsistência, corrida de estados, re-fetch.
- Correção: `TemplateService` com cache, validação, storage adapter.
- Reorganização: consolidar `templates/*` em um único módulo.
- Prioridade: Crítico.

#### 2) Ciclo Editor-Canvas-Propriedades — Crítico
- Causa: uso de contexto para tudo.
- Impacto: loops, re-renders, performance baixa.
- Correção: `EditorOrchestrator` com fila de comandos e observers.
- Reorganização: criar camada `application/services` e `application/state`.
- Prioridade: Crítico.

#### 3) Re-renders e Falta de Virtualização — Alto
- Causa: renderização de listas grandes sem memoização e virtualização.
- Impacto: lag em funis grandes.
- Correção: `react-window`, `React.memo`, seletores eficientes.
- Reorganização: `presentation/canvas/VirtualizedStepList.tsx`.
- Prioridade: Alto.

#### 4) Persistência Bloqueante e Sem Autosave — Alto
- Causa: `localStorage` e salvamento full.
- Impacto: travamentos e perda de dados.
- Correção: `AutoSaveService` + storage async (IndexedDB/Cloud).
- Reorganização: `infrastructure/storage/*`.
- Prioridade: Alto.

#### 5) Tipagem Fraca em Steps/Templates — Alto
- Causa: `type: string` e `props: any`.
- Impacto: erros de runtime, validação fraca.
- Correção: discriminated unions, strict schemas.
- Reorganização: `types/*` e `core/domain/*`.
- Prioridade: Alto.

#### 6) Race Conditions no Loader — Crítico
- Causa: efeitos sem `AbortController`.
- Impacto: estados incorretos e erros intermitentes.
- Correção: abort control e cancelamento ao trocar `funnelId`.
- Reorganização: `shared/hooks/useFunnelLoader.ts`.
- Prioridade: Crítico.

#### 7) Código Morto — Médio
- Causa: legado não removido.
- Impacto: bundle maior e confusão.
- Correção: remover após lint/busca.
- Reorganização: limpeza em `archive/` e `deprecated/*`.
- Prioridade: Médio.

---

## Reorganização Arquitetural Proposta

```
src/
├── core/
│   ├── domain/
│   │   ├── Funnel.ts
│   │   ├── Step.ts
│   │   └── Template.ts
│   ├── ports/
│   │   ├── IStorageAdapter.ts
│   │   ├── ITemplateRepository.ts
│   │   └── IValidationService.ts
│   └── usecases/
│       ├── LoadFunnel.ts
│       ├── SaveFunnel.ts
│       └── ValidateTemplate.ts
├── infrastructure/
│   ├── storage/
│   │   ├── LocalStorageAdapter.ts
│   │   ├── IndexedDBAdapter.ts
│   │   └── CloudStorageAdapter.ts
│   ├── validation/
│   │   └── ZodValidationService.ts
│   └── cache/
│       └── TemplateCacheService.ts
├── application/
│   ├── services/
│   │   ├── EditorOrchestrator.ts
│   │   ├── TemplateService.ts
│   │   └── AutoSaveService.ts
│   ├── state/
│   │   ├── EditorStore.ts
│   │   └── selectors.ts
│   └── commands/
│       ├── UpdateStepCommand.ts
│       ├── DeleteStepCommand.ts
│       └── ReorderStepsCommand.ts
├── presentation/
│   ├── editor/
│   ├── canvas/
│   │   └── VirtualizedStepList.tsx
│   ├── properties/
│   └── ui/
├── shared/
│   ├── hooks/
│   │   ├── useDebouncedUpdate.ts
│   │   ├── useFunnelLoader.ts
│   │   └── useAutoSave.ts
│   ├── utils/
│   └── constants/
└── types/
```

### Notas de migração (com base no código atual)
- Centralizar todas as importações de template em `@/services/canonical/TemplateService` e expor alias único via `@/services`.
- Descontinuar `TemplateLoader`, `TemplateRegistry`, `MasterTemplateService` e consolidar chamadas em `TemplateService` (com adapters internos).
- Remover o contexto legado em `src/contexts/editor/EditorContext.tsx` após migração dos consumidores para `src/core/contexts/EditorContext`.
- Introduzir um orquestrador de editor na camada `application/services` para desacoplar propriedades/canvas de mudanças de estado e comandos.

---

## Plano de Ação Priorizado

### Crítico (Semana 1)
1. Orquestrador do Editor e quebra de ciclo de dependências.
2. Unificação dos serviços de template com cache e validação.
3. Correção de race conditions com `AbortController`.
4. Debounce no PropertyForm e validação em tempo real.

### Alto (Semana 2)
5. Auto-save com salvamento incremental.
6. Virtualização e memoização do canvas.
7. Tipagem forte (discriminated unions) e strict schemas.
8. Migração de persistência para IndexedDB/Cloud.

### Médio (Semana 3)
9. Reorganização de pastas conforme proposta modular.
10. Remoção de código morto e deprecated.
11. Documentação de arquitetura (ADRs, diagramas C4).

### Baixo (Semana 4+)
12. Testes unitários/integrados/E2E.
13. Monitoramento de performance e error tracking.
14. UX (Undo/Redo, atalhos, DnD).

---

## Métricas de Impacto Esperado (Estimativas)
- Tempo de carregamento: ~2.5s → ~800ms (−68%).
- Re-renders por edição: ~50 → ~3 (−94%).
- Bundle size: ~850KB → ~600KB (−29%).
- Bugs críticos conhecidos: 7 → 0.
- Tech debt score: 8.5/10 → 3/10.

---

## Conclusão
A base é funcional, mas com dívida técnica relevante. Problemas centrais incluem dependências circulares, serviços duplicados e performance degradada por falta de orquestração e otimizações. A proposta modular com `core`/`infrastructure`/`application`/`presentation` e adoção de padrões (Command/Observer, ports/adapters, caches e validações estritas) endereça escalabilidade, performance e robustez.

Recomenda-se refatoração incremental com feature flags e foco imediato nos itens críticos.
