/**
 * Hook para gerenciar formulários de blocos com validação
 *
 * Integra React Hook Form com Zod para validação tipada
 */

import { blockSchemas, BlockType, safeValidateBlockData } from "@/schemas/blockSchemas";
import { PerformanceOptimizer } from "@/utils/performanceOptimizer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

export interface Block {
  id: string;
  type: string;
  properties: Record<string, any>;
  hidden?: boolean;
  locked?: boolean;
}

interface UseBlockFormOptions {
  onUpdate?: (updates: Partial<Block>) => void;
  debounceMs?: number;
  validateOnChange?: boolean;
}

interface UseBlockFormReturn {
  form: UseFormReturn<any>;
  updateProperty: (key: string, value: any) => void;
  updateProperties: (updates: Record<string, any>) => void;
  validateBlock: () => boolean;
  errors: Record<string, string>;
  isValid: boolean;
  isDirty: boolean;
  reset: () => void;
}

/**
 * Hook principal para gerenciar formulários de blocos
 */
export function useBlockForm(
  block: Block | null,
  options: UseBlockFormOptions = {}
): UseBlockFormReturn {
  const { onUpdate, debounceMs = 300, validateOnChange = true } = options;

  // Determina o schema baseado no tipo do bloco
  const schema =
    block?.type && block.type in blockSchemas
      ? blockSchemas[block.type as BlockType]
      : z.record(z.unknown());

  // Configura o formulário com React Hook Form
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: block?.properties || {},
    mode: validateOnChange ? "onChange" : "onBlur",
  });

  const { watch, setValue, reset, formState } = form;
  const { errors, isValid, isDirty } = formState;

  // Reseta o formulário quando o bloco muda
  useEffect(() => {
    if (block?.properties) {
      reset(block.properties);
    }
  }, [block?.id, reset]);

  // Watch para mudanças e debounce das atualizações - OTIMIZADO
  useEffect(() => {
    if (!block || !onUpdate) return;

    const subscription = watch(values => {
      // 🚀 OTIMIZAÇÃO: Usar PerformanceOptimizer ao invés de setTimeout
      const strategy = PerformanceOptimizer.getSuggestedStrategy(debounceMs, true);

      PerformanceOptimizer.schedule(
        () => {
          if (isDirty) {
            onUpdate({
              properties: values as Record<string, any>,
            });
          }
        },
        debounceMs,
        strategy
      );
    });

    return () => subscription.unsubscribe();
  }, [watch, block, onUpdate, debounceMs, isDirty]);

  // Função para atualizar uma propriedade específica
  const updateProperty = useCallback(
    (key: string, value: any) => {
      setValue(key, value, {
        shouldValidate: validateOnChange,
        shouldDirty: true,
      });
    },
    [setValue, validateOnChange]
  );

  // Função para atualizar múltiplas propriedades
  const updateProperties = useCallback(
    (updates: Record<string, any>) => {
      Object.entries(updates).forEach(([key, value]) => {
        setValue(key, value, {
          shouldValidate: validateOnChange,
          shouldDirty: true,
        });
      });
    },
    [setValue, validateOnChange]
  );

  // Função para validar o bloco manualmente
  const validateBlock = useCallback(() => {
    if (!block) return false;

    const result = safeValidateBlockData(block.type as BlockType, form.getValues());

    return result.success;
  }, [block, form]);

  // Converte erros do formulário para formato simples
  const flatErrors = Object.entries(errors).reduce(
    (acc, [key, error]) => {
      if (error && typeof error === "object" && "message" in error && error.message) {
        acc[key] = error.message as string;
      }
      return acc;
    },
    {} as Record<string, string>
  );

  return {
    form,
    updateProperty,
    updateProperties,
    validateBlock,
    errors: flatErrors,
    isValid,
    isDirty,
    reset: () => reset(),
  };
}

/**
 * Hook específico para formulários de array (como opções de quiz)
 */
export function useArrayFieldForm<T extends Record<string, any>>(
  initialItems: T[] = [],
  itemSchema: z.ZodSchema<T>,
  options: {
    onUpdate?: (updates: { items: T[] }) => void;
    debounceMs?: number;
  } = {}
) {
  const { onUpdate, debounceMs = 300 } = options;

  const arraySchema = z.object({
    items: z.array(itemSchema),
  });

  const form = useForm({
    resolver: zodResolver(arraySchema),
    defaultValues: { items: initialItems },
    mode: "onChange",
  });

  const { watch, setValue, getValues } = form;

  // Watch para mudanças - OTIMIZADO
  useEffect(() => {
    if (!onUpdate) return;

    const subscription = watch(values => {
      // 🚀 OTIMIZAÇÃO: Usar PerformanceOptimizer ao invés de setTimeout
      const strategy = PerformanceOptimizer.getSuggestedStrategy(debounceMs, true);

      PerformanceOptimizer.schedule(
        () => {
          if (values.items) {
            onUpdate({ items: values.items as T[] });
          }
        },
        debounceMs,
        strategy
      );
    });

    return () => subscription.unsubscribe();
  }, [watch, onUpdate, debounceMs]);

  const addItem = useCallback(
    (item: T) => {
      const currentItems = getValues("items");
      setValue("items", [...currentItems, item], {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue, getValues]
  );

  const removeItem = useCallback(
    (index: number) => {
      const currentItems = getValues("items");
      setValue(
        "items",
        currentItems.filter((_, i) => i !== index),
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
    },
    [setValue, getValues]
  );

  const updateItem = useCallback(
    (index: number, updates: Partial<T>) => {
      const currentItems = getValues("items");
      const updatedItems = currentItems.map((item, i) =>
        i === index ? { ...item, ...updates } : item
      );
      setValue("items", updatedItems, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue, getValues]
  );

  const moveItem = useCallback(
    (fromIndex: number, toIndex: number) => {
      const currentItems = getValues("items");
      const newItems = [...currentItems];
      const [removed] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, removed);

      setValue("items", newItems, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue, getValues]
  );

  return {
    form,
    addItem,
    removeItem,
    updateItem,
    moveItem,
    items: watch("items"),
  };
}

/**
 * Hook para validação em tempo real
 */
export function useBlockValidation(block: Block | null) {
  const validateNow = useCallback(() => {
    if (!block) return { isValid: false, errors: [] };

    const result = safeValidateBlockData(block.type as BlockType, block.properties);

    if (result.success) {
      return { isValid: true, errors: [] };
    } else {
      const errors =
        "errors" in result.error ? result.error.errors : [{ message: result.error.message }];
      return {
        isValid: false,
        errors,
      };
    }
  }, [block]);

  return { validateNow };
}

/**
 * Helper para criar valores padrão de um bloco
 */
export function getDefaultBlockValues(blockType: BlockType): Record<string, any> {
  const schema = blockSchemas[blockType];
  if (!schema) return {};

  // Usa o parse com objeto vazio para obter defaults do schema
  try {
    return schema.parse({});
  } catch {
    // Se falhar, retorna defaults manuais baseados no tipo
    switch (blockType) {
      case "text":
        return {
          content: "Novo texto",
          fontSize: 16,
          textColor: "#000000",
          textAlign: "left",
        };
      case "rich-text":
        return {
          content: "<p>Novo texto rico</p>",
          minHeight: 100,
        };
      case "button":
        return {
          text: "Clique aqui",
          link: "",
          backgroundColor: "#3b82f6",
          textColor: "#ffffff",
          paddingX: 16,
          paddingY: 8,
          borderRadius: 6,
          fullWidth: false,
        };
      case "quiz-step":
        return {
          headerEnabled: true,
          questionText: "Sua pergunta aqui",
          questionTextColor: "#000000",
          questionTextSize: 24,
          questionTextAlign: "center",
          layout: "2-columns",
          direction: "vertical",
          disposition: "image-text",
          options: [],
          isMultipleChoice: false,
          isRequired: true,
          autoProceed: false,
          borderRadius: "medium",
          boxShadow: "medium",
          spacing: "medium",
          detail: "none",
          optionStyle: "card",
          primaryColor: "#3b82f6",
          secondaryColor: "#ffffff",
          borderColor: "#e5e7eb",
          maxWidth: 100,
        };
      default:
        return {};
    }
  }
}
