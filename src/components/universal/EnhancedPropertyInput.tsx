/**
 * 🎨 EnhancedPropertyInput - Input inteligente com feedback visual
 * Combina debounce, feedback visual e validação
 */

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PropertyChangeIndicator } from "./PropertyChangeIndicator";
import { usePropertyDebounce } from "@/hooks/usePropertyDebounce";

interface EnhancedPropertyInputProps {
  label: string;
  value: string;
  placeholder?: string;
  type?: "text" | "textarea" | "number" | "url" | "email";
  description?: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  className?: string;
  rows?: number;
}

export const EnhancedPropertyInput: React.FC<EnhancedPropertyInputProps> = ({
  label,
  value,
  placeholder,
  type = "text",
  description,
  onChange,
  debounceMs = 300,
  className = "",
  rows = 3,
}) => {
  const {
    value: currentValue,
    isChanging,
    hasChanged,
    updateValue,
  } = usePropertyDebounce(value, {
    debounceMs,
    onUpdate: onChange,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    updateValue(newValue);
  };

  const inputId = `property-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      
      <PropertyChangeIndicator
        isChanging={isChanging}
        hasChanged={hasChanged}
      >
        {type === "textarea" ? (
          <Textarea
            id={inputId}
            value={currentValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            rows={rows}
            className="resize-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        ) : (
          <Input
            id={inputId}
            type={type}
            value={currentValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        )}
      </PropertyChangeIndicator>
      
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
};

export default EnhancedPropertyInput;