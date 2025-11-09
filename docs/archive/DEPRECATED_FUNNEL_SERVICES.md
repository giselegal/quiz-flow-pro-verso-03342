# 🚨 SERVIÇOS DEPRECADOS - FASE 2.2

## Status: DEPRECATED (31/10/2025)

Este documento lista todos os serviços de Funil que foram **DEPRECADOS** e substituídos pelo `CanonicalFunnelService`.

## ✅ NOVO SERVIÇO CANÔNICO

```typescript
import { funnelService } from '@/services/canonical/FunnelService';

// Uso:
const funnel = await funnelService.createFunnel({ name: 'Meu Funil' });
const blocks = await funnelService.getStepBlocks(funnelId, 'step-01');
```

## ❌ SERVIÇOS DEPRECADOS (NÃO USAR)

### 1. FunnelService (v1)
**Arquivo:** `src/services/funnelService.ts`  
**Export:** `funnelApiService`  
**Motivo:** Implementação legada, sem cache, API inconsistente

**Migração:**
```typescript
// ❌ ANTES
import { funnelApiService } from '@/services/funnelService';
const funnel = await funnelApiService.getFunnel(id);

// ✅ DEPOIS
import { funnelService } from '@/services/canonical/FunnelService';
const funnel = await funnelService.getFunnel(id);
```

---

### 2. FunnelServiceRefactored
**Arquivo:** `src/services/funnelService.refactored.ts`  
**Export:** `funnelService` (colisão de nome!)  
**Motivo:** Refatoração incompleta, nunca foi adotada

**Migração:**
```typescript
// ❌ ANTES
import funnelService from '@/services/funnelService.refactored';

// ✅ DEPOIS
import { funnelService } from '@/services/canonical/FunnelService';
```

---

### 3. FunnelUnifiedService
**Arquivo:** `src/services/FunnelUnifiedService.ts`  
**Export:** `funnelUnifiedService`  
**Motivo:** Tentativa de unificação anterior, porém fragmentada

**Migração:**
```typescript
// ❌ ANTES
import { funnelUnifiedService } from '@/services/FunnelUnifiedService';
await funnelUnifiedService.updateFunnel(id, data);

// ✅ DEPOIS
import { funnelService } from '@/services/canonical/FunnelService';
await funnelService.updateFunnel(id, data);
```

---

### 4. EnhancedFunnelService
**Arquivo:** `src/services/EnhancedFunnelService.ts`  
**Export:** `enhancedFunnelService`  
**Motivo:** "Enhanced" features agora estão no canônico

**Migração:**
```typescript
// ❌ ANTES
import { enhancedFunnelService } from '@/services/EnhancedFunnelService';

// ✅ DEPOIS  
import { funnelService } from '@/services/canonical/FunnelService';
```

---

### 5. FunnelConfigPersistenceService
**Arquivo:** `src/services/FunnelConfigPersistenceService.ts`  
**Export:** `funnelConfigPersistenceService`  
**Motivo:** Funcionalidade integrada no canônico

**Migração:**
```typescript
// ❌ ANTES
import { funnelConfigPersistenceService } from '@/services/FunnelConfigPersistenceService';
await funnelConfigPersistenceService.saveFunnelConfig(id, config);

// ✅ DEPOIS
import { funnelService } from '@/services/canonical/FunnelService';
await funnelService.updateFunnel(id, { config });
```

---

### 6. funnelComponentsService
**Arquivo:** `src/services/funnelComponentsService.ts`  
**Export:** `funnelComponentsService`  
**Motivo:** Funcionalidade integrada no canônico

**Migração:**
```typescript
// ❌ ANTES
import { funnelComponentsService } from '@/services/funnelComponentsService';
await funnelComponentsService.bulkSave(funnelId, stepKey, blocks);

// ✅ DEPOIS
import { funnelService } from '@/services/canonical/FunnelService';
await funnelService.saveStepBlocks(funnelId, stepKey, blocks);
```

---

### 7. FunnelTypesRegistry
**Arquivo:** `src/services/FunnelTypesRegistry.ts`  
**Motivo:** Registry desnecessário, tipos definidos no canônico

**Migração:**
```typescript
// ❌ ANTES
import { FunnelTypesRegistry } from '@/services/FunnelTypesRegistry';

// ✅ DEPOIS
import type { FunnelMetadata } from '@/services/canonical/FunnelService';
```

---

### 8. FunnelConfigGenerator
**Arquivo:** `src/services/FunnelConfigGenerator.ts`  
**Motivo:** Geração de config agora é via templates

**Migração:** Use `TemplateService` para gerar configs baseados em templates

---

### 9. FunnelAIAgent
**Arquivo:** `src/services/FunnelAIAgent.ts`  
**Status:** Manter temporariamente (recurso especializado)

---

## 📋 CHECKLIST DE MIGRAÇÃO

### Fase 1: Identificar Imports
```bash
# Buscar imports antigos
grep -r "from '@/services/funnelService'" src/
grep -r "from '@/services/FunnelUnifiedService'" src/
grep -r "from '@/services/EnhancedFunnelService'" src/
```

### Fase 2: Substituir Imports
1. Trocar import
2. Ajustar nomes de métodos (se necessário)
3. Testar funcionalidade
4. Commit incremental

### Fase 3: Arquivar Antigos
Mover para `.archive/services-deprecated-phase2-*`:
- funnelService.ts
- funnelService.refactored.ts
- FunnelUnifiedService.ts
- EnhancedFunnelService.ts
- FunnelConfigPersistenceService.ts
- funnelComponentsService.ts
- FunnelTypesRegistry.ts
- FunnelConfigGenerator.ts

---

## 🎯 BENEFÍCIOS DA MIGRAÇÃO

### Performance
- ✅ Cache híbrido (L1 + L2)
- ✅ Queries otimizadas
- ✅ Batch operations

### Manutenibilidade
- ✅ 1 serviço ao invés de 15+
- ✅ API consistente
- ✅ TypeScript strict
- ✅ Documentação inline

### Confiabilidade
- ✅ Validação de schema
- ✅ Error handling robusto
- ✅ Logging estruturado
- ✅ Testes unitários

---

## 📊 MÉTRICAS

| Métrica | Antes | Depois | Ganho |
|---------|-------|--------|-------|
| Serviços de Funil | 15 | 1 | -93% |
| LOC (Lines of Code) | ~4.500 | ~800 | -82% |
| Import paths | 15+ | 1 | -93% |
| Cache systems | 3 | 1 | -67% |

---

## ⚠️ AVISO

**NÃO DELETAR** arquivos antigos até 100% de migração completa.
Use `@deprecated` JSDoc para marcar imports antigos:

```typescript
/**
 * @deprecated Use CanonicalFunnelService ao invés
 * @see src/services/canonical/FunnelService.ts
 */
export const funnelApiService = { /* ... */ };
```

---

**Última atualização:** 31/10/2025  
**Responsável:** AI Agent - Fase 2 Consolidação
