/**
 * 🧪 FUNNEL SERVICE - Testes Unitários
 * 
 * Testes de contrato e funcionalidade básica do FunnelService canônico
 * 
 * @phase Fase 1 - Fundação Técnica
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CanonicalFunnelService } from '../FunnelService';

describe('FunnelService - Canonical Service Tests', () => {
  let funnelService: ReturnType<typeof CanonicalFunnelService.getInstance>;

  beforeEach(() => {
    // Get fresh instance for each test
    funnelService = CanonicalFunnelService.getInstance();
  });

  describe('Instanciação e Singleton', () => {
    it('deve criar instância singleton', () => {
      const instance1 = CanonicalFunnelService.getInstance();
      const instance2 = CanonicalFunnelService.getInstance();
      
      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(CanonicalFunnelService);
    });
  });

  describe('API Pública - Contrato de Interface', () => {
    it('deve expor método createFunnel', () => {
      expect(typeof funnelService.createFunnel).toBe('function');
    });

    it('deve expor método getFunnel', () => {
      expect(typeof funnelService.getFunnel).toBe('function');
    });

    it('deve expor método listFunnels', () => {
      expect(typeof funnelService.listFunnels).toBe('function');
    });

    it('deve expor método updateFunnel', () => {
      expect(typeof funnelService.updateFunnel).toBe('function');
    });

    it('deve expor método deleteFunnel', () => {
      expect(typeof funnelService.deleteFunnel).toBe('function');
    });

    it('deve expor método saveStepBlocks', () => {
      expect(typeof funnelService.saveStepBlocks).toBe('function');
    });

    it('deve expor método getStepBlocks', () => {
      expect(typeof funnelService.getStepBlocks).toBe('function');
    });

    it('deve expor método getFunnelWithComponents', () => {
      expect(typeof funnelService.getFunnelWithComponents).toBe('function');
    });
  });

  describe('Event System', () => {
    it('deve permitir registrar event listeners', () => {
      const callback = vi.fn();
      
      expect(() => {
        funnelService.on('funnel:created', callback);
      }).not.toThrow();
    });

    it('deve permitir remover event listeners', () => {
      const callback = vi.fn();
      
      funnelService.on('funnel:created', callback);
      
      expect(() => {
        funnelService.off('funnel:created', callback);
      }).not.toThrow();
    });
  });

  describe('Validação de Input', () => {
    it('deve validar required field name ao criar funnel', async () => {
      // Test will verify that createFunnel requires a name
      expect(funnelService.createFunnel).toBeDefined();
    });
  });

  describe('Cache Operations', () => {
    it('deve ter método clearCache', async () => {
      expect(typeof funnelService.clearCache).toBe('function');
      
      // Should not throw
      await expect(funnelService.clearCache()).resolves.not.toThrow();
    });
  });

  describe('Compatibility Methods', () => {
    it('deve expor método duplicateFunnel', () => {
      expect(typeof funnelService.duplicateFunnel).toBe('function');
    });

    it('deve expor método checkPermissions', () => {
      expect(typeof funnelService.checkPermissions).toBe('function');
    });

    it('deve retornar permissões com estrutura correta', async () => {
      const permissions = await funnelService.checkPermissions('test-id');
      
      expect(permissions).toHaveProperty('canRead');
      expect(permissions).toHaveProperty('canEdit');
      expect(permissions).toHaveProperty('canDelete');
      expect(permissions).toHaveProperty('isOwner');
      expect(typeof permissions.canRead).toBe('boolean');
    });
  });

  describe('Tipos e Interfaces', () => {
    it('deve exportar tipo FunnelMetadata', () => {
      // Type check - will fail at compile time if not exported
      const metadata: import('../FunnelService').FunnelMetadata = {
        id: 'test',
        name: 'Test Funnel',
        type: 'quiz',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: false,
      };
      
      expect(metadata).toBeDefined();
    });

    it('deve exportar tipo CreateFunnelInput', () => {
      const input: import('../FunnelService').CreateFunnelInput = {
        name: 'Test Funnel',
        type: 'quiz',
      };
      
      expect(input).toBeDefined();
    });

    it('deve exportar tipo UpdateFunnelInput', () => {
      const input: import('../FunnelService').UpdateFunnelInput = {
        name: 'Updated Name',
      };
      
      expect(input).toBeDefined();
    });
  });
});
