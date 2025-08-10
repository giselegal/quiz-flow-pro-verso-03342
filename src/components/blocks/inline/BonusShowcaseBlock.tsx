import { cn } from "../../../lib/utils";
import React from "react";
import type { BlockComponentProps } from "../../../types/blocks";

interface Bonus {
  title: string;
  image: string;
  description?: string;
}

/**
 * BonusShowcaseBlock - Componente para exibir bônus do produto
 */
const BonusShowcaseBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = "",
}) => {
  const {
    title = "🎁 BÔNUS INCLUSOS:",
    bonuses = [],
    containerWidth = "full",
    spacing = "medium",
  } = block.properties || {};

  return (
    <div
      className={cn(
        "bonus-showcase w-full",
        className,
        isSelected && "ring-2 ring-blue-500 ring-opacity-50"
      )}
      onClick={onClick}
    >
      <div className="bg-gradient-to-br from-[#F3E8E6] to-[#FAF9F7] rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-[#432818] text-center mb-8 font-['Playfair_Display']">
          {title}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bonuses.map((bonus: Bonus, index: number) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="mb-4">
                <img
                  src={bonus.image}
                  alt={bonus.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>

              <h4 className="text-lg font-semibold text-[#432818] mb-2">{bonus.title}</h4>

              {bonus.description && <p style={{ color: '#6B4F43' }}>{bonus.description}</p>}
            </div>
          ))}
        </div>

        {bonuses.length === 0 && (
          <div style={{ color: '#8B7355' }}>
            Configure os bônus nas propriedades do componente
          </div>
        )}
      </div>
    </div>
  );
};

export default BonusShowcaseBlock;
