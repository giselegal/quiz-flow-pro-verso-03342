import React from "react";
import FunnelHeroSection from "@/components/funnel/base/FunnelHeroSection";

// Interface local para máxima independência
interface Block {
  id: string;
  type: string;
  properties: Record<string, any>;
}

/**
 * 🚀 UnifiedFunnelHeroBlock - Wrapper para máxima reutilização
 *
 * ✅ REUTILIZÁVEL: Mesmo componente em editor e funil real
 * ✅ RESPONSIVO: Layout adaptativo para mobile/tablet/desktop
 * ✅ INDEPENDENTE: Não depende de contexto externo
 * ✅ TOTALMENTE EDITÁVEL: Todas as props configuráveis via painel
 */

interface BlockComponentProps {
  block: Block;
  isSelected: boolean;
  onSaveInline: (blockId: string, updates: Partial<Block>) => void;
  onBlockSelect: (blockId: string) => void;
}

const UnifiedFunnelHeroBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected,
  onSaveInline,
  onBlockSelect,
}) => {
  // Valores padrão para máxima reutilização
  const props = {
    title: block.properties.title || "Seu Título Persuasivo Aqui",
    description:
      block.properties.description || "Descrição que conecta com seu público e gera conversão",
    ctaText: block.properties.ctaText || "Call to Action",
    ctaSubtext: block.properties.ctaSubtext,
    logoUrl: block.properties.logoUrl,
    logoAlt: block.properties.logoAlt || "Logo da marca",
    heroImageUrl: block.properties.heroImageUrl,
    heroImageAlt: block.properties.heroImageAlt || "Imagem hero",
    backgroundColor: block.properties.backgroundColor || "#FAF9F7",
    textColor: block.properties.textColor || "#432818",
    primaryColor: block.properties.primaryColor || "#B89B7A",
    layout: block.properties.layout || "side-by-side",
    imagePosition: block.properties.imagePosition || "right",

    // Props específicas do editor
    isSelected,
    onClick: () => onBlockSelect(block.id),
    className: isSelected ? "ring-2 ring-[#B89B7A] ring-offset-2" : "",

    // Handler para CTA (totalmente configurável)
    onCTAClick: () => {
      // Em produção, pode navegar para próxima página ou executar ação
      console.log("CTA clicked:", block.properties.ctaText);
      // Pode chamar onSaveInline para track de interação se necessário
    },
  };

  return (
    <div className="relative group">
      <FunnelHeroSection {...props} />

      {/* Indicator visual para seleção no editor */}
      {isSelected && (
        <div className="absolute top-0 left-0 bg-[#B89B7A]/100 text-white text-xs px-2 py-1 rounded-br-md z-10">
          Hero Section
        </div>
      )}
    </div>
  );
};

export default UnifiedFunnelHeroBlock;
