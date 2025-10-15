/**
 * 🎯 PUBLISHING SERVICE
 * 
 * Serviço centralizado para publicação e deploy de funis
 * Suporte para múltiplos ambientes e integrações
 */

import { supabase } from '@/integrations/supabase/client';
import { FunnelState } from '../types';

// ============================================================================
// INTERFACES
// ============================================================================

export interface PublishOptions {
    funnelId: string;
    environment: 'development' | 'staging' | 'production';
    enableAnalytics?: boolean;
    customDomain?: string;
    enableSSL?: boolean;
    enableCompression?: boolean;
    enableCDN?: boolean;
    metadata?: Record<string, any>;
}

export interface PublishResult {
    success: boolean;
    publishedUrl?: string;
    previewUrl?: string;
    deploymentId?: string;
    errors?: string[];
    warnings?: string[];
    publishedAt?: string;
    buildTime?: number;
}

export interface DeploymentInfo {
    id: string;
    funnelId: string;
    environment: string;
    status: 'building' | 'deployed' | 'failed' | 'cancelled';
    url: string;
    publishedAt: string;
    buildTime: number;
    size: number;
    version: string;
}

export interface PublishingStats {
    totalDeployments: number;
    successfulDeployments: number;
    failedDeployments: number;
    averageBuildTime: number;
    lastDeployment?: DeploymentInfo;
}

// ============================================================================
// PUBLISHING SERVICE CLASS
// ============================================================================

export class PublishingService {
    private static instance: PublishingService;
    private deployments: Map<string, DeploymentInfo> = new Map();

    private constructor() { }

    /**
     * Singleton instance
     */
    static getInstance(): PublishingService {
        if (!this.instance) {
            this.instance = new PublishingService();
        }
        return this.instance;
    }

    // ============================================================================
    // CORE PUBLISHING OPERATIONS
    // ============================================================================

    /**
     * Publica um funil
     */
    async publishFunnel(
        funnelState: FunnelState,
        options: PublishOptions
    ): Promise<PublishResult> {
        console.log(`🚀 Iniciando publicação do funil: ${options.funnelId}`);
        const startTime = Date.now();

        try {
            // Validar estado do funil
            const validation = this.validateFunnelForPublishing(funnelState);
            if (!validation.isValid) {
                return {
                    success: false,
                    errors: validation.errors,
                    warnings: validation.warnings
                };
            }

            // Gerar ID de deployment
            const deploymentId = this.generateDeploymentId(options.funnelId);

            // Construir configuração de publicação
            const publishConfig = this.buildPublishConfig(funnelState, options);

            // Executar deploy baseado no ambiente
            const deployResult = await this.executeDeploy(
                publishConfig,
                deploymentId,
                options
            );

            if (!deployResult.success) {
                return deployResult;
            }

            // Salvar informações de deployment
            const deploymentInfo: DeploymentInfo = {
                id: deploymentId,
                funnelId: options.funnelId,
                environment: options.environment,
                status: 'deployed',
                url: deployResult.publishedUrl!,
                publishedAt: new Date().toISOString(),
                buildTime: Date.now() - startTime,
                size: this.calculateFunnelSize(funnelState),
                version: funnelState.metadata.version || '1.0.0'
            };

            await this.saveDeploymentInfo(deploymentInfo);
            this.deployments.set(deploymentId, deploymentInfo);

            // Atualizar status no Supabase
            await this.updateFunnelPublishStatus(
                options.funnelId,
                true,
                deployResult.publishedUrl!
            );

            console.log(`✅ Funil publicado com sucesso: ${options.funnelId}`);
            console.log(`🔗 URL: ${deployResult.publishedUrl}`);

            return {
                ...deployResult,
                deploymentId,
                publishedAt: deploymentInfo.publishedAt,
                buildTime: deploymentInfo.buildTime
            };

        } catch (error) {
            console.error('❌ Erro durante publicação:', error);

            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

            return {
                success: false,
                errors: [`Erro durante publicação: ${errorMessage}`],
                buildTime: Date.now() - startTime
            };
        }
    }

    /**
     * Despublica um funil
     */
    async unpublishFunnel(funnelId: string): Promise<boolean> {
        console.log(`🔄 Despublicando funil: ${funnelId}`);

        try {
            // Atualizar status no Supabase
            const success = await this.updateFunnelPublishStatus(funnelId, false);

            if (success) {
                console.log(`✅ Funil despublicado: ${funnelId}`);
            }

            return success;
        } catch (error) {
            console.error('❌ Erro ao despublicar funil:', error);
            return false;
        }
    }

    /**
     * Obtém status de publicação de um funil
     */
    async getPublishStatus(funnelId: string): Promise<{
        isPublished: boolean;
        publishedUrl?: string;
        lastDeployment?: DeploymentInfo;
    }> {
        try {
            if (!supabase) {
                return { isPublished: false };
            }

            const { data, error } = await supabase
                .from('funnels')
                .select('is_published')
                .eq('id', funnelId)
                .single();

            if (error) {
                console.error('❌ Erro ao verificar status:', error);
                return { isPublished: false };
            }

            // Buscar último deployment
            const lastDeployment = Array.from(this.deployments.values())
                .filter(d => d.funnelId === funnelId)
                .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0];

            return {
                isPublished: data.is_published || false,
                lastDeployment
            };
        } catch (error) {
            console.error('❌ Erro ao obter status:', error);
            return { isPublished: false };
        }
    }

    /**
     * Lista deployments de um funil
     */
    getDeployments(funnelId: string): DeploymentInfo[] {
        return Array.from(this.deployments.values())
            .filter(d => d.funnelId === funnelId)
            .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }

    /**
     * Obtém estatísticas de publicação
     */
    getPublishingStats(funnelId?: string): PublishingStats {
        const deployments = funnelId
            ? this.getDeployments(funnelId)
            : Array.from(this.deployments.values());

        const successful = deployments.filter(d => d.status === 'deployed');
        const failed = deployments.filter(d => d.status === 'failed');

        const averageBuildTime = successful.length > 0
            ? successful.reduce((sum, d) => sum + d.buildTime, 0) / successful.length
            : 0;

        return {
            totalDeployments: deployments.length,
            successfulDeployments: successful.length,
            failedDeployments: failed.length,
            averageBuildTime: Math.round(averageBuildTime),
            lastDeployment: deployments[0]
        };
    }

    // ============================================================================
    // VALIDATION
    // ============================================================================

    private validateFunnelForPublishing(funnelState: FunnelState): {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    } {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Validações obrigatórias
        if (!funnelState.id) {
            errors.push('ID do funil é obrigatório');
        }

        if (!funnelState.metadata.name) {
            errors.push('Nome do funil é obrigatório');
        }

        if (!funnelState.steps || funnelState.steps.length === 0) {
            errors.push('Funil deve ter pelo menos uma etapa');
        }

        // Validações de etapas
        funnelState.steps.forEach((step, index) => {
            if (!step.id) {
                errors.push(`Etapa ${index + 1} deve ter um ID`);
            }

            if (!step.name) {
                warnings.push(`Etapa ${index + 1} não tem nome`);
            }

            if (!step.components || step.components.length === 0) {
                warnings.push(`Etapa ${index + 1} não tem componentes`);
            }
        });

        // Validações de metadados
        if (!funnelState.metadata.description) {
            warnings.push('Funil não tem descrição');
        }

        if (!funnelState.metadata.category) {
            warnings.push('Funil não tem categoria definida');
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    // ============================================================================
    // DEPLOYMENT LOGIC
    // ============================================================================

    private buildPublishConfig(
        funnelState: FunnelState,
        options: PublishOptions
    ): any {
        return {
            funnel: funnelState,
            environment: options.environment,
            domain: options.customDomain,
            analytics: options.enableAnalytics || false,
            ssl: options.enableSSL || true,
            compression: options.enableCompression || true,
            cdn: options.enableCDN || true,
            metadata: options.metadata || {}
        };
    }

    private async executeDeploy(
        _config: any,
        deploymentId: string,
        options: PublishOptions
    ): Promise<PublishResult> {
        // Simular processo de deploy
        await this.simulateDeployProcess(deploymentId);

        // Gerar URLs baseado no ambiente
        const urls = this.generateUrls(options);

        return {
            success: true,
            publishedUrl: urls.published,
            previewUrl: urls.preview,
            deploymentId
        };
    }

    private async simulateDeployProcess(deploymentId: string): Promise<void> {
        console.log(`⚙️ Construindo deployment ${deploymentId}...`);

        // Simular tempo de build
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        console.log(`📦 Deployment ${deploymentId} construído`);
    }

    private generateUrls(options: PublishOptions): {
        published: string;
        preview: string;
    } {
        const baseUrl = options.customDomain || 'quizquest.app';
        const subdomain = options.environment === 'production' ? '' : `${options.environment}.`;

        return {
            published: `https://${subdomain}${baseUrl}/${options.funnelId}`,
            preview: `https://preview.${baseUrl}/${options.funnelId}`
        };
    }

    private generateDeploymentId(funnelId: string): string {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `${funnelId}-${timestamp}-${random}`;
    }

    private calculateFunnelSize(funnelState: FunnelState): number {
        // Calcular tamanho aproximado em bytes
        return JSON.stringify(funnelState).length;
    }

    // ============================================================================
    // PERSISTENCE
    // ============================================================================

    private async saveDeploymentInfo(info: DeploymentInfo): Promise<void> {
        try {
            // Salvar no localStorage como backup
            const key = `deployment-${info.id}`;
            localStorage.setItem(key, JSON.stringify(info));

            console.log(`💾 Informações de deployment salvas: ${info.id}`);
        } catch (error) {
            console.warn('⚠️ Erro ao salvar deployment info:', error);
        }
    }

    private async updateFunnelPublishStatus(
        funnelId: string,
        isPublished: boolean,
        publishedUrl?: string
    ): Promise<boolean> {
        try {
            if (!supabase) {
                console.warn('⚠️ Supabase não disponível');
                return false;
            }

            const updateData: any = {
                is_published: isPublished,
                updated_at: new Date().toISOString()
            };

            if (publishedUrl) {
                updateData.published_url = publishedUrl;
            }

            const { error } = await supabase
                .from('funnels')
                .update(updateData)
                .eq('id', funnelId);

            if (error) {
                console.error('❌ Erro ao atualizar status:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('❌ Erro ao atualizar status:', error);
            return false;
        }
    }

    // ============================================================================
    // UTILITIES
    // ============================================================================

    /**
     * Gera preview URL sem publicar
     */
    generatePreviewUrl(funnelId: string): string {
        return `https://preview.quizquest.app/${funnelId}?token=${this.generatePreviewToken()}`;
    }

    private generatePreviewToken(): string {
        return Math.random().toString(36).substring(2, 15);
    }

    /**
     * Valida domínio customizado
     */
    validateCustomDomain(domain: string): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        // Validação básica de domínio
        const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if (!domainRegex.test(domain)) {
            errors.push('Formato de domínio inválido');
        }

        if (domain.length > 253) {
            errors.push('Domínio muito longo (máximo 253 caracteres)');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Limpa deployments antigos
     */
    cleanupOldDeployments(maxAge: number = 30): number {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - maxAge);

        let cleanedCount = 0;

        for (const [id, deployment] of this.deployments.entries()) {
            const deploymentDate = new Date(deployment.publishedAt);

            if (deploymentDate < cutoffDate) {
                this.deployments.delete(id);

                // Remover do localStorage também
                try {
                    localStorage.removeItem(`deployment-${id}`);
                } catch (error) {
                    // Ignorar erros
                }

                cleanedCount++;
            }
        }

        if (cleanedCount > 0) {
            console.log(`🧹 ${cleanedCount} deployments antigos removidos`);
        }

        return cleanedCount;
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const publishingService = PublishingService.getInstance();

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Helper para verificar se URL está acessível
 */
export async function checkUrlAccessibility(url: string): Promise<boolean> {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
}

/**
 * Helper para gerar meta tags para SEO
 */
export function generateSEOMetaTags(funnelState: FunnelState, publishedUrl: string): string {
    const title = funnelState.metadata.name || 'Quiz Interativo';
    const description = funnelState.metadata.description || 'Participe do nosso quiz interativo';

    return `
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${publishedUrl}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
  `.trim();
}
