import { cn } from '@/lib/utils';

interface FunnelProgressBarProps {
  currentStep: number;
  totalSteps: number;
  showLabels?: boolean;
  className?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showPercentage?: boolean;
}

/**
 * Barra de progresso reutilizável para funis
 *
 * Exibe o progresso atual no funil, com opções de personalização.
 */
const FunnelProgressBar: React.FC<FunnelProgressBarProps> = ({
  currentStep,
  totalSteps,
  showLabels = false,
  className = '',
  color = '#B89B7A',
  size = 'md',
  animated = true,
  showPercentage = false,
}) => {
  // Calcular a porcentagem de progresso
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  // Classes baseadas no tamanho
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Barra principal */}
      <div style={{ backgroundColor: '#E5DDD5' }}>
        <div
          className={cn(
            'bg-current rounded-full',
            sizeClasses[size],
            animated && 'transition-all duration-500'
          )}
          style={{
            width: `${progressPercentage}%`,
            color: color,
          }}
        />
      </div>

      {/* Labels e porcentagem */}
      {(showLabels || showPercentage) && (
        <div style={{ color: '#8B7355' }}>
          {showLabels && (
            <div className="flex justify-between w-full">
              <span>Etapa {currentStep}</span>
              <span>Total: {totalSteps}</span>
            </div>
          )}

          {showPercentage && !showLabels && (
            <span className="ml-auto">{progressPercentage}% completo</span>
          )}
        </div>
      )}
    </div>
  );
};

export { FunnelProgressBar };
export default FunnelProgressBar;
