# 🔍 Teste de Loop Infinito no Preview

## Passos para Reproduzir

1. Abrir o editor de quiz: http://localhost:5173/quiz-editor/modular
2. Criar um novo quiz ou carregar existente
3. Clicar na aba "Preview"
4. Observar o comportamento

## Sintomas Esperados

### Se houver loop infinito:
- ❌ Console mostrará mensagens repetidas "🔄 Recalculando runtimeMap"
- ❌ Console mostrará "✅ Atualizando Live preview registry" repetidamente
- ❌ CPU alta (>50%)
- ❌ Navegador trava ou fica lento
- ❌ Preview não carrega nunca

### Se estiver OK:
- ✅ Console mostra "🔄 Recalculando runtimeMap" 1-2 vezes
- ✅ Console mostra "✅ Atualizando Live preview registry" 1-2 vezes
- ✅ Preview carrega e funciona
- ✅ CPU normal

## Logs para Verificar

Abrir DevTools (F12) → Console e procurar por:

```
🔄 Recalculando runtimeMap com X steps
✅ Atualizando Live preview registry com X steps
Live Runtime vN
```

## Correções Aplicadas

### 1. Proteção contra Loop com Hash (Atual)
```typescript
const lastUpdateRef = React.useRef<string>('');

React.useEffect(() => {
    const currentHash = JSON.stringify(Object.keys(runtimeMap).sort());
    
    if (currentHash !== lastUpdateRef.current) {
        lastUpdateRef.current = currentHash;
        setSteps(runtimeMap);
    }
}, [runtimeMap]);
```

**Como funciona:**
- Calcula hash dos IDs dos steps (não do conteúdo completo)
- Só atualiza se a lista de steps mudou
- Evita atualizações quando apenas conteúdo interno muda

### 2. Memoização do LiveRuntimePreview
```typescript
const LiveRuntimePreview = React.memo(({ steps, funnelId, selectedStepId }) => {
    // ...
});
```

### 3. Debounce de Steps (400ms)
```typescript
React.useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => setDebouncedSteps(steps), 400);
    return () => { if (debounceRef.current) window.clearTimeout(debounceRef.current); };
}, [steps]);
```

## Possíveis Causas Adicionais

Se ainda houver loop, verificar:

### 1. QuizAppConnected re-renderiza e causa updates
- **Sintoma**: Mensagens de log aparecem mesmo sem editar nada
- **Solução**: Adicionar React.memo ao QuizAppConnected

### 2. editorStepsToRuntimeMap cria novo objeto toda vez
- **Sintoma**: Hash muda mesmo com mesmos steps
- **Solução**: Usar deep comparison em vez de hash de IDs

### 3. setSteps do registry não é estável
- **Sintoma**: useEffect dispara constantemente
- **Solução**: Verificar se setSteps está wrapped em useCallback

### 4. steps prop muda referência a cada render
- **Sintoma**: runtimeMap recalcula constantemente
- **Solução**: Usar useMemo no componente pai

## Testes Adicionais

### Teste 1: Contador de Re-renders
Adicionar ao LiveRuntimePreview:
```typescript
const renderCountRef = React.useRef(0);
renderCountRef.current++;
console.log(`🔄 LiveRuntimePreview renderizado ${renderCountRef.current} vezes`);
```

**Esperado**: 2-3 renders iniciais, depois só ao editar

### Teste 2: Monitorar Hash
```typescript
console.log('📊 Hash:', currentHash);
console.log('📊 Last Hash:', lastUpdateRef.current);
console.log('📊 Vai atualizar?', currentHash !== lastUpdateRef.current);
```

### Teste 3: Performance Monitor
No DevTools:
1. Performance → Record
2. Clicar em Preview
3. Parar gravação após 5 segundos
4. Verificar flamegraph para loops

## Próximos Passos

Se loop persistir:

1. ✅ Adicionar contador de renders
2. ✅ Adicionar deep comparison em vez de hash
3. ✅ Verificar QuizAppConnected
4. ✅ Verificar if (condition) antes de setSteps
5. ✅ Usar useRef para steps anterior e comparar manualmente

## Status
- [ ] Teste realizado
- [ ] Loop confirmado/negado
- [ ] Causa identificada
- [ ] Correção aplicada
- [ ] Preview funcionando
