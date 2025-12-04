# 🎯 Services Consolidation - Phase 4

## Architecture Overview

All services have been consolidated into canonical implementations located in `src/services/canonical/`.

## Canonical Services (12 Total)

| Service | File | Description |
|---------|------|-------------|
| `cacheService` | `CacheService.ts` | Multi-layer cache (L1+L2+L3) |
| `templateService` | `TemplateService.ts` | Template loading and management |
| `funnelService` | `FunnelService.ts` | Funnel CRUD operations |
| `dataService` | `DataService.ts` | Generic data operations |
| `validationService` | `ValidationService.ts` | Data and schema validation |
| `analyticsService` | `AnalyticsService.ts` | Metrics and analytics |
| `authService` | `AuthService.ts` | Authentication |
| `StorageService` | `StorageService.ts` | Persistence (local, Supabase) |
| `ConfigService` | `ConfigService.ts` | Configuration management |
| `HistoryService` | `HistoryService.ts` | Undo/Redo functionality |
| `monitoringService` | `MonitoringService.ts` | Observability and logging |
| `EditorService` | `EditorService.ts` | Editor state management |

## Import Pattern

### ✅ Recommended (New Code)

```typescript
import { 
  templateService, 
  funnelService, 
  cacheService 
} from '@/services';
```

### ❌ Deprecated (Legacy Code)

```typescript
// DON'T USE - these paths will be removed
import { funnelService } from '@/services/funnel';
import { templateService } from '@/services/templates';
import { cacheService } from '@/services/canonical/CacheService';
```

## Deprecated Services

The following service locations are deprecated and redirect to canonical:

| Deprecated Path | Canonical Replacement |
|-----------------|----------------------|
| `@/services/funnel` | `@/services` (funnelService) |
| `@/services/templates` | `@/services` (templateService) |
| `@/services/aliases` | `@/services` |
| `@/services/core/ConsolidatedFunnelService` | `@/services` (funnelService) |
| `@/services/core/ConsolidatedTemplateService` | `@/services` (templateService) |

## Cache Architecture

```
┌─────────────────────────────────────────┐
│         cacheService (Facade)           │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│       MultiLayerCacheStrategy           │
│  L1: Memory  │ L2: Session │ L3: IDB   │
└─────────────────────────────────────────┘
```

## Migration Guide

1. **Find deprecated imports**: Search for `@/services/funnel`, `@/services/templates`, `@/services/aliases`
2. **Replace with canonical**: `import { service } from '@/services'`
3. **Update method calls**: Most APIs remain the same

## Benefits

- **Single source of truth**: One canonical implementation per service
- **Reduced bundle size**: No duplicate code
- **Consistent API**: Same interface across all services
- **Better tree-shaking**: Unused services are not bundled
- **Easier maintenance**: One place to fix bugs
