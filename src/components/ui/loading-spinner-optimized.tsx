// Otimização do componente de spinner para melhorar a performance

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  thickness?: 'thin' | 'normal' | 'thick';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = '#B89B7A',
  className = '',
  thickness = 'normal',
}) => {
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const thicknessMap = {
    thin: 'border-2',
    normal: 'border-3', // Reduzido de border-4 para border-3
    thick: 'border-[5px]', // Reduzido de border-[6px] para border-[5px]
  };

  const sizeClass = sizeMap[size] || sizeMap.md;
  const thicknessClass = thicknessMap[thickness] || thicknessMap.normal;

  return (
    <div
      className={`flex justify-center items-center ${className}`}
      role="status"
      aria-label="Loading"
    >
      <div
        className={`${sizeClass} ${thicknessClass} rounded-full`}
        style={{
          borderColor: `${color} transparent transparent transparent`,
          animation: 'spin-optimized 0.8s linear infinite', // Reduzido de 1s para 0.8s
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      />
    </div>
  );
};
