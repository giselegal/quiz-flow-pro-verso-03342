import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Block } from '@/types/editor';

interface StyleResultBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

const StyleResultBlockEditor: React.FC<StyleResultBlockEditorProps> = ({ block, onUpdate }) => {
  const content = block.content;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Descrição Personalizada</Label>
        <Textarea
          id="description"
          rows={4}
          value={content.description || ''}
          onChange={e => onUpdate({ description: e.target.value })}
          placeholder="Descrição personalizada para o estilo principal..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="customImage">Imagem Personalizada (URL)</Label>
        <Input
          id="customImage"
          value={content.customImage || ''}
          onChange={e => onUpdate({ customImage: e.target.value })}
          placeholder="URL da imagem personalizada"
        />
        {content.customImage && (
          <div style={{ backgroundColor: '#FAF9F7' }}>
            <img
              src={content.customImage}
              alt="Imagem personalizada"
              className="h-20 object-contain mx-auto"
            />
          </div>
        )}
      </div>

      <div style={{ backgroundColor: '#FAF9F7' }}>
        <p className="text-sm text-[#8F7A6A]">
          <strong>Nota:</strong> Este componente exibirá automaticamente o estilo predominante do
          usuário. Você pode personalizar a descrição e a imagem aqui.
        </p>
      </div>
    </div>
  );
};

export default StyleResultBlockEditor;
