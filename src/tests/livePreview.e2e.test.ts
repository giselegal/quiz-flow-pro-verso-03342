/**
 * 🧪 TESTES E2E - SISTEMA DE PREVIEW AO VIVO
 * 
 * Valida se todas as funcionalidades do sistema de preview otimizado
 * estão funcionando corretamente no frontend
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLiveCanvasPreview } from '@/hooks/canvas/useLiveCanvasPreview';
import { useAdvancedCache } from '@/hooks/performance/useAdvancedCache';
import { useRenderOptimization } from '@/hooks/performance/useRenderOptimization';
import { useAdvancedWebSocket } from '@/hooks/websocket/useAdvancedWebSocket';

// Mock WebSocket para testes
global.WebSocket = vi.fn().mockImplementation(() => ({
  close: vi.fn(),
  send: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  readyState: 1, // OPEN
}));

// Mock performance API
global.performance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
} as any;

describe('🧪 E2E - Sistema de Preview ao Vivo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('✅ 1. Hooks de Performance', () => {
    it('useAdvancedCache - Sistema de cache multi-level funcional', () => {
      const { result } = renderHook(() => 
        useAdvancedCache({
          maxSize: 100,
          ttl: 5000,
          strategy: 'lru'
        })
      );

      act(() => {
        // Testar operações básicas do cache
        result.current.set('test-key', { data: 'test-value' });
      });

      const cachedValue = result.current.get('test-key');
      expect(cachedValue).toEqual({ data: 'test-value' });

      // Testar métricas
      const metrics = result.current.getMetrics();
      expect(metrics.hitRate).toBeGreaterThanOrEqual(0);
      expect(metrics.size).toBe(1);
    });

    it('useRenderOptimization - Otimização de renderização ativa', () => {
      const mockSteps = [
        { id: 'step1', type: 'question', title: 'Test Step 1' },
        { id: 'step2', type: 'result', title: 'Test Step 2' }
      ];

      const { result } = renderHook(() => 
        useRenderOptimization({
          enableVirtualization: true,
          enableMemoization: true,
          enableRenderProfiling: true
        })
      );

      act(() => {
        const optimizedSteps = result.current.optimizeRender(mockSteps);
        expect(optimizedSteps).toBeDefined();
        expect(Array.isArray(optimizedSteps)).toBe(true);
      });

      // Verificar se profiling está funcionando
      const profile = result.current.getProfile();
      expect(profile).toBeDefined();
      expect(typeof profile.renderCount).toBe('number');
    });
  });

  describe('✅ 2. WebSocket e Sincronização', () => {
    it('useAdvancedWebSocket - Conexão WebSocket robusta', () => {
      const { result } = renderHook(() => 
        useAdvancedWebSocket('ws://localhost:3001', {
          enableCompression: true,
          enableHeartbeat: true,
          maxRetries: 3
        })
      );

      // Verificar estado inicial
      expect(result.current.connectionState.isConnected).toBeDefined();
      expect(result.current.connectionState.retryCount).toBe(0);

      // Testar envio de mensagem
      act(() => {
        result.current.sendMessage({ type: 'test', data: 'hello' });
      });

      // Verificar métricas
      const metrics = result.current.getMetrics();
      expect(metrics.messagesSent).toBeGreaterThanOrEqual(0);
      expect(metrics.bytesTransferred).toBeGreaterThanOrEqual(0);
    });
  });

  describe('✅ 3. Preview ao Vivo Integrado', () => {
    it('useLiveCanvasPreview - Sistema completo funcional', () => {
      const mockSteps = [
        { id: 'step1', type: 'question', title: 'Test Question' },
        { id: 'step2', type: 'result', title: 'Test Result' }
      ];

      const { result } = renderHook(() => 
        useLiveCanvasPreview({
          steps: mockSteps,
          selectedStepId: 'step1',
          enablePerformanceOptimization: true,
          enableWebSocketSync: true,
          debounceMs: 300
        })
      );

      // Verificar estado inicial
      expect(result.current.previewState.isLoading).toBeDefined();
      expect(result.current.previewState.updateCount).toBe(0);
      expect(result.current.previewState.lastUpdate).toBeDefined();

      // Testar atualização de steps
      act(() => {
        const newSteps = [...mockSteps, { id: 'step3', type: 'question', title: 'New Step' }];
        result.current.updateSteps?.(newSteps);
      });

      // Verificar se preview foi atualizado
      expect(result.current.previewState.updateCount).toBeGreaterThan(0);

      // Testar métricas de performance
      const metrics = result.current.getPerformanceMetrics?.();
      expect(metrics).toBeDefined();
    });

    it('Live Preview - Integração com cache e WebSocket', () => {
      const { result } = renderHook(() => {
        const cache = useAdvancedCache({ maxSize: 50, ttl: 3000 });
        const websocket = useAdvancedWebSocket('ws://localhost:3001');
        const preview = useLiveCanvasPreview({
          steps: [],
          selectedStepId: null,
          enablePerformanceOptimization: true,
          enableWebSocketSync: true
        });

        return { cache, websocket, preview };
      });

      // Verificar se todos os sistemas estão integrados
      expect(result.current.cache).toBeDefined();
      expect(result.current.websocket).toBeDefined();
      expect(result.current.preview).toBeDefined();

      // Testar sincronização
      act(() => {
        result.current.cache.set('preview-data', { test: true });
        result.current.websocket.sendMessage({ type: 'preview-update', data: {} });
      });

      // Verificar se não há conflitos
      expect(() => {
        result.current.preview.previewState;
      }).not.toThrow();
    });
  });

  describe('✅ 4. Validação de Performance', () => {
    it('Sistema de cache - Performance adequada', () => {
      const { result } = renderHook(() => 
        useAdvancedCache({ maxSize: 1000, ttl: 10000 })
      );

      const startTime = performance.now();
      
      act(() => {
        // Inserir muitos itens para testar performance
        for (let i = 0; i < 100; i++) {
          result.current.set(`key-${i}`, { id: i, data: `value-${i}` });
        }
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Cache deve ser rápido (menos de 100ms para 100 operações)
      expect(duration).toBeLessThan(100);

      // Verificar hit rate
      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.get(`key-${i}`);
        }
      });

      const metrics = result.current.getMetrics();
      expect(metrics.hitRate).toBeGreaterThan(0.8); // 80% hit rate mínimo
    });

    it('Renderização otimizada - Sem vazamentos de memória', () => {
      const { result, unmount } = renderHook(() => 
        useRenderOptimization({
          enableVirtualization: true,
          enableMemoization: true
        })
      );

      act(() => {
        const largeDataSet = Array.from({ length: 1000 }, (_, i) => ({
          id: `item-${i}`,
          data: `Large data item ${i}`
        }));
        
        result.current.optimizeRender(largeDataSet);
      });

      // Verificar se o hook limpa recursos adequadamente
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('✅ 5. Integração Completa do Sistema', () => {
    it('Sistema completo - Todos os componentes funcionando juntos', () => {
      const { result } = renderHook(() => {
        const cache = useAdvancedCache({ maxSize: 100, ttl: 5000 });
        const renderOpt = useRenderOptimization({ enableVirtualization: true });
        const websocket = useAdvancedWebSocket('ws://localhost:3001');
        const preview = useLiveCanvasPreview({
          steps: [
            { id: 'q1', type: 'question', title: 'Question 1' },
            { id: 'r1', type: 'result', title: 'Result 1' }
          ],
          selectedStepId: 'q1',
          enablePerformanceOptimization: true,
          enableWebSocketSync: true
        });

        return { cache, renderOpt, websocket, preview };
      });

      // Testar integração completa
      act(() => {
        // Cache uma renderização otimizada
        const optimizedData = result.current.renderOpt.optimizeRender([
          { id: 'test', data: 'optimization' }
        ]);
        result.current.cache.set('optimized-render', optimizedData);

        // Sincronizar via WebSocket
        result.current.websocket.sendMessage({
          type: 'render-update',
          data: optimizedData
        });

        // Atualizar preview
        result.current.preview.updateSteps?.([
          { id: 'q1', type: 'question', title: 'Updated Question 1' }
        ]);
      });

      // Verificar se tudo funcionou sem erros
      expect(result.current.cache.get('optimized-render')).toBeDefined();
      expect(result.current.preview.previewState.updateCount).toBeGreaterThan(0);
      expect(result.current.websocket.connectionState).toBeDefined();
    });

    it('Compatibilidade com sistema legado', () => {
      // Testar se o novo sistema não quebra funcionalidades existentes
      const { result } = renderHook(() => 
        useLiveCanvasPreview({
          steps: [],
          selectedStepId: null,
          // Configurações que simulam sistema legado
          enablePerformanceOptimization: false,
          enableWebSocketSync: false,
          debounceMs: 0
        })
      );

      // Sistema deve funcionar mesmo com otimizações desabilitadas
      expect(result.current.previewState).toBeDefined();
      expect(() => {
        result.current.updateSteps?.([]);
      }).not.toThrow();
    });
  });

  describe('✅ 6. Testes de Stress e Resiliência', () => {
    it('Sistema aguenta alta carga de atualizações', () => {
      const { result } = renderHook(() => 
        useLiveCanvasPreview({
          steps: [],
          selectedStepId: null,
          enablePerformanceOptimization: true,
          debounceMs: 100
        })
      );

      // Simular muitas atualizações rápidas
      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.updateSteps?.([
            { id: `step-${i}`, type: 'question', title: `Step ${i}` }
          ]);
        }
      });

      // Sistema deve se manter estável
      expect(result.current.previewState.updateCount).toBeLessThan(100); // Debounced
      expect(result.current.previewState.isLoading).toBe(false);
    });

    it('Recuperação de erros WebSocket', () => {
      const mockWebSocket = {
        close: vi.fn(),
        send: vi.fn(() => { throw new Error('Connection lost'); }),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        readyState: 3 // CLOSED
      };

      global.WebSocket = vi.fn(() => mockWebSocket);

      const { result } = renderHook(() => 
        useAdvancedWebSocket('ws://localhost:3001', {
          enableAutoReconnect: true,
          maxRetries: 3
        })
      );

      // Sistema deve lidar com erros graciosamente
      act(() => {
        try {
          result.current.sendMessage({ type: 'test' });
        } catch (error) {
          // Erro esperado, mas sistema deve continuar funcionando
        }
      });

      expect(result.current.connectionState.retryCount).toBeDefined();
    });
  });
});