/**
 * 🧪 TESTE DE VALIDAÇÃO: QuestionStepAdapter Corrigido
 * 
 * Valida que QuestionStepAdapter agora usa BlockTypeRenderer
 * ao invés de ModularQuestionStep (deprecado).
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock dos módulos necessários
vi.mock('@/templates/imports', () => ({
    loadTemplate: vi.fn().mockResolvedValue({
        step: {
            blocks: [
                {
                    id: 'q-test',
                    type: 'question-block',
                    config: {
                        questionText: 'Teste de Pergunta',
                        options: [
                            { id: 'opt1', text: 'Opção 1' },
                            { id: 'opt2', text: 'Opção 2' }
                        ]
                    }
                }
            ]
        }
    })
}));

vi.mock('@/components/editor/quiz/renderers/BlockTypeRenderer', () => ({
    BlockTypeRenderer: ({ block }: any) => (
        <div data-testid="block-type-renderer">
            <h3>{block.config?.questionText || 'Pergunta'}</h3>
            {block.config?.options?.map((opt: any) => (
                <button key={opt.id}>{opt.text}</button>
            ))}
        </div>
    )
}));

describe('✅ CORREÇÃO CRÍTICA: QuestionStepAdapter', () => {
    it('deve usar BlockTypeRenderer ao invés de ModularQuestionStep deprecado', async () => {
        // Importar o adapter corrigido
        const { QuestionStepAdapter } = await import('@/components/step-registry/ProductionStepsRegistry');

        const mockProps = {
            stepId: 'step-02',
            stepNumber: 2,
            isActive: true,
            isEditable: false,
            onNext: vi.fn(),
            onPrevious: vi.fn(),
            onSave: vi.fn(),
            data: {},
            quizState: {
                currentStep: 2,
                userName: 'Teste',
                answers: {},
                strategicAnswers: {},
            }
        };

        render(<QuestionStepAdapter {...mockProps} />);

        // Aguardar carregamento assíncrono
        await screen.findByTestId('block-type-renderer', {}, { timeout: 3000 });

        // ✅ VALIDAÇÃO: BlockTypeRenderer está sendo usado
        expect(screen.getByTestId('block-type-renderer')).toBeInTheDocument();
        expect(screen.getByText('Teste de Pergunta')).toBeInTheDocument();
        expect(screen.getByText('Opção 1')).toBeInTheDocument();
        expect(screen.getByText('Opção 2')).toBeInTheDocument();
    });

    it('deve exibir loading enquanto carrega template', async () => {
        const { QuestionStepAdapter } = await import('@/components/step-registry/ProductionStepsRegistry');

        const mockProps = {
            stepId: 'step-03',
            stepNumber: 3,
            isActive: true,
            isEditable: false,
            onNext: vi.fn(),
            onPrevious: vi.fn(),
            onSave: vi.fn(),
            data: {},
            quizState: {
                currentStep: 3,
                userName: 'Teste',
                answers: {},
                strategicAnswers: {},
            }
        };

        render(<QuestionStepAdapter {...mockProps} />);

        // ✅ VALIDAÇÃO: Loading aparece inicialmente
        expect(screen.getByText(/carregando pergunta/i)).toBeInTheDocument();
    });

    it('❌ REGRESSÃO: NÃO deve usar ModularQuestionStep', () => {
        // Verificar que ModularQuestionStep retorna null (deprecado)
        const { ModularQuestionStep } = require('@/components/quiz-modular');
        
        const result = ModularQuestionStep({});
        
        // ✅ VALIDAÇÃO: ModularQuestionStep está deprecado e retorna null
        expect(result).toBeNull();
    });
});
