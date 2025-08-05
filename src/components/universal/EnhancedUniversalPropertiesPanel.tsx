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
import { BlockDefinition } from "@/types/editor";
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
// Importar do arquivo index.ts que agora exporta corretamente os componentes e funções
import { getComponentProperties } from "./";

// Interface atualizada para compatibilidade com editor-fixed-dragdrop
interface EnhancedUniversalPropertiesPanelProps {
  // Interface original
  selectedBlock: UnifiedBlock | null;
  onUpdate?: (blockId: string, updates: Record<string, any>) => void;
  onDelete?: (blockId: string) => void;
  onClose?: () => void;

  // Propriedades adicionadas para compatibilidade
  block?: any; // Compatibilidade com OptimizedPropertiesPanel
  blockDefinition?: BlockDefinition; // Compatibilidade com novo sistema
  onUpdateBlock?: (blockId: string, updates: Partial<any>) => void; // Compatibilidade com novo sistema
}

// Tipo para definição de propriedades (mantido para compatibilidade)
interface PropertyDefinition {
  key: string;
  label: string;
  type: string;
  category: string;
  value: any;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

// Agora estamos importando getComponentProperties do UniversalPropertiesPanel
// para garantir uma fonte única das propriedades de cada componente

// Converter BlockDefinition para PropertyDefinition[]
const convertBlockDefinitionToPropertyDefinitions = (
  blockDefinition: BlockDefinition | undefined,
  blockProperties: Record<string, any>
): Record<string, PropertyDefinition> => {
  if (!blockDefinition) return {};

  const result: Record<string, PropertyDefinition> = {};

  Object.entries(blockDefinition.properties).forEach(([key, schema]) => {
    result[key] = {
      key,
      label: schema.label,
      type: mapSchemaTypeToPropertyType(schema.type),
      category: schema.category || "general",
      value: blockProperties?.[key] !== undefined ? blockProperties[key] : schema.default,
      required: schema.required || false,
      options: schema.options,
      rows: schema.rows,
      min: schema.min,
      max: schema.max,
      step: schema.step,
    };
  });

  return result;
};

// Mapear tipos de schema para tipos de property
const mapSchemaTypeToPropertyType = (
  schemaType: "string" | "number" | "boolean" | "select" | "textarea" | "array" | "color" | "range"
): string => {
  const typeMap: Record<string, string> = {
    string: "text",
    number: "number",
    boolean: "boolean",
    select: "select",
    textarea: "textarea",
    array: "select", // Simplificação
    color: "color",
    range: "range",
  };

  return typeMap[schemaType] || "text";
};

// Componente principal com compatibilidade dupla
const EnhancedUniversalPropertiesPanel: React.FC<EnhancedUniversalPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
  onDelete,
  onClose,
  block,
  blockDefinition,
  onUpdateBlock,
}) => {
  // Normalizar dados para compatibilidade entre os dois sistemas
  const actualBlock = block || selectedBlock;

  if (!actualBlock) {
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

  // Determinar o método para obter propriedades com base no que está disponível
  const properties = useMemo(() => {
    console.log("🔄 Re-calculando propriedades para bloco:", actualBlock);

    if (blockDefinition) {
      // Usar o novo sistema baseado em BlockDefinition
      const props = convertBlockDefinitionToPropertyDefinitions(
        blockDefinition,
        actualBlock.properties || actualBlock.content || {}
      );
      console.log("🧩 Propriedades convertidas de BlockDefinition:", props);
      return props;
    } else {
      // Usar a implementação original do componente UniversalPropertiesPanel
      const props = getComponentProperties(actualBlock as UnifiedBlock);
      console.log("🧩 Propriedades obtidas de getComponentProperties:", props);
      return props;
    }
  }, [actualBlock, actualBlock.properties, actualBlock.content, blockDefinition]);

  // Função de atualização unificada - melhorada para garantir detecção de mudanças
  const updateProperty = (key: string, value: any) => {
    const blockId = actualBlock.id;
    console.log(
      `🔍 EnhancedUniversalPropertiesPanel: Atualizando propriedade ${key} para ${JSON.stringify(value)}`
    );
    console.log(`🔍 Estado atual do bloco antes da atualização:`, actualBlock);

    if (onUpdateBlock) {
      // Para propriedades aninhadas, garantimos que criamos um novo objeto
      if (key.includes(".")) {
        const [mainKey, subKey] = key.split(".");
        const currentMainValue = actualBlock[mainKey] || {};

        // Criamos um novo objeto para a propriedade principal
        const updatedMainValue = {
          ...currentMainValue,
          [subKey]: value,
        };

        // Enviamos a atualização com o novo objeto
        console.log(`🔄 Atualizando via onUpdateBlock - propriedade aninhada:`, {
          [mainKey]: updatedMainValue,
        });
        onUpdateBlock(blockId, { [mainKey]: updatedMainValue });
      } else {
        // Para propriedades simples, verificamos se é uma propriedade direta ou de 'properties'
        // Se a chave não existir diretamente no bloco, assumimos que faz parte de 'properties'
        if (actualBlock[key] !== undefined || key === "type" || key === "name") {
          console.log(`🔄 Atualizando via onUpdateBlock - propriedade direta:`, { [key]: value });
          onUpdateBlock(blockId, { [key]: value });
        } else {
          // Garantir que properties existe e criar uma nova referência
          const properties = { ...(actualBlock.properties || {}) };
          console.log(`🔄 Atualizando via onUpdateBlock - propriedade em properties:`, {
            properties: { ...properties, [key]: value },
          });
          onUpdateBlock(blockId, {
            properties: { ...properties, [key]: value },
          });
        }
      }
    } else if (onUpdate) {
      // Sistema legado - garantir imutabilidade para properties
      const currentProperties = { ...(actualBlock.properties || {}) };

      // Criamos um novo objeto de propriedades para garantir referência nova
      const updatedProperties = {
        ...currentProperties,
        [key]: value,
      };

      // Enviamos o objeto completo de propriedades atualizado
      console.log(`🔄 Atualizando via onUpdate (sistema legado):`, {
        properties: updatedProperties,
      });
      onUpdate(blockId, { properties: updatedProperties });
    }
  };

  // Função de reset unificada
  const resetProperties = () => {
    const blockId = actualBlock.id;

    if (onUpdateBlock && blockDefinition) {
      // Redefinir usando valores padrão da definição
      const defaultValues: Record<string, any> = {};
      Object.entries(blockDefinition.properties).forEach(([key, schema]) => {
        defaultValues[key] = schema.default;
      });
      onUpdateBlock(blockId, defaultValues);
    } else if (onUpdate) {
      // Sistema existente
      onUpdate(blockId, { properties: {} });
    }
  };

  // Organizar propriedades por categoria
  const categorizedProperties = useMemo(() => {
    return Object.values(properties).reduce(
      (acc, property) => {
        const category = property.category || "general";
        if (!acc[category]) acc[category] = [];
        acc[category].push(property);
        return acc;
      },
      {} as Record<string, PropertyDefinition[]>
    );
  }, [properties]);

  // Ordem das categorias
  const categoryOrder = [
    "content",
    "alignment",
    "style",
    "behavior",
    "scoring",
    "advanced",
    "general",
  ];
  const categoryIcons = {
    content: Type,
    alignment: Layout,
    style: Paintbrush,
    behavior: Settings,
    scoring: Palette,
    advanced: Settings,
    general: Palette,
  };

  const categoryLabels = {
    content: "Conteúdo",
    alignment: "Alinhamento",
    style: "Personalização",
    behavior: "Comportamento",
    scoring: "Pontuação e Categorias",
    advanced: "Avançado",
    general: "Geral",
  };

  // Renderizar campo baseado no tipo
  const renderField = (property: PropertyDefinition) => {
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
                {options?.map(option => (
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

      case "color":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                id={key}
                value={value || "#000000"}
                onChange={e => updateProperty(key, e.target.value)}
                className="w-10 h-10 p-0 border-none rounded cursor-pointer"
              />
              <Input
                value={value || "#000000"}
                onChange={e => updateProperty(key, e.target.value)}
                className="flex-1 border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Normalizar o tipo para exibição
  const displayType = blockDefinition?.name || actualBlock.type;
  const displayId = actualBlock.id;

  return (
    <Card className="w-80 h-fit border-[#B89B7A]/30 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-3 border-b border-[#B89B7A]/20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-[#432818]">Propriedades</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs border-[#B89B7A]/50 text-[#432818]">
                {displayType}
              </Badge>
              <Badge variant="outline" className="text-xs border-[#B89B7A]/50 text-[#432818]">
                {displayId}
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
        {/* Seções organizadas por categoria */}
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

          {(onDelete || typeof onUpdateBlock === "function") && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (onDelete) {
                  onDelete(actualBlock.id);
                } else if (typeof onUpdateBlock === "function") {
                  // Implementar lógica de exclusão alternativa se necessário
                  console.log("Exclusão não implementada diretamente no sistema novo");
                }
              }}
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

export { EnhancedUniversalPropertiesPanel };
export default EnhancedUniversalPropertiesPanel;
