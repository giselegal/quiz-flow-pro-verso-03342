# 🎨 ANÁLISE: Quantos Canvas Existem no /editor

## 📊 RESULTADO: **2 CANVAS ATIVOS**

---

## 🗂️ Arquivos Identificados

### 1️⃣ **Canvas Principal - QuizModularProductionEditor**
📁 `src/components/editor/quiz/components/CanvasArea.tsx`

**Usado em:** `QuizModularProductionEditor.tsx` (linha 2569)

```tsx
<CanvasArea
    activeTab={activeTab}
    onTabChange={(v) => handleTabChange(v as 'canvas' | 'preview')}
    steps={steps}
    selectedStep={selectedStep}
    headerConfig={headerConfig}
    liveScores={liveScores}
    topStyle={topStyle || undefined}
    BlockRow={BlockRow}
    byBlock={byBlock}
    selectedBlockId={effectiveSelectedBlockId}
    // ... mais props
/>
```

**Funcionalidades:**
- ✅ **Modo Canvas** (edit): Renderiza blocos com drag & drop
- ✅ **Modo Preview**: Visualização em tempo real
- ✅ **Drop Zones**: Aceita componentes da biblioteca (`canvas-end`)
- ✅ **Seleção de blocos**: Gerencia selectedBlockId
- ✅ **Controles de dispositivo**: Mobile/Desktop/Tablet
- ✅ **Integração com BlockRow**: Renderiza cada bloco individualmente

**Rota de uso:**
```
/editor → QuizModularProductionEditor → CanvasArea (quiz/components)
```

---

### 2️⃣ **Canvas Alternativo - UniversalStepEditorPro**
📁 `src/components/editor/layouts/CanvasArea.tsx`

**Usado em:** `UniversalStepEditorPro.tsx` (linhas 241, 290)

```tsx
<CanvasAreaLayout
    className="w-full canvas-area-preview"
    containerRef={previewContainerRef}
    mode={mode} // 'edit' | 'preview'
    previewDevice={previewDevice}
    safeCurrentStep={safeCurrentStep}
    currentStepData={currentStepData}
    selectedBlockId={selectedBlockId}
    actions={actions}
    isDragging={isDragging}
    funnelId="quiz21StepsComplete"
/>
```

**Funcionalidades:**
- ✅ **ScalableQuizRenderer**: Renderização escalável
- ✅ **CanvasDropZone**: Zona de drop simplificada
- ✅ **Modo edit/preview**: Alternância de modos
- ✅ **Suporte a dispositivos**: Mobile/Desktop

**Rota de uso:**
```
/editor → UniversalStepEditorPro → CanvasAreaLayout (layouts)
```

---

## 📍 Onde são usados?

### **QuizModularProductionEditor** (Canvas Principal)
- Rota: `/editor`
- Editor modular completo
- 3 colunas: Steps + Canvas + Propriedades
- **ATIVO e em uso**

### **UniversalStepEditorPro** (Canvas Alternativo)
- Rota: `/editor/universal` (?)
- Editor universal experimental
- Layout flexível
- **Status**: Pode estar em desenvolvimento/experimental

---

## 🔍 Diferenças Entre os Canvas

| Aspecto | QuizModularProductionEditor | UniversalStepEditorPro |
|---------|----------------------------|------------------------|
| **Arquivo** | `quiz/components/CanvasArea.tsx` | `layouts/CanvasArea.tsx` |
| **Complexidade** | Alta (260+ linhas) | Média (90 linhas) |
| **Drag & Drop** | ✅ Completo com drop zones | ✅ Básico (CanvasDropZone) |
| **Preview** | ✅ QuizAppConnected integrado | ✅ ScalableQuizRenderer |
| **Controles** | ✅ Tabs Canvas/Preview | ✅ Modo edit/preview |
| **BlockRow** | ✅ Integrado (prop) | ❌ Não usa |
| **Estado** | ✅ ATIVO | ⚠️ Experimental |

---

## 🎯 Canvas em Uso no /editor

### **RESPOSTA DIRETA: 1 CANVAS PRINCIPAL EM USO**

O editor `/editor` usa **apenas 1 canvas ativo**:
- **`src/components/editor/quiz/components/CanvasArea.tsx`**
- Renderizado por `QuizModularProductionEditor`
- Este é o canvas onde aplicamos as correções de drag & drop

O segundo canvas (`layouts/CanvasArea.tsx`) é usado pelo `UniversalStepEditorPro`, que parece ser um editor alternativo/experimental.

---

## 🔧 Qual Canvas Tem os Drop Zones?

✅ **`quiz/components/CanvasArea.tsx`** (Canvas Principal)

Este é o canvas que:
- Tem `useDroppable({ id: 'canvas-end' })`
- Renderiza os `BlockRow` com `DropZoneBefore`
- Integra com `handleDragEnd` do `QuizModularProductionEditor`
- **É onde aplicamos as correções!**

---

## 📝 Componentes Relacionados

### **Componentes que usam Canvas:**

1. **QuizModularProductionEditor.tsx**
   - Importa: `CanvasArea` (quiz/components)
   - Linha 105: `import CanvasArea from './components/CanvasArea';`
   - Linha 2569: `<CanvasArea ... />`

2. **UniversalStepEditorPro.tsx**
   - Importa: `CanvasAreaLayout` (layouts)
   - Linha 15: `import('@/components/editor/layouts/CanvasArea')`
   - Linhas 241, 290: `<CanvasAreaLayout ... />`

---

## 🎨 Estrutura Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                    /editor (QuizModularProductionEditor)         │
├─────────────────────────────────────────────────────────────────┤
│  COLUNA 1       │      COLUNA 2 (CANVAS)      │    COLUNA 3    │
│   Steps         │   CanvasArea.tsx (quiz)     │  Propriedades  │
│                 │                              │                │
│  - step-01      │   ┌──────────────────────┐  │  - blockId     │
│  - step-02      │   │ 🎯 DROP ZONE (top)   │  │  - properties  │
│  - step-03      │   ├──────────────────────┤  │  - content     │
│                 │   │ ▣ Block 1            │  │                │
│                 │   │ 🎯 DROP ZONE         │  │                │
│                 │   │ ▣ Block 2            │  │                │
│                 │   │ 🎯 DROP ZONE         │  │                │
│                 │   │ ▣ Block 3            │  │                │
│                 │   │ 🎯 DROP ZONE (end)   │  │                │
│                 │   └──────────────────────┘  │                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚨 CONCLUSÃO

### ✅ **1 CANVAS ATIVO PRINCIPAL** no `/editor`

**Arquivo:** `src/components/editor/quiz/components/CanvasArea.tsx`

**Este é o canvas onde:**
- ✅ Drop zones foram implementadas
- ✅ Drag & drop funciona
- ✅ BlockRow renderiza os blocos
- ✅ Correções foram aplicadas (h-8, border visível, logs)

### 📦 **1 CANVAS EXPERIMENTAL**

**Arquivo:** `src/components/editor/layouts/CanvasArea.tsx`

**Status:** Usado por `UniversalStepEditorPro` (editor alternativo/experimental)

---

## 🎯 Para Debug/Testes

Se precisa testar o canvas, foque em:
- ✅ `src/components/editor/quiz/components/CanvasArea.tsx`
- ✅ `src/components/editor/quiz/components/BlockRow.tsx`
- ✅ `src/components/editor/quiz/QuizModularProductionEditor.tsx`

Estes são os 3 arquivos principais do sistema de drag & drop atual! 🚀
