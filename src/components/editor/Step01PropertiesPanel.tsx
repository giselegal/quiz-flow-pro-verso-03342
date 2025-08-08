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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  useUnifiedProperties,
  UnifiedBlock,
  PropertyType,
  PropertyCategory,
} from "@/hooks/useUnifiedProperties";
import {
  Palette,
  Type,
  Layout,
  Settings,
  Eye,
  EyeOff,
  RotateCcw,
  Info,
  Smartphone,
  Monitor,
  Tablet,
  Paintbrush,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from "lucide-react";
import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";

interface Step01PropertiesPanelProps {
  selectedBlock: UnifiedBlock | null;
  onUpdate?: (blockId: string, updates: Record<string, any>) => void;
  onDelete?: (blockId: string) => void;
  onClose?: () => void;
}

const Step01PropertiesPanel: React.FC<Step01PropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
  onDelete,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("content");
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const { properties, updateProperty, resetProperties, getPropertiesByCategory } =
    useUnifiedProperties(selectedBlock, onUpdate);

  if (!selectedBlock) {
    return (
      <Card className="w-80 h-fit border-[#B89B7A]/30 bg-gradient-to-br from-white to-[#B89B7A]/5 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center text-[#B89B7A]">
            <Layout className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Painel de Propriedades</h3>
            <p className="text-sm opacity-75">
              Selecione um componente da Etapa 1 para editar suas propriedades
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Categorizar propriedades
  const contentProps = getPropertiesByCategory("content");
  const styleProps = getPropertiesByCategory("style");
  const layoutProps = getPropertiesByCategory("layout");
  const behaviorProps = getPropertiesByCategory("behavior");
  const advancedProps = getPropertiesByCategory("advanced");

  // Renderizar campo baseado no tipo
  const renderField = (property: any) => {
    const { key, label, type, value, options, min, max, step, unit, required } = property;

    switch (type) {
      case PropertyType.TEXT:
        return (
          <div key={key} className="space-y-2">
            <Label className="text-sm font-medium text-[#432818] flex items-center gap-2">
              {label}
              {required && <Badge variant="secondary" className="text-xs">Obrigatório</Badge>}
            </Label>
            <Input
              value={value || ""}
              onChange={(e) => updateProperty(key, e.target.value)}
              placeholder={`Digite ${label.toLowerCase()}`}
              className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
            />
          </div>
        );

      case PropertyType.TEXTAREA:
        return (
          <div key={key} className="space-y-2">
            <Label className="text-sm font-medium text-[#432818]">{label}</Label>
            <Textarea
              value={value || ""}
              onChange={(e) => updateProperty(key, e.target.value)}
              placeholder={`Digite ${label.toLowerCase()}`}
              rows={3}
              className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
            />
          </div>
        );

      case PropertyType.SELECT:
        return (
          <div key={key} className="space-y-2">
            <Label className="text-sm font-medium text-[#432818]">{label}</Label>
            <Select value={value || ""} onValueChange={(val) => updateProperty(key, val)}>
              <SelectTrigger className="border-[#B89B7A]/30 focus:border-[#B89B7A]">
                <SelectValue placeholder={`Selecione ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case PropertyType.COLOR:
        return (
          <div key={key} className="space-y-2">
            <Label className="text-sm font-medium text-[#432818]">{label}</Label>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded border-2 border-[#B89B7A]/30 cursor-pointer"
                style={{ backgroundColor: value || "#ffffff" }}
                onClick={() => {
                  // Implementar color picker modal
                }}
              />
              <Input
                value={value || ""}
                onChange={(e) => updateProperty(key, e.target.value)}
                placeholder="#000000"
                className="flex-1 border-[#B89B7A]/30 focus:border-[#B89B7A]"
              />
            </div>
          </div>
        );

      case PropertyType.RANGE:
        return (
          <div key={key} className="space-y-2">
            <Label className="text-sm font-medium text-[#432818] flex items-center justify-between">
              {label}
              <span className="text-xs text-[#B89B7A]">
                {value || 0}{unit || ""}
              </span>
            </Label>
            <Slider
              value={[value || 0]}
              onValueChange={(vals) => updateProperty(key, vals[0])}
              min={min || 0}
              max={max || 100}
              step={step || 1}
              className="w-full"
            />
          </div>
        );

      case PropertyType.SWITCH:
        return (
          <div key={key} className="flex items-center justify-between">
            <Label className="text-sm font-medium text-[#432818]">{label}</Label>
            <Switch
              checked={value === true}
              onCheckedChange={(checked) => updateProperty(key, checked)}
            />
          </div>
        );

      case PropertyType.NUMBER:
        return (
          <div key={key} className="space-y-2">
            <Label className="text-sm font-medium text-[#432818]">{label}</Label>
            <Input
              type="number"
              value={value || 0}
              onChange={(e) => updateProperty(key, parseInt(e.target.value) || 0)}
              min={min}
              max={max}
              step={step}
              className="border-[#B89B7A]/30 focus:border-[#B89B7A]"
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Renderizar grupo de propriedades
  const renderPropertyGroup = (title: string, icon: React.ReactNode, properties: any[]) => {
    if (!properties || properties.length === 0) return null;

    return (
      <Card className="border-[#B89B7A]/20 bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[#432818] flex items-center gap-2">
            {icon}
            {title}
            <Badge variant="outline" className="ml-auto text-xs">
              {properties.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {properties.map(renderField)}
        </CardContent>
      </Card>
    );
  };

  return (
    <TooltipProvider>
      <Card className="w-80 h-fit border-[#B89B7A]/30 bg-gradient-to-br from-white to-[#B89B7A]/5 backdrop-blur-sm">
        <CardHeader className="pb-3 border-b border-[#B89B7A]/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-[#432818]">
                Propriedades
              </CardTitle>
              <p className="text-sm text-[#B89B7A] mt-1">
                {selectedBlock.type} • {selectedBlock.id}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetProperties}
                    className="h-8 w-8 p-0 text-[#B89B7A] hover:text-[#A38A69]"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Resetar propriedades</TooltipContent>
              </Tooltip>
              
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 text-[#B89B7A] hover:text-[#A38A69]"
                >
                  ×
                </Button>
              )}
            </div>
          </div>

          {/* Preview Mode Selector */}
          <div className="flex items-center gap-1 mt-3">
            <Button
              variant={previewMode === "desktop" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode("desktop")}
              className="h-7 px-2"
            >
              <Monitor className="w-3 h-3" />
            </Button>
            <Button
              variant={previewMode === "tablet" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode("tablet")}
              className="h-7 px-2"
            >
              <Tablet className="w-3 h-3" />
            </Button>
            <Button
              variant={previewMode === "mobile" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode("mobile")}
              className="h-7 px-2"
            >
              <Smartphone className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-[#B89B7A]/10">
              <TabsTrigger value="content" className="text-xs">
                <Type className="w-3 h-3 mr-1" />
                Conteúdo
              </TabsTrigger>
              <TabsTrigger value="style" className="text-xs">
                <Palette className="w-3 h-3 mr-1" />
                Estilo
              </TabsTrigger>
              <TabsTrigger value="layout" className="text-xs">
                <Layout className="w-3 h-3 mr-1" />
                Layout
              </TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs">
                <Settings className="w-3 h-3 mr-1" />
                Avançado
              </TabsTrigger>
            </TabsList>

            <div className="p-4 max-h-96 overflow-y-auto space-y-4">
              <TabsContent value="content" className="mt-0 space-y-4">
                {renderPropertyGroup(
                  "Conteúdo Principal",
                  <Type className="w-4 h-4 text-[#B89B7A]" />,
                  contentProps
                )}
              </TabsContent>

              <TabsContent value="style" className="mt-0 space-y-4">
                {renderPropertyGroup(
                  "Aparência",
                  <Paintbrush className="w-4 h-4 text-[#B89B7A]" />,
                  styleProps
                )}
              </TabsContent>

              <TabsContent value="layout" className="mt-0 space-y-4">
                {renderPropertyGroup(
                  "Layout e Posicionamento",
                  <Layout className="w-4 h-4 text-[#B89B7A]" />,
                  layoutProps
                )}
              </TabsContent>

              <TabsContent value="advanced" className="mt-0 space-y-4">
                {renderPropertyGroup(
                  "Comportamento",
                  <Settings className="w-4 h-4 text-[#B89B7A]" />,
                  behaviorProps
                )}
                {renderPropertyGroup(
                  "Configurações Avançadas",
                  <Settings className="w-4 h-4 text-[#B89B7A]" />,
                  advancedProps
                )}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>

        {/* Actions Footer */}
        {onDelete && (
          <div className="p-4 border-t border-[#B89B7A]/20 bg-[#B89B7A]/5">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(selectedBlock.id)}
              className="w-full"
            >
              <Eye className="w-4 h-4 mr-2" />
              Excluir Componente
            </Button>
          </div>
        )}
      </Card>
    </TooltipProvider>
  );
};

export default Step01PropertiesPanel;