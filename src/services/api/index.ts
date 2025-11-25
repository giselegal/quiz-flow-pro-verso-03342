/**
 * 🎯 API Services - Index
 * 
 * Ponto de entrada consolidado para todos os serviços de API.
 * Exporte todos os serviços daqui para importação simplificada.
 * 
 * Usage:
 * ```ts
 * import { funnelsApi, resultsApi, stepsApi, templatesApi } from '@/services/api';
 * ```
 * 
 * @see src/services/canonical - Serviços canônicos (TemplateService)
 */

// Templates API
export * from './templates/types';
export * from './templates/client';
export * from './templates/hooks';

// Steps API
export * from './steps/hooks';

// Funnels API
export * from './funnels';

// Results API
export * from './results';
