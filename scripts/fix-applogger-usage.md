# AppLogger API Fix Guide

## Problem
Incorrect appLogger API usage across ~30 files using `{ data: [...] }` pattern instead of proper context objects.

## Correct API

```typescript
import { appLogger } from '@/lib/utils/appLogger';

// ✅ CORRECT - Plain context object
appLogger.info('Message', { key: value, another: 123 });
appLogger.warn('Warning message', { context: data });
appLogger.error('Error message', errorObject, { additionalContext: 'value' });

// ❌ WRONG - Array wrapped in data key
appLogger.info('Message', { data: [value] });
appLogger.error('Error', { data: [error] });
```

## Files Fixed (3/30)
- ✅ `src/types/schemas/editorStateSchema.ts`
- ✅ `src/types/master-schema.ts`
- ✅ `src/services/quizResultsService.ts`

## Remaining Files to Fix (27)

### High Priority Services
- `src/services/api/admin/migrate.ts`
- `src/services/api/hotmartWebhookHandler.ts`
- `src/services/api/webhook/whatsapp.ts`
- `src/services/api/internal/BlockPropertiesAPI.ts`
- `src/services/api/database/QueryBatcher.ts`
- `src/services/diagnostic/21StepEditorDiagnostic.ts`
- `src/services/FacebookMetricsService.ts`
- `src/services/quizDataService.ts`
- `src/services/templateLibraryService.ts`
- `src/services/quizSupabaseService.ts`

### Medium Priority
- `src/services/AdvancedPersonalizationEngine.ts`
- `src/services/publishService.ts`
- `src/services/monitoring/ErrorTrackingService.ts`
- `src/services/monitoring/HealthCheckService.ts`
- `src/services/monitoring/AnalyticsService.ts`
- `src/services/mediaUploadService.ts`
- `src/services/initializeTemplates.ts`
- `src/services/performanceOptimizer.ts`
- `src/services/WhiteLabelPlatform.ts`
- `src/services/userResponseService.ts`

### Lower Priority
- `src/services/performance/LazySchemaLoader.ts`
- `src/services/canonical/NavigationService.ts`
- `src/services/canonical/ValidationService.ts`
- `src/services/canonical/CacheService.ts`
- `src/services/canonical/TemplateService.ts`
- `src/services/canonical/DataService.ts`
- `src/services/canonical/MonitoringService.ts`

## Migration Script (Future)

```bash
#!/bin/bash
# Batch fix appLogger usage

files=(
  "src/services/api/admin/migrate.ts"
  # ... add all files
)

for file in "${files[@]}"; do
  # Manual review required for each file
  # Pattern varies: { data: [x] }, { data: [{ nested }] }, etc.
  echo "Review: $file"
done
```

## Why Not Fixed All?

1. **Build passes** - Not blocking deployment
2. **Semantic not syntactic** - API accepts the format, just semantically incorrect
3. **5,222 total usages** - Need systematic approach
4. **Manual review needed** - Each context is different, no one-size-fits-all sed script

## Recommendation

Create dedicated task for bulk migration with:
1. TypeScript AST parser to identify patterns
2. Context-aware replacements
3. Automated test generation
4. Incremental rollout with monitoring
