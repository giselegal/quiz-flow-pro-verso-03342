/**
 * 🎯 INTERFACES BASE PARA SISTEMA DE STEPS MODULARES
 * 
 * Define contratos padronizados que todos os steps devem seguir
 * para garantir consistência e intercambiabilidade.
 */

import { ReactComponentElement, ComponentType } from 'react';

// Interface base que todos os steps recebem como props
export interface BaseStepProps {
    stepId: string;           // 'step-01', 'step-02', etc.
    stepNumber: number;       // 1, 2, 3, etc.
    isActive: boolean;        // Se é o step atual
    isEditable: boolean;      // Se está no modo de edição
    onNext: () => void;       // Navegar para próximo step
    onPrevious: () => void;   // Navegar para step anterior  
    onSave: (data: any) => void; // Salvar dados do step
    data?: any;               // Dados salvos do step
    funnelId?: string;        // ID do funil (opcional)
}

// Regras de validação para um step
export interface ValidationRule {
    field: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    message?: string;
}

// Configuração de um step
export interface StepConfig {
    // Navegação
    allowNavigation: {
        next: boolean;
        previous: boolean;
    };

    // Validação
    validation: {
        required: boolean;
        rules?: ValidationRule[];
    };

    // Pontuação (para steps de pergunta)
    scoring?: {
        enabled: boolean;
        categories: string[];
    };

    // Metadata
    metadata?: {
        description?: string;
        category?: 'intro' | 'question' | 'strategic' | 'transition' | 'result' | 'offer';
        estimatedTime?: number; // em segundos
    };
}

// Componente de step registrado no sistema
export interface StepComponent {
    id: string;                                    // 'step-01'
    name: string;                                  // 'Introdução'
    component: ComponentType<BaseStepProps>;       // Componente React
    config: StepConfig;                           // Configuração do step
}

// Dados de estado específicos de um step
export interface StepData {
    stepId: string;
    data: any;
    isComplete: boolean;
    lastModified: Date;
    version: string;
}

// Contexto global compartilhado entre steps
export interface StepContext {
    // Estado do quiz
    quizState: {
        currentStepId: string;
        userData: Record<string, any>;
        answers: Record<string, any>;
        scores: Record<string, number>;
        result?: any;
    };

    // Ações globais
    actions: {
        navigateToStep: (stepId: string) => void;
        saveStepData: (stepId: string, data: any) => void;
        updateUserData: (data: Record<string, any>) => void;
        calculateResult: () => void;
    };

    // Configurações
    config: {
        funnelId?: string;
        isEditable: boolean;
        theme?: Record<string, any>;
    };
}
