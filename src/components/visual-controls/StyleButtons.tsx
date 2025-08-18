import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bold, Italic, Underline } from 'lucide-react';

interface StyleButtonsProps {
  fontWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  onFontWeightChange: (weight: 'light' | 'normal' | 'medium' | 'semibold' | 'bold') => void;
  onFontStyleChange: (style: 'normal' | 'italic') => void;
  onTextDecorationChange: (decoration: 'none' | 'underline') => void;
  className?: string;
}

export const StyleButtons: React.FC<StyleButtonsProps> = ({
  fontWeight = 'normal',
  fontStyle = 'normal',
  textDecoration = 'none',
  onFontWeightChange,
  onFontStyleChange,
  onTextDecorationChange,
  className,
}) => {
  const isBold = fontWeight === 'bold' || fontWeight === 'semibold';
  const isItalic = fontStyle === 'italic';
  const isUnderline = textDecoration === 'underline';

  return (
    <div className={cn('flex gap-1', className)}>
      <Button
        variant={isBold ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFontWeightChange(isBold ? 'normal' : 'bold')}
        className={cn(
          'p-2 h-8 w-8',
          isBold
            ? 'bg-[#B89B7A] hover:bg-[#A08766] text-white'
            : 'border-[#B89B7A]/30 hover:bg-[#B89B7A]/10'
        )}
        title="Negrito"
      >
        <Bold className="w-4 h-4" />
      </Button>

      <Button
        variant={isItalic ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFontStyleChange(isItalic ? 'normal' : 'italic')}
        className={cn(
          'p-2 h-8 w-8',
          isItalic
            ? 'bg-[#B89B7A] hover:bg-[#A08766] text-white'
            : 'border-[#B89B7A]/30 hover:bg-[#B89B7A]/10'
        )}
        title="Itálico"
      >
        <Italic className="w-4 h-4" />
      </Button>

      <Button
        variant={isUnderline ? 'default' : 'outline'}
        size="sm"
        onClick={() => onTextDecorationChange(isUnderline ? 'none' : 'underline')}
        className={cn(
          'p-2 h-8 w-8',
          isUnderline
            ? 'bg-[#B89B7A] hover:bg-[#A08766] text-white'
            : 'border-[#B89B7A]/30 hover:bg-[#B89B7A]/10'
        )}
        title="Sublinhado"
      >
        <Underline className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default StyleButtons;
