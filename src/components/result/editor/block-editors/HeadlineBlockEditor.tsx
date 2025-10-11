import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Block } from '@/types/editor';

interface HeadlineBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

const HeadlineBlockEditor: React.FC<HeadlineBlockEditorProps> = ({ block, onUpdate }) => {
  const content = block.content;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Textarea
          id="title"
          rows={2}
          value={content.title || ''}
          onChange={e => onUpdate({ title: e.target.value })}
          placeholder="Digite o título aqui"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtítulo</Label>
        <Textarea
          id="subtitle"
          rows={2}
          value={content.subtitle || ''}
          onChange={e => onUpdate({ subtitle: e.target.value })}
          placeholder="Digite o subtítulo aqui"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="textColor">Cor do texto</Label>
        <Input
          id="textColor"
          type="color"
          value={content.textColor || '#432818'}
          onChange={e => onUpdate({ textColor: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="alignment">Alinhamento</Label>
        <div className="flex gap-2">
          <button
            type="button"
            className={`p-2 border rounded-md ${
              (content.alignment || 'center') === 'left' ? 'bg-[#B89B7A]/20' : ''
            }`}
            onClick={() => onUpdate({ alignment: 'left' })}
          >
            Esquerda
          </button>
          <button
            type="button"
            className={`p-2 border rounded-md ${
              (content.alignment || 'center') === 'center' ? 'bg-[#B89B7A]/20' : ''
            }`}
            onClick={() => onUpdate({ alignment: 'center' })}
          >
            Centro
          </button>
          <button
            type="button"
            className={`p-2 border rounded-md ${
              (content.alignment || 'center') === 'right' ? 'bg-[#B89B7A]/20' : ''
            }`}
            onClick={() => onUpdate({ alignment: 'right' })}
          >
            Direita
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeadlineBlockEditor;
