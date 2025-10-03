/**
 * 📝 TIPOS ESPECÍFICOS DO STEP 1 - INTRODUÇÃO
 * 
 * Definições de tipos utilizados exclusivamente no Step 1.
 */

// Dados salvos do Step 1
export interface Step01Data {
    userName: string;
    completedAt: string;
    stepId: 'step-01';
    metadata?: {
        userAgent?: string;
        timestamp?: number;
        sessionId?: string;
    };
}

// Configuração visual do Step 1
export interface Step01Config {
    header: {
        title: string;
        logo: string;
        showGoldenBar: boolean;
    };
    image: {
        src: string;
        alt: string;
        maxWidth: number;
        maxHeight: number;
    };
    form: {
        question: string;
        placeholder: string;
        buttonText: string;
        minLength: number;
        required: boolean;
    };
    colors: {
        primary: string;
        secondary: string;
        accent: string;
    };
}

// Props específicas do Step 1
export interface Step01Props {
    config?: Partial<Step01Config>;
    onComplete?: (data: Step01Data) => void;
    theme?: 'default' | 'light' | 'dark';
}

// Estado interno do Step 1
export interface Step01State {
    userName: string;
    isValid: boolean;
    isSubmitting: boolean;
    hasInteracted: boolean;
    startTime: number;
    validationErrors: string[];
}

// Eventos do Step 1
export type Step01Events =
    | { type: 'USER_NAME_CHANGED'; payload: string }
    | { type: 'FORM_SUBMITTED'; payload: Step01Data }
    | { type: 'VALIDATION_ERROR'; payload: string[] }
    | { type: 'STEP_COMPLETED'; payload: Step01Data };

// Resultado da validação
export interface Step01ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}