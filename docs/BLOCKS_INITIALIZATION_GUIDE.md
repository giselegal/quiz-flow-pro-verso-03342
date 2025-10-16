# 🎯 Guia de Inicialização de Blocos

## Como os Blocos São Inicializados

O sistema agora inicializa automaticamente os blocos a partir do template `quiz21StepsComplete` quando o `EditorProviderUnified` é montado.

## Processo de Inicialização

### 1. Montagem do EditorProvider

Quando o `EditorProviderUnified` é montado pela primeira vez:

```typescript
// Em EditorProviderUnified.tsx
useEffect(() => {
  if (state.blocks.length === 0 && Object.keys(state.blocksByStep).length === 0) {
    console.log('📦 Inicializando blocos a partir do template...');
    
    const { blocks, blocksByStep } = initializeAllStepBlocks();
    
    setState(prev => ({
      ...prev,
      blocks,
      blocksByStep,
      stepBlocks // compatibilidade
    }));
  }
}, []);
```

### 2. Conversão de Sections para Blocos

O utilitário `initializeStepBlocks.ts` converte cada `section` do template para blocos individuais:

```typescript
// Template structure (quiz21StepsComplete.ts)
{
  'step-01': {
    sections: [
      {
        type: 'intro-hero',
        content: {
          logoUrl: '...',
          title: '...',
          subtitle: '...',
          imageUrl: '...'
        }
      },
      {
        type: 'welcome-form',
        content: {
          questionText: '...',
          submitText: '...'
        }
      }
    ]
  }
}

// Converte para:
{
  blocks: [
    { id: 'step-01-logo-0', type: 'image-inline', stepId: 'step-01', ... },
    { id: 'step-01-title-1', type: 'heading-inline', stepId: 'step-01', ... },
    { id: 'step-01-subtitle-2', type: 'text-inline', stepId: 'step-01', ... },
    { id: 'step-01-image-3', type: 'image-inline', stepId: 'step-01', ... },
    { id: 'step-01-question-10', type: 'heading-inline', stepId: 'step-01', ... },
    { id: 'step-01-name-input-11', type: 'form-input', stepId: 'step-01', ... },
    { id: 'step-01-submit-btn-12', type: 'button-inline', stepId: 'step-01', ... }
  ],
  
  blocksByStep: {
    'step-01': ['step-01-logo-0', 'step-01-title-1', ...]
  }
}
```

## Mapeamento de Sections → Blocos

### Section Type: `intro-hero`
Gera blocos:
- **Logo** → `image-inline`
- **Title** → `heading-inline` (H1)
- **Subtitle** → `text-inline`
- **Image** → `image-inline`
- **Description** → `text-inline`

### Section Type: `welcome-form`
Gera blocos:
- **Question Text** → `heading-inline` (H3)
- **Name Input** → `form-input`
- **Submit Button** → `button-inline`

### Section Type: `question-hero`
Gera blocos:
- **Progress Header** → `progress-inline` (logo + barra de progresso)
- **Question Number** → `text-inline`
- **Question Title** → `heading-inline` (H2)

### Section Type: `options-grid`
Gera blocos:
- **Options Grid** → `options-grid` (com todas as opções)
- **Next Button** → `button-inline` (se necessário)

### Section Type: `result-header`
Gera blocos:
- **Result Header** → `result-header-inline`

### Section Type: `result-cards`
Gera blocos:
- **Style Cards** → `style-card-inline`

### Section Type: `offer-hero`
Gera blocos:
- **Title** → `heading-inline` (H1)
- **Subtitle** → `text-inline`

### Section Type: `pricing`
Gera blocos:
- **Price Display** → `pricing-card-inline`

### Section Type: `cta`
Gera blocos:
- **CTA Button** → `button-inline`

## Estrutura de Blocos por Step Type

### Step 1 (Intro) - 7 blocos
```
1. image-inline (logo)
2. heading-inline (título principal)
3. text-inline (subtítulo)
4. image-inline (hero image)
5. text-inline (descrição)
6. heading-inline (pergunta do formulário)
7. form-input (campo nome)
8. button-inline (botão submit)
```

### Steps 2-19 (Questions) - ~5-6 blocos cada
```
1. progress-inline (header com logo + progresso)
2. text-inline (número da pergunta)
3. heading-inline (título da questão)
4. options-grid (opções de resposta)
5. button-inline (botão próxima - se necessário)
```

### Step 20 (Result) - ~4-5 blocos
```
1. progress-inline (header)
2. result-header-inline (cabeçalho do resultado)
3. style-card-inline (cards de estilo)
4. text-inline (texto adicional)
```

### Step 21 (Offer) - ~5-6 blocos
```
1. progress-inline (header)
2. heading-inline (título da oferta)
3. text-inline (subtítulo)
4. pricing-card-inline (preço)
5. button-inline (CTA)
6. text-inline (disclaimer/garantia)
```

## Verificar Blocos Inicializados

### No Console do Browser

```javascript
// Ver state do EditorProvider
window.__UNIFIED_EDITOR_PROVIDER__

// Ver blocos carregados
const { state } = useEditor();
console.log('Total de blocos:', state.blocks.length);
console.log('Steps com blocos:', Object.keys(state.blocksByStep));

// Ver blocos de um step específico
const step1Blocks = actions.getBlocksForStep('step-01');
console.log('Blocos do Step 1:', step1Blocks);
```

### Via React DevTools

1. Abrir React DevTools
2. Procurar por `EditorProviderUnified`
3. Ver hooks → `state` → `blocks` e `blocksByStep`

## Reinicializar Blocos Manualmente

Se necessário reinicializar os blocos:

```typescript
import { initializeAllStepBlocks } from '@/utils/initializeStepBlocks';
import { useEditor } from '@/components/editor/EditorProviderMigrationAdapter';

function ReinitializeButton() {
  const { actions } = useEditor();
  
  const handleReinitialize = () => {
    const { blocks, blocksByStep } = initializeAllStepBlocks();
    
    // Resetar state
    setState({
      ...getInitialState(),
      blocks,
      blocksByStep
    });
    
    console.log('✅ Blocos reinicializados');
  };
  
  return <button onClick={handleReinitialize}>Reinicializar Blocos</button>;
}
```

## Inicializar Step Individual

Para inicializar apenas um step:

```typescript
import { initializeStepBlocks } from '@/utils/initializeStepBlocks';

const step5Blocks = initializeStepBlocks('step-05');
console.log('Blocos do Step 5:', step5Blocks);

// Adicionar ao estado
await actions.addBlock('step-05', ...step5Blocks);
```

## Troubleshooting

### Blocos não aparecem no editor?

1. **Verificar se EditorProvider está montado:**
   ```javascript
   console.log('Provider montado:', window.__UNIFIED_EDITOR_PROVIDER__);
   ```

2. **Verificar se blocos foram inicializados:**
   ```javascript
   const { state } = useEditor();
   console.log('Blocos carregados:', state.blocks.length);
   ```

3. **Verificar se step tem blocos:**
   ```javascript
   const blocks = actions.getBlocksForStep('step-01');
   console.log('Blocos do step-01:', blocks.length);
   ```

4. **Reinicializar manualmente:**
   ```javascript
   actions.loadDefaultTemplate(); // Carrega template padrão
   ```

### Blocos aparecem mas não são editáveis?

Verificar se `BlockBasedStepRenderer` está em modo `editor`:

```tsx
<BlockBasedStepRenderer 
  stepNumber={1} 
  mode="editor" // deve estar em 'editor', não 'preview'
/>
```

### Blocos têm IDs duplicados?

Cada bloco recebe um ID único baseado em:
- Step ID
- Tipo do bloco
- Ordem do bloco

Exemplo: `step-01-logo-0`, `step-01-title-1`, etc.

## Performance

### Lazy Initialization

Os blocos são inicializados apenas uma vez na montagem do `EditorProvider`:

```typescript
useEffect(() => {
  // Só inicializa se não houver blocos
  if (state.blocks.length === 0) {
    initializeAllStepBlocks();
  }
}, []);
```

### Cache do Template

O template `quiz21StepsComplete` usa cache interno:

```typescript
const TEMPLATE_CACHE = new Map<string, any>();

export function getStepTemplate(stepId: string) {
  if (TEMPLATE_CACHE.has(stepId)) {
    return TEMPLATE_CACHE.get(stepId); // Cache hit
  }
  // ... buscar template
}
```

### Ordem de Inicialização

1. ✅ Montar `EditorProviderUnified`
2. ✅ Verificar se blocos já existem
3. ✅ Se não, importar `initializeStepBlocks` dinamicamente
4. ✅ Converter sections → blocos (todos os 21 steps)
5. ✅ Atualizar state com `blocks` + `blocksByStep`
6. ✅ Renderizar `BlockBasedStepRenderer`
7. ✅ `BlockBasedStepRenderer` chama `actions.getBlocksForStep()`
8. ✅ `StepCanvas` renderiza blocos individuais

## Estatísticas Esperadas

Após inicialização completa:

```javascript
{
  totalBlocks: ~120-150 blocos,
  stepsWithBlocks: 21,
  averageBlocksPerStep: ~6-7 blocos,
  
  step01Blocks: ~7-8 blocos (intro),
  step02to19Blocks: ~5-6 blocos cada (questions),
  step20Blocks: ~4-5 blocos (result),
  step21Blocks: ~5-6 blocos (offer)
}
```

## Próximos Passos

1. ✅ Blocos inicializados automaticamente
2. ✅ Renderização via `BlockBasedStepRenderer`
3. ✅ Edição individual de blocos
4. ⏳ Persistência no Supabase
5. ⏳ Sincronização em tempo real

---

**Status:** ✅ Inicialização automática implementada  
**Data:** 2025-10-16  
**Versão:** 5.0.0-auto-init
