/**
 * 🚀 TEMPLATE SERVICE ENHANCED - EVOLUÇÃO DO SISTEMA ATUAL
 * 
 * Melhora o UnifiedTemplateService existente com:
 * - Configurações externas opcionais
 * - Analytics básico
 * - Melhor debug
 * - Mantém compatibilidade total
 */

import { unifiedTemplateService } from './UnifiedTemplateService';
import { Block } from '@/types/editor';

export interface EnhancedTemplateConfig {
    funnelId: string;
    stepCount: number;
    theme?: {
        primaryColor: string;
        secondaryColor: string;
    };
    analytics?: {
        enabled: boolean;
        trackingId?: string;
    };
}

class TemplateServiceEnhanced {
    private baseService = unifiedTemplateService;
    private funnelConfigs = new Map<string, EnhancedTemplateConfig>();
    private stats = {
        loadsCount: 0,
        cacheHits: 0,
        cacheMisses: 0,
        personalizedLoads: 0
    };

    /**
     * ✅ COMPATÍVEL: Mesmo método do UnifiedTemplateService
     */
    async loadStepBlocks(stepId: string, funnelId?: string): Promise<Block[]> {
        // Incrementar estatísticas
        this.stats.loadsCount++;

        if (funnelId) {
            this.stats.personalizedLoads++;
        }

        // Usar o serviço base via composição
        const blocks = await this.baseService.loadStepBlocks(stepId, funnelId);

        // Log melhorado
        console.log(`📊 [Enhanced] ${stepId}${funnelId ? ` (${funnelId})` : ''}: ${blocks.length} blocos carregados`);

        return blocks;
    }

    /**
     * 🆕 Registrar configuração de funil
     */
    registerFunnelConfig(config: EnhancedTemplateConfig): void {
        this.funnelConfigs.set(config.funnelId, config);
        console.log(`✅ Funil registrado: ${config.funnelId} (${config.stepCount} etapas)`);
    }

    /**
     * 📊 Obter estatísticas
     */
    getStats() {
        return {
            ...this.stats,
            registeredFunnels: this.funnelConfigs.size,
            cacheHitRate: this.stats.loadsCount > 0
                ? (this.stats.cacheHits / this.stats.loadsCount * 100).toFixed(1)
                : 0
        };
    }

    /**
     * 🔍 Debug de funil específico
     */
    debugFunnel(funnelId: string) {
        const config = this.funnelConfigs.get(funnelId);
        return {
            funnelId,
            registered: !!config,
            config: config || null,
            stats: this.getStats()
        };
    }

    /**
     * 🧹 Limpar cache de funil específico
     */
    clearFunnelCache(funnelId: string): void {
        // Usar método do baseService
        if (typeof this.baseService.invalidateCache === 'function') {
            // Limpar todas as chaves que começam com stepId:funnelId
            for (let i = 1; i <= 21; i++) {
                const cacheKey = `step-${i}:${funnelId}`;
                this.baseService.invalidateCache(cacheKey);
            }
        }

        console.log(`🗑️ Cache limpo para funil: ${funnelId}`);
    }
}

// Instância singleton
export const templateServiceEnhanced = new TemplateServiceEnhanced();

export default templateServiceEnhanced;