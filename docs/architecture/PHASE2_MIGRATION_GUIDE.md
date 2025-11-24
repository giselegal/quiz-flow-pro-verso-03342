# 🔄 Phase 2 Migration Guide

**Status**: ✅ In Progress  
**Last Updated**: 2025-11-24  
**Version**: 2.0.0

---

## Overview

This document provides comprehensive guidance for Phase 2 of the architectural consolidation plan, focusing on **progressive migration** of real application flows to canonical services and React Query.

### Phase 1 Recap (Completed ✅)

Phase 1 established the foundation:
- ✅ Canonical services in `src/services/canonical/`
- ✅ React Query hooks (`useTemplate`, `useUpdateTemplate`)
- ✅ Feature flags system in `src/config/flags.ts`
- ✅ Documentation and testing infrastructure

### Phase 2 Goals

Phase 2 focuses on **real-world migration**:
1. ✅ Enable feature flags in controlled environments (development)
2. ✅ Migrate critical template flows to canonical services
3. ✅ Migrate React components to use React Query hooks
4. ⏳ Reduce direct usage of localStorage/sessionStorage for business data
5. ⏳ Begin deprecating legacy services
6. ⏳ Increase test coverage for migrated paths

---

## What's Been Changed

### 1. Feature Flags Enabled (Development Only)

**File**: `src/config/flags.ts`

```typescript
// Before (Phase 1)
USE_CANONICAL_TEMPLATE_SERVICE: false,
USE_REACT_QUERY_TEMPLATES: false,

// After (Phase 2)
USE_CANONICAL_TEMPLATE_SERVICE: process.env.NODE_ENV === 'development',
USE_REACT_QUERY_TEMPLATES: process.env.NODE_ENV === 'development',
```

**Impact**:
- ✅ Canonical services enabled automatically in development
- ✅ Production still uses legacy services (safe rollout)
- ✅ Easy to toggle for testing

### 2. Fixed ServiceAliases.ts

**Problem**: Was importing non-existent `UnifiedTemplateService`

**Solution**: Now correctly imports from canonical service:

```typescript
// Before
import { UnifiedTemplateService } from './UnifiedTemplateService'; // ❌ Doesn't exist

// After
import { templateService } from './canonical/TemplateService'; // ✅ Canonical
```

### 3. Migration Helpers Created

**File**: `src/services/canonical/migrationHelpers.ts`

New utility functions to make migration easier:

```typescript
// Easy service selection based on flags
const service = getTemplateService();

// Convenient template operations
const result = await loadTemplate('template-123');
const saved = await saveTemplate(template);

// Check feature flags
if (shouldUseReactQuery()) {
  // Use React Query hooks
}

// Type-safe result handling
if (isSuccess(result)) {
  const template = result.data;
}
```

### 4. Example Migration: TemplateSelectorMigrated

**File**: `src/components/quiz/editor/TemplateSelectorMigrated.tsx`

A complete example showing how to migrate a component to support both legacy and new architecture:

**Key Features**:
- ✅ Uses feature flags to conditionally enable React Query
- ✅ Falls back to legacy implementation gracefully
- ✅ Shows migration status in dev mode
- ✅ Demonstrates proper error handling for both paths
- ✅ Maintains full backward compatibility

---

## Migration Patterns

### Pattern 1: Service Migration (Non-React Code)

**Before (Legacy)**:
```typescript
import { oldTemplateService } from '@/services/oldTemplateService';

async function loadTemplate(id: string) {
  const template = await oldTemplateService.get(id);
  return template;
}
```

**After (Canonical with Feature Flags)**:
```typescript
import { featureFlags } from '@/config/flags';
import { templateService as canonical } from '@/services/canonical/TemplateService';
import { oldTemplateService } from '@/services/oldTemplateService';

async function loadTemplate(id: string) {
  if (featureFlags.USE_CANONICAL_TEMPLATE_SERVICE) {
    const result = await canonical.getTemplate(id);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  } else {
    // Legacy fallback
    return await oldTemplateService.get(id);
  }
}
```

**Even Better (Using Migration Helpers)**:
```typescript
import { loadTemplate } from '@/services/canonical/migrationHelpers';

async function getTemplate(id: string) {
  const result = await loadTemplate(id);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
}
```

### Pattern 2: React Component Migration (Option A: Feature Flag Switch)

**Before (Legacy)**:
```typescript
import { useState, useEffect } from 'react';
import { legacyService } from '@/services/legacy';

function MyComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    legacyService.getData().then(setData);
  }, []);
  
  if (!data) return <Loading />;
  return <Display data={data} />;
}
```

**After (With Feature Flag)**:
```typescript
import { useState, useEffect } from 'react';
import { useTemplate } from '@/hooks/useTemplate';
import { shouldUseReactQuery } from '@/services/canonical/migrationHelpers';
import { legacyService } from '@/services/legacy';

function MyComponent() {
  const useNewApproach = shouldUseReactQuery();
  
  // React Query approach
  const { data: reactData, isLoading: reactLoading } = useTemplate(
    'template-id',
    { enabled: useNewApproach }
  );
  
  // Legacy approach
  const [legacyData, setLegacyData] = useState(null);
  const [legacyLoading, setLegacyLoading] = useState(false);
  
  useEffect(() => {
    if (!useNewApproach) {
      setLegacyLoading(true);
      legacyService.getData().then((data) => {
        setLegacyData(data);
        setLegacyLoading(false);
      });
    }
  }, [useNewApproach]);
  
  // Unified data access
  const data = useNewApproach ? reactData : legacyData;
  const isLoading = useNewApproach ? reactLoading : legacyLoading;
  
  if (isLoading) return <Loading />;
  if (!data) return <NotFound />;
  return <Display data={data} />;
}
```

### Pattern 3: React Component Migration (Option B: Direct Switch)

For new components or complete rewrites, skip the compatibility layer:

```typescript
import { useTemplate, useUpdateTemplate } from '@/hooks/useTemplate';

function MyComponent() {
  const { data, isLoading, error } = useTemplate('template-id');
  const updateTemplate = useUpdateTemplate();
  
  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!data) return <NotFound />;
  
  const handleSave = async () => {
    await updateTemplate.mutateAsync({
      id: data.id,
      name: 'Updated Name',
    });
  };
  
  return <Display data={data} onSave={handleSave} />;
}
```

### Pattern 4: Mutation Operations

**Before (Legacy)**:
```typescript
async function saveTemplate(template) {
  try {
    await legacyService.save(template);
    toast.success('Saved!');
  } catch (error) {
    toast.error('Failed!');
  }
}
```

**After (React Query)**:
```typescript
import { useUpdateTemplate } from '@/hooks/useUpdateTemplate';

function MyComponent() {
  const updateTemplate = useUpdateTemplate({
    onSuccess: () => toast.success('Saved!'),
    onError: (error) => toast.error('Failed!'),
  });
  
  const handleSave = async (template) => {
    await updateTemplate.mutateAsync(template);
  };
  
  return (
    <button 
      onClick={() => handleSave(template)}
      disabled={updateTemplate.isPending}
    >
      {updateTemplate.isPending ? 'Saving...' : 'Save'}
    </button>
  );
}
```

---

## Testing Migrated Code

### Unit Tests for Services

```typescript
import { describe, it, expect, vi } from 'vitest';
import { loadTemplate } from '@/services/canonical/migrationHelpers';
import { featureFlags } from '@/config/flags';

describe('Migration Helpers', () => {
  it('should use canonical service when flag is enabled', async () => {
    // Mock the flag
    vi.spyOn(featureFlags, 'USE_CANONICAL_TEMPLATE_SERVICE', 'get')
      .mockReturnValue(true);
    
    const result = await loadTemplate('test-id');
    expect(result.success).toBe(true);
  });
});
```

### Component Tests with React Query

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './MyComponent';

describe('MyComponent (Migrated)', () => {
  it('should load data with React Query', async () => {
    const queryClient = new QueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <MyComponent />
      </QueryClientProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Template Name')).toBeInTheDocument();
    });
  });
});
```

---

## Rollout Strategy

### Step 1: Development Testing (Current Phase)
- ✅ Enable flags in development environment
- ✅ Test with internal team
- ✅ Monitor for issues
- ✅ Gather feedback

### Step 2: Beta Testing
- ⏳ Enable flags for beta users
- ⏳ A/B testing with metrics
- ⏳ Performance monitoring
- ⏳ Bug fixes and refinements

### Step 3: Gradual Production Rollout
- ⏳ Enable for 10% of production users
- ⏳ Monitor metrics (error rates, performance)
- ⏳ Gradually increase to 50%, 75%, 100%
- ⏳ Full migration complete

### Step 4: Legacy Cleanup
- ⏳ Remove feature flags
- ⏳ Delete legacy code
- ⏳ Update documentation
- ⏳ Celebrate! 🎉

---

## Monitoring and Metrics

### Key Metrics to Track

1. **Error Rates**
   - Compare error rates between legacy and canonical paths
   - Track specific error types

2. **Performance**
   - Page load times
   - Time to interactive
   - Cache hit rates

3. **User Experience**
   - Template load times
   - Save operation latency
   - User-reported issues

4. **Adoption**
   - % of requests using canonical services
   - % of components migrated
   - % of users on new architecture

### Logging Example

```typescript
import { appLogger } from '@/lib/utils/appLogger';

// Log when canonical service is used
appLogger.info('🔄 Phase 2: Using canonical TemplateService', {
  templateId,
  source: 'canonical',
  feature: 'template-load',
});

// Log when legacy service is used
appLogger.warn('⚠️ Phase 2: Using legacy service', {
  templateId,
  source: 'legacy',
  reason: 'feature-flag-disabled',
});
```

---

## Troubleshooting

### Problem: Component breaks in production

**Cause**: Feature flag enabled in prod by mistake

**Solution**: 
```typescript
// Always check environment
USE_CANONICAL_TEMPLATE_SERVICE: process.env.NODE_ENV === 'development',
```

### Problem: Tests failing with React Query

**Cause**: QueryClientProvider not wrapping component

**Solution**: Add provider in test setup
```typescript
const queryClient = new QueryClient();

render(
  <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
);
```

### Problem: Data not updating after mutation

**Cause**: Cache not invalidated

**Solution**: Ensure proper cache invalidation in mutation
```typescript
const updateTemplate = useUpdateTemplate({
  onSuccess: (data, variables) => {
    queryClient.invalidateQueries({ 
      queryKey: templateKeys.detail(variables.id) 
    });
  },
});
```

---

## Next Steps

### Immediate Priorities (Phase 2)
1. ✅ Fix ServiceAliases broken imports
2. ✅ Enable feature flags in development
3. ✅ Create migration helpers
4. ✅ Document migration patterns
5. ⏳ Migrate 3-5 critical components
6. ⏳ Add tests for migrated components
7. ⏳ Internal testing and validation

### Future Work (Phase 3)
- Deprecate legacy services completely
- Remove localStorage for business data
- Consolidate Zustand to UI state only
- Enable flags for beta users
- Performance optimization

---

## Resources

### Documentation
- [Phase 1: Services Canônicos](./services-canonicos-e-fonte-unica.md)
- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Feature Flags Pattern](https://martinfowler.com/articles/feature-toggles.html)

### Code Examples
- `src/services/canonical/migrationHelpers.ts` - Helper utilities
- `src/components/quiz/editor/TemplateSelectorMigrated.tsx` - Full migration example
- `src/hooks/useTemplate.ts` - React Query hooks
- `src/services/canonical/TemplateService.ts` - Canonical service

### Support
- 📖 Check this guide first
- 🐛 Report issues on GitHub
- 💬 Discuss in team channels
- 📧 Contact tech lead for urgent matters

---

**Remember**: The goal is **gradual, safe migration** - not breaking changes. When in doubt, maintain backward compatibility and use feature flags! 🚀
