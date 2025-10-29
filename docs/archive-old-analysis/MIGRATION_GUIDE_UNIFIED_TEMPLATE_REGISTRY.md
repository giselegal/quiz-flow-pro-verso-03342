# 🔄 GUIA DE MIGRAÇÃO - UnifiedTemplateRegistry

## 📋 ÍNDICE
1. [Visão Geral](#visão-geral)
2. [Migração Rápida](#migração-rápida)
3. [Exemplos Práticos](#exemplos-práticos)
4. [API Completa](#api-completa)
5. [Troubleshooting](#troubleshooting)

---

## 🎯 VISÃO GERAL

O **UnifiedTemplateRegistry** substitui 6 estratégias de template fragmentadas por um sistema unificado com cache L1/L2/L3.

### Antes (❌ Deprecated)
```typescript
import { safeGetTemplateBlocks } from '@/utils/templateConverter';

// Síncrono, sem cache persistente
const blocks = safeGetTemplateBlocks(stepId, template, funnelId);
```

### Depois (✅ Recomendado)
```typescript
import { templateRegistry } from '@/services/UnifiedTemplateRegistry';

// Assíncrono, cache L1/L2/L3
const blocks = await templateRegistry.getStep(stepId);
```

---

## ⚡ MIGRAÇÃO RÁPIDA

### 1. Substituir Imports

**ANTES:**
```typescript
import { 
  safeGetTemplateBlocks, 
  blockComponentsToBlocks,
  convertTemplateToBlocks 
} from '@/utils/templateConverter';
```

**DEPOIS:**
```typescript
import { templateRegistry } from '@/services/UnifiedTemplateRegistry';
import type { Block } from '@/services/UnifiedTemplateRegistry';
```

### 2. Substituir Chamadas Síncronas

**ANTES:**
```typescript
const blocks = safeGetTemplateBlocks(stepId, template, funnelId);
```

**DEPOIS:**
```typescript
const blocks = await templateRegistry.getStep(stepId);
```

### 3. Atualizar Componentes Async

**ANTES:**
```typescript
useEffect(() => {
  const blocks = safeGetTemplateBlocks(stepId, template);
  setBlocks(blocks);
}, [stepId, template]);
```

**DEPOIS:**
```typescript
useEffect(() => {
  let cancelled = false;
  
  templateRegistry.getStep(stepId).then(blocks => {
    if (!cancelled) setBlocks(blocks);
  });
  
  return () => { cancelled = true; };
}, [stepId]);
```

---

## 📚 EXEMPLOS PRÁTICOS

### Exemplo 1: Carregar Step no Mount

```typescript
import { templateRegistry } from '@/services/UnifiedTemplateRegistry';
import { useEffect, useState } from 'react';

function StepEditor({ stepId }: { stepId: string }) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let cancelled = false;
    
    async function load() {
      try {
        setLoading(true);
        const loadedBlocks = await templateRegistry.getStep(stepId);
        if (!cancelled) {
          setBlocks(loadedBlocks);
        }
      } catch (error) {
        console.error('Falha ao carregar step:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    
    load();
    return () => { cancelled = true; };
  }, [stepId]);
  
  if (loading) return <div>Carregando...</div>;
  
  return (
    <div>
      {blocks.map(block => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}
```

### Exemplo 2: Pré-carregar Steps Adjacentes

```typescript
import { templateRegistry } from '@/services/UnifiedTemplateRegistry';

async function preloadAdjacentSteps(currentStepId: string, radius = 2) {
  const stepNumber = parseInt(currentStepId.replace('step-', ''));
  const toPreload: string[] = [];
  
  // Pré-carregar N steps antes e depois
  for (let i = -radius; i <= radius; i++) {
    if (i === 0) continue; // Skip atual
    const targetNumber = stepNumber + i;
    if (targetNumber >= 1 && targetNumber <= 21) {
      toPreload.push(`step-${targetNumber.toString().padStart(2, '0')}`);
    }
  }
  
  // Carregar em paralelo
  await templateRegistry.preload(toPreload);
  console.log(`✅ Pré-carregados ${toPreload.length} steps adjacentes`);
}

// Uso
await preloadAdjacentSteps('step-10', 2); // Carrega steps 8, 9, 11, 12
```

### Exemplo 3: Invalidar Cache ao Salvar

```typescript
import { templateRegistry } from '@/services/UnifiedTemplateRegistry';

async function saveStepBlocks(stepId: string, blocks: Block[]) {
  try {
    // Salvar no backend
    await api.saveStep(stepId, blocks);
    
    // Invalidar cache local
    await templateRegistry.invalidate(stepId);
    
    console.log(`✅ Step ${stepId} salvo e cache invalidado`);
  } catch (error) {
    console.error('Falha ao salvar:', error);
  }
}
```

### Exemplo 4: Monitorar Performance

```typescript
import { templateRegistry } from '@/services/UnifiedTemplateRegistry';

// Em qualquer componente ou hook
useEffect(() => {
  const interval = setInterval(async () => {
    const stats = await templateRegistry.getStats();
    console.log('📊 Template Cache Stats:', {
      hitRate: `${stats.hitRate.toFixed(1)}%`,
      l1Size: stats.l1Size,
      l2Size: stats.l2Size,
      memoryUsage: `${(stats.memoryUsage / 1024).toFixed(1)} KB`
    });
  }, 10000); // A cada 10s
  
  return () => clearInterval(interval);
}, []);
```

### Exemplo 5: Build-time Templates

```typescript
// No seu CI/CD ou script de build
import { exec } from 'child_process';

// 1. Gerar templates embedded
exec('npm run build:templates', (error, stdout) => {
  if (error) {
    console.error('❌ Falha no build:templates:', error);
    process.exit(1);
  }
  console.log(stdout);
});

// 2. Build da aplicação
exec('npm run build', (error, stdout) => {
  if (error) {
    console.error('❌ Falha no build:', error);
    process.exit(1);
  }
  console.log(stdout);
});
```

---

## 📖 API COMPLETA

### `templateRegistry.getStep(stepId: string): Promise<Block[]>`

Carrega step com cache L1/L2/L3 automático.

**Parâmetros:**
- `stepId` (string): ID do step (ex: `'step-01'`)

**Retorna:** `Promise<Block[]>` - Array de blocos

**Exemplo:**
```typescript
const blocks = await templateRegistry.getStep('step-01');
```

---

### `templateRegistry.preload(stepIds: string[]): Promise<void>`

Pré-carrega múltiplos steps em paralelo.

**Parâmetros:**
- `stepIds` (string[]): Array de IDs (ex: `['step-01', 'step-02']`)

**Retorna:** `Promise<void>`

**Exemplo:**
```typescript
await templateRegistry.preload(['step-01', 'step-02', 'step-03']);
```

---

### `templateRegistry.invalidate(stepId: string): Promise<void>`

Invalida cache de um step específico (L1 e L2).

**Parâmetros:**
- `stepId` (string): ID do step

**Retorna:** `Promise<void>`

**Exemplo:**
```typescript
await templateRegistry.invalidate('step-01');
```

---

### `templateRegistry.clearAll(): Promise<void>`

Limpa todos os caches (L1 e L2).

**Retorna:** `Promise<void>`

**Exemplo:**
```typescript
await templateRegistry.clearAll();
```

---

### `templateRegistry.getStats(): Promise<CacheStats>`

Retorna estatísticas detalhadas do cache.

**Retorna:** `Promise<CacheStats>`
```typescript
interface CacheStats {
  l1Size: number;       // Entradas em L1 (memory)
  l2Size: number;       // Entradas em L2 (IndexedDB)
  hitRate: number;      // Taxa de acerto (0-100%)
  memoryUsage: number;  // Uso de memória (bytes)
  totalHits: number;    // Total de hits
  totalMisses: number;  // Total de misses
}
```

**Exemplo:**
```typescript
const stats = await templateRegistry.getStats();
console.log(`Hit rate: ${stats.hitRate.toFixed(1)}%`);
```

---

### `templateRegistry.logDebugInfo(): Promise<void>`

Imprime log detalhado no console (debug).

**Retorna:** `Promise<void>`

**Exemplo:**
```typescript
await templateRegistry.logDebugInfo();
```

---

## 🔍 TROUBLESHOOTING

### Problema: "Template não carrega no primeiro acesso"

**Causa:** L3 (build-time) não foi gerado.

**Solução:**
```bash
npm run build:templates
npm run dev
```

---

### Problema: "Cache hit rate baixo (<50%)"

**Causa:** Chaves de step inconsistentes (`step-1` vs `step-01`).

**Solução:** Sempre normalizar:
```typescript
const stepId = `step-${stepNumber.toString().padStart(2, '0')}`;
```

---

### Problema: "IndexedDB não funciona em incognito"

**Causa:** Navegadores bloqueiam IndexedDB em modo privado.

**Solução:** O registry faz fallback gracioso para L1 (memory) + L3 (embedded).

---

### Problema: "Templates desatualizados após deploy"

**Causa:** L2 (IndexedDB) tem TTL de 7 dias.

**Soluções:**
1. Incrementar versão do cache em `UnifiedTemplateRegistry.ts`:
```typescript
private readonly CACHE_VERSION = '1.0.1'; // Incrementar
```

2. Limpar cache programaticamente:
```typescript
await templateRegistry.clearAll();
```

3. Limpar manualmente (DevTools):
   - Application → IndexedDB → quiz-templates-cache → Delete

---

### Problema: "Erro 'Cannot find module @templates/embedded'"

**Causa:** Build-time templates não foi executado.

**Solução:**
```bash
npm run build:templates
```

Adicionar ao CI/CD:
```yaml
# .github/workflows/build.yml
- name: Generate templates
  run: npm run build:templates
  
- name: Build app
  run: npm run build
```

---

## 🚦 CHECKLIST DE MIGRAÇÃO

Use este checklist para garantir migração completa:

- [ ] Substituir imports de `templateConverter` por `UnifiedTemplateRegistry`
- [ ] Converter chamadas síncronas para assíncronas (`await`)
- [ ] Atualizar useEffects com cleanup apropriado
- [ ] Remover parâmetros `template` e `funnelId` (não são mais necessários)
- [ ] Adicionar `npm run build:templates` ao pipeline de build
- [ ] Testar cache L1/L2/L3 em dev
- [ ] Validar performance (hit rate >85%)
- [ ] Monitorar erros no Sentry/console
- [ ] Documentar mudanças no código

---

## 📞 SUPORTE

### Debug no Console do Navegador

```javascript
// Verificar estatísticas
import { templateRegistry } from '@/services/UnifiedTemplateRegistry';
await templateRegistry.logDebugInfo();

// Limpar cache (se necessário)
await templateRegistry.clearAll();

// Forçar reload de um step
await templateRegistry.invalidate('step-01');
const fresh = await templateRegistry.getStep('step-01');
```

### Logs Úteis

Procurar por estes prefixos no console:
- `⚡ L1 HIT` - Cache memory (rápido)
- `💾 L2 HIT` - Cache IndexedDB (médio)
- `📦 L3 HIT` - Build-time embedded (rápido)
- `❌ MISS` - Carregando do servidor (lento)

---

## 🎯 PRÓXIMOS PASSOS

Após migrar seu código:

1. **Testar localmente**
   ```bash
   npm run build:templates
   npm run dev
   # Abrir http://localhost:5173/editor?template=quiz21StepsComplete
   ```

2. **Validar performance**
   ```javascript
   await templateRegistry.logDebugInfo();
   // Hit rate deve ser >85%
   ```

3. **Remover código deprecated**
   - Após confirmar zero uso de `safeGetTemplateBlocks`
   - Deletar `/src/utils/templateConverter.ts`
   - Deletar `/src/utils/templateConverterAdapter.ts`

4. **Comunicar equipe**
   - Atualizar documentação interna
   - Notificar sobre novo fluxo de build

---

**Última atualização:** 2024-10-23 01:05 UTC  
**Versão:** 1.0.0  
**Autor:** GitHub Copilot Agent
