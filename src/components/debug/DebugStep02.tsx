import { useEditor } from '@/components/editor/EditorProvider';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import React from 'react';

const DebugStep02: React.FC = () => {
  const { state, actions } = useEditor();
  const computed = { currentBlocks: [], selectedBlock: { id: 'mock-id' } };
  const stageActions = { setActiveStage: () => {} };
  const blockActions = { addBlock: async (type: string) => 'new-id' };
  const activeStageId = 'step-1';

  // Obtém o template da etapa 2 do template completo
  const step02Template = QUIZ_STYLE_21_STEPS_TEMPLATE['step-2'] || [];
  const optionsBlock = step02Template.find(block => block.type === 'options-grid');

  const debugInfo = {
    template: {
      totalBlocks: step02Template.length,
      hasOptionsBlock: !!optionsBlock,
      optionsCount: optionsBlock?.properties?.options?.length || 0,
    },
    editor: {
      currentBlocks: computed?.currentBlocks?.length || 0,
      selectedBlock: computed?.selectedBlock?.id || 'none',
      activeStageId: activeStageId || 'none',
      hasStageActions: !!stageActions,
      hasBlockActions: !!blockActions,
    },
  };

  const handleLoadStep02 = () => {
    if (blockActions?.addBlock) {
      step02Template.forEach(async (block: any) => {
        try {
          await blockActions.addBlock(block.type);
          console.log(`✅ Added block: ${block.type}`);
        } catch (error) {
          console.error(`❌ Failed to add block ${block.type}:`, error);
        }
      });
    }
  };

  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-[#432818]">🧪 Debug Step 02</h2>

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Template Info:</h3>
          <pre className="text-sm">{JSON.stringify(debugInfo.template, null, 2)}</pre>
        </div>

        <div className="bg-green-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Editor State:</h3>
          <pre className="text-sm">{JSON.stringify(debugInfo.editor, null, 2)}</pre>
        </div>

        <div className="bg-yellow-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Actions:</h3>
          <button
            onClick={handleLoadStep02}
            className="px-4 py-2 bg-[#B89B7A] text-white rounded hover:bg-[#A38A69]"
          >
            Load Step 02 Template
          </button>
        </div>

        {optionsBlock && (
          <div className="bg-purple-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Options Block:</h3>
            <p>Type: {optionsBlock.type}</p>
            <p>Options: {optionsBlock.properties?.options?.length || 0}</p>
            <div className="mt-2 max-h-32 overflow-y-auto">
              <pre className="text-xs">
                {JSON.stringify(optionsBlock.properties?.options?.[0], null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugStep02;
