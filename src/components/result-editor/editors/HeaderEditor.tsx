import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface HeaderEditorProps {
  content: {
    title?: string;
    subtitle?: string;
    logoUrl?: string;
    userName?: string;
    [key: string]: any;
  };
  onUpdate: (content: any) => void;
}

const HeaderEditor: React.FC<HeaderEditorProps> = ({ content, onUpdate }) => {
  const handleChange = (key: string, value: any) => {
    onUpdate({
      ...content,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título do Cabeçalho</Label>
        <Textarea
          id="title"
          value={content.title || ''}
          onChange={e => handleChange('title', e.target.value)}
          placeholder="Olá, seu Estilo Predominante é:"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtítulo (opcional)</Label>
        <Textarea
          id="subtitle"
          value={content.subtitle || ''}
          onChange={e => handleChange('subtitle', e.target.value)}
          placeholder="Subtítulo personalizado"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logoUrl">URL do Logo</Label>
        <Input
          id="logoUrl"
          value={content.logoUrl || ''}
          onChange={e => handleChange('logoUrl', e.target.value)}
          placeholder="https://exemplo.com/seu-logo.png"
        />

        {content.logoUrl && (
          <div className="mt-2">
            <p className="text-sm text-[#8F7A6A] mb-1">Pré-visualização:</p>
            <div style={{ backgroundColor: '#FAF9F7' }}>
              <img
                src={content.logoUrl}
                alt="Logo"
                className="h-10 object-contain"
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    'https://placehold.co/200x80?text=Logo+Inválido';
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="userName">Nome Padrão (se o usuário não fornecer)</Label>
        <Input
          id="userName"
          value={content.userName || ''}
          onChange={e => handleChange('userName', e.target.value)}
          placeholder="Visitante"
        />
      </div>
    </div>
  );
};

export default HeaderEditor;
