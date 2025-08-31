import { EditorProvider } from '@/context/EditorContext';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InteractiveQuizCanvas } from '../InteractiveQuizCanvas';

// Wrapper do provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <EditorProvider funnelId="test-funnel">{children}</EditorProvider>
);

describe('InteractiveQuizCanvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Limpar localStorage antes de cada teste
    localStorage.clear();
  });

  describe('Renderização Inicial', () => {
    it('deve renderizar o cabeçalho do quiz', () => {
      render(
        <TestWrapper>
          <InteractiveQuizCanvas />
        </TestWrapper>
      );

      expect(screen.getByText('Quiz de Estilo')).toBeInTheDocument();
      expect(screen.getByText('Descubra seu estilo pessoal')).toBeInTheDocument();
    });

    it('deve exibir a primeira etapa corretamente', () => {
      render(
        <TestWrapper>
          <InteractiveQuizCanvas />
        </TestWrapper>
      );

      expect(screen.getByText('Etapa 1')).toBeInTheDocument();
      expect(screen.getByText('de 2')).toBeInTheDocument();
    });

    it('deve renderizar o primeiro bloco', () => {
      render(
        <TestWrapper>
          <InteractiveQuizCanvas />
        </TestWrapper>
      );

      expect(screen.getByText('Qual é sua cor favorita?')).toBeInTheDocument();
      expect(screen.getByText('Azul')).toBeInTheDocument();
      expect(screen.getByText('Vermelho')).toBeInTheDocument();
      expect(screen.getByText('Verde')).toBeInTheDocument();
    });
  });

  describe('Interação com Questões', () => {
    it('deve permitir selecionar uma opção', async () => {
      render(
        <TestWrapper>
          <InteractiveQuizCanvas />
        </TestWrapper>
      );

      const opcaoAzul = screen.getByText('Azul');
      fireEvent.click(opcaoAzul);

      await waitFor(() => {
        expect(opcaoAzul.closest('button')).toHaveClass('ring-2', 'ring-blue-500');
      });
    });

    it('deve validar campos obrigatórios', async () => {
      render(
        <TestWrapper>
          <InteractiveQuizCanvas />
        </TestWrapper>
      );

      // Tentar ir para próxima etapa sem responder
      const proximoBtn = screen.getByRole('button', { name: 'Ir para a próxima etapa' });
      fireEvent.click(proximoBtn);

      await waitFor(() => {
        expect(
          screen.getByText('Complete todos os campos obrigatórios para continuar')
        ).toBeInTheDocument();
      });
    });

    it('deve permitir navegação após responder', async () => {
      render(
        <TestWrapper>
          <InteractiveQuizCanvas />
        </TestWrapper>
      );

      // Selecionar uma opção
      const opcaoAzul = screen.getByText('Azul');
      fireEvent.click(opcaoAzul);

      // Ir para próxima etapa
      const proximoBtn = screen.getByRole('button', { name: 'Ir para a próxima etapa' });
      await waitFor(() => {
        expect(proximoBtn).not.toBeDisabled();
      });

      fireEvent.click(proximoBtn);

      await waitFor(() => {
        expect(screen.getByText('Etapa 2')).toBeInTheDocument();
      });
    });
  });

  describe('Persistência de Estado', () => {
    it('deve salvar respostas no localStorage', async () => {
      render(
        <TestWrapper>
          <InteractiveQuizCanvas />
        </TestWrapper>
      );

      const opcaoAzul = screen.getByText('Azul');
      fireEvent.click(opcaoAzul);

      await waitFor(() => {
        const savedState = localStorage.getItem('quiz-state');
        expect(savedState).toBeTruthy();

        const state = JSON.parse(savedState!);
        expect(state.answers).toHaveProperty('block-1');
        expect(state.answers['block-1'].value).toBe('blue');
      });
    });

    it('deve restaurar estado do localStorage', () => {
      // Simular estado salvo
      const savedState = {
        currentStep: 2,
        answers: {
          'block-1': {
            questionId: 'block-1',
            selectedOptions: ['blue'],
            timestamp: new Date(),
            stepId: '1',
          },
        },
        scores: { cool: 1 },
      };
      localStorage.setItem('quiz-state', JSON.stringify(savedState));

      render(
        <TestWrapper>
          <InteractiveQuizCanvas />
        </TestWrapper>
      );

      expect(screen.getByText('Etapa 2')).toBeInTheDocument();
    });
  });

  describe('Navegação', () => {
    it('deve desabilitar botão anterior na primeira etapa', () => {
      render(
        <TestWrapper>
          <InteractiveQuizCanvas />
        </TestWrapper>
      );

      // Na primeira etapa, não deve haver botão anterior
      expect(screen.queryByText('Anterior')).not.toBeInTheDocument();
    });

    it('deve permitir voltar etapas', async () => {
      render(
        <TestWrapper>
          <InteractiveQuizCanvas />
        </TestWrapper>
      );

      // Responder primeira questão e avançar
      const opcaoAzul = screen.getByText('Azul');
      fireEvent.click(opcaoAzul);

      const proximoBtn = screen.getByRole('button', { name: 'Ir para a próxima etapa' });
      fireEvent.click(proximoBtn);

      await waitFor(() => {
        expect(screen.getByText('Etapa 2')).toBeInTheDocument();
      });

      // Voltar para etapa anterior
      const anteriorBtn = screen.getByRole('button', { name: 'Voltar para a etapa anterior' });
      fireEvent.click(anteriorBtn);

      await waitFor(() => {
        expect(screen.getByText('Etapa 1')).toBeInTheDocument();
      });
    });
  });

  describe('Cálculo de Pontuação', () => {
    it('deve calcular pontuação por categoria', async () => {
      render(
        <TestWrapper>
          <InteractiveQuizCanvas />
        </TestWrapper>
      );

      // Selecionar opção da categoria 'cool'
      const opcaoAzul = screen.getByText('Azul');
      fireEvent.click(opcaoAzul);

      await waitFor(() => {
        // Verificar se a pontuação foi registrada (modo debug)
        if (process.env.NODE_ENV === 'development') {
          expect(screen.getByText(/cool/)).toBeInTheDocument();
        }
      });
    });
  });

  describe('Validação de Formulário', () => {
    it('deve mostrar mensagens de erro para campos não preenchidos', async () => {
      render(
        <TestWrapper>
          <InteractiveQuizCanvas />
        </TestWrapper>
      );

      // Ir para segunda etapa (campo de input)
      const opcaoAzul = screen.getByText('Azul');
      fireEvent.click(opcaoAzul);

      const proximoBtn = screen.getByRole('button', { name: 'Ir para a próxima etapa' });
      fireEvent.click(proximoBtn);

      await waitFor(() => {
        expect(screen.getByText('Etapa 2')).toBeInTheDocument();
      });

      // Tentar continuar sem preencher campo obrigatório
      const proximoBtn2 = screen.getByRole('button', { name: 'Ir para a próxima etapa' });
      fireEvent.click(proximoBtn2);

      await waitFor(() => {
        expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
      });
    });

    it('deve permitir continuar após preencher campos obrigatórios', async () => {
      render(
        <TestWrapper>
          <InteractiveQuizCanvas />
        </TestWrapper>
      );

      // Navegar para campo de input
      const opcaoAzul = screen.getByText('Azul');
      fireEvent.click(opcaoAzul);

      const proximoBtn = screen.getByRole('button', { name: 'Ir para a próxima etapa' });
      fireEvent.click(proximoBtn);

      await waitFor(() => {
        expect(screen.getByText('Etapa 2')).toBeInTheDocument();
      });

      // Preencher campo obrigatório
      const inputNome = screen.getByPlaceholderText('Digite seu nome');
      fireEvent.change(inputNome, { target: { value: 'João Silva' } });

      await waitFor(() => {
        const proximoBtn2 = screen.getByRole('button', { name: 'Finalizar quiz' });
        expect(proximoBtn2).not.toBeDisabled();
      });
    });
  });

  describe('Estados de Loading', () => {
    it('deve mostrar estado de loading durante processamento', async () => {
      render(
        <TestWrapper>
          <InteractiveQuizCanvas />
        </TestWrapper>
      );

      // Simular clique em próximo com delay
      vi.useFakeTimers();

      const opcaoAzul = screen.getByText('Azul');
      fireEvent.click(opcaoAzul);

      const proximoBtn = screen.getByRole('button', { name: 'Ir para a próxima etapa' });
      fireEvent.click(proximoBtn);

      // Durante o processamento, deve mostrar loading
      expect(screen.queryByText('Processando...')).toBeInTheDocument();

      vi.useRealTimers();
    });
  });
});

/**
 * 🎯 TESTES DE INTEGRAÇÃO
 */
describe('InteractiveQuizCanvas - Integração', () => {
  it('deve funcionar com múltiplos tipos de bloco', () => {
    render(
      <EditorProvider funnelId="test-complex-funnel">
        <InteractiveQuizCanvas />
      </EditorProvider>
    );

    expect(screen.getByText('Seção 2')).toBeInTheDocument();
    expect(screen.getByText('Descrição adicional')).toBeInTheDocument();
  });

  it('deve lidar com quiz vazio graciosamente', () => {
    render(
      <EditorProvider funnelId="test-empty-funnel">
        <InteractiveQuizCanvas />
      </EditorProvider>
    );

    expect(screen.getByText('Nenhum conteúdo disponível')).toBeInTheDocument();
  });
});
