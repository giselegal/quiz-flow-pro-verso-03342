
import React, { useState, useCallback } from 'react';
import { EditorBlock } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { EditorToolbar } from './toolbar/EditorToolbar';
import PropertiesPanel from './properties/PropertiesPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EnhancedEditorProps {
  blocks: EditorBlock[];
  selectedBlockId: string | null;
  onBlockSelect: (blockId: string) => void;
  onBlockUpdate: (blockId: string, updates: Partial<EditorBlock>) => void;
  onBlockDelete: (blockId: string) => void;
  onBlockAdd: (type: string) => void;
  onSave: () => void;
  onPublish?: () => void;
  isPreviewing: boolean;
  onTogglePreview: () => void;
  canSave: boolean;
  canPublish?: boolean;
}

export const EnhancedEditor: React.FC<EnhancedEditorProps> = ({
  blocks,
  selectedBlockId,
  onBlockSelect,
  onBlockUpdate,
  onBlockDelete,
  onBlockAdd,
  onSave,
  onPublish,
  isPreviewing,
  onTogglePreview,
  canSave,
  canPublish = false
}) => {
  const [activeTab, setActiveTab] = useState('editor');
  
  const selectedBlock = blocks.find(block => block.id === selectedBlockId);

  const handleClose = useCallback(() => {
    onBlockSelect('');
  }, [onBlockSelect]);

  const handleUpdateComponent = useCallback((componentId: string, newData: Partial<EditorBlock>) => {
    onBlockUpdate(componentId, newData);
  }, [onBlockUpdate]);

  const handleDeleteComponent = useCallback((componentId: string) => {
    onBlockDelete(componentId);
  }, [onBlockDelete]);

  const blockTypes = [
    { type: 'text', label: 'Text', icon: '📝' },
    { type: 'image', label: 'Image', icon: '🖼️' },
    { type: 'button', label: 'Button', icon: '🔘' },
    { type: 'header', label: 'Header', icon: '📄' },
    { type: 'spacer', label: 'Spacer', icon: '⬜' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Page Editor</h2>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-4">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="flex-1 p-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3">Add Components</h3>
                <div className="grid grid-cols-2 gap-2">
                  {blockTypes.map(({ type, label, icon }) => (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      onClick={() => onBlockAdd(type)}
                      className="h-12 flex flex-col items-center gap-1"
                    >
                      <span className="text-lg">{icon}</span>
                      <span className="text-xs">{label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Page Structure</h3>
                <div className="space-y-2">
                  {blocks.map((block, index) => (
                    <Card
                      key={block.id}
                      className={`cursor-pointer transition-colors ${
                        selectedBlockId === block.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => onBlockSelect(block.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {block.type}
                            </Badge>
                            <span className="text-sm font-medium">
                              {block.content.title || block.content.text || `Block ${index + 1}`}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onBlockDelete(block.id);
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="properties" className="flex-1 p-4">
            {selectedBlock ? (
              <PropertiesPanel
                selectedComponent={selectedBlock}
                onUpdateComponent={handleUpdateComponent}
                onDeleteComponent={handleDeleteComponent}
              />
            ) : (
              <div className="text-center text-gray-500 py-8">
                Select a component to edit its properties
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <EditorToolbar
          onSave={onSave}
          canSave={canSave}
          isPreviewing={isPreviewing}
          onTogglePreview={onTogglePreview}
        />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-8">
            {blocks.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <p>No components added yet.</p>
                <p className="text-sm">Use the sidebar to add components to your page.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {blocks.map((block) => (
                  <div
                    key={block.id}
                    className={`border rounded-lg p-4 ${
                      selectedBlockId === block.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => onBlockSelect(block.id)}
                  >
                    <div className="text-sm text-gray-500 mb-2">{block.type}</div>
                    <div>{JSON.stringify(block.content)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedEditor;
