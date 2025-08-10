/**
 * 🖼️ COMPONENTE IMAGEM INLINE
 * ===========================
 *
 * Componente para exibição de imagens otimizado
 * totalmente integrado com o sistema de propriedades unificado.
 */

import React, { useState } from "react";

interface ImageDisplayInlineProps {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  borderRadius?: number;
  shadow?: boolean;
  alignment?: "left" | "center" | "right";
  objectFit?: "cover" | "contain" | "fill" | "scale-down";
  loading?: "lazy" | "eager";
  quality?: "high" | "medium" | "low";
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const ImageDisplayInline: React.FC<ImageDisplayInlineProps> = ({
  src,
  alt = "Imagem",
  width = "100%",
  height = "auto",
  borderRadius = 12,
  shadow = true,
  alignment = "center",
  objectFit = "cover",
  loading = "lazy",
  quality = "high",
  className = "",
  style = {},
  onClick,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: alignment,
    width: "100%",
    ...style,
  };

  const imageStyle: React.CSSProperties = {
    width,
    height,
    borderRadius: `${borderRadius}px`,
    objectFit,
    boxShadow: shadow ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none",
    transition: "all 0.3s ease",
    cursor: onClick ? "pointer" : "default",
    filter: quality === "low" ? "blur(0.5px)" : "none",
    opacity: isLoading ? 0.7 : 1,
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`image-display-inline error ${className}`} style={containerStyle}>
        <div
          style={{
            ...imageStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            border: "2px dashed #ddd",
            color: "#999",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          Erro ao carregar imagem
        </div>
      </div>
    );
  }

  return (
    <div className={`image-display-inline ${className}`} style={containerStyle}>
      {isLoading && (
        <div
          style={{
            ...imageStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0f0f0",
            color: "#999",
          }}
        >
          Carregando...
        </div>
      )}
      <img
        src={src}
        alt={alt}
        style={{
          ...imageStyle,
          display: isLoading ? "none" : "block",
        }}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        {...props}
      />
    </div>
  );
};

export default ImageDisplayInline;
