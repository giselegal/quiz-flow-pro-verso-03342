import type { BlockComponentProps } from "@/types/blocks";
import React from "react";

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

const LegalNoticeInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
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

  const {
    // Configurações de conteúdo
    privacyText = "Política de Privacidade",
    copyrightText = "© 2025 Gisele Galvão Consultoria",
    termsText = "Termos de Uso",
    // Configurações de estilo
    fontSize = "12",
    fontFamily = "inherit",
    fontWeight = "400",
    textAlign = "center",
    textColor = "#8F7A6A",
    linkColor = "#B89B7A",
    backgroundColor = "transparent",
    lineHeight = "1.5",
    // Sistema de margens
    marginTop = 8,
    marginBottom = 8,
    marginLeft = 0,
    marginRight = 0,
  } = (block?.properties as any) || {};

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  // Estilos CSS dinâmicos
  const containerStyles = {
    backgroundColor: backgroundColor,
    textAlign: textAlign as "left" | "center" | "right",
  };

  const textStyles = {
    fontSize: `${fontSize}px`,
    fontFamily: fontFamily,
    fontWeight: fontWeight,
    color: textColor,
    lineHeight: lineHeight,
  };

  const linkStyles = {
    ...textStyles,
    color: linkColor,
    textDecoration: "none",
    cursor: "pointer",
  };

  return (
    <div
      className={`
        py-6 px-4 cursor-pointer transition-all duration-200
        ${isSelected ? "ring-2 ring-[#B89B7A]/50 bg-gray-50/30" : "hover:shadow-sm"}
        ${className}
        ${getMarginClass(marginTop, "top")}
        ${getMarginClass(marginBottom, "bottom")}
        ${getMarginClass(marginLeft, "left")}
        ${getMarginClass(marginRight, "right")}
      `}
      style={containerStyles}
      onClick={onClick}
      data-block-id={block?.id}
      data-block-type={block?.type}
    >
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Copyright */}
        <div style={textStyles}>
          {copyrightText}
        </div>
        
        {/* Links legais */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <a
            href="#privacy"
            style={linkStyles}
            className="hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {privacyText}
          </a>
          <span style={textStyles}>•</span>
          <a
            href="#terms"
            style={linkStyles}
            className="hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {termsText}
          </a>
        </div>
      </div>
    </div>
  );
};

export default LegalNoticeInlineBlock;
