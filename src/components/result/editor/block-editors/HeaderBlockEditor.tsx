import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Block } from '@/types/editor';

interface HeaderBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

const HeaderBlockEditor: React.FC<HeaderBlockEditorProps> = ({ block, onUpdate }) => {
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
          placeholder="Olá, seu Estilo Predominante é:"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtítulo (opcional)</Label>
        <Textarea
          id="subtitle"
          rows={2}
          value={content.subtitle || ''}
          onChange={e => onUpdate({ subtitle: e.target.value })}
          placeholder="Subtítulo personalizado"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo">URL do Logo</Label>
        <Input
          id="logo"
          value={content.logo || ''}
          onChange={e => onUpdate({ logo: e.target.value })}
          placeholder="https://exemplo.com/seu-logo.png"
        />
        {content.logo && (
          <div style={{ backgroundColor: '#FAF9F7' }}>
            <img src={content.logo} alt="Logo" className="h-10 object-contain mx-auto" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="logoAlt">Texto Alternativo do Logo</Label>
        <Input
          id="logoAlt"
          value={content.logoAlt || ''}
          onChange={e => onUpdate({ logoAlt: e.target.value })}
          placeholder="Logo Gisele Galvão"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label htmlFor="logoWidth">Largura do Logo</Label>
          <Input
            id="logoWidth"
            value={content.logoWidth || ''}
            onChange={e => onUpdate({ logoWidth: e.target.value })}
            placeholder="auto"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="logoHeight">Altura do Logo</Label>
          <Input
            id="logoHeight"
            value={content.logoHeight || ''}
            onChange={e => onUpdate({ logoHeight: e.target.value })}
            placeholder="auto"
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderBlockEditor;
