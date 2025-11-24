# 🏗️ ARQUITETURA DO PROJETO (Estado Atual)

## Visão Geral
Arquitetura consolidada com provider unificado do Editor, renderização modular compartilhada entre Editor/Runtime e fontes canônicas de template. O foco é manter preview e produção alinhados, evitando fetches desnecessários em preview.

## Camadas
```
UI (Modular Steps) → Renderers (UnifiedStepRenderer) → Providers/Hooks (EditorProviderUnified, useQuizState, useComponentConfiguration) → Services (Template/Config) → Data Layer (Supabase/Cache)
```

## Provider Principal: EditorProviderUnified
- Arquivo: `src/components/editor/EditorProviderUnified.tsx`
- Hook de acesso: `useEditor()` (alias: `useOptimizedEditor`), e versão opcional `useEditor({ optional: true })`
- Estado exposto (resumo):
	- `stepBlocks: Record<string, Block[]>`
	- `currentStep: number`
	- `selectedBlockId: string | null`
	- `stepValidation: Record<number, boolean>`
	- `isLoading: boolean`
	- `databaseMode: 'local' | 'supabase'`
- Ações chave:
	- Navegação/seleção: `setCurrentStep(step)`, `setSelectedBlockId(id)`
	- Blocos: `addBlock(stepKey, block)`, `addBlockAtIndex(stepKey, block, index)`, `removeBlock(stepKey, id)`, `reorderBlocks(stepKey, from, to)`, `updateBlock(stepKey, id, updates)`
	- Carregamento de etapa: `ensureStepLoaded(step)`
	- Template padrão: `loadDefaultTemplate()`
	- Histórico: `undo()`, `redo()`, `canUndo`, `canRedo`
	- Import/Export: `exportJSON()`, `importJSON(json)`

Observação: `ensureStepLoaded(step)` é o contrato para garantir que uma etapa esteja carregada e pronta no canvas/preview.

### Camada de Compatibilidade Temporária (EditorStateProvider)
Para reduzir >60 erros de tipagem entre implementações antigas (`EditorContextType` dependente de `state` e `actions`) e o novo modelo simplificado, foi introduzido no arquivo `src/contexts/editor/EditorStateProvider.tsx` um valor de contexto híbrido que expõe:

```
// Acesso legado (flat)
currentStep, stepBlocks, addBlock(...), updateBlock(...)

// Acesso canonical (novo + back-compat)
state: EditorState
actions: {
	setCurrentStep, selectBlock, addBlock, updateBlock, removeBlock, reorderBlocks,
	togglePreview, toggleEditing, toggleDrag, copyBlock, pasteBlock,
	setStepBlocks, markSaved, markModified, addValidationError,
	clearValidationErrors, resetEditor, getStepBlocks, isStepDirty
}
```

Benefícios:
- Evita refatoração em massa imediata de componentes que usam `context.state.X`
- Permite migração incremental para o formato canonical (`state` / `actions`)
- Elimina necessidade de duplicar providers simultâneos para o Editor

Plano de Migração:
1. Novos componentes usam apenas `state` e `actions`.
2. Componentes existentes que acessam propriedades flat permanecem funcionando sem alteração.
3. Fase final: remover exposição flat após 100% de adoção (registrar progresso em `PROJECT_STATUS.md`).

Garantias:
- Nenhum `@ts-nocheck` adicionado.
- Tipos consolidados sem quebra de runtime.
- Build validado pós alteração (`npm run build`).

## Renderização Modular Compartilhada
- Módulo compartilhado: `src/components/quiz-modular/index.ts`
- Componentes reexportados (usados tanto no Editor quanto na Produção):
	- `ModularIntroStep`, `ModularQuestionStep`, `ModularStrategicQuestionStep`, `ModularTransitionStep`, `ModularResultStep`, `ModularOfferStep`
- Renderização unificada: `UnifiedStepRenderer` (orquestração de passos e adaptação de props)

## App de Produção/Preview
- Arquivo: `src/components/quiz/QuizAppConnected.tsx`
- Aceita `initialConfig` e `previewMode` para operar offline no preview
- Em preview/editor, prioriza `initialConfig` (ou Registry) e evita chamadas de API de configuração
- Sincroniza etapa ativa via `initialStepId` quando embutido no Editor

## Configurações de Componentes (sem fetch no Preview)
- Hook: `src/hooks/useComponentConfiguration.ts`
- Comportamento:
	- Cache primeiro (`configurationCache`)
	- Modo preview: quando `editorMode=true`, carrega `defaultProperties` da definição e NÃO chama `getConfiguration()` (nem `fetch`)
	- Produção: consulta armazenamento real (Supabase) via `ConfigurationAPI`

## Fonte Canônica de Template
- Arquivo: `src/templates/imports.ts`
- Garantias testadas em: `src/tests/templates/canonicalSource.test.ts`
- Serviços usam `HybridTemplateService` com `_source = 'ts'`

## Performance (meta e práticas)
- Evitar fetch em preview (testado automaticamente)
- Code splitting e memoização nos steps modulares
- Cache por camada (Templates/Config)

## Métricas e Qualidade
- Nenhum `@ts-nocheck` novo
- Provider de Editor unificado em uso
- Testes: cobertura para fonte canônica e preview sem fetch

Para detalhes operacionais, ver também: UNIFIED_QUIZ_ARCHITECTURE.md.
