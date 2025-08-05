import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { BlockDefinition, PropertyType, PropertyDefinition } from "@/types/editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUnifiedProperties } from "@/hooks/useUnifiedProperties";
import { Separator } from "@/components/ui/separator";
import { UnifiedBlock } from "@/types/unified";
import { generateSemanticId } from "@/lib/semanticIdGenerator";

interface EnhancedUniversalPropertiesPanelProps {
  selectedBlock?: UnifiedBlock;
  blockDefinition?: BlockDefinition;
  onUpdate?: (updatedBlock: UnifiedBlock) => void;
  onClose?: () => void;
}

export const EnhancedUniversalPropertiesPanel = ({
  selectedBlock,
  blockDefinition,
  onUpdate,
  onClose,
}: EnhancedUniversalPropertiesPanelProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const { getComponentProperties } = useUnifiedProperties();

  // Se não houver bloco selecionado, mostrar mensagem
  if (!selectedBlock) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">Selecione um bloco para editar suas propriedades</p>
      </div>
    );
  }

  // Obter propriedades do componente com base no tipo do bloco
  const properties = getComponentProperties(selectedBlock.type);

  // Função auxiliar para criar um esquema Zod para validação
  const createZodSchema = (properties: PropertyDefinition[]) => {
    const schemaObj: Record<string, any> = {};
    
    properties.forEach((prop) => {
      let fieldSchema;
      
      switch (prop.type) {
        case PropertyType.TEXT:
        case PropertyType.TEXTAREA:
        case PropertyType.COLOR:
        case PropertyType.SELECT:
        case PropertyType.IMAGE:
          fieldSchema = z.string().optional();
          break;
        case PropertyType.NUMBER:
          fieldSchema = z.number().optional();
          break;
        case PropertyType.BOOLEAN:
          fieldSchema = z.boolean().optional();
          break;
        case PropertyType.OPTION_SCORE:
          fieldSchema = z.number().min(0).optional();
          break;
        case PropertyType.OPTION_CATEGORY:
          fieldSchema = z.string().optional();
          break;
        default:
          fieldSchema = z.any().optional();
      }
      
      schemaObj[prop.id] = fieldSchema;
    });
    
    return z.object(schemaObj);
  };

  // Criar esquema Zod com base nas propriedades do componente
  const formSchema = createZodSchema(properties);

  // Inicializar formulário com os valores atuais do bloco
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: selectedBlock.properties || {},
  });

  // Atualizar valores do formulário quando o bloco selecionado mudar
  useEffect(() => {
    if (selectedBlock && selectedBlock.properties) {
      // Redefinir valores do formulário para as propriedades do bloco atual
      form.reset(selectedBlock.properties);
    }
  }, [selectedBlock, form]);

  // Manipular envio do formulário
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!selectedBlock) return;

    // Criar cópia atualizada do bloco
    const updatedBlock = {
      ...selectedBlock,
      properties: {
        ...selectedBlock.properties,
        ...values,
      },
    };

    // Chamar função de atualização, se fornecida
    if (onUpdate) {
      onUpdate(updatedBlock);
    }

    // Mostrar notificação de sucesso
    toast({
      title: "Propriedades atualizadas",
      description: "As propriedades do bloco foram atualizadas com sucesso.",
    });
  };

  // Agrupar propriedades por categoria
  const basicProperties = properties.filter(prop => !prop.category || prop.category === "basic");
  const styleProperties = properties.filter(prop => prop.category === "style");
  const advancedProperties = properties.filter(prop => prop.category === "advanced");
  const quizProperties = properties.filter(prop => prop.category === "quiz");

  // Função para renderizar o campo apropriado com base no tipo de propriedade
  const renderField = (property: PropertyDefinition) => {
    switch (property.type) {
      case PropertyType.TEXT:
        return (
          <FormField
            key={property.id}
            control={form.control}
            name={property.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{property.label}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                {property.description && <FormDescription>{property.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      case PropertyType.TEXTAREA:
        return (
          <FormField
            key={property.id}
            control={form.control}
            name={property.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{property.label}</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value || ""} />
                </FormControl>
                {property.description && <FormDescription>{property.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      case PropertyType.NUMBER:
        return (
          <FormField
            key={property.id}
            control={form.control}
            name={property.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{property.label}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value === undefined ? "" : field.value}
                  />
                </FormControl>
                {property.description && <FormDescription>{property.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      case PropertyType.BOOLEAN:
        return (
          <FormField
            key={property.id}
            control={form.control}
            name={property.id}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>{property.label}</FormLabel>
                  {property.description && <FormDescription>{property.description}</FormDescription>}
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
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
            key={property.id}
            control={form.control}
            name={property.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{property.label}</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <Input
                    type="color"
                    className="w-12 p-1 h-10"
                    value={field.value || "#000000"}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </div>
                {property.description && <FormDescription>{property.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      case PropertyType.SELECT:
        return (
          <FormField
            key={property.id}
            control={form.control}
            name={property.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{property.label}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {property.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {property.description && <FormDescription>{property.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case PropertyType.IMAGE:
        return (
          <FormField
            key={property.id}
            control={form.control}
            name={property.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{property.label}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                {property.description && <FormDescription>{property.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case PropertyType.OPTION_SCORE:
        return (
          <FormField
            key={property.id}
            control={form.control}
            name={property.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{property.label}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value === undefined ? "" : field.value}
                  />
                </FormControl>
                {property.description && <FormDescription>{property.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case PropertyType.OPTION_CATEGORY:
        return (
          <FormField
            key={property.id}
            control={form.control}
            name={property.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{property.label}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                {property.description && <FormDescription>{property.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      default:
        return null;
    }
  };

  // Renderizar as abas somente se houver propriedades nas respectivas categorias
  const hasBasicProperties = basicProperties.length > 0;
  const hasStyleProperties = styleProperties.length > 0;
  const hasAdvancedProperties = advancedProperties.length > 0;
  const hasQuizProperties = quizProperties.length > 0;

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
              {hasBasicProperties && <TabsTrigger value="basic">Básico</TabsTrigger>}
              {hasStyleProperties && <TabsTrigger value="style">Estilo</TabsTrigger>}
              {hasQuizProperties && <TabsTrigger value="quiz">Quiz</TabsTrigger>}
              {hasAdvancedProperties && <TabsTrigger value="advanced">Avançado</TabsTrigger>}
            </TabsList>
            
            {hasBasicProperties && (
              <TabsContent value="basic" className="space-y-4 pt-4">
                {basicProperties.map(renderField)}
              </TabsContent>
            )}
            
            {hasStyleProperties && (
              <TabsContent value="style" className="space-y-4 pt-4">
                {styleProperties.map(renderField)}
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
