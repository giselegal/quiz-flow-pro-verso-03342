import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle, Sparkles } from "lucide-react";

/**
 * LoadingTransitionBlock - Componente de transição com loading (Etapa 19)
 *
 * Props editáveis via editor visual:
 * - title: string - Título do loading
 * - messages: string[] - Mensagens rotativas
 * - duration: number - Duração em ms
 * - showProgress: boolean - Mostrar barra de progresso
 * - animationType: string - Tipo de animação
 * - autoAdvance: boolean - Avançar automaticamente
 * - onComplete: function - Callback ao completar
 *
 * @example
 * <LoadingTransitionBlock
 *   blockId="final-loading"
 *   title="Preparando seu resultado..."
 *   messages={[
 *     'Analisando suas preferências...',
 *     'Calculando compatibilidade...',
 *     'Finalizando análise...'
 *   ]}
 *   duration={3000}
 *   onComplete={() => navigate('/resultado')}
 * />
 */

export interface LoadingTransitionBlockProps {
  // Identificação
  blockId: string;
  className?: string;
  style?: React.CSSProperties;

  // Conteúdo editável
  title?: string;
  messages?: string[];
  completedMessage?: string;

  // Configurações de timing
  duration?: number;
  messageInterval?: number;

  // Visual
  showProgress?: boolean;
  animationType?: "spinner" | "dots" | "pulse" | "sparkles";
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;

  // Funcionalidade
  autoAdvance?: boolean;
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === "string" ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return "";

  const prefix = type === "top" ? "mt" : type === "bottom" ? "mb" : type === "left" ? "ml" : "mr";

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

const LoadingTransitionBlock: React.FC<LoadingTransitionBlockProps> = ({
  blockId = "loading-transition-block",
  className = "",
  style = {},

  title = "Preparando seu resultado personalizado...",
  messages = [
    "Analisando suas preferências de estilo...",
    "Calculando compatibilidade com estilos...",
    "Processando suas respostas...",
    "Finalizando análise personalizada...",
  ],
  completedMessage = "Análise concluída! ✨",

  duration = 3000,
  messageInterval = 800,

  showProgress = true,
  animationType = "spinner",
  backgroundColor = "#ffffff",
  textColor = "#432818",
  accentColor = "#B89B7A",

  autoAdvance = true,
  onComplete,
  onProgress,
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Rotação de mensagens
  useEffect(() => {
    if (isCompleted || messages.length === 0) return;

    const messageTimer = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1 >= messages.length ? 0 : prev + 1));
    }, messageInterval);

    return () => clearInterval(messageTimer);
  }, [messages.length, messageInterval, isCompleted]);

  // Progresso do loading
  useEffect(() => {
    if (isCompleted) return;

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 100 / (duration / 50);

        if (onProgress) {
          onProgress(Math.min(newProgress, 100));
        }

        if (newProgress >= 100) {
          setIsCompleted(true);
          setTimeout(() => {
            if (autoAdvance && onComplete) {
              onComplete();
            }
          }, 500);
        }

        return Math.min(newProgress, 100);
      });
    }, 50);

    return () => clearInterval(progressTimer);
  }, [duration, autoAdvance, onComplete, onProgress, isCompleted]);

  const renderAnimation = () => {
    switch (animationType) {
      case "spinner":
        return <Loader2 className="w-12 h-12 animate-spin" style={{ color: accentColor }} />;

      case "dots":
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-3 h-3 rounded-full animate-pulse"
                style={{
                  backgroundColor: accentColor,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
        );

      case "pulse":
        return (
          <div
            className="w-16 h-16 rounded-full animate-ping"
            style={{ backgroundColor: `${accentColor}40` }}
          />
        );

      case "sparkles":
        return <Sparkles className="w-12 h-12 animate-pulse" style={{ color: accentColor }} />;

      default:
        return <Loader2 className="w-12 h-12 animate-spin" style={{ color: accentColor }} />;
    }
  };

  return (
    <div
      className={`loading-transition-block min-h-screen flex items-center justify-center ${className}`}
      data-block-id={blockId}
      style={{
        backgroundColor,
        color: textColor,
        ...style,
      }}
    >
      <div className="max-w-2xl mx-auto text-center px-6">
        {/* Ícone de sucesso quando completo */}
        {isCompleted ? (
          <div className="mb-8">
            <CheckCircle className="w-16 h-16 mx-auto" style={{ color: "#10B981" }} />
          </div>
        ) : (
          <div className="mb-8">{renderAnimation()}</div>
        )}

        {/* Título */}
        <h2
          className="text-2xl md:text-3xl font-bold mb-6"
          style={{
            fontFamily: "Playfair Display, serif",
            color: textColor,
          }}
        >
          {isCompleted ? completedMessage : title}
        </h2>

        {/* Mensagem atual */}
        {!isCompleted && messages.length > 0 && (
          <p
            className="text-lg text-gray-600 mb-8 min-h-[2rem] transition-all duration-300"
            key={currentMessageIndex}
          >
            {messages[currentMessageIndex]}
          </p>
        )}

        {/* Barra de progresso */}
        {showProgress && (
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-100 ease-out"
                style={{
                  backgroundColor: accentColor,
                  width: `${progress}%`,
                  transform: `translateX(${progress < 100 ? "-2px" : "0"})`,
                }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}% concluído</p>
          </div>
        )}

        {/* Informação adicional */}
        {!isCompleted && (
          <div className="text-sm text-gray-500">
            <p>⏱️ Isso levará apenas alguns segundos...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingTransitionBlock;
