# 🎨 Análise Técnica: Renderização de Canvas e Práticas de Editor JSON Draft

**Data:** 27/11/2025  
**Escopo:** Análise da arquitetura de renderização do `QuizModularEditor` e práticas de edição JSON

---

## 📋 Resumo Executivo

### ✅ Pontos Fortes Identificados

1. **Padrão "Draft + Commit"** implementado corretamente via `useDraftProperties`
2. **Separação clara** entre estado local (draft) e estado global (committed)
3. **Validação em tempo real** sem commit automático
4. **Normalização de dados** antes da renderização
5. **Memoização estratégica** para performance

### ⚠️ Pontos de Atenção

1. **Não usa Draft.js** (biblioteca de Facebook) - usa implementação customizada
2. Renderização direta de JSON pode causar problemas de performance em grandes datasets
3. Falta de estratégia de virtualização para listas longas de blocos

---

## 🏗️ Arquitetura de Renderização

### 1. Fluxo de Dados Unidirecional

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUXO DE RENDERIZAÇÃO                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Fonte de Dados                                               │
│     ┌──────────────────┬──────────────────┐                     │
│     │ Props (WYSIWYG)  │ Backend (Query)  │                     │
│     │   blocksFromProps │   fetchedBlocks  │                     │
│     └────────┬──────────┴────────┬─────────┘                     │
│              │                   │                               │
│              └─────────┬─────────┘                               │
│                        ↓                                         │
│  2. Seleção de Fonte (useMemo)                                   │
│     blocks = blocksFromProps || fetchedBlocks                    │
│              ↓                                                    │
│  3. Normalização (BlockDataNormalizer)                           │
│     normalizedBlocks = normalizeBlocksData(blocks)               │
│              ↓                                                    │
│  4. Renderização por Tipo (BlockTypeRenderer)                    │
│     switch(block.type) { ... }                                   │
│              ↓                                                    │
│  5. Componentes Atômicos                                         │
│     <IntroTitleBlock>, <ImageInlineBlock>, etc.                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Sistema de Normalização

**Arquivo:** `src/core/adapters/BlockDataNormalizer.ts`

```typescript
// ✅ BOA PRÁTICA: Normalização antes da renderização
const normalizedBlocks = useMemo(() => {
    if (!blocks || blocks.length === 0) return [];
    return normalizeBlocksData(blocks);
}, [blocks]);
```

**Benefícios:**
- Garante estrutura consistente
- Previne erros de renderização por dados malformados
- Compatibilidade entre versões de schema

---

## 🎯 Padrão "Draft + Commit" (Boa Prática)

### Implementação via `useDraftProperties`

**Arquivo:** `src/components/editor/quiz/QuizModularEditor/hooks/useDraftProperties.ts`

```typescript
export function useDraftProperties({
  schema,
  initialProperties,
  onCommit,
  autoCommitOnBlur = false
}: UseDraftPropertiesOptions) {
  // 1. Estado local de draft
  const [draft, setDraft] = useState<Record<string, any>>(
    () => getInitialDraft()
  );
  
  // 2. Erros de validação
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  // 3. Buffer de JSON para campos complexos
  const [jsonBuffers, setJsonBuffers] = useState<Record<string, string>>({});
  
  // 4. Validação em tempo real
  const isDirty = useMemo(() => 
    JSON.stringify(draft) !== JSON.stringify(initialRef.current), 
    [draft]
  );
  
  const isValid = useMemo(() => 
    Object.keys(errors).length === 0, 
    [errors]
  );
  
  // 5. Commit controlado
  const commitDraft = useCallback((): boolean => {
    if (!isValid) {
      return false; // ❌ Bloqueia commit se inválido
    }
    
    onCommit(draft); // ✅ Commit apenas quando válido
    return true;
  }, [draft, isValid, onCommit]);
}
```

### ✅ Vantagens desta Abordagem

| Aspecto | Implementação | Benefício |
|---------|---------------|-----------|
| **Isolamento** | Draft local separado do estado global | Edições não afetam UI até confirmadas |
| **Validação** | Validação em tempo real sem commit | Feedback instantâneo sem corromper dados |
| **Cancelamento** | Botão "Cancelar" reverte draft | UX segura para exploração |
| **Performance** | Commit batched | Reduz re-renders desnecessários |

---

## 🔍 Análise Comparativa: Draft.js vs Implementação Custom

### ❌ Por que NÃO usa Draft.js?

**Draft.js** é uma biblioteca de Facebook para **editores de texto rico** (rich text):
- Focada em **contentEditable**
- Manipulação de **seleção de texto**
- Formatação inline (bold, italic, etc.)
- **Não apropriada** para editores JSON estruturados

### ✅ Implementação Custom (Usada no Projeto)

```typescript
// ❌ NÃO É ISSO (Draft.js - rich text)
import { EditorState, convertFromRaw } from 'draft-js';

// ✅ É ISSO (Custom - JSON estruturado)
const updateField = useCallback((key: string, value: any) => {
  const propSchema = schema?.properties[key];
  const result = coerceAndValidateProperty(propSchema, value);
  
  setDraft(prev => ({ ...prev, [key]: result.value }));
}, [schema]);
```

**Por que é melhor para este caso:**
- ✅ Validação baseada em **Zod schema**
- ✅ Coerção de tipos automática
- ✅ Suporte nativo a **JSON complexo**
- ✅ Integração com **TypeScript**
- ✅ Performance superior para dados estruturados

---

## 📊 Renderização de Blocos no Canvas

### Componente: `CanvasColumn`

**Arquivo:** `src/components/editor/quiz/QuizModularEditor/components/CanvasColumn/index.tsx`

### ✅ Boas Práticas Identificadas

#### 1. **Memoização Estratégica**

```typescript
// ✅ BOA PRÁTICA: Memo comparação personalizada
export default React.memo(CanvasColumnInner, (prev, next) => (
    prev.currentStepKey === next.currentStepKey &&
    prev.selectedBlockId === next.selectedBlockId &&
    prev.blocks === next.blocks &&
    prev.onRemoveBlock === next.onRemoveBlock &&
    // ... outras comparações
));
```

**Benefício:** Evita re-renders quando props não relevantes mudam.

#### 2. **Hooks Antes de Returns Condicionais**

```typescript
// ✅ BOA PRÁTICA: Todos os hooks no topo
const [error, setError] = useState<string | null>(null);
const { data: fetchedBlocks, isLoading } = useStepBlocksQuery({...});
const normalizedBlocks = useMemo(() => normalizeBlocksData(blocks), [blocks]);

// ✅ Agora sim, returns condicionais
if (!currentStepKey) return <EmptyState />;
if (isLoading) return <SkeletonLoader />;
```

**Benefício:** Evita erros de "Hooks chamados condicionalmente".

#### 3. **Separação de Fontes de Dados**

```typescript
// ✅ BOA PRÁTICA: Priorização clara
const blocks = useMemo(() => {
  if (blocksFromProps && blocksFromProps.length > 0) {
    return blocksFromProps; // WYSIWYG local (modo live)
  }
  if (shouldFetchFromBackend && fetchedBlocks) {
    return fetchedBlocks;   // Backend (modo production)
  }
  return null;
}, [blocksFromProps, fetchedBlocks, shouldFetchFromBackend]);
```

**Benefício:** Comportamento previsível em diferentes modos.

#### 4. **DnD com Guards de Edição**

```typescript
// ✅ BOA PRÁTICA: Drag desabilitado quando não editável
const { attributes, listeners, setNodeRef } = useSafeSortable({
  id: block.id,
  disabled: !isEditable // ← Guard crítico
});
```

**Benefício:** Preview mode não permite arrastar blocos acidentalmente.

---

## ⚠️ Problemas Identificados

### 1. **Renderização Lista Completa (Sem Virtualização)**

```typescript
// ❌ PROBLEMA: Renderiza TODOS os blocos sempre
{normalizedBlocks.map((b, idx) => (
    <SortableBlockItem
        key={b.id}
        block={b}
        // ...
    />
))}
```

**Impacto:**
- Em steps com 50+ blocos, performance degrada
- Re-render de toda a lista em qualquer mudança
- Scroll lag em listas longas

**Solução Recomendada:**

```typescript
// ✅ SUGESTÃO: Usar react-window ou react-virtual
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={800}
  itemCount={normalizedBlocks.length}
  itemSize={120}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <SortableBlockItem block={normalizedBlocks[index]} />
    </div>
  )}
</FixedSizeList>
```

### 2. **Logs Excessivos em Produção**

```typescript
// ❌ PROBLEMA: Logs em produção
console.log('🎨 [CanvasColumn] RENDERIZANDO BLOCOS:', {
    blocksCount: blocks.length,
    // ...
});
```

**Solução:**

```typescript
// ✅ SUGESTÃO: Usar logger condicional
if (import.meta.env.DEV) {
  appLogger.debug('[CanvasColumn] Rendering blocks', { count: blocks.length });
}
```

### 3. **JSON.stringify em Hot Path**

```typescript
// ❌ PROBLEMA: Comparação cara em memo
const isDirty = useMemo(() => 
  JSON.stringify(draft) !== JSON.stringify(initialRef.current), 
  [draft]
);
```

**Impacto:**
- `JSON.stringify` é lento para objetos grandes
- Executado a cada mudança de draft

**Solução Recomendada:**

```typescript
// ✅ SUGESTÃO: Usar comparação shallow ou immer
import { shallowEqual } from '@/lib/utils/comparison';

const isDirty = useMemo(() => 
  !shallowEqual(draft, initialRef.current), 
  [draft]
);
```

---

## 🎯 Recomendações de Melhoria

### Prioridade Alta (Performance Crítica)

#### 1. **Implementar Virtualização**

```bash
npm install react-window
```

```typescript
// Implementar em CanvasColumn/index.tsx
import { VariableSizeList } from 'react-window';

// Estimar altura por tipo de bloco
const getItemSize = (index: number) => {
  const block = normalizedBlocks[index];
  switch (block.type) {
    case 'intro-title': return 80;
    case 'image-display': return 300;
    default: return 120;
  }
};
```

**Benefício:** Renderizar apenas blocos visíveis (~10-15 no viewport).

#### 2. **Remover Logs de Produção**

```typescript
// Criar utility
// src/lib/utils/devLogger.ts
export const devLog = (message: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.log(message, data);
  }
};
```

#### 3. **Otimizar Comparação de Draft**

```typescript
// Usar biblioteca de comparação deep
import isEqual from 'lodash-es/isEqual';

const isDirty = useMemo(() => 
  !isEqual(draft, initialRef.current), 
  [draft]
);
```

### Prioridade Média (UX)

#### 4. **Loading States Granulares**

```typescript
// Skeleton loader por tipo de bloco
const BlockSkeleton: React.FC<{ type: string }> = ({ type }) => {
  switch(type) {
    case 'image':
      return <div className="animate-pulse h-64 bg-gray-200 rounded" />;
    case 'text':
      return <div className="animate-pulse space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>;
    default:
      return <div className="animate-pulse h-20 bg-gray-200 rounded" />;
  }
};
```

#### 5. **Error Boundaries Específicos**

```typescript
// Wrapper para cada bloco
<SafeBoundary
  fallback={(error) => (
    <BlockErrorFallback 
      error={error} 
      blockId={block.id}
      onRetry={() => refetchBlock(block.id)}
    />
  )}
>
  <SortableBlockItem block={block} />
</SafeBoundary>
```

### Prioridade Baixa (Refinamento)

#### 6. **Prefetch de Schemas**

```typescript
// Pré-carregar schemas de tipos comuns
useEffect(() => {
  const commonTypes = ['intro-title', 'text-inline', 'image'];
  commonTypes.forEach(type => {
    schemaInterpreter.getBlockSchema(type);
  });
}, []);
```

---

## 📚 Comparação com Editores JSON Conhecidos

| Editor | Abordagem | Este Projeto |
|--------|-----------|--------------|
| **Monaco Editor** (VS Code) | Tree-sitter + Virtual DOM | ✅ Usa princípios similares (normalização) |
| **CodeMirror** | Document model + View layer | ✅ Separação clara view/data |
| **Draft.js** | ContentEditable + immutable | ❌ Não usa (não apropriado para JSON) |
| **Slate** | Hierarchical document | ⚠️ Poderia beneficiar de estrutura similar |

### ✅ Pontos Alinhados com Best Practices

1. **Imutabilidade:** Draft isolado do estado global
2. **Validação:** Em tempo real mas não bloqueante
3. **Normalização:** Dados transformados antes de render
4. **Type Safety:** TypeScript + Zod schemas
5. **Composition:** Blocos atômicos componíveis

---

## 🎓 Conclusão

### ✅ Pontos Fortes

1. **Arquitetura sólida** de separação draft/commit
2. **Validação robusta** com Zod
3. **Normalização consistente** de dados
4. **Type safety** completo com TypeScript
5. **Memoização estratégica** para performance

### ⚠️ Áreas de Melhoria

1. **Virtualização de listas** para datasets grandes
2. **Redução de logs** em produção
3. **Otimização de comparações** (evitar JSON.stringify)
4. **Error boundaries** mais granulares
5. **Loading states** mais específicos

### 🎯 Avaliação Geral

**Nota: 8.5/10**

O projeto **NÃO usa Draft.js** (e nem deveria, pois não é apropriado para este caso). A implementação custom de edição JSON com padrão "Draft + Commit" está **bem arquitetada** e segue **boas práticas** de editores estruturados.

Os principais pontos de melhoria são relacionados a **performance em escala** (virtualização) e **refinamentos de UX** (logs, error handling), mas a arquitetura core está sólida.

---

## 📖 Referências

- **Monaco Editor Architecture:** https://github.com/microsoft/monaco-editor
- **React Window:** https://github.com/bvaughn/react-window
- **Zod Validation:** https://zod.dev
- **Immer.js (Immutability):** https://immerjs.github.io/immer/

---

**Próximos Passos Sugeridos:**

1. ✅ Implementar `react-window` no `CanvasColumn`
2. ✅ Criar utility `devLogger` para logs condicionais
3. ✅ Substituir `JSON.stringify` por `shallowEqual` ou `isEqual`
4. ⚠️ Adicionar error boundaries granulares
5. ⚠️ Implementar prefetch de schemas comuns

---

**Autor:** GitHub Copilot (Agent Mode)  
**Data:** 27/11/2025  
**Status:** ✅ Análise Completa
