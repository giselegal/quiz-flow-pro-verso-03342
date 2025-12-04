# 🎯 Consolidação de Tipos - Block

**Status**: 🔴 Crítico - Definições duplicadas causando incompatibilidades  
**Arquivos envolvidos**: 10+ arquivos de tipos

---

## 📋 Arquivos Duplicados Identificados

### Definições Principais de Block

1. **`src/types/Block.ts`** (3 linhas)
   ```typescript
   export type { Block, BlockType } from './editor';
   ```
   - Re-export simples do editor.ts

2. **`src/types/core/Block.ts`** (117 linhas) ⭐ **CANÔNICO**
   ```typescript
   export interface Block extends BlockMeta {
     id: string;
     type: BlockType;
     order: number;
     content: BlockContent;
     properties?: BlockProperties;
     validation?: BlockValidationMeta;
     position?: BlockPositionMeta;
   }
   ```
   - Definição mais completa
   - Inclui validação, posição, metadata
   - Funções helper: `isBlock()`, `normalizeBlock()`

3. **`src/types/block.types.ts`** (30 linhas)
   ```typescript
   export interface Block {
     id: string;
     type: string;
     props?: Record<string, unknown>;
     children?: Block[];
   }
   
   export const BlockSchema: z.ZodType<Block> = z.object({...});
   ```
   - Definição simplificada
   - Inclui esquema Zod
   - Usa `props` em vez de `properties` + `content`

4. **`src/types/blocks.ts`** (40 linhas)
   ```typescript
   export type { Block } from '@/types/block.types';
   export type { BlockData, BlockDefinition } from '@/types/core/BlockInterfaces';
   ```
   - Arquivo de compatibilidade (shim)
   - Re-exports de múltiplas fontes
   - Mantém retrocompatibilidade

### Arquivos Relacionados

5. **`src/types/blockTypes.ts`** - Tipos de blocos específicos
6. **`src/types/blockProps.ts`** - Props de componentes
7. **`src/types/blockAdapters.ts`** - Adaptadores entre versões
8. **`src/types/blockComponentProps.ts`** - Props de componentes React
9. **`src/types/schemas/block.ts`** - Esquemas de validação
10. **`src/types/schemas/blockSchemas.ts`** - Mais esquemas

---

## 🔴 Problemas Identificados

### 1. Três Estruturas Incompatíveis

#### Estrutura A (core/Block.ts)
```typescript
interface Block {
  id: string;
  type: BlockType;
  order: number;
  content: BlockContent;      // ← Separado
  properties: BlockProperties; // ← Separado
  validation?: BlockValidationMeta;
}
```

#### Estrutura B (block.types.ts)
```typescript
interface Block {
  id: string;
  type: string;
  props?: Record<string, unknown>; // ← Tudo junto
  children?: Block[];              // ← Hierarquia
}
```

#### Estrutura C (editor.ts - via Block.ts)
```typescript
// Precisa ser verificado, mas provavelmente outra variação
```

**Resultado**: Componentes quebram ao receber Block de fonte diferente.

### 2. BlockType: string vs enum

- **`core/Block.ts`**: `export type BlockType = string;`
- **`editor.ts`**: Pode ter enum ou union type
- **Código legado**: Espera strings livres

### 3. Properties vs Props vs Content

- **properties**: Usado em core/Block.ts (estilo, layout)
- **props**: Usado em block.types.ts (dados gerais)
- **content**: Usado em core/Block.ts (conteúdo renderizável)

Componentes não sabem qual usar.

### 4. Falta de Source of Truth

Nenhum arquivo é claramente "O TIPO CANÔNICO". Código importa de:
- `@/types/Block`
- `@/types/block.types`
- `@/types/core/Block`
- `@/types/blocks`
- `@/types/editor`

---

## ✅ Solução Proposta

### Fase 1: Estabelecer Fonte Única de Verdade

**Decisão**: `src/types/core/Block.ts` como canônico

**Motivos**:
- ✅ Definição mais completa (validação, posição, metadata)
- ✅ Já tem helpers (`isBlock`, `normalizeBlock`)
- ✅ Estrutura extensível (BlockContent, BlockProperties separados)
- ✅ Tipagem forte (interfaces específicas)

### Fase 2: Criar Adapter para Estrutura Legada

**Arquivo**: `src/types/adapters/BlockAdapter.ts` (novo)

```typescript
/**
 * 🔄 Block Adapter - Compatibilidade entre estruturas
 * 
 * Converte entre Block canônico e estruturas legadas.
 */

import type { Block as CanonicalBlock } from '@/types/core/Block';
import type { Block as LegacyBlock } from '@/types/block.types';

/**
 * Converter bloco legado (props flat) → canônico (content + properties)
 */
export function legacyToCanonical(legacy: LegacyBlock): CanonicalBlock {
  const { id, type, props = {}, children, ...rest } = legacy;
  
  // Separar props em content e properties
  const content: Record<string, any> = {};
  const properties: Record<string, any> = {};
  
  // Content keys (dados renderizáveis)
  const contentKeys = ['title', 'subtitle', 'description', 'question', 'text', 
                       'placeholder', 'buttonText', 'options', 'imageUrl', 'alt'];
  
  // Properties keys (estilo, layout, comportamento)
  const propertyKeys = ['backgroundColor', 'textAlign', 'padding', 'margin',
                       'borderRadius', 'fontSize', 'color', 'showImages', 'columns'];
  
  Object.entries(props).forEach(([key, value]) => {
    if (contentKeys.includes(key)) {
      content[key] = value;
    } else if (propertyKeys.includes(key)) {
      properties[key] = value;
    } else {
      // Desconhecido → properties por padrão
      properties[key] = value;
    }
  });
  
  return {
    id,
    type,
    order: 0, // Legacy não tem order
    content,
    properties,
    ...rest,
  };
}

/**
 * Converter bloco canônico → legado (props flat)
 */
export function canonicalToLegacy(canonical: CanonicalBlock): LegacyBlock {
  const { id, type, content = {}, properties = {}, ...rest } = canonical;
  
  // Mesclar content + properties em props flat
  const props = {
    ...content,
    ...properties,
  };
  
  return {
    id,
    type,
    props,
    ...rest,
  };
}

/**
 * Type guard para detectar estrutura
 */
export function isLegacyBlock(block: any): block is LegacyBlock {
  return block && 'props' in block && !('content' in block || 'properties' in block);
}

export function isCanonicalBlock(block: any): block is CanonicalBlock {
  return block && ('content' in block || 'properties' in block);
}
```

### Fase 3: Atualizar Arquivos de Re-export

**`src/types/Block.ts`** - Atualizar para usar canônico:
```typescript
/**
 * @deprecated Use @/types/core/Block diretamente
 * Este arquivo mantido por compatibilidade
 */
export type { Block, BlockType, BlockContent, BlockProperties } from './core/Block';
export { isBlock, normalizeBlock } from './core/Block';
```

**`src/types/block.types.ts`** - Deprecar:
```typescript
/**
 * @deprecated Estrutura legada. Use @/types/core/Block
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ Antigo
 * import { Block } from '@/types/block.types';
 * 
 * // ✅ Novo
 * import { Block } from '@/types/core/Block';
 * ```
 */

import type { Block as CanonicalBlock } from './core/Block';
export type { CanonicalBlock as Block };

// Manter BlockSchema Zod mas adaptar
import { z } from 'zod';

export const BlockSchema: z.ZodType<CanonicalBlock> = z.object({
  id: z.string(),
  type: z.string(),
  order: z.number(),
  content: z.record(z.unknown()).default({}),
  properties: z.record(z.unknown()).optional(),
  validation: z.object({
    required: z.boolean().optional(),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
  }).optional(),
  position: z.object({
    x: z.number().optional(),
    y: z.number().optional(),
  }).optional(),
});
```

**`src/types/blocks.ts`** - Simplificar shim:
```typescript
/**
 * Arquivo de compatibilidade consolidado
 * Re-exports da fonte canônica
 */

// ✅ Fonte única de verdade
export type { 
  Block,
  BlockType,
  BlockContent,
  BlockProperties,
  BlockValidationMeta,
  BlockPositionMeta,
} from './core/Block';

export { 
  isBlock, 
  normalizeBlock 
} from './core/Block';

// Adapters para código legado
export { 
  legacyToCanonical, 
  canonicalToLegacy,
  isLegacyBlock,
  isCanonicalBlock,
} from './adapters/BlockAdapter';

// Esquema Zod
export { BlockSchema } from './block.types';
```

### Fase 4: Adicionar Barrel Export Unificado

**`src/types/index.ts`** - Ponto único de importação:
```typescript
/**
 * 📦 Types Barrel Export
 * 
 * RECOMENDADO: Importar tipos daqui
 * 
 * @example
 * ```typescript
 * // ✅ Recomendado
 * import { Block, BlockType } from '@/types';
 * 
 * // ❌ Evitar (múltiplas fontes)
 * import { Block } from '@/types/Block';
 * import { Block } from '@/types/block.types';
 * ```
 */

// ========== CORE TYPES ==========
export type { 
  Block,
  BlockType,
  BlockContent,
  BlockProperties,
  BlockValidationMeta,
  BlockPositionMeta,
  CanonicalBlock,
} from './core/Block';

export { 
  isBlock, 
  normalizeBlock 
} from './core/Block';

// ========== SCHEMAS ==========
export { BlockSchema } from './block.types';

// ========== ADAPTERS ==========
export { 
  legacyToCanonical, 
  canonicalToLegacy 
} from './adapters/BlockAdapter';

// ========== COMPONENT PROPS ==========
export type { BlockComponentProps } from './blockComponentProps';

// ========== EDITOR TYPES ==========
export type { EditorState, EditorContextValue } from './editor';
```

---

## 📊 Plano de Migração

### Fase 1: Preparação (Agora)
- ✅ Documentar estruturas existentes
- ✅ Identificar conflitos
- ✅ Planejar solução

### Fase 2: Implementação (1 dia)
1. Criar `BlockAdapter.ts`
2. Atualizar `Block.ts`, `block.types.ts`, `blocks.ts`
3. Criar `types/index.ts` barrel export
4. Adicionar deprecation warnings

### Fase 3: Migração Gradual (1 semana)
1. Atualizar imports nos componentes principais
2. Testar componentes após migração
3. Corrigir quebras de tipo

### Fase 4: Limpeza (Após migração completa)
1. Remover `block.types.ts` (legado)
2. Remover adapters (se não mais necessários)
3. Consolidar para 2-3 arquivos apenas

---

## 🎯 Resultado Esperado

### Antes
- **10+ arquivos** de tipos de Block
- **3 estruturas** incompatíveis
- **5+ pontos** de importação diferentes

### Depois
- **3 arquivos** principais:
  - `types/core/Block.ts` - Canônico
  - `types/index.ts` - Barrel export
  - `types/adapters/BlockAdapter.ts` - Compatibilidade (temporário)
- **1 estrutura** canônica
- **1 ponto** de importação recomendado: `@/types`

---

## ✅ Benefícios

- 🎯 **Fonte única de verdade** - Elimina ambiguidade
- 🔧 **Type safety** - Erros de tipo pegos em build time
- 📚 **DX melhorado** - Desenvolvedores sabem onde importar
- 🐛 **Menos bugs** - Estrutura consistente
- 🧹 **Código limpo** - -70% de arquivos de tipos

---

## 🚀 Próximos Passos

1. ✅ Análise completa de tipos Block
2. 🔄 Criar BlockAdapter
3. 🔄 Atualizar re-exports
4. 🔄 Criar barrel export unificado
5. 🔄 Deprecar arquivos legados
6. 🔄 Migrar componentes principais
7. 🔄 Remover código obsoleto
