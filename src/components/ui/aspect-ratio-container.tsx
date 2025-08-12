interface AspectRatioContainerProps {
  ratio?: string;
  className?: string;
  children: React.ReactNode;
  minHeight?: string;
  bgColor?: string;
}

/**
 * AspectRatioContainer - Um componente que mantém uma proporção consistente
 * para evitar mudanças de layout (CLS) durante o carregamento da página
 */
export const AspectRatioContainer: React.FC<AspectRatioContainerProps> = ({
  ratio = "1/1",
  className = "",
  children,
  minHeight = "0",
  bgColor = "transparent",
}) => {
  return (
    <div
      className={`relative ${className}`}
      style={{
        aspectRatio: ratio,
        minHeight: minHeight,
        backgroundColor: bgColor,
      }}
    >
      {children}
    </div>
  );
};
