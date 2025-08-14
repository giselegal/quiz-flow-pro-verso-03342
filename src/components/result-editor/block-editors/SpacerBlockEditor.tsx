// @ts-nocheck
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Block } from '@/types/editor';
import { Slider } from '@/components/ui/slider';

interface SpacerBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

const SpacerBlockEditor: React.FC<SpacerBlockEditorProps> = ({ block, onUpdate }) => {
  const content = block.content;
  const spacerHeight = parseInt(content.height?.replace('px', '') || '40');

  const handleSliderChange = (value: number[]) => {
    onUpdate({ height: `${value[0]}px` });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Altura do Espaçamento</Label>
        <div className="flex items-center gap-2">
          <Slider
            value={[spacerHeight]}
            min={0}
            max={200}
            step={1}
            onValueChange={handleSliderChange}
            className="flex-grow"
          />
          <Input
            value={content.height || '40px'}
            onChange={e => onUpdate({ height: e.target.value })}
            className="w-20"
          />
        </div>

        <div style={{ backgroundColor: '#FAF9F7', height: content.height || '40px' }}>
          <div className="text-xs text-center text-gray-400">Visualização do espaçamento</div>
        </div>
      </div>
    </div>
  );
};

export default SpacerBlockEditor;
