/**
 * Custom Error Classes
 * Provides structured error handling with codes and details
 */

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
      details: this.details,
      statusCode: this.statusCode,
    };
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super('VALIDATION_ERROR', message, 400, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const code = `${resource.toUpperCase()}_NOT_FOUND`;
    const message = `${resource} não encontrado${id ? `: ${id}` : ''}`;
    super(code, message, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: any) {
    super('CONFLICT', message, 409, details);
    this.name = 'ConflictError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Não autorizado') {
    super('UNAUTHORIZED', message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Acesso negado') {
    super('FORBIDDEN', message, 403);
    this.name = 'ForbiddenError';
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter?: number) {
    super(
      'RATE_LIMIT_EXCEEDED',
      'Muitas requisições. Tente novamente mais tarde.',
      429,
      { retryAfter }
    );
    this.name = 'RateLimitError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: any) {
    super('DATABASE_ERROR', message, 500, details);
    this.name = 'DatabaseError';
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Erro interno do servidor', details?: any) {
    super('INTERNAL_SERVER_ERROR', message, 500, details);
    this.name = 'InternalServerError';
  }
}
