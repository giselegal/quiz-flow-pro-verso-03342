/**
 * 📊 ANALYTICS COMPONENTS - Index de Exportações
 *
 * Centraliza todas as exportações dos componentes de analytics.
 */

// Core Analytics Components
export { default as QuizAnalyticsDashboard } from './QuizAnalyticsDashboard';
export { default as AdvancedFunnel } from './AdvancedFunnel';
export { MetricCard } from './MetricCard';
export { LoadingState } from './LoadingState';
export { DashboardHeader } from './DashboardHeader';
export { default as EventLogger } from './EventLogger';
export { default as RealTimeAnalyticsEngine } from './RealTimeAnalyticsEngine';
export { AnalyticsDashboardOverlay } from './AnalyticsDashboardOverlay';
export { default as ABTestAlerts } from './ABTestAlerts';
export { default as ABTestComparison } from './ABTestComparison';

// Funnel Conversion Components
export {
  FunnelConversionTracker,
  useFunnelMetrics,
  recordFunnelComplete,
  type FunnelMetric,
  type FunnelConversionTrackerProps,
} from './FunnelConversionTracker';

export {
  FunnelVisualization,
  type FunnelStep,
  type FunnelVisualizationProps,
} from './FunnelVisualization';

// Tab Components
export * from './tabs';

// Integration Components
export * from './integrations';
