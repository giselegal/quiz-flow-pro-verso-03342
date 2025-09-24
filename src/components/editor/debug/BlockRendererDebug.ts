/**
 * 🔍 BLOCK RENDERER DEBUG UTILITIES
 * 
 * Utilitários para debug e monitoramento do sistema de renderização de blocos
 */

export interface RenderStats {
    blockType: string;
    blockId: string;
    renderTime: number;
    timestamp: number;
    isSelected: boolean;
    isPreviewing: boolean;
    hasComponent: boolean;
}

export interface ComponentCacheStats {
    cacheSize: number;
    hitRate: number;
    totalLookups: number;
    cacheHits: number;
    cacheMisses: number;
}

class BlockRendererDebug {
    private renderStats: RenderStats[] = [];
    private cacheStats: ComponentCacheStats = {
        cacheSize: 0,
        hitRate: 0,
        totalLookups: 0,
        cacheHits: 0,
        cacheMisses: 0
    };

    // 📊 Registrar estatística de render
    logRender(stats: RenderStats) {
        this.renderStats.push(stats);

        // Manter apenas os últimos 100 renders para evitar memory leak
        if (this.renderStats.length > 100) {
            this.renderStats = this.renderStats.slice(-100);
        }

        // Log renders lentos
        if (stats.renderTime > 50) {
            console.warn(`⚠️ Render lento detectado:`, {
                blockType: stats.blockType,
                renderTime: `${stats.renderTime.toFixed(2)}ms`,
                blockId: stats.blockId
            });
        }
    }

    // 📈 Atualizar estatísticas de cache
    updateCacheStats(stats: Partial<ComponentCacheStats>) {
        Object.assign(this.cacheStats, stats);
        this.cacheStats.hitRate = this.cacheStats.totalLookups > 0
            ? (this.cacheStats.cacheHits / this.cacheStats.totalLookups) * 100
            : 0;
    }

    // 📊 Obter relatório de performance
    getPerformanceReport() {
        const totalRenders = this.renderStats.length;
        const avgRenderTime = totalRenders > 0
            ? this.renderStats.reduce((sum, stat) => sum + stat.renderTime, 0) / totalRenders
            : 0;

        const slowRenders = this.renderStats.filter(stat => stat.renderTime > 50);
        const componentTypes = [...new Set(this.renderStats.map(stat => stat.blockType))];

        return {
            totalRenders,
            avgRenderTime: Number(avgRenderTime.toFixed(2)),
            slowRenders: slowRenders.length,
            slowRenderPercentage: Number(((slowRenders.length / totalRenders) * 100).toFixed(1)),
            uniqueComponentTypes: componentTypes.length,
            componentTypes: componentTypes.sort(),
            cacheStats: this.cacheStats,
            recentRenders: this.renderStats.slice(-10)
        };
    }

    // 🔍 Obter estatísticas por tipo de componente
    getComponentTypeStats() {
        const typeStats: Record<string, {
            count: number;
            avgRenderTime: number;
            slowRenders: number;
        }> = {};

        this.renderStats.forEach(stat => {
            if (!typeStats[stat.blockType]) {
                typeStats[stat.blockType] = {
                    count: 0,
                    avgRenderTime: 0,
                    slowRenders: 0
                };
            }

            const typeStat = typeStats[stat.blockType];
            typeStat.count++;
            typeStat.avgRenderTime = (typeStat.avgRenderTime * (typeStat.count - 1) + stat.renderTime) / typeStat.count;

            if (stat.renderTime > 50) {
                typeStat.slowRenders++;
            }
        });

        // Arredondar tempos médios
        Object.keys(typeStats).forEach(type => {
            typeStats[type].avgRenderTime = Number(typeStats[type].avgRenderTime.toFixed(2));
        });

        return typeStats;
    }

    // 🧹 Limpar estatísticas
    clearStats() {
        this.renderStats = [];
        this.cacheStats = {
            cacheSize: 0,
            hitRate: 0,
            totalLookups: 0,
            cacheHits: 0,
            cacheMisses: 0
        };
    }

    // 🖨️ Imprimir relatório no console
    printReport() {
        const report = this.getPerformanceReport();
        const typeStats = this.getComponentTypeStats();

        console.group('📊 Block Renderer Performance Report');

        console.log('📈 Estatísticas Gerais:', {
            totalRenders: report.totalRenders,
            avgRenderTime: `${report.avgRenderTime}ms`,
            slowRenders: `${report.slowRenders} (${report.slowRenderPercentage}%)`,
            uniqueComponents: report.uniqueComponentTypes
        });

        console.log('🗂️ Cache Stats:', report.cacheStats);

        console.log('🎯 Top 5 Componentes Mais Utilizados:');
        Object.entries(typeStats)
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 5)
            .forEach(([type, stats]) => {
                console.log(`  ${type}: ${stats.count} renders (${stats.avgRenderTime}ms avg)`);
            });

        console.log('⚠️ Componentes Mais Lentos:');
        Object.entries(typeStats)
            .filter(([, stats]) => stats.avgRenderTime > 30)
            .sort(([, a], [, b]) => b.avgRenderTime - a.avgRenderTime)
            .slice(0, 5)
            .forEach(([type, stats]) => {
                console.log(`  ${type}: ${stats.avgRenderTime}ms avg (${stats.slowRenders} slow)`);
            });

        console.groupEnd();
    }
}

// Singleton instance
export const blockRendererDebug = new BlockRendererDebug();

// Função para adicionar ao window para debug no console
if (typeof window !== 'undefined') {
    (window as any).__blockRendererDebug = {
        getReport: () => blockRendererDebug.getPerformanceReport(),
        getTypeStats: () => blockRendererDebug.getComponentTypeStats(),
        printReport: () => blockRendererDebug.printReport(),
        clear: () => blockRendererDebug.clearStats()
    };

    console.log('🔍 Block Renderer Debug disponível em: window.__blockRendererDebug');
}

export default blockRendererDebug;