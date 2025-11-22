# Phase 3.2: QuizModularEditor Refactoring Guide

## 🎯 Objective
Split QuizModularEditor (1923 lines) into smaller, maintainable pieces:
- Main file: ~300 lines (orchestration only)
- Custom hooks: 4-5 files (~500 lines total)
- Sub-components: 4-5 files (~800 lines total)

## 📊 Current State
- **File:** `src/components/editor/quiz/QuizModularEditor/index.tsx`
- **Lines:** 1923
- **Complexity:** 
  - 27 useCallbacks
  - 19 useEffects
  - 67 lines of imports
  - 580 lines of handlers
  - 450 lines of UI state management

## 🏗️ Proposed Structure

```
src/components/editor/quiz/QuizModularEditor/
├── index.tsx                      (300 lines - orchestration)
├── hooks/
│   ├── useEditorState.ts         (150 lines - state management)
│   ├── useStepNavigation.ts      (120 lines - step navigation)
│   ├── useBlockManagement.ts     (200 lines - block CRUD)
│   └── useAutosave.ts            (80 lines - autosave logic)
├── components/
│   ├── EditorToolbar.tsx         (150 lines - top toolbar)
│   ├── StepNavigator.tsx         (200 lines - step list)
│   ├── CanvasArea.tsx            (250 lines - main canvas)
│   └── PropertiesPanel.tsx       (existing)
└── utils/
    ├── templateHelpers.ts        (100 lines - template utils)
    └── validationHelpers.ts      (80 lines - validation)
```

## 📝 Step-by-Step Refactoring Plan

### Step 1: Extract Custom Hooks

#### 1.1 useEditorState.ts
Extract state management logic:
- `currentStep`, `setCurrentStep`
- `blocks`, `setBlocks`
- `selectedBlockId`, `setSelectedBlockId`
- `isDirty`, `setIsDirty`
- `validationErrors`, `setValidationErrors`

```typescript
export function useEditorState(initialFunnelId?: string) {
  const [currentStep, setCurrentStep] = useState(1);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  
  // ... state logic
  
  return {
    currentStep,
    setCurrentStep,
    blocks,
    setBlocks,
    selectedBlockId,
    setSelectedBlockId,
    isDirty,
    setIsDirty,
    validationErrors,
    setValidationErrors,
  };
}
```

#### 1.2 useStepNavigation.ts
Extract navigation logic:
- `handleSelectStep`
- `handleNextStep`
- `handlePrevStep`
- `prefetchAdjacentSteps`

```typescript
export function useStepNavigation(currentStep: number, onStepChange: (step: number) => void) {
  const handleSelectStep = useCallback((step: number) => {
    // ... navigation logic
    onStepChange(step);
  }, [onStepChange]);
  
  const handleNextStep = useCallback(() => {
    if (currentStep < 21) handleSelectStep(currentStep + 1);
  }, [currentStep, handleSelectStep]);
  
  const handlePrevStep = useCallback(() => {
    if (currentStep > 1) handleSelectStep(currentStep - 1);
  }, [currentStep, handleSelectStep]);
  
  return { handleSelectStep, handleNextStep, handlePrevStep };
}
```

#### 1.3 useBlockManagement.ts
Extract block manipulation:
- `handleAddBlock`
- `handleUpdateBlock`
- `handleRemoveBlock`
- `handleReorderBlocks`
- `handleDuplicateBlock`
- `handleBlockSelect`

```typescript
export function useBlockManagement(
  blocks: Block[],
  onBlocksChange: (blocks: Block[]) => void
) {
  const handleAddBlock = useCallback((type: string, position?: number) => {
    const newBlock = createBlock(type);
    const updated = [...blocks];
    if (position !== undefined) {
      updated.splice(position, 0, newBlock);
    } else {
      updated.push(newBlock);
    }
    onBlocksChange(updated);
  }, [blocks, onBlocksChange]);
  
  const handleUpdateBlock = useCallback((blockId: string, updates: Partial<Block>) => {
    const updated = blocks.map(b => 
      b.id === blockId ? { ...b, ...updates } : b
    );
    onBlocksChange(updated);
  }, [blocks, onBlocksChange]);
  
  // ... more handlers
  
  return {
    handleAddBlock,
    handleUpdateBlock,
    handleRemoveBlock,
    handleReorderBlocks,
    handleDuplicateBlock,
  };
}
```

#### 1.4 useAutosave.ts
Extract autosave logic (if not using existing hook):
- Debounced save
- Conflict detection
- Save status indicator

### Step 2: Extract Sub-components

#### 2.1 EditorToolbar.tsx
Extract toolbar UI:
- Mode toggle (Canvas/Preview)
- Action buttons (Save, Export, Import)
- Undo/Redo buttons
- Validation indicator

```typescript
interface EditorToolbarProps {
  mode: 'canvas' | 'preview';
  onModeChange: (mode: 'canvas' | 'preview') => void;
  onSave: () => void;
  onExport: () => void;
  onImport: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isDirty: boolean;
  validationErrors: any[];
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ ... }) => {
  return (
    <div className="editor-toolbar">
      {/* toolbar content */}
    </div>
  );
};
```

#### 2.2 StepNavigator.tsx
Extract step list/navigation:
- Step list with current indicator
- Step validation status
- Quick navigation

#### 2.3 CanvasArea.tsx
Extract canvas rendering:
- Block list
- Drag-drop context
- Empty state
- Performance monitor

### Step 3: Update Main Index

After extraction, main `index.tsx` should only:
1. Import hooks and components
2. Wire them together
3. Provide context
4. Handle high-level coordination

```typescript
export const QuizModularEditor: React.FC<Props> = ({ funnelId }) => {
  // Use extracted hooks
  const editorState = useEditorState(funnelId);
  const navigation = useStepNavigation(editorState.currentStep, editorState.setCurrentStep);
  const blockMgmt = useBlockManagement(editorState.blocks, editorState.setBlocks);
  const autosave = useAutosave(editorState.blocks, editorState.isDirty);
  
  return (
    <EditorLoadingProvider>
      <SafeDndContext>
        <div className="editor-container">
          <EditorToolbar
            mode={mode}
            onModeChange={setMode}
            onSave={autosave.save}
            isDirty={editorState.isDirty}
            validationErrors={editorState.validationErrors}
          />
          
          <PanelGroup direction="horizontal">
            <Panel defaultSize={15}>
              <StepNavigator
                currentStep={editorState.currentStep}
                onStepSelect={navigation.handleSelectStep}
              />
            </Panel>
            
            <Panel defaultSize={55}>
              <CanvasArea
                blocks={editorState.blocks}
                selectedBlockId={editorState.selectedBlockId}
                onBlockSelect={blockMgmt.handleBlockSelect}
                onBlockUpdate={blockMgmt.handleUpdateBlock}
              />
            </Panel>
            
            <Panel defaultSize={30}>
              <PropertiesPanel
                selectedBlock={selectedBlock}
                onBlockUpdate={blockMgmt.handleUpdateBlock}
              />
            </Panel>
          </PanelGroup>
        </div>
      </SafeDndContext>
    </EditorLoadingProvider>
  );
};
```

## ⚠️ Important Considerations

### 1. Testing Strategy
- Write tests for each extracted hook BEFORE extraction
- Integration tests for main component
- Visual regression tests for UI components

### 2. Backward Compatibility
- Keep old component working during migration
- Use feature flags to toggle between old/new
- Deploy gradually with monitoring

### 3. Performance
- Measure before and after
- Ensure hooks don't cause extra re-renders
- Profile component re-renders

### 4. Type Safety
- Strong TypeScript interfaces for all hooks
- Shared types in dedicated file
- No `any` types

## 📋 Checklist

- [ ] Create tests for existing functionality
- [ ] Extract useEditorState hook
- [ ] Extract useStepNavigation hook
- [ ] Extract useBlockManagement hook
- [ ] Extract useAutosave hook (or reuse existing)
- [ ] Create EditorToolbar component
- [ ] Create StepNavigator component
- [ ] Create CanvasArea component
- [ ] Update main index.tsx to use extracted pieces
- [ ] Run tests and verify functionality
- [ ] Performance testing
- [ ] Code review
- [ ] Deploy with monitoring

## 🎯 Success Metrics

**Before:**
- Main file: 1923 lines
- Cyclomatic complexity: 85
- Average function length: 45 lines
- HMR time: 4.8s

**After (Target):**
- Main file: <300 lines (-84%)
- Cyclomatic complexity: <20 (-76%)
- Average function length: <15 lines (-67%)
- HMR time: <2s (-58%)

## 📚 References

- [React Custom Hooks Best Practices](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Component Composition Patterns](https://react.dev/learn/passing-props-to-a-component)
- [Code Splitting in React](https://react.dev/reference/react/lazy)
