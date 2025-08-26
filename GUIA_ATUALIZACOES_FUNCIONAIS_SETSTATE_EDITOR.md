# Guia: Atualizações funcionais de estado no Editor (prevenção de sobrescrita)

Data: 2025-08-26 • Branch: dnd-good

## Contexto e sintoma

- Sintoma: ao soltar um componente no /editor (DnD), o bloco aparecia momentaneamente e “sumia” ou a reordenação não persistia.
- Efeito colateral observado: logs de “FORCE RELOAD TEMPLATE”/carregamento de etapa e merges posteriores pareciam desfazer a inserção/reordenação.

## Causa raiz

- Uso de `setState` não-funcional (capturando `rawState` em closures) dentro do `EditorProvider.tsx`, combinado com efeitos/merges assíncronos (`ensureStepLoaded`, `loadSupabaseComponents`) e o histórico via `useHistoryState` que inicialmente só aceitava estado absoluto.
- Resultado: condições de corrida onde um `setState({ ...rawState, ... })` tardio sobrescrevia o estado que já continha a inserção/reordenação feita pelo DnD.

## Correção aplicada

1. `useHistoryState.setPresent` passou a aceitar atualizador funcional: `setPresent(next | (prev) => next)`, evitando dependência de snapshots obsoletos.
2. `EditorProvider.tsx` passou a usar apenas `setState(prev => ({ ...prev, ... }))` em:
   - addBlock, addBlockAtIndex, removeBlock, reorderBlocks, updateBlock
   - merges de template/Supabase (`ensureStepLoaded`, `loadSupabaseComponents`)
   - trocas de etapa/seleção
3. Merges sempre baseados em `prev.stepBlocks` + utilitário `mergeStepBlocks` (não-destrutivo por ID), evitando perda de blocos recém-adicionados.

## Padrões obrigatórios (Do/Don’t)

- Do: usar atualizador funcional para qualquer mudança de estado do editor:
  - `setState(prev => ({ ...prev, stepBlocks: { ...prev.stepBlocks, [k]: lista } }))`
- Do: ao mesclar dados externos (template/Supabase), sempre:
  - `setState(prev => ({ ...prev, stepBlocks: mergeStepBlocks(prev.stepBlocks, incoming) }))`
- Don’t: usar `setState({ ...rawState, ... })` dentro de callbacks/efeitos, especialmente após `await`s.
- Don’t: “restaurar” estado com `setState(rawState)` em catch; prefira correções pontuais usando `prev`.

## Áreas críticas a observar

- `src/components/editor/EditorProvider.tsx`
  - Ações: `addBlock`, `addBlockAtIndex`, `removeBlock`, `reorderBlocks`, `updateBlock`
  - Efeitos/merges: `ensureStepLoaded`, `loadSupabaseComponents`
- `src/hooks/useHistoryState.ts`
  - `setPresent` deve aceitar função `(prev) => next`.

## Checklist de PR (copiar/colar)

- [ ] Nenhum `setState({ ...rawState, ... })` em `EditorProvider.tsx`
- [ ] Todos os merges usam `prev => mergeStepBlocks(prev.stepBlocks, incoming)`
- [ ] `useHistoryState.setPresent` suportando atualizador funcional
- [ ] DnD: adicionar e reordenar funcionam sem desaparecer após efeitos
- [ ] DnDMonitor: Over/Pos/Ação coerentes; sem “fallback-add-final” indevido

## Verificação rápida (QA)

1. Ativar overlay de debug (se disponível) e arrastar um item da sidebar para um slot intermediário.
   - Esperado: Over=drop-zone-X, Ação=add, bloco permanece no índice X.
2. Reordenar um bloco existente.
   - Esperado: Ação=reorder, ordem persiste após qualquer reload/merge.

## Regressões comuns e como detectar

- Sinais: logs de “FORCE RELOAD TEMPLATE” seguidos de sumiço/reordenação revertida.
- Causa provável: novo uso de `setState` não-funcional em algum efeito/callback.
- Ação: substituir por atualizador funcional e revalidar com o overlay.

## Arquivos tocados (referência)

- `src/hooks/useHistoryState.ts`: `setPresent` funcional
- `src/components/editor/EditorProvider.tsx`: operações migradas para `setState(prev => ...)`

---

Objetivo: garantir que o DnD do Editor seja determinístico e imune a sobrescritas por efeitos concorrentes.
