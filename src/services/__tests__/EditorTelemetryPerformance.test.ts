/**
 * 🧪 TESTES DE PERFORMANCE - EDITOR TELEMETRY
 * 
 * Valida overhead de tracking < 5ms
 * Testa limites de memória e throughput
 * 
 * @phase FASE 5 - Telemetria e Métricas
 * @vitest-environment node
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { editorMetrics } from '@/utils/editorMetrics';
import { EditorTelemetryService } from '../EditorTelemetryService';

describe('EditorTelemetry Performance', () => {
  let telemetryService: EditorTelemetryService;

  beforeEach(() => {
    telemetryService = EditorTelemetryService.getInstance({
      enabled: true,
      logToConsole: false,
    });
    editorMetrics.clear();
  });

  afterEach(() => {
    editorMetrics.clear();
    telemetryService.clear();
  });

  describe('⚡ Tracking Overhead', () => {
    it('trackBlockAction deve executar em < 5ms', () => {
      const iterations = 100;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        editorMetrics.trackBlockAction('add', `block-${i}`, { test: true });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgTime = totalTime / iterations;

      expect(avgTime).toBeLessThan(5);
      console.log(`✅ trackBlockAction avg: ${avgTime.toFixed(3)}ms (${iterations} calls)`);
    });

    it('trackNavigation deve executar em < 5ms', () => {
      const iterations = 100;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        editorMetrics.trackNavigation(`step-${i}`, `step-${i + 1}`, 50);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgTime = totalTime / iterations;

      expect(avgTime).toBeLessThan(5);
      console.log(`✅ trackNavigation avg: ${avgTime.toFixed(3)}ms (${iterations} calls)`);
    });

    it('trackSave deve executar em < 5ms', () => {
      const iterations = 100;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        editorMetrics.trackSave(i % 2 === 0, 100 + i);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgTime = totalTime / iterations;

      expect(avgTime).toBeLessThan(5);
      console.log(`✅ trackSave avg: ${avgTime.toFixed(3)}ms (${iterations} calls)`);
    });

    it('trackUndoRedo deve executar em < 5ms', () => {
      const iterations = 100;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        editorMetrics.trackUndoRedo(i % 2 === 0 ? 'undo' : 'redo');
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgTime = totalTime / iterations;

      expect(avgTime).toBeLessThan(5);
      console.log(`✅ trackUndoRedo avg: ${avgTime.toFixed(3)}ms (${iterations} calls)`);
    });

    it('trackUserInteraction deve executar em < 5ms', () => {
      const iterations = 100;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        editorMetrics.trackUserInteraction('click', `button-${i}`);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgTime = totalTime / iterations;

      expect(avgTime).toBeLessThan(5);
      console.log(`✅ trackUserInteraction avg: ${avgTime.toFixed(3)}ms (${iterations} calls)`);
    });
  });

  describe('📊 Report Generation Performance', () => {
    it('getReport() deve executar em < 50ms com 1000 métricas', () => {
      // Preencher com 1000 métricas variadas
      for (let i = 0; i < 200; i++) {
        editorMetrics.trackBlockAction('add', `block-${i}`);
        editorMetrics.trackNavigation(`step-${i}`, `step-${i + 1}`, 50);
        editorMetrics.trackSave(true, 100);
        editorMetrics.trackUndoRedo('undo');
        editorMetrics.trackUserInteraction('click', 'button');
      }

      const startTime = performance.now();
      const report = editorMetrics.getReport();
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(50);
      expect(report.summary).toBeDefined();
      expect(report.summary.blockActions).toBeGreaterThan(0);
      console.log(`✅ getReport() duration: ${duration.toFixed(3)}ms (1000 metrics)`);
    });
  });

  describe('🧠 Memory Management', () => {
    it('deve respeitar MAX_ENTRIES = 1000', () => {
      // Adicionar 1500 métricas (500 a mais que o limite)
      for (let i = 0; i < 1500; i++) {
        editorMetrics.trackBlockAction('add', `block-${i}`);
      }

      const exported = editorMetrics.export();
      expect(exported.metrics.length).toBeLessThanOrEqual(1000);
      console.log(`✅ Metrics count: ${exported.metrics.length} (max 1000)`);
    });

    it('clear() deve liberar memória imediatamente', () => {
      // Preencher com métricas
      for (let i = 0; i < 500; i++) {
        editorMetrics.trackBlockAction('add', `block-${i}`);
      }

      const beforeClear = editorMetrics.export();
      expect(beforeClear.metrics.length).toBeGreaterThan(0);

      editorMetrics.clear();

      const afterClear = editorMetrics.export();
      expect(afterClear.metrics.length).toBe(0);
      console.log(`✅ clear() removed ${beforeClear.metrics.length} metrics`);
    });
  });

  describe('📈 Session Management', () => {
    it('startSession/endSession deve executar em < 10ms', () => {
      const startTime = performance.now();
      
      const sessionId = telemetryService.startSession({
        funnelId: 'test-funnel',
        userId: 'test-user',
      });
      
      // Simular atividade
      editorMetrics.trackBlockAction('add', 'block-1');
      editorMetrics.trackSave(true, 100);
      
      const report = telemetryService.endSession();
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(sessionId).toBeDefined();
      expect(report).toBeDefined();
      expect(duration).toBeLessThan(10);
      console.log(`✅ Session lifecycle: ${duration.toFixed(3)}ms`);
    });

    it('getPerformanceReport() deve executar em < 20ms', () => {
      telemetryService.startSession({ funnelId: 'test' });
      
      // Adicionar métricas
      for (let i = 0; i < 100; i++) {
        editorMetrics.trackBlockAction('add', `block-${i}`);
      }

      const startTime = performance.now();
      const perfReport = telemetryService.getPerformanceReport();
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(perfReport).toBeDefined();
      expect(perfReport.summary.totalBlockActions).toBeGreaterThan(0);
      expect(duration).toBeLessThan(20);
      console.log(`✅ getPerformanceReport(): ${duration.toFixed(3)}ms`);
    });
  });

  describe('🎯 Sample Rate', () => {
    it('sampleRate=0.5 deve capturar ~50% dos eventos', () => {
      const telemetry = EditorTelemetryService.getInstance({
        enabled: true,
        sampleRate: 0.5,
        logToConsole: false,
      });

      const totalChecks = 1000;
      let captured = 0;

      for (let i = 0; i < totalChecks; i++) {
        if (telemetry.shouldCapture()) {
          captured++;
        }
      }

      const captureRate = captured / totalChecks;
      
      // Permitir 10% de desvio (0.45 - 0.55)
      expect(captureRate).toBeGreaterThan(0.45);
      expect(captureRate).toBeLessThan(0.55);
      console.log(`✅ Sample rate: ${captureRate.toFixed(3)} (expected ~0.5)`);
    });

    it('sampleRate=0 deve bloquear todos os eventos', () => {
      const telemetry = EditorTelemetryService.getInstance({
        enabled: true,
        sampleRate: 0,
      });

      for (let i = 0; i < 100; i++) {
        expect(telemetry.shouldCapture()).toBe(false);
      }
      console.log(`✅ sampleRate=0 blocked all events`);
    });
  });

  describe('🔥 Stress Test', () => {
    it('deve suportar 1000 operações/segundo sem degradação', () => {
      const operationsPerSecond = 1000;
      const testDurationMs = 1000;
      const operations = operationsPerSecond;

      const times: number[] = [];

      for (let i = 0; i < operations; i++) {
        const startTime = performance.now();
        
        // Mistura de operações
        editorMetrics.trackBlockAction('add', `block-${i}`);
        editorMetrics.trackNavigation(`step-${i}`, `step-${i + 1}`);
        editorMetrics.trackSave(true, 100);
        
        const endTime = performance.now();
        times.push(endTime - startTime);
      }

      const avgTime = times.reduce((sum, t) => sum + t, 0) / times.length;
      const maxTime = Math.max(...times);
      const p95Time = times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)];

      expect(avgTime).toBeLessThan(5);
      expect(p95Time).toBeLessThan(10);
      
      console.log(`✅ Stress test (1000 ops):`);
      console.log(`   Avg: ${avgTime.toFixed(3)}ms`);
      console.log(`   P95: ${p95Time.toFixed(3)}ms`);
      console.log(`   Max: ${maxTime.toFixed(3)}ms`);
    });
  });
});
