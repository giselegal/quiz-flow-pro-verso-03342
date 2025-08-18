import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface OfferHeroEditorProps {
  content: {
    title?: string;
    subtitle?: string;
    heroImage?: string;
    heroImage2?: string;
    [key: string]: any;
  };
  onUpdate: (content: any) => void;
}

const OfferHeroEditor: React.FC<OfferHeroEditorProps> = ({ content, onUpdate }) => {
  const handleChange = (key: string, value: any) => {
    onUpdate({
      ...content,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título da Oferta</Label>
        <Textarea
          id="title"
          value={content.title || ''}
          onChange={e => handleChange('title', e.target.value)}
          placeholder="VOCÊ DESCOBRIU SEU ESTILO"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtítulo da Oferta</Label>
        <Textarea
          id="subtitle"
          value={content.subtitle || ''}
          onChange={e => handleChange('subtitle', e.target.value)}
          placeholder="Agora é hora de aplicar com clareza — e se vestir de você"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="heroImage">URL da Imagem Principal</Label>
        <Input
          id="heroImage"
          value={content.heroImage || ''}
          onChange={e => handleChange('heroImage', e.target.value)}
          placeholder="https://exemplo.com/imagem-principal.jpg"
        />

        {content.heroImage && (
          <div className="mt-2">
            <p className="text-sm text-[#8F7A6A] mb-1">Pré-visualização:</p>
            <div style={{ backgroundColor: '#FAF9F7' }}>
              <img
                src={content.heroImage}
                alt="Imagem principal"
                className="h-40 object-contain mx-auto"
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    'https://placehold.co/400x300?text=Imagem+Inválida';
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="heroImage2">URL da Imagem Secundária</Label>
        <Input
          id="heroImage2"
          value={content.heroImage2 || ''}
          onChange={e => handleChange('heroImage2', e.target.value)}
          placeholder="https://exemplo.com/imagem-secundaria.jpg"
        />

        {content.heroImage2 && (
          <div className="mt-2">
            <p className="text-sm text-[#8F7A6A] mb-1">Pré-visualização:</p>
            <div style={{ backgroundColor: '#FAF9F7' }}>
              <img
                src={content.heroImage2}
                alt="Imagem secundária"
                className="h-40 object-contain mx-auto"
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    'https://placehold.co/400x300?text=Imagem+Inválida';
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferHeroEditor;
