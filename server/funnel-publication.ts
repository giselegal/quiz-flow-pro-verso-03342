import { Request, Response } from 'express';
import { z } from 'zod';
import { validateRequest, validateRequestWithLogging } from './middleware/validation';
import { generalApiRateLimit } from './middleware/rate-limit';

// ==================================================================================
// Schemas de validação Zod para publicação de funis
// ==================================================================================

// Publish Options Schema
const PublishOptionsSchema = z.object({
  force: z.boolean().optional().default(false),
  notify: z.boolean().optional().default(false),
  timestamp: z.string().datetime().optional(),
});

// Funnel ID Parameter Schema
const FunnelIdParamSchema = z.object({
  id: z.string().uuid().or(z.string().min(1, 'ID do funil é obrigatório')),
});

// Publication Status Schema
const PublicationStatusSchema = z.enum(['draft', 'published', 'archived']);

// ==================================================================================
// Mock storage for publication status (until database is connected)
// ==================================================================================

const publicationStore = new Map<string, {
  status: string;
  publishedAt?: string;
  url?: string;
  lastPublishedBy?: string;
}>();

// Mock storage for URL conflicts checking
const urlRegistry = new Map<string, string>(); // url -> funnelId mapping

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
    funnelId?: string;
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
      service: 'funnel-publication',
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
      service: 'funnel-publication',
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
      service: 'funnel-publication',
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
        service: 'funnel-publication',
        context,
        metadata,
      };
      console.debug(this.formatLog(log));
    }
  }
}

const logger = new StructuredLogger();

// ==================================================================================
// API Endpoints
// ==================================================================================

export function setupFunnelPublicationEndpoints(app: any) {
  // GET /api/funnels/:id/publication - Get publication status
  app.get('/api/funnels/:id/publication',
    generalApiRateLimit,
    validateRequest(FunnelIdParamSchema, 'params'),
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        
        logger.info('Getting publication status', { funnelId: id }, {
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress,
          endpoint: '/api/funnels/:id/publication',
          funnelId: id,
        });

        const publication = publicationStore.get(id) || {
          status: 'draft',
          publishedAt: undefined,
          url: undefined,
        };

        logger.info('Publication status retrieved', { 
          funnelId: id,
          status: publication.status,
        });

        res.json({
          success: true,
          data: publication,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        logger.error('Error getting publication status', error as Error, {
          funnelId: req.params.id,
        });
        
        res.status(500).json({
          success: false,
          error: 'Erro interno ao buscar status de publicação',
          timestamp: new Date().toISOString(),
        });
      }
    }
  );

  // POST /api/funnels/:id/publish - Publish funnel
  app.post('/api/funnels/:id/publish',
    generalApiRateLimit,
    validateRequestWithLogging(FunnelIdParamSchema, 'params', { endpoint: '/api/funnels/:id/publish' }),
    validateRequestWithLogging(PublishOptionsSchema, 'body', { endpoint: '/api/funnels/:id/publish' }),
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const options = req.body;
        
        logger.info('Publishing funnel', { 
          funnelId: id,
          options: options,
        }, {
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress,
          endpoint: '/api/funnels/:id/publish',
          funnelId: id,
        });

        // Check if already published
        const currentPublication = publicationStore.get(id);
        if (currentPublication?.status === 'published' && !options.force) {
          logger.warn('Funnel already published', { funnelId: id });
          
          return res.status(409).json({
            success: false,
            error: 'Funil já publicado',
            message: 'Use force: true para republicar',
            data: currentPublication,
            timestamp: new Date().toISOString(),
          });
        }

        // Validate funnel exists (mock check)
        // In real implementation, this would check the database
        const funnelExists = true; // Mock: assume funnel exists
        if (!funnelExists) {
          logger.warn('Funnel not found for publication', { funnelId: id });
          
          return res.status(404).json({
            success: false,
            error: 'Funil não encontrado',
            timestamp: new Date().toISOString(),
          });
        }

        // Generate URL (mock implementation)
        const publishedUrl = `https://app.quizflowpro.com/${id}`;
        
        // Check for URL conflicts
        const existingFunnelId = urlRegistry.get(publishedUrl);
        if (existingFunnelId && existingFunnelId !== id && !options.force) {
          logger.warn('URL conflict detected', {
            funnelId: id,
            conflictingFunnelId: existingFunnelId,
            url: publishedUrl,
          });
          
          return res.status(409).json({
            success: false,
            error: 'Conflito de URL',
            message: `URL "${publishedUrl}" já está em uso pelo funil ${existingFunnelId}`,
            timestamp: new Date().toISOString(),
          });
        }

        // Update publication status
        const publishedAt = options.timestamp ? new Date(options.timestamp) : new Date();
        const publicationData = {
          status: 'published',
          publishedAt: publishedAt.toISOString(),
          url: publishedUrl,
          lastPublishedBy: 'system', // In real implementation, this would be the user ID
        };

        publicationStore.set(id, publicationData);
        urlRegistry.set(publishedUrl, id);

        logger.info('Funnel published successfully', { 
          funnelId: id,
          url: publishedUrl,
          publishedAt: publishedAt.toISOString(),
        });

        res.json({
          success: true,
          data: {
            funnelId: id,
            status: 'published',
            url: publishedUrl,
            publishedAt: publishedAt.toISOString(),
            warnings: [], // In real implementation, this would contain validation warnings
          },
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        logger.error('Error publishing funnel', error as Error, {
          funnelId: req.params.id,
        });
        
        res.status(500).json({
          success: false,
          error: 'Erro interno ao publicar funil',
          timestamp: new Date().toISOString(),
        });
      }
    }
  );

  // POST /api/funnels/:id/unpublish - Unpublish funnel
  app.post('/api/funnels/:id/unpublish',
    generalApiRateLimit,
    validateRequestWithLogging(FunnelIdParamSchema, 'params', { endpoint: '/api/funnels/:id/unpublish' }),
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        
        logger.info('Unpublishing funnel', { funnelId: id }, {
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress,
          endpoint: '/api/funnels/:id/unpublish',
          funnelId: id,
        });

        // Check if published
        const currentPublication = publicationStore.get(id);
        if (!currentPublication || currentPublication.status !== 'published') {
          logger.warn('Funnel not published', { funnelId: id });
          
          return res.status(409).json({
            success: false,
            error: 'Funil não está publicado',
            timestamp: new Date().toISOString(),
          });
        }

        // Remove from URL registry
        if (currentPublication.url) {
          urlRegistry.delete(currentPublication.url);
        }

        // Update publication status
        const publicationData = {
          status: 'draft',
          publishedAt: undefined,
          url: undefined,
        };

        publicationStore.set(id, publicationData);

        logger.info('Funnel unpublished successfully', { funnelId: id });

        res.json({
          success: true,
          data: {
            funnelId: id,
            status: 'draft',
          },
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        logger.error('Error unpublishing funnel', error as Error, {
          funnelId: req.params.id,
        });
        
        res.status(500).json({
          success: false,
          error: 'Erro interno ao despublicar funil',
          timestamp: new Date().toISOString(),
        });
      }
    }
  );

  // GET /api/funnels/:id/url-conflicts - Check URL conflicts
  app.get('/api/funnels/:id/url-conflicts',
    generalApiRateLimit,
    validateRequestWithLogging(FunnelIdParamSchema, 'params', { endpoint: '/api/funnels/:id/url-conflicts' }),
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        
        logger.info('Checking URL conflicts', { funnelId: id }, {
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress,
          endpoint: '/api/funnels/:id/url-conflicts',
          funnelId: id,
        });

        // Mock implementation - check all published URLs
        const conflicts: Array<{
          existingFunnelId: string;
          existingFunnelName: string;
          conflictingUrl: string;
        }> = [];

        // In real implementation, this would check the database for URL conflicts
        // For now, we'll check our mock registry
        for (const [url, funnelId] of urlRegistry.entries()) {
          if (funnelId !== id) {
            conflicts.push({
              existingFunnelId: funnelId,
              existingFunnelName: `Funil ${funnelId}`, // Mock name
              conflictingUrl: url,
            });
          }
        }

        logger.info('URL conflicts check completed', { 
          funnelId: id,
          conflictsFound: conflicts.length,
        });

        res.json({
          success: true,
          data: {
            hasConflicts: conflicts.length > 0,
            conflicts,
          },
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        logger.error('Error checking URL conflicts', error as Error, {
          funnelId: req.params.id,
        });
        
        res.status(500).json({
          success: false,
          error: 'Erro interno ao verificar conflitos de URL',
          timestamp: new Date().toISOString(),
        });
      }
    }
  );
}