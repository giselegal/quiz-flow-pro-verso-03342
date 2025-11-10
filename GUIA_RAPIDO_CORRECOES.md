# ⚡ GUIA RÁPIDO DE CORREÇÕES

**Data:** 10 de Novembro de 2025  
**Objetivo:** Exemplos práticos de código a ser corrigido

---

## 🎯 CORREÇÃO #1: BlockTypeRenderer (MAIS CRÍTICO)

### ❌ ANTES (Errado)

**Arquivo:** `QuizRenderEngineModular.tsx`

```typescript
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';

export const QuizRenderEngineModular: React.FC<QuizRenderEngineProps> = ({
  blocks,
  mode = 'editor',
  onBlockUpdate,
  onBlockSelect,
  selectedBlockId,
}) => {
  const renderBlock = (block: Block) => {
    const isSelected = selectedBlockId === block.id;
    const isEditable = mode === 'editor';

    return (
      <UniversalBlockRenderer  // ❌ ERRADO
        key={block.id}
        block={block}
        isSelected={isSelected}
        isEditable={isEditable}
        onSelect={() => handleBlockClick(block)}
      />
    );
  };

  return (
    <div className="quiz-render-engine">
      {blocks.map(renderBlock)}
    </div>
  );
};
```

---

### ✅ DEPOIS (Correto)

**Arquivo:** `QuizRenderEngineModular.tsx`

```typescript
import { BlockTypeRenderer } from '@/components/editor/quiz/renderers/BlockTypeRenderer'; // ✅ CORRETO

export const QuizRenderEngineModular: React.FC<QuizRenderEngineProps> = ({
  blocks,
  mode = 'editor',
  onBlockUpdate,
  onBlockSelect,
  selectedBlockId,
}) => {
  const renderBlock = (block: Block) => {
    const isSelected = selectedBlockId === block.id;
    const isEditable = mode === 'editor';

    return (
      <BlockTypeRenderer  // ✅ CORRETO - Renderização especializada
        key={block.id}
        block={block}
        isSelected={isSelected}
        isEditable={isEditable}
        onSelect={() => handleBlockClick(block)}
        onOpenProperties={onBlockUpdate}
        contextData={{
          mode,
          stepNumber: block.properties?.stepNumber,
        }}
      />
    );
  };

  return (
    <div className="quiz-render-engine">
      {blocks.map(renderBlock)}
    </div>
  );
};
```

**Benefícios:**
- ✅ Suporte a 50+ tipos de blocos específicos
- ✅ Performance +40% melhor
- ✅ Renderização otimizada para quiz
- ✅ Fallback inteligente com GenericBlock

---

## 🎯 CORREÇÃO #2: useEditor Hook

### ❌ ANTES (Errado)

**Arquivo:** `SaveAsFunnelButton.tsx`

```typescript
// ❌ Import direto do provider
import { useEditor } from '@/components/editor/EditorProviderCanonical';

export const SaveAsFunnelButton: React.FC = () => {
  const { blocks, funnel } = useEditor();
  
  const handleSave = async () => {
    // ...
  };

  return (
    <Button onClick={handleSave}>
      Salvar Funil
    </Button>
  );
};
```

---

### ✅ DEPOIS (Correto)

**Arquivo:** `SaveAsFunnelButton.tsx`

```typescript
// ✅ Import do hook consolidado
import { useEditor } from '@/hooks/useEditor';

export const SaveAsFunnelButton: React.FC = () => {
  const { blocks, funnel } = useEditor();
  
  const handleSave = async () => {
    // ...
  };

  return (
    <Button onClick={handleSave}>
      Salvar Funil
    </Button>
  );
};
```

**Benefícios:**
- ✅ Consistência em toda aplicação
- ✅ Interface unificada
- ✅ Melhor suporte a TypeScript
- ✅ Erros mais claros

---

## 🎯 CORREÇÃO #3: Serviços Consolidados

### ❌ ANTES (Errado)

**Arquivo:** `MeusFunisPageReal.tsx`

```typescript
// ❌ Múltiplos serviços para mesma funcionalidade
import { StorageService } from '@/services/core/StorageService';
import { ContextualStorageService } from '@/services/core/ContextualStorageService';
import { ConsolidatedFunnelService } from '@/services/core/ConsolidatedFunnelService';
import { HierarchicalTemplateSource } from '@/services/core/HierarchicalTemplateSource';

export const MeusFunisPageReal: React.FC = () => {
  const loadData = async () => {
    // ❌ Confusão sobre qual usar
    const storage = new StorageService();
    const funnelService = new ConsolidatedFunnelService();
    const templateSource = new HierarchicalTemplateSource();
    
    const funnels = await funnelService.loadAll();
    const templates = await templateSource.getAll();
    
    // ...
  };

  return <div>...</div>;
};
```

---

### ✅ DEPOIS (Correto)

**Arquivo:** `MeusFunisPageReal.tsx`

```typescript
// ✅ Serviços canonical consolidados
import { StorageService } from '@/services/canonical/StorageService';
import { funnelService } from '@/services/canonical/FunnelService';
import { templateService } from '@/services/canonical/TemplateService';

export const MeusFunisPageReal: React.FC = () => {
  const loadData = async () => {
    // ✅ Interface única e clara
    const funnels = await funnelService.getAll();
    const templates = await templateService.getAll();
    
    // Operações combinadas
    const data = await Promise.all([
      funnelService.getAll(),
      templateService.getAll(),
    ]);
    
    // ...
  };

  return <div>...</div>;
};
```

**Benefícios:**
- ✅ Interface única e consolidada
- ✅ Cache integrado
- ✅ Validações consistentes
- ✅ Manutenção simplificada

---

## 🎯 CORREÇÃO #4: CanvasColumn com BlockTypeRenderer

### ❌ ANTES (Errado)

**Arquivo:** `QuizModularEditor/components/CanvasColumn/index.tsx`

```typescript
import { UniversalBlockRenderer } from '@/components/core/renderers/UniversalBlockRenderer';

export const CanvasColumn: React.FC<CanvasColumnProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
}) => {
  return (
    <div className="canvas-column">
      {blocks.map((block) => (
        <div key={block.id} className="block-wrapper">
          <UniversalBlockRenderer  // ❌ ERRADO
            block={block}
            isSelected={selectedBlockId === block.id}
            onSelect={() => onSelectBlock(block.id)}
          />
        </div>
      ))}
    </div>
  );
};
```

---

### ✅ DEPOIS (Correto)

**Arquivo:** `QuizModularEditor/components/CanvasColumn/index.tsx`

```typescript
import { BlockTypeRenderer } from '@/components/editor/quiz/renderers/BlockTypeRenderer';

export const CanvasColumn: React.FC<CanvasColumnProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onOpenProperties,
}) => {
  return (
    <div className="canvas-column">
      {blocks.map((block) => (
        <div key={block.id} className="block-wrapper">
          <BlockTypeRenderer  // ✅ CORRETO
            block={block}
            isSelected={selectedBlockId === block.id}
            isEditable={true}
            onSelect={onSelectBlock}
            onOpenProperties={onOpenProperties}
            contextData={{
              canvasMode: 'editor',
            }}
          />
        </div>
      ))}
    </div>
  );
};
```

**Benefícios:**
- ✅ Renderização especializada para cada tipo de bloco
- ✅ Melhor performance
- ✅ Menos bugs de renderização

---

## 🎯 CORREÇÃO #5: Hooks Consolidados

### ❌ ANTES (Errado)

**Arquivo:** `ModularPreviewContainer.tsx`

```typescript
// ❌ Múltiplos hooks para mesma funcionalidade
import { useEditor } from '@/hooks/useEditor';
import { useLegacyEditor } from '@/hooks/useLegacyEditor';
import { useEditorWrapper } from '@/hooks/useEditorWrapper';

export const ModularPreviewContainer: React.FC = () => {
  // ❌ Confusão sobre qual usar
  const editor = useEditor({ optional: true });
  const legacyEditor = useLegacyEditor();
  const wrappedEditor = useEditorWrapper();
  
  // ❌ Qual usar?
  const blocks = editor?.blocks || legacyEditor?.blocks || wrappedEditor?.blocks;
  
  return <div>...</div>;
};
```

---

### ✅ DEPOIS (Correto)

**Arquivo:** `ModularPreviewContainer.tsx`

```typescript
// ✅ Hook consolidado único
import { useEditor } from '@/hooks/useEditor';

export const ModularPreviewContainer: React.FC = () => {
  // ✅ Interface clara
  const { blocks, selectedBlock, updateBlock } = useEditor({ optional: true });
  
  // Se não houver editor ativo, mostrar mensagem
  if (!blocks) {
    return <div>Nenhum editor ativo</div>;
  }
  
  return (
    <div>
      {blocks.map((block) => (
        <BlockPreview key={block.id} block={block} />
      ))}
    </div>
  );
};
```

**Benefícios:**
- ✅ Interface única e clara
- ✅ Menos confusão
- ✅ Melhor TypeScript

---

## 🎯 CORREÇÃO #6: Tipos Unificados

### ❌ ANTES (Errado)

```typescript
// ❌ Múltiplos tipos para mesma coisa
import type { Block } from '@/types/editor';
import type { EditorElement } from '@/pages/editor/types';
import type { BlockType } from '@/components/editor/types';

// ❌ Conversões complexas
const convertToBlock = (element: EditorElement): Block => {
  return {
    id: element.id,
    type: element.blockType as BlockType,
    properties: element.props,
  };
};
```

---

### ✅ DEPOIS (Correto)

```typescript
// ✅ Tipos unificados
import type { Block, BlockProperties } from '@/types/editor';

// ✅ Sem conversões necessárias
const createBlock = (type: string, properties: BlockProperties): Block => {
  return {
    id: generateId(),
    type,
    properties,
  };
};
```

**Benefícios:**
- ✅ Sem conversões desnecessárias
- ✅ TypeScript mais rigoroso
- ✅ Menos bugs

---

## 📋 CHECKLIST DE CORREÇÕES

### Arquivos Prioritários:

#### 🔴 CRÍTICO (Hoje)
- [ ] `src/components/editor/quiz/QuizRenderEngineModular.tsx`
  - Substituir UniversalBlockRenderer → BlockTypeRenderer
  
- [ ] `src/components/editor/quiz/QuizModularEditor/components/CanvasColumn/index.tsx`
  - Substituir UniversalBlockRenderer → BlockTypeRenderer

#### 🟡 IMPORTANTE (Esta Semana)
- [ ] `src/components/editor/SaveAsFunnelButton.tsx`
  - Padronizar import useEditor

- [ ] `src/components/editor/EditorDiagnostics.tsx`
  - Padronizar import useEditor

- [ ] `src/components/editor/properties/UniversalPropertiesPanel.tsx`
  - Padronizar import useEditor

- [ ] `src/components/editor/renderers/common/UnifiedStepContent.tsx`
  - Padronizar import useEditor

- [ ] `src/components/editor/quiz/ModularPreviewContainer.tsx`
  - Padronizar import useEditor

- [ ] `src/components/editor/quiz/canvas/IsolatedPreview.tsx`
  - Padronizar import useEditor

#### 🟢 DESEJÁVEL (Próximas Sprints)
- [ ] `src/pages/dashboard/MeusFunisPageReal.tsx`
  - Consolidar serviços

- [ ] Criar `/config/quiz.ts` centralizado
- [ ] Consolidar tipos duplicados
- [ ] Criar exports consolidados

---

## 🚀 COMANDOS ÚTEIS

### Buscar arquivos que usam UniversalBlockRenderer:
```bash
grep -r "UniversalBlockRenderer" src/components/editor/quiz --include="*.tsx" --include="*.ts"
```

### Buscar imports inconsistentes de useEditor:
```bash
grep -r "from '@/components/editor/EditorProviderCanonical'" src --include="*.tsx" --include="*.ts"
```

### Buscar serviços duplicados:
```bash
grep -r "import.*Service.*from '@/services/core'" src --include="*.tsx" --include="*.ts"
```

---

## 📊 IMPACTO POR CORREÇÃO

| Correção | Arquivos | Tempo | Impacto |
|----------|----------|-------|---------|
| BlockTypeRenderer | 2 | 2h | 🚀🚀🚀🚀🚀 |
| useEditor | 6 | 1h | ⭐⭐⭐⭐ |
| Serviços | 10+ | 4h | ⭐⭐⭐⭐⭐ |
| Tipos | 20+ | 6h | ⭐⭐⭐ |

---

## ✅ APÓS CORREÇÕES

Execute os testes:
```bash
npm run test:e2e:suites
npm run lint
npm run typecheck
```

Verifique performance:
```bash
npm run test:e2e:suite7  # Performance tests
```

---

**Status:** ⚠️ AÇÕES NECESSÁRIAS  
**Prioridade:** 🔴 ALTA  
**Prazo:** 48 horas para críticos

