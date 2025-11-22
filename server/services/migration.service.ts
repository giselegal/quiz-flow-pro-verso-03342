/**
 * Migration Service
 * Handles data migration between different versions
 */

import { funnelRepository } from '../repositories/funnel.repository';

export interface MigrationRequest {
  sourceType: 'v1' | 'v2' | 'legacy';
  targetType: 'v3' | 'current';
  funnelIds?: string[];
  dryRun?: boolean;
  options?: {
    preserveIds?: boolean;
    skipValidation?: boolean;
  };
}

export interface MigrationResult {
  migrated: number;
  failed: number;
  errors: Array<{
    funnelId?: string;
    error: string;
  }>;
  details: Array<{
    id: string;
    status: 'success' | 'failed';
    message?: string;
  }>;
}

export class MigrationService {
  async executeMigration(request: MigrationRequest): Promise<MigrationResult> {
    const result: MigrationResult = {
      migrated: 0,
      failed: 0,
      errors: [],
      details: [],
    };

    try {
      console.log('[MigrationService] Starting migration', request);

      // Get funnels to migrate
      const funnelIds = request.funnelIds || [];
      
      if (funnelIds.length === 0) {
        // If no specific IDs, migrate all funnels (be careful!)
        const { funnels } = await funnelRepository.findAll({});
        funnelIds.push(...funnels.map(f => f.id));
      }

      console.log(`[MigrationService] Migrating ${funnelIds.length} funnels`);

      for (const funnelId of funnelIds) {
        try {
          const funnel = await funnelRepository.findById(funnelId);

          if (!funnel) {
            result.failed++;
            result.errors.push({
              funnelId,
              error: 'Funnel not found',
            });
            result.details.push({
              id: funnelId,
              status: 'failed',
              message: 'Funnel not found',
            });
            continue;
          }

          // Perform migration based on source and target types
          const migratedData = this.migrateData(funnel, request);

          // If not dry run, update the funnel
          if (!request.dryRun) {
            await funnelRepository.update(funnelId, migratedData);
          }

          result.migrated++;
          result.details.push({
            id: funnelId,
            status: 'success',
            message: `Migrated from ${request.sourceType} to ${request.targetType}`,
          });
        } catch (error) {
          result.failed++;
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          result.errors.push({
            funnelId,
            error: errorMessage,
          });
          result.details.push({
            id: funnelId,
            status: 'failed',
            message: errorMessage,
          });
        }
      }

      console.log('[MigrationService] Migration completed', {
        migrated: result.migrated,
        failed: result.failed,
      });

      return result;
    } catch (error) {
      console.error('[MigrationService] Migration error:', error);
      throw error;
    }
  }

  private migrateData(funnel: any, request: MigrationRequest): any {
    const migrated = { ...funnel };

    // Apply migrations based on source and target types
    if (request.sourceType === 'v1' && request.targetType === 'v3') {
      // V1 to V3 migration logic
      migrated.steps = this.migrateV1ToV3Steps(funnel.steps || []);
      migrated.settings = this.migrateV1ToV3Settings(funnel.settings || {});
    } else if (request.sourceType === 'v2' && request.targetType === 'v3') {
      // V2 to V3 migration logic
      migrated.steps = this.migrateV2ToV3Steps(funnel.steps || []);
    } else if (request.sourceType === 'legacy' && request.targetType === 'current') {
      // Legacy to current migration
      migrated.steps = this.migrateLegacyToCurrentSteps(funnel.steps || []);
      migrated.settings = this.migrateLegacyToCurrentSettings(funnel.settings || {});
    }

    return migrated;
  }

  private migrateV1ToV3Steps(steps: any[]): any[] {
    return steps.map(step => ({
      ...step,
      version: 'v3',
      migrated_at: new Date().toISOString(),
    }));
  }

  private migrateV1ToV3Settings(settings: any): any {
    return {
      ...settings,
      version: 'v3',
      migrated_at: new Date().toISOString(),
    };
  }

  private migrateV2ToV3Steps(steps: any[]): any[] {
    return steps.map(step => ({
      ...step,
      version: 'v3',
      migrated_at: new Date().toISOString(),
    }));
  }

  private migrateLegacyToCurrentSteps(steps: any[]): any[] {
    return steps.map(step => ({
      ...step,
      version: 'current',
      migrated_at: new Date().toISOString(),
    }));
  }

  private migrateLegacyToCurrentSettings(settings: any): any {
    return {
      ...settings,
      version: 'current',
      migrated_at: new Date().toISOString(),
    };
  }

  async getStatus(migrationId: string): Promise<any> {
    // This would typically query a migrations table
    // For now, return a placeholder
    return {
      migrationId,
      status: 'completed',
      timestamp: new Date().toISOString(),
    };
  }
}
