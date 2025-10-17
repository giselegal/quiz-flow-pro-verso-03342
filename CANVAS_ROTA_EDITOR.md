# 🎯 Canvas Renderizado em `/editor?template=quiz21StepsComplete`

## ✅ RESPOSTA DIRETA

Quando você acessa **`/editor?template=quiz21StepsComplete`**, o canvas renderizado é:

### **`src/components/editor/quiz/components/CanvasArea.tsx`**

---

## 🔍 Fluxo Completo da Rota

### 1️⃣ **Rota no App.tsx**

**Arquivo:** `src/App.tsx` (linha 199-220)

```tsx
<Route path="/editor">
    {() => {
        console.log('🎯 /editor route matched');
        return (
            <EditorErrorBoundary>
                <div data-testid="quiz-modular-production-editor-page-optimized">
                    <Suspense fallback={<EnhancedLoadingFallback />}>
                        <EditorProviderUnified enableSupabase={true}>
                            <QuizModularProductionEditor />  // ← ESTE COMPONENTE
                        </EditorProviderUnified>
                    </Suspense>
                </div>
            </EditorErrorBoundary>
        );
    }}
</Route>
```

### 2️⃣ **Componente Principal**

**Arquivo:** `src/components/editor/quiz/QuizModularProductionEditor.tsx`

```tsx
import CanvasArea from './components/CanvasArea';  // linha 105

// ... dentro do render (linha 2569)

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
    isMultiSelected={isMultiSelected}
    handleBlockClick={handleBlockClick}
    // ... mais props
/>
```

### 3️⃣ **Canvas Renderizado**

**Arquivo:** `src/components/editor/quiz/components/CanvasArea.tsx`

Este é o **mesmo canvas onde aplicamos as correções de drag & drop!**

---

## 📋 Estrutura Completa

```
/editor?template=quiz21StepsComplete
    ↓
App.tsx (Route /editor)
    ↓
QuizModularProductionEditor
    ↓
CanvasArea (quiz/components) ← ESTE CANVAS!
    ↓
├── Modo Canvas (edit)
│   ├── BlockRow com DropZoneBefore
│   ├── useDroppable({ id: 'canvas-end' })
│   └── Drag & drop ativo
│
└── Modo Preview
    └── QuizAppConnected (runtime real)
```

---

## 🎯 Query Params: `?template=quiz21StepsComplete`

### **Como é processado:**

**Arquivo:** `QuizModularProductionEditor.tsx` (linha ~430)

```tsx
export const QuizModularProductionEditor: React.FC<QuizModularProductionEditorProps> = ({
    funnelId: initialFunnelId
}) => {
    // Extrair funnelId da URL ou props
    const [location] = useLocation();
    const urlParams = new URLSearchParams(location.split('?')[1]);
    const templateParam = urlParams.get('template');
    
    // Se tem ?template=quiz21StepsComplete, usa como funnelId
    const funnelId = initialFunnelId || templateParam || 'quiz21StepsComplete';
    
    // ... resto do código que carrega o template
}
```

O parâmetro `template=quiz21StepsComplete` é usado como **funnelId** para carregar os dados do quiz.

---

## ✅ Confirmação Final

### **Canvas Ativo:**
📁 `src/components/editor/quiz/components/CanvasArea.tsx`

### **Features Implementadas Neste Canvas:**
- ✅ **Drop zones entre blocos** (DropZoneBefore)
- ✅ **Drop zone no final** (canvas-end)
- ✅ **Drag & drop da biblioteca**
- ✅ **Seleção de blocos**
- ✅ **Modo Canvas + Preview**
- ✅ **Controles de dispositivo**
- ✅ **Correções aplicadas** (h-8, bordas visíveis, logs)

---

## 🔧 Arquivos Relacionados

### **Trio Principal do Sistema de Drag & Drop:**

1. **QuizModularProductionEditor.tsx**
   - Orquestra tudo
   - Gerencia estado (steps, selectedBlockId, etc)
   - Contém `handleDragEnd`

2. **CanvasArea.tsx** (quiz/components)
   - Renderiza o canvas
   - Tem `useDroppable({ id: 'canvas-end' })`
   - Alterna entre modo Canvas e Preview

3. **BlockRow.tsx**
   - Renderiza cada bloco individualmente
   - Contém `DropZoneBefore` com `useDroppable`
   - Gera IDs `drop-before-{blockId}`

---

## 🎨 Layout Visual

```
┌────────────────────────────────────────────────────────────────────┐
│                /editor?template=quiz21StepsComplete                 │
├────────────────────────────────────────────────────────────────────┤
│  Steps    │  Biblioteca  │   CanvasArea (quiz/components)  │ Props │
│           │              │                                  │       │
│ step-01   │ ⬜ Título    │  [Canvas] [Preview] ← tabs       │ blockId│
│ step-02   │ ⬜ Texto     │                                  │       │
│ step-03   │ ⬜ Botão     │  🎯 drop-before-block1           │ props  │
│ ...       │ ⬜ Imagem    │  ▣ Block 1                      │       │
│ step-21   │ ⬜ Quiz      │  🎯 drop-before-block2           │ content│
│           │ ⬜ Container │  ▣ Block 2                      │       │
│           │              │  🎯 drop-before-block3           │       │
│           │              │  ▣ Block 3                      │       │
│           │              │  🎯 canvas-end (drop zone)       │       │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Conclusão

### **URL:** `/editor?template=quiz21StepsComplete`

### **Canvas Renderizado:**
✅ `src/components/editor/quiz/components/CanvasArea.tsx`

### **Este é o canvas onde:**
- ✅ Aplicamos as correções de drag & drop
- ✅ Drop zones estão visíveis (h-8, bordas cinzas)
- ✅ Logs de debug aparecem no console
- ✅ Sistema completo de drag & drop funciona

**É o mesmo canvas que corrigimos!** 🎯
