import React from "react";
import { InlineEditableText } from "./InlineEditableText";
import { TriangleAlert, CheckCircle, Info, XCircle } from "lucide-react";
import type { BlockComponentProps } from "@/types/blocks";

const AlertBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = "",
}) => {
  const {
    title = "Atenção!",
    message = "Esta é uma mensagem importante.",
    variant = "info",
  } = block.properties;

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  const variantClasses: Record<string, string> = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };

  const iconMap: Record<string, React.ReactNode> = {
    info: <Info className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    warning: <TriangleAlert className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
  };

  return (
    <div
      className={`
        p-4 rounded-lg border flex items-start gap-3 cursor-pointer transition-all duration-200
        ${variantClasses[variant || "info"]}
        ${
          isSelected
            ? "ring-1 ring-gray-400/40 bg-gray-50/30"
            : "hover:shadow-md"
        }
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div className="flex-shrink-0 mt-0.5">{iconMap[variant || "info"]}</div>
      <div className="flex-1">
        <h4 className="font-semibold mb-1">
          <InlineEditableText
            value={title}
            onChange={(value: string) => handlePropertyChange("title", value)}
            className="inline-block"
            placeholder="Título do Alerta"
          />
        </h4>
        <div className="text-sm">
          <InlineEditableText
            value={message}
            onChange={(value: string) => handlePropertyChange("message", value)}
            className="inline-block w-full"
            placeholder="Mensagem do alerta"
          />
        </div>
      </div>
    </div>
  );
};

export default AlertBlock;
