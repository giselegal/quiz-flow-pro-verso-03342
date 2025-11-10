/**
 * 🔒 SECURITY PROVIDER - FASE 4: HARDENING DE SEGURANÇA
 * 
 * Sistema unificado de segurança para todo o editor
 * Rate limiting, input validation, XSS protection
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/services/integrations/supabase/customClient';
import { z } from 'zod';
import { appLogger } from '@/lib/utils/appLogger';

interface SecurityContextType {
  isSecure: boolean;
  rateLimitStatus: {
    remaining: number;
    resetTime: number;
  };
  validateInput: (input: string, schema: z.ZodSchema) => boolean;
  sanitizeHtml: (html: string) => string;
  logSecurityEvent: (event: string, data?: any) => void;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

// Input validation schemas
export const inputSchemas = {
  funnelName: z.string().min(1).max(100).regex(/^[a-zA-Z0-9\s\-_]+$/),
  funnelDescription: z.string().max(500),
  blockContent: z.string().max(5000),
  stepTitle: z.string().min(1).max(200),
  userId: z.string().uuid(),
} as const;

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [isSecure, setIsSecure] = useState(false);
  const [rateLimitStatus, setRateLimitStatus] = useState({
    remaining: 100,
    resetTime: Date.now() + 3600000, // 1 hour
  });

  useEffect(() => {
    initializeSecurity();
  }, []);

  const initializeSecurity = async () => {
    try {
      // Check if we're in a secure context (HTTPS)
      const isHttps = window.location.protocol === 'https:';
      const isLocalhost = window.location.hostname === 'localhost';
      
      setIsSecure(isHttps || isLocalhost);
      
      // Initialize rate limiting
      await checkRateLimit();
      
      appLogger.info('🔒 Security initialized:', { data: [{ isSecure: isHttps || isLocalhost }] });
    } catch (error) {
      appLogger.error('❌ Security initialization failed:', { data: [error] });
    }
  };

  const checkRateLimit = async () => {
    try {
      // Rate limits check disabled - table 'rate_limits' not available
      setRateLimitStatus({
        remaining: 100,
        resetTime: Date.now() + 3600000,
      });
    } catch (error) {
      appLogger.error('❌ Rate limit check failed:', { data: [error] });
    }
  };

  const validateInput = (input: string, schema: z.ZodSchema): boolean => {
    try {
      schema.parse(input);
      return true;
    } catch (error) {
      appLogger.warn('⚠️ Input validation failed:', { data: [error] });
      logSecurityEvent('input_validation_failed', { input: input.substring(0, 50), error });
      return false;
    }
  };

  const sanitizeHtml = (html: string): string => {
    // Basic HTML sanitization - remove script tags and dangerous attributes
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/data:/gi, '');
  };

  const logSecurityEvent = async (event: string, data?: any) => {
    try {
      await supabase.functions.invoke('log-security-event', {
        body: {
          event_type: event,
          event_data: data || {},
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          url: window.location.href,
        },
      });
    } catch (error) {
      appLogger.error('❌ Security event logging failed:', { data: [error] });
    }
  };

  const contextValue: SecurityContextType = {
    isSecure,
    rateLimitStatus,
    validateInput,
    sanitizeHtml,
    logSecurityEvent,
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within SecurityProvider');
  }
  return context;
};

// Security wrapper component for forms
export const SecureForm: React.FC<{
  children: ReactNode;
  onSubmit: (data: any) => void;
}> = ({ children, onSubmit }) => {
  const { sanitizeHtml, logSecurityEvent } = useSecurity();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    const data: Record<string, any> = {};
    
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        // Sanitize all string inputs
        data[key] = sanitizeHtml(value);
      } else {
        data[key] = value;
      }
    }
    
    logSecurityEvent('form_submitted', { form: event.currentTarget.id });
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {children}
    </form>
  );
};