import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface SizeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export const SizeSlider: React.FC<SizeSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = 'px',
  label = 'Tamanho',
  showValue = true,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-[#432818]">{label}</Label>
        {showValue && (
          <span className="text-sm text-[#B89B7A] font-medium">
            {value}
            {unit}
          </span>
        )}
      </div>

      <div className="px-1">
        <Slider
          value={[value]}
          onValueChange={values => onChange(values[0])}
          min={min}
          max={max}
          step={step}
          className="w-full"
          aria-label={`${label} (${min} a ${max} ${unit})`}
          aria-valuetext={`${value}${unit}`}
        />
      </div>

      <div style={{ color: '#8B7355' }}>
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
};

export default SizeSlider;
