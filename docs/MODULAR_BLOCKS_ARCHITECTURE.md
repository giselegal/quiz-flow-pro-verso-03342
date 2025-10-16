# 🎨 ARQUITETURA DE BLOCOS MODULARES

## VISÃO GERAL

Sistema completo de decomposição de steps em **blocos atômicos modulares**, permitindo edição visual, drag & drop e total customização.

---

## 📁 ESTRUTURA DE ARQUIVOS

```
src/
├── components/
│   └── editor/
│       └── blocks/
│           ├── atomic/               # Blocos atômicos reutilizáveis
│           │   ├── LogoBlock.tsx
│           │   ├── HeadlineBlock.tsx
│           │   ├── ImageBlock.tsx
│           │   ├── TextBlock.tsx
│           │   ├── FormInputBlock.tsx
│           │   ├── ButtonBlock.tsx
│           │   ├── GridOptionsBlock.tsx
│           │   ├── FooterBlock.tsx
│           │   ├── SpacerBlock.tsx
│           │   ├── ProgressBarBlock.tsx
│           │   └── index.ts         # Export central
│           └── BlockRenderer.tsx     # Sistema de renderização
│
├── data/
│   └── stepBlockSchemas.ts          # Schemas de steps com blocos
│
└── utils/
    └── migrateStepToBlocks.ts       # Migração de dados (próxima fase)
```

---

## 🧩 BLOCOS ATÔMICOS

### 1. **LogoBlock**
- Logo + barra decorativa opcional
- Props: `logoUrl`, `height`, `width`, `showDecorator`, `decoratorColor`

### 2. **HeadlineBlock**
- Títulos com suporte a HTML
- Props: `text`, `html`, `level`, `fontSize`, `fontWeight`, `fontFamily`, `color`, `align`

### 3. **ImageBlock**
- Imagens responsivas com aspect ratio
- Props: `src`, `alt`, `aspectRatio`, `maxWidth`, `rounded`, `shadow`, `objectFit`

### 4. **TextBlock**
- Parágrafos com highlights customizáveis
- Props: `text`, `html`, `size`, `color`, `align`, `weight`, `highlights`

### 5. **FormInputBlock**
- Inputs de formulário com validação
- Props: `label`, `placeholder`, `required`, `inputType`, `value`, `onChange`

### 6. **ButtonBlock**
- Botões CTA com variantes e animações
- Props: `text`, `variant`, `size`, `fullWidth`, `bgColor`, `hoverBgColor`, `disabled`, `animate`

### 7. **GridOptionsBlock**
- Grid de opções para quiz (com imagens)
- Props: `options`, `columns`, `gap`, `hasImages`, `selectionIndicator`, `maxSelections`

### 8. **FooterBlock**
- Rodapé com copyright e links
- Props: `text`, `align`, `size`, `color`, `links`

### 9. **SpacerBlock**
- Espaçador vertical customizável
- Props: `height`

### 10. **ProgressBarBlock**
- Barra de progresso animada
- Props: `progress`, `showPercentage`, `height`, `bgColor`, `fillColor`, `animated`

---

## 📐 SCHEMAS DE STEPS

### Exemplo: INTRO_STEP_SCHEMA

```typescript
{
  type: 'intro',
  blocks: [
    {
      id: 'intro-logo',
      type: 'LogoBlock',
      order: 0,
      props: { logoUrl: '...', height: 55, width: 132 },
      editable: true,
      deletable: false,
      movable: false
    },
    {
      id: 'intro-headline',
      type: 'HeadlineBlock',
      order: 1,
      props: { html: '...', fontSize: 'text-2xl' },
      editable: true,
      deletable: true,
      movable: true
    },
    // ... outros blocos
  ]
}
```

### Schemas Disponíveis
- ✅ `INTRO_STEP_SCHEMA` - 7 blocos
- ✅ `QUESTION_STEP_SCHEMA` - 8 blocos (com placeholders dinâmicos)
- ✅ `RESULT_STEP_SCHEMA` - 5 blocos (simplificado)

---

## 🎯 SISTEMA DE RENDERIZAÇÃO

### BlockRenderer

**Responsabilidades:**
1. Renderizar componente atômico correto
2. Processar placeholders dinâmicos `{{variável}}`
3. Overlay de edição (modo `edit`)
4. Drag handles e action buttons

**Props:**
- `block` - Schema do bloco
- `mode` - `'edit'` ou `'preview'`
- `isSelected` - Estado de seleção
- `onSelect`, `onUpdate`, `onDelete`, `onDuplicate`, `onReorder` - Handlers
- `contextData` - Dados dinâmicos para placeholders

**Exemplo de uso:**
```tsx
<BlockRenderer
  block={block}
  mode="edit"
  isSelected={selectedBlockId === block.id}
  onSelect={setSelectedBlockId}
  onUpdate={handleBlockUpdate}
  onDelete={handleBlockDelete}
  contextData={{ userName: 'Maria', progress: 50 }}
/>
```

---

## 🔄 PLACEHOLDERS DINÂMICOS

Blocos podem usar placeholders que são substituídos em tempo real:

```typescript
// Schema com placeholders
{
  id: 'question-text',
  type: 'HeadlineBlock',
  props: {
    text: '{{questionText}}' // Placeholder
  }
}

// Context data fornecido
const contextData = {
  questionText: 'Qual seu estilo preferido?',
  progress: 30,
  userName: 'Maria'
};

// Resultado renderizado
<HeadlineBlock text="Qual seu estilo preferido?" />
```

**Placeholders comuns:**
- `{{userName}}` - Nome do usuário
- `{{questionText}}` - Texto da pergunta
- `{{questionNumber}}` - Número da questão
- `{{progress}}` - Progresso (0-100)
- `{{options}}` - Array de opções
- `{{styleName}}` - Nome do estilo resultante

---

## 🎨 MODO EDIT VS PREVIEW

### Preview Mode
- Renderização pura do bloco
- Interatividade funcional (formulários, botões)
- Sem overlays ou controles

### Edit Mode
- **Drag handle** (à esquerda)
- **Action buttons** quando selecionado:
  - ⬆️ Mover para cima
  - ⬇️ Mover para baixo
  - 📋 Duplicar
  - 🗑️ Deletar (se `deletable: true`)
- **Label do tipo** no hover
- **Ring de seleção** quando clicado

---

## 🔧 PROPRIEDADES DE CONTROLE

Cada bloco no schema possui flags de controle:

```typescript
{
  editable: boolean;   // Props editáveis no painel
  deletable: boolean;  // Pode ser deletado
  movable: boolean;    // Pode ser reordenado
}
```

**Exemplos:**
- Logo: `editable: true, deletable: false, movable: false` (sempre no topo)
- Headline: `editable: true, deletable: true, movable: true` (totalmente flexível)
- Form Input: `editable: true, deletable: false, movable: true` (obrigatório mas reordenável)

---

## 📊 BENEFÍCIOS

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Código** | 203 linhas/step | **50 linhas/step** (-75%) |
| **Edição** | Hardcoded | ✅ Visual no painel |
| **Reordenação** | Impossível | ✅ Drag & drop |
| **Reuso** | Duplicado | ✅ Biblioteca atômica |
| **Consistência** | Estilos espalhados | ✅ Design system único |
| **Performance** | Re-render global | ✅ Memo + lazy loading |

---

## 🚀 PRÓXIMAS FASES

### ✅ FASE 1-3: Concluídas
- ✅ Biblioteca de atomic blocks
- ✅ Step block schemas
- ✅ BlockRenderer system

### 🔄 FASE 4: Refatorar Steps (PRÓXIMA)
- Refatorar `IntroStep.tsx` para usar blocos
- Refatorar `QuestionStep.tsx` para usar blocos
- Refatorar `ResultStep.tsx` para usar blocos

### ⏳ FASE 5-7: Pendentes
- Painel de edição de blocos
- Migração de dados existentes
- Testes e validação

---

## 💡 EXEMPLOS DE USO

### Criar step do zero com blocos
```typescript
import { INTRO_STEP_SCHEMA } from '@/data/stepBlockSchemas';
import { BlockRenderer } from '@/components/editor/blocks/BlockRenderer';

function IntroStepNew() {
  const [blocks, setBlocks] = useState(INTRO_STEP_SCHEMA.blocks);
  
  return (
    <div className="space-y-6">
      {blocks.map(block => (
        <BlockRenderer
          key={block.id}
          block={block}
          mode="preview"
        />
      ))}
    </div>
  );
}
```

### Adicionar novo bloco dinamicamente
```typescript
const addNewBlock = () => {
  const newBlock: StepBlockSchema = {
    id: `text-${Date.now()}`,
    type: 'TextBlock',
    order: blocks.length,
    props: {
      text: 'Novo texto',
      size: 'text-base',
      align: 'center'
    },
    editable: true,
    deletable: true,
    movable: true
  };
  
  setBlocks(prev => [...prev, newBlock]);
};
```

### Atualizar props de bloco
```typescript
const handleBlockUpdate = (blockId: string, updates: any) => {
  setBlocks(prev =>
    prev.map(b =>
      b.id === blockId
        ? { ...b, props: { ...b.props, ...updates } }
        : b
    )
  );
};
```

---

## 📝 CONVENÇÕES

1. **Naming**: Todos os blocos terminam com `Block` (ex: `LogoBlock`, `HeadlineBlock`)
2. **Props**: Sempre exportar interface de props (`HeadlineBlockProps`)
3. **Memo**: Todos os blocos usam `React.memo` para performance
4. **Mode**: Todos os blocos aceitam prop `mode: 'edit' | 'preview'`
5. **Classnames**: Usar `cn()` do `@/lib/utils` para merge condicional
6. **Placeholders**: Formato `{{variableName}}` para valores dinâmicos

---

## 🎯 STATUS ATUAL

**FASE 1-3: ✅ COMPLETAS (100%)**
- ✅ 10 atomic blocks implementados
- ✅ 3 step schemas definidos
- ✅ BlockRenderer com overlay de edição
- ✅ Sistema de placeholders dinâmicos
- ✅ Documentação completa

**PRÓXIMO PASSO:**
🔄 **FASE 4: Refatorar steps existentes para usar blocos**
