import React from "react";
import type { BlockComponentProps } from "@/types/blocks";

const ProgressBarStepBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = "",
}) => {
  const {
    currentStep = 1,
    totalSteps = 5,
    stepLabels = [],
    showLabels = true,
  } = block?.properties || {};

  return (
    <div
      className={`
        py-6 px-4 cursor-pointer transition-all duration-200
        ${isSelected ? "ring-1 ring-gray-400/40 bg-gray-50/30" : "hover:shadow-sm"}
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[#432818]">
              Etapa {currentStep} de {totalSteps}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#B89B7A] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {showLabels && (
          <div className="flex justify-between text-xs text-gray-600">
            {(stepLabels || []).map((label: string, index: number) => (
              <span key={index} className={index < currentStep ? "text-[#B89B7A] font-medium" : ""}>
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBarStepBlock;
