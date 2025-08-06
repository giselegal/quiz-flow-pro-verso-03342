import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  PropertyCategory,
  PropertyType,
  UnifiedBlock,
  UnifiedProperty,
  useUnifiedProperties,
} from "@/hooks/useUnifiedProperties";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface EnhancedUniversalPropertiesPanelProps {
  selectedBlock?: UnifiedBlock;
  onUpdate?: (blockId: string, updates: Record<string, any>) => void;
  onClose?: () => void;
}

export const EnhancedUniversalPropertiesPanel = ({
  selectedBlock,
  onUpdate,
  onClose,
}: EnhancedUniversalPropertiesPanelProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("content");

  // ✅ CORREÇÃO: Usar o hook correto com o bloco selecionado
  const {
    properties,
    updateProperty,
    resetProperties,
    validateProperties,
    getPropertiesByCategory,
  } = useUnifiedProperties(selectedBlock, onUpdate);

  // Se não houver bloco selecionado, mostrar mensagem
  if (!selectedBlock) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">Selecione um bloco para editar suas propriedades</p>
      </div>
    );
  }

  // ✅ CORREÇÃO: Função para criar esquema Zod baseado em UnifiedProperty
  const createZodSchema = (properties: UnifiedProperty[]) => {
    const schemaObj: Record<string, any> = {};

    properties.forEach(prop => {
      let fieldSchema;

      switch (prop.type) {
        case PropertyType.TEXT:
        case PropertyType.TEXTAREA:
        case PropertyType.COLOR:
        case PropertyType.SELECT:
        case PropertyType.IMAGE:
        case PropertyType.ALIGNMENT:
        case PropertyType.FONTFAMILY:
        case PropertyType.FONTSTYLE:
        case PropertyType.RICHTEXT:
        case PropertyType.FILE:
        case PropertyType.TAGS:
        case PropertyType.RADIO:
        case PropertyType.ANIMATION:
        case PropertyType.OPTION_CATEGORY:
          fieldSchema = z.string().optional();
          break;
        case PropertyType.NUMBER:
        case PropertyType.RANGE:
        case PropertyType.OPTION_SCORE:
          fieldSchema = z.number().optional();
          break;
        case PropertyType.SWITCH:
        case PropertyType.CHECKBOX:
          fieldSchema = z.boolean().optional();
          break;
        default:
          fieldSchema = z.any().optional();
      }

      // ✅ CORREÇÃO: Usar prop.key em vez de prop.id
      schemaObj[prop.key] = fieldSchema;
    });

    return z.object(schemaObj);
  };

  // Criar esquema Zod com base nas propriedades
  const formSchema = createZodSchema(properties);

  // Inicializar formulário com os valores atuais do bloco
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: selectedBlock.properties || {},
  });

  // Atualizar valores do formulário quando o bloco selecionado mudar
  useEffect(() => {
    if (selectedBlock && selectedBlock.properties) {
      form.reset(selectedBlock.properties);
    }
  }, [selectedBlock, form]);

  // ✅ CORREÇÃO: Manipular envio correto
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!selectedBlock) return;

    // Atualizar cada propriedade individualmente
    Object.entries(values).forEach(([key, value]) => {
      updateProperty(key, value);
    });

    // Mostrar notificação de sucesso
    toast({
      title: "Propriedades atualizadas",
      description: "As propriedades do bloco foram atualizadas com sucesso.",
    });
  };

  // ✅ CORREÇÃO: Agrupar propriedades por categoria usando o hook
  const contentProperties = getPropertiesByCategory(PropertyCategory.CONTENT);
  const styleProperties = getPropertiesByCategory(PropertyCategory.STYLE);
  const behaviorProperties = getPropertiesByCategory(PropertyCategory.BEHAVIOR);
  const quizProperties = getPropertiesByCategory(PropertyCategory.QUIZ);
  const advancedProperties = getPropertiesByCategory(PropertyCategory.ADVANCED);

  // ✅ CORREÇÃO: Função para renderizar campo baseado em UnifiedProperty
  const renderField = (property: UnifiedProperty) => {
    switch (property.type) {
      case PropertyType.TEXT:
        return (
          <FormField
            key={property.key}
            control={form.control}
            name={property.key}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{property.label}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    onChange={e => {
                      field.onChange(e.target.value);
                      updateProperty(property.key, e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case PropertyType.TEXTAREA:
        return (
          <FormField
            key={property.key}
            control={form.control}
            name={property.key}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{property.label}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    rows={property.rows || 3}
                    onChange={e => {
                      field.onChange(e.target.value);
                      updateProperty(property.key, e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case PropertyType.NUMBER:
        return (
          <FormField
            key={property.key}
            control={form.control}
            name={property.key}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{property.label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    min={property.min}
                    max={property.max}
                    step={property.step}
                    value={field.value === undefined ? "" : field.value}
                    onChange={e => {
                      const value = Number(e.target.value);
                      field.onChange(value);
                      updateProperty(property.key, value);
                    }}
                  />
                </FormControl>
                {property.unit && <FormDescription>Unidade: {property.unit}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case PropertyType.RANGE:
        return (
          <FormField
            key={property.key}
            control={form.control}
            name={property.key}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {property.label}: {field.value || property.defaultValue || 0}
                  {property.unit && ` ${property.unit}`}
                </FormLabel>
                <FormControl>
                  <input
                    type="range"
                    min={property.min || 0}
                    max={property.max || 100}
                    step={property.step || 1}
                    value={field.value || property.defaultValue || 0}
                    onChange={e => {
                      const value = Number(e.target.value);
                      field.onChange(value);
                      updateProperty(property.key, value);
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case PropertyType.SWITCH:
        return (
          <FormField
            key={property.key}
            control={form.control}
            name={property.key}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>{property.label}</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={checked => {
                      field.onChange(checked);
                      updateProperty(property.key, checked);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case PropertyType.COLOR:
        return (
          <FormField
            key={property.key}
            control={form.control}
            name={property.key}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{property.label}</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      onChange={e => {
                        field.onChange(e.target.value);
                        updateProperty(property.key, e.target.value);
                      }}
                    />
                  </FormControl>
                  <Input
                    type="color"
                    className="w-12 p-1 h-10"
                    value={field.value || "#000000"}
                    onChange={e => {
                      field.onChange(e.target.value);
                      updateProperty(property.key, e.target.value);
                    }}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case PropertyType.SELECT:
        return (
          <FormField
            key={property.key}
            control={form.control}
            name={property.key}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{property.label}</FormLabel>
                <Select
                  onValueChange={value => {
                    field.onChange(value);
                    updateProperty(property.key, value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {property.options?.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case PropertyType.IMAGE:
        return (
          <FormField
            key={property.key}
            control={form.control}
            name={property.key}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{property.label}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="https://exemplo.com/imagem.jpg"
                    onChange={e => {
                      field.onChange(e.target.value);
                      updateProperty(property.key, e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return null;
    }
  };

  // ✅ CORREÇÃO: Verificações usando as variáveis corretas do hook
  const hasContentProperties = contentProperties.length > 0;
  const hasStyleProperties = styleProperties.length > 0;
  const hasBehaviorProperties = behaviorProperties.length > 0;
  const hasQuizProperties = quizProperties.length > 0;
  const hasAdvancedProperties = advancedProperties.length > 0;

  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Propriedades do Bloco</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Fechar
          </Button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full">
              {hasContentProperties && <TabsTrigger value="content">Conteúdo</TabsTrigger>}
              {hasStyleProperties && <TabsTrigger value="style">Estilo</TabsTrigger>}
              {hasBehaviorProperties && <TabsTrigger value="behavior">Comportamento</TabsTrigger>}
              {hasQuizProperties && <TabsTrigger value="quiz">Quiz</TabsTrigger>}
              {hasAdvancedProperties && <TabsTrigger value="advanced">Avançado</TabsTrigger>}
            </TabsList>

            {hasContentProperties && (
              <TabsContent value="content" className="space-y-4 pt-4">
                {contentProperties.map(renderField)}
              </TabsContent>
            )}

            {hasStyleProperties && (
              <TabsContent value="style" className="space-y-4 pt-4">
                {styleProperties.map(renderField)}
              </TabsContent>
            )}

            {hasBehaviorProperties && (
              <TabsContent value="behavior" className="space-y-4 pt-4">
                {behaviorProperties.map(renderField)}
              </TabsContent>
            )}

            {hasQuizProperties && (
              <TabsContent value="quiz" className="space-y-4 pt-4">
                {quizProperties.map(renderField)}
              </TabsContent>
            )}

            {hasAdvancedProperties && (
              <TabsContent value="advanced" className="space-y-4 pt-4">
                {advancedProperties.map(renderField)}
              </TabsContent>
            )}
          </Tabs>

          <Separator />

          <div className="flex justify-end">
            <Button type="submit">Salvar alterações</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
