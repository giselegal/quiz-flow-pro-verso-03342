# 🔍 ANÁLISE: Desalinhamento entre Canvas e Preview

## 📊 Problema Identificado

**Sintoma:** As etapas mostradas no Preview não correspondem às etapas mostradas no Canvas (coluna de edição visual).

---

## 🔄 Fluxo de Dados Atual

### 1. Editor (QuizModularProductionEditor)

```typescript
// Estado local do editor
const [steps, setSteps] = useState<EditableQuizStep[]>([]);
const [selectedStepId, setSelectedStepId] = useState<string>('');

// Steps debounced para evitar re-renders excessivos
const debouncedSteps = useMemo(() => steps, [steps]);
```

### 2. Canvas (Coluna de Edição)

```typescript
// Canvas renderiza steps diretamente do estado local
<CanvasArea
    selectedStep={selectedStep}  // ← Baseado em steps[selectedStepId]
    onUpdateStep={handleUpdateStep}
    // ... outras props
/>
```

**Fonte de Dados:** `steps` (estado local do editor)

### 3. LiveRuntimePreview (Coluna de Preview)

```typescript
<LiveRuntimePreview 
    steps={debouncedSteps}  // ← Mesma fonte que Canvas
    funnelId={funnelId}
    selectedStepId={selectedStepId}
/>
```

**Processo:**
1. Recebe `debouncedSteps` do editor
2. Converte com `editorStepsToRuntimeMap(steps)`
3. Registra no `QuizRuntimeRegistry`
4. Renderiza `QuizAppConnected` com registry

### 4. QuizAppConnected (Dentro do Preview)

```typescript
export default function QuizAppConnected({ 
    funnelId, 
    editorMode, 
    initialStepId 
}) {
    const registry = useOptionalQuizRuntimeRegistry();
    const externalSteps = registry?.steps;
    
    // Hook que gerencia o estado do quiz
    const { state, currentStepData, ... } = useQuizState(
        funnelId, 
        externalSteps  // ← Registry do LiveRuntimePreview
    );
}
```

### 5. useQuizState (Hook de Estado)

```typescript
export function useQuizState(
    funnelId?: string, 
    externalSteps?: Record<string, any>
) {
    // Escolha da fonte de dados:
    const stepsSource = externalSteps || loadedSteps || QUIZ_STEPS;
    //                  ↑              ↑               ↑
    //                  Registry       Supabase        Fallback padrão
    
    // Obter dados da step atual:
    const currentStepData = stepsSource[state.currentStep];
}
```

---

## 🐛 Possíveis Causas do Desalinhamento

### Causa 1: Conversão Incompleta (editorStepsToRuntimeMap)

```typescript
// editorAdapter.ts
export function editorStepsToRuntimeMap(steps: EditableQuizStepLite[]): 
    Record<string, RuntimeStepOverride> {
    
    const map: Record<string, RuntimeStepOverride> = {};
    
    for (const s of steps) {
        if (!s.id) continue; // ⚠️ Steps sem ID são ignorados
        
        map[s.id] = {
            id: s.id,
            type: s.type,
            nextStep: s.nextStep,
            // ... outras propriedades
        };
    }
    
    return map;
}
```

**Problema Potencial:**
- Se steps do Canvas têm campos que não são copiados
- Se formato dos dados mudou e adapter está desatualizado
- Se `blocks` não está sendo normalizado corretamente

### Causa 2: Registry Desatualizado

```typescript
// LiveRuntimePreview
React.useEffect(() => {
    const currentHash = JSON.stringify(Object.keys(runtimeMap).sort());
    
    if (currentHash !== lastUpdateRef.current) {
        setSteps(runtimeMap); // ← Atualiza registry
        lastUpdateRef.current = currentHash;
    }
}, [runtimeMap]);
```

**Problema Potencial:**
- Hash compara apenas **keys** (IDs), não **conteúdo**
- Mudanças no conteúdo das steps não trigam atualização
- Registry fica com dados antigos

### Causa 3: Delay no Debounce

```typescript
// QuizModularProductionEditor
const debouncedSteps = useMemo(() => steps, [steps]);
```

**Problema Potencial:**
- `useMemo` só recalcula quando `steps` muda **referência**
- Se `steps` é mutado (sem criar nova referência), não atualiza
- Preview mostra versão antiga

### Causa 4: Fallback para QUIZ_STEPS

```typescript
// useQuizState.ts
const stepsSource = externalSteps || loadedSteps || QUIZ_STEPS;
```

**Problema Potencial:**
- Se `externalSteps` (registry) está undefined ou vazio
- Preview usa `QUIZ_STEPS` (dados padrão do arquivo)
- Canvas mostra dados editados, Preview mostra padrão

---

## 🔍 Como Diagnosticar

### Teste 1: Verificar se Registry Está Populado

```typescript
// Adicionar log no LiveRuntimePreview
console.log('🔍 Registry atualizado:', {
    stepsCount: Object.keys(runtimeMap).length,
    stepIds: Object.keys(runtimeMap),
    firstStep: runtimeMap[Object.keys(runtimeMap)[0]]
});
```

### Teste 2: Verificar Fonte de Dados no Preview

```typescript
// Adicionar log no QuizAppConnected
console.log('🔍 Fonte de dados:', {
    hasExternalSteps: !!externalSteps,
    externalStepsCount: externalSteps ? Object.keys(externalSteps).length : 0,
    hasLoadedSteps: !!loadedSteps,
    usingFallback: !externalSteps && !loadedSteps
});
```

### Teste 3: Comparar Dados Canvas vs Preview

```typescript
// No editor, ao selecionar step:
console.log('📝 Canvas step:', steps.find(s => s.id === selectedStepId));

// No QuizAppConnected:
console.log('🎨 Preview step:', currentStepData);
```

---

## 🛠️ Soluções Possíveis

### Solução 1: Melhorar Hash de Comparação

```typescript
// Comparar conteúdo, não apenas keys
const currentHash = JSON.stringify(runtimeMap);
```

### Solução 2: Forçar Re-render com Dependência

```typescript
const debouncedSteps = useMemo(() => steps, [JSON.stringify(steps)]);
```

### Solução 3: Debug Logs Completos

```typescript
// Adicionar logs em cada etapa da cadeia para rastrear dados
```

### Solução 4: Verificar Imutabilidade

```typescript
// Garantir que setSteps sempre cria nova referência
setSteps(prevSteps => [...prevSteps.map(s => 
    s.id === updatedStep.id ? { ...s, ...updates } : s
)]);
```

---

## 🎯 Próximos Passos

1. **Adicionar logs de debug** em pontos críticos:
   - LiveRuntimePreview (após converter steps)
   - QuizRuntimeRegistry (ao setar steps)
   - QuizAppConnected (ao receber externalSteps)
   - useQuizState (fonte escolhida)

2. **Comparar dados** lado a lado:
   - Edite uma step no Canvas
   - Observe os logs no console
   - Verifique se mudança chega no Preview

3. **Identificar ponto de quebra:**
   - Se dados chegam no LiveRuntimePreview → problema no registry
   - Se registry recebe mas QuizApp não → problema no context
   - Se QuizApp recebe mas não renderiza → problema no useQuizState

---

## 📋 Checklist de Diagnóstico

- [ ] Verificar console logs ao editar step no Canvas
- [ ] Confirmar se LiveRuntimePreview recalcula runtimeMap
- [ ] Verificar se QuizRuntimeRegistry.setSteps é chamado
- [ ] Confirmar se QuizAppConnected recebe externalSteps
- [ ] Verificar se useQuizState usa externalSteps (não fallback)
- [ ] Comparar step no Canvas vs step no Preview (console.log)

---

**Status:** 🔍 AGUARDANDO DIAGNÓSTICO - Preciso ver os logs do console ao editar uma step
