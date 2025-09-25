/**
 * 🧪 TESTES DO COMPONENTE QuestionStep
 * Valida renderização, interações e validações das perguntas principais
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionStep from '@/components/quiz/QuestionStep';
import type { QuizStep } from '@/data/quizSteps';

describe('QuestionStep', () => {
  const mockOnAnswersChange = vi.fn();

  const mockQuestionData: QuizStep = {
    type: 'question',
    questionNumber: 'Pergunta 1',
    questionText: 'Qual seu estilo preferido?',
    requiredSelections: 1,
    options: [
      { id: 'option1', text: 'Estilo Natural' },
      { id: 'option2', text: 'Estilo Clássico' },
      { id: 'option3', text: 'Estilo Elegante' }
    ]
  };

  const mockQuestionWithImages: QuizStep = {
    ...mockQuestionData,
    options: [
      { id: 'img1', text: 'Opção 1', image: '/images/style1.jpg' },
      { id: 'img2', text: 'Opção 2', image: '/images/style2.jpg' }
    ]
  };

  beforeEach(() => {
    mockOnAnswersChange.mockClear();
  });

  describe('🎨 Renderização', () => {
    it('deve renderizar pergunta básica corretamente', () => {
      render(
        <QuestionStep
          data={mockQuestionData}
          currentAnswers={[]}
          onAnswersChange={mockOnAnswersChange}
        />
      );

      expect(screen.getByText('Pergunta 1')).toBeInTheDocument();
      expect(screen.getByText('Qual seu estilo preferido?')).toBeInTheDocument();
      expect(screen.getByText('Estilo Natural')).toBeInTheDocument();
      expect(screen.getByText('Estilo Clássico')).toBeInTheDocument();
      expect(screen.getByText('Estilo Elegante')).toBeInTheDocument();
    });

    it('deve renderizar opções com imagens', () => {
      render(
        <QuestionStep
          data={mockQuestionWithImages}
          currentAnswers={[]}
          onAnswersChange={mockOnAnswersChange}
        />
      );

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('src', '/images/style1.jpg');
      expect(images[1]).toHaveAttribute('src', '/images/style2.jpg');
    });

    it('deve mostrar texto de seleção correto', () => {
      render(
        <QuestionStep
          data={mockQuestionData}
          currentAnswers={[]}
          onAnswersChange={mockOnAnswersChange}
        />
      );

      expect(screen.getByText('Selecione uma opção')).toBeInTheDocument();
    });

    it('deve mostrar texto para múltiplas seleções', () => {
      const multiSelectData = { ...mockQuestionData, requiredSelections: 3 };
      
      render(
        <QuestionStep
          data={multiSelectData}
          currentAnswers={[]}
          onAnswersChange={mockOnAnswersChange}
        />
      );

      expect(screen.getByText('Selecione 3 opções')).toBeInTheDocument();
    });
  });

  describe('🖱️ Interações', () => {
    it('deve selecionar opção ao clicar', () => {
      render(
        <QuestionStep
          data={mockQuestionData}
          currentAnswers={[]}
          onAnswersChange={mockOnAnswersChange}
        />
      );

      const option = screen.getByText('Estilo Natural');
      fireEvent.click(option);

      expect(mockOnAnswersChange).toHaveBeenCalledWith(['option1']);
    });

    it('deve desselecionar opção já selecionada', () => {
      render(
        <QuestionStep
          data={mockQuestionData}
          currentAnswers={['option1']}
          onAnswersChange={mockOnAnswersChange}
        />
      );

      const option = screen.getByText('Estilo Natural');
      fireEvent.click(option);

      expect(mockOnAnswersChange).toHaveBeenCalledWith([]);
    });

    it('deve permitir múltiplas seleções até o limite', () => {
      const multiSelectData = { ...mockQuestionData, requiredSelections: 2 };
      
      render(
        <QuestionStep
          data={multiSelectData}
          currentAnswers={['option1']}
          onAnswersChange={mockOnAnswersChange}
        />
      );

      const option2 = screen.getByText('Estilo Clássico');
      fireEvent.click(option2);

      expect(mockOnAnswersChange).toHaveBeenCalledWith(['option1', 'option2']);
    });

    it('não deve permitir seleção além do limite', () => {
      render(
        <QuestionStep
          data={mockQuestionData}
          currentAnswers={['option1']}
          onAnswersChange={mockOnAnswersChange}
        />
      );

      const option2 = screen.getByText('Estilo Clássico');
      fireEvent.click(option2);

      // Deve manter apenas a primeira seleção, pois requiredSelections = 1
      expect(mockOnAnswersChange).not.toHaveBeenCalledWith(['option1', 'option2']);
    });
  });

  describe('🎯 Estados visuais', () => {
    it('deve destacar opções selecionadas', () => {
      render(
        <QuestionStep
          data={mockQuestionData}
          currentAnswers={['option1']}
          onAnswersChange={mockOnAnswersChange}
        />
      );

      const selectedOption = screen.getByText('Estilo Natural').closest('button');
      expect(selectedOption).toHaveClass('border-[#deac6d]');
    });

    it('deve mostrar opções não selecionadas com estilo padrão', () => {
      render(
        <QuestionStep
          data={mockQuestionData}
          currentAnswers={['option1']}
          onAnswersChange={mockOnAnswersChange}
        />
      );

      const unselectedOption = screen.getByText('Estilo Clássico').closest('button');
      expect(unselectedOption).toHaveClass('border-gray-300');
    });

    it('deve aplicar grid correto para opções com imagens', () => {
      render(
        <QuestionStep
          data={mockQuestionWithImages}
          currentAnswers={[]}
          onAnswersChange={mockOnAnswersChange}
        />
      );

      const optionsContainer = screen.getByText('Opção 1').closest('div')?.parentElement;
      expect(optionsContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });
  });

  describe('📱 Responsividade', () => {
    it('deve renderizar corretamente em mobile', () => {
      // Simula viewport mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <QuestionStep
          data={mockQuestionData}
          currentAnswers={[]}
          onAnswersChange={mockOnAnswersChange}
        />
      );

      const container = screen.getByText('Pergunta 1').closest('div');
      expect(container).toHaveClass('p-6');
    });

    it('deve aplicar padding correto em desktop', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      render(
        <QuestionStep
          data={mockQuestionData}
          currentAnswers={[]}
          onAnswersChange={mockOnAnswersChange}
        />
      );

      const container = screen.getByText('Pergunta 1').closest('div');
      expect(container).toHaveClass('md:p-12');
    });
  });

  describe('🔧 Edge cases', () => {
    it('deve lidar com opções vazias', () => {
      const emptyOptionsData = { ...mockQuestionData, options: [] };
      
      render(
        <QuestionStep
          data={emptyOptionsData}
          currentAnswers={[]}
          onAnswersChange={mockOnAnswersChange}
        />
      );

      expect(screen.getByText('Pergunta 1')).toBeInTheDocument();
    });

    it('deve lidar com requiredSelections undefined', () => {
      const noRequiredData = { ...mockQuestionData, requiredSelections: undefined };
      
      render(
        <QuestionStep
          data={noRequiredData}
          currentAnswers={[]}
          onAnswersChange={mockOnAnswersChange}
        />
      );

      expect(screen.getByText('Selecione uma opção')).toBeInTheDocument();
    });

    it('deve renderizar sem quebrar com dados mínimos', () => {
      const minimalData: QuizStep = {
        type: 'question',
        options: [{ id: 'test', text: 'Test Option' }]
      };

      render(
        <QuestionStep
          data={minimalData}
          currentAnswers={[]}
          onAnswersChange={mockOnAnswersChange}
        />
      );

      expect(screen.getByText('Test Option')).toBeInTheDocument();
    });
  });
});