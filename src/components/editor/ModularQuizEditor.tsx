import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Eye, EyeOff, Settings, Save, Smartphone, Tablet, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EditorBlock } from '@/types/editor';

interface ModularQuizEditorProps {
  onSave?: (blocks: EditorBlock[]) => void;
  initialBlocks?: EditorBlock[];
}

export const ModularQuizEditor: React.FC<ModularQuizEditorProps> = ({
  onSave,
  initialBlocks = []
}) => {
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    // Load initial blocks if provided
    if (initialBlocks && initialBlocks.length > 0) {
      setBlocks(initialBlocks);
    }
  }, [initialBlocks]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const reorderedBlocks = Array.from(blocks);
    const [movedBlock] = reorderedBlocks.splice(result.source.index, 1);
    reorderedBlocks.splice(result.destination.index, 0, movedBlock);

    setBlocks(reorderedBlocks);
  };

  const handleAddBlock = (type: string) => {
    const newBlock: EditorBlock = {
      id: Date.now().toString(),
      type: type,
      content: {},
      order: blocks.length,
    };

    setBlocks([...blocks, newBlock]);
  };

  const handleUpdateBlock = (id: string, updates: any) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === id ? { ...block, content: { ...block.content, ...updates } } : block
    );
    setBlocks(updatedBlocks);
  };

  const handleDeleteBlock = (id: string) => {
    const updatedBlocks = blocks.filter((block) => block.id !== id);
    setBlocks(updatedBlocks);
  };

  const renderBlockEditor = (block: EditorBlock) => {
    // Basic block editor - can be expanded with more sophisticated editing
    return (
      <div className="p-4 border rounded-lg bg-white">
        <div className="text-sm font-medium text-gray-600 mb-2">
          {block.type}
        </div>
        <div className="space-y-2">
          {block.content?.title !== undefined && (
            <div>
              <Label htmlFor={`title-${block.id}`}>Title</Label>
              <Input
                id={`title-${block.id}`}
                value={block.content.title || ''}
                onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                placeholder="Enter title"
              />
            </div>
          )}
          {block.content?.text !== undefined && (
            <div>
              <Label htmlFor={`text-${block.id}`}>Text</Label>
              <Textarea
                id={`text-${block.id}`}
                value={block.content.text || ''}
                onChange={(e) => handleUpdateBlock(block.id, { text: e.target.value })}
                placeholder="Enter text"
                rows={3}
              />
            </div>
          )}
          {block.content?.imageUrl !== undefined && (
            <div>
              <Label htmlFor={`image-${block.id}`}>Image URL</Label>
              <Input
                id={`image-${block.id}`}
                value={block.content.imageUrl || ''}
                onChange={(e) => handleUpdateBlock(block.id, { imageUrl: e.target.value })}
                placeholder="Enter image URL"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBlockPreview = (block: EditorBlock) => {
    switch (block.type) {
      case 'header':
        return (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">{block.content?.title || 'Header'}</h1>
            {block.content?.subtitle && (
              <p className="text-xl text-gray-600">{block.content.subtitle}</p>
            )}
          </div>
        );
      case 'text':
        return (
          <div className="mb-6">
            <p className="text-gray-800">{block.content?.text || 'Text content'}</p>
          </div>
        );
      case 'image':
        return (
          <div className="mb-6">
            <img
              src={block.content?.imageUrl || '/placeholder.jpg'}
              alt={block.content?.alt || 'Image'}
              className="w-full h-auto rounded-lg"
            />
          </div>
        );
      case 'button':
        return (
          <div className="mb-6">
            <Button className="w-full">
              {block.content?.text || 'Button'}
            </Button>
          </div>
        );
      default:
        return (
          <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
            {block.type} block
          </div>
        );
    }
  };

  const getDeviceClass = () => {
    switch (devicePreview) {
      case 'mobile':
        return 'max-w-sm';
      case 'tablet':
        return 'max-w-md';
      case 'desktop':
      default:
        return 'max-w-4xl';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
          
          {isPreview && (
            <Select value={devicePreview} onValueChange={(value: 'desktop' | 'tablet' | 'mobile') => setDevicePreview(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desktop">
                  <Monitor className="w-4 h-4 mr-2" />
                  Desktop
                </SelectItem>
                <SelectItem value="tablet">
                  <Tablet className="w-4 h-4 mr-2" />
                  Tablet
                </SelectItem>
                <SelectItem value="mobile">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Mobile
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log('Settings')}
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => onSave?.(blocks)}
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {!isPreview && (
          <>
            {/* Left sidebar - Components */}
            <div className="w-64 border-r bg-gray-50 p-4">
              <h3 className="font-medium mb-4">Components</h3>
              <div className="space-y-2">
                {[
                  { type: 'header', label: 'Header' },
                  { type: 'text', label: 'Text' },
                  { type: 'image', label: 'Image' },
                  { type: 'button', label: 'Button' },
                  { type: 'spacer', label: 'Spacer' },
                ].map(({ type, label }) => (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleAddBlock(type)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Main editor area */}
            <div className="flex-1 p-4">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="blocks">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {blocks.map((block, index) => (
                        <Draggable
                          key={block.id}
                          draggableId={block.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`cursor-move ${
                                selectedBlockId === block.id ? 'ring-2 ring-blue-500' : ''
                              }`}
                              onClick={() => setSelectedBlockId(block.id)}
                            >
                              {renderBlockEditor(block)}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            {/* Right sidebar - Properties */}
            <div className="w-64 border-l bg-white p-4">
              <h3 className="font-medium mb-4">Properties</h3>
              {selectedBlockId ? (
                <div className="space-y-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteBlock(selectedBlockId)}
                  >
                    Delete Block
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Select a block to edit its properties</p>
              )}
            </div>
          </>
        )}

        {/* Preview mode */}
        {isPreview && (
          <div className="flex-1 p-8 bg-gray-50 overflow-auto">
            <div className={`mx-auto bg-white rounded-lg shadow-lg p-8 ${getDeviceClass()}`}>
              {blocks.map((block) => (
                <div key={block.id}>
                  {renderBlockPreview(block)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModularQuizEditor;
