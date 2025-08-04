import React from "react";
import BonusSection from "@/components/result/BonusSection";

/**
 * BLOCO EDITÁVEL: Seção de Bônus
 *
 * Props Editáveis:
 * - title: string (título da seção)
 * - bonuses: array de bônus
 * - showPricing: boolean (mostrar preços)
 * - backgroundColor: string
 * - cardStyle: 'default' | 'premium' | 'minimal'
 *
 * Exemplo de Uso:
 * <BonusSectionBlock
 *   title="Bônus Exclusivos"
 *   bonuses={[
 *     {
 *       name: 'Guia de Cores',
 *       value: 'R$ 97,00',
 *       description: 'Descubra as cores ideais para você'
 *     }
 *   ]}
 * />
 */

export interface BonusItem {
  name: string;
  value?: string;
  description: string;
  image?: string;
}

export interface BonusSectionBlockProps {
  blockId?: string;
  title?: string;
  bonuses?: BonusItem[];
  showPricing?: boolean;
  backgroundColor?: string;
  cardStyle?: "default" | "premium" | "minimal";
  className?: string;
}

const BonusSectionBlock: React.FC<BonusSectionBlockProps> = ({
  blockId = "bonus-section",
  title = "Bônus Exclusivos",
  bonuses = [
    {
      name: "Guia Completo de Cores",
      value: "R$ 97,00",
      description: "Descubra quais cores realçam sua beleza natural",
    },
    {
      name: "Checklist de Compras",
      value: "R$ 47,00",
      description: "Lista definitiva para montar seu guarda-roupa perfeito",
    },
    {
      name: "Templates de Looks",
      value: "R$ 127,00",
      description: "Combinações prontas para diferentes ocasiões",
    },
  ],
  showPricing = true,
  backgroundColor = "#ffffff",
  cardStyle = "default",
  className = "",
}) => {
  return (
    <div
      className={`bonus-section-block ${className}`}
      data-block-id={blockId}
      style={{ backgroundColor }}
    >
      <BonusSection />
    </div>
  );
};

export default BonusSectionBlock;
