import { cn } from "@/lib/utils";
import { ArrowRight, Download, Edit3, MousePointer2, Play, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { userResponseService } from "../../../services/userResponseService";
import type { BlockComponentProps } from "../../../types/blocks";
import { trackQuizStart } from "../../../utils/analytics";

/**
 * ButtonInlineBlock - Componente modular inline horizontal
 * Botão responsivo e configurável com múltiplas variantes
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value: string | number, type: "top" | "bottom" | "left" | "right"): string => {
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

const ButtonInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = "",
}) => {
  // Verificação de segurança para evitar erro de undefined
  if (!block) {
    return (
      <div className="p-4 border-2 border-red-300 bg-red-50 rounded-lg">
        <p className="text-red-600">Erro: Bloco não encontrado</p>
      </div>
    );
  }

  if (!block.properties) {
    return (
      <div className="bg-red-100 p-2 text-red-600 text-sm rounded">
        ⚠️ Erro: Propriedades do bloco não encontradas
      </div>
    );
  }

  const {
    text = "Clique aqui",
    variant = "primary",
    size = "medium", 
    icon = "none",
    iconPosition = "right",
    href = "",
    url = "", // Campo adicional para URL
    target = "_blank",
    disabled = false,
    customStyles = "",
    requiresValidInput = false,
    // Configurações de cores
    backgroundColor = "#B89B7A",
    textColor = "#FFFFFF", 
    borderColor = "#B89B7A",
    // Configurações de fonte
    fontSize = "16",
    fontFamily = "inherit",
    fontWeight = "500",
    // Configurações de navegação/fluxo
    action = "none", // "next-step", "url", "none"
    nextStepId = "", // ID da próxima etapa
    // Sistema completo de margens com controles deslizantes
    marginTop = 8,
    marginBottom = 8,
    marginLeft = 0,
    marginRight = 0,
  } = (block?.properties as any) || {};

  const [isValidated, setIsValidated] = useState(false);

  // Efeito para verificar validação quando necessário
  useEffect(() => {
    if (requiresValidInput) {
      // Verificar se há input válido (exemplo: nome preenchido)
      const nameValue = userResponseService.getResponse("intro-name-input");
      setIsValidated(!!nameValue && nameValue.trim().length > 0);
    } else {
      setIsValidated(true);
    }
  }, [requiresValidInput]);

  // Determinar se o botão deve estar desabilitado
  const isButtonDisabled = disabled || (requiresValidInput && !isValidated);

  // 🚀 Função para inicializar quiz no Supabase
  const initializeQuizWithSupabase = async (userName: string) => {
    try {
      // Placeholder - Supabase integration will be implemented later
      console.log("Supabase integration placeholder:", {
        name: userName,
        utm_source: new URLSearchParams(window.location.search).get("utm_source") || undefined,
      });

      console.log("✅ Quiz inicializado no Supabase com sucesso");
    } catch (error) {
      console.error("❌ Erro ao inicializar quiz no Supabase:", error);
    }
  };

  // Ícones disponíveis
  const iconMap = {
    none: null,
    "arrow-right": ArrowRight,
    download: Download,
    play: Play,
    star: Star,
  };

  const IconComponent = iconMap[icon as keyof typeof iconMap];

  // Variantes de cor - usando as configurações customizáveis
  const getButtonStyles = () => {
    if (variant === "custom" || variant === "primary") {
      return {
        backgroundColor: backgroundColor,
        color: textColor,
        borderColor: borderColor,
        fontFamily: fontFamily,
        fontSize: `${fontSize}px`,
        fontWeight: fontWeight,
      };
    }
    
    const predefinedStyles = {
      secondary: {
        backgroundColor: "#6B7280",
        color: "#FFFFFF", 
        borderColor: "#6B7280",
      },
      success: {
        backgroundColor: "#10B981",
        color: "#FFFFFF",
        borderColor: "#10B981",
      },
      warning: {
        backgroundColor: "#F59E0B",
        color: "#FFFFFF",
        borderColor: "#F59E0B",
      },
      danger: {
        backgroundColor: "#EF4444", 
        color: "#FFFFFF",
        borderColor: "#EF4444",
      },
      outline: {
        backgroundColor: "transparent",
        color: backgroundColor,
        borderColor: backgroundColor,
      },
    };
    
    return {
      ...(predefinedStyles[variant as keyof typeof predefinedStyles] || predefinedStyles.secondary),
      fontFamily: fontFamily,
      fontSize: `${fontSize}px`, 
      fontWeight: fontWeight,
    };
  };

  // Tamanhos de botão
  const sizeClasses = {
    small: "px-3 py-1.5 text-sm gap-1.5 min-h-[32px]",
    medium: "px-4 py-2 text-base gap-2 min-h-[40px]",
    large: "px-6 py-3 text-lg gap-2.5 min-h-[48px]",
  };

  const iconSizes = {
    small: "w-3 h-3",
    medium: "w-4 h-4",
    large: "w-5 h-5",
  };

  // Função para determinar classes responsivas 
  const getResponsiveClasses = () => {
    return cn(
      // Classes base do botão
      "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89B7A] focus-visible:ring-offset-2", 
      "disabled:pointer-events-none disabled:opacity-50",
      "border-2 w-full hover:opacity-90",

      // Aplicar tamanho
      sizeClasses[size as keyof typeof sizeClasses],

      // Estado de seleção no editor
      isSelected && "ring-2 ring-[#B89B7A] ring-offset-2",

      // Classes customizadas
      className
    );
  };

  return (
    <div
      className={cn(
        "group relative inline-flex w-full cursor-pointer transition-all duration-200",
        isSelected && "ring-1 ring-[#B89B7A]/40",
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, "top"),
        getMarginClass(marginBottom, "bottom"),
        getMarginClass(marginLeft, "left"),
        getMarginClass(marginRight, "right")
      )}
      onClick={onClick}
      data-block-id={block?.id}
      data-block-type={block?.type}
    >
      {/* Botão principal */}
      <button
        type="button"
        disabled={isButtonDisabled}
        className={getResponsiveClasses()}
        style={getButtonStyles()}
        onClick={async e => {
          e.stopPropagation();
          if (!isButtonDisabled) {
            
            // Ação baseada na configuração
            if (action === "next-step" && nextStepId) {
              window.dispatchEvent(
                new CustomEvent("navigate-to-step", {
                  detail: { stepId: nextStepId, source: `button-${block?.id}` },
                })
              );
            } else if (action === "url" && (href || url)) {
              const targetUrl = url || href;
              window.open(targetUrl, target);
            }
            
            // Se for o botão de iniciar quiz (Step 1), fazer tracking e navegação
            if (text && text.includes("Descobrir meu Estilo")) {
              const userName = userResponseService.getResponse("intro-name-input") || "Anônimo";
              console.log("🚀 Iniciando tracking do quiz para:", userName);

              // 🚀 INTEGRAÇÃO SUPABASE: Criar usuário e iniciar sessão
              await initializeQuizWithSupabase(userName);

              // Marcar início do quiz no analytics
              trackQuizStart(userName);

              // Salvar timestamp de início
              localStorage.setItem("quiz_start_time", Date.now().toString());
              localStorage.setItem("quiz_start_tracked", "true");
              localStorage.setItem("userName", userName);

              // Disparar evento customizado para outras partes do sistema
              window.dispatchEvent(
                new CustomEvent("quiz-start", {
                  detail: { userName, timestamp: Date.now() },
                })
              );

              // Navegar para Step 2 (primeira questão)
              window.dispatchEvent(
                new CustomEvent("navigate-to-step", {
                  detail: { stepId: "etapa-2", source: "step1-button" },
                })
              );
            }
          }
        }}
      >
        {/* Ícone à esquerda */}
        {IconComponent && iconPosition === "left" && (
          <IconComponent className={cn(iconSizes[size as keyof typeof iconSizes], "mr-2")} />
        )}

        {/* Texto do botão */}
        <span className="flex-1 text-center truncate">{text || "Clique aqui"}</span>

        {/* Ícone à direita */}
        {IconComponent && iconPosition === "right" && (
          <IconComponent className={cn(iconSizes[size as keyof typeof iconSizes], "ml-2")} />
        )}
      </button>

      {/* Indicador de seleção */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-[#B89B7A]/100 text-white rounded-full p-1">
          <Edit3 className="w-3 h-3" />
        </div>
      )}

      {/* Empty state */}
      {!text && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 rounded-lg text-gray-500 text-sm">
          <MousePointer2 className="w-4 h-4 mr-2" />
          Clique para selecionar e editar no painel
        </div>
      )}
    </div>
  );
};

export default ButtonInlineBlock;
