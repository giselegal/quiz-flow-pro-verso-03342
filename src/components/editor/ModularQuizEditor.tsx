
import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ComponentsSidebar } from '@/components/result-editor/ComponentsSidebar';
import { EditorPreview } from '@/components/result-editor/EditorPreview';
import { PropertiesPanel } from '@/components/result-editor/PropertiesPanel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Tablet, Monitor, Save, Eye, RotateCcw } from 'lucide-react';

export interface ModularQuizEditorProps {
  onSave?: () => void;
  onPreview?: () => void;
  onReset?: () => void;
  initialConfig?: any;
  selectedStyle?: string;
}

export const ModularQuizEditor: React.FC<ModularQuizEditorProps> = ({
  onSave,
  onPreview,
  onReset,
  initialConfig,
  selectedStyle = 'natural'
}) => {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const handleComponentSelect = (componentId: string) => {
    setSelectedBlockId(componentId);
  };

  const handleBlockAdd = (blockType: string) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      content: {},
      properties: {}
    };
    setBlocks(prev => [...prev, newBlock]);
  };

  const handleBlockUpdate = (blockId: string, updates: any) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, content: { ...block.content, ...updates } }
        : block
    ));
  };

  const handleBlockDelete = (blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    setSelectedBlockId(null);
  };

  const handleBlockReorder = (sourceIndex: number, destinationIndex: number) => {
    setBlocks(prev => {
      const newBlocks = [...prev];
      const [removed] = newBlocks.splice(sourceIndex, 1);
      newBlocks.splice(destinationIndex, 0, removed);
      return newBlocks;
    });
  };

  const handleDeviceChange = (device: 'mobile' | 'tablet' | 'desktop') => {
    setDeviceView(device);
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  const handlePreview = () => {
    setIsPreviewing(!isPreviewing);
    if (onPreview) {
      onPreview();
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Quiz Editor</h1>
            <Badge variant="secondary">{selectedStyle}</Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Device selector */}
            <div className="flex items-center space-x-2">
              <Button
                variant={deviceView === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDeviceChange('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
              <Button
                variant={deviceView === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDeviceChange('tablet')}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={deviceView === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDeviceChange('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
            </div>

            {/* Action buttons */}
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handlePreview} variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              {isPreviewing ? 'Edit' : 'Preview'}
            </Button>
            <Button onClick={handleSave} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main editor */}
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <ComponentsSidebar onComponentSelect={handleBlockAdd} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={55}>
          <EditorPreview
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            isPreviewing={isPreviewing}
            primaryStyle={selectedStyle}
            onReorderBlocks={handleBlockReorder}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={25}>
          <PropertiesPanel
            selectedBlockId={selectedBlockId}
            blocks={blocks}
            onClose={() => setSelectedBlockId(null)}
            onUpdate={handleBlockUpdate}
            onDelete={handleBlockDelete}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ModularQuizEditor;
