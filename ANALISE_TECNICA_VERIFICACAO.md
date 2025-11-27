# 📊 VERIFICAÇÃO DA ANÁLISE TÉCNICA - QuizModularEditor

**Data:** 27 de Novembro de 2025  
**Arquivo:** `/src/components/editor/quiz/QuizModularEditor/index.tsx`  
**Linhas analisadas:** 2385 linhas totais

---

## ✅ PONTOS CONFIRMADOS (Análise CORRETA)

### 1. ✅ CONFIRMADO: Três Fontes de Verdade Simultâneas

**Código encontrado:**

```typescript
// Fonte 1: templateService.getStep() - linha 1044
const result = await svc.getStep(stepId, templateOrResource, { signal });

// Fonte 2: unifiedState.editor.stepBlocks - linha 883
const rawBlocks = getStepBlocks(safeCurrentStep);
const blocks: Block[] = Array.isArray(rawBlocks) ? rawBlocks : [];

// Fonte 3: wysiwyg.state.blocks - linha 569
const selectedBlock = useMemo(() => {
    const found = wysiwyg.state.blocks.find(b => b.id === wysiwyg.state.selectedBlockId);
    return found;
}, [wysiwyg.state.blocks, wysiwyg.state.selectedBlockId]);
```

**Análise:** ✅ **CORRETO**. O editor realmente mantém 3 stores independentes.

---

### 2. ✅ CONFIRMADO: extractBlocksFromStepData é Supercomplexo

**Código encontrado (linhas 677-743):**

```typescript
const extractBlocksFromStepData = useCallback((raw: any, stepId: string): Block[] => {
    try {
        if (!raw) return [];
        // Caso 1: Array direto
        if (Array.isArray(raw)) return raw as Block[];
        
        // Caso 2: Objeto com blocks
        if (raw.blocks && Array.isArray(raw.blocks)) return adapt(raw.blocks);
        
        // Caso 3: Estrutura { steps: { stepId: { blocks: [] } } }
        if (raw.steps && raw.steps[stepId]?.blocks) return adapt(...);
        
        // Caso 4: Objeto indexado pelo stepId diretamente
        if (raw[stepId] && raw[stepId].blocks) return adapt(...);
        
        // Caso 5: v3 etapa única (templateVersion + blocks)
        if (raw.templateVersion && raw.blocks) return adapt(raw.blocks);
        
        // Caso 6: Objeto genérico possivelmente com blocos indexados
        const values = Object.values(raw);
        if (values.length && values.every(v => typeof v === 'object')) {
            return adapt(values as any[]);
        }
        
        return [];
    } catch (err) {
        return [];
    }
}, []);
```

**Análise:** ✅ **CORRETO**. São 6 formatos diferentes + função `adapt()` interna complexa.

---

### 3. ✅ CONFIRMADO: Conflito PreviewMode vs Live Mode

**Código encontrado:**

```typescript
// Linha 945 - Auto-select bloqueado em preview
if (previewMode === 'live') {
    return;
}

// Linha 1065 - WYSIWYG sync bloqueado em preview
if (previewMode === 'live' && wysiwyg.state.blocks.length > 0) {
    console.log('🚫 Preview mode: ignorando sync WYSIWYG');
}

// Linha 2155 - Canvas usa blocks diferentes por modo
const blocksToRender = previewMode === 'live'
    ? (virtualization.isVirtualized ? virtualization.visibleBlocks : wysiwyg.state.blocks)
    : blocks;
```

**Análise:** ✅ **CORRETO**. O preview mode causa múltiplos comportamentos condicionais conflitantes.

---

### 4. ✅ CONFIRMADO: Múltiplos Prefetchers Competindo

**Código encontrado:**

```typescript
// Prefetch 1: useStepPrefetch (linha ~40 - import)
import { useStepPrefetch } from '@/hooks/useStepPrefetch';

// Prefetch 2: Crítico (linhas 851-876)
useEffect(() => {
    const critical = ['step-01', 'step-12', 'step-20', 'step-21'];
    // ... prefetch crítico
}, [queryClient, props.templateId, ...]);

// Prefetch 3: Vizinhos (linhas 1126-1152)
const neighborIds = [stepIndex - 1, stepIndex + 1, stepIndex + 2];
// ... prefetch vizinhos
```

**Análise:** ✅ **CORRETO**. São 3 sistemas de prefetch simultâneos.

---

### 5. ✅ CONFIRMADO: Painel de Propriedades Lê do WYSIWYG

**Código encontrado (linhas 2231-2239):**

```typescript
<PropertiesColumn
    selectedBlock={selectedBlock}
    blocks={wysiwyg.state.blocks}  // 🔴 LENDO DO WYSIWYG
    onBlockSelect={handleWYSIWYGBlockSelect}
    onBlockUpdate={handleWYSIWYGBlockUpdate}
    onClearSelection={handleWYSIWYGClearSelection}
/>
```

**E selectedBlock vem de (linha 569):**

```typescript
const selectedBlock = useMemo(() => {
    const found = wysiwyg.state.blocks.find(b => b.id === wysiwyg.state.selectedBlockId);
    return found;
}, [wysiwyg.state.blocks, wysiwyg.state.selectedBlockId]);
```

**Análise:** ✅ **CORRETO**. O painel lê exclusivamente do `wysiwyg.state.blocks`, não do `unifiedState`.

---

## ⚠️ PONTOS PARCIALMENTE CORRETOS

### 6. ⚠️ PARCIAL: "Steps 3+ Carregam Arrays Vazios"

**Código de carregamento (linhas 1047-1055):**

```typescript
const normalizedBlocks = extractBlocksFromStepData(result?.data, stepId);

if (!signal.aborted && result?.success && normalizedBlocks) {
    setStepBlocks(stepIndex, normalizedBlocks);
    
    // WYSIWYG sync otimizado
    try {
        const currentIds = wysiwyg.state.blocks.map(b => b.id).join(',');
        const newIds = normalizedBlocks.map((b: any) => b.id).join(',');
        
        if (currentIds !== newIds) {
            wysiwyg.actions.reset(normalizedBlocks);
        }
    } catch (e) {
        // ...
    }
}
```

**Análise:** ⚠️ **PARCIALMENTE CORRETO**. O código TEM proteção contra arrays vazios, mas:
- Se `extractBlocksFromStepData` retornar `[]`, isso é gravado como válido
- A condição `if (normalizedBlocks)` aceita array vazio como truthy
- Não há validação de `normalizedBlocks.length > 0`

**Conclusão:** O problema existe mas não é "sempre" - depende do retorno do `templateService.getStep()`.

---

### 7. ⚠️ PARCIAL: "WYSIWYG vs unifiedState Conflito"

**Código de sincronização (linhas 1065-1098):**

```typescript
// 🔥 HOTFIX 4: WYSIWYG Sync Otimizado
if (previewMode === 'live' && wysiwyg.state.blocks.length > 0) {
    console.log('🚫 Preview mode: ignorando sync');
} else {
    try {
        const currentIds = wysiwyg.state.blocks.map(b => b.id).join(',');
        const newIds = normalizedBlocks.map((b: any) => b.id).join(',');
        
        if (currentIds !== newIds) {
            wysiwyg.actions.reset(normalizedBlocks);
        } else {
            normalizedBlocks.forEach((block: any) => {
                const existing = wysiwyg.state.blocks.find(b => b.id === block.id);
                if (existing && JSON.stringify(existing) !== JSON.stringify(block)) {
                    wysiwyg.actions.updateBlock(block.id, block);
                }
            });
        }
    } catch (e) {
        appLogger.warn('[QuizModularEditor] Falha ao sincronizar WYSIWYG');
    }
}
```

**Análise:** ⚠️ **PARCIALMENTE CORRETO**. Há tentativa de sincronização, mas:
- Só ocorre quando `previewMode !== 'live'`
- Usa comparação de strings (`JSON.stringify`) - **ineficiente**
- Sincronização é **unidirecional**: `unifiedState → WYSIWYG`, nunca o inverso

**Conclusão:** O conflito existe mas está sendo gerenciado (mal).

---

## ❌ PONTOS INCORRETOS OU IMPRECISOS

### 8. ❌ INCORRETO: "Circular Logic entre StepNavigation e LoadedTemplate"

**Código real:**

```typescript
// stepNavigation (linhas 585-592)
const stepNavigation = useStepNavigation({
    currentStepKey,
    loadedTemplate,
    setCurrentStep,
    setSelectedBlock,
    templateId: props.templateId,
    resourceId,
});

// templateLoader (linhas 751-776)
const templateLoader = useTemplateLoader({
    templateId: props.templateId,
    funnelId: props.funnelId,
    resourceId,
    enabled: !!(props.templateId || resourceId),
    onSuccess: (data) => {
        setLoadedTemplate({
            name: data.metadata.name,
            steps: data.steps,
        });
    },
    onError: (error) => {
        // ...
    },
});
```

**Análise:** ❌ **INCORRETO**. NÃO há lógica circular:
- `templateLoader` carrega → `setLoadedTemplate`
- `stepNavigation` **lê** `loadedTemplate` (dependência, não circular)
- `ensureStepBlocks` usa `stepIndex` (número), não depende de `loadedTemplate`

**Conclusão:** A dependência é **linear**, não circular.

---

### 9. ❌ INCORRETO: "Painel está Quebrado"

**Código do Painel:**

```typescript
// PropertiesColumn recebe (linha 2231)
<PropertiesColumn
    selectedBlock={selectedBlock}  // ✅ tipado corretamente
    blocks={wysiwyg.state.blocks}  // ✅ array válido
    onBlockSelect={handleWYSIWYGBlockSelect}  // ✅ callback estável
    onBlockUpdate={handleWYSIWYGBlockUpdate}  // ✅ callback estável
    onClearSelection={handleWYSIWYGClearSelection}  // ✅ callback estável
/>
```

**Análise:** ❌ **INCORRETO**. O painel **NÃO está quebrado**. Ele funciona perfeitamente quando:
- `wysiwyg.state.blocks` tem dados
- `selectedBlock` é válido

O problema real é que `wysiwyg.state.blocks` **pode estar vazio** quando:
1. `extractBlocksFromStepData()` retorna `[]`
2. Modo preview bloqueia sincronização
3. Step não foi carregado ainda

**Conclusão:** O painel funciona - o problema é **falta de dados**.

---

## 🎯 RESUMO FINAL DA VERIFICAÇÃO

### ✅ ANÁLISE CORRETA (70%):
1. ✅ Três fontes de verdade simultâneas
2. ✅ `extractBlocksFromStepData` supercomplexo (6 formatos)
3. ✅ Conflito `previewMode` vs `live mode`
4. ✅ Múltiplos prefetchers competindo
5. ✅ Painel lê do WYSIWYG, não do unifiedState
6. ⚠️ Steps podem carregar vazios (mas não "sempre")
7. ⚠️ WYSIWYG vs unifiedState tem conflito (mas está sendo gerenciado)

### ❌ ANÁLISE INCORRETA (30%):
8. ❌ NÃO há lógica circular (é dependência linear)
9. ❌ Painel NÃO está quebrado (falta dados, não lógica)

---

## 📋 RECOMENDAÇÕES TÉCNICAS

### 🔥 PRIORIDADE ALTA (Confirmadas pela análise):

1. **Unificar fontes de verdade**
   ```typescript
   // REMOVER: wysiwyg como store primário
   // MANTER: unifiedState como única fonte
   // Canvas/Properties → READ do unifiedState
   ```

2. **Simplificar extractBlocksFromStepData**
   ```typescript
   const extractBlocksFromStepData = (raw: any): Block[] => {
       if (Array.isArray(raw)) return raw;
       if (raw?.blocks && Array.isArray(raw.blocks)) return raw.blocks;
       if (raw?.steps?.[stepId]?.blocks) return raw.steps[stepId].blocks;
       return [];
   };
   ```

3. **Eliminar prefetch redundante**
   - Manter APENAS `templateLoader`
   - Remover `useStepPrefetch`, prefetch crítico, prefetch vizinhos

4. **Fixar previewMode para não bloquear seleção**
   ```typescript
   // MUDAR DE:
   if (previewMode === 'live') return;
   
   // PARA:
   if (previewMode === 'production' && !allowEdit) return;
   ```

### 📊 PRIORIDADE MÉDIA:

5. **Adicionar validação de array vazio**
   ```typescript
   if (normalizedBlocks && normalizedBlocks.length > 0) {
       setStepBlocks(stepIndex, normalizedBlocks);
   }
   ```

6. **Melhorar sincronização WYSIWYG**
   - Remover `JSON.stringify` comparison
   - Usar shallow comparison ou refs

---

## ✅ CONCLUSÃO

**A análise está 70% CORRETA** nas identificações dos problemas estruturais, mas:
- ❌ Exagera na severidade de alguns pontos
- ❌ Tem 2 conclusões incorretas (circular logic, painel quebrado)
- ✅ Identifica corretamente os 5 gargalos principais

**Recomendação:** Seguir as correções sugeridas, mas com ajustes nas prioridades baseados na verificação real do código.
