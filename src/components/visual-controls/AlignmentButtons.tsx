import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from 'lucide-react';

interface AlignmentButtonsProps {
  value: 'left' | 'center' | 'right' | 'justify';
  onChange: (alignment: 'left' | 'center' | 'right' | 'justify') => void;
  className?: string;
}

export const AlignmentButtons: React.FC<AlignmentButtonsProps> = ({
  value,
  onChange,
  className,
}) => {
  const alignments = [
    { value: 'left', icon: AlignLeft, label: 'Esquerda' },
    { value: 'center', icon: AlignCenter, label: 'Centro' },
    { value: 'right', icon: AlignRight, label: 'Direita' },
    { value: 'justify', icon: AlignJustify, label: 'Justificado' },
  ] as const;

  return (
    <div className={cn('flex gap-1', className)}>
      {alignments.map(({ value: alignValue, icon: Icon, label }) => (
        <Button
          key={alignValue}
          variant={value === alignValue ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(alignValue)}
          className={cn(
            'p-2 h-8 w-8',
            value === alignValue
              ? 'bg-[#B89B7A] hover:bg-[#A08766] text-white'
              : 'border-[#B89B7A]/30 hover:bg-[#B89B7A]/10'
          )}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </Button>
      ))}
    </div>
  );
};

export default AlignmentButtons;
