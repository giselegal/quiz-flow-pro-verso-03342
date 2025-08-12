import React, { useState, useEffect } from "react";
import { getLowQualityPlaceholder } from "@/utils/imageUtils";

interface ProgressiveImageProps {
  src: string;
  lowQualitySrc?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  loading?: "lazy" | "eager";
  fetchpriority?: "high" | "low" | "auto";
  sizes?: string;
  style?: React.CSSProperties;
  fit?: "cover" | "contain" | "fill";
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  lowQualitySrc,
  alt,
  className = "",
  width,
  height,
  onLoad,
  loading = "lazy",
  fetchpriority = "auto",
  sizes,
  style,
  fit = "cover",
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [loadStartTime] = useState(Date.now());

  // Gerar placeholder de baixa qualidade se não for fornecido
  const placeholder = lowQualitySrc || getLowQualityPlaceholder(src, { width: 30, quality: 15 });

  // Controlar o carregamento da imagem
  const handleLoad = () => {
    // Log do tempo de carregamento para otimizações futuras
    const loadTime = Date.now() - loadStartTime;
    console.debug(`[Image] Carregada em ${loadTime}ms: ${src}`);

    setLoaded(true);
    if (onLoad) onLoad();
  };

  // Lidar com erro de carregamento
  const handleError = () => {
    console.warn(`[Image] Erro ao carregar: ${src}`);
    setError(true);
    // Garantir que o callback onLoad seja chamado mesmo em erro
    // para não travar a progressão do carregamento
    if (onLoad) onLoad();
  };

  // Iniciar temporizador para garantir eventual carregamento
  useEffect(() => {
    // Timeout de 5 segundos para garantir que a imagem seja considerada carregada
    // mesmo sem eventos de onload/onerror (fallback de segurança)
    const safetyTimer = setTimeout(() => {
      if (!loaded && !error) {
        console.warn(`[Image] Timeout de carregamento: ${src}`);
        setLoaded(true);
        if (onLoad) onLoad();
      }
    }, 5000);

    return () => clearTimeout(safetyTimer);
  }, [loaded, error, src, onLoad]);

  return (
    <div
      className={`progressive-image-container relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Imagem de baixa qualidade para carregamento progressivo */}
      {!loaded && !error && (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={placeholder}
            alt={alt}
            className="w-full h-full blur-lg scale-110 transition-opacity"
            style={{ objectFit: fit }}
            aria-hidden="true"
            width={width}
            height={height}
          />
          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
        </div>
      )}

      {/* Imagem principal com efeito de fade-in */}
      {!error ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          {...({ fetchpriority } as any)}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          style={{ objectFit: fit }}
        />
      ) : (
        <div style={{ backgroundColor: "#E5DDD5" }}>Não foi possível carregar a imagem</div>
      )}
    </div>
  );
};

export default ProgressiveImage;
