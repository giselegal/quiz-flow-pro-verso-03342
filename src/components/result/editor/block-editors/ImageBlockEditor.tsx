import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Block } from '@/types/editor';

interface ImageBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

const ImageBlockEditor: React.FC<ImageBlockEditorProps> = ({ block, onUpdate }) => {
  const content = block.content;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL da Imagem</Label>
        <Input
          id="imageUrl"
          value={content.imageUrl || ''}
          onChange={e => onUpdate({ imageUrl: e.target.value })}
          placeholder="https://exemplo.com/imagem.jpg"
        />
        {content.imageUrl && (
          <div style={{ backgroundColor: '#FAF9F7' }}>
            <img
              src={content.imageUrl}
              alt="Pré-visualização"
              className="h-20 object-contain mx-auto"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageAlt">Texto Alternativo</Label>
        <Input
          id="imageAlt"
          value={content.imageAlt || ''}
          onChange={e => onUpdate({ imageAlt: e.target.value })}
          placeholder="Descrição da imagem"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="width">Largura</Label>
        <Input
          id="width"
          value={content.width || ''}
          onChange={e => onUpdate({ width: e.target.value })}
          placeholder="100%"
        />
        <p className="text-xs text-[#8F7A6A]">Use valores como "100%", "300px", etc.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="borderRadius">Arredondamento de Bordas</Label>
        <Input
          id="borderRadius"
          value={content.borderRadius || ''}
          onChange={e => onUpdate({ borderRadius: e.target.value })}
          placeholder="8px"
        />
      </div>
    </div>
  );
};

export default ImageBlockEditor;
