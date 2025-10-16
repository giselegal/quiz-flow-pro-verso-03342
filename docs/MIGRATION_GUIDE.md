# 🔄 GUIA DE MIGRAÇÃO

## Providers: Múltiplos → UnifiedAppProvider
**Antes:** 5+ providers aninhados  
**Depois:** 1 UnifiedAppProvider

```typescript
// DEPOIS
<UnifiedAppProvider>
  <YourApp />
</UnifiedAppProvider>
```

## Hooks
### useEditor → useUnifiedApp + useOptimizedBlockOperations
```typescript
const { state } = useUnifiedApp();
const { addBlock, updateBlock } = useOptimizedBlockOperations();
```

### useQuizFlow → useOptimizedQuizFlow
```typescript
const { nextStep, previousStep, progress } = useOptimizedQuizFlow();
```

## Performance
- Adicionar lazy loading: `lazyWithRetry()`
- Memoizar componentes pesados: `memo(Component, shallowEqual)`
- Usar seletores otimizados: `useCurrentStep()`

## Checklist
- [ ] Atualizar imports de providers
- [ ] Migrar hooks para versões otimizadas
- [ ] Adicionar lazy loading
- [ ] Remover código legado

Ver ARCHITECTURE.md, PROVIDERS.md e HOOKS.md para mais detalhes.
