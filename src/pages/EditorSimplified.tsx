/**
 * 🎯 SIMPLIFIED EDITOR - Test modular blocks rendering
 */

import React from 'react';
import { EditorProviderUnified, useEditor } from '@/components/editor/EditorProviderUnified';
import { Button } from '@/components/ui/button';

const EditorContent: React.FC = () => {
  const editor = useEditor();
  
  console.log('✅ EditorContent rendering', { editor });
  
  const handleLoadStep = () => {
    console.log('🔄 Loading step-12');
    editor.actions.ensureStepLoaded('step-12');
  };
  
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Simplified Editor</h1>
        
        <div className="p-4 border rounded-lg space-y-2">
          <h2 className="text-xl font-semibold">Current State</h2>
          <pre className="text-xs bg-muted p-2 rounded overflow-auto">
            {JSON.stringify({
              currentStep: editor.state.currentStep,
              blockCount: Object.keys(editor.state.stepBlocks).length,
              selectedBlockId: editor.state.selectedBlockId,
            }, null, 2)}
          </pre>
        </div>

        <div className="p-4 border rounded-lg space-y-2">
          <h2 className="text-xl font-semibold">Actions</h2>
          <div className="flex gap-2">
            <Button onClick={handleLoadStep}>
              Load Step 12 (Modular)
            </Button>
            <Button onClick={() => editor.actions.setCurrentStep(12)}>
              Navigate to Step 12
            </Button>
          </div>
        </div>

        <div className="p-4 border rounded-lg space-y-2">
          <h2 className="text-xl font-semibold">Step Blocks</h2>
          {Object.entries(editor.state.stepBlocks).map(([stepKey, blocks]) => (
            <div key={stepKey} className="p-2 bg-muted rounded">
              <p className="font-semibold">{stepKey}: {blocks.length} blocks</p>
              <pre className="text-xs overflow-auto max-h-32">
                {JSON.stringify(blocks, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const EditorSimplified: React.FC = () => {
  console.log('✅ EditorSimplified: Rendering');
  
  return (
    <EditorProviderUnified enableSupabase={true}>
      <EditorContent />
    </EditorProviderUnified>
  );
};

export default EditorSimplified;
