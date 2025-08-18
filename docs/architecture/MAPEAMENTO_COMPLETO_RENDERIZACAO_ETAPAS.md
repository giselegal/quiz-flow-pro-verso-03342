# 🎯 MAPEAMENTO COMPLETO - CÓDIGO QUE RENDERIZA AS ETAPAS

## 📋 FLUXO COMPLETO DE RENDERIZAÇÃO

### 🔍 **1. PONTO DE ENTRADA - ROTA**

**Arquivo:** `src/pages/editor-fixed-dragdrop.tsx`

```tsx
// Página principal do editor
export default EditorFixedPageWithDragDrop;
```

### 🔍 **2. CONSUMO DO ESTADO - EditorContext**

**Arquivo:** `src/pages/editor-fixed-dragdrop.tsx` (linhas 40-70)

```tsx
const {
  activeStageId,           // ← "step-01", "step-02", etc
  selectedBlockId,
  blockActions: { ... },
  computed: { currentBlocks, ... } // ← BLOCOS DA ETAPA ATUAL
} = useEditor();
```

### 🔍 **3. FONTE DOS DADOS - EditorContext**

**Arquivo:** `src/context/EditorContext.tsx`

#### **📦 Carregamento Inicial** (linhas 268-288)

```tsx
// Carrega templates das 3 primeiras etapas
for (let i = 1; i <= 3; i++) {
  const stageId = `step-${String(i).padStart(2, '0')}`;
  const blocks = await TemplateManager.loadStepBlocks(stageId); // ← CHAVE!

  setStageBlocks(prev => ({
    ...prev,
    [stageId]: blocks, // ← BLOCOS ARMAZENADOS NO ESTADO
  }));
}
```

#### **📦 Carregamento Dinâmico** (linhas 420-440)

```tsx
// Quando troca de etapa
const blocks = await TemplateManager.loadStepBlocks(stageId); // ← CHAVE!
setStageBlocks(prev => ({
  ...prev,
  [stageId]: blocks, // ← BLOCOS DA NOVA ETAPA
}));
```

### 🔍 **4. CARREGADOR DE TEMPLATES - TemplateManager**

**Arquivo:** `src/utils/TemplateManager.ts` (linhas 13-85)

#### **🎯 Função Principal:**

```typescript
static async loadStepBlocks(stepId: string): Promise<Block[]> {
  // 1. Verificar cache
  // 2. Chamar templateService.getTemplateByStep(stepNumber)
  // 3. Converter JSON → Block[]
  // 4. Aplicar fallback se necessário
  // 5. Retornar blocos válidos
}
```

#### **🎯 Fonte dos Dados:**

```typescript
const template = await templateService.getTemplateByStep(stepNumber);
const blocks = templateService.convertTemplateBlocksToEditorBlocks(template.blocks);
```

### 🔍 **5. SERVIÇO DE TEMPLATES - templateService**

**Arquivo:** `src/services/templateService.ts` (linhas 150-175)

#### **🎯 Carregamento Real:**

```typescript
async getTemplateByStep(step: number): Promise<TemplateData | null> {
  const template = await getStepTemplate(step); // ← CARREGA JSON REAL
  return template;
}
```

#### **🎯 Conversão:**

```typescript
convertTemplateBlocksToEditorBlocks(templateBlocks): Block[] {
  return templateBlocks.map(block => ({
    id: block.id,           // "step01-header"
    type: block.type,       // "quiz-intro-header"
    content: block.properties,
    properties: block.properties
  }));
}
```

### 🔍 **6. FONTE DOS DADOS JSON - getStepTemplate**

**Arquivo:** `src/config/templates/templates.ts` (linhas 65-75)

#### **🎯 Carregamento Assíncrono:**

```typescript
export async function getStepTemplate(stepNumber: number): Promise<any> {
  const stepId = stepNumber.toString().padStart(2, '0');
  const response = await fetch(`/templates/step-${stepId}-template.json`);
  return await response.json(); // ← JSON REAL!
}
```

#### **🎯 Fonte Física:**

```
public/templates/step-01-template.json  ← ETAPA 1
public/templates/step-02-template.json  ← ETAPA 2
...
public/templates/step-21-template.json  ← ETAPA 21
```

### 🔍 **7. RENDERIZAÇÃO - CanvasDropZone**

**Arquivo:** `src/components/editor/canvas/CanvasDropZone.tsx` (linhas 108-135)

#### **🎯 Recebe Blocos:**

```tsx
<CanvasDropZone
  blocks={currentBlocks} // ← BLOCOS DA ETAPA ATUAL
  selectedBlockId={selectedBlockId}
  isPreviewing={isPreviewing}
  // ...
/>
```

#### **🎯 Renderiza Lista:**

```tsx
{
  blocks.map((block, index) => (
    <SortableBlockWrapper
      key={block.id}
      block={block} // ← BLOCO INDIVIDUAL
      isSelected={selectedBlockId === block.id}
      // ...
    />
  ));
}
```

### 🔍 **8. WRAPPER INDIVIDUAL - SortableBlockWrapper**

**Arquivo:** `src/components/editor/canvas/SortableBlockWrapper.tsx` (linhas 98, 210-225)

#### **🎯 Resolve Componente:**

```tsx
const Component = getBlockComponent(block.type); // ← RESOLVE COMPONENTE
```

#### **🎯 Renderiza Componente:**

```tsx
<Component
  block={{
    ...block,
    properties: { ...block.properties, ...safeProcessedProps },
  }}
  isSelected={false}
  onClick={onSelect}
  onPropertyChange={handlePropertyChange}
/>
```

### 🔍 **9. REGISTRO DE COMPONENTES - enhancedBlockRegistry**

**Arquivo:** `src/config/enhancedBlockRegistry.ts` (linhas 64-94, 139-180)

#### **🎯 Mapeamento de Tipos:**

```typescript
export const ENHANCED_BLOCK_REGISTRY = {
  'quiz-intro-header': QuizIntroHeaderBlock,
  'text-inline': TextInlineBlock,
  'image-display-inline': ImageDisplayInlineBlock,
  'form-input': FormInputBlock,
  'button-inline': ButtonInlineFixed,
  'decorative-bar-inline': DecorativeBarInlineBlock,
  'options-grid': OptionsGridInlineBlock,
  // ...
};
```

#### **🎯 Resolução de Componente:**

```typescript
export const getBlockComponent = (type: string) => {
  let component = ENHANCED_BLOCK_REGISTRY[type];

  if (component) {
    console.log(`✅ Componente encontrado: ${type}`);
    return component;
  }

  // Fallbacks...
  return component;
};
```

---

## 🎯 RESUMO DO FLUXO

```
📁 public/templates/step-01-template.json
    ↓ fetch assíncrono
📄 getStepTemplate()
    ↓ carrega JSON
📄 templateService.getTemplateByStep()
    ↓ converte para Block[]
📄 TemplateManager.loadStepBlocks()
    ↓ cache e fallback
📄 EditorContext (setStageBlocks)
    ↓ armazena no estado
📄 useEditor() → currentBlocks
    ↓ consome estado
📄 CanvasDropZone
    ↓ mapeia blocks
📄 SortableBlockWrapper
    ↓ resolve componente
📄 getBlockComponent(block.type)
    ↓ retorna React.Component
📄 QuizIntroHeaderBlock / TextInlineBlock / etc
    ↓ renderiza na tela
🎯 COMPONENTE VISUAL
```

---

## ✅ COMPONENTES QUE RENDERIZAM AS ETAPAS

### **📦 TIPOS DE BLOCOS SUPORTADOS:**

- `'quiz-intro-header'` → `QuizIntroHeaderBlock`
- `'text-inline'` → `TextInlineBlock`
- `'image-display-inline'` → `ImageDisplayInlineBlock`
- `'form-input'` → `FormInputBlock`
- `'button-inline'` → `ButtonInlineFixed`
- `'decorative-bar-inline'` → `DecorativeBarInlineBlock`
- `'options-grid'` → `OptionsGridInlineBlock`

### **📦 ETAPA 1 EXEMPLO:**

**JSON:** `public/templates/step-01-template.json`

```json
{
  "blocks": [
    { "type": "quiz-intro-header", "properties": {...} },
    { "type": "decorative-bar-inline", "properties": {...} },
    { "type": "text-inline", "properties": {...} },
    { "type": "image-display-inline", "properties": {...} },
    { "type": "form-input", "properties": {...} },
    { "type": "button-inline", "properties": {...} }
  ]
}
```

**RENDERIZAÇÃO:**

```tsx
<QuizIntroHeaderBlock properties={...} />
<DecorativeBarInlineBlock properties={...} />
<TextInlineBlock properties={...} />
<ImageDisplayInlineBlock properties={...} />
<FormInputBlock properties={...} />
<ButtonInlineFixed properties={...} />
```

---

## 🔍 NOTA SOBRE `stepTemplatesMapping.ts`

**❌ NÃO ESTÁ SENDO USADO** no fluxo atual do `/editor-fixed`

O arquivo `src/config/stepTemplatesMapping.ts` com `STEP_CONFIG` define:

- Nomes das etapas
- Descrições
- Templates de fallback

**MAS** o fluxo real usa:

- `public/templates/step-XX-template.json` (dados primários)
- `TemplateManager` + `templateService` (carregamento)
- `enhancedBlockRegistry` (componentes)

O `stepTemplatesMapping.ts` serve apenas como **fallback secundário** ou **documentação** das etapas.

---

**🎯 CONCLUSÃO: O código que renderiza as etapas é o conjunto `CanvasDropZone` → `SortableBlockWrapper` → `getBlockComponent` → `ENHANCED_BLOCK_REGISTRY`, alimentado pelos dados dos JSONs via `TemplateManager`.**
