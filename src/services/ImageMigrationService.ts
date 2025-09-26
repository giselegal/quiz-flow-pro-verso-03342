/**
 * 🚀 SISTEMA DE MIGRAÇÃO PARA IMAGENS OTIMIZADAS
 * 
 * Migra templates e imagens existentes para o sistema IndexedDB otimizado
 */

import { optimizedImageStorage } from './OptimizedImageStorage';

// ============================================================================
// TIPOS PARA MIGRAÇÃO
// ============================================================================

interface TemplateMigrationData {
    id: string;
    name: string;
    thumbnailUrl: string;
    imageUrl: string;
    category: string;
}

interface MigrationResult {
    success: boolean;
    templateId: string;
    thumbnailResult: string | null;
    imageResult: string | null;
    errors: string[];
}

interface MigrationStats {
    totalTemplates: number;
    successful: number;
    failed: number;
    spaceSaved: number; // em bytes
    compressionRatio: number; // média
}

// ============================================================================
// SERVIÇO DE MIGRAÇÃO
// ============================================================================

class ImageMigrationService {
    private migrationInProgress = false;
    private results: MigrationResult[] = [];

    // ========================================================================
    // MIGRAÇÃO ESPECÍFICA DO QUIZ-ESTILO
    // ========================================================================

    /**
     * Migra todas as imagens do template quiz-estilo-21-steps
     */
    async migrateQuizEstiloTemplate(): Promise<{
        success: boolean;
        stats: {
            totalImages: number;
            migrated: number;
            failed: number;
            spaceSaved: number;
            compressionRatio: number;
        };
        details: Array<{
            imageUrl: string;
            stepId: string;
            success: boolean;
            error?: string;
            originalSize?: number;
            optimizedSize?: number;
        }>;
    }> {
        console.log('🚀 Iniciando migração do template Quiz-Estilo...');

        // URLs das imagens do quiz-estilo identificadas
        const quizEstiloImages = [
            // Logo principal
            {
                url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
                stepId: 'step-1',
                type: 'logo',
                options: { quality: 0.95, format: 'webp' as const, maxWidth: 200, maxHeight: 80 }
            },
            // Imagem de introdução
            {
                url: 'https://res.cloudinary.com/der8kogzu/image/upload/f_avif,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.avif',
                stepId: 'step-1',
                type: 'intro',
                options: { quality: 0.85, format: 'webp' as const, maxWidth: 400, maxHeight: 300 }
            },
            // Imagens dos 8 estilos (questões)
            {
                url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp',
                stepId: 'step-2',
                type: 'style',
                style: 'natural',
                options: { quality: 0.85, format: 'webp' as const, maxWidth: 400, maxHeight: 300 }
            },
            {
                url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
                stepId: 'step-2',
                type: 'style',
                style: 'classico',
                options: { quality: 0.85, format: 'webp' as const, maxWidth: 400, maxHeight: 300 }
            },
            {
                url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp',
                stepId: 'step-2',
                type: 'style',
                style: 'contemporaneo',
                options: { quality: 0.85, format: 'webp' as const, maxWidth: 400, maxHeight: 300 }
            },
            {
                url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp',
                stepId: 'step-2',
                type: 'style',
                style: 'elegante',
                options: { quality: 0.85, format: 'webp' as const, maxWidth: 400, maxHeight: 300 }
            },
            {
                url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp',
                stepId: 'step-2',
                type: 'style',
                style: 'romantico',
                options: { quality: 0.85, format: 'webp' as const, maxWidth: 400, maxHeight: 300 }
            },
            {
                url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp',
                stepId: 'step-2',
                type: 'style',
                style: 'sexy',
                options: { quality: 0.85, format: 'webp' as const, maxWidth: 400, maxHeight: 300 }
            },
            {
                url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp',
                stepId: 'step-2',
                type: 'style',
                style: 'dramatico',
                options: { quality: 0.85, format: 'webp' as const, maxWidth: 400, maxHeight: 300 }
            },
            {
                url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp',
                stepId: 'step-2',
                type: 'style',
                style: 'criativo',
                options: { quality: 0.85, format: 'webp' as const, maxWidth: 400, maxHeight: 300 }
            }
        ];

        const details: Array<{
            imageUrl: string;
            stepId: string;
            success: boolean;
            error?: string;
            originalSize?: number;
            optimizedSize?: number;
        }> = [];

        let totalOriginalSize = 0;
        let totalOptimizedSize = 0;
        let migrated = 0;
        let failed = 0;

        // Migrar cada imagem
        for (const image of quizEstiloImages) {
            try {
                console.log(`📥 Migrando imagem: ${image.url}`);

                await optimizedImageStorage.getCachedImage(
                    image.url,
                    async () => {
                        const response = await fetch(image.url);
                        if (!response.ok) throw new Error(`HTTP ${response.status}`);
                        return await response.blob();
                    },
                    image.options
                );

                details.push({
                    imageUrl: image.url,
                    stepId: image.stepId,
                    success: true
                });

                migrated++;
                console.log(`✅ Sucesso: ${image.url}`);

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

                details.push({
                    imageUrl: image.url,
                    stepId: image.stepId,
                    success: false,
                    error: errorMessage
                });

                failed++;
                console.error(`❌ Falha: ${image.url} - ${errorMessage}`);
            }
        }

        // Calcular estatísticas
        const spaceSaved = totalOriginalSize - totalOptimizedSize;
        const compressionRatio = totalOriginalSize > 0
            ? ((spaceSaved / totalOriginalSize) * 100)
            : 0;

        const result = {
            success: failed === 0,
            stats: {
                totalImages: quizEstiloImages.length,
                migrated,
                failed,
                spaceSaved,
                compressionRatio: Math.round(compressionRatio * 100) / 100
            },
            details
        };

        console.log('🏁 Migração do Quiz-Estilo concluída:', result.stats);

        return result;
    }

    // ========================================================================
    // MIGRAÇÃO DE TEMPLATES EXISTENTES
    // ========================================================================

    async migrateTemplateImages(templates: TemplateMigrationData[]): Promise<MigrationStats> {
        if (this.migrationInProgress) {
            throw new Error('Migração já está em andamento');
        }

        this.migrationInProgress = true;
        this.results = [];

        console.log('🚀 Iniciando migração de imagens dos templates...');
        console.log(`📊 Total de templates: ${templates.length}`);

        const stats: MigrationStats = {
            totalTemplates: templates.length,
            successful: 0,
            failed: 0,
            spaceSaved: 0,
            compressionRatio: 0
        };

        // Processar templates em lotes para não sobrecarregar
        const batchSize = 5;
        for (let i = 0; i < templates.length; i += batchSize) {
            const batch = templates.slice(i, i + batchSize);
            const batchPromises = batch.map(template => this.migrateTemplate(template));

            const batchResults = await Promise.allSettled(batchPromises);

            batchResults.forEach((result, index) => {
                const template = batch[index];

                if (result.status === 'fulfilled') {
                    this.results.push(result.value);
                    if (result.value.success) {
                        stats.successful++;
                    } else {
                        stats.failed++;
                    }
                } else {
                    console.error(`❌ Erro na migração do template ${template.id}:`, result.reason);
                    stats.failed++;
                    this.results.push({
                        success: false,
                        templateId: template.id,
                        thumbnailResult: null,
                        imageResult: null,
                        errors: [result.reason?.message || 'Erro desconhecido']
                    });
                }
            });

            // Pequena pausa entre lotes
            if (i + batchSize < templates.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        // Calcular estatísticas finais
        await this.calculateFinalStats(stats);

        this.migrationInProgress = false;

        console.log('✅ Migração concluída!', stats);
        return stats;
    }

    // ========================================================================
    // MIGRAÇÃO DE UM TEMPLATE INDIVIDUAL
    // ========================================================================

    private async migrateTemplate(template: TemplateMigrationData): Promise<MigrationResult> {
        const result: MigrationResult = {
            success: false,
            templateId: template.id,
            thumbnailResult: null,
            imageResult: null,
            errors: []
        };

        try {
            console.log(`📥 Migrando template: ${template.name}`);

            // Migrar thumbnail
            if (template.thumbnailUrl) {
                try {
                    result.thumbnailResult = await optimizedImageStorage.getCachedImage(
                        template.thumbnailUrl,
                        undefined,
                        {
                            maxWidth: 400,
                            maxHeight: 300,
                            quality: 0.8,
                            format: 'webp'
                        }
                    );
                    console.log(`✅ Thumbnail migrado: ${template.id}`);
                } catch (error) {
                    const errorMsg = `Erro no thumbnail: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
                    result.errors.push(errorMsg);
                    console.error(`❌ ${errorMsg}`);
                }
            }

            // Migrar imagem principal
            if (template.imageUrl && template.imageUrl !== template.thumbnailUrl) {
                try {
                    result.imageResult = await optimizedImageStorage.getCachedImage(
                        template.imageUrl,
                        undefined,
                        {
                            maxWidth: 800,
                            maxHeight: 600,
                            quality: 0.85,
                            format: 'webp'
                        }
                    );
                    console.log(`✅ Imagem principal migrada: ${template.id}`);
                } catch (error) {
                    const errorMsg = `Erro na imagem principal: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
                    result.errors.push(errorMsg);
                    console.error(`❌ ${errorMsg}`);
                }
            }

            // Determinar sucesso geral
            result.success = (
                (template.thumbnailUrl ? result.thumbnailResult !== null : true) &&
                (template.imageUrl && template.imageUrl !== template.thumbnailUrl ? result.imageResult !== null : true)
            ) && result.errors.length === 0;

            return result;

        } catch (error) {
            result.errors.push(`Erro geral: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
            console.error(`❌ Erro na migração do template ${template.id}:`, error);
            return result;
        }
    }

    // ========================================================================
    // CÁLCULO DE ESTATÍSTICAS
    // ========================================================================

    private async calculateFinalStats(stats: MigrationStats): Promise<void> {
        try {
            const storageStats = await optimizedImageStorage.getStats();
            stats.compressionRatio = storageStats.averageCompression;

            // Estimar espaço economizado (baseado na compressão média)
            const estimatedOriginalSize = parseInt(storageStats.totalSize.replace(/[^\d.]/g, '')) * 1024 * 1024; // MB para bytes
            stats.spaceSaved = Math.round(estimatedOriginalSize * (stats.compressionRatio / 100));

        } catch (error) {
            console.error('❌ Erro ao calcular estatísticas finais:', error);
        }
    }

    // ========================================================================
    // MÉTODOS UTILITÁRIOS
    // ========================================================================

    getMigrationResults(): MigrationResult[] {
        return [...this.results];
    }

    getFailedMigrations(): MigrationResult[] {
        return this.results.filter(result => !result.success);
    }

    async retryFailedMigrations(templates: TemplateMigrationData[]): Promise<MigrationStats> {
        const failedResults = this.getFailedMigrations();
        const failedTemplates = templates.filter(template =>
            failedResults.some(result => result.templateId === template.id)
        );

        if (failedTemplates.length === 0) {
            console.log('✅ Não há migrações falhadas para tentar novamente');
            return {
                totalTemplates: 0,
                successful: 0,
                failed: 0,
                spaceSaved: 0,
                compressionRatio: 0
            };
        }

        console.log(`🔄 Tentando novamente ${failedTemplates.length} migrações falhadas...`);
        return this.migrateTemplateImages(failedTemplates);
    }

    async getStorageReport(): Promise<{
        usage: string;
        count: number;
        averageCompression: number;
        recommendedActions: string[];
    }> {
        const stats = await optimizedImageStorage.getStats();
        const recommendations: string[] = [];

        // Recomendações baseadas no uso
        const usageMB = parseFloat(stats.totalSize.replace(/[^\d.]/g, ''));

        if (usageMB > 40) {
            recommendations.push('Cache está próximo do limite (50MB). Considere limpar imagens antigas.');
        }

        if (stats.averageCompression < 30) {
            recommendations.push('Compressão baixa detectada. Considere ajustar qualidade para economizar espaço.');
        }

        if (stats.count > 100) {
            recommendations.push('Muitas imagens no cache. Considere implementar limpeza automática baseada em uso.');
        }

        if (recommendations.length === 0) {
            recommendations.push('Sistema funcionando otimamente! ✨');
        }

        return {
            usage: stats.totalSize,
            count: stats.count,
            averageCompression: stats.averageCompression,
            recommendedActions: recommendations
        };
    }
}

// ============================================================================
// FUNÇÃO DE MIGRAÇÃO DOS TEMPLATES ATUAIS
// ============================================================================

export async function migrateCurrentTemplates(): Promise<MigrationStats> {
    // Importar templates atuais do projeto
    const { FUNCTIONAL_TEMPLATES } = await import('../pages/dashboard/templates/config');

    const templatesForMigration: TemplateMigrationData[] = FUNCTIONAL_TEMPLATES
        .filter(template => template.thumbnail && typeof template.thumbnail === 'string')
        .map(template => ({
            id: template.id,
            name: template.name,
            thumbnailUrl: template.thumbnail as string,
            imageUrl: template.thumbnail as string,
            category: template.category
        }));

    const migrationService = new ImageMigrationService();
    return migrationService.migrateTemplateImages(templatesForMigration);
}

// ============================================================================
// HOOK REACT PARA MONITORAMENTO DE MIGRAÇÃO
// ============================================================================

import { useState, useCallback } from 'react';

export function useMigrationStatus() {
    const [isRunning, setIsRunning] = useState(false);
    const [stats, setStats] = useState<MigrationStats | null>(null);
    const [error, setError] = useState<string | null>(null);

    const startMigration = useCallback(async () => {
        try {
            setIsRunning(true);
            setError(null);

            const migrationStats = await migrateCurrentTemplates();
            setStats(migrationStats);

            console.log('🎉 Migração concluída com sucesso!', migrationStats);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido na migração';
            setError(errorMessage);
            console.error('❌ Erro na migração:', err);
        } finally {
            setIsRunning(false);
        }
    }, []);

    const clearCache = useCallback(async () => {
        try {
            await optimizedImageStorage.clearCache();
            setStats(null);
            console.log('🧹 Cache limpo com sucesso');
        } catch (err) {
            console.error('❌ Erro ao limpar cache:', err);
        }
    }, []);

    return {
        isRunning,
        stats,
        error,
        startMigration,
        clearCache
    };
}

// ============================================================================
// INSTÂNCIA SINGLETON E FUNÇÕES DE CONVENIÊNCIA
// ============================================================================

export const imageMigrationService = new ImageMigrationService();

/**
 * 🔥 Migração completa do quiz-estilo (Função de conveniência)
 * 
 * Migra todas as imagens do template quiz-estilo-21-steps para IndexedDB
 * com otimização WebP e cache offline
 * 
 * @returns Resultado da migração com estatísticas detalhadas
 * 
 * @example
 * ```typescript
 * import { migrateQuizEstiloImages } from '@/services/ImageMigrationService';
 * 
 * const result = await migrateQuizEstiloImages();
 * console.log(`Migradas: ${result.stats.migrated}/${result.stats.totalImages}`);
 * console.log(`Espaço economizado: ${(result.stats.spaceSaved / 1024).toFixed(1)}KB`);
 * ```
 */
export const migrateQuizEstiloImages = async () => {
    return await imageMigrationService.migrateQuizEstiloTemplate();
};

/**
 * Migra templates customizados
 */
export const migrateCustomTemplates = async (templates: TemplateMigrationData[]) => {
    return await imageMigrationService.migrateTemplateImages(templates);
};

/**
 * Migra todos os templates atuais do sistema (versão atualizada)
 */
export const migrateAllTemplates = async () => {
    return await migrateCurrentTemplates();
};

/**
 * Verifica estatísticas do cache de imagens
 */
export const getImageCacheStats = async () => {
    // Usar o serviço de storage diretamente para estatísticas
    try {
        const stats = await optimizedImageStorage.getStorageUsage();
        return {
            success: true,
            ...stats
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        };
    }
};

export default ImageMigrationService;