/**
 * 🛡️ SECURITY UTILITIES - XSS Prevention
 * 
 * Utilitários de sanitização para prevenir ataques XSS (Cross-Site Scripting).
 * Usa DOMPurify para limpar HTML e inputs de usuário.
 * 
 * @see https://github.com/cure53/DOMPurify
 * @version 1.0.0
 * @date 2025-01-17
 */

import DOMPurifyFactory from 'dompurify';
import { JSDOM } from 'jsdom';

// DOMPurify precisa de window no Node.js (para testes)
const window = new JSDOM('').window;
const DOMPurify = DOMPurifyFactory(window as any);

/**
 * Configuração padrão de sanitização para HTML rico
 * Permite tags básicas de formatação mas remove scripts e eventos
 */
const HTML_CONFIG = {
  ALLOWED_TAGS: [
    'b', 'i', 'em', 'strong', 'u', 's', 'mark',
    'a', 'p', 'br', 'span', 'div',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'code', 'pre',
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'target', 'rel',
    'class', 'id',
  ],
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
};

/**
 * Configuração estrita: remove TODAS as tags HTML
 * Para inputs de texto puro onde HTML não deve ser permitido
 */
const STRICT_CONFIG = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true, // Mantém conteúdo mas remove tags
};

/**
 * Configuração para markdown seguro
 * Permite tags necessárias para renderizar markdown
 */
const MARKDOWN_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'span',
    'strong', 'em', 'u', 'code',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'pre',
    'a',
  ],
  ALLOWED_ATTR: ['href', 'title', 'class'],
  ALLOW_DATA_ATTR: false,
};

/**
 * Sanitiza HTML permitindo tags básicas de formatação
 * 
 * @param dirty - String HTML potencialmente perigosa
 * @param config - Configuração customizada (opcional)
 * @returns HTML sanitizado e seguro
 * 
 * @example
 * ```ts
 * const unsafe = '<script>alert("xss")</script><p>Safe text</p>';
 * const safe = sanitizeHTML(unsafe);
 * // Resultado: '<p>Safe text</p>'
 * ```
 */
export function sanitizeHTML(
  dirty: string,
  config: any = HTML_CONFIG
): string {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }
  
  return String(DOMPurify.sanitize(dirty, config));
}

/**
 * Sanitiza input de usuário removendo TODAS as tags HTML
 * Ideal para campos de texto, nomes, emails, etc.
 * 
 * @param input - Input do usuário
 * @returns Texto limpo sem HTML
 * 
 * @example
 * ```ts
 * const unsafe = '<script>alert("xss")</script>John Doe';
 * const safe = sanitizeUserInput(unsafe);
 * // Resultado: 'John Doe'
 * ```
 */
export function sanitizeUserInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return String(DOMPurify.sanitize(input, STRICT_CONFIG));
}

/**
 * Sanitiza conteúdo markdown renderizado
 * Permite apenas tags seguras necessárias para markdown
 * 
 * @param markdown - HTML renderizado de markdown
 * @returns HTML sanitizado
 * 
 * @example
 * ```ts
 * const rendered = marked.parse('**Bold** text');
 * const safe = sanitizeMarkdown(rendered);
 * ```
 */
export function sanitizeMarkdown(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }
  
  return String(DOMPurify.sanitize(markdown, MARKDOWN_CONFIG));
}

/**
 * Sanitiza URL verificando protocolo seguro
 * Remove javascript:, data:, e outros protocolos perigosos
 * 
 * @param url - URL a ser validada
 * @returns URL sanitizada ou string vazia se inválida
 * 
 * @example
 * ```ts
 * sanitizeURL('javascript:alert(1)') // ''
 * sanitizeURL('https://example.com') // 'https://example.com'
 * ```
 */
export function sanitizeURL(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }
  
  // Remove espaços
  url = url.trim();
  
  // Lista de protocolos seguros
  const SAFE_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];
  
  try {
    // Verifica se tem protocolo válido
    const hasProtocol = /^[a-z]+:/i.test(url);
    
    if (!hasProtocol) {
      // URLs sem protocolo são inválidas para nosso caso
      return '';
    }
    
    const parsed = new URL(url);
    
    if (SAFE_PROTOCOLS.includes(parsed.protocol)) {
      return parsed.href;
    }
  } catch (e) {
    // URL inválida
  }
  
  return '';
}

/**
 * Sanitiza atributos de objeto removendo propriedades perigosas
 * Útil para sanitizar objetos JSON vindos de APIs
 * 
 * @param obj - Objeto a ser sanitizado
 * @param allowedKeys - Lista de chaves permitidas
 * @returns Objeto sanitizado
 * 
 * @example
 * ```ts
 * const unsafe = {
 *   name: 'John',
 *   __proto__: { isAdmin: true },
 *   constructor: () => {}
 * };
 * const safe = sanitizeObject(unsafe, ['name']);
 * // Resultado: { name: 'John' }
 * ```
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  allowedKeys: string[]
): Partial<T> {
  if (!obj || typeof obj !== 'object') {
    return {};
  }
  
  const sanitized: Partial<T> = {};
  
  // Lista de chaves perigosas a sempre remover
  const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype'];
  
  for (const key of allowedKeys) {
    if (DANGEROUS_KEYS.includes(key)) {
      continue;
    }
    
    if (key in obj) {
      const value = obj[key];
      
      // Sanitizar strings
      if (typeof value === 'string') {
        sanitized[key as keyof T] = sanitizeUserInput(value) as any;
      } else {
        sanitized[key as keyof T] = value;
      }
    }
  }
  
  return sanitized;
}

/**
 * Hook React para sanitizar input em tempo real
 * 
 * @param value - Valor atual
 * @param onChange - Callback de mudança
 * @returns [valueSanitizado, handleChange]
 * 
 * @example
 * ```tsx
 * function MyInput() {
 *   const [value, setValue] = useState('');
 *   const [safeValue, handleSafeChange] = useSanitizedInput(value, setValue);
 *   
 *   return <input value={safeValue} onChange={handleSafeChange} />;
 * }
 * ```
 */
export function useSanitizedInput(
  value: string,
  onChange: (value: string) => void
): [string, (e: { target: { value: string } }) => void] {
  const sanitized = sanitizeUserInput(value);
  
  const handleChange = (e: { target: { value: string } }) => {
    const newValue = sanitizeUserInput(e.target.value);
    onChange(newValue);
  };
  
  return [sanitized, handleChange];
}

/**
 * Validadores de segurança
 */
export const SecurityValidators = {
  /**
   * Verifica se string contém HTML suspeito
   */
  hasSuspiciousHTML(str: string): boolean {
    const SUSPICIOUS_PATTERNS = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i, // onclick, onload, etc
      /<iframe/i,
      /<object/i,
      /<embed/i,
    ];
    
    return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(str));
  },
  
  /**
   * Verifica se URL é segura
   */
  isSafeURL(url: string): boolean {
    return sanitizeURL(url) !== '';
  },
  
  /**
   * Verifica se input está dentro do limite de caracteres
   */
  isWithinLimit(str: string, limit: number): boolean {
    return str.length <= limit;
  },
};

/**
 * Tipos exportados
 */
export type SanitizeConfig = any;
export type SanitizeHook = typeof useSanitizedInput;

/**
 * Re-export DOMPurify para uso avançado
 */
export { DOMPurify };
