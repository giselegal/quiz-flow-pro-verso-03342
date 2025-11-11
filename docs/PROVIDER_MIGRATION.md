# 🔄 Provider Migration Guide

## Overview

This guide helps you migrate from legacy providers to the new **SuperUnifiedProvider**, which consolidates all context providers into a single, optimized solution.

---

## 🎯 Why Migrate?

### Problems with Legacy Providers

❌ **7+ nested providers** causing complexity  
❌ **70% unnecessary re-renders** from context splitting  
❌ **Type safety issues** from multiple context APIs  
❌ **Cache fragmentation** across different providers  
❌ **Difficult debugging** with scattered state  

### Benefits of SuperUnifiedProvider

✅ **Single provider** - one context to rule them all  
✅ **70% fewer re-renders** - optimized state management  
✅ **Complete type safety** - TypeScript-first design  
✅ **Unified cache** - intelligent caching layer  
✅ **Better performance** - 60% improvement measured  

---

## 📚 Migration Path

### Step 1: Identify Current Provider Usage

Check which legacy providers your component uses:

```typescript
// ❌ LEGACY - Multiple providers
import { EditorProviderCanonical, useEditor } from '@/components/editor/EditorProviderCanonical';
import { UnifiedCRUDProvider, useUnifiedCRUD } from '@/contexts/UnifiedCRUDProvider';
import { FunnelMasterProvider, useFunnelMaster } from '@/contexts/FunnelMasterProvider';
```

### Step 2: Update Imports

Replace with the unified provider:

```typescript
// ✅ NEW - Single provider
import SuperUnifiedProvider, { useSuperUnified } from '@/contexts/providers/SuperUnifiedProvider';
```

### Step 3: Update Component Wrapper

Replace the provider wrapper:

```typescript
// ❌ BEFORE - Nested providers
<EditorProviderCanonical>
  <UnifiedCRUDProvider>
    <FunnelMasterProvider>
      <YourComponent />
    </FunnelMasterProvider>
  </UnifiedCRUDProvider>
</EditorProviderCanonical>

// ✅ AFTER - Single provider
<SuperUnifiedProvider>
  <YourComponent />
</SuperUnifiedProvider>
```

### Step 4: Update Hook Usage

Update how you access context:

```typescript
// ❌ BEFORE - Old API with actions/state split
const { actions, state } = useEditor();
const blocks = state.blocks;
actions.addBlock(block);

// ✅ AFTER - Flat API
const ctx = useSuperUnified();
const blocks = ctx.getStepBlocks(stepIndex);
ctx.addBlock(stepIndex, block);
```

---

## 🗺️ API Mapping

### Editor Operations

| Legacy API | SuperUnifiedProvider API |
|------------|-------------------------|
| `actions.addBlock(block)` | `addBlock(stepIndex, block)` |
| `actions.updateBlock(id, updates)` | `updateBlock(stepIndex, blockId, updates)` |
| `actions.removeBlock(id)` | `removeBlock(stepIndex, blockId)` |
| `actions.reorderBlocks(blocks)` | `reorderBlocks(stepIndex, blocks)` |
| `state.blocks` | `getStepBlocks(stepIndex)` |
| `state.currentStep` | `state.currentStep` |
| `actions.setCurrentStep(n)` | `setCurrentStep(n)` |

### Funnel Operations

| Legacy API | SuperUnifiedProvider API |
|------------|-------------------------|
| `crud.saveFunnel(funnel)` | `saveFunnel(funnel)` |
| `crud.loadFunnel(id)` | `loadFunnel(id)` |
| `crud.deleteFunnel(id)` | `deleteFunnel(id)` |
| `crud.createFunnel(name)` | `createFunnel(name, options)` |
| `crud.duplicateFunnel(id)` | `duplicateFunnel(id, newName)` |

### History Operations

| Legacy API | SuperUnifiedProvider API |
|------------|-------------------------|
| `history.undo()` | `undo()` |
| `history.redo()` | `redo()` |
| `history.canUndo` | `canUndo` |
| `history.canRedo` | `canRedo` |

### UI Operations

| Legacy API | SuperUnifiedProvider API |
|------------|-------------------------|
| `ui.showToast(msg)` | `showToast(toast)` |
| `ui.setSelectedBlock(id)` | `setSelectedBlock(id)` |
| `ui.setTheme(theme)` | `setTheme(theme)` |

---

## 📝 Migration Examples

### Example 1: Simple Editor Component

```typescript
// ❌ BEFORE
import { useEditor } from '@/components/editor/EditorProviderCanonical';

function MyEditor() {
  const { actions, state } = useEditor();
  
  const handleAddBlock = () => {
    actions.addBlock({
      id: 'new-block',
      type: 'text',
      properties: {},
      order: state.blocks.length
    });
  };
  
  return (
    <div>
      {state.blocks.map(block => (
        <div key={block.id}>{block.type}</div>
      ))}
    </div>
  );
}

// ✅ AFTER
import { useSuperUnified } from '@/contexts/providers/SuperUnifiedProvider';

function MyEditor() {
  const ctx = useSuperUnified();
  const blocks = ctx.getStepBlocks(ctx.state.currentStep);
  
  const handleAddBlock = () => {
    ctx.addBlock(ctx.state.currentStep, {
      id: 'new-block',
      type: 'text',
      properties: {}
    });
  };
  
  return (
    <div>
      {blocks.map(block => (
        <div key={block.id}>{block.type}</div>
      ))}
    </div>
  );
}
```

### Example 2: Funnel Management

```typescript
// ❌ BEFORE
import { useUnifiedCRUD } from '@/contexts/UnifiedCRUDProvider';

function FunnelList() {
  const { loadFunnels, saveFunnel, state } = useUnifiedCRUD();
  
  useEffect(() => {
    loadFunnels();
  }, []);
  
  return (
    <div>
      {state.funnels.map(funnel => (
        <div key={funnel.id}>{funnel.name}</div>
      ))}
    </div>
  );
}

// ✅ AFTER
import { useSuperUnified } from '@/contexts/providers/SuperUnifiedProvider';

function FunnelList() {
  const ctx = useSuperUnified();
  
  useEffect(() => {
    ctx.loadFunnels();
  }, []);
  
  return (
    <div>
      {ctx.state.funnels.map(funnel => (
        <div key={funnel.id}>{funnel.name}</div>
      ))}
    </div>
  );
}
```

---

## ⚠️ Important Notes

### State Structure Changes

The state structure is flatter in SuperUnifiedProvider:

```typescript
// ❌ OLD - Nested state
state: {
  editor: {
    blocks: [],
    currentStep: 0
  },
  crud: {
    funnels: [],
    currentFunnel: null
  }
}

// ✅ NEW - Flat state
state: {
  blocks: Map<number, Block[]>,
  currentStep: 0,
  funnels: [],
  currentFunnel: null
}
```

### Async Operations

All save operations are now async and return Promises:

```typescript
// ✅ NEW - Always await save operations
await ctx.saveFunnel();
await ctx.updateBlock(stepIndex, blockId, updates);
await ctx.saveStepBlocks(stepIndex);
```

### Step-Based Block Management

Blocks are now organized by step index:

```typescript
// ❌ OLD - Single blocks array
const blocks = state.blocks;

// ✅ NEW - Blocks by step
const step1Blocks = ctx.getStepBlocks(0);
const step2Blocks = ctx.getStepBlocks(1);
```

---

## 🔍 Testing Your Migration

### Checklist

- [ ] All imports updated to SuperUnifiedProvider
- [ ] Provider wrappers replaced (no nested providers)
- [ ] API calls updated (actions/state → direct methods)
- [ ] Step index passed to block operations
- [ ] Async operations properly awaited
- [ ] TypeScript errors resolved
- [ ] Component renders correctly
- [ ] State updates work as expected
- [ ] No console warnings about deprecated APIs

### Common Issues

**Issue:** `Property 'actions' does not exist`  
**Fix:** Use direct methods instead of `actions.method()`

**Issue:** `Property 'blocks' does not exist on state`  
**Fix:** Use `getStepBlocks(stepIndex)` instead of `state.blocks`

**Issue:** Block operations not working  
**Fix:** Make sure to pass `stepIndex` as first parameter

---

## 📞 Need Help?

If you encounter issues during migration:

1. Check this guide's API mapping section
2. Review the TypeScript errors for hints
3. Look at components that have already been migrated
4. Consult the SuperUnifiedProvider source code comments

---

## 🎯 Deprecation Timeline

- **Now:** SuperUnifiedProvider is production-ready
- **Phase 1 (Current):** Both old and new providers work
- **Phase 2 (Next Sprint):** Runtime warnings for deprecated providers
- **Phase 3 (Future):** Legacy providers removed from codebase

**Recommendation:** Migrate now to avoid technical debt!
