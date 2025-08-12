/**
 * 🎨 ColorPicker - Componente visual intuitivo para seleção de cores
 * Sistema padronizado com paleta organizada e preview em tempo real
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, Palette } from "lucide-react";
import { useState } from "react";
import { COLOR_GROUPS, ColorOption, ColorUtils, POPULAR_COLORS } from "../../config/colorPalette";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  disabled?: boolean;
  presetColors?: string[];
  showCustomInput?: boolean;
  showPreview?: boolean;
  className?: string;
}

export function ColorPicker({
  value,
  onChange,
  label,
  disabled = false,

  showCustomInput = true,
  showPreview = true,
  className = "",
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("popular");
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    if (newValue === "transparent" || newValue.match(/^#[0-9A-F]{6}$/i)) {
      onChange(newValue);
    }
  };

  const handleColorSelect = (colorValue: string) => {
    setInputValue(colorValue);
    onChange(colorValue);
    setIsOpen(false);
  };

  const isValidColor = value === "transparent" || value.match(/^#[0-9A-F]{6}$/i);

  // Renderizar preview da cor atual
  const ColorPreview = ({ color, size = "w-10 h-10" }: { color: string; size?: string }) => (
    <div
      className={cn(
        size,
        "rounded-md border-2 border-gray-200 shadow-sm flex items-center justify-center relative overflow-hidden cursor-pointer transition-transform hover:scale-105",
        color === "transparent" && "bg-gradient-to-br from-gray-100 to-gray-200"
      )}
      style={{
        backgroundColor: color === "transparent" ? "transparent" : color,
      }}
      onClick={() => !disabled && setIsOpen(true)}
    >
      {color === "transparent" && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
            backgroundSize: "8px 8px",
            backgroundPosition: "0 0, 0 4px, 4px -4px, 4px 0px",
          }}
        />
      )}
      {!isValidColor && <Palette className="w-4 h-4 text-gray-400" />}
    </div>
  );

  // Renderizar swatch de cor
  const ColorSwatch = ({ colorOption }: { colorOption: ColorOption }) => {
    const isSelected = value === colorOption.value;

    return (
      <button
        onClick={() => handleColorSelect(colorOption.value)}
        className={cn(
          "group relative flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-all",
          isSelected && "bg-[#B89B7A]/10 ring-2 ring-[#B89B7A]"
        )}
        title={colorOption.label}
      >
        <div className="relative">
          <ColorPreview color={colorOption.value} size="w-8 h-8" />
          {isSelected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Check className="w-3 h-3 text-white drop-shadow-lg" />
            </div>
          )}
        </div>
        <span style={{ color: "#6B4F43" }}>{colorOption.label}</span>
      </button>
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}

      <div className="flex gap-2">
        {/* Preview da cor atual */}
        <ColorPreview color={value} />

        {/* Input de texto */}
        <Input
          value={inputValue}
          onChange={e => handleInputChange(e.target.value)}
          placeholder="#B89B7A ou transparent"
          className="font-mono text-sm flex-1"
          disabled={disabled}
        />

        {/* Popover com seletor */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" disabled={disabled} className="flex-shrink-0">
              <Palette className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {/* Informações da cor atual */}
              <div style={{ backgroundColor: "#FAF9F7" }}>
                <ColorPreview color={value} size="w-8 h-8" />
                <div className="flex-1">
                  <div style={{ color: "#432818" }}>{ColorUtils.getColorLabel(value)}</div>
                  <div style={{ color: "#8B7355" }}>
                    {value === "transparent" ? "Transparente" : value}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ backgroundColor: "#E5DDD5" }}>
                <button
                  onClick={() => setActiveTab("popular")}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    activeTab === "popular"
                      ? "bg-white text-[#B89B7A] shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  Populares
                </button>
                <button
                  onClick={() => setActiveTab("all")}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    activeTab === "all"
                      ? "bg-white text-[#B89B7A] shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  Paleta
                </button>
                {showCustomInput && (
                  <button
                    onClick={() => setActiveTab("custom")}
                    className={cn(
                      "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      activeTab === "custom"
                        ? "bg-white text-[#B89B7A] shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    Custom
                  </button>
                )}
              </div>

              {/* Content */}
              {activeTab === "popular" && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Cores Mais Usadas</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {POPULAR_COLORS.map(colorOption => (
                      <ColorSwatch key={colorOption.value} colorOption={colorOption} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "all" && (
                <div className="space-y-4">
                  {COLOR_GROUPS.map(group => (
                    <div key={group.id}>
                      <Label className="text-sm font-medium mb-2 block">{group.name}</Label>
                      <div className="grid grid-cols-6 gap-2">
                        {group.colors.map(colorOption => (
                          <ColorSwatch key={colorOption.value} colorOption={colorOption} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "custom" && showCustomInput && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Seletor Nativo</Label>
                    <input
                      type="color"
                      value={isValidColor && value !== "transparent" ? value : "#B89B7A"}
                      onChange={e => handleColorSelect(e.target.value)}
                      style={{ borderColor: "#E5DDD5" }}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Código Personalizado</Label>
                    <Input
                      value={inputValue}
                      onChange={e => handleInputChange(e.target.value)}
                      placeholder="#B89B7A, transparent, etc."
                      className="font-mono text-sm"
                    />
                    {!isValidColor && inputValue && (
                      <p style={{ color: "#432818" }}>Use formato #RRGGBB ou "transparent"</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleColorSelect("transparent")}
                    style={{ borderColor: "#E5DDD5" }}
                  >
                    Usar Transparente
                  </button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Preview Area */}
      {showPreview && isValidColor && (
        <div style={{ backgroundColor: "#FAF9F7" }}>
          <div style={{ color: "#6B4F43" }}>
            <span>Preview:</span>
            <div
              className="px-3 py-1 rounded-md font-medium transition-colors"
              style={{
                backgroundColor: value === "transparent" ? "#B89B7A" : value,
                color: ColorUtils.getContrastColor(value === "transparent" ? "#B89B7A" : value),
              }}
            >
              Texto de Exemplo
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
