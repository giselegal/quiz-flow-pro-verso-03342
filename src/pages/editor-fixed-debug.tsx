/**
 * 🔧 DEBUG: Editor Fixed Debug Component
 * Componente de debug para verificar problemas na rota /editor-fixed
 */

import { useEditor } from '@/context/EditorContext';
import React, { useEffect } from 'react';

const EditorFixedDebug: React.FC = () => {
  const editor = useEditor();

  useEffect(() => {
    console.log('🔧 DEBUG Editor Fixed:', {
      editor,
      state: editor?.state,
      funnelId: editor?.funnelId,
      hasAddBlock: !!editor?.addBlock,
      hasUpdateBlock: !!editor?.updateBlock,
      hasDeleteBlock: !!editor?.deleteBlock,
    });
  }, [editor]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">🔧 Editor Fixed Debug</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Editor Context Status</h3>
            <div className="space-y-2 text-sm">
              <div>✅ Editor Context: {editor ? 'Available' : '❌ Missing'}</div>
              <div>✅ State: {editor?.state ? 'Available' : '❌ Missing'}</div>
              <div>✅ FunnelId: {editor?.funnelId || 'default'}</div>
              <div>✅ Blocks Count: {editor?.state?.blocks?.length || 0}</div>
              <div>✅ Selected Block: {editor?.state?.selectedBlockId || 'None'}</div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Available Methods</h3>
            <div className="space-y-2 text-sm">
              <div>{editor?.addBlock ? '✅' : '❌'} addBlock</div>
              <div>{editor?.updateBlock ? '✅' : '❌'} updateBlock</div>
              <div>{editor?.deleteBlock ? '✅' : '❌'} deleteBlock</div>
              <div>{editor?.selectBlock ? '✅' : '❌'} selectBlock</div>
              <div>{editor?.save ? '✅' : '❌'} save</div>
              <div>{editor?.togglePreview ? '✅' : '❌'} togglePreview</div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">URL Parameters</h3>
            <div className="space-y-2 text-sm">
              {(() => {
                const urlParams = new URLSearchParams(window.location.search);
                const params = {
                  funnelId: urlParams.get('funnelId') || 'Not set',
                  template: urlParams.get('template') || 'Not set',
                  stage: urlParams.get('stage') || 'Not set',
                  preview: urlParams.get('preview') || 'Not set',
                  viewport: urlParams.get('viewport') || 'Not set',
                };

                return Object.entries(params).map(([key, value]) => (
                  <div key={key}>
                    {key}: {value}
                  </div>
                ));
              })()}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  if (editor?.addBlock) {
                    editor.addBlock('text' as any);
                    console.log('🆕 Added text block');
                  } else {
                    console.error('❌ addBlock not available');
                  }
                }}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Test Add Block
              </button>

              <button
                onClick={() => {
                  if (editor?.save) {
                    editor.save();
                    console.log('💾 Save called');
                  } else {
                    console.error('❌ save not available');
                  }
                }}
                className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                Test Save
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Diagnosis</h3>
          <div className="text-sm text-yellow-700">
            {!editor && '❌ EditorContext is not available - Check EditorProvider wrapper'}
            {editor && !editor.state && '❌ Editor state is missing'}
            {editor && editor.state && !editor.addBlock && '❌ Editor methods are missing'}
            {editor &&
              editor.state &&
              editor.addBlock &&
              '✅ Editor appears to be working correctly'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorFixedDebug;
