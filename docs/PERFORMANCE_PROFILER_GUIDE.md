# 🎯 Performance Profiler - Guia de Uso

Sistema de monitoramento de performance para medir re-renders, operações críticas e identificar gargalos no Quiz Flow Pro Editor.

## 📦 Instalação

O profiler já está integrado automaticamente no editor. Apenas certifique-se de estar em modo DEV:

```bash
npm run dev
```

## 🚀 Uso Básico

### 1. Console do Navegador

O profiler é exposto globalmente em `window.__performanceProfiler`:

```javascript
// Ver relatório completo
window.__performanceProfiler.generateReport()

// Contagem de renders de um componente
window.__performanceProfiler.getRenderCount('QuizModularProductionEditor')

// Métricas de operações
window.__performanceProfiler.getMetricsByCategory('operation')

// Exportar dados (para análise externa)
copy(window.__performanceProfiler.getAllMetrics())

// Limpar dados
window.__performanceProfiler.clear()

// Resetar contagem de renders
window.__performanceProfiler.resetRenderCounts()
```

### 2. Script de Análise Automatizada

Use o script fornecido para análise completa:

```bash
# 1. Abra o editor no navegador
open http://localhost:5173/editor

# 2. Interaja com o editor:
#    - Adicione blocks
#    - Faça drag & drop
#    - Salve o funil
#    - Navegue entre steps

# 3. Abra o console e execute:
```

Copie e cole o conteúdo de `scripts/performance-analysis.ts` no console.

## 📊 Métricas Coletadas

### Renders
Contagem de quantas vezes cada componente renderizou:

```javascript
window.__performanceProfiler.getRenderCount('QuizModularProductionEditor')
// Output: 15 renders
```

**Componentes monitorados:**
- `QuizModularProductionEditor` - Editor principal
- `TitleBlock`, `ImageBlock`, `ButtonBlock` - Blocks individuais
- E todos os outros 11 componentes com React.memo

### Operações
Tempo de execução de operações críticas:

```javascript
window.__performanceProfiler.getMetricsByCategory('operation')
```

**Operações monitoradas:**
- `handleDragEnd` - Drag & drop de blocks
- `handleSave` - Salvar funil
- `handleUndo/Redo` - Histórico

### Exemplo de Output

```
📊 Performance Report
==================================================

🔄 Renders:
  - QuizModularProductionEditor: 12 renders
  - TitleBlock: 3 renders
  - ImageBlock: 2 renders
  - ButtonBlock: 5 renders

⚙️ OPERATION:
  Total: 245.32ms | Avg: 61.33ms | Count: 4
    - handleDragEnd: 85.12ms
    - handleSave: 123.45ms
    - handleUndo: 18.25ms
    - handleRedo: 18.50ms
```

## 🎯 Como Interpretar Resultados

### Re-renders Aceitáveis

| Componente | Renders Aceitáveis | Action Needed |
|------------|-------------------|---------------|
| Editor Principal | < 20 | ✅ Excelente |
| Editor Principal | 20-50 | ⚠️ Monitorar |
| Editor Principal | > 50 | 🔴 Otimizar |
| Blocks Individuais | < 5 por interação | ✅ Ótimo |
| Blocks Individuais | 5-10 | ⚠️ React.memo funcionando? |
| Blocks Individuais | > 10 | 🔴 Investigar props |

### Operações Críticas

| Operação | Tempo Aceitável | Action Needed |
|----------|----------------|---------------|
| handleDragEnd | < 50ms | ✅ Fluido |
| handleDragEnd | 50-100ms | ⚠️ Perceptível |
| handleDragEnd | > 100ms | 🔴 Otimizar |
| handleSave | < 200ms | ✅ Rápido |
| handleSave | 200-500ms | ⚠️ OK com feedback |
| handleSave | > 500ms | 🔴 Muito lento |

## 🔧 Debugging de Re-renders

### 1. Identificar Componente Problemático

```javascript
// Qual componente renderiza mais?
const report = window.__performanceProfiler.generateReport()
// Procure por contagens altas
```

### 2. Verificar Props

Se um block com React.memo renderiza muito:

```javascript
// No código do componente, adicione:
performanceProfiler.trackRender('NomeDoComponente', { 
  propKey1: props.propKey1,
  propKey2: props.propKey2 
});
```

### 3. Validar useMemo/useCallback

Se o editor principal renderiza muito, verifique:
- Callbacks estão usando `useCallback`?
- Computações pesadas usam `useMemo`?
- Dependências estão corretas?

## 🧪 Testes de Performance

### Cenário 1: Adicionar Block

```
1. Limpar métricas: window.__performanceProfiler.clear()
2. Adicionar 1 block via drag & drop
3. Verificar: window.__performanceProfiler.getRenderCount('QuizModularProductionEditor')
   Esperado: 2-3 renders (inicial + após add)
```

### Cenário 2: Navegar Entre Steps

```
1. Limpar métricas
2. Clicar em 5 steps diferentes
3. Verificar render count
   Esperado: 5-7 renders (1-2 por navegação)
```

### Cenário 3: Drag & Drop Performance

```
1. Limpar métricas
2. Arrastar block e soltar
3. Verificar: window.__performanceProfiler.getMetricsByCategory('operation')
   Esperado: handleDragEnd < 50ms
```

## 📈 Análise Avançada

### Exportar para CSV

```javascript
const metrics = window.__performanceProfiler.getAllMetrics();
const csv = metrics.map(m => 
  `${m.name},${m.category},${m.duration},${m.startTime}`
).join('\n');
console.log('name,category,duration,startTime\n' + csv);
```

### Comparar Antes/Depois

```javascript
// Antes da otimização
window.__performanceProfiler.clear();
// ... interagir com editor ...
const before = window.__performanceProfiler.getAllMetrics();
localStorage.setItem('perf_before', JSON.stringify(before));

// Depois da otimização
window.__performanceProfiler.clear();
// ... mesmas interações ...
const after = window.__performanceProfiler.getAllMetrics();
const before = JSON.parse(localStorage.getItem('perf_before'));

// Comparar
console.log('Melhoria:', 
  (before[0].duration - after[0].duration) / before[0].duration * 100 + '%'
);
```

## 🚨 Troubleshooting

### Profiler não encontrado

**Erro:** `window.__performanceProfiler is undefined`

**Solução:** 
- Certifique-se de estar em modo DEV
- Verifique se `VITE_ENABLE_PROFILING=true` no `.env`
- Recarregue a página

### Métricas vazias

**Problema:** `getAllMetrics()` retorna array vazio

**Solução:**
- Interaja com o editor antes de consultar métricas
- Verifique se operações estão sendo medidas (adicionar `performanceProfiler.start/end`)

### Muitos re-renders

**Problema:** Componente renderiza 50+ vezes

**Causa comum:**
- Objetos/arrays criados inline nas props
- useCallback/useMemo faltando
- Dependências incorretas

**Debug:**
```javascript
// Adicionar no componente:
useEffect(() => {
  console.log('Render causado por:', props);
}, [props]);
```

## 📚 Referências

- [React Profiler API](https://react.dev/reference/react/Profiler)
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)

## 🤝 Contribuindo

Para adicionar novas métricas:

```typescript
// Em qualquer componente/função
import { performanceProfiler } from '@/utils/performanceProfiler';

// Medir operação síncrona
performanceProfiler.measure('minhaOperacao', () => {
  // código aqui
}, 'operation'); // categoria: 'render' | 'operation' | 'api' | 'cache'

// Medir operação assíncrona
await performanceProfiler.measureAsync('minhaAPI', async () => {
  return await fetch('/api/data');
}, 'api');
```

---

**Versão:** 1.0.0  
**Última atualização:** 2025-10-31  
**Compatibilidade:** React 18+, Vite 7+
