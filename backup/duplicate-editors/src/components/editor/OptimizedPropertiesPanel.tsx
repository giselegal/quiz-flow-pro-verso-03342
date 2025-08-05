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
import { BlockDefinition } from "@/types/blocks";
import { EditableContent } from "@/types/editor";
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
import React, { useCallback, useEffect, useMemo } from "react";
import { HexColorPicker } from "react-colorful";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

// Adicionamos as propriedades de layout ao tipo de conteúdo editável
// Nota: A interface EditableContent já tem as propriedades que precisamos
// Não precisamos declarar novamente, apenas usar as existentes

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
  onUpdateBlock: (id: string, content: any) => void;
  onClose: () => void;
}

// 🔧 SCHEMA DE VALIDAÇÃO DINÂMICO
const createValidationSchema = (properties: Record<string, any>) => {
  const schemaFields: Record<string, any> = {};

  Object.entries(properties).forEach(([key, property]) => {
    switch (property.type) {
      case "text":
        // A validação de `text` deve usar o `z.string()`
        schemaFields[key] = z.string().optional();
        break;
      case "textarea":
        schemaFields[key] = z.string().optional();
        break;
      case "number":
      case "range": // <-- Adicionamos o 'range' aqui
        // Validação de número, opcionalmente com min e max
        let numberSchema = z.number();
        if (property.min !== undefined) numberSchema = numberSchema.min(property.min);
        if (property.max !== undefined) numberSchema = numberSchema.max(property.max);
        schemaFields[key] = numberSchema.optional();
        break;
      case "boolean":
        schemaFields[key] = z.boolean().optional();
        break;
      case "select": // <-- Adicionamos o 'select' aqui
        // Validação de enum para o Select
        const options = property.options?.map((o: any) => o.value) || [];
        if (options.length > 0) {
          schemaFields[key] = z.enum(options as [string, ...string[]]).optional();
        } else {
          schemaFields[key] = z.string().optional();
        }
        break;
      case "color":
        schemaFields[key] = z.string().optional();
        break;
      case "array":
        // Corrigido para garantir que o array tem a estrutura correta de OptionItem
        schemaFields[key] = z
          .array(
            z.object({
              id: z.string(),
              text: z.string(),
              value: z.string(),
              category: z.string().optional(),
              styleCategory: z.string().optional(),
              points: z.number().optional(),
              imageUrl: z.string().optional(),
            })
          )
          .optional();
        break;
      default:
        schemaFields[key] = z.any().optional();
    }
  });

  return z.object(schemaFields);
};

// 🎨 COMPONENTES OTIMIZADOS

/**
 * 🔧 Editor de Array de Opções MELHORADO
 * Agora utiliza `useFieldArray` para uma integração perfeita com React Hook Form.
 * Isso permite que a adição/remoção de itens seja gerida pelo formulário.
 */
const OptimizedOptionsArrayEditor: React.FC<{
  control: any;
  name: string;
}> = ({ control, name }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const addOption = useCallback(() => {
    // 🎯 SISTEMA 1: ID Semântico para opções
    const optionNumber = fields.length + 1;
    append({
      id: `option-${optionNumber}`,
      text: "Nova opção",
      value: `value-option-${optionNumber}`,
      category: "Geral",
      styleCategory: "Geral",
      points: 1,
      imageUrl: "https://via.placeholder.com/100x100",
    });
  }, [append, fields.length]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Opções ({fields.length})</span>
        <Button onClick={addOption} size="sm" variant="outline" type="button">
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
                  type="button"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              <div className="grid gap-2">
                <Controller
                  control={control}
                  name={`${name}.${index}.text`}
                  render={({ field: { onChange, ...rest } }) => (
                    <Input
                      {...rest}
                      onChange={e => onChange(e.target.value)}
                      placeholder="Texto da opção"
                      className="text-xs"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`${name}.${index}.value`}
                  render={({ field: { onChange, ...rest } }) => (
                    <Input
                      {...rest}
                      onChange={e => onChange(e.target.value)}
                      placeholder="Valor da opção"
                      className="text-xs"
                    />
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

/**
 * 🎨 Color Picker OTIMIZADO
 * Agora utiliza `Controller` para atualizar o valor de forma síncrona.
 */
const OptimizedColorPicker: React.FC<{
  control: any;
  name: string;
  label: string;
}> = ({ control, name, label }) => (
  <div className="flex items-center gap-2">
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-8 h-8 p-0 border-2"
                style={{ backgroundColor: field.value || "#ffffff" }}
                type="button"
              >
                <Palette className="w-4 h-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3">
              <HexColorPicker color={field.value || "#ffffff"} onChange={field.onChange} />
              <Input
                value={field.value || ""}
                onChange={e => field.onChange(e.target.value)}
                placeholder="#ffffff"
                className="mt-2"
              />
            </PopoverContent>
          </Popover>
          <span className="text-xs text-gray-500">{field.value || "Nenhuma cor"}</span>
        </>
      )}
    />
  </div>
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
  // 🐛 DEBUG: Log inicial para verificar se o painel está sendo chamado
  console.log("🎯 OptimizedPropertiesPanel RENDERIZADO:", {
    blockId: block.id,
    blockType: block.type,
    blockContent: block.content,
    blockDefinition: blockDefinition.name,
    hasProperties: Object.keys(blockDefinition.properties || {}).length > 0,
  });

  const { scrollRef } = useSyncedScroll({ source: "properties" });

  // 🔧 Definições padrão para as propriedades de layout
  const defaultLayoutProps = {
    maxWidth: {
      type: "range",
      label: "Tamanho Máximo",
      description: "Define a largura máxima do componente (em % da largura disponível)",
      min: 10,
      max: 100,
      step: 5,
      category: "layout",
      default: 100,
    },
    alignment: {
      type: "select",
      label: "Alinhamento",
      description: "Define como o componente será alinhado no espaço disponível",
      options: [
        { value: "left", label: "Esquerda" },
        { value: "center", label: "Centro" },
        { value: "right", label: "Direita" },
      ],
      category: "layout",
      default: "left",
    },
  };

  // 🔧 Mesclar propriedades de layout com as propriedades do componente
  const mergedProperties = useMemo(() => {
    return {
      ...defaultLayoutProps,
      ...blockDefinition.properties,
    };
  }, [blockDefinition.properties]);

  // 🔧 SETUP DO REACT HOOK FORM
  const validationSchema = useMemo(
    () => createValidationSchema(mergedProperties),
    [mergedProperties]
  );

  // Definir valores padrão para propriedades de layout se não existirem
  const defaultValues = useMemo(() => {
    const values = { ...block.content };
    if (values.maxWidth === undefined) values.maxWidth = 100;
    if (values.alignment === undefined) values.alignment = "left";
    return values;
  }, [block.content]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
    mode: "onChange",
  });

  // 🔄 USAR useWatch para monitorar valores
  const watchedValues = useWatch({ control });
  const debouncedValues = useDebounce(watchedValues, 300);

  useEffect(() => {
    console.log("🔍 OptimizedPropertiesPanel: watchedValues changed:", watchedValues);
  }, [watchedValues]);

  useEffect(() => {
    console.log("⏱️ OptimizedPropertiesPanel: debouncedValues changed:", debouncedValues);
    if (debouncedValues && Object.keys(debouncedValues).length > 0) {
      console.log("🚀 OptimizedPropertiesPanel: Calling onUpdateBlock with:", {
        blockId: block.id,
        updates: debouncedValues,
      });
      onUpdateBlock(block.id, debouncedValues);
    }
  }, [debouncedValues, block.id, onUpdateBlock]);

  // 🎯 Categorizar propriedades
  const categorizeProperties = useCallback(() => {
    const properties = mergedProperties;
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
  }, [mergedProperties]);

  const categorizedProps = categorizeProperties();

  // 🎨 Renderizar input baseado no tipo
  const renderPropertyInput = useCallback(
    (key: string, property: any) => {
      const error = errors[key]?.message;

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
                  value={field.value || ""}
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
                  value={field.value || ""}
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
                    value={[field.value ?? property.default ?? property.min ?? 0]}
                    onValueChange={value => field.onChange(value[0])}
                    max={property.max || 100}
                    min={property.min || 0}
                    step={property.step || 1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      {property.min || 0}
                      {key === "maxWidth" ? "%" : ""}
                    </span>
                    <span className="font-medium">
                      {field.value ?? property.default ?? property.min ?? 0}
                      {key === "maxWidth" ? "%" : ""}
                    </span>
                    <span>
                      {property.max || 100}
                      {key === "maxWidth" ? "%" : ""}
                    </span>
                  </div>
                </div>
              )}
            />
          );

        case "color":
          return <OptimizedColorPicker control={control} name={key} label={property.label} />;

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
                  value={field.value || ""}
                />
              )}
            />
          );
      }
    },
    [control, errors]
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
            type="button"
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
        {Object.keys(blockDefinition.properties).length === 0 &&
          Object.keys(defaultLayoutProps).length === 0 && (
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
            {Object.keys(mergedProperties).length} propriedades
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
