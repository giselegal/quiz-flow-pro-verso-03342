# 🎯 GUIA DE INTEGRAÇÃO - Sistema de Blocos Independentes

## 📋 VISÃO GERAL

Este guia mostra como integrar o sistema de blocos independentes no seu editor existente, substituindo os steps monolíticos por blocos completamente modulares.

---

## 🚀 PASSO A PASSO

### 1. Importar Componentes Necessários

```typescript
// No seu componente de editor
import { 
  BlockBasedStepRenderer,
  StepCanvas,
  AddBlockModal 
} from '@/components/editor/canvas';
```

### 2. Substituir Steps Monolíticos

#### ANTES (Step Monolítico):
```tsx
import IntroStep from '@/components/steps/IntroStep';
import QuestionStep from '@/components/steps/QuestionStep';
import ResultStep from '@/components/steps/ResultStep';

// Renderização
<IntroStep 
  data={stepData} 
  onNameSubmit={handleSubmit} 
/>
```

#### DEPOIS (Blocos Independentes):
```tsx
import { BlockBasedStepRenderer } from '@/components/editor/canvas';

// Renderização
<BlockBasedStepRenderer 
  stepNumber={1} 
  mode="editor" 
/>
```

---

## 🎨 MODOS DE RENDERIZAÇÃO

### Modo Editor
Para edição no editor WYSIWYG:
```tsx
<BlockBasedStepRenderer 
  stepNumber={1} 
  mode="editor"
  sessionData={quizSession}
  onSessionDataUpdate={handleSessionUpdate}
/>
```

### Modo Preview
Para preview sem edição:
```tsx
<BlockBasedStepRenderer 
  stepNumber={1} 
  mode="preview"
  sessionData={quizSession}
/>
```

---

## 🔧 INTEGRAÇÃO COM EditorProvider

### Setup Básico
```tsx
import { MigrationEditorProvider } from '@/components/editor';
import { BlockBasedStepRenderer } from '@/components/editor/canvas';

function MyEditor() {
  return (
    <MigrationEditorProvider
      funnelId="quiz21StepsComplete"
      enableSupabase={false}
    >
      <div className="editor-container">
        {/* Renderizar cada step */}
        {[1, 2, 3, 4, 5].map(stepNum => (
          <BlockBasedStepRenderer
            key={stepNum}
            stepNumber={stepNum}
            mode="editor"
          />
        ))}
      </div>
    </MigrationEditorProvider>
  );
}
```

### Com Navegação Entre Steps
```tsx
function EditorWithNavigation() {
  const [currentStep, setCurrentStep] = useState(1);
  
  return (
    <MigrationEditorProvider>
      <div className="editor-layout">
        {/* Navegação */}
        <div className="step-navigation">
          <Button onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}>
            Anterior
          </Button>
          <span>Step {currentStep} de 21</span>
          <Button onClick={() => setCurrentStep(prev => Math.min(21, prev + 1))}>
            Próximo
          </Button>
        </div>
        
        {/* Step atual */}
        <BlockBasedStepRenderer
          stepNumber={currentStep}
          mode="editor"
        />
      </div>
    </MigrationEditorProvider>
  );
}
```

---

## ➕ ADICIONAR NOVOS BLOCOS

O modal de adicionar blocos já está integrado no `BlockBasedStepRenderer`:

```tsx
// O botão "Adicionar Bloco" já está no header do step
// Ao clicar, o modal abrirá automaticamente
<BlockBasedStepRenderer stepNumber={1} mode="editor" />
```

### Personalizar Tipos de Blocos Disponíveis

Edite `src/components/editor/canvas/AddBlockModal.tsx`:

```typescript
const AVAILABLE_BLOCKS: BlockTypeDefinition[] = [
  {
    type: 'custom-block',
    name: 'Meu Bloco Custom',
    description: 'Descrição do bloco',
    icon: CustomIcon,
    category: 'content',
  },
  // ... outros blocos
];
```

---

## 🎯 OPERAÇÕES COM BLOCOS

### Através do useEditor Hook

```tsx
import { useEditor } from '@/components/editor';

function MyComponent() {
  const { state, actions } = useEditor();
  
  // Adicionar bloco
  const addNewBlock = () => {
    actions.addBlock('step-1', {
      id: 'new-block',
      type: 'headline',
      order: 0,
      content: { text: 'Novo Título' },
      properties: {},
    });
  };
  
  // Atualizar bloco
  const updateBlock = () => {
    actions.updateBlock('step-1', 'block-id', {
      content: { text: 'Texto Atualizado' }
    });
  };
  
  // Deletar bloco
  const deleteBlock = () => {
    actions.removeBlock('step-1', 'block-id');
  };
  
  // Reordenar blocos
  const reorderBlocks = () => {
    actions.reorderBlocks('step-1', 0, 2); // Move bloco do índice 0 para 2
  };
  
  return (
    <div>
      <Button onClick={addNewBlock}>Adicionar</Button>
      <Button onClick={updateBlock}>Atualizar</Button>
      <Button onClick={deleteBlock}>Deletar</Button>
      <Button onClick={reorderBlocks}>Reordenar</Button>
    </div>
  );
}
```

---

## 🔄 MIGRAÇÃO DE DADOS EXISTENTES

Se você tem dados no formato antigo, migre-os:

```typescript
import { autoMigrate } from '@/utils/migrateToFlatBlocks';

// Migração automática
const legacyData = {
  stepBlocks: {
    'step-1': [/* blocos */],
    'step-2': [/* blocos */],
  }
};

const { structure, report } = autoMigrate(legacyData);

console.log('✅ Migração:', report.stepsProcessed, 'steps');
console.log('📦 Blocos criados:', report.blocksCreated);

// Usar estrutura migrada
const { blocks, blocksByStep } = structure;
```

---

## 🎨 PERSONALIZAÇÃO VISUAL

### CSS Customizado

```css
/* Estilizar container do step */
.block-based-step-renderer {
  padding: 2rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
}

/* Estilizar header do step (modo editor) */
.block-based-step-renderer .step-header {
  background: var(--muted);
}

/* Estilizar blocos selecionados */
.step-canvas [data-selected="true"] {
  outline: 2px solid var(--primary);
  outline-offset: 4px;
}
```

### Props de Personalização

```tsx
<BlockBasedStepRenderer
  stepNumber={1}
  mode="editor"
  className="custom-step-renderer"
  sessionData={{
    customTheme: {
      primaryColor: '#B89B7A',
      accentColor: '#8B7355',
    }
  }}
/>
```

---

## ⚡ PERFORMANCE

### Lazy Loading de Steps

```tsx
import { lazy, Suspense } from 'react';

const LazyStepRenderer = lazy(() => 
  import('@/components/editor/canvas/BlockBasedStepRenderer')
);

function OptimizedEditor() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyStepRenderer stepNumber={1} mode="editor" />
    </Suspense>
  );
}
```

### Memoização

```tsx
import { memo } from 'react';

const MemoizedStepRenderer = memo(BlockBasedStepRenderer, (prev, next) => {
  return (
    prev.stepNumber === next.stepNumber &&
    prev.mode === next.mode &&
    prev.sessionData === next.sessionData
  );
});
```

---

## 🐛 TROUBLESHOOTING

### Problema: "Editor context não disponível"

**Solução**: Certifique-se de usar o componente dentro do `MigrationEditorProvider`:

```tsx
<MigrationEditorProvider>
  <BlockBasedStepRenderer stepNumber={1} mode="editor" />
</MigrationEditorProvider>
```

### Problema: Blocos não aparecem

**Solução**: Verifique se os blocos existem no state:

```tsx
const { state } = useEditor();
console.log('Blocos do step-1:', state.stepBlocks['step-1']);
```

### Problema: Modal de adicionar bloco não abre

**Solução**: Verifique se está em modo `editor` (não `preview`):

```tsx
<BlockBasedStepRenderer stepNumber={1} mode="editor" /> {/* ✅ Correto */}
<BlockBasedStepRenderer stepNumber={1} mode="preview" /> {/* ❌ Sem botão */}
```

---

## 📚 REFERÊNCIAS

- **Documentação Completa**: `docs/PHASE_8_FLAT_BLOCKS_COMPLETE.md`
- **Código Fonte**:
  - `src/components/editor/canvas/StepCanvas.tsx`
  - `src/components/editor/canvas/BlockBasedStepRenderer.tsx`
  - `src/components/editor/canvas/AddBlockModal.tsx`
  - `src/utils/migrateToFlatBlocks.ts`

---

## ✅ CHECKLIST DE INTEGRAÇÃO

- [ ] Importar `BlockBasedStepRenderer`
- [ ] Substituir steps monolíticos
- [ ] Configurar `MigrationEditorProvider`
- [ ] Testar adicionar blocos
- [ ] Testar editar blocos
- [ ] Testar deletar blocos
- [ ] Testar reordenar blocos
- [ ] Migrar dados legados (se necessário)
- [ ] Personalizar estilos (opcional)
- [ ] Adicionar lazy loading (opcional)

---

**Última Atualização**: 2025-01-XX  
**Versão**: 1.0.0
