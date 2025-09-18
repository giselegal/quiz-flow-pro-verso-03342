import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Block } from '@/types/editor';

interface CustomCodeBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

export const CustomCodeBlockEditor: React.FC<CustomCodeBlockEditorProps> = ({
  block,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Cuidado ao inserir código personalizado. Certifique-se de que o código seja seguro e
          válido.
        </AlertDescription>
      </Alert>

      <div>
        <Label htmlFor={`${block.id}-code`}>Código HTML/CSS/JS</Label>
        <Textarea
          id={`${block.id}-code`}
          value={block.content.code || ''}
          onChange={e => onUpdate({ ...block.content, code: e.target.value })}
          placeholder="Cole seu código personalizado aqui..."
          className="mt-1 font-mono text-sm"
          rows={10}
        />
      </div>

      <div>
        <Label htmlFor={`${block.id}-description`}>Descrição (opcional)</Label>
        <Textarea
          id={`${block.id}-description`}
          value={block.content.description || ''}
          onChange={e => onUpdate({ ...block.content, description: e.target.value })}
          placeholder="Descreva o que este código faz..."
          className="mt-1"
          rows={3}
        />
      </div>
    </div>
  );
};
