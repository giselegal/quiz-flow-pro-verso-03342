# 🎯 Plano de Correção V4.0 - Arquitetura Modular

**Data:** 28/11/2025  
**Objetivo:** Implementar estrutura V4.0 com blocos modulares, reutilizáveis e reordenáveis

---

## 🏗️ ARQUITETURA MODULAR

### Conceito Core:
```
Quiz = Metadata + Sections[] + Settings
Section = Step (1-21) com Blocks[] configuráveis
Block = Componente reutilizável (Title, Options, Image, CTA, etc.)
```

### Princípios:
1. ✅ **Modularidade** - Cada bloco é independente
2. ✅ **Reusabilidade** - Blocos podem ser usados em múltiplas sections
3. ✅ **Reordenável** - Drag & drop vertical no canvas
4. ✅ **Escalável** - De 1 a 21 steps facilmente
5. ✅ **Validável** - Schema Zod + JSON Schema

---

## 📋 FASE 1: Estrutura Base (AGORA - 2h)

### 1.1 Criar Schema V4.0 com Blocks Modulares
**Arquivo:** `src/schemas/quiz-v4.schema.ts`

```typescript
// Estrutura hierárquica:
QuizV4
  ├── metadata (id, title, description, etc.)
  ├── sections[] (steps de 1-21)
  │     ├── id
  │     ├── order (para reordenação)
  │     ├── type (question, result, offer, etc.)
  │     └── blocks[] (componentes modulares)
  │           ├── id
  │           ├── type (title, description, options, image, etc.)
  │           ├── order (posição vertical)
  │           ├── config (configuração específica)
  │           └── styles (visual customization)
  └── settings (global config)
```

### 1.2 Definir Tipos de Blocos Modulares
**Arquivo:** `src/types/blocks.ts`

```typescript
// Blocos reutilizáveis:
- BlockTitle (h1, h2, h3 configurável)
- BlockDescription (texto rico)
- BlockImage (upload, url, posição)
- BlockOptions (grid, list, cards)
- BlockNavigation (anterior/próximo)
- BlockProgress (barra de progresso)
- BlockCTA (call-to-action button)
- BlockForm (input fields)
- BlockTestimonial (depoimento)
- BlockPricing (tabela de preços)
- BlockHero (seção hero)
- BlockDivider (separador visual)
```

### 1.3 Implementar Validação Zod
**Arquivo:** `src/lib/validation/quiz-v4-validator.ts`

---

## 📋 FASE 2: Migração de Arquivos Core (2-3h)

### 2.1 Prioridade MÁXIMA (fazer primeiro):

#### A. `src/templates/quiz21StepsComplete.json`
**Ação:** Converter de v3.1.0 → v4.0
```json
{
  "version": "4.0",
  "$schema": "./schemas/quiz-v4.schema.json",
  "metadata": {
    "id": "quiz-21-steps-complete",
    "title": "Quiz 21 Passos Completo",
    "description": "Template completo com 21 etapas",
    "category": "complete",
    "tags": ["funnel", "complete", "21-steps"]
  },
  "sections": [
    {
      "id": "step-01",
      "order": 1,
      "type": "question",
      "blocks": [
        {
          "id": "step-01-title",
          "type": "title",
          "order": 1,
          "config": {
            "text": "Qual é seu objetivo principal?",
            "level": "h1",
            "align": "center"
          }
        },
        {
          "id": "step-01-options",
          "type": "options",
          "order": 2,
          "config": {
            "layout": "grid",
            "columns": 2,
            "options": [...]
          }
        },
        {
          "id": "step-01-navigation",
          "type": "navigation",
          "order": 3,
          "config": {
            "showPrevious": false,
            "showNext": true
          }
        }
      ]
    }
    // ... steps 2-21
  ],
  "settings": {
    "allowBackNavigation": true,
    "showProgressBar": true,
    "saveProgress": true
  }
}
```

#### B. `src/config/schemas/blocks/*.json` (30 arquivos)
**Ação:** Atualizar todos de v1.0.0 → v4.0
- Manter estrutura de blocos
- Adicionar campos obrigatórios V4.0
- Adicionar `order` para reordenação

#### C. `src/core/schema/defaultSchemas.json`
**Ação:** Definir schemas padrão V4.0

---

## 📋 FASE 3: Sistema de Blocos Modulares (3-4h)

### 3.1 Block Registry System
**Arquivo:** `src/lib/blocks/registry.ts`

```typescript
// Registro centralizado de blocos disponíveis
interface BlockDefinition {
  type: string;
  name: string;
  description: string;
  icon: string;
  category: 'content' | 'interactive' | 'navigation' | 'media';
  defaultConfig: any;
  schema: ZodSchema;
  component: React.ComponentType;
}

const blockRegistry: Map<string, BlockDefinition> = new Map([
  ['title', titleBlockDef],
  ['description', descriptionBlockDef],
  ['options', optionsBlockDef],
  // ... todos os blocos
]);
```

### 3.2 Block Factory
**Arquivo:** `src/lib/blocks/factory.ts`

```typescript
// Criar instâncias de blocos dinamicamente
function createBlock(type: string, config?: Partial<Block>): Block {
  const definition = blockRegistry.get(type);
  return {
    id: generateId(),
    type,
    order: config?.order ?? 0,
    config: { ...definition.defaultConfig, ...config?.config },
    styles: config?.styles ?? {},
  };
}
```

### 3.3 Block Renderer
**Arquivo:** `src/components/blocks/BlockRenderer.tsx`

```typescript
// Renderizar blocos dinamicamente
export function BlockRenderer({ block }: { block: Block }) {
  const definition = blockRegistry.get(block.type);
  const Component = definition?.component;
  
  if (!Component) return <BlockNotFound type={block.type} />;
  
  return (
    <div data-block-id={block.id} data-block-order={block.order}>
      <Component {...block.config} styles={block.styles} />
    </div>
  );
}
```

---

## 📋 FASE 4: Editor Modular (4-5h)

### 4.1 Drag & Drop para Reordenação Vertical
**Arquivo:** `src/components/editor/SectionEditor.tsx`

```typescript
// React DnD para reordenar blocos
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

function SectionEditor({ section }: { section: Section }) {
  const [blocks, setBlocks] = useState(section.blocks);
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over!.id);
        return arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
          ...item,
          order: idx + 1,
        }));
      });
    }
  };
  
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
        {blocks.map((block) => (
          <SortableBlock key={block.id} block={block} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
```

### 4.2 Block Palette (Sidebar)
**Arquivo:** `src/components/editor/BlockPalette.tsx`

```typescript
// Paleta de blocos disponíveis para drag & drop
function BlockPalette() {
  const blocksByCategory = groupBy(Array.from(blockRegistry.values()), 'category');
  
  return (
    <aside className="block-palette">
      <h3>Blocos Disponíveis</h3>
      {Object.entries(blocksByCategory).map(([category, blocks]) => (
        <section key={category}>
          <h4>{category}</h4>
          {blocks.map((block) => (
            <DraggableBlockItem key={block.type} block={block} />
          ))}
        </section>
      ))}
    </aside>
  );
}
```

### 4.3 Block Inspector (Properties Panel)
**Arquivo:** `src/components/editor/BlockInspector.tsx`

```typescript
// Editar propriedades do bloco selecionado
function BlockInspector({ block }: { block: Block | null }) {
  if (!block) return <EmptyState />;
  
  const definition = blockRegistry.get(block.type);
  
  return (
    <aside className="block-inspector">
      <h3>{definition?.name}</h3>
      <ConfigForm
        schema={definition?.schema}
        value={block.config}
        onChange={(newConfig) => updateBlock(block.id, { config: newConfig })}
      />
      <StyleEditor
        value={block.styles}
        onChange={(newStyles) => updateBlock(block.id, { styles: newStyles })}
      />
    </aside>
  );
}
```

---

## 📋 FASE 5: Migration Scripts (2h)

### 5.1 Migrador Automático v1/v3 → v4
**Arquivo:** `scripts/migrate-to-v4.ts`

```typescript
// Migrar automaticamente JSONs antigos
async function migrateToV4(filePath: string) {
  const content = await readJSON(filePath);
  const version = content.version;
  
  let migrated: QuizV4;
  
  if (version === '1.0.0') {
    migrated = migrateV1ToV4(content);
  } else if (version?.startsWith('3.')) {
    migrated = migrateV3ToV4(content);
  } else {
    migrated = createDefaultV4(content);
  }
  
  // Validar
  const result = QuizV4Schema.safeParse(migrated);
  if (!result.success) {
    console.error('Migration failed:', result.error);
    return;
  }
  
  // Salvar
  await writeJSON(filePath, migrated);
}
```

### 5.2 Converter Steps em Sections com Blocks
**Arquivo:** `scripts/convert-steps-to-blocks.ts`

```typescript
// Converter estrutura antiga de steps para sections com blocks
function convertStepToSection(step: OldStep): Section {
  const blocks: Block[] = [];
  
  // Título → Block Title
  if (step.title) {
    blocks.push(createBlock('title', {
      order: 1,
      config: { text: step.title, level: 'h1' }
    }));
  }
  
  // Descrição → Block Description
  if (step.description) {
    blocks.push(createBlock('description', {
      order: 2,
      config: { text: step.description }
    }));
  }
  
  // Options → Block Options
  if (step.options) {
    blocks.push(createBlock('options', {
      order: 3,
      config: { layout: 'grid', options: step.options }
    }));
  }
  
  // Navigation → Block Navigation
  blocks.push(createBlock('navigation', {
    order: blocks.length + 1,
    config: { showPrevious: step.order > 1, showNext: true }
  }));
  
  return {
    id: `step-${String(step.order).padStart(2, '0')}`,
    order: step.order,
    type: step.type || 'question',
    blocks: blocks.sort((a, b) => a.order - b.order),
  };
}
```

---

## 📋 FASE 6: QuizModularEditor V4 (3h)

### 6.1 Atualizar para Estrutura V4
**Arquivo:** `src/components/editor/QuizModularEditor.tsx`

```typescript
// Editor principal com suporte a V4 e blocks modulares
export function QuizModularEditor({ quizId }: { quizId: string }) {
  const [quiz, setQuiz] = useState<QuizV4 | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  
  // Carregar e validar
  useEffect(() => {
    loadQuiz(quizId).then((data) => {
      const result = QuizV4Schema.safeParse(data);
      if (result.success) {
        setQuiz(result.data);
      } else {
        console.error('Invalid quiz data:', result.error);
        // Tentar migração automática
        migrateAndRetry(data);
      }
    });
  }, [quizId]);
  
  if (!quiz) return <Loading />;
  
  return (
    <div className="quiz-modular-editor">
      <EditorHeader quiz={quiz} />
      
      <div className="editor-layout">
        <BlockPalette />
        
        <main className="canvas">
          {quiz.sections.map((section) => (
            <SectionEditor
              key={section.id}
              section={section}
              onSelectBlock={setSelectedBlock}
            />
          ))}
        </main>
        
        <BlockInspector block={selectedBlock} />
      </div>
    </div>
  );
}
```

---

## 📋 FASE 7: Componentes de Blocos (2-3h)

### 7.1 Implementar Blocos Essenciais

```typescript
// src/components/blocks/TitleBlock.tsx
// src/components/blocks/DescriptionBlock.tsx
// src/components/blocks/OptionsBlock.tsx
// src/components/blocks/NavigationBlock.tsx
// src/components/blocks/ProgressBlock.tsx
// src/components/blocks/ImageBlock.tsx
// src/components/blocks/CTABlock.tsx
// ... etc
```

---

## 🚀 EXECUÇÃO IMEDIATA

### Sequência de Implementação:

**Agora (próximas 2h):**
1. ✅ Criar schema V4.0 com blocks
2. ✅ Definir tipos TypeScript
3. ✅ Implementar validação Zod
4. ✅ Criar block registry

**Hoje (próximas 4h):**
5. ✅ Migrar quiz21StepsComplete.json
6. ✅ Criar block factory
7. ✅ Implementar BlockRenderer
8. ✅ Atualizar 5 arquivos core

**Amanhã:**
9. ✅ Implementar drag & drop
10. ✅ Criar block palette
11. ✅ Atualizar QuizModularEditor
12. ✅ Testes e ajustes

---

## ✅ CRITÉRIOS DE SUCESSO

- [ ] Schema V4.0 validando corretamente
- [ ] 5 arquivos core migrados e funcionando
- [ ] Blocos modulares criados dinamicamente
- [ ] Drag & drop vertical funcionando
- [ ] Editor carregando quiz V4.0 sem erros
- [ ] 21 steps configuráveis (de 1 a 21)
- [ ] Blocos reutilizáveis entre sections
- [ ] Validação automática funcionando

---

**Próximo passo:** Começar Fase 1 - Criar schema base V4.0
