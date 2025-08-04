/**
 * 🚀 OptimizedPropertiesPanel - MELHOR DE TODOS OS MUNDOS
 *
 * Combina:
 * - EnhancedPropertiesPanel: Interface completa e moderna
 * - ModernPropertyPanel: React Hook Form + performance
 * - DynamicPropertiesPanel: Simplicidade e funcionalidade
 *
 * OTIMIZAÇÕES:
 * - Performance com React Hook Form
 * - Interface moderna do Enhanced
 * - Modularidade do Modern
 * - Funcionalidade completa
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { useDebounce } from "@/hooks/useDebounce";
import { useSyncedScroll } from "@/hooks/useSyncedScroll";
import { BlockDefinition, EditableContent } from "@/types/editor";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle,
  Edit3,
  Info,
  Layout,
  Palette,
  Plus,
  Settings,
  Trash2,
  Type,
  X,
  Zap,
} from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { HexColorPicker } from "react-colorful";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

// 🎯 TIPOS OTIMIZADOS
interface OptionItem {
  id: string;
  text: string;
  value: string;
  category?: string;
  styleCategory?: string;
  points?: number;
  imageUrl?: string;
}

interface OptimizedPropertiesPanelProps {
  block: {
    id: string;
    type: string;
    content: EditableContent;
    properties?: Record<string, any>;
  };
  blockDefinition: BlockDefinition;
  onUpdateBlock: (id: string, content: Partial<EditableContent>) => void;
  onClose: () => void;
}

// 🔧 SCHEMA DE VALIDAÇÃO DINÂMICO
const createValidationSchema = (properties: Record<string, any>) => {
  const schemaFields: Record<string, any> = {};

  Object.entries(properties).forEach(([key, property]) => {
    switch (property.type) {
      case "text":
        schemaFields[key] = z.string().optional();
        break;
      case "number":
        schemaFields[key] = z.number().optional();
        break;
      case "boolean":
        schemaFields[key] = z.boolean().optional();
        break;
      case "array":
        schemaFields[key] = z.array(z.any()).optional();
        break;
      default:
        schemaFields[key] = z.any().optional();
    }
  });

  return z.object(schemaFields);
};

// 🎨 COMPONENTES OTIMIZADOS

// 🔧 Editor de Array de Opções MELHORADO (REFACTOR)
const OptimizedOptionsArrayEditor: React.FC<{
  control: any;
  name: string;
}> = ({ control, name }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  });

  const addOption = useCallback(() => {
    append({
      id: `option-${Date.now()}`,
      text: "Nova opção",
      value: `value-${Date.now()}`,
      category: "Geral",
      styleCategory: "Geral",
      points: 1,
      imageUrl: "https://via.placeholder.com/100x100",
    });
  }, [append]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Opções ({fields.length})</span>
        <Button onClick={addOption} size="sm" variant="outline">
          <Plus className="w-3 h-3 mr-1" />
          Adicionar
        </Button>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {fields.map((field, index) => (
          <Card key={field.id} className="p-3 border border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">Opção {index + 1}</span>
                <Button
                  onClick={() => remove(index)}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              <div className="grid gap-2">
                <Controller
                  control={control}
                  name={`${name}.${index}.text`}
                  render={({ field: textField }) => (
                    <Input {...textField} placeholder="Texto da opção" className="text-xs" />
                  )}
                />

                <Controller
                  control={control}
                  name={`${name}.${index}.value`}
                  render={({ field: valueField }) => (
                    <Input {...valueField} placeholder="Valor da opção" className="text-xs" />
                  )}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// 🎨 Color Picker OTIMIZADO
const OptimizedColorPicker: React.FC<{
  control: any;
  name: string;
}> = ({ control, name }) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-8 h-8 p-0 border-2"
              style={{ backgroundColor: field.value || "#ffffff" }}
            >
              <Palette className="w-4 h-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3">
            <HexColorPicker
              color={field.value || "#ffffff"}
              onChange={field.onChange} // 🎯 CORREÇÃO: Passamos diretamente o onChange do field
            />
            <Input
              value={field.value || ""}
              onChange={e => field.onChange(e.target.value)} // 🎯 CORREÇÃO: Usamos o onChange do field
              placeholder="#ffffff"
              className="mt-2"
            />
          </PopoverContent>
        </Popover>
        <span className="text-xs text-gray-500">{field.value || "Nenhuma cor"}</span>
      </div>
    )}
  />
);

// 🎛️ Property Group Card OTIMIZADO
const OptimizedPropertyGroup: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}> = ({ title, icon, children, defaultExpanded = true }) => (
  <Card className="border border-gray-200 shadow-sm">
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-700">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0 space-y-3">{children}</CardContent>
  </Card>
);

// 📝 Property Field OTIMIZADO
const OptimizedPropertyField: React.FC<{
  label: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}> = ({ label, description, required, children, error }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2">
      <Label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {description && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-3 h-3 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// 🚀 COMPONENTE PRINCIPAL OTIMIZADO
const OptimizedPropertiesPanel: React.FC<OptimizedPropertiesPanelProps> = ({
  block,
  blockDefinition,
  onUpdateBlock,
  onClose,
}) => {
  const { scrollRef } = useSyncedScroll({ source: "properties" });

  // 🔧 SETUP DO REACT HOOK FORM
  const validationSchema = useMemo(
    () => createValidationSchema(blockDefinition.properties),
    [blockDefinition.properties]
  );

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
    // 🎯 CORREÇÃO: Garantir que defaultValues seja sempre um objeto válido
    defaultValues: block.content || {},
    mode: "onChange",
  });

  // 🔄 DEBOUNCED UPDATE
  const watchedValues = watch();
  const debouncedValues = useDebounce(watchedValues, 300);

  React.useEffect(() => {
    console.log("🔍 OptimizedPropertiesPanel: watchedValues changed:", watchedValues);
  }, [watchedValues]);

  React.useEffect(() => {
    console.log("⏱️  OptimizedPropertiesPanel: debouncedValues changed:", debouncedValues);
    if (debouncedValues) {
      console.log("🚀 OptimizedPropertiesPanel: Calling onUpdateBlock with:", {
        blockId: block.id,
        updates: debouncedValues,
      });
      onUpdateBlock(block.id, debouncedValues);
    }
  }, [debouncedValues, block.id, onUpdateBlock]);

  // 🎯 Categorizar propriedades
  const categorizeProperties = useCallback(() => {
    const properties = blockDefinition.properties;
    const categories = {
      general: {},
      content: {},
      layout: {},
      styling: {},
      behavior: {},
      validation: {},
      advanced: {},
    };

    Object.entries(properties).forEach(([key, prop]) => {
      const category = (prop as any).category || "general";
      (categories as any)[category][key] = prop;
    });

    return categories;
  }, [blockDefinition.properties]);

  const categorizedProps = categorizeProperties();

  // 🎨 Renderizar input baseado no tipo
  const renderPropertyInput = useCallback(
    (key: string, property: any) => {
      switch (property.type) {
        case "text":
          return (
            <Controller
              control={control}
              name={key}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={property.placeholder || property.label}
                  className="text-sm"
                />
              )}
            />
          );

        case "textarea":
          return (
            <Controller
              control={control}
              name={key}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder={property.placeholder || property.label}
                  rows={property.rows || 3}
                  className="text-sm"
                />
              )}
            />
          );

        case "boolean":
          return (
            <Controller
              control={control}
              name={key}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                  <span className="text-sm text-gray-600">
                    {field.value ? "Ativado" : "Desativado"}
                  </span>
                </div>
              )}
            />
          );

        case "select":
          return (
            <Controller
              control={control}
              name={key}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder={`Selecione ${property.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {property.options?.map((option: any) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          );

        case "range":
          return (
            <Controller
              control={control}
              name={key}
              render={({ field }) => (
                <div className="space-y-2">
                  <Slider
                    value={[field.value || property.default || 0]}
                    onValueChange={value => field.onChange(value[0])}
                    max={property.max || 100}
                    min={property.min || 0}
                    step={property.step || 1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{property.min || 0}</span>
                    <span className="font-medium">{field.value || property.default || 0}</span>
                    <span>{property.max || 100}</span>
                  </div>
                </div>
              )}
            />
          );

        case "color":
          return <OptimizedColorPicker control={control} name={key} />;

        case "array":
          if (key === "options") {
            return <OptimizedOptionsArrayEditor control={control} name={key} />;
          }
          return (
            <div className="text-xs text-gray-500">
              Editor de array genérico (em desenvolvimento)
            </div>
          );

        default:
          return (
            <Controller
              control={control}
              name={key}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={property.placeholder || property.label}
                  className="text-sm"
                />
              )}
            />
          );
      }
    },
    [control, watchedValues]
  );

  // 🎯 Renderizar grupo de propriedades
  const renderPropertyGroup = useCallback(
    (title: string, icon: React.ReactNode, properties: Record<string, any>) => {
      if (Object.keys(properties).length === 0) return null;

      return (
        <OptimizedPropertyGroup title={title} icon={icon}>
          {Object.entries(properties).map(([key, property]) => (
            <OptimizedPropertyField
              key={key}
              label={property.label}
              description={property.description}
              required={property.required}
              error={errors[key]?.message as string}
            >
              {renderPropertyInput(key, property)}
            </OptimizedPropertyField>
          ))}
        </OptimizedPropertyGroup>
      );
    },
    [renderPropertyInput, errors]
  );

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      {/* 🎨 Header Premium */}
      <div className="p-4 bg-gradient-to-r from-stone-700 to-yellow-700 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
              <Settings className="w-3 h-3" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{blockDefinition.name}</h3>
              <p className="text-xs text-white/80">ID: {block.id}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {blockDefinition.description && (
          <p className="text-sm text-white/90 mt-2">{blockDefinition.description}</p>
        )}
      </div>

      {/* 🎛️ Properties Content */}
      <div ref={scrollRef} className="flex-1 overflow-auto">
        <Tabs defaultValue="properties" className="h-full">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
            <TabsTrigger value="properties" className="text-xs">
              <Settings className="w-3 h-3 mr-1" />
              Propriedades
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs">
              <Palette className="w-3 h-3 mr-1" />
              Estilo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="p-4 space-y-4 mt-0">
            {renderPropertyGroup("Geral", <Type className="w-4 h-4" />, categorizedProps.general)}
            {renderPropertyGroup(
              "Conteúdo",
              <Edit3 className="w-4 h-4" />,
              categorizedProps.content
            )}
            {renderPropertyGroup("Layout", <Layout className="w-4 h-4" />, categorizedProps.layout)}
            {renderPropertyGroup(
              "Comportamento",
              <CheckCircle className="w-4 h-4" />,
              categorizedProps.behavior
            )}
            {renderPropertyGroup(
              "Validação",
              <CheckCircle className="w-4 h-4" />,
              categorizedProps.validation
            )}
          </TabsContent>

          <TabsContent value="style" className="p-4 space-y-4 mt-0">
            {renderPropertyGroup(
              "Estilização",
              <Palette className="w-4 h-4" />,
              categorizedProps.styling
            )}
            {renderPropertyGroup(
              "Avançado",
              <Zap className="w-4 h-4" />,
              categorizedProps.advanced
            )}
          </TabsContent>
        </Tabs>

        {/* Fallback para propriedades não categorizadas */}
        {Object.keys(blockDefinition.properties).length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm font-medium">Nenhuma propriedade disponível</p>
            <p className="text-xs text-gray-400 mt-1">
              Este componente não possui propriedades editáveis
            </p>
          </div>
        )}
      </div>

      {/* 🎯 Footer Actions */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {Object.keys(blockDefinition.properties).length} propriedades
          </Badge>
          <Badge variant="outline" className="text-xs">
            {blockDefinition.category}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default OptimizedPropertiesPanel;
