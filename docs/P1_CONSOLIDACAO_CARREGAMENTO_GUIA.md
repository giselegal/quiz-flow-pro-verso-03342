# 🔴 P1: Consolidação do Carregamento de Templates

## 📊 PROBLEMA ATUAL

### Fluxo de Carregamento com 4 Camadas Sequenciais

```
┌─────────────────────────────────────────────────────────────┐
│ EditorRoutes (src/pages/editor/index.tsx)                   │
│ - useResourceIdFromLocation()                               │
│ - Extrai query params                                        │
│ - Tempo: ~10ms                                               │
└─────────────┬───────────────────────────────────────────────┘
              │
              ↓ ESPERA
              │
┌─────────────┴───────────────────────────────────────────────┐
│ useEditorResource (src/hooks/useEditorResource.ts)          │
│ - detectResourceType()                                       │
│ - prepareTemplate() ✅ (consolidado)                         │
│ - convertTemplateToFunnel()                                  │
│ - Tempo: ~600ms (com lazy load)                             │
└─────────────┬───────────────────────────────────────────────┘
              │
              ↓ ESPERA
              │
┌─────────────┴───────────────────────────────────────────────┐
│ SuperUnifiedProvider (contextos/providers/)                  │
│ - useEffect para autoLoad                                    │
│ - Carrega funnel do Supabase (se aplicável)                 │
│ - Tempo: ~300-800ms                                          │
└─────────────┬───────────────────────────────────────────────┘
              │
              ↓ ESPERA
              │
┌─────────────┴───────────────────────────────────────────────┐
│ QuizModularEditor (componentes/editor/quiz/)                 │
│ - useEffect para loadTemplateOptimized()                     │
│ - templateService.steps.list()                               │
│ - validateTemplateIntegrityFull()                            │
│ - Tempo: ~200-400ms                                          │
└─────────────────────────────────────────────────────────────┘

TOTAL: ~1.1s - 2.2s (cachoeira sequencial)
```

### Problemas Identificados

1. **Cachoeira de Requisições** 🌊
   - Cada camada espera a anterior completar
   - Impossível paralelizar carregamentos
   - TTI impactado mesmo com lazy load

2. **Duplicação de Lógica** 🔄
   ```tsx
   // ❌ PROBLEMA: 3 locais fazem "preparação" de template
   
   // 1. useEditorResource
   await templateService.prepareTemplate(resourceId);
   
   // 2. QuizModularEditor (linha 304-360)
   await templateService.steps.list();
   setLoadedTemplate({ name, steps });
   
   // 3. handleLoadTemplate (botão manual - linha 819)
   await templateService.prepareTemplate(tid);
   ```

3. **Condições de Corrida** ⚡
   ```tsx
   // Estado em múltiplos locais
   editorResource.resource  // useEditorResource
   unifiedState.currentFunnel  // SuperUnifiedProvider
   loadedTemplate  // QuizModularEditor local state
   
   // ❌ PROBLEMA: Qual é a fonte da verdade?
   ```

4. **Validações Redundantes** 🔍
   ```tsx
   // useEditorResource: detecta tipo
   const type = detectResourceType(resourceId);
   
   // SuperUnifiedProvider: carrega novamente
   if (funnelId && autoLoad) {
     await loadFunnel(funnelId);
   }
   
   // QuizModularEditor: valida novamente
   const result = await validateTemplateIntegrityFull(...);
   ```

---

## ✅ SOLUÇÃO PROPOSTA

### Arquitetura Consolidada (Single Source of Truth)

```
┌─────────────────────────────────────────────────────────────┐
│ EditorRoutes                                                 │
│ - Apenas extrai resourceId da URL                           │
│ - Passa para SuperUnifiedProvider                           │
│ - Tempo: ~5ms                                                │
└─────────────┬───────────────────────────────────────────────┘
              │
              ↓ PARALELO (não espera)
              │
┌─────────────┴───────────────────────────────────────────────┐
│ SuperUnifiedProvider (ÚNICO ponto de carregamento)          │
│                                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 1. detectResourceType()                                  │ │
│ │ 2. prepareTemplate() (se necessário)                     │ │
│ │ 3. convertTemplateToFunnel() OU loadFunnel()            │ │
│ │ 4. validateIntegrity() (async, não bloqueia)            │ │
│ │                                                           │ │
│ │ TODO em paralelo quando possível:                        │ │
│ │ - Promise.all([loadStep1, prefetchStep2, loadBlocks])   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                               │
│ Tempo: ~400-700ms (40% mais rápido)                         │
└─────────────┬───────────────────────────────────────────────┘
              │
              ↓ DADOS PRONTOS
              │
┌─────────────┴───────────────────────────────────────────────┐
│ QuizModularEditor                                            │
│ - Apenas renderiza UI                                        │
│ - Lê do SuperUnifiedProvider.state                          │
│ - SEM lógica de carregamento                                │
│ - Tempo: ~50ms (só renderização)                            │
└─────────────────────────────────────────────────────────────┘

TOTAL: ~450-750ms (50% de melhoria vs. atual)
```

---

## 🛠️ IMPLEMENTAÇÃO

### FASE 1: Mover Lógica para SuperUnifiedProvider

**Arquivo:** `src/contexts/providers/SuperUnifiedProvider.tsx`

```tsx
// ✅ NOVO: Unified loading logic
interface SuperUnifiedProviderProps {
  resourceId?: string;  // 🆕 Aceita resourceId diretamente
  resourceType?: 'template' | 'funnel' | 'draft';  // 🆕 Tipo explícito
  autoLoad?: boolean;
  initialData?: any;
  // ... props existentes
}

export function SuperUnifiedProvider({
  resourceId,
  resourceType,
  autoLoad = true,
  initialData,
  children,
  ...props
}: SuperUnifiedProviderProps) {
  const [state, setState] = useState<UnifiedState>({
    currentFunnel: null,
    editor: {
      currentStep: 1,
      stepBlocks: {},
      selectedBlock: null,
      loadedTemplate: null,  // 🆕 Migrado de QuizModularEditor
      canvasMode: 'edit',    // 🆕 Migrado de QuizModularEditor
      previewMode: 'live',   // 🆕 Migrado de QuizModularEditor
    },
    ui: {
      isLoading: false,
      error: null,
    },
  });

  // ✅ CONSOLIDADO: Único ponto de carregamento
  const loadResource = useCallback(async (rid: string, rtype?: string) => {
    setState(prev => ({ ...prev, ui: { ...prev.ui, isLoading: true, error: null } }));

    try {
      // Detectar tipo se não fornecido
      const type = rtype || detectResourceType(rid);

      // 🔥 PARALELIZAR quando possível
      if (type === 'template') {
        // Template → Funnel
        const [prepResult, convResult] = await Promise.all([
          templateService.prepareTemplate(rid),
          templateToFunnelAdapter.convertTemplateToFunnel({
            templateId: rid,
            loadAllSteps: false,
            specificSteps: ['step-01'],
          }),
        ]);

        if (!convResult.success) {
          throw new Error(convResult.error);
        }

        // Validação em background (não bloqueia)
        validateTemplateIntegrityFull(rid, 21, ...).then(result => {
          if (!result.isValid) {
            appLogger.warn('[SuperUnified] Template validation failed:', result);
          }
        });

        setState(prev => ({
          ...prev,
          currentFunnel: convResult.funnel,
          editor: {
            ...prev.editor,
            loadedTemplate: {
              name: `Template: ${rid}`,
              steps: convResult.funnel.stages.map((s, i) => ({
                id: s.id,
                order: i + 1,
                name: s.name,
              })),
            },
          },
          ui: { isLoading: false, error: null },
        }));

      } else if (type === 'funnel') {
        // Funnel do Supabase
        const funnel = await loadFunnelFromSupabase(rid);
        
        setState(prev => ({
          ...prev,
          currentFunnel: funnel,
          editor: { ...prev.editor, loadedTemplate: null },
          ui: { isLoading: false, error: null },
        }));
      }

    } catch (error) {
      appLogger.error('[SuperUnified] Load resource failed:', error as Error);
      setState(prev => ({
        ...prev,
        ui: { isLoading: false, error: error as Error },
      }));
    }
  }, []);

  // Auto-load quando resourceId muda
  useEffect(() => {
    if (autoLoad && resourceId && !initialData) {
      loadResource(resourceId, resourceType);
    } else if (initialData) {
      // Dados pré-carregados
      setState(prev => ({
        ...prev,
        currentFunnel: initialData,
        ui: { isLoading: false, error: null },
      }));
    }
  }, [autoLoad, resourceId, resourceType, initialData, loadResource]);

  // ... resto do provider
}
```

---

### FASE 2: Simplificar EditorRoutes

**Arquivo:** `src/pages/editor/index.tsx`

```tsx
export const EditorRoutesInner: React.FC = () => {
  const resourceId = useResourceIdFromLocation();
  const [showStartupModal, setShowStartupModal] = useState(false);

  // ❌ REMOVIDO: useEditorResource (lógica movida para SuperUnifiedProvider)
  // const editorResource = useEditorResource({ resourceId, autoLoad: true });

  // Detectar tipo de recurso (rápido, sem I/O)
  const resourceType = resourceId ? detectResourceType(resourceId) : undefined;

  return (
    <>
      <EditorStartupModal
        open={showStartupModal}
        onSelectMode={handleSelectMode}
      />

      {/* ✅ SIMPLIFICADO: SuperUnifiedProvider faz TODO o carregamento */}
      <SuperUnifiedProvider
        resourceId={resourceId}  // 🆕 Passa resourceId diretamente
        resourceType={resourceType}  // 🆕 Tipo já detectado
        autoLoad={Boolean(resourceId)}
        debugMode={import.meta.env.DEV}
      >
        <Suspense fallback={<PageLoadingFallback message="Carregando editor..." />}>
          <QuizModularEditor />  {/* ✅ SEM props, lê do contexto */}
        </Suspense>
      </SuperUnifiedProvider>
    </>
  );
};
```

---

### FASE 3: Simplificar QuizModularEditor

**Arquivo:** `src/components/editor/quiz/QuizModularEditor/index.tsx`

```tsx
function QuizModularEditorInner(props: QuizModularEditorProps) {
  const unified = useSuperUnified();

  // ❌ REMOVIDO: Estado local (migrado para SuperUnifiedProvider)
  // const [loadedTemplate, setLoadedTemplate] = useState(null);
  // const [canvasMode, setCanvasMode] = useState<'edit' | 'preview'>('edit');
  // const [previewMode, setPreviewMode] = useState<'live' | 'production'>('live');

  // ✅ AGORA: Lê do contexto unificado
  const {
    loadedTemplate,
    canvasMode,
    previewMode,
    isLoading,
    error,
  } = unified.state.editor;

  // ❌ REMOVIDO: useEffect complexo de carregamento
  // useEffect(() => {
  //   async function loadTemplateOptimized() { ... }
  //   loadTemplateOptimized();
  // }, [props.templateId, resourceId]);

  // ✅ AGORA: Apenas valida se necessário
  useEffect(() => {
    if (error) {
      showToast({
        type: 'error',
        title: 'Erro ao carregar template',
        message: error.message,
      });
    }
  }, [error]);

  // ... resto do componente (apenas UI)
}
```

---

## 📊 BENEFÍCIOS ESPERADOS

### Performance

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **Camadas de carregamento** | 4 | 1 | **75% ↓** |
| **TTI** | ~2.2s | ~0.7s | **68% ↓** |
| **Requisições sequenciais** | 100% | ~30% | **70% ↓** |
| **Validações duplicadas** | 3× | 1× | **66% ↓** |

### Arquitetura

- ✅ **Fonte única da verdade** (SuperUnifiedProvider.state)
- ✅ **Sem condições de corrida** (carregamento centralizado)
- ✅ **Fácil de testar** (mock único provider)
- ✅ **Menos código** (remove 200+ linhas de lógica duplicada)

### Desenvolvimento

- ✅ **Onboarding mais rápido** (1 lugar para entender carregamento)
- ✅ **Debugging mais fácil** (1 ponto para adicionar breakpoints)
- ✅ **Manutenção simples** (mudanças em 1 local)

---

## 🚧 RISCOS E MITIGAÇÕES

### Risco 1: Breaking Changes em Componentes Existentes

**Mitigação:**
- Manter `useEditorResource` como wrapper (deprecated) temporariamente
- Migração gradual com feature flag
- Testes de integração antes do rollout

### Risco 2: Perda de Flexibilidade

**Mitigação:**
- SuperUnifiedProvider aceita `initialData` para casos especiais
- Props `autoLoad={false}` para controle manual
- Callbacks `onLoad`, `onError` para customização

### Risco 3: Aumento de Complexidade do Provider

**Mitigação:**
- Extrair lógica para hooks especializados:
  - `useResourceLoader()`
  - `useTemplateValidator()`
  - `useResourceCache()`
- Provider orquestra, hooks implementam

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### FASE 1: Preparação (1-2h)
- [ ] Criar branch `feat/consolidate-loading`
- [ ] Adicionar feature flag `ENABLE_CONSOLIDATED_LOADING`
- [ ] Criar testes para novo fluxo

### FASE 2: Implementação (3-4h)
- [ ] Atualizar `SuperUnifiedProvider` com lógica consolidada
- [ ] Adicionar `resourceId` e `resourceType` props
- [ ] Migrar estado local de `QuizModularEditor`
- [ ] Remover `useEffect` duplicados

### FASE 3: Refatoração (2-3h)
- [ ] Simplificar `EditorRoutes`
- [ ] Simplificar `QuizModularEditor`
- [ ] Deprecar `useEditorResource` (manter compatibilidade)

### FASE 4: Validação (1-2h)
- [ ] Testes de integração end-to-end
- [ ] Performance profiling (Before/After)
- [ ] Validar com templates reais (quiz21StepsComplete)

### FASE 5: Rollout (1h)
- [ ] Merge para main
- [ ] Monitorar Sentry para erros
- [ ] Documentar mudanças no CHANGELOG

---

**Esforço Total Estimado:** 8-12 horas  
**Complexidade:** Alta  
**Prioridade:** 🔴 Crítica (FASE 1)  
**Status:** 📋 Especificado - Aguardando Implementação
