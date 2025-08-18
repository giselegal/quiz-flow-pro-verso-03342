import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

interface PropertiesPanelProps {
  selectedBlock: any;
  onUpdateBlock: (id: string, updates: any) => void;
  onDeleteBlock: (id: string) => void;
  onClose: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedBlock,
  onUpdateBlock,
  onDeleteBlock,
  onClose,
}) => {
  if (!selectedBlock) {
    return (
      <div style={{ borderColor: '#E5DDD5' }}>
        <p style={{ color: '#8B7355' }}>Selecione um bloco para editar suas propriedades</p>
      </div>
    );
  }

  const handlePropertyChange = (key: string, value: any) => {
    onUpdateBlock(selectedBlock.id, {
      ...selectedBlock,
      content: {
        ...selectedBlock.content,
        [key]: value,
      },
    });
  };

  return (
    <div style={{ borderColor: '#E5DDD5' }}>
      <div style={{ borderColor: '#E5DDD5' }}>
        <h3 className="text-lg font-medium">Propriedades</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div>
          <Label htmlFor="block-type">Tipo</Label>
          <Input
            id="block-type"
            value={selectedBlock.type}
            disabled
            style={{ backgroundColor: '#FAF9F7' }}
          />
        </div>

        {selectedBlock.type === 'text' && (
          <div>
            <Label htmlFor="text-content">Conteúdo</Label>
            <Textarea
              id="text-content"
              value={selectedBlock.content?.text || ''}
              onChange={e => handlePropertyChange('text', e.target.value)}
              rows={4}
            />
          </div>
        )}

        {selectedBlock.type === 'heading' && (
          <>
            <div>
              <Label htmlFor="heading-text">Texto do Título</Label>
              <Input
                id="heading-text"
                value={selectedBlock.content?.text || ''}
                onChange={e => handlePropertyChange('text', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="heading-level">Nível</Label>
              <select
                id="heading-level"
                value={selectedBlock.content?.level || 'h2'}
                onChange={e => handlePropertyChange('level', e.target.value)}
                style={{ borderColor: '#E5DDD5' }}
              >
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
                <option value="h5">H5</option>
                <option value="h6">H6</option>
              </select>
            </div>
          </>
        )}

        {selectedBlock.type === 'image' && (
          <>
            <div>
              <Label htmlFor="image-url">URL da Imagem</Label>
              <Input
                id="image-url"
                value={selectedBlock.content?.imageUrl || ''}
                onChange={e => handlePropertyChange('imageUrl', e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            <div>
              <Label htmlFor="image-alt">Texto Alternativo</Label>
              <Input
                id="image-alt"
                value={selectedBlock.content?.alt || ''}
                onChange={e => handlePropertyChange('alt', e.target.value)}
                placeholder="Descrição da imagem"
              />
            </div>
          </>
        )}

        {selectedBlock.type === 'button' && (
          <>
            <div>
              <Label htmlFor="button-text">Texto do Botão</Label>
              <Input
                id="button-text"
                value={selectedBlock.content?.text || ''}
                onChange={e => handlePropertyChange('text', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="button-url">URL de Destino</Label>
              <Input
                id="button-url"
                value={selectedBlock.content?.url || ''}
                onChange={e => handlePropertyChange('url', e.target.value)}
                placeholder="https://exemplo.com"
              />
            </div>
          </>
        )}

        <div style={{ borderColor: '#E5DDD5' }}>
          <Button
            variant="destructive"
            onClick={() => onDeleteBlock(selectedBlock.id)}
            className="w-full"
          >
            Deletar Bloco
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;

// Named export for compatibility
export { PropertiesPanel };
