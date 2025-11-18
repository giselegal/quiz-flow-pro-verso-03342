/**
 * 🎯 UNIFIED VALIDATION SERVICE - SERVIÇO UNIFICADO DE VALIDAÇÃO
 *
 * Implementação mínima para satisfazer os tipos exportados em `core/index.ts`.
 * Mantém a API esperada, mas com lógica simplificada.
 */

export type ValidationRule = {
  type: string;
  value?: unknown;
  message: string;
};

export type ValidationContext = {
  entity: 'block' | 'funnel' | 'template' | string;
  id?: string;
  stepKey?: string;
};

export type ValidationError = {
  path: string;
  message: string;
  severity?: 'warning' | 'error' | 'critical';
};

export type ValidationWarning = {
  path: string;
  message: string;
};

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
};

export type AsyncValidationJob = {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: number;
  finishedAt?: number;
  result?: ValidationResult;
};

export class UnifiedValidationService {
  private jobs = new Map<string, AsyncValidationJob>();

  validateBlock(_input: unknown, _context?: ValidationContext): ValidationResult {
    return { isValid: true, errors: [], warnings: [] };
  }

  validateFunnel(_input: unknown, _context?: ValidationContext): ValidationResult {
    return { isValid: true, errors: [], warnings: [] };
  }

  startAsyncValidation(): AsyncValidationJob {
    const id = `job-${Date.now()}`;
    const job: AsyncValidationJob = {
      id,
      status: 'completed',
      startedAt: Date.now(),
      finishedAt: Date.now(),
      result: { isValid: true, errors: [], warnings: [] },
    };
    this.jobs.set(id, job);
    return job;
  }

  getJob(jobId: string): AsyncValidationJob | undefined {
    return this.jobs.get(jobId);
  }

  cleanup(): void {
    this.jobs.clear();
  }

  getStats(): Record<string, unknown> {
    return {
      totalJobs: this.jobs.size,
    };
  }
}

export const getUnifiedValidationService = () => new UnifiedValidationService();

export default getUnifiedValidationService;