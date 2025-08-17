import { cn } from '@/lib/utils';

interface InlineEditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  disabled?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

export const InlineEditableText: React.FC<InlineEditableTextProps> = ({
  value,
  onChange: _onChange,
  placeholder = 'Digite aqui...',
  className = '',
  multiline: _multiline = false,
  disabled = false,
  isSelected = false,
  onClick,
}) => {
  return (
    <span
      className={cn(
        'cursor-pointer hover:bg-brand/10 hover:outline hover:outline-1 hover:outline-brand/40 rounded px-1 transition-all duration-200',
        !value && 'text-stone-400 italic',
        isSelected && 'bg-brand/10 outline outline-1 outline-brand',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      onClick={!disabled ? onClick : undefined}
      title="Clique para selecionar e editar no painel de propriedades"
    >
      {value || placeholder}
    </span>
  );
};
