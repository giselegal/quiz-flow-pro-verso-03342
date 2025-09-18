import { Input } from '@/components/ui/input';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="color"
        value={color}
        onChange={e => onChange(e.target.value)}
        className="w-12 h-12 p-1"
      />
      <Input
        type="text"
        value={color}
        onChange={e => onChange(e.target.value)}
        placeholder="#000000"
        className="flex-1"
      />
    </div>
  );
};

export default ColorPicker;
