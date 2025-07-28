import * as React from 'react';
import { Button } from '../ui/button';

interface QuickTestProps {
  onAddTestBlock: () => void;
  onTestSave: () => void;
  blocksCount: number;
}

const QuickTest: React.FC<QuickTestProps> = ({
  onAddTestBlock,
  onTestSave,
  blocksCount
}) => {
  return (
    <div className="fixed top-20 right-4 z-40 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg">
      <h3 className="text-sm font-semibold mb-2 text-gray-800">Teste Rápido</h3>
      
      <div className="space-y-2">
        <Button
          onClick={onAddTestBlock}
          size="sm"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          + Adicionar Bloco de Teste
        </Button>
        
        <Button
          onClick={onTestSave}
          size="sm"
          variant="outline"
          className="w-full"
        >
          💾 Testar Salvamento
        </Button>
        
        <div className="text-xs text-gray-600 pt-2 border-t">
          Blocos no canvas: <strong>{blocksCount}</strong>
        </div>
      </div>
    </div>
  );
};

export default QuickTest;
