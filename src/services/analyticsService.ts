// Stub de compatibilidade: substituir/remover após migração total para unified analytics
// Reexporta o adapter existente garantindo que imports antigos ('@/services/analyticsService') funcionem.
export { analyticsServiceAdapter as analyticsService } from '@/analytics/compat/analyticsServiceAdapter';
export default {};
