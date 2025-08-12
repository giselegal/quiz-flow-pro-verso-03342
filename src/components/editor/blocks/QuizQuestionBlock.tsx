// @ts-nocheck
import { cn } from '@/lib/utils';
import { EditableContent } from '@/types/editor';

interface QuizQuestionBlockProps {
  content?: EditableContent;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: Partial<EditableContent>) => void;
  onSelect?: () => void;
  className?: string;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const QuizQuestionBlock: React.FC<QuizQuestionBlockProps> = ({
  content = {},
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  className,
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect();
    }
  };

  // Safely handle style object
  const style = content.style || {};
  const styleProps = typeof style === 'object' ? style : {};

  const containerStyle = {
    backgroundColor: styleProps.backgroundColor || content.backgroundColor || '#ffffff',
    padding: styleProps.padding || content.padding || '1rem',
    margin: styleProps.margin || content.margin || '0',
    borderRadius: styleProps.borderRadius || content.borderRadius || '8px',
    border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
  };

  const options = content.options || [
    { id: '1', text: 'Opção 1' },
    { id: '2', text: 'Opção 2' },
  ];

  return (
    <div
      className={cn(
        'quiz-question-block cursor-pointer transition-all',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      style={containerStyle}
      onClick={handleClick}
    >
      <div className="space-y-4">
        {content.title && <h3 style={{ color: '#432818' }}>{content.title}</h3>}

        {content.text && <p style={{ color: '#6B4F43' }}>{content.text}</p>}

        <div className="space-y-2">
          {options.map((option: any) => (
            <div key={option.id} style={{ backgroundColor: '#E5DDD5' }}>
              <span style={{ color: '#432818' }}>{option.text}</span>
            </div>
          ))}
        </div>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 bg-[#B89B7A]/100 text-white px-2 py-1 rounded text-xs">
          Selecionado
        </div>
      )}
    </div>
  );
};

export default QuizQuestionBlock;
