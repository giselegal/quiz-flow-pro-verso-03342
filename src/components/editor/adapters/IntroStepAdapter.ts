/**
 * 🎭 INTRO STEP ADAPTER
 * 
 * Adaptador para isolar IntroStep de produção do editor.
 * Resolve acoplamento e permite edição independente.
 */

import React from 'react';
import { createAdapter } from './ComponentAdapterRegistry';
import type { EditorStep } from '../types/EditorStepTypes';
import IntroStep from '../../quiz/IntroStep';

// 🎯 Props do componente de produção
interface IntroStepProps {
    data: any;
    onNameSubmit: (name: string) => void;
}

// 🔧 Adaptador para IntroStep
export const introStepAdapter = createAdapter<IntroStepProps>({
    type: 'intro',
    component: IntroStep,

    // 🔄 Transformar dados do editor para props de produção
    transformProps: (step: EditorStep) => ({
        data: step.data,
        onNameSubmit: () => { } // Mock será substituído
    }),

    // 🎭 Mocks para callbacks de produção
    mockCallbacks: (step: EditorStep) => ({
        onNameSubmit: (name: string) => {
            console.log(`[EDITOR MOCK] IntroStep.onNameSubmit called with: ${name}`);
            // Simular comportamento sem efeitos colaterais
        }
    }),

    // ✅ Validação específica do tipo
    validateProps: (step: EditorStep) => {
        const errors: string[] = [];

        if (!step.data.title) {
            errors.push('Título é obrigatório');
        }

        if (!step.data.subtitle) {
            errors.push('Subtítulo é obrigatório');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // 📤 Extrair dados para produção
    extractData: (props: IntroStepProps) => ({
        title: props.data.title,
        subtitle: props.data.subtitle,
        description: props.data.description,
        buttonText: props.data.buttonText || 'Começar'
    })
});