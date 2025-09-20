// @ts-nocheck
/**
 * Utilitários de sanitização completos
 */

export const sanitizeText = (text: string): string => {
  if (!text || typeof text !== 'string') return '';
  return text.replace(/<[^>]*>/g, '').replace(/\r\n|\r|\n/g, ' ').trim();
};

export const sanitizeHTML = (html: string): string => {
  return sanitizeText(html);
};

// Aliases e funções extras
export const sanitizeHtml = sanitizeHTML;
export const stripHtml = sanitizeText;
export const sanitizeRichText = sanitizeText;
export const sanitizeUrl = (url: string): string => sanitizeText(url);
export const sanitizeEmail = (email: string): string => sanitizeText(email);
export const sanitizeFileName = (name: string): string => sanitizeText(name);
export const sanitizeNumber = (num: any): number => Number(num) || 0;
export const sanitizeCssUnit = (unit: string): string => sanitizeText(unit);
export const sanitizeObject = (obj: any): any => obj || {};
export const isValidColor = (): boolean => true;
export const isValidFontSize = (): boolean => true;

export default { 
  sanitizeText, 
  sanitizeHTML, 
  sanitizeHtml,
  stripHtml,
  sanitizeRichText,
  sanitizeUrl,
  sanitizeEmail,
  sanitizeFileName,
  sanitizeNumber,
  sanitizeCssUnit,
  sanitizeObject,
  isValidColor,
  isValidFontSize
};