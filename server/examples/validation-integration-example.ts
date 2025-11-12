/**
 * EXEMPLO DE INTEGRAÇÃO DO MIDDLEWARE DE VALIDAÇÃO
 * 
 * Este arquivo demonstra como integrar o middleware de validação nos endpoints existentes.
 * Para usar, substitua as chamadas no server/index.ts ou adicione novos endpoints.
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import { validateRequest, validateRequestWithLogging, IdSchema, PaginationSchema, SearchSchema } from './middleware/validation';
import { logsRateLimit, analyticsRateLimit, suspiciousIpRateLimit } from './middleware/rate-limit';

// ==================================================================================
// EXEMPLO 1: Endpoint de Logs com Middleware de Validação
// ==================================================================================

const LogLevelEnum = z.enum(['error', 'warn', 'info', 'debug', 'trace']);

const LogEntrySchema = z.object({
  level: LogLevelEnum.optional().default('info'),
  message: z.string().min(1, 'Message é obrigatório'),
  context: z.record(z.any()).optional().default({}),
  timestamp: z.string().datetime().optional().default(() => new Date().toISOString()),
});

// Exemplo de uso com middleware de validação
export function setupLogsEndpointWithMiddleware(app: any) {
  app.post('/api/logs', 
    suspiciousIpRateLimit, 
    logsRateLimit, 
    validateRequestWithLogging(LogEntrySchema, 'body', {
      logErrors: true,
      endpoint: '/api/logs',
    }),
    (req: Request, res: Response) => {
      // Os dados já estão validados e tipados corretamente
      const { level, message, context, timestamp } = req.body;
      
      console.log(`[Frontend Log] ${level.toUpperCase()}: ${message}`, context);
      
      res.json({ 
        ok: true, 
        received: true,
        timestamp: new Date().toISOString(),
      });
    }
  );
}

// ==================================================================================
// EXEMPLO 2: Endpoint UTM Analytics com Middleware de Validação
// ==================================================================================

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

export function setupUtmAnalyticsEndpointWithMiddleware(app: any) {
  app.post('/api/utm-analytics', 
    suspiciousIpRateLimit, 
    analyticsRateLimit, 
    validateRequest(UtmAnalyticsSchema, 'body'),
    (req: Request, res: Response) => {
      // Os dados já estão validados e tipados corretamente
      const utmData = {
        ...req.body,
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection?.remoteAddress,
      };
      
      console.log('[UTM Analytics]', utmData);
      
      res.json({ 
        ok: true, 
        received: true,
        timestamp: new Date().toISOString(),
      });
    }
  );
}

// ==================================================================================
// EXEMPLO 3: Endpoint com Múltiplas Fontes de Dados
// ==================================================================================

const UserUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(['user', 'admin', 'moderator']).optional(),
});

const UserParamsSchema = z.object({
  id: IdSchema,
});

const UserQuerySchema = z.object({
  includeDeleted: z.enum(['true', 'false']).transform(val => val === 'true').optional().default('false'),
});

export function setupUserUpdateEndpoint(app: any) {
  app.put('/api/users/:id', 
    validateRequestWithLogging(UserParamsSchema, 'params'),
    validateRequestWithLogging(UserQuerySchema, 'query'),
    validateRequest(UserUpdateSchema, 'body'),
    (req: Request, res: Response) => {
      // Todos os dados estão validados e tipados
      const { id } = req.params;
      const { includeDeleted } = req.query;
      const updates = req.body;
      
      console.log(`Atualizando usuário ${id}`, { includeDeleted, updates });
      
      res.json({
        message: 'Usuário atualizado com sucesso',
        id,
        updates,
        timestamp: new Date().toISOString(),
      });
    }
  );
}

// ==================================================================================
// EXEMPLO 4: Endpoint com Paginação e Busca
// ==================================================================================

export function setupUserListEndpoint(app: any) {
  app.get('/api/users',
    validateRequest(PaginationSchema, 'query'),
    validateRequest(SearchSchema, 'query'),
    (req: Request, res: Response) => {
      // Dados de paginação e busca validados
      const { page, limit, sort, orderBy } = req.query;
      const { q: searchTerm, filters } = req.query;
      
      console.log(`Listando usuários: página ${page}, limite ${limit}, busca: ${searchTerm}`);
      
      // Simular resposta paginada
      res.json({
        users: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
        search: {
          term: searchTerm,
          filters,
        },
        timestamp: new Date().toISOString(),
      });
    }
  );
}

// ==================================================================================
// EXEMPLO 5: Endpoint com Validação Complexa
// ==================================================================================

const QuizSubmissionSchema = z.object({
  quizId: IdSchema,
  answers: z.array(z.object({
    questionId: IdSchema,
    answer: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
    timeSpent: z.number().min(0).optional(),
  })).min(1, 'Pelo menos uma resposta é necessária'),
  metadata: z.object({
    userAgent: z.string().optional(),
    ip: z.string().optional(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
  }).optional(),
}).refine(
  (data) => {
    if (data.metadata) {
      return new Date(data.metadata.endTime) > new Date(data.metadata.startTime);
    }
    return true;
  },
  {
    message: 'End time deve ser posterior ao start time',
    path: ['metadata', 'endTime'],
  }
);

export function setupQuizSubmissionEndpoint(app: any) {
  app.post('/api/quiz/submit',
    validateRequestWithLogging(QuizSubmissionSchema, 'body', {
      logErrors: true,
      endpoint: '/api/quiz/submit',
    }),
    (req: Request, res: Response) => {
      // Dados complexos validados
      const { quizId, answers, metadata } = req.body;
      
      console.log(`Quiz ${quizId} submetido com ${answers.length} respostas`);
      
      res.json({
        message: 'Quiz submetido com sucesso',
        quizId,
        answersCount: answers.length,
        processingTime: metadata ? 
          new Date(metadata.endTime).getTime() - new Date(metadata.startTime).getTime() : 
          null,
        timestamp: new Date().toISOString(),
      });
    }
  );
}

// ==================================================================================
// INSTRUÇÕES DE INTEGRAÇÃO
// ==================================================================================

/**
 * Para integrar estes middlewares no seu servidor principal:
 * 
 * 1. Importe os middlewares necessários:
 *    import { validateRequest } from './middleware/validation';
 * 
 * 2. Defina os schemas Zod para seus endpoints
 * 
 * 3. Aplique o middleware antes do handler:
 *    app.post('/api/seu-endpoint', 
 *      validateRequest(SeuSchema, 'body'),
 *      seuHandler
 *    );
 * 
 * 4. Os dados validados estarão disponíveis em req.body, req.query ou req.params
 * 
 * BENEFÍCIOS:
 * - Validação automática e tipagem TypeScript
 * - Tratamento padronizado de erros
 * - Logging estruturado de validações
 * - Reutilização de schemas
 * - Melhor segurança e confiabilidade
 */