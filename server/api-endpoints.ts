import { Request, Response } from 'express';
import { z } from 'zod';
import { logsRateLimit, analyticsRateLimit, suspiciousIpRateLimit } from './middleware/rate-limit';

// ==================================================================================
// Schemas de validação Zod
// ==================================================================================

const LogLevelEnum = z.enum(['error', 'warn', 'info', 'debug', 'trace']);

const LogEntrySchema = z.object({
  level: LogLevelEnum.optional().default('info'),
  message: z.string().min(1, 'Message é obrigatório'),
  context: z.record(z.any()).optional().default({}),
  timestamp: z.string().datetime().optional().default(() => new Date().toISOString()),
});

const UtmAnalyticsSchema = z.object({
  utm_source: z.string().optional().nullable(),
  utm_medium: z.string().optional().nullable(),
  utm_campaign: z.string().optional().nullable(),
  utm_term: z.string().optional().nullable(),
  utm_content: z.string().optional().nullable(),
  page: z.string().optional().default('unknown'),
  timestamp: z.string().datetime().optional().default(() => new Date().toISOString()),
}).refine(
  (data) => {
    return data.utm_source || data.utm_medium || data.utm_campaign || data.utm_term || data.utm_content;
  },
  {
    message: 'Pelo menos um parâmetro UTM é obrigatório',
  }
);

// ==================================================================================
// Logger estruturado
// ==================================================================================

interface StructuredLog {
  timestamp: string;
  level: string;
  message: string;
  service: string;
  context?: Record<string, any>;
  metadata?: {
    userAgent?: string;
    ip?: string;
    endpoint?: string;
  };
}

class StructuredLogger {
  private formatLog(log: StructuredLog): string {
    return JSON.stringify({
      timestamp: log.timestamp,
      level: log.level.toUpperCase(),
      message: log.message,
      service: log.service,
      ...(log.context && Object.keys(log.context).length > 0 && { context: log.context }),
      ...(log.metadata && Object.keys(log.metadata).length > 0 && { metadata: log.metadata }),
    });
  }

  info(message: string, context?: Record<string, any>, metadata?: Record<string, any>) {
    const log: StructuredLog = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      service: 'api-endpoints',
      context,
      metadata,
    };
    console.log(this.formatLog(log));
  }

  warn(message: string, context?: Record<string, any>, metadata?: Record<string, any>) {
    const log: StructuredLog = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      service: 'api-endpoints',
      context,
      metadata,
    };
    console.warn(this.formatLog(log));
  }

  error(message: string, error?: Error, context?: Record<string, any>, metadata?: Record<string, any>) {
    const log: StructuredLog = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      service: 'api-endpoints',
      context: {
        ...context,
        ...(error && {
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
        }),
      },
      metadata,
    };
    console.error(this.formatLog(log));
  }

  debug(message: string, context?: Record<string, any>, metadata?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      const log: StructuredLog = {
        timestamp: new Date().toISOString(),
        level: 'debug',
        message,
        service: 'api-endpoints',
        context,
        metadata,
      };
      console.debug(this.formatLog(log));
    }
  }
}

const logger = new StructuredLogger();

// ==================================================================================
// Logs endpoint: recebe logs do frontend para monitoramento
// ==================================================================================
export function setupLogsEndpoint(app: any) {
  // Aplicar rate limiting e validação de IP suspeito
  app.post('/api/logs', suspiciousIpRateLimit, logsRateLimit, async (req: Request, res: Response) => {
    try {
      // Validação com Zod
      const validationResult = LogEntrySchema.safeParse(req.body);
      
      if (!validationResult.success) {
        logger.warn('Validação falhou para log entry', {
          errors: validationResult.error.errors,
          body: req.body,
        });
        
        return res.status(400).json({
          error: 'Dados inválidos',
          details: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      const { level, message, context, timestamp } = validationResult.data;

      // Log estruturado no servidor - usar método apropriado baseado no nível
      const logMessage = `[Frontend Log] ${message}`;
      const logMetadata = {
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress,
        endpoint: '/api/logs',
      };

      switch (level) {
        case 'error':
          logger.error(logMessage, undefined, context, logMetadata);
          break;
        case 'warn':
          logger.warn(logMessage, context, logMetadata);
          break;
        case 'debug':
          logger.debug(logMessage, context, logMetadata);
          break;
        default:
          logger.info(logMessage, context, logMetadata);
      }

      // Em produção, aqui poderia ser enviado para um serviço externo como Sentry, LogRocket, etc.
      
      res.json({ 
        ok: true, 
        received: true,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Erro ao processar log', error as Error, {
        endpoint: '/api/logs',
        method: 'POST',
      });
      
      res.status(500).json({ 
        error: 'Erro interno ao processar log',
        timestamp: new Date().toISOString(),
      });
    }
  });
}

// ==================================================================================
// UTM Analytics endpoint: registra parâmetros UTM para análise
// ==================================================================================
export function setupUtmAnalyticsEndpoint(app: any) {
  // Aplicar rate limiting e validação de IP suspeito
  app.post('/api/utm-analytics', suspiciousIpRateLimit, analyticsRateLimit, async (req: Request, res: Response) => {
    try {
      // Validação com Zod
      const validationResult = UtmAnalyticsSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        logger.warn('Validação falhou para UTM analytics', {
          errors: validationResult.error.errors,
          body: req.body,
        });
        
        return res.status(400).json({
          error: 'Dados inválidos',
          details: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      const utmData = {
        ...validationResult.data,
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress,
      };

      // Log estruturado no servidor
      logger.info('[UTM Analytics] Parâmetros UTM recebidos', utmData, {
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress,
        endpoint: '/api/utm-analytics',
      });

      // TODO: Implementar salvamento em banco de dados quando houver
      // Por agora, apenas registramos e retornamos sucesso
      
      res.json({ 
        ok: true, 
        received: true,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Erro ao processar UTM analytics', error as Error, {
        endpoint: '/api/utm-analytics',
        method: 'POST',
      });
      
      res.status(500).json({ 
        error: 'Erro interno ao processar dados UTM',
        timestamp: new Date().toISOString(),
      });
    }
  });
}