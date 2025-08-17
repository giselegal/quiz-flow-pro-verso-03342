import { ValidationProps } from '@/types/editor';
import { z } from 'zod';

// Schemas de validação para diferentes tipos de blocos
const textBlockSchema = z.object({
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  fontSize: z.number().optional(),
  fontWeight: z.number().optional(),
  textAlign: z.enum(['left', 'center', 'right', 'justify']).optional(),
  color: z.string().optional(),
});

const buttonBlockSchema = z.object({
  text: z.string().min(1, 'Texto do botão é obrigatório'),
  action: z.string().min(1, 'Ação do botão é obrigatória'),
  style: z.enum(['primary', 'secondary', 'outline']).optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
  disabled: z.boolean().optional(),
});

const imageBlockSchema = z.object({
  src: z.string().min(1, 'URL da imagem é obrigatória'),
  alt: z.string().min(1, 'Texto alternativo é obrigatório'),
  width: z.number().optional(),
  height: z.number().optional(),
  fit: z.enum(['cover', 'contain', 'fill']).optional(),
});

const optionsGridSchema = z.object({
  options: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        value: z.string(),
        image: z.string().optional(),
      })
    )
    .min(1, 'Pelo menos uma opção é necessária'),
  columns: z.number().min(1).max(4).optional(),
  showImages: z.boolean().optional(),
  selectionType: z.enum(['single', 'multiple']).optional(),
  maxSelections: z.number().optional(),
  minSelections: z.number().optional(),
});

// Mapa de schemas por tipo de bloco
export const blockSchemas: Record<string, z.ZodSchema> = {
  text: textBlockSchema,
  button: buttonBlockSchema,
  image: imageBlockSchema,
  'options-grid': optionsGridSchema,
};

// Função de validação genérica
export function validateBlock({ type, properties }: ValidationProps) {
  const schema = blockSchemas[type];
  if (!schema) {
    console.warn(`No validation schema found for block type: ${type}`);
    return { success: true };
  }

  try {
    schema.parse(properties);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      errors: [{ path: '', message: 'Erro de validação desconhecido' }],
    };
  }
}

// Validadores específicos por campo
export const fieldValidators = {
  required: (value: any) => {
    if (value === undefined || value === null || value === '') {
      return 'Este campo é obrigatório';
    }
    return null;
  },

  minLength: (value: string, min: number) => {
    if (value.length < min) {
      return `Mínimo de ${min} caracteres`;
    }
    return null;
  },

  maxLength: (value: string, max: number) => {
    if (value.length > max) {
      return `Máximo de ${max} caracteres`;
    }
    return null;
  },

  pattern: (value: string, pattern: RegExp, message: string) => {
    if (!pattern.test(value)) {
      return message;
    }
    return null;
  },

  number: (value: any) => {
    if (isNaN(Number(value))) {
      return 'Valor deve ser um número';
    }
    return null;
  },

  url: (value: string) => {
    try {
      new URL(value);
      return null;
    } catch {
      return 'URL inválida';
    }
  },

  color: (value: string) => {
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
      return 'Cor inválida (use formato hexadecimal)';
    }
    return null;
  },
};

// Validador de schema completo do editor
export function validateEditorSchema(blocks: any[]) {
  const errors: any[] = [];

  blocks.forEach((block, index) => {
    const validation = validateBlock(block);
    if (!validation.success) {
      errors.push({
        blockIndex: index,
        blockId: block.id,
        blockType: block.type,
        errors: validation.errors,
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validador de estrutura de dados do editor
export function validateEditorStructure(data: any) {
  const requiredKeys = ['blocks', 'version', 'metadata'];
  const missingKeys = requiredKeys.filter(key => !(key in data));

  if (missingKeys.length > 0) {
    return {
      isValid: false,
      errors: [
        {
          message: `Campos obrigatórios faltando: ${missingKeys.join(', ')}`,
        },
      ],
    };
  }

  if (!Array.isArray(data.blocks)) {
    return {
      isValid: false,
      errors: [
        {
          message: 'A propriedade "blocks" deve ser um array',
        },
      ],
    };
  }

  // Validar cada bloco
  const blockValidation = validateEditorSchema(data.blocks);

  return {
    isValid: blockValidation.isValid,
    errors: blockValidation.errors,
  };
}
