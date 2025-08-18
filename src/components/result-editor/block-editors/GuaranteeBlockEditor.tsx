import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Block } from '@/types/editor';

interface GuaranteeBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

const GuaranteeBlockEditor: React.FC<GuaranteeBlockEditorProps> = ({ block, onUpdate }) => {
  const content = block.content;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={content.title || ''}
          onChange={e => onUpdate({ title: e.target.value })}
          placeholder="Garantia de 7 dias"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="text">Texto</Label>
        <Textarea
          id="text"
          rows={3}
          value={content.text || ''}
          onChange={e => onUpdate({ text: e.target.value })}
          placeholder="Se você não ficar 100% satisfeita com o conteúdo nos primeiros 7 dias, devolvemos seu dinheiro integralmente, sem burocracia."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">URL da Imagem</Label>
        <Input
          id="image"
          value={content.image || ''}
          onChange={e => onUpdate({ image: e.target.value })}
          placeholder="https://exemplo.com/garantia.jpg"
        />
        {content.image && (
          <div style={{ backgroundColor: '#FAF9F7' }}>
            <img
              src={content.image}
              alt="Imagem de garantia"
              className="h-20 object-contain mx-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GuaranteeBlockEditor;
