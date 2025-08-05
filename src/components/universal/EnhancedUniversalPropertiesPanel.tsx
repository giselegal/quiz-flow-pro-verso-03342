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
// ✅ Importa UnifiedBlock, useUnifiedProperties e PropertyType do hook
import {
  PropertyType,
  UnifiedBlock,
  UnifiedProperty,
  useUnifiedProperties,
} from "@/hooks/useUnifiedProperties";
import { BlockDefinition } from "@/types/editor"; // Mantido para compatibilidade da interface
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

// A interface UnifiedBlock é importada do hook, garantindo consistência
interface EnhancedUniversalPropertiesPanelProps {
  selectedBlock: UnifiedBlock | null;
  onUpdate?: (blockId: string, updates: Record<string, any>) => void;
  onDelete?: (blockId: string) => void;
  onClose?: () => void;

  // Propriedades adicionadas para compatibilidade (o hook agora lida com `selectedBlock`)
  block?: any; // Compatibilidade com OptimizedPropertiesPanel (agora será `selectedBlock`)
  blockDefinition?: BlockDefinition; // Compatibilidade com novo sistema (não usado diretamente pelo hook)
  onUpdateBlock?: (blockId: string, updates: Partial<any>) => void; // Compatibilidade com novo sistema (agora será `onUpdate`)
}

// Componente principal com compatibilidade dupla
const EnhancedUniversalPropertiesPanel: React.FC<EnhancedUniversalPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate, // Este é o `onUpdateExternal` para o hook
  onDelete,
  onClose,
  // As props `block`, `blockDefinition`, `onUpdateBlock` são agora redundantes
  // pois o `selectedBlock` e `onUpdate` são as fontes de verdade para o hook.
  // Elas podem ser removidas se a compatibilidade legada não for mais necessária.
}) => {
  // ✅ Normaliza `selectedBlock` para ser a única fonte de verdade para o hook.
  // Se `block` for passado, ele será usado. Caso contrário, `selectedBlock`.
  // No entanto, para usar o `useUnifiedProperties` como pretendido, ele deve receber
  // um único objeto `UnifiedBlock`. Assumimos que `selectedBlock` é o principal.
  const actualBlock = selectedBlock;

  // ✅ Usa o hook useUnifiedProperties para gerenciar as propriedades do bloco selecionado.
  // O `onUpdate` passado aqui é o `onUpdateExternal` para o hook, que por sua vez,
  // chamará o `onUpdate` do `EditorProvider`.
  const { properties, updateProperty, resetProperties, getPropertiesByCategory } =
    useUnifiedProperties(
      actualBlock,
      onUpdate // Passa o `onUpdate` do painel diretamente para o hook
    );

  // Se nenhum bloco estiver selecionado, exibe uma mensagem
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

  // ✅ A ordem das categorias e ícones agora deve refletir as categorias definidas no hook.
  // Adicionado 'layout', 'basic', 'quiz' para cobrir todas as categorias do hook.
  const categoryOrder = [
    "content",
    "alignment",
    "style",
    "behavior",
    "scoring",
    "advanced",
    "general", // Mantido se ainda usado em algum lugar, mas 'layout' e 'basic' são mais específicos
    "layout",
    "basic",
    "quiz",
  ];

  const categoryIcons = {
    content: Type,
    alignment: Layout,
    style: Paintbrush,
    behavior: Settings,
    scoring: Palette,
    advanced: Settings,
    general: Palette, // Ícone genérico
    layout: Layout,
    basic: Settings,
    quiz: Palette,
  };

  const categoryLabels = {
    content: "Conteúdo",
    alignment: "Alinhamento",
    style: "Personalização",
    behavior: "Comportamento",
    scoring: "Pontuação e Categorias",
    advanced: "Avançado",
    general: "Geral",
    layout: "Layout",
    basic: "Básico",
    quiz: "Quiz",
  };

  // Renderizar campo baseado no tipo
  const renderField = (property: UnifiedProperty) => {
    const { key, label, type, value, required, options, rows, min, max, step, unit } = property;

    // `options` já vem no formato correto ({ value, label }) do `useUnifiedProperties`
    const formattedOptions = options;

    switch (type) {
      case PropertyType.TEXT:
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

      case PropertyType.TEXTAREA:
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

      case PropertyType.NUMBER:
      case PropertyType.RANGE:
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label} {required && <span className="text-red-500">*</span>}
              {(type === PropertyType.RANGE || type === PropertyType.NUMBER) && (
                <span className="text-[#B89B7A] ml-2">
                  ({value}
                  {unit || ""})
                </span>
              )}
            </Label>
            {type === PropertyType.RANGE ? (
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

      case PropertyType.SELECT:
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
                {formattedOptions?.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case PropertyType.SWITCH:
        return (
          <div key={key} className="flex items-center justify-between py-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818] cursor-pointer">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Switch
              id={key}
              checked={!!value} // Garante que o valor é booleano
              onCheckedChange={checked => updateProperty(key, checked)}
              className="data-[state=checked]:bg-[#B89B7A]"
            />
          </div>
        );

      case PropertyType.COLOR:
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

      case PropertyType.IMAGE: // Tipo de imagem (input de texto para URL)
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={key}
              type="text"
              value={value || ""}
              onChange={e => updateProperty(key, e.target.value)}
              placeholder="URL da imagem"
              className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
            />
          </div>
        );

      case PropertyType.OPTION_SCORE: // Tipo de pontuação de opção
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={key}
              type="number"
              value={value || 0}
              onChange={e => updateProperty(key, Number(e.target.value))}
              min={min}
              max={max}
              step={step}
              className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
            />
          </div>
        );

      case PropertyType.OPTION_CATEGORY: // Tipo de categoria de opção
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={key}
              type="text"
              value={value || ""}
              onChange={e => updateProperty(key, e.target.value)}
              className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
            />
          </div>
        );

      default:
        return (
          <div key={key} className="space-y-2 text-red-500 text-sm">
            Tipo de propriedade desconhecido: {type}
          </div>
        );
    }
  };

  // Normalizar o tipo e ID para exibição
  const displayType = actualBlock.type; // Ou blockDefinition?.name || actualBlock.type; se blockDefinition for relevante
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
          // ✅ Usando `getPropertiesByCategory` do hook
          const categorizedProps = getPropertiesByCategory(categoryKey);
          if (!categorizedProps || categorizedProps.length === 0) return null;

          const Icon = categoryIcons[categoryKey as keyof typeof categoryIcons];
          const categoryLabel = categoryLabels[categoryKey as keyof typeof categoryLabels];

          return (
            <div key={categoryKey} className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#B89B7A]/20">
                {Icon && <Icon className="w-4 h-4 text-[#B89B7A]" />}
                <h3 className="font-medium text-[#432818]">{categoryLabel}</h3>
              </div>
              <div className="space-y-3">{categorizedProps.map(renderField)}</div>
            </div>
          );
        })}

        {/* Ações */}
        <div className="pt-4 border-t border-[#B89B7A]/20 space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetProperties} // ✅ Usando `resetProperties` do hook
            className="w-full border-[#B89B7A]/30 text-[#432818] hover:bg-[#B89B7A]/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Redefinir Propriedades
          </Button>

          {onDelete && ( // Simplificado, já que `onUpdateBlock` não é mais a principal forma de atualização aqui
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(actualBlock.id)}
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
