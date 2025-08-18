import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Block } from '@/types/editor';
import StyleEditor from '../style-editors/StyleEditor';

interface AnimationBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

const AnimationBlockEditor: React.FC<AnimationBlockEditorProps> = ({ block, onUpdate }) => {
  const { content = {} } = block;

  const animationTypes = [
    { value: 'fade-in', label: 'Aparecer (Fade In)' },
    { value: 'slide-up', label: 'Deslizar para Cima' },
    { value: 'slide-down', label: 'Deslizar para Baixo' },
    { value: 'slide-left', label: 'Deslizar da Esquerda' },
    { value: 'slide-right', label: 'Deslizar da Direita' },
    { value: 'zoom-in', label: 'Ampliar (Zoom In)' },
    { value: 'zoom-out', label: 'Reduzir (Zoom Out)' },
  ];

  const animationTriggers = [
    { value: 'onLoad', label: 'Ao Carregar a Página' },
    { value: 'onScroll', label: 'Ao Rolar até o Elemento' },
    { value: 'onHover', label: 'Ao Passar o Mouse' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="animationType">Tipo de Animação</Label>
          <Select
            value={content.animationType || 'fade-in'}
            onValueChange={value => onUpdate({ ...content, animationType: value })}
          >
            <SelectTrigger id="animationType">
              <SelectValue placeholder="Escolha o tipo de animação" />
            </SelectTrigger>
            <SelectContent>
              {animationTypes.filter(animation => animation.value && animation.value !== '').map(animation => (
                <SelectItem key={animation.value} value={animation.value}>
                  {animation.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="animationDuration">Duração da Animação (ms)</Label>
          <Input
            id="animationDuration"
            value={content.animationDuration || '500'}
            onChange={e => onUpdate({ ...content, animationDuration: e.target.value })}
            placeholder="500"
            type="number"
            min="100"
            step="100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="animationDelay">Atraso da Animação (ms)</Label>
          <Input
            id="animationDelay"
            value={content.animationDelay || '0'}
            onChange={e => onUpdate({ ...content, animationDelay: e.target.value })}
            placeholder="0"
            type="number"
            min="0"
            step="100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="animationTrigger">Gatilho da Animação</Label>
          <Select
            value={content.animationTrigger || 'onLoad'}
            onValueChange={value => onUpdate({ ...content, animationTrigger: value })}
          >
            <SelectTrigger id="animationTrigger">
              <SelectValue placeholder="Escolha quando a animação acontece" />
            </SelectTrigger>
            <SelectContent>
              {animationTriggers.filter(trigger => trigger.value && trigger.value !== '').map(trigger => (
                <SelectItem key={trigger.value} value={trigger.value}>
                  {trigger.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Estilo do Container</Label>
        <StyleEditor
          style={content.style || {}}
          onUpdate={style => onUpdate({ ...content, style })}
        />
      </div>

      <div style={{ color: '#8B7355' }}>
        <p>
          Este bloco permite animar outros elementos da página. Adicione outros blocos dentro deste
          para aplicar a animação.
        </p>
      </div>
    </div>
  );
};

export default AnimationBlockEditor;
