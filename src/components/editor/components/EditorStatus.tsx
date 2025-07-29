// =====================================================================
// components/editor/components/EditorStatus.tsx - Status do editor
// =====================================================================

import React from 'react';
import { Badge } from '../../ui/badge';
import { Card, CardContent } from '../../ui/card';
import { Separator } from '../../ui/separator';
import { 
  Clock, Save, Eye, Layers, Palette, 
  Target, CheckCircle, AlertCircle 
} from 'lucide-react';

interface EditorStatusProps {
  selectedBlockId?: string;
  historyCount: number;
  currentHistoryIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  lastAction?: string;
  totalBlocks?: number;
  previewMode?: 'desktop' | 'tablet' | 'mobile';
}

export const EditorStatus: React.FC<EditorStatusProps> = ({
  selectedBlockId,
  historyCount,
  currentHistoryIndex,
  canUndo,
  canRedo,
  lastAction,
  totalBlocks = 0,
  previewMode = 'desktop'
}) => {
  const getPreviewIcon = () => {
    switch (previewMode) {
      case 'mobile': return '📱';
      case 'tablet': return '📱';
      default: return '🖥️';
    }
  };

  const getStatusColor = () => {
    if (!selectedBlockId) return 'text-gray-500';
    return 'text-green-600';
  };

  return (
    <Card className="border-0 shadow-none bg-gray-50">
      <CardContent className="p-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            {/* Block Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${selectedBlockId ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className={getStatusColor()}>
                {selectedBlockId ? `Bloco: ${selectedBlockId}` : 'Nenhum bloco selecionado'}
              </span>
            </div>

            <Separator orientation="vertical" className="h-4" />

            {/* Total Blocks */}
            <div className="flex items-center space-x-1 text-gray-600">
              <Layers className="w-3 h-3" />
              <span>{totalBlocks} blocos</span>
            </div>

            <Separator orientation="vertical" className="h-4" />

            {/* Preview Mode */}
            <div className="flex items-center space-x-1 text-gray-600">
              <span>{getPreviewIcon()}</span>
              <span className="capitalize">{previewMode}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Last Action */}
            {lastAction && (
              <>
                <div className="flex items-center space-x-1 text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs truncate max-w-32">{lastAction}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
              </>
            )}

            {/* History Status */}
            <div className="flex items-center space-x-1 text-gray-600">
              <Badge variant="outline" className="text-xs px-2 py-0">
                {currentHistoryIndex + 1}/{historyCount}
              </Badge>
            </div>

            {/* Undo/Redo Status */}
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${canUndo ? 'bg-blue-500' : 'bg-gray-300'}`} 
                   title={canUndo ? 'Desfazer disponível' : 'Nada para desfazer'} />
              <div className={`w-2 h-2 rounded-full ${canRedo ? 'bg-green-500' : 'bg-gray-300'}`}
                   title={canRedo ? 'Refazer disponível' : 'Nada para refazer'} />
            </div>

            {/* Save Status */}
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="w-3 h-3" />
              <span className="text-xs">Salvo</span>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Atalhos: Ctrl+Z (Desfazer) • Ctrl+Y (Refazer) • Del (Excluir)</span>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs px-1 py-0">
                {historyCount} ações
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
