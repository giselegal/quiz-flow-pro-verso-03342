import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { UnifiedBlock, useUnifiedProperties } from "@/hooks/useUnifiedProperties";
import {
  EyeOff,
  Layout,
  Paintbrush,
  Palette,
  RotateCcw,
  Settings,
  Trash2,
  Type,
} from "lucide-react";
import React, { useMemo } from "react";

interface UniversalPropertiesPanelProps {
  selectedBlock: UnifiedBlock | null;
  onUpdate?: (blockId: string, updates: Record<string, any>) => void;
  onDelete?: (blockId: string) => void;
  onClose?: () => void;
}

const UniversalPropertiesPanel: React.FC<UniversalPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
  onDelete,
  onClose,
}) => {
  const {
    properties,
    updateProperty,
    resetProperties,
    validateProperties,
    getPropertiesByCategory,
    applyBrandColors,
  } = useUnifiedProperties(selectedBlock, onUpdate);

  // Categorizar propriedades
  const categorizedProperties = useMemo(
    () => ({
      content: getPropertiesByCategory("content"),
      style: getPropertiesByCategory("style"),
      layout: getPropertiesByCategory("layout"),
      advanced: getPropertiesByCategory("advanced"),
    }),
    [getPropertiesByCategory]
  );

  // Renderizar campo de propriedade
  const renderPropertyField = (property: any) => {
    const { key, value, type, label, required, options, min, max, step } = property;

    switch (type) {
      case "text":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={key}
              value={value || ""}
              onChange={e => updateProperty(key, e.target.value)}
              className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
            />
          </div>
        );

      case "textarea":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={key}
              value={value || ""}
              onChange={e => updateProperty(key, e.target.value)}
              className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20 min-h-[80px]"
            />
          </div>
        );

      case "number":
      case "range":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label} {required && <span className="text-red-500">*</span>}
              {type === "range" && <span className="text-[#B89B7A] ml-2">({value})</span>}
            </Label>
            {type === "range" ? (
              <Slider
                value={[value || 0]}
                onValueChange={values => updateProperty(key, values[0])}
                min={min || 0}
                max={max || 100}
                step={step || 1}
                className="w-full"
              />
            ) : (
              <Input
                id={key}
                type="number"
                value={value || ""}
                onChange={e => updateProperty(key, Number(e.target.value))}
                min={min}
                max={max}
                step={step}
                className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
              />
            )}
          </div>
        );

      case "boolean":
        return (
          <div key={key} className="flex items-center justify-between space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label}
            </Label>
            <Switch
              id={key}
              checked={value || false}
              onCheckedChange={checked => updateProperty(key, checked)}
            />
          </div>
        );

      case "color":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label}
            </Label>
            <div className="flex gap-2">
              <Input
                id={key}
                type="color"
                value={value || "#000000"}
                onChange={e => updateProperty(key, e.target.value)}
                className="w-12 h-10 border-[#B89B7A]/30"
              />
              <Input
                value={value || "#000000"}
                onChange={e => updateProperty(key, e.target.value)}
                className="flex-1 border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
                placeholder="#000000"
              />
            </div>
          </div>
        );

      case "select":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Select value={value} onValueChange={newValue => updateProperty(key, newValue)}>
              <SelectTrigger className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20">
                <SelectValue placeholder="Selecionar..." />
              </SelectTrigger>
              <SelectContent>
                {options?.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return null;
    }
  };

  if (!selectedBlock) {
    return (
      <Card className="w-80 h-full border-[#B89B7A]/30">
        <CardHeader className="bg-[#B89B7A]/10 border-b border-[#B89B7A]/30">
          <CardTitle className="text-[#432818] flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Propriedades
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-stone-500">
            <Settings className="w-12 h-12 mx-auto mb-4 text-stone-400" />
            <p>Selecione um componente para editar suas propriedades</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isValid = validateProperties();

  return (
    <Card className="w-80 h-full border-[#B89B7A]/30 flex flex-col">
      {/* Header */}
      <CardHeader className="bg-[#B89B7A]/10 border-b border-[#B89B7A]/30 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#432818] flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Propriedades
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={applyBrandColors}
              className="text-[#B89B7A] hover:bg-[#B89B7A]/20"
            >
              <Paintbrush className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetProperties}
              className="text-[#B89B7A] hover:bg-[#B89B7A]/20"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-stone-500 hover:bg-stone-100"
              >
                <EyeOff className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Info do componente */}
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="border-[#B89B7A] text-[#B89B7A]">
            {selectedBlock.type}
          </Badge>
          <Badge variant={isValid ? "default" : "destructive"}>
            {isValid ? "Válido" : "Inválido"}
          </Badge>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 overflow-y-auto p-0">
        <Tabs defaultValue="content" className="h-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#B89B7A]/10 rounded-none border-b border-[#B89B7A]/30">
            <TabsTrigger
              value="content"
              className="data-[state=active]:bg-[#B89B7A] data-[state=active]:text-white"
            >
              <Type className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger
              value="style"
              className="data-[state=active]:bg-[#B89B7A] data-[state=active]:text-white"
            >
              <Palette className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger
              value="layout"
              className="data-[state=active]:bg-[#B89B7A] data-[state=active]:text-white"
            >
              <Layout className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="data-[state=active]:bg-[#B89B7A] data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="p-4 space-y-4">
            {categorizedProperties.content.length > 0 ? (
              categorizedProperties.content.map(renderPropertyField)
            ) : (
              <p className="text-stone-500 text-sm">Nenhuma propriedade de conteúdo disponível</p>
            )}
          </TabsContent>

          <TabsContent value="style" className="p-4 space-y-4">
            {categorizedProperties.style.length > 0 ? (
              categorizedProperties.style.map(renderPropertyField)
            ) : (
              <p className="text-stone-500 text-sm">Nenhuma propriedade de estilo disponível</p>
            )}
          </TabsContent>

          <TabsContent value="layout" className="p-4 space-y-4">
            {categorizedProperties.layout.length > 0 ? (
              categorizedProperties.layout.map(renderPropertyField)
            ) : (
              <p className="text-stone-500 text-sm">Nenhuma propriedade de layout disponível</p>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="p-4 space-y-4">
            {categorizedProperties.advanced.length > 0 ? (
              categorizedProperties.advanced.map(renderPropertyField)
            ) : (
              <p className="text-stone-500 text-sm">Nenhuma propriedade avançada disponível</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Footer com ações */}
      {onDelete && (
        <div className="border-t border-[#B89B7A]/30 p-4 flex-shrink-0">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(selectedBlock.id)}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir Componente
          </Button>
        </div>
      )}
    </Card>
  );
};

export default UniversalPropertiesPanel;
