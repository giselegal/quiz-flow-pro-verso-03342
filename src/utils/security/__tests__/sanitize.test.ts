/**
 * 🧪 SECURITY TESTS - XSS Prevention
 * 
 * Testes de sanitização contra ataques XSS.
 * Valida que DOMPurify está bloqueando vetores de ataque comuns.
 * 
 * @version 1.0.0
 * @date 2025-01-17
 */

import { describe, it, expect } from 'vitest';
import {
  sanitizeHTML,
  sanitizeUserInput,
  sanitizeMarkdown,
  sanitizeURL,
  sanitizeObject,
  SecurityValidators,
} from '../sanitize';

describe('🛡️ XSS Prevention', () => {
  describe('sanitizeHTML', () => {
    it('deve remover tags <script>', () => {
      const dirty = '<script>alert("xss")</script><p>Safe text</p>';
      const clean = sanitizeHTML(dirty);
      
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('alert');
      expect(clean).toContain('Safe text');
    });

    it('deve remover event handlers inline', () => {
      const dirty = '<div onclick="alert(1)">Click me</div>';
      const clean = sanitizeHTML(dirty);
      
      expect(clean).not.toContain('onclick');
      expect(clean).toContain('Click me');
    });

    it('deve remover javascript: URLs', () => {
      const dirty = '<a href="javascript:alert(1)">Link</a>';
      const clean = sanitizeHTML(dirty);
      
      expect(clean).not.toContain('javascript:');
    });

    it('deve preservar HTML seguro', () => {
      const safe = '<p>Safe <strong>text</strong> with <em>formatting</em></p>';
      const clean = sanitizeHTML(safe);
      
      expect(clean).toContain('<p>');
      expect(clean).toContain('<strong>');
      expect(clean).toContain('<em>');
    });

    it('deve remover tags não permitidas', () => {
      const dirty = '<iframe src="evil.com"></iframe><p>Text</p>';
      const clean = sanitizeHTML(dirty);
      
      expect(clean).not.toContain('<iframe>');
      expect(clean).toContain('Text');
    });

    it('deve lidar com strings vazias', () => {
      expect(sanitizeHTML('')).toBe('');
      expect(sanitizeHTML(null as any)).toBe('');
      expect(sanitizeHTML(undefined as any)).toBe('');
    });
  });

  describe('sanitizeUserInput', () => {
    it('deve remover TODAS as tags HTML', () => {
      const dirty = '<script>alert("xss")</script>John Doe';
      const clean = sanitizeUserInput(dirty);
      
      expect(clean).toBe('John Doe');
      expect(clean).not.toContain('<');
      expect(clean).not.toContain('>');
    });

    it('deve remover tags mas manter conteúdo', () => {
      const dirty = '<p>Hello</p> <b>World</b>';
      const clean = sanitizeUserInput(dirty);
      
      expect(clean).toBe('Hello World');
    });

    it('deve lidar com múltiplas tentativas de XSS', () => {
      const attacks = [
        '<img src=x onerror=alert(1)>',
        '<svg onload=alert(1)>',
        '<body onload=alert(1)>',
        '<input onfocus=alert(1) autofocus>',
      ];
      
      attacks.forEach(attack => {
        const clean = sanitizeUserInput(attack);
        expect(clean).not.toContain('alert');
        expect(clean).not.toContain('onerror');
        expect(clean).not.toContain('onload');
        expect(clean).not.toContain('onfocus');
      });
    });
  });

  describe('sanitizeMarkdown', () => {
    it('deve permitir tags de markdown mas remover scripts', () => {
      const dirty = '<h1>Title</h1><script>alert(1)</script>';
      const clean = sanitizeMarkdown(dirty);
      
      expect(clean).toContain('<h1>');
      expect(clean).not.toContain('<script>');
    });

    it('deve permitir links seguros', () => {
      const safe = '<a href="https://example.com">Link</a>';
      const clean = sanitizeMarkdown(safe);
      
      expect(clean).toContain('<a');
      expect(clean).toContain('href');
    });

    it('deve remover protocolos perigosos em links', () => {
      const dirty = '<a href="javascript:alert(1)">Link</a>';
      const clean = sanitizeMarkdown(dirty);
      
      expect(clean).not.toContain('javascript:');
    });
  });

  describe('sanitizeURL', () => {
    it('deve aceitar URLs https válidas', () => {
      const url = 'https://example.com/page';
      const clean = sanitizeURL(url);
      
      expect(clean).toBe(url);
    });

    it('deve aceitar URLs http válidas', () => {
      const url = 'http://example.com';
      const clean = sanitizeURL(url);
      
      // URL() normaliza adicionando trailing slash
      expect(clean).toBe('http://example.com/');
    });

    it('deve bloquear javascript:', () => {
      const dirty = 'javascript:alert(1)';
      const clean = sanitizeURL(dirty);
      
      expect(clean).toBe('');
    });

    it('deve bloquear data: URLs', () => {
      const dirty = 'data:text/html,<script>alert(1)</script>';
      const clean = sanitizeURL(dirty);
      
      expect(clean).toBe('');
    });

    it('deve aceitar mailto:', () => {
      const email = 'mailto:user@example.com';
      const clean = sanitizeURL(email);
      
      expect(clean).toContain('mailto:');
    });

    it('deve aceitar tel:', () => {
      const tel = 'tel:+1234567890';
      const clean = sanitizeURL(tel);
      
      expect(clean).toContain('tel:');
    });

    it('deve lidar com URLs inválidas', () => {
      expect(sanitizeURL('not a url')).toBe('');
      expect(sanitizeURL('')).toBe('');
      expect(sanitizeURL(null as any)).toBe('');
    });
  });

  describe('sanitizeObject', () => {
    it('deve manter apenas chaves permitidas', () => {
      const obj = {
        name: 'John',
        email: 'john@example.com',
        password: 'secret',
      };
      
      const clean = sanitizeObject(obj, ['name', 'email']);
      
      expect(clean).toHaveProperty('name');
      expect(clean).toHaveProperty('email');
      expect(clean).not.toHaveProperty('password');
    });

    it('deve remover chaves perigosas', () => {
      const obj = {
        name: 'John',
        __proto__: { isAdmin: true },
        constructor: () => {},
      } as any;
      
      const clean = sanitizeObject(obj, ['name', '__proto__', 'constructor']);
      
      expect(clean).toHaveProperty('name');
      expect(clean).not.toHaveProperty('__proto__');
      expect(clean).not.toHaveProperty('constructor');
    });

    it('deve sanitizar valores string', () => {
      const obj = {
        name: '<script>alert(1)</script>John',
        age: 25,
      };
      
      const clean = sanitizeObject(obj, ['name', 'age']);
      
      expect(clean.name).toBe('John');
      expect(clean.age).toBe(25);
    });
  });

  describe('SecurityValidators', () => {
    describe('hasSuspiciousHTML', () => {
      it('deve detectar <script> tags', () => {
        expect(SecurityValidators.hasSuspiciousHTML('<script>')).toBe(true);
        expect(SecurityValidators.hasSuspiciousHTML('Normal text')).toBe(false);
      });

      it('deve detectar event handlers', () => {
        expect(SecurityValidators.hasSuspiciousHTML('onclick=')).toBe(true);
        expect(SecurityValidators.hasSuspiciousHTML('onload=')).toBe(true);
        expect(SecurityValidators.hasSuspiciousHTML('onerror=')).toBe(true);
      });

      it('deve detectar javascript: protocol', () => {
        expect(SecurityValidators.hasSuspiciousHTML('javascript:alert')).toBe(true);
      });

      it('deve detectar tags perigosas', () => {
        expect(SecurityValidators.hasSuspiciousHTML('<iframe>')).toBe(true);
        expect(SecurityValidators.hasSuspiciousHTML('<object>')).toBe(true);
        expect(SecurityValidators.hasSuspiciousHTML('<embed>')).toBe(true);
      });
    });

    describe('isSafeURL', () => {
      it('deve validar URLs seguras', () => {
        expect(SecurityValidators.isSafeURL('https://example.com')).toBe(true);
        expect(SecurityValidators.isSafeURL('http://example.com')).toBe(true);
        expect(SecurityValidators.isSafeURL('mailto:user@example.com')).toBe(true);
      });

      it('deve rejeitar URLs perigosas', () => {
        expect(SecurityValidators.isSafeURL('javascript:alert(1)')).toBe(false);
        expect(SecurityValidators.isSafeURL('data:text/html')).toBe(false);
      });
    });

    describe('isWithinLimit', () => {
      it('deve validar limite de caracteres', () => {
        expect(SecurityValidators.isWithinLimit('short', 10)).toBe(true);
        expect(SecurityValidators.isWithinLimit('too long text', 5)).toBe(false);
      });
    });
  });

  describe('🎯 Vetores de Ataque Comuns (OWASP)', () => {
    const commonXSSVectors = [
      '<script>alert(1)</script>',
      '<img src=x onerror=alert(1)>',
      '<svg/onload=alert(1)>',
      '<iframe src=javascript:alert(1)>',
      '<body onload=alert(1)>',
      '<input autofocus onfocus=alert(1)>',
      '<select autofocus onfocus=alert(1)>',
      '<textarea autofocus onfocus=alert(1)>',
      '<keygen autofocus onfocus=alert(1)>',
      '<video><source onerror="alert(1)">',
      '<audio src=x onerror=alert(1)>',
      '<details open ontoggle=alert(1)>',
      '<marquee onstart=alert(1)>',
    ];

    it('deve bloquear todos os vetores comuns de XSS', () => {
      commonXSSVectors.forEach(vector => {
        const clean = sanitizeHTML(vector);
        
        expect(clean).not.toContain('alert');
        expect(clean).not.toContain('onerror');
        expect(clean).not.toContain('onload');
        expect(clean).not.toContain('javascript:');
      });
    });

    it('deve bloquear XSS em inputs de usuário', () => {
      commonXSSVectors.forEach(vector => {
        const clean = sanitizeUserInput(vector);
        
        expect(clean).not.toContain('alert');
        expect(clean).not.toContain('<script');
        expect(clean).not.toContain('<img');
      });
    });
  });
});

/**
 * VALIDAÇÃO DE SEGURANÇA
 * 
 * Este arquivo testa:
 * ✅ Remoção de <script> tags
 * ✅ Remoção de event handlers (onclick, onerror, etc)
 * ✅ Bloqueio de javascript: e data: URLs
 * ✅ Sanitização de inputs de usuário
 * ✅ Validação de URLs seguras
 * ✅ Proteção contra prototype pollution
 * ✅ 13+ vetores comuns de XSS (OWASP)
 * 
 * Cobertura: XSS prevention completa
 */
