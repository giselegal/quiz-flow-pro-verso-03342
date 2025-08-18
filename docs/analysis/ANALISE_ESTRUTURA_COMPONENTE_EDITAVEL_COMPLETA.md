# 📋 ANÁLISE COMPLETA: ESTRUTURA PARA COMPONENTE 100% EDITÁVEL NO /EDITOR-FIXED

## 🎯 **RESUMO EXECUTIVO**

Para um componente ser **100% funcional e editável** no `/editor-fixed`, ele deve seguir uma arquitetura específica de **5 camadas integradas**:

1. **Registry** - Registro do componente
2. **Properties Schema** - Definição das propriedades editáveis
3. **Component Implementation** - Implementação que usa as propriedades
4. **Container Integration** - Integração com sistema de container
5. **Editor Integration** - Integração com o painel de propriedades

---

## 📊 **FLUXO COMPLETO DE DADOS**

```
User Input → Properties Panel → useUnifiedProperties → EditorContext →
SortableBlockWrapper → useContainerProperties → Component → Visual Update
```

---

## 🏗️ **1. ESTRUTURA DO REGISTRY**

### **Arquivo**: `src/config/enhancedBlockRegistry.ts`

```typescript
// ✅ PASSO 1: Importar o componente
import MyCustomBlock from '../components/editor/blocks/MyCustomBlock';

// ✅ PASSO 2: Registrar no ENHANCED_BLOCK_REGISTRY
export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // ... outros componentes
  'my-custom-block': MyCustomBlock, // 🎯 KEY = type usado no sistema
};
```

### **📋 REGRAS DO REGISTRY:**

- ✅ **Key**: String única que identifica o tipo (`"my-custom-block"`)
- ✅ **Value**: React.ComponentType que implementa BlockComponentProps
- ✅ **Consistência**: Key deve ser igual ao `type` usado em templates

---

## 🎛️ **2. SCHEMA DE PROPRIEDADES**

### **Arquivo**: `src/hooks/useUnifiedProperties.ts`

```typescript
// ✅ PASSO 3: Adicionar case no switch do useUnifiedProperties
switch (blockType) {
  case 'my-custom-block':
    return [
      ...baseProperties, // ✅ 7 propriedades universais (margens, escala, cores, etc.)

      // 🎯 PROPRIEDADES ESPECÍFICAS
      createProperty(
        'title', // key
        currentBlock?.properties?.title || 'Título Padrão', // valor padrão
        PropertyType.TEXT, // tipo do controle
        'Título', // label no painel
        PropertyCategory.CONTENT, // categoria
        { required: true } // opções extras
      ),

      createProperty(
        'size',
        currentBlock?.properties?.size || 'medium',
        PropertyType.SELECT,
        'Tamanho',
        PropertyCategory.STYLE,
        {
          options: createSelectOptions([
            { value: 'small', label: 'Pequeno' },
            { value: 'medium', label: 'Médio' },
            { value: 'large', label: 'Grande' },
          ]),
        }
      ),

      createProperty(
        'isVisible',
        currentBlock?.properties?.isVisible !== false,
        PropertyType.SWITCH,
        'Visível',
        PropertyCategory.LAYOUT
      ),
    ];
}
```

### **📋 TIPOS DE PROPRIEDADES DISPONÍVEIS:**

| PropertyType | Controle Visual       | Uso                 |
| ------------ | --------------------- | ------------------- |
| `TEXT`       | Input de texto        | Textos simples      |
| `TEXTAREA`   | Textarea              | Textos longos       |
| `SELECT`     | Dropdown              | Opções predefinidas |
| `SWITCH`     | Toggle                | Boolean on/off      |
| `RANGE`      | Slider                | Números com min/max |
| `COLOR`      | Color picker          | Cores               |
| `ALIGNMENT`  | Botões de alinhamento | left/center/right   |
| `RICHTEXT`   | Editor rich text      | Texto formatado     |

### **📋 CATEGORIAS DE PROPRIEDADES:**

| PropertyCategory | Seção no Painel |
| ---------------- | --------------- |
| `CONTENT`        | Conteúdo        |
| `STYLE`          | Estilo          |
| `LAYOUT`         | Layout          |
| `ADVANCED`       | Avançado        |

---

## 🧩 **3. IMPLEMENTAÇÃO DO COMPONENTE**

### **Arquivo**: `src/components/editor/blocks/MyCustomBlock.tsx`

```typescript
import { cn } from "@/lib/utils";
import React from "react";
import type { BlockComponentProps } from "../../../types/blocks";

interface MyCustomProperties {
  title?: string;
  size?: "small" | "medium" | "large";
  isVisible?: boolean;
  color?: string;
  // ✅ Propriedades universais são passadas automaticamente via processedProperties
}

const MyCustomBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange, // ✅ CRUCIAL: Callback para mudanças de propriedade
  className = "",
}) => {
  // ✅ PASSO 4: Extrair propriedades do block.properties
  const {
    title = "Título Padrão",
    size = "medium",
    isVisible = true,
    color = "#374151",
    // 🎯 Propriedades universais já processadas pelo SortableBlockWrapper
    marginTop,
    marginBottom,
    scale,
    textAlign,
  } = block?.properties ?? {};

  // ✅ PASSO 5: Implementar handlePropertyUpdate
  const handlePropertyUpdate = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  // ✅ PASSO 6: Aplicar lógica de estilo baseada nas propriedades
  const getSizeClass = () => {
    const sizeMap = {
      small: "text-sm p-2",
      medium: "text-base p-4",
      large: "text-lg p-6"
    };
    return sizeMap[size] || sizeMap.medium;
  };

  const getAlignmentClass = () => {
    const alignMap = {
      left: "text-left",
      center: "text-center",
      right: "text-right"
    };
    return alignMap[textAlign] || alignMap.left;
  };

  // ✅ PASSO 7: Renderização condicional baseada em propriedades
  if (!isVisible) {
    return null; // ou placeholder quando não visível
  }

  return (
    <div
      className={cn(
        "my-custom-block transition-all duration-200",
        getSizeClass(),
        getAlignmentClass(),
        isSelected && "ring-2 ring-blue-500 ring-opacity-50 rounded-md",
        className
      )}
      style={{
        color,
        // ✅ Escala é aplicada automaticamente pelo SortableBlockWrapper
        // ✅ Margens são aplicadas automaticamente pelo SortableBlockWrapper
      }}
      onClick={onClick}
    >
      {/* ✅ PASSO 8: Conteúdo editável em tempo real (opcional) */}
      <h2
        contentEditable={isSelected}
        suppressContentEditableWarning
        onBlur={(e) => handlePropertyUpdate("title", e.target.textContent || "")}
      >
        {title}
      </h2>
    </div>
  );
};

export default MyCustomBlock;
```

### **📋 REGRAS DO COMPONENTE:**

- ✅ **Props**: Deve implementar `BlockComponentProps`
- ✅ **Propriedades**: Extrair de `block.properties` com valores padrão
- ✅ **Callback**: Implementar `onPropertyChange` para atualizações
- ✅ **Styling**: Usar classes CSS baseadas nas propriedades
- ✅ **Responsividade**: Reagir a mudanças de propriedades

---

## 🔧 **4. INTEGRAÇÃO COM CONTAINER**

### **Automática via SortableBlockWrapper**

O `SortableBlockWrapper` automaticamente:

```typescript
// ✅ 1. Processa propriedades universais
const { containerClasses, inlineStyles, processedProperties } = useContainerProperties(
  block.properties
);

// ✅ 2. Passa propriedades processadas para o componente
<Component
  block={{
    ...block,
    properties: {
      ...block.properties,
      ...processedProperties // 🎯 Inclui margens, escala, classes CSS
    }
  }}
  onPropertyChange={handlePropertyChange}
/>
```

### **📋 PROPRIEDADES UNIVERSAIS AUTOMÁTICAS:**

- ✅ **Margens**: `marginTop`, `marginBottom`, `marginLeft`, `marginRight` (-40px a 100px)
- ✅ **Escala**: `scale` (50% a 200%)
- ✅ **Container**: `containerWidth`, `containerPosition`, `spacing`
- ✅ **Cores**: `backgroundColor`, `textColor`
- ✅ **Texto**: `fontSize`, `fontWeight`, `textAlign`

---

## 🎛️ **5. INTEGRAÇÃO COM PAINEL DE PROPRIEDADES**

### **Fluxo Automático:**

1. **User seleciona componente** → `selectedBlock` é definido
2. **EnhancedUniversalPropertiesPanel** → chama `useUnifiedProperties`
3. **useUnifiedProperties** → busca schema pelo `blockType`
4. **Painel renderiza controles** → baseado no schema
5. **User altera propriedade** → `updateProperty` é chamado
6. **EditorContext** → atualiza o bloco no estado
7. **SortableBlockWrapper** → re-renderiza com novas propriedades
8. **Componente** → atualiza visualmente

### **📋 DEBUG E LOGS:**

Para diagnosticar problemas, todos os pontos têm logs:

```typescript
// 🔍 Logs automáticos já implementados:
console.log('🔧 useUnifiedProperties - generateDefaultProperties chamado:', {
  blockType,
  basePropertiesCount,
});
console.log('🔧 useUnifiedProperties - updateProperty chamado:', { key, value, blockId });
console.log('🔧 EditorContext updateBlock chamado:', { blockId, updates });
console.log('🔧 SortableBlockWrapper - processedProperties:', {
  blockId,
  blockType,
  processedProperties,
});
console.log('🏗️ useContainerProperties chamado com:', properties);
```

---

## ✅ **CHECKLIST FINAL: COMPONENTE 100% EDITÁVEL**

### **📋 Registry & Schema:**

- [ ] Componente registrado em `ENHANCED_BLOCK_REGISTRY`
- [ ] Case adicionado em `useUnifiedProperties` switch
- [ ] Todas as propriedades definidas com `createProperty`
- [ ] Propriedades categorizadas corretamente

### **📋 Implementação:**

- [ ] Implementa `BlockComponentProps`
- [ ] Extrai propriedades de `block.properties` com defaults
- [ ] Implementa `onPropertyChange` callback
- [ ] Classes CSS reativas às propriedades
- [ ] Renderização condicional baseada em propriedades

### **📋 Testes:**

- [ ] Componente aparece na sidebar
- [ ] Pode ser arrastado para o canvas
- [ ] Aparece painel de propriedades quando selecionado
- [ ] Todas as propriedades funcionam em tempo real
- [ ] Propriedades universais (margens, escala) funcionam
- [ ] Salva estado corretamente

---

## 🚀 **EXEMPLOS DE SUCESSO**

### **✅ Componentes 100% Funcionais:**

- `text-inline` - Texto com rich editing
- `button-inline` - Botão com estilos
- `decorative-bar-inline` - Barra decorativa
- `quiz-intro-header` - Cabeçalho com logo

### **❌ Problemas Comuns:**

- **Não aparece na sidebar**: Não registrado no `ENHANCED_BLOCK_REGISTRY`
- **Painel vazio**: Faltando case em `useUnifiedProperties`
- **Propriedades não funcionam**: `onPropertyChange` não implementado
- **Não atualiza visual**: Classes CSS não reativas às propriedades

---

## 🎯 **CONCLUSÃO**

Um componente 100% editável no `/editor-fixed` requer:

1. **5 integrações obrigatórias**
2. **Schema completo de propriedades**
3. **Implementação reativa às propriedades**
4. **Callbacks corretos para updates**
5. **Logs para debugging**

**🚀 Seguindo esta estrutura, qualquer componente será totalmente funcional e editável!**
