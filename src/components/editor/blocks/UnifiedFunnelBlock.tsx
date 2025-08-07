import React from "react";
import FunnelHeroSection from "@/components/funnel/base/FunnelHeroSection";
import FunnelPainSection from "@/components/funnel/base/FunnelPainSection";
import type { BlockComponentProps } from "@/types/blocks";

/**
 * UnifiedFunnelBlock - Wrapper que usa componentes base do funil real
 *
 * Este componente serve como bridge entre o sistema de blocos do editor
 * e os componentes reais do funil, garantindo 100% de fidelidade visual.
 *
 * Features:
 * - Usa exatamente os mesmos componentes do funil real
 * - Edição apenas via painel de propriedades (não inline)
 * - Selecionável e movível no canvas
 * - Renderização idêntica ao funil real
 */
interface UnifiedFunnelBlockProps extends BlockComponentProps {
  // Props adicionais podem ser adicionadas aqui se necessário
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

const UnifiedFunnelBlock: React.FC<UnifiedFunnelBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  className = "",
}) => {
  // Validação defensiva
  if (!block || !block.properties) {
    return (
      <div className="p-4 border-2 border-red-300 bg-red-50 rounded-lg">
        <p className="text-red-600 font-medium">Erro: Configuração do bloco inválida</p>
        <p className="text-sm text-red-500 mt-1">
          O componente precisa de um objeto 'block' com 'properties' válidas.
        </p>
      </div>
    );
  }

  // Renderizar o componente correto baseado no tipo
  switch (block.type) {
    case "FunnelHeroBlock":
      return (
        <FunnelHeroSection
          title={block.properties.title || "Título do Hero"}
          description={block.properties.description || "Descrição do hero section"}
          ctaText={block.properties.ctaText || "Call to Action"}
          {...block.properties}
          isSelected={isSelected}
          onClick={onClick}
          className={className}
        />
      );

    case "FunnelPainBlock":
      return (
        <FunnelPainSection
          title={block.properties.title || "Problemas que Resolvemos"}
          painPoints={block.properties.painPoints || []}
          {...block.properties}
          isSelected={isSelected}
          onClick={onClick}
          className={className}
        />
      );

    default:
      return (
        <div className="p-4 border-2 border-stone-300 bg-stone-50 rounded-lg">
          <p className="text-stone-600 font-medium">Tipo de bloco não suportado: {block.type}</p>
          <p className="text-sm text-yellow-500 mt-1">
            Adicione o suporte para este tipo no UnifiedFunnelBlock.
          </p>
        </div>
      );
  }
};

export default UnifiedFunnelBlock;
