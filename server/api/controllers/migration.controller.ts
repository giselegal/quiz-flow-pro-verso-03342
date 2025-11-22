/**
 * Migration Controller
 * Handles migration endpoints
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import { MigrationService } from '../../services/migration.service';
import { ValidationError } from '../../utils/errors';

const MigrationRequestSchema = z.object({
  sourceType: z.enum(['v1', 'v2', 'legacy']),
  targetType: z.enum(['v3', 'current']),
  funnelIds: z.array(z.string()).optional(),
  dryRun: z.boolean().default(false),
  options: z.object({
    preserveIds: z.boolean().default(true),
    skipValidation: z.boolean().default(false),
  }).optional(),
});

export class MigrationController {
  private migrationService: MigrationService;

  constructor() {
    this.migrationService = new MigrationService();
  }

  async migrate(req: Request, res: Response) {
    try {
      // Validate payload
      const validationResult = MigrationRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        throw new ValidationError(
          'Payload inválido',
          validationResult.error.flatten()
        );
      }

      const migrationRequest = validationResult.data;
      const requestId = (req as any).id || `req_${Date.now()}`;

      console.log('[MigrationController] Iniciando migração', {
        requestId,
        sourceType: migrationRequest.sourceType,
        targetType: migrationRequest.targetType,
        dryRun: migrationRequest.dryRun,
      });

      // Execute migration
      const result = await this.migrationService.executeMigration(migrationRequest);

      console.log('[MigrationController] Migração concluída', {
        requestId,
        migrated: result.migrated,
        failed: result.failed,
      });

      res.status(200).json({
        success: true,
        result,
        timestamp: new Date().toISOString(),
        requestId,
      });
    } catch (error) {
      console.error('[MigrationController] Erro na migração:', error);
      throw error;
    }
  }

  async getStatus(req: Request, res: Response) {
    try {
      const { migrationId } = req.params;
      const status = await this.migrationService.getStatus(migrationId);

      res.status(200).json({
        status,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[MigrationController] Erro ao obter status:', error);
      throw error;
    }
  }
}
