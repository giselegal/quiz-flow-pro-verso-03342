# 📊 Análise Arquitetural - Endpoint `/editor` para Edição de Modelos JSON

**Data:** 30 de Novembro de 2025  
**Versão:** 1.0  
**Escopo:** Análise completa do fluxo de dados, gargalos e soluções para o endpoint `/editor`

---

## 📋 Resumo Executivo

Este documento apresenta uma análise arquitetural completa do endpoint `/editor` responsável pela edição de modelos de funções em formato JSON. A análise aborda:

1. **Fluxo de dados** desde a chamada do endpoint até a manipulação de JSON
2. **Dependências críticas** e pontos de falha
3. **Problemas de desempenho**, timeout e concorrência
4. **Logs e erros** recorrentes
5. **Limitações** frontend e backend
6. **Métricas e ferramentas** de monitoramento sugeridas

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

## 🚨 Gargalos e Limitações Identificados

### 1. Gargalos de CARREGAMENTO

| ID | Gargalo | Impacto | Causa Raiz | Severidade |
|----|---------|---------|------------|------------|
| G1 | Carregamento múltiplo do mesmo step | +300-500ms latência | 3 useEffects carregam mesmo template simultaneamente | 🔴 Alta |
| G2 | v4 JSON sempre carregado primeiro | +100-200ms | Template v4 (~150KB) carregado mesmo quando v3 seria suficiente | 🟡 Média |
| G3 | Prefetch agressivo | Consumo de banda | Prefetch de N+2 steps mesmo em navegação rápida | 🟡 Média |
| G4 | Validação no main thread | UI freeze 2-5s | Validação de templates grandes bloqueia renderização | 🔴 Alta |
| G5 | Falta de deduplicação por funnelId | Dados incorretos | Cache key não inclui funnelId, retornando dados de outro funil | 🔴 Alta |

### 2. Gargalos de SINCRONIZAÇÃO

| ID | Gargalo | Impacto | Causa Raiz | Severidade |
|----|---------|---------|------------|------------|
| G6 | Sync loop WYSIWYG | Loop infinito | Comparação de referência ao invés de conteúdo | 🔴 Crítica |
| G7 | Race condition no flush | Perda de dados | Navegação rápida entre steps antes do flush debounced | 🔴 Crítica |
| G8 | setActiveFunnel não sincronizado | Estado inconsistente | Funnel ativo no service ≠ funnel no componente | 🟡 Média |
| G9 | activeTemplateSteps = 0 | Navegação quebrada | Template preparado mas steps não contabilizados | 🔴 Alta |

### 3. Gargalos de SERIALIZAÇÃO/DESERIALIZAÇÃO JSON

| ID | Gargalo | Impacto | Causa Raiz | Severidade |
|----|---------|---------|------------|------------|
| G10 | 3 formatos de normalização | Inconsistência | extractBlocksFromStepData tenta 3 formatos diferentes | 🟡 Média |
| G11 | Perda de dados v4→v3 | Corrupção | Heurística de separação properties/content baseada em tamanho | 🔴 Alta |
| G12 | Placeholder mascara erros | Debug difícil | Quando loader retorna vazio, placeholder é injetado silenciosamente | 🟡 Média |

### 4. Gargalos de PERSISTÊNCIA

| ID | Gargalo | Impacto | Causa Raiz | Severidade |
|----|---------|---------|------------|------------|
| G13 | Auto-save não distingue hash | Writes redundantes | Saves disparados mesmo quando conteúdo não mudou | 🟡 Média |
| G14 | Falta de versionamento otimista | Conflitos | Duas abas editando mesmo funil sobrescrevem alterações | 🔴 Alta |
| G15 | Supabase timeout | Erro silencioso | RPC batch_update_steps sem retry adequado | 🟡 Média |

### 5. Gargalos de AUTENTICAÇÃO/PERMISSÕES

| ID | Gargalo | Impacto | Causa Raiz | Severidade |
|----|---------|---------|------------|------------|
| G16 | RLS não verificado no frontend | Erro genérico | Usuário sem permissão vê "Erro ao carregar" | 🟡 Média |
| G17 | Token expirado durante edição | Perda de trabalho | Sessão expira após 1h, auto-save falha silenciosamente | 🔴 Alta |

### 6. Gargalos de CONCORRÊNCIA

| ID | Gargalo | Impacto | Causa Raiz | Severidade |
|----|---------|---------|------------|------------|
| G18 | WebSocket não implementado para edição | Edição offline | Live update funciona apenas para preview, não para co-edição | 🟢 Baixa |
| G19 | Abort controller timing | Flash de estado | setStepLoading(false) executa após abort | 🟡 Média |

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

## 🎯 Resposta à Pergunta Objetiva

### Principais Gargalos que Impedem o Funcionamento do `/editor`

1. **🔴 Sync Loop WYSIWYG (G6)**: Comparação por referência causa loops infinitos que travam o editor.

2. **🔴 Race Condition no Flush (G7)**: Navegação rápida entre steps pode perder edições não salvas.

3. **🔴 Perda de Dados v4→v3 (G11)**: Heurística de conversão corrompe propriedades longas.

4. **🔴 Cache Key Incompleta (G5)**: Dados de funis diferentes podem ser misturados no cache.

5. **🔴 Token Expira Durante Edição (G17)**: Sessões longas resultam em perda de trabalho.

### Mitigações Prioritárias

```typescript
// 1. Corrigir sync loop (G6)
useEffect(() => {
    const unifiedSig = blocks.map(b => b.id).join(',');
    const currentSig = wysiwyg.state.blocks.map(b => b.id).join(',');
    if (unifiedSig !== currentSig) {
        wysiwyg.actions.reset(blocks);
    }
}, [blocks]);

// 2. Forçar flush antes de navegar (G7)
const handleSelectStep = async (stepKey: string) => {
    if (flushTimerRef.current) {
        await flushImmediately();
    }
    setCurrentStep(extractStepNumber(stepKey));
};

// 3. Lista explícita de propriedades (G11)
const KNOWN_PROPERTIES = ['fontSize', 'color', 'alignment', ...];
const isProperty = (key: string) => KNOWN_PROPERTIES.includes(key);

// 4. Cache key com funnelId (G5)
const loadKey = `${stepId}-${templateId}-${funnelId}`;

// 5. Refresh de token proativo (G17)
useEffect(() => {
    const refreshInterval = setInterval(async () => {
        await supabase.auth.refreshSession();
    }, 45 * 60 * 1000); // 45 minutos
    return () => clearInterval(refreshInterval);
}, []);
```

---

## 📚 Referências

- `AUDITORIA_EDITOR_ROUTE.md` - Auditoria detalhada de 29/Nov/2025
- `src/pages/editor/EditorPage.tsx` - Componente de entrada
- `src/components/editor/quiz/QuizModularEditor/index.tsx` - Componente principal
- `src/services/canonical/TemplateService.ts` - Serviço canônico
- `src/hooks/editor/useStepBlocksLoader.ts` - Loader de blocos

---

**Elaborado por:** Análise Automatizada  
**Data:** 30 de Novembro de 2025  
**Próxima Revisão:** Após implementação das mitigações P0
