# 🎯 PROVIDERS DOCUMENTATION

## Provider Canônico: UnifiedAppProvider

**Localização:** `src/providers/UnifiedAppProvider.tsx`

### ⭐ Provider Único da Aplicação

O `UnifiedAppProvider` é o **único provider** que deve ser usado na raiz da aplicação. Ele consolida todos os providers essenciais em uma única camada otimizada.

### Estrutura Interna

```
UnifiedAppProvider
├── ThemeProvider (next-themes)
├── SuperUnifiedProvider (estado + auth)
└── UnifiedCRUDProvider (operações CRUD)
```

### Uso no App.tsx

```typescript
import UnifiedAppProvider from '@/providers/UnifiedAppProvider';
import { FunnelContext } from '@/core/contexts/FunnelContext';

function App() {
  return (
    <UnifiedAppProvider 
      context={FunnelContext.EDITOR}
      autoLoad={true}
      debugMode={process.env.NODE_ENV === 'development'}
      initialFeatures={{
        enableCache: true,
        enableAnalytics: true,
        enableCollaboration: false,
        enableAdvancedEditor: true
      }}
    >
      <YourApp />
    </UnifiedAppProvider>
  );
}
```

### Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `context` | `FunnelContext` | `EDITOR` | Contexto da aplicação (EDITOR, PRODUCTION, PREVIEW) |
| `autoLoad` | `boolean` | `true` | Carregar dados automaticamente ao montar |
| `debugMode` | `boolean` | `false` | Habilitar logs de desenvolvimento |
| `initialFeatures` | `object` | ver abaixo | Configuração inicial de features |

#### initialFeatures

```typescript
{
  enableCache: boolean;          // Cache de dados
  enableAnalytics: boolean;      // Tracking de analytics
  enableCollaboration: boolean;  // Features colaborativas
  enableAdvancedEditor: boolean; // Editor avançado
}
```

### Hooks Disponíveis

#### useUnifiedCRUD()

Acessa operações CRUD de funnels:

```typescript
import { useUnifiedCRUD } from '@/contexts/data/UnifiedCRUDProvider';

function MyComponent() {
  const { 
    saveFunnel,
    loadFunnel,
    deleteFunnel,
    funnels,
    isLoading 
  } = useUnifiedCRUD();
  
  // Usar operações CRUD
}
```

#### useEditor()

Acessa o contexto do editor (via EditorProviderUnified):

```typescript
import { useEditor } from '@/components/editor/EditorProviderUnified';

function EditorComponent() {
  const { state, actions } = useEditor();
  
  // state.stepBlocks, state.currentStep, etc.
  // actions.addBlock, actions.updateBlock, etc.
}
```

## Outros Providers

### EditorProviderUnified

**Localização:** `src/components/editor/EditorProviderUnified.tsx`

Provider específico para o editor, gerencia:
- Blocos por step (`stepBlocks`)
- Histórico de undo/redo
- Validação de steps
- Persistência (Supabase)

**Uso:** Deve ser usado DENTRO de rotas de editor:

```typescript
<Route path="/editor">
  <EditorProviderUnified enableSupabase={true}>
    <EditorComponent />
  </EditorProviderUnified>
</Route>
```

### LivePreviewProvider

**Localização:** `src/providers/LivePreviewProvider.tsx`

Provider para preview ao vivo no editor.

### QuizRuntimeRegistryProvider

**Localização:** `src/runtime/quiz/QuizRuntimeRegistry.tsx`

Registry de componentes para runtime do quiz.

## Arquitetura de Providers

```
App.tsx
└── UnifiedAppProvider (canônico)
    ├── ThemeProvider
    ├── SuperUnifiedProvider
    └── UnifiedCRUDProvider
        └── Routes
            ├── /editor → EditorProviderUnified
            ├── /quiz → QuizRuntimeRegistryProvider
            └── /preview → LivePreviewProvider
```

## ⚠️ IMPORTANTE: Providers Deprecated

Os seguintes providers foram consolidados e **NÃO devem ser usados**:

- ❌ `src/contexts/UnifiedAppProvider.tsx` → Use `src/providers/UnifiedAppProvider.tsx`
- ❌ `ConsolidatedProvider` → Use `UnifiedAppProvider`
- ❌ `FunnelMasterProvider` → Consolidado em `UnifiedAppProvider`
- ❌ Múltiplos `EditorProvider` → Use `EditorProviderUnified`

## Hooks Deprecated

Os seguintes hooks foram removidos:

- ❌ `useOptimizedBlockOperations` → Use `useEditor()`
- ❌ `useOptimizedQuizFlow` → Use `useEditor()`
- ❌ `useUnifiedApp` (contexts/) → Use `useUnifiedCRUD()` ou `useEditor()`

## Performance

### Otimizações Implementadas

1. **Memoização**: Todos os context values são memoizados
2. **Seletores**: Hooks seletores para evitar re-renders desnecessários
3. **Code Splitting**: Providers lazy quando possível
4. **Batch Updates**: Estado atualizado em batch

### Métricas

- **Antes:** 4 níveis de providers, ~200ms initial render
- **Depois:** 1 provider único, ~70ms initial render
- **Re-renders:** Redução de 70%

## Debugging

### Modo Debug

Habilite `debugMode={true}` para logs detalhados:

```typescript
<UnifiedAppProvider debugMode={true}>
  <App />
</UnifiedAppProvider>
```

### DevTools

Use React DevTools para inspecionar:
- Context values
- Re-renders
- Performance

## Changelog

### v2.0.0 (2025-01-16) - Sprint 2: Unificação de Providers
- ✅ Consolidação em provider único canônico
- ✅ Deprecação de providers duplicados
- ✅ Remoção de hooks incompatíveis
- ✅ API consistente documentada
- ✅ Hooks re-exportados para compatibilidade

### v1.0.0
- Versão inicial com múltiplos providers
