import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface MainContentEditorProps {
  content: {
    description?: string;
    customImage?: string;
    [key: string]: any;
  };
  onUpdate: (content: any) => void;
}

const MainContentEditor: React.FC<MainContentEditorProps> = ({ content, onUpdate }) => {
  const handleChange = (key: string, value: any) => {
    onUpdate({
      ...content,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="description">Descrição do Estilo</Label>
        <Textarea
          id="description"
          value={content.description || ''}
          onChange={e => handleChange('description', e.target.value)}
          placeholder="Descrição personalizada para o estilo predominante"
          rows={5}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="customImage">URL da Imagem Personalizada</Label>
        <Input
          id="customImage"
          value={content.customImage || ''}
          onChange={e => handleChange('customImage', e.target.value)}
          placeholder="https://exemplo.com/imagem.jpg"
        />

        {content.customImage && (
          <div className="mt-2">
            <p className="text-sm text-[#8F7A6A] mb-1">Pré-visualização:</p>
            <div style={{ backgroundColor: '#FAF9F7' }}>
              <img
                src={content.customImage}
                alt="Imagem do estilo"
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

export default MainContentEditor;
