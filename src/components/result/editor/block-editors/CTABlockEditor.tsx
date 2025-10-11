import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Block } from '@/types/editor';

interface CTABlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

const CTABlockEditor: React.FC<CTABlockEditorProps> = ({ block, onUpdate }) => {
  const content = block.content;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título (opcional)</Label>
        <Input
          id="title"
          value={content.title || ''}
          onChange={e => onUpdate({ title: e.target.value })}
          placeholder="Transforme seu estilo agora"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="buttonText">Texto do Botão</Label>
        <Input
          id="buttonText"
          value={content.buttonText || ''}
          onChange={e => onUpdate({ buttonText: e.target.value })}
          placeholder="Clique Aqui"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL do Botão</Label>
        <Input
          id="url"
          value={content.url || content.ctaUrl || ''}
          onChange={e => onUpdate({ url: e.target.value, ctaUrl: e.target.value })}
          placeholder="https://pay.hotmart.com/..."
        />
      </div>
    </div>
  );
};

export default CTABlockEditor;
