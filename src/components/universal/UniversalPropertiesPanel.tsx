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
import { UnifiedBlock } from "@/hooks/useUnifiedProperties";
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
import React from "react";

// -----------------------------------------------------------------------------
// Tipos e Interfaces
// -----------------------------------------------------------------------------
interface UniversalPropertiesPanelProps {
  selectedBlock: UnifiedBlock | null;
  onUpdate?: (blockId: string, updates: Record<string, any>) => void;
  onDelete?: (blockId: string) => void;
  onClose?: () => void;
}

// -----------------------------------------------------------------------------
// Mapeamento de propriedades por tipo de componente
// -----------------------------------------------------------------------------
const getComponentProperties = (block: UnifiedBlock) => {
  const baseProps = {
    id: {
      key: "id",
      label: "ID",
      type: "text",
      category: "advanced",
      value: block.id,
      required: true,
    },
    type: {
      key: "type",
      label: "Tipo",
      type: "text",
      category: "advanced",
      value: block.type,
      disabled: true,
    },
  };

  // Propriedades específicas por tipo
  const typeSpecificProps: Record<string, any> = {
    text: {
      content: {
        key: "content",
        label: "Texto",
        type: "textarea",
        category: "content",
        value: block.content || "",
      },
      fontSize: {
        key: "fontSize",
        label: "Tamanho da Fonte",
        type: "range",
        category: "style",
        value: 16,
        min: 12,
        max: 72,
      },
      fontWeight: {
        key: "fontWeight",
        label: "Peso da Fonte",
        type: "select",
        category: "style",
        value: "normal",
        options: ["normal", "bold", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
      },
      color: {
        key: "color",
        label: "Cor do Texto",
        type: "color",
        category: "style",
        value: "#000000",
      },
      textAlign: {
        key: "textAlign",
        label: "Alinhamento",
        type: "select",
        category: "style",
        value: "left",
        options: ["left", "center", "right", "justify"],
      },
    },
    heading: {
      content: {
        key: "content",
        label: "Título",
        type: "text",
        category: "content",
        value: block.content || "",
      },
      level: {
        key: "level",
        label: "Nível (H1-H6)",
        type: "select",
        category: "content",
        value: "h2",
        options: ["h1", "h2", "h3", "h4", "h5", "h6"],
      },
      fontSize: {
        key: "fontSize",
        label: "Tamanho da Fonte",
        type: "range",
        category: "style",
        value: 24,
        min: 16,
        max: 48,
      },
      color: {
        key: "color",
        label: "Cor do Texto",
        type: "color",
        category: "style",
        value: "#000000",
      },
      textAlign: {
        key: "textAlign",
        label: "Alinhamento",
        type: "select",
        category: "style",
        value: "left",
        options: ["left", "center", "right"],
      },
    },
    button: {
      text: {
        key: "text",
        label: "Texto do Botão",
        type: "text",
        category: "content",
        value: block.text || "Botão",
      },
      variant: {
        key: "variant",
        label: "Variante",
        type: "select",
        category: "style",
        value: "default",
        options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
      },
      size: {
        key: "size",
        label: "Tamanho",
        type: "select",
        category: "style",
        value: "default",
        options: ["default", "sm", "lg", "icon"],
      },
      backgroundColor: {
        key: "backgroundColor",
        label: "Cor de Fundo",
        type: "color",
        category: "style",
        value: "#B89B7A",
      },
      textColor: {
        key: "textColor",
        label: "Cor do Texto",
        type: "color",
        category: "style",
        value: "#ffffff",
      },
      disabled: {
        key: "disabled",
        label: "Desabilitado",
        type: "boolean",
        category: "advanced",
        value: false,
      },
    },
    "pricing-card": {
      title: {
        key: "title",
        label: "Título",
        type: "text",
        category: "content",
        value: block.properties?.title || "Oferta Especial",
      },
      subtitle: {
        key: "subtitle",
        label: "Subtítulo",
        type: "textarea",
        category: "content",
        value: block.properties?.subtitle || "Aproveite esta oportunidade única",
      },
      originalPrice: {
        key: "originalPrice",
        label: "Preço Original",
        type: "text",
        category: "content",
        value: block.properties?.originalPrice || "R$ 497,00",
      },
      currentPrice: {
        key: "currentPrice",
        label: "Preço Atual",
        type: "text",
        category: "content",
        value: block.properties?.currentPrice || "R$ 97,00",
      },
      buttonText: {
        key: "buttonText",
        label: "Texto do Botão",
        type: "text",
        category: "content",
        value: block.properties?.buttonText || "QUERO APROVEITAR",
      },
      buttonUrl: {
        key: "buttonUrl",
        label: "URL do Botão",
        type: "text",
        category: "content",
        value: block.properties?.buttonUrl || "#",
      },
      variant: {
        key: "variant",
        label: "Estilo Visual",
        type: "select",
        category: "style",
        value: block.properties?.style?.variant || "elegant",
        options: ["elegant", "premium", "minimal"],
      },
      showBadge: {
        key: "showBadge",
        label: "Mostrar Badge",
        type: "boolean",
        category: "style",
        value: block.properties?.style?.showBadge !== false,
      },
      showFeatures: {
        key: "showFeatures",
        label: "Mostrar Features",
        type: "boolean",
        category: "style",
        value: block.properties?.style?.showFeatures !== false,
      },
      isPopular: {
        key: "isPopular",
        label: "Marcar como Popular",
        type: "boolean",
        category: "style",
        value: block.properties?.style?.isPopular || false,
      },
    },
    "countdown-timer": {
      title: {
        key: "title",
        label: "Título",
        type: "text",
        category: "content",
        value: block.properties?.title || "Oferta por Tempo Limitado",
      },
      subtitle: {
        key: "subtitle",
        label: "Subtítulo",
        type: "text",
        category: "content",
        value: block.properties?.subtitle || "Aproveite antes que expire!",
      },
      durationMinutes: {
        key: "durationMinutes",
        label: "Duração (minutos)",
        type: "number",
        category: "content",
        value: block.properties?.durationMinutes || 15,
        min: 1,
        max: 1440,
      },
      urgencyText: {
        key: "urgencyText",
        label: "Texto de Urgência",
        type: "text",
        category: "content",
        value: block.properties?.urgencyText || "Restam apenas:",
      },
      layout: {
        key: "layout",
        label: "Layout",
        type: "select",
        category: "style",
        value: block.properties?.layout || "cards",
        options: ["cards", "compact", "digital", "circular"],
      },
      theme: {
        key: "theme",
        label: "Tema",
        type: "select",
        category: "style",
        value: block.properties?.theme || "urgent",
        options: ["default", "urgent", "elegant", "minimal", "neon"],
      },
      showDays: {
        key: "showDays",
        label: "Mostrar Dias",
        type: "boolean",
        category: "style",
        value: block.properties?.showDays !== false,
      },
      showHours: {
        key: "showHours",
        label: "Mostrar Horas",
        type: "boolean",
        category: "style",
        value: block.properties?.showHours !== false,
      },
      showMinutes: {
        key: "showMinutes",
        label: "Mostrar Minutos",
        type: "boolean",
        category: "style",
        value: block.properties?.showMinutes !== false,
      },
      showSeconds: {
        key: "showSeconds",
        label: "Mostrar Segundos",
        type: "boolean",
        category: "style",
        value: block.properties?.showSeconds !== false,
      },
      pulseAnimation: {
        key: "pulseAnimation",
        label: "Animação Pulse",
        type: "boolean",
        category: "style",
        value: block.properties?.pulseAnimation !== false,
      },
      showProgress: {
        key: "showProgress",
        label: "Mostrar Progresso",
        type: "boolean",
        category: "style",
        value: block.properties?.showProgress || false,
      },
    },
    image: {
      src: {
        key: "src",
        label: "URL da Imagem",
        type: "text",
        category: "content",
        value: block.properties?.src || "",
      },
      alt: {
        key: "alt",
        label: "Texto Alternativo",
        type: "text",
        category: "content",
        value: block.properties?.alt || "",
      },
      width: {
        key: "width",
        label: "Largura",
        type: "number",
        category: "layout",
        value: block.properties?.width || 200,
      },
      height: {
        key: "height",
        label: "Altura",
        type: "number",
        category: "layout",
        value: block.properties?.height || 200,
      },
      objectFit: {
        key: "objectFit",
        label: "Ajuste da Imagem",
        type: "select",
        category: "style",
        value: "cover",
        options: ["cover", "contain", "fill", "scale-down", "none"],
      },
    },
    input: {
      placeholder: {
        key: "placeholder",
        label: "Placeholder",
        type: "text",
        category: "content",
        value: block.properties?.placeholder || "",
      },
      type: {
        key: "inputType",
        label: "Tipo do Input",
        type: "select",
        category: "content",
        value: "text",
        options: ["text", "email", "password", "number", "tel", "url"],
      },
      required: {
        key: "required",
        label: "Obrigatório",
        type: "boolean",
        category: "advanced",
        value: false,
      },
      disabled: {
        key: "disabled",
        label: "Desabilitado",
        type: "boolean",
        category: "advanced",
        value: false,
      },
    },
    container: {
      backgroundColor: {
        key: "backgroundColor",
        label: "Cor de Fundo",
        type: "color",
        category: "style",
        value: "#ffffff",
      },
      padding: {
        key: "padding",
        label: "Padding",
        type: "range",
        category: "layout",
        value: 16,
        min: 0,
        max: 64,
      },
      margin: {
        key: "margin",
        label: "Margin",
        type: "range",
        category: "layout",
        value: 0,
        min: 0,
        max: 64,
      },
      borderRadius: {
        key: "borderRadius",
        label: "Border Radius",
        type: "range",
        category: "style",
        value: 0,
        min: 0,
        max: 32,
      },
      borderWidth: {
        key: "borderWidth",
        label: "Espessura da Borda",
        type: "range",
        category: "style",
        value: 0,
        min: 0,
        max: 8,
      },
      borderColor: {
        key: "borderColor",
        label: "Cor da Borda",
        type: "color",
        category: "style",
        value: "#000000",
      },
    },
  };

  // Propriedades de layout comuns para todos os componentes
  const layoutProps = {
    width: {
      key: "width",
      label: "Largura",
      type: "text",
      category: "layout",
      value: block.properties?.width || "auto",
    },
    height: {
      key: "height",
      label: "Altura",
      type: "text",
      category: "layout",
      value: block.properties?.height || "auto",
    },
    display: {
      key: "display",
      label: "Display",
      type: "select",
      category: "layout",
      value: "block",
      options: ["block", "inline", "inline-block", "flex", "grid", "none"],
    },
    position: {
      key: "position",
      label: "Position",
      type: "select",
      category: "layout",
      value: "relative",
      options: ["relative", "absolute", "fixed", "sticky"],
    },
  };

  // Combinar propriedades
  const componentProps = typeSpecificProps[block.type] || {};

  return {
    ...baseProps,
    ...componentProps,
    ...layoutProps,
  };
};

// -----------------------------------------------------------------------------
// Componente UniversalPropertiesPanel
// -----------------------------------------------------------------------------
export const UniversalPropertiesPanel: React.FC<UniversalPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
  onDelete,
  onClose,
}) => {
  const [properties, setProperties] = React.useState<Record<string, any>>({});

  // Atualizar propriedades quando o bloco selecionado muda
  React.useEffect(() => {
    if (selectedBlock) {
      const props = getComponentProperties(selectedBlock);
      setProperties(props);
    }
  }, [selectedBlock]);

  // Função para atualizar propriedade
  const updateProperty = (key: string, value: any) => {
    setProperties(prev => ({
      ...prev,
      [key]: { ...prev[key], value },
    }));

    if (onUpdate && selectedBlock) {
      onUpdate(selectedBlock.id, { [key]: value });
    }
  };

  // Função para obter propriedades por categoria
  const getPropertiesByCategory = (category: string) => {
    return Object.values(properties).filter((prop: any) => prop.category === category);
  };

  // Função para validar propriedades
  const validateProperties = () => {
    return Object.values(properties).every((prop: any) => {
      if (prop.required) {
        return prop.value !== null && prop.value !== undefined && prop.value !== "";
      }
      return true;
    });
  };

  // Função para resetar propriedades
  const resetProperties = () => {
    if (selectedBlock) {
      const props = getComponentProperties(selectedBlock);
      setProperties(props);
    }
  };

  // Função para aplicar cores da marca
  const applyBrandColors = () => {
    const brandColors = {
      primary: "#B89B7A",
      secondary: "#432818",
      accent: "#E8D5C4",
    };

    const updates: Record<string, any> = {};
    Object.entries(properties).forEach(([key, prop]: [string, any]) => {
      if (prop.type === "color") {
        if (key.includes("background") || key.includes("Background")) {
          updates[key] = brandColors.primary;
        } else if (key.includes("text") || key.includes("color")) {
          updates[key] = brandColors.secondary;
        }
      }
    });

    Object.entries(updates).forEach(([key, value]) => {
      updateProperty(key, value);
    });
  };

  // Renderizar campo de propriedade
  const renderPropertyField = (property: any) => {
    const { key, value, type, label, required, options, min, max, step } = property;

    switch (type) {
      case "text":
        return (
          <div key={key} className="space-y-2">
                       {" "}
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
                            {label} {required && <span className="text-red-500">*</span>}         
               {" "}
            </Label>
                       {" "}
            <Input
              id={key}
              value={value || ""}
              onChange={e => updateProperty(key, e.target.value)}
              className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
            />
                     {" "}
          </div>
        );

      case "textarea":
        return (
          <div key={key} className="space-y-2">
                       {" "}
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
                            {label} {required && <span className="text-red-500">*</span>}         
               {" "}
            </Label>
                       {" "}
            <Textarea
              id={key}
              value={value || ""}
              onChange={e => updateProperty(key, e.target.value)}
              className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20 min-h-[80px]"
            />
                     {" "}
          </div>
        );

      case "number":
      case "range":
        return (
          <div key={key} className="space-y-2">
                       {" "}
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
                            {label} {required && <span className="text-red-500">*</span>}           
                {type === "range" && <span className="text-[#B89B7A] ml-2">({value})</span>}       
                 {" "}
            </Label>
                       {" "}
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
                     {" "}
          </div>
        );

      case "boolean":
        return (
          <div key={key} className="flex items-center justify-between space-y-2">
                       {" "}
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
                            {label}           {" "}
            </Label>
                       {" "}
            <Switch
              id={key}
              checked={value || false}
              onCheckedChange={checked => updateProperty(key, checked)}
            />
                     {" "}
          </div>
        );

      case "color":
        return (
          <div key={key} className="space-y-2">
                       {" "}
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
                            {label}           {" "}
            </Label>
                       {" "}
            <div className="flex gap-2">
                           {" "}
              <Input
                id={key}
                type="color"
                value={value || "#000000"}
                onChange={e => updateProperty(key, e.target.value)}
                className="w-12 h-10 border-[#B89B7A]/30"
              />
                           {" "}
              <Input
                value={value || "#000000"}
                onChange={e => updateProperty(key, e.target.value)}
                className="flex-1 border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
                placeholder="#000000"
              />
                         {" "}
            </div>
                     {" "}
          </div>
        );

      case "select":
        return (
          <div key={key} className="space-y-2">
                       {" "}
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
                            {label} {required && <span className="text-red-500">*</span>}         
               {" "}
            </Label>
                       {" "}
            <Select value={value} onValueChange={newValue => updateProperty(key, newValue)}>
                           {" "}
              <SelectTrigger className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20">
                                <SelectValue placeholder="Selecionar..." />             {" "}
              </SelectTrigger>
                           {" "}
              <SelectContent>
                               {" "}
                {options?.map((option: any) => (
                  <SelectItem key={option} value={option}>
                                        {option}                 {" "}
                  </SelectItem>
                ))}
                             {" "}
              </SelectContent>
                         {" "}
            </Select>
                     {" "}
          </div>
        );

      default:
        return null;
    }
  }; // -----------------------------------------------------------------------------
  // Condição de renderização principal: se não houver bloco, exibe mensagem
  // -----------------------------------------------------------------------------

  if (!selectedBlock) {
    return (
      <Card className="w-80 h-full border-[#B89B7A]/30">
               {" "}
        <CardHeader className="bg-[#B89B7A]/10 border-b border-[#B89B7A]/30">
                   {" "}
          <CardTitle className="text-[#432818] flex items-center gap-2">
                        <Settings className="w-5 h-5" />            Propriedades          {" "}
          </CardTitle>
                 {" "}
        </CardHeader>
               {" "}
        <CardContent className="p-6">
                   {" "}
          <div className="text-center text-stone-500">
                        <Settings className="w-12 h-12 mx-auto mb-4 text-stone-400" />           {" "}
            <p>Selecione um componente para editar suas propriedades</p>         {" "}
          </div>
                 {" "}
        </CardContent>
             {" "}
      </Card>
    );
  }

  const isValid = validateProperties();

  return (
    <Card className="w-80 h-full border-[#B89B7A]/30 flex flex-col">
            {/* Header */}     {" "}
      <CardHeader className="bg-[#B89B7A]/10 border-b border-[#B89B7A]/30 flex-shrink-0">
               {" "}
        <div className="flex items-center justify-between">
                   {" "}
          <CardTitle className="text-[#432818] flex items-center gap-2">
                        <Settings className="w-5 h-5" />            Propriedades          {" "}
          </CardTitle>
                   {" "}
          <div className="flex gap-1">
                       {" "}
            <Button
              variant="ghost"
              size="sm"
              onClick={applyBrandColors}
              className="text-[#B89B7A] hover:bg-[#B89B7A]/20"
            >
                            <Paintbrush className="w-4 h-4" />           {" "}
            </Button>
                       {" "}
            <Button
              variant="ghost"
              size="sm"
              onClick={resetProperties}
              className="text-[#B89B7A] hover:bg-[#B89B7A]/20"
            >
                            <RotateCcw className="w-4 h-4" />           {" "}
            </Button>
                       {" "}
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-stone-500 hover:bg-stone-100"
              >
                                <EyeOff className="w-4 h-4" />             {" "}
              </Button>
            )}
                     {" "}
          </div>
                 {" "}
        </div>
                {/* Info do componente */}       {" "}
        <div className="flex items-center gap-2 mt-2">
                   {" "}
          <Badge variant="outline" className="border-[#B89B7A] text-[#B89B7A]">
                        {selectedBlock.type}         {" "}
          </Badge>
                   {" "}
          <Badge variant={isValid ? "default" : "destructive"}>
                        {isValid ? "Válido" : "Inválido"}         {" "}
          </Badge>
                 {" "}
        </div>
             {" "}
      </CardHeader>
            {/* Content */}     {" "}
      <CardContent className="flex-1 overflow-y-auto p-0">
               {" "}
        <Tabs defaultValue="content" className="h-full">
                   {" "}
          <TabsList className="grid w-full grid-cols-4 bg-[#B89B7A]/10 rounded-none border-b border-[#B89B7A]/30">
                       {" "}
            <TabsTrigger
              value="content"
              className="data-[state=active]:bg-[#B89B7A] data-[state=active]:text-white"
            >
                            <Type className="w-4 h-4" />           {" "}
            </TabsTrigger>
                       {" "}
            <TabsTrigger
              value="style"
              className="data-[state=active]:bg-[#B89B7A] data-[state=active]:text-white"
            >
                            <Palette className="w-4 h-4" />           {" "}
            </TabsTrigger>
                       {" "}
            <TabsTrigger
              value="layout"
              className="data-[state=active]:bg-[#B89B7A] data-[state=active]:text-white"
            >
                            <Layout className="w-4 h-4" />           {" "}
            </TabsTrigger>
                       {" "}
            <TabsTrigger
              value="advanced"
              className="data-[state=active]:bg-[#B89B7A] data-[state=active]:text-white"
            >
                            <Settings className="w-4 h-4" />           {" "}
            </TabsTrigger>
                     {" "}
          </TabsList>
                   {" "}
          <TabsContent value="content" className="p-4 space-y-4">
                       {" "}
            {getPropertiesByCategory("content").length > 0 ? (
              getPropertiesByCategory("content").map(renderPropertyField)
            ) : (
              <p className="text-stone-500 text-sm">Nenhuma propriedade de conteúdo disponível</p>
            )}
                     {" "}
          </TabsContent>
                   {" "}
          <TabsContent value="style" className="p-4 space-y-4">
                       {" "}
            {getPropertiesByCategory("style").length > 0 ? (
              getPropertiesByCategory("style").map(renderPropertyField)
            ) : (
              <p className="text-stone-500 text-sm">Nenhuma propriedade de estilo disponível</p>
            )}
                     {" "}
          </TabsContent>
                   {" "}
          <TabsContent value="layout" className="p-4 space-y-4">
                       {" "}
            {getPropertiesByCategory("layout").length > 0 ? (
              getPropertiesByCategory("layout").map(renderPropertyField)
            ) : (
              <p className="text-stone-500 text-sm">Nenhuma propriedade de layout disponível</p>
            )}
                     {" "}
          </TabsContent>
                   {" "}
          <TabsContent value="advanced" className="p-4 space-y-4">
                       {" "}
            {getPropertiesByCategory("advanced").length > 0 ? (
              getPropertiesByCategory("advanced").map(renderPropertyField)
            ) : (
              <p className="text-stone-500 text-sm">Nenhuma propriedade avançada disponível</p>
            )}
                     {" "}
          </TabsContent>
                 {" "}
        </Tabs>
             {" "}
      </CardContent>
            {/* Footer com ações */}     {" "}
      {onDelete && (
        <div className="border-t border-[#B89B7A]/30 p-4 flex-shrink-0">
                   {" "}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(selectedBlock.id)}
            className="w-full"
          >
                        <Trash2 className="w-4 h-4 mr-2" />            Excluir Componente        
             {" "}
          </Button>
                 {" "}
        </div>
      )}
         {" "}
    </Card>
  );
};

export default UniversalPropertiesPanel;
