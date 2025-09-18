import { cn } from '@/lib/utils';

interface InlineEditTextProps {
  value: string;
  onSave: (newValue: string) => void;
  placeholder?: string;
  multiline?: boolean;
  disabled?: boolean;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';
  style?: React.CSSProperties;
  autoSelect?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  saveOnBlur?: boolean;
  validateOnSave?: (value: string) => boolean;
  onClick?: () => void;
  isSelected?: boolean;
}

export const InlineEditText: React.FC<InlineEditTextProps> = ({
  value,
  onSave: _onSave,
  placeholder = 'Clique para selecionar...',
  multiline: _multiline = false,
  disabled = false,
  className = '',
  as = 'p',
  style,
  autoSelect: _autoSelect = true,
  preventDefault = true,
  stopPropagation = true,
  saveOnBlur: _saveOnBlur = true,
  validateOnSave: _validateOnSave,
  onClick,
  isSelected = false,
}) => {
  // Component now works only for selection, no inline editing
  // All editing happens in the properties panel

  const Component = as;

  const handleClick = (e: React.MouseEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }
    if (stopPropagation) {
      e.stopPropagation();
    }

    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <Component
      className={cn(
        'cursor-pointer transition-all duration-200',
        'hover:bg-brand/10 hover:ring-1 hover:ring-brand/30 rounded px-2 py-1',
        'min-h-[1.5em] inline-block',
        isSelected && 'bg-brand/10 ring-2 ring-brand',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      style={style}
      onClick={handleClick}
      title="Clique para selecionar e editar no painel de propriedades"
    >
      {value || <span className="text-stone-400 italic">{placeholder}</span>}
    </Component>
  );
};
