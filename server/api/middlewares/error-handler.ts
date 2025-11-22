/**
 * Error Handler Middleware
 * Centralized error handling for Express
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/errors';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestId = (req as any).id || `req_${Date.now()}`;

  console.error('[ErrorHandler]', {
    requestId,
    method: req.method,
    path: req.path,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      details: err.details,
      timestamp: new Date().toISOString(),
      requestId,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Erro de validação',
      code: 'VALIDATION_ERROR',
      details: err.flatten(),
      timestamp: new Date().toISOString(),
      requestId,
    });
  }

  res.status(500).json({
    error: 'Erro interno do servidor',
    code: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString(),
    requestId,
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: 'Recurso não encontrado',
    code: 'NOT_FOUND',
    path: req.path,
    timestamp: new Date().toISOString(),
  });
}
