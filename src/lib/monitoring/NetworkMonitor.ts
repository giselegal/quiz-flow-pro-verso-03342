/**
 * 🌐 FASE 3: Network Monitor
 * 
 * Monitora requests HTTP para detectar:
 * - 404s (steps não encontrados)
 * - Master file requests (quiz21-complete.json)
 * - Latência de requisições
 * - Prefetch activity
 */

import { appLogger } from '@/lib/utils/appLogger';

export interface NetworkStats {
    totalRequests: number;
    errors404: number;
    masterFileRequests: number;
    avgLatency: number;
    failedPaths: string[];
    lastUpdated: number;
}

class NetworkMonitor {
    private stats: NetworkStats = {
        totalRequests: 0,
        errors404: 0,
        masterFileRequests: 0,
        avgLatency: 0,
        failedPaths: [],
        lastUpdated: Date.now(),
    };

    private latencies: number[] = [];
    private originalFetch: typeof fetch;
    private isIntercepting = false;

    constructor() {
        // ✅ CRITICAL: Bind fetch to window to prevent "Illegal invocation"
        this.originalFetch = window.fetch.bind(window);
    }

    /**
     * 🎣 INTERCEPT - Intercepta fetch para monitorar requests
     */
    startIntercepting(): void {
        if (this.isIntercepting) return;

        const self = this;

        window.fetch = async function (...args: Parameters<typeof fetch>): Promise<Response> {
            const startTime = performance.now();
            const url = typeof args[0] === 'string' 
                ? args[0] 
                : args[0] instanceof Request 
                    ? args[0].url 
                    : args[0].toString();

            try {
                const response = await self.originalFetch.apply(this, args);
                const endTime = performance.now();
                const latency = endTime - startTime;

                // Atualizar estatísticas
                self.recordRequest(url, response.status, latency);

                return response;
            } catch (error) {
                // Request falhou (network error)
                const endTime = performance.now();
                const latency = endTime - startTime;

                self.recordRequest(url, 0, latency); // Status 0 = network error
                throw error;
            }
        };

        this.isIntercepting = true;
        appLogger.info('[NetworkMonitor] 🎣 Intercepting fetch started');
    }

    /**
     * 🛑 STOP - Para interceptação
     */
    stopIntercepting(): void {
        if (!this.isIntercepting) return;

        window.fetch = this.originalFetch;
        this.isIntercepting = false;
        appLogger.info('[NetworkMonitor] 🛑 Intercepting stopped');
    }

    /**
     * 📊 RECORD - Registra request
     */
    private recordRequest(url: string, status: number, latency: number): void {
        this.stats.totalRequests++;
        this.stats.lastUpdated = Date.now();

        // Latência
        this.latencies.push(latency);
        if (this.latencies.length > 100) {
            this.latencies.shift(); // Manter apenas últimos 100
        }
        this.stats.avgLatency = this.latencies.reduce((a, b) => a + b, 0) / this.latencies.length;

        // Master file request
        if (url.includes('quiz21-complete.json')) {
            this.stats.masterFileRequests++;
            appLogger.debug(`[NetworkMonitor] 📦 Master file request detected: ${status} (${latency.toFixed(0)}ms)`);
        }

        // 404 error
        if (status === 404) {
            this.stats.errors404++;
            this.stats.failedPaths.push(url);

            // Manter apenas últimos 50 paths
            if (this.stats.failedPaths.length > 50) {
                this.stats.failedPaths = this.stats.failedPaths.slice(-50);
            }

            appLogger.warn(`[NetworkMonitor] ❌ 404 detected: ${url}`);
        }
    }

    /**
     * 📈 GET STATS - Retorna estatísticas
     */
    getStats(): NetworkStats {
        return { ...this.stats };
    }

    /**
     * 🔄 RESET - Reseta estatísticas
     */
    reset(): void {
        this.stats = {
            totalRequests: 0,
            errors404: 0,
            masterFileRequests: 0,
            avgLatency: 0,
            failedPaths: [],
            lastUpdated: Date.now(),
        };
        this.latencies = [];
        appLogger.info('[NetworkMonitor] 🔄 Stats reset');
    }

    /**
     * 📊 GET SUMMARY - Resumo para debug
     */
    getSummary(): string {
        const { totalRequests, errors404, masterFileRequests, avgLatency } = this.stats;
        const error404Rate = totalRequests > 0 ? ((errors404 / totalRequests) * 100).toFixed(1) : '0.0';

        return [
            '🌐 Network Monitor Summary:',
            `├─ Total Requests: ${totalRequests}`,
            `├─ 404 Errors: ${errors404} (${error404Rate}%)`,
            `├─ Master File Requests: ${masterFileRequests}`,
            `└─ Avg Latency: ${avgLatency.toFixed(0)}ms`,
        ].join('\n');
    }

    /**
     * 🎯 GET FASE1 SCORE - Score da FASE 1 (path order fix)
     */
    getFase1Score(): { score: number; verdict: string } {
        const { errors404, masterFileRequests, totalRequests } = this.stats;

        // Critérios FASE 1:
        // - 404s devem ser < 5
        // - Master file deve ser usado (>0 requests)
        // - Taxa de erro < 5%

        let score = 100;

        if (errors404 > 5) {
            score -= Math.min(50, (errors404 - 5) * 5); // -5 pontos por 404 extra
        }

        if (masterFileRequests === 0) {
            score -= 30; // Master file não está sendo usado
        }

        const errorRate = totalRequests > 0 ? (errors404 / totalRequests) * 100 : 0;
        if (errorRate > 5) {
            score -= Math.min(20, (errorRate - 5) * 2);
        }

        let verdict = '';
        if (score >= 90) verdict = '✅ EXCELENTE - FASE 1 funcionando perfeitamente';
        else if (score >= 70) verdict = '⚠️ BOM - Pequenas melhorias possíveis';
        else if (score >= 50) verdict = '⚠️ ATENÇÃO - FASE 1 precisa de ajustes';
        else verdict = '❌ CRÍTICO - FASE 1 não está funcionando';

        return { score: Math.max(0, score), verdict };
    }
}

// Singleton instance
export const networkMonitor = new NetworkMonitor();

// Auto-start em development mode
if (typeof window !== 'undefined') {
    try {
        const env = (import.meta as any)?.env;
        if (env?.DEV || env?.MODE === 'development') {
            networkMonitor.startIntercepting();
        }
    } catch {
        // Ignore
    }
}
