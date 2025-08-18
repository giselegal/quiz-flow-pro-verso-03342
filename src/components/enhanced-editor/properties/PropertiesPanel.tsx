import { Block } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PropertiesPanelProps {
  selectedBlock: Block | null;
  blocks?: Block[];
  onClose: () => void;
  onUpdate: (content: Partial<any>) => void;
  onDelete: () => void;
  isMobile?: boolean;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedBlock,
  onClose,
  onUpdate,
  onDelete,
}) => {
  if (!selectedBlock) {
    return (
      <div style={{ backgroundColor: '#FAF9F7' }}>
        <h3 className="text-lg font-semibold mb-4">Properties</h3>
        <p style={{ color: '#8B7355' }}>Select a block to edit its properties</p>
      </div>
    );
  }

  const handleContentUpdate = (key: string, value: any) => {
    onUpdate({
      content: {
        ...selectedBlock.content,
        [key]: value,
      },
    });
  };

  return (
    <div style={{ backgroundColor: '#FAF9F7' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Properties</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ×
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Block Type</Label>
          <div style={{ color: '#6B4F43' }}>{selectedBlock.type}</div>
        </div>

        {selectedBlock.type === 'text' && (
          <div>
            <Label htmlFor="text">Text Content</Label>
            <Textarea
              id="text"
              value={selectedBlock.content?.text || ''}
              onChange={e => handleContentUpdate('text', e.target.value)}
              placeholder="Enter text content..."
            />
          </div>
        )}

        {selectedBlock.type === 'header' && (
          <>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={selectedBlock.content?.title || ''}
                onChange={e => handleContentUpdate('title', e.target.value)}
                placeholder="Enter title..."
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={selectedBlock.content?.subtitle || ''}
                onChange={e => handleContentUpdate('subtitle', e.target.value)}
                placeholder="Enter subtitle..."
              />
            </div>
          </>
        )}

        {selectedBlock.type === 'image' && (
          <>
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={selectedBlock.content?.imageUrl || ''}
                onChange={e => handleContentUpdate('imageUrl', e.target.value)}
                placeholder="Enter image URL..."
              />
            </div>
            <div>
              <Label htmlFor="imageAlt">Alt Text</Label>
              <Input
                id="imageAlt"
                value={selectedBlock.content?.imageAlt || ''}
                onChange={e => handleContentUpdate('imageAlt', e.target.value)}
                placeholder="Enter alt text..."
              />
            </div>
          </>
        )}

        <div className="pt-4 border-t">
          <Button variant="destructive" size="sm" onClick={onDelete} className="w-full">
            Delete Block
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
