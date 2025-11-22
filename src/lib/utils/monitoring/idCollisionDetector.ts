import { appLogger } from '@/lib/utils/appLogger';
let generatedIds = new Set<string>();

export function trackIdGeneration(id: string, type: string) {
  if (generatedIds.has(id)) {
    const payload = { id, type };
    appLogger.error('ID collision detected!', { data: [payload] });
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(new Error('ID collision'), {
        extra: { ...payload, timestamp: Date.now() },
      });
    }
  }
  generatedIds.add(id);
  if (generatedIds.size > 100000) {
    const idsArray = Array.from(generatedIds);
    generatedIds = new Set(idsArray.slice(-50000));
  }
}
