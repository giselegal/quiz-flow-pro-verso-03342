import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Block } from '@/types/editor';

interface TextBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

const TextBlockEditor: React.FC<TextBlockEditorProps> = ({ block, onUpdate }) => {
  const content = block.content;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text">Texto</Label>
        <Textarea
          id="text"
          rows={6}
          value={content.text || ''}
          onChange={e => onUpdate({ text: e.target.value })}
          placeholder="Digite seu texto aqui..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="alignment">Alinhamento</Label>
        <Select
          defaultValue={content.alignment || 'left'}
          onValueChange={value => onUpdate({ alignment: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o alinhamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Esquerda</SelectItem>
            <SelectItem value="center">Centro</SelectItem>
            <SelectItem value="right">Direita</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TextBlockEditor;
