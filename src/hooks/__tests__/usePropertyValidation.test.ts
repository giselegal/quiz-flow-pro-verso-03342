/**
 * 🧪 TESTES: usePropertyValidation
 * 
 * Exemplos de uso do hook de validação G26 + G11
 */

import { describe, it, expect } from 'vitest';
import { validateBlockData, generatePropertySchema, PropertyConfig } from '../usePropertyValidation';
import { z } from 'zod';

describe('usePropertyValidation', () => {
  describe('generatePropertySchema', () => {
    it('deve gerar schema Zod para campos de texto obrigatórios', () => {
      const properties: PropertyConfig[] = [
        {
          key: 'content.text',
          label: 'Texto',
          type: 'text',
          category: 'content',
          validation: { required: true, minLength: 5 },
        },
      ];

      const schema = generatePropertySchema(properties);
      
      // Valid data
      expect(() => schema.parse({ 'content.text': 'Hello World' })).not.toThrow();
      
      // Too short
      expect(() => schema.parse({ 'content.text': 'Hi' })).toThrow();
      
      // Empty
      expect(() => schema.parse({ 'content.text': '' })).toThrow();
    });

    it('deve validar números com min/max', () => {
      const properties: PropertyConfig[] = [
        {
          key: 'properties.fontSize',
          label: 'Tamanho da Fonte',
          type: 'number',
          category: 'style',
          validation: { min: 10, max: 100 },
        },
      ];

      const schema = generatePropertySchema(properties);
      
      // Valid
      expect(() => schema.parse({ 'properties.fontSize': 50 })).not.toThrow();
      
      // Too small
      expect(() => schema.parse({ 'properties.fontSize': 5 })).toThrow();
      
      // Too large
      expect(() => schema.parse({ 'properties.fontSize': 150 })).toThrow();
    });

    it('deve validar URLs', () => {
      const properties: PropertyConfig[] = [
        {
          key: 'content.src',
          label: 'URL da Imagem',
          type: 'url',
          category: 'content',
          validation: { required: true },
        },
      ];

      const schema = generatePropertySchema(properties);
      
      // Valid URL
      expect(() => schema.parse({ 'content.src': 'https://example.com/image.jpg' })).not.toThrow();
      
      // Invalid URL
      expect(() => schema.parse({ 'content.src': 'not-a-url' })).toThrow();
    });

    it('deve validar cores hexadecimais', () => {
      const properties: PropertyConfig[] = [
        {
          key: 'properties.color',
          label: 'Cor',
          type: 'color',
          category: 'style',
        },
      ];

      const schema = generatePropertySchema(properties);
      
      // Valid colors
      expect(() => schema.parse({ 'properties.color': '#FF5733' })).not.toThrow();
      expect(() => schema.parse({ 'properties.color': '#FFF' })).not.toThrow();
      
      // Invalid colors
      expect(() => schema.parse({ 'properties.color': 'red' })).toThrow();
      expect(() => schema.parse({ 'properties.color': '#GG5733' })).toThrow();
    });

    it('deve validar select com enum values', () => {
      const properties: PropertyConfig[] = [
        {
          key: 'properties.variant',
          label: 'Variante',
          type: 'select',
          category: 'style',
          options: [
            { value: 'default', label: 'Padrão' },
            { value: 'outline', label: 'Contorno' },
          ],
        },
      ];

      const schema = generatePropertySchema(properties);
      
      // Valid options
      expect(() => schema.parse({ 'properties.variant': 'default' })).not.toThrow();
      expect(() => schema.parse({ 'properties.variant': 'outline' })).not.toThrow();
      
      // Invalid option
      expect(() => schema.parse({ 'properties.variant': 'invalid' })).toThrow();
    });
  });

  describe('validateBlockData', () => {
    it('deve retornar success com dados válidos', () => {
      const properties: PropertyConfig[] = [
        {
          key: 'content.text',
          label: 'Texto',
          type: 'text',
          category: 'content',
          validation: { required: true },
        },
      ];

      const result = validateBlockData(properties, { 'content.text': 'Valid Text' });
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data['content.text']).toBe('Valid Text');
      }
    });

    it('deve retornar errors com dados inválidos', () => {
      const properties: PropertyConfig[] = [
        {
          key: 'content.text',
          label: 'Texto',
          type: 'text',
          category: 'content',
          validation: { required: true, minLength: 5 },
        },
      ];

      const result = validateBlockData(properties, { 'content.text': 'Hi' });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors[0].path).toBe('content.text');
        expect(result.errors[0].message).toContain('5 caracteres');
      }
    });

    it('deve validar múltiplos campos simultaneamente', () => {
      const properties: PropertyConfig[] = [
        {
          key: 'content.text',
          label: 'Texto',
          type: 'text',
          category: 'content',
          validation: { required: true },
        },
        {
          key: 'properties.fontSize',
          label: 'Tamanho',
          type: 'number',
          category: 'style',
          validation: { min: 10, max: 100 },
        },
        {
          key: 'content.url',
          label: 'URL',
          type: 'url',
          category: 'content',
        },
      ];

      // All valid
      const validResult = validateBlockData(properties, {
        'content.text': 'Valid Text',
        'properties.fontSize': 50,
        'content.url': 'https://example.com',
      });
      expect(validResult.success).toBe(true);

      // Multiple errors
      const invalidResult = validateBlockData(properties, {
        'content.text': '', // Too short
        'properties.fontSize': 5, // Too small
        'content.url': 'not-a-url', // Invalid URL
      });
      expect(invalidResult.success).toBe(false);
      if (!invalidResult.success) {
        expect(invalidResult.errors.length).toBe(3);
      }
    });
  });
});
