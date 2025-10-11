/**
 * 📊 DASHBOARD - Barrel Exports
 * 
 * Componentes de analytics e dashboards.
 */

// Main Dashboards
export { default as AnalyticsDashboard } from './AnalyticsDashboard';
export { default as RealTimeDashboard } from './RealTimeDashboard';
export { default as EnhancedRealTimeDashboard } from './EnhancedRealTimeDashboard';
export { default as PublicDashboard } from './PublicDashboard';

// Specialized Dashboards
export { default as FacebookMetricsDashboard } from './FacebookMetricsDashboard';
export { default as WhatsAppRecoveryDashboard } from './WhatsAppRecoveryDashboard';

// Components
export { default as QuizFunnelCard } from './QuizFunnelCard';
export { default as ParticipantsTable } from './ParticipantsTable';
export { default as ReportGenerator } from './ReportGenerator';
export { default as TemplateIcons } from './TemplateIcons';

// Sub-modules
export * from './core';
export * from './layouts';
