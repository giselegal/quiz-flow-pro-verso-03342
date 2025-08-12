import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Block } from '@/types/editor';

interface SecondaryStylesBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

const SecondaryStylesBlockEditor: React.FC<SecondaryStylesBlockEditorProps> = ({
  block,
  onUpdate,
}) => {
  const content = block.content;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={content.title || ''}
          onChange={e => onUpdate({ title: e.target.value })}
          placeholder="Seus Estilos Complementares"
        />
      </div>

      <div style={{ backgroundColor: '#FAF9F7' }}>
        <p className="text-sm text-[#8F7A6A]">
          <strong>Nota:</strong> Este componente exibirá automaticamente os estilos secundários do
          usuário. Você pode personalizar o título aqui.
        </p>
      </div>
    </div>
  );
};

export default SecondaryStylesBlockEditor;
