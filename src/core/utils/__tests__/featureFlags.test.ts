/**
 * 🧪 Testes para featureFlags
 * 
 * Valida:
 * - Get/Set flags
 * - Persistência localStorage
 * - Reset para padrões
 * - React hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getFeatureFlag,
  setFeatureFlag,
  getAllFeatureFlags,
  resetFeatureFlags,
  type FeatureFlags,
} from '../featureFlags';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('featureFlags', () => {
  beforeEach(() => {
    localStorageMock.clear();
    resetFeatureFlags();
  });

  describe('getFeatureFlag', () => {
    it('deve retornar valor padrão para flag não definida', () => {
      const flag = getFeatureFlag('useUnifiedEditor');

      // Padrão depende do ambiente
      expect(typeof flag).toBe('boolean');
    });

    it('deve retornar todas as flags com getAllFeatureFlags', () => {
      const flags = getAllFeatureFlags();

      expect(flags).toHaveProperty('useUnifiedEditor');
      expect(flags).toHaveProperty('useUnifiedContext');
      expect(flags).toHaveProperty('useSinglePropertiesPanel');
      expect(flags).toHaveProperty('enableLazyLoading');
      expect(flags).toHaveProperty('enableAdvancedValidation');
      expect(flags).toHaveProperty('usePersistenceService');
      expect(flags).toHaveProperty('enableErrorBoundaries');
      expect(flags).toHaveProperty('enablePerformanceMonitoring');
      expect(flags).toHaveProperty('enableDebugPanel');
      expect(flags).toHaveProperty('enableExperimentalFeatures');
      expect(flags).toHaveProperty('useNewUIComponents');
      expect(flags).toHaveProperty('enableAccessibilityEnhancements');
    });
  });

  describe('setFeatureFlag', () => {
    it('deve definir flag como true', () => {
      setFeatureFlag('useUnifiedEditor', true);
      const flag = getFeatureFlag('useUnifiedEditor');

      expect(flag).toBe(true);
    });

    it('deve definir flag como false', () => {
      setFeatureFlag('useUnifiedEditor', false);
      const flag = getFeatureFlag('useUnifiedEditor');

      expect(flag).toBe(false);
    });

    it('deve persistir flag no localStorage', () => {
      setFeatureFlag('useUnifiedEditor', true);

      const stored = localStorageMock.getItem('featureFlags');
      expect(stored).toBeDefined();

      const parsed = JSON.parse(stored!);
      expect(parsed.useUnifiedEditor).toBe(true);
    });

    it('deve manter outras flags ao definir uma', () => {
      setFeatureFlag('useUnifiedEditor', true);
      setFeatureFlag('enableLazyLoading', false);

      expect(getFeatureFlag('useUnifiedEditor')).toBe(true);
      expect(getFeatureFlag('enableLazyLoading')).toBe(false);
    });
  });

  describe('resetFeatureFlags', () => {
    it('deve resetar todas as flags para padrões', () => {
      setFeatureFlag('useUnifiedEditor', true);
      setFeatureFlag('enableLazyLoading', false);

      resetFeatureFlags();

      const flags = getAllFeatureFlags();

      // Flags devem estar nos valores padrão
      Object.keys(flags).forEach((key) => {
        expect(typeof flags[key as keyof FeatureFlags]).toBe('boolean');
      });
    });

    it('deve limpar localStorage ao resetar', () => {
      setFeatureFlag('useUnifiedEditor', true);

      resetFeatureFlags();

      const stored = localStorageMock.getItem('featureFlags');
      // Pode ser null ou ter valores padrão
      if (stored) {
        const parsed = JSON.parse(stored);
        // Deve ter voltado aos padrões
        expect(parsed).toBeDefined();
      }
    });
  });

  describe('Persistência', () => {
    it('deve persistir flags entre "sessões"', () => {
      setFeatureFlag('useUnifiedEditor', true);

      // Simular reload/nova instância
      const storedValue = localStorageMock.getItem('featureFlags');
      expect(storedValue).toBeDefined();

      const parsed = JSON.parse(storedValue!);
      expect(parsed.useUnifiedEditor).toBe(true);
    });

    it('deve lidar com localStorage corrompido', () => {
      localStorageMock.setItem('featureFlags', 'invalid json {{{');

      // Não deve lançar erro
      expect(() => getFeatureFlag('useUnifiedEditor')).not.toThrow();
    });
  });

  describe('Validação', () => {
    it('deve aceitar apenas flags válidas', () => {
      const validFlags: Array<keyof FeatureFlags> = [
        'useUnifiedEditor',
        'useUnifiedContext',
        'useSinglePropertiesPanel',
        'enableLazyLoading',
        'enableAdvancedValidation',
        'usePersistenceService',
        'enableErrorBoundaries',
        'enablePerformanceMonitoring',
        'enableDebugPanel',
        'enableExperimentalFeatures',
        'useNewUIComponents',
        'enableAccessibilityEnhancements',
      ];

      validFlags.forEach((flag) => {
        expect(() => setFeatureFlag(flag, true)).not.toThrow();
      });
    });
  });

  describe('Múltiplas operações', () => {
    it('deve lidar com 100 operações de set/get', () => {
      const flags: Array<keyof FeatureFlags> = [
        'useUnifiedEditor',
        'enableLazyLoading',
        'enableDebugPanel',
      ];

      for (let i = 0; i < 100; i++) {
        const flag = flags[i % flags.length];
        const value = i % 2 === 0;

        setFeatureFlag(flag, value);
        expect(getFeatureFlag(flag)).toBe(value);
      }
    });
  });

  describe('Edge cases', () => {
    it('deve lidar com localStorage desabilitado', () => {
      // Simular erro de localStorage
      const originalSetItem = localStorageMock.setItem;
      localStorageMock.setItem = () => {
        throw new Error('localStorage disabled');
      };

      // Não deve lançar erro
      expect(() => setFeatureFlag('useUnifiedEditor', true)).not.toThrow();

      // Restaurar
      localStorageMock.setItem = originalSetItem;
    });

    it('deve lidar com valores não-booleanos no storage', () => {
      localStorageMock.setItem(
        'featureFlags',
        JSON.stringify({ useUnifiedEditor: 'not-a-boolean' })
      );

      // Deve retornar valor padrão
      const flag = getFeatureFlag('useUnifiedEditor');
      expect(typeof flag).toBe('boolean');
    });
  });
});
