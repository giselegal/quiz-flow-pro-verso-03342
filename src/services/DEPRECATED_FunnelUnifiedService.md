# ⚠️ DEPRECATED: FunnelUnifiedService

**Status**: DEPRECATED - Migrar para `FunnelService` canônico  
**Data de Deprecação**: 2025-10-31  
**Remoção Planejada**: 2025-12-01

## 🔄 Migração

### ANTES (Deprecated)
```typescript
import { funnelUnifiedService } from '@/services/FunnelUnifiedService';

const funnel = await funnelUnifiedService.getFunnel(id);
const newFunnel = await funnelUnifiedService.createFunnel(data);
```

### DEPOIS (Canônico)
```typescript
import { funnelService } from '@/services/canonical/FunnelService';

const funnel = await funnelService.getFunnel(id);
const newFunnel = await funnelService.createFunnel(data);
```

## 📋 API Equivalente

| FunnelUnifiedService | FunnelService (Canônico) |
|---------------------|-------------------------|
| `getFunnel(id)` | `getFunnel(id)` |
| `createFunnel(data)` | `createFunnel(data)` |
| `updateFunnel(id, data)` | `updateFunnel(id, data)` |
| `deleteFunnel(id)` | `deleteFunnel(id)` |
| `listFunnels(filter)` | `listFunnels(filter)` |
| `duplicateFunnel(id, name)` | `duplicateFunnel(id, name)` |
| `clearCache()` | `clearCache()` |

## 🎯 Arquivos a Migrar

- [ ] `src/contexts/funnel/UnifiedFunnelContext.tsx`
- [ ] `src/contexts/funnel/UnifiedFunnelContextRefactored.tsx`
- [ ] `src/contexts/data/UnifiedCRUDProvider.tsx`
- [ ] `src/pages/IndexedDBMigrationTestPage.tsx`
- [ ] Outros 15+ arquivos

## 📊 Benefícios da Migração

- ✅ -3.5MB de código redundante eliminado
- ✅ API unificada e consistente
- ✅ Cache otimizado (L1/L2/L3)
- ✅ Melhor manutenibilidade
- ✅ Type safety aprimorado
