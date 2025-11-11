# Test Refactoring Needed

## EditorProvider.spec.tsx

This test file needs to be refactored to work with the new SuperUnifiedProvider API.

### Changes Needed:

1. **API Structure Change**: The old EditorProviderCanonical had an `actions` and `state` structure, while SuperUnifiedProvider has a flat API with direct methods.

2. **Props Change**: SuperUnifiedProvider doesn't accept `enableSupabase` prop. Need to check available props.

3. **Test Logic**: The test logic needs to be updated to use the new methods directly:
   - Instead of `ctx.actions.addBlockAtIndex`, use `ctx.addBlock`
   - Instead of `ctx.state.blocks`, use `ctx.getStepBlocks`
   - Update all method calls to match the new API

### Current Errors:
- `Property 'actions' does not exist on type 'SuperUnifiedContextType'`
- `Type '{ children: Element; enableSupabase: boolean; }' is not assignable`

### Recommendation:
This test should be rewritten to test the SuperUnifiedProvider's API directly, or a compatibility layer should be added if the old API needs to be maintained for backward compatibility.

## Other Test Files

Similar refactoring may be needed for:
- template-sync-flow.test.ts
- Other integration tests that use the old provider structure
