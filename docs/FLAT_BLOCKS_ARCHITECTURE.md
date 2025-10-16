# 🎯 FLAT BLOCKS ARCHITECTURE - Blocos Independentes

## Arquitetura Implementada ✅

O sistema agora suporta uma **arquitetura flat** onde cada bloco é completamente independente e pode ser editado, movido e gerenciado individualmente.

## Estrutura de Dados

### ANTES (Hierárquico - Deprecated)
```typescript
{
  stepBlocks: {
    'step-1': [Block, Block, Block],
    'step-2': [Block, Block]
  }
}
```

### DEPOIS (Flat - Recomendado)
```typescript
{
  // Lista flat de TODOS os blocos
  blocks: [
    { id: 'block-1', stepId: 'step-1', type: 'headline', ... },
    { id: 'block-2', stepId: 'step-1', type: 'image', ... },
    { id: 'block-3', stepId: 'step-2', type: 'button', ... }
  ],
  
  // Índice rápido de blocos por step (apenas IDs)
  blocksByStep: {
    'step-1': ['block-1', 'block-2'],
    'step-2': ['block-3']
  }
}
```

## Componentes Principais

### 1. **BlockBasedStepRenderer**
Renderiza um step usando blocos independentes.

```tsx
import { BlockBasedStepRenderer } from '@/components/editor/canvas';

<BlockBasedStepRenderer 
  stepNumber={1} 
  mode="editor" 
/>
```

### 2. **StepCanvas**
Container genérico que renderiza blocos com controles de edição.

```tsx
import { StepCanvas } from '@/components/editor/canvas';

<StepCanvas
  stepId="step-1"
  blocks={blocks}
  mode="editor"
  sharedContext={sessionData}
  onBlockSelect={handleSelect}
  onBlockUpdate={handleUpdate}
  onBlockDelete={handleDelete}
  onBlockReorder={handleReorder}
/>
```

### 3. **AddBlockModal**
Modal para adicionar novos blocos com busca e categorias.

## Operações Disponíveis

### EditorActions - Novas Operações Flat

```typescript
// Obter blocos de um step específico
const blocks = actions.getBlocksForStep('step-1');

// Mover bloco para outro step
await actions.moveBlockToStep('block-123', 'step-5');

// Duplicar bloco
await actions.duplicateBlock('block-123');

// Adicionar bloco ao step
await actions.addBlock('step-1', newBlock);

// Remover bloco
await actions.removeBlock('step-1', 'block-123');

// Reordenar blocos dentro de um step
await actions.reorderBlocks('step-1', 0, 2);

// Atualizar propriedades do bloco
await actions.updateBlock('step-1', 'block-123', { content: { title: 'Novo título' } });
```

## Migração de Dados

### Utilitários de Migração

```typescript
import { 
  migrateLegacyStepsToFlatBlocks,
  autoMigrate,
  validateFlatStructure 
} from '@/utils/migrateToFlatBlocks';

// Migração automática (detecta formato antigo)
const migrated = await autoMigrate(legacyData);

// Migração manual
const { blocks, blocksByStep } = migrateLegacyStepsToFlatBlocks(legacySteps);

// Validar estrutura após migração
const validation = validateFlatStructure({ blocks, blocksByStep });
console.log('Estrutura válida:', validation.isValid);
```

## Benefícios

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Estrutura** | Steps monolíticos | Blocos flat independentes |
| **Edição** | Editar step inteiro | Editar cada bloco isoladamente |
| **Reordenação** | Apenas dentro do step | Entre qualquer bloco/step |
| **Performance** | Re-render do step | Re-render só do bloco editado |
| **Flexibilidade** | Template fixo | Adicionar/remover qualquer bloco |
| **Tamanho** | ~200 linhas/step | ~30 linhas/container |

## Interface de Usuário

### Modo Editor
```
┌────────────────────────────────────────┐
│  [Step 1 ▼]          [+ Adicionar]     │
├────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ [☰] HeadlineBlock    [⬆][⬇][📋][🗑]│  │
│  │ Título do Step                   │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ [☰] ImageBlock       [⬆][⬇][📋][🗑]│  │
│  │ [Imagem de hero]                 │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

Cada bloco tem:
- **[☰]** Drag handle para reordenar
- **[⬆][⬇]** Mover para cima/baixo
- **[📋]** Duplicar bloco
- **[🗑]** Deletar bloco

### Modo Preview
Renderização totalmente interativa sem controles de edição.

## Compatibilidade

### Estrutura Legada
O `EditorProviderUnified` mantém suporte para a estrutura antiga (`stepBlocks`) durante o período de transição. Ambas as estruturas são sincronizadas automaticamente.

### Migração Transparente
- Detecção automática de formato antigo
- Migração on-the-fly ao carregar
- Validação de integridade de dados
- Relatório detalhado de migração

## Próximos Passos

### Fase 2 (Opcional - Otimização)
Remover completamente a estrutura `stepBlocks` após todas as páginas migrarem para `BlockBasedStepRenderer`.

### Integrações Futuras
- Drag & drop entre steps diferentes
- Templates de blocos salvos
- Undo/redo granular por bloco
- Colaboração em tempo real por bloco

## Exemplos de Uso

### Substituir IntroStep Monolítico

**ANTES:**
```tsx
<IntroStep 
  data={stepData} 
  onNameSubmit={handleSubmit} 
/>
```

**DEPOIS:**
```tsx
<BlockBasedStepRenderer 
  stepNumber={1} 
  mode="preview"
  sessionData={sessionData}
  onSessionDataUpdate={handleUpdate}
/>
```

### Criar Step Personalizado

```tsx
import { BlockBasedStepRenderer } from '@/components/editor/canvas';
import { useEditor } from '@/components/editor/EditorProviderMigrationAdapter';

function CustomStep() {
  const { actions } = useEditor();
  
  const handleAddCustomBlock = async () => {
    await actions.addBlock('step-1', {
      id: 'custom-block-123',
      type: 'headline',
      order: 0,
      content: { title: 'Meu título customizado' },
      properties: {}
    });
  };
  
  return (
    <>
      <button onClick={handleAddCustomBlock}>
        Adicionar Bloco
      </button>
      <BlockBasedStepRenderer 
        stepNumber={1} 
        mode="editor" 
      />
    </>
  );
}
```

## Suporte

Para dúvidas ou problemas, consulte:
- `docs/INTEGRATION_GUIDE.md` - Guia de integração completo
- `docs/PHASE_8_FLAT_BLOCKS_COMPLETE.md` - Documentação técnica detalhada
- `src/components/editor/canvas/` - Código-fonte dos componentes
