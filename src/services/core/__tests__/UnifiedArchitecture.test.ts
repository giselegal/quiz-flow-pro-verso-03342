import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resultFormatAdapter } from '../ResultFormatAdapter';
import { engineRegistry } from '../EngineRegistry';
import { monitoringService } from '../MonitoringService';

// Mock dependencies
vi.mock('../ResultCacheService', () => ({
  resultCacheService: {
    get: vi.fn(() => null),
    set: vi.fn(() => true),
    getStats: vi.fn(() => ({
      validEntries: 5,
      expiredEntries: 2,
      cacheSize: 1024
    }))
  }
}));

vi.mock('../StorageCleanupService', () => ({
  storageCleanupService: {
    getStorageStats: vi.fn(() => ({
      totalKeys: 10,
      legacyKeys: 3,
      totalSize: 2048
    }))
  }
}));

describe('Unified Architecture System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ResultFormatAdapter', () => {
    it('should convert CategoryScore array to unified format', () => {
      const categoryScores = [
        { category: 'Classic', score: 10, count: 5 },
        { category: 'Romantic', score: 8, count: 3 }
      ];

      const unified = resultFormatAdapter.fromCategoryScores(categoryScores, 'testUser');

      expect(unified.primaryStyle).toBe('Classic');
      expect(unified.percentage).toBe(56); // 10/18 * 100
      expect(unified.secondaryStyles).toContain('Romantic');
      expect(unified.metadata.source).toBe('useQuizResults');
      expect(unified.metadata.userName).toBe('testUser');
    });

    it('should auto-detect format and convert', () => {
      const categoryData = [
        { category: 'Classic', score: 15, count: 5 }
      ];

      const unified = resultFormatAdapter.autoDetectAndConvert(categoryData, 'testUser');

      expect(unified.primaryStyle).toBe('Classic');
      expect(unified.metadata.source).toBe('useQuizResults');
    });

    it('should validate unified results', () => {
      const validResult = {
        primaryStyle: 'Classic',
        confidence: 0.8,
        percentage: 80,
        secondaryStyles: ['Romantic'],
        allScores: { Classic: 10, Romantic: 5 },
        metadata: {
          source: 'useQuizResults' as const,
          version: '1.0',
          timestamp: new Date().toISOString()
        }
      };

      const validation = resultFormatAdapter.validate(validResult);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect invalid unified results', () => {
      const invalidResult = {
        primaryStyle: '', // Invalid: empty string
        confidence: -1,   // Invalid: negative
        percentage: 150,  // Invalid: > 100
        secondaryStyles: 'not-array', // Invalid: not array
        allScores: null,  // Invalid: null
        metadata: null    // Invalid: null
      };

      const validation = resultFormatAdapter.validate(invalidResult as any);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });

  describe('EngineRegistry', () => {
    it('should register engines with priorities', () => {
      const testEngine = {
        id: 'test-engine',
        name: 'Test Engine',
        version: '1.0.0',
        priority: 50,
        status: 'active' as const,
        capabilities: ['test'],
        description: 'Test engine for unit tests',
        execute: vi.fn().mockResolvedValue({ primaryStyle: 'Classic' })
      };

      engineRegistry.register(testEngine);
      const stats = engineRegistry.getStatistics();
      
      expect(stats.totalEngines).toBeGreaterThan(0);
      expect(stats.engineDetails.some(e => e.id === 'test-engine')).toBe(true);
    });

    it('should execute engines by priority', async () => {
      const mockData = { selections: { 'step-3': ['option1'] } };
      
      // Mock successful execution
      const result = await engineRegistry.executeWithPriority(mockData, {
        userName: 'testUser',
        useCache: false
      });

      expect(result.success).toBe(true);
      expect(result.engineId).toBeTruthy();
    });

    it('should provide engine statistics', () => {
      const stats = engineRegistry.getStatistics();
      
      expect(stats).toHaveProperty('totalEngines');
      expect(stats).toHaveProperty('activeEngines');
      expect(stats).toHaveProperty('successRate');
      expect(stats).toHaveProperty('engineDetails');
      expect(Array.isArray(stats.engineDetails)).toBe(true);
    });
  });

  describe('MonitoringService', () => {
    it('should log entries with different levels', () => {
      const initialLogCount = monitoringService.getLogs().length;
      
      monitoringService.log('info', 'test', 'Test message', { test: true });
      monitoringService.log('warn', 'test', 'Warning message');
      monitoringService.log('error', 'test', 'Error message');

      const logs = monitoringService.getLogs();
      expect(logs.length).toBe(initialLogCount + 3);
      
      const errorLogs = monitoringService.getLogs('error');
      expect(errorLogs.some(log => log.message === 'Error message')).toBe(true);
    });

    it('should record performance metrics', () => {
      const initialMetricCount = monitoringService.getMetrics().length;
      
      monitoringService.recordMetric('test_metric', 100, 'ms', { test: true });
      
      const metrics = monitoringService.getMetrics();
      expect(metrics.length).toBe(initialMetricCount + 1);
      
      const testMetrics = monitoringService.getMetrics(['test_metric']);
      expect(testMetrics.some(m => m.name === 'test_metric')).toBe(true);
    });

    it('should run health checks', async () => {
      const healthChecks = await monitoringService.runHealthChecks();
      
      expect(Array.isArray(healthChecks)).toBe(true);
      expect(healthChecks.length).toBeGreaterThan(0);
      
      healthChecks.forEach(check => {
        expect(check).toHaveProperty('component');
        expect(check).toHaveProperty('healthy');
        expect(check).toHaveProperty('message');
        expect(check).toHaveProperty('lastCheck');
      });
    });

    it('should detect engine conflicts', () => {
      const conflicts = monitoringService.detectEngineConflicts();
      
      expect(conflicts).toHaveProperty('hasConflicts');
      expect(conflicts).toHaveProperty('conflicts');
      expect(Array.isArray(conflicts.conflicts)).toBe(true);
    });

    it('should generate diagnostic report', async () => {
      const report = await monitoringService.generateDiagnosticReport();
      
      expect(report).toHaveProperty('timestamp');
      expect(report).toHaveProperty('summary');
      expect(report).toHaveProperty('healthChecks');
      expect(report).toHaveProperty('engineConflicts');
      expect(report).toHaveProperty('performance');
      expect(report).toHaveProperty('logs');
      expect(report).toHaveProperty('recommendations');
      
      expect(report.summary).toHaveProperty('systemHealth');
      expect(['healthy', 'degraded'].includes(report.summary.systemHealth)).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should work together as unified system', async () => {
      // 1. Test format adapter
      const mockData = { primaryStyle: 'Classic', styleScores: { Classic: 10 } };
      const unified = resultFormatAdapter.autoDetectAndConvert(mockData);
      
      expect(unified.primaryStyle).toBe('Classic');
      
      // 2. Test engine execution
      const engineResult = await engineRegistry.executeWithPriority({
        selections: { 'step-3': ['classic-option'] }
      }, { useCache: false });
      
      expect(engineResult).toHaveProperty('success');
      expect(engineResult).toHaveProperty('engineId');
      
      // 3. Test monitoring
      monitoringService.log('info', 'integration-test', 'System integration test completed');
      const healthChecks = await monitoringService.runHealthChecks();
      
      expect(healthChecks.length).toBeGreaterThan(0);
      
      // 4. Generate final report
      const report = await monitoringService.generateDiagnosticReport();
      expect(report.summary.systemHealth).toBeTruthy();
    });
  });
});