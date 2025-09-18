import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Block } from '@/types/editor';

interface HeroSectionBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

const HeroSectionBlockEditor: React.FC<HeroSectionBlockEditorProps> = ({ block, onUpdate }) => {
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
          placeholder="VOCÊ DESCOBRIU SEU ESTILO"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtítulo</Label>
        <Textarea
          id="subtitle"
          rows={2}
          value={content.subtitle || ''}
          onChange={e => onUpdate({ subtitle: e.target.value })}
          placeholder="Agora é hora de aplicar com clareza — e se vestir de você"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="heroImage">Imagem Principal (URL)</Label>
        <Input
          id="heroImage"
          value={content.heroImage || ''}
          onChange={e => onUpdate({ heroImage: e.target.value })}
          placeholder="URL da imagem principal"
        />
        {content.heroImage && (
          <div style={{ backgroundColor: '#FAF9F7' }}>
            <img
              src={content.heroImage}
              alt="Imagem principal"
              className="h-20 object-contain mx-auto"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="heroImage2">Imagem Secundária (URL)</Label>
        <Input
          id="heroImage2"
          value={content.heroImage2 || ''}
          onChange={e => onUpdate({ heroImage2: e.target.value })}
          placeholder="URL da imagem secundária"
        />
        {content.heroImage2 && (
          <div style={{ backgroundColor: '#FAF9F7' }}>
            <img
              src={content.heroImage2}
              alt="Imagem secundária"
              className="h-20 object-contain mx-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSectionBlockEditor;
