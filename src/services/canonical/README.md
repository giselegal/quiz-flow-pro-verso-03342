# 🎯 Canonical Services - Developer Guide

**Version**: 2.0.0 (Phase 2)  
**Last Updated**: 2025-11-24  
**Status**: ✅ Production Ready

---

## What Are Canonical Services?

**Canonical services** are the single, authoritative implementation of a specific responsibility in the system. They eliminate duplication and confusion by providing **one unified API** for each domain.

### The Problem We Solved

**Before Phase 1:**
```
📊 System Stats:
├── 239 total services
├── 20+ different Template services
├── 15+ different Funnel services
├── 7+ different Storage/Cache services
├── 5+ layers of cache
└── 0 clear single source of truth
```

**After Phase 2:**
```
✅ Consolidated Architecture:
├── 35 canonical services
├── 1 Template service (src/services/canonical/TemplateService.ts)
├── 1 Funnel service (src/services/canonical/FunnelService.ts)
├── 1 Storage service (src/services/canonical/StorageService.ts)
├── 1 Cache service (src/services/canonical/CacheService.ts)
└── Feature flags for controlled rollout
```

---

## Quick Start

### For New Components (Recommended)

Use React Query hooks directly:

```typescript
import { useTemplate, useUpdateTemplate } from '@/hooks/useTemplate';

function MyComponent({ templateId }: { templateId: string }) {
  // Read data with automatic caching
  const { data: template, isLoading, error } = useTemplate(templateId);
  
  // Mutations with automatic cache invalidation
  const updateTemplate = useUpdateTemplate();
  
  const handleSave = async () => {
    await updateTemplate.mutateAsync({
      id: templateId,
      name: 'Updated Name',
      blocks: [...],
    });
  };
  
  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!template) return <NotFound />;
  
  return <TemplateView template={template} onSave={handleSave} />;
}
```

### For Migrating Existing Components

Use migration helpers for gradual migration:

```typescript
import { shouldUseReactQuery, loadTemplate } from '@/services/canonical/migrationHelpers';
import { useTemplate } from '@/hooks/useTemplate';

function MyComponent({ templateId }: { templateId: string }) {
  const useNewApproach = shouldUseReactQuery();
  
  // New approach with React Query
  const { data: newData, isLoading: newLoading } = useTemplate(
    templateId,
    { enabled: useNewApproach }
  );
  
  // Legacy approach
  const [oldData, setOldData] = useState(null);
  useEffect(() => {
    if (!useNewApproach) {
      legacyService.loadTemplate(templateId).then(setOldData);
    }
  }, [useNewApproach, templateId]);
  
  // Unified data access
  const template = useNewApproach ? newData : oldData;
  const isLoading = useNewApproach ? newLoading : !oldData;
  
  // Rest of component...
}
```

### For Non-React Code (Services, Utils)

Use canonical services directly:

```typescript
import { templateService } from '@/services/canonical/TemplateService';

async function myUtilFunction(templateId: string) {
  const result = await templateService.getTemplate(templateId);
  
  if (!result.success) {
    throw result.error;
  }
  
  return result.data;
}
```

---

## Available Services

### 1. TemplateService

**Purpose**: Manage quiz templates and step configurations

**File**: `src/services/canonical/TemplateService.ts`

**Key Methods**:
```typescript
// Get template by ID
const result = await templateService.getTemplate(id);

// Get step template
const stepResult = await templateService.getStep('step-01');

// Update template
const updateResult = await templateService.updateTemplate(id, changes);

// List all templates
const listResult = await templateService.listTemplates();

// Get step order
const order = templateService.getStepOrder();
```

**React Query Hooks**:
```typescript
// Read
const { data, isLoading, error } = useTemplate(id);
const { data: list } = useTemplateList({ status: 'published' });

// Write
const updateMutation = useUpdateTemplate();
const createMutation = useCreateTemplate();
const deleteMutation = useDeleteTemplate();
```

### 2. FunnelService

**Purpose**: Manage funnels and their configurations

**File**: `src/services/canonical/FunnelService.ts`

**Key Methods**:
```typescript
// Create funnel
const funnel = await funnelService.createFunnel({ name: 'My Funnel' });

// Get funnel
const result = await funnelService.getFunnel(id);

// Save step blocks
await funnelService.saveStepBlocks(funnelId, stepKey, blocks);

// Update funnel settings
await funnelService.updateFunnelSettings(id, settings);
```

**React Query Hooks**:
```typescript
// Read
const { data: funnel } = useFunnel(id);

// Write
const updateFunnel = useUpdateFunnel();
```

### 3. StorageService

**Purpose**: Unified storage abstraction (localStorage, sessionStorage, IndexedDB)

**File**: `src/services/canonical/StorageService.ts`

**Key Methods**:
```typescript
// Store data
await storageService.set('key', data, { ttl: 3600 });

// Retrieve data
const result = await storageService.get('key');

// Remove data
await storageService.remove('key');

// Clear all
await storageService.clear();
```

### 4. CacheService

**Purpose**: Multi-layer caching with TTL support

**File**: `src/services/canonical/CacheService.ts`

**Key Methods**:
```typescript
// Template-specific cache
cacheService.templates.set('template-123', template);
const cached = cacheService.templates.get('template-123');

// Generic cache
cacheService.set('my-key', data, 3600); // TTL in seconds
const data = cacheService.get('my-key');
```

---

## Migration Helpers

### Overview

Migration helpers make it easy to gradually migrate code to use canonical services and React Query.

**File**: `src/services/canonical/migrationHelpers.ts`

### Available Helpers

#### Service Selection

```typescript
import { getTemplateService } from '@/services/canonical/migrationHelpers';

const service = getTemplateService();
// Returns canonical service based on feature flags
```

#### Convenience Functions

```typescript
import { loadTemplate, saveTemplate, listTemplates } from '@/services/canonical/migrationHelpers';

// Load template with automatic service selection
const result = await loadTemplate('template-123');

// Save template
const saved = await saveTemplate({ id: '123', name: 'Updated' });

// List templates
const list = await listTemplates();
```

#### Feature Flag Checks

```typescript
import { shouldUseReactQuery, shouldUseCanonicalServices } from '@/services/canonical/migrationHelpers';

if (shouldUseReactQuery()) {
  // Use React Query hooks
} else {
  // Use legacy approach
}
```

#### Result Handling

```typescript
import { isSuccess, isError, unwrapResult } from '@/services/canonical/migrationHelpers';

// Type-safe checking
if (isSuccess(result)) {
  console.log('Data:', result.data);
}

if (isError(result)) {
  console.error('Error:', result.error);
}

// Exception-based unwrapping
try {
  const data = unwrapResult(result);
  console.log('Data:', data);
} catch (error) {
  console.error('Failed:', error);
}
```

---

## Feature Flags

Feature flags control the migration rollout. They allow us to test new implementations without breaking existing functionality.

**File**: `src/config/flags.ts`

### Available Flags

```typescript
export const featureFlags = {
  // Template-related flags
  USE_CANONICAL_TEMPLATE_SERVICE: process.env.NODE_ENV === 'development',
  USE_REACT_QUERY_TEMPLATES: process.env.NODE_ENV === 'development',
  
  // Funnel-related flags
  USE_CANONICAL_FUNNEL_SERVICE: false,
  USE_REACT_QUERY_FUNNELS: false,
  
  // Storage and cache flags
  USE_CANONICAL_STORAGE_SERVICE: false,
  USE_CANONICAL_CACHE_SERVICE: false,
};
```

### Current Status (Phase 2)

- ✅ Template flags: **Enabled in development**
- ⏳ Funnel flags: Planned for Phase 3
- ⏳ Storage/Cache flags: Planned for Phase 4

---

## Testing

### Unit Tests

Test services directly:

```typescript
import { describe, it, expect } from 'vitest';
import { templateService } from '@/services/canonical/TemplateService';

describe('TemplateService', () => {
  it('should load template', async () => {
    const result = await templateService.getTemplate('test-id');
    expect(result.success).toBe(true);
  });
});
```

### Component Tests with React Query

Wrap components with QueryClientProvider:

```typescript
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

render(
  <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
);
```

---

## Best Practices

### ✅ DO

1. **Use React Query hooks** for React components
2. **Use canonical services** for non-React code
3. **Use migration helpers** for gradual migration
4. **Check feature flags** when adding compatibility layers
5. **Add tests** for all new code
6. **Follow ServiceResult pattern** for error handling

### ❌ DON'T

1. **Don't create new services** for existing domains
2. **Don't use localStorage** directly for business data
3. **Don't skip error handling**
4. **Don't remove feature flags** until Phase 4
5. **Don't bypass canonical services** when flags are enabled
6. **Don't forget to invalidate cache** after mutations

---

## Common Patterns

### Pattern 1: Load and Display Data

```typescript
function TemplateViewer({ id }: { id: string }) {
  const { data, isLoading, error } = useTemplate(id);
  
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <NotFound />;
  
  return <TemplateDisplay template={data} />;
}
```

### Pattern 2: Edit and Save Data

```typescript
function TemplateEditor({ id }: { id: string }) {
  const { data: template } = useTemplate(id);
  const updateMutation = useUpdateTemplate();
  const [formData, setFormData] = useState(template);
  
  const handleSave = async () => {
    await updateMutation.mutateAsync({
      id,
      ...formData,
    });
  };
  
  return (
    <form onSubmit={handleSave}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <button disabled={updateMutation.isPending}>
        {updateMutation.isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

### Pattern 3: List with Filters

```typescript
function TemplateList() {
  const [filters, setFilters] = useState({ status: 'published' });
  const { data: templates, isLoading } = useTemplateList(filters);
  
  if (isLoading) return <Loading />;
  
  return (
    <div>
      <FilterBar value={filters} onChange={setFilters} />
      <Grid>
        {templates?.map(t => <TemplateCard key={t.id} template={t} />)}
      </Grid>
    </div>
  );
}
```

---

## Troubleshooting

### Issue: "Cannot find module '@/services/canonical/...'"

**Solution**: Check your import path. Make sure you're importing from the correct location:

```typescript
// ✅ Correct
import { templateService } from '@/services/canonical/TemplateService';

// ❌ Wrong
import { templateService } from '@/services/TemplateService';
```

### Issue: "Property 'data' does not exist on type 'ServiceResult<T>'"

**Solution**: Check the result before accessing data:

```typescript
// ❌ Wrong
const data = result.data; // TypeScript error

// ✅ Correct
if (result.success) {
  const data = result.data; // TypeScript is happy
}
```

### Issue: React Query hooks not working

**Solution**: Make sure your app is wrapped with QueryClientProvider:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}
```

---

## Resources

### Documentation
- [Phase 2 Migration Guide](../../docs/architecture/PHASE2_MIGRATION_GUIDE.md)
- [Services Canônicos (Phase 1)](../../docs/architecture/services-canonicos-e-fonte-unica.md)
- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)

### Example Code
- `src/services/canonical/migrationHelpers.ts` - Helper utilities
- `src/components/quiz/editor/TemplateSelectorMigrated.tsx` - Full migration example
- `src/hooks/useTemplate.ts` - React Query hooks

### Support
- 📖 Check documentation first
- 🐛 Report bugs on GitHub Issues
- 💬 Ask questions in team channels

---

## FAQ

**Q: Should I use hooks or services?**  
A: Use React Query hooks in React components, canonical services in non-React code.

**Q: What if a feature flag is disabled?**  
A: Migration helpers fall back to legacy behavior automatically.

**Q: Can I skip migration helpers?**  
A: Yes, for new code. Use React Query hooks directly. Use helpers only for gradual migration.

**Q: When will legacy services be removed?**  
A: Phase 4, after all code is migrated and flags are removed.

**Q: How do I know what needs migration?**  
A: Check deprecation warnings in the console (development only).

---

**Last Updated**: 2025-11-24  
**Maintainer**: Architecture Team  
**Status**: ✅ Active Development (Phase 2)
