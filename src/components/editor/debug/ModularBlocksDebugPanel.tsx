import React from 'react';
import { useEditor } from '@/components/editor/EditorProviderMigrationAdapter';

export function ModularBlocksDebugPanel() {
  const editor = useEditor({ optional: true });
  
  if (!editor) return null;
  
  const { stepBlocks, currentStep } = editor.state;
  const currentStepKey = `step-${currentStep}`;
  const currentBlocks = stepBlocks[currentStepKey] || [];
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <div className="font-bold mb-2">🔧 Modular Blocks Debug</div>
      <div>Current Step: {currentStepKey}</div>
      <div>Blocks Loaded: {currentBlocks.length}</div>
      {currentBlocks.length > 0 && (
        <div className="mt-2 max-h-48 overflow-auto">
          {currentBlocks.map((b: any) => (
            <div key={b.id} className="text-xs opacity-75 py-1">
              • {b.type} ({b.id?.slice(0, 8)})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
