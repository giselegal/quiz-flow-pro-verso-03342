// Barrel neutro para acesso ao UnifiedStepRenderer somente no runtime quando necessário
// Encaminha via editor-bridge para evitar imports diretos de editor/* neste arquivo
export { UnifiedStepRenderer, type UnifiedStepRendererProps, registerProductionSteps } from '@/components/editor-bridge/unified';
