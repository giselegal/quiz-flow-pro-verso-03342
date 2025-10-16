/**
 * 🎨 SCHEMA DE VALIDAÇÃO - STEP 01 (INTRODUÇÃO)
 * 
 * Schema centralizado Zod para validação de dados do Step-01
 * Compatível com os componentes modulares IntroStep01_*
 * 
 * @module schemas/step01Schema
 * @version 1.0.0
 */

import { z } from 'zod';

// ============================================================================
// SCHEMAS AUXILIARES
// ============================================================================

const colorSchema = z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve estar no formato #RRGGBB');
const urlSchema = z.string().url('URL inválida').or(z.literal(''));
const positiveNumberSchema = z.number().min(0, 'Deve ser um número positivo');

// ============================================================================
// SCHEMA: HEADER
// ============================================================================

export const introStep01HeaderSchema = z.object({
    // Logo
    logoUrl: urlSchema.optional(),
    logoAlt: z.string().default('Logo'),
    logoWidth: positiveNumberSchema.default(96),
    logoHeight: positiveNumberSchema.default(96),
    
    // Back Button
    showBackButton: z.boolean().default(false),
    backButtonText: z.string().default('← Voltar'),
    backButtonColor: colorSchema.optional(),
    
    // Progress Bar
    showProgressBar: z.boolean().default(true),
    progressValue: z.number().min(0).max(100).default(0),
    progressColor: colorSchema.default('#B89B7A'),
    progressBgColor: colorSchema.default('#E5E7EB'),
});

export type IntroStep01HeaderData = z.infer<typeof introStep01HeaderSchema>;

// ============================================================================
// SCHEMA: TITLE
// ============================================================================

export const introStep01TitleSchema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    titleColor: colorSchema.default('#432818'),
    titleAccentColor: colorSchema.optional(),
    titleSize: z.number().min(16).max(72).default(32),
    titleAlign: z.enum(['left', 'center', 'right']).default('center'),
    titleWeight: z.enum(['normal', 'bold', 'semibold', 'extrabold']).default('bold'),
});

export type IntroStep01TitleData = z.infer<typeof introStep01TitleSchema>;

// ============================================================================
// SCHEMA: IMAGE
// ============================================================================

export const introStep01ImageSchema = z.object({
    imageUrl: urlSchema,
    imageAlt: z.string().default('Imagem'),
    imageMaxWidth: positiveNumberSchema.default(300),
    imageMaxHeight: positiveNumberSchema.default(300),
    showShadow: z.boolean().default(true),
    shadowColor: z.string().default('rgba(0, 0, 0, 0.1)'),
    borderRadius: positiveNumberSchema.default(12),
});

export type IntroStep01ImageData = z.infer<typeof introStep01ImageSchema>;

// ============================================================================
// SCHEMA: DESCRIPTION
// ============================================================================

export const introStep01DescriptionSchema = z.object({
    description: z.string().min(1, 'Descrição é obrigatória'),
    descriptionColor: colorSchema.default('#6B7280'),
    descriptionSize: z.number().min(12).max(32).default(16),
    descriptionAlign: z.enum(['left', 'center', 'right']).default('center'),
    descriptionLineHeight: z.number().min(1).max(3).default(1.6),
});

export type IntroStep01DescriptionData = z.infer<typeof introStep01DescriptionSchema>;

// ============================================================================
// SCHEMA: FORM
// ============================================================================

export const introStep01FormSchema = z.object({
    // Question
    formQuestion: z.string().min(1, 'Pergunta do formulário é obrigatória'),
    formQuestionColor: colorSchema.default('#1F2937'),
    formQuestionSize: z.number().min(12).max(32).default(18),
    
    // Input
    inputPlaceholder: z.string().default('Digite seu primeiro nome aqui...'),
    inputLabel: z.string().default('NOME'),
    inputBgColor: colorSchema.default('#F9FAFB'),
    inputBorderColor: colorSchema.default('#D1D5DB'),
    inputTextColor: colorSchema.default('#1F2937'),
    
    // Button
    buttonText: z.string().min(1, 'Texto do botão é obrigatório'),
    buttonColor: colorSchema.default('#B89B7A'),
    buttonTextColor: colorSchema.default('#FFFFFF'),
    buttonHoverColor: colorSchema.optional(),
    
    // Validation
    required: z.boolean().default(true),
    minLength: z.number().min(1).default(2),
    maxLength: z.number().min(1).default(50),
    pattern: z.string().optional(),
    errorMessage: z.string().default('Por favor, digite seu nome'),
});

export type IntroStep01FormData = z.infer<typeof introStep01FormSchema>;

// ============================================================================
// SCHEMA: MAIN (COMPLETO)
// ============================================================================

export const introStep01MainSchema = z.object({
    // Background
    backgroundColor: colorSchema.default('#FAF9F7'),
    backgroundImage: urlSchema.optional(),
    minHeight: z.string().default('100vh'),
    padding: z.string().default('2rem'),
    
    // Header
    ...introStep01HeaderSchema.shape,
    
    // Title
    ...introStep01TitleSchema.shape,
    
    // Image
    ...introStep01ImageSchema.shape,
    
    // Description
    ...introStep01DescriptionSchema.shape,
    
    // Form
    ...introStep01FormSchema.shape,
    
    // Advanced
    customCSS: z.string().optional(),
    customJS: z.string().optional(),
});

export type IntroStep01MainData = z.infer<typeof introStep01MainSchema>;

// ============================================================================
// VALORES PADRÃO (DEFAULT)
// ============================================================================

export const introStep01DefaultData: IntroStep01MainData = {
    // Background
    backgroundColor: '#FAF9F7',
    minHeight: '100vh',
    padding: '2rem',
    
    // Header
    logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
    logoAlt: 'Logo Gisele Galvão',
    logoWidth: 96,
    logoHeight: 96,
    showBackButton: false,
    backButtonText: '← Voltar',
    showProgressBar: true,
    progressValue: 5,
    progressColor: '#B89B7A',
    progressBgColor: '#E5E7EB',
    
    // Title
    title: '<span style="color: #B89B7A; font-weight: 700;">Chega</span> de um guarda-roupa lotado e da sensação de que <span style="color: #B89B7A; font-weight: 700;">nada combina com você</span>.',
    titleColor: '#432818',
    titleAccentColor: '#B89B7A',
    titleSize: 32,
    titleAlign: 'center',
    titleWeight: 'bold',
    
    // Image
    imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.png',
    imageAlt: 'Descubra seu estilo predominante',
    imageMaxWidth: 300,
    imageMaxHeight: 204,
    showShadow: true,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    
    // Description
    description: 'Em poucos minutos, descubra seu <strong style="color: #B89B7A;">Estilo Predominante</strong> — e aprenda a montar looks que realmente refletem sua <strong style="color: #432818;">essência</strong>.',
    descriptionColor: '#6B7280',
    descriptionSize: 16,
    descriptionAlign: 'center',
    descriptionLineHeight: 1.6,
    
    // Form
    formQuestion: 'Como posso te chamar?',
    formQuestionColor: '#1F2937',
    formQuestionSize: 18,
    inputPlaceholder: 'Digite seu primeiro nome aqui...',
    inputLabel: 'NOME',
    inputBgColor: '#F9FAFB',
    inputBorderColor: '#D1D5DB',
    inputTextColor: '#1F2937',
    buttonText: 'Quero Descobrir meu Estilo Agora!',
    buttonColor: '#B89B7A',
    buttonTextColor: '#FFFFFF',
    required: true,
    minLength: 2,
    maxLength: 50,
    errorMessage: 'Por favor, digite seu nome',
};

// ============================================================================
// FUNÇÕES DE VALIDAÇÃO
// ============================================================================

/**
 * Valida os dados do Step-01
 * @param data Dados a serem validados
 * @returns Resultado da validação
 */
export function validateIntroStep01Data(data: unknown) {
    return introStep01MainSchema.safeParse(data);
}

/**
 * Valida e retorna os dados com valores padrão
 * @param data Dados parciais
 * @returns Dados completos e validados
 */
export function normalizeIntroStep01Data(data: Partial<IntroStep01MainData>): IntroStep01MainData {
    const result = introStep01MainSchema.safeParse({
        ...introStep01DefaultData,
        ...data,
    });
    
    if (!result.success) {
        console.warn('⚠️ Erros na validação do Step-01:', result.error.errors);
        return introStep01DefaultData;
    }
    
    return result.data;
}

/**
 * Valida apenas um campo específico
 * @param field Nome do campo
 * @param value Valor do campo
 * @returns true se válido, mensagem de erro se inválido
 */
export function validateIntroStep01Field(
    field: keyof IntroStep01MainData,
    value: unknown
): true | string {
    const fieldSchema = introStep01MainSchema.shape[field];
    
    if (!fieldSchema) {
        return 'Campo desconhecido';
    }
    
    const result = fieldSchema.safeParse(value);
    
    if (result.success) {
        return true;
    }
    
    return result.error.errors[0]?.message || 'Valor inválido';
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
    headerSchema: introStep01HeaderSchema,
    titleSchema: introStep01TitleSchema,
    imageSchema: introStep01ImageSchema,
    descriptionSchema: introStep01DescriptionSchema,
    formSchema: introStep01FormSchema,
    mainSchema: introStep01MainSchema,
    defaultData: introStep01DefaultData,
    validate: validateIntroStep01Data,
    normalize: normalizeIntroStep01Data,
    validateField: validateIntroStep01Field,
};
