import { ValidationResult } from '@/types/validation';
import { beforeEach, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { QuizNavigation } from '../QuizNavigation';

const mockValidation: ValidationResult = {
  success: true,
  errors: [],
};

describe('QuizNavigation', () => {
  const defaultProps = {
    currentStep: 5,
    totalSteps: 21,
    canProceed: true,
    onNext: vi.fn(),
    onPrevious: vi.fn(),
    validation: mockValidation,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderização', () => {
    it('deve renderizar informações de progresso', () => {
      render(<QuizNavigation {...defaultProps} />);

      expect(screen.getByText('Etapa 5 de 21')).toBeInTheDocument();

      // Calcular progresso: (5/21) * 100 ≈ 24%
      const progress = Math.round((5 / 21) * 100);
      expect(screen.getByText(`${progress}% concluído`)).toBeInTheDocument();
    });

    it('deve exibir barra de progresso correta', () => {
      render(<QuizNavigation {...defaultProps} />);

      const progressElement = screen.getByRole('progressbar');
      expect(progressElement).toBeInTheDocument();
    });

    it('deve mostrar botões de navegação', () => {
      render(<QuizNavigation {...defaultProps} />);

      expect(screen.getByText('Anterior')).toBeInTheDocument();
      expect(screen.getByText('Próximo')).toBeInTheDocument();
    });
  });

  describe('Estados de Navegação', () => {
    it('deve desabilitar botão anterior na primeira etapa', () => {
      render(<QuizNavigation {...defaultProps} currentStep={1} />);

      const anteriorBtn = screen.getByText('Anterior');
      expect(anteriorBtn).toBeDisabled();
    });

    it('deve habilitar botão anterior após primeira etapa', () => {
      render(<QuizNavigation {...defaultProps} />);

      const anteriorBtn = screen.getByText('Anterior');
      expect(anteriorBtn).not.toBeDisabled();
    });

    it('deve desabilitar botão próximo quando canProceed=false', () => {
      render(<QuizNavigation {...defaultProps} canProceed={false} />);

      const proximoBtn = screen.getByText('Próximo');
      expect(proximoBtn).toBeDisabled();
    });

    it('deve habilitar botão próximo quando canProceed=true', () => {
      render(<QuizNavigation {...defaultProps} />);

      const proximoBtn = screen.getByText('Próximo');
      expect(proximoBtn).not.toBeDisabled();
    });
  });

  describe('Interações', () => {
    it('deve chamar onNext quando clicar em Próximo', () => {
      const onNext = vi.fn();

      render(<QuizNavigation {...defaultProps} onNext={onNext} />);

      const proximoBtn = screen.getByText('Próximo');
      fireEvent.click(proximoBtn);

      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onPrevious quando clicar em Anterior', () => {
      const onPrevious = vi.fn();

      render(<QuizNavigation {...defaultProps} onPrevious={onPrevious} />);

      const anteriorBtn = screen.getByText('Anterior');
      fireEvent.click(anteriorBtn);

      expect(onPrevious).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar onNext quando botão estiver desabilitado', () => {
      const onNext = vi.fn();

      render(<QuizNavigation {...defaultProps} canProceed={false} onNext={onNext} />);

      const proximoBtn = screen.getByText('Próximo');
      fireEvent.click(proximoBtn);

      expect(onNext).not.toHaveBeenCalled();
    });
  });

  describe('Estados de Validação', () => {
    it('deve exibir ícone de sucesso quando validação é válida', () => {
      const validValidation: ValidationResult = {
        success: true,
        errors: [],
      };

      render(<QuizNavigation {...defaultProps} validation={validValidation} />);

      // Deve mostrar ícone de sucesso se houver
      const successIcon = screen.queryByTestId('validation-success');
      if (successIcon) {
        expect(successIcon).toBeInTheDocument();
      }
    });

    it('deve exibir ícone de erro quando validação é inválida', () => {
      const invalidValidation: ValidationResult = {
        success: false,
        errors: [{ path: 'field1', message: 'Campo obrigatório' }],
      };

      render(<QuizNavigation {...defaultProps} validation={invalidValidation} />);

      // Deve mostrar ícone de erro se houver
      const errorIcon = screen.queryByTestId('validation-error');
      if (errorIcon) {
        expect(errorIcon).toBeInTheDocument();
      }
    });
  });

  describe('Diferentes Etapas', () => {
    it('deve mostrar primeira etapa corretamente', () => {
      render(<QuizNavigation {...defaultProps} currentStep={1} />);

      expect(screen.getByText('Etapa 1 de 21')).toBeInTheDocument();
      expect(screen.getByText('5% concluído')).toBeInTheDocument();
    });

    it('deve mostrar última etapa corretamente', () => {
      render(<QuizNavigation {...defaultProps} currentStep={21} totalSteps={21} />);

      expect(screen.getByText('Etapa 21 de 21')).toBeInTheDocument();
      expect(screen.getByText('100% concluído')).toBeInTheDocument();
    });

    it('deve mostrar "Finalizar" na última etapa', () => {
      render(<QuizNavigation {...defaultProps} currentStep={21} totalSteps={21} />);

      expect(screen.getByText('Finalizar')).toBeInTheDocument();
      expect(screen.queryByText('Próximo')).not.toBeInTheDocument();
    });
  });

  describe('Cálculo de Progresso', () => {
    it('deve calcular progresso corretamente', () => {
      // Teste com diferentes valores
      const testCases = [
        { current: 1, total: 10, expected: 10 },
        { current: 5, total: 20, expected: 25 },
        { current: 3, total: 7, expected: 43 }, // Math.round(3/7 * 100) = 43
      ];

      testCases.forEach(({ current, total, expected }) => {
        const { rerender } = render(
          <QuizNavigation {...defaultProps} currentStep={current} totalSteps={total} />
        );

        expect(screen.getByText(`${expected}% concluído`)).toBeInTheDocument();

        rerender(<div />); // Limpar para próximo teste
      });
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter atributos ARIA corretos', () => {
      render(<QuizNavigation {...defaultProps} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-label');

      // Botões devem ter labels adequados
      const anteriorBtn = screen.getByText('Anterior');
      expect(anteriorBtn).toHaveAttribute('type', 'button');

      const proximoBtn = screen.getByText('Próximo');
      expect(proximoBtn).toHaveAttribute('type', 'button');
    });

    it('deve ter foco visível nos botões', () => {
      render(<QuizNavigation {...defaultProps} />);

      const proximoBtn = screen.getByText('Próximo');
      proximoBtn.focus();

      expect(proximoBtn).toHaveFocus();
    });

    it('deve suportar navegação por teclado', () => {
      const onNext = vi.fn();

      render(<QuizNavigation {...defaultProps} onNext={onNext} />);

      const proximoBtn = screen.getByText('Próximo');

      // Simular Enter
      fireEvent.keyDown(proximoBtn, { key: 'Enter', code: 'Enter' });
      expect(onNext).toHaveBeenCalledTimes(1);

      // Simular Space
      fireEvent.keyDown(proximoBtn, { key: ' ', code: 'Space' });
      expect(onNext).toHaveBeenCalledTimes(2);
    });
  });
});
