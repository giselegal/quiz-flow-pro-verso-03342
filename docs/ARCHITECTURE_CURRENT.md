# 🏗️ ARQUITETURA ATUAL DO PROJETO

**Última Atualização:** 2025-11-03  
**Status:** FASE 1 - Consolidação Completa

## Visão Geral

Arquitetura consolidada após Sprint 1 de estabilização:
- ✅ Editor unificado com rota canônica
- ✅ Hook simplificado (70% menos complexidade)
- ✅ TemplateService canônico único
- ✅ Provider consolidado

## Estrutura de Diretórios

```
src/
├── components/
│   ├── editor/
│   │   ├── EditorProviderUnified.tsx      ← Provider canônico
│   │   └── quiz/
│   │       └── QuizModularEditor.tsx      ← Editor principal
│   └── ...
├── hooks/
│   ├── useEditor.ts                       ← Hook canônico (✅ NOVO)
│   ├── useEditorWrapper.ts                ← Deprecated
│   └── useUnifiedEditor.ts                ← Deprecated (274 linhas → 70 linhas)
├── services/
│   ├── canonical/
│   │   ├── TemplateService.ts             ← Fonte canônica (✅)
│   │   ├── CacheService.ts
│   │   └── ...
│   └── templateService.ts                 ← Adapter para core/funnel
├── core/
│   └── funnel/
│       └── services/
│           └── TemplateService.ts         ← Deprecated
└── providers/
    ├── UnifiedAppProvider.tsx             ← Provider principal
    └── ...
```

## Componentes Principais

### 1. Editor Canônico

**Arquivo:** `src/components/editor/quiz/QuizModularEditor.tsx`

**Rotas:**
- `/editor` - Editor vazio para novo funil
- `/editor/:funnelId` - Editor com funil específico
- `/editor?template=quiz-21` - Editor com template

**Provider:** `EditorProviderUnified`

**Hook:** `useEditor()` de `@/hooks/useEditor`

### 2. TemplateService Canônico

**Arquivo:** `src/services/canonical/TemplateService.ts` (889 linhas)

**Responsabilidades:**
- Gerenciamento de templates (CRUD)
- Cache inteligente com TTL
- Lazy loading de steps
- Validação de templates
- 21 steps do Quiz de Estilo

**Métodos Principais:**
```typescript
getTemplate(id: string): Promise<ServiceResult<Template>>
getStep(stepId: string, templateId?: string): Promise<ServiceResult<Block[]>>
saveTemplate(template: Template): Promise<ServiceResult<void>>
listTemplates(filters?: TemplateFilters): ServiceResult<Template[]>
lazyLoadStep(stepId: string, preloadNeighbors?: boolean): Promise<any>
```

### 3. Hook useEditor

**Arquivo:** `src/hooks/useEditor.ts` (simplificado)

**Características:**
- ✅ 70% menos código que useUnifiedEditor
- ✅ Auto-detecção do EditorContext
- ✅ TypeScript rigoroso
- ✅ Modo opcional integrado

**Uso:**
```typescript
// Obrigatório (lança erro se não houver provider)
const editor = useEditor();

// Opcional (retorna undefined)
const editor = useEditor({ optional: true });
const editor = useEditorOptional();
```

### 4. UnifiedAppProvider

**Arquivo:** `src/providers/UnifiedAppProvider.tsx`

**Consolida:**
- ThemeProvider (next-themes)
- SuperUnifiedProvider (estado global)
- UnifiedCRUDProvider (operações CRUD)
- Autenticação (opcional)

**Props:**
```typescript
interface UnifiedAppProviderProps {
  context?: FunnelContext;
  autoLoad?: boolean;
  debugMode?: boolean;
  initialFeatures?: {
    enableCache?: boolean;
    enableAnalytics?: boolean;
    enableCollaboration?: boolean;
    enableAdvancedEditor?: boolean;
  };
}
```

## Fluxo de Dados

```
User Interaction
    ↓
QuizModularEditor
    ↓
useEditor() hook
    ↓
EditorProviderUnified (state)
    ↓
TemplateService (canonical)
    ↓
UnifiedTemplateRegistry
    ↓
Cache / Supabase
```

## Rotas Principais

### Editor
- `/editor` - Editor canônico (vazio)
- `/editor/:funnelId` - Editor com funil
- `/editor?template=quiz-21` - Editor com template

### Deprecated (Auto-redirect)
- `/editor-new` → `/editor`
- `/editor-new/:funnelId` → `/editor/:funnelId`
- `/editor-modular` → `/editor`

### Quiz
- `/quiz-estilo` - Quiz de estilo pessoal
- `/preview` - Preview genérico
- `/preview-sandbox` - Preview isolado (iframe)

### Admin
- `/dashboard` - Dashboard principal
- `/admin/analytics` - Analytics
- `/admin/participants` - Participantes
- `/admin/templates` - Meus templates
- `/admin/settings` - Configurações

### Diagnóstico
- `/debug/templates` - Diagnóstico de templates
- `/debug/editor-blocks` - Diagnóstico do editor
- `/debug/performance` - Testes de performance

## Services Canônicos

Status: **12 Services Planejados / 6 Implementados**

1. ✅ **CacheService** - Cache unificado
2. ✅ **TemplateService** - Templates consolidados
3. ✅ **DataService** - Operações de dados
4. ✅ **ValidationService** - Validação unificada
5. ✅ **MonitoringService** - Monitoramento
6. ✅ **NotificationService** - Notificações
7. 🔄 **AnalyticsService** - Em progresso
8. 🔄 **AuthService** - Em progresso
9. 🔄 **StorageService** - Em progresso
10. 🔄 **ConfigService** - Em progresso
11. 🔄 **HistoryService** - Em progresso
12. 🔄 **EditorService** - Em progresso

## Deprecated

### Arquivos Marcados para Remoção (Fase 2)

**Hooks:**
- `src/hooks/useUnifiedEditor.ts` (274 linhas)
- `src/hooks/useEditorWrapper.ts`

**Services:**
- `src/core/funnel/services/TemplateService.ts`
- `src/services/HybridTemplateService.ts` (duplicado)
- `src/services/TemplatesCacheService.ts` (obsoleto)

**Providers:**
- `src/providers/ConsolidatedProvider.tsx`
- `src/providers/FunnelMasterProvider.tsx`

**Rotas:**
- `/editor-new` (redirect to `/editor`)
- `/editor-modular` (redirect to `/editor`)

## Performance

### Métricas de Carregamento

- **Editor Vazio:** < 500ms
- **Editor com Template:** < 1s
- **Lazy Load Step:** < 200ms
- **Cache Hit:** < 50ms

### Otimizações Aplicadas

✅ Lazy loading de componentes  
✅ Code splitting por rota  
✅ Cache em múltiplas camadas  
✅ Preload de steps vizinhos  
✅ Memoização de componentes pesados

## Testing

### Cobertura Atual

- **Unit Tests:** 45 testes passando
- **Integration Tests:** 12 testes passando
- **E2E Tests:** 5 cenários cobertos

### Áreas Testadas

✅ TemplateService CRUD  
✅ useEditor hook  
✅ EditorProviderUnified  
✅ Lazy loading de steps  
✅ Cache invalidation  
✅ Navegação de rotas

## Próximos Passos

### Fase 2 (Próximas 2 semanas)
- [ ] Remover arquivos deprecated
- [ ] Implementar services canônicos restantes
- [ ] Migrar 50+ componentes para useEditor simplificado
- [ ] Adicionar testes para novos services

### Fase 3 (Próximas 4 semanas)
- [ ] Consolidar services legados restantes
- [ ] Otimizar bundle size (-30%)
- [ ] Adicionar E2E tests completos
- [ ] Documentação completa da API

## Troubleshooting

### Erro: "useEditor must be used within EditorProviderUnified"

**Causa:** Componente não está dentro do provider.

**Solução:**
```typescript
// Wrap com provider
<EditorProviderUnified>
  <YourComponent />
</EditorProviderUnified>

// Ou use modo opcional
const editor = useEditor({ optional: true });
if (!editor) {
  // Comportamento fallback
}
```

### Warning: "useEditorWrapper is deprecated"

**Causa:** Usando hook deprecated.

**Solução:**
```typescript
// ❌ ANTES
import { useEditor } from '@/hooks/useEditorWrapper';

// ✅ DEPOIS
import { useEditor } from '@/hooks/useEditor';
```

### Erro 404 em rota /editor-new

**Causa:** Rota deprecated foi removida.

**Solução:**
- Use `/editor` em vez de `/editor-new`
- Redirects automáticos estão ativos

## Referências

- **Guia de Migração:** `docs/MIGRATION_GUIDE.md`
- **Plano de Consolidação:** `SERVICE_CONSOLIDATION_PLAN.json`
- **Relatório do Editor:** `docs/RELATORIO_CONSOLIDADO_EDITOR.md`
- **Arquitetura Quiz:** `UNIFIED_QUIZ_ARCHITECTURE.md`
