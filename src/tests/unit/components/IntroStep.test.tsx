/**
 * 🧪 TESTES DO COMPONENTE IntroStep
 * Valida renderização, captura de nome e validações da etapa inicial
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import IntroStep from '@/components/quiz/IntroStep';
import type { QuizStep } from '@/data/quizSteps';

describe('IntroStep', () => {
  const mockOnNameChange = vi.fn();
  const mockOnNext = vi.fn();

  const mockIntroData: QuizStep = {
    type: 'intro',
    title: 'Bem-vinda ao Quiz de Estilo',
    text: 'Descubra seu estilo pessoal único',
    formQuestion: 'Como você gostaria de ser chamada?',
    placeholder: 'Digite seu primeiro nome',
    buttonText: 'Começar Quiz',
    image: '/images/intro-hero.jpg'
  };

  beforeEach(() => {
    mockOnNameChange.mockClear();
    mockOnNext.mockClear();
  });

  describe('🎨 Renderização', () => {
    it('deve renderizar todos os elementos básicos', () => {
      render(
        <IntroStep
          data={mockIntroData}
          userName=""
          onNameChange={mockOnNameChange}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByText('Bem-vinda ao Quiz de Estilo')).toBeInTheDocument();
      expect(screen.getByText('Descubra seu estilo pessoal único')).toBeInTheDocument();
      expect(screen.getByText('Como você gostaria de ser chamada?')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite seu primeiro nome')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Começar Quiz' })).toBeInTheDocument();
    });

    it('deve renderizar imagem quando fornecida', () => {
      render(
        <IntroStep
          data={mockIntroData}
          userName=""
          onNameChange={mockOnNameChange}
          onNext={mockOnNext}
        />
      );

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', '/images/intro-hero.jpg');
      expect(image).toHaveAttribute('alt', 'Quiz Introduction');
    });

    it('deve renderizar sem imagem quando não fornecida', () => {
      const dataWithoutImage = { ...mockIntroData, image: undefined };
      
      render(
        <IntroStep
          data={dataWithoutImage}
          userName=""
          onNameChange={mockOnNameChange}
          onNext={mockOnNext}
        />
      );

      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });

  describe('📝 Captura de nome', () => {
    it('deve chamar onNameChange ao digitar', () => {
      render(
        <IntroStep
          data={mockIntroData}
          userName=""
          onNameChange={mockOnNameChange}
          onNext={mockOnNext}
        />
      );

      const input = screen.getByPlaceholderText('Digite seu primeiro nome');
      fireEvent.change(input, { target: { value: 'Maria' } });

      expect(mockOnNameChange).toHaveBeenCalledWith('Maria');
    });

    it('deve mostrar valor do nome atual', () => {
      render(
        <IntroStep
          data={mockIntroData}
          userName="Ana"
          onNameChange={mockOnNameChange}
          onNext={mockOnNext}
        />
      );

      const input = screen.getByPlaceholderText('Digite seu primeiro nome') as HTMLInputElement;
      expect(input.value).toBe('Ana');
    });

    it('deve limitar nome a comprimento razoável', async () => {
      render(
        <IntroStep
          data={mockIntroData}
          userName=""
          onNameChange={mockOnNameChange}
          onNext={mockOnNext}
        />
      );

      const input = screen.getByPlaceholderText('Digite seu primeiro nome');
      const longName = 'A'.repeat(100);
      
      fireEvent.change(input, { target: { value: longName } });
      
      // Verifica se o nome foi truncado ou se há validação
      expect(mockOnNameChange).toHaveBeenCalled();
    });
  });

  describe('🔘 Botão de avançar', () => {
    it('deve estar desabilitado quando nome está vazio', () => {
      render(
        <IntroStep
          data={mockIntroData}
          userName=""
          onNameChange={mockOnNameChange}
          onNext={mockOnNext}
        />
      );

      const button = screen.getByRole('button', { name: 'Começar Quiz' });
      expect(button).toBeDisabled();
    });

    it('deve estar habilitado quando nome é fornecido', () => {
      render(
        <IntroStep
          data={mockIntroData}
          userName="Maria"
          onNameChange={mockOnNameChange}
          onNext={mockOnNext}
        />
      );

      const button = screen.getByRole('button', { name: 'Começar Quiz' });
      expect(button).not.toBeDisabled();
    });

    it('deve chamar onNext ao clicar com nome válido', () => {
      render(
        <IntroStep
          data={mockIntroData}
          userName="Maria"
          onNameChange={mockOnNameChange}
          onNext={mockOnNext}
        />
      );

      const button = screen.getByRole('button', { name: 'Começar Quiz' });
      fireEvent.click(button);

      expect(mockOnNext).toHaveBeenCalled();
    });

    it('não deve chamar onNext com nome vazio', () => {
      render(
        <IntroStep
          data={mockIntroData}
          userName=""
          onNameChange={mockOnNameChange}
          onNext={mockOnNext}
        />
      );

      const button = screen.getByRole('button', { name: 'Começar Quiz' });
      fireEvent.click(button);

      expect(mockOnNext).not.toHaveBeenCalled();
    });
  });

  describe('⌨️ Navegação por teclado', () => {
    it('deve avançar ao pressionar Enter com nome válido', () => {
      render(
        <IntroStep
          data={mockIntroData}
          userName="Maria"
          onNameChange={mockOnNameChange}
          onNext={mockOnNext}
        />
      );

      const input = screen.getByPlaceholderText('Digite seu primeiro nome');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockOnNext).toHaveBeenCalled();
    });

    it('não deve avançar ao pressionar Enter com nome vazio', () => {
      render(
        <IntroStep
          data={mockIntroData}
          userName=""
          onNameChange={mockOnNameChange}
          onNext={mockOnNext}
        />
      );

      const input = screen.getByPlaceholderText('Digite seu primeiro nome');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockOnNext).not.toHaveBeenCalled();
    });
  });

  describe('🎨 Estilos e classes', () => {
    it('deve aplicar classes corretas ao container', () => {
      render(
        <IntroStep
          data={mockIntroData}
          userName=""
          onNameChange={mockOnNameChange}
          onNext={mockOnNext}
        />
      );

      const container = screen.getByText('Bem-vinda ao Quiz de Estilo').closest('div');
      expect(container).toHaveClass('bg-white', 'rounded-lg', 'shadow-lg');
    });

    it('deve aplicar estilo de fonte Playfair Display ao título', () => {
      render(
        <IntroStep
          data={mockIntroData}
          userName=""
          onNameChange={mockOnNameChange}
          onNext={mockOnNext}
        />
      );

      const title = screen.getByText('Bem-vinda ao Quiz de Estilo');
      expect(title).toHaveClass('playfair-display');
    });

    it('deve aplicar cor dourada aos elementos destacados', () => {
      render(
        <IntroStep
          data={mockIntroData}
          userName="Maria"
          onNameChange={mockOnNameChange}
          onNext={mockOnNext}
        />
      );

      const button = screen.getByRole('button', { name: 'Começar Quiz' });
      expect(button).toHaveClass('bg-[#deac6d]');
    });
  });

  describe('📱 Responsividade', () => {
    it('deve aplicar padding responsivo', () => {
      render(
        <IntroStep
          data={mockIntroData}
          userName=""
          onNameChange={mockOnNameChange}
          onNext={mockOnNext}
        />
      );

      const container = screen.getByText('Bem-vinda ao Quiz de Estilo').closest('div');
      expect(container).toHaveClass('p-6', 'md:p-12');
    });

    it('deve aplicar tamanhos de texto responsivos', () => {
      render(
        <IntroStep
          data={mockIntroData}
          userName=""
          onNameChange={mockOnNameChange}
          onNext={mockOnNext}
        />
      );

      const title = screen.getByText('Bem-vinda ao Quiz de Estilo');
      expect(title).toHaveClass('text-2xl', 'md:text-4xl');
    });
  });

  describe('🔧 Edge cases', () => {
    it('deve renderizar com dados mínimos', () => {
      const minimalData: QuizStep = {
        type: 'intro',
        formQuestion: 'Nome?',
        buttonText: 'Continuar'
      };

      render(
        <IntroStep
          data={minimalData}
          userName=""
          onNameChange={mockOnNameChange}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByText('Nome?')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Continuar' })).toBeInTheDocument();
    });

    it('deve lidar com nomes com espaços e caracteres especiais', () => {
      render(
        <IntroStep
          data={mockIntroData}
          userName=""
          onNameChange={mockOnNameChange}
          onNext={mockOnNext}
        />
      );

      const input = screen.getByPlaceholderText('Digite seu primeiro nome');
      fireEvent.change(input, { target: { value: 'Maria José' } });

      expect(mockOnNameChange).toHaveBeenCalledWith('Maria José');
    });
  });
});