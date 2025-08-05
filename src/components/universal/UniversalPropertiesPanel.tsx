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
    visible: {
      key: "visible",
      label: "Visível",
      type: "boolean",
      category: "general",
      value: block.properties?.visible !== false,
    },
  };

  // Propriedades universais de layout e tamanho
  const layoutProps = {
    width: {
      key: "width",
      label: "Largura",
      type: "range",
      category: "style",
      value: block.properties?.width || 100,
      min: 10,
      max: 100,
      step: 5,
      unit: "%",
    },
    scale: {
      key: "scale",
      label: "Escala",
      type: "range",
      category: "style",
      value: block.properties?.scale || 100,
      min: 50,
      max: 200,
      step: 10,
      unit: "%",
    },
  };

  // Propriedades específicas por tipo
  const typeSpecificProps = (() => {
    switch (block.type) {
      case "text-inline":
        return {
          htmlContent: {
            key: "htmlContent",
            label: "Conteúdo HTML",
            type: "textarea",
            category: "content",
            value: block.properties?.htmlContent || "",
            rows: 6,
          },
          className: {
            key: "className",
            label: "Classes CSS",
            type: "text",
            category: "style",
            value: block.properties?.className || "",
          },
          textAlign: {
            key: "textAlign",
            label: "Alinhamento",
            type: "select",
            category: "alignment",
            value: block.properties?.textAlign || "left",
            options: [
              { value: "left", label: "Esquerda" },
              { value: "center", label: "Centro" },
              { value: "right", label: "Direita" },
              { value: "justify", label: "Justificado" },
            ],
          },
          fontSize: {
            key: "fontSize",
            label: "Tamanho da Fonte",
            type: "select",
            category: "style",
            value: block.properties?.fontSize || "base",
            options: [
              { value: "xs", label: "Extra Pequeno" },
              { value: "sm", label: "Pequeno" },
              { value: "base", label: "Normal" },
              { value: "lg", label: "Grande" },
              { value: "xl", label: "Extra Grande" },
              { value: "2xl", label: "2X Grande" },
              { value: "3xl", label: "3X Grande" },
            ],
          },
          color: {
            key: "color",
            label: "Cor do Texto",
            type: "select",
            category: "style",
            value: block.properties?.color || "default",
            options: [
              { value: "default", label: "Padrão" },
              { value: "primary", label: "Primária" },
              { value: "secondary", label: "Secundária" },
              { value: "muted", label: "Sutil" },
              { value: "accent", label: "Destaque" },
            ],
          },
          marginTop: {
            key: "marginTop",
            label: "Margem Superior",
            type: "range",
            category: "style",
            value: block.properties?.marginTop || 0,
            min: 0,
            max: 100,
            step: 4,
            unit: "px",
          },
          marginBottom: {
            key: "marginBottom",
            label: "Margem Inferior",
            type: "range",
            category: "style",
            value: block.properties?.marginBottom || 0,
            min: 0,
            max: 100,
            step: 4,
            unit: "px",
          },
        };

      case "quiz-intro-header":
        return {
          title: {
            key: "title",
            label: "Título",
            type: "text",
            category: "content",
            value: block.properties?.title || "",
            required: true,
          },
          subtitle: {
            key: "subtitle",
            label: "Subtítulo",
            type: "text",
            category: "content",
            value: block.properties?.subtitle || "",
          },
          description: {
            key: "description",
            label: "Descrição",
            type: "textarea",
            category: "content",
            value: block.properties?.description || "",
            rows: 3,
          },
          headerStyle: {
            key: "headerStyle",
            label: "Estilo do Cabeçalho",
            type: "select",
            category: "style",
            value: block.properties?.headerStyle || "centered",
            options: [
              { value: "centered", label: "Centralizado" },
              { value: "left", label: "Alinhado à Esquerda" },
              { value: "right", label: "Alinhado à Direita" },
            ],
          },
          showDivider: {
            key: "showDivider",
            label: "Mostrar Divisor",
            type: "boolean",
            category: "style",
            value: block.properties?.showDivider !== false,
          },
          backgroundColor: {
            key: "backgroundColor",
            label: "Cor de Fundo",
            type: "select",
            category: "style",
            value: block.properties?.backgroundColor || "transparent",
            options: [
              { value: "transparent", label: "Transparente" },
              { value: "primary", label: "Primária" },
              { value: "secondary", label: "Secundária" },
              { value: "muted", label: "Sutil" },
            ],
          },
        };

      case "decorative-bar-inline":
        return {
          height: {
            key: "height",
            label: "Altura",
            type: "range",
            category: "style",
            value: block.properties?.height || 4,
            min: 1,
            max: 20,
            step: 1,
            unit: "px",
          },
          color: {
            key: "color",
            label: "Cor",
            type: "select",
            category: "style",
            value: block.properties?.color || "primary",
            options: [
              { value: "primary", label: "Primária" },
              { value: "secondary", label: "Secundária" },
              { value: "accent", label: "Destaque" },
              { value: "muted", label: "Sutil" },
            ],
          },
          pattern: {
            key: "pattern",
            label: "Padrão",
            type: "select",
            category: "style",
            value: block.properties?.pattern || "solid",
            options: [
              { value: "solid", label: "Sólido" },
              { value: "dashed", label: "Tracejado" },
              { value: "dotted", label: "Pontilhado" },
              { value: "gradient", label: "Gradiente" },
            ],
          },
          marginY: {
            key: "marginY",
            label: "Margem Vertical",
            type: "range",
            category: "style",
            value: block.properties?.marginY || 16,
            min: 0,
            max: 64,
            step: 4,
            unit: "px",
          },
        };

      case "button-inline":
        return {
          text: {
            key: "text",
            label: "Texto do Botão",
            type: "text",
            category: "content",
            value: block.properties?.text || "",
            required: true,
          },
          variant: {
            key: "variant",
            label: "Variante",
            type: "select",
            category: "style",
            value: block.properties?.variant || "default",
            options: [
              { value: "default", label: "Padrão" },
              { value: "destructive", label: "Destrutivo" },
              { value: "outline", label: "Contorno" },
              { value: "secondary", label: "Secundário" },
              { value: "ghost", label: "Fantasma" },
              { value: "link", label: "Link" },
            ],
          },
          size: {
            key: "size",
            label: "Tamanho",
            type: "select",
            category: "style",
            value: block.properties?.size || "default",
            options: [
              { value: "sm", label: "Pequeno" },
              { value: "default", label: "Padrão" },
              { value: "lg", label: "Grande" },
              { value: "icon", label: "Ícone" },
            ],
          },
          onClick: {
            key: "onClick",
            label: "Ação ao Clicar",
            type: "text",
            category: "behavior",
            value: block.properties?.onClick || "",
          },
          disabled: {
            key: "disabled",
            label: "Desabilitado",
            type: "boolean",
            category: "behavior",
            value: block.properties?.disabled === true,
          },
          fullWidth: {
            key: "fullWidth",
            label: "Largura Completa",
            type: "boolean",
            category: "style",
            value: block.properties?.fullWidth === true,
          },
        };

      case "quiz-intro-image":
        return {
          src: {
            key: "src",
            label: "URL da Imagem",
            type: "text",
            category: "content",
            value: block.properties?.src || "",
            required: true,
          },
          alt: {
            key: "alt",
            label: "Texto Alternativo",
            type: "text",
            category: "content",
            value: block.properties?.alt || "",
            required: true,
          },
          caption: {
            key: "caption",
            label: "Legenda",
            type: "text",
            category: "content",
            value: block.properties?.caption || "",
          },
          aspectRatio: {
            key: "aspectRatio",
            label: "Proporção",
            type: "select",
            category: "style",
            value: block.properties?.aspectRatio || "auto",
            options: [
              { value: "auto", label: "Automática" },
              { value: "square", label: "Quadrada (1:1)" },
              { value: "video", label: "Vídeo (16:9)" },
              { value: "photo", label: "Foto (4:3)" },
              { value: "portrait", label: "Retrato (3:4)" },
            ],
          },
          objectFit: {
            key: "objectFit",
            label: "Ajuste da Imagem",
            type: "select",
            category: "style",
            value: block.properties?.objectFit || "cover",
            options: [
              { value: "cover", label: "Cobrir" },
              { value: "contain", label: "Conter" },
              { value: "fill", label: "Preencher" },
              { value: "scale-down", label: "Reduzir" },
            ],
          },
          borderRadius: {
            key: "borderRadius",
            label: "Bordas Arredondadas",
            type: "select",
            category: "style",
            value: block.properties?.borderRadius || "md",
            options: [
              { value: "none", label: "Nenhuma" },
              { value: "sm", label: "Pequena" },
              { value: "md", label: "Média" },
              { value: "lg", label: "Grande" },
              { value: "full", label: "Circular" },
            ],
          },
          shadow: {
            key: "shadow",
            label: "Sombra",
            type: "select",
            category: "style",
            value: block.properties?.shadow || "md",
            options: [
              { value: "none", label: "Nenhuma" },
              { value: "sm", label: "Pequena" },
              { value: "md", label: "Média" },
              { value: "lg", label: "Grande" },
              { value: "xl", label: "Extra Grande" },
            ],
          },
        };

      default:
        return {};
    }
  })();

  return { ...baseProps, ...layoutProps, ...typeSpecificProps };
};

// -----------------------------------------------------------------------------
// Componente Principal
// -----------------------------------------------------------------------------
const UniversalPropertiesPanel: React.FC<UniversalPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
  onDelete,
  onClose,
}) => {
  if (!selectedBlock) {
    return (
      <Card className="w-80 h-fit border-[#B89B7A]/30 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center text-[#B89B7A]">
            <Layout className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Selecione um componente para editar suas propriedades</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const properties = getComponentProperties(selectedBlock);

  const updateProperty = (key: string, value: any) => {
    if (!onUpdate) return;

    const currentProperties = selectedBlock.properties || {};
    const updatedProperties = {
      ...currentProperties,
      [key]: value,
    };

    onUpdate(selectedBlock.id, { properties: updatedProperties });
  };

  const resetProperties = () => {
    if (!onUpdate) return;
    onUpdate(selectedBlock.id, { properties: {} });
  };

  // Organizar propriedades por categoria
  const categorizedProperties = Object.values(properties).reduce(
    (acc, property) => {
      const category = property.category || "general";
      if (!acc[category]) acc[category] = [];
      acc[category].push(property);
      return acc;
    },
    {} as Record<string, any[]>
  );

  // Ordem das categorias
  const categoryOrder = ["content", "alignment", "style", "behavior", "advanced", "general"];
  const categoryIcons = {
    content: Type,
    alignment: Layout,
    style: Paintbrush,
    behavior: Settings,
    advanced: Settings,
    general: Palette,
  };

  const categoryLabels = {
    content: "Conteúdo",
    alignment: "Alinhamento",
    style: "Personalização",
    behavior: "Comportamento",
    advanced: "Avançado",
    general: "Geral",
  };

  // Renderizar campo baseado no tipo
  const renderField = (property: any) => {
    const { key, label, type, value, required, options, rows, min, max, step, unit } = property;

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
              rows={rows || 3}
              className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
            />
          </div>
        );

      case "number":
      case "range":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label} {required && <span className="text-red-500">*</span>}
              {type === "range" && (
                <span className="text-[#B89B7A] ml-2">
                  ({value}
                  {unit || ""})
                </span>
              )}
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

      case "select":
        return (
          <div key={key} className="space-y-2">
            <Label className="text-sm font-medium text-[#432818]">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Select value={value || ""} onValueChange={val => updateProperty(key, val)}>
              <SelectTrigger className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20">
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

      case "boolean":
        return (
          <div key={key} className="flex items-center justify-between py-2">
            <Label className="text-sm font-medium text-[#432818]">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Switch
              checked={value === true}
              onCheckedChange={checked => updateProperty(key, checked)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-80 h-fit border-[#B89B7A]/30 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-3 border-b border-[#B89B7A]/20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-[#432818]">Propriedades</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs border-[#B89B7A]/50 text-[#432818]">
                {selectedBlock.type}
              </Badge>
              <Badge variant="outline" className="text-xs border-[#B89B7A]/50 text-[#432818]">
                {selectedBlock.id}
              </Badge>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <EyeOff className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Seções organizadas como lista simples */}
        {categoryOrder.map(categoryKey => {
          const categoryProps = categorizedProperties[categoryKey];
          if (!categoryProps || categoryProps.length === 0) return null;

          const Icon = categoryIcons[categoryKey as keyof typeof categoryIcons];
          const categoryLabel = categoryLabels[categoryKey as keyof typeof categoryLabels];

          return (
            <div key={categoryKey} className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#B89B7A]/20">
                <Icon className="w-4 h-4 text-[#B89B7A]" />
                <h3 className="font-medium text-[#432818]">{categoryLabel}</h3>
              </div>
              <div className="space-y-3">{categoryProps.map(renderField)}</div>
            </div>
          );
        })}

        {/* Ações */}
        <div className="pt-4 border-t border-[#B89B7A]/20 space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetProperties}
            className="w-full border-[#B89B7A]/30 text-[#432818] hover:bg-[#B89B7A]/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Redefinir Propriedades
          </Button>

          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(selectedBlock.id)}
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Componente
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UniversalPropertiesPanel;
