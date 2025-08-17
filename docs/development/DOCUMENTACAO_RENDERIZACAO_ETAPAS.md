# 🔍 CÓDIGOS RESPONSÁVEIS POR LISTAR E RENDERIZAR ETAPAS

## 📋 **1. CÓDIGO QUE LISTA AS ETAPAS**

### 🗂️ **EditorContext.tsx** - Carregamento e Listagem

**Arquivo**: `/src/context/EditorContext.tsx`

#### **Função que carrega os 21 templates:**

```typescript
// ✅ IMPORTA OS TEMPLATES
import { getStepTemplate, getStepInfo, getAllSteps } from '@/config/stepTemplatesMapping';

// ✅ INICIALIZAÇÃO DAS 21 ETAPAS
const [stages, setStages] = useState<FunnelStage[]>(() => {
  const allStepTemplates = getAllSteps(); // 🔥 CARREGA OS 21 TEMPLATES

  const initialStages = allStepTemplates.map((stepTemplate, index) => ({
    id: `step-${stepTemplate.stepNumber}`,           // step-1, step-2...step-21
    name: stepTemplate.name,                         // Nome da etapa
    order: stepTemplate.stepNumber,                  // 1, 2, 3...21
    type: /* Tipo baseado no número */,
    description: stepTemplate.description,
    isActive: stepTemplate.stepNumber === 1,
    metadata: {
      templateBlocks: getStepTemplate(stepTemplate.stepNumber) // ✅ BLOCOS DO TEMPLATE
    }
  }));

  return initialStages; // 🎯 RETORNA AS 21 ETAPAS
});
```

---

## 🎨 **2. CÓDIGO QUE RENDERIZA A LISTA DE ETAPAS**

### 📱 **FunnelStagesPanel.tsx** - Interface Visual

**Arquivo**: `/src/components/editor/funnel/FunnelStagesPanel.tsx`

#### **Renderização da lista lateral:**

```tsx
<CardContent className="flex-1 p-0 overflow-hidden">
  <ScrollArea className="h-full">
    <div className="space-y-2 p-4">
      {stages.map((stage, index) => {
        // 🔥 ITERA PELAS 21 ETAPAS
        return (
          <div
            key={stage.id}
            className={cn(
              'group relative rounded-lg border-2 transition-all cursor-pointer',
              activeStageId === stage.id
                ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200' // ✅ ETAPA ATIVA
                : 'border-gray-300 bg-white hover:bg-gray-50'
            )}
            onClick={() => handleStageClick(stage.id)} // 🎯 NAVEGAÇÃO
          >
            <div className="p-4">
              {/* 📍 NÚMERO DA ETAPA */}
              <span className="font-medium text-sm">Etapa {stage.order}</span>

              {/* 📝 NOME/DESCRIÇÃO */}
              <p className="text-xs text-muted-foreground">{stage.name || stage.description}</p>

              {/* 🟢 INDICADOR DE ATIVA */}
              {activeStageId === stage.id && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-purple-600 font-medium">ATIVA</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </ScrollArea>
</CardContent>
```

---

## 🖼️ **3. CÓDIGO QUE RENDERIZA O CONTEÚDO DAS ETAPAS**

### 🎭 **editor-fixed.tsx** - Canvas Principal

**Arquivo**: `/src/pages/editor-fixed.tsx`

#### **Renderização dos blocos da etapa ativa:**

```tsx
// ✅ OBTÉM BLOCOS DA ETAPA ATIVA
const { currentBlocks } = useEditor(); // Blocos da etapa selecionada

// 🎨 RENDERIZAÇÃO NO CANVAS
<div className="p-6 overflow-auto h-full bg-gradient-to-br from-stone-50/50 via-yellow-50/20 to-stone-100/30">
  {currentBlocks.length === 0 ? (
    // 📭 ETAPA VAZIA
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h3 className="text-lg font-medium text-stone-600 mb-2">Etapa {activeStageId} - Vazia</h3>
      <p className="text-stone-500 mb-4">Adicione componentes usando a barra lateral</p>
    </div>
  ) : (
    // 🎯 BLOCOS DA ETAPA
    <div className="space-y-6">
      {currentBlocks.map(
        (
          block // 🔥 RENDERIZA CADA BLOCO
        ) => (
          <div
            key={block.id}
            className={`border-2 rounded-xl p-6 cursor-pointer transition-all
            ${
              selectedBlockId === block.id
                ? 'border-yellow-300 bg-yellow-50/80 shadow-lg'
                : 'border-stone-200/60 hover:border-yellow-200'
            }`}
            onClick={() => setSelectedBlockId(block.id)}
          >
            {/* 🧩 RENDERIZA O COMPONENTE DO BLOCO */}
            <UniversalBlockRenderer
              block={block}
              isSelected={selectedBlockId === block.id}
              onClick={() => setSelectedBlockId(block.id)}
              onPropertyChange={(key, value) => updateBlock(block.id, { [key]: value })}
            />
          </div>
        )
      )}
    </div>
  )}
</div>;
```

---

## 🧩 **4. CÓDIGO QUE RENDERIZA COMPONENTES INDIVIDUAIS**

### 🎪 **UniversalBlockRenderer.tsx** - Renderizador Universal

**Arquivo**: `/src/components/editor/blocks/UniversalBlockRenderer.tsx`

#### **Renderização de cada bloco/componente:**

```tsx
const UniversalBlockRenderer: React.FC<UniversalBlockRendererProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange,
}) => {
  // 🔍 BUSCA O COMPONENTE NO REGISTRY
  const Component = getEnhancedComponent(block.type);

  if (!Component) {
    // ⚠️ COMPONENTE NÃO ENCONTRADO
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
        <div className="text-center">
          <div className="font-medium">⚠️ Componente não encontrado</div>
          <div className="text-sm">Tipo: {block.type}</div>
        </div>
      </div>
    );
  }

  // ✅ RENDERIZA O COMPONENTE
  return (
    <Component
      block={block}
      isSelected={isSelected}
      onClick={onClick}
      onPropertyChange={onPropertyChange}
    />
  );
};
```

---

## 🗺️ **5. MAPEAMENTO E CONFIGURAÇÃO**

### 📋 **stepTemplatesMapping.ts** - Configuração dos Templates

**Arquivo**: `/src/config/stepTemplatesMapping.ts`

#### **Função que fornece os templates:**

```typescript
// ✅ IMPORTA TODOS OS 21 TEMPLATES
import { getStep01Template } from '@/components/steps/Step01Template';
import { getStep02Template } from '@/components/steps/Step02Template';
// ... até Step21Template

// 🗺️ MAPEAMENTO COMPLETO
export const STEP_TEMPLATES_MAPPING: Record<number, StepTemplate> = {
  1: { stepNumber: 1, templateFunction: getStep01Template, name: 'Introdução' },
  2: {
    stepNumber: 2,
    templateFunction: getStep02Template,
    name: 'Q1 - Tipo de Roupa',
  },
  // ... até 21
};

// 🔧 FUNÇÕES UTILITÁRIAS
export const getStepTemplate = (stepNumber: number): any[] => {
  const stepTemplate = STEP_TEMPLATES_MAPPING[stepNumber];
  return stepTemplate ? stepTemplate.templateFunction() : [];
};

export const getAllSteps = (): StepTemplate[] => {
  return Object.values(STEP_TEMPLATES_MAPPING); // 🎯 RETORNA OS 21 TEMPLATES
};
```

---

## 🔄 **FLUXO COMPLETO DE RENDERIZAÇÃO**

### 📋 **Passo a Passo:**

1. **📚 Carregamento Inicial** (`EditorContext.tsx`):

   ```typescript
   getAllSteps() → 21 templates carregados
   ```

2. **🗂️ Criação das Etapas** (`EditorContext.tsx`):

   ```typescript
   allStepTemplates.map() → 21 FunnelStage objects
   ```

3. **📱 Listagem Visual** (`FunnelStagesPanel.tsx`):

   ```tsx
   stages.map() → 21 divs com etapas clicáveis
   ```

4. **👆 Clique do Usuário** (`FunnelStagesPanel.tsx`):

   ```typescript
   handleStageClick(stage.id) → setActiveStage()
   ```

5. **🎯 Mudança de Etapa** (`EditorContext.tsx`):

   ```typescript
   activeStageId muda → currentBlocks recalculado
   ```

6. **🖼️ Renderização do Canvas** (`editor-fixed.tsx`):

   ```tsx
   currentBlocks.map() → Blocos da etapa ativa
   ```

7. **🧩 Renderização Individual** (`UniversalBlockRenderer.tsx`):
   ```tsx
   getEnhancedComponent(block.type) → Componente específico
   ```

---

## 🎯 **RESUMO DOS ARQUIVOS CHAVE**

| **Responsabilidade**     | **Arquivo**                  | **Função Principal**        |
| ------------------------ | ---------------------------- | --------------------------- |
| **📋 Carrega Templates** | `stepTemplatesMapping.ts`    | `getAllSteps()`             |
| **🗂️ Gerencia Estado**   | `EditorContext.tsx`          | `useState<FunnelStage[]>()` |
| **📱 Lista Etapas**      | `FunnelStagesPanel.tsx`      | `stages.map()`              |
| **🖼️ Renderiza Canvas**  | `editor-fixed.tsx`           | `currentBlocks.map()`       |
| **🧩 Renderiza Blocos**  | `UniversalBlockRenderer.tsx` | `getEnhancedComponent()`    |

---

**🎉 SISTEMA COMPLETO E FUNCIONAL! 🚀**
