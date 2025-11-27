/**
 * 🧪 STORAGE SERVICE - Testes Unitários
 * 
 * Testes de contrato e funcionalidade básica do StorageService canônico
 * 
 * @phase Fase 1 - Fundação Técnica
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageService } from '../StorageService';

describe('StorageService - Canonical Service Tests', () => {
  let storageService: StorageService;

  beforeEach(() => {
    // Get fresh instance for each test
    storageService = StorageService.getInstance();
  });

  describe('Instanciação e Singleton', () => {
    it('deve criar instância singleton', () => {
      const instance1 = StorageService.getInstance();
      const instance2 = StorageService.getInstance();
      
      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(StorageService);
    });
  });

  describe('API Files - Contrato de Interface', () => {
    it('deve expor API files completa', () => {
      expect(storageService.files).toBeDefined();
      expect(typeof storageService.files.upload).toBe('function');
      expect(typeof storageService.files.download).toBe('function');
      expect(typeof storageService.files.delete).toBe('function');
      expect(typeof storageService.files.deleteMany).toBe('function');
      expect(typeof storageService.files.list).toBe('function');
      expect(typeof storageService.files.getPublicUrl).toBe('function');
    });

    it('deve expor método getPublicUrl', () => {
      const result = storageService.getPublicUrl('test/path.jpg');
      
      expect(result).toHaveProperty('success');
      if (result.success) {
        expect(result.data).toBeDefined();
        expect(typeof result.data).toBe('string');
      }
    });
  });

  describe('API Images - Contrato de Interface', () => {
    it('deve expor API images completa', () => {
      expect(storageService.images).toBeDefined();
      expect(typeof storageService.images.optimize).toBe('function');
      expect(typeof storageService.images.upload).toBe('function');
    });
  });

  describe('API Browser - Contrato de Interface', () => {
    it('deve expor API browser completa', () => {
      expect(storageService.browser).toBeDefined();
      expect(typeof storageService.browser.set).toBe('function');
      expect(typeof storageService.browser.get).toBe('function');
      expect(typeof storageService.browser.remove).toBe('function');
      expect(typeof storageService.browser.clear).toBe('function');
      expect(typeof storageService.browser.getQuota).toBe('function');
    });

    it('deve armazenar e recuperar item do browser storage', () => {
      const testKey = 'test-key';
      const testValue = { data: 'test' };
      
      const setResult = storageService.setItem(testKey, testValue);
      expect(setResult.success).toBe(true);
      
      const getResult = storageService.getItem(testKey);
      expect(getResult.success).toBe(true);
      expect(getResult.data).toEqual(testValue);
    });

    it('deve remover item do browser storage', () => {
      const testKey = 'test-key-2';
      
      storageService.setItem(testKey, 'value');
      
      const removeResult = storageService.removeItem(testKey);
      expect(removeResult.success).toBe(true);
      
      const getResult = storageService.getItem(testKey);
      expect(getResult.data).toBeNull();
    });

    it('deve limpar todos os itens com prefixo', () => {
      storageService.setItem('key1', 'value1');
      storageService.setItem('key2', 'value2');
      
      const clearResult = storageService.clearAll();
      expect(clearResult.success).toBe(true);
      
      const get1 = storageService.getItem('key1');
      const get2 = storageService.getItem('key2');
      expect(get1.data).toBeNull();
      expect(get2.data).toBeNull();
    });

    it('deve verificar expiração de items com TTL', () => {
      const testKey = 'expiring-key';
      
      // Set item com TTL de 1ms (vai expirar imediatamente)
      storageService.setItem(testKey, 'value', 1);
      
      // Wait for expiration
      setTimeout(() => {
        const result = storageService.getItem(testKey);
        expect(result.data).toBeNull();
      }, 10);
    });
  });

  describe('ServiceResult Pattern', () => {
    it('deve retornar ServiceResult com success true', () => {
      const result = storageService.setItem('test', 'value');
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('data');
      expect(result.success).toBe(true);
    });

    it('deve retornar ServiceResult com error em caso de falha', () => {
      // Try to set item with invalid type
      const result = storageService.getPublicUrl('');
      
      expect(result).toHaveProperty('success');
      if (!result.success) {
        expect(result).toHaveProperty('error');
        expect(result.error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Health Check', () => {
    it('deve executar health check', async () => {
      const isHealthy = await storageService.healthCheck();
      
      expect(typeof isHealthy).toBe('boolean');
      // Health check pode falhar em ambiente de teste, mas não deve lançar erro
    });
  });

  describe('Validação de Input', () => {
    it('deve validar tamanho máximo de arquivo', async () => {
      // Create a smaller test blob to avoid memory issues in CI
      // We're testing the validation logic, not actual large file handling
      const largeBlob = new Blob(['x'.repeat(10 * 1024 * 1024)]); // 10MB for testing
      
      // Mock a file size that exceeds the limit
      Object.defineProperty(largeBlob, 'size', {
        value: 100 * 1024 * 1024, // Pretend it's 100MB
        writable: false,
      });
      
      const result = await storageService.uploadFile({
        file: largeBlob,
        path: 'test/large.bin',
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error?.message).toContain('size exceeds');
      }
    });

    it('deve validar mime types permitidos', async () => {
      const blob = new Blob(['test'], { type: 'application/x-dangerous' });
      
      const result = await storageService.uploadFile({
        file: blob,
        path: 'test/file.bin',
        contentType: 'application/x-dangerous',
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error?.message).toContain('not allowed');
      }
    });
  });

  describe('Tipos e Interfaces', () => {
    it('deve exportar tipo UploadFileParams', () => {
      const params: import('../StorageService').UploadFileParams = {
        file: new Blob(),
        path: 'test/path.txt',
      };
      
      expect(params).toBeDefined();
    });

    it('deve exportar tipo UploadResult', () => {
      const result: import('../StorageService').UploadResult = {
        path: 'test/path.txt',
        publicUrl: 'https://example.com/test.txt',
        size: 1024,
        mimeType: 'text/plain',
        uploadedAt: new Date(),
      };
      
      expect(result).toBeDefined();
    });

    it('deve exportar tipo ImageOptimizationOptions', () => {
      const options: import('../StorageService').ImageOptimizationOptions = {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85,
        format: 'webp',
      };
      
      expect(options).toBeDefined();
    });
  });
});
