import { cn } from '@/lib/utils';
import { BlockComponentProps } from '@/types/blocks';

const SecondaryStylesInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange,
}) => {
  const secondaryStyles = block?.properties?.secondaryStyles || [
    { name: 'Moderno', percentage: 20, color: '#432818' },
    { name: 'Casual', percentage: 15, color: '#432818' },
    { name: 'Romântico', percentage: 10, color: '#432818' },
  ];

  const title = block?.properties?.title || 'Seus Estilos Secundários';
  const showPercentages = block?.properties?.showPercentages !== false;

  return (
    <div
      className={cn(
        'secondary-styles p-6 border border-gray-200 rounded-lg bg-white',
        'hover:shadow-md transition-all duration-200',
        isSelected && 'ring-2 ring-[#432818] bg-[#432818]',
        'cursor-pointer'
        // Margens universais com controles deslizantes
      )}
      onClick={onClick}
    >
      <h3 className="text-xl font-semibold mb-4 text-[#432818] text-center">{title}</h3>

      <div className="grid gap-4 md:grid-cols-3">
        {secondaryStyles.map((style: any, index: number) => (
          <div key={index} style={{ backgroundColor: '#E5DDD5' }}>
            {/* Círculo com porcentagem */}
            <div className="relative inline-block mb-3">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: style.color }}
              >
                {showPercentages && `${style.percentage}%`}
              </div>
            </div>

            {/* Nome do estilo */}
            <h4 className="font-medium text-[#432818] mb-1">{style.name}</h4>

            {/* Descrição opcional */}
            {style.description && <p style={{ color: '#6B4F43' }}>{style.description}</p>}
          </div>
        ))}
      </div>

      {/* Área editável quando selecionado */}
      {isSelected && onPropertyChange && (
        <div style={{ borderColor: '#E5DDD5' }}>
          <div style={{ color: '#8B7355' }}>
            <p>
              💡 <strong>Editável:</strong> Personalize os estilos secundários
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecondaryStylesInlineBlock;
