import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface HeaderEditorProps {
  content: {
    logo?: string;
    logoAlt?: string;
    title?: string;
  };
  visible: boolean;
  onUpdate: (content: any) => void;
  onToggleVisibility: (visible: boolean) => void;
}

export const HeaderEditor: React.FC<HeaderEditorProps> = ({
  content,
  visible,
  onUpdate,
  onToggleVisibility,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Cabeçalho</h3>
        <Switch checked={visible} onCheckedChange={onToggleVisibility} />
      </div>

      {visible && (
        <>
          <div className="space-y-2">
            <Label htmlFor="logo">URL do Logo</Label>
            <Input
              id="logo"
              value={content.logo || ''}
              onChange={e => onUpdate({ ...content, logo: e.target.value })}
            />
            {content.logo && (
              <img src={content.logo} alt="Preview do logo" className="h-12 object-contain mt-2" />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoAlt">Texto alternativo do Logo</Label>
            <Input
              id="logoAlt"
              value={content.logoAlt || ''}
              onChange={e => onUpdate({ ...content, logoAlt: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={content.title || ''}
              onChange={e => onUpdate({ ...content, title: e.target.value })}
            />
          </div>
        </>
      )}
    </div>
  );
};
