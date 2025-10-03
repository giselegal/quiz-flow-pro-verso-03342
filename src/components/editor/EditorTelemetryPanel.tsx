import React from 'react';
import { useEditor } from '@/components/editor/EditorProviderMigrationAdapter';

interface EditorTelemetryPanelProps {
  quizId?: string;
}

/**
 * Painel de telemetria simplificado para o editor
 * Exibe informações básicas sobre o estado atual do editor
 */
export const EditorTelemetryPanel: React.FC<EditorTelemetryPanelProps> = ({ quizId }) => {
  const { state } = useEditor();
  
  return (
    <div className="fixed bottom-4 right-4 z-40 bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-xs font-mono max-w-xs overflow-hidden">
      <div className="flex flex-col gap-1">
        <div className="font-semibold text-gray-700 dark:text-gray-300">Editor Telemetria</div>
        <div className="grid grid-cols-2 gap-x-2">
          <span className="text-gray-500 dark:text-gray-400">Quiz ID:</span>
          <span className="truncate">{quizId || 'local'}</span>
          
          <span className="text-gray-500 dark:text-gray-400">Etapa:</span>
          <span>{state.currentStep} / 21</span>
          
          <span className="text-gray-500 dark:text-gray-400">Blocos:</span>
          <span>{Object.values(state.stepBlocks || {}).flat().length}</span>
        </div>
      </div>
    </div>
  );
};