/**
 * ColorPicker - Componente de seleção de cor melhorado
 *
 * Usa Shadcn UI Popover com seletor de cor avançado
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, Check } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  disabled?: boolean;
  presetColors?: string[];
}

// Cores predefinidas comuns
const DEFAULT_PRESET_COLORS = [
  "#000000",
  "#ffffff",
  "#f3f4f6",
  "#9ca3af",
  "#6b7280",
  "#4b5563",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
];

export function ColorPicker({
  value,
  onChange,
  label,
  disabled = false,
  presetColors = DEFAULT_PRESET_COLORS,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    if (newValue.match(/^#[0-9A-F]{6}$/i)) {
      onChange(newValue);
    }
  };

  const handlePresetClick = (color: string) => {
    setInputValue(color);
    onChange(color);
    setIsOpen(false);
  };

  const isValidColor = value.match(/^#[0-9A-F]{6}$/i);

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}

      <div className="flex gap-2">
        {/* Preview da cor atual */}
        <div
          className="w-10 h-10 rounded-md border border-gray-300 flex-shrink-0 cursor-pointer"
          style={{ backgroundColor: isValidColor ? value : "#transparent" }}
          onClick={() => !disabled && setIsOpen(true)}
        >
          {!isValidColor && (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Palette className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Input de texto */}
        <Input
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="#000000"
          className="font-mono text-sm"
          disabled={disabled}
        />

        {/* Popover com seletor */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              disabled={disabled}
              className="flex-shrink-0"
            >
              <Palette className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Cores Predefinidas
                </Label>
                <div className="grid grid-cols-6 gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-md border border-gray-300 relative hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => handlePresetClick(color)}
                    >
                      {value === color && (
                        <Check className="w-4 h-4 absolute inset-0 m-auto text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Seletor Nativo
                </Label>
                <input
                  type="color"
                  value={isValidColor ? value : "#000000"}
                  onChange={(e) => handlePresetClick(e.target.value)}
                  className="w-full h-10 rounded-md border border-gray-300 cursor-pointer"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Código Hex
                </Label>
                <Input
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="#000000"
                  className="font-mono text-sm"
                />
                {!isValidColor && inputValue && (
                  <p className="text-xs text-red-500 mt-1">
                    Formato inválido. Use #RRGGBB
                  </p>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
