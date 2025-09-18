import { cn } from '@/lib/utils';

interface QuizOptionProps {
  id: string;
  text: string;
  imageUrl?: string;
  value: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
  className?: string;
  multiSelect?: boolean;
  showCheckmark?: boolean;
  variant?: 'default' | 'image' | 'card' | 'text-only';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Componente reutilizável para opção de quiz
 *
 * Suporta vários tipos de visualização e seleção
 */
const QuizOption: React.FC<QuizOptionProps> = ({
  id,
  text,
  imageUrl,
  value,
  isSelected,
  onSelect,
  disabled = false,
  className = '',
  multiSelect = false,
  showCheckmark = true,
  variant = 'default',
  size = 'md',
}) => {
  // Classes de tamanho
  const sizeClasses = {
    sm: 'p-2 text-sm',
    md: 'p-3 text-base',
    lg: 'p-4 text-lg',
  };

  // Função de clique
  const handleClick = () => {
    if (!disabled) {
      onSelect(id);
    }
  };

  // Renderização baseada no tipo
  switch (variant) {
    // Opção com imagem em destaque
    case 'image':
      return (
        <div
          className={cn(
            'relative rounded-lg border overflow-hidden cursor-pointer transition-all duration-200',
            isSelected
              ? 'ring-2 ring-[#B89B7A] border-[#B89B7A]'
              : 'border-gray-200 hover:border-gray-300',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          onClick={handleClick}
          data-value={value}
        >
          {imageUrl && (
            <div className="relative aspect-video w-full">
              <img src={imageUrl} alt={text} className="w-full h-full object-cover" />

              {/* Overlay para seleção */}
              {isSelected && (
                <div className="absolute inset-0 bg-[#B89B7A] bg-opacity-20 flex items-center justify-center">
                  {showCheckmark && (
                    <div className="bg-[#B89B7A] rounded-full p-2 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className={sizeClasses[size]}>
            <p className="font-medium">{text}</p>
          </div>

          {/* Indicador de seleção para multi-select */}
          {multiSelect && (
            <div className="absolute top-3 right-3">
              <div
                className={cn(
                  'w-5 h-5 border rounded-full flex items-center justify-center transition-colors',
                  isSelected ? 'bg-[#B89B7A] border-[#B89B7A]' : 'border-gray-300'
                )}
              >
                {isSelected && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
            </div>
          )}
        </div>
      );

    // Opção tipo card
    case 'card':
      return (
        <div
          className={cn(
            'relative rounded-lg border p-4 cursor-pointer transition-all duration-200',
            isSelected
              ? 'bg-[#B89B7A] bg-opacity-10 border-[#B89B7A]'
              : 'border-gray-200 hover:border-gray-300',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          onClick={handleClick}
          data-value={value}
        >
          <div className="flex items-center gap-3">
            {/* Indicador de seleção */}
            <div
              className={cn(
                'w-5 h-5 border rounded-full flex items-center justify-center flex-shrink-0',
                isSelected ? 'bg-[#B89B7A] border-[#B89B7A]' : 'border-gray-300'
              )}
            >
              {isSelected && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>

            {/* Conteúdo da opção */}
            <div className="flex-grow">
              <p className="font-medium">{text}</p>
            </div>

            {/* Imagem opcional */}
            {imageUrl && (
              <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden">
                <img src={imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      );

    // Opção apenas texto
    case 'text-only':
      return (
        <div
          className={cn(
            'relative rounded-lg border px-4 py-3 cursor-pointer transition-all duration-200',
            isSelected ? 'bg-[#B89B7A] text-white' : 'border-gray-200 hover:border-gray-300',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          onClick={handleClick}
          data-value={value}
        >
          <p className="font-medium">{text}</p>
        </div>
      );

    // Opção padrão
    default:
      return (
        <div
          className={cn(
            'relative rounded-lg border cursor-pointer transition-all duration-200 overflow-hidden',
            isSelected
              ? 'ring-2 ring-[#B89B7A] border-[#B89B7A]'
              : 'border-gray-200 hover:border-gray-300',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          onClick={handleClick}
          data-value={value}
        >
          <div className="flex">
            {/* Imagem opcional */}
            {imageUrl && (
              <div className="w-20 h-20 flex-shrink-0">
                <img src={imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Texto */}
            <div
              className={cn(
                'flex-grow',
                sizeClasses[size],
                isSelected ? 'bg-[#B89B7A] bg-opacity-10' : ''
              )}
            >
              <p className="font-medium">{text}</p>
            </div>

            {/* Checkbox para multi-select */}
            {multiSelect && (
              <div className="p-3">
                <div
                  className={cn(
                    'w-5 h-5 border rounded flex items-center justify-center transition-colors',
                    isSelected ? 'bg-[#B89B7A] border-[#B89B7A]' : 'border-gray-300'
                  )}
                >
                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
  }
};

export default QuizOption;
