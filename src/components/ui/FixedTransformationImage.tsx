import { OptimizedImage } from "./optimized-image-v2";

interface FixedTransformationImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

/**
 * FixedTransformationImage - Componente específico para exibição de imagens de transformação
 * com configurações já otimizadas para esse caso de uso
 */
export const FixedTransformationImage: React.FC<FixedTransformationImageProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
}) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      quality={90} // Qualidade específica para transformações
      placeholderColor="#f8f5f2" // Cor de fundo que combina com interface
      objectFit="cover"
    />
  );
};
