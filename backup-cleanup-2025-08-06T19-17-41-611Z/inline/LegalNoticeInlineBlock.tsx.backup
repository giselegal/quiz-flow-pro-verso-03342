import { cn } from "@/lib/utils";
import type { BlockComponentProps } from "@/types/blocks";
import { AlertTriangle, Eye, FileText, Info, Lock, Shield } from "lucide-react";
import React from "react";

interface LegalNoticeInlineProperties {
  content: string;
  iconType?: "shield" | "lock" | "eye" | "info" | "warning" | "document";
  showIcon?: boolean;
  fontSize?: "xs" | "sm" | "base" | "lg";
  textAlign?: "left" | "center" | "right";
  textColor?: string;
  backgroundColor?: string;
  borderStyle?: "none" | "solid" | "dashed" | "dotted";
  borderColor?: string;
  padding?: "none" | "sm" | "md" | "lg";
  margin?: "none" | "sm" | "md" | "lg";
  linkColor?: string;
  linkUnderline?: boolean;
}

const LegalNoticeInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  properties,
  isSelected,
  onClick,
  onPropertyChange,
}) => {
  const {
    content = "Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.",
    iconType = "shield",
    showIcon = true,
    fontSize = "sm",
    textAlign = "center",
    textColor = "#6B7280",
    backgroundColor = "transparent",
    borderStyle = "none",
    borderColor = "#E5E7EB",
    padding = "sm",
    margin = "md",
    linkColor = "#3B82F6",
    linkUnderline = true,
  } = (properties || {}) as LegalNoticeInlineProperties;

  const handlePropertyUpdate = (key: string, value: any) => {
    onPropertyChange?.(key, value);
  };

  const getIcon = () => {
    const iconMap = {
      shield: Shield,
      lock: Lock,
      eye: Eye,
      info: Info,
      warning: AlertTriangle,
      document: FileText,
    };
    const IconComponent = iconMap[iconType] || Shield;
    return <IconComponent className="w-4 h-4 mr-2 flex-shrink-0" />;
  };

  const getFontSizeClass = () => {
    const sizeMap = {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
    };
    return sizeMap[fontSize] || sizeMap.sm;
  };

  const getAlignClass = () => {
    const alignMap = {
      left: "text-left justify-start",
      center: "text-center justify-center",
      right: "text-right justify-end",
    };
    return alignMap[textAlign] || alignMap.center;
  };

  const getPaddingClass = () => {
    const paddingMap = {
      none: "",
      sm: "p-2",
      md: "p-4",
      lg: "p-6",
    };
    return paddingMap[padding] || paddingMap.sm;
  };

  const getMarginClass = () => {
    const marginMap = {
      none: "",
      sm: "my-2",
      md: "my-4",
      lg: "my-6",
    };
    return marginMap[margin] || marginMap.md;
  };

  const getBorderClass = () => {
    if (borderStyle === "none") return "";
    return `border border-${borderStyle}`;
  };

  // Função para processar links no texto
  const processLinks = (text: string) => {
    // Regex para detectar padrões de link como "Termos de Uso" ou "Política de Privacidade"
    const linkRegex =
      /(Termos de Uso|Política de Privacidade|Termos e Condições|Privacy Policy|Terms of Service)/gi;

    return text.split(linkRegex).map((part, index) => {
      if (linkRegex.test(part)) {
        return (
          <a
            key={index}
            href="#"
            className={cn(
              "font-medium hover:opacity-80 transition-opacity",
              linkUnderline && "underline"
            )}
            style={{ color: linkColor }}
            onClick={e => e.preventDefault()}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={cn(
        "legal-notice-inline-block transition-all duration-200",
        getMarginClass(),
        isSelected && "ring-2 ring-blue-500 ring-opacity-50 rounded-md"
      )}
      data-block-id={block.id}
      onClick={onClick}
    >
      <div
        className={cn(
          "flex items-start rounded-md transition-all duration-200",
          getFontSizeClass(),
          getAlignClass(),
          getPaddingClass(),
          getBorderClass()
        )}
        style={{
          color: textColor,
          backgroundColor: backgroundColor !== "transparent" ? backgroundColor : undefined,
          borderColor: borderStyle !== "none" ? borderColor : undefined,
        }}
      >
        {showIcon && !isSelected && <div className="flex-shrink-0">{getIcon()}</div>}

        {isSelected ? (
          <textarea
            className="w-full bg-transparent border border-gray-300 rounded-md p-2 resize-none outline-none focus:ring-2 focus:ring-blue-500"
            value={content}
            onChange={e => handlePropertyUpdate("content", e.target.value)}
            placeholder="Digite o texto do aviso legal..."
            rows={3}
          />
        ) : (
          <div className="flex-1">{processLinks(content)}</div>
        )}
      </div>

      {/* Controles de edição inline quando selecionado */}
      {isSelected && (
        <div className="mt-2 p-2 bg-gray-50 rounded-md">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={showIcon}
                onChange={e => handlePropertyUpdate("showIcon", e.target.checked)}
              />
              Mostrar ícone
            </label>

            <select
              className="border border-gray-300 rounded px-1 py-0.5"
              value={iconType}
              onChange={e => handlePropertyUpdate("iconType", e.target.value)}
            >
              <option value="shield">Escudo</option>
              <option value="lock">Cadeado</option>
              <option value="eye">Olho</option>
              <option value="info">Info</option>
              <option value="warning">Aviso</option>
              <option value="document">Documento</option>
            </select>

            <select
              className="border border-gray-300 rounded px-1 py-0.5"
              value={fontSize}
              onChange={e => handlePropertyUpdate("fontSize", e.target.value)}
            >
              <option value="xs">Muito pequeno</option>
              <option value="sm">Pequeno</option>
              <option value="base">Normal</option>
              <option value="lg">Grande</option>
            </select>

            <select
              className="border border-gray-300 rounded px-1 py-0.5"
              value={textAlign}
              onChange={e => handlePropertyUpdate("textAlign", e.target.value)}
            >
              <option value="left">Esquerda</option>
              <option value="center">Centro</option>
              <option value="right">Direita</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalNoticeInlineBlock;
