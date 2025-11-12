import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// ==================================================================================
// Middleware de Validação Genérico
// ==================================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  data?: any;
}

/**
 * Middleware de validação que usa Zod schemas
 * @param schema Schema Zod para validação
 * @param source Fonte dos dados ('body', 'query', 'params')
 * @param options Opções adicionais de validação
 */
export function validateRequest(
  schema: z.ZodSchema,
  source: 'body' | 'query' | 'params' = 'body',
  options: {
    stripUnknown?: boolean;
    abortEarly?: boolean;
    allowPartial?: boolean;
  } = {}
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[source];
      
      // Configurar opções de validação
      const validationOptions: z.ParseOptions = {
        stripUnknown: options.stripUnknown ?? true,
        abortEarly: options.abortEarly ?? false,
      };

      // Validar dados com Zod
      const result = schema.safeParse(data, validationOptions);

      if (!result.success) {
        const errors: ValidationError[] = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          error: 'Dados inválidos',
          message: 'A validação dos dados falhou',
          details: errors,
          timestamp: new Date().toISOString(),
          source,
        });
      }

      // Substituir dados validados na requisição
      req[source] = result.data;
      
      next();
    } catch (error) {
      return res.status(500).json({
        error: 'Erro interno na validação',
        message: 'Ocorreu um erro ao processar a validação dos dados',
        timestamp: new Date().toISOString(),
        source,
      });
    }
  };
}

/**
 * Middleware de validação com tratamento de erros melhorado
 * Inclui logging e estatísticas de validação
 */
export function validateRequestWithLogging(
  schema: z.ZodSchema,
  source: 'body' | 'query' | 'params' = 'body',
  options: {
    stripUnknown?: boolean;
    abortEarly?: boolean;
    allowPartial?: boolean;
    logErrors?: boolean;
    endpoint?: string;
  } = {}
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const data = req[source];
    
    try {
      // Configurar opções de validação
      const validationOptions: z.ParseOptions = {
        stripUnknown: options.stripUnknown ?? true,
        abortEarly: options.abortEarly ?? false,
      };

      // Validar dados com Zod
      const result = schema.safeParse(data, validationOptions);
      const validationTime = Date.now() - startTime;

      if (!result.success) {
        const errors: ValidationError[] = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        // Log de erros de validação (se habilitado)
        if (options.logErrors !== false) {
          console.warn(JSON.stringify({
            timestamp: new Date().toISOString(),
            level: 'WARN',
            message: 'Validação falhou',
            service: 'validation-middleware',
            endpoint: options.endpoint || req.path,
            validationTime,
            source,
            errors: errors.length,
            details: errors,
            ip: req.ip || req.connection?.remoteAddress,
            userAgent: req.headers['user-agent'],
          }));
        }

        return res.status(400).json({
          error: 'Dados inválidos',
          message: 'A validação dos dados falhou',
          details: errors,
          timestamp: new Date().toISOString(),
          source,
          validationTime,
        });
      }

      // Log de validação bem-sucedida (em desenvolvimento)
      if (process.env.NODE_ENV === 'development') {
        console.debug(JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'DEBUG',
          message: 'Validação bem-sucedida',
          service: 'validation-middleware',
          endpoint: options.endpoint || req.path,
          validationTime,
          source,
          fieldsValidated: Object.keys(result.data).length,
        }));
      }

      // Substituir dados validados na requisição
      req[source] = result.data;
      
      next();
    } catch (error) {
      const validationTime = Date.now() - startTime;
      
      console.error(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'ERROR',
        message: 'Erro na validação',
        service: 'validation-middleware',
        endpoint: options.endpoint || req.path,
        validationTime,
        source,
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } : error,
        ip: req.ip || req.connection?.remoteAddress,
        userAgent: req.headers['user-agent'],
      }));

      return res.status(500).json({
        error: 'Erro interno na validação',
        message: 'Ocorreu um erro ao processar a validação dos dados',
        timestamp: new Date().toISOString(),
        source,
        validationTime,
      });
    }
  };
}

/**
 * Função auxiliar para criar schemas de validação reutilizáveis
 */
export function createValidationSchema(fields: Record<string, z.ZodType>) {
  return z.object(fields);
}

/**
 * Schema de validação comum para IDs
 */
export const IdSchema = z.string().uuid().or(z.string().min(1));

/**
 * Schema de validação para paginação
 */
export const PaginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
  sort: z.enum(['asc', 'desc']).optional().default('asc'),
  orderBy: z.string().optional(),
});

/**
 * Schema de validação para busca
 */
export const SearchSchema = z.object({
  q: z.string().optional(),
  filters: z.string().transform((str) => {
    try {
      return JSON.parse(str);
    } catch {
      return {};
    }
  }).optional().default('{}'),
});

/**
 * Middleware de validação para múltiplas fontes de dados
 */
export function validateMultipleSources(schemas: {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: Record<string, ValidationError[]> = {};
    let hasErrors = false;

    // Validar body
    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        hasErrors = true;
        errors.body = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
      } else {
        req.body = result.data;
      }
    }

    // Validar query
    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        hasErrors = true;
        errors.query = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
      } else {
        req.query = result.data;
      }
    }

    // Validar params
    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        hasErrors = true;
        errors.params = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
      } else {
        req.params = result.data;
      }
    }

    if (hasErrors) {
      return res.status(400).json({
        error: 'Dados inválidos',
        message: 'A validação dos dados falhou em múltiplas fontes',
        details: errors,
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
}