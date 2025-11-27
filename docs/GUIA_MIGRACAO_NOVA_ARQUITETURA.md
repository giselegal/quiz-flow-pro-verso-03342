# 🔄 Guia de Migração: Integração da Nova Arquitetura

## 📋 Visão Geral

Este guia detalha como migrar o código existente para usar a nova arquitetura otimizada sem quebrar funcionalidades.

---

## 🎯 Estratégia de Migração (Gradual)

### **Fase 1: Preparação (Sem Breaking Changes)**
- ✅ Novos arquivos criados em paralelo
- ✅ Código antigo continua funcionando
- ✅ Testes E2E validam ambas as versões

### **Fase 2: Integração Progressiva (Opt-in)**
- 🔄 Feature flags controlam qual versão usar
- 🔄 Componentes novos coexistem com antigos
- 🔄 Rollback fácil se houver problemas

### **Fase 3: Migração Completa (Deprecation)**
- ⏳ Remover código legado
- ⏳ 100% na nova arquitetura
- ⏳ Documentação atualizada

---

## 🚀 Passo 1: Adicionar Feature Flags

### **1.1. Criar arquivo de configuração**

```typescript
// src/config/featureFlags.ts
export const FEATURE_FLAGS = {
  // 🆕 NOVA ARQUITETURA
  useUnifiedEditorStore: false, // ⚠️ Desabilitado por padrão
  useFunnelCloneService: true,  // ✅ Pode habilitar imediatamente
  useWYSIWYGSync: false,         // ⚠️ Requer teste
  useVirtualization: true,       // ✅ Safe (auto-detecta threshold)
  
  // 🔧 LEGACY (manter temporariamente)
  useLegacyEditor: true,
} as const;

export function getFeatureFlag(flag: keyof typeof FEATURE_FLAGS): boolean {
  // Permitir override via localStorage (dev only)
  if (import.meta.env.DEV) {
    const override = localStorage.getItem(`flag:${flag}`);
    if (override !== null) return override === 'true';
  }
  
  return FEATURE_FLAGS[flag];
}

// Helper para habilitar flag no console
if (import.meta.env.DEV) {
  (window as any).enableFlag = (flag: string) => {
    localStorage.setItem(`flag:${flag}`, 'true');
    console.log(`✅ Feature flag "${flag}" habilitada. Recarregue a página.`);
  };
  
  (window as any).disableFlag = (flag: string) => {
    localStorage.setItem(`flag:${flag}`, 'false');
    console.log(`❌ Feature flag "${flag}" desabilitada. Recarregue a página.`);
  };
}
```

---

## 🔧 Passo 2: Adaptar QuizModularEditor

### **2.1. Adicionar modo híbrido (novo + legado)**

```typescript
// src/components/editor/quiz/QuizModularEditor/index.tsx

import { getFeatureFlag } from '@/config/featureFlags';
import { useUnifiedEditorStore } from '@/features/editor/model/useUnifiedEditorStore';

function QuizModularEditorInner(props: QuizModularEditorProps) {
  // Feature flags
  const useNewArchitecture = getFeatureFlag('useUnifiedEditorStore');
  const useNewCloneService = getFeatureFlag('useFunnelCloneService');
  
  // 🆕 NOVA ARQUITETURA (opt-in)
  const newStore = useUnifiedEditorStore();
  
  // 🔧 LEGADO (fallback)
  const unified = useEditorContext();
  
  // Adapter: usar nova arquitetura se habilitada, senão fallback
  const editorState = useNewArchitecture ? newStore.state : unified.state;
  const commands = useNewArchitecture ? newStore.commands : {
    addBlock: unified.addBlock,
    updateBlock: unified.updateBlock,
    // ... outros comandos
  };
  
  // Exemplo: handler de duplicação
  const handleDuplicate = useCallback(async () => {
    if (useNewCloneService) {
      // 🆕 NOVO SERVIÇO (otimizado)
      const { funnelCloneService } = await import('@/services/funnel/FunnelCloneService');
      
      const result = await funnelCloneService.clone(resourceId!, {
        name: `Cópia de ${editorState.currentFunnel?.name}`,
        asDraft: true,
      });
      
      if (result.success) {
        toast({
          type: 'success',
          title: 'Funil duplicado!',
          message: `${result.stats?.clonedBlocks} blocos clonados em ${result.stats?.durationMs}ms`,
        });
        
        // Redirecionar para funil clonado
        navigate(`/editor/${result.clonedFunnel!.id}`);
      }
    } else {
      // 🔧 LEGADO (manual)
      // ... código antigo de duplicação
    }
  }, [resourceId, useNewCloneService, editorState]);
  
  // ... resto do componente
}
```

### **2.2. Adicionar botão "Duplicar" na toolbar**

```typescript
// src/features/editor/ui/EditorToolbar.tsx (já criado)

// Adicionar propriedade no EditorToolbarProps:
export interface EditorToolbarProps {
  // ... props existentes
  onDuplicate?: () => void; // 🆕 NOVO
}

// Adicionar botão:
<Button
  onClick={onDuplicate}
  variant="outline"
  size="sm"
  className="gap-2"
>
  <Copy className="w-4 h-4" />
  Duplicar
</Button>
```

---

## 🧪 Passo 3: Validar com Testes

### **3.1. Rodar testes E2E de duplicação**

```bash
# Terminal
cd /workspaces/quiz-flow-pro-verso-03342

# Rodar testes de duplicação
npx playwright test tests/e2e/funnel-duplication.spec.ts --project=chromium

# Resultado esperado:
# ✅ 1. Duplicar funil via API
# ✅ 2. Validar normalização de IDs
# ✅ 3. Validar preservação de propriedades
# ✅ 4. Duplicar com transformações
# ✅ 5. Duplicar com filtro de steps
```

### **3.2. Validar no browser (dev mode)**

```javascript
// Console do navegador
enableFlag('useFunnelCloneService');
// ✅ Feature flag "useFunnelCloneService" habilitada. Recarregue a página.

// Recarregar página e testar duplicação
```

---

## 📊 Passo 4: Monitorar Performance

### **4.1. Adicionar métricas de comparação**

```typescript
// src/lib/utils/performanceMonitor.ts

export class PerformanceMonitor {
  private metrics = new Map<string, number[]>();
  
  measure(label: string, fn: () => void | Promise<void>) {
    const start = performance.now();
    const result = fn();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start;
        this.recordMetric(label, duration);
      });
    } else {
      const duration = performance.now() - start;
      this.recordMetric(label, duration);
      return result;
    }
  }
  
  private recordMetric(label: string, duration: number) {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(duration);
    
    // Log apenas em dev
    if (import.meta.env.DEV) {
      console.log(`⏱️ [${label}] ${duration.toFixed(2)}ms`);
    }
  }
  
  getStats(label: string) {
    const values = this.metrics.get(label) || [];
    if (values.length === 0) return null;
    
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return { avg, min, max, count: values.length };
  }
  
  compare(labelA: string, labelB: string) {
    const statsA = this.getStats(labelA);
    const statsB = this.getStats(labelB);
    
    if (!statsA || !statsB) return null;
    
    const improvement = ((statsA.avg - statsB.avg) / statsA.avg) * 100;
    
    console.table({
      [labelA]: { avg: `${statsA.avg.toFixed(2)}ms`, min: `${statsA.min.toFixed(2)}ms`, max: `${statsA.max.toFixed(2)}ms` },
      [labelB]: { avg: `${statsB.avg.toFixed(2)}ms`, min: `${statsB.min.toFixed(2)}ms`, max: `${statsB.max.toFixed(2)}ms` },
      Improvement: `${improvement.toFixed(1)}%`,
    });
  }
}

export const perfMonitor = new PerformanceMonitor();
```

### **4.2. Usar no código**

```typescript
import { perfMonitor } from '@/lib/utils/performanceMonitor';

// Comparar versões legado vs novo
async function testDuplication() {
  // LEGADO
  await perfMonitor.measure('duplication:legacy', async () => {
    // ... código antigo
  });
  
  // NOVO
  await perfMonitor.measure('duplication:new', async () => {
    const result = await funnelCloneService.clone(funnelId);
  });
  
  // Comparar
  perfMonitor.compare('duplication:legacy', 'duplication:new');
  // Resultado esperado: ~90% improvement
}
```

---

## 🔄 Passo 5: Rollout Gradual

### **5.1. Cronograma sugerido**

| Semana | Ação | Feature Flags |
|--------|------|---------------|
| 1 | Deploy em produção (flags OFF) | `useFunnelCloneService: false` |
| 2 | Habilitar para 10% dos usuários | `useFunnelCloneService: true` (10%) |
| 3 | Analisar métricas + feedback | - |
| 4 | Habilitar para 50% | `useFunnelCloneService: true` (50%) |
| 5 | Habilitar para 100% | `useFunnelCloneService: true` (100%) |
| 6+ | Remover código legado | Deprecate old code |

### **5.2. Métricas a monitorar**

```typescript
// Analytics events
analytics.track('funnel_duplicated', {
  method: 'new_service', // ou 'legacy'
  durationMs: result.stats?.durationMs,
  blocksCloned: result.stats?.clonedBlocks,
  success: result.success,
  errorMessage: result.error,
});

// Alertas
if (result.stats?.durationMs > 5000) {
  console.warn('⚠️ Duplicação lenta:', result.stats);
  // Enviar para Sentry
}
```

---

## 🐛 Passo 6: Troubleshooting

### **6.1. Problema: "IDs duplicados após clonagem"**

**Causa:** Normalização de IDs falhou  
**Solução:**

```typescript
// Adicionar validação extra
const result = await funnelCloneService.clone(funnelId);

if (result.success) {
  // Validar IDs únicos
  const allIds = new Set();
  result.clonedFunnel!.steps.forEach(step => {
    step.blocks.forEach(block => {
      if (allIds.has(block.id)) {
        console.error('❌ ID duplicado detectado:', block.id);
        throw new Error('ID duplication detected');
      }
      allIds.add(block.id);
    });
  });
}
```

### **6.2. Problema: "Referências quebradas após clonagem"**

**Causa:** `parentId` ou `linkedBlockId` não foram atualizados  
**Solução:** Verificar se `updateReferencesInObject` está funcionando

```typescript
// Debug: logar referências antes/depois
console.log('Original block:', originalBlock);
console.log('Cloned block:', clonedBlock);
console.log('ID map:', idMap);
```

### **6.3. Problema: "Performance pior que legado"**

**Causa:** Batch insert não está funcionando  
**Solução:** Verificar tamanho do batch

```typescript
// Ajustar batchSize se necessário
const batchSize = 500; // Padrão
// Se Supabase limitar, reduzir para 100
```

---

## ✅ Checklist de Migração

### **Preparação**
- [ ] Criar arquivo de feature flags
- [ ] Adicionar performance monitor
- [ ] Configurar analytics tracking

### **Integração**
- [ ] Adicionar modo híbrido no QuizModularEditor
- [ ] Adicionar botão "Duplicar" na toolbar
- [ ] Implementar handlers com fallback

### **Validação**
- [ ] Rodar testes E2E
- [ ] Testar no browser (dev mode)
- [ ] Comparar métricas de performance

### **Deploy**
- [ ] Deploy em staging (flags OFF)
- [ ] Habilitar para 10% dos usuários
- [ ] Monitorar métricas por 1 semana
- [ ] Rollout gradual (50% → 100%)

### **Limpeza**
- [ ] Remover código legado
- [ ] Atualizar documentação
- [ ] Celebrar 🎉

---

## 🎯 Próximos Passos

Após concluir a migração de `FunnelCloneService`, repetir o processo para:

1. ✅ `UnifiedEditorStore` (substituir `useEditorContext`)
2. ✅ `useWYSIWYGSync` (substituir hook atual)
3. ✅ `VirtualizedBlockList` (substituir renderização atual)

---

## 📞 Suporte

Em caso de dúvidas ou problemas:

1. Verificar logs do console (`appLogger`)
2. Conferir event bus history (`editorEventBus.getHistory()`)
3. Validar feature flags (`localStorage`)
4. Consultar documentação em `/docs/ARQUITETURA_OTIMIZADA_IMPLEMENTACAO.md`

**Boa migração! 🚀**
