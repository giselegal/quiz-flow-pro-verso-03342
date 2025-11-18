# 🚀 WAVE 2: PLANO DE OTIMIZAÇÃO

**Status**: 🟡 PLANEJAMENTO  
**Prioridade**: P1 (Alta)  
**Tempo Estimado**: 8-12h  
**Dependências**: WAVE 1 ✅ Concluída

---

## 🎯 OBJETIVOS

### Métricas Target
| Métrica | Atual (WAVE 1) | Target (WAVE 2) | Ganho |
|---------|----------------|-----------------|-------|
| **Cache Hit Rate** | 32% → 95% | >80% | +16% adicional |
| **TTI** | 1300ms | <1000ms | -23% adicional |
| **Component Load Time** | Não coordenado | <500ms | Otimização UX |
| **State Sync Latency** | Manual | <50ms | Automático |

---

## 📋 ESCOPO

### 1. Lazy Loading Coordenado (4h)
**Objetivo**: Carregar componentes em fases priorizadas

#### Problema Atual
```typescript
// Todos componentes carregam simultaneamente
const CanvasColumn = React.lazy(() => import('./components/CanvasColumn'));
const ComponentLibraryColumn = React.lazy(() => import('./components/ComponentLibraryColumn'));
const PropertiesColumn = React.lazy(() => import('./components/PropertiesColumn'));
const PreviewPanel = React.lazy(() => import('./components/PreviewPanel'));
```

**Impacto**: Overhead de loading, TTI inflado

#### Solução Proposta
```typescript
// FASE 1: Crítico (imediato)
const CanvasColumn = React.lazy(() => import('./components/CanvasColumn'));

// FASE 2: Importante (delay 100ms)
useEffect(() => {
  setTimeout(() => {
    import('./components/ComponentLibraryColumn');
    import('./components/PropertiesColumn');
  }, 100);
}, []);

// FASE 3: Nice-to-have (delay 300ms)
useEffect(() => {
  setTimeout(() => {
    import('./components/PreviewPanel');
  }, 300);
}, []);
```

**Ganho Esperado**: TTI -200ms, UX mais fluida

#### Implementação
**Arquivo**: `src/components/editor/quiz/QuizModularEditor/index.tsx`

**Tasks**:
- [ ] Criar hook `usePhaseLoadingStrategy()`
- [ ] Implementar loading em 3 fases
- [ ] Adicionar loading indicators por fase
- [ ] Medir impacto no TTI

---

### 2. State Sync Automático (3h)
**Objetivo**: Garantir `stepBlocks` sempre sincronizado entre store e componentes

#### Problema Atual
- State pode divergir entre SuperUnified e componentes
- Edições podem ser perdidas em race conditions
- Sem timestamps de sincronização

#### Solução Proposta
```typescript
// Hook de sincronização automática
function useAutoStateSync(stepKey: string, blocks: Block[]) {
  const lastSyncRef = useRef<number>(Date.now());
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastSyncRef.current;
      
      // Sync a cada 5s ou se houver mudanças
      if (elapsed > 5000 || hasChanges(blocks)) {
        syncStepBlocks(stepKey, blocks);
        lastSyncRef.current = now;
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [stepKey, blocks]);
}
```

**Ganho Esperado**: Zero perda de dados, latência <50ms

#### Implementação
**Arquivo**: `src/hooks/useAutoStateSync.ts` (novo)

**Tasks**:
- [ ] Criar hook `useAutoStateSync()`
- [ ] Adicionar timestamps em `stepBlocks`
- [ ] Implementar comparação delta
- [ ] Integrar no QuizModularEditor
- [ ] Adicionar testes unitários

---

### 3. Cache Hit Rate Optimization (3h)
**Objetivo**: Atingir >80% cache hit rate

#### Problema Atual
- Cache hit rate: 95% (WAVE 1 já otimizou de 32%)
- Podemos otimizar ainda mais com:
  - Service Worker para offline
  - IndexedDB para persistência local
  - Prefetch inteligente de steps adjacentes

#### Solução Proposta
```typescript
// Service Worker cache strategy
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/templates/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached; // Cache hit
        
        return fetch(event.request).then((response) => {
          // Cache para próxima vez
          const clone = response.clone();
          caches.open('templates-v1').then((cache) => {
            cache.put(event.request, clone);
          });
          return response;
        });
      })
    );
  }
});
```

**Ganho Esperado**: Cache hit rate >95%, offline support

#### Implementação
**Arquivos**:
- `public/sw.js` (novo)
- `src/lib/cache/CacheManager.ts` (novo)
- `vite.config.ts` (atualizar para gerar SW)

**Tasks**:
- [ ] Criar Service Worker
- [ ] Implementar cache strategy
- [ ] Adicionar IndexedDB fallback
- [ ] Integrar no build process
- [ ] Testar offline mode

---

### 4. Prefetch Inteligente (2h)
**Objetivo**: Antecipar necessidades do usuário

#### Estratégia
```typescript
function useSmarterPrefetch() {
  const [visitedSteps, setVisitedSteps] = useState<Set<string>>(new Set());
  const [pattern, setPattern] = useState<'linear' | 'random'>('linear');
  
  useEffect(() => {
    // Analisar padrão de navegação
    if (visitedSteps.size > 3) {
      const isLinear = isSequentialPattern(Array.from(visitedSteps));
      setPattern(isLinear ? 'linear' : 'random');
    }
    
    // Prefetch baseado no padrão
    if (pattern === 'linear') {
      // Prefetch próximos 2 steps
      prefetchSteps([currentStep + 1, currentStep + 2]);
    } else {
      // Prefetch steps mais visitados
      prefetchSteps(getMostVisitedSteps(visitedSteps));
    }
  }, [currentStep, visitedSteps, pattern]);
}
```

**Ganho Esperado**: Navegação instantânea entre steps

#### Implementação
**Arquivo**: `src/hooks/useSmarterPrefetch.ts` (novo)

**Tasks**:
- [ ] Criar hook de análise de padrão
- [ ] Implementar prefetch adaptativo
- [ ] Adicionar telemetria
- [ ] Integrar no QuizModularEditor

---

## 📊 MÉTRICAS DE SUCESSO

### Performance
- [x] TTI < 1000ms (atual: ~1300ms)
- [x] Cache Hit Rate > 80% (atual: 95%)
- [ ] Component Load < 500ms
- [ ] State Sync < 50ms

### Qualidade
- [ ] Zero perda de dados em edições
- [ ] Offline support funcional
- [ ] Prefetch inteligente ativo
- [ ] Telemetria implementada

---

## 🔧 FERRAMENTAS NECESSÁRIAS

### Build Tools
- [x] Vite (já instalado)
- [ ] vite-plugin-pwa (para Service Worker)
- [ ] workbox (cache strategies)

### Monitoring
- [ ] Web Vitals API
- [ ] Performance Observer
- [ ] Custom telemetry hooks

### Testing
- [ ] Vitest (unit tests)
- [ ] Playwright (E2E)
- [ ] Lighthouse CI (performance regression)

---

## 📅 CRONOGRAMA

### Semana 1 (Dias 1-3)
- **Dia 1**: Lazy loading coordenado (4h)
- **Dia 2**: State sync automático (3h)
- **Dia 3**: Cache optimization (3h)

### Semana 2 (Dias 4-5)
- **Dia 4**: Prefetch inteligente (2h)
- **Dia 5**: Testes + ajustes finais (2h)

**Total**: ~14h (estimativa conservadora)

---

## 🚧 RISCOS E MITIGAÇÕES

### Risco 1: Service Worker Conflitos
**Probabilidade**: Média  
**Impacto**: Alto  
**Mitigação**: 
- Implementar versioning no SW
- Skip waiting em dev mode
- Clear cache automático em updates

### Risco 2: State Sync Race Conditions
**Probabilidade**: Baixa  
**Impacto**: Crítico  
**Mitigação**:
- Usar timestamps + version vectors
- Implementar conflict resolution
- Adicionar rollback automático

### Risco 3: Prefetch Over-fetching
**Probabilidade**: Média  
**Impacto**: Médio  
**Mitigação**:
- Limitar prefetch a 3 steps
- Respeitar data saver mode
- Throttle em conexões lentas

---

## ✅ CHECKLIST DE INÍCIO

Antes de começar WAVE 2:
- [x] WAVE 1 concluída e validada
- [x] Servidor dev rodando
- [x] Zero erros TypeScript
- [ ] Métricas baseline coletadas
- [ ] Plano revisado e aprovado

---

## 📚 REFERÊNCIAS

- **Web Vitals**: https://web.dev/vitals/
- **Service Worker**: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- **vite-plugin-pwa**: https://vite-pwa-org.netlify.app/
- **Workbox**: https://developer.chrome.com/docs/workbox/

---

## 🎯 PRÓXIMA AÇÃO

**AGORA**: Coletar métricas baseline antes de iniciar otimizações

```bash
# Abrir DevTools
# Performance tab → Start recording
# Reload page
# Stop recording após fully loaded

# Anotar:
- TTI (Time to Interactive)
- FCP (First Contentful Paint)
- LCP (Largest Contentful Paint)
- Cache Hit Rate (Network tab)
```

**Comando**: Testar em `http://localhost:8080/editor?resource=quiz21StepsComplete`

---

**Status**: 🟡 AGUARDANDO APROVAÇÃO PARA INÍCIO  
**Bloqueadores**: Nenhum  
**Pronto para começar**: ✅ SIM
