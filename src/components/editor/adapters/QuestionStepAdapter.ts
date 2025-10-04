/**
 * ❓ QUESTION STEP ADAPTER
 * 
 * Adaptador para isolar QuestionStep de produção do editor.
 * Resolve acoplamento e permite edição independente.
 */

import React from 'react';
import { createAdapter } from './ComponentAdapterRegistry';
import type { EditorStep } from '../types/EditorStepTypes';
import QuestionStep from '../../quiz/QuestionStep';

// 🎯 Props do componente de produção
interface QuestionStepProps {
    data: any;
    onAnswerSelect: (answers: string[]) => void;
    selectedAnswers: string[];
}

// 🔧 Adaptador para QuestionStep
export const questionStepAdapter = createAdapter<QuestionStepProps>({
    type: 'question',
    component: QuestionStep,

    // 🔄 Transformar dados do editor para props de produção
    transformProps: (step: EditorStep) => ({
        data: step.data,
        selectedAnswers: [], // Estado mock para edição
        onAnswerSelect: () => { } // Mock será substituído
    }),

    // 🎭 Mocks para callbacks de produção
    mockCallbacks: (step: EditorStep) => ({
        onAnswerSelect: (answers: string[]) => {
            console.log(`[EDITOR MOCK] QuestionStep.onAnswerSelect called with:`, answers);
            // Simular seleção visual sem afetar quiz real
        }
    }),

    // ✅ Validação específica do tipo
    validateProps: (step: EditorStep) => {
        const errors: string[] = [];

        if (!step.data.title) {
            errors.push('Pergunta é obrigatória');
        }

        if (!step.data.options || step.data.options.length < 2) {
            errors.push('Pelo menos 2 opções são obrigatórias');
        }

        if (step.data.options?.some((opt: any) => !opt.text)) {
            errors.push('Todas as opções devem ter texto');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // 📤 Extrair dados para produção
    extractData: (props: QuestionStepProps) => ({
        title: props.data.title,
        subtitle: props.data.subtitle,
        options: props.data.options,
        allowMultiple: props.data.allowMultiple || false,
        required: props.data.required || true
    })
});