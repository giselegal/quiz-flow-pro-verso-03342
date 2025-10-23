import { describe, it, expect } from 'vitest';
import { MonitoringService, monitoringService } from '../MonitoringService';
import type { ServiceResult } from '@/services/canonical/types';

describe('MonitoringService lightweight API', () => {
  function assertSuccess<T>(res: ServiceResult<T>): asserts res is { success: true; data: T } {
    expect(res.success).toBe(true);
  }

  it('should track metric via convenience method', () => {
    const svc = MonitoringService.getInstance();
    const res = svc.metric('cache.hit', 1, { store: 'default' });
    expect(res.success).toBe(true);

    const metrics = svc.getMetrics({ name: 'cache.hit' });
    assertSuccess(metrics);
    expect(metrics.data.length).toBeGreaterThan(0);
    const last = metrics.data[metrics.data.length - 1];
    expect(last.unit).toBe('count');
    expect(last.category).toBe('custom');
  });

  it('should track event and retrieve it', () => {
    const res = monitoringService.trackEvent('template.loaded', { id: 'tpl1' });
    expect(res.success).toBe(true);

    const events = monitoringService.getEvents({ name: 'template.loaded' });
    assertSuccess(events);
    expect(events.data.length).toBeGreaterThan(0);
    const last = events.data[events.data.length - 1];
    expect(last.name).toBe('template.loaded');
    expect(last.payload?.id).toBe('tpl1');
  });
});
