# 🔧 FIX: Drag & Drop e Sincronização de Preview

**Data:** 17 de outubro de 2025  
**Problemas Identificados:**
1. ❌ Não consegue arrastar componentes entre blocos existentes no canvas
2. ❌ Edições não refletem no modo preview

---

## 🔍 DIAGNÓSTICO

### Problema 1: Drag & Drop Entre Blocos

**Causa Raiz:**
O sistema tem **DOIS contextos DnD aninhados** que competem entre si:

```
QuizModularProductionEditor (DndContext principal)
└── handleDragEnd global (linha 1177)
    └── Detecta "lib:" e adiciona ao final
    
    ModularTransitionStep (DndContext aninhado)
    └── handleDragEnd local (linha 130)
        └── Tenta detectar "lib:" mas PODE FALHAR
        └── Só permite reordenação de blocos existentes
```

**Problema:**
- Quando você arrasta da biblioteca, o evento pode ser capturado pelo contexto ERRADO
- Os dois `handleDragEnd` podem interferir um com o outro
- Falta suporte para DROP ZONES entre blocos (não apenas no final)

### Problema 2: Preview Não Atualiza

**Causa Raiz:**
O preview usa `QuizAppConnected` que busca dados do **runtime registry**, mas:

1. **EditorContext** mantém `state.stepBlocks[stepKey]`
2. **QuizAppConnected** usa `QuizRuntimeRegistry` (fonte diferente!)
3. **Sincronização acontece via `useEffect`** no preview (linha 2835)

**Fluxo Quebrado:**
```
Edição no Canvas
└── editor.actions.addBlockAtIndex()
    └── Atualiza state.stepBlocks
        └── ❌ Preview espera sync via useEffect
            └── ⏱️ Delay ou falha de atualização
```

---

## ✅ SOLUÇÕES

### Solução 1: Corrigir Drag & Drop Entre Blocos

**Opção A: Remover DndContext Aninhado** (Recomendado)
- Mover toda lógica de D&D para o contexto principal do editor
- ModularTransitionStep apenas renderiza as drop zones visuais
- Vantagem: Fluxo único e previsível

**Opção B: Melhorar Comunicação Entre Contextos**
- Fazer o contexto filho "propagar" eventos não tratados para o pai
- Adicionar drop zones explícitas entre cada bloco
- Desvantagem: Mais complexo, propenso a bugs

### Solução 2: Sincronizar Preview em Tempo Real

**Opção A: Preview Lê Direto do EditorContext** (Recomendado)
```tsx
// Em vez de QuizAppConnected usar registry separado:
const PreviewRenderer = () => {
  const editor = useEditor();
  const blocks = editor.state.stepBlocks[selectedStepId];
  
  return <ModularTransitionStep data={...} blocks={blocks} />;
};
```

**Opção B: Forçar Atualização do Registry**
- Após cada edição, chamar `setSteps()` para disparar sync
- Problema: Pode causar re-renders excessivos

---

## 🛠️ IMPLEMENTAÇÃO

### Passo 1: Simplificar Drag & Drop

**Arquivo:** `ModularTransitionStep.tsx`

**Mudança 1: Remover DndContext Aninhado**
```tsx
// ANTES:
return isEditable ? (
  <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
    {/* blocos */}
  </DndContext>
) : (
  {/* preview */}
);

// DEPOIS:
return (
  <div>
    {/* Renderizar blocos sem DndContext */}
    {/* Drop zones visuais para o DndContext pai capturar */}
  </div>
);
```

**Mudança 2: Adicionar Drop Zones Explícitas**
```tsx
{orderedBlocks.map((block, index) => (
  <React.Fragment key={block.id}>
    {/* Drop zone ANTES do bloco */}
    <div 
      data-drop-zone="before"
      data-block-id={block.id}
      className="h-2 hover:bg-blue-100"
    />
    
    {/* Bloco */}
    <UniversalBlockRenderer block={block} />
    
    {/* Drop zone DEPOIS do bloco */}
    {index === orderedBlocks.length - 1 && (
      <div 
        data-drop-zone="after"
        data-block-id={block.id}
        className="h-8 border-dashed"
      />
    )}
  </React.Fragment>
))}
```

### Passo 2: Melhorar handleDragEnd Global

**Arquivo:** `QuizModularProductionEditor.tsx` (linha 1177)

**Adicionar Detecção de Drop Zones:**
```tsx
const handleDragEnd = (event: any) => {
  const { active, over } = event;
  
  if (String(active.id).startsWith('lib:')) {
    const componentType = String(active.id).slice(4);
    
    // ✅ NOVO: Detectar drop zone específica
    const dropZone = over?.data?.current?.dropZone;
    const targetBlockId = over?.data?.current?.blockId;
    
    let insertPosition;
    
    if (dropZone === 'before' && targetBlockId) {
      // Inserir ANTES do bloco alvo
      const targetIndex = currentStep.blocks.findIndex(b => b.id === targetBlockId);
      insertPosition = targetIndex;
    } else if (dropZone === 'after' && targetBlockId) {
      // Inserir DEPOIS do bloco alvo
      const targetIndex = currentStep.blocks.findIndex(b => b.id === targetBlockId);
      insertPosition = targetIndex + 1;
    } else {
      // Fallback: inserir no final
      insertPosition = currentStep.blocks.length;
    }
    
    // Criar e inserir bloco...
  }
};
```

### Passo 3: Sincronizar Preview em Tempo Real

**Opção Simples: Preview Usa EditorContext Direto**

**Arquivo:** `QuizModularProductionEditor.tsx` (linha 2860)

```tsx
// ANTES:
<QuizAppConnected funnelId={funnelId} previewMode initialStepId={selectedStepId} />

// DEPOIS:
<DirectPreviewRenderer 
  funnelId={funnelId}
  selectedStepId={selectedStepId}
  editorContext={editorCtx}
/>
```

**Criar novo componente:**
```tsx
const DirectPreviewRenderer = ({ selectedStepId, editorContext }) => {
  const blocks = editorContext?.state?.stepBlocks?.[selectedStepId] || [];
  const stepData = steps.find(s => s.id === selectedStepId);
  
  return (
    <ModularTransitionStep
      data={stepData}
      blocks={blocks}
      isEditable={false}
      enableAutoAdvance={false}
    />
  );
};
```

---

## 🧪 TESTE

### Teste 1: Drag & Drop Entre Blocos
1. Abrir editor: `http://localhost:8080/editor/quiz-modular?template=quiz21StepsComplete`
2. Navegar para Step 12 (transition)
3. Arrastar componente "Texto" da biblioteca
4. **Passar o mouse entre dois blocos existentes**
5. ✅ Drop zone deve destacar em azul
6. **Soltar**
7. ✅ Componente deve aparecer na posição correta

### Teste 2: Preview Sincronizado
1. Continuar no Step 12
2. Editar título de um bloco existente
3. **Mudar para aba "Preview"**
4. ✅ Mudança deve aparecer IMEDIATAMENTE
5. **Voltar para "Canvas"**
6. Adicionar novo bloco via drag & drop
7. **Mudar para "Preview"**
8. ✅ Novo bloco deve aparecer

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Drag & Drop (ALTA PRIORIDADE)
- [ ] Remover DndContext de ModularTransitionStep
- [ ] Adicionar drop zones visuais explícitas
- [ ] Atualizar handleDragEnd para detectar drop zones
- [ ] Testar inserção antes/depois/final

### Fase 2: Preview Sync (ALTA PRIORIDADE)
- [ ] Criar DirectPreviewRenderer
- [ ] Passar EditorContext direto para preview
- [ ] Remover dependência de runtime registry no preview
- [ ] Testar sincronização em tempo real

### Fase 3: Polish (MÉDIA PRIORIDADE)
- [ ] Adicionar feedback visual durante drag
- [ ] Melhorar animações de transição
- [ ] Adicionar tooltips nas drop zones
- [ ] Otimizar re-renders

---

## 🎯 RESULTADO ESPERADO

**Antes:**
- ❌ Drag & drop só funciona no final
- ❌ Preview desatualizado
- ❌ Dois contextos DnD conflitantes

**Depois:**
- ✅ Drag & drop entre qualquer bloco
- ✅ Preview em tempo real
- ✅ Um único fluxo de D&D
- ✅ Código mais simples e manutenível

---

## 📝 NOTAS TÉCNICAS

### Por que Remover DndContext Aninhado?

1. **Conflito de Eventos:** Dois contextos competem pelo mesmo drag event
2. **Complexidade:** Difícil debugar qual contexto capturou o evento
3. **Limitações:** Contexto aninhado não pode acessar dados do pai
4. **Performance:** Dois sistemas de colisão rodando simultaneamente

### Por que Preview Direto do EditorContext?

1. **Fonte Única de Verdade:** Editor é o estado autoritativo
2. **Zero Latência:** Sem espera de sincronização
3. **Simplicidade:** Remove camada intermediária (runtime registry)
4. **Confiabilidade:** Menos pontos de falha

---

## 🚀 PRÓXIMOS PASSOS

1. Implementar Fase 1 (Drag & Drop)
2. Testar isoladamente
3. Implementar Fase 2 (Preview Sync)
4. Teste de integração completo
5. Deploy para homologação
