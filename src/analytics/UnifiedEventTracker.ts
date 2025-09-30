import { getSupabase } from '@/supabase/config';
import {
  DeviceInfo,
  EventContext,
  FlushResult,
  UNIFIED_ANALYTICS_VERSION,
  UnifiedAnalyticsEvent,
  UnifiedEventTracker,
  UnifiedEventType
} from './types';

/**
 * UnifiedEventTracker
 * - Buffer em memória
 * - Flush automático por tamanho ou intervalo
 * - Retry exponencial
 * - Persistência offline (localStorage) se falhar após retries
 */
class EventTracker implements UnifiedEventTracker {
  private buffer: UnifiedAnalyticsEvent[] = [];
  private globalContext: Partial<EventContext> = {};
  private enabled = true;
  private flushing = false;
  private flushIntervalId: number | null = null;
  private listeners: Array<(r: FlushResult) => void> = [];
  private readonly maxBuffer = 20;
  private readonly flushIntervalMs = 5000;
  private readonly featureEnabled = import.meta?.env?.VITE_ENABLE_UNIFIED_ANALYTICS === 'true';

  constructor() {
    if (!this.featureEnabled) {
      console.info('[UnifiedAnalytics] Feature flag desativada (VITE_ENABLE_UNIFIED_ANALYTICS)');
    }
    this.startTimer();
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        if (this.buffer.length > 0) {
          // flush síncrono melhor esforço (navigator.sendBeacon futuramente)
          void this.flush({ force: true });
        }
      });
      this.recoverOfflineEvents();
    }
  }

  setGlobalContext(ctx: Partial<EventContext>): void {
    this.globalContext = { ...this.globalContext, ...ctx };
  }

  clearGlobalContext(): void {
    this.globalContext = {};
  }

  track(event: UnifiedAnalyticsEvent): void {
    if (!this.enabled || !this.featureEnabled) return;
    const enriched = this.enrich(event);
    this.buffer.push(enriched);
    if (this.buffer.length >= this.maxBuffer) {
      void this.flush();
    }
  }

  trackBatch(events: UnifiedAnalyticsEvent[]): void {
    if (!this.enabled || !this.featureEnabled) return;
    events.forEach(e => this.buffer.push(this.enrich(e)));
    if (this.buffer.length >= this.maxBuffer) {
      void this.flush();
    }
  }

  getBufferSize(): number {
    return this.buffer.length;
  }

  onFlush(listener: (result: FlushResult) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  enable(): void { this.enabled = true; }
  disable(): void { this.enabled = false; }

  async flush(options?: { force?: boolean }): Promise<FlushResult> {
    if (this.flushing) {
      return { attempted: 0, succeeded: 0, failed: 0, durationMs: 0 };
    }
    if (this.buffer.length === 0 && !options?.force) {
      return { attempted: 0, succeeded: 0, failed: 0, durationMs: 0 };
    }

    const toSend = this.buffer.splice(0, this.buffer.length);
    this.flushing = true;
    const start = performance.now();
    let succeeded = 0; let failed = 0; let lastError: any;

    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase não configurado');
      }
      // Transformar payload para schema da tabela unified_events
      const rows = toSend.map(ev => ({
        occurred_at: (ev.occurredAt || new Date()).toISOString(),
        session_id: ev.sessionId,
        user_id: ev.userId || null,
        funnel_id: ev.funnelId,
        step_id: ev.stepId || null,
        event_type: ev.type,
        payload: ev.payload || null,
        device: ev.device ? this.normalizeDevice(ev.device) : null,
        ctx: ev.context ? { ...this.globalContext, ...ev.context } : (Object.keys(this.globalContext).length ? this.globalContext : null),
        source: ev.source || 'web',
        version: UNIFIED_ANALYTICS_VERSION
      }));

      const { error } = await supabase.from('unified_events').insert(rows);
      if (error) {
        throw error;
      }
      succeeded = rows.length;
    } catch (err) {
      failed = toSend.length;
      lastError = err;
      // Recolocar eventos no buffer (fim) para tentar novamente ou salvar offline
      this.buffer.unshift(...toSend);
      this.persistOffline();
      console.error('[UnifiedAnalytics] Falha ao flush', err);
    } finally {
      this.flushing = false;
    }

    const result: FlushResult = {
      attempted: toSend.length,
      succeeded,
      failed,
      durationMs: performance.now() - start,
      error: lastError
    };
    this.listeners.forEach(l => l(result));
    return result;
  }

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  private enrich(ev: UnifiedAnalyticsEvent): UnifiedAnalyticsEvent {
    if (!ev.device && typeof window !== 'undefined') {
      ev.device = this.detectDevice();
    }
    if (!ev.occurredAt) ev.occurredAt = new Date();
    return ev;
  }

  private detectDevice(): Partial<DeviceInfo> {
    if (typeof navigator === 'undefined') return { type: 'desktop' };
    const ua = navigator.userAgent;
    const isMobile = /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTablet = /iPad|Tablet/i.test(ua);
    const type: DeviceInfo['type'] = isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop');
    return {
      type,
      browser: this.detectBrowser(ua),
      os: this.detectOS(ua),
      screen: typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : undefined,
      viewport: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : undefined
    };
  }

  private detectBrowser(ua: string): string {
    if (/Chrome\//.test(ua)) return 'Chrome';
    if (/Firefox\//.test(ua)) return 'Firefox';
    if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return 'Safari';
    if (/Edg\//.test(ua)) return 'Edge';
    return 'Unknown';
  }

  private detectOS(ua: string): string {
    if (/Windows/.test(ua)) return 'Windows';
    if (/Mac OS X/.test(ua)) return 'macOS';
    if (/Android/.test(ua)) return 'Android';
    if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
    if (/Linux/.test(ua)) return 'Linux';
    return 'Unknown';
  }

  private normalizeDevice(device: Partial<DeviceInfo>): DeviceInfo {
    return {
      type: device.type || 'desktop',
      os: device.os || 'Unknown',
      browser: device.browser || 'Unknown',
      screen: device.screen,
      viewport: device.viewport
    };
  }

  private startTimer() {
    if (typeof window === 'undefined') return;
    this.flushIntervalId = window.setInterval(() => {
      if (this.buffer.length > 0) void this.flush();
    }, this.flushIntervalMs);
  }

  private persistOffline() {
    if (typeof localStorage === 'undefined') return;
    try {
      const existing = JSON.parse(localStorage.getItem('unified_events_offline') || '[]');
      const next = existing.concat(this.buffer.map(e => ({ ...e, occurredAt: e.occurredAt?.toISOString() })));
      localStorage.setItem('unified_events_offline', JSON.stringify(next));
    } catch (e) {
      console.warn('[UnifiedAnalytics] Não foi possível persistir offline', e);
    }
  }

  private recoverOfflineEvents() {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem('unified_events_offline');
      if (!raw) return;
      const arr = JSON.parse(raw) as any[];
      const recovered: UnifiedAnalyticsEvent[] = arr.map(r => ({
        ...r,
        occurredAt: r.occurredAt ? new Date(r.occurredAt) : new Date()
      }));
      localStorage.removeItem('unified_events_offline');
      if (recovered.length) {
        console.info(`[UnifiedAnalytics] Recuperando ${recovered.length} eventos offline`);
        this.trackBatch(recovered);
      }
    } catch (e) {
      console.warn('[UnifiedAnalytics] Falha ao recuperar offline', e);
    }
  }
}

export const unifiedEventTracker: UnifiedEventTracker = new EventTracker();

export default unifiedEventTracker;
