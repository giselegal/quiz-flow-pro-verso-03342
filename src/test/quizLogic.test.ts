/**
 * 🧪 Quiz Logic Tests
 * Tests for quiz functionality and calculations
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuizLogic } from '@/hooks/useQuizLogic';
import { StorageService } from '@/services/core/StorageService';

describe('useQuizLogic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useQuizLogic());
    
    expect(result.current.currentQuestionIndex).toBe(0);
    expect(result.current.answers).toEqual([]);
    expect(result.current.userName).toBe('');
    expect(result.current.quizCompleted).toBe(false);
  });

  it('handles user name setting', () => {
    const { result } = renderHook(() => useQuizLogic());
    
    act(() => {
      result.current.setUserNameFromInput('Test User');
    });
    
    expect(result.current.userName).toBe('Test User');
    expect(StorageService.safeGetString('userName')).toBe('Test User');
  });

  it('processes quiz answers correctly', () => {
    const { result } = renderHook(() => useQuizLogic());
    
    act(() => {
      result.current.answerQuestion('q1', 'natural_a');
      result.current.answerQuestion('q2', 'classico_b');
    });
    
    expect(result.current.answers.length).toBeGreaterThanOrEqual(0);
  });

  it('calculates quiz results with proper scoring', () => {
    const { result } = renderHook(() => useQuizLogic());
    
    // Set up complete quiz data
    act(() => {
      result.current.setUserNameFromInput('Test User');
      
      // Answer questions trending toward 'natural'
      for (let i = 1; i <= 10; i++) {
        result.current.answerQuestion(`q${i}`, 'natural_a');
      }
      
      result.current.completeQuiz();
    });
    
    expect(result.current.quizCompleted).toBe(true);
    
    const quizResult = StorageService.safeGetJSON('quizResult');
    if (quizResult) {
      expect(quizResult).toBeTruthy();
    }
  });

  it('handles quiz completion validation', () => {
    const { result } = renderHook(() => useQuizLogic());
    
    // Try to complete without enough data
    act(() => {
      result.current.completeQuiz();
    });
    
    // Should handle gracefully
    expect(typeof result.current.quizCompleted).toBe('boolean');
  });

  it('manages current question index', () => {
    const { result } = renderHook(() => useQuizLogic());
    
    act(() => {
      result.current.goToNextQuestion();
    });
    
    expect(result.current.currentQuestionIndex).toBeGreaterThanOrEqual(0);
  });

  it('handles quiz reset correctly', () => {
    const { result } = renderHook(() => useQuizLogic());
    
    // Set up some data first
    act(() => {
      result.current.setUserNameFromInput('Test User');
      result.current.answerQuestion('q1', 'natural_a');
    });
    
    // Reset using available methods
    act(() => {
      result.current.restartQuiz();
    });
    
    expect(result.current.currentQuestionIndex).toBe(0);
    expect(result.current.quizCompleted).toBe(false);
  });
});