/**
 * Tests for ID Generator - UUID v4 based ID generation
 * 
 * Validates that IDs are unique and follow expected format
 */

import { describe, it, expect } from 'vitest';
import {
  generateBlockId,
  generateFunnelId,
  generateSessionId,
  generateCustomStepId,
  generateOfflineId,
  generatePersonaId,
  generateBrandId,
  generateClientId,
  generateResponseId,
  generateComponentId,
  generateHistoryId,
  generateErrorId,
  generateMetricId,
  generateAlertId,
  generateNotificationId,
  generateChatId,
  generateCommentId,
  generateEventId,
  generatePageId,
  generateApiKey,
  generateFileName,
  generateTimerId,
  isValidGeneratedId
} from '../idGenerator';

describe('ID Generator', () => {
  describe('Uniqueness Tests', () => {
    it('should generate unique IDs across multiple calls', () => {
      const ids = new Set();
      const iterations = 1000;
      
      for (let i = 0; i < iterations; i++) {
        ids.add(generateBlockId());
        ids.add(generateFunnelId());
        ids.add(generateSessionId());
      }
      
      // All IDs should be unique
      expect(ids.size).toBe(iterations * 3);
    });

    it('should not produce collisions even with rapid generation', () => {
      const blockIds: string[] = [];
      for (let i = 0; i < 100; i++) {
        blockIds.push(generateBlockId());
      }
      
      const uniqueIds = new Set(blockIds);
      expect(uniqueIds.size).toBe(blockIds.length);
    });
  });

  describe('Format Tests', () => {
    it('should generate block IDs with correct prefix', () => {
      const id = generateBlockId();
      expect(id).toMatch(/^block-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate funnel IDs with correct prefix', () => {
      const id = generateFunnelId();
      expect(id).toMatch(/^funnel-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate session IDs with correct prefix', () => {
      const id = generateSessionId();
      expect(id).toMatch(/^session-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate custom step IDs with correct prefix', () => {
      const id = generateCustomStepId();
      expect(id).toMatch(/^step-custom-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate offline IDs with correct prefix', () => {
      const id = generateOfflineId();
      expect(id).toMatch(/^offline_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate persona IDs with correct prefix', () => {
      const id = generatePersonaId();
      expect(id).toMatch(/^persona-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate response IDs with correct prefix', () => {
      const id = generateResponseId();
      expect(id).toMatch(/^response_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate component IDs with correct prefix', () => {
      const id = generateComponentId();
      expect(id).toMatch(/^comp_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate error IDs with correct prefix', () => {
      const id = generateErrorId();
      expect(id).toMatch(/^error_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate history IDs as pure UUID v4', () => {
      const id = generateHistoryId();
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });

  describe('Parameterized ID Generation', () => {
    it('should generate API keys with client ID', () => {
      const clientId = 'test-client-123';
      const apiKey = generateApiKey(clientId);
      expect(apiKey).toMatch(/^wl_test-client-123_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate file names with userId and extension', () => {
      const userId = 'user123';
      const ext = 'png';
      const fileName = generateFileName(userId, ext);
      expect(fileName).toMatch(/^user123-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.png$/i);
    });

    it('should generate timer IDs with custom prefix', () => {
      const prefix = 'performance-test';
      const timerId = generateTimerId(prefix);
      expect(timerId).toMatch(/^performance-test-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });

  describe('Validation Tests', () => {
    it('should validate correctly formatted IDs', () => {
      const validIds = [
        generateBlockId(),
        generateFunnelId(),
        generateSessionId(),
        generatePageId()
      ];

      validIds.forEach(id => {
        expect(isValidGeneratedId(id)).toBe(true);
      });
    });

    it('should reject invalid ID formats', () => {
      const invalidIds = [
        'block-123',
        'funnel-abc',
        'not-a-uuid',
        'block-12345678',
        ''
      ];

      invalidIds.forEach(id => {
        expect(isValidGeneratedId(id)).toBe(false);
      });
    });

    it('should validate history IDs (pure UUID)', () => {
      const historyId = generateHistoryId();
      // History IDs are pure UUIDs without prefix, so standard validation won't work
      // Let's just check format
      expect(historyId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });

  describe('All ID Types', () => {
    it('should generate all ID types without errors', () => {
      expect(() => {
        generateBlockId();
        generateFunnelId();
        generateSessionId();
        generateCustomStepId();
        generateOfflineId();
        generatePersonaId();
        generateBrandId();
        generateClientId();
        generateResponseId();
        generateComponentId();
        generateHistoryId();
        generateErrorId();
        generateMetricId();
        generateAlertId();
        generateNotificationId();
        generateChatId();
        generateCommentId();
        generateEventId();
        generatePageId();
        generateApiKey('test');
        generateFileName('user', 'jpg');
        generateTimerId('test');
      }).not.toThrow();
    });

    it('should generate different IDs for different types', () => {
      const ids = {
        block: generateBlockId(),
        funnel: generateFunnelId(),
        session: generateSessionId(),
        page: generatePageId(),
      };

      // All should be different
      const uniqueIds = new Set(Object.values(ids));
      expect(uniqueIds.size).toBe(4);

      // Each should have correct prefix
      expect(ids.block).toContain('block-');
      expect(ids.funnel).toContain('funnel-');
      expect(ids.session).toContain('session-');
      expect(ids.page).toContain('page-');
    });
  });

  describe('Performance Tests', () => {
    it('should generate IDs quickly', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        generateBlockId();
      }
      const duration = performance.now() - start;
      
      // Should generate 1000 IDs in less than 100ms
      expect(duration).toBeLessThan(100);
    });
  });
});
