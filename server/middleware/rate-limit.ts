import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// ==================================================================================
// Configurações de Rate Limiting
// ==================================================================================

// Rate limit para endpoints de logs (mais permissivo - 100 requisições por minuto)
export const logsRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100, // limite de 100 requisições por minuto
  message: {
    error: 'Muitas requisições de logs',
    message: 'Por favor, aguarde antes de enviar mais logs',
    retryAfter: 60,
  },
  standardHeaders: true, // Retorna informações de rate limit nos headers
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Muitas requisições de logs',
      message: 'Por favor, aguarde antes de enviar mais logs',
      retryAfter: Math.round(logsRateLimit.windowMs / 1000),
      timestamp: new Date().toISOString(),
    });
  },
});

// Rate limit para endpoints de analytics (moderado - 50 requisições por minuto)
export const analyticsRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 50, // limite de 50 requisições por minuto
  message: {
    error: 'Muitas requisições de analytics',
    message: 'Por favor, aguarde antes de enviar mais dados de analytics',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Muitas requisições de analytics',
      message: 'Por favor, aguarde antes de enviar mais dados de analytics',
      retryAfter: Math.round(analyticsRateLimit.windowMs / 1000),
      timestamp: new Date().toISOString(),
    });
  },
});

// Rate limit geral para API (estritivo - 20 requisições por minuto)
export const generalApiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 20, // limite de 20 requisições por minuto
  message: {
    error: 'Muitas requisições à API',
    message: 'Por favor, aguarde antes de fazer mais requisições',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Muitas requisições à API',
      message: 'Por favor, aguarde antes de fazer mais requisições',
      retryAfter: Math.round(generalApiRateLimit.windowMs / 1000),
      timestamp: new Date().toISOString(),
    });
  },
});

// Alias para compatibilidade com código existente
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 20, // limite de 20 requisições por minuto
  message: {
    error: 'Muitas requisições à API',
    message: 'Por favor, aguarde antes de fazer mais requisições',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Muitas requisições à API',
      message: 'Por favor, aguarde antes de fazer mais requisições',
      retryAfter: Math.round(apiRateLimit.windowMs / 1000),
      timestamp: new Date().toISOString(),
    });
  },
});

// Rate limit por IP (muito estrito - 5 requisições por minuto para IPs suspeitos)
export const suspiciousIpRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5, // limite de 5 requisições por minuto
  message: {
    error: 'Muitas requisições deste IP',
    message: 'Seu IP está temporariamente restrito devido a atividade suspeita',
    retryAfter: 300, // 5 minutos
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => {
    // Não aplicar este rate limit para requisições legítimas
    const userAgent = req.headers['user-agent'];
    const isBot = /bot|crawler|spider|scraping/i.test(userAgent || '');
    const isEmptyUserAgent = !userAgent || userAgent.length < 10;
    
    // Pular rate limit se não for suspeito
    return !isBot && !isEmptyUserAgent;
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Muitas requisições deste IP',
      message: 'Seu IP está temporariamente restrito devido a atividade suspeita',
      retryAfter: 300,
      timestamp: new Date().toISOString(),
    });
  },
});

// Middleware para aplicar rate limit baseado no endpoint
export function getRateLimitForEndpoint(endpoint: string) {
  switch (endpoint) {
    case '/api/logs':
      return logsRateLimit;
    case '/api/utm-analytics':
      return analyticsRateLimit;
    default:
      return apiRateLimit;
  }
}

// Configuração de rate limit para diferentes ambientes
export function getRateLimitConfig(environment: string) {
  switch (environment) {
    case 'development':
      return {
        logs: { windowMs: 60 * 1000, max: 200 }, // Mais permissivo em desenvolvimento
        analytics: { windowMs: 60 * 1000, max: 100 },
        api: { windowMs: 60 * 1000, max: 100 },
      };
    case 'test':
      return {
        logs: { windowMs: 60 * 1000, max: 1000 }, // Muito permissivo em testes
        analytics: { windowMs: 60 * 1000, max: 500 },
        api: { windowMs: 60 * 1000, max: 500 },
      };
    default: // production
      return {
        logs: { windowMs: 60 * 1000, max: 100 },
        analytics: { windowMs: 60 * 1000, max: 50 },
        api: { windowMs: 60 * 1000, max: 20 },
      };
  }
}