# Plano de Remoção do EditorProviderCanonical → Migração para SuperUnifiedProvider

Objetivo: Remover completamente `EditorProviderCanonical` e migrar todos os consumidores para `SuperUnifiedProvider` sem regressões.

Resumo do estado atual
- `EditorProviderCanonical` está marcado como deprecated e serve majoritariamente como wrapper/compat de `SuperUnifiedProvider`.
- A rota `/editor` já usa `SuperUnifiedProvider` diretamente (`src/pages/editor/index.tsx`).
- Há usos legacy espalhados importando `EditorProviderCanonical`, `useEditor`, `EditorContextValue` etc.

Arquivos impactados (detecção via grep)
- Hooks e páginas que importam do provider canônico:
  - `src/hooks/useEditorHistory.ts`
  - `src/hooks/useUnifiedEditor.ts`
  - `src/hooks/useEditorWrapper.ts`
  - `src/hooks/useEditor.ts`
  - `src/hooks/useTemplateLoader.ts`
  - `src/hooks/useEditorIntegration.ts`
  - `src/lib/tools/debug/DebugStep02.tsx`
  - `src/pages/QuizIntegratedPage.tsx`
  - `src/pages/MainEditorUnified.new.tsx`
  - `src/pages/editor/QuizEditorIntegratedPage.tsx`
  - `src/contexts/editor/useEditorSelector.ts`

Provider destino e API consolidada
- Provider: `src/contexts/providers/SuperUnifiedProvider.tsx`
- Hook: `useSuperUnified()` retorna `SuperUnifiedContextType`
- Principais mapeamentos de API:
  - Navegação de etapas:
    - was: `actions.setCurrentStep(step)` → now: `setCurrentStep(step)`
  - Seleção de bloco:
    - was: `actions.setSelectedBlockId(id)` → now: `setSelectedBlock(id)`
  - Blocos (por etapa):
    - was: `actions.addBlock(stepKey, block)` → now: `addBlock(stepIndex, block)`
    - was: `actions.updateBlock(stepKey, id, updates)` → now: `updateBlock(stepIndex, id, updates)`
    - was: `actions.removeBlock(stepKey, id)` → now: `removeBlock(stepIndex, id)`
    - was: `actions.reorderBlocks(stepKey, from, to)` → now: `reorderBlocks(stepIndex, blocks[])`
    - was: `actions.ensureStepLoaded(step)` → now: carregar via `hierarchicalTemplateSource` e `setStepBlocks` (já abstraído no provider)
  - Estado do editor:
    - was: `state.selectedBlockId` → now: `state.editor.selectedBlockId`
    - was: `state.currentStep` → now: `state.editor.currentStep`
    - was: `state.stepBlocks["step-01"]: Block[]` → now: `state.editor.stepBlocks[1]: any[]`
      - Nota: No canônico a chave era string `step-01`; no SuperUnified é índice numérico. Converter via `stepIndex = parseInt(stepId.slice(-2), 10)`.
  - Persistência e publicação:
    - now: `saveFunnel()`, `saveStepBlocks(stepIndex)`, `ensureAllDirtyStepsSaved()`, `publishFunnel()`

Checklist de migração (semântica + mecânica)
1) Substituir imports:
   - de `@/components/editor/EditorProviderCanonical` para:
     - `SuperUnifiedProvider` (quando envolver árvore)
     - `useSuperUnified` (quando só consumir contexto)
     - Remover tipos `EditorContextValue` e alinhar chamadas aos métodos do `SuperUnifiedContextType`.

2) Mapear props e state:
   - `selectedBlockId` → `state.editor.selectedBlockId`
   - `currentStep` → `state.editor.currentStep`
   - `stepBlocks` com string key → `editor.stepBlocks` com índice numérico. Introduzir util `stepIdToIndex("step-01") => 1` sempre que necessário.

3) Atualizar operações de bloco:
   - Onde havia `(stepKey: string)` substituir por `(stepIndex: number)` com conversão quando origem for `step-XX`.
   - Para reordenação: gerar `blocks[]` com `order` atualizado e chamar `reorderBlocks(stepIndex, blocks)`.

4) Remover wrappers legados:
   - `useEditor()` legado → substituir por `useSuperUnified()` e adaptar acessos/métodos.
   - `EditorProviderCanonical`/`EditorProvider` wrappers não usados em `/editor` podem ser removidos após 100% dos imports migrarem.

5) Validação e testes:
   - Rodar grep para garantir zero imports de `EditorProviderCanonical`.
   - Executar smoke manual: abrir `/editor`, navegar entre steps, adicionar/editar/remover blocos, publicar (mock/offline ok).

Plano de execução (PRs pequenos e reversíveis)
- PR 1: Substituir imports e hooks em `hooks/*` (sem páginas) com util de conversão `stepIdToIndex` local.
- PR 2: Atualizar páginas `pages/*` e componentes debug que ainda importam o canônico.
- PR 3: Remover `EditorProviderCanonical.tsx` e tipos associados; adicionar nota em `CHANGELOG.md`.

Snippet util (a ser criado quando necessário)
```ts
export const stepIdToIndex = (stepId: string) => {
  const m = stepId.match(/step-(\d{1,2})$/);
  return m ? parseInt(m[1], 10) : 1;
};
```

Riscos e mitigação
- Diferença de chave de etapa (string vs número): padronizar conversão próxima ao callsite.
- Undo/Redo: já integrado em `SuperUnifiedProvider` via `useUnifiedHistory`.
- Persistência Supabase desativada: provider lida com modo offline; testes não quebram.

Aceite do plano
- Critério de pronto: zero referências a `EditorProviderCanonical` no repo e `/editor` funcionando com operações básicas.
