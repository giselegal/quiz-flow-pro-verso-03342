/**
 * 🎨 PROPERTIES COLUMN WITH JSON EDITOR
 * 
 * Wrapper que adiciona funcionalidade de edição JSON ao PropertiesColumn
 * mantendo as 4 colunas originais do editor
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileJson, Settings } from 'lucide-react';
import { JsonTemplateEditor } from '@/components/editor/JsonEditor';
import type { Block } from '@/types/editor';

// Import do componente original
import PropertiesColumn from './index';

interface PropertiesColumnWithJsonProps {
  selectedBlock?: Block | undefined;
  onBlockUpdate: (blockId: string, updates: Partial<Block>) => void;
  onClearSelection: () => void;
  blocks?: Block[] | null;
  onBlockSelect?: (blockId: string) => void;
  
  // Props para o editor JSON
  fullTemplate?: any;
  onTemplateChange?: (template: any) => void;
  templateId?: string;
}

export function PropertiesColumnWithJson({
  selectedBlock,
  onBlockUpdate,
  onClearSelection,
  blocks,
  onBlockSelect,
  fullTemplate,
  onTemplateChange,
  templateId
}: PropertiesColumnWithJsonProps) {
  const [activeTab, setActiveTab] = useState<'properties' | 'json'>('properties');
  
  return (
    <div className="h-full flex flex-col bg-background border-l">
      {/* Tabs Header */}
      <div className="border-b px-2 py-2 bg-muted/30">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-9">
            <TabsTrigger value="properties" className="text-xs">
              <Settings className="h-3.5 w-3.5 mr-1.5" />
              Propriedades
            </TabsTrigger>
            <TabsTrigger value="json" className="text-xs">
              <FileJson className="h-3.5 w-3.5 mr-1.5" />
              JSON
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'properties' ? (
          <PropertiesColumn
            selectedBlock={selectedBlock}
            onBlockUpdate={onBlockUpdate}
            onClearSelection={onClearSelection}
            blocks={blocks}
            onBlockSelect={onBlockSelect}
          />
        ) : (
          <div className="h-full overflow-y-auto p-4">
            <JsonTemplateEditor
              template={fullTemplate}
              onTemplateChange={onTemplateChange}
              templateId={templateId}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertiesColumnWithJson;
