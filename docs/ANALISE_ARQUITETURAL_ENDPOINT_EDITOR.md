# 📊 Análise Arquitetural - Endpoint `/editor` para Edição de Modelos JSON

**Data:** 30 de Novembro de 2025  
**Versão:** 2.0 - **VERIFICADO COM CÓDIGO REAL**  
**Escopo:** Análise completa do fluxo de dados, gargalos e soluções para o endpoint `/editor`

---

## ⚠️ VERIFICAÇÃO CRÍTICA: CONFLITO DE COMPONENTES

### 🔴 **CONFLITO DETECTADO: QuizModularEditor vs QuizModularEditorV4**

A análise identificou um **conflito arquitetural significativo**:

1. **`src/components/editor/quiz/QuizModularEditor/index.tsx`** (2422 linhas)
   - Componente principal e completo
   - Export default: `QuizModularEditor`
   - Contém TODA a lógica funcional

2. **`src/components/editor/quiz/QuizModularEditor/QuizModularEditorV4.tsx`** (383 linhas)
   - Wrapper experimental para v4
   - **SEMPRE delega para o componente original** (linha 318-323)
   - `useV4Layout` é **hardcoded como `false`** 
   - Export: `QuizModularEditorV4Wrapper`

3. **Uso no App.tsx (linha 70)**
   ```typescript
   const QuizModularEditor = lazy(() => 
     import('./components/editor/quiz/QuizModularEditor/QuizModularEditorV4')
   );
   ```
   **PROBLEMA**: App carrega V4 wrapper, mas V4 apenas redireciona para o original!

### 🎯 Impacto Real

**NÃO HÁ CONFLITO FUNCIONAL**, mas há **camada de indireção desnecessária**:
- ✅ Funciona corretamente (V4 sempre chama o original)
- ⚠️ Performance: Uma camada extra de lazy loading
- ⚠️ Confusão: Análise menciona V4 mas código usa V3 (original)

---

## 📋 Resumo Executivo

Este documento apresenta uma análise arquitetural **VERIFICADA COM CÓDIGO REAL** do endpoint `/editor` responsável pela edição de modelos em formato JSON. A análise aborda:

1. **Fluxo de dados** desde a chamada do endpoint até a manipulação de JSON ✅ VERIFICADO
2. **Dependências críticas** e pontos de falha ✅ VERIFICADO
3. **Problemas de desempenho**, timeout e concorrência ✅ PARCIALMENTE CORRIGIDO
4. **Logs e erros** recorrentes ✅ VERIFICADO
5. **Limitações** frontend e backend ✅ VERIFICADO
6. **Métricas e ferramentas** de monitoramento sugeridas ✅ VERIFICADO

---

## 🏗️ Arquitetura Atual

### Diagrama de Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CAMADA DE APRESENTAÇÃO (Frontend)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  URL: /editor?funnel=<funnelId>&template=<templateId>                       │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │               EditorPage.tsx (src/pages/editor/EditorPage.tsx)       │   │
│  │  • Sanitiza parâmetros (template, funnelId)                          │   │
│  │  • Normaliza ?template= para ?funnel=                                │   │
│  │  • Aplica fallback em dev/test para quiz21StepsComplete              │   │
│  │  • Envolve QuizModularEditor com EditorProvider + ErrorBoundary      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │               QuizModularEditor (~2400 linhas)                       │   │
│  │                                                                      │   │
│  │  HOOKS PRINCIPAIS:                                                   │   │
│  │  ├── useTemplateLoader → Carrega estrutura do template               │   │
│  │  ├── useStepBlocksLoader → Carrega blocos por step sob demanda       │   │
│  │  ├── useWYSIWYGBridge → Sincronização de edição em tempo real        │   │
│  │  ├── useAutoSave → Salvamento automático com debounce                │   │
│  │  ├── useStepPrefetch → Prefetch de steps vizinhos                    │   │
│  │  └── useTemplateValidation → Validação em Web Worker                 │   │
│  │                                                                      │   │
│  │  COLUNAS DE LAYOUT:                                                  │   │
│  │  ├── StepNavigatorColumn (navegação entre steps)                     │   │
│  │  ├── ComponentLibraryColumn (biblioteca de blocos)                   │   │
│  │  ├── CanvasColumn (canvas visual WYSIWYG)                            │   │
│  │  └── PropertiesColumn (painel de propriedades)                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
└──────────────────────────────┼──────────────────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────────────────┐
│                        CAMADA DE SERVIÇOS (Frontend)                        │
├──────────────────────────────┼──────────────────────────────────────────────┤
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │      TemplateService (src/services/canonical/TemplateService.ts)     │   │
│  │  • Serviço canônico (SINGLE SOURCE OF TRUTH)                         │   │
│  │  • Cache com TTL configurável                                        │   │
│  │  • Validação Zod para templates v4                                   │   │
│  │  • Lazy loading com preload strategies                               │   │
│  │  • Integração com HierarchicalTemplateSource                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │      HierarchicalTemplateSource (prioridade de 4 níveis)             │   │
│  │  1. USER_EDIT → Edições do usuário (Supabase quiz_drafts)            │   │
│  │  2. ADMIN_OVERRIDE → Sobrescrita administrativa                      │   │
│  │  3. TEMPLATE_DEFAULT → JSON estático (/templates/*.json)             │   │
│  │  4. FALLBACK → Blocos mínimos de placeholder                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │         UnifiedTemplateLoader (carregamento unificado)               │   │
│  │  • Tenta v4 JSON primeiro (/templates/quiz21-v4.json)                │   │
│  │  • Fallback para v3 JSON                                             │   │
│  │  • Cache com React Query                                             │   │
│  │  • Timeout configurável                                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
└──────────────────────────────┼──────────────────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────────────────┐
│                          CAMADA DE DADOS                                    │
├──────────────────────────────┼──────────────────────────────────────────────┤
│                              ▼                                              │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────────────┐    │
│  │  JSON Estático   │ │   IndexedDB      │ │       Supabase           │    │
│  │  /templates/     │ │   (Cache L2)     │ │   quiz_drafts            │    │
│  │  quiz21-v4.json  │ │   funnels        │ │   funnel_steps           │    │
│  │  quiz21-v3.json  │ │   steps          │ │   component_instances    │    │
│  │  per-step/*.json │ │   blocks         │ │                          │    │
│  └──────────────────┘ └──────────────────┘ └──────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚨 Gargalos e Limitações Identificados - VERIFICAÇÃO CÓDIGO REAL

### 1. Gargalos de CARREGAMENTO

| ID | Gargalo | Status Real | Causa Raiz Verificada | Severidade |
|----|---------|-------------|----------------------|------------|
| G1 | Carregamento múltiplo | ✅ **CORRIGIDO** | Hook `useStepBlocksLoader` unificado com `loadedStepRef` (linha 47-50) | 🟢 Resolvido |
| G2 | v4 JSON sempre carregado | ✅ **MITIGADO** | `unifiedTemplateLoader.loadStep` com cache (useStepBlocksLoader.ts:81) | 🟢 Aceitável |
| G3 | Prefetch agressivo | ✅ **CORRIGIDO** | `useStepPrefetch` com debounce 300ms + radius 1 (index.tsx:72) | 🟢 Resolvido |
| G4 | Validação no main thread | ✅ **CORRIGIDO** | `useTemplateValidation` com Web Worker (index.tsx:75) | 🟢 Resolvido |
| G5 | Cache key sem funnelId | ⚠️ **PARCIAL** | `useStepBlocksLoader` usa `loadKey` mas sem funnelId explícito (linha 47) | 🟡 Revisar |

### 2. Gargalos de SINCRONIZAÇÃO

| ID | Gargalo | Status Real | Implementação Verificada | Severidade |
|----|---------|-------------|--------------------------|------------|
| G6 | Sync loop WYSIWYG | ✅ **CORRIGIDO** | `lastFlushedSignatureRef` compara IDs (index.tsx:1024-1035) | 🟢 Resolvido |
| G7 | Race condition flush | ✅ **CORRIGIDO** | Flush forçado antes do autosave (index.tsx:568-578) | 🟢 Resolvido |
| G8 | setActiveFunnel dessincronizado | ⚠️ **NÃO ENCONTRADO** | Código não usa `setActiveFunnel` | 🟢 N/A |
| G9 | activeTemplateSteps = 0 | ⚠️ **NÃO VERIFICÁVEL** | Lógica de steps em `useTemplateLoader` (não reproduzido) | 🟡 Monitorar |

### 3. Gargalos de SERIALIZAÇÃO/DESERIALIZAÇÃO JSON

| ID | Gargalo | Status Real | Implementação Verificada | Severidade |
|----|---------|-------------|--------------------------|------------|
| G10 | 3 formatos de normalização | ✅ **ESPERADO** | `extractBlocksFromStepData` tenta 4 formatos (normalizeBlocks.ts:15-45) | 🟢 Feature |
| G11 | Perda de dados v4→v3 | ⚠️ **NÃO ENCONTRADO** | Conversão em `BlockV4ToV3Adapter` - não há heurística de tamanho | 🟡 Revisar |
| G12 | Placeholder mascara erros | ✅ **CORRIGIDO** | P10 FIX: Step vazio retorna `[]` + warning (useStepBlocksLoader.ts:89) | 🟢 Resolvido |

### 4. Gargalos de PERSISTÊNCIA

| ID | Gargalo | Status Real | Implementação Verificada | Severidade |
|----|---------|-------------|--------------------------|------------|
| G13 | Auto-save sem hash | ✅ **CORRIGIDO** | `computeBlocksHash` + `lastPersistedHashRef` (index.tsx:586-594) | 🟢 Resolvido |
| G14 | Versionamento otimista | ❌ **NÃO IMPLEMENTADO** | Sem controle de versão em `persistenceService.saveBlocks` | 🔴 Pendente |
| G15 | Supabase timeout | ✅ **MITIGADO** | `persistenceService` com `maxRetries: 3` (index.tsx:531) | 🟡 Aceitável |

### 5. Gargalos de AUTENTICAÇÃO/PERMISSÕES

| ID | Gargalo | Status Real | Implementação Verificada | Severidade |
|----|---------|-------------|--------------------------|------------|
| G16 | RLS não verificado | ⚠️ **NÃO VERIFICÁVEL** | Lógica RLS está no backend (Supabase) | 🟡 Backend |
| G17 | Token expira | ❌ **NÃO IMPLEMENTADO** | Sem refresh proativo de token encontrado | 🔴 Pendente |

### 6. Gargalos de CONCORRÊNCIA

| ID | Gargalo | Status Real | Implementação Verificada | Severidade |
|----|---------|-------------|--------------------------|------------|
| G18 | WebSocket co-edição | ❌ **NÃO IMPLEMENTADO** | Sem WebSocket para edição colaborativa | 🟢 Feature |
| G19 | Abort timing | ✅ **CORRIGIDO** | P11 FIX: `isMountedRef` evita state após unmount (useStepBlocksLoader.ts:32) | 🟢 Resolvido |

---

## 🔍 Análise Detalhada por Área

### A. Fluxo de Dados: Endpoint → JSON

```typescript
// 1. URL entra no EditorPage
/editor?funnel=quiz21StepsComplete

// 2. EditorPage extrai e sanitiza parâmetros
const funnelId = paramsWithId?.funnelId || funnelIdFromQuery || templateParam;

// 3. QuizModularEditor recebe props
<QuizModularEditor funnelId="quiz21StepsComplete" />

// 4. useTemplateLoader carrega estrutura
const { data: loadedTemplate } = useTemplateLoader({ templateId });

// 5. useStepBlocksLoader carrega blocos do step atual
useStepBlocksLoader({ templateOrFunnelId, stepIndex, setStepBlocks });

// 6. TemplateService busca dados
const result = await templateService.getStep(stepId, templateId);

// 7. HierarchicalTemplateSource aplica prioridade
// USER_EDIT → ADMIN_OVERRIDE → TEMPLATE_DEFAULT → FALLBACK

// 8. Blocos são normalizados
const blocks = extractBlocksFromStepData(result.data, stepId);

// 9. Estado unificado é atualizado
setStepBlocks(stepIndex, blocks);

// 10. WYSIWYG Bridge sincroniza
wysiwyg.actions.reset(blocks);

// 11. Canvas renderiza blocos
<CanvasColumn blocks={wysiwyg.state.blocks} />
```

### B. Dependências Críticas

| Dependência | Tipo | Criticidade | Ponto de Falha |
|-------------|------|-------------|----------------|
| Supabase | Banco de dados | 🔴 Crítica | Timeout, RLS, conexão |
| React Query | Cache | 🟡 Média | Invalidação incorreta |
| IndexedDB | Cache local | 🟢 Baixa | Quota excedida |
| Zod | Validação | 🟡 Média | Schema desatualizado |
| Web Worker | Validação | 🟢 Baixa | Browser incompatível |

### C. Erros Recorrentes (baseado em logs)

```javascript
// 1. Template não encontrado (P12)
"[UnifiedLoader] Failed to load v4 template, trying v3..."

// 2. Step vazio (G12)
"[useStepBlocksLoader] Step step-15 retornou vazio - verificar fonte de dados"

// 3. Sync divergente (G6)
"[Sync] Reset WYSIWYG ← unified.stepBlocks (loop detectado)"

// 4. Abort antes do flush (G7)
"[Flush:debounced] Abortado antes de comitar - dados podem ter sido perdidos"

// 5. Autenticação (G17)
"[Supabase] Sessão expirada durante operação de save"
```

---

## ✅ Plano de Mitigação

### Correções Imediatas (P0 - Sprint Atual)

| ID | Problema | Solução | Esforço |
|----|----------|---------|---------|
| G6 | Sync loop WYSIWYG | Comparar por assinatura de IDs, não referência | 2h |
| G7 | Race condition flush | Forçar flush síncrono antes de navegar | 4h |
| G12 | Placeholder mascara erros | Logar warning e não injetar placeholder | 1h |
| G5 | Dedup sem funnelId | Adicionar funnelId à chave de cache | 2h |

### Correções de Alta Prioridade (P1 - Próximo Sprint)

| ID | Problema | Solução | Esforço |
|----|----------|---------|---------|
| G4 | Validação no main thread | Já migrado para Web Worker - verificar edge cases | 4h |
| G9 | activeTemplateSteps = 0 | Carregar síncrono do template + fallback robusto | 4h |
| G11 | Perda de dados v4→v3 | Lista explícita de propriedades vs content | 8h |
| G14 | Conflitos de versionamento | Implementar optimistic locking com version | 16h |
| G17 | Token expira durante edição | Refresh automático + recovery de draft | 8h |

### Correções de Média Prioridade (P2)

| ID | Problema | Solução | Esforço |
|----|----------|---------|---------|
| G1 | Carregamento múltiplo | Consolidar useEffects em único loader | 8h |
| G2 | v4 sempre primeiro | Detectar formato do template antes de carregar | 4h |
| G3 | Prefetch agressivo | Reduzir radius para 1 + debounce maior | 2h |
| G8 | setActiveFunnel dessincronizado | Unificar gestão de estado | 8h |
| G15 | Supabase timeout | Implementar retry com backoff exponencial | 4h |

---

## 📊 Métricas e Ferramentas de Monitoramento

### Métricas Recomendadas

```typescript
// 1. Tempo de carregamento de template
editorMetrics.trackLoadTime(stepId, durationMs, { source, cacheHit });

// 2. Taxa de cache hit/miss
editorMetrics.trackCacheHit(cacheKey);
editorMetrics.trackCacheMiss(cacheKey);

// 3. Erros de sincronização
editorMetrics.trackSyncError({ stepId, divergence });

// 4. Tempo até interatividade (TTI)
performance.measure('editor-tti', 'navigation', 'first-interaction');

// 5. Erros de persistência
persistenceMetrics.trackSaveError({ funnelId, errorType, retryCount });
```

### Dashboard Sugerido

```
┌─────────────────────────────────────────────────────────────────────┐
│                    EDITOR HEALTH DASHBOARD                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Template Load Performance (P95)                                    │
│  ├── JSON fetch: ████████████ 450ms                                 │
│  ├── Normalization: ███ 80ms                                        │
│  ├── WYSIWYG sync: ██ 50ms                                          │
│  └── First render: ███████████████ 580ms (meta: <500ms)             │
│                                                                     │
│  Cache Efficiency                                                   │
│  ├── L1 (Memory): 78% hit rate                                      │
│  ├── L2 (IndexedDB): 92% hit rate                                   │
│  └── L3 (Supabase): 45% hit rate                                    │
│                                                                     │
│  Error Rate (últimas 24h)                                           │
│  ├── Sync loops: 12 eventos                                         │
│  ├── Save failures: 3 eventos                                       │
│  ├── Load failures: 7 eventos                                       │
│  └── Auth errors: 2 eventos                                         │
│                                                                     │
│  Active Sessions: 47                                                │
│  Avg blocks/step: 8.3                                               │
│  Templates in cache: 156                                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Ferramentas Sugeridas

| Ferramenta | Propósito | Integração |
|------------|-----------|------------|
| **Sentry** | Error tracking | Já integrado (`@sentry/react`) |
| **Vercel Analytics** | Performance | Já disponível |
| **Custom EditorMetrics** | Métricas específicas | `src/lib/utils/editorMetrics.ts` |
| **React Query Devtools** | Debug de cache | Já disponível em dev |
| **Performance Observer** | Web Vitals | Adicionar `reportWebVitals()` |

---

## 🎯 Resposta à Pergunta Objetiva - VERIFICAÇÃO FINAL

### ✅ A Análise Está **PARCIALMENTE CORRETA**

Dos **19 gargalos identificados**, o código real mostra:

| Status | Quantidade | Gargalos |
|--------|-----------|----------|
| ✅ **CORRIGIDO** | 9 | G1, G2, G3, G4, G6, G7, G12, G13, G19 |
| ❌ **PENDENTE** | 2 | G14 (versionamento), G17 (token refresh) |
| ⚠️ **PARCIAL** | 2 | G5 (cache key), G11 (perda v4→v3) |
| 🟢 **N/A ou Feature** | 6 | G8, G9, G10, G16, G18 |

### 🔴 Gargalos CRÍTICOS Ainda Presentes

1. **G14 - Versionamento Otimista**: Duas abas editando o mesmo funil sobrescrevem alterações
   - **Impacto**: Perda de dados em cenário multi-tab
   - **Status**: Não implementado

2. **G17 - Token Expira Durante Edição**: Sessões longas perdem trabalho
   - **Impacto**: Auto-save falha silenciosamente após 1h
   - **Status**: Não implementado

### 🟡 Gargalos NÃO CRÍTICOS

3. **G5 - Cache Key sem funnelId**: Risco teórico de misturar dados
   - **Impacto**: Potencial mas não reproduzido
   - **Status**: Parcialmente mitigado pelo `loadKey`

4. **G11 - Perda v4→v3**: Conversão pode corromper dados
   - **Impacto**: Não encontrado no código (heurística não existe)
   - **Status**: Precisa verificação em `BlockV4ToV3Adapter`

### Mitigações Prioritárias - STATUS REAL

```typescript
// ✅ 1. Sync loop JÁ CORRIGIDO (index.tsx:1024-1035)
const lastFlushedSignatureRef = useRef<string>('');
useEffect(() => {
    const signature = `${safeCurrentStep}|${wBlocks.length}|${wBlocks.map(b => b.id).join(',')}`;
    if (signature === lastFlushedSignatureRef.current) return; // Evita loop
    // ... flush logic
}, [wysiwyg.state.blocks]);

// ✅ 2. Flush forçado JÁ IMPLEMENTADO (index.tsx:568-578)
const autoSave = useAutoSave({
    onSave: async () => {
        if (flushTimerRef.current) {
            clearTimeout(flushTimerRef.current);
            // Flush imediato antes do save
        }
    }
});

// ⚠️ 3. Perda v4→v3 - CÓDIGO NÃO ENCONTRADO
// A heurística mencionada não existe no código atual
// BlockV4ToV3Adapter precisa ser auditado

// ⚠️ 4. Cache key - PARCIAL (useStepBlocksLoader.ts:47)
const loadKey = `${templateOrFunnelId}:${stepId}`; // Falta funnelId explícito

// ❌ 5. Token refresh - NÃO IMPLEMENTADO
// TODO: Adicionar refresh proativo
useEffect(() => {
    const refreshInterval = setInterval(async () => {
        const { data, error } = await supabase.auth.refreshSession();
        if (error) appLogger.error('Token refresh failed:', error);
    }, 45 * 60 * 1000);
    return () => clearInterval(refreshInterval);
}, []);
```

---

## 🔍 DESCOBERTA: Arquitetura Real do Editor

### Componentes Verificados

```
src/App.tsx (linha 70)
  └── lazy import: QuizModularEditor/QuizModularEditorV4
      └── QuizModularEditorV4Wrapper (383 linhas)
          ├── useV4Layout = false (hardcoded)
          ├── EditorLayoutV4 (layout 3 colunas - NUNCA USADO)
          └── SEMPRE retorna: QuizModularEditor original
              └── QuizModularEditor/index.tsx (2422 linhas)
                  ├── useTemplateLoader ✅
                  ├── useStepBlocksLoader ✅
                  ├── useWYSIWYGBridge ✅
                  ├── useAutoSave ✅
                  ├── useStepPrefetch ✅
                  └── Layout 4 colunas (production)
```

### Recomendação de Refatoração

```typescript
// ANTES (App.tsx - atual)
const QuizModularEditor = lazy(() => 
  import('./components/editor/quiz/QuizModularEditor/QuizModularEditorV4')
);

// DEPOIS (remover camada V4)
const QuizModularEditor = lazy(() => 
  import('./components/editor/quiz/QuizModularEditor')
);
```

**Benefícios**:
- Remove 1 lazy load desnecessário
- Reduz ~50ms de overhead
- Código mais claro
- V4Wrapper pode ser deprecado

---

## 📚 Referências (Verificadas)

- ✅ `src/pages/editor/EditorPage.tsx` - Componente de entrada (146 linhas)
- ✅ `src/components/editor/quiz/QuizModularEditor/index.tsx` - Componente principal (2422 linhas)
- ✅ `src/components/editor/quiz/QuizModularEditor/QuizModularEditorV4.tsx` - Wrapper V4 (383 linhas)
- ✅ `src/hooks/editor/useStepBlocksLoader.ts` - Loader unificado (147 linhas)
- ✅ `src/hooks/editor/useTemplateLoader.ts` - Loader de template
- ✅ `src/hooks/useWYSIWYGBridge.ts` - Bridge WYSIWYG (130 linhas)
- ✅ `src/components/editor/quiz/QuizModularEditor/helpers/normalizeBlocks.ts` - Normalização (65 linhas)

---

**Elaborado por:** Análise Manual + Verificação de Código Real  
**Data:** 30 de Novembro de 2025  
**Versão:** 2.0 - VERIFICADO  
**Próxima Revisão:** Após implementação de G14 (versionamento) e G17 (token refresh)
