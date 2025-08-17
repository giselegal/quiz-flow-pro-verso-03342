// @ts-nocheck
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

/**
 * ResultStyleCardBlock - Componente para exibir resultado do estilo
 */
const ResultStyleCardBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  const { styles = {}, containerWidth = 'full', spacing = 'medium' } = block.properties || {};

  // Simular resultado calculado (em produção viria do scoring)
  const resultStyle = 'Elegante'; // Este seria calculado baseado nas respostas
  const currentStyle = styles[resultStyle] || Object.values(styles)[0];

  if (!currentStyle) {
    return (
      <div className="text-center p-8">
        <p style={{ color: '#8B7355' }}>Configuração de estilos necessária</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'result-style-card w-full',
        className,
        isSelected && 'ring-2 ring-blue-500 ring-opacity-50'
      )}
      onClick={onClick}
    >
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <img
            src={currentStyle.image}
            alt={currentStyle.name}
            className="w-48 h-48 mx-auto rounded-xl object-cover shadow-md"
          />
        </div>

        <h2 className="text-4xl font-bold text-[#432818] mb-4 font-['Playfair_Display']">
          {currentStyle.name}
        </h2>

        <p style={{ color: '#6B4F43' }}>{currentStyle.description}</p>

        {currentStyle.guideImage && (
          <div className="mt-6">
            <img
              src={currentStyle.guideImage}
              alt={`Guia ${currentStyle.name}`}
              className="w-full max-w-sm mx-auto rounded-xl shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultStyleCardBlock;
