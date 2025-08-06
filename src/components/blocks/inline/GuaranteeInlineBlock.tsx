import React from "react";
import type { BlockComponentProps } from "@/types/blocks";
import { cn } from "../../../../lib/utils";
import { Shield, CheckCircle2 } from "lucide-react";

interface Props extends BlockComponentProps {
  title?: string;
  description?: string;
  period?: string;
  iconColor?: string;
  bgColor?: string;
  borderColor?: string;
  className?: string;
  [key: string]: any;
}

const GuaranteeInlineBlock: React.FC<GuaranteeInlineBlockProps> = ({
  title = "Garantia de Satisfação",
  description = "Se você não ficar satisfeito, devolvemos 100% do seu dinheiro",
  period = "7 dias",
  iconColor = "#432818",
  bgColor = "#432818",
  borderColor = "#432818",
  className,
  ...props
}) => {
  return (
    <div
      className={cn("w-full p-6 rounded-lg border-2 text-center", className)}
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
      {...props}
    >
      <div className="flex flex-col items-center space-y-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: iconColor }}
        >
          <Shield className="w-8 h-8 text-white" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>

          <div className="flex items-center justify-center space-x-2 pt-2">
            <CheckCircle2 className="w-4 h-4" style={{ color: iconColor }} />
            <span className="text-sm font-medium" style={{ color: iconColor }}>
              {period} de garantia
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuaranteeInlineBlock;
