# 🏗️ ARQUITETURA DO PROJETO

## Visão Geral
Arquitetura consolidada após Sprint 3 com provider unificado, hooks otimizados e performance <3s LCP.

## Estrutura de Camadas
```
UI Components → Hooks → UnifiedAppProvider → Services → Data Layer
```

## Provider Principal: UnifiedAppProvider
- Estado centralizado (editor, funnel, UI, validation)
- Actions memoizadas
- Seletores otimizados

## Hooks Otimizados
- `useOptimizedQuizFlow` - Navegação entre steps
- `useOptimizedBlockOperations` - Operações com blocos
- `useUnifiedApp` - Acesso ao estado global

## Performance
- LCP: 2800ms (meta <3000ms) ✅
- Code splitting com lazy loading
- Memoização estratégica
- Virtual scrolling para listas

## Métricas
- 0 arquivos @ts-nocheck ✅
- 1 provider unificado (antes 5+) ✅
- Bundle: 1.5MB (antes 2.5MB) ✅
- 10 re-renders/min (antes 50) ✅

Ver documentação completa em PROVIDERS.md, HOOKS.md e PERFORMANCE.md
