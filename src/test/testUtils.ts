/**
 * 🧪 Test Utilities
 * Utilities for improved testing experience
 */

// Re-export everything from testing-library/react
export * from '@testing-library/react';

// Mock data helpers
export const mockBlockData = {
  text: {
    id: 'test-text-block',
    type: 'text-inline',
    properties: {
      content: 'Test content',
      alignment: 'center',
    },
    order: 0,
    content: {},
  },
  button: {
    id: 'test-button-block',
    type: 'button-inline',
    properties: {
      text: 'Test Button',
      variant: 'primary',
      size: 'medium',
    },
    order: 1,
    content: {},
  },
};

export const mockQuizData = {
  userName: 'Test User',
  selections: {
    q1: ['natural_a'],
    q2: ['classico_b'],
  },
};

// Test helpers
export const waitForLoad = (timeout: number = 1000) =>
  new Promise<void>(resolve => setTimeout(resolve, timeout));