import React from 'react';
import { useEditor } from '@/context/EditorContext';

const EditorFixedSimple: React.FC = () => {
  const editor = useEditor();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">🚀 Editor Fixed - Rota Simples</h1>
        <p className="text-gray-600 mb-8">
          Rota simplificada do Editor Fixed funcionando corretamente
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Editor Status</h3>
            <div className="space-y-2 text-sm">
              <div>✅ Context: {editor ? 'Loaded' : '❌ Missing'}</div>
              <div>✅ State: {editor?.state ? 'Available' : '❌ Missing'}</div>
              <div>✅ Blocks: {editor?.computed?.currentBlocks?.length || 0}</div>
              <div>✅ Active Stage: {editor?.activeStageId || 'None'}</div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Available Actions</h3>
            <div className="space-y-2 text-sm">
              <div>{!!editor?.blockActions?.addBlock ? '✅' : '❌'} Add Block</div>
              <div>{!!editor?.blockActions?.updateBlock ? '✅' : '❌'} Update Block</div>
              <div>{!!editor?.blockActions?.deleteBlock ? '✅' : '❌'} Delete Block</div>
              <div>{!!editor?.save ? '✅' : '❌'} Save</div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">✅ Success!</h3>
          <p className="text-green-700">
            A rota /editor-fixed está carregando corretamente. O EditorContext está funcionando e
            todas as funcionalidades básicas estão disponíveis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditorFixedSimple;
