# 🔧 Plano de Correção Arquitetural - Quiz Flow Pro

**Data:** 2025-12-05  
**Status:** APROVADO PARA EXECUÇÃO  
**Baseado em:** Auditoria Técnica Completa

---

## 📊 Diagnóstico Verificado

| Problema | Arquivos Afetados | Severidade |
|----------|-------------------|------------|
| Template Services duplicados | 45 arquivos | 🔴 Crítico |
| Editor Contexts duplicados | 193 arquivos | 🔴 Crítico |
| Código deprecated/legacy | 306 arquivos | 🟡 Alto |
| Estrutura de pastas complexa | 28+ subpastas em services | 🟡 Alto |

---

## 🎯 Fase 1: CRÍTICO (Semana 1)

### 1.1 Unificar Template Services
**Objetivo:** Single source of truth para templates

**Arquivos a MANTER (canônicos):**
```
src/services/canonical/TemplateService.ts  ← ÚNICO PONTO DE ENTRADA
src/services/index.ts                       ← Re-export unificado
```

**Arquivos a DEPRECAR/REMOVER:**
```
src/services/TemplateLoader.ts              → REMOVER
src/services/TemplateRegistry.ts            → REMOVER  
src/services/TemplateCache.ts               → REMOVER
src/services/TemplatesCacheService.ts       → REMOVER
src/services/templateService.ts             → MANTER como re-export
src/services/templates/                     → CONSOLIDAR em canonical
src/services/core/HierarchicalTemplateSource*.ts → INTEGRAR em canonical
```

**Ações:**
1. Migrar lógica útil de TemplateLoader → TemplateService
2. Migrar lógica de cache de TemplateCache → CacheService
3. Atualizar todas as 45 importações para usar `@/services`
4. Remover arquivos deprecated após migração

### 1.2 Consolidar Editor Contexts
**Objetivo:** Um único EditorContext com hooks especializados

**Arquivos a MANTER (canônicos):**
```
src/contexts/EditorContext.tsx              ← CONTEXTO UNIFICADO (recém-criado)
src/contexts/index.ts                       ← Exports centralizados
```

**Arquivos a DEPRECAR/REMOVER:**
```
src/contexts/editor/EditorContext.tsx       → REMOVER (deprecated)
src/contexts/EditorFunnelContext.tsx        → INTEGRAR em EditorContext
src/contexts/EditorLoadingContext.tsx       → INTEGRAR em EditorContext
src/core/contexts/EditorContext/            → AVALIAR migração
```

**Ações:**
1. Migrar todos os 193 arquivos para usar `useEditorContext` de `@/contexts`
2. Mover funcionalidades de EditorFunnelContext para EditorContext
3. Remover contextos duplicados
4. Atualizar providers em App.tsx

### 1.3 Implementar AbortController em Loaders
**Objetivo:** Eliminar race conditions

**Arquivos a modificar:**
```
src/services/canonical/TemplateService.ts
src/hooks/useQuizV4Loader.ts
src/hooks/editor/useEditorBootstrap.ts
```

**Padrão a implementar:**
```typescript
const loadTemplate = async (id: string, signal?: AbortSignal) => {
  if (signal?.aborted) return;
  // ... lógica de carregamento
};
```

---

## 🎯 Fase 2: ALTO (Semana 2)

### 2.1 Implementar AutoSave Service
**Criar:** `src/services/canonical/AutoSaveService.ts`

```typescript
interface AutoSaveConfig {
  debounceMs: number;      // 1000ms default
  strategy: 'full' | 'patch';
  storage: 'indexeddb' | 'supabase' | 'both';
}
```

### 2.2 Virtualização do Canvas
**Modificar:** `src/components/canvas/StabilizedCanvas.tsx`

- Implementar `react-window` para steps
- Adicionar `React.memo` com comparadores custom
- Lazy load de blocos fora do viewport

### 2.3 Tipagem Forte para Blocos
**Criar:** `src/types/core/blocks.discriminated.ts`

```typescript
type Block = 
  | IntroBlock 
  | QuestionBlock 
  | ResultBlock 
  | OfferBlock 
  | TransitionBlock;

interface IntroBlock {
  type: 'intro-logo-header' | 'intro-button' | 'intro-description';
  // ... props específicas
}
```

---

## 🎯 Fase 3: MÉDIO (Semana 3)

### 3.1 Reorganização de Pastas
**Estrutura Proposta:**

```
src/
├── core/                    # Domínio e lógica de negócio
│   ├── domain/              # Entidades (Funnel, Step, Block)
│   ├── ports/               # Interfaces (IStorage, ITemplate)
│   └── usecases/            # Casos de uso (LoadFunnel, SaveFunnel)
├── infrastructure/          # Implementações externas
│   ├── storage/             # Adapters (IndexedDB, Supabase)
│   ├── cache/               # Cache service
│   └── api/                 # Clients HTTP
├── application/             # Orquestração
│   ├── services/            # Services de aplicação
│   ├── state/               # Stores (Zustand)
│   └── commands/            # Command pattern
├── presentation/            # UI React
│   ├── components/          # Componentes
│   ├── pages/               # Páginas
│   └── hooks/               # Hooks de UI
└── shared/                  # Utilitários compartilhados
    ├── types/               # TypeScript types
    ├── utils/               # Funções utilitárias
    └── constants/           # Constantes
```

### 3.2 Remover Código Morto
**Comando para identificar:**
```bash
npx knip --json --no-gitignore > knip-report.json
```

**Pastas candidatas a remoção:**
```
src/services/deprecated/
src/components/legacy/
src/contexts/editor/ (após migração)
```

### 3.3 Documentação ADRs
**Criar:** `docs/adr/`
- ADR-001: Consolidação de Template Services
- ADR-002: Unificação de Editor Context
- ADR-003: Estratégia de Cache Multi-Layer
- ADR-004: Padrão Command para Editor

---

## 🎯 Fase 4: BAIXO (Semana 4+)

### 4.1 Testes
- Unit tests para services canônicos
- Integration tests para fluxo editor
- E2E tests para publicação

### 4.2 Monitoramento
- Performance tracking com Web Vitals
- Error tracking com Sentry
- Analytics de uso do editor

### 4.3 UX Melhorias
- Undo/Redo global
- Keyboard shortcuts
- Drag & Drop otimizado

---

## 📈 Métricas de Sucesso

| Métrica | Atual | Meta | Melhoria |
|---------|-------|------|----------|
| TTI (Time to Interactive) | ~2.5s | <800ms | -68% |
| Re-renders por edição | ~50 | ~3 | -94% |
| Arquivos deprecated | 306 | 0 | -100% |
| Contextos duplicados | 11 | 3 | -73% |
| Template services | 45 refs | 1 | -98% |

---

## 🚀 Próximos Passos Imediatos

### Ação 1: Script de Migração de Imports
```bash
# Substituir imports de template
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' \
  's|from "@/services/templates"|from "@/services"|g'

# Substituir imports de editor context
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' \
  's|from "@/contexts/editor/EditorContext"|from "@/contexts"|g'
```

### Ação 2: Criar Barrel Exports Unificados
- `src/services/index.ts` - Único export de services
- `src/contexts/index.ts` - Único export de contexts
- `src/types/index.ts` - Único export de types

### Ação 3: Deprecation Warnings
Adicionar warnings em arquivos deprecated:
```typescript
/** 
 * @deprecated Use `templateService` from '@/services' instead
 * @see docs/PLANO_CORRECAO_ARQUITETURA.md
 */
```

---

## ✅ Checklist de Execução

### Fase 1 - Crítico
- [ ] Unificar TemplateService
- [ ] Migrar importações de template (45 arquivos)
- [ ] Consolidar EditorContext
- [ ] Migrar importações de editor (193 arquivos)
- [ ] Implementar AbortController

### Fase 2 - Alto
- [ ] AutoSaveService
- [ ] Virtualização canvas
- [ ] Tipagem discriminada de blocos

### Fase 3 - Médio
- [ ] Reorganizar pastas
- [ ] Remover código morto
- [ ] Documentar ADRs

### Fase 4 - Baixo
- [ ] Testes automatizados
- [ ] Monitoramento
- [ ] Melhorias UX

---

**Autor:** Sistema de Auditoria  
**Revisão:** 2025-12-05  
**Próxima Revisão:** Após conclusão Fase 1
