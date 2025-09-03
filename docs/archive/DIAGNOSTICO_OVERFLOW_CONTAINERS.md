# 🔍 DIAGNÓSTICO: PROBLEMAS DE BARRA DE ROLAGEM E CONTAINERS

## 🚨 PROBLEMAS IDENTIFICADOS NO CANVAS E CONTAINERS

### **🎯 PROBLEMA 1: OVERFLOW HIDDEN NO CSS**

```css
/* PROBLEMA CRÍTICO encontrado em editor-unified.css:83 */
.unified-editor-canvas {
  overflow: hidden; /* ❌ BLOQUEIA DRAG-AND-DROP */
}

/* PROBLEMA CRÍTICO encontrado em editor-unified.css:109 */
.preview-frame {
  overflow: hidden; /* ❌ BLOQUEIA EVENTOS DE DRAG */
}
```

### **🎯 PROBLEMA 2: CONTAINERS ANINHADOS COM OVERFLOW**

```typescript
// EditorUnified.tsx - ESTRUTURA PROBLEMÁTICA
<main className="unified-editor-canvas"> // overflow: hidden no CSS
  <div ref={scrollRef} className="overflow-visible"> // Conflito
    <UnifiedPreviewEngine> // Container interno
      <div className="preview-container"> // Container extra
        <div className="blocks-container"> // Container final
```

### **🎯 PROBLEMA 3: SCROLL REF EM CONFLITO**

```typescript
// useSyncedScroll pode estar interferindo
const { scrollRef } = useSyncedScroll({ source: 'canvas' });

// Aplicado em container com overflow problemático
<div ref={scrollRef} className="overflow-visible">
```

## 🔧 CORREÇÕES NECESSÁRIAS

### **1. CORRIGIR CSS OVERFLOW**

```css
/* ANTES (PROBLEMÁTICO) */
.unified-editor-canvas {
  overflow: hidden; /* ❌ Bloqueia DnD */
}

/* DEPOIS (CORRIGIDO) */
.unified-editor-canvas {
  overflow: visible; /* ✅ Permite DnD */
}
```

### **2. SIMPLIFICAR CONTAINERS**

```typescript
// ANTES (MUITOS CONTAINERS)
<main>
  <div ref={scrollRef}>
    <UnifiedPreviewEngine>
      <div className="preview-container">
        <div className="blocks-container">

// DEPOIS (SIMPLIFICADO)
<main ref={setCanvasDroppableRef}>
  <UnifiedPreviewEngine>
    <div className="blocks-container">
```

### **3. VERIFICAR SCROLL BEHAVIOR**

```typescript
// Possível interferência do useSyncedScroll
// Testar sem o scrollRef temporariamente
```

## 🧪 TESTES RECOMENDADOS

### **Teste 1: Remover overflow: hidden**

1. Alterar CSS para `overflow: visible`
2. Testar drag-and-drop
3. Verificar se eventos passam

### **Teste 2: Simplificar containers**

1. Remover container intermediário
2. Aplicar droppable diretamente no main
3. Testar comunicação

### **Teste 3: Desabilitar scroll sync**

1. Remover useSyncedScroll temporariamente
2. Verificar se resolve interferência
3. Testar DnD básico

## 🎯 PRIORIDADE DE CORREÇÃO

1. **🔴 CRÍTICO**: CSS overflow: hidden → visible
2. **🟡 MÉDIO**: Simplificar containers
3. **🟢 BAIXO**: Otimizar scroll behavior

---

## 🔍 ANÁLISE DETALHADA

### **CSS Problemático Detectado:**

- `overflow: hidden` no `.unified-editor-canvas`
- `overflow: hidden` no `.preview-frame`
- Containers aninhados com conflitos de overflow

### **JavaScript Problemático:**

- `useSyncedScroll` pode estar interferindo
- Múltiplas camadas de containers
- Ref aplicado em local incorreto

### **Próximos Passos:**

1. Corrigir CSS overflow
2. Testar drag-and-drop
3. Simplificar estrutura se necessário
