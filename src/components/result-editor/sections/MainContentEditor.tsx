import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface MainContentEditorProps {
  content: {
    introText?: string;
    benefits?: string[];
    tabletImage?: string;
    styleImages?: Record<string, string>;
  };
  visible: boolean;
  onUpdate: (content: any) => void;
  onToggleVisibility: (visible: boolean) => void;
}

export const MainContentEditor: React.FC<MainContentEditorProps> = ({
  content,
  visible,
  onUpdate,
  onToggleVisibility,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Conteúdo Principal</h3>
        <Switch checked={visible} onCheckedChange={onToggleVisibility} />
      </div>

      {visible && (
        <>
          <div className="space-y-2">
            <Label htmlFor="introText">Texto de Introdução</Label>
            <Textarea
              id="introText"
              value={content.introText || ''}
              onChange={e => onUpdate({ ...content, introText: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Benefícios</Label>
            {content.benefits?.map((benefit, index) => (
              <Input
                key={index}
                value={benefit}
                onChange={e => {
                  const newBenefits = [...(content.benefits || [])];
                  newBenefits[index] = e.target.value;
                  onUpdate({ ...content, benefits: newBenefits });
                }}
                className="mb-2"
              />
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tabletImage">Imagem do Tablet</Label>
            <Input
              id="tabletImage"
              value={content.tabletImage || ''}
              onChange={e => onUpdate({ ...content, tabletImage: e.target.value })}
            />
            {content.tabletImage && (
              <img
                src={content.tabletImage}
                alt="Preview do tablet"
                className="h-32 object-contain mt-2"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};
