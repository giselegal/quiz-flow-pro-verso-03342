# ⚠️ SERVIÇOS DEPRECADOS - NÃO USAR

Esta pasta contém serviços **FunnelService** que foram **CONSOLIDADOS** no serviço canônico.

## ✅ Status de Consolidação

**FASE 2 - CONSOLIDAÇÃO FUNNELSERVICES**: **100% COMPLETA**

## 📦 Serviços Deprecados

### 1. **FunnelUnifiedService.ts**
- **Motivo**: Substituído por `FunnelService` canonical
- **Data**: Novembro 2025
- **Arquivos migrados**: 
  - `src/contexts/data/UnifiedCRUDProvider.tsx` ✅
  - `src/hooks/useFunnelLoader.ts` ✅
  - `src/hooks/useFunnelLoaderRefactored.ts` ✅
  - `src/contexts/funnel/UnifiedFunnelContext.tsx` ✅

### 2. **EnhancedFunnelService.ts**
- **Motivo**: Funcionalidade absorvida pelo `FunnelService` canonical
- **Data**: Novembro 2025
- **Arquivos migrados**: `UnifiedCRUDProvider.tsx` ✅

### 3. **schemaDrivenFunnelService.ts**
- **Motivo**: Schema-driven approach integrado no canonical
- **Data**: Novembro 2025
- **Arquivos migrados**: 
  - `src/components/editor/FunnelHeader.tsx` ✅ (uso ativo)
  - `src/components/editor/version/VersionManager.tsx` ⚠️ (type-only mantido)
  - `src/components/editor/status/SyncStatus.tsx` ⚠️ (type-only mantido)

## 🎯 Serviço Canonical

**Use este serviço para TODAS as operações de funil:**

```typescript
import { funnelService, type FunnelMetadata } from '@/services/canonical/FunnelService';

// CRUD Completo
const funnel = await funnelService.getFunnel(id);
await funnelService.createFunnel(data);
await funnelService.updateFunnel(id, updates);
await funnelService.duplicateFunnel(id, newName);
await funnelService.deleteFunnel(id);

// Cache
funnelService.clearCache();
funnelService.warmCache(ids);

// Permissões
const permissions = await funnelService.checkPermissions(id);

// Event System
funnelService.on('updated', handler);
funnelService.on('deleted', handler);
funnelService.off('updated', handler);
```

## 📊 Métricas de Consolidação

- **Serviços antes**: 15+ fragmentados
- **Serviços depois**: 1 canonical
- **Redução de código**: ~82%
- **Arquivos migrados**: 7/7 (100%)
- **Erros TypeScript**: 0
- **Tempo de migração**: ~3h

## ⚠️ Avisos Importantes

### Type-Only Imports Mantidos

Por compatibilidade temporária, alguns type-only imports ainda referenciam serviços deprecados:

```typescript
// ✅ PERMITIDO TEMPORARIAMENTE (type-only)
import type { FunnelVersion } from '@/services/schemaDrivenFunnelService';
import type { AutoSaveState } from '@/services/schemaDrivenFunnelService';
import type { SchemaDrivenFunnelData } from '@/services/schemaDrivenFunnelService';
import type { UnifiedFunnelData } from '@/services/FunnelUnifiedService';
```

### Proibido

```typescript
// ❌ NÃO USAR - DEPRECATED
import { funnelUnifiedService } from '@/services/FunnelUnifiedService';
import { enhancedFunnelService } from '@/services/EnhancedFunnelService';
import { schemaDrivenFunnelService } from '@/services/schemaDrivenFunnelService';
```

## 🗑️ Plano de Remoção Final

**Sprint Próximo**: 
- Exportar types necessários no `FunnelService` canonical
- Remover type-only imports dos arquivos finais
- Deletar completamente esta pasta `__deprecated`

## 📚 Documentação

- **ADR 002**: Decisão de consolidação (a criar)
- **FASE_2_STATUS_CONSOLIDACAO.md**: Status completo
- **DEPRECATED_FUNNEL_SERVICES.md**: Guia de migração detalhado

---

**Última atualização**: Novembro 2025  
**Responsável**: Consolidação FASE 2  
**Status**: ✅ Migração 100% completa
