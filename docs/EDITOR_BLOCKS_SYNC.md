# 🔄 Sincronização de Blocos Editor → QuizModularProductionEditor

## Como Funciona

### Fluxo de Inicialização

```
1. User abre /editor?template=quiz21StepsComplete
   ↓
2. EditorRoutes monta com UnifiedCRUDProvider + EditorProviderUnified
   ↓
3. EditorProviderUnified executa useEffect de inicialização
   ↓
4. Verifica se há blocos carregados
   ↓
5. Se não, chama initializeAllStepBlocks()
   ↓
6. Converte 21 steps do template em ~120-150 blocos
   ↓
7. Popula state.blocks + state.blocksByStep
   ↓
8. QuizModularProductionEditor detecta mudança via useEffect
   ↓
9. Converte blocksByStep → EditableQuizStep[]
   ↓
10. Renderiza steps com BlockBasedStepRenderer
```

## Código de Sincronização

### Em QuizModularProductionEditor.tsx

```typescript
useEffect(() => {
  // 🎯 SINCRONIZAR COM EDITOR PROVIDER
  if (editorCtx?.state?.blocks && editorCtx.state.blocks.length > 0) {
    console.log('✅ Sincronizando steps com blocos do EditorProvider');
    
    // Converter blocksByStep para steps
    const stepsFromBlocks: EditableQuizStep[] = [];
    const blocksByStep = editorCtx.state.blocksByStep || {};
    
    Object.keys(blocksByStep).sort().forEach((stepId, index) => {
      const stepNumber = parseInt(stepId.replace('step-', ''), 10);
      const blockIds = blocksByStep[stepId] || [];
      const stepBlocks = blockIds
        .map(id => editorCtx.state.blocks?.find(b => b.id === id))
        .filter((b): b is any => b !== undefined);
      
      // Determinar tipo do step
      let stepType: EditableQuizStep['type'] = 'question';
      if (stepNumber === 1) stepType = 'intro';
      else if (stepNumber === 20) stepType = 'result';
      else if (stepNumber === 21) stepType = 'offer';
      else if (stepNumber === 15) stepType = 'transition';
      
      stepsFromBlocks.push({
        id: stepId,
        order: index,
        type: stepType,
        blocks: stepBlocks,
        metadata: {
          title: `Step ${stepNumber}`,
          description: `Step ${stepNumber} with ${stepBlocks.length} blocks`
        }
      });
    });
    
    if (stepsFromBlocks.length > 0) {
      setSteps(stepsFromBlocks);
      if (!selectedStepId && stepsFromBlocks[0]) {
        setSelectedStepId(stepsFromBlocks[0].id);
      }
      setIsLoading(false);
      return; // Sucesso - não executar fallback
    }
  }
  
  // FALLBACK: Carregar do template legacy se não houver blocos
  // ... código existente
}, [editorCtx?.state?.blocks]); // Re-executa quando blocos mudarem
```

## Mapeamento Step Number → Type

| Step Number | Step Type | Descrição |
|-------------|-----------|-----------|
| 1 | `intro` | Página de introdução com nome |
| 2-14 | `question` | Perguntas de múltipla escolha |
| 15 | `transition` | Transição antes das estratégicas |
| 16-19 | `strategic-question` | Perguntas estratégicas |
| 20 | `result` | Resultado calculado |
| 21 | `offer` | Oferta final |

## Estrutura de Dados

### EditorProvider State
```typescript
{
  blocks: [
    {
      id: 'step-01-logo-0',
      stepId: 'step-01',
      type: 'image-inline',
      order: 0,
      content: { url: '...', alt: 'Logo' },
      properties: {}
    },
    {
      id: 'step-01-title-1',
      stepId: 'step-01',
      type: 'heading-inline',
      order: 1,
      content: { text: 'Chega de um guarda-roupa...' },
      properties: {}
    }
    // ... ~120-150 blocos totais
  ],
  
  blocksByStep: {
    'step-01': ['step-01-logo-0', 'step-01-title-1', ...],
    'step-02': ['step-02-progress-0', 'step-02-question-1', ...]
    // ... 21 steps
  }
}
```

### QuizModularProductionEditor State
```typescript
{
  steps: [
    {
      id: 'step-01',
      type: 'intro',
      order: 0,
      blocks: [
        { id: 'step-01-logo-0', type: 'image-inline', ... },
        { id: 'step-01-title-1', type: 'heading-inline', ... }
      ],
      metadata: {
        title: 'Step 1',
        description: 'Step 1 with 8 blocks'
      }
    }
    // ... 21 steps
  ]
}
```

## Renderização no Canvas

### CanvasArea.tsx
```tsx
<BlockBasedStepRenderer 
  stepNumber={parseInt(selectedStep.id.replace('step-', ''), 10)}
  mode="editor"
/>
```

### BlockBasedStepRenderer.tsx
```typescript
const { actions } = useEditor();
const stepKey = `step-${stepNumber}`;
const blocks = actions.getBlocksForStep(stepKey);

return (
  <StepCanvas
    stepId={stepKey}
    blocks={blocks}
    mode={mode}
    // ... handlers
  />
);
```

### StepCanvas.tsx
```tsx
{blocks.map((block, index) => (
  <div key={block.id}>
    {/* Controles de edição */}
    <BlockRenderer block={block} mode={mode} />
  </div>
))}
```

## Logs de Debug

### Console Output Esperado

```
📦 Inicializando blocos a partir do template...
✅ Blocos inicializados: { totalBlocks: 147, steps: 21 }

🎯 EDITOR: useEffect inicial disparado
✅ Sincronizando steps com blocos do EditorProvider: { 
  totalBlocks: 147, 
  stepsWithBlocks: 21 
}
✅ Steps criados a partir dos blocos: 21

🏁 Finalizando useEffect (loading avaliado)
```

## Troubleshooting

### Blocos não aparecem no canvas?

1. **Verificar se EditorProvider foi montado:**
```javascript
console.log('Provider:', window.__UNIFIED_EDITOR_PROVIDER__);
```

2. **Verificar se blocos foram inicializados:**
```javascript
const { state } = useEditor();
console.log('Blocos totais:', state.blocks?.length);
console.log('Steps com blocos:', Object.keys(state.blocksByStep || {}));
```

3. **Verificar sincronização no QuizModularProductionEditor:**
```javascript
console.log('Steps sincronizados:', steps.length);
console.log('Step selecionado:', selectedStep);
console.log('Blocos do step:', selectedStep?.blocks?.length);
```

4. **Forçar re-sincronização:**
Recarregar a página (F5) para forçar re-execução do useEffect.

### Steps aparecem vazios?

Verificar se os blocos têm `stepId` correto:
```javascript
const { state } = useEditor();
const step01Blocks = state.blocks?.filter(b => b.stepId === 'step-01');
console.log('Blocos do step-01:', step01Blocks);
```

### Canvas não renderiza os blocos?

Verificar se `BlockBasedStepRenderer` está recebendo `stepNumber` correto:
```tsx
<BlockBasedStepRenderer 
  stepNumber={parseInt(selectedStep.id.replace('step-', ''), 10)}
  mode="editor"
/>
```

## Performance

### Otimizações Aplicadas

1. **Lazy Initialization**: Blocos só são inicializados uma vez
2. **Memoization**: `getBlocksForStep()` usa lookup O(1)
3. **Shallow Clone**: History usa shallow clone para performance
4. **Debounced Sync**: useEffect com dependência específica evita loops

### Métricas Esperadas

```javascript
{
  initializationTime: '~100-200ms',
  blocksPerStep: '~6-7 blocos',
  totalBlocks: '~120-150 blocos',
  memoryUsage: '~2-3MB',
  rerenderTime: '~10-20ms por bloco'
}
```

## Próximos Passos

1. ✅ Sincronização automática implementada
2. ✅ Blocos renderizados no canvas
3. ⏳ Persistência no Supabase
4. ⏳ Drag & drop entre steps
5. ⏳ Undo/redo granular por bloco

---

**Status:** ✅ Sincronização implementada  
**Data:** 2025-10-16  
**Versão:** 5.0.0-sync
