/**
 * 📊 INTEGRAÇÃO DOS SISTEMAS MELHORADOS - ADMIN/FUNIS
 * 
 * Aplica todas as melhorias implementadas:
 * ✅ Sistema unificado de validação de IDs
 * ✅ Validação centralizada de schemas
 * ✅ Nomenclatura padronizada
 * ✅ Error handling tipado
 * ✅ Storage híbrido otimizado
 */

// Re-export all improved systems
export * from './idValidation';
export * from './schemaValidation';
export * from './namingStandards';
export * from './errorHandling';
export * from './legacyErrorCompat';

// Enhanced funnel identity utilities
export * from './funnelIdentity';

// ============================================================================
// INTEGRATED VALIDATION SYSTEM
// ============================================================================

import { validateFunnelId, validateStepNumber } from './idValidation';
import { validateFunnelSchema } from './schemaValidation';
import { normalizeIdentifiers, dbToFrontend } from './namingStandards';
import { errorManager, createValidationError, createStorageError } from './errorHandling';

/**
 * Valida dados completos de funil com todas as verificações
 */
export const validateFunnelData = (data: any) => {
    const results = {
        isValid: true,
        errors: [] as string[],
        warnings: [] as string[],
        normalized: null as any
    };

    try {
        // 1. Normalizar identificadores
        const normalized = normalizeIdentifiers(data);

        // 2. Validar IDs
        const funnelIdValidation = validateFunnelId(normalized.funnelId);
        if (!funnelIdValidation.isValid) {
            results.errors.push(`Invalid funnel ID: ${funnelIdValidation.error}`);
            results.isValid = false;
        }

        const stepValidation = validateStepNumber(normalized.stepNumber);
        if (!stepValidation.isValid) {
            results.errors.push(`Invalid step number: ${stepValidation.error}`);
            results.isValid = false;
        }

        // 3. Validar schema
        const schemaValidation = validateFunnelSchema(data);
        if (!schemaValidation.isValid) {
            results.errors.push(...schemaValidation.errors.map(e => e.message));
            results.isValid = false;
        }

        // 4. Adicionar warnings para melhorias
        if (schemaValidation.warnings.length > 0) {
            results.warnings.push(...schemaValidation.warnings.map(w => w.message));
        }

        results.normalized = normalized;

        // 5. Log structured result
        if (!results.isValid) {
            const validationError = createValidationError('SCHEMA_VALIDATION_FAILED',
                `Funnel validation failed: ${results.errors.join(', ')}`, {
                funnelId: normalized.funnelId,
                additionalData: { errors: results.errors, warnings: results.warnings }
            });
            errorManager.handleError(validationError);
        }

    } catch (error) {
        results.isValid = false;
        results.errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);

        const systemError = createValidationError('SCHEMA_VALIDATION_FAILED',
            'Critical validation system error', {
            additionalData: { originalError: error }
        });
        errorManager.handleError(systemError);
    }

    return results;
};

/**
 * Aplica todas as normalizações em dados de entrada
 */
export const sanitizeAndNormalizeFunnelData = (rawData: any) => {
    try {
        // 1. Normalizar naming conventions
        const normalized = normalizeIdentifiers(rawData);

        // 2. Converter para formato frontend consistente
        const frontendData = dbToFrontend(normalized);

        // 3. Validar resultado final
        const validation = validateFunnelData(frontendData);

        if (!validation.isValid) {
            console.warn('⚠️ Data normalization resulted in invalid data:', validation.errors);
        }

        return {
            data: frontendData,
            isValid: validation.isValid,
            errors: validation.errors,
            warnings: validation.warnings
        };
    } catch (error) {
        const processingError = createValidationError('SCHEMA_VALIDATION_FAILED',
            'Failed to sanitize and normalize funnel data', {
            additionalData: { rawData, error }
        });
        errorManager.handleError(processingError);

        return {
            data: rawData,
            isValid: false,
            errors: [`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
            warnings: []
        };
    }
};

// ============================================================================
// SISTEMA DE MIGRAÇÃO AUTOMÁTICA
// ============================================================================

/**
 * Migra dados legacy para novo sistema
 */
export const migrateToNewSystem = async (legacyData: any[]) => {
    const results = {
        success: 0,
        failed: 0,
        warnings: 0,
        migratedData: [] as any[]
    };

    for (const item of legacyData) {
        try {
            const migrated = sanitizeAndNormalizeFunnelData(item);

            if (migrated.isValid) {
                results.success++;
                results.migratedData.push(migrated.data);
            } else {
                results.failed++;
                console.error('❌ Migration failed for item:', item.id || 'unknown', migrated.errors);
            }

            if (migrated.warnings.length > 0) {
                results.warnings++;
                console.warn('⚠️ Migration warnings for item:', item.id || 'unknown', migrated.warnings);
            }

        } catch (error) {
            results.failed++;
            const migrationError = createStorageError('MIGRATION_FAILED',
                `Failed to migrate item: ${error instanceof Error ? error.message : 'Unknown error'}`, {
                operation: 'migrateToNewSystem',
                additionalData: { item }
            });
            errorManager.handleError(migrationError);
        }
    }

    console.log(`✅ Migration completed: ${results.success} success, ${results.failed} failed, ${results.warnings} warnings`);
    return results;
};

// ============================================================================
// HEALTH CHECK SYSTEM
// ============================================================================

/**
 * Verifica saúde do sistema de funis
 */
export const performSystemHealthCheck = () => {
    const health = {
        overall: 'healthy' as 'healthy' | 'warning' | 'critical',
        checks: {
            idValidation: false,
            schemaValidation: false,
            namingConsistency: false,
            errorHandling: false,
            storageIntegrity: false
        },
        issues: [] as string[],
        recommendations: [] as string[]
    };

    try {
        // Test ID validation
        const testFunnelId = validateFunnelId('quiz21StepsComplete');
        const testStepNumber = validateStepNumber(1);
        health.checks.idValidation = testFunnelId.isValid && testStepNumber.isValid;

        // Test schema validation
        const testSchema = validateFunnelSchema({
            id: 'test',
            name: 'Test Funnel',
            pages: []
        });
        health.checks.schemaValidation = testSchema.isValid;

        // Test naming consistency
        const testNaming = normalizeIdentifiers({
            funnel_id: 'test',
            step_number: 1
        });
        health.checks.namingConsistency = testNaming.funnelId === 'test' && testNaming.stepNumber === 1;

        // Test error handling
        try {
            const testError = createValidationError('SCHEMA_VALIDATION_FAILED', 'Test error');
            health.checks.errorHandling = testError instanceof Error;
        } catch {
            health.checks.errorHandling = false;
        }

        // Test storage (basic check)
        health.checks.storageIntegrity = typeof Storage !== 'undefined';

        // Determine overall health
        const passedChecks = Object.values(health.checks).filter(Boolean).length;
        const totalChecks = Object.keys(health.checks).length;

        if (passedChecks === totalChecks) {
            health.overall = 'healthy';
        } else if (passedChecks >= totalChecks * 0.7) {
            health.overall = 'warning';
            health.recommendations.push('Some systems need attention but core functionality is working');
        } else {
            health.overall = 'critical';
            health.issues.push('Multiple critical systems are failing');
        }

        // Add specific issues
        if (!health.checks.idValidation) {
            health.issues.push('ID validation system is not working properly');
            health.recommendations.push('Check idValidation.ts implementation');
        }

        if (!health.checks.schemaValidation) {
            health.issues.push('Schema validation system is not working properly');
            health.recommendations.push('Check schemaValidation.ts implementation');
        }

        if (!health.checks.namingConsistency) {
            health.issues.push('Naming standards system is not working properly');
            health.recommendations.push('Check namingStandards.ts implementation');
        }

        if (!health.checks.errorHandling) {
            health.issues.push('Error handling system is not working properly');
            health.recommendations.push('Check errorHandling.ts implementation');
        }

        if (!health.checks.storageIntegrity) {
            health.issues.push('Storage system is not available');
            health.recommendations.push('Check browser storage availability');
        }

    } catch (error) {
        health.overall = 'critical';
        health.issues.push(`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return health;
};