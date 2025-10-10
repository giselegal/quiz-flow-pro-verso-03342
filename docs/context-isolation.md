# Isolamento por Contexto de Funil

Este projeto utiliza um sistema de contextos para isolar dados entre áreas (Editor, Templates, Meus Funis, Preview etc.). Isso evita vazamento de dados e colisões no localStorage.

## Conceitos
- Enum `FunnelContext` em `src/core/contexts/FunnelContext.ts` define os contextos.
- `UnifiedCRUDProvider` expõe `funnelContext` para hooks descendentes.
- Util `contextualStorage` prefixa chaves: `${context}:${key}`.

## Como usar
- Em rotas, passe o contexto ao `UnifiedCRUDProvider`:
  ```tsx
  <UnifiedCRUDProvider context={FunnelContext.EDITOR}>
    <QuizModularProductionEditor />
  </UnifiedCRUDProvider>
  ```
- Em hooks/componentes, consuma o contexto e use o util de storage:
  ```ts
  import { useUnifiedCRUDOptional } from '@/context/UnifiedCRUDProvider';
  import { safeGetItem, safeSetItem } from '@/utils/contextualStorage';
  import { FunnelContext } from '@/core/contexts/FunnelContext';

  const { funnelContext = FunnelContext.EDITOR } = useUnifiedCRUDOptional() || {};
  safeSetItem('minha-chave', 'valor', funnelContext);
  ```

## Migração
- Hooks migrados: `useFunnelNavigation`, `usePageConfig`, `useHistoryState` (com fallback lendo a chave antiga).
- Serviços: `EnhancedFunnelService` agora respeita contexto ao criar fallbacks.
- Próximos candidatos: `useMyTemplates`, `useBrandKit` (avaliar se devem ser contextuais ou globais).

## Boas práticas
- Evite `localStorage.setItem`/`getItem` diretos em novos códigos; use `contextualStorage`.
- Para dados globais (tema, preferências pessoais), documente a decisão e centralize as chaves em um helper.
- Em migrações, leia a chave antiga e depois grave na chave contextual, opcionalmente remova a antiga.
