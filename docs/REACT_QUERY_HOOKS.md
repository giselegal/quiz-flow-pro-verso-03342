# React Query Hooks - Guia Completo

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Query Key Factory](#query-key-factory)
3. [useTemplateStep](#usettemplatestep)
4. [useTemplateSteps](#usetemplatesteps)
5. [usePrefetchTemplateStep](#useprefetchtemplatestep)
6. [usePrepareTemplate](#usepreparetemplate)
7. [usePreloadTemplate](#usepreloadtemplate)
8. [Cache Management](#cache-management)
9. [Padrões Avançados](#padrões-avançados)
10. [Best Practices](#best-practices)

---

## 🎯 Visão Geral

Os hooks React Query para templates fornecem uma camada declarativa sobre o `TemplateService` com:

- ✅ **Cache automático** com staleTime e gcTime configuráveis
- ✅ **AbortSignal** gerenciado automaticamente pelo React Query
- ✅ **Loading/error states** declarativos
- ✅ **Retry logic** integrado (3 tentativas por padrão)
- ✅ **Type-safe** com TypeScript completo
- ✅ **Prefetch** para melhorar UX

### Benefícios sobre Service Direto

| Aspecto | Service Direto | React Query Hook |
|---------|---------------|------------------|
| Cache | Manual | Automático |
| Loading state | Manual | Declarativo |
| AbortSignal | Manual | Automático |
| Retry | Manual | Configurável |
| Invalidação | Manual | API simples |
| Type inference | Parcial | Completo |

---

## 🔑 Query Key Factory

### templateKeys

Factory hierárquico para criar query keys consistentes.

```typescript
import { templateKeys } from '@/services/hooks';

// Estrutura hierárquica
templateKeys.all                              // ['templates']
templateKeys.lists()                          // ['templates', 'list']
templateKeys.templates()                      // ['templates', 'template']
templateKeys.template(templateId)             // ['templates', 'template', templateId]
templateKeys.steps(templateId)                // ['templates', 'template', templateId, 'steps']
templateKeys.step(templateId, stepId)         // ['templates', 'template', templateId, 'steps', stepId]
templateKeys.metadata(templateId)             // ['templates', 'template', templateId, 'metadata']
templateKeys.validation(templateId)           // ['templates', 'template', templateId, 'validation']
```

### stepKeys

Helper para keys de steps individuais.

```typescript
import { stepKeys } from '@/services/hooks';

stepKeys.all                     // ['templates', 'default', 'steps']
stepKeys.step(stepId)           // ['templates', 'default', 'step', stepId]
```

### Uso para Invalidação

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { templateKeys } from '@/services/hooks';

const queryClient = useQueryClient();

// Invalidar todas queries de templates
await queryClient.invalidateQueries({ 
  queryKey: templateKeys.all 
});

// Invalidar apenas steps de um template
await queryClient.invalidateQueries({ 
  queryKey: templateKeys.steps('quiz21StepsComplete') 
});

// Invalidar step específico
await queryClient.invalidateQueries({ 
  queryKey: templateKeys.step('quiz21StepsComplete', 'step-01-intro') 
});
```

---

## 📦 useTemplateStep

Hook para carregar um step individual com cache automático.

### Assinatura

```typescript
function useTemplateStep(
  stepId: string | undefined,
  options?: UseTemplateStepOptions
): UseQueryResult<Block[], Error>
```

### Opções

```typescript
interface UseTemplateStepOptions {
  templateId?: string;           // ID do template (opcional)
  enabled?: boolean;              // Habilita query (default: true)
  staleTime?: number;             // Tempo antes de stale (default: 5min)
  cacheTime?: number;             // Tempo GC (default: 30min)
  retry?: number | boolean;       // Retry logic (default: 3)
  onSuccess?: (data: Block[]) => void;
  onError?: (error: Error) => void;
}
```

### Exemplo Básico

```typescript
import { useTemplateStep } from '@/services/hooks';

function StepEditor({ stepId }: { stepId: string }) {
  const { 
    data: blocks,
    isLoading,
    isError,
    error,
    refetch
  } = useTemplateStep(stepId, {
    templateId: 'quiz21StepsComplete',
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <ErrorAlert 
        message={error.message}
        onRetry={refetch}
      />
    );
  }

  return <BlocksRenderer blocks={blocks} />;
}
```

### Exemplo com Enabled

Controlar quando a query deve executar:

```typescript
function ConditionalStepLoader({ stepId, shouldLoad }: Props) {
  const { data, isLoading } = useTemplateStep(stepId, {
    enabled: shouldLoad && !!stepId,
  });

  // Query só executa se shouldLoad=true e stepId não é vazio
}
```

### Exemplo com Callbacks

```typescript
function StepEditorWithAnalytics({ stepId }: Props) {
  const { data } = useTemplateStep(stepId, {
    onSuccess: (blocks) => {
      // Analytics
      trackEvent('step_loaded', {
        stepId,
        blockCount: blocks.length,
      });
    },
    onError: (error) => {
      // Error tracking
      logError('step_load_failed', { stepId, error });
    },
  });
}
```

### Exemplo com Custom Cache

```typescript
function CachedStepViewer({ stepId }: Props) {
  const { data } = useTemplateStep(stepId, {
    staleTime: 10 * 60 * 1000,  // 10 minutos
    cacheTime: 60 * 60 * 1000,   // 1 hora
    retry: 5,                     // 5 tentativas
  });
}
```

---

## 📚 useTemplateSteps

Hook para carregar múltiplos steps em paralelo.

### Assinatura

```typescript
function useTemplateSteps(
  stepIds: string[],
  options?: UseTemplateStepOptions
): Array<{
  stepId: string;
  blocks: Block[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}>
```

### Exemplo Básico

```typescript
import { useTemplateSteps } from '@/services/hooks';

function MultiStepPreview({ stepIds }: { stepIds: string[] }) {
  const stepsData = useTemplateSteps(stepIds, {
    templateId: 'quiz21StepsComplete',
  });

  return (
    <div>
      {stepsData.map(({ stepId, blocks, isLoading, isError, error }) => (
        <div key={stepId}>
          <h3>{stepId}</h3>
          {isLoading && <Spinner />}
          {isError && <Error message={error?.message} />}
          {blocks && <BlockList blocks={blocks} />}
        </div>
      ))}
    </div>
  );
}
```

### Exemplo com Agregação de Estados

```typescript
function StepsSummary({ stepIds }: Props) {
  const stepsData = useTemplateSteps(stepIds);
  
  const allLoading = stepsData.every(s => s.isLoading);
  const anyError = stepsData.some(s => s.isError);
  const totalBlocks = stepsData
    .filter(s => s.blocks)
    .reduce((sum, s) => sum + s.blocks!.length, 0);

  if (allLoading) return <FullPageSpinner />;
  if (anyError) return <ErrorSummary errors={stepsData.filter(s => s.isError)} />;

  return <div>Total de {totalBlocks} blocos em {stepIds.length} steps</div>;
}
```

---

## ⚡ usePrefetchTemplateStep

Hook para prefetch de steps em background.

### Assinatura

```typescript
function usePrefetchTemplateStep(): (
  stepId: string,
  options?: UseTemplateStepOptions
) => Promise<void>
```

### Exemplo: Prefetch ao Navegar

```typescript
import { usePrefetchTemplateStep } from '@/services/hooks';

function QuizStepper({ currentIndex, steps }: Props) {
  const prefetchStep = usePrefetchTemplateStep();

  const handleNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < steps.length) {
      // Prefetch próximo step
      prefetchStep(steps[nextIndex], {
        templateId: 'quiz21StepsComplete',
      });
    }

    setCurrentIndex(nextIndex);
  }, [currentIndex, steps, prefetchStep]);

  return <Button onClick={handleNext}>Próximo</Button>;
}
```

### Exemplo: Prefetch ao Hover

```typescript
function StepMenuItem({ stepId, onClick }: Props) {
  const prefetchStep = usePrefetchTemplateStep();

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => prefetchStep(stepId)}
    >
      {stepId}
    </button>
  );
}
```

### Exemplo: Prefetch em Batch

```typescript
function QuizPreloader({ steps }: Props) {
  const prefetchStep = usePrefetchTemplateStep();

  useEffect(() => {
    // Prefetch todos os steps ao montar
    steps.forEach(stepId => {
      prefetchStep(stepId, { templateId: 'quiz21StepsComplete' });
    });
  }, [steps, prefetchStep]);

  return null; // Componente invisível
}
```

---

## 🔧 usePrepareTemplate

Hook de mutation para preparar templates.

### Assinatura

```typescript
function usePrepareTemplate(
  options?: UsePrepareTemplateOptions
): UseMutationResult<ServiceResult<void>, Error, PrepareTemplateMutationVariables>
```

### Tipos

```typescript
interface PrepareTemplateMutationVariables {
  templateId: string;
  options?: {
    preloadAll?: boolean;
  };
}

interface UsePrepareTemplateOptions {
  onSuccess?: (data: ServiceResult<void>, variables: PrepareTemplateMutationVariables) => void;
  onError?: (error: Error, variables: PrepareTemplateMutationVariables) => void;
  retry?: number;
}
```

### Exemplo Básico

```typescript
import { usePrepareTemplate } from '@/services/hooks';

function TemplateLoader({ templateId }: Props) {
  const { 
    mutate: prepareTemplate,
    isPending,
    isError,
    error
  } = usePrepareTemplate({
    onSuccess: () => {
      toast.success('Template preparado!');
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const handlePrepare = () => {
    prepareTemplate({
      templateId,
      options: { preloadAll: true }
    });
  };

  return (
    <Button 
      onClick={handlePrepare}
      disabled={isPending}
    >
      {isPending ? 'Preparando...' : 'Preparar Template'}
    </Button>
  );
}
```

### Exemplo com Variante Simplificada

```typescript
import { usePrepareTemplateFn } from '@/services/hooks';

function SimpleTemplateLoader({ templateId }: Props) {
  const prepareTemplate = usePrepareTemplateFn();
  const [isLoading, setIsLoading] = useState(false);

  const handlePrepare = async () => {
    setIsLoading(true);
    try {
      await prepareTemplate(templateId, { preloadAll: true });
      console.log('Preparado!');
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return <Button onClick={handlePrepare}>Preparar</Button>;
}
```

---

## 📥 usePreloadTemplate

Hook de mutation para preload completo de templates.

### Assinatura

```typescript
function usePreloadTemplate(
  options?: UsePreloadTemplateOptions
): UseMutationResult<ServiceResult<void>, Error, PreloadTemplateMutationVariables>
```

### Exemplo: Preload ao Entrar

```typescript
import { usePreloadTemplate } from '@/services/hooks';

function QuizContainer({ templateId }: Props) {
  const { mutate: preloadTemplate } = usePreloadTemplate({
    onSuccess: () => {
      console.log('✅ Template preloaded');
    },
  });

  useEffect(() => {
    // Iniciar preload ao montar
    preloadTemplate({ templateId });
  }, [templateId, preloadTemplate]);

  return <QuizUI />;
}
```

### Exemplo: Preload com Progress

```typescript
function TemplatePreloader({ templateId }: Props) {
  const [progress, setProgress] = useState(0);
  
  const { mutate: preloadTemplate, isPending } = usePreloadTemplate({
    onSuccess: () => setProgress(100),
  });

  useEffect(() => {
    preloadTemplate({ templateId });
    
    // Simular progresso (em produção, usar eventos reais)
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 10, 90));
    }, 200);
    
    return () => clearInterval(interval);
  }, [templateId, preloadTemplate]);

  return (
    <div>
      <ProgressBar value={progress} />
      {isPending && <Text>Carregando...</Text>}
    </div>
  );
}
```

---

## 💾 Cache Management

### Invalidação Manual

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { templateKeys } from '@/services/hooks';

function TemplateEditor({ templateId, stepId }: Props) {
  const queryClient = useQueryClient();

  const handleSave = async (blocks: Block[]) => {
    await saveBlocks(blocks);
    
    // Invalidar cache do step editado
    await queryClient.invalidateQueries({
      queryKey: templateKeys.step(templateId, stepId)
    });
  };

  return <Editor onSave={handleSave} />;
}
```

### Atualização Otimista

```typescript
function OptimisticEditor({ templateId, stepId }: Props) {
  const queryClient = useQueryClient();
  const { data: blocks } = useTemplateStep(stepId, { templateId });

  const handleAddBlock = (newBlock: Block) => {
    // Atualização otimista
    queryClient.setQueryData(
      templateKeys.step(templateId, stepId),
      (old: Block[] = []) => [...old, newBlock]
    );

    // Persistir no backend
    saveBlock(newBlock).catch(() => {
      // Rollback em erro
      queryClient.invalidateQueries({
        queryKey: templateKeys.step(templateId, stepId)
      });
    });
  };
}
```

### Prefetch com Invalidação

```typescript
function SmartPrefetch({ currentStep, nextStep }: Props) {
  const queryClient = useQueryClient();
  const prefetchStep = usePrefetchTemplateStep();

  useEffect(() => {
    // Invalidar step anterior (liberar memória)
    queryClient.removeQueries({
      queryKey: stepKeys.step(currentStep)
    });

    // Prefetch próximo step
    prefetchStep(nextStep);
  }, [currentStep, nextStep]);
}
```

---

## 🎨 Padrões Avançados

### Pattern: Suspense Boundary

```typescript
import { Suspense } from 'react';

// Componente com suspense enabled
function SuspenseStep({ stepId }: Props) {
  const { data: blocks } = useTemplateStep(stepId, {
    suspense: true, // Ativa suspense
  });

  return <BlockRenderer blocks={blocks} />;
}

// Parent com boundary
function StepContainer({ stepId }: Props) {
  return (
    <Suspense fallback={<StepSkeleton />}>
      <SuspenseStep stepId={stepId} />
    </Suspense>
  );
}
```

### Pattern: Dependent Queries

```typescript
function DependentLoader({ templateId }: Props) {
  // Primeiro, preparar template
  const { 
    mutate: prepareTemplate,
    isSuccess: isPrepared 
  } = usePrepareTemplate();

  useEffect(() => {
    prepareTemplate({ templateId });
  }, [templateId]);

  // Depois, carregar steps (só se preparado)
  const { data: blocks } = useTemplateStep('step-01', {
    templateId,
    enabled: isPrepared, // Depende de prepareTemplate
  });

  return blocks ? <Renderer blocks={blocks} /> : <Loading />;
}
```

### Pattern: Polling

```typescript
function RealTimeStep({ stepId }: Props) {
  const { data: blocks } = useTemplateStep(stepId, {
    refetchInterval: 5000, // Poll a cada 5s
    refetchIntervalInBackground: false,
  });

  return <BlockRenderer blocks={blocks} />;
}
```

### Pattern: Background Sync

```typescript
function BackgroundSyncStep({ stepId }: Props) {
  const { data: blocks } = useTemplateStep(stepId, {
    refetchOnWindowFocus: true,  // Refetch ao focar janela
    refetchOnReconnect: true,    // Refetch ao reconectar
    refetchOnMount: true,        // Refetch ao montar
  });

  return <BlockRenderer blocks={blocks} />;
}
```

---

## ✨ Best Practices

### 1. Use templateId Consistente

```typescript
// ✅ BOM: templateId consistente
const TEMPLATE_ID = 'quiz21StepsComplete';

function Step1() {
  return useTemplateStep('step-01', { templateId: TEMPLATE_ID });
}

function Step2() {
  return useTemplateStep('step-02', { templateId: TEMPLATE_ID });
}

// ❌ RUIM: templateId inconsistente
function Step1() {
  return useTemplateStep('step-01', { templateId: 'quiz21' });
}

function Step2() {
  return useTemplateStep('step-02', { templateId: 'quiz21StepsComplete' });
}
```

### 2. Prefetch Inteligente

```typescript
// ✅ BOM: Prefetch apenas próximo step
const prefetchStep = usePrefetchTemplateStep();
useEffect(() => {
  if (currentIndex + 1 < steps.length) {
    prefetchStep(steps[currentIndex + 1]);
  }
}, [currentIndex]);

// ❌ RUIM: Prefetch todos os steps (sobrecarga)
const prefetchStep = usePrefetchTemplateStep();
useEffect(() => {
  steps.forEach(prefetchStep); // Muito agressivo
}, []);
```

### 3. Error Boundaries

```typescript
// ✅ BOM: Error boundary para queries
<ErrorBoundary fallback={<ErrorUI />}>
  <StepLoader stepId={stepId} />
</ErrorBoundary>

// ❌ RUIM: Sem error handling
<StepLoader stepId={stepId} />
```

### 4. Limpeza de Cache

```typescript
// ✅ BOM: Limpar cache ao desmontar fluxo
function QuizFlow() {
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      // Limpar ao desmontar
      queryClient.removeQueries({ 
        queryKey: templateKeys.all 
      });
    };
  }, []);
}

// ❌ RUIM: Cache cresce infinitamente
```

### 5. Loading States Granulares

```typescript
// ✅ BOM: States específicos
if (isLoading) return <Skeleton />;
if (isError) return <Error error={error} />;
if (!blocks?.length) return <Empty />;
return <Renderer blocks={blocks} />;

// ❌ RUIM: Loading genérico
if (isLoading || !blocks) return <Spinner />;
return <Renderer blocks={blocks} />;
```

### 6. Type Safety

```typescript
// ✅ BOM: Tipos inferidos
const { data: blocks } = useTemplateStep(stepId);
// blocks é Block[] | undefined

// ❌ RUIM: Type assertion desnecessária
const { data } = useTemplateStep(stepId);
const blocks = data as Block[];
```

---

## 📊 Performance Tips

### 1. Ajustar staleTime

```typescript
// Step raramente muda
const { data } = useTemplateStep(stepId, {
  staleTime: 30 * 60 * 1000, // 30 minutos
});

// Step muda frequentemente
const { data } = useTemplateStep(stepId, {
  staleTime: 1000, // 1 segundo
});
```

### 2. Usar enabled para Lazy Loading

```typescript
// Só carregar quando necessário
const { data } = useTemplateStep(stepId, {
  enabled: isVisible, // Só quando visível
});
```

### 3. Batch Prefetch

```typescript
// Prefetch em batch para melhor performance
const prefetchBatch = async (stepIds: string[]) => {
  await Promise.all(
    stepIds.map(id => prefetchStep(id))
  );
};
```

### 4. Memoizar Callbacks

```typescript
const handleSuccess = useCallback((blocks: Block[]) => {
  console.log('Loaded:', blocks.length);
}, []);

const { data } = useTemplateStep(stepId, {
  onSuccess: handleSuccess, // Memoizado
});
```

---

## 🎓 Conclusão

Os hooks React Query fornecem uma API poderosa e declarativa para gerenciamento de templates com:

- ✅ Cache automático e inteligente
- ✅ Estados de loading/error consistentes
- ✅ AbortSignal gerenciado automaticamente
- ✅ Type-safety completo
- ✅ Padrões avançados (suspense, polling, etc.)

Use estes hooks sempre que possível em vez de chamar `templateService` diretamente para obter os benefícios do React Query.

---

**Última atualização:** 2025-11-07  
**Versão:** 1.0  
**Autor:** Sistema QuizFlow Pro
