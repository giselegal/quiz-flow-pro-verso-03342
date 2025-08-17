🎯 CORREÇÃO URGENTE: Editor de Etapas do Funil

PROBLEMA: Navegação entre etapas não funciona. Usuário clica em etapa mas vê blocos de outras etapas.

CAUSA: Filtro sortedBlocks não filtra por stepId corretamente + dependência desnecessária do Supabase.

CORREÇÕES ESPECÍFICAS:

1. EM SchemaDrivenEditorResponsive.tsx - CORRIGIR handleAddBlock:

```typescript
// ADICIONAR stepId aos blocos SEMPRE
if (newBlockId) {
  setTimeout(() => {
    updateBlock(newBlockId, { stepId: selectedStepId });
  }, 50);
}
```

2. EM sortedBlocks - CORRIGIR filtro:

```typescript
const stepBlocks = blocks.filter(block => {
  if (block.stepId) {
    return block.stepId === selectedStepId; // APENAS da etapa atual
  }
  return selectedStepId === 'etapa-1'; // Fallback
});
```

3. EM useEffect - PRIORIZAR dados locais:

```typescript
// SEMPRE carregar stepTemplateService primeiro
const serviceSteps = stepTemplateService.getAllSteps();
setSteps(serviceSteps);
setSelectedStepId('etapa-1');

// Supabase opcional em background
```

4. CRIAR src/hooks/useHistory.ts:

```typescript
export const useHistory = <T>(initialState: T) => {
  // implementação básica de undo/redo
};
```

TESTE: Após correção, clicar em "Etapa 2" deve mostrar APENAS blocos da Etapa 2.

PRIORIDADE: CRÍTICA - Editor principal não funciona.
