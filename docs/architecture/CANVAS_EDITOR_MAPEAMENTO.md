## 🎨 **CANVAS DO /EDITOR - MAPEAMENTO COMPLETO**

### 📍 **LOCALIZAÇÃO PRINCIPAL**
**Arquivo Principal:** `src/components/editor/EditorPro/components/EditorCanvas.tsx`
**Importado em:** `src/components/editor/EditorProUnified.tsx` (linha 25)
**Usado em:** `src/pages/editor/ModernUnifiedEditor.tsx`

### 🏗️ **ESTRUTURA DO CANVAS**

```
/editor (ModernUnifiedEditor)
└── EditorProUnified
    └── EditorCanvas ← **CANVAS PRINCIPAL**
        ├── ScalableQuizRenderer (preview mode)
        ├── UnifiedPreviewEngine (real experience mode)  
        └── CanvasDropZone (editor mode) ← **ÁREA DE EDIÇÃO**
            └── SortableBlockWrapper (componentes arrastáveis)
```

### 🎛️ **3 MODOS DE FUNCIONAMENTO**

#### 1️⃣ **PREVIEW MODE** (`isPreviewMode = true`)
```tsx
<ScalableQuizRenderer
  funnelId="quiz21StepsComplete"
  mode="preview"
  debugMode={true}
  className="preview-mode-canvas w-full h-full"
  onStepChange={(step, data) => {
    if (onStepChange) onStepChange(step);
  }}
/>
```

#### 2️⃣ **REAL EXPERIENCE MODE** (`realExperienceMode = true`)
```tsx
<UnifiedPreviewEngine
  blocks={blocks}
  selectedBlockId={selectedBlock?.id}
  isPreviewing={false}
  viewportSize="desktop"
  onBlockSelect={onSelectBlock}
  onBlockUpdate={onUpdateBlock}
  funnelId="quiz21StepsComplete"
  currentStep={currentStep}
  enableInteractions={true}
  mode="editor"
  enableProductionMode={realExperienceMode}
/>
```

#### 3️⃣ **EDITOR MODE** (modo padrão)
```tsx
<CanvasDropZone
  blocks={blocks}
  selectedBlockId={selectedBlock?.id || null}
  onSelectBlock={handleBlockSelection}
  onUpdateBlock={onUpdateBlock}
  onDeleteBlock={onDeleteBlock}
  scopeId={currentStep}
/>
```

### 🧩 **COMPONENTES DO CANVAS**

#### **EditorCanvas** (Principal)
- **Arquivo:** `src/components/editor/EditorPro/components/EditorCanvas.tsx`
- **Função:** Container principal que decide qual modo renderizar
- **Props principais:**
  - `blocks`: Array de blocos/componentes
  - `selectedBlock`: Bloco atualmente selecionado
  - `currentStep`: Etapa atual do funil
  - `isPreviewMode`: Modo de visualização
  - `realExperienceMode`: Modo de experiência real
  - `onSelectBlock`, `onUpdateBlock`, `onDeleteBlock`: Handlers de eventos

#### **CanvasDropZone** (Área de Edição)
- **Arquivo:** `src/components/editor/canvas/CanvasDropZone.simple.tsx`
- **Função:** Zona de drop para arrastar e soltar componentes
- **Recursos:**
  - Drag & Drop com @dnd-kit
  - SortableContext para reordenação
  - Controles de navegação entre etapas
  - Otimização de performance

#### **ScalableQuizRenderer** (Preview)
- **Função:** Renderiza preview escalável do quiz
- **Usado em:** Modo preview
- **Props:** `funnelId`, `mode`, `debugMode`, `onStepChange`

#### **UnifiedPreviewEngine** (Experiência Real)
- **Função:** Engine unificada para experiência completa
- **Usado em:** Modo real experience
- **Recursos:** Interações habilitadas, modo produção

### 🎨 **ESTILOS VISUAIS**

```css
/* Background gradient padrão */
bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1]

/* Classes principais */
.canvas-editor {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow-y: auto;
}

.preview-mode-canvas {
  width: 100%;
  height: 100%;
}
```

### 🚀 **CANVASES ADICIONAIS**

#### **InteractiveQuizCanvas**
- **Arquivo:** `src/components/editor/interactive/InteractiveQuizCanvas.tsx`
- **Função:** Canvas interativo para testes de quiz
- **Recursos:**
  - Responder perguntas em tempo real
  - Validação como produção
  - Estado persistido
  - Navegação entre etapas

#### **UniversalVisualEditor Canvas**
- **Arquivo:** `src/pages/editor/UniversalVisualEditor.tsx`
- **Função:** Canvas alternativo com componente Canvas dedicado
- **Recursos:**
  - Canvas responsivo por dispositivo
  - CanvasElement para elementos individuais

### 🔧 **OTIMIZAÇÕES DE PERFORMANCE**

```tsx
// Memo com comparação profunda personalizada
export default memo(EditorCanvas, arePropsEqual);

// Função de comparação otimizada
const arePropsEqual = (prevProps, nextProps) => {
  // 1. Comparações rápidas
  // 2. Comparar selectedBlock
  // 3. Comparar handlers
  // 4. Comparação inteligente de blocos
  // 5. Comparação shallow de propriedades
};
```

### 📱 **COMO ACESSAR NO NAVEGADOR**

- **Editor Principal:** http://localhost:8080/editor
- **Canvas em Modo Preview:** Alternar botão "Preview" no editor
- **Canvas Modo Real:** Alternar "Real Experience" no editor
- **Canvas Interativo:** Usado em componentes específicos de demo

### 🎯 **RESUMO EXECUTIVO**

O **canvas do /editor** é um sistema multi-modal composto por:

1. **📝 Editor Mode**: Para criação e edição de componentes
2. **👁️ Preview Mode**: Para visualização do resultado final
3. **🎮 Real Experience Mode**: Para experiência completa de usuário
4. **🧪 Interactive Mode**: Para testes interativos de quiz

**Localização principal:** `EditorCanvas.tsx` no EditorPro/components, renderizado dentro do `EditorProUnified` que por sua vez é chamado pelo `ModernUnifiedEditor` na rota `/editor`.

O canvas utiliza drag & drop, otimizações de performance avançadas, e suporte a múltiplos modos de visualização para proporcionar uma experiência completa de edição de funis/quizzes.