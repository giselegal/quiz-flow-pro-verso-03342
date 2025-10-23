/**
 * ✅ VALIDATION SERVICE - Canonical Service for Validation & Authorization
 * 
 * Consolidates validation services into unified validation layer:
 * - Funnel validation (existence, permissions, format)
 * - Template validation (structure, blocks, schema)
 * - Data validation (inputs, configurations, states)
 * - Permission checking (RBAC, ownership, access control)
 * - Format validation (IDs, URLs, emails, etc.)
 * 
 * CONSOLIDATES:
 * - funnelValidationService.ts
 * - migratedFunnelValidationService.ts
 * - Various inline validations scattered across codebase
 */

import { BaseCanonicalService, ServiceResult } from './types';
import { DataService } from './DataService';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ValidationResultV2 {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  severity: 'error';
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  severity: 'warning';
}

export interface FunnelValidationResult {
  isValid: boolean;
  exists: boolean;
  hasPermission: boolean;
  funnel?: any;
  error?: string;
  errorType?: 'NOT_FOUND' | 'NO_PERMISSION' | 'INVALID_FORMAT' | 'NETWORK_ERROR';
}

export interface FunnelPermission {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canShare: boolean;
  isOwner: boolean;
}

export interface TemplateValidationResult extends ValidationResultV2 {
  templateId?: string;
  hasRequiredBlocks: boolean;
  blockErrors: Array<{ blockId: string; errors: string[] }>;
}

export interface BlockValidationResult extends ValidationResultV2 {
  blockId?: string;
  blockType?: string;
  missingFields: string[];
}

// ============================================================================
// VALIDATION SERVICE - MAIN CLASS
// ============================================================================

export class ValidationService extends BaseCanonicalService {
  private static instance: ValidationService;
  private dataService: DataService;
  private cache = new Map<string, { result: any; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    super('ValidationService', '1.0.0', { debug: false });
    this.dataService = DataService.getInstance();
  }

  static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  protected async onInitialize(): Promise<void> {
    this.log('Initializing ValidationService...');
    
    try {
      // Initialize dependencies
      await this.dataService.initialize();
      
      this.log('ValidationService initialized successfully');
    } catch (error) {
      this.error('Failed to initialize ValidationService', error);
      throw error;
    }
  }

  protected async onDispose(): Promise<void> {
    this.log('Disposing ValidationService...');
    this.cache.clear();
  }

  async healthCheck(): Promise<boolean> {
    return this.state === 'ready' && await this.dataService.healthCheck();
  }

  // ============================================================================
  // FUNNEL VALIDATION
  // ============================================================================

  /**
   * Validate funnel access (existence + permissions)
   */
  async validateFunnelAccess(
    funnelId: string,
    userId?: string
  ): Promise<ServiceResult<FunnelValidationResult>> {
    try {
      // Basic format validation
      if (!funnelId || typeof funnelId !== 'string') {
        return {
          success: true,
          data: {
            isValid: false,
            exists: false,
            hasPermission: false,
            error: 'ID do funil inválido',
            errorType: 'INVALID_FORMAT'
          }
        };
      }

      // Check cache
      const cacheKey = `funnel:access:${funnelId}:${userId || 'anonymous'}`;
      const cached = this.getCached<FunnelValidationResult>(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      // Check if funnel exists
      const funnelResult = await this.dataService.funnels.get(funnelId);

      if (!funnelResult.success) {
        const result: FunnelValidationResult = {
          isValid: false,
          exists: false,
          hasPermission: false,
          error: 'Funil não encontrado',
          errorType: 'NOT_FOUND'
        };
        this.setCached(cacheKey, result);
        return { success: true, data: result };
      }

      // Check permissions
      const permissions = this.checkFunnelPermissions(funnelResult.data, userId);

      if (!permissions.canRead) {
        const result: FunnelValidationResult = {
          isValid: false,
          exists: true,
          hasPermission: false,
          error: 'Sem permissão para acessar este funil',
          errorType: 'NO_PERMISSION'
        };
        this.setCached(cacheKey, result);
        return { success: true, data: result };
      }

      // Success
      const result: FunnelValidationResult = {
        isValid: true,
        exists: true,
        hasPermission: true,
        funnel: funnelResult.data
      };

      this.setCached(cacheKey, result);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Validation failed')
      };
    }
  }

  /**
   * Check funnel permissions for user
   */
  checkFunnelPermissions(funnel: any, userId?: string): FunnelPermission {
    const isOwner = funnel.userId === userId;
    const isAnonymous = !userId || userId === 'anonymous';

    // Owner has all permissions
    if (isOwner) {
      return {
        canRead: true,
        canWrite: true,
        canDelete: true,
        canShare: true,
        isOwner: true
      };
    }

    // Published funnels are readable by everyone
    if (funnel.isPublished) {
      return {
        canRead: true,
        canWrite: false,
        canDelete: false,
        canShare: false,
        isOwner: false
      };
    }

    // Unpublished funnels only accessible by owner
    if (!isAnonymous) {
      // Could check shared permissions here in future
      return {
        canRead: false,
        canWrite: false,
        canDelete: false,
        canShare: false,
        isOwner: false
      };
    }

    // Anonymous users can't access unpublished funnels
    return {
      canRead: false,
      canWrite: false,
      canDelete: false,
      canShare: false,
      isOwner: false
    };
  }

  /**
   * Validate funnel data structure
   */
  validateFunnel(funnel: any): ServiceResult<ValidationResultV2> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Required fields
    if (!funnel.id) {
      errors.push({
        field: 'id',
        message: 'Funnel ID is required',
        code: 'MISSING_ID',
        severity: 'error'
      });
    }

    if (!funnel.name || funnel.name.trim().length === 0) {
      errors.push({
        field: 'name',
        message: 'Funnel name is required',
        code: 'MISSING_NAME',
        severity: 'error'
      });
    }

    if (!funnel.context) {
      errors.push({
        field: 'context',
        message: 'Funnel context is required',
        code: 'MISSING_CONTEXT',
        severity: 'error'
      });
    }

    // Warnings
    if (!funnel.description) {
      warnings.push({
        field: 'description',
        message: 'Funnel description is recommended',
        code: 'MISSING_DESCRIPTION',
        severity: 'warning'
      });
    }

    if (!funnel.pages || funnel.pages.length === 0) {
      warnings.push({
        field: 'pages',
        message: 'Funnel has no pages',
        code: 'NO_PAGES',
        severity: 'warning'
      });
    }

    return {
      success: true,
      data: {
        isValid: errors.length === 0,
        errors,
        warnings
      }
    };
  }

  // ============================================================================
  // TEMPLATE VALIDATION
  // ============================================================================

  /**
   * Validate template structure and blocks
   */
  validateTemplate(template: any): ServiceResult<TemplateValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const blockErrors: Array<{ blockId: string; errors: string[] }> = [];

    // Required fields
    if (!template.id) {
      errors.push({
        field: 'id',
        message: 'Template ID is required',
        code: 'MISSING_ID',
        severity: 'error'
      });
    }

    if (!template.name) {
      errors.push({
        field: 'name',
        message: 'Template name is required',
        code: 'MISSING_NAME',
        severity: 'error'
      });
    }

    // Validate blocks
    if (!template.blocks || !Array.isArray(template.blocks)) {
      errors.push({
        field: 'blocks',
        message: 'Template must have blocks array',
        code: 'MISSING_BLOCKS',
        severity: 'error'
      });
    } else {
      // Check each block
      template.blocks.forEach((block: any, index: number) => {
        const blockValidation = this.validateBlock(block);
        if (blockValidation.success && !blockValidation.data.isValid) {
          blockErrors.push({
            blockId: block.id || `block_${index}`,
            errors: blockValidation.data.errors.map((e: ValidationError) => e.message)
          });
        }
      });
    }

    const hasRequiredBlocks = template.blocks && template.blocks.length > 0;

    return {
      success: true,
      data: {
        isValid: errors.length === 0 && blockErrors.length === 0,
        errors,
        warnings,
        templateId: template.id,
        hasRequiredBlocks,
        blockErrors
      }
    };
  }

  /**
   * Validate individual block
   */
  validateBlock(block: any): ServiceResult<BlockValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const missingFields: string[] = [];

    // Required fields
    if (!block.id) {
      errors.push({
        field: 'id',
        message: 'Block ID is required',
        code: 'MISSING_ID',
        severity: 'error'
      });
      missingFields.push('id');
    }

    if (!block.type) {
      errors.push({
        field: 'type',
        message: 'Block type is required',
        code: 'MISSING_TYPE',
        severity: 'error'
      });
      missingFields.push('type');
    }

    // Type-specific validation
    if (block.type === 'question' && !block.content?.question) {
      errors.push({
        field: 'content.question',
        message: 'Question block must have question text',
        code: 'MISSING_QUESTION',
        severity: 'error'
      });
    }

    if (block.type === 'question' && (!block.content?.options || block.content.options.length === 0)) {
      warnings.push({
        field: 'content.options',
        message: 'Question block should have options',
        code: 'NO_OPTIONS',
        severity: 'warning'
      });
    }

    return {
      success: true,
      data: {
        isValid: errors.length === 0,
        errors,
        warnings,
        blockId: block.id,
        blockType: block.type,
        missingFields
      }
    };
  }

  // ============================================================================
  // DATA FORMAT VALIDATION
  // ============================================================================

  /**
   * Validate email format
   */
  validateEmail(email: string): ServiceResult<boolean> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      success: true,
      data: emailRegex.test(email)
    };
  }

  /**
   * Validate URL format
   */
  validateUrl(url: string): ServiceResult<boolean> {
    try {
      new URL(url);
      return { success: true, data: true };
    } catch {
      return { success: true, data: false };
    }
  }

  /**
   * Validate UUID format
   */
  validateUuid(uuid: string): ServiceResult<boolean> {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return {
      success: true,
      data: uuidRegex.test(uuid)
    };
  }

  /**
   * Validate ID format (custom format used in app)
   */
  validateId(id: string, prefix?: string): ServiceResult<boolean> {
    if (!id || typeof id !== 'string') {
      return { success: true, data: false };
    }

    if (prefix) {
      return {
        success: true,
        data: id.startsWith(prefix)
      };
    }

    // General ID format: alphanumeric with underscores/dashes
    const idRegex = /^[a-zA-Z0-9_-]+$/;
    return {
      success: true,
      data: idRegex.test(id)
    };
  }

  /**
   * Validate required fields in object
   */
  validateRequiredFields(
    obj: any,
    requiredFields: string[]
  ): ServiceResult<ValidationResultV2> {
    const errors: ValidationError[] = [];

    requiredFields.forEach(field => {
      if (!(field in obj) || obj[field] === null || obj[field] === undefined) {
        errors.push({
          field,
          message: `Field '${field}' is required`,
          code: 'MISSING_FIELD',
          severity: 'error'
        });
      }
    });

    return {
      success: true,
      data: {
        isValid: errors.length === 0,
        errors,
        warnings: []
      }
    };
  }

  // ============================================================================
  // CACHE HELPERS
  // ============================================================================

  private getCached<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.result as T;
  }

  private setCached<T>(key: string, result: T): void {
    this.cache.set(key, {
      result,
      timestamp: Date.now()
    });
  }

  /**
   * Clear validation cache
   */
  clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // ============================================================================
  // SPECIALIZED API - ORGANIZED BY DOMAIN
  // ============================================================================

  /**
   * Funnels validation API
   */
  readonly funnels = {
    validateAccess: (funnelId: string, userId?: string) =>
      this.validateFunnelAccess(funnelId, userId),
    checkPermissions: (funnel: any, userId?: string) =>
      this.checkFunnelPermissions(funnel, userId),
    validate: (funnel: any) =>
      this.validateFunnel(funnel),
  };

  /**
   * Templates validation API
   */
  readonly templates = {
    validate: (template: any) =>
      this.validateTemplate(template),
    validateBlock: (block: any) =>
      this.validateBlock(block),
  };

  /**
   * Format validation API
   */
  readonly format = {
    email: (email: string) => this.validateEmail(email),
    url: (url: string) => this.validateUrl(url),
    uuid: (uuid: string) => this.validateUuid(uuid),
    id: (id: string, prefix?: string) => this.validateId(id, prefix),
    requiredFields: (obj: any, fields: string[]) =>
      this.validateRequiredFields(obj, fields),
  };
}

// Export singleton instance
export const validationService = ValidationService.getInstance();
