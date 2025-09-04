/**
 * 🔌 INTEGRAÇÃO DO EDITOR NOCODE
 * 
 * Componente de integração que conecta o sistema NOCODE
 * com o editor principal
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Eye, Code } from 'lucide-react';
import { UniversalNoCodePanel } from './UniversalNoCodePanel';
import { NoCodePropertiesPanelClean } from './NoCodePropertiesPanelClean';
import type { Block } from '@/types/editor';

interface NoCodeEditorIntegrationProps {
  selectedBlock?: Block | null;
  activeStageId: string;
  onUpdate: (blockId: string, updates: Record<string, any>) => void;
  onDuplicate?: (blockId: string) => void;
  onDelete?: (blockId: string) => void;
  className?: string;
}

export const NoCodeEditorIntegration: React.FC<NoCodeEditorIntegrationProps> = ({
  selectedBlock,
  activeStageId,
  onUpdate,
  onDuplicate,
  onDelete,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'simple' | 'advanced'>('simple');

  const handleUpdate = (blockId: string, updates: Record<string, any>) => {
    console.log('🔄 NoCode Update:', { blockId, updates });
    onUpdate(blockId, updates);
  };

  const handleReset = (blockId: string) => {
    console.log('🔄 NoCode Reset:', blockId);
  };

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Propriedades NOCODE
          </h3>
          <Badge variant="secondary">{activeStageId}</Badge>
        </div>
        
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="simple" className="text-xs">
              <Eye className="w-3 h-3 mr-1" />
              Simples
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs">
              <Code className="w-3 h-3 mr-1" />
              Avançado
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'simple' ? (
          <NoCodePropertiesPanelClean
            selectedBlock={selectedBlock}
            activeStageId={activeStageId}
            onUpdate={handleUpdate}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            onReset={handleReset}
          />
        ) : (
          <UniversalNoCodePanel
            selectedBlock={selectedBlock}
            activeStageId={activeStageId}
            onUpdate={handleUpdate}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            onReset={handleReset}
          />
        )}
      </div>
    </Card>
  );
};

export default NoCodeEditorIntegration;