// @ts-nocheck
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { QuizComponentStyle } from '@/types/quizBuilder';
import { Slider } from '@/components/ui/slider';

interface StylePropertiesProps {
  style: QuizComponentStyle;
  onUpdate: (style: QuizComponentStyle) => void;
}

const StyleProperties: React.FC<StylePropertiesProps> = ({ style, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="backgroundColor">Cor de Fundo</Label>
        <div className="flex gap-2">
          <div
            style={{ borderColor: '#E5DDD5' }}
            style={{ backgroundColor: style.backgroundColor || 'transparent' }}
          />
          <Input
            id="backgroundColor"
            value={style.backgroundColor || ''}
            onChange={e => onUpdate({ ...style, backgroundColor: e.target.value })}
            placeholder="ex: #ffffff"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="textColor">Cor do Texto</Label>
        <div className="flex gap-2">
          <div
            style={{ borderColor: '#E5DDD5' }}
            style={{ backgroundColor: style.textColor || '#000000' }}
          />
          <Input
            id="textColor"
            value={style.textColor || ''}
            onChange={e => onUpdate({ ...style, textColor: e.target.value })}
            placeholder="ex: #000000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paddingY">Espaçamento Vertical</Label>
        <div className="flex gap-3 items-center">
          <Slider
            value={[parseInt(style.paddingY || '16')]}
            min={0}
            max={64}
            step={4}
            onValueChange={values => onUpdate({ ...style, paddingY: String(values[0]) })}
            className="flex-1"
          />
          <div className="w-12 text-center">{style.paddingY || '16'}px</div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paddingX">Espaçamento Horizontal</Label>
        <div className="flex gap-3 items-center">
          <Slider
            value={[parseInt(style.paddingX || '16')]}
            min={0}
            max={64}
            step={4}
            onValueChange={values => onUpdate({ ...style, paddingX: String(values[0]) })}
            className="flex-1"
          />
          <div className="w-12 text-center">{style.paddingX || '16'}px</div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="borderRadius">Borda Arredondada</Label>
        <div className="flex gap-3 items-center">
          <Slider
            value={[parseInt(style.borderRadius || '0')]}
            min={0}
            max={24}
            step={1}
            onValueChange={values => onUpdate({ ...style, borderRadius: String(values[0]) })}
            className="flex-1"
          />
          <div className="w-12 text-center">{style.borderRadius || '0'}px</div>
        </div>
      </div>
    </div>
  );
};

export default StyleProperties;
