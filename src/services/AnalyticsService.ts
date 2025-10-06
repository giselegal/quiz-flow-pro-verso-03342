/**
 * 📊 ANALYTICS SERVICE - Re-exports
 * 
 * Este arquivo re-exporta tudo do analyticsService.ts para resolver
 * problemas de case-sensitivity em diferentes sistemas operacionais.
 */

// Re-export everything from analyticsService
export {
    AnalyticsService,
    useAnalytics,
    type Metric,
    type AnalyticsEvent,
    type Alert,
    type AnalyticsMetrics,
    type ConversionFunnel
} from './AnalyticsService';