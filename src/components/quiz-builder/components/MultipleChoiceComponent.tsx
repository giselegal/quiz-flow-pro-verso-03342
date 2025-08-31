import { cn } from '@/lib/utils';

interface MultipleChoiceComponentProps {
  data: {
    question?: string;
    options?: string[];
    optionImages?: string[];
    displayType?: 'text' | 'image' | 'both';
    minSelections?: number;
    maxSelections?: number;
    [key: string]: any;
  };
  style?: {
    backgroundColor?: string;
    textColor?: string;
    [key: string]: any;
  };
  isSelected?: boolean;
}

const MultipleChoiceComponent: React.FC<MultipleChoiceComponentProps> = ({
  data,
  style,
  isSelected,
}) => {
  const options = data.options || ['Opção 1', 'Opção 2', 'Opção 3'];
  const displayType = data.displayType || 'text';

  return (
    <div
      className={cn('p-4', isSelected && 'outline-dashed outline-1 outline-[#B89B7A]')}
      style={{
        backgroundColor: style?.backgroundColor || 'transparent',
        color: style?.textColor || 'inherit',
      }}
    >
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">
          {data.question || 'Pergunta de múltipla escolha'}
        </h3>
        <p style={{ color: '#8B7355' }}>
          {data.minSelections && data.maxSelections
            ? `Selecione de ${data.minSelections} a ${data.maxSelections} opções`
            : 'Selecione uma ou mais opções'}
        </p>
      </div>

      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={`option-${option}-${index}`} style={{ backgroundColor: '#FAF9F7' }}>
            {(displayType === 'image' || displayType === 'both') && (
              <div className="mb-2">
                {data.optionImages && data.optionImages[index] ? (
                  <img
                    src={data.optionImages[index]}
                    alt={option}
                    className="w-full h-32 object-cover rounded-md"
                  />
                ) : (
                  <div style={{ backgroundColor: '#E5DDD5' }}>
                    <span style={{ color: '#8B7355' }}>Sem imagem</span>
                  </div>
                )}
              </div>
            )}

            {(displayType === 'text' || displayType === 'both') && (
              <div className="flex items-center">
                <div style={{ borderColor: '#E5DDD5' }}></div>
                <span>{option}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceComponent;
