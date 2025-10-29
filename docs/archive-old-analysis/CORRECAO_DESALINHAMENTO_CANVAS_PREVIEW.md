# 🔧 CORREÇÃO: Desalinhamento Canvas vs Preview

## ❌ Problema Identificado

**Sintoma:** Edições feitas no Canvas não aparecem no Preview em tempo real.

### Causa Raiz

No `LiveRuntimePreview`, o hash de comparação estava verificando apenas as **keys** (IDs) das steps, não o **conteúdo**:

```typescript
// ❌ ANTES - Comparava apenas IDs
const currentHash = JSON.stringify(Object.keys(runtimeMap).sort());
//                                 ^^^^^^^^^^^^^^^^
//                                 Só IDs, não conteúdo!
```

**Resultado:**
- Adicionar/remover steps → Preview atualiza ✅
- Editar conteúdo de step existente → Preview NÃO atualiza ❌

---

## ✅ Correção Aplicada

### Mudança no LiveRuntimePreview

```typescript
// ✅ DEPOIS - Compara conteúdo completo
const currentHash = JSON.stringify(runtimeMap);
//                                 ^^^^^^^^^^
//                                 Objeto completo com todo conteúdo!
```

**Resultado Esperado:**
- Adicionar/remover steps → Preview atualiza ✅
- Editar conteúdo de step → Preview atualiza ✅
- Editar propriedade de step → Preview atualiza ✅
- Editar bloco dentro de step → Preview atualiza ✅

---

## 🔍 Logs de Debug Adicionados

### 1. LiveRuntimePreview (linha ~2652)

```javascript
🔍 [Update Check #N] {
  currentHash: "...",
  lastHash: "...",
  willUpdate: true/false,
  stepsCount: 21,
  sampleStep: "step-01"
}

✅ [Update #N] Atualizando Live preview registry com 21 steps
📦 Exemplo de step sendo enviado: { id, type, questionText, options, ... }
```

### 2. QuizAppConnected (linha ~52)

```javascript
🔗 Registry detectado com 21 steps: {
  stepIds: ["step-01", "step-02", ...],
  firstStepSample: { id, type, questionText, ... }
}
```

OU

```javascript
⚠️ Registry vazio ou ausente - usando fallback
```

---

## 🧪 Como Testar

### Teste 1: Editar Texto de Pergunta

1. No Canvas, **edite o texto** de uma pergunta (ex: step-02)
2. **Observe o console** - deve aparecer:
   ```javascript
   🔍 [Update Check] willUpdate: true
   ✅ Atualizando Live preview registry
   🔗 Registry detectado com 21 steps
   ```
3. **Observe o Preview** - deve mostrar o novo texto

### Teste 2: Editar Opções

1. No Canvas, **edite uma opção** (texto ou imagem)
2. **Observe o console** - mesmos logs acima
3. **Preview deve refletir** a mudança imediatamente

### Teste 3: Adicionar/Remover Blocos

1. No Canvas, **adicione ou remova um bloco**
2. **Observe o console**
3. **Preview deve atualizar**

---

## 📊 Fluxo de Atualização Corrigido

```
Editor (Canvas)
  ↓ setSteps([...steps, updatedStep])
  ↓
LiveRuntimePreview
  ↓ useMemo → editorStepsToRuntimeMap(steps)
  ↓ runtimeMap (objeto com conteúdo completo)
  ↓
useEffect (detecta mudança no conteúdo)
  ↓ JSON.stringify(runtimeMap) → hash completo
  ↓ hash !== lastHash → ATUALIZA ✅
  ↓
QuizRuntimeRegistry
  ↓ setSteps(runtimeMap)
  ↓
QuizAppConnected
  ↓ useOptionalQuizRuntimeRegistry()
  ↓ externalSteps = registry.steps
  ↓
useQuizState
  ↓ stepsSource = externalSteps ✅
  ↓ currentStepData = stepsSource[currentStep]
  ↓
RENDERIZA step atualizada no Preview ✅
```

---

## ⚠️ Considerações de Performance

### Impacto

- **Antes:** Comparação de ~100 bytes (só IDs)
- **Depois:** Comparação de ~10-50KB (conteúdo completo de 21 steps)

### Otimização Futura (se necessário)

```typescript
// Opção 1: Debounce mais agressivo
const debouncedSteps = useDebounce(steps, 500); // 500ms

// Opção 2: Shallow comparison inteligente
const stepsHash = steps.map(s => 
    `${s.id}:${s.questionText}:${s.options?.length}`
).join('|');

// Opção 3: Dirty flag por step
const dirtySteps = new Set<string>();
// Só comparar steps que mudaram
```

**Decisão:** Manter solução atual (completa) até haver problema de performance real.

---

## 🐛 Troubleshooting

### Problema: Preview ainda não atualiza

**Verificar:**

1. **Console mostra "willUpdate: false"?**
   - Significa que hash está idêntico
   - Verificar se `steps` realmente mudou referência
   - Usar `setSteps([...steps])` para forçar novo array

2. **Console mostra "Registry vazio"?**
   - LiveRuntimePreview não está atualizando registry
   - Verificar se useEffect está sendo executado
   - Verificar proteção de loop (max 10 updates)

3. **Registry tem dados mas Preview mostra antigo?**
   - useQuizState pode estar usando fallback
   - Verificar logs: "⚠️ Registry vazio ou ausente"
   - Problema no QuizRuntimeRegistryProvider

---

## ✅ Checklist de Validação

Após recarregar a página:

- [ ] Console mostra "🔍 [Update Check]" ao editar step
- [ ] Console mostra "willUpdate: true" quando há mudança
- [ ] Console mostra "✅ Atualizando Live preview registry"
- [ ] Console mostra "🔗 Registry detectado com 21 steps"
- [ ] Preview atualiza visualmente com a edição
- [ ] Não há erros em vermelho no console

---

**Status:** ✅ CORREÇÃO APLICADA - Aguardando Validação com Testes
