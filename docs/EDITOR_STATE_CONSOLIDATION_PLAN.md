# EditorState Consolidation Plan

## Problem Statement

**19 different EditorState interface definitions** exist across the codebase, causing:
- Type confusion and mismatches
- Duplicate/conflicting logic
- Maintenance nightmare
- Unclear single source of truth

## Current State Inventory

### 1. Types Layer (2 definitions)
- `src/types/editor.interface.ts` - Base EditorState
- `src/types/editorTypes.ts` - Alternative EditorState

### 2. Services Layer (3 definitions)
- `src/services/canonical/EditorService.ts` - Canonical service state
- `src/services/core/UnifiedEditorService.ts` - Unified core state
- `src/services/editor/EditorStateManager.ts` - Manager state

### 3. Pages Layer (2 definitions)
- `src/pages/editor/UniversalVisualEditor.tsx` - Page-local state
- `src/pages/editor/types.ts` - Page types

### 4. Components Layer (5 definitions)
- `src/components/editor/EditorProviderCanonical.tsx` - **CANONICAL PROVIDER** ⭐
- `src/components/editor/hooks/useEditorState.ts` - Hook state
- `src/components/editor/quiz/hooks/useEditorState.ts` - Quiz hook state
- `src/components/editor/quiz/core/EditorStateManager.tsx` - Quiz manager
- `src/components/editor/core/EditorCore.tsx` - Core component state

### 5. Hooks Layer (2 definitions)
- `src/hooks/useUnifiedEditorState.ts` - Unified hook
- `src/lib/utils/storage/SyncedContexts.tsx` - Synced context state

### 6. Contexts Layer (2 definitions)
- `src/contexts/store/editorStore.ts` - Store state
- `src/contexts/providers/SuperUnifiedProvider.tsx` - **SUPER UNIFIED** ⭐

### 7. Core Domain Layer (2 definitions)
- `src/core/domains/editor/entities/EditorState.ts` - Domain entity
- `src/core/editor/interfaces/EditorInterfaces.ts` - Core interface

## Recommended Canonical State

Based on active usage, **EditorProviderCanonical** should be the source of truth:

```typescript
// src/types/editor/EditorState.canonical.ts
export interface EditorState {
  // Core navigation
  readonly stepBlocks: Record<string, Block[]>;
  readonly currentStep: number;
  readonly selectedBlockId: string | null;

  // Validation & Loading
  stepValidation: Record<number, boolean>;
  isLoading: boolean;
  
  // Data source
  databaseMode: 'local' | 'supabase';
  isSupabaseEnabled: boolean;
  stepSources?: Record<string, string>;
}
```

## Migration Strategy

### Phase 1: Create Canonical Definition ✅
1. Create `src/types/editor/EditorState.canonical.ts`
2. Export from `src/types/index.ts`
3. Document as official source of truth

### Phase 2: Identify Usage Patterns
For each of 19 definitions:
1. Find all imports
2. Analyze actual property usage
3. Map to canonical properties
4. Document discrepancies

### Phase 3: Create Compatibility Layer
```typescript
// src/types/editor/EditorState.compat.ts
import { EditorState as Canonical } from './EditorState.canonical';

// Adapter for legacy definitions
export type EditorStateLegacy = Canonical & {
  // Additional properties for backward compatibility
};
```

### Phase 4: Gradual Migration
1. Start with leaf components (no dependencies)
2. Update to use canonical type
3. Add tests for each migration
4. Monitor for runtime errors
5. Remove deprecated definitions

### Phase 5: Cleanup
1. Mark all non-canonical as `@deprecated`
2. Add ESLint rule to prevent new definitions
3. Remove deprecated after 2 sprint cycles

## Impact Analysis

### High Risk Areas (Need Careful Testing)
- `SuperUnifiedProvider` - Used by main /editor route
- `EditorProviderCanonical` - Core provider
- `EditorStateManager` - State persistence logic

### Medium Risk
- Quiz-specific states
- Service layer states

### Low Risk
- Page-local states
- Utility/storage states

## Estimated Effort

- **Analysis & Planning**: 2-3 days
- **Canonical Definition**: 1 day
- **Migration (per definition)**: 0.5-1 day each
- **Testing**: 3-4 days
- **Total**: 15-20 days (3-4 sprints)

## Success Criteria

1. ✅ Single source of truth for EditorState
2. ✅ All imports use canonical type
3. ✅ Zero type errors
4. ✅ All tests passing
5. ✅ No runtime regressions
6. ✅ Documentation updated
7. ✅ ESLint rule prevents new definitions

## Risks & Mitigations

### Risk: Breaking Changes
**Mitigation**: Compatibility layer during transition, feature flags for rollback

### Risk: Runtime Errors
**Mitigation**: Extensive testing, gradual rollout, monitoring

### Risk: Developer Confusion
**Mitigation**: Clear documentation, team training, code reviews

## Recommendation

**This is a major architectural refactoring** that should be:
1. Scheduled as dedicated sprint work
2. Led by senior engineer familiar with editor
3. Done incrementally with thorough testing
4. Not combined with other major changes

## Out of Scope for Current PR

Given the "minimal changes" requirement, EditorState consolidation is:
- ❌ Too invasive for quick fix
- ❌ Requires extensive testing
- ❌ Needs coordinated team effort
- ✅ Should be separate epic/initiative

## Current PR Scope

✅ Document the problem
✅ Create consolidation plan
✅ Fix immediate blockers (UniversalPropertiesPanel accessing wrong properties)
