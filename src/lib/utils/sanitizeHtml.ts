/**
 * Sanitização robusta de HTML usando DOMPurify
 * 
 * @security FASE 1 - Sprint 1
 * - Migrado de implementação manual para DOMPurify
 * - Previne XSS, injection attacks, e outros vetores de ataque
 * - Configuração baseada em OWASP best practices
 * 
 * Objetivos:
 * 1. Remover tags perigosas (<script>, <iframe>, <object>, <embed>, <style>)
 * 2. Remover atributos on* (onClick, onerror, etc.)
 * 3. Bloquear javascript: e data: potencialmente perigosos em href/src
 * 4. Permitir apenas um conjunto controlado de tags de formatação
 * 5. Manter texto interno intacto
 */

import * as DOMPurifyModule from 'dompurify';
const DOMPurify = DOMPurifyModule.default || DOMPurifyModule;

const ALLOWED_TAGS = [
  'b', 'strong', 'i', 'em', 'u', 'br', 'span', 'p', 'div', 
  'ul', 'ol', 'li', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'a', 'img', 'hr', 'pre', 'code'
];

const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'class', 'id',
  'target', 'rel', 'width', 'height'
];

export function sanitizeHtml(input?: string | null): string {
  if (!input || typeof input !== 'string') return '';
  
  try {
    // Usa DOMPurify para sanitização robusta
    const clean = DOMPurify.sanitize(input, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
      SAFE_FOR_TEMPLATES: true,
    });
    
    return clean.trim();
    } catch {
        // Em caso de erro, fallback para texto escapado básico
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
}

export default sanitizeHtml;
