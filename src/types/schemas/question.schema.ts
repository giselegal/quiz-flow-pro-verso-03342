// src/schemas/question.schema.ts
import { z } from 'zod';
import { OptionSchema } from './option';

export const QuestionStepSchema = z
  .object({
    schemaVersion: z.number().int().default(1),
    question: z.string().min(1, 'Question text is required'),
    multiSelect: z.boolean().optional().default(false),
    requiredSelections: z.number().int().nonnegative().optional().default(1),
    maxSelections: z.number().int().positive().optional().default(1),
    autoAdvance: z.boolean().optional().default(true),
    showNextButton: z.boolean().optional().default(true),
    nextButtonText: z.string().optional().default('Avançar'),
    layout: z.enum(['auto', 'grid-2', 'grid-3', 'list']).default('auto'),
    showImages: z.boolean().optional().default(true),
    options: z.array(OptionSchema).min(1, 'At least one option required'),
  })
  .superRefine((data, ctx) => {
    if (data.requiredSelections > data.maxSelections) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '`requiredSelections` cannot be greater than `maxSelections`',
        path: ['requiredSelections'],
      });
    }
    // Garantir que requiredSelections e maxSelections não ultrapassem o número de opções
    const optionsLength = Array.isArray(data.options) ? data.options.length : 0;
    if (data.requiredSelections > optionsLength) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '`requiredSelections` cannot exceed number of options',
        path: ['requiredSelections'],
      });
    }
    if (data.maxSelections > optionsLength) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '`maxSelections` cannot exceed number of options',
        path: ['maxSelections'],
      });
    }
  });

export type QuestionStepProps = z.infer<typeof QuestionStepSchema>;
