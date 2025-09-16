/**
 * 🧪 Quiz Logic Tests
 * Tests for quiz functionality and calculations
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuizLogic } from '@/hooks/useQuizLogic';
import { StorageService } from '@/services/core/StorageService';
import { mockQuizData } from './testUtils';

describe('useQuizLogic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useQuizLogic());
    
    expect(result.current.currentStep).toBe(1);
    expect(result.current.answers).toEqual({});
    expect(result.current.userName).toBe('');
    expect(result.current.isCompleted).toBe(false);
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
    
    expect(result.current.answers['q1']).toBe('natural_a');
    expect(result.current.answers['q2']).toBe('classico_b');
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
    
    expect(result.current.isCompleted).toBe(true);
    
    const quizResult = StorageService.safeGetJSON('quizResult');
    expect(quizResult).toBeTruthy();
    expect(quizResult.primaryStyle).toBeTruthy();
    expect(typeof quizResult.primaryStyle.percentage).toBe('number');
    expect(quizResult.primaryStyle.percentage).toBeGreaterThan(0);
  });

  it('handles step navigation correctly', () => {
    const { result } = renderHook(() => useQuizLogic());
    
    act(() => {
      result.current.nextStep();
    });
    expect(result.current.currentStep).toBe(2);
    
    act(() => {
      result.current.previousStep();
    });
    expect(result.current.currentStep).toBe(1);
  });

  it('validates minimum requirements for completion', () => {
    const { result } = renderHook(() => useQuizLogic());
    
    // Try to complete without enough data
    act(() => {
      result.current.completeQuiz();
    });
    
    expect(result.current.isCompleted).toBe(false);
    
    // Add required data
    act(() => {
      result.current.setUserNameFromInput('Test User');
      
      // Answer minimum required questions
      for (let i = 1; i <= 8; i++) {
        result.current.answerQuestion(`q${i}`, 'natural_a');
      }
      
      result.current.completeQuiz();
    });
    
    expect(result.current.isCompleted).toBe(true);
  });

  it('handles quiz reset correctly', () => {
    const { result } = renderHook(() => useQuizLogic());
    
    // Set up some data
    act(() => {
      result.current.setUserNameFromInput('Test User');
      result.current.answerQuestion('q1', 'natural_a');
      result.current.nextStep();
    });
    
    // Reset
    act(() => {
      result.current.resetQuiz();
    });
    
    expect(result.current.currentStep).toBe(1);
    expect(result.current.answers).toEqual({});
    expect(result.current.userName).toBe('');
    expect(result.current.isCompleted).toBe(false);
  });
});