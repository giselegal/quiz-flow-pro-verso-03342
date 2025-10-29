# 🔧 CORREÇÃO CRÍTICA: useBlockRegistry Hook Rules Violation

## ❌ Problema Identificado

```
Error: useBlockRegistry deve ser usado dentro de BlockRegistryProvider
```

### Causa Raiz

O erro estava acontecendo porque `useBlockRegistry()` estava sendo chamado **diretamente dentro de um `.map()`**, o que viola as **Rules of Hooks** do React:

```typescript
// ❌ ERRADO - Hook dentro de .map()
{normalizedStep.blocks.map((b: any, idx: number) => {
    const def = useBlockRegistry().get(b.type); // ← VIOLA RULES OF HOOKS!
    // ...
})}
```

**Por que isso é um problema:**
- Hooks **só podem ser chamados no nível superior** de um componente
- Hooks **NÃO podem** estar dentro de loops, condições ou funções aninhadas
- `.map()` é um callback, não um componente

---

## ✅ Correção Aplicada

### 1. Criado Componente `NormalizedBlockRenderer`

```typescript
// ✅ CORRETO - Hook no nível superior de um componente
const NormalizedBlockRenderer: React.FC<{ block: any; idx: number; debug: boolean }> = 
    ({ block, idx, debug }) => {
    const registry = useBlockRegistry(); // ← AGORA ESTÁ CORRETO!
    const def = registry.get(block.type);
    
    if (!def) {
        return <div className="text-xs text-red-600">Bloco não registrado: {block.type}</div>;
    }
    
    // Renderização...
};
```

### 2. Substituído `.map()` com Hook Direto

**Antes:**
```typescript
{normalizedStep.blocks.map((b: any, idx: number) => {
    const def = useBlockRegistry().get(b.type); // ❌ ERRADO
    // ...
})}
```

**Depois:**
```typescript
{normalizedStep.blocks.map((b: any, idx: number) => (
    <NormalizedBlockRenderer key={idx} block={b} idx={idx} debug={normalizedDebug} />
))}
```

---

## 📊 Arquivos Modificados

### 1. `/src/components/quiz/QuizAppConnected.tsx`

**Mudanças:**
- ✅ Criado componente `NormalizedBlockRenderer` (linhas ~410-465)
- ✅ Substituído `.map()` com hook direto por componente wrapper
- ✅ Mantido `BlocksRuntimeRenderer` (já estava correto)

### 2. `/src/components/editor/quiz/QuizModularProductionEditor.tsx`

**Mudanças anteriores (mantidas):**
- ✅ Adicionado import `BlockRegistryProvider`
- ✅ Envolvido `QuizAppConnected` com provider no `LiveRuntimePreview`

---

## 🎯 Solução Completa

### Hierarquia de Providers

```typescript
LiveRuntimePreview
  └─ BlockRegistryProvider ← Provider envolvendo tudo
       └─ QuizAppConnected
            ├─ BlocksRuntimeRenderer ← Usa useBlockRegistry() ✅
            └─ NormalizedBlockRenderer ← Usa useBlockRegistry() ✅
```

### Por Que Funciona Agora

1. **BlockRegistryProvider** está no topo da hierarquia
2. **Componentes React** usam hooks corretamente (nível superior)
3. **Nenhum hook** é chamado dentro de loops ou callbacks
4. **Rules of Hooks** respeitadas

---

## 🧪 Como Testar

1. **Recarregue a página** (Ctrl+R)
2. **Observe o console**

### ✅ Resultado Esperado

```javascript
✅ Lazy load all steps: X.Xms
⚠️  Step 'step-01' já está registrado (normal)
⚠️  3x Loading timeout (normal)
✅ Preview renderiza SEM erro de BlockRegistry
```

### ❌ Se Ainda Aparecer Erro

```javascript
❌ Error: useBlockRegistry deve ser usado dentro de BlockRegistryProvider

→ Significa que há OUTRA chamada de useBlockRegistry() em outro lugar
→ Copie o stack trace completo e me envie
```

---

## 📚 React Rules of Hooks

### ✅ Permitido

```typescript
// 1. No nível superior de um componente
function MyComponent() {
    const registry = useBlockRegistry(); ✅
    return <div>...</div>;
}

// 2. Em custom hooks
function useMyCustomHook() {
    const registry = useBlockRegistry(); ✅
    return registry;
}
```

### ❌ Proibido

```typescript
// 1. Dentro de loops
blocks.map(block => {
    const registry = useBlockRegistry(); ❌
});

// 2. Dentro de condições
if (condition) {
    const registry = useBlockRegistry(); ❌
}

// 3. Dentro de callbacks
setTimeout(() => {
    const registry = useBlockRegistry(); ❌
}, 1000);
```

---

## 🔍 Debug

Se o erro persistir, procure por:

```bash
# Buscar por useBlockRegistry() no código
grep -rn "useBlockRegistry()" src/

# Verificar se está dentro de:
- .map()
- .filter()
- .forEach()
- if/else
- try/catch
- setTimeout/setInterval
```

---

## ✅ Status Final

| Problema | Status | Solução |
|----------|--------|---------|
| Hook dentro de .map() | ✅ CORRIGIDO | Criado NormalizedBlockRenderer |
| Falta de Provider | ✅ CORRIGIDO | Adicionado no LiveRuntimePreview |
| Rules of Hooks Violation | ✅ RESOLVIDO | Hooks no nível superior |

---

**Status:** ✅ CORREÇÃO APLICADA - Aguardando Teste
