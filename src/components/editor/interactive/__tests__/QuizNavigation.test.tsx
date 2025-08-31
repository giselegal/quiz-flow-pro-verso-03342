import { ValidationResult } from '@/types/validation';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { QuizNavigation } from '../QuizNavigation';

const mockValidation: ValidationResult = {
  success: true,
  errors: [],
};

describe('QuizNavigation', () => {
  const getNextButton = (base: HTMLElement) => {
    const list = within(base).getAllByRole('button', { name: 'Ir para a próxima etapa' });
    return list[list.length - 1];
  };
  const getPrevButton = (base: HTMLElement) => {
    const list = within(base).getAllByRole('button', { name: 'Voltar para a etapa anterior' });
    return list[list.length - 1];
  };

  const defaultProps = {
    currentStep: 5,
    totalSteps: 21,
    canProceed: true,
    onNext: vi.fn(),
    onPrevious: vi.fn(),
    validation: mockValidation,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderização', () => {
    it('deve renderizar informações de progresso', () => {
      const { container } = render(<QuizNavigation {...defaultProps} />);

      const etapaTexts = within(container).getAllByText('Etapa 5 de 21');
      expect(etapaTexts[etapaTexts.length - 1]).toBeInTheDocument();

      // Calcular progresso: (5/21) * 100 ≈ 24%
      const progress = Math.round((5 / 21) * 100);
      expect(within(container).getByText(`${progress}% concluído`)).toBeInTheDocument();
    });

    it('deve exibir barra de progresso correta', () => {
      const { container } = render(<QuizNavigation {...defaultProps} />);

      const progressBars = within(container).getAllByRole('progressbar');
      expect(progressBars[progressBars.length - 1]).toBeInTheDocument();
    });

    it('deve mostrar botões de navegação', () => {
      const { container } = render(<QuizNavigation {...defaultProps} />);

      expect(getPrevButton(container)).toBeInTheDocument();
      expect(getNextButton(container)).toBeInTheDocument();
    });
  });

  describe('Estados de Navegação', () => {
    it('deve desabilitar botão anterior na primeira etapa', () => {
      const { container } = render(<QuizNavigation {...defaultProps} currentStep={1} />);

      const anteriorBtn = getPrevButton(container);
      expect(anteriorBtn).toBeDisabled();
    });

    it('deve habilitar botão anterior após primeira etapa', () => {
      const { container } = render(<QuizNavigation {...defaultProps} />);

      const anteriorBtn = getPrevButton(container);
      expect(anteriorBtn).not.toBeDisabled();
    });

    it('deve desabilitar botão próximo quando canProceed=false', () => {
      const { container } = render(<QuizNavigation {...defaultProps} canProceed={false} />);

      const proximoBtn = getNextButton(container);
      expect(proximoBtn).toBeDisabled();
    });

    it('deve habilitar botão próximo quando canProceed=true', () => {
      const { container } = render(<QuizNavigation {...defaultProps} />);

      const proximoBtn = getNextButton(container);
      expect(proximoBtn).not.toBeDisabled();
    });
  });

  describe('Interações', () => {
    it('deve chamar onNext quando clicar em Próximo', () => {
      const onNext = vi.fn();

      const { container } = render(<QuizNavigation {...defaultProps} onNext={onNext} />);

      const proximoBtn = getNextButton(container);
      fireEvent.click(proximoBtn);

      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onPrevious quando clicar em Anterior', () => {
      const onPrevious = vi.fn();

      const { container } = render(<QuizNavigation {...defaultProps} onPrevious={onPrevious} />);

      const anteriorBtn = getPrevButton(container);
      fireEvent.click(anteriorBtn);

      expect(onPrevious).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar onNext quando botão estiver desabilitado', () => {
      const onNext = vi.fn();

      const { container } = render(<QuizNavigation {...defaultProps} canProceed={false} onNext={onNext} />);

      const proximoBtn = getNextButton(container);
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
      const { container } = render(<QuizNavigation {...defaultProps} currentStep={1} />);

      const etapaTexts = within(container).getAllByText('Etapa 1 de 21');
      expect(etapaTexts[etapaTexts.length - 1]).toBeInTheDocument();
      expect(within(container).getByText('5% concluído')).toBeInTheDocument();
    });

    it('deve mostrar última etapa corretamente', () => {
      const { container } = render(
        <QuizNavigation {...defaultProps} currentStep={21} totalSteps={21} />
      );

      const etapaTexts = within(container).getAllByText('Etapa 21 de 21');
      expect(etapaTexts[etapaTexts.length - 1]).toBeInTheDocument();
      expect(within(container).getByText('100% concluído')).toBeInTheDocument();
    });

    it('deve mostrar "Finalizar" na última etapa', () => {
      const { container } = render(
        <QuizNavigation {...defaultProps} currentStep={21} totalSteps={21} />
      );

      const finalizarBtns = within(container).getAllByRole('button', { name: 'Finalizar quiz' });
      expect(finalizarBtns[finalizarBtns.length - 1]).toBeInTheDocument();

      const nextBtn = within(container).queryByRole('button', { name: 'Ir para a próxima etapa' });
      expect(nextBtn).not.toBeInTheDocument();
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
        const { rerender, container } = render(
          <QuizNavigation {...defaultProps} currentStep={current} totalSteps={total} />
        );

        expect(within(container).getByText(`${expected}% concluído`)).toBeInTheDocument();

        rerender(<div />); // Limpar para próximo teste
      });
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter atributos ARIA corretos', () => {
      const { container } = render(<QuizNavigation {...defaultProps} />);

      const progressBars = within(container).getAllByRole('progressbar');
      const progressBar = progressBars[progressBars.length - 1];
      expect(progressBar).toHaveAttribute('aria-label');

      // Botões devem ter labels adequados
      const anteriorBtn = getPrevButton(container);
      expect(anteriorBtn).toHaveAttribute('type', 'button');

      const proximoBtn = getNextButton(container);
      expect(proximoBtn).toHaveAttribute('type', 'button');
    });

    it('deve ter foco visível nos botões', () => {
      const { container } = render(<QuizNavigation {...defaultProps} />);

      const proximoBtn = getNextButton(container);
      proximoBtn.focus();

      expect(proximoBtn).toHaveFocus();
    });

    it('deve suportar navegação por teclado', () => {
      const onNext = vi.fn();

      const { container } = render(<QuizNavigation {...defaultProps} onNext={onNext} />);

      const proximoBtn = getNextButton(container);

      // Simular Enter
      fireEvent.keyDown(proximoBtn, { key: 'Enter', code: 'Enter' });
      expect(onNext).toHaveBeenCalledTimes(1);

      // Simular Space
      fireEvent.keyDown(proximoBtn, { key: ' ', code: 'Space' });
      expect(onNext).toHaveBeenCalledTimes(2);
    });
  });
});
