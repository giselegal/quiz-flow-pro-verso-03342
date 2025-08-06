import React from "react";
import { cn } from "@/lib/utils";
import { Gift } from "lucide-react";
import type { BlockComponentProps } from "@/types/blocks";
import { safeGetBlockProperties, logBlockDebug } from "@/utils/blockUtils";

/**
 * BonusListInlineBlock - Lista de bônus
 */
const BonusListInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = "",
}) => {
  logBlockDebug("BonusListInlineBlock", block);
  const properties = safeGetBlockProperties(block);

  const {
    title = "Bônus Inclusos",
    bonuses = [{ title: "Bônus 1", value: "R$ 97", description: "Descrição do bônus" }],
  } = properties;

  return (
    <div
      className={cn(
        "w-full p-4 rounded-lg transition-all duration-200",
        isSelected && "ring-2 ring-[#B89B7A]",
        "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <h3 className="font-semibold mb-4 text-center flex items-center justify-center">
        <Gift className="w-5 h-5 mr-2 text-[#B89B7A]" />
        {title}
      </h3>
      <div className="space-y-3">
        {bonuses.map((bonus: any, index: number) => (
          <div
            key={index}
            className="bg-gradient-to-r from-[#B89B7A]/10 to-transparent p-3 rounded-lg border-l-4 border-[#B89B7A]"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium">{bonus.title}</h4>
                <p className="text-sm text-gray-600">{bonus.description}</p>
              </div>
              <span className="font-bold text-[#B89B7A]">{bonus.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BonusListInlineBlock;
