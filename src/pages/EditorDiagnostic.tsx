/**
 * 🔍 DIAGNOSTIC PAGE - Test EditorProviderUnified mounting
 */

import React from 'react';
import { EditorProviderUnified } from '@/components/editor/EditorProviderUnified';

export const EditorDiagnostic: React.FC = () => {
  console.log('🔍 EditorDiagnostic: Rendering');
  
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Editor Diagnostic</h1>
        
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Step 1: Component Loaded</h2>
          <p className="text-green-600">✅ EditorDiagnostic component is rendering</p>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Step 2: Testing EditorProviderUnified</h2>
          <EditorProviderUnified enableSupabase={true}>
            <div className="p-4 bg-green-50 rounded">
              <p className="text-green-700">✅ EditorProviderUnified mounted successfully</p>
            </div>
          </EditorProviderUnified>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Step 3: Ready for QuizModularProductionEditor</h2>
          <p className="text-muted-foreground">
            If you see this message, EditorProviderUnified is working correctly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditorDiagnostic;
