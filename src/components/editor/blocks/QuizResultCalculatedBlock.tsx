// @ts-nocheck
import type { BlockComponentProps } from '@/types/blocks';

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

const QuizResultCalculatedBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    title = 'Seu Resultado',
    showPercentages = true,
    showSecondaryStyles = true,
    backgroundColor = '#ffffff',
  } = block?.properties || {};

  // Mock results for display
  const mockResults = [
    { style: 'Contemporâneo', percentage: 85, color: '#B89B7A' },
    { style: 'Elegante', percentage: 72, color: '#8B7355' },
    { style: 'Natural', percentage: 45, color: '#A68B5B' },
  ];

  const primaryResult = mockResults[0];
  const secondaryResults = mockResults.slice(1);

  return (
    <div
      className={`
        py-8 px-4 cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'}
        ${className}
      `}
      style={{ backgroundColor }}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#432818] mb-8">{title}</h2>

        {/* Primary Result */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 className="text-2xl font-semibold mb-4" style={{ color: primaryResult.color }}>
            Seu Estilo Principal: {primaryResult.style}
          </h3>
          {showPercentages && (
            <div style={{ color: '#6B4F43' }}>{primaryResult.percentage}% de compatibilidade</div>
          )}
          <div style={{ backgroundColor: '#E5DDD5' }}>
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${primaryResult.percentage}%`,
                backgroundColor: primaryResult.color,
              }}
            />
          </div>
        </div>

        {/* Secondary Results */}
        {showSecondaryStyles && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-[#432818] mb-4">
              Outros estilos que combinam com você:
            </h4>
            {secondaryResults.map((style: any, index: number) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span style={{ color: '#432818' }}>{style.style}</span>
                  {showPercentages && <span style={{ color: '#6B4F43' }}>{style.percentage}%</span>}
                </div>
                <div style={{ backgroundColor: '#E5DDD5' }}>
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${style.percentage}%`,
                      backgroundColor: style.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResultCalculatedBlock;
