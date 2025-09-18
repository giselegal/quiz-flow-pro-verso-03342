import { cn } from '@/lib/utils';

interface QuizOptionBlockProps {
  block: {
    id: string;
    type: string;
    properties?: Record<string, any>;
  };
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
}

/**
 * QuizOptionBlock
 * - Renderização visual simples de uma opção do quiz para o editor
 * - Sem lógica de seleção/resposta (somente preview no editor)
 */
const QuizOptionBlock: React.FC<QuizOptionBlockProps> = ({ block, isSelected, onClick }) => {
  const props = block?.properties || {};

  const label: string = props.label || props.text || 'Opção';
  const textAlign: string = props.textAlign || 'text-left';

  const borderRadius: string = props.borderRadius || 'rounded-lg';

  const backgroundColor: string | undefined = props.backgroundColor;
  const textColor: string | undefined = props.textColor;

  // Dimensões e espaçamento
  const fullWidth = props.fullWidth ?? true;

  const baseClasses = cn(
    'w-full transition-all duration-200 border border-stone-200/60 shadow-sm',
    'px-4 py-3 cursor-default select-none',
    textAlign,
    borderRadius,
    fullWidth && 'block',
    isSelected && 'ring-2 ring-amber-500/60 ring-offset-1'
  );

  const style: React.CSSProperties = {
    backgroundColor: backgroundColor || '#ffffff',
    color: textColor || undefined,
  };

  return (
    <div className={baseClasses} style={style} onClick={onClick} data-block-type="quiz-option">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full border border-stone-300 bg-white" aria-hidden />
        <div className="flex-1">
          <div className={cn('font-medium')}>{label}</div>
          {props.description && (
            <div className="text-sm text-stone-500 mt-0.5">{props.description}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizOptionBlock;
