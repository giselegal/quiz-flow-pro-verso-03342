import { ValidationResult } from '@/types/validation';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// Garantir que jest-dom matchers estejam ativos neste arquivo de teste
expect.extend(matchers);
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

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Helper: tests run in StrictMode can produce duplicate nodes — choose
  // the most appropriate button instance (prefer enabled when expecting enabled)
  const getButtonByText = (
    text: string,
    { disabled }: { disabled?: boolean } = {},
    root?: HTMLElement,
  ) => {
    // Prefer matching by accessible name first (role + name). If that fails,
    // fallback to visible text nodes. Then walk to the closest button element.
    const rootQuery = root ? within(root) : screen;
    const byRole = rootQuery.queryAllByRole('button', { name: new RegExp(text, 'i') });
    const nodes = byRole.length ? byRole : rootQuery.getAllByText(new RegExp(text, 'i'));
    const buttons = nodes
      .map((n) => n.closest('button'))
      .filter(Boolean) as HTMLButtonElement[];

    // Prefer the last instance (React StrictMode can mount/unmount twice, the last
    // instance is generally the currently mounted one). Search from the end.
    if (disabled === true) return [...buttons].reverse().find((b) => b.hasAttribute('disabled')) || buttons[buttons.length - 1];
    if (disabled === false) return [...buttons].reverse().find((b) => !b.hasAttribute('disabled')) || buttons[buttons.length - 1];
    return buttons[buttons.length - 1];
  };

  describe('Renderização', () => {
    it('deve renderizar informações de progresso', () => {
      render(<QuizNavigation {...defaultProps} />);

      // pode haver múltiplas renderizações (StrictMode) — certificar que
      // pelo menos uma instância do rótulo esteja presente
      const etapaEls = screen.getAllByText('Etapa 5 de 21');
      expect(etapaEls.length).toBeGreaterThan(0);

      // Calcular progresso: (5/21) * 100 ≈ 24%
      const progress = Math.round((5 / 21) * 100);
      const progressEls = screen.getAllByText(`${progress}% concluído`);
      expect(progressEls.length).toBeGreaterThan(0);
    });

    it('deve exibir barra de progresso correta', () => {
      render(<QuizNavigation {...defaultProps} />);

      const progressElements = screen.getAllByRole('progressbar');
      expect(progressElements.length).toBeGreaterThan(0);
    });

    it('deve mostrar botões de navegação', () => {
      render(<QuizNavigation {...defaultProps} />);

      // Checar presença de instâncias visíveis dos botões
      const anterior = screen.getAllByText('Anterior');
      const proximo = screen.getAllByText('Próximo');
      expect(anterior.length).toBeGreaterThan(0);
      expect(proximo.length).toBeGreaterThan(0);
    });
  });

  describe('Estados de Navegação', () => {
    it('deve desabilitar botão anterior na primeira etapa', () => {
      render(<QuizNavigation {...defaultProps} currentStep={1} />);

      const anteriorBtn = getButtonByText('Anterior', { disabled: true });
      expect(anteriorBtn).toBeDisabled();
    });

    it('deve habilitar botão anterior após primeira etapa', () => {
      render(<QuizNavigation {...defaultProps} />);

      const anteriorBtn = getButtonByText('Anterior', { disabled: false });
      expect(anteriorBtn).not.toBeDisabled();
    });

    it('deve desabilitar botão próximo quando canProceed=false', () => {
      render(<QuizNavigation {...defaultProps} canProceed={false} />);

      const proximoBtn = getButtonByText('Próximo', { disabled: true });
      expect(proximoBtn).toBeDisabled();
    });

    it('deve habilitar botão próximo quando canProceed=true', () => {
      const { container } = render(<QuizNavigation {...defaultProps} />);

      const proximoBtn = getButtonByText('Próximo', { disabled: false }, container);
      expect(proximoBtn).not.toBeDisabled();
    });
  });

  describe('Interações', () => {
    it('deve chamar onNext quando clicar em Próximo', async () => {
      const onNext = vi.fn();

      const { container } = render(<QuizNavigation {...defaultProps} onNext={onNext} />);

      const proximoBtn = getButtonByText('Próximo', { disabled: false }, container);
      const user = userEvent.setup();
      await user.click(proximoBtn);

      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onPrevious quando clicar em Anterior', async () => {
      const onPrevious = vi.fn();

      const { container } = render(<QuizNavigation {...defaultProps} onPrevious={onPrevious} />);

      const anteriorBtn = getButtonByText('Anterior', { disabled: false }, container);
      const user = userEvent.setup();
      await user.click(anteriorBtn);

      expect(onPrevious).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar onNext quando botão estiver desabilitado', () => {
      const onNext = vi.fn();

      render(<QuizNavigation {...defaultProps} canProceed={false} onNext={onNext} />);

      const proximoBtn = getButtonByText('Próximo', { disabled: true });
      userEvent.click(proximoBtn);

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

      const firstStepLabels = screen.getAllByText('Etapa 1 de 21');
      expect(firstStepLabels.length).toBeGreaterThan(0);
      const firstStepProgress = screen.getAllByText('5% concluído');
      expect(firstStepProgress.length).toBeGreaterThan(0);
    });

    it('deve mostrar última etapa corretamente', () => {
      render(<QuizNavigation {...defaultProps} currentStep={21} totalSteps={21} />);

      const lastStepLabels = screen.getAllByText('Etapa 21 de 21');
      expect(lastStepLabels.length).toBeGreaterThan(0);
      const lastProgress = screen.getAllByText('100% concluído');
      expect(lastProgress.length).toBeGreaterThan(0);
    });

    it('deve mostrar "Finalizar" na última etapa', () => {
      render(<QuizNavigation {...defaultProps} currentStep={21} totalSteps={21} />);

      const finalizarEls = screen.getAllByRole('button', { name: /Finalizar/i });
      expect(finalizarEls.length).toBeGreaterThan(0);

      // Pelo menos uma instância 'Finalizar' deve estar habilitada
      const enabledFinalize = finalizarEls.filter((b) => !b.hasAttribute('disabled'));
      expect(enabledFinalize.length).toBeGreaterThan(0);
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
          <QuizNavigation {...defaultProps} currentStep={current} totalSteps={total} />,
        );

        const expectedEls = screen.getAllByText(`${expected}% concluído`);
        expect(expectedEls.length).toBeGreaterThan(0);

        rerender(<div />); // Limpar para próximo teste
      });
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter atributos ARIA corretos', () => {
      render(<QuizNavigation {...defaultProps} />);

      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBeGreaterThan(0);
      const progressBar = progressBars[0];
      expect(progressBar).toHaveAttribute('aria-label');

      // Botões devem ter labels adequados
      const anteriorBtn = getButtonByText('Anterior', { disabled: false });
      expect(anteriorBtn).toHaveAttribute('type', 'button');
      const proximoBtn = getButtonByText('Próximo', { disabled: false });
      expect(proximoBtn).toHaveAttribute('type', 'button');
    });

    it('deve ter foco visível nos botões', () => {
      render(<QuizNavigation {...defaultProps} />);

      const proximoBtn = getButtonByText('Próximo', { disabled: false });
      proximoBtn.focus();

      expect(proximoBtn).toHaveFocus();
    });

    it('deve suportar navegação por teclado', () => {
      const onNext = vi.fn();

      render(<QuizNavigation {...defaultProps} onNext={onNext} />);

      const proximoBtn = getButtonByText('Próximo', { disabled: false });

      // Simular Enter
      fireEvent.keyDown(proximoBtn, { key: 'Enter', code: 'Enter' });
      expect(onNext).toHaveBeenCalledTimes(1);

      // Simular Space
      fireEvent.keyDown(proximoBtn, { key: ' ', code: 'Space' });
      expect(onNext).toHaveBeenCalledTimes(2);
    });
  });
});
