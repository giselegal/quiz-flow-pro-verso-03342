/**
 * Schemas de Validação para Blocos do Editor
 *
 * Define as validações Zod para todos os tipos de blocos
 */

import { z } from 'zod';

// Tipos comuns
const colorSchema = z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve estar no formato #RRGGBB');
const urlSchema = z.string().url('URL inválida').or(z.literal(''));
const positiveNumberSchema = z.number().min(0, 'Deve ser um número positivo');

// =====================================================================
// SCHEMAS BÁSICOS
// =====================================================================

export const textBlockSchema = z.object({
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  fontSize: z.number().min(8, 'Tamanho mínimo: 8px').max(72, 'Tamanho máximo: 72px'),
  textColor: colorSchema,
  textAlign: z.enum(['left', 'center', 'right'], {
    errorMap: () => ({ message: 'Alinhamento deve ser left, center ou right' }),
  }),
});

export const richTextBlockSchema = z.object({
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  minHeight: z.number().min(50, 'Altura mínima: 50px').max(500, 'Altura máxima: 500px'),
  placeholder: z.string().optional(),
});

export const headerBlockSchema = z.object({
  content: z.string().min(1, 'Título é obrigatório'),
  level: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  fontSize: z.number().min(12, 'Tamanho mínimo: 12px').max(96, 'Tamanho máximo: 96px'),
  textColor: colorSchema,
  textAlign: z.enum(['left', 'center', 'right']),
  fontWeight: z.enum(['normal', 'bold', 'lighter', 'bolder']).optional(),
});

export const buttonBlockSchema = z.object({
  text: z.string().min(1, 'Texto do botão é obrigatório'),
  link: urlSchema,
  backgroundColor: colorSchema,
  textColor: colorSchema,
  paddingX: positiveNumberSchema,
  paddingY: positiveNumberSchema,
  borderRadius: positiveNumberSchema,
  fullWidth: z.boolean(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
  variant: z.enum(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']).optional(),
});

export const imageBlockSchema = z.object({
  src: z.string().url('URL da imagem é obrigatória'),
  alt: z.string().min(1, 'Texto alternativo é obrigatório'),
  width: z.number().min(1, 'Largura deve ser maior que 0').optional(),
  height: z.number().min(1, 'Altura deve ser maior que 0').optional(),
  borderRadius: positiveNumberSchema.optional(),
  objectFit: z.enum(['contain', 'cover', 'fill', 'none', 'scale-down']).optional(),
});

export const spacerBlockSchema = z.object({
  height: z.number().min(1, 'Altura mínima: 1px').max(200, 'Altura máxima: 200px'),
  backgroundColor: z.string().optional(),
  borderStyle: z.enum(['none', 'solid', 'dashed', 'dotted']),
  borderColor: colorSchema.optional(),
  borderWidth: positiveNumberSchema.optional(),
});

// =====================================================================
// SCHEMAS DE QUIZ
// =====================================================================

export const quizOptionSchema = z.object({
  id: z.string().min(1, 'ID da opção é obrigatório'),
  text: z.string().min(1, 'Texto da opção é obrigatório'),
  imageUrl: urlSchema.optional(),
  nextStepId: z.string().optional(),
  value: z.string().optional(),
  isCorrect: z.boolean().optional(),
});

export const quizStepBlockSchema = z.object({
  // Header
  headerEnabled: z.boolean(),
  logoUrl: urlSchema.optional(),
  showProgressBar: z.boolean(),
  showBackButton: z.boolean(),

  // Question
  questionText: z.string().min(1, 'Texto da pergunta é obrigatório'),
  questionTextColor: colorSchema,
  questionTextSize: z.number().min(12, 'Tamanho mínimo: 12px').max(48, 'Tamanho máximo: 48px'),
  questionTextAlign: z.enum(['left', 'center', 'right']),

  // Layout
  layout: z.enum(['1-column', '2-columns', '3-columns', '4-columns']),
  direction: z.enum(['vertical', 'horizontal']),
  disposition: z.enum(['image-text', 'text-image', 'text-only', 'image-only']),

  // Options
  options: z.array(quizOptionSchema).min(2, 'Deve ter pelo menos 2 opções'),

  // Validation
  isMultipleChoice: z.boolean(),
  isRequired: z.boolean(),
  autoProceed: z.boolean(),
  minSelections: z.number().min(0).optional(),
  maxSelections: z.number().min(1).optional(),

  // Styling
  borderRadius: z.enum(['none', 'small', 'medium', 'large']),
  boxShadow: z.enum(['none', 'small', 'medium', 'large']),
  spacing: z.enum(['small', 'medium', 'large']),
  detail: z.enum(['none', 'line', 'dot']),
  optionStyle: z.enum(['simple', 'card']),

  // Colors
  primaryColor: colorSchema,
  secondaryColor: colorSchema,
  borderColor: colorSchema,

  // Advanced
  componentId: z.string().optional(),
  maxWidth: z.number().min(10, 'Largura mínima: 10%').max(100, 'Largura máxima: 100%'),
});

export const quizIntroBlockSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  startButtonText: z.string().min(1, 'Texto do botão é obrigatório'),
  imageUrl: urlSchema.optional(),
  backgroundColor: colorSchema.optional(),
  textColor: colorSchema.optional(),
});

export const quizProgressBlockSchema = z.object({
  currentStep: z.number().min(1, 'Passo atual deve ser maior que 0'),
  totalSteps: z.number().min(1, 'Total de passos deve ser maior que 0'),
  showNumbers: z.boolean(),
  showPercentage: z.boolean(),
  progressColor: colorSchema,
  backgroundColor: colorSchema,
  borderRadius: positiveNumberSchema.optional(),
});

// =====================================================================
// MAPEAMENTO DE SCHEMAS
// =====================================================================

export const blockSchemas = {
  // Básicos
  text: textBlockSchema,
  'rich-text': richTextBlockSchema,
  header: headerBlockSchema,
  heading: headerBlockSchema, // Alias
  button: buttonBlockSchema,
  image: imageBlockSchema,
  spacer: spacerBlockSchema,

  // Quiz
  'quiz-step': quizStepBlockSchema,
  'quiz-intro': quizIntroBlockSchema,
  'quiz-progress': quizProgressBlockSchema,
  'quiz-question': quizStepBlockSchema, // Usa o mesmo schema
} as const;

export type BlockType = keyof typeof blockSchemas;

// Tipos inferidos dos schemas
export type TextBlockData = z.infer<typeof textBlockSchema>;
export type RichTextBlockData = z.infer<typeof richTextBlockSchema>;
export type HeaderBlockData = z.infer<typeof headerBlockSchema>;
export type ButtonBlockData = z.infer<typeof buttonBlockSchema>;
export type ImageBlockData = z.infer<typeof imageBlockSchema>;
export type SpacerBlockData = z.infer<typeof spacerBlockSchema>;
export type QuizStepBlockData = z.infer<typeof quizStepBlockSchema>;
export type QuizIntroBlockData = z.infer<typeof quizIntroBlockSchema>;
export type QuizProgressBlockData = z.infer<typeof quizProgressBlockSchema>;
export type QuizOptionData = z.infer<typeof quizOptionSchema>;

// Helper para validar um bloco
export function validateBlockData(blockType: BlockType, data: unknown) {
  const schema = blockSchemas[blockType];
  if (!schema) {
    throw new Error(`Schema não encontrado para o tipo de bloco: ${blockType}`);
  }
  return schema.parse(data);
}

// Helper para validação segura (retorna erro em vez de throw)
export function safeValidateBlockData(blockType: BlockType, data: unknown) {
  const schema = blockSchemas[blockType];
  if (!schema) {
    return {
      success: false as const,
      error: {
        message: `Schema não encontrado para o tipo de bloco: ${blockType}`,
      },
    };
  }
  return schema.safeParse(data);
}

// Schema para propriedades comuns de todos os blocos
export const baseBlockSchema = z.object({
  id: z.string().min(1, 'ID do bloco é obrigatório'),
  type: z.string().min(1, 'Tipo do bloco é obrigatório'),
  properties: z.record(z.unknown()),
  hidden: z.boolean().optional(),
  locked: z.boolean().optional(),
  className: z.string().optional(),
  style: z.record(z.unknown()).optional(),
});

export type BaseBlockData = z.infer<typeof baseBlockSchema>;
