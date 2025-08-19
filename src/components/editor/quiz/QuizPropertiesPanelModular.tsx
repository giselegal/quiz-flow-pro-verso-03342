/**
 * 📝 QUIZ PROPERTIES PANEL MODULAR - IMPLEMENTAÇÃO COMPLETA
 *
 * Painel de propriedades funcional com scroll para o sistema de quiz
 */

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EditorPropertiesPanel } from '@/components/editor/unified/EditorPropertiesPanel';

export interface QuizPropertiesPanelModularProps {
  blockId?: string;
  selectedBlock?: any;
  onClose?: () => void;
  onUpdate?: (blockId: string, updates: any) => void;
}

export const QuizPropertiesPanelModular: React.FC<QuizPropertiesPanelModularProps> = ({
  selectedBlock,
  onClose,
  onUpdate,
}) => {
  return (
    <div className="h-full w-full flex flex-col bg-background border-l">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium text-gray-800">
          Propriedades do Quiz
        </h3>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg font-bold w-6 h-6 flex items-center justify-center"
          >
            ×
          </button>
        )}
      </div>
      
      {/* Conteúdo com scroll */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {selectedBlock ? (
            <EditorPropertiesPanel
              selectedBlock={selectedBlock}
              onBlockUpdate={onUpdate || (() => {})}
              onBlockDelete={(id) => console.log('Delete:', id)}
              onBlockDuplicate={(id) => console.log('Duplicate:', id)}
              previewMode={false}
            />
          ) : (
            <div className="text-center text-gray-500 py-8">
              <div className="mb-4">
                <svg className="w-12 h-12 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <p className="text-sm">
                Selecione um bloco para editar suas propriedades
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default QuizPropertiesPanelModular;
