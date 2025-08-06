import { cn } from "@/lib/utils";
import type { BlockComponentProps } from "@/types/blocks";
import React from "react";

interface FormInputProperties {
  label?: string;
  placeholder?: string;
  inputType?: "text" | "email" | "password" | "tel" | "url" | "number";
  required?: boolean;
  value?: string;
  validation?: "none" | "email" | "phone" | "url";
  maxLength?: number;
  minLength?: number;
  width?: "full" | "half" | "third" | "quarter";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  helpText?: string;
  errorMessage?: string;
}

const FormInputBlock: React.FC<BlockComponentProps> = ({
  block,
  properties,
  isSelected,
  onClick,
  onPropertyChange,
}) => {
  const {
    label = "Nome",
    placeholder = "Digite seu nome...",
    inputType = "text",
    required = false,
    value = "",
    validation = "none",
    maxLength,
    minLength,
    width = "full",
    size = "md",
    showLabel = true,
    helpText,
    errorMessage,
  } = (properties || {}) as FormInputProperties;

  const handlePropertyUpdate = (key: string, value: any) => {
    onPropertyChange?.(key, value);
  };

  const getSizeClasses = () => {
    const sizeMap = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };
    return sizeMap[size] || sizeMap.md;
  };

  const getWidthClass = () => {
    const widthMap = {
      full: "w-full",
      half: "w-1/2",
      third: "w-1/3",
      quarter: "w-1/4",
    };
    return widthMap[width] || widthMap.full;
  };

  const validateInput = (value: string) => {
    if (validation === "email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    if (validation === "phone") {
      return /^[\+]?[\d\s\-\(\)]+$/.test(value);
    }
    if (validation === "url") {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    handlePropertyUpdate("value", newValue);

    // Validação em tempo real
    if (validation !== "none") {
      const isValid = validateInput(newValue);
      handlePropertyUpdate("isValid", isValid);
    }
  };

  return (
    <div
      className={cn(
        "form-input-block transition-all duration-200",
        getWidthClass(),
        isSelected && "ring-2 ring-blue-500 ring-opacity-50 rounded-md p-2"
      )}
      data-block-id={block.id}
      onClick={onClick}
    >
      {/* Edição inline do label quando selecionado */}
      {isSelected && showLabel && (
        <div className="mb-2">
          <input
            type="text"
            className="text-sm font-medium text-gray-700 bg-transparent border-b border-gray-300 outline-none"
            value={label}
            onChange={e => handlePropertyUpdate("label", e.target.value)}
            placeholder="Rótulo do campo..."
          />
        </div>
      )}

      {/* Label normal */}
      {!isSelected && showLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={block.id}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Campo de entrada */}
      <input
        id={block.id}
        type={inputType}
        className={cn(
          "form-input border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200",
          getSizeClasses(),
          "w-full",
          errorMessage && "border-red-500 focus:ring-red-500 focus:border-red-500"
        )}
        placeholder={isSelected ? "Edite o placeholder..." : placeholder}
        value={isSelected ? placeholder : value}
        onChange={
          isSelected ? e => handlePropertyUpdate("placeholder", e.target.value) : handleInputChange
        }
        required={required}
        maxLength={maxLength}
        minLength={minLength}
        disabled={isSelected}
      />

      {/* Texto de ajuda */}
      {helpText && !isSelected && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}

      {/* Edição inline do texto de ajuda */}
      {isSelected && (
        <input
          type="text"
          className="mt-1 text-xs text-gray-500 bg-transparent border-b border-gray-300 outline-none w-full"
          value={helpText || ""}
          onChange={e => handlePropertyUpdate("helpText", e.target.value)}
          placeholder="Texto de ajuda (opcional)..."
        />
      )}

      {/* Mensagem de erro */}
      {errorMessage && !isSelected && <p className="mt-1 text-xs text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default FormInputBlock;
