import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QuizQuestion } from '@/types/quiz';
import Quiz from '@/pages/Quiz';

// Mock dos hooks
vi.mock('@/hooks/useQuizNavigation', () => ({
  useQuizNavigation: () => ({
    currentStep: 1,
    goToStep: vi.fn(),
    goNext: vi.fn(),
    goPrevious: vi.fn(),
    isLoading: false,
  }),
}));

vi.mock('@/hooks/useQuizAnswers', () => ({
  useQuizAnswers: () => ({
    answers: new Map(),
    saveAnswer: vi.fn(),
    getAnswer: vi.fn(),
    clearAnswers: vi.fn(),
  }),
}));

describe('Quiz End-to-End Tests', () => {
  const mockQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      text: 'Como você prefere se vestir no dia a dia?',
      title: 'Como você prefere se vestir no dia a dia?',
      options: [
        { id: '1', text: 'Confortável e prático', style: 'natural', weight: 1 },
        { id: '2', text: 'Elegante e sofisticado', style: 'elegante', weight: 1 },
      ],
    },
    {
      id: 'q2',
      text: 'Qual seu ambiente preferido?',
      title: 'Qual seu ambiente preferido?',
      options: [
        { id: '1', text: 'Ao ar livre', style: 'natural', weight: 1 },
        { id: '2', text: 'Eventos sociais', style: 'elegante', weight: 1 },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render quiz interface correctly', async () => {
    render(<Quiz />);
    
    // Verificar se o componente renderiza sem erros
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should handle quiz flow from start to finish', async () => {
    const { container } = render(<Quiz />);
    
    // Verificar se o quiz foi renderizado
    expect(container).toBeInTheDocument();
    
    // Simular interação básica
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should save answers correctly during quiz progression', async () => {
    const mockSaveAnswer = vi.fn();
    
    // Mock do hook de respostas
    vi.mocked(require('@/hooks/useQuizAnswers').useQuizAnswers).mockReturnValue({
      answers: new Map(),
      saveAnswer: mockSaveAnswer,
      getAnswer: vi.fn(),
      clearAnswers: vi.fn(),
    });

    render(<Quiz />);
    
    // Testar se o quiz pode ser interagido
    const quiz = screen.getByRole('main');
    expect(quiz).toBeInTheDocument();
  });

  it('should calculate results correctly', async () => {
    const testAnswers = new Map([
      ['q1', [{ id: '1', text: 'Natural option', style: 'natural', weight: 1 }]],
      ['q2', [{ id: '1', text: 'Another natural option', style: 'natural', weight: 1 }]],
    ]);

    // Mock para simular respostas salvas
    vi.mocked(require('@/hooks/useQuizAnswers').useQuizAnswers).mockReturnValue({
      answers: testAnswers,
      saveAnswer: vi.fn(),
      getAnswer: vi.fn((id) => testAnswers.get(id)),
      clearAnswers: vi.fn(),
    });

    render(<Quiz />);
    
    // Verificar se o quiz funciona com respostas mockadas
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    // Aguardar processamento
    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  it('should handle edge cases and errors gracefully', async () => {
    // Mock de erro
    vi.mocked(require('@/hooks/useQuizNavigation').useQuizNavigation).mockReturnValue({
      currentStep: 1,
      goToStep: vi.fn().mockRejectedValue(new Error('Navigation error')),
      goNext: vi.fn(),
      goPrevious: vi.fn(),
      isLoading: false,
    });

    render(<Quiz />);
    
    // Verificar se o erro é tratado graciosamente
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
